---
layout: tool
title: "Rotate PDF - Free Online PDF Rotation Tool"
description: "Rotate PDF pages to the correct orientation. Choose from 90°, 180°, or 270° rotation. Simple and fast PDF rotation online."
tool_name: "Rotate PDF"
permalink: /tools/rotate-pdf/
---

<div class="card">
  <div class="card-content">
    <h1 class="text-2xl font-bold text-foreground mb-2">Rotate PDF</h1>
    <p class="text-muted-foreground mb-6">Rotate your PDF pages to the correct orientation</p>
  </div>

  <div class="upload-area" id="uploadArea">
    <div class="upload-content">
      <div class="upload-icon">🔄</div>
      <h3>Select PDF to Rotate</h3>
      <p>Choose a PDF file to rotate its pages</p>
      <input type="file" id="fileInput" accept=".pdf" multiple>
      <div class="upload-button">
        <button type="button" onclick="document.getElementById('fileInput').click()">Choose PDF File</button>
      </div>
      <div class="upload-note">
        <small>Your files are processed locally and never uploaded to any server</small>
      </div>
    </div>
  </div>

  <div class="rotation-controls" id="rotationControls" style="display: none;">
    <h3>Rotation Options</h3>
    <div class="rotation-buttons">
      <button class="rotation-btn" data-angle="90">
        <span class="rotation-icon">↻</span>
        <span>90° Right</span>
      </button>
      <button class="rotation-btn" data-angle="180">
        <span class="rotation-icon">↻</span>
        <span>180°</span>
      </button>
      <button class="rotation-btn" data-angle="270">
        <span class="rotation-icon">↺</span>
        <span>90° Left</span>
      </button>
    </div>
    <div class="page-options">
      <label>
        <input type="radio" name="pages" value="all" checked> All pages
      </label>
      <label>
        <input type="radio" name="pages" value="odd"> Odd pages only
      </label>
      <label>
        <input type="radio" name="pages" value="even"> Even pages only
      </label>
      <label>
        <input type="radio" name="pages" value="custom"> Custom pages:
        <input type="text" id="customPages" placeholder="e.g., 1-3,5,7-10" disabled>
      </label>
    </div>
  </div>

  <div class="preview-area" id="previewArea" style="display: none;">
    <h3>Preview</h3>
    <div class="preview-container" id="previewContainer">
      <!-- Preview will be inserted here -->
    </div>
  </div>

  <div class="download-area" id="downloadArea" style="display: none;">
    <button id="downloadBtn" class="download-btn">Download Rotated PDF</button>
  </div>

  <div class="error-message" id="errorMessage" style="display: none;"></div>
  <div class="progress-bar" id="progressBar" style="display: none;">
    <div class="progress-fill"></div>
    <span class="progress-text">Processing...</span>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const rotationControls = document.getElementById('rotationControls');
    const previewArea = document.getElementById('previewArea');
    const downloadArea = document.getElementById('downloadArea');
    const errorMessage = document.getElementById('errorMessage');
    const progressBar = document.getElementById('progressBar');
    
    let currentPdfBytes = null;
    let selectedAngle = 0;
    let selectedPages = 'all';
    
    // File input handling
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect({ target: { files } });
        }
    });
    
    // Rotation controls
    document.querySelectorAll('.rotation-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.rotation-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedAngle = parseInt(btn.dataset.angle);
            if (currentPdfBytes) {
                updatePreview();
            }
        });
    });
    
    // Page options
    document.querySelectorAll('input[name="pages"]').forEach(radio => {
        radio.addEventListener('change', () => {
            selectedPages = radio.value;
            const customInput = document.getElementById('customPages');
            customInput.disabled = radio.value !== 'custom';
            if (currentPdfBytes) {
                updatePreview();
            }
        });
    });
    
    document.getElementById('customPages').addEventListener('input', () => {
        if (currentPdfBytes) {
            updatePreview();
        }
    });
    
    async function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (file.type !== 'application/pdf') {
            showError('Please select a PDF file.');
            return;
        }
        
        if (file.size > 100 * 1024 * 1024) {
            showError('File size must be less than 100MB.');
            return;
        }
        
        try {
            showProgress('Loading PDF...');
            const arrayBuffer = await file.arrayBuffer();
            currentPdfBytes = new Uint8Array(arrayBuffer);
            
            // Show controls
            rotationControls.style.display = 'block';
            
            // Set default rotation if none selected
            if (selectedAngle === 0) {
                document.querySelector('.rotation-btn[data-angle="90"]').click();
            }
            
            hideProgress();
            hideError();
            
        } catch (error) {
            hideProgress();
            showError('Error loading PDF: ' + error.message);
        }
    }
    
    async function updatePreview() {
        if (!currentPdfBytes || selectedAngle === 0) return;
        
        try {
            showProgress('Generating preview...');
            
            const pdfDoc = await PDFLib.PDFDocument.load(currentPdfBytes);
            const pageCount = pdfDoc.getPageCount();
            const pagesToRotate = getPageIndices(pageCount);
            
            // Create preview
            const previewContainer = document.getElementById('previewContainer');
            previewContainer.innerHTML = '';
            
            const previewInfo = document.createElement('div');
            previewInfo.className = 'preview-info';
            previewInfo.innerHTML = `
                <p><strong>Pages to rotate:</strong> ${pagesToRotate.length} of ${pageCount}</p>
                <p><strong>Rotation:</strong> ${selectedAngle}°</p>
            `;
            previewContainer.appendChild(previewInfo);
            
            // Show download button
            downloadArea.style.display = 'block';
            previewArea.style.display = 'block';
            
            hideProgress();
            
        } catch (error) {
            hideProgress();
            showError('Error generating preview: ' + error.message);
        }
    }
    
    function getPageIndices(pageCount) {
        const indices = [];
        
        if (selectedPages === 'all') {
            for (let i = 0; i < pageCount; i++) {
                indices.push(i);
            }
        } else if (selectedPages === 'odd') {
            for (let i = 0; i < pageCount; i += 2) {
                indices.push(i);
            }
        } else if (selectedPages === 'even') {
            for (let i = 1; i < pageCount; i += 2) {
                indices.push(i);
            }
        } else if (selectedPages === 'custom') {
            const customInput = document.getElementById('customPages').value;
            const ranges = customInput.split(',');
            
            ranges.forEach(range => {
                range = range.trim();
                if (range.includes('-')) {
                    const [start, end] = range.split('-').map(n => parseInt(n.trim()));
                    for (let i = Math.max(1, start); i <= Math.min(pageCount, end); i++) {
                        if (!indices.includes(i - 1)) {
                            indices.push(i - 1);
                        }
                    }
                } else {
                    const pageNum = parseInt(range);
                    if (pageNum >= 1 && pageNum <= pageCount && !indices.includes(pageNum - 1)) {
                        indices.push(pageNum - 1);
                    }
                }
            });
        }
        
        return indices.sort((a, b) => a - b);
    }
    
    // Download functionality
    document.getElementById('downloadBtn').addEventListener('click', async () => {
        if (!currentPdfBytes) return;
        
        try {
            showProgress('Rotating PDF...');
            
            const pdfDoc = await PDFLib.PDFDocument.load(currentPdfBytes);
            const pageCount = pdfDoc.getPageCount();
            const pagesToRotate = getPageIndices(pageCount);
            
            // Rotate selected pages
            pagesToRotate.forEach(pageIndex => {
                const page = pdfDoc.getPage(pageIndex);
                page.setRotation(PDFLib.degrees(selectedAngle));
            });
            
            // Generate rotated PDF
            const pdfBytes = await pdfDoc.save();
            
            // Download
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'rotated-document.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            hideProgress();
            
        } catch (error) {
            hideProgress();
            showError('Error rotating PDF: ' + error.message);
        }
    });
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    function hideError() {
        errorMessage.style.display = 'none';
    }
    
    function showProgress(message) {
        progressBar.querySelector('.progress-text').textContent = message;
        progressBar.style.display = 'block';
    }
    
    function hideProgress() {
        progressBar.style.display = 'none';
    }
});
</script>

