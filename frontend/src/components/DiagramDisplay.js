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
        <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>
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
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.1,
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
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
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
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Position along beam (m)',
          font: { size: 14, weight: 'bold' }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
          font: { size: 14, weight: 'bold' }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
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
        <h3 style={{ fontSize: '1.3em', marginBottom: '15px' }}>Support Reactions</h3>
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
          <h3 style={{ fontSize: '1.3em', marginBottom: '15px' }}>Support Moments</h3>
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
            {results.support_moments.map((moment, index) => (
              <div key={index} style={{ marginBottom: '8px' }}>
                <strong>Support {index + 1}:</strong> {moment.toFixed(3)} kN⋅m
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagramDisplay;
