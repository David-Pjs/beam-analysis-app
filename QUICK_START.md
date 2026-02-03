# Quick Start Guide

## Running the Application (Windows)

### Option 1: Using Batch Scripts (Easiest)

1. **Start Backend**:
   - Double-click `start-backend.bat`
   - Wait for message: "Starting Beam Analysis API server..."
   - Keep this window open

2. **Start Frontend**:
   - Double-click `start-frontend.bat`
   - Browser will open automatically at http://localhost:3000
   - Keep this window open

### Option 2: Manual Start

**Terminal 1 (Backend):**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm start
```

## First Time Setup

### Install Requirements

1. **Python** (3.8+): https://www.python.org/downloads/
   - Check: `python --version`

2. **Node.js** (16+): https://nodejs.org/
   - Check: `node --version`

### Initial Installation

Run these commands once:

```bash
# Backend setup
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
```

## Using the Application

1. **Configure Beam**:
   - Set length (e.g., 10m)
   - Set material properties (E, I)

2. **Add Supports**:
   - Click support type (Fixed/Hinged/Roller)
   - Enter position
   - Add settlement if needed

3. **Add Loads**:
   - Choose load type
   - Enter values
   - Click "Add Load"

4. **Analyze**:
   - Click "Analyze Beam"
   - View diagrams and reactions

## Example to Try

Click "Load Example" button in the app to see a pre-configured beam with:
- 10m simply supported beam
- UDL of 10 kN/m
- Point load of 50 kN at center

## Troubleshooting

**Backend not starting?**
- Install Python: https://www.python.org/downloads/
- Run: `pip install flask flask-cors numpy scipy matplotlib`

**Frontend not starting?**
- Install Node.js: https://nodejs.org/
- Delete `node_modules` folder
- Run: `npm install` again

**Port already in use?**
- Backend (5000): Kill process using port 5000
- Frontend (3000): Kill process using port 3000

## Need Help?

Check README.md for detailed documentation.
