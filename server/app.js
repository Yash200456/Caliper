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
const JWT_SECRET = 'super_secret_careerorbit_key_123'; // In production, put this in your .env file!

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
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("🐘 Database connected & Users table verified.");
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


// --- AI ANALYSIS ROUTE (Your existing tool) ---
app.post('/api/analyze', upload.single('resume'), (req, res) => {
    if (!req.file || !req.body.jd) return res.status(400).json({ error: "Missing resume or job description." });

    const jd = req.body.jd;
    const filePath = req.file.path;

    const pythonProcess = spawn('python', ['engine.py', filePath, jd]);
    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => dataString += data.toString());
    pythonProcess.stderr.on('data', (data) => { errorString += data.toString(); console.error(`Python Error: ${data}`); });

    pythonProcess.on('close', (code) => {
        fs.unlink(filePath, (err) => { if (err) console.error("⚠️ Failed to delete temp file:", err); });
        if (code !== 0) return res.status(500).json({ error: "AI Engine crashed.", details: errorString });

        try {
            const resultData = JSON.parse(dataString);
            res.json(resultData);
        } catch (error) {
            res.status(500).json({ error: "Failed to parse AI response." });
        }
    });
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`✅ CareerOrbit Server is running on http://localhost:${PORT}`);
});