import sys
import os
import fitz  # PyMuPDF
from google import genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

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
    # Using the modern model your friend recommended!
    model_id = "gemini-2.5-flash"
    
    if mode == "interview":
        prompt = f"Based on this resume: {text} and JD: {jd}, generate 5 tough technical interview questions targeting their specific skills."
    else:
        prompt = f"""Analyze this resume: {text} against this JD: {jd}. 
        Provide the response in the following JSON format:
        {{
            "match_score": "a number out of 100",
            "skill_scan": "list of missing hard skills",
            "tips": "3 actionable tips for improvement"
        }}
        Do not include any other text, just the JSON."""

    try:
        # Implementing the new unified GenAI Client syntax
        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        response = client.models.generate_content(
            model=model_id,
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f'{{"error": "AI Error: {e}"}}'

if __name__ == "__main__":
    # Handle inputs from Node.js bridge
    file_path = sys.argv[1] if len(sys.argv) > 1 else "resume.pdf"
    job_desc = sys.argv[2] if len(sys.argv) > 2 else "Software Engineer"
    mode = sys.argv[3] if len(sys.argv) > 3 else "analyze"

    resume_text = extract_text_from_pdf(file_path)

    # Print the result so Node.js can capture it
    print(run_ai(resume_text, job_desc, mode))