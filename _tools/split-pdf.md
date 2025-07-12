---
layout: tool
title: "Split PDF - Divide PDF into Multiple Files"
description: "Free online PDF splitter. Split large PDF files into smaller documents. Extract specific pages or split by page ranges. No registration required."
keywords: "split PDF, PDF splitter, divide PDF, extract pages, PDF separator, free PDF tools"
tool_name: "Split PDF"
tool_category: "PDF Tools"
---

<!-- PDF.js for PDF processing -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<!-- PDF-lib for PDF manipulation -->
<script src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js"></script>

<div class="card">
  <div class="card-content">
    <h1 class="text-2xl font-bold text-foreground mb-2">Split PDF</h1>
    <p class="text-muted-foreground mb-6">Split large PDF files into smaller documents or extract specific pages</p>
  </div>

  <div class="upload-section">
    <div class="upload-area" id="uploadArea">
      <div class="upload-icon">✂️</div>
      <h3>Drop PDF file here or click to browse</h3>
      <p>Split your PDF into multiple files</p>
      <input type="file" id="fileInput" accept=".pdf" style="display: none;">
      <button class="upload-btn" onclick="document.getElementById('fileInput').click()">Choose PDF File</button>
    </div>
  </div>

  <div class="file-info" id="fileInfo" style="display: none;">
    <h3>Selected File</h3>
    <div class="file-details" id="fileDetails"></div>
    
    <div class="split-options">
      <h4>Split Options</h4>
      <div class="option-tabs">
        <button class="tab-btn active" data-tab="pages">Split by Pages</button>
        <button class="tab-btn" data-tab="ranges">Split by Ranges</button>
        <button class="tab-btn" data-tab="size">Split by Size</button>
      </div>
      
      <div class="tab-content" id="pages-tab">
        <h5>Select Pages to Extract</h5>
        <div class="pages-grid" id="pagesGrid"></div>
        <div class="page-controls">
          <button class="page-btn" id="selectAllPages">Select All</button>
          <button class="page-btn" id="deselectAllPages">Deselect All</button>
          <button class="page-btn" id="selectOddPages">Odd Pages</button>
          <button class="page-btn" id="selectEvenPages">Even Pages</button>
        </div>
      </div>
      
      <div class="tab-content" id="ranges-tab" style="display: none;">
        <h5>Define Page Ranges</h5>
        <div class="range-inputs">
          <div class="range-group">
            <label>Split every <input type="number" id="splitEvery" value="5" min="1"> pages</label>
          </div>
          <div class="range-group">
            <label>Custom ranges (e.g., 1-5, 8-10, 15-20):</label>
            <textarea id="customRanges" placeholder="1-5, 8-10, 15-20"></textarea>
          </div>
        </div>
      </div>
      
      <div class="tab-content" id="size-tab" style="display: none;">
        <h5>Split by File Size</h5>
        <div class="size-options">
          <label class="size-option">
            <input type="radio" name="sizeOption" value="1">
            <span>1 MB per file</span>
          </label>
          <label class="size-option">
            <input type="radio" name="sizeOption" value="2" checked>
            <span>2 MB per file</span>
          </label>
          <label class="size-option">
            <input type="radio" name="sizeOption" value="5">
            <span>5 MB per file</span>
          </label>
          <label class="size-option">
            <input type="radio" name="sizeOption" value="custom">
            <span>Custom: <input type="number" id="customSize" value="3" min="1" max="50"> MB</span>
          </label>
        </div>
      </div>
    </div>
    
    <div class="split-controls">
      <button class="split-btn" id="splitBtn">Split PDF</button>
      <button class="clear-btn" id="clearBtn">Clear File</button>
    </div>
  </div>

  <div class="progress-section" id="progressSection" style="display: none;">
    <div class="progress-bar">
      <div class="progress-fill" id="progressFill"></div>
    </div>
    <p id="progressText">Splitting PDF...</p>
  </div>

  <div class="download-section" id="downloadSection" style="display: none;">
    <div class="success-message">
      <div class="success-icon">✅</div>
      <h3>PDF Split Complete!</h3>
      <p>Your PDF has been successfully split into <span id="fileCount">0</span> files</p>
      <div class="split-files" id="splitFiles"></div>
      <div class="download-actions">
        <button class="download-all-btn" id="downloadAllBtn">Download All Files</button>
        <button class="new-split-btn" id="newSplitBtn">Split Another File</button>
      </div>
    </div>
  </div>

  <div class="features-section">
    <h2>Features</h2>
    <div class="features-grid">
      <div class="feature">
        <div class="feature-icon">🔒</div>
        <h3>100% Secure</h3>
        <p>Files are processed locally and never stored on our servers</p>
      </div>
      <div class="feature">
        <div class="feature-icon">⚡</div>
        <h3>Fast Splitting</h3>
        <p>Split PDF files in seconds with our optimized algorithms</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📱</div>
        <h3>Mobile Friendly</h3>
        <p>Works perfectly on all devices and browsers</p>
      </div>
      <div class="feature">
        <div class="feature-icon">💯</div>
        <h3>High Quality</h3>
        <p>Maintain original quality and formatting</p>
      </div>
    </div>
  </div>

  <div class="how-to-section">
    <h2>How to Split PDF</h2>
    <div class="steps">
      <div class="step">
        <div class="step-number">1</div>
        <h3>Upload PDF</h3>
        <p>Select or drag & drop your PDF file</p>
      </div>
      <div class="step">
        <div class="step-number">2</div>
        <h3>Choose Split Method</h3>
        <p>Select pages, define ranges, or split by size</p>
      </div>
      <div class="step">
        <div class="step-number">3</div>
        <h3>Split & Download</h3>
        <p>Click split and download your files</p>
      </div>
    </div>
  </div>
