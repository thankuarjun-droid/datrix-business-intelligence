"""
Datrix™ Business Intelligence Scanner
Supabase Database Configuration
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv('SUPABASE_URL', '')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', '')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY', '')

# Initialize Supabase client
supabase: Client = None

def init_supabase():
    """Initialize Supabase client"""
    global supabase
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Warning: Supabase credentials not configured. Using mock mode.")
        return None
    
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✓ Supabase client initialized successfully")
        return supabase
    except Exception as e:
        print(f"Error initializing Supabase: {str(e)}")
        return None

def get_supabase_client() -> Client:
    """Get Supabase client instance"""
    global supabase
    if supabase is None:
        supabase = init_supabase()
    return supabase

def get_service_client() -> Client:
    """Get Supabase service role client for admin operations"""
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("Warning: Supabase service credentials not configured.")
        return None
    
    try:
        return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    except Exception as e:
        print(f"Error creating service client: {str(e)}")
        return None

