
from supabase import create_client, Client
import os

# Use environment variables instead of hardcoded values
SUPABASE_URL = os.environ.get("SUPABASE_URL", "YOUR_SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "YOUR_SUPABASE_KEY")

def get_supabase_client() -> Client:
    """Return a Supabase client instance.
    
    Returns:
        Client: A configured Supabase client
    """
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Initialize client only when needed, not on module import
supabase: Client = None