</div>

<script>
// Global variables
let selectedFile = null;
let pdfDocument = null;
let splitFiles = [];

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
  }, 5000);
}

// File handling
document.getElementById('fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file && file.type === 'application/pdf') {
    handleFile(file);
  } else {
    showMessage('Please select a valid PDF file.', 'error');
  }
});

async function handleFile(file) {
  selectedFile = file;
  
  // Show file details
  document.getElementById('fileDetails').innerHTML = `
    <div class="file-item">
      <div class="file-icon">📄</div>
      <div class="file-info">
        <h4>${file.name}</h4>
        <p>Size: ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
      </div>
    </div>
  `;
  
  document.getElementById('fileInfo').style.display = 'block';
  document.getElementById('uploadArea').style.display = 'none';
  
  // Load PDF for page preview
  await loadPdfPages();
}

async function loadPdfPages() {
  try {
    const arrayBuffer = await selectedFile.arrayBuffer();
    pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    // Generate page thumbnails
    const pagesGrid = document.getElementById('pagesGrid');
    pagesGrid.innerHTML = '';
    
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale: 0.2 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      const pageDiv = document.createElement('div');
      pageDiv.className = 'page-thumbnail';
      pageDiv.innerHTML = `
        <div class="page-checkbox">
          <input type="checkbox" id="page-${pageNum}" value="${pageNum}">
          <label for="page-${pageNum}"></label>
        </div>
        <div class="page-canvas">${canvas.outerHTML}</div>
        <div class="page-number">Page ${pageNum}</div>
      `;
      
      pagesGrid.appendChild(pageDiv);
    }
    
    showMessage('PDF loaded successfully! Select pages to split.', 'success');
  } catch (error) {
    console.error('Error loading PDF:', error);
    showMessage('Error loading PDF. Please try again.', 'error');
  }
}

// Tab functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const tabName = e.target.dataset.tab;
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    
    // Show corresponding content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.style.display = 'none';
    });
    document.getElementById(`${tabName}-tab`).style.display = 'block';
  });
});

// Page selection controls
document.getElementById('selectAllPages').addEventListener('click', () => {
  document.querySelectorAll('#pagesGrid input[type="checkbox"]').forEach(cb => {
    cb.checked = true;
  });
});

document.getElementById('deselectAllPages').addEventListener('click', () => {
  document.querySelectorAll('#pagesGrid input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
  });
});

document.getElementById('selectOddPages').addEventListener('click', () => {
  document.querySelectorAll('#pagesGrid input[type="checkbox"]').forEach(cb => {
    const pageNum = parseInt(cb.value);
    cb.checked = pageNum % 2 === 1;
  });
});

document.getElementById('selectEvenPages').addEventListener('click', () => {
  document.querySelectorAll('#pagesGrid input[type="checkbox"]').forEach(cb => {
    const pageNum = parseInt(cb.value);
    cb.checked = pageNum % 2 === 0;
  });
});

// Split functionality
document.getElementById('splitBtn').addEventListener('click', splitPdf);
document.getElementById('clearBtn').addEventListener('click', clearFile);
document.getElementById('newSplitBtn').addEventListener('click', startNewSplit);

