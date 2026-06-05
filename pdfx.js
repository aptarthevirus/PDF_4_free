const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://your-frontend-domain.com', 
    credentials: true
}));

const verifyCSRF = (req, res, next) => {
    const tokenFromCookie = req.cookies['csrftoken'];
    const tokenFromHeader = req.headers['x-csrf-token'];

    if (!tokenFromCookie || tokenFromCookie !== tokenFromHeader) {
        return res.status(403).json({ error: 'CSRF token mismatch or missing.' });
    }
    next();
};

app.post('/download-pdf', verifyCSRF, (req, res) => {
    const filePath = path.join(__dirname, 'files', 'sample.pdf');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');

    // 
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
