---
layout: tool
title: "URL Shortener - Create Short Links Online"
description: "Free online URL shortener. Create short, custom links with click tracking and analytics. No registration required."
keywords: "URL shortener, short links, link shortener, tiny URL, custom links"
tool_name: "URL Shortener"
tool_category: "Utility Tools"
---

<div class="tool-container">
  <div class="tool-header">
    <h1>URL Shortener</h1>
    <p>Create short, memorable links with analytics and custom aliases</p>
  </div>

  <div class="shortener-section">
    <div class="input-panel">
      <h3>Shorten Your URL</h3>
      <div class="url-input-group">
        <input type="url" id="originalUrl" placeholder="Paste your long URL here...">
        <button id="shortenBtn" class="shorten-btn">🔗 Shorten</button>
      </div>
      
      <div class="options-section">
        <div class="option-group">
          <label for="customAlias">Custom Alias (optional):</label>
          <input type="text" id="customAlias" placeholder="custom-name" maxlength="50">
          <small>Only letters, numbers, and hyphens allowed</small>
        </div>
        
        <div class="option-group">
          <label for="expiryDate">Expiry Date (optional):</label>
          <input type="date" id="expiryDate">
        </div>
        
        <div class="option-group">
          <label for="description">Description (optional):</label>
          <input type="text" id="description" placeholder="Describe this link..." maxlength="100">
        </div>
      </div>
    </div>

    <div class="result-panel" id="resultPanel" style="display: none;">
      <h3>Your Short URL</h3>
      <div class="short-url-display">
        <input type="text" id="shortUrl" readonly>
        <div class="url-actions">
          <button id="copyUrlBtn" class="action-btn">📋 Copy</button>
          <button id="qrCodeBtn" class="action-btn">📱 QR Code</button>
          <button id="previewBtn" class="action-btn">👁️ Preview</button>
        </div>
      </div>
      
      <div class="url-stats">
        <div class="stat-item">
          <span class="stat-label">Original URL:</span>
          <span id="originalUrlDisplay" class="stat-value"></span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Short URL:</span>
          <span id="shortUrlDisplay" class="stat-value"></span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Created:</span>
          <span id="createdDate" class="stat-value"></span>
        </div>
        <div class="stat-item" id="expiryDisplay" style="display: none;">
          <span class="stat-label">Expires:</span>
          <span id="expiryDateDisplay" class="stat-value"></span>
        </div>
      </div>
    </div>
  </div>

  <!-- QR Code Modal -->
  <div id="qrModal" class="modal" style="display: none;">
    <div class="modal-content">
      <div class="modal-header">
        <h3>QR Code for Short URL</h3>
        <button class="close-btn" id="closeQrModal">×</button>
      </div>
      <div class="modal-body">
        <div id="qrCodeContainer"></div>
        <div class="qr-actions">
          <button id="downloadQrBtn" class="download-btn">💾 Download QR Code</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Preview Modal -->
  <div id="previewModal" class="modal" style="display: none;">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Link Preview</h3>
        <button class="close-btn" id="closePreviewModal">×</button>
      </div>
      <div class="modal-body">
        <div class="preview-info">
          <p><strong>Short URL:</strong> <span id="previewShortUrl"></span></p>
          <p><strong>Redirects to:</strong> <span id="previewOriginalUrl"></span></p>
          <p><strong>Description:</strong> <span id="previewDescription">-</span></p>
          <p><strong>Created:</strong> <span id="previewCreated"></span></p>
          <p id="previewExpiry" style="display: none;"><strong>Expires:</strong> <span id="previewExpiryDate"></span></p>
        </div>
        <div class="preview-actions">
          <button id="visitUrlBtn" class="visit-btn">🌐 Visit Original URL</button>
        </div>
      </div>
    </div>
  </div>

  <div class="url-history">
    <h3>Recent Short URLs <span id="historyCount">(0)</span></h3>
    <div class="history-controls">
      <button id="clearHistoryBtn" class="clear-btn">🗑️ Clear History</button>
      <button id="exportHistoryBtn" class="export-btn">📤 Export CSV</button>
    </div>
    <div id="urlHistory" class="history-list">
      <p class="empty-state">No URLs shortened yet</p>
    </div>
  </div>

  <div class="features-section">
    <h2>Features</h2>
    <div class="features-grid">
      <div class="feature">
        <div class="feature-icon">⚡</div>
        <h3>Instant Shortening</h3>
        <p>Create short URLs instantly with no registration required</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🎯</div>
        <h3>Custom Aliases</h3>
        <p>Create memorable custom aliases for your links</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📱</div>
        <h3>QR Code Generation</h3>
        <p>Automatic QR code generation for easy mobile sharing</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📊</div>
        <h3>Link Management</h3>
        <p>Track and manage your shortened URLs with history</p>
      </div>
    </div>
  </div>

  <div class="disclaimer">
    <h3>⚠️ Important Notice</h3>
    <p>This URL shortener creates demo short URLs for testing purposes. In a production environment, you would need a backend service to store and redirect URLs. The generated short URLs in this demo are for illustration only and will not actually redirect.</p>
  </div>
