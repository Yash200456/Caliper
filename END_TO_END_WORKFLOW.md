# End-to-End Workflow for the Resume Analyzer Project

This document describes the full workflow for installing, developing, and using the resume analysis and cover letter generation project. It covers all components, from the Python engine through the Node.js server and React client.

---

## 📁 Project Structure

```
/ (workspace root)
├─ engine.py                 # Python script for PDF parsing and AI evaluation
├─ parse.js                  # simple AST parser example
├─ client/                   # React front-end
│   ├─ package.json
│   ├─ src/
│   │   └─ App.js, ...
│   └─ build/
├─ server/                   # Node.js backend
│   ├─ app.js
│   ├─ db.js
│   ├─ package.json
│   └─ test_models.py        # tests for server models
└─ public/                   # static assets for client
    └─ index.html, ...
```

---

## 🚀 High‑Level Workflow

1. **Setup environment variables**
   - Copy the provided `.env.example` to `.env` and fill in real values (API keys, database URL, etc.).
   - If your repo doesn’t already have `.env.example`, create `.env` yourself and define at least `GEMINI_API_KEY` and `DATABASE_URL`.
   - Never commit the actual `.env` file; add it to `.gitignore` (see project tips below).
2. **Install dependencies**
   - Python: install required packages (`PyMuPDF`, `openai`/`google-genai`, `python-dotenv`) via pip.
   - Node/server: run `npm install` in `server/` and `client/` directories.
3. **Run the components**
   - Start the Python engine directly or as invoked by the Node server.
   - Launch the server: `node server/app.js` (or use `npm start` if configured).
   - Start the React client: `npm start` inside `client/`; it proxies requests to the backend.
4. **Usage flows**
   - **Resume analysis**: upload a PDF in the front‑end or call the server endpoint. The server uses `engine.py` to extract text, send prompts to Gemini, and returns JSON scores.
   - **Cover letter**: same flow with `engine.py` using the `cover` mode to generate a tailored letter from resume text and job descriptions.
   - **AST parsing example**: `node parse.js` shows simple Babel parse for debugging/testing JS code.
5. **Testing**
   - Python: run `python server/test_models.py` to verify database models and logic.
   - JavaScript: add tests under `client/` (e.g. `App.test.js`) and run `npm test`.
6. **Deployment**
   - Build the React app with `npm run build` in `client/`.
   - Serve static files from `server/app.js` or via a CDN.
   - Host the Python engine as a service or bundle with the server (e.g. via child process spawning).

---

## 🛠️ Setup and Configuration

1. **Python prerequisites**
   ```powershell
   cd c:\Users\yashw\Documents\Python
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt  # create this file if missing
   ```
2. **Node/JavaScript prerequisites**
   ```powershell
   cd server
   npm install
   cd ..\client
   npm install
   ```
3. **Environment variables**
   - `GEMINI_API_KEY` – API key for Google Gemini model used by `engine.py`.
   - Database connection string (e.g., `DATABASE_URL`) used by `server/db.js`.

---

## 🧩 Component Details

### Python Engine (`engine.py`)
- **Responsibilities**: extract text from PDF resumes, prompt Gemini for an analysis score or generate cover letters.
- **Usage**:
  ```sh
  python engine.py resume.pdf "Senior Developer"
  # or for cover letter generation:
  echo "<raw resume text>" | python engine.py cover "Job description here"
  ```
- **Key functions**:
  - `extract_text_from_pdf(pdf_path)`
  - `run_ai(text, jd)`
  - `run_cover(text, jd)`

### Node.js Server (`server/app.js`)
- Accepts HTTP requests from the front-end.
- Calls `engine.py` (or uses its logic directly) to process resumes.
- Connects to a database via `db.js`.

### React Client (`client/src/App.js`)
- Presents forms for uploading resumes and entering job descriptions.
- Displays match scores, skill scans, and generated cover letters.
- Uses `fetch`/`axios` to hit backend endpoints.

---

## 📌 Tips & Best Practices

- Keep the `.env` file out of source control; commit the companion `.env.example` instead.
- Make sure the `DATABASE_URL` in your `.env` is valid and reachable from your network (DNS/host lookup issues cause `ENOTFOUND`).
- Validate PDF files before sending to the engine to avoid malformed input.
- Use proper error handling in server routes; the engine returns JSON error messages that can be forwarded.
- Log requests in `server/app.js` for debugging.

---

## 📦 Building & Deployment

1. **Client build**:
   ```sh
   cd client
   npm run build
   ```
2. **Serve**:
   - Point `server/app.js` at `client/build` directory or host static files elsewhere.
3. **Docker (optional)**:
   - Create Dockerfile(s) for Python engine and Node server.
   - Use a multi‑stage build to bundle the React app.

---

## 📄 Additional Documentation

- Developer notes: `server/test_models.py` shows how models interact with the DB.
- The `parse.js` script is a utility/example for parsing JS with Babel; not required at runtime.

---

_End of document._
