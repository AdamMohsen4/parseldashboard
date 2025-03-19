
from supabase import create_client, Client
import os
import time
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("supabase_client")

# Get Supabase credentials from environment variables or use defaults for development
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://fyuoxmavabpjqaxmpdaf.supabase.co")
SUPABASE_SERVICE_KEY = os.environ.get(
    "SUPABASE_SERVICE_KEY", 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5dW94bWF2YWJwanFheG1wZGFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NzI0NzUsImV4cCI6MjA1NzA0ODQ3NX0.A5AUdeyW4hGSMUTWlGE2cME12_Zag8gYjPvTdNgyK-A"
)

# Create the Supabase client with retry capability
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds

def create_supabase_client_with_retry():
    """Create Supabase client with retry logic for reliability."""
    retries = 0
    last_error = None
    
    while retries < MAX_RETRIES:
        try:
            client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
            # Test connection with a simple query
            client.table("booking").select("count", count="exact").limit(1).execute()
            logger.info("Successfully connected to Supabase")
            return client
        except Exception as e:
            retries += 1
            last_error = e
            logger.warning(f"Connection attempt {retries} failed: {str(e)}")
            if retries < MAX_RETRIES:
                time.sleep(RETRY_DELAY * retries)  # Exponential backoff
    
    logger.error(f"Failed to connect to Supabase after {MAX_RETRIES} attempts: {last_error}")
    # Return a placeholder client that will be retried on actual operations
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Initialize the client
supabase: Client = create_supabase_client_with_retry()

def execute_with_retry(operation_func, max_retries=MAX_RETRIES):
    """Execute a Supabase operation with retry logic."""
    retries = 0
    last_error = None
    
    while retries < max_retries:
        try:
            return operation_func()
        except Exception as e:
            retries += 1
            last_error = e
            logger.warning(f"Operation failed (attempt {retries}): {str(e)}")
            if retries < max_retries:
                time.sleep(RETRY_DELAY * retries)
    
    logger.error(f"Operation failed after {max_retries} attempts: {last_error}")
    raise last_error

# Export a more reliable version of common operations
def fetch_data(table, query_func=None):
    """Fetch data from a table with retry logic."""
    def operation():
        query = supabase.table(table)
        if query_func:
            query = query_func(query)
        return query.execute()
    
    return execute_with_retry(operation)

def insert_data(table, data):
    """Insert data into a table with retry logic."""
    return execute_with_retry(lambda: supabase.table(table).insert(data).execute())

def update_data(table, data, match_column, match_value):
    """Update data in a table with retry logic."""
    return execute_with_retry(lambda: supabase.table(table).update(data).eq(match_column, match_value).execute())
