import React, { useState } from 'react';

const SupportManager = ({ supports, onSupportsChange, beamLength }) => {
  const [newSupport, setNewSupport] = useState({
    position: 0,
    type: 'roller',
    settlement: 0,
  });

  const addSupport = () => {
    // Validate
    if (newSupport.position < 0 || newSupport.position > (beamLength || 10)) {
      alert('Support position must be within beam length');
      return;
    }

    // Check for duplicate positions
    const duplicate = supports.find(s => Math.abs(s.position - newSupport.position) < 0.01);
    if (duplicate) {
      alert('A support already exists at this position');
      return;
    }

    onSupportsChange([...supports, { ...newSupport }]);

    // Reset
    setNewSupport({
      ...newSupport,
      position: 0,
      settlement: 0,
    });
  };

  const removeSupport = (index) => {
    if (supports.length <= 2) {
      alert('Beam must have at least 2 supports');
      return;
    }
    const updated = supports.filter((_, i) => i !== index);
    onSupportsChange(updated);
  };

  return (
    <div className="section">
      <h2>Supports</h2>

      <div className="input-group">
        <label>Support Type</label>
        <select
          value={newSupport.type}
          onChange={(e) => setNewSupport({ ...newSupport, type: e.target.value })}
        >
          <option value="fixed">Fixed (No movement, no rotation)</option>
          <option value="hinged">Hinged (No movement, can rotate)</option>
          <option value="roller">Roller (Can roll horizontally)</option>
        </select>
      </div>

      <div className="input-group">
        <label>Position (m)</label>
        <input
          type="number"
          step="0.1"
          value={newSupport.position}
          onChange={(e) => setNewSupport({ ...newSupport, position: parseFloat(e.target.value) || 0 })}
        />
      </div>

      <div className="input-group">
        <label>Settlement (m)</label>
        <input
          type="number"
          step="0.001"
          value={newSupport.settlement}
          onChange={(e) => setNewSupport({ ...newSupport, settlement: parseFloat(e.target.value) || 0 })}
        />
        <small style={{ color: '#666', fontSize: '0.85em' }}>
          Positive = downward settlement (sinking)
        </small>
      </div>

      <button className="button button-success" onClick={addSupport}>
        + Add Support
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '1.1em', marginBottom: '10px' }}>Supports ({supports.length})</h3>
        {supports.length === 0 ? (
          <p style={{ color: '#999', fontStyle: 'italic' }}>No supports added yet</p>
        ) : (
          supports.map((support, index) => (
            <div key={index} className="support-item">
              {supports.length > 2 && (
                <button className="support-item-remove" onClick={() => removeSupport(index)}>
                  ×
                </button>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: '#667eea', marginBottom: '5px' }}>
                    {support.type.charAt(0).toUpperCase() + support.type.slice(1)}
                  </h4>
                  <p style={{ fontSize: '0.9em' }}>
                    Position: {support.position}m
                    {support.settlement !== 0 && ` | Settlement: ${support.settlement}m`}
                  </p>
                </div>
                <div style={{
                  fontSize: '2em',
                  color: support.type === 'fixed' ? '#ff4757' : support.type === 'hinged' ? '#ffa502' : '#2ed573'
                }}>
                  {support.type === 'fixed' && '⬛'}
                  {support.type === 'hinged' && '🔘'}
                  {support.type === 'roller' && '⚪'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SupportManager;
