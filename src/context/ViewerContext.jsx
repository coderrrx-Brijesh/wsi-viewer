import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const ViewerContext = createContext();

export const ViewerProvider = ({ children }) => {
  const [boxes, setBoxes] = useState([]);
  const [imageSrc, setImageSrc] = useState('');
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [transformState, setTransformState] = useState({
    scale: 1,
    positionX: 0,
    positionY: 0,
  });
  const [details, setDetails] = useState({});
  const [selectedBox, setSelectedBox] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load JSON data
  useEffect(() => {
    setIsLoading(true);
    fetch('/output.json')
      .then((res) => res.json())
      .then((data) => {
        // Extract metadata
        setDetails({
          id: data.id || 19,
          patient_id: data.patient_id || '7',
          sample_type: 'blood',
          date: '2024-12-09',
          ...data
        });
        
        try {
          // Extract bounding boxes
          const parsed = JSON.parse(data.inference_results);
          if (parsed && parsed.output && parsed.output.detection_results) {
            setBoxes(parsed.output.detection_results);
          }
        } catch (e) {
          console.error("Failed to parse inference results:", e);
          setBoxes([]);
        }
        
        // Set image source
        setImageSrc(data.filename || '7_20241209_024613.png');
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error loading data:", error);
        // Set fallback data in case of error
        setDetails({
          id: 19,
          patient_id: '7',
          sample_type: 'blood',
          date: '2024-12-09'
        });
        setImageSrc('7_20241209_024613.png');
        setIsLoading(false);
      });
  }, []);

  // Get image dimensions
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = `/${imageSrc}`;
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
  }, [imageSrc]);

  // Calculate visible area
  const getVisibleArea = () => {
    const { scale, positionX, positionY } = transformState;
    
    if (!imageDimensions.width || !imageDimensions.height) {
      return { x: 0, y: 0, width: 100, height: 100, scale: 1 };
    }
    
    // Get viewport dimensions - using a more dynamic approach
    const viewportWidth = window.innerWidth; 
    const viewportHeight = window.innerHeight;
    
    // Calculate the actual size of the viewable area in image coordinates
    const visibleWidth = Math.min(100, (viewportWidth / scale) / imageDimensions.width * 100);
    const visibleHeight = Math.min(100, (viewportHeight / scale) / imageDimensions.height * 100);
    
    // Calculate the position as percentages, accounting for scale and padding
    const visibleX = Math.max(0, Math.min(100 - visibleWidth, 
      (-positionX / scale) / (imageDimensions.width / 100)));
    const visibleY = Math.max(0, Math.min(100 - visibleHeight, 
      (-positionY / scale) / (imageDimensions.height / 100)));
    
    return {
      x: visibleX,
      y: visibleY,
      width: visibleWidth,
      height: visibleHeight,
      scale,
    };
  };

  // Calculate number of each type of box
  const getBoxesByType = () => {
    const typeCount = {};
    boxes.forEach(box => {
      const label = box[4];
      typeCount[label] = (typeCount[label] || 0) + 1;
    });
    return typeCount;
  };

  return (
    <ViewerContext.Provider
      value={{
        boxes,
        imageSrc,
        imageDimensions,
        transformState,
        setTransformState,
        details,
        selectedBox,
        setSelectedBox,
        getVisibleArea,
        getBoxesByType,
        isLoading
      }}
    >
      {children}
    </ViewerContext.Provider>
  );
};

// Custom hook for using the context
export const useViewer = () => {
  const context = useContext(ViewerContext);
  if (!context) {
    throw new Error('useViewer must be used within a ViewerProvider');
  }
  return context;
};
