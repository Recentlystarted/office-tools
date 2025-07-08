---
layout: tool
title: "URL Encoder Decoder - Free Online URL Tool"
description: "Encode and decode URLs online for free. Convert special characters for web use. Safe URL encoding and decoding tool."
tool_name: "URL Encoder/Decoder"
permalink: /tools/url-encoder-decoder/
---

<div class="tool-container">
  <div class="tool-header">
    <h1>URL Encoder/Decoder</h1>
    <p>Encode and decode URLs and special characters for web use</p>
  </div>

  <div class="url-tools">
    <div class="input-section">
      <div class="section-header">
        <h3>Input</h3>
        <div class="input-controls">
          <button id="encodeBtn" class="action-btn primary">Encode URL</button>
          <button id="decodeBtn" class="action-btn secondary">Decode URL</button>
          <button id="clearBtn" class="action-btn">Clear All</button>
        </div>
      </div>
      <textarea id="urlInput" placeholder="Enter URL or text to encode/decode..."></textarea>
      <div class="input-stats">
        <span id="inputStats"></span>
      </div>
    </div>

    <div class="output-section">
      <div class="section-header">
        <h3>Output</h3>
        <div class="output-controls">
          <button id="copyBtn" class="action-btn">📋 Copy</button>
          <button id="downloadBtn" class="action-btn">💾 Download</button>
          <button id="swapBtn" class="action-btn">⇅ Swap</button>
        </div>
      </div>
      <textarea id="urlOutput" readonly placeholder="Result will appear here..."></textarea>
      <div class="output-stats">
        <span id="outputStats"></span>
      </div>
    </div>
  </div>

  <div class="encoding-options">
    <h3>Encoding Options</h3>
    <div class="options-grid">
      <div class="option-group">
        <h4>URL Component Encoding</h4>
        <div class="quick-actions">
          <button class="quick-btn" data-action="encodeURI">Encode URI</button>
          <button class="quick-btn" data-action="decodeURI">Decode URI</button>
          <button class="quick-btn" data-action="encodeURIComponent">Encode URI Component</button>
          <button class="quick-btn" data-action="decodeURIComponent">Decode URI Component</button>
        </div>
      </div>
      
      <div class="option-group">
        <h4>HTML Entity Encoding</h4>
        <div class="quick-actions">
          <button class="quick-btn" data-action="encodeHTML">Encode HTML</button>
          <button class="quick-btn" data-action="decodeHTML">Decode HTML</button>
        </div>
      </div>
      
      <div class="option-group">
        <h4>Base64 URL Safe</h4>
        <div class="quick-actions">
          <button class="quick-btn" data-action="encodeBase64URL">Encode Base64 URL</button>
          <button class="quick-btn" data-action="decodeBase64URL">Decode Base64 URL</button>
        </div>
      </div>
    </div>
  </div>

  <div class="url-analyzer">
    <h3>URL Analyzer</h3>
    <div class="analyzer-input">
      <input type="url" id="analyzeInput" placeholder="Enter URL to analyze...">
      <button id="analyzeBtn">Analyze URL</button>
    </div>
    <div class="analyzer-output" id="analyzerOutput" style="display: none;">
      <div class="url-parts">
        <div class="url-part">
          <label>Protocol:</label>
          <span id="protocol">-</span>
        </div>
        <div class="url-part">
          <label>Host:</label>
          <span id="host">-</span>
        </div>
        <div class="url-part">
          <label>Port:</label>
          <span id="port">-</span>
        </div>
        <div class="url-part">
          <label>Path:</label>
          <span id="path">-</span>
        </div>
        <div class="url-part">
          <label>Query:</label>
          <span id="query">-</span>
        </div>
        <div class="url-part">
          <label>Fragment:</label>
          <span id="fragment">-</span>
        </div>
      </div>
      <div class="query-params" id="queryParams" style="display: none;">
        <h4>Query Parameters</h4>
        <div class="params-list" id="paramsList"></div>
      </div>
    </div>
  </div>

  <div class="encoding-reference">
    <h3>Common URL Encodings</h3>
    <div class="reference-table">
      <table>
        <thead>
          <tr>
            <th>Character</th>
            <th>URL Encoded</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Space</td><td>%20 or +</td><td>Space character</td></tr>
          <tr><td>!</td><td>%21</td><td>Exclamation mark</td></tr>
          <tr><td>"</td><td>%22</td><td>Quotation mark</td></tr>
          <tr><td>#</td><td>%23</td><td>Hash/Fragment</td></tr>
          <tr><td>$</td><td>%24</td><td>Dollar sign</td></tr>
          <tr><td>%</td><td>%25</td><td>Percent sign</td></tr>
          <tr><td>&</td><td>%26</td><td>Ampersand</td></tr>
          <tr><td>'</td><td>%27</td><td>Apostrophe</td></tr>
          <tr><td>(</td><td>%28</td><td>Opening parenthesis</td></tr>
          <tr><td>)</td><td>%29</td><td>Closing parenthesis</td></tr>
          <tr><td>+</td><td>%2B</td><td>Plus sign</td></tr>
          <tr><td>/</td><td>%2F</td><td>Forward slash</td></tr>
          <tr><td>:</td><td>%3A</td><td>Colon</td></tr>
          <tr><td>=</td><td>%3D</td><td>Equals sign</td></tr>
          <tr><td>?</td><td>%3F</td><td>Question mark</td></tr>
          <tr><td>@</td><td>%40</td><td>At symbol</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="error-message" id="errorMessage" style="display: none;"></div>
  <div class="success-message" id="successMessage" style="display: none;"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const urlOutput = document.getElementById('urlOutput');
    const analyzeInput = document.getElementById('analyzeInput');
    
    // Main encoding/decoding functions
    document.getElementById('encodeBtn').addEventListener('click', () => {
        const input = urlInput.value;
        if (!input) {
            showError('Please enter text to encode');
            return;
        }
        
        try {
            const encoded = encodeURIComponent(input);
            urlOutput.value = encoded;
            updateStats();
            showSuccess('URL encoded successfully');
        } catch (error) {
            showError('Error encoding URL: ' + error.message);
        }
    });
    
    document.getElementById('decodeBtn').addEventListener('click', () => {
        const input = urlInput.value;
        if (!input) {
            showError('Please enter text to decode');
            return;
        }
        
        try {
            const decoded = decodeURIComponent(input);
            urlOutput.value = decoded;
            updateStats();
            showSuccess('URL decoded successfully');
        } catch (error) {
            showError('Error decoding URL: ' + error.message);
        }
    });
    
    document.getElementById('clearBtn').addEventListener('click', () => {
        urlInput.value = '';
        urlOutput.value = '';
        updateStats();
    });
    
    document.getElementById('copyBtn').addEventListener('click', () => {
        copyToClipboard(urlOutput.value);
    });
    
    document.getElementById('downloadBtn').addEventListener('click', () => {
        downloadText(urlOutput.value, 'url-result.txt');
    });
    
    document.getElementById('swapBtn').addEventListener('click', () => {
        const temp = urlInput.value;
        urlInput.value = urlOutput.value;
        urlOutput.value = temp;
        updateStats();
    });
    
    // Quick action buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const input = urlInput.value;
            
            if (!input) {
                showError('Please enter text first');
                return;
            }
            
            try {
                let result;
                
                switch (action) {
                    case 'encodeURI':
                        result = encodeURI(input);
                        break;
                    case 'decodeURI':
                        result = decodeURI(input);
                        break;
                    case 'encodeURIComponent':
                        result = encodeURIComponent(input);
                        break;
                    case 'decodeURIComponent':
                        result = decodeURIComponent(input);
                        break;
                    case 'encodeHTML':
                        result = encodeHTML(input);
                        break;
                    case 'decodeHTML':
                        result = decodeHTML(input);
                        break;
                    case 'encodeBase64URL':
                        result = btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
                        break;
                    case 'decodeBase64URL':
                        const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
                        const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
                        result = atob(base64 + padding);
                        break;
                    default:
                        throw new Error('Unknown action');
                }
                
                urlOutput.value = result;
                updateStats();
                showSuccess(`${action} completed successfully`);
                
            } catch (error) {
                showError(`Error in ${action}: ${error.message}`);
            }
        });
    });
    
    // URL Analyzer
    document.getElementById('analyzeBtn').addEventListener('click', analyzeURL);
    analyzeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            analyzeURL();
        }
    });
    
    function analyzeURL() {
        const url = analyzeInput.value.trim();
        if (!url) {
            showError('Please enter a URL to analyze');
            return;
        }
        
        try {
            const urlObj = new URL(url);
            
            document.getElementById('protocol').textContent = urlObj.protocol;
            document.getElementById('host').textContent = urlObj.hostname;
            document.getElementById('port').textContent = urlObj.port || 'default';
            document.getElementById('path').textContent = urlObj.pathname;
            document.getElementById('query').textContent = urlObj.search || 'none';
            document.getElementById('fragment').textContent = urlObj.hash || 'none';
            
            // Parse query parameters
            const params = new URLSearchParams(urlObj.search);
            const paramsList = document.getElementById('paramsList');
            const queryParams = document.getElementById('queryParams');
            
            if (params.toString()) {
                paramsList.innerHTML = '';
                params.forEach((value, key) => {
                    const paramDiv = document.createElement('div');
                    paramDiv.className = 'param-item';
                    paramDiv.innerHTML = `
                        <span class="param-key">${escapeHtml(key)}</span>
                        <span class="param-value">${escapeHtml(value)}</span>
                    `;
                    paramsList.appendChild(paramDiv);
                });
                queryParams.style.display = 'block';
            } else {
                queryParams.style.display = 'none';
            }
            
            document.getElementById('analyzerOutput').style.display = 'block';
            showSuccess('URL analyzed successfully');
            
        } catch (error) {
            showError('Invalid URL format');
        }
    }
    
    // HTML encoding/decoding functions
    function encodeHTML(str) {
        const htmlEntities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };
        
        return str.replace(/[&<>"'\/]/g, (char) => htmlEntities[char]);
    }
    
    function decodeHTML(str) {
        const htmlEntities = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'",
            '&#x2F;': '/'
        };
        
        return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g, (entity) => htmlEntities[entity]);
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function updateStats() {
        const inputLength = urlInput.value.length;
        const outputLength = urlOutput.value.length;
        
        document.getElementById('inputStats').textContent = 
            `${inputLength} characters`;
        
        if (outputLength > 0) {
            const change = inputLength > 0 ? ((outputLength - inputLength) / inputLength * 100).toFixed(1) : 0;
            document.getElementById('outputStats').textContent = 
                `${outputLength} characters (${change > 0 ? '+' : ''}${change}% change)`;
        } else {
            document.getElementById('outputStats').textContent = '0 characters';
        }
    }
    
    function copyToClipboard(text) {
        if (!text) {
            showError('Nothing to copy');
            return;
        }
        
        navigator.clipboard.writeText(text).then(() => {
            showSuccess('Copied to clipboard');
        }).catch(() => {
            showError('Failed to copy to clipboard');
        });
    }
    
    function downloadText(content, filename) {
        if (!content) {
            showError('Nothing to download');
            return;
        }
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    function showError(message) {
        const errorElement = document.getElementById('errorMessage');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
    
    function showSuccess(message) {
        const successElement = document.getElementById('successMessage');
        successElement.textContent = message;
        successElement.style.display = 'block';
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 3000);
    }
    
    // Auto-update stats on input
    urlInput.addEventListener('input', updateStats);
    urlOutput.addEventListener('input', updateStats);
    
    // Initialize stats
    updateStats();
});
</script>