</div>

<!-- QR Code Library -->
<script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>

<script>
// Global variables
let urlHistory = [];
let currentShortUrl = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  const originalUrlInput = document.getElementById('originalUrl');
  const shortenBtn = document.getElementById('shortenBtn');
  const copyUrlBtn = document.getElementById('copyUrlBtn');
  const qrCodeBtn = document.getElementById('qrCodeBtn');
  const previewBtn = document.getElementById('previewBtn');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const exportHistoryBtn = document.getElementById('exportHistoryBtn');

  // Load history from localStorage
  loadUrlHistory();

  // Event listeners
  shortenBtn.addEventListener('click', shortenUrl);
  copyUrlBtn.addEventListener('click', copyShortUrl);
  qrCodeBtn.addEventListener('click', showQrCode);
  previewBtn.addEventListener('click', showPreview);
  clearHistoryBtn.addEventListener('click', clearUrlHistory);
  exportHistoryBtn.addEventListener('click', exportHistory);

  // Enter key support
  originalUrlInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      shortenUrl();
    }
  });

  // Custom alias validation
  document.getElementById('customAlias').addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-Z0-9-]/g, '');
  });

  // Modal controls
  document.getElementById('closeQrModal').addEventListener('click', () => {
    document.getElementById('qrModal').style.display = 'none';
  });

  document.getElementById('closePreviewModal').addEventListener('click', () => {
    document.getElementById('previewModal').style.display = 'none';
  });

  document.getElementById('downloadQrBtn').addEventListener('click', downloadQrCode);
  document.getElementById('visitUrlBtn').addEventListener('click', visitOriginalUrl);

  // Close modals on outside click
  window.addEventListener('click', function(e) {
    const qrModal = document.getElementById('qrModal');
    const previewModal = document.getElementById('previewModal');
    
    if (e.target === qrModal) {
      qrModal.style.display = 'none';
    }
    if (e.target === previewModal) {
      previewModal.style.display = 'none';
    }
  });
});

