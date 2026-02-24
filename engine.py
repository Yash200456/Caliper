import os
import sys  # Handles inputs from the Node.js bridge
import fitz  # PyMuPDF
from dotenv import load_dotenv
from google import genai

# 1. Load hidden API key from .env
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

# 2. Setup the Gemini 3.1 Pro Client
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

def analyze_resume(resume_text, job_description):
    prompt = f"""
    Act as an expert technical recruiter. 
    Compare the Resume below with the Job Description.
    1. Give a Match Score (0-100%).
    2. List 3 specific 'Skill Gaps' the candidate has.
    3. Suggest one project they should add to improve.

    Resume: {resume_text}
    Job Description: {job_description}
    """
    
    # Use the current 2026 flagship model
    response = client.models.generate_content(
        model="gemini-3.1-pro", 
        contents=prompt
    )
    return response.text

if __name__ == "__main__":
    # --- DYNAMIC INPUT HANDLING ---
    # sys.argv[1] will be the filename sent by your Node.js server
    resume_filename = sys.argv[1] if len(sys.argv) > 1 else "resume.pdf.pdf"
    
    # sys.argv[2] will be the job description sent by the user on your website
    test_jd = sys.argv[2] if len(sys.argv) > 2 else "MERN Stack Developer with Python experience"

    try:
        # Step 1: Extract
        text = extract_text_from_pdf(resume_filename)
        
        # Step 2: Analyze
        # We only print the result so Node.js can capture it as a clean string
        result = analyze_resume(text, test_jd)
        print(result)
        
    except Exception as e:
        # Print error so it shows up in your Node.js logs
        print(f"Error: {e}")