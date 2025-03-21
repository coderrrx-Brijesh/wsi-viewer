// src/components/LeftPanel.jsx
import React, { useState } from 'react';
import { useViewer } from '../context/ViewerContext';

function LeftPanel() {
  const { 
    selectedBox, 
    details, 
    getBoxesByType,
    isLoading,
    boxes
  } = useViewer();

  // State for active tab
  const [activeTab, setActiveTab] = useState('rbc');

  // Get counts by label type
  const boxesByType = getBoxesByType();
  
  // Prepare data for the tabs
  const rbcData = [
    { type: 'Angled Cells', count: 222, percentage: '67%' },
    { type: 'Borderline Ovalocytes', count: 50, percentage: '20%' },
    { type: 'Burr Cells', count: 87, percentage: '34%' },
    { type: 'Fragmented Cells', count: 2, percentage: '0.12%' },
    { type: 'Ovalocytes', count: 0, percentage: '0%' },
    { type: 'Rounded RBC', count: 0, percentage: '0%' },
    { type: 'Teardrop', count: 0, percentage: '0%' }
  ];

  const wbcData = [
    { type: 'Basophil', count: 222, percentage: '67%' },
    { type: 'Eosinophil', count: 50, percentage: '20%' },
    { type: 'Lymphocyte', count: 87, percentage: '34%' },
    { type: 'Monocyte', count: 2, percentage: '0.12%' }
  ];

  const plateletData = [
    { type: 'Count', count: 222, percentage: '' },
    { type: 'Percentage', count: 222, percentage: '' }
  ];

  // Calculate total cell count
  const totalCells = Object.values(boxesByType).reduce((sum, count) => sum + count, 0) || 
                    rbcData.reduce((sum, item) => sum + item.count, 0);

  // Helper function to render table
  const renderTable = (data) => {
    return (
      <table className="data-table">
        <thead>
          <tr>
            <th>{activeTab.toUpperCase()}</th>
            <th>Count</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.type}</td>
              <td>{row.count}</td>
              <td>{row.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Helper function to handle going back to hub view
  const handleBackToHub = () => {
    // In a real app, this would navigate back to the hub or parent view
    alert('This would navigate back to the hub view');
  };

  return (
    <div className="left-panel-container">
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {/* Back button */}
          <div className="back-button-container">
            <button onClick={handleBackToHub} className="back-button">
              ← Back to Hub
            </button>
          </div>

          {/* Data tables */}
          <div className="tabs-container">
            <div className="tabs-header">
              <button 
                className={`tab-button ${activeTab === 'rbc' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('rbc')}
              >
                RBC
              </button>
              <button 
                className={`tab-button ${activeTab === 'wbc' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('wbc')}
              >
                WBC
              </button>
              <button 
                className={`tab-button ${activeTab === 'platelets' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('platelets')}
              >
                Platelets
              </button>
            </div>
            
            <div className="tabs-content">
              <div className={`tab-panel ${activeTab === 'rbc' ? 'active-panel' : ''}`}>
                {renderTable(rbcData)}
              </div>
              <div className={`tab-panel ${activeTab === 'wbc' ? 'active-panel' : ''}`}>
                {renderTable(wbcData)}
              </div>
              <div className={`tab-panel ${activeTab === 'platelets' ? 'active-panel' : ''}`}>
                {renderTable(plateletData)}
              </div>
            </div>
          </div>

          {/* Patient information */}
          <div className="card sample-details">
            <div className="card-header">Sample Details</div>
            <div className="card-body">
              <div className="detail-row">
                <span className="detail-label">Patient ID:</span>
                <span className="detail-value">{details?.patient_id || '7'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Sample Type:</span>
                <span className="detail-value">{details?.sample_type || 'Blood'}</span>
              </div>
            </div>
          </div>

          {/* Report button */}
          <div className="report-button-container">
            <button className="btn-primary report-button">
              Generate Report
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default LeftPanel;
