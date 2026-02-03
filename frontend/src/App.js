import React, { useState, useEffect } from 'react';
import './App.css';
import BeamInput from './components/BeamInput';
import SupportManager from './components/SupportManager';
import LoadManager from './components/LoadManager';
import DiagramDisplay from './components/DiagramDisplay';
import { analyzeBeam, checkHealth } from './services/api';

function App() {
  const [beamData, setBeamData] = useState({
    length: 10,
    E: 200000000,
    I: 0.0001,
  });

  const [supports, setSupports] = useState([
    { position: 0, type: 'fixed', settlement: 0 },
    { position: 10, type: 'roller', settlement: 0 },
  ]);

  const [loads, setLoads] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');

  // Check API health on mount
  useEffect(() => {
    checkHealth()
      .then(() => setApiStatus('connected'))
      .catch(() => setApiStatus('disconnected'));
  }, []);

  const handleAnalyze = async () => {
    setError(null);
    setLoading(true);

    try {
      // Validate input
      if (supports.length < 2) {
        throw new Error('At least 2 supports are required');
      }

      if (loads.length === 0) {
        throw new Error('At least 1 load is required');
      }

      // Prepare data for API
      const analysisData = {
        length: beamData.length,
        E: beamData.E,
        I: beamData.I,
        supports: supports,
        loads: loads,
      };

      // Call API
      const response = await analyzeBeam(analysisData);
      setResults(response);

    } catch (err) {
      setError(err.message || 'Analysis failed. Please check your input.');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSupports([
      { position: 0, type: 'fixed', settlement: 0 },
      { position: beamData.length, type: 'roller', settlement: 0 },
    ]);
    setLoads([]);
    setResults(null);
    setError(null);
  };

  const loadExample = () => {
    // Example: Simply supported beam with UDL
    setBeamData({
      length: 10,
      E: 200000000,
      I: 0.0001,
    });

    setSupports([
      { position: 0, type: 'hinged', settlement: 0 },
      { position: 10, type: 'roller', settlement: 0 },
    ]);

    setLoads([
      { type: 'udl', start: 0, end: 10, magnitude: 10 },
      { type: 'point', position: 5, magnitude: 50 },
    ]);

    setError(null);
    setResults(null);
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Beam & Frame Analysis</h1>
        <p>Professional Structural Engineering Tool</p>
        <div className="api-status">
          API Status:
          <span className={`status-badge ${apiStatus}`}>
            {apiStatus === 'connected' && '✓ Connected'}
            {apiStatus === 'disconnected' && '✗ Disconnected'}
            {apiStatus === 'checking' && '⟳ Checking...'}
          </span>
        </div>
      </div>

      <div className="main-container">
        {/* Left Panel - Input */}
        <div className="input-panel">
          <BeamInput onBeamChange={setBeamData} />

          <SupportManager
            supports={supports}
            onSupportsChange={setSupports}
            beamLength={beamData.length}
          />

          <LoadManager
            loads={loads}
            onLoadsChange={setLoads}
            beamLength={beamData.length}
          />

          <div className="section">
            <button
              className="button button-primary"
              onClick={handleAnalyze}
              disabled={loading || apiStatus !== 'connected'}
            >
              {loading ? 'Analyzing...' : 'Analyze Beam'}
            </button>

            <button
              className="button button-secondary"
              onClick={handleClear}
            >
              Clear All
            </button>

            <button
              className="button button-success"
              onClick={loadExample}
            >
              Load Example
            </button>
          </div>

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          {loading && (
            <div className="loading">
              <div className="loading-spinner"></div>
              Analyzing structure...
            </div>
          )}
        </div>

        {/* Right Panel - Results */}
        <DiagramDisplay results={results} />
      </div>

      <div className="footer">
        <p>CEG 410 - Beam and Frame Analysis Tool</p>
        <p>Supports: Fixed, Hinged, Roller | Loads: Point, UDL, VDL | Features: Multiple Spans, Sinking Supports</p>
      </div>
    </div>
  );
}

export default App;
