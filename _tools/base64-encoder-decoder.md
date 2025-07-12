---
layout: tool
title: "Base64 Encoder Decoder - Free Online Base64 Tool"
description: "Encode and decode Base64 strings online for free. Convert text, files, and images to Base64 and back. Simple and secure Base64 converter."
tool_name: "Base64 Encoder/Decoder"
permalink: /tools/base64-encoder-decoder/
---

<div class="card">
  <div class="card-content">
    <h1 class="text-2xl font-bold text-foreground mb-2">Base64 Encoder/Decoder</h1>
    <p class="text-muted-foreground mb-6">Convert text and files to Base64 and back</p>
  </div>

  <div class="tool-tabs">
    <button class="tab-btn active" data-tab="text">Text</button>
    <button class="tab-btn" data-tab="file">File</button>
    <button class="tab-btn" data-tab="image">Image</button>
  </div>

  <!-- Text Tab -->
  <div class="tab-content active" id="textTab">
    <div class="converter-section">
      <div class="input-section">
        <h3>Input Text</h3>
        <textarea id="textInput" placeholder="Enter text to encode/decode..."></textarea>
        <div class="input-controls">
          <button id="encodeTextBtn" class="action-btn primary">Encode to Base64</button>
          <button id="decodeTextBtn" class="action-btn secondary">Decode from Base64</button>
          <button id="clearTextBtn" class="action-btn">Clear</button>
        </div>
      </div>
      
      <div class="output-section">
        <h3>Output</h3>
        <textarea id="textOutput" readonly placeholder="Result will appear here..."></textarea>
        <div class="output-controls">
          <button id="copyTextBtn" class="action-btn">📋 Copy</button>
          <button id="downloadTextBtn" class="action-btn">💾 Download</button>
        </div>
        <div class="output-info">
          <span id="textStats"></span>
        </div>
      </div>
    </div>
  </div>

  <!-- File Tab -->
  <div class="tab-content" id="fileTab">
    <div class="converter-section">
      <div class="input-section">
        <h3>File to Base64</h3>
        <div class="file-upload-area" id="fileUploadArea">
          <div class="upload-content">
            <div class="upload-icon">📄</div>
            <p>Drop file here or click to select</p>
            <input type="file" id="fileInput" style="display: none;">
            <button type="button" onclick="document.getElementById('fileInput').click()">Select File</button>
          </div>
        </div>
        <div class="file-info" id="fileInfo" style="display: none;"></div>
        <div class="input-controls">
          <button id="encodeFileBtn" class="action-btn primary" disabled>Encode File</button>
          <button id="clearFileBtn" class="action-btn">Clear</button>
        </div>
      </div>
      
      <div class="output-section">
        <h3>Base64 Output</h3>
        <textarea id="fileOutput" readonly placeholder="Base64 result will appear here..."></textarea>
        <div class="output-controls">
          <button id="copyFileBtn" class="action-btn">📋 Copy</button>
          <button id="downloadFileBtn" class="action-btn">💾 Download</button>
        </div>
        <div class="output-info">
          <span id="fileStats"></span>
        </div>
      </div>
    </div>
  </div>

  <!-- Image Tab -->
  <div class="tab-content" id="imageTab">
    <div class="converter-section">
      <div class="input-section">
        <h3>Image to Base64</h3>
        <div class="file-upload-area" id="imageUploadArea">
          <div class="upload-content">
            <div class="upload-icon">🖼️</div>
            <p>Drop image here or click to select</p>
            <input type="file" id="imageInput" accept="image/*" style="display: none;">
            <button type="button" onclick="document.getElementById('imageInput').click()">Select Image</button>
          </div>
        </div>
        <div class="image-preview" id="imagePreview" style="display: none;"></div>
        <div class="input-controls">
          <button id="encodeImageBtn" class="action-btn primary" disabled>Encode Image</button>
          <button id="clearImageBtn" class="action-btn">Clear</button>
        </div>
      </div>
      
      <div class="output-section">
        <h3>Base64 Output</h3>
        <textarea id="imageOutput" readonly placeholder="Base64 result will appear here..."></textarea>
        <div class="output-controls">
          <button id="copyImageBtn" class="action-btn">📋 Copy</button>
          <button id="downloadImageBtn" class="action-btn">💾 Download</button>
        </div>
        <div class="format-options">
          <label>
            <input type="checkbox" id="includeDataUrl" checked> Include Data URL prefix
          </label>
        </div>
        <div class="output-info">
          <span id="imageStats"></span>
        </div>
      </div>
    </div>
  </div>

  <div class="error-message" id="errorMessage" style="display: none;"></div>
  <div class="success-message" id="successMessage" style="display: none;"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            // Update active tab button
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update active tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabName + 'Tab').classList.add('active');
        });
    });
    
    // Text encoding/decoding
    const textInput = document.getElementById('textInput');
    const textOutput = document.getElementById('textOutput');
    
    document.getElementById('encodeTextBtn').addEventListener('click', () => {
        const text = textInput.value;
        if (!text) {
            showError('Please enter text to encode');
            return;
        }
        
        try {
            const encoded = btoa(unescape(encodeURIComponent(text)));
            textOutput.value = encoded;
            updateTextStats(text, encoded);
            showSuccess('Text encoded successfully');
        } catch (error) {
            showError('Error encoding text: ' + error.message);
        }
    });
    
    document.getElementById('decodeTextBtn').addEventListener('click', () => {
        const base64 = textInput.value.trim();
        if (!base64) {
            showError('Please enter Base64 text to decode');
            return;
        }
        
        try {
            const decoded = decodeURIComponent(escape(atob(base64)));
            textOutput.value = decoded;
            updateTextStats(decoded, base64);
            showSuccess('Text decoded successfully');
        } catch (error) {
            showError('Invalid Base64 input');
        }
    });
    
    document.getElementById('clearTextBtn').addEventListener('click', () => {
        textInput.value = '';
        textOutput.value = '';
        document.getElementById('textStats').textContent = '';
    });
    
    document.getElementById('copyTextBtn').addEventListener('click', () => copyToClipboard(textOutput.value));
    document.getElementById('downloadTextBtn').addEventListener('click', () => downloadText(textOutput.value, 'base64-result.txt'));
    
    // File handling
    const fileInput = document.getElementById('fileInput');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileOutput = document.getElementById('fileOutput');
    let selectedFile = null;
    
    fileInput.addEventListener('change', handleFileSelect);
    
    // File drag and drop
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.classList.add('drag-over');
    });
    
    fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.classList.remove('drag-over');
    });
    
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect({ target: { files } });
        }
    });
    
    function handleFileSelect(event) {
        selectedFile = event.target.files[0];
        if (!selectedFile) return;
        
        if (selectedFile.size > 10 * 1024 * 1024) {
            showError('File size must be less than 10MB');
            return;
        }
        
        // Show file info
        const fileInfo = document.getElementById('fileInfo');
        fileInfo.innerHTML = `
            <strong>File:</strong> ${selectedFile.name}<br>
            <strong>Size:</strong> ${formatFileSize(selectedFile.size)}<br>
            <strong>Type:</strong> ${selectedFile.type || 'Unknown'}
        `;
        fileInfo.style.display = 'block';
        
        document.getElementById('encodeFileBtn').disabled = false;
    }
    
    document.getElementById('encodeFileBtn').addEventListener('click', async () => {
        if (!selectedFile) return;
        
        try {
            const reader = new FileReader();
            reader.onload = function(e) {
                const base64 = btoa(e.target.result);
                fileOutput.value = base64;
                updateFileStats(selectedFile, base64);
                showSuccess('File encoded successfully');
            };
            reader.readAsBinaryString(selectedFile);
        } catch (error) {
            showError('Error encoding file: ' + error.message);
        }
    });
    
    document.getElementById('clearFileBtn').addEventListener('click', () => {
        selectedFile = null;
        fileInput.value = '';
        fileOutput.value = '';
        document.getElementById('fileInfo').style.display = 'none';
        document.getElementById('encodeFileBtn').disabled = true;
        document.getElementById('fileStats').textContent = '';
    });
    
    document.getElementById('copyFileBtn').addEventListener('click', () => copyToClipboard(fileOutput.value));
    document.getElementById('downloadFileBtn').addEventListener('click', () => downloadText(fileOutput.value, 'file-base64.txt'));
    
    // Image handling
    const imageInput = document.getElementById('imageInput');
    const imageUploadArea = document.getElementById('imageUploadArea');
    const imageOutput = document.getElementById('imageOutput');
    let selectedImage = null;
    
    imageInput.addEventListener('change', handleImageSelect);
    
    // Image drag and drop
    imageUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadArea.classList.add('drag-over');
    });
    
    imageUploadArea.addEventListener('dragleave', () => {
        imageUploadArea.classList.remove('drag-over');
    });
    
    imageUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            imageInput.files = files;
            handleImageSelect({ target: { files } });
        }
    });
    
    function handleImageSelect(event) {
        selectedImage = event.target.files[0];
        if (!selectedImage) return;
        
        if (!selectedImage.type.startsWith('image/')) {
            showError('Please select an image file');
            return;
        }
        
        if (selectedImage.size > 5 * 1024 * 1024) {
            showError('Image size must be less than 5MB');
            return;
        }
        
        // Show image preview
        const reader = new FileReader();
        reader.onload = function(e) {
            const imagePreview = document.getElementById('imagePreview');
            imagePreview.innerHTML = `
                <img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px;">
                <div class="image-info">
                    <strong>File:</strong> ${selectedImage.name}<br>
                    <strong>Size:</strong> ${formatFileSize(selectedImage.size)}<br>
                    <strong>Type:</strong> ${selectedImage.type}
                </div>
            `;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(selectedImage);
        
        document.getElementById('encodeImageBtn').disabled = false;
    }
    
    document.getElementById('encodeImageBtn').addEventListener('click', () => {
        if (!selectedImage) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64 = e.target.result;
            const includeDataUrl = document.getElementById('includeDataUrl').checked;
            
            if (includeDataUrl) {
                imageOutput.value = base64;
            } else {
                imageOutput.value = base64.split(',')[1];
            }
            
            updateImageStats(selectedImage, imageOutput.value);
            showSuccess('Image encoded successfully');
        };
        reader.readAsDataURL(selectedImage);
    });
    
    document.getElementById('clearImageBtn').addEventListener('click', () => {
        selectedImage = null;
        imageInput.value = '';
        imageOutput.value = '';
        document.getElementById('imagePreview').style.display = 'none';
        document.getElementById('encodeImageBtn').disabled = true;
        document.getElementById('imageStats').textContent = '';
    });
    
    document.getElementById('copyImageBtn').addEventListener('click', () => copyToClipboard(imageOutput.value));
    document.getElementById('downloadImageBtn').addEventListener('click', () => downloadText(imageOutput.value, 'image-base64.txt'));
    
    // Utility functions
    function updateTextStats(original, encoded) {
        const originalSize = new Blob([original]).size;
        const encodedSize = new Blob([encoded]).size;
        document.getElementById('textStats').innerHTML = `
            Original: ${originalSize} bytes | Base64: ${encodedSize} bytes | 
            Increase: ${((encodedSize / originalSize - 1) * 100).toFixed(1)}%
        `;
    }
    
    function updateFileStats(file, base64) {
        const encodedSize = new Blob([base64]).size;
        document.getElementById('fileStats').innerHTML = `
            Original: ${formatFileSize(file.size)} | Base64: ${formatFileSize(encodedSize)} | 
            Increase: ${((encodedSize / file.size - 1) * 100).toFixed(1)}%
        `;
    }
    
    function updateImageStats(image, base64) {
        const encodedSize = new Blob([base64]).size;
        document.getElementById('imageStats').innerHTML = `
            Original: ${formatFileSize(image.size)} | Base64: ${formatFileSize(encodedSize)} | 
            Increase: ${((encodedSize / image.size - 1) * 100).toFixed(1)}%
        `;
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
});
</script>

