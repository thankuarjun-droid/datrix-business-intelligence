import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vboauggpscnkgsqwfccg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to fetch assessment questions
export const fetchAssessmentQuestions = async () => {
  try {
    const { data, error } = await supabase
      .from('assessment_questions')
      .select(`
        *,
        assessment_categories (
          id,
          name,
          description
        )
      `)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching assessment questions:', error);
    throw error;
  }
};

// Helper function to fetch assessment categories
export const fetchAssessmentCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('assessment_categories')
      .select('*')
      .order('name', { ascending: true});

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching assessment categories:', error);
    throw error;
  }
};

// Helper function to submit assessment
export const submitAssessment = async (userId, responses) => {
  try {
    // First, create the assessment record
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .insert({
        user_id: userId,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (assessmentError) throw assessmentError;

    // Then, insert all responses
    const responseRecords = responses.map(response => ({
      assessment_id: assessment.id,
      question_id: response.question_id,
      response_value: response.response_value
    }));

    const { error: responsesError } = await supabase
      .from('assessment_responses')
      .insert(responseRecords);

    if (responsesError) throw responsesError;

    return assessment;
  } catch (error) {
    console.error('Error submitting assessment:', error);
    throw error;
  }
};

