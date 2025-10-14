"""
Datrix™ Business Intelligence Scanner
Supabase Client using HTTP Requests (No external dependencies)
"""

import os
import json
import urllib.request
import urllib.error
from typing import Dict, List, Optional, Any

class SupabaseClient:
    """Simple Supabase client using HTTP requests"""
    
    def __init__(self, url: str, key: str, service_key: str = None):
        self.url = url.rstrip('/')
        self.key = key
        self.service_key = service_key or key
        self.rest_url = f"{self.url}/rest/v1"
        
    def _make_request(self, method: str, endpoint: str, data: Dict = None, 
                     use_service_key: bool = False, params: Dict = None) -> Dict:
        """Make HTTP request to Supabase"""
        url = f"{self.rest_url}/{endpoint}"
        
        # Add query parameters
        if params:
            query_string = '&'.join([f"{k}={v}" for k, v in params.items()])
            url = f"{url}?{query_string}"
        
        headers = {
            'apikey': self.service_key if use_service_key else self.key,
            'Authorization': f'Bearer {self.service_key if use_service_key else self.key}',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
        
        request_data = json.dumps(data).encode('utf-8') if data else None
        
        try:
            req = urllib.request.Request(url, data=request_data, headers=headers, method=method)
            with urllib.request.urlopen(req) as response:
                response_data = response.read().decode('utf-8')
                return json.loads(response_data) if response_data else {}
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            print(f"Supabase error: {e.code} - {error_body}")
            return {'error': error_body, 'status': e.code}
        except Exception as e:
            print(f"Request error: {str(e)}")
            return {'error': str(e)}
    
    def select(self, table: str, columns: str = '*', filters: Dict = None, 
              use_service_key: bool = False) -> List[Dict]:
        """Select data from table"""
        params = {'select': columns}
        
        if filters:
            for key, value in filters.items():
                params[key] = f"eq.{value}"
        
        result = self._make_request('GET', table, params=params, use_service_key=use_service_key)
        return result if isinstance(result, list) else []
    
    def insert(self, table: str, data: Dict, use_service_key: bool = False) -> Dict:
        """Insert data into table"""
        result = self._make_request('POST', table, data=data, use_service_key=use_service_key)
        return result[0] if isinstance(result, list) and len(result) > 0 else result
    
    def update(self, table: str, data: Dict, filters: Dict, use_service_key: bool = False) -> Dict:
        """Update data in table"""
        params = {}
        for key, value in filters.items():
            params[key] = f"eq.{value}"
        
        result = self._make_request('PATCH', table, data=data, params=params, use_service_key=use_service_key)
        return result[0] if isinstance(result, list) and len(result) > 0 else result
    
    def delete(self, table: str, filters: Dict, use_service_key: bool = False) -> Dict:
        """Delete data from table"""
        params = {}
        for key, value in filters.items():
            params[key] = f"eq.{value}"
        
        return self._make_request('DELETE', table, params=params, use_service_key=use_service_key)
    
    def count(self, table: str, filters: Dict = None, use_service_key: bool = False) -> int:
        """Count rows in table"""
        params = {'select': 'id', 'count': 'exact'}
        
        if filters:
            for key, value in filters.items():
                params[key] = f"eq.{value}"
        
        result = self._make_request('GET', table, params=params, use_service_key=use_service_key)
        return len(result) if isinstance(result, list) else 0


# Initialize global client
_supabase_client = None

def get_supabase_client() -> Optional[SupabaseClient]:
    """Get or create Supabase client"""
    global _supabase_client
    
    if _supabase_client is None:
        # Try environment variables first
        url = os.getenv('SUPABASE_URL')
        key = os.getenv('SUPABASE_KEY')
        service_key = os.getenv('SUPABASE_SERVICE_KEY')
        
        # Fallback to hardcoded credentials for deployment
        if not url or not key:
            url = 'https://vboauggpscnkgsqwfccg.supabase.co'
            key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZib2F1Z2dwc2Nua2dzcXdmY2NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMzQ4MzAsImV4cCI6MjA3NTkxMDgzMH0.HagbaNRnqpRR3OiZF6KIZ8ZJTGk7oE6oF8_xYweBUSk'
            service_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZib2F1Z2dwc2Nua2dzcXdmY2NnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMzNDgzMCwiZXhwIjoyMDc1OTEwODMwfQ.1FDyPCK6hRdy8I_YAbpamkYWJa7q4-AWi5vyeiZQREM'
            print("Using hardcoded Supabase credentials")
        
        if url and key:
            _supabase_client = SupabaseClient(url, key, service_key)
            print("✓ Supabase client initialized successfully")
        else:
            print("Warning: Supabase credentials not configured")
    
    return _supabase_client

