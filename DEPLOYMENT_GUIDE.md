# Complete Deployment Guide
## Deploy Frontend to Vercel & Backend to Render

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment to Render](#backend-deployment-to-render)
3. [Frontend Deployment to Vercel](#frontend-deployment-to-vercel)
4. [Connecting Frontend to Backend](#connecting-frontend-to-backend)
5. [Testing the Deployment](#testing-the-deployment)
6. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

### Required Accounts

1. **GitHub Account**
   - Sign up at: https://github.com/signup
   - Free account is sufficient

2. **Render Account**
   - Sign up at: https://render.com/
   - Use "Sign in with GitHub" (recommended)
   - Free tier available

3. **Vercel Account**
   - Sign up at: https://vercel.com/signup
   - Use "Continue with GitHub" (recommended)
   - Free hobby plan available

### Required Software

- **Git** (for version control)
  - Download: https://git-scm.com/downloads
  - Verify: `git --version`

- **Node.js** (already installed ✓)
- **Python** (already installed ✓)

---

## 2. Backend Deployment to Render

### Step 2.1: Prepare Backend for Deployment

#### Create Required Files

**File 1: `runtime.txt`** (Python version)
```txt
python-3.13.6
```

**File 2: `render.yaml`** (Optional - Render config)
```yaml
services:
  - type: web
    name: beam-analysis-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app
    envVars:
      - key: PYTHON_VERSION
        value: 3.13.6
```

**File 3: Update `requirements.txt`**
Add gunicorn for production:
```txt
flask==3.0.0
flask-cors==4.0.0
numpy
scipy
matplotlib
gunicorn==21.2.0
```

**File 4: Update `app.py`** (Production settings)
Change the last lines:
```python
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
```

### Step 2.2: Initialize Git Repository

```bash
# Navigate to project root
cd /path/to/PAID-PROJECT

# Initialize Git
git init

# Add gitignore
git add .gitignore

# Add all files
git add .

# Commit
git commit -m "Initial commit: Beam Analysis Application"
```

### Step 2.3: Push to GitHub

```bash
# Create repository on GitHub first
# Go to: https://github.com/new
# Repository name: beam-analysis-app
# Public or Private: Your choice
# DO NOT initialize with README

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/beam-analysis-app.git

# Push
git branch -M main
git push -u origin main
```

### Step 2.4: Deploy on Render

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com/
   - Click "New +"
   - Select "Web Service"

2. **Connect Repository**
   - Click "Connect account" → GitHub
   - Authorize Render
   - Select your repository: `beam-analysis-app`

3. **Configure Service**
   ```
   Name: beam-analysis-api
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app
   Instance Type: Free
   ```

4. **Add Environment Variables** (Optional)
   ```
   PYTHON_VERSION = 3.13.6
   PORT = 10000 (automatic)
   ```

5. **Click "Create Web Service"**

6. **Wait for Deployment** (5-10 minutes)
   - Watch build logs
   - Wait for "Live" status
   - Note your URL: `https://beam-analysis-api.onrender.com`

### Step 2.5: Verify Backend Deployment

```bash
# Test health endpoint
curl https://beam-analysis-api.onrender.com/health

# Expected response:
# {"status": "healthy"}

# Test analyze endpoint
curl -X POST https://beam-analysis-api.onrender.com/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "length": 10,
    "E": 200000000,
    "I": 0.0001,
    "supports": [
      {"position": 0, "type": "hinged", "settlement": 0},
      {"position": 10, "type": "roller", "settlement": 0}
    ],
    "loads": [
      {"type": "point", "position": 5, "magnitude": 50}
    ]
  }'

# Should return analysis results
```

---

## 3. Frontend Deployment to Vercel

### Step 3.1: Prepare Frontend for Deployment

#### Update API URL for Production

**File: `frontend/.env.production`** (Create this file)
```env
REACT_APP_API_URL=https://beam-analysis-api.onrender.com
```

**File: `frontend/.env.development`** (Create this file)
```env
REACT_APP_API_URL=http://localhost:5000
```

#### Verify `package.json` Scripts
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### Step 3.2: Test Local Production Build

```bash
# Navigate to frontend
cd frontend

# Create production build
npm run build

# Test build locally (optional)
npx serve -s build
# Opens on http://localhost:3000
```

### Step 3.3: Commit Frontend Changes

```bash
# From project root
git add .
git commit -m "Add production configuration for deployment"
git push origin main
```

### Step 3.4: Deploy on Vercel

**Method 1: Using Vercel Dashboard** (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Click "Continue with GitHub"
   - Select your repository: `beam-analysis-app`
   - Click "Import"

3. **Configure Project**
   ```
   Framework Preset: Create React App
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     Name: REACT_APP_API_URL
     Value: https://beam-analysis-api.onrender.com
     Environment: Production
     ```

5. **Click "Deploy"**

6. **Wait for Deployment** (2-5 minutes)
   - Watch build logs
   - Wait for "Ready" status
   - Note your URL: `https://beam-analysis-app.vercel.app`

**Method 2: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts:
# Set up and deploy? Yes
# Which scope? (Your account)
# Link to existing project? No
# Project name? beam-analysis-app
# Directory? ./
# Override settings? No

# For production:
vercel --prod
```

### Step 3.5: Configure Custom Domain (Optional)

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Settings" → "Domains"
4. Add your custom domain
5. Follow DNS configuration instructions

---

## 4. Connecting Frontend to Backend

### Step 4.1: Verify Environment Variable

**Check in Vercel:**
1. Dashboard → Your Project
2. Settings → Environment Variables
3. Ensure `REACT_APP_API_URL` points to Render backend

### Step 4.2: Update CORS on Backend

**File: `backend/app.py`**

Ensure CORS allows your Vercel domain:
```python
from flask_cors import CORS

app = Flask(__name__)

# Allow all origins (for testing)
CORS(app)

# OR specify your Vercel domain (recommended for production)
CORS(app, origins=[
    "https://beam-analysis-app.vercel.app",
    "http://localhost:3000"  # for development
])
```

### Step 4.3: Redeploy if Needed

**Redeploy Backend:**
```bash
git add backend/app.py
git commit -m "Update CORS configuration"
git push origin main
# Render auto-deploys on push
```

**Redeploy Frontend:**
```bash
# Vercel auto-deploys on push
# OR manually:
cd frontend
vercel --prod
```

---

## 5. Testing the Deployment

### Test Checklist

#### ✅ Backend Tests

```bash
# 1. Health Check
curl https://YOUR-BACKEND-URL.onrender.com/health

# 2. Simple Analysis
curl -X POST https://YOUR-BACKEND-URL.onrender.com/analyze \
  -H "Content-Type: application/json" \
  -d '{"length":10,"E":200000000,"I":0.0001,"supports":[{"position":0,"type":"hinged","settlement":0},{"position":10,"type":"roller","settlement":0}],"loads":[{"type":"point","position":5,"magnitude":50}]}'

# 3. Complex Analysis (Multi-span)
curl -X POST https://YOUR-BACKEND-URL.onrender.com/analyze \
  -H "Content-Type: application/json" \
  -d '{"length":15,"E":200000000,"I":0.0001,"supports":[{"position":0,"type":"fixed","settlement":0},{"position":5,"type":"roller","settlement":0},{"position":15,"type":"roller","settlement":0}],"loads":[{"type":"udl","start":0,"end":15,"magnitude":10}]}'
```

#### ✅ Frontend Tests

1. **Open Application**
   - Visit: `https://YOUR-APP.vercel.app`
   - Check: Page loads correctly
   - Check: No console errors (F12 → Console)

2. **Test API Connection**
   - Check: Green "✓ Connected" badge in header
   - If red: Backend may be sleeping (Render free tier)
   - Wait 30 seconds and refresh

3. **Load Example**
   - Click: "Load Example" button
   - Check: Beam data populates
   - Click: "Analyze Beam"
   - Check: Results appear
   - Check: Charts render

4. **Custom Input**
   - Clear all data
   - Add custom beam (12m)
   - Add supports (0m hinged, 12m roller)
   - Add UDL (0-12m, 15kN/m)
   - Analyze
   - Verify: Results match expectations

5. **Multiple Scenarios**
   - Test point load
   - Test VDL
   - Test multi-span
   - Test sinking support

#### ✅ Mobile Test

1. Open on mobile browser
2. Check: Responsive layout
3. Check: Touch interactions work
4. Check: Forms usable

---

## 6. Troubleshooting

### Issue: Backend Shows "Service Unavailable"

**Cause:** Render free tier sleeps after 15 minutes of inactivity

**Solution:**
1. Wait 30-60 seconds for wake-up
2. Refresh page
3. Backend will stay awake for 15 minutes

**Permanent Fix:** Upgrade to paid Render plan ($7/month)

---

### Issue: Frontend Shows "API Disconnected"

**Possible Causes:**
1. Backend sleeping (see above)
2. Wrong API URL in environment variable
3. CORS issue

**Solutions:**

**Check 1: Environment Variable**
```bash
# Vercel Dashboard
# Project → Settings → Environment Variables
# Verify REACT_APP_API_URL is correct
```

**Check 2: CORS Configuration**
```python
# backend/app.py
CORS(app, origins=["https://YOUR-VERCEL-URL.vercel.app"])
```

**Check 3: Redeploy**
```bash
# Update and redeploy
git add .
git commit -m "Fix CORS"
git push origin main
```

---

### Issue: Build Fails on Render

**Possible Causes:**
1. Missing requirements.txt
2. Wrong Python version
3. Import errors

**Solutions:**

**Check requirements.txt:**
```txt
flask
flask-cors
numpy
scipy
matplotlib
gunicorn
```

**Check Python version:**
```txt
# runtime.txt
python-3.13.6
```

**Check build logs in Render dashboard**

---

### Issue: Build Fails on Vercel

**Possible Causes:**
1. npm install fails
2. Build command wrong
3. Node version mismatch

**Solutions:**

**Check package.json:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    // ... all dependencies present
  }
}
```

**Check build settings:**
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `build`

**Try local build:**
```bash
cd frontend
rm -rf node_modules
npm install
npm run build
```

---

### Issue: Charts Not Displaying

**Possible Causes:**
1. Chart.js not loaded
2. API data format issue

**Solutions:**
1. Check browser console for errors
2. Verify Chart.js in package.json
3. Test API response format

---

### Issue: Slow Performance

**Backend (Render Free Tier):**
- First request slow (cold start)
- Subsequent requests fast
- Consider paid plan for always-on

**Frontend (Vercel):**
- Usually very fast
- Check network tab for slow API calls
- Optimize images if added

---

## 7. Maintenance & Updates

### Updating the Application

**For Code Changes:**
```bash
# 1. Make changes locally
# 2. Test locally
npm start  # frontend
python app.py  # backend

# 3. Commit
git add .
git commit -m "Description of changes"

# 4. Push
git push origin main

# 5. Auto-deploys
# Render: Auto-deploys backend
# Vercel: Auto-deploys frontend
```

### Monitoring

**Render:**
- Dashboard → Your Service → Logs
- Check for errors
- Monitor memory usage

**Vercel:**
- Dashboard → Your Project → Deployments
- Check deployment status
- View analytics

---

## 8. Cost Breakdown

### Free Tier Limits

**Render Free:**
- ✓ 750 hours/month
- ✓ Automatic HTTPS
- ✗ Sleeps after 15min inactivity
- ✗ Limited memory (512MB)

**Vercel Hobby (Free):**
- ✓ Unlimited deployments
- ✓ 100GB bandwidth/month
- ✓ Automatic HTTPS
- ✓ Custom domains

**Cost: $0/month for both** ✓

### Upgrade Options

**Render Starter ($7/month):**
- Always-on (no sleep)
- More memory
- Better performance

**Vercel Pro ($20/month):**
- More bandwidth
- Advanced analytics
- Priority support

---

## 9. Quick Reference

### Important URLs

```
GitHub Repo: https://github.com/YOUR_USERNAME/beam-analysis-app
Backend (Render): https://beam-analysis-api.onrender.com
Frontend (Vercel): https://beam-analysis-app.vercel.app
Render Dashboard: https://dashboard.render.com
Vercel Dashboard: https://vercel.com/dashboard
```

### Common Commands

```bash
# Test backend locally
cd backend
python app.py

# Test frontend locally
cd frontend
npm start

# Deploy frontend to Vercel
cd frontend
vercel --prod

# View logs
# Render: Dashboard → Service → Logs
# Vercel: Dashboard → Project → Deployments → View Function Logs
```

---

## 10. Security Best Practices

### Environment Variables

✓ Never commit `.env` files
✓ Use Render/Vercel env var system
✓ Keep API keys secret
✓ Rotate credentials regularly

### CORS Configuration

✓ Specify exact origins in production
✗ Don't use `*` (allow all) in production

```python
# Good (Production)
CORS(app, origins=["https://your-app.vercel.app"])

# Bad (Production)
CORS(app, origins="*")
```

### HTTPS

✓ Both Render and Vercel provide free HTTPS
✓ Never use HTTP in production
✓ Redirect HTTP to HTTPS

---

## Completion Checklist

Before considering deployment complete:

- [ ] Backend deployed to Render
- [ ] Backend health endpoint responding
- [ ] Backend analyze endpoint working
- [ ] Frontend deployed to Vercel
- [ ] Frontend loads correctly
- [ ] API connection shows "Connected"
- [ ] "Load Example" works
- [ ] Custom analysis works
- [ ] Charts display correctly
- [ ] Mobile responsive
- [ ] No console errors
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up

---

**Deployment Guide Complete!**

Your application is now live and accessible worldwide! 🎉
