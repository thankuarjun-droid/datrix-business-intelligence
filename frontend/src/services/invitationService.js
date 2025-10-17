import { supabase } from '../config/supabase';

/**
 * Invitation Service
 * Handles all operations related to assessment invitations
 */

/**
 * Generate a new assessment invitation
 * @param {Object} invitationData - Client and invitation details
 * @returns {Promise<Object>} Created invitation with token
 */
export const createInvitation = async (invitationData) => {
  try {
    // Generate a unique token
    const { data: tokenData, error: tokenError } = await supabase
      .rpc('generate_assessment_token');

    if (tokenError) {
      console.error('Error generating token:', tokenError);
      throw new Error('Failed to generate assessment token');
    }

    const token = tokenData;

    // Create the invitation record
    const { data, error } = await supabase
      .from('assessment_invitations')
      .insert([
        {
          token,
          client_name: invitationData.client_name,
          client_email: invitationData.client_email,
          client_mobile: invitationData.client_mobile || null,
          company_name: invitationData.company_name,
          company_type: invitationData.company_type || null,
          designation: invitationData.designation || null,
          created_by: invitationData.created_by || 'Admin',
          notes: invitationData.notes || null,
          expires_at: invitationData.expires_at || null,
          payment_amount: invitationData.payment_amount || null
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating invitation:', error);
      throw new Error('Failed to create assessment invitation');
    }

    return {
      success: true,
      invitation: data,
      assessmentLink: `${window.location.origin}/assess/${token}`
    };
  } catch (error) {
    console.error('Error in createInvitation:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get all invitations with optional filtering
 * @param {Object} filters - Optional filters (status, search, etc.)
 * @returns {Promise<Array>} List of invitations
 */
export const getInvitations = async (filters = {}) => {
  try {
    let query = supabase
      .from('assessment_invitations')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    // Apply search filter
    if (filters.search) {
      query = query.or(
        `client_name.ilike.%${filters.search}%,` +
        `client_email.ilike.%${filters.search}%,` +
        `company_name.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching invitations:', error);
      throw new Error('Failed to fetch invitations');
    }

    return {
      success: true,
      invitations: data
    };
  } catch (error) {
    console.error('Error in getInvitations:', error);
    return {
      success: false,
      error: error.message,
      invitations: []
    };
  }
};

/**
 * Validate an assessment token
 * @param {string} token - The assessment token
 * @returns {Promise<Object>} Validation result with invitation details
 */
export const validateToken = async (token) => {
  try {
    const { data, error } = await supabase
      .rpc('validate_assessment_token', { token_value: token });

    if (error) {
      console.error('Error validating token:', error);
      throw new Error('Failed to validate token');
    }

    // The function returns an array with one row
    const result = data && data.length > 0 ? data[0] : null;

    if (!result || !result.is_valid) {
      return {
        success: false,
        valid: false,
        message: 'Invalid or expired assessment link'
      };
    }

    return {
      success: true,
      valid: true,
      invitation: {
        id: result.invitation_id,
        client_name: result.client_name,
        client_email: result.client_email,
        company_name: result.company_name,
        status: result.status,
        expires_at: result.expires_at
      }
    };
  } catch (error) {
    console.error('Error in validateToken:', error);
    return {
      success: false,
      valid: false,
      error: error.message
    };
  }
};

/**
 * Mark a token as accessed (in_progress)
 * @param {string} token - The assessment token
 * @returns {Promise<Object>} Update result
 */
export const markTokenAccessed = async (token) => {
  try {
    const { data, error } = await supabase
      .rpc('mark_token_accessed', { token_value: token });

    if (error) {
      console.error('Error marking token as accessed:', error);
      throw new Error('Failed to update token status');
    }

    return {
      success: true,
      updated: data
    };
  } catch (error) {
    console.error('Error in markTokenAccessed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Mark a token as completed
 * @param {string} token - The assessment token
 * @param {string} userId - The user ID who completed the assessment
 * @returns {Promise<Object>} Update result
 */
export const markTokenCompleted = async (token, userId) => {
  try {
    const { data, error } = await supabase
      .rpc('mark_token_completed', { 
        token_value: token,
        user_uuid: userId 
      });

    if (error) {
      console.error('Error marking token as completed:', error);
      throw new Error('Failed to update token status');
    }

    return {
      success: true,
      updated: data
    };
  } catch (error) {
    console.error('Error in markTokenCompleted:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Update invitation details
 * @param {string} invitationId - The invitation ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Update result
 */
export const updateInvitation = async (invitationId, updates) => {
  try {
    const { data, error } = await supabase
      .from('assessment_invitations')
      .update(updates)
      .eq('id', invitationId)
      .select()
      .single();

    if (error) {
      console.error('Error updating invitation:', error);
      throw new Error('Failed to update invitation');
    }

    return {
      success: true,
      invitation: data
    };
  } catch (error) {
    console.error('Error in updateInvitation:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Delete an invitation
 * @param {string} invitationId - The invitation ID
 * @returns {Promise<Object>} Delete result
 */
export const deleteInvitation = async (invitationId) => {
  try {
    const { error } = await supabase
      .from('assessment_invitations')
      .delete()
      .eq('id', invitationId);

    if (error) {
      console.error('Error deleting invitation:', error);
      throw new Error('Failed to delete invitation');
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Error in deleteInvitation:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get invitation statistics
 * @returns {Promise<Object>} Statistics object
 */
export const getInvitationStats = async () => {
  try {
    const { data, error } = await supabase
      .from('assessment_invitations')
      .select('status');

    if (error) {
      console.error('Error fetching stats:', error);
      throw new Error('Failed to fetch statistics');
    }

    const stats = {
      total: data.length,
      pending: data.filter(inv => inv.status === 'pending').length,
      in_progress: data.filter(inv => inv.status === 'in_progress').length,
      completed: data.filter(inv => inv.status === 'completed').length,
      expired: data.filter(inv => inv.status === 'expired').length
    };

    return {
      success: true,
      stats
    };
  } catch (error) {
    console.error('Error in getInvitationStats:', error);
    return {
      success: false,
      error: error.message,
      stats: { total: 0, pending: 0, in_progress: 0, completed: 0, expired: 0 }
    };
  }
};

/**
 * Resend invitation (generate new token for same client)
 * @param {string} invitationId - The original invitation ID
 * @returns {Promise<Object>} New invitation with token
 */
export const resendInvitation = async (invitationId) => {
  try {
    // Get original invitation
    const { data: original, error: fetchError } = await supabase
      .from('assessment_invitations')
      .select('*')
      .eq('id', invitationId)
      .single();

    if (fetchError) {
      console.error('Error fetching original invitation:', fetchError);
      throw new Error('Failed to fetch original invitation');
    }

    // Mark original as expired
    await supabase
      .from('assessment_invitations')
      .update({ status: 'expired' })
      .eq('id', invitationId);

    // Create new invitation with same details
    return await createInvitation({
      client_name: original.client_name,
      client_email: original.client_email,
      client_mobile: original.client_mobile,
      company_name: original.company_name,
      company_type: original.company_type,
      designation: original.designation,
      created_by: original.created_by,
      notes: `Resent invitation (Original ID: ${invitationId})`,
      payment_amount: original.payment_amount
    });
  } catch (error) {
    console.error('Error in resendInvitation:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

