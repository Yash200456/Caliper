const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Temporary upload storage
const upload = multer({ dest: 'uploads/' });

app.post('/api/analyze', upload.single('resume'), (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded.");
    
    const resumePath = req.file.path;
    const jd = req.body.jd;

    console.log(`🚀 Analyzing: ${req.file.originalname}`);

    // Call Python Engine (Gemini 3.1 Pro)
    // Adjust path if engine.py is in the parent directory
    const python = spawn('python', [path.join(__dirname, '../engine.py'), resumePath, jd]);

    let output = '';
    python.stdout.on('data', (data) => {
        output += data.toString();
    });

    python.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
    });

    python.on('close', (code) => {
        console.log("✅ Analysis complete.");
        res.json({ analysis: output });
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`📡 Bridge running on http://localhost:${PORT}`));