import os
from supabase import create_client, Client
from dotenv import load_dotenv

def test_connection():
    """Test the Supabase connection and credentials."""
    try:
        # Load environment variables
        load_dotenv()
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        print(f"Testing connection to Supabase...")
        print(f"URL: {supabase_url}")
        print(f"Key length: {len(supabase_key) if supabase_key else 0}")
        
        if not supabase_url or not supabase_key:
            print("❌ Error: Missing credentials in .env file")
            return False
            
        # Create Supabase client with correct initialization for v1.2.0
        supabase: Client = create_client(
            supabase_url=supabase_url,
            supabase_key=supabase_key
        )
        
        # Try to fetch a single business
        response = supabase.table('high_volume_businesses').select('*').limit(1).execute()
        
        if response.data:
            print("✅ Successfully connected to Supabase!")
            print(f"Found {len(response.data)} businesses")
            print("\nSample business data:")
            print(response.data[0])
            return True
        else:
            print("⚠️ Connected but no data found")
            return True
            
    except Exception as e:
        print(f"❌ Error connecting to Supabase: {str(e)}")
        return False

if __name__ == "__main__":
    test_connection() 