<style>
.tool-container {
    max-width: 800px;
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

.upload-area {
    border: 2px dashed #ddd;
    border-radius: 12px;
    padding: 40px;
    text-align: center;
    margin-bottom: 30px;
    transition: all 0.3s ease;
}

.upload-area.drag-over {
    border-color: #667eea;
    background-color: #f8f9ff;
}

.upload-icon {
    font-size: 4rem;
    margin-bottom: 20px;
    color: #667eea;
}

.upload-content h3 {
    margin-bottom: 10px;
    color: #333;
}

.upload-content p {
    color: #666;
    margin-bottom: 20px;
}

.upload-button button {
    background: #667eea;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 25px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s ease;
}

.upload-button button:hover {
    background: #5a67d8;
}

.upload-note {
    margin-top: 15px;
}

.upload-note small {
    color: #888;
    font-size: 0.9rem;
}

#fileInput {
    display: none;
}

.rotation-controls {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin-bottom: 30px;
}

.rotation-controls h3 {
    margin-bottom: 20px;
    color: #333;
}

.rotation-buttons {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.rotation-btn {
    background: white;
    border: 2px solid #ddd;
    padding: 15px 20px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    min-width: 100px;
}

.rotation-btn:hover {
    border-color: #667eea;
}

.rotation-btn.active {
    border-color: #667eea;
    background: #f8f9ff;
}

.rotation-icon {
    font-size: 1.5rem;
    color: #667eea;
}

.page-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.page-options label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #333;
}

.page-options input[type="text"] {
    margin-left: 10px;
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 200px;
}

.page-options input[type="text"]:disabled {
    background: #f5f5f5;
    color: #999;
}

.preview-area {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin-bottom: 30px;
}

.preview-area h3 {
    margin-bottom: 20px;
    color: #333;
}

.preview-info {
    background: #f8f9ff;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid #667eea;
}

.preview-info p {
    margin: 5px 0;
    color: #333;
}

.download-area {
    text-align: center;
    margin-bottom: 30px;
}

.download-btn {
    background: #28a745;
    color: white;
    border: none;
    padding: 15px 40px;
    border-radius: 25px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background 0.3s ease;
}

.download-btn:hover {
    background: #218838;
}

.error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid #f5c6cb;
}

.progress-bar {
    background: #e9ecef;
    border-radius: 25px;
    padding: 10px 20px;
    margin-bottom: 20px;
    text-align: center;
}

.progress-fill {
    background: linear-gradient(90deg, #667eea, #764ba2);
    height: 6px;
    border-radius: 3px;
    animation: progress 1.5s ease-in-out infinite;
}

.progress-text {
    color: #333;
    font-weight: 500;
    margin-top: 10px;
    display: block;
}

@keyframes progress {
    0% { width: 0%; }
    50% { width: 100%; }
    100% { width: 0%; }
}

@media (max-width: 768px) {
    .tool-container {
        padding: 15px;
    }
    
    .upload-area {
        padding: 30px 20px;
    }
    
    .rotation-buttons {
        justify-content: center;
    }
    
    .rotation-btn {
        min-width: 80px;
        padding: 12px 15px;
    }
    
    .page-options input[type="text"] {
        width: 150px;
    }
}
</style>