<style>
.tool-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.tool-header {
    text-align: center;
    margin-bottom: 30px;
}

.tool-header h1 {
    color: #333;
    margin-bottom: 10px;
}

.tool-header p {
    color: #666;
    font-size: 1.1rem;
}

.url-tools {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-bottom: 30px;
}

.input-section, .output-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    overflow: hidden;
}

.section-header {
    background: #f8f9fa;
    padding: 15px 20px;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}

.section-header h3 {
    margin: 0;
    color: #333;
    font-size: 1.1rem;
}

.input-controls, .output-controls {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.action-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.action-btn.primary {
    background: #667eea;
    color: white;
}

.action-btn.primary:hover {
    background: #5a67d8;
}

.action-btn.secondary {
    background: #6c757d;
    color: white;
}

.action-btn.secondary:hover {
    background: #5a6268;
}

.action-btn:not(.primary):not(.secondary) {
    background: #e9ecef;
    color: #333;
}

.action-btn:not(.primary):not(.secondary):hover {
    background: #dee2e6;
}

textarea {
    width: 100%;
    height: 200px;
    padding: 20px;
    border: none;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    resize: vertical;
    background: #fafafa;
}

#urlOutput {
    background: #f8f9fa;
}

.input-stats, .output-stats {
    padding: 10px 20px;
    background: #f8f9fa;
    border-top: 1px solid #dee2e6;
    font-size: 0.8rem;
    color: #666;
}

