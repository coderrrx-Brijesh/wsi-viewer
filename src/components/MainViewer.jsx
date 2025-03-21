// src/components/MainViewer.jsx
import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useViewer } from '../context/ViewerContext';

function MainViewer() {
  const {
    boxes,
    imageSrc,
    setTransformState,
    selectedBox,
    setSelectedBox,
    isLoading
  } = useViewer();

  // State to track view mode
  const [viewMode, setViewMode] = useState('zoomed-in'); // 'zoomed-in' or 'zoomed-out'

  // Handle selection of a bounding box
  const handleBoxClick = (box, index) => {
    setSelectedBox({ box, index });
  };

  // Toggle between view modes
  const toggleViewMode = () => {
    setViewMode(viewMode === 'zoomed-in' ? 'zoomed-out' : 'zoomed-in');
    
    // Reset transform state
    setTransformState({
      scale: 1,
      positionX: 0,
      positionY: 0,
    });
  };

  return (
    <div className="main-viewer-container">
      <div className="viewer-header">
        <div className="viewer-title">
          {viewMode === 'zoomed-in' ? 'WSI Zoomed IN View' : 'WSI Zoomed OUT View (Hub)'}
        </div>
        <button className="view-toggle-button" onClick={toggleViewMode}>
          {viewMode === 'zoomed-in' ? 'Switch to Hub View' : 'Switch to Detail View'}
        </button>
      </div>

      <div className="viewer-content">
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <div className="loading-text">Loading Slide Image...</div>
          </div>
        ) : (
          <TransformWrapper
            defaultScale={1}
            defaultPositionX={0}
            defaultPositionY={0}
            wheel={{ step: 0.1 }}
            pinch={{ step: 5 }}
            doubleClick={{ disabled: false, step: 0.7 }}
            pan={{ paddingSize: 100 }}
            alignmentAnimation={{ disabled: true }}
            velocityAnimation={{ disabled: true }}
            limitToBounds={false}
            disabled={viewMode === 'zoomed-out'} // Disable transform in hub view
            onTransformed={(e) => {
              if (viewMode === 'zoomed-in') {
                // Update the transform state when the user interacts with the viewer
                const { state } = e;
                setTransformState({
                  scale: state.scale,
                  positionX: state.positionX,
                  positionY: state.positionY,
                });
              }
            }}
            initialScale={1}
            maxScale={10}
            minScale={0.5}
          >
            {({ zoomIn, zoomOut, resetTransform, setTransform }) => (
              <>
                <TransformComponent 
                  wrapperStyle={{ 
                    width: '100%', 
                    height: '100%',
                    backgroundColor: '#f0f0f0'
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    {/* The main image */}
                    {imageSrc && (
                      <img
                        src={`/${imageSrc}`}
                        alt="Whole Slide"
                        style={{ 
                          display: 'block', 
                          width: '100%', 
                          height: 'auto',
                          cursor: viewMode === 'zoomed-in' ? 'move' : 'default'
                        }}
                      />
                    )}
                    
                    {/* Bounding Boxes */}
                    {viewMode === 'zoomed-in' && boxes && boxes.length > 0 && boxes.map((box, idx) => {
                      if (!box || box.length < 5) return null;
                      
                      const [x1, y1, x2, y2, label] = box;
                      const isSelected = selectedBox && selectedBox.index === idx;
                      const boxStyle = {
                        position: 'absolute',
                        left: x1,
                        top: y1,
                        width: x2 - x1,
                        height: y2 - y1,
                        border: isSelected ? '3px solid #FFC107' : '2px solid #F44336',
                        backgroundColor: isSelected ? 'rgba(255, 193, 7, 0.2)' : 'rgba(244, 67, 54, 0.05)',
                        boxSizing: 'border-box',
                        cursor: 'pointer',
                        zIndex: isSelected ? 10 : 1,
                        borderRadius: '2px',
                        transition: 'all 0.2s ease'
                      };
                      return (
                        <div 
                          key={idx} 
                          style={boxStyle} 
                          title={label}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBoxClick(box, idx);
                          }}
                        />
                      );
                    })}
                  </div>
                </TransformComponent>

                {viewMode === 'zoomed-in' && (
                  <div className="zoom-controls">
                    <button 
                      onClick={() => zoomIn(0.5)} 
                      className="zoom-button"
                      title="Zoom In"
                    >
                      <span role="img" aria-label="zoom in">🔍+</span>
                    </button>
                    <button 
                      onClick={() => zoomOut(0.5)} 
                      className="zoom-button"
                      title="Zoom Out"
                    >
                      <span role="img" aria-label="zoom out">🔍-</span>
                    </button>
                    <button 
                      onClick={() => {
                        resetTransform();
                        // Make sure we update our context with the reset transform state
                        setTransformState({
                          scale: 1,
                          positionX: 0,
                          positionY: 0,
                        });
                      }} 
                      className="zoom-button"
                      title="Reset View"
                    >
                      <span role="img" aria-label="reset">↩️</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </TransformWrapper>
        )}
      </div>

      <div className="viewer-footer">
        <div className="patient-info">
          <div className="info-item">
            <span className="info-label">Patient ID:</span>
            <span className="info-value">7</span>
          </div>
          <div className="info-item">
            <span className="info-label">Sample Type:</span>
            <span className="info-value">Blood</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainViewer;
