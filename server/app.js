const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Configure where uploaded resumes will be temporarily stored
const upload = multer({ dest: 'uploads/' });

app.post('/api/analyze', upload.single('resume'), (req, res) => {
    const resumePath = req.file.path;
    const jobDescription = req.body.jd || "MERN Stack Developer";

    console.log(`Starting AI Analysis for: ${req.file.originalname}`);

    // Trigger your Python Engine
    // This command runs: python ../engine.py [path_to_file] [job_description]
    const python = spawn('python', ['../engine.py', resumePath, jobDescription]);

    let resultData = '';
    python.stdout.on('data', (data) => {
        resultData += data.toString();
    });

    python.on('close', (code) => {
        console.log("Analysis Complete.");
        res.json({ analysis: resultData });
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Node.js Bridge running on http://localhost:${PORT}`));