async function splitPdf() {
  if (!selectedFile || !pdfDocument) {
    showMessage('Please select a PDF file first.', 'error');
    return;
  }
  
  const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
  
  // Show progress
  document.getElementById('progressSection').style.display = 'block';
  document.getElementById('fileInfo').style.display = 'none';
  
  try {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressText.textContent = 'Loading PDF...';
    progressFill.style.width = '10%';
    
    // Load PDF with pdf-lib
    const pdfBytes = await selectedFile.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();
    
    splitFiles = [];
    
    if (activeTab === 'pages') {
      await splitBySelectedPages(pdfDoc, progressFill, progressText);
    } else if (activeTab === 'ranges') {
      await splitByRanges(pdfDoc, progressFill, progressText);
    } else if (activeTab === 'size') {
      await splitBySize(pdfDoc, progressFill, progressText);
    }
    
    // Show download section
    progressText.textContent = 'Complete!';
    progressFill.style.width = '100%';
    
    setTimeout(() => {
      document.getElementById('progressSection').style.display = 'none';
      showDownloadSection();
    }, 500);
    
    showMessage('PDF split successfully!', 'success');
    
  } catch (error) {
    console.error('Error splitting PDF:', error);
    showMessage('Error splitting PDF. Please try again.', 'error');
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('fileInfo').style.display = 'block';
  }
}

async function splitBySelectedPages(pdfDoc, progressFill, progressText) {
  const selectedPages = Array.from(document.querySelectorAll('#pagesGrid input[type="checkbox"]:checked'))
    .map(cb => parseInt(cb.value) - 1); // Convert to 0-based index
  
  if (selectedPages.length === 0) {
    throw new Error('Please select at least one page to extract.');
  }
  
  progressText.textContent = 'Extracting selected pages...';
  progressFill.style.width = '30%';
  
  // Create new PDF with selected pages
  const newPdfDoc = await PDFLib.PDFDocument.create();
  const copiedPages = await newPdfDoc.copyPages(pdfDoc, selectedPages);
  
  copiedPages.forEach(page => newPdfDoc.addPage(page));
  
  progressText.textContent = 'Generating PDF file...';
  progressFill.style.width = '80%';
  
  const pdfBytes = await newPdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  
  splitFiles.push({
    name: `${selectedFile.name.replace('.pdf', '')}_pages_${selectedPages.map(p => p + 1).join('-')}.pdf`,
    blob: blob,
    size: blob.size
  });
}

async function splitByRanges(pdfDoc, progressFill, progressText) {
  const splitEvery = parseInt(document.getElementById('splitEvery').value);
  const customRanges = document.getElementById('customRanges').value.trim();
  
  progressText.textContent = 'Processing page ranges...';
  progressFill.style.width = '30%';
  
  const totalPages = pdfDoc.getPageCount();
  let ranges = [];
  
  if (customRanges) {
    // Parse custom ranges
    const rangeStrings = customRanges.split(',').map(s => s.trim());
    ranges = rangeStrings.map(rangeStr => {
      if (rangeStr.includes('-')) {
        const [start, end] = rangeStr.split('-').map(n => parseInt(n.trim()));
        return { start: start - 1, end: end - 1 }; // Convert to 0-based
      } else {
        const page = parseInt(rangeStr.trim()) - 1;
        return { start: page, end: page };
      }
    });
  } else {
    // Split every N pages
    for (let i = 0; i < totalPages; i += splitEvery) {
      ranges.push({
        start: i,
        end: Math.min(i + splitEvery - 1, totalPages - 1)
      });
    }
  }
  
  // Create PDF for each range
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    const progress = 30 + (i / ranges.length) * 50;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Creating file ${i + 1} of ${ranges.length}...`;
    
    const newPdfDoc = await PDFLib.PDFDocument.create();
    const pageIndices = [];
    for (let p = range.start; p <= range.end; p++) {
      pageIndices.push(p);
    }
    
    const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach(page => newPdfDoc.addPage(page));
    
    const pdfBytes = await newPdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    splitFiles.push({
      name: `${selectedFile.name.replace('.pdf', '')}_part_${i + 1}.pdf`,
      blob: blob,
      size: blob.size
    });
  }
}

async function splitBySize(pdfDoc, progressFill, progressText) {
  const sizeOption = document.querySelector('input[name="sizeOption"]:checked').value;
  let maxSizeMB;
  
  if (sizeOption === 'custom') {
    maxSizeMB = parseInt(document.getElementById('customSize').value);
  } else {
    maxSizeMB = parseInt(sizeOption);
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const totalPages = pdfDoc.getPageCount();
  
  progressText.textContent = 'Analyzing page sizes...';
  progressFill.style.width = '20%';
  
  let currentPdfDoc = await PDFLib.PDFDocument.create();
  let currentSize = 0;
  let fileIndex = 1;
  let pageIndex = 0;
  
  for (let i = 0; i < totalPages; i++) {
    const progress = 20 + (i / totalPages) * 60;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Processing page ${i + 1} of ${totalPages}...`;
    
    // Copy page to temporary PDF to check size
    const tempPdfDoc = await PDFLib.PDFDocument.create();
    const [copiedPage] = await tempPdfDoc.copyPages(pdfDoc, [i]);
    tempPdfDoc.addPage(copiedPage);
    
    const tempBytes = await tempPdfDoc.save();
    const pageSize = tempBytes.length;
    
    // Check if adding this page would exceed size limit
    if (currentSize + pageSize > maxSizeBytes && currentPdfDoc.getPageCount() > 0) {
      // Save current PDF
      const currentBytes = await currentPdfDoc.save();
      const blob = new Blob([currentBytes], { type: 'application/pdf' });
      
      splitFiles.push({
        name: `${selectedFile.name.replace('.pdf', '')}_part_${fileIndex}.pdf`,
        blob: blob,
        size: blob.size
      });
      
      // Start new PDF
      currentPdfDoc = await PDFLib.PDFDocument.create();
      currentSize = 0;
      fileIndex++;
    }
    
    // Add page to current PDF
    const [pageCopy] = await currentPdfDoc.copyPages(pdfDoc, [i]);
    currentPdfDoc.addPage(pageCopy);
    currentSize += pageSize;
  }
  
  // Save final PDF if it has pages
  if (currentPdfDoc.getPageCount() > 0) {
    const finalBytes = await currentPdfDoc.save();
    const blob = new Blob([finalBytes], { type: 'application/pdf' });
    
    splitFiles.push({
      name: `${selectedFile.name.replace('.pdf', '')}_part_${fileIndex}.pdf`,
      blob: blob,
      size: blob.size
    });
  }
}

