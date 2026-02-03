# Beam and Frame Analysis Web Application

Professional structural engineering tool for analyzing beams and frames with various support conditions, loading types, and multiple spans.

## Features

- **Support Types**: Fixed, Hinged, and Roller supports
- **Multiple Spans**: Continuous beam analysis
- **Loading Conditions**:
  - Point Loads
  - Uniformly Distributed Loads (UDL)
  - Varying Distributed Loads (VDL) - Triangular/Trapezoidal
  - Composite Loads (combinations)
- **Fixed End Moments**: Accurate FEM calculations
- **Sinking Supports**: Settlement analysis
- **Diagrams**: Interactive Shear Force and Bending Moment diagrams
- **Real-time Analysis**: Instant structural calculations

## Project Structure

```
PAID-PROJECT/
├── backend/                # Python Flask API
│   ├── app.py             # Main Flask application
│   ├── calculations/      # Analysis algorithms
│   │   ├── beam_analysis.py
│   │   └── fixed_end_moments.py
│   ├── models/            # Data models
│   │   ├── beam.py
│   │   ├── support.py
│   │   └── load.py
│   └── requirements.txt   # Python dependencies
│
└── frontend/              # React Web Application
    ├── public/
    ├── src/
    │   ├── components/    # React components
    │   ├── services/      # API integration
    │   └── App.js        # Main app component
    └── package.json      # Node dependencies
```

## Installation & Setup

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment (recommended):
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Start the Flask server:
```bash
python app.py
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install Node dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Usage

1. **Start Backend**: Run Flask server (must be running first)
2. **Start Frontend**: Run React app
3. **Open Browser**: Navigate to `http://localhost:3000`

### Basic Workflow

1. **Define Beam Properties**
   - Set beam length
   - Configure elastic modulus (E)
   - Set moment of inertia (I)

2. **Add Supports**
   - Choose support type (Fixed, Hinged, Roller)
   - Set position along beam
   - Add settlement if needed (for sinking supports)

3. **Add Loads**
   - Point loads: Position and magnitude
   - UDL: Start, end positions, and intensity
   - VDL: Start, end positions, and varying intensities

4. **Analyze**
   - Click "Analyze Beam" button
   - View results, reactions, and diagrams

## API Endpoints

### `POST /analyze`

Analyze beam structure and return results.

**Request Body:**
```json
{
  "length": 10,
  "E": 200000000,
  "I": 0.0001,
  "supports": [
    {"position": 0, "type": "fixed", "settlement": 0},
    {"position": 10, "type": "roller", "settlement": 0}
  ],
  "loads": [
    {"type": "point", "position": 5, "magnitude": 50},
    {"type": "udl", "start": 0, "end": 10, "magnitude": 10}
  ]
}
```

**Response:**
```json
{
  "support_moments": [0, 0],
  "reactions": [...],
  "shear_force_diagram": [...],
  "bending_moment_diagram": [...],
  "spans": [[0, 10]]
}
```

### `POST /validate`

Validate input without performing analysis.

### `GET /health`

Check API health status.

## Technical Details

### Analysis Methods

- **Simple Beams**: Direct equilibrium equations
- **Continuous Beams**: Moment distribution method
- **Support Settlements**: Modified slope-deflection
- **Fixed End Moments**: Standard formulas for various load cases

### Calculations

The system uses:
- Moment distribution for continuous beams
- Superposition for composite loads
- Numerical integration for diagram generation

## Deployment

### Vercel Deployment (Frontend)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy frontend:
```bash
cd frontend
vercel
```

### Backend Deployment

For Python backend, consider:
- **Render**: Easy Python hosting
- **Railway**: Simple deployment
- **Heroku**: Classic platform
- **PythonAnywhere**: Python-specific hosting

## Example Problems

### Example 1: Simply Supported Beam with UDL

```json
{
  "length": 10,
  "supports": [
    {"position": 0, "type": "hinged"},
    {"position": 10, "type": "roller"}
  ],
  "loads": [
    {"type": "udl", "start": 0, "end": 10, "magnitude": 10}
  ]
}
```

### Example 2: Continuous Beam

```json
{
  "length": 15,
  "supports": [
    {"position": 0, "type": "fixed"},
    {"position": 5, "type": "roller"},
    {"position": 10, "type": "roller"},
    {"position": 15, "type": "roller"}
  ],
  "loads": [
    {"type": "point", "position": 2.5, "magnitude": 50},
    {"type": "udl", "start": 5, "end": 10, "magnitude": 15}
  ]
}
```

## Troubleshooting

### API Connection Issues

- Ensure backend is running on port 5000
- Check CORS settings in Flask app
- Verify firewall settings

### Installation Issues

- Python: Use Python 3.8+
- Node: Use Node 16+
- Try clearing npm cache: `npm cache clean --force`

## License

Educational project for CEG 410 - Structural Analysis

## Credits

Developed for CEG 410 Project
Structural Analysis Tool for Beam and Frame Design
