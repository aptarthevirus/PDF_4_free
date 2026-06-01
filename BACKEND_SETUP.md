# PDF Downloader Backend Setup Guide

This guide provides step-by-step instructions to deploy the PDF downloader backend to multiple platforms.

## Table of Contents
1. [Local Testing](#local-testing)
2. [Railway Deployment](#railway-deployment-recommended)
3. [Heroku Deployment](#heroku-deployment)
4. [Render Deployment](#render-deployment)
5. [DigitalOcean Deployment](#digitalocean-deployment)
6. [AWS EC2 Deployment](#aws-ec2-deployment)
7. [Configuration](#configuration)
8. [Troubleshooting](#troubleshooting)

---

## Local Testing

### Prerequisites
- Node.js 14+ installed
- npm package manager

### Steps
1. **Clone and checkout the branch:**
   ```bash
   git clone https://github.com/aptarthevirus/PDF_4_free.git
   cd PDF_4_free
   git checkout backend-cors-fix
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Test the health endpoint:**
   ```bash
   curl http://localhost:3000/health
   ```

6. **Test PDF download:**
   ```bash
   curl -X POST http://localhost:3000/api/download-pdf \
     -H "Content-Type: application/json" \
     -d '{"url":"https://example.com/sample.pdf"}' \
     --output downloaded.pdf
   ```

---

## Railway Deployment (RECOMMENDED)

Railway is the easiest and fastest option. Free tier includes $5/month credits.

### Steps

1. **Go to Railway.app**
   - Visit https://railway.app
   - Click "New Project"

2. **Connect GitHub**
   - Select "Deploy from GitHub"
   - Authorize Railway to access your GitHub account
   - Select the `PDF_4_free` repository

3. **Select Branch**
   - Branch: `backend-cors-fix`
   - Click "Deploy"

4. **Configure Environment**
   - Railway auto-detects Node.js project
   - Settings → Environment → Add variables from `.env.example`:
     ```
     PORT=3000
     NODE_ENV=production
     RATE_LIMIT_MAX_REQUESTS=100
     ```

5. **Get Your URL**
   - After deployment completes, Railway shows your domain
   - Format: `https://your-app-name.up.railway.app`

6. **Update Frontend**
   - Modify `public/pdf.js` API endpoint:
   ```javascript
   const apiUrl = 'https://your-app-name.up.railway.app/api/download-pdf';
   const response = await fetch(apiUrl, {
       method: "POST",
       ...
   ```

7. **Done!** ✅ Your backend is live

**Pros:** Super easy, auto-deploys on push, free tier available
**Time:** 5 minutes

---

## Heroku Deployment

### Prerequisites
- Heroku CLI installed: https://devcenter.heroku.com/articles/heroku-cli
- Heroku account

### Steps

1. **Login to Heroku:**
   ```bash
   heroku login
   ```

2. **Create a new app:**
   ```bash
   heroku create your-app-name
   ```

3. **Deploy the branch:**
   ```bash
   git push heroku backend-cors-fix:main
   ```

4. **View logs:**
   ```bash
   heroku logs --tail
   ```

5. **Your app URL:**
   ```
   https://your-app-name.herokuapp.com
   ```

6. **Test it:**
   ```bash
   curl https://your-app-name.herokuapp.com/health
   ```

**Note:** Heroku's free tier was discontinued. Paid plans start at $7/month.

---

## Render Deployment

### Steps

1. **Go to Render.com**
   - Visit https://render.com
   - Sign up or login

2. **Create New Service**
   - Click "New +"
   - Select "Web Service"

3. **Connect Repository**
   - Select GitHub (authorize if needed)
   - Choose `PDF_4_free` repository
   - Branch: `backend-cors-fix`

4. **Configure Build**
   - Name: `pdf-downloader-backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free tier available

5. **Environment Variables**
   - Add from `.env.example`:
   ```
   PORT=3000
   NODE_ENV=production
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (3-5 minutes)

7. **Your URL:**
   - Format: `https://pdf-downloader-backend.onrender.com`

---

## DigitalOcean Deployment

### Prerequisites
- DigitalOcean account
- $5/month App Platform credit available

### Steps

1. **Go to DigitalOcean**
   - Visit https://digitalocean.com
   - Login/Sign up

2. **Create App**
   - Click "Create" → "Apps"
   - Select "GitHub"
   - Authorize and select `PDF_4_free` repository
   - Branch: `backend-cors-fix`

3. **Configure**
   - Auto-detects Node.js
   - HTTP Port: `3000`
   - Environment Variables:
   ```
   PORT=3000
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Launch App"
   - Wait for deployment (5-10 minutes)

5. **Get URL**
   - Dashboard shows your app domain

---

## AWS EC2 Deployment

### Prerequisites
- AWS account
- EC2 instance created (Ubuntu 20.04 recommended)
- SSH access to instance

### Steps

1. **Connect to your instance:**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

2. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2 (process manager):**
   ```bash
   sudo npm install -g pm2
   ```

4. **Clone repository:**
   ```bash
   git clone https://github.com/aptarthevirus/PDF_4_free.git
   cd PDF_4_free
   git checkout backend-cors-fix
   ```

5. **Install dependencies:**
   ```bash
   npm install --production
   ```

6. **Start with PM2:**
   ```bash
   pm2 start server.js --name "pdf-downloader"
   pm2 startup
   pm2 save
   ```

7. **Configure security group:**
   - Allow inbound traffic on port 3000
   - AWS Console → Security Groups → Edit inbound rules
   - Add rule: Port 3000, Protocol: TCP, Source: 0.0.0.0/0

8. **Access your app:**
   ```
   http://your-instance-ip:3000/health
   ```

9. **Optional: Setup Nginx reverse proxy**
   ```bash
   sudo apt-get install nginx
   sudo nano /etc/nginx/sites-available/default
   ```
   
   Add:
   ```nginx
   location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
   }
   ```

---

## Configuration

### Environment Variables

Create `.env` file with:

```env
# Server
PORT=3000
NODE_ENV=production

# Rate Limiting (15 minutes window, 100 requests)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Size (100MB)
MAX_FILE_SIZE=104857600

# Request Timeout (30 seconds)
REQUEST_TIMEOUT=30000
```

### Rate Limiting Adjustment

Edit `server.js` to change limits:
```javascript
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                   // requests per window
});
```

---

## Troubleshooting

### "Port 3000 already in use"
```bash
lsof -i :3000  # Find process
kill -9 <PID>  # Kill it
```

### "Cannot find module 'express'"
```bash
npm install
```

### "Failed to fetch PDF: 403 Forbidden"
- The PDF server blocked the request
- This is expected for some protected PDFs
- Users should download directly from the source

### "CORS error still appearing"
- Make sure frontend is pointing to backend URL
- Check `public/pdf.js` API endpoint
- Ensure backend is deployed and running

### "Server won't start on my platform"
- Check Node.js version: `node --version` (need 14+)
- Check all dependencies installed: `npm install`
- Review logs for errors

---

## Frontend Integration

After deploying backend, update `public/pdf.js`:

```javascript
// Change the fetch URL to your deployed backend
const API_URL = 'https://your-deployed-backend.com/api/download-pdf';

const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: url })
});
```

---

## Performance Tips

1. **Enable gzip compression:**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Add caching headers:**
   - Backend caches nothing by default (stateless)
   - Frontend can cache the download

3. **Monitor with:**
   - Railway/Render/Heroku dashboards
   - CloudWatch (AWS)
   - PM2 Plus (AWS EC2)

---

## Next Steps

1. ✅ Choose your deployment platform
2. ✅ Follow the deployment steps
3. ✅ Test the `/health` endpoint
4. ✅ Update frontend with backend URL
5. ✅ Test full PDF download workflow
6. ✅ Merge to main branch

Happy downloading! 🎉
