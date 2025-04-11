import React, { useState, useEffect } from 'react';
import { FaDownload, FaSync, FaTrash, FaInfoCircle, FaDatabase } from 'react-icons/fa';

/**
 * NuanceImportTab Component
 * 
 * Admin interface for importing articles from Nuance.xyz
 * Provides functionality to:
 * - View import history
 * - Trigger manual imports
 * - Configure automated imports
 * - View import logs
 */
const NuanceImportTab = () => {
  const [importStatus, setImportStatus] = useState('idle'); // 'idle', 'importing', 'success', 'error'
  const [importLogs, setImportLogs] = useState([]);
  const [importCount, setImportCount] = useState(0);
  const [articlesCount, setArticlesCount] = useState(0);
  const [lastImport, setLastImport] = useState(null);
  const [importLimit, setImportLimit] = useState(5);
  const [autoImport, setAutoImport] = useState(false);
  const [refreshRate, setRefreshRate] = useState(24); // hours

  // Load settings and stats on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, this would fetch from a backend API
        // For now, we'll use local storage to persist settings
        const settings = JSON.parse(localStorage.getItem('nuanceImportSettings') || '{}');
        const stats = JSON.parse(localStorage.getItem('nuanceImportStats') || '{}');
        
        // Apply settings
        setImportLimit(settings.importLimit || 5);
        setAutoImport(settings.autoImport || false);
        setRefreshRate(settings.refreshRate || 24);
        
        // Apply stats
        setImportCount(stats.importCount || 0);
        setArticlesCount(stats.articlesCount || 0);
        setLastImport(stats.lastImport || null);
        
        // Fetch recent logs
        await fetchLogs();
      } catch (error) {
        console.error('Error loading import settings:', error);
      }
    };
    
    fetchData();
  }, []);

  // Save settings when they change
  useEffect(() => {
    const settings = {
      importLimit,
      autoImport,
      refreshRate
    };
    
    localStorage.setItem('nuanceImportSettings', JSON.stringify(settings));
  }, [importLimit, autoImport, refreshRate]);

  // Fetch logs from the server
  const fetchLogs = async () => {
    try {
      // In a real implementation, this would fetch logs from a server
      // For now, we'll generate some dummy logs
      const now = new Date();
      const dummyLogs = [
        { timestamp: new Date(now - 86400000).toISOString(), level: 'INFO', message: 'Import completed successfully. Processed 5 articles.' },
        { timestamp: new Date(now - 86400000).toISOString(), level: 'INFO', message: 'Updated article metadata in populateBlogPosts.js with 5 entries' },
        { timestamp: new Date(now - 172800000).toISOString(), level: 'INFO', message: 'Processed article: Tether-ing to Reality: How a Stablecoin Superpower is Threatening Crypto's Bull Run' },
        { timestamp: new Date(now - 172800000).toISOString(), level: 'INFO', message: 'Found 12 unique article links' },
        { timestamp: new Date(now - 172800000).toISOString(), level: 'INFO', message: 'Starting Nuance article import' }
      ];
      
      setImportLogs(dummyLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  // Trigger a manual import
  const handleImport = async (force = false) => {
    try {
      setImportStatus('importing');
      
      // In a real implementation, this would make an API call to trigger the import
      // For now, we'll simulate an import with a timeout
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update stats
      const stats = {
        importCount: importCount + 1,
        articlesCount: articlesCount + (force ? importLimit : Math.floor(Math.random() * importLimit) + 1),
        lastImport: new Date().toISOString()
      };
      
      localStorage.setItem('nuanceImportStats', JSON.stringify(stats));
      
      setImportCount(stats.importCount);
      setArticlesCount(stats.articlesCount);
      setLastImport(stats.lastImport);
      
      // Refresh logs
      await fetchLogs();
      
      setImportStatus('success');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setImportStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error importing articles:', error);
      setImportStatus('error');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setImportStatus('idle');
      }, 3000);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="admin-tab-content">
      <h2 className="admin-tab-title">Nuance Article Import</h2>
      
      <div className="import-stats-section">
        <div className="import-stats-card">
          <div className="import-stats-icon">
            <FaDownload />
          </div>
          <div className="import-stats-content">
            <h3>Total Imports</h3>
            <p className="import-stats-value">{importCount}</p>
          </div>
        </div>
        
        <div className="import-stats-card">
          <div className="import-stats-icon">
            <FaDatabase />
          </div>
          <div className="import-stats-content">
            <h3>Articles Imported</h3>
            <p className="import-stats-value">{articlesCount}</p>
          </div>
        </div>
        
        <div className="import-stats-card">
          <div className="import-stats-icon">
            <FaSync />
          </div>
          <div className="import-stats-content">
            <h3>Last Import</h3>
            <p className="import-stats-value">{formatDate(lastImport)}</p>
          </div>
        </div>
      </div>
      
      <div className="import-controls">
        <div className="import-control-group">
          <h3>Manual Import</h3>
          <div className="import-actions">
            <button 
              className={`import-action-button ${importStatus === 'importing' ? 'importing' : ''}`}
              onClick={() => handleImport(false)}
              disabled={importStatus === 'importing'}
            >
              <FaDownload /> 
              {importStatus === 'importing' ? 'Importing...' : 'Import Latest Articles'}
            </button>
            
            <button 
              className="import-action-button secondary"
              onClick={() => handleImport(true)}
              disabled={importStatus === 'importing'}
            >
              <FaSync /> Force Reimport All
            </button>
          </div>
          
          <div className="import-settings">
            <div className="setting-group">
              <label htmlFor="importLimit">Import Limit:</label>
              <select 
                id="importLimit" 
                value={importLimit} 
                onChange={(e) => setImportLimit(parseInt(e.target.value, 10))}
              >
                <option value="5">5 articles</option>
                <option value="10">10 articles</option>
                <option value="25">25 articles</option>
                <option value="50">50 articles</option>
                <option value="100">100 articles</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="import-control-group">
          <h3>Automated Import</h3>
          <div className="import-settings">
            <div className="setting-group">
              <label htmlFor="autoImport" className="checkbox-label">
                <input 
                  type="checkbox" 
                  id="autoImport" 
                  checked={autoImport}
                  onChange={(e) => setAutoImport(e.target.checked)}
                />
                Enable Automated Import
              </label>
            </div>
            
            <div className="setting-group">
              <label htmlFor="refreshRate">Refresh Rate:</label>
              <select 
                id="refreshRate" 
                value={refreshRate} 
                onChange={(e) => setRefreshRate(parseInt(e.target.value, 10))}
                disabled={!autoImport}
              >
                <option value="6">Every 6 hours</option>
                <option value="12">Every 12 hours</option>
                <option value="24">Daily</option>
                <option value="168">Weekly</option>
              </select>
            </div>
          </div>
          
          <div className="info-message">
            <FaInfoCircle /> 
            <span>Automated imports will run in the background based on the settings above.</span>
          </div>
        </div>
      </div>
      
      <div className="import-logs">
        <h3>Import Logs</h3>
        
        <div className="logs-container">
          {importLogs.length > 0 ? (
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Level</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {importLogs.map((log, index) => (
                  <tr key={index} className={`log-level-${log.level.toLowerCase()}`}>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                    <td>{log.level}</td>
                    <td>{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-logs-message">No import logs available.</p>
          )}
        </div>
        
        <div className="log-actions">
          <button className="log-action-button" onClick={fetchLogs}>
            <FaSync /> Refresh Logs
          </button>
          <button className="log-action-button secondary">
            <FaTrash /> Clear Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default NuanceImportTab; 