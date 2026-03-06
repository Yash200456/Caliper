const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/api/analyze', upload.single('resume'), (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded.");
    
    const resumePath = req.file.path;
    const jd = req.body.jd;

    console.log(`🚀 Analyzing: ${req.file.originalname}`);

    // Call Python Engine
    const python = spawn('python', [path.join(__dirname, '../engine.py'), resumePath, jd, 'analyze']);

    let output = '';
    python.stdout.on('data', (data) => {
        output += data.toString();
    });

    python.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
    });

    python.on('close', (code) => {
        console.log("✅ Analysis complete. Sending to React.");
        try {
            const parsed = JSON.parse(output.trim());
            res.json(parsed);
        } catch (e) {
            console.error("Failed to parse AI response as JSON:", output);
            res.json({ error: "Failed to parse analysis result" });
        }
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`📡 Bridge running on http://localhost:${PORT}`));