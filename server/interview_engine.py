import sys
import json
import google.generativeai as genai
import os

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-2.0-flash-exp')

def start_interview(bullet_point):
    """Generate first question to extract STAR story"""
    
    prompt = f"""You are a professional career coach conducting an interview to improve a resume bullet point.

ORIGINAL BULLET: "{bullet_point}"

This bullet is weak because it describes duties, not results. Your job is to ask a targeted question that extracts:
- Situation: What was the context?
- Task: What needed to be done?
- Action: What did YOU specifically do?
- Result: What measurable impact did it have?

Generate ONE specific follow-up question that will help extract the missing STAR components.
Be conversational, friendly, and specific.

Return ONLY a valid JSON object (no markdown, no backticks):
{{
  "question": "Your question here",
  "context": "situation"
}}
"""
    
    try:
        response = model.generate_content(prompt)
        # Clean the response (remove markdown if present)
        text = response.text.strip()
        if text.startswith('```json'):
            text = text.replace('```json', '').replace('```', '').strip()
        if text.endswith('```'):
            text = text.replace('```', '').strip()
        print(text)
    except Exception as e:
        error = {"error": str(e)}
        print(json.dumps(error))


def continue_interview(bullet_point, conversation_history):
    """Analyze user answers and either ask follow-up or generate final bullet"""
    
    prompt = f"""You are a career coach improving a resume bullet point through conversation.

ORIGINAL BULLET: "{bullet_point}"

CONVERSATION SO FAR:
{conversation_history}

TASK:
1. Analyze if you have enough information to write a strong STAR-based bullet point
2. If YES: Generate the improved bullet and mark complete
3. If NO: Ask ONE more specific question to fill gaps

STAR CHECKLIST:
- Situation: Do we know the context/problem?
- Task: Do we know what needed to be done?
- Action: Do we know specific actions taken?
- Result: Do we have quantifiable metrics (%, $, time saved)?

RULES FOR IMPROVED BULLETS:
- Start with strong action verb (Developed, Implemented, Optimized, etc.)
- Include specific technology/methods
- Include quantifiable results (numbers, %, time, money)
- Keep under 150 characters if possible
- No fluff words (responsible for, helped with)

Return ONLY a valid JSON object (no markdown, no backticks):
{{
  "is_complete": true,
  "improved_bullet": "Final polished bullet here",
  "confidence_score": 95
}}

OR if you need more info:
{{
  "is_complete": false,
  "next_question": "Your specific question here"
}}
"""
    
    try:
        response = model.generate_content(prompt)
        # Clean the response
        text = response.text.strip()
        if text.startswith('```json'):
            text = text.replace('```json', '').replace('```', '').strip()
        if text.endswith('```'):
            text = text.replace('```', '').strip()
        print(text)
    except Exception as e:
        error = {"error": str(e)}
        print(json.dumps(error))


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing arguments"}))
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == 'start':
        bullet = sys.argv[2]
        start_interview(bullet)
    
    elif command == 'continue':
        if len(sys.argv) < 4:
            print(json.dumps({"error": "Missing conversation history"}))
            sys.exit(1)
        bullet = sys.argv[2]
        conversation = sys.argv[3]
        continue_interview(bullet, conversation)
    
    else:
        print(json.dumps({"error": "Unknown command"}))
        sys.exit(1)