<style>
.tool-container {
    max-width: 1000px;
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

.tool-tabs {
    display: flex;
    border-bottom: 2px solid #e9ecef;
    margin-bottom: 30px;
}

.tab-btn {
    background: none;
    border: none;
    padding: 12px 24px;
    cursor: pointer;
    font-size: 1rem;
    color: #666;
    border-bottom: 2px solid transparent;
    transition: all 0.3s ease;
}

.tab-btn:hover {
    color: #667eea;
}

.tab-btn.active {
    color: #667eea;
    border-bottom-color: #667eea;
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
}

.converter-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
}

.input-section, .output-section {
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.input-section h3, .output-section h3 {
    margin-bottom: 15px;
    color: #333;
    font-size: 1.2rem;
}

textarea {
    width: 100%;
    height: 200px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    resize: vertical;
    margin-bottom: 15px;
}

.file-upload-area {
    border: 2px dashed #ddd;
    border-radius: 8px;
    padding: 30px;
    text-align: center;
    margin-bottom: 15px;
    transition: all 0.3s ease;
}

.file-upload-area.drag-over {
    border-color: #667eea;
    background-color: #f8f9ff;
}

.upload-icon {
    font-size: 2.5rem;
    margin-bottom: 10px;
    color: #667eea;
}

.upload-content p {
    color: #666;
    margin-bottom: 15px;
}

.upload-content button {
    background: #667eea;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.upload-content button:hover {
    background: #5a67d8;
}

.file-info, .image-info {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 6px;
    margin-bottom: 15px;
    color: #333;
    font-size: 0.9rem;
    line-height: 1.5;
}

.image-preview {
    text-align: center;
    margin-bottom: 15px;
}

.image-preview img {
    border: 1px solid #ddd;
    border-radius: 6px;
    margin-bottom: 10px;
}

.input-controls, .output-controls {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.action-btn {
    padding: 10px 20px;
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

.action-btn:disabled {
    background: #e9ecef;
    color: #6c757d;
    cursor: not-allowed;
}

.format-options {
    margin: 15px 0;
}

.format-options label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #333;
    font-size: 0.9rem;
}

.output-info {
    margin-top: 10px;
    font-size: 0.9rem;
    color: #666;
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
    
    .converter-section {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .input-section, .output-section {
        padding: 20px;
    }
    
    .tool-tabs {
        overflow-x: auto;
    }
    
    .tab-btn {
        padding: 10px 20px;
        white-space: nowrap;
    }
    
    .input-controls, .output-controls {
        justify-content: center;
    }
    
    .action-btn {
        padding: 8px 16px;
        font-size: 0.8rem;
    }
    
    textarea {
        height: 150px;
    }
    
    .file-upload-area {
        padding: 20px;
    }
}
</style>