function shortenUrl() {
  const originalUrl = document.getElementById('originalUrl').value.trim();
  const customAlias = document.getElementById('customAlias').value.trim();
  const expiryDate = document.getElementById('expiryDate').value;
  const description = document.getElementById('description').value.trim();

  // Validation
  if (!originalUrl) {
    showMessage('Please enter a URL to shorten.', 'warning');
    return;
  }

  if (!isValidUrl(originalUrl)) {
    showMessage('Please enter a valid URL (must start with http:// or https://).', 'error');
    return;
  }

  if (customAlias && !isValidAlias(customAlias)) {
    showMessage('Custom alias can only contain letters, numbers, and hyphens.', 'error');
    return;
  }

  // Check if alias already exists
  if (customAlias && urlHistory.some(item => item.alias === customAlias)) {
    showMessage('This custom alias is already taken. Please choose another.', 'error');
    return;
  }

  // Generate short URL
  const timestamp = Date.now();
  const shortCode = customAlias || generateShortCode();
  const shortUrl = `https://short.ly/${shortCode}`;
  
  const urlData = {
    id: timestamp,
    originalUrl: originalUrl,
    shortUrl: shortUrl,
    shortCode: shortCode,
    alias: customAlias,
    description: description,
    expiryDate: expiryDate,
    createdDate: new Date().toLocaleString(),
    clicks: 0
  };

  // Add to history
  urlHistory.unshift(urlData);
  
  // Limit history to 50 items
  if (urlHistory.length > 50) {
    urlHistory = urlHistory.slice(0, 50);
  }

  // Show result
  showResult(urlData);
  
  // Update history display
  updateHistoryDisplay();
  saveUrlHistory();
  
  // Clear form
  clearForm();
  
  showMessage('URL shortened successfully!', 'success');
}

function generateShortCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidAlias(alias) {
  return /^[a-zA-Z0-9-]+$/.test(alias) && alias.length >= 3 && alias.length <= 50;
}

function showResult(urlData) {
  currentShortUrl = urlData;
  
  document.getElementById('shortUrl').value = urlData.shortUrl;
  document.getElementById('originalUrlDisplay').textContent = urlData.originalUrl;
  document.getElementById('shortUrlDisplay').textContent = urlData.shortUrl;
  document.getElementById('createdDate').textContent = urlData.createdDate;
  
  if (urlData.expiryDate) {
    document.getElementById('expiryDisplay').style.display = 'block';
    document.getElementById('expiryDateDisplay').textContent = new Date(urlData.expiryDate).toLocaleDateString();
  } else {
    document.getElementById('expiryDisplay').style.display = 'none';
  }
  
  document.getElementById('resultPanel').style.display = 'block';
}

function copyShortUrl() {
  const shortUrl = document.getElementById('shortUrl').value;
  
  navigator.clipboard.writeText(shortUrl).then(function() {
    showMessage('Short URL copied to clipboard!', 'success');
  }).catch(function() {
    // Fallback for older browsers
    const shortUrlInput = document.getElementById('shortUrl');
    shortUrlInput.select();
    document.execCommand('copy');
    showMessage('Short URL copied to clipboard!', 'success');
  });
}

async function showQrCode() {
  if (!currentShortUrl) return;
  
  const qrContainer = document.getElementById('qrCodeContainer');
  const modal = document.getElementById('qrModal');
  
  try {
    // Clear previous QR code
    qrContainer.innerHTML = '<div class="loading">Generating QR Code...</div>';
    
    // Generate QR code
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, currentShortUrl.shortUrl, {
      width: 256,
      height: 256,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M',
      margin: 2
    });
    
    qrContainer.innerHTML = '';
    qrContainer.appendChild(canvas);
    
    modal.style.display = 'block';
    
  } catch (error) {
    console.error('Error generating QR code:', error);
    showMessage('Error generating QR code.', 'error');
  }
}

function downloadQrCode() {
  const canvas = document.querySelector('#qrCodeContainer canvas');
  if (!canvas) return;
  
  const link = document.createElement('a');
  link.download = `qr-code-${currentShortUrl.shortCode}.png`;
  link.href = canvas.toDataURL();
  link.click();
  
  showMessage('QR code downloaded!', 'success');
}

function showPreview() {
  if (!currentShortUrl) return;
  
  document.getElementById('previewShortUrl').textContent = currentShortUrl.shortUrl;
  document.getElementById('previewOriginalUrl').textContent = currentShortUrl.originalUrl;
  document.getElementById('previewDescription').textContent = currentShortUrl.description || 'No description';
  document.getElementById('previewCreated').textContent = currentShortUrl.createdDate;
  
  if (currentShortUrl.expiryDate) {
    document.getElementById('previewExpiry').style.display = 'block';
    document.getElementById('previewExpiryDate').textContent = new Date(currentShortUrl.expiryDate).toLocaleDateString();
  } else {
    document.getElementById('previewExpiry').style.display = 'none';
  }
  
  document.getElementById('previewModal').style.display = 'block';
}

