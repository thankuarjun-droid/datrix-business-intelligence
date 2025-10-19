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
    console.log('=== VERIFICATION DEBUG START ===');
    console.log('Input email:', email);
    console.log('Input code:', code);
    console.log('Input code type:', typeof code);
    console.log('Input code length:', code ? code.length : 0);

    // Normalize email (trim and lowercase)
    const normalizedEmail = String(email || '').trim().toLowerCase();
    console.log('Normalized email:', normalizedEmail);

    if (!normalizedEmail) {
      console.error('Email is empty after normalization');
      return {
        success: false,
        error: 'Email is required for verification',
      };
    }

    // Find user by email
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .single();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return {
        success: false,
        error: `User lookup failed: ${fetchError.message}`,
      };
    }

    if (!user) {
      console.error('User not found for email:', email);
      return {
        success: false,
        error: 'User not found',
      };
    }

    console.log('User found:', user.email);
    console.log('User verification_code:', user.verification_code);
    console.log('User verification_code type:', typeof user.verification_code);
    console.log('User verification_code length:', user.verification_code ? user.verification_code.length : 0);
    console.log('User is_verified:', user.is_verified);
    console.log('User verification_code_expiry:', user.verification_code_expiry);

    // Check if already verified
    if (user.is_verified) {
      console.log('User already verified');
      return {
        success: false,
        error: 'User already verified',
      };
    }

    // Check if verification code exists
    if (!user.verification_code) {
      console.error('No verification code found for user');
      return {
        success: false,
        error: 'No verification code found. Please request a new code.',
      };
    }

    // Normalize codes for comparison (trim whitespace and ensure string type)
    const userCode = String(user.verification_code || '').trim();
    const inputCode = String(code || '').trim();

    console.log('Normalized user code:', userCode);
    console.log('Normalized input code:', inputCode);
    console.log('Codes match:', userCode === inputCode);

    // Check if code matches
    if (userCode !== inputCode) {
      console.error('Code mismatch!');
      console.error('Expected:', userCode);
      console.error('Received:', inputCode);
      return {
        success: false,
        error: 'Invalid verification code',
      };
    }

    // Check if verification_code_expiry exists
    if (!user.verification_code_expiry) {
      console.error('No expiry time set for verification code');
      return {
        success: false,
        error: 'Verification code expiry not set. Please contact support.',
      };
    }

    // Check if code expired
    const expiryTime = new Date(user.verification_code_expiry);
    const now = new Date();
    console.log('Expiry time:', expiryTime);
    console.log('Current time:', now);
    console.log('Is expired:', expiryTime < now);

    if (expiryTime < now) {
      console.error('Verification code expired');
      return {
        success: false,
        error: 'Verification code expired. Please request a new code.',
      };
    }

    console.log('All checks passed, updating user...');

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
      console.error('Update error:', updateError);
      return {
        success: false,
        error: `Failed to verify user: ${updateError.message}`,
      };
    }

    console.log('User verified successfully!');
    console.log('=== VERIFICATION DEBUG END ===');

    return {
      success: true,
      user: updatedUser,
      message: 'Email verified successfully! Your account is pending admin approval.',
    };
  } catch (error) {
    console.error('Verification exception:', error);
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

