import { supabase } from '../config/supabase';
import { sendApprovalEmail } from './emailService';

/**
 * Admin Service
 * Handles all admin-related operations including user management, approvals, and analytics
 */

/**
 * Generate a unique assessment link for a user
 * @param {string} userId - User ID
 * @returns {string} Unique assessment link
 */
export const generateAssessmentLink = (userId) => {
  // Generate a unique token for the assessment
  const token = btoa(`${userId}-${Date.now()}-${Math.random().toString(36).substring(7)}`);
  const baseUrl = window.location.origin;
  return `${baseUrl}/assessment?token=${token}`;
};

/**
 * Get all users with optional filtering
 * @param {Object} filters - Filter options
 * @param {string} filters.status - Filter by status (pending_verification, pending_approval, approved, rejected)
 * @param {string} filters.searchTerm - Search by name, email, or business name
 * @returns {Promise<Object>} List of users
 */
export const getAllUsers = async (filters = {}) => {
  try {
    let query = supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply status filter
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    // Apply search filter
    if (filters.searchTerm) {
      const searchTerm = `%${filters.searchTerm}%`;
      query = query.or(`full_name.ilike.${searchTerm},email.ilike.${searchTerm},business_name.ilike.${searchTerm}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      users: data,
      count: data.length,
    };
  } catch (error) {
    console.error('Get users error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch users',
    };
  }
};

/**
 * Get pending users (awaiting approval)
 * @returns {Promise<Object>} List of pending users
 */
export const getPendingUsers = async () => {
  return await getAllUsers({ status: 'pending_approval' });
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User data
 */
export const getUserById = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    return {
      success: true,
      user: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch user',
    };
  }
};

/**
 * Approve a user and send assessment link
 * @param {string} userId - User ID to approve
 * @param {Object} options - Approval options
 * @param {string} options.adminNotes - Optional admin notes
 * @returns {Promise<Object>} Approval result
 */
export const approveUser = async (userId, options = {}) => {
  try {
    // Get user details first
    const userResult = await getUserById(userId);
    if (!userResult.success) {
      return userResult;
    }

    const user = userResult.user;

    // Check if user is verified
    if (!user.is_verified) {
      return {
        success: false,
        error: 'User must verify email before approval',
      };
    }

    // Check if already approved
    if (user.is_approved) {
      return {
        success: false,
        error: 'User is already approved',
      };
    }

    // Generate unique assessment link
    const assessmentLink = generateAssessmentLink(userId);

    // Update user status
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        is_approved: true,
        status: 'approved',
        approved_at: new Date().toISOString(),
        assessment_link: assessmentLink,
        admin_notes: options.adminNotes || null,
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        error: 'Failed to approve user',
      };
    }

    // Send approval email with assessment link
    const emailResult = await sendApprovalEmail(
      updatedUser.email,
      updatedUser.full_name,
      assessmentLink
    );

    // Log the approval action
    await logAdminAction({
      action: 'approve_user',
      userId: userId,
      details: {
        assessmentLink,
        emailSent: emailResult.success,
        adminNotes: options.adminNotes,
      },
    });

    return {
      success: true,
      user: updatedUser,
      assessmentLink,
      emailSent: emailResult.success,
      message: 'User approved successfully and assessment link sent',
    };
  } catch (error) {
    console.error('Approve user error:', error);
    return {
      success: false,
      error: error.message || 'Failed to approve user',
    };
  }
};

/**
 * Reject a user
 * @param {string} userId - User ID to reject
 * @param {Object} options - Rejection options
 * @param {string} options.reason - Reason for rejection
 * @param {string} options.adminNotes - Optional admin notes
 * @returns {Promise<Object>} Rejection result
 */
export const rejectUser = async (userId, options = {}) => {
  try {
    // Get user details first
    const userResult = await getUserById(userId);
    if (!userResult.success) {
      return userResult;
    }

    const user = userResult.user;

    // Update user status
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        is_approved: false,
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        rejection_reason: options.reason || 'Not specified',
        admin_notes: options.adminNotes || null,
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        error: 'Failed to reject user',
      };
    }

    // Log the rejection action
    await logAdminAction({
      action: 'reject_user',
      userId: userId,
      details: {
        reason: options.reason,
        adminNotes: options.adminNotes,
      },
    });

    return {
      success: true,
      user: updatedUser,
      message: 'User rejected successfully',
    };
  } catch (error) {
    console.error('Reject user error:', error);
    return {
      success: false,
      error: error.message || 'Failed to reject user',
    };
  }
};

/**
 * Get dashboard analytics
 * @returns {Promise<Object>} Analytics data
 */
export const getDashboardAnalytics = async () => {
  try {
    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get pending approvals
    const { count: pendingApprovals } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending_approval');

    // Get approved users
    const { count: approvedUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    // Get rejected users
    const { count: rejectedUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected');

    // Get pending verification
    const { count: pendingVerification } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending_verification');

    // Get completed assessments
    const { count: completedAssessments } = await supabase
      .from('assessments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: recentRegistrations } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo);

    return {
      success: true,
      analytics: {
        totalUsers: totalUsers || 0,
        pendingApprovals: pendingApprovals || 0,
        approvedUsers: approvedUsers || 0,
        rejectedUsers: rejectedUsers || 0,
        pendingVerification: pendingVerification || 0,
        completedAssessments: completedAssessments || 0,
        recentRegistrations: recentRegistrations || 0,
      },
    };
  } catch (error) {
    console.error('Get analytics error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch analytics',
    };
  }
};

/**
 * Log admin action
 * @param {Object} actionData - Action details
 * @param {string} actionData.action - Action type
 * @param {string} actionData.userId - User ID affected
 * @param {Object} actionData.details - Additional details
 * @returns {Promise<Object>} Log result
 */
export const logAdminAction = async (actionData) => {
  try {
    const { error } = await supabase
      .from('system_logs')
      .insert([{
        action: actionData.action,
        user_id: actionData.userId,
        details: actionData.details,
        created_at: new Date().toISOString(),
      }]);

    if (error) {
      console.error('Error logging admin action:', error);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error('Log action error:', error);
    return { success: false };
  }
};

/**
 * Bulk approve users
 * @param {Array<string>} userIds - Array of user IDs to approve
 * @returns {Promise<Object>} Bulk approval result
 */
export const bulkApproveUsers = async (userIds) => {
  try {
    const results = {
      successful: [],
      failed: [],
    };

    for (const userId of userIds) {
      const result = await approveUser(userId);
      if (result.success) {
        results.successful.push(userId);
      } else {
        results.failed.push({ userId, error: result.error });
      }
    }

    return {
      success: true,
      results,
      message: `Approved ${results.successful.length} out of ${userIds.length} users`,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Bulk approval failed',
    };
  }
};

/**
 * Search users
 * @param {string} searchTerm - Search term
 * @returns {Promise<Object>} Search results
 */
export const searchUsers = async (searchTerm) => {
  return await getAllUsers({ searchTerm });
};

