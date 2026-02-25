import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

# Notice the capital 'C' here!
client = genai.Client(api_key=API_KEY)

print("🔍 Asking Google for available models...")

try:
    # Simpler loop that just prints the name
    for model in client.models.list():
        print(f"✅ Found: {model.name}")
except Exception as e:
    print(f"Error: {e}")