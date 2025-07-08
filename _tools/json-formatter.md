---
layout: tool
title: "JSON Formatter - Free Online JSON Beautifier and Validator"
description: "Format, validate, and beautify JSON online for free. Minify JSON, fix syntax errors, and convert between JSON formats. Developer-friendly JSON tools."
tool_name: "JSON Formatter"
permalink: /tools/json-formatter/
---

<div class="tool-container">
  <div class="tool-header">
    <h1>JSON Formatter & Validator</h1>
    <p>Format, validate, minify, and beautify your JSON data</p>
  </div>

  <div class="json-tools">
    <div class="input-section">
      <div class="section-header">
        <h3>Input JSON</h3>
        <div class="input-controls">
          <button id="formatBtn" class="action-btn primary">Format & Validate</button>
          <button id="minifyBtn" class="action-btn secondary">Minify</button>
          <button id="clearBtn" class="action-btn">Clear</button>
          <label class="file-input-label">
            📁 Load File
            <input type="file" id="fileInput" accept=".json,.txt" style="display: none;">
          </label>
        </div>
      </div>
      <textarea id="jsonInput" placeholder="Paste your JSON here..."></textarea>
      <div class="input-stats">
        <span id="inputStats"></span>
      </div>
    </div>

    <div class="output-section">
      <div class="section-header">
        <h3>Formatted JSON</h3>
        <div class="output-controls">
          <button id="copyBtn" class="action-btn">📋 Copy</button>
          <button id="downloadBtn" class="action-btn">💾 Download</button>
          <select id="indentSize">
            <option value="2">2 spaces</option>
            <option value="4" selected>4 spaces</option>
            <option value="\t">Tab</option>
          </select>
        </div>
      </div>
      <textarea id="jsonOutput" readonly placeholder="Formatted JSON will appear here..."></textarea>
      <div class="output-stats">
        <span id="outputStats"></span>
      </div>
    </div>
  </div>

  <div class="validation-result" id="validationResult" style="display: none;">
    <div class="validation-icon"></div>
    <div class="validation-message"></div>
  </div>

  <div class="json-features">
    <div class="feature-section">
      <h3>JSON Tree View</h3>
      <div id="jsonTree" class="json-tree-container">
        <p class="tree-placeholder">Formatted JSON will display as a tree structure here</p>
      </div>
    </div>

    <div class="feature-section">
      <h3>Quick Actions</h3>
      <div class="quick-actions">
        <button id="sortKeysBtn" class="quick-btn">🔤 Sort Keys</button>
        <button id="removeWhitespaceBtn" class="quick-btn">🗜️ Remove Whitespace</button>
        <button id="escapeStringBtn" class="quick-btn">🔗 Escape String</button>
        <button id="unescapeStringBtn" class="quick-btn">🔓 Unescape String</button>
        <button id="toJavascriptBtn" class="quick-btn">⚡ To JavaScript</button>
        <button id="generateSchemaBtn" class="quick-btn">📋 Generate Schema</button>
      </div>
    </div>
  </div>

  <div class="error-message" id="errorMessage" style="display: none;"></div>
  <div class="success-message" id="successMessage" style="display: none;"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const jsonInput = document.getElementById('jsonInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const validationResult = document.getElementById('validationResult');
    const jsonTree = document.getElementById('jsonTree');
    
    let currentJsonData = null;
    
    // Format and validate JSON
    document.getElementById('formatBtn').addEventListener('click', formatJson);
    document.getElementById('minifyBtn').addEventListener('click', minifyJson);
    document.getElementById('clearBtn').addEventListener('click', clearAll);
    
    // File handling
    document.getElementById('fileInput').addEventListener('change', handleFileLoad);
    
    // Output controls
    document.getElementById('copyBtn').addEventListener('click', () => copyToClipboard(jsonOutput.value));
    document.getElementById('downloadBtn').addEventListener('click', downloadJson);
    document.getElementById('indentSize').addEventListener('change', () => {
        if (currentJsonData) {
            formatJson();
        }
    });
    
    // Quick actions
    document.getElementById('sortKeysBtn').addEventListener('click', sortKeys);
    document.getElementById('removeWhitespaceBtn').addEventListener('click', removeWhitespace);
    document.getElementById('escapeStringBtn').addEventListener('click', escapeString);
    document.getElementById('unescapeStringBtn').addEventListener('click', unescapeString);
    document.getElementById('toJavascriptBtn').addEventListener('click', toJavascript);
    document.getElementById('generateSchemaBtn').addEventListener('click', generateSchema);
    
    // Auto-update stats on input
    jsonInput.addEventListener('input', updateInputStats);
    jsonOutput.addEventListener('input', updateOutputStats);
    
    function formatJson() {
        const input = jsonInput.value.trim();
        if (!input) {
            showError('Please enter JSON data');
            return;
        }
        
        try {
            currentJsonData = JSON.parse(input);
            const indentSize = document.getElementById('indentSize').value;
            const indent = indentSize === '\t' ? '\t' : parseInt(indentSize);
            
            const formatted = JSON.stringify(currentJsonData, null, indent);
            jsonOutput.value = formatted;
            
            showValidationResult(true, 'Valid JSON');
            updateOutputStats();
            renderJsonTree(currentJsonData);
            showSuccess('JSON formatted successfully');
            
        } catch (error) {
            showValidationResult(false, `Invalid JSON: ${error.message}`);
            jsonOutput.value = '';
            jsonTree.innerHTML = '<p class="tree-placeholder error">Invalid JSON - cannot display tree</p>';
            showError('JSON parsing failed: ' + error.message);
        }
    }
    
    function minifyJson() {
        const input = jsonInput.value.trim();
        if (!input) {
            showError('Please enter JSON data');
            return;
        }
        
        try {
            currentJsonData = JSON.parse(input);
            const minified = JSON.stringify(currentJsonData);
            jsonOutput.value = minified;
            
            showValidationResult(true, 'Valid JSON (minified)');
            updateOutputStats();
            renderJsonTree(currentJsonData);
            showSuccess('JSON minified successfully');
            
        } catch (error) {
            showValidationResult(false, `Invalid JSON: ${error.message}`);
            showError('JSON parsing failed: ' + error.message);
        }
    }
    
    function clearAll() {
        jsonInput.value = '';
        jsonOutput.value = '';
        currentJsonData = null;
        validationResult.style.display = 'none';
        jsonTree.innerHTML = '<p class="tree-placeholder">Formatted JSON will display as a tree structure here</p>';
        updateInputStats();
        updateOutputStats();
    }
    
    function handleFileLoad(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (file.size > 10 * 1024 * 1024) {
            showError('File size must be less than 10MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            jsonInput.value = e.target.result;
            updateInputStats();
            showSuccess('File loaded successfully');
        };
        reader.readAsText(file);
    }
    
    function sortKeys() {
        if (!currentJsonData) {
            showError('Please format valid JSON first');
            return;
        }
        
        try {
            const sorted = sortObjectKeys(currentJsonData);
            currentJsonData = sorted;
            const indentSize = document.getElementById('indentSize').value;
            const indent = indentSize === '\t' ? '\t' : parseInt(indentSize);
            
            jsonOutput.value = JSON.stringify(sorted, null, indent);
            updateOutputStats();
            renderJsonTree(sorted);
            showSuccess('Keys sorted alphabetically');
        } catch (error) {
            showError('Error sorting keys: ' + error.message);
        }
    }
    
    function sortObjectKeys(obj) {
        if (Array.isArray(obj)) {
            return obj.map(sortObjectKeys);
        } else if (obj !== null && typeof obj === 'object') {
            const sorted = {};
            Object.keys(obj).sort().forEach(key => {
                sorted[key] = sortObjectKeys(obj[key]);
            });
            return sorted;
        }
        return obj;
    }
    
    function removeWhitespace() {
        if (!currentJsonData) {
            showError('Please format valid JSON first');
            return;
        }
        
        jsonOutput.value = JSON.stringify(currentJsonData);
        updateOutputStats();
        showSuccess('Whitespace removed');
    }
    
    function escapeString() {
        const input = jsonInput.value;
        if (!input) {
            showError('Please enter text to escape');
            return;
        }
        
        const escaped = JSON.stringify(input);
        jsonOutput.value = escaped;
        updateOutputStats();
        showSuccess('String escaped');
    }
    
    function unescapeString() {
        const input = jsonInput.value.trim();
        if (!input) {
            showError('Please enter escaped string');
            return;
        }
        
        try {
            const unescaped = JSON.parse(input);
            jsonOutput.value = unescaped;
            updateOutputStats();
            showSuccess('String unescaped');
        } catch (error) {
            showError('Invalid escaped string');
        }
    }
    
    function toJavascript() {
        if (!currentJsonData) {
            showError('Please format valid JSON first');
            return;
        }
        
        const jsCode = `const data = ${JSON.stringify(currentJsonData, null, 2)};`;
        jsonOutput.value = jsCode;
        updateOutputStats();
        showSuccess('Converted to JavaScript');
    }
    
    function generateSchema() {
        if (!currentJsonData) {
            showError('Please format valid JSON first');
            return;
        }
        
        try {
            const schema = generateJsonSchema(currentJsonData);
            jsonOutput.value = JSON.stringify(schema, null, 2);
            updateOutputStats();
            showSuccess('JSON schema generated');
        } catch (error) {
            showError('Error generating schema: ' + error.message);
        }
    }
    
    function generateJsonSchema(obj) {
        if (obj === null) return { type: 'null' };
        if (typeof obj === 'boolean') return { type: 'boolean' };
        if (typeof obj === 'number') return { type: 'number' };
        if (typeof obj === 'string') return { type: 'string' };
        
        if (Array.isArray(obj)) {
            const schema = { type: 'array' };
            if (obj.length > 0) {
                schema.items = generateJsonSchema(obj[0]);
            }
            return schema;
        }
        
        if (typeof obj === 'object') {
            const schema = {
                type: 'object',
                properties: {},
                required: []
            };
            
            for (const key in obj) {
                schema.properties[key] = generateJsonSchema(obj[key]);
                schema.required.push(key);
            }
            
            return schema;
        }
        
        return { type: 'unknown' };
    }
    
    function renderJsonTree(data) {
        jsonTree.innerHTML = '<div class="json-tree">' + createTreeNode(data, '') + '</div>';
    }
    
    function createTreeNode(data, prefix = '') {
        if (data === null) return '<span class="json-null">null</span>';
        if (typeof data === 'boolean') return `<span class="json-boolean">${data}</span>`;
        if (typeof data === 'number') return `<span class="json-number">${data}</span>`;
        if (typeof data === 'string') return `<span class="json-string">"${escapeHtml(data)}"</span>`;
        
        if (Array.isArray(data)) {
            if (data.length === 0) return '<span class="json-array">[]</span>';
            
            let html = '<span class="json-array-bracket">[</span>\n';
            data.forEach((item, index) => {
                html += `${prefix}  <span class="json-array-index">[${index}]</span>: ${createTreeNode(item, prefix + '  ')}`;
                if (index < data.length - 1) html += ',';
                html += '\n';
            });
            html += `${prefix}<span class="json-array-bracket">]</span>`;
            return html;
        }
        
        if (typeof data === 'object') {
            const keys = Object.keys(data);
            if (keys.length === 0) return '<span class="json-object">{}</span>';
            
            let html = '<span class="json-object-bracket">{</span>\n';
            keys.forEach((key, index) => {
                html += `${prefix}  <span class="json-key">"${escapeHtml(key)}"</span>: ${createTreeNode(data[key], prefix + '  ')}`;
                if (index < keys.length - 1) html += ',';
                html += '\n';
            });
            html += `${prefix}<span class="json-object-bracket">}</span>`;
            return html;
        }
        
        return `<span class="json-unknown">${escapeHtml(String(data))}</span>`;
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function updateInputStats() {
        const input = jsonInput.value;
        const lines = input.split('\n').length;
        const chars = input.length;
        const words = input.trim() ? input.trim().split(/\s+/).length : 0;
        
        document.getElementById('inputStats').textContent = 
            `${lines} lines, ${chars} characters, ${words} words`;
    }
    
    function updateOutputStats() {
        const output = jsonOutput.value;
        const lines = output.split('\n').length;
        const chars = output.length;
        const inputSize = new Blob([jsonInput.value]).size;
        const outputSize = new Blob([output]).size;
        
        let sizeChange = '';
        if (inputSize > 0) {
            const change = ((outputSize - inputSize) / inputSize * 100).toFixed(1);
            sizeChange = `, size change: ${change > 0 ? '+' : ''}${change}%`;
        }
        
        document.getElementById('outputStats').textContent = 
            `${lines} lines, ${chars} characters${sizeChange}`;
    }
    
    function showValidationResult(isValid, message) {
        const icon = validationResult.querySelector('.validation-icon');
        const messageEl = validationResult.querySelector('.validation-message');
        
        icon.textContent = isValid ? '✅' : '❌';
        messageEl.textContent = message;
        validationResult.className = `validation-result ${isValid ? 'valid' : 'invalid'}`;
        validationResult.style.display = 'flex';
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
    
    function downloadJson() {
        const content = jsonOutput.value;
        if (!content) {
            showError('Nothing to download');
            return;
        }
        
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted.json';
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
    
    // Initialize stats
    updateInputStats();
    updateOutputStats();
});
</script>

<style>
.tool-container {
    max-width: 1400px;
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

.json-tools {
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
    align-items: center;
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

.file-input-label {
    background: #28a745;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.3s ease;
}

.file-input-label:hover {
    background: #218838;
}

#indentSize {
    padding: 6px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
}

textarea {
    width: 100%;
    height: 400px;
    padding: 20px;
    border: none;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    resize: vertical;
    background: #fafafa;
}

#jsonOutput {
    background: #f8f9fa;
}

.input-stats, .output-stats {
    padding: 10px 20px;
    background: #f8f9fa;
    border-top: 1px solid #dee2e6;
    font-size: 0.8rem;
    color: #666;
}

.validation-result {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 20px;
    border-radius: 8px;
    margin-bottom: 30px;
    font-weight: 500;
}

.validation-result.valid {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.validation-result.invalid {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.validation-icon {
    font-size: 1.2rem;
}

.json-features {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
}

.feature-section {
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.feature-section h3 {
    margin-bottom: 20px;
    color: #333;
    font-size: 1.2rem;
}

.json-tree-container {
    background: #fafafa;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 20px;
    max-height: 400px;
    overflow: auto;
}

.json-tree {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9rem;
    line-height: 1.6;
    white-space: pre;
}

.tree-placeholder {
    color: #666;
    font-style: italic;
    text-align: center;
    margin: 0;
}

.tree-placeholder.error {
    color: #dc3545;
}

.json-null { color: #6c757d; }
.json-boolean { color: #007bff; }
.json-number { color: #28a745; }
.json-string { color: #dc3545; }
.json-key { color: #6f42c1; font-weight: 600; }
.json-array-bracket, .json-object-bracket { color: #333; font-weight: bold; }
.json-array-index { color: #fd7e14; }

.quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
}

.quick-btn {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    padding: 10px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.3s ease;
    text-align: center;
}

.quick-btn:hover {
    background: #e9ecef;
    border-color: #667eea;
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

@media (max-width: 1200px) {
    .json-features {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .tool-container {
        padding: 15px;
    }
    
    .json-tools {
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
    
    .feature-section {
        padding: 20px;
    }
    
    textarea {
        height: 300px;
        padding: 15px;
    }
    
    .quick-actions {
        grid-template-columns: 1fr;
    }
}
</style>
