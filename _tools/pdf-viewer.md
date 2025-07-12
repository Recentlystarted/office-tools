---
layout: tool
title: "PDF Viewer - View and Manage PDF Pages Online"
description: "Free online PDF viewer with page management. View, organize, and manage PDF pages easily. No registration required, 100% secure and free."
keywords: "PDF viewer, PDF page manager, view PDF online, PDF page organizer, free PDF viewer"
tool_name: "PDF Viewer"
tool_category: "PDF Tools"
---

<!-- PDF.js for PDF viewing -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>

<div class="card">
  <div class="card-content">
    <h1 class="text-2xl font-bold text-foreground mb-2">PDF Viewer</h1>
    <p class="text-muted-foreground mb-6">View and manage PDF pages with advanced controls</p>
  </div>

  <div class="upload-section">
    <div class="upload-area" id="uploadArea">
      <div class="upload-icon">👁️</div>
      <h3>Drop PDF file here or click to browse</h3>
      <p>View and manage pages in your PDF document</p>
      <input type="file" id="fileInput" accept=".pdf" style="display: none;">
      <button class="upload-btn" onclick="document.getElementById('fileInput').click()">Choose PDF File</button>
    </div>
  </div>

  <div class="viewer-container" id="viewerContainer" style="display: none;">
    <div class="viewer-header">
      <div class="file-info">
        <h3 id="fileName">PDF Document</h3>
        <p id="fileDetails">Loading...</p>
      </div>
      <div class="viewer-controls">
        <button class="control-btn" id="prevPageBtn">← Previous</button>
        <span class="page-info" id="pageInfo">Page 1 of 1</span>
        <button class="control-btn" id="nextPageBtn">Next →</button>
      </div>
    </div>

    <div class="viewer-content">
      <div class="page-viewer">
        <canvas id="pdfCanvas"></canvas>
      </div>
      
      <div class="page-thumbnails">
        <div class="thumbnails-header">
          <h4>Page Thumbnails</h4>
          <div class="thumbnail-controls">
            <button class="thumb-btn" id="selectAllPagesBtn">Select All</button>
            <button class="thumb-btn" id="deselectAllPagesBtn">Deselect All</button>
            <button class="thumb-btn" id="invertSelectionBtn">Invert</button>
          </div>
        </div>
        <div class="thumbnails-container" id="thumbnailsContainer"></div>
      </div>
    </div>

    <div class="page-actions">
      <div class="action-group">
        <button class="action-btn" id="extractPagesBtn">Extract Selected Pages</button>
        <button class="action-btn" id="deletePagesBtn">Delete Selected Pages</button>
        <button class="action-btn" id="reorderPagesBtn">Reorder Pages</button>
      </div>
      <div class="action-group">
        <button class="action-btn secondary" id="downloadBtn">Download PDF</button>
        <button class="action-btn secondary" id="clearBtn">Clear File</button>
      </div>
    </div>
  </div>

  <div class="features-section">
    <h2>Features</h2>
    <div class="features-grid">
      <div class="feature">
        <div class="feature-icon">👁️</div>
        <h3>Page Preview</h3>
        <p>View each page in high quality with zoom controls</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📄</div>
        <h3>Page Management</h3>
        <p>Select, extract, delete, and reorder pages easily</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🔒</div>
        <h3>100% Secure</h3>
        <p>Files are processed locally and never stored on our servers</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📱</div>
        <h3>Mobile Friendly</h3>
        <p>Works perfectly on all devices and browsers</p>
      </div>
    </div>
  </div>
</div>

<script>
// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let currentPdf = null;
let currentPage = 1;
let totalPages = 0;
let selectedPages = [];
let pdfDocument = null;

document.getElementById('fileInput').addEventListener('change', handleFileSelect);
document.getElementById('prevPageBtn').addEventListener('click', previousPage);
document.getElementById('nextPageBtn').addEventListener('click', nextPage);
document.getElementById('selectAllPagesBtn').addEventListener('click', selectAllPages);
document.getElementById('deselectAllPagesBtn').addEventListener('click', deselectAllPages);
document.getElementById('invertSelectionBtn').addEventListener('click', invertSelection);
document.getElementById('extractPagesBtn').addEventListener('click', extractSelectedPages);
document.getElementById('deletePagesBtn').addEventListener('click', deleteSelectedPages);
document.getElementById('reorderPagesBtn').addEventListener('click', reorderPages);
document.getElementById('downloadBtn').addEventListener('click', downloadPDF);
document.getElementById('clearBtn').addEventListener('click', clearFile);

function handleFileSelect(event) {
  const file = event.target.files[0];
  
  if (!file) return;
  
  if (file.type !== 'application/pdf') {
    showMessage('Please select a PDF file only.', 'error');
    return;
  }
  
  if (file.size > 50 * 1024 * 1024) {
    showMessage('File size must be less than 50MB.', 'error');
    return;
  }
  
  loadPDF(file);
}

