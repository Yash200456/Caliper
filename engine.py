import os
import fitz  # PyMuPDF
from dotenv import load_dotenv
from google import genai

# 1. Load your hidden API key from the .env file
load_dotenv()
API_KEY = os.getenv("AIzaSyDqVF8FKSl1hQpots646jS2Pc0nHHjsB0I")

# 2. Setup the modern 2026 Client
client = genai.Client(api_key=API_KEY)

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

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
    
    # Using the current flagship 2026 model
    response = client.models.generate_content(
        model="gemini-3.1-pro", 
        contents=prompt
    )
    return response.text

if __name__ == "__main__":
    resume_filename = "resume.pdf.pdf" 
    test_jd = "Looking for a MERN Stack Developer with experience in Python and React."

    try:
        print(f"Reading {resume_filename}...")
        text = extract_text_from_pdf(resume_filename)
        
        print("Analyzing with Gemini 3.1 Pro...")
        result = analyze_resume(text, test_jd)
        
        print("\n" + "="*40)
        print("CAREERORBIT AI: RECRUITER REPORT")
        print("="*40)
        print(result)
        
    except Exception as e:
        print(f"Error: {e}")