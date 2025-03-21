// src/components/MiniMap.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useViewer } from '../context/ViewerContext';

function MiniMap() {
  const { 
    imageSrc, 
    transformState, 
    setTransformState, 
    boxes,
    isLoading
  } = useViewer();
  
  const miniMapRef = useRef(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  const [showFullImage, setShowFullImage] = useState(false); // Toggle for full/compact view
  
  // Calculate dimensions once minimap container is available
  useEffect(() => {
    if (miniMapRef.current) {
      const { offsetWidth, offsetHeight } = miniMapRef.current;
      setMapDimensions({ width: offsetWidth, height: offsetHeight });
    }
    
    // Set up a resize observer to update dimensions when container size changes
    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setMapDimensions({ width, height });
    });
    
    if (miniMapRef.current) {
      resizeObserver.observe(miniMapRef.current);
    }
    
    return () => {
      if (miniMapRef.current) {
        resizeObserver.disconnect();
      }
    };
  }, []);
  
  // Calculate viewport indicator position and size
  const getViewportStyles = () => {
    if (!transformState || transformState.scale <= 1) {
      return {
        display: 'none'
      };
    }
    
    // Get container center point in image coordinates
    const viewportWidth = 100 / transformState.scale;
    const viewportHeight = 100 / transformState.scale;
    
    // Get the top-left corner of the viewport in percentage
    const percentX = (-transformState.positionX / transformState.scale) / 100;
    const percentY = (-transformState.positionY / transformState.scale) / 100;
    
    return {
      left: `${Math.max(0, Math.min(100, percentX * 100))}%`,
      top: `${Math.max(0, Math.min(100, percentY * 100))}%`,
      width: `${Math.min(100, viewportWidth)}%`,
      height: `${Math.min(100, viewportHeight)}%`,
      display: 'block'
    };
  };
  
  // Handle clicking on the minimap to navigate
  const handleMiniMapClick = (e) => {
    if (!miniMapRef.current || !imageSrc) return;
    
    const rect = miniMapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate the percentage position within the minimap
    const percentX = x / rect.width;
    const percentY = y / rect.height;
    
    // Calculate the new position for the main viewer
    // We need to account for the current scale
    const newPositionX = -percentX * 100 * transformState.scale;
    const newPositionY = -percentY * 100 * transformState.scale;
    
    setTransformState({
      ...transformState,
      positionX: newPositionX,
      positionY: newPositionY
    });
  };
  
  // Toggle between full and compact view
  const toggleView = () => {
    setShowFullImage(!showFullImage);
  };
  
  const viewportStyles = getViewportStyles();
  
  return (
    <div className="minimap-container">
      <div className="minimap-header">
        <h3 className="minimap-title">Navigation</h3>
        <button className="minimap-toggle" onClick={toggleView}>
          {showFullImage ? 'Compact View' : 'Expand View'}
        </button>
      </div>
      
      <div className={`minimap-content ${showFullImage ? 'expanded' : ''}`} ref={miniMapRef}>
        {isLoading ? (
          <div className="minimap-loading">
            <div className="spinner-sm"></div>
          </div>
        ) : imageSrc ? (
          <>
            <img 
              src={`/${imageSrc}`} 
              alt="Mini Map" 
              className="minimap-image"
              onClick={handleMiniMapClick}
            />
            
            {/* Viewport indicator */}
            <div 
              className="viewport-indicator"
              style={viewportStyles}
            />
            
            {/* Boxes on minimap */}
            {boxes && boxes.length > 0 && boxes.map((box, idx) => {
              if (!box || box.length < 5) return null;
              
              const [x1, y1, x2, y2, label] = box;
              return (
                <div 
                  key={idx} 
                  className={`minimap-box minimap-box-${label}`}
                  style={{
                    left: `${(x1 / 100) * 100}%`,
                    top: `${(y1 / 100) * 100}%`,
                    width: `${((x2 - x1) / 100) * 100}%`,
                    height: `${((y2 - y1) / 100) * 100}%`
                  }}
                  title={label}
                />
              );
            })}
          </>
        ) : (
          <div className="minimap-placeholder">
            <span>No image loaded</span>
          </div>
        )}
      </div>
      
      <div className="minimap-info">
        <div className="info-row">
          <div className="info-label">Scale:</div>
          <div className="info-value">{transformState.scale.toFixed(2)}x</div>
        </div>
        <div className="info-row">
          <div className="info-label">Position:</div>
          <div className="info-value">
            X: {Math.round(transformState.positionX)}, Y: {Math.round(transformState.positionY)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiniMap;
