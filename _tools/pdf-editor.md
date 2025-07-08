---
layout: tool
title: "PDF Editor - Free Online PDF Editing Tool"
description: "Edit PDF files online for free. Add text, images, shapes, annotations, and highlights. Draw, erase, and modify your PDFs easily."
tool_name: "PDF Editor"
permalink: /tools/pdf-editor/
---

<div class="tool-container">
  <div class="tool-header">
    <h1>PDF Editor</h1>
    <p>Edit your PDF files with our comprehensive online editor</p>
  </div>

  <div class="upload-area" id="uploadArea">
    <div class="upload-content">
      <div class="upload-icon">🖊️</div>
      <h3>Select PDF to Edit</h3>
      <p>Choose a PDF file to start editing</p>
      <input type="file" id="fileInput" accept=".pdf">
      <div class="upload-button">
        <button type="button" onclick="document.getElementById('fileInput').click()">Choose PDF File</button>
      </div>
      <div class="upload-note">
        <small>Your files are processed locally and never uploaded to any server</small>
      </div>
    </div>
  </div>

  <div class="editor-container" id="editorContainer" style="display: none;">
    <div class="toolbar">
      <div class="tool-group">
        <button class="tool-btn active" data-tool="select" title="Select">
          <span>👆</span>
        </button>
        <button class="tool-btn" data-tool="text" title="Add Text">
          <span>T</span>
        </button>
        <button class="tool-btn" data-tool="draw" title="Draw">
          <span>✏️</span>
        </button>
        <button class="tool-btn" data-tool="highlight" title="Highlight">
          <span>🖍️</span>
        </button>
        <button class="tool-btn" data-tool="shape" title="Add Shape">
          <span>⬜</span>
        </button>
        <button class="tool-btn" data-tool="erase" title="Erase">
          <span>🧹</span>
        </button>
      </div>
      
      <div class="tool-group">
        <input type="color" id="colorPicker" value="#000000" title="Color">
        <input type="range" id="sizeSlider" min="1" max="50" value="2" title="Size">
        <span id="sizeValue">2px</span>
      </div>
      
      <div class="tool-group">
        <button class="action-btn" id="undoBtn" title="Undo">↶</button>
        <button class="action-btn" id="redoBtn" title="Redo">↷</button>
        <button class="action-btn" id="clearBtn" title="Clear All">🗑️</button>
      </div>
    </div>

    <div class="editor-workspace">
      <div class="page-navigation">
        <button id="prevPage">‹ Previous</button>
        <span id="pageInfo">Page 1 of 1</span>
        <button id="nextPage">Next ›</button>
      </div>
      
      <div class="canvas-container">
        <canvas id="pdfCanvas"></canvas>
        <canvas id="editCanvas"></canvas>
      </div>
    </div>

    <div class="text-input-modal" id="textModal" style="display: none;">
      <div class="modal-content">
        <h3>Add Text</h3>
        <textarea id="textInput" placeholder="Enter your text here..."></textarea>
        <div class="text-options">
          <select id="fontFamily">
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times">Times</option>
            <option value="Courier">Courier</option>
          </select>
          <input type="number" id="fontSize" value="16" min="8" max="72" placeholder="Size">
          <label>
            <input type="checkbox" id="fontBold"> Bold
          </label>
          <label>
            <input type="checkbox" id="fontItalic"> Italic
          </label>
        </div>
        <div class="modal-buttons">
          <button id="addTextBtn">Add Text</button>
          <button id="cancelTextBtn">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <div class="download-area" id="downloadArea" style="display: none;">
    <button id="downloadBtn" class="download-btn">Download Edited PDF</button>
  </div>

  <div class="error-message" id="errorMessage" style="display: none;"></div>
  <div class="progress-bar" id="progressBar" style="display: none;">
    <div class="progress-fill"></div>
    <span class="progress-text">Loading PDF...</span>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.10.111/pdf.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Set up PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.10.111/pdf.worker.min.js';
    
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const editorContainer = document.getElementById('editorContainer');
    const downloadArea = document.getElementById('downloadArea');
    const errorMessage = document.getElementById('errorMessage');
    const progressBar = document.getElementById('progressBar');
    
    const pdfCanvas = document.getElementById('pdfCanvas');
    const editCanvas = document.getElementById('editCanvas');
    const pdfCtx = pdfCanvas.getContext('2d');
    const editCtx = editCanvas.getContext('2d');
    
    let pdfDoc = null;
    let currentPage = 1;
    let scale = 1.5;
    let currentTool = 'select';
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let editHistory = [];
    let historyStep = -1;
    let textPosition = null;
    
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
    
    async function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (file.type !== 'application/pdf') {
            showError('Please select a PDF file.');
            return;
        }
        
        if (file.size > 50 * 1024 * 1024) {
            showError('File size must be less than 50MB.');
            return;
        }
        
        try {
            showProgress('Loading PDF...');
            const arrayBuffer = await file.arrayBuffer();
            pdfDoc = await pdfjsLib.getDocument(arrayBuffer).promise;
            
            setupEditor();
            await renderPage(currentPage);
            
            uploadArea.style.display = 'none';
            editorContainer.style.display = 'block';
            downloadArea.style.display = 'block';
            
            hideProgress();
            hideError();
            
        } catch (error) {
            hideProgress();
            showError('Error loading PDF: ' + error.message);
        }
    }
    
    function setupEditor() {
        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentTool = btn.dataset.tool;
                editCanvas.style.cursor = getCursor(currentTool);
            });
        });
        
        // Color and size controls
        document.getElementById('colorPicker').addEventListener('change', (e) => {
            editCtx.strokeStyle = e.target.value;
            editCtx.fillStyle = e.target.value;
        });
        
        document.getElementById('sizeSlider').addEventListener('input', (e) => {
            editCtx.lineWidth = e.target.value;
            document.getElementById('sizeValue').textContent = e.target.value + 'px';
        });
        
        // Canvas drawing
        editCanvas.addEventListener('mousedown', startDrawing);
        editCanvas.addEventListener('mousemove', draw);
        editCanvas.addEventListener('mouseup', stopDrawing);
        editCanvas.addEventListener('click', handleCanvasClick);
        
        // Page navigation
        document.getElementById('prevPage').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPage(currentPage);
            }
        });
        
        document.getElementById('nextPage').addEventListener('click', () => {
            if (currentPage < pdfDoc.numPages) {
                currentPage++;
                renderPage(currentPage);
            }
        });
        
        // History controls
        document.getElementById('undoBtn').addEventListener('click', undo);
        document.getElementById('redoBtn').addEventListener('click', redo);
        document.getElementById('clearBtn').addEventListener('click', clearCanvas);
        
        // Text modal
        document.getElementById('addTextBtn').addEventListener('click', addText);
        document.getElementById('cancelTextBtn').addEventListener('click', () => {
            document.getElementById('textModal').style.display = 'none';
        });
        
        // Initialize drawing context
        editCtx.strokeStyle = '#000000';
        editCtx.fillStyle = '#000000';
        editCtx.lineWidth = 2;
        editCtx.lineCap = 'round';
        editCtx.lineJoin = 'round';
    }
    
    async function renderPage(pageNum) {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        
        pdfCanvas.width = viewport.width;
        pdfCanvas.height = viewport.height;
        editCanvas.width = viewport.width;
        editCanvas.height = viewport.height;
        
        const renderContext = {
            canvasContext: pdfCtx,
            viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        document.getElementById('pageInfo').textContent = `Page ${pageNum} of ${pdfDoc.numPages}`;
        
        // Update navigation buttons
        document.getElementById('prevPage').disabled = pageNum === 1;
        document.getElementById('nextPage').disabled = pageNum === pdfDoc.numPages;
        
        saveState();
    }
    
    function getCursor(tool) {
        switch (tool) {
            case 'text': return 'text';
            case 'draw': return 'crosshair';
            case 'highlight': return 'crosshair';
            case 'shape': return 'crosshair';
            case 'erase': return 'crosshair';
            default: return 'default';
        }
    }
    
    function startDrawing(e) {
        if (currentTool === 'select' || currentTool === 'text') return;
        
        isDrawing = true;
        const rect = editCanvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
        
        if (currentTool === 'erase') {
            editCtx.globalCompositeOperation = 'destination-out';
        } else {
            editCtx.globalCompositeOperation = 'source-over';
        }
        
        if (currentTool === 'highlight') {
            editCtx.globalAlpha = 0.3;
        } else {
            editCtx.globalAlpha = 1;
        }
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        const rect = editCanvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        editCtx.beginPath();
        editCtx.moveTo(lastX, lastY);
        editCtx.lineTo(currentX, currentY);
        editCtx.stroke();
        
        lastX = currentX;
        lastY = currentY;
    }
    
    function stopDrawing() {
        if (!isDrawing) return;
        isDrawing = false;
        editCtx.globalAlpha = 1;
        editCtx.globalCompositeOperation = 'source-over';
        saveState();
    }
    
    function handleCanvasClick(e) {
        if (currentTool === 'text') {
            const rect = editCanvas.getBoundingClientRect();
            textPosition = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            document.getElementById('textModal').style.display = 'block';
            document.getElementById('textInput').focus();
        } else if (currentTool === 'shape') {
            const rect = editCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const size = parseInt(document.getElementById('sizeSlider').value) * 5;
            
            editCtx.strokeRect(x - size/2, y - size/2, size, size);
            saveState();
        }
    }
    
    function addText() {
        const text = document.getElementById('textInput').value;
        if (!text || !textPosition) return;
        
        const fontFamily = document.getElementById('fontFamily').value;
        const fontSize = document.getElementById('fontSize').value;
        const fontBold = document.getElementById('fontBold').checked;
        const fontItalic = document.getElementById('fontItalic').checked;
        
        let fontStyle = '';
        if (fontItalic) fontStyle += 'italic ';
        if (fontBold) fontStyle += 'bold ';
        
        editCtx.font = `${fontStyle}${fontSize}px ${fontFamily}`;
        editCtx.fillText(text, textPosition.x, textPosition.y);
        
        document.getElementById('textModal').style.display = 'none';
        document.getElementById('textInput').value = '';
        saveState();
    }
    
    function saveState() {
        historyStep++;
        if (historyStep < editHistory.length) {
            editHistory.length = historyStep;
        }
        editHistory.push(editCanvas.toDataURL());
    }
    
    function undo() {
        if (historyStep > 0) {
            historyStep--;
            restoreState();
        }
    }
    
    function redo() {
        if (historyStep < editHistory.length - 1) {
            historyStep++;
            restoreState();
        }
    }
    
    function restoreState() {
        const img = new Image();
        img.onload = () => {
            editCtx.clearRect(0, 0, editCanvas.width, editCanvas.height);
            editCtx.drawImage(img, 0, 0);
        };
        img.src = editHistory[historyStep];
    }
    
    function clearCanvas() {
        editCtx.clearRect(0, 0, editCanvas.width, editCanvas.height);
        saveState();
    }
    
    // Download functionality - placeholder for now
    document.getElementById('downloadBtn').addEventListener('click', () => {
        // Create a composite canvas
        const compositeCanvas = document.createElement('canvas');
        compositeCanvas.width = pdfCanvas.width;
        compositeCanvas.height = pdfCanvas.height;
        const compositeCtx = compositeCanvas.getContext('2d');
        
        // Draw PDF and edits together
        compositeCtx.drawImage(pdfCanvas, 0, 0);
        compositeCtx.drawImage(editCanvas, 0, 0);
        
        // Download as image for now (full PDF editing would require more complex implementation)
        const link = document.createElement('a');
        link.download = `edited-page-${currentPage}.png`;
        link.href = compositeCanvas.toDataURL();
        link.click();
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

.editor-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    overflow: hidden;
}

.toolbar {
    background: #f8f9fa;
    padding: 15px;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
}

.tool-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.tool-btn {
    background: white;
    border: 1px solid #dee2e6;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
}

.tool-btn:hover {
    background: #e9ecef;
}

.tool-btn.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
}

.action-btn {
    background: #6c757d;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.action-btn:hover {
    background: #5a6268;
}

#colorPicker {
    width: 40px;
    height: 35px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

#sizeSlider {
    width: 80px;
}

