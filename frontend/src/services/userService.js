import { supabase } from '../config/supabase';

/**
 * User Service
 * Handles all user-related operations including registration, verification, and profile management
 */

/**
 * Generate a random 6-digit verification code
 * @returns {string} 6-digit verification code
 */
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.fullName - User's full name
 * @param {string} userData.designation - User's designation
 * @param {string} userData.email - User's email address
 * @param {string} userData.mobile - User's mobile number
 * @param {string} userData.businessName - Business name
 * @param {string} userData.businessType - Type of business
 * @returns {Promise<Object>} Registration result with user ID and verification code
 */
export const registerUser = async (userData) => {
  try {
    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // Prepare user data for database
    const userRecord = {
      full_name: userData.fullName,
      designation: userData.designation,
      email: userData.email.toLowerCase(),
      mobile: userData.mobile,
      business_name: userData.businessName,
      business_type: userData.businessType || 'Garment Manufacturing',
      verification_code: verificationCode,
      verification_code_expiry: verificationExpiry.toISOString(),
      is_verified: false,
      is_approved: false,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    // Insert user into database
    const { data, error } = await supabase
      .from('users')
      .insert([userRecord])
      .select()
      .single();

    if (error) {
      console.error('Error registering user:', error);
      throw new Error(error.message || 'Failed to register user');
    }

    return {
      success: true,
      userId: data.id,
      verificationCode: verificationCode,
      email: data.email,
      mobile: data.mobile,
      message: 'User registered successfully. Verification code sent.',
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error.message || 'Registration failed',
    };
  }
};

/**
 * Verify user with verification code
 * @param {string} email - User's email address
 * @param {string} code - Verification code
 * @returns {Promise<Object>} Verification result
 */
export const verifyUser = async (email, code) => {
  try {
    // Find user by email
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (fetchError || !user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Check if already verified
    if (user.is_verified) {
      return {
        success: false,
        error: 'User already verified',
      };
    }

    // Check if code matches
    if (user.verification_code !== code) {
      return {
        success: false,
        error: 'Invalid verification code',
      };
    }

    // Check if code expired
    const expiryTime = new Date(user.verification_code_expiry);
    if (expiryTime < new Date()) {
      return {
        success: false,
        error: 'Verification code expired. Please request a new code.',
      };
    }

    // Update user as verified
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        is_verified: true,
        status: 'verified',
        verified_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        error: 'Failed to verify user',
      };
    }

    return {
      success: true,
      user: updatedUser,
      message: 'Email verified successfully! Your account is pending admin approval.',
    };
  } catch (error) {
    console.error('Verification error:', error);
    return {
      success: false,
      error: error.message || 'Verification failed',
    };
  }
};

/**
 * Resend verification code
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Result with new verification code
 */
export const resendVerificationCode = async (email) => {
  try {
    // Find user by email
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (fetchError || !user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Check if already verified
    if (user.is_verified) {
      return {
        success: false,
        error: 'User already verified',
      };
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationExpiry = new Date(Date.now() + 15 * 60 * 1000);

    // Update user with new code
    const { error: updateError } = await supabase
      .from('users')
      .update({
        verification_code: verificationCode,
        verification_code_expiry: verificationExpiry.toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      return {
        success: false,
        error: 'Failed to resend verification code',
      };
    }

    return {
      success: true,
      verificationCode: verificationCode,
      email: user.email,
      mobile: user.mobile,
      message: 'Verification code resent successfully',
    };
  } catch (error) {
    console.error('Resend code error:', error);
    return {
      success: false,
      error: error.message || 'Failed to resend code',
    };
  }
};

/**
 * Get user by email
 * @param {string} email - User's email address
 * @returns {Promise<Object>} User data
 */
export const getUserByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
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

