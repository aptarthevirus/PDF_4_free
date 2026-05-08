const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// 1. CORS Configuration
// Important: 'credentials: true' allows the frontend to send cookies
app.use(cors({
    origin: 'http://your-frontend-domain.com', 
    credentials: true
}));

// 2. CSRF Verification Middleware
const verifyCSRF = (req, res, next) => {
    const tokenFromCookie = req.cookies['csrftoken'];
    const tokenFromHeader = req.headers['x-csrf-token'];

    if (!tokenFromCookie || tokenFromCookie !== tokenFromHeader) {
        return res.status(403).json({ error: 'CSRF token mismatch or missing.' });
    }
    next();
};

// 3. The Download Route
app.post('/download-pdf', verifyCSRF, (req, res) => {
    // In a real app, you might get the filename from req.body
    const filePath = path.join(__dirname, 'files', 'sample.pdf');

    // Set headers to tell the browser it's a PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');

    // Send the file
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            if (!res.headersSent) {
                res.status(500).send('Error downloading file');
            }
        }
    });
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));
