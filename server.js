const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many download requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/download-pdf', limiter);


app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

function isSafeUrl(url) {
    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname;

        // 


        
        const blockedPatterns = [
            /^localhost$/i,
            /^127\./,
            /^0\.0\.0\.0$/,
            /^10\./,
            /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0 - 172.31.255.255
            /^192\.168\./,
            /^169\.254\./, // Link-local addresses
            /^255\.255\.255\.255$/,
            /^::1$/, // IPv6 localhost
            /^fc00:/i, // IPv6 private
            /^fe80:/i, // IPv6 link-local
        ];




        
        return !blockedPatterns.some(pattern => pattern.test(hostname));
    } catch (e) {
        return false;
    }
}


app.post('/api/download-pdf', async (req, res) => {
    try {
        const { url } = req.body;

        // Validate URL is provided and is a string
        if (!url || typeof url !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Invalid URL provided'
            });
        }

        // 


        
        try {
            new URL(url);
        } catch (e) {
            return res.status(400).json({
                success: false,
                error: 'Invalid URL format'
            });
        }

        if (!isSafeUrl(url)) {
            return res.status(403).json({
                success: false,
                error: 'Access to internal networks is not allowed'
            });
        }

        //



        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        let response;
        try {
            response = await fetch(url, {
                signal: controller.signal,
                headers: { 'User-Agent': 'PDF-Downloader/1.0' }
            });
        } finally {
            clearTimeout(timeoutId);
        }

        // 
        // successful
        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                error: `Failed to fetch PDF: ${response.status} ${response.statusText}`
            });
        }



        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/pdf')) {
            return res.status(400).json({
                success: false,
                error: `Invalid content type: ${contentType || 'unknown'}. Expected application/pdf`
            });
        }


        
        const contentLength = response.headers.get('content-length');
        const MAX_SIZE = 100 * 1024 * 1024; // 100MB

        if (contentLength && parseInt(contentLength) > MAX_SIZE) {
            return res.status(413).json({
                success: false,
                error: 'PDF file is too large (max 100MB)'
            });
        }

      
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=downloaded.pdf');

     
        
        let downloadedBytes = 0;

        
        response.body.on('data', (chunk) => {
            downloadedBytes += chunk.length;
            if (downloadedBytes > MAX_SIZE) {
                response.body.destroy();
                res.status(413).json({
                    success: false,
                    error: 'PDF file exceeds maximum size limit during download'
                });
            }
        });

        
        response.body.on('error', (error) => {
            console.error('Response stream error:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    error: 'Error reading PDF stream'
                });
            } else {
                res.end();
            }
        });

        
        response.body.pipe(res).on('error', (error) => {
            console.error('Pipe error:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    error: 'Error streaming PDF'
                });
            }
        });

    } catch (error) {
        console.error('Download Error:', error);

        
        if (error.name === 'AbortError') {
            return res.status(504).json({
                success: false,
                error: 'Request timeout'
            });
        }

        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                error: `Server error: ${error.message}`
            });
        } else {
            res.end();
        }
    }
});

app.listen(PORT, () => {
    console.log(`PDF Downloader Server running on port ${PORT}`);
});