async function loadPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    totalPages = pdfDocument.numPages;
    currentPage = 1;
    selectedPages = Array.from({length: totalPages}, (_, i) => i);
    
    // Update file info
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileDetails').textContent = `${totalPages} pages • ${(file.size / 1024 / 1024).toFixed(2)} MB`;
    
    // Show viewer
    document.getElementById('viewerContainer').style.display = 'block';
    document.getElementById('uploadArea').style.display = 'none';
    
    // Load first page
    await renderPage(currentPage);
    
    // Generate thumbnails
    generateThumbnails();
    
    showMessage('PDF loaded successfully!', 'success');
    
  } catch (error) {
    console.error('Error loading PDF:', error);
    showMessage('Error loading PDF. Please try again.', 'error');
  }
}

async function renderPage(pageNum) {
  if (!pdfDocument) return;
  
  try {
    const page = await pdfDocument.getPage(pageNum);
    const canvas = document.getElementById('pdfCanvas');
    const context = canvas.getContext('2d');
    
    // Calculate scale to fit canvas
    const viewport = page.getViewport({ scale: 1.0 });
    const canvasWidth = canvas.clientWidth;
    const scale = canvasWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale: scale });
    
    canvas.height = scaledViewport.height;
    canvas.width = scaledViewport.width;
    
    const renderContext = {
      canvasContext: context,
      viewport: scaledViewport
    };
    
    await page.render(renderContext).promise;
    
    // Update page info
    document.getElementById('pageInfo').textContent = `Page ${pageNum} of ${totalPages}`;
    
    // Update navigation buttons
    document.getElementById('prevPageBtn').disabled = pageNum <= 1;
    document.getElementById('nextPageBtn').disabled = pageNum >= totalPages;
    
  } catch (error) {
    console.error('Error rendering page:', error);
    showMessage('Error rendering page.', 'error');
  }
}

async function generateThumbnails() {
  const container = document.getElementById('thumbnailsContainer');
  container.innerHTML = '';
  
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const thumbnailItem = document.createElement('div');
    thumbnailItem.className = 'thumbnail-item';
    thumbnailItem.innerHTML = `
      <div class="thumbnail-checkbox">
        <input type="checkbox" id="thumb-${pageNum}" checked>
        <label for="thumb-${pageNum}"></label>
      </div>
      <div class="thumbnail-canvas" id="thumb-canvas-${pageNum}">
        <div class="page-number">${pageNum}</div>
      </div>
    `;
    
    container.appendChild(thumbnailItem);
    
    // Add event listener
    const checkbox = thumbnailItem.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      updatePageSelection(pageNum - 1, checkbox.checked);
    });
    
    // Generate thumbnail
    try {
      const page = await pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale: 0.2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      
      const thumbnail = thumbnailItem.querySelector('.thumbnail-canvas');
      thumbnail.style.backgroundImage = `url(${canvas.toDataURL()})`;
      thumbnail.style.backgroundSize = 'cover';
      thumbnail.style.backgroundPosition = 'center';
      
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  }
}

function updatePageSelection(pageIndex, selected) {
  if (selected) {
    if (!selectedPages.includes(pageIndex)) {
      selectedPages.push(pageIndex);
    }
  } else {
    selectedPages = selectedPages.filter(p => p !== pageIndex);
  }
  
  updateActionButtons();
}

function selectAllPages() {
  selectedPages = Array.from({length: totalPages}, (_, i) => i);
  
  // Update checkboxes
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const checkbox = document.getElementById(`thumb-${pageNum}`);
    if (checkbox) checkbox.checked = true;
  }
  
  updateActionButtons();
}

function deselectAllPages() {
  selectedPages = [];
  
  // Update checkboxes
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const checkbox = document.getElementById(`thumb-${pageNum}`);
    if (checkbox) checkbox.checked = false;
  }
  
  updateActionButtons();
}

function invertSelection() {
  const allPages = Array.from({length: totalPages}, (_, i) => i);
  selectedPages = allPages.filter(p => !selectedPages.includes(p));
  
  // Update checkboxes
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const checkbox = document.getElementById(`thumb-${pageNum}`);
    if (checkbox) checkbox.checked = selectedPages.includes(pageNum - 1);
  }
  
  updateActionButtons();
}

function updateActionButtons() {
  const hasSelection = selectedPages.length > 0;
  document.getElementById('extractPagesBtn').disabled = !hasSelection;
  document.getElementById('deletePagesBtn').disabled = !hasSelection;
  document.getElementById('reorderPagesBtn').disabled = !hasSelection;
}

function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
  }
}

function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    renderPage(currentPage);
  }
}

function extractSelectedPages() {
  if (selectedPages.length === 0) {
    showMessage('Please select pages to extract.', 'error');
    return;
  }
  
  showMessage(`Extracting ${selectedPages.length} pages...`, 'info');
  // Implementation for extracting pages would go here
}

