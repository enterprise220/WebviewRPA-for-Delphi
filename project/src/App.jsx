import { useState, useEffect, useCallback } from 'react'
import { PlayIcon, StopIcon, ArrowPathIcon, DocumentTextIcon, TrashIcon, ClipboardIcon } from '@heroicons/react/24/solid'
import ReactJson from 'react-json-view'
import './App.css'

function App() {
  const [automationData, setAutomationData] = useState({
    input: '',
    parameters: {},
    logs: []
  })
  const [response, setResponse] = useState(null)
  const [activeTab, setActiveTab] = useState('control')

  // Setup communication with Delphi
  useEffect(() => {
    const handleMessage = (event) => {
      const data = event.data
      if (data.type === 'fromDelphi') {
        setResponse(data)
        if (data.logs) {
          setAutomationData(prev => ({
            ...prev,
            logs: [...prev.logs, { timestamp: new Date().toISOString(), ...data }]
          }))
        }
      }
    }

    window.addEventListener('message', handleMessage)
    window.postMessage({ type: 'webviewReady' }, '*')

    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const sendToDelphi = useCallback((action, additionalData = {}) => {
    const message = {
      type: 'toDelphi',
      action,
      timestamp: new Date().toISOString(),
      data: {
        input: automationData.input,
        parameters: automationData.parameters,
        ...additionalData
      }
    }
    window.postMessage(message, '*')
  }, [automationData])

  const addParameter = () => {
    const key = prompt('Enter parameter name:')
    const value = prompt('Enter parameter value:')
    if (key && value) {
      setAutomationData(prev => ({
        ...prev,
        parameters: { ...prev.parameters, [key]: value }
      }))
    }
  }

  const removeParameter = (key) => {
    setAutomationData(prev => {
      const newParams = { ...prev.parameters }
      delete newParams[key]
      return { ...prev, parameters: newParams }
    })
  }

  const clearLogs = () => {
    setAutomationData(prev => ({ ...prev, logs: [] }))
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2))
  }

  return (
    <div className="app-container">
      <h1>WebView4Delphi RPA Integration</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === 'control' ? 'active' : ''} 
          onClick={() => setActiveTab('control')}
        >
          Control Panel
        </button>
        <button 
          className={activeTab === 'logs' ? 'active' : ''} 
          onClick={() => setActiveTab('logs')}
        >
          Logs
        </button>
      </div>

      {activeTab === 'control' ? (
        <div className="control-panel">
          <div className="input-section">
            <div className="input-group">
              <input
                type="text"
                value={automationData.input}
                onChange={(e) => setAutomationData(prev => ({ ...prev, input: e.target.value }))}
                placeholder="Enter automation input data..."
                className="input-field"
              />
            </div>

            <div className="parameters-section">
              <div className="parameters-header">
                <h3>Parameters</h3>
                <button onClick={addParameter} className="small-button">
                  Add Parameter
                </button>
              </div>
              <div className="parameters-list">
                {Object.entries(automationData.parameters).map(([key, value]) => (
                  <div key={key} className="parameter-item">
                    <span>{key}: {value}</span>
                    <button 
                      onClick={() => removeParameter(key)}
                      className="icon-button"
                      title="Remove parameter"
                    >
                      <TrashIcon className="icon" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="button-group">
            <button onClick={() => sendToDelphi('start')} className="action-button">
              <PlayIcon className="icon" />
              Start Automation
            </button>
            <button onClick={() => sendToDelphi('stop')} className="action-button">
              <StopIcon className="icon" />
              Stop Automation
            </button>
            <button onClick={() => sendToDelphi('status')} className="action-button">
              <ArrowPathIcon className="icon" />
              Check Status
            </button>
          </div>

          {response && (
            <div className="response-panel">
              <div className="response-header">
                <h3>Response from Delphi:</h3>
                <button 
                  onClick={() => copyToClipboard(response)}
                  className="icon-button"
                  title="Copy to clipboard"
                >
                  <ClipboardIcon className="icon" />
                </button>
              </div>
              <ReactJson 
                src={response} 
                theme="rjv-default"
                name={false}
                collapsed={1}
                displayDataTypes={false}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="logs-panel">
          <div className="logs-header">
            <h3>Automation Logs</h3>
            <div className="logs-actions">
              <button 
                onClick={() => copyToClipboard(automationData.logs)}
                className="icon-button"
                title="Copy logs"
              >
                <ClipboardIcon className="icon" />
              </button>
              <button 
                onClick={clearLogs}
                className="icon-button"
                title="Clear logs"
              >
                <TrashIcon className="icon" />
              </button>
            </div>
          </div>
          <div className="logs-content">
            {automationData.logs.length === 0 ? (
              <p className="no-logs">No logs available</p>
            ) : (
              automationData.logs.map((log, index) => (
                <div key={index} className="log-entry">
                  <div className="log-header">
                    <span className="log-timestamp">{new Date(log.timestamp).toLocaleString()}</span>
                    <button 
                      onClick={() => copyToClipboard(log)}
                      className="icon-button"
                      title="Copy log entry"
                    >
                      <DocumentTextIcon className="icon" />
                    </button>
                  </div>
                  <ReactJson 
                    src={log} 
                    theme="rjv-default"
                    name={false}
                    collapsed={2}
                    displayDataTypes={false}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App