function visitOriginalUrl() {
  if (currentShortUrl) {
    window.open(currentShortUrl.originalUrl, '_blank');
  }
}

function updateHistoryDisplay() {
  const historyContainer = document.getElementById('urlHistory');
  const historyCount = document.getElementById('historyCount');
  
  historyCount.textContent = `(${urlHistory.length})`;
  
  if (urlHistory.length === 0) {
    historyContainer.innerHTML = '<p class="empty-state">No URLs shortened yet</p>';
    return;
  }
  
  const historyHTML = urlHistory.map((item, index) => `
    <div class="history-item">
      <div class="history-header">
        <div class="history-urls">
          <div class="short-url">
            <strong>${item.shortUrl}</strong>
            <button class="history-action-btn" onclick="copyFromHistory('${item.shortUrl}')">📋</button>
          </div>
          <div class="original-url">${truncateUrl(item.originalUrl, 60)}</div>
        </div>
        <div class="history-actions">
          <button class="history-action-btn" onclick="showHistoryQr(${index})">📱</button>
          <button class="history-action-btn" onclick="removeFromHistory(${index})">🗑️</button>
        </div>
      </div>
      <div class="history-details">
        ${item.description ? `<p><strong>Description:</strong> ${item.description}</p>` : ''}
        <p><strong>Created:</strong> ${item.createdDate}</p>
        ${item.expiryDate ? `<p><strong>Expires:</strong> ${new Date(item.expiryDate).toLocaleDateString()}</p>` : ''}
        <p><strong>Clicks:</strong> ${item.clicks} (demo)</p>
      </div>
    </div>
  `).join('');
  
  historyContainer.innerHTML = historyHTML;
}

function truncateUrl(url, maxLength) {
  return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
}

function copyFromHistory(shortUrl) {
  navigator.clipboard.writeText(shortUrl).then(function() {
    showMessage('URL copied from history!', 'success');
  });
}

async function showHistoryQr(index) {
  const item = urlHistory[index];
  currentShortUrl = item;
  await showQrCode();
}

function removeFromHistory(index) {
  urlHistory.splice(index, 1);
  updateHistoryDisplay();
  saveUrlHistory();
  showMessage('URL removed from history.', 'info');
}

function clearUrlHistory() {
  if (urlHistory.length === 0) {
    showMessage('History is already empty.', 'info');
    return;
  }
  
  if (confirm('Are you sure you want to clear all URL history?')) {
    urlHistory = [];
    updateHistoryDisplay();
    saveUrlHistory();
    showMessage('URL history cleared.', 'info');
  }
}