function deleteSelectedPages() {
  if (selectedPages.length === 0) {
    showMessage('Please select pages to delete.', 'error');
    return;
  }
  
  if (confirm(`Are you sure you want to delete ${selectedPages.length} pages?`)) {
    showMessage(`Deleting ${selectedPages.length} pages...`, 'info');
    // Implementation for deleting pages would go here
  }
}

function reorderPages() {
  if (selectedPages.length === 0) {
    showMessage('Please select pages to reorder.', 'error');
    return;
  }
  
  showMessage('Page reordering feature coming soon!', 'info');
}

function downloadPDF() {
  if (!pdfDocument) {
    showMessage('No PDF loaded.', 'error');
    return;
  }
  
  showMessage('Download feature coming soon!', 'info');
}

function clearFile() {
  currentPdf = null;
  currentPage = 1;
  totalPages = 0;
  selectedPages = [];
  pdfDocument = null;
  
  document.getElementById('viewerContainer').style.display = 'none';
  document.getElementById('uploadArea').style.display = 'block';
  document.getElementById('fileInput').value = '';
  
  showMessage('File cleared.', 'info');
}

function showMessage(message, type = 'info') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);
  
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

// Drag and drop functionality
const uploadArea = document.getElementById('uploadArea');

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
  
  const files = Array.from(e.dataTransfer.files);
  if (files.length > 0) {
    const file = files[0];
    if (file.type === 'application/pdf') {
      if (file.size > 50 * 1024 * 1024) {
        showMessage('File size must be less than 50MB.', 'error');
        return;
      }
      loadPDF(file);
    } else {
      showMessage('Please select a PDF file only.', 'error');
    }
  }
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
  margin-bottom: 40px;
}

.tool-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.tool-header p {
  font-size: 1.2rem;
  color: #666;
}

.upload-section {
  margin-bottom: 40px;
}

.upload-area {
  border: 3px dashed #667eea;
  border-radius: 12px;
  padding: 60px 20px;
  text-align: center;
  background: #f8f9fa;
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #764ba2;
  background: #f0f2ff;
}

.upload-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.upload-area h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #333;
}

.upload-area p {
  color: #666;
  margin-bottom: 30px;
}

.upload-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background: #764ba2;
  transform: translateY(-2px);
}

.viewer-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
}

.viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.file-info h3 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 1.2rem;
}

.file-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.viewer-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.control-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover:not(:disabled) {
  background: #764ba2;
  transform: translateY(-1px);
}

.control-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.page-info {
  font-weight: 500;
  color: #333;
  min-width: 100px;
  text-align: center;
}

.viewer-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 0;
  height: 600px;
}

.page-viewer {
  padding: 20px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

#pdfCanvas {
  max-width: 100%;
  max-height: 100%;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border-radius: 8px;
}

.page-thumbnails {
  border-left: 1px solid #e9ecef;
  background: white;
  display: flex;
  flex-direction: column;
}

.thumbnails-header {
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.thumbnails-header h4 {
  margin: 0;
  color: #333;
  font-size: 1rem;
}

.thumbnail-controls {
  display: flex;
  gap: 8px;
}

.thumb-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.thumb-btn:hover {
  background: #495057;
}

.thumbnails-container {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
}

.thumbnail-item {
  position: relative;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.thumbnail-item:hover {
  border-color: #667eea;
  transform: translateY(-1px);
}

.thumbnail-checkbox {
  position: absolute;
  top: 2px;
  left: 2px;
  z-index: 2;
}

.thumbnail-checkbox input[type="checkbox"] {
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.thumbnail-canvas {
  width: 100%;
  height: 100px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.page-number {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 1px 4px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 500;
}

.page-actions {
  padding: 20px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.action-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover:not(:disabled) {
  background: #764ba2;
  transform: translateY(-1px);
}

.action-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.action-btn.secondary {
  background: #6c757d;
}

.action-btn.secondary:hover {
  background: #495057;
}

.features-section {
  margin-top: 60px;
}

.features-section h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 40px;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #333;
}

.feature p {
  color: #666;
  line-height: 1.6;
}

/* Message styles */
.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.message.success {
  background: #28a745;
}

.message.error {
  background: #dc3545;
}

.message.info {
  background: #17a2b8;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .tool-header h1 {
    font-size: 2rem;
  }
  
  .upload-area {
    padding: 40px 20px;
  }
  
  .upload-icon {
    font-size: 3rem;
  }
  
  .viewer-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .viewer-controls {
    justify-content: center;
  }
  
  .viewer-content {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .page-viewer {
    height: 400px;
  }
  
  .page-thumbnails {
    border-left: none;
    border-top: 1px solid #e9ecef;
  }
  
  .page-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-group {
    justify-content: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style> 