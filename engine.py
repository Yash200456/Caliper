import os
import sys
import fitz  # PyMuPDF
from dotenv import load_dotenv
from google import genai

# Load API key from .env
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("Error: GEMINI_API_KEY is missing in .env file.")
    sys.exit(1)

# Setup the Client
client = genai.Client(api_key=API_KEY)

def extract_text_from_pdf(pdf_path):
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        return f"Error reading PDF: {e}"

def run_ai(text, jd, mode):
    # Fixed model name to the fast, free-tier friendly version
    model_id = "gemini-2.0-flash-lite" 
    
    if mode == "interview":
        prompt = f"Based on this resume: {text} and JD: {jd}, generate 5 tough technical interview questions targeting the candidate's skill gaps."
    else:
        prompt = f"Analyze this resume: {text} against this JD: {jd}. Provide a match score out of 100, and 3 specific skill gaps."

    try:
        response = client.models.generate_content(
            model=model_id, 
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"AI Error: {e}"

if __name__ == "__main__":
    # Handle inputs from Node.js bridge
    file_path = sys.argv[1] if len(sys.argv) > 1 else "resume.pdf"
    job_desc = sys.argv[2] if len(sys.argv) > 2 else "Software Engineer"
    mode = sys.argv[3] if len(sys.argv) > 3 else "analyze"

    resume_text = extract_text_from_pdf(file_path)
    
    # Print the result so Node.js can capture it
    print(run_ai(resume_text, job_desc, mode))