function showDownloadSection() {
  document.getElementById('fileCount').textContent = splitFiles.length;
  
  const splitFilesContainer = document.getElementById('splitFiles');
  splitFilesContainer.innerHTML = '';
  
  splitFiles.forEach((file, index) => {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'split-file-item';
    fileDiv.innerHTML = `
      <div class="file-info">
        <div class="file-icon">📄</div>
        <div class="file-details">
          <h4>${file.name}</h4>
          <p>Size: ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      </div>
      <button class="download-file-btn" onclick="downloadFile(${index})">Download</button>
    `;
    splitFilesContainer.appendChild(fileDiv);
  });
  
  document.getElementById('downloadSection').style.display = 'block';
}

function downloadFile(index) {
  const file = splitFiles[index];
  const url = URL.createObjectURL(file.blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

document.getElementById('downloadAllBtn').addEventListener('click', () => {
  splitFiles.forEach((file, index) => {
    setTimeout(() => downloadFile(index), index * 500); // Stagger downloads
  });
});

function clearFile() {
  selectedFile = null;
  pdfDocument = null;
  splitFiles = [];
  
  document.getElementById('fileInfo').style.display = 'none';
  document.getElementById('progressSection').style.display = 'none';
  document.getElementById('downloadSection').style.display = 'none';
  document.getElementById('uploadArea').style.display = 'block';
  
  document.getElementById('fileInput').value = '';
  document.getElementById('pagesGrid').innerHTML = '';
  
  showMessage('Files cleared.', 'info');
}

function startNewSplit() {
  clearFile();
  showMessage('Ready for new split!', 'success');
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
      handleFile(file);
    } else {
      showMessage('Please select a valid PDF file.', 'error');
    }
  }
});
</script>

<style>
/* Split PDF specific styles */
.split-options {
  margin: 20px 0;
}

.option-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab-btn {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.tab-content {
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
}

.pages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  margin: 20px 0;
  max-height: 400px;
  overflow-y: auto;
}

.page-thumbnail {
  text-align: center;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 10px;
  background: white;
  transition: all 0.3s ease;
}

.page-thumbnail:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0,123,255,0.2);
}

.page-checkbox input[type="checkbox"]:checked + label::before {
  background: #007bff;
  border-color: #007bff;
}

.page-canvas canvas {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 10px 0;
}

.page-number {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.page-controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px 0;
}

.page-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.page-btn:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

.range-inputs {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.range-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.range-group input, .range-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.size-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.size-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.size-option:hover {
  background: #f0f0f0;
}

.size-option input[type="radio"]:checked {
  accent-color: #007bff;
}

.split-controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 30px 0;
}

.split-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.split-btn:hover {
  background: #218838;
  transform: translateY(-2px);
}

.clear-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

.split-files {
  margin: 20px 0;
}

.split-file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 10px;
  background: white;
}

.download-file-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.download-file-btn:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.download-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.download-all-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.download-all-btn:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

.new-split-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.new-split-btn:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

/* Responsive design */
@media (max-width: 768px) {
  .option-tabs {
    flex-direction: column;
  }
  
  .pages-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
  }
  
  .page-controls {
    flex-direction: column;
    align-items: center;
  }
  
  .split-controls,
  .download-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .split-file-item {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
</style>