function exportHistory() {
  if (urlHistory.length === 0) {
    showMessage('No URLs to export.', 'warning');
    return;
  }
  
  const headers = ['Short URL', 'Original URL', 'Description', 'Created', 'Expires', 'Clicks'];
  const csvContent = [
    headers.join(','),
    ...urlHistory.map(item => [
      item.shortUrl,
      `"${item.originalUrl}"`,
      `"${item.description || ''}"`,
      item.createdDate,
      item.expiryDate || '',
      item.clicks
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `url-history-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  
  showMessage('URL history exported!', 'success');
}

function clearForm() {
  document.getElementById('originalUrl').value = '';
  document.getElementById('customAlias').value = '';
  document.getElementById('expiryDate').value = '';
  document.getElementById('description').value = '';
}

function saveUrlHistory() {
  try {
    localStorage.setItem('urlHistory', JSON.stringify(urlHistory));
  } catch (e) {
    console.warn('Could not save URL history to localStorage');
  }
}

function loadUrlHistory() {
  try {
    const saved = localStorage.getItem('urlHistory');
    if (saved) {
      urlHistory = JSON.parse(saved);
      updateHistoryDisplay();
    }
  } catch (e) {
    console.warn('Could not load URL history from localStorage');
  }
}

// Notification system
function showMessage(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">×</button>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 3000);
}
</script>

<style>
/* URL Shortener specific styles */
.shortener-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin: 20px 0;
}

.input-panel, .result-panel {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 12px;
  border: 2px solid #e9ecef;
}

.url-input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

#originalUrl {
  flex: 1;
  padding: 15px;
  border: 2px solid #007bff;
  border-radius: 8px;
  font-size: 1rem;
}

.shorten-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 15px 25px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.shorten-btn:hover {
  background: #218838;
  transform: translateY(-1px);
}

.options-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.option-group label {
  font-weight: 500;
  color: #495057;
}

.option-group input {
  padding: 10px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
}

.option-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

.option-group small {
  color: #666;
  font-size: 0.8rem;
}

.short-url-display {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

#shortUrl {
  flex: 1;
  padding: 15px;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: bold;
  border: 2px solid #28a745;
  border-radius: 8px;
  background: white;
}

.url-actions {
  display: flex;
  gap: 5px;
}

.action-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.url-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #dee2e6;
}

.stat-label {
  font-weight: 500;
  color: #495057;
}

.stat-value {
  color: #666;
  word-break: break-all;
}

.url-history {
  margin: 40px 0;
  background: white;
  padding: 25px;
  border-radius: 12px;
  border: 2px solid #e9ecef;
}

.history-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.clear-btn, .export-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.export-btn {
  background: #17a2b8;
}

.clear-btn:hover {
  background: #5a6268;
}

.export-btn:hover {
  background: #138496;
}

.history-list {
  max-height: 500px;
  overflow-y: auto;
}

.history-item {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.history-urls {
  flex: 1;
}

.short-url {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
  font-family: monospace;
}

.original-url {
  color: #666;
  font-size: 0.9rem;
}

.history-actions {
  display: flex;
  gap: 5px;
}

.history-action-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.history-action-btn:hover {
  background: #0056b3;
}

.history-details {
  font-size: 0.85rem;
  color: #666;
}

.history-details p {
  margin: 4px 0;
}

.empty-state {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #dee2e6;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #000;
}

.modal-body {
  padding: 20px;
}

#qrCodeContainer {
  text-align: center;
  margin-bottom: 20px;
}

.loading {
  color: #007bff;
  font-weight: 500;
}

.qr-actions, .preview-actions {
  text-align: center;
}

.download-btn, .visit-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.visit-btn {
  background: #007bff;
}

.download-btn:hover {
  background: #218838;
}

.visit-btn:hover {
  background: #0056b3;
}

.preview-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.preview-info p {
  margin: 8px 0;
  word-break: break-all;
}

.disclaimer {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 20px;
  margin: 30px 0;
}

.disclaimer h3 {
  color: #856404;
  margin-top: 0;
}

.disclaimer p {
  color: #856404;
  margin-bottom: 0;
}

/* Notifications */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #d4edda;
  color: #155724;
  padding: 12px 20px;
  border-radius: 6px;
  border: 1px solid #c3e6cb;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1001;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 300px;
}

.notification.warning {
  background: #fff3cd;
  color: #856404;
  border-color: #ffeaa7;
}

.notification.error {
  background: #f8d7da;
  color: #721c24;
  border-color: #f1b0b7;
}

.notification button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: inherit;
  padding: 0;
  margin-left: auto;
}

/* Responsive design */
@media (max-width: 768px) {
  .shortener-section {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .url-input-group {
    flex-direction: column;
  }
  
  .short-url-display {
    flex-direction: column;
  }
  
  .url-actions {
    justify-content: center;
  }
  
  .history-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .history-controls {
    flex-direction: column;
  }
  
  .modal-content {
    width: 95%;
    margin: 10px;
  }
  
  .notification {
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>