#sizeValue {
    font-size: 0.9rem;
    color: #666;
    min-width: 40px;
}

.editor-workspace {
    padding: 20px;
}

.page-navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
}

.page-navigation button {
    background: #667eea;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.page-navigation button:hover:not(:disabled) {
    background: #5a67d8;
}

.page-navigation button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

#pageInfo {
    font-weight: 500;
    color: #333;
}

.canvas-container {
    position: relative;
    display: inline-block;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

#pdfCanvas, #editCanvas {
    display: block;
}

#editCanvas {
    position: absolute;
    top: 0;
    left: 0;
    cursor: default;
}

.text-input-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 30px;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
}

.modal-content h3 {
    margin-bottom: 20px;
    color: #333;
}

#textInput {
    width: 100%;
    height: 100px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    margin-bottom: 20px;
    resize: vertical;
    font-family: inherit;
}

.text-options {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.text-options select,
.text-options input[type="number"] {
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.text-options label {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #333;
}

.modal-buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.modal-buttons button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s ease;
}

#addTextBtn {
    background: #667eea;
    color: white;
}

#addTextBtn:hover {
    background: #5a67d8;
}

#cancelTextBtn {
    background: #6c757d;
    color: white;
}

#cancelTextBtn:hover {
    background: #5a6268;
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
    
    .toolbar {
        padding: 10px;
        gap: 10px;
    }
    
    .tool-group {
        gap: 5px;
    }
    
    .tool-btn, .action-btn {
        padding: 6px 10px;
        font-size: 0.9rem;
    }
    
    .page-navigation {
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .editor-workspace {
        padding: 15px;
    }
    
    .canvas-container {
        max-width: 100%;
        overflow: auto;
    }
    
    .modal-content {
        padding: 20px;
    }
    
    .text-options {
        gap: 10px;
    }
}
</style>
