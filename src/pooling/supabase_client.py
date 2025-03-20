from supabase import create_client, Client

SUPABASE_URL = "https://fyuoxmavabpjqaxmpdaf.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5dW94bWF2YWJwanFheG1wZGFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NzI0NzUsImV4cCI6MjA1NzA0ODQ3NX0.A5AUdeyW4hGSMUTWlGE2cME12_Zag8gYjPvTdNgyK-A"  # Use a secure key for backend access!

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
