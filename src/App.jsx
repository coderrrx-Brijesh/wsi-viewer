import React from 'react';
import './App.css';
import MainViewer from './components/MainViewer';
import LeftPanel from './components/LeftPanel';
import MiniMap from './components/MiniMap';
import { ViewerProvider } from './context/ViewerContext';

function getCurrentDate() {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
}

function App() {
  return (
    <ViewerProvider>
      <div className="app-container">
        {/* App Header */}
        <header className="app-header">
          <h1 className="app-title">WSI Viewer</h1>
          <div className="app-date">{getCurrentDate()}</div>
        </header>
        
        {/* Main Content */}
        <div className="main-container">
          {/* Left Panel */}
          <div className="panel-left">
            <LeftPanel />
          </div>
          
          {/* Main Viewer */}
          <div className="content-area">
            <MainViewer />
          </div>
          
          {/* Mini Map */}
          <div className="panel-right">
            <MiniMap />
          </div>
        </div>
      </div>
    </ViewerProvider>
  );
}

export default App;
