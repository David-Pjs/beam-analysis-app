import React, { useState } from 'react';

const LoadManager = ({ loads, onLoadsChange, beamLength }) => {
  const [newLoad, setNewLoad] = useState({
    type: 'point',
    position: 0,
    magnitude: 10,
    start: 0,
    end: beamLength || 10,
    magnitude_start: 10,
    magnitude_end: 20,
  });

  const addLoad = () => {
    const loadToAdd = { ...newLoad };

    // Validate
    if (loadToAdd.type === 'point') {
      if (loadToAdd.position < 0 || loadToAdd.position > (beamLength || 10)) {
        alert('Point load position must be within beam length');
        return;
      }
    } else if (loadToAdd.type === 'udl' || loadToAdd.type === 'vdl') {
      if (loadToAdd.start >= loadToAdd.end) {
        alert('Start position must be less than end position');
        return;
      }
      if (loadToAdd.start < 0 || loadToAdd.end > (beamLength || 10)) {
        alert('Load must be within beam length');
        return;
      }
    }

    onLoadsChange([...loads, loadToAdd]);

    // Reset form
    setNewLoad({
      ...newLoad,
      position: 0,
      start: 0,
      end: beamLength || 10,
    });
  };

  const removeLoad = (index) => {
    const updated = loads.filter((_, i) => i !== index);
    onLoadsChange(updated);
  };

  const renderLoadForm = () => {
    switch (newLoad.type) {
      case 'point':
        return (
          <>
            <div className="input-group">
              <label>Position (m)</label>
              <input
                type="number"
                step="0.1"
                value={newLoad.position}
                onChange={(e) => setNewLoad({ ...newLoad, position: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="input-group">
              <label>Magnitude (kN)</label>
              <input
                type="number"
                step="1"
                value={newLoad.magnitude}
                onChange={(e) => setNewLoad({ ...newLoad, magnitude: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </>
        );

      case 'udl':
        return (
          <>
            <div className="input-group">
              <label>Start Position (m)</label>
              <input
                type="number"
                step="0.1"
                value={newLoad.start}
                onChange={(e) => setNewLoad({ ...newLoad, start: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="input-group">
              <label>End Position (m)</label>
              <input
                type="number"
                step="0.1"
                value={newLoad.end}
                onChange={(e) => setNewLoad({ ...newLoad, end: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="input-group">
              <label>Magnitude (kN/m)</label>
              <input
                type="number"
                step="1"
                value={newLoad.magnitude}
                onChange={(e) => setNewLoad({ ...newLoad, magnitude: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </>
        );

      case 'vdl':
        return (
          <>
            <div className="input-group">
              <label>Start Position (m)</label>
              <input
                type="number"
                step="0.1"
                value={newLoad.start}
                onChange={(e) => setNewLoad({ ...newLoad, start: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="input-group">
              <label>End Position (m)</label>
              <input
                type="number"
                step="0.1"
                value={newLoad.end}
                onChange={(e) => setNewLoad({ ...newLoad, end: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="input-group">
              <label>Magnitude at Start (kN/m)</label>
              <input
                type="number"
                step="1"
                value={newLoad.magnitude_start}
                onChange={(e) => setNewLoad({ ...newLoad, magnitude_start: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="input-group">
              <label>Magnitude at End (kN/m)</label>
              <input
                type="number"
                step="1"
                value={newLoad.magnitude_end}
                onChange={(e) => setNewLoad({ ...newLoad, magnitude_end: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="section">
      <h2>Loads</h2>

      <div className="input-group">
        <label>Load Type</label>
        <select
          value={newLoad.type}
          onChange={(e) => setNewLoad({ ...newLoad, type: e.target.value })}
        >
          <option value="point">Point Load</option>
          <option value="udl">Uniformly Distributed Load (UDL)</option>
          <option value="vdl">Varying Distributed Load (VDL)</option>
        </select>
      </div>

      {renderLoadForm()}

      <button className="button button-success" onClick={addLoad}>
        + Add Load
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '1.1em', marginBottom: '10px' }}>Applied Loads ({loads.length})</h3>
        {loads.length === 0 ? (
          <p style={{ color: '#999', fontStyle: 'italic' }}>No loads added yet</p>
        ) : (
          loads.map((load, index) => (
            <div key={index} className="load-item">
              <button className="load-item-remove" onClick={() => removeLoad(index)}>
                ×
              </button>

              <h4>
                {load.type === 'point' && 'Point Load'}
                {load.type === 'udl' && 'UDL'}
                {load.type === 'vdl' && 'VDL'}
              </h4>

              {load.type === 'point' && (
                <p>Position: {load.position}m | Force: {load.magnitude}kN</p>
              )}

              {load.type === 'udl' && (
                <p>Range: {load.start}m - {load.end}m | Intensity: {load.magnitude}kN/m</p>
              )}

              {load.type === 'vdl' && (
                <p>
                  Range: {load.start}m - {load.end}m |
                  Intensity: {load.magnitude_start}kN/m → {load.magnitude_end}kN/m
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LoadManager;
