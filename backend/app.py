"""
Flask API for Beam and Frame Analysis
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import sys
import os
import time

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models.beam import Beam
from models.support import Support
from models.load import PointLoad, UniformlyDistributedLoad, VaryingDistributedLoad
from calculations.beam_analysis import analyze_continuous_beam

app = Flask(__name__)

# Security: Configure CORS with specific origins
ALLOWED_ORIGINS = [
    "https://frontend-smoky-nine-14.vercel.app",
    "https://*.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]
CORS(app, origins=ALLOWED_ORIGINS, methods=["GET", "POST", "OPTIONS"])

# Security: Rate limiting (simple in-memory implementation)
rate_limit_store = {}
RATE_LIMIT = 60  # requests per minute
RATE_WINDOW = 60  # seconds

def get_client_ip():
    """Get client IP address"""
    if request.headers.get('X-Forwarded-For'):
        return request.headers.get('X-Forwarded-For').split(',')[0].strip()
    return request.remote_addr or 'unknown'

def rate_limit(f):
    """Rate limiting decorator"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        client_ip = get_client_ip()
        current_time = time.time()

        # Clean old entries
        rate_limit_store[client_ip] = [
            t for t in rate_limit_store.get(client_ip, [])
            if current_time - t < RATE_WINDOW
        ]

        if len(rate_limit_store.get(client_ip, [])) >= RATE_LIMIT:
            return jsonify({'error': 'Rate limit exceeded. Please try again later.'}), 429

        rate_limit_store.setdefault(client_ip, []).append(current_time)
        return f(*args, **kwargs)
    return decorated_function

# Security: Input validation limits
MAX_BEAM_LENGTH = 1000  # meters
MAX_SUPPORTS = 20
MAX_LOADS = 50
MAX_MAGNITUDE = 1e12


@app.route('/')
def home():
    """API home endpoint"""
    return jsonify({
        'message': 'Beam and Frame Analysis API',
        'version': '1.0.0',
        'endpoints': {
            '/analyze': 'POST - Analyze beam structure',
            '/health': 'GET - Health check'
        }
    })


@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})


@app.route('/analyze', methods=['POST'])
@rate_limit
def analyze():
    """
    Main analysis endpoint

    Expected JSON format:
    {
        "length": 10,
        "E": 200000000,
        "I": 0.0001,
        "supports": [
            {"position": 0, "type": "fixed", "settlement": 0},
            {"position": 5, "type": "roller", "settlement": 0},
            {"position": 10, "type": "roller", "settlement": 0}
        ],
        "loads": [
            {"type": "point", "position": 2.5, "magnitude": 50},
            {"type": "udl", "start": 5, "end": 10, "magnitude": 10},
            {"type": "vdl", "start": 0, "end": 5, "magnitude_start": 0, "magnitude_end": 20}
        ]
    }
    """
    try:
        data = request.get_json()

        # Validate required fields
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        required_fields = ['length', 'supports', 'loads']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Security: Validate input limits
        if not isinstance(data['length'], (int, float)) or data['length'] <= 0 or data['length'] > MAX_BEAM_LENGTH:
            return jsonify({'error': f'Beam length must be between 0 and {MAX_BEAM_LENGTH} meters'}), 400

        if len(data['supports']) > MAX_SUPPORTS:
            return jsonify({'error': f'Maximum {MAX_SUPPORTS} supports allowed'}), 400

        if len(data['loads']) > MAX_LOADS:
            return jsonify({'error': f'Maximum {MAX_LOADS} loads allowed'}), 400

        # Create beam
        beam = Beam(
            length=float(data['length']),
            E=float(data.get('E', 200e6)),  # Default: 200 GPa
            I=float(data.get('I', 1.0))     # Default: 1.0 m^4
        )

        # Add supports
        if len(data['supports']) < 2:
            return jsonify({'error': 'Beam must have at least 2 supports'}), 400

        for support_data in data['supports']:
            support = Support(
                position=float(support_data['position']),
                support_type=support_data['type'],
                settlement=float(support_data.get('settlement', 0.0))
            )
            beam.add_support(support)

        # Add loads
        for load_data in data['loads']:
            load_type = load_data['type']

            if load_type == 'point':
                load = PointLoad(
                    position=float(load_data['position']),
                    magnitude=float(load_data['magnitude'])
                )

            elif load_type == 'udl':
                load = UniformlyDistributedLoad(
                    start=float(load_data['start']),
                    end=float(load_data['end']),
                    magnitude=float(load_data['magnitude'])
                )

            elif load_type == 'vdl':
                load = VaryingDistributedLoad(
                    start=float(load_data['start']),
                    end=float(load_data['end']),
                    magnitude_start=float(load_data['magnitude_start']),
                    magnitude_end=float(load_data['magnitude_end'])
                )

            else:
                return jsonify({'error': f'Unknown load type: {load_type}'}), 400

            beam.add_load(load)

        # Perform analysis
        results = analyze_continuous_beam(beam)

        # Add beam info to results
        results['beam'] = beam.to_dict()

        return jsonify(results)

    except ValueError as e:
        return jsonify({'error': f'Invalid input: {str(e)}'}), 400

    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500


@app.route('/validate', methods=['POST'])
@rate_limit
def validate_input():
    """Validate input without performing analysis"""
    try:
        data = request.get_json()

        errors = []
        warnings = []

        # Check beam length
        if 'length' not in data or data['length'] <= 0:
            errors.append('Beam length must be positive')

        # Check supports
        if 'supports' not in data:
            errors.append('Supports are required')
        elif len(data['supports']) < 2:
            errors.append('At least 2 supports are required')
        else:
            # Validate support positions
            for i, support in enumerate(data['supports']):
                pos = support.get('position', -1)
                if pos < 0 or pos > data.get('length', 0):
                    errors.append(f'Support {i+1} position out of beam range')

                if support.get('type') not in ['fixed', 'hinged', 'roller']:
                    errors.append(f'Support {i+1} has invalid type')

        # Check loads
        if 'loads' in data:
            for i, load in enumerate(data['loads']):
                load_type = load.get('type')

                if load_type == 'point':
                    if load.get('position', -1) < 0 or load.get('position', -1) > data.get('length', 0):
                        errors.append(f'Point load {i+1} position out of beam range')

                elif load_type in ['udl', 'vdl']:
                    start = load.get('start', -1)
                    end = load.get('end', -1)

                    if start < 0 or end > data.get('length', 0) or start >= end:
                        errors.append(f'Distributed load {i+1} has invalid range')
        else:
            warnings.append('No loads specified')

        return jsonify({
            'valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'

    print("Starting Beam Analysis API server...")
    print(f"API available at: http://0.0.0.0:{port}")

    app.run(debug=debug, host='0.0.0.0', port=port)
