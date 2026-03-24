import sys
import os
import json
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
        return json.dumps({"error": f"Error reading PDF: {e}"})

def run_ai(text, jd):
    model_id = "gemini-2.5-flash"
    
    # We force Gemini to act as an API that only returns strict JSON
    prompt = f"""
    You are an expert ATS (Applicant Tracking System) and Technical Recruiter.
    Analyze the following resume against the provided Job Description.
    
    You MUST return your analysis in strict JSON format exactly like this schema, with no markdown formatting, no code blocks, and no extra conversational text:
    {{
        "match_score": 85,
        "skill_scan": "You are missing these key skills: React, Node.js. You have a strong foundation in Python.",
        "tips": "1. Add more measurable results to your experience.\\n2. Tailor your summary to mention the exact job title."
    }}
    
    Resume Text:
    {text}
    
    Job Description:
    {jd}
    """

    try:
        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        response = client.models.generate_content(
            model=model_id,
            contents=prompt
        )
        
        # Clean the response in case Gemini wraps it in markdown (```json ... ```)
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
            
        return raw_text.strip()
    except Exception as e:
        return json.dumps({"error": f"AI Error: {e}"})


def run_cover(text, jd):
    model_id = "gemini-2.5-flash"
    prompt = f"""
    You are a helpful AI that writes professional cover letters.

    Write a highly professional, 3-paragraph cover letter for this job using the experiences listed in this resume. Use the job description to tailor the letter and make it sound polished.

    Resume Text:
    {text}

    Job Description:
    {jd}
    """

    try:
        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        response = client.models.generate_content(
            model=model_id,
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        return f"Error generating cover letter: {e}"

if __name__ == "__main__":
    # support two modes: normal analysis (provide file path + jd) or cover letter generation
    if len(sys.argv) > 1 and sys.argv[1] == 'cover':
        # read resume text from stdin
        job_desc = sys.argv[2] if len(sys.argv) > 2 else "Software Engineer"
        resume_text = sys.stdin.read()
        print(run_cover(resume_text, job_desc))
    else:
        file_path = sys.argv[1] if len(sys.argv) > 1 else "resume.pdf"
        job_desc = sys.argv[2] if len(sys.argv) > 2 else "Software Engineer"

        resume_text = extract_text_from_pdf(file_path)

        if "error" in resume_text.lower():
            print(resume_text)
        else:
            # Attach extracted resume text so downstream features can reuse it.
            ai_json = run_ai(resume_text, job_desc)
            try:
                payload = json.loads(ai_json)
                payload["resume_text"] = resume_text
                print(json.dumps(payload))
            except Exception:
                print(ai_json)