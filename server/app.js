const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import our new database connection
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'super_secret_caliper_key_123'; // In production, put this in your .env file!

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// --- DATABASE INITIALIZATION ---
// Automatically create the Users table if it doesn't exist yet
const initializeDB = async () => {
    try {
        // users table (already existed earlier)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // new scans/history table (one-to-many relationship with users)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS scans (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                label VARCHAR(255) DEFAULT 'Untitled',
                result JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("🐘 Database connected & Users/Scans tables verified.");
    } catch (err) {
        console.error("❌ Database connection failed:", err);
    }
};
initializeDB();


// --- AUTHENTICATION ROUTES ---

// 1. User Signup
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user already exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "User already exists." });
        }

        // Encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save to Database
        const newUser = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );

        // Generate Login Token
        const token = jwt.sign({ id: newUser.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: newUser.rows[0] });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error during signup." });
    }
});

// 2. User Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user in database
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        // Compare encrypted passwords
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        // Generate Login Token
        const token = jwt.sign({ id: user.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.rows[0].id, email: user.rows[0].email } });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error during login." });
    }
});


// helper middleware to verify JWT token and set req.userId
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided.' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Malformed authorization header.' });

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.userId = payload.id;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

// --- SCANS / HISTORY ENDPOINTS ---

// get all scans for authenticated user
app.get('/api/scans', verifyToken, async (req, res) => {
    try {
        const scans = await pool.query(
            'SELECT id, label, result, created_at FROM scans WHERE user_id = $1 ORDER BY created_at DESC',
            [req.userId]
        );
        res.json(scans.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not retrieve scans.' });
    }
});

// get a specific scan detail (optional)
app.get('/api/scans/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const scan = await pool.query(
            'SELECT id, label, result, created_at FROM scans WHERE id = $1 AND user_id = $2',
            [id, req.userId]
        );
        if (scan.rows.length === 0) return res.status(404).json({ error: 'Scan not found.' });
        res.json(scan.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not retrieve scan.' });
    }
});

// update scan label (or other metadata)
app.put('/api/scans/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { label } = req.body;
    try {
        const updated = await pool.query(
            'UPDATE scans SET label = $1 WHERE id = $2 AND user_id = $3 RETURNING id, label, result, created_at',
            [label, id, req.userId]
        );
        if (updated.rows.length === 0) return res.status(404).json({ error: 'Scan not found or not yours.' });
        res.json(updated.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not update scan.' });
    }
});

// delete a scan
app.delete('/api/scans/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await pool.query(
            'DELETE FROM scans WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, req.userId]
        );
        if (deleted.rows.length === 0) return res.status(404).json({ error: 'Scan not found or not yours.' });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not delete scan.' });
    }
});

// --- AI ANALYSIS ROUTE (stores history for logged-in users) ---
app.post('/api/analyze', verifyToken, upload.single('resume'), async (req, res) => {
    if (!req.file || !req.body.jd) return res.status(400).json({ error: "Missing resume or job description." });

    const jd = req.body.jd;
    const filePath = req.file.path;

    const pythonProcess = spawn('python', ['engine.py', filePath, jd]);
    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => dataString += data.toString());
    pythonProcess.stderr.on('data', (data) => { errorString += data.toString(); console.error(`Python Error: ${data}`); });

    pythonProcess.on('close', async (code) => {
        fs.unlink(filePath, (err) => { if (err) console.error("⚠️ Failed to delete temp file:", err); });
        if (code !== 0) return res.status(500).json({ error: "AI Engine crashed.", details: errorString });

        try {
            const resultData = JSON.parse(dataString);
            // attach the raw resume text and job description for later cover-letter generation
            resultData.resume_text = resume_text;
            resultData.jd = jd;

            // persist scan to database and return the new record's id
            const insert = await pool.query(
                'INSERT INTO scans (user_id, result) VALUES ($1, $2) RETURNING id',
                [req.userId, resultData]
            );
            const responsePayload = { ...resultData, scanId: insert.rows[0].id, label: 'Untitled' };
            res.json(responsePayload);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to parse AI response." });
        }
    });
});

// --- COVER LETTER ROUTE ---
app.post('/api/cover', verifyToken, async (req, res) => {
    const { resume_text, jd } = req.body;
    if (!resume_text || !jd) return res.status(400).json({ error: 'Missing resume text or job description.' });

    try {
        const pythonProcess = spawn('python', ['engine.py', 'cover', jd]);
        let dataString = '';
        let errorString = '';

        pythonProcess.stdout.on('data', (data) => dataString += data.toString());
        pythonProcess.stderr.on('data', (data) => { errorString += data.toString(); console.error(`Python Error: ${data}`); });

        // write the resume text to stdin of python
        pythonProcess.stdin.write(resume_text);
        pythonProcess.stdin.end();

        pythonProcess.on('close', (code) => {
            if (code !== 0) return res.status(500).json({ error: 'Cover letter generator crashed.', details: errorString });
            // return raw text
            res.json({ letter: dataString });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error generating cover letter.' });
    }
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`✅ Caliper Server is running on http://localhost:${PORT}`);
});