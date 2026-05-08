const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many download requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/download-pdf', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// PDF download endpoint
app.post('/api/download-pdf', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url || typeof url !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Invalid URL provided'
            });
        }

        try {
            new URL(url);
        } catch (e) {
            return res.status(400).json({
                success: false,
                error: 'Invalid URL format'
            });
        }

        // SSRF Protection
        const blockedPatterns = [
            /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/
        ];

        if (blockedPatterns.some(pattern => pattern.test(url))) {
            return res.status(403).json({
                success: false,
                error: 'Access to internal networks is not allowed'
            });
        }

        // Fetch with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(url, {
            signal: controller.signal,
            headers: { 'User-Agent': 'PDF-Downloader/1.0' }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                error: `Failed to fetch PDF: ${response.status} ${response.statusText}`
            });
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/pdf')) {
            console.warn(`Warning: Content-Type is ${contentType}`);
        }

        const contentLength = response.headers.get('content-length');
        const MAX_SIZE = 100 * 1024 * 1024;

        if (contentLength && parseInt(contentLength) > MAX_SIZE) {
            return res.status(413).json({
                success: false,
                error: 'PDF file is too large (max 100MB)'
            });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=downloaded.pdf');
        response.body.pipe(res);

    } catch (error) {
        console.error('Download Error:', error);

        if (error.name === 'AbortError') {
            return res.status(504).json({
                success: false,
                error: 'Request timeout'
            });
        }

        res.status(500).json({
            success: false,
            error: `Server error: ${error.message}`
        });
    }
});

app.listen(PORT, () => {
    console.log(`PDF Downloader Server running on port ${PORT}`);
});
