import sys
import os
import fitz  # PyMuPDF
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure the Gemini API key
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

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
    # Fixed model name with exact hyphen formatting
    model_id = "gemini-pro"
    
    if mode == "interview":
        prompt = f"Based on this resume: {text} and JD: {jd}, generate 5 tough technical interview questions targeting their specific skills."
    else:
        prompt = f"Analyze this resume: {text} against this JD: {jd}. Provide a match score out of 100, highlight missing hard skills, and give 3 actionable tips for improvement."

    try:
        # Initialize the model and generate the response
        model = genai.GenerativeModel(model_id)
        response = model.generate_content(prompt)
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