.encoding-options, .url-analyzer, .encoding-reference {
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin-bottom: 30px;
}

.encoding-options h3, .url-analyzer h3, .encoding-reference h3 {
    margin-bottom: 20px;
    color: #333;
    font-size: 1.2rem;
}

.options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
}

.option-group h4 {
    margin-bottom: 15px;
    color: #555;
    font-size: 1rem;
}

.quick-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.quick-btn {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.3s ease;
}

.quick-btn:hover {
    background: #e9ecef;
    border-color: #667eea;
}

.analyzer-input {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.analyzer-input input {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;
}

.analyzer-input button {
    padding: 10px 20px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.analyzer-input button:hover {
    background: #5a67d8;
}

.analyzer-output {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #dee2e6;
}

.url-parts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
}

.url-part {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: white;
    border-radius: 6px;
    border: 1px solid #dee2e6;
}

.url-part label {
    font-weight: 500;
    color: #555;
}

.url-part span {
    font-family: monospace;
    color: #333;
    word-break: break-all;
}

.query-params h4 {
    margin-bottom: 15px;
    color: #333;
}

.params-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.param-item {
    display: flex;
    gap: 10px;
    padding: 8px 12px;
    background: white;
    border-radius: 6px;
    border: 1px solid #dee2e6;
}

.param-key {
    font-weight: 500;
    color: #667eea;
    min-width: 80px;
}

.param-value {
    font-family: monospace;
    color: #333;
    word-break: break-all;
}

.reference-table {
    overflow-x: auto;
}

.reference-table table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
}

.reference-table th,
.reference-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #dee2e6;
}

.reference-table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #333;
}

.reference-table td:nth-child(2) {
    font-family: monospace;
    background: #f8f9fa;
}

.error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 12px 20px;
    border-radius: 8px;
    margin: 20px 0;
    border: 1px solid #f5c6cb;
}

.success-message {
    background: #d4edda;
    color: #155724;
    padding: 12px 20px;
    border-radius: 8px;
    margin: 20px 0;
    border: 1px solid #c3e6cb;
}

@media (max-width: 768px) {
    .tool-container {
        padding: 15px;
    }
    
    .url-tools {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .section-header {
        flex-direction: column;
        align-items: stretch;
    }
    
    .input-controls, .output-controls {
        justify-content: center;
    }
    
    .options-grid {
        grid-template-columns: 1fr;
    }
    
    .analyzer-input {
        flex-direction: column;
    }
    
    .url-parts {
        grid-template-columns: 1fr;
    }
    
    .param-item {
        flex-direction: column;
        align-items: flex-start;
    }
    
    textarea {
        height: 150px;
        padding: 15px;
    }
}
</style>
