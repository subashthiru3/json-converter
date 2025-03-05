'use client'
import { useState } from 'react'
import './App.css'

function JsonViewer({ data }) {
    const formatValue = (value) => {
      if (value === null) return <span className="null">null</span>;
      if (typeof value === 'boolean') return <span className="boolean">{value.toString()}</span>;
      if (typeof value === 'number') return <span className="number">{value}</span>;
      if (typeof value === 'string') return <span className="string">"{value}"</span>;
      return value;
    };
  
    const renderJson = (obj, level = 0) => {
      if (Array.isArray(obj)) {
        return (
          <div className="array" style={{ marginLeft: `${level * 20}px` }}>
            [
            {obj.map((item, index) => (
              <div key={index} className="array-item">
                {renderJson(item, level + 1)}
                {index < obj.length - 1 && ','}
              </div>
            ))}
            ]
          </div>
        );
      }
  
      if (typeof obj === 'object' && obj !== null) {
        return (
          <div className="object" style={{ marginLeft: `${level * 20}px` }}>
            {'{'}
            {Object.entries(obj).map(([key, value], index, array) => (
              <div key={key} className="object-item">
                <span className="key">"{key}"</span>: {renderJson(value, level + 1)}
                {index < array.length - 1 && ','}
              </div>
            ))}
            {'}'}
          </div>
        );
      }
  
      return formatValue(obj);
    };
  
    return (
      <div className="json-viewer">
        {renderJson(data)}
      </div>
    );
  }
  
  function App() {
    const [jsonInput, setJsonInput] = useState({});
    const [parsedJson, setParsedJson] = useState(null);
    const [error, setError] = useState(null);
    const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  
    const handleInputChange = (e) => {
      setJsonInput(e.target.value);
      try {
        const parsed = JSON.parse(e.target.value);
        setParsedJson(parsed);
        setError(null);
      } catch (err) {
        setError('Invalid JSON format');
        setParsedJson(null);
      }
    };
  
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        setShowCopyFeedback(true);
        setTimeout(() => setShowCopyFeedback(false), 2000);
      });
    };
  
    const handleCopyInput = () => {
      copyToClipboard(jsonInput);
    };
  
    const handleCopyFormatted = () => {
      if (parsedJson) {
        const formattedJson = JSON.stringify(parsedJson, null, 2);
        copyToClipboard(formattedJson);
      }
    };
  
    return (
      <div className="app-container">
        <h1>JSON Viewer</h1>
        <div className="editor-container">
          <div className="input-section">
            <div className="section-header">
              <h2>Input JSON</h2>
              <button className="copy-button" onClick={handleCopyInput}>
                Copy Input
              </button>
            </div>
            <textarea
              value={jsonInput}
              onChange={handleInputChange}
              placeholder="Enter your JSON here..."
              rows="15"
            />
            {error && <div className="error">{error}</div>}
          </div>
          <div className="output-section">
            <div className="section-header">
              <h2>Formatted Output</h2>
              <button 
                className="copy-button" 
                onClick={handleCopyFormatted}
                disabled={!parsedJson}
              >
                Copy Formatted JSON
              </button>
            </div>
            <div className="output-container">
              {parsedJson && <JsonViewer data={parsedJson} />}
            </div>
          </div>
        </div>
        {showCopyFeedback && (
          <div className="copy-feedback">
            Copied to clipboard!
          </div>
        )}
      </div>
    );
  }
  
  export default App
