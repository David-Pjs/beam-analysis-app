import React, { useState } from 'react';

const BeamInput = ({ onBeamChange }) => {
  const [beamData, setBeamData] = useState({
    length: 10,
    E: 200000000, // 200 GPa in kN/m²
    I: 0.0001,    // m⁴
  });

  const handleChange = (field, value) => {
    const updated = { ...beamData, [field]: parseFloat(value) || 0 };
    setBeamData(updated);
    onBeamChange(updated);
  };

  return (
    <div className="section">
      <h2>Beam Properties</h2>

      <div className="input-group">
        <label>Beam Length (m)</label>
        <input
          type="number"
          step="0.1"
          value={beamData.length}
          onChange={(e) => handleChange('length', e.target.value)}
          placeholder="Enter beam length"
        />
      </div>

      <div className="input-group">
        <label>Elastic Modulus E (kN/m²)</label>
        <input
          type="number"
          step="1000000"
          value={beamData.E}
          onChange={(e) => handleChange('E', e.target.value)}
          placeholder="e.g., 200000000 for steel"
        />
        <small style={{ color: '#666', fontSize: '0.85em' }}>
          Default: 200 GPa (Steel)
        </small>
      </div>

      <div className="input-group">
        <label>Moment of Inertia I (m⁴)</label>
        <input
          type="number"
          step="0.0001"
          value={beamData.I}
          onChange={(e) => handleChange('I', e.target.value)}
          placeholder="e.g., 0.0001"
        />
        <small style={{ color: '#666', fontSize: '0.85em' }}>
          Cross-sectional property
        </small>
      </div>
    </div>
  );
};

export default BeamInput;
