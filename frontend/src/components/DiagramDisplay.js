import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DiagramDisplay = ({ results }) => {
  if (!results) {
    return (
      <div className="results-panel">
        <h2>Results</h2>
        <p style={{ color: '#6b6b7b', textAlign: 'center', padding: '60px 40px', fontSize: '1.1em' }}>
          Configure the beam and click "Analyze" to see results
        </p>
      </div>
    );
  }

  // Prepare Shear Force Diagram data
  const sfdData = {
    labels: results.shear_force_diagram.map(point => point.x.toFixed(2)),
    datasets: [
      {
        label: 'Shear Force (kN)',
        data: results.shear_force_diagram.map(point => point.value),
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.15)',
        fill: true,
        tension: 0.1,
        borderWidth: 2,
        pointBackgroundColor: '#f43f5e',
        pointBorderColor: '#0a0a0f',
        pointBorderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  };

  // Prepare Bending Moment Diagram data
  const bmdData = {
    labels: results.bending_moment_diagram.map(point => point.x.toFixed(2)),
    datasets: [
      {
        label: 'Bending Moment (kN⋅m)',
        data: results.bending_moment_diagram.map(point => point.value),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#0a0a0f',
        pointBorderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#a0a0b0',
          font: { size: 12, weight: '600' },
          padding: 20,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#1a1a24',
        titleColor: '#ffffff',
        bodyColor: '#a0a0b0',
        borderColor: '#2a2a3a',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Position along beam (m)',
          color: '#a0a0b0',
          font: { size: 13, weight: '600' }
        },
        grid: {
          display: true,
          color: 'rgba(99, 102, 241, 0.1)',
        },
        ticks: {
          color: '#6b6b7b',
          font: { size: 11 }
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
          color: '#a0a0b0',
          font: { size: 13, weight: '600' }
        },
        grid: {
          display: true,
          color: 'rgba(99, 102, 241, 0.1)',
        },
        ticks: {
          color: '#6b6b7b',
          font: { size: 11 }
        },
      },
    },
  };

  // Calculate max values for summary
  const maxShear = Math.max(...results.shear_force_diagram.map(p => Math.abs(p.value)));
  const maxMoment = Math.max(...results.bending_moment_diagram.map(p => Math.abs(p.value)));

  return (
    <div className="results-panel">
      <h2>Analysis Results</h2>

      {/* Summary Cards */}
      <div className="results-summary">
        <div className="result-card">
          <h3>Beam Length</h3>
          <p>{results.beam.length} m</p>
        </div>
        <div className="result-card">
          <h3>Number of Spans</h3>
          <p>{results.spans.length}</p>
        </div>
        <div className="result-card">
          <h3>Max Shear Force</h3>
          <p>{maxShear.toFixed(2)} kN</p>
        </div>
        <div className="result-card">
          <h3>Max Moment</h3>
          <p>{maxMoment.toFixed(2)} kN⋅m</p>
        </div>
      </div>

      {/* Support Reactions Table */}
      <div className="section">
        <h3 style={{ fontSize: '1.2em', marginBottom: '15px', color: '#ffffff', fontWeight: '700' }}>Support Reactions</h3>
        <table className="reactions-table">
          <thead>
            <tr>
              <th>Support Position (m)</th>
              <th>Vertical Reaction (kN)</th>
              <th>Horizontal Reaction (kN)</th>
              <th>Moment (kN⋅m)</th>
            </tr>
          </thead>
          <tbody>
            {results.reactions.map((reaction, index) => (
              <tr key={index}>
                <td>{reaction.position.toFixed(2)}</td>
                <td>{reaction.vertical.toFixed(3)}</td>
                <td>{reaction.horizontal.toFixed(3)}</td>
                <td>{reaction.moment.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Shear Force Diagram */}
      <div className="diagram-container">
        <div className="diagram-title">Shear Force Diagram (SFD)</div>
        <div style={{ height: '300px' }}>
          <Line data={sfdData} options={chartOptions} />
        </div>
      </div>

      {/* Bending Moment Diagram */}
      <div className="diagram-container">
        <div className="diagram-title">Bending Moment Diagram (BMD)</div>
        <div style={{ height: '300px' }}>
          <Line data={bmdData} options={chartOptions} />
        </div>
      </div>

      {/* Support Moments */}
      {results.support_moments && results.support_moments.length > 0 && (
        <div className="section">
          <h3 style={{ fontSize: '1.2em', marginBottom: '15px', color: '#ffffff', fontWeight: '700' }}>Support Moments</h3>
          <div style={{ background: '#12121a', padding: '18px', borderRadius: '12px', border: '1px solid #2a2a3a' }}>
            {results.support_moments.map((moment, index) => (
              <div key={index} style={{ marginBottom: '10px', color: '#a0a0b0', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6366f1', fontWeight: '600' }}>Support {index + 1}</span>
                <span style={{ fontFamily: 'monospace', color: '#ffffff' }}>{moment.toFixed(3)} kN⋅m</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagramDisplay;
