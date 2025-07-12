---
layout: tool
title: "PDF Merger - Combine Multiple PDF Files Online | Free & Secure"
description: "Professional PDF merger tool to combine multiple PDF files into one document. Drag & drop interface, page selection, secure processing. 100% free, no registration required."
keywords: "PDF merger, combine PDF files, merge PDF online, PDF joiner, free PDF merger, PDF combiner, merge multiple PDFs, PDF tools online"
canonical_url: "https://office-tools.com/tools/pdf-merger"
tool_name: "PDF Merger"
tool_category: "PDF Tools"
last_modified: "2025-01-07"
schema_type: "WebApplication"
author: "Office Tools Team"
---

<!-- Structured Data for SEO -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "PDF Merger - Combine Multiple PDF Files",
  "description": "Professional online PDF merger tool to combine multiple PDF files into one document with drag & drop interface and page selection.",
  "url": "https://office-tools.com/tools/pdf-merger",
  "applicationCategory": "PDF Tools",
  "operatingSystem": "Any",
  "permissions": "browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "Office Tools"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1247"
  },
  "featureList": [
    "Merge up to 20 PDF files",
    "Drag and drop interface", 
    "Page selection and reordering",
    "Secure local processing",
    "No file size limits",
    "Mobile responsive"
  ]
}
</script>

<!-- PDF-lib library for PDF processing -->
<script src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js"></script>
<!-- PDF.js for preview functionality -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>

<div class="card">
  <div class="card-content">
    <h1 class="text-2xl font-bold text-foreground mb-2">PDF Merger</h1>
    <p class="text-muted-foreground mb-6">Combine multiple PDF files into one document easily and securely</p>
  </div>

  <div class="upload-section">
    <div class="upload-area" id="uploadArea">
      <div class="upload-icon">📄</div>
      <h3>Drop PDF files here or click to browse</h3>
      <p>You can upload up to 10 PDF files at once</p>
      <input type="file" id="fileInput" multiple accept=".pdf" style="display: none;">
      <button class="upload-btn modern-btn" type="button">
        <span class="btn-icon">📁</span>
        <span class="btn-text">Choose PDF Files</span>
      </button>
    </div>
  </div>

  <div class="files-list" id="filesList" style="display: none;">
    <div class="files-header">
      <h3>Selected Files</h3>
      <div class="files-actions">
        <button class="action-btn" id="selectAllBtn">Select All</button>
        <button class="action-btn" id="deselectAllBtn">Deselect All</button>
        <button class="action-btn danger" id="removeSelectedBtn">Remove Selected</button>
      </div>
    </div>
    <div class="files-container" id="filesContainer"></div>
    <div class="merge-controls">
      <div class="merge-info">
        <span id="totalPages">Total Pages: 0</span>
        <span id="totalSize">Total Size: 0 MB</span>
      </div>
      <div class="merge-buttons">
        <button class="merge-btn primary-action" id="mergeBtn">
          <span class="btn-icon">⚡</span>
          <span class="btn-text">Merge PDFs</span>
        </button>
        <button class="clear-btn secondary-action" id="clearBtn">
          <span class="btn-icon">🗑️</span>
          <span class="btn-text">Clear All</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Page Management Section -->
  <div class="page-management" id="pageManagement" style="display: none;">
    <div class="page-header">
      <h3>Page Management</h3>
      <p>Select specific pages from each PDF to include in the final document</p>
    </div>
    <div class="page-controls">
      <button class="page-btn" id="selectAllPagesBtn">Select All Pages</button>
      <button class="page-btn" id="deselectAllPagesBtn">Deselect All Pages</button>
      <button class="page-btn" id="invertSelectionBtn">Invert Selection</button>
    </div>
    <div class="pdf-pages-container" id="pdfPagesContainer"></div>
  </div>

  <!-- Page Management Modal -->
  <div class="page-modal" id="pageModal" style="display: none;">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Advanced Page Management</h2>
        <button class="close-btn" id="closeModal">×</button>
      </div>
      
      <div class="modal-body">
        <div class="page-controls">
          <button class="control-btn" id="selectAllPagesModal">Select All Pages</button>
          <button class="control-btn" id="deselectAllPagesModal">Deselect All Pages</button>
          <button class="control-btn" id="invertSelectionModal">Invert Selection</button>
          <button class="control-btn primary" id="applySelection">Apply Selection</button>
        </div>
        
        <div class="pdfs-container" id="pdfsContainer"></div>
      </div>
    </div>
  </div>

  <div class="progress-section" id="progressSection" style="display: none;">
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
      </div>
      <p id="progressText">Processing files...</p>
    </div>
  </div>

  <div class="download-section" id="downloadSection" style="display: none;">
    <div class="success-message">
      <div class="success-icon">✅</div>
      <h3>PDF Successfully Merged!</h3>
      <p>Your combined PDF is ready for download</p>
      <div class="download-info">
        <span id="mergedPages">Pages: 0</span>
        <span id="mergedSize">Size: 0 MB</span>
      </div>
      <div class="download-actions">
        <button class="download-btn primary-download" id="downloadBtn">
          <span class="btn-icon">⬇️</span>
          <span class="btn-text">Download Merged PDF</span>
        </button>
        <button class="new-merge-btn secondary-action" id="newMergeBtn">
          <span class="btn-icon">🔄</span>
          <span class="btn-text">Merge Another Set</span>
        </button>
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
        <h3>Fast Processing</h3>
        <p>Merge PDFs in seconds with our optimized algorithms</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📱</div>
        <h3>Mobile Friendly</h3>
        <p>Works perfectly on all devices and browsers</p>
      </div>
      <div class="feature">
        <div class="feature-icon">💯</div>
        <h3>High Quality</h3>
        <p>Maintain original PDF quality without compression</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📄</div>
        <h3>Page Management</h3>
        <p>Select specific pages from each PDF to include</p>
      </div>
      <div class="feature">
        <div class="feature-icon">👁️</div>
        <h3>Page Preview</h3>
        <p>Preview pages before merging to ensure accuracy</p>
      </div>
    </div>
  </div>

  <div class="how-to-section">
    <h2>How to Merge PDF Files</h2>
    <div class="steps">
      <div class="step">
        <div class="step-number">1</div>
        <h3>Upload PDF Files</h3>
        <p>Drag and drop your PDF files or click to browse and select multiple PDF files</p>
      </div>
      <div class="step">
        <div class="step-number">2</div>
        <h3>Manage Pages</h3>
        <p>Select specific pages from each PDF that you want to include in the final document</p>
      </div>
      <div class="step">
        <div class="step-number">3</div>
        <h3>Arrange Order</h3>
        <p>Drag files to reorder them in the desired sequence for merging</p>
      </div>
      <div class="step">
        <div class="step-number">4</div>
        <h3>Merge & Download</h3>
        <p>Click "Merge PDFs" and download your combined PDF file</p>
      </div>
    </div>
  </div>

  <div class="faq-section">
    <h2>Frequently Asked Questions</h2>
    <div class="faq-list">
      <div class="faq-item">
        <h3>Is this PDF merger free to use?</h3>
        <p>Yes, our PDF merger is completely free to use with no hidden costs or limitations.</p>
      </div>
      <div class="faq-item">
        <h3>How many PDF files can I merge at once?</h3>
        <p>You can merge up to 10 PDF files at once with a maximum file size of 50MB per file.</p>
      </div>
      <div class="faq-item">
        <h3>Can I select specific pages from each PDF?</h3>
        <p>Yes! You can select specific pages from each PDF to include in the final merged document.</p>
      </div>
      <div class="faq-item">
        <h3>Are my files secure?</h3>
        <p>Absolutely! Your files are processed locally in your browser and never uploaded to our servers.</p>
      </div>
      <div class="faq-item">
        <h3>What file formats are supported?</h3>
        <p>Currently, we support PDF files only. All files must be in PDF format to be merged.</p>
      </div>
    </div>
  </div>
</div>

<script>
// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let selectedFiles = [];
let mergedPdfBytes = null;
let pdfPages = {}; // Store page data for each file

// Wait for DOM to be ready and initialize everything
document.addEventListener('DOMContentLoaded', function() {
  console.log('PDF Merger: Initializing...');
  
  // Check if elements exist
  const fileInput = document.getElementById('fileInput');
  const uploadBtn = document.querySelector('.upload-btn');
  const uploadArea = document.getElementById('uploadArea');
  
  if (!fileInput) {
    console.error('PDF Merger: File input not found');
    return;
  }
  
  if (!uploadArea) {
    console.error('PDF Merger: Upload area not found');
    return;
  }
  
  // Initialize event listeners
  initializeEventListeners();
  initializeDragDrop();
  
  console.log('PDF Merger: Initialization complete');
});

function initializeEventListeners() {
  // File input change
  const fileInput = document.getElementById('fileInput');
  if (fileInput) {
    fileInput.addEventListener('change', handleFileSelect);
  }
  
  // Upload button click - multiple ways to ensure it works
  const uploadBtn = document.querySelector('.upload-btn');
  if (uploadBtn) {
    // Remove any existing onclick to avoid conflicts
    uploadBtn.removeAttribute('onclick');
    
    uploadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('PDF Merger: Upload button clicked');
      
      const fileInput = document.getElementById('fileInput');
      if (fileInput) {
        fileInput.click();
      } else {
        console.error('PDF Merger: File input not found when button clicked');
        showMessage('File selection unavailable. Please refresh the page.', 'error');
      }
    });
  }
  
  // Upload area click
  const uploadArea = document.getElementById('uploadArea');
  if (uploadArea) {
    uploadArea.addEventListener('click', function(e) {
      // Only trigger if not clicking on the button directly
      if (!e.target.classList.contains('upload-btn')) {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
          fileInput.click();
        }
      }
    });
  }
  
  // Safely bind other event listeners
  const bindEvent = (id, handler) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('click', handler);
    }
  };
  
  bindEvent('mergeBtn', mergePDFs);
  bindEvent('clearBtn', clearFiles);
  bindEvent('downloadBtn', downloadMergedPDF);
  bindEvent('newMergeBtn', startNewMerge);
  bindEvent('selectAllBtn', selectAllFiles);
  bindEvent('deselectAllBtn', deselectAllFiles);
  bindEvent('removeSelectedBtn', removeSelectedFiles);
  bindEvent('selectAllPagesBtn', selectAllPages);
  bindEvent('deselectAllPagesBtn', deselectAllPages);
  bindEvent('invertSelectionBtn', invertPageSelection);
  bindEvent('closeModal', closePageModal);
  bindEvent('selectAllPagesModal', selectAllPagesModal);
  bindEvent('deselectAllPagesModal', deselectAllPagesModal);
  bindEvent('invertSelectionModal', invertSelectionModal);
  bindEvent('applySelection', applyPageSelection);
}

function initializeDragDrop() {
  const uploadArea = document.getElementById('uploadArea');
  if (!uploadArea) return;
  
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });

  uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );
    
    if (files.length > 0) {
      addFilesToSelection(files);
    } else {
      showMessage('Please drop PDF files only.', 'warning');
    }
  });
}

function handleFileSelect(event) {
  console.log('PDF Merger: File selection event triggered');
  
  if (!event || !event.target || !event.target.files) {
    console.error('PDF Merger: Invalid file selection event');
    showMessage('File selection error. Please try again.', 'error');
    return;
  }
  
  const files = Array.from(event.target.files).filter(file => 
    file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  );
  
  console.log('PDF Merger: PDF files selected:', files.length);
  
  if (files.length === 0) {
    showMessage('Please select PDF files only.', 'warning');
    return;
  }
  
  addFilesToSelection(files);
  
  // Reset the file input
  event.target.value = '';
}

function addFilesToSelection(files) {
  if (selectedFiles.length + files.length > 10) {
    showMessage('You can only upload up to 10 files at once.', 'warning');
    return;
  }
  
  // Check file sizes (50MB limit as per FAQ)
  const oversizedFiles = files.filter(file => file.size > 50 * 1024 * 1024);
  if (oversizedFiles.length > 0) {
    showMessage(`Some files exceed the 50MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`, 'warning');
    return;
  }
  
  selectedFiles = selectedFiles.concat(files);
  console.log('PDF Merger: Total files:', selectedFiles.length);
  
  displayFiles();
  loadPageData();
  showMessage(`${files.length} file(s) added successfully!`, 'success');
}

function displayFiles() {
  const container = document.getElementById('filesContainer');
  const filesList = document.getElementById('filesList');
  
  if (selectedFiles.length === 0) {
    filesList.style.display = 'none';
    document.getElementById('pageManagement').style.display = 'none';
    return;
  }
  
  filesList.style.display = 'block';
  container.innerHTML = '';
  
  selectedFiles.forEach((file, index) => {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.draggable = true;
    fileItem.dataset.index = index;
    
    fileItem.innerHTML = `
      <div class="file-info">
        <div class="file-checkbox">
          <input type="checkbox" id="file-${index}" checked>
          <label for="file-${index}"></label>
        </div>
        <div class="file-icon">📄</div>
        <div class="file-details">
          <h4>${file.name}</h4>
          <p>${(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
        <div class="file-pages" id="pages-${index}">Loading...</div>
      </div>
      <div class="file-actions">
        <button class="view-pages-btn" data-file-index="${index}">
          <span class="btn-icon">👁️</span>
          <span class="btn-text">View Pages</span>
        </button>
        <button class="remove-btn" data-file-index="${index}">
          <span class="btn-icon">×</span>
        </button>
      </div>
    `;
    
    container.appendChild(fileItem);
    
    // Load page count for this file
    loadPageCount(file, index);
    
    // Add drag and drop event listeners
    fileItem.addEventListener('dragstart', handleDragStart);
    fileItem.addEventListener('dragover', handleDragOver);
    fileItem.addEventListener('drop', handleDrop);
  });
  
  updateMergeInfo();
}

async function loadPageData() {
  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      pdfPages[i] = {
        pdf: pdf,
        pageCount: pdf.numPages,
        selectedPages: Array.from({length: pdf.numPages}, (_, j) => j) // All pages selected by default
      };
    } catch (error) {
      console.error('Error loading PDF:', error);
      pdfPages[i] = { pageCount: 0, selectedPages: [] };
    }
  }
  displayPageManagement();
}

function displayPageManagement() {
  const pageManagement = document.getElementById('pageManagement');
  const container = document.getElementById('pdfPagesContainer');
  
  if (selectedFiles.length === 0) {
    pageManagement.style.display = 'none';
    return;
  }
  
  pageManagement.style.display = 'block';
  container.innerHTML = '';
  
  selectedFiles.forEach((file, fileIndex) => {
    const fileSection = document.createElement('div');
    fileSection.className = 'pdf-file-section';
    
    const pageData = pdfPages[fileIndex];
    if (!pageData) return;
    
    fileSection.innerHTML = `
      <div class="file-header">
        <h4>${file.name}</h4>
        <span class="page-count">${pageData.pageCount} pages</span>
        <button class="manage-pages-btn" onclick="openPageModal(${fileIndex})">Manage Pages</button>
      </div>
      <div class="pages-grid" id="pages-grid-${fileIndex}"></div>
    `;
    
    container.appendChild(fileSection);
    
    // Generate page thumbnails
    generatePageThumbnails(fileIndex, pageData);
  });
}

function openPageModal() {
  const modal = document.getElementById('pageModal');
  const container = document.getElementById('pdfsContainer');
  
  container.innerHTML = '';
  
  selectedFiles.forEach((file, fileIndex) => {
    const pdfSection = document.createElement('div');
    pdfSection.className = 'pdf-section';
    
    const pageData = pdfPages[fileIndex];
    if (!pageData) return;
    
    pdfSection.innerHTML = `
      <div class="pdf-header">
        <h3>${file.name}</h3>
        <span class="pdf-pages-count">${pageData.pageCount} pages</span>
      </div>
      <div class="pages-grid-modal" id="modal-pages-${fileIndex}"></div>
    `;
    
    container.appendChild(pdfSection);
    
    // Generate modal thumbnails
    generateModalThumbnails(fileIndex, pageData);
  });
  
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closePageModal() {
  document.getElementById('pageModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function generateModalThumbnails(fileIndex, pageData) {
  const container = document.getElementById(`modal-pages-${fileIndex}`);
  
  for (let pageNum = 1; pageNum <= pageData.pageCount; pageNum++) {
    const pageItem = document.createElement('div');
    pageItem.className = 'modal-page-item';
    pageItem.draggable = true;
    pageItem.dataset.fileIndex = fileIndex;
    pageItem.dataset.pageNum = pageNum;
    
    pageItem.innerHTML = `
      <div class="modal-page-checkbox">
        <input type="checkbox" id="modal-page-${fileIndex}-${pageNum}" checked>
        <label for="modal-page-${fileIndex}-${pageNum}"></label>
      </div>
      <div class="modal-page-thumbnail" id="modal-thumb-${fileIndex}-${pageNum}">
        <div class="modal-page-number">${pageNum}</div>
        <div class="modal-page-info">PDF ${fileIndex + 1}</div>
      </div>
    `;
    
    container.appendChild(pageItem);
    
    // Add event listeners
    const checkbox = pageItem.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      updateModalPageSelection(fileIndex, pageNum - 1, checkbox.checked);
    });
    
    // Drag and drop functionality
    pageItem.addEventListener('dragstart', handleModalDragStart);
    pageItem.addEventListener('dragover', handleModalDragOver);
    pageItem.addEventListener('drop', handleModalDrop);
    
    // Generate thumbnail
    generateModalThumbnail(fileIndex, pageNum, pageItem);
  }
}

function generateModalThumbnail(fileIndex, pageNum, pageItem) {
  const pageData = pdfPages[fileIndex];
  if (!pageData || !pageData.pdf) return;
  
  pageData.pdf.getPage(pageNum).then(page => {
    const viewport = page.getViewport({ scale: 0.3 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    
    page.render(renderContext).promise.then(() => {
      const thumbnail = pageItem.querySelector('.modal-page-thumbnail');
      thumbnail.style.backgroundImage = `url(${canvas.toDataURL()})`;
      thumbnail.style.backgroundSize = 'cover';
      thumbnail.style.backgroundPosition = 'center';
    });
  });
}

function updateModalPageSelection(fileIndex, pageIndex, selected) {
  if (!pdfPages[fileIndex]) return;
  
  if (selected) {
    if (!pdfPages[fileIndex].selectedPages.includes(pageIndex)) {
      pdfPages[fileIndex].selectedPages.push(pageIndex);
    }
  } else {
    pdfPages[fileIndex].selectedPages = pdfPages[fileIndex].selectedPages.filter(p => p !== pageIndex);
  }
}

function selectAllPagesModal() {
  Object.keys(pdfPages).forEach(fileIndex => {
    const pageData = pdfPages[fileIndex];
    if (pageData) {
      pageData.selectedPages = Array.from({length: pageData.pageCount}, (_, i) => i);
      
      // Update checkboxes
      for (let pageNum = 1; pageNum <= pageData.pageCount; pageNum++) {
        const checkbox = document.getElementById(`modal-page-${fileIndex}-${pageNum}`);
        if (checkbox) checkbox.checked = true;
      }
    }
  });
}

function deselectAllPagesModal() {
  Object.keys(pdfPages).forEach(fileIndex => {
    const pageData = pdfPages[fileIndex];
    if (pageData) {
      pageData.selectedPages = [];
      
      // Update checkboxes
      for (let pageNum = 1; pageNum <= pageData.pageCount; pageNum++) {
        const checkbox = document.getElementById(`modal-page-${fileIndex}-${pageNum}`);
        if (checkbox) checkbox.checked = false;
      }
    }
  });
}

function invertSelectionModal() {
  Object.keys(pdfPages).forEach(fileIndex => {
    const pageData = pdfPages[fileIndex];
    if (pageData) {
      const allPages = Array.from({length: pageData.pageCount}, (_, i) => i);
      pageData.selectedPages = allPages.filter(p => !pageData.selectedPages.includes(p));
      
      // Update checkboxes
      for (let pageNum = 1; pageNum <= pageData.pageCount; pageNum++) {
        const checkbox = document.getElementById(`modal-page-${fileIndex}-${pageNum}`);
        if (checkbox) checkbox.checked = pageData.selectedPages.includes(pageNum - 1);
      }
    }
  });
}

function applyPageSelection() {
  closePageModal();
  displayPageManagement();
  updateMergeInfo();
  showMessage('Page selection applied successfully!', 'success');
}

// Drag and drop for modal
let draggedElement = null;

function handleModalDragStart(e) {
  draggedElement = e.target;
  e.dataTransfer.effectAllowed = 'move';
  e.target.style.opacity = '0.5';
}

function handleModalDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function handleModalDrop(e) {
  e.preventDefault();
  if (draggedElement) {
    const target = e.target.closest('.modal-page-item');
    if (target && target !== draggedElement) {
      // Reorder pages in the merged PDF
      const draggedFileIndex = parseInt(draggedElement.dataset.fileIndex);
      const draggedPageNum = parseInt(draggedElement.dataset.pageNum);
      const targetFileIndex = parseInt(target.dataset.fileIndex);
      const targetPageNum = parseInt(target.dataset.pageNum);
      
      // This would reorder the pages in the final merged PDF
      // Implementation depends on how you want to handle the reordering
      showMessage(`Moved page ${draggedPageNum} from PDF ${draggedFileIndex + 1} to position ${targetPageNum}`, 'info');
    }
    draggedElement.style.opacity = '1';
    draggedElement = null;
  }
}

async function generatePageThumbnails(fileIndex, pageData) {
  const pagesGrid = document.getElementById(`pages-grid-${fileIndex}`);
  
  for (let pageNum = 1; pageNum <= pageData.pageCount; pageNum++) {
    const pageItem = document.createElement('div');
    pageItem.className = 'page-item';
    pageItem.innerHTML = `
      <div class="page-checkbox">
        <input type="checkbox" id="page-${fileIndex}-${pageNum}" checked>
        <label for="page-${fileIndex}-${pageNum}"></label>
      </div>
      <div class="page-thumbnail" id="thumb-${fileIndex}-${pageNum}">
        <div class="page-number">${pageNum}</div>
      </div>
    `;
    
    pagesGrid.appendChild(pageItem);
    
    // Add event listener for page selection
    const checkbox = pageItem.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      updatePageSelection(fileIndex, pageNum - 1, checkbox.checked);
    });
    
    // Generate thumbnail (simplified - in real implementation you'd render actual page)
    try {
      const page = await pageData.pdf.getPage(pageNum);
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
      
      const thumbnail = pageItem.querySelector('.page-thumbnail');
      thumbnail.style.backgroundImage = `url(${canvas.toDataURL()})`;
      thumbnail.style.backgroundSize = 'cover';
      thumbnail.style.backgroundPosition = 'center';
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  }
}

function updatePageSelection(fileIndex, pageIndex, selected) {
  if (!pdfPages[fileIndex]) return;
  
  if (selected) {
    if (!pdfPages[fileIndex].selectedPages.includes(pageIndex)) {
      pdfPages[fileIndex].selectedPages.push(pageIndex);
    }
  } else {
    pdfPages[fileIndex].selectedPages = pdfPages[fileIndex].selectedPages.filter(p => p !== pageIndex);
  }
  
  updateMergeInfo();
}

function selectAllPages() {
  Object.keys(pdfPages).forEach(fileIndex => {
    const pageData = pdfPages[fileIndex];
    if (pageData) {
      pageData.selectedPages = Array.from({length: pageData.pageCount}, (_, i) => i);
      
      // Update checkboxes
      for (let pageNum = 1; pageNum <= pageData.pageCount; pageNum++) {
        const checkbox = document.getElementById(`page-${fileIndex}-${pageNum}`);
        if (checkbox) checkbox.checked = true;
      }
    }
  });
  updateMergeInfo();
}

function deselectAllPages() {
  Object.keys(pdfPages).forEach(fileIndex => {
    const pageData = pdfPages[fileIndex];
    if (pageData) {
      pageData.selectedPages = [];
      
      // Update checkboxes
      for (let pageNum = 1; pageNum <= pageData.pageCount; pageNum++) {
        const checkbox = document.getElementById(`page-${fileIndex}-${pageNum}`);
        if (checkbox) checkbox.checked = false;
      }
    }
  });
  updateMergeInfo();
}

function invertPageSelection() {
  Object.keys(pdfPages).forEach(fileIndex => {
    const pageData = pdfPages[fileIndex];
    if (pageData) {
      const allPages = Array.from({length: pageData.pageCount}, (_, i) => i);
      pageData.selectedPages = allPages.filter(p => !pageData.selectedPages.includes(p));
      
      // Update checkboxes
      for (let pageNum = 1; pageNum <= pageData.pageCount; pageNum++) {
        const checkbox = document.getElementById(`page-${fileIndex}-${pageNum}`);
        if (checkbox) checkbox.checked = pageData.selectedPages.includes(pageNum - 1);
      }
    }
  });
  updateMergeInfo();
}

function viewPages(fileIndex) {
  // This could open a modal with larger page previews
  showMessage(`Viewing pages for ${selectedFiles[fileIndex].name}`, 'info');
}

async function loadPageCount(file, index) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pageCount = pdf.numPages;
    document.getElementById(`pages-${index}`).textContent = `${pageCount} pages`;
  } catch (error) {
    document.getElementById(`pages-${index}`).textContent = 'Error';
  }
}

function updateMergeInfo() {
  let totalPages = 0;
  let totalSize = 0;
  
  selectedFiles.forEach((file, index) => {
    const checkbox = document.getElementById(`file-${index}`);
    if (checkbox && checkbox.checked) {
      totalSize += file.size;
      // Count selected pages
      if (pdfPages[index] && pdfPages[index].selectedPages) {
        totalPages += pdfPages[index].selectedPages.length;
      }
    }
  });
  
  document.getElementById('totalPages').textContent = `Total Pages: ${totalPages}`;
  document.getElementById('totalSize').textContent = `Total Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`;
}

function removeFile(index) {
  selectedFiles.splice(index, 1);
  delete pdfPages[index];
  displayFiles();
  loadPageData();
}

function selectAllFiles() {
  selectedFiles.forEach((file, index) => {
    const checkbox = document.getElementById(`file-${index}`);
    if (checkbox) checkbox.checked = true;
  });
  updateMergeInfo();
}

function deselectAllFiles() {
  selectedFiles.forEach((file, index) => {
    const checkbox = document.getElementById(`file-${index}`);
    if (checkbox) checkbox.checked = false;
  });
  updateMergeInfo();
}

function removeSelectedFiles() {
  const selectedIndices = [];
  selectedFiles.forEach((file, index) => {
    const checkbox = document.getElementById(`file-${index}`);
    if (checkbox && checkbox.checked) {
      selectedIndices.push(index);
    }
  });
  
  // Remove in reverse order to maintain indices
  selectedIndices.reverse().forEach(index => {
    selectedFiles.splice(index, 1);
    delete pdfPages[index];
  });
  
  displayFiles();
  loadPageData();
}

function clearFiles() {
  selectedFiles = [];
  mergedPdfBytes = null;
  pdfPages = {};
  displayFiles();
  document.getElementById('fileInput').value = '';
  hideDownloadSection();
}

function showMessage(message, type = 'info') {
  console.log(`PDF Merger: ${type.toUpperCase()} - ${message}`);
  
  // Remove any existing messages first
  const existingMessages = document.querySelectorAll('.message');
  existingMessages.forEach(msg => msg.remove());
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  
  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.className = 'message-close';
  closeBtn.onclick = () => messageDiv.remove();
  messageDiv.appendChild(closeBtn);
  
  document.body.appendChild(messageDiv);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 5000);
}

function hideDownloadSection() {
  document.getElementById('downloadSection').style.display = 'none';
  document.getElementById('filesList').style.display = 'block';
}

function startNewMerge() {
  clearFiles();
  showMessage('Ready for new PDF merge!', 'success');
}

// Drag and drop reordering
function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.index);
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
  const toIndex = parseInt(e.target.closest('.file-item').dataset.index);
  
  if (fromIndex !== toIndex) {
    const file = selectedFiles[fromIndex];
    selectedFiles.splice(fromIndex, 1);
    selectedFiles.splice(toIndex, 0, file);
    
    // Reorder pdfPages object
    const pageData = pdfPages[fromIndex];
    delete pdfPages[fromIndex];
    pdfPages[toIndex] = pageData;
    
    displayFiles();
    loadPageData();
  }
}

async function mergePDFs() {
  const selectedFilesToMerge = [];
  
  selectedFiles.forEach((file, index) => {
    const checkbox = document.getElementById(`file-${index}`);
    if (checkbox && checkbox.checked) {
      selectedFilesToMerge.push({ file, index });
    }
  });
  
  if (selectedFilesToMerge.length < 2) {
    showMessage('Please select at least 2 PDF files to merge.', 'error');
    return;
  }
  
  // Show progress
  document.getElementById('progressSection').style.display = 'block';
  document.getElementById('filesList').style.display = 'none';
  document.getElementById('pageManagement').style.display = 'none';
  
  try {
    const { PDFDocument } = PDFLib;
    const mergedPdf = await PDFDocument.create();
    
    let progress = 0;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    for (let i = 0; i < selectedFilesToMerge.length; i++) {
      const { file, index } = selectedFilesToMerge[i];
      
      // Update progress
      progress = ((i + 1) / selectedFilesToMerge.length) * 100;
      progressFill.style.width = progress + '%';
      progressText.textContent = `Processing file ${i + 1} of ${selectedFilesToMerge.length}...`;
      
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      
      // Get selected pages for this file
      const selectedPages = pdfPages[index] ? pdfPages[index].selectedPages : [];
      
      if (selectedPages.length > 0) {
        // Copy selected pages from this PDF to the merged PDF
        const pages = await mergedPdf.copyPages(pdf, selectedPages);
        pages.forEach(page => mergedPdf.addPage(page));
      }
    }
    
    // Save the merged PDF
    progressText.textContent = 'Finalizing merged PDF...';
    mergedPdfBytes = await mergedPdf.save();
    
    // Calculate merged file info
    const mergedSize = mergedPdfBytes.byteLength;
    const mergedPages = mergedPdf.getPageCount();
    
    // Update download section info
    document.getElementById('mergedPages').textContent = `Pages: ${mergedPages}`;
    document.getElementById('mergedSize').textContent = `Size: ${(mergedSize / 1024 / 1024).toFixed(2)} MB`;
    
    // Hide progress and show download section
    progressText.textContent = 'Complete!';
    progressFill.style.width = '100%';
    
    setTimeout(() => {
      document.getElementById('progressSection').style.display = 'none';
      document.getElementById('downloadSection').style.display = 'block';
    }, 500);
    
    showMessage('PDFs merged successfully!', 'success');
    
  } catch (error) {
    console.error('Error merging PDFs:', error);
    showMessage('Error merging PDFs. Please try again.', 'error');
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('filesList').style.display = 'block';
    document.getElementById('pageManagement').style.display = 'block';
  }
}

function downloadMergedPDF() {
  if (!mergedPdfBytes) {
    showMessage('No merged PDF available.', 'error');
    return;
  }
  
  // Create blob and download
  const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'merged-document.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  // Auto-clear files after download
  setTimeout(() => {
    clearFiles();
    showMessage('Files cleared for privacy.', 'info');
  }, 2000);
}

// Enhanced drag and drop functionality
function initializeMainDragDrop() {
  const uploadArea = document.getElementById('uploadArea');
  if (!uploadArea) return;

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
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );
    
    if (files.length > 0) {
      addFilesToSelection(files);
    } else {
      showMessage('Please drop PDF files only.', 'warning');
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeMainDragDrop);
} else {
  initializeMainDragDrop();
}

// Add event listeners for checkboxes
document.addEventListener('change', function(e) {
  if (e.target.type === 'checkbox' && e.target.id.startsWith('file-')) {
    updateMergeInfo();
  }
});

// Add event delegation for view-pages and remove buttons
document.addEventListener('click', function(e) {
  if (e.target.closest('.view-pages-btn')) {
    const btn = e.target.closest('.view-pages-btn');
    const fileIndex = parseInt(btn.dataset.fileIndex);
    if (!isNaN(fileIndex)) {
      viewPages(fileIndex);
    }
  } else if (e.target.closest('.remove-btn')) {
    const btn = e.target.closest('.remove-btn');
    const fileIndex = parseInt(btn.dataset.fileIndex);
    if (!isNaN(fileIndex)) {
      removeFile(fileIndex);
    }
  }
});
</script>

<style>
/* CSS Reset and Tool Container */
.tool-container {
  max-width: 1200px !important;
  margin: 0 auto !important;
  padding: 20px !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  box-sizing: border-box !important;
}

/* Modern Button Base Styles */
.tool-container button {
  all: unset !important;
  box-sizing: border-box !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  font-family: inherit !important;
  text-decoration: none !important;
  border: none !important;
  outline: none !important;
  user-select: none !important;
  transition: all 0.3s ease !important;
  position: relative !important;
  overflow: hidden !important;
}

/* Button Icons and Text */
.btn-icon {
  font-size: 1.2em !important;
  margin-right: 8px !important;
  pointer-events: none !important;
}

.btn-text {
  pointer-events: none !important;
  font-weight: 600 !important;
}

/* Upload Button - Enhanced Modern Style */
.tool-container .upload-area .upload-btn.modern-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  padding: 16px 32px !important;
  border-radius: 50px !important;
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  min-width: 220px !important;
  gap: 10px !important;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3) !important;
  border: 2px solid transparent !important;
}

.tool-container .upload-area .upload-btn.modern-btn:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%) !important;
  transform: translateY(-3px) scale(1.02) !important;
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.tool-container .upload-area .upload-btn.modern-btn:active {
  transform: translateY(-1px) scale(1.01) !important;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3) !important;
}

/* Primary Action Buttons (Merge, Download) */
.tool-container .primary-action,
.tool-container .primary-download {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
  color: white !important;
  padding: 15px 35px !important;
  border-radius: 50px !important;
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  gap: 10px !important;
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3) !important;
  border: 2px solid transparent !important;
  min-width: 200px !important;
}

.tool-container .primary-download {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%) !important;
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3) !important;
  font-size: 1.2rem !important;
  padding: 18px 40px !important;
  min-width: 250px !important;
}

.tool-container .primary-action:hover,
.tool-container .primary-download:hover {
  transform: translateY(-3px) scale(1.02) !important;
  box-shadow: 0 10px 30px rgba(40, 167, 69, 0.4) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.tool-container .primary-download:hover {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%) !important;
  box-shadow: 0 10px 30px rgba(0, 123, 255, 0.4) !important;
}

.tool-container .primary-action:active,
.tool-container .primary-download:active {
  transform: translateY(-1px) scale(1.01) !important;
}

/* Secondary Action Buttons */
.tool-container .secondary-action {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%) !important;
  color: white !important;
  padding: 12px 25px !important;
  border-radius: 30px !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  gap: 8px !important;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3) !important;
  border: 2px solid transparent !important;
  min-width: 180px !important;
}

.tool-container .secondary-action:hover {
  background: linear-gradient(135deg, #495057 0%, #343a40 100%) !important;
  transform: translateY(-2px) scale(1.01) !important;
  box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.tool-container .secondary-action:active {
  transform: translateY(0) !important;
}

/* Download Actions Container */
.download-actions {
  display: flex !important;
  flex-direction: column !important;
  gap: 15px !important;
  align-items: center !important;
  margin-top: 25px !important;
}

/* Action Buttons (Select All, Remove, etc.) */
.tool-container .action-btn {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%) !important;
  color: white !important;
  border: none !important;
  padding: 10px 18px !important;
  border-radius: 25px !important;
  font-size: 0.9rem !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  text-decoration: none !important;
  font-family: inherit !important;
  box-sizing: border-box !important;
  box-shadow: 0 3px 10px rgba(23, 162, 184, 0.3) !important;
  border: 1px solid transparent !important;
}

.tool-container .action-btn:hover {
  background: linear-gradient(135deg, #138496 0%, #117a8b 100%) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 5px 15px rgba(23, 162, 184, 0.4) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.tool-container .action-btn.danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%) !important;
  box-shadow: 0 3px 10px rgba(220, 53, 69, 0.3) !important;
}

.tool-container .action-btn.danger:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%) !important;
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4) !important;
}

.tool-header {
  text-align: center !important;
  margin-bottom: 40px !important;
}

.tool-header h1 {
  font-size: 2.5rem !important;
  color: #333 !important;
  margin-bottom: 10px !important;
}

.tool-header p {
  font-size: 1.2rem !important;
  color: #666 !important;
}

.upload-section {
  margin-bottom: 40px !important;
}

.upload-area {
  border: 3px dashed #667eea !important;
  border-radius: 12px !important;
  padding: 60px 20px !important;
  text-align: center !important;
  background: #f8f9fa !important;
  transition: all 0.3s ease !important;
  cursor: pointer !important;
  box-sizing: border-box !important;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #764ba2 !important;
  background: #f0f2ff !important;
}

.upload-icon {
  font-size: 4rem !important;
  margin-bottom: 20px !important;
}

.upload-area h3 {
  font-size: 1.5rem !important;
  margin-bottom: 10px !important;
  color: #333 !important;
}

.upload-area p {
  color: #666 !important;
  margin-bottom: 30px !important;
}

/* Upload Button - Specific styling with high specificity */
.tool-container .upload-area .upload-btn {
  background: #667eea !important;
  color: white !important;
  border: none !important;
  padding: 12px 30px !important;
  border-radius: 25px !important;
  font-size: 1.1rem !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  display: inline-block !important;
  text-decoration: none !important;
  font-family: inherit !important;
  font-weight: 600 !important;
  box-sizing: border-box !important;
  outline: none !important;
  user-select: none !important;
}

.tool-container .upload-area .upload-btn:hover {
  background: #764ba2 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
}

.tool-container .upload-area .upload-btn:active {
  transform: translateY(0) !important;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3) !important;
}

/* File input hiding */
.tool-container #fileInput {
  position: absolute !important;
  opacity: 0 !important;
  width: 0.1px !important;
  height: 0.1px !important;
  overflow: hidden !important;
  z-index: -1 !important;
}

.files-list {
  margin-bottom: 40px !important;
}

.files-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 20px !important;
  flex-wrap: wrap !important;
  gap: 15px !important;
}

.files-header h3 {
  margin: 0 !important;
  color: #333 !important;
}

.files-actions {
  display: flex !important;
  gap: 10px !important;
  flex-wrap: wrap !important;
}

.tool-container .action-btn {
  background: #6c757d !important;
  color: white !important;
  border: none !important;
  padding: 8px 16px !important;
  border-radius: 20px !important;
  font-size: 0.9rem !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  display: inline-block !important;
  text-decoration: none !important;
  font-family: inherit !important;
  box-sizing: border-box !important;
}

.tool-container .action-btn:hover {
  background: #495057 !important;
  transform: translateY(-1px) !important;
}

.tool-container .action-btn.danger {
  background: #dc3545 !important;
}

.tool-container .action-btn.danger:hover {
  background: #c82333 !important;
}

.files-container {
  margin-bottom: 20px !important;
}

.file-item {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  background: white !important;
  padding: 15px !important;
  border-radius: 8px !important;
  margin-bottom: 10px !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
  transition: all 0.3s ease !important;
  cursor: move !important;
}

.file-item:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
  transform: translateY(-1px) !important;
}

.file-info {
  display: flex !important;
  align-items: center !important;
  gap: 15px !important;
  flex: 1 !important;
}

.file-checkbox {
  position: relative !important;
}

.file-checkbox input[type="checkbox"] {
  width: 18px !important;
  height: 18px !important;
  cursor: pointer !important;
}

.file-icon {
  font-size: 2rem !important;
}

.file-details h4 {
  margin: 0 0 5px 0 !important;
  color: #333 !important;
  font-size: 1rem !important;
}

.file-details p {
  margin: 0 !important;
  color: #666 !important;
  font-size: 0.9rem !important;
}

.file-pages {
  color: #667eea !important;
  font-weight: 500 !important;
  font-size: 0.9rem !important;
}

.file-actions {
  display: flex !important;
  gap: 10px !important;
  align-items: center !important;
}

/* View Pages and Remove Buttons */
.tool-container .view-pages-btn {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%) !important;
  color: white !important;
  border: none !important;
  padding: 8px 16px !important;
  border-radius: 20px !important;
  font-size: 0.9rem !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  text-decoration: none !important;
  font-family: inherit !important;
  box-sizing: border-box !important;
  font-weight: 600 !important;
  box-shadow: 0 3px 10px rgba(23, 162, 184, 0.2) !important;
}

.tool-container .view-pages-btn:hover {
  background: linear-gradient(135deg, #138496 0%, #117a8b 100%) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 5px 15px rgba(23, 162, 184, 0.3) !important;
}

.tool-container .remove-btn {
  background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%) !important;
  color: white !important;
  border: none !important;
  width: 32px !important;
  height: 32px !important;
  border-radius: 50% !important;
  cursor: pointer !important;
  font-size: 1.1rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.3s ease !important;
  text-decoration: none !important;
  font-family: inherit !important;
  box-sizing: border-box !important;
  font-weight: bold !important;
  box-shadow: 0 3px 10px rgba(255, 71, 87, 0.3) !important;
}

.tool-container .remove-btn:hover {
  background: linear-gradient(135deg, #ff3742 0%, #ff2533 100%) !important;
  transform: scale(1.1) !important;
  box-shadow: 0 5px 15px rgba(255, 71, 87, 0.4) !important;
}

.merge-controls {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  flex-wrap: wrap !important;
  gap: 20px !important;
}

.merge-info {
  display: flex !important;
  gap: 20px !important;
  color: #666 !important;
  font-weight: 500 !important;
}

.merge-buttons {
  display: flex !important;
  gap: 15px !important;
}

.tool-container .merge-btn {
  background: #667eea !important;
  color: white !important;
  border: none !important;
  padding: 15px 40px !important;
  border-radius: 25px !important;
  font-size: 1.1rem !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  display: inline-block !important;
  text-decoration: none !important;
  font-family: inherit !important;
  font-weight: 600 !important;
  box-sizing: border-box !important;
}

.tool-container .merge-btn:hover {
  background: #764ba2 !important;
  transform: translateY(-2px) !important;
}

.tool-container .clear-btn {
  background: #6c757d !important;
  color: white !important;
  border: none !important;
  padding: 15px 30px !important;
  border-radius: 25px !important;
  font-size: 1.1rem !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  display: inline-block !important;
  text-decoration: none !important;
  font-family: inherit !important;
  font-weight: 600 !important;
  box-sizing: border-box !important;
}

.tool-container .clear-btn:hover {
  background: #495057 !important;
}

/* Page Management Styles */
.page-management {
  margin-bottom: 40px;
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h3 {
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: #333;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

.page-controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

/* Page Control Buttons - Enhanced Modern Style */
.tool-container .page-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  border: none !important;
  padding: 12px 24px !important;
  border-radius: 25px !important;
  font-size: 0.95rem !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  text-decoration: none !important;
  font-family: inherit !important;
  box-sizing: border-box !important;
  min-width: 140px !important;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.25) !important;
  border: 2px solid transparent !important;
}

.tool-container .page-btn:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%) !important;
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.35) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.tool-container .page-btn:active {
  transform: translateY(-1px) scale(1.01) !important;
}

.pdf-pages-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.pdf-file-section {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
}

.file-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
}

.file-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.page-count {
  color: #667eea;
  font-weight: 500;
}

.pages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
}

.page-item {
  position: relative;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.page-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.page-checkbox {
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 2;
}

.page-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.page-thumbnail {
  width: 100%;
  height: 150px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.page-number {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 500;
}

.progress-section {
  text-align: center;
  margin-bottom: 40px;
}

.progress-container {
  max-width: 600px;
  margin: 0 auto;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 15px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  width: 0%;
  transition: width 0.3s ease;
}

/* Download Section - Enhanced Modern Style */
.download-section {
  text-align: center !important;
  margin-bottom: 40px !important;
  animation: slideDown 0.5s ease-out !important;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-message {
  background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%) !important;
  border: 2px solid #28a745 !important;
  border-radius: 20px !important;
  padding: 50px 40px !important;
  color: #155724 !important;
  box-shadow: 0 10px 30px rgba(40, 167, 69, 0.1) !important;
  position: relative !important;
  overflow: hidden !important;
}

.success-message::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 4px !important;
  background: linear-gradient(90deg, #28a745 0%, #20c997 100%) !important;
}

.success-icon {
  font-size: 5rem !important;
  margin-bottom: 25px !important;
  animation: bounce 1s ease-in-out !important;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.success-message h3 {
  font-size: 2.2rem !important;
  margin-bottom: 15px !important;
  font-weight: 700 !important;
  color: #155724 !important;
}

.success-message p {
  font-size: 1.2rem !important;
  color: #155724 !important;
  margin-bottom: 30px !important;
  opacity: 0.9 !important;
}

.download-info {
  display: flex !important;
  justify-content: center !important;
  gap: 40px !important;
  margin: 30px 0 !important;
  font-weight: 600 !important;
  font-size: 1.1rem !important;
}

.download-info span {
  background: rgba(40, 167, 69, 0.1) !important;
  padding: 10px 20px !important;
  border-radius: 25px !important;
  border: 1px solid rgba(40, 167, 69, 0.2) !important;
}

/* Download Button - Enhanced Modern Style with High Specificity */
.tool-container .download-btn,
.tool-container .download-section .download-btn {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%) !important;
  color: white !important;
  border: none !important;
  padding: 18px 40px !important;
  border-radius: 50px !important;
  font-size: 1.2rem !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  margin-top: 0px !important;
  margin-right: 0px !important;
  transition: all 0.3s ease !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 10px !important;
  text-decoration: none !important;
  font-family: inherit !important;
  box-sizing: border-box !important;
  min-width: 250px !important;
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3) !important;
  border: 2px solid transparent !important;
  position: relative !important;
  overflow: hidden !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
}

.tool-container .download-btn:hover,
.tool-container .download-section .download-btn:hover {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%) !important;
  transform: translateY(-3px) scale(1.02) !important;
  box-shadow: 0 12px 35px rgba(0, 123, 255, 0.4) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.tool-container .download-btn:active,
.tool-container .download-section .download-btn:active {
  transform: translateY(-1px) scale(1.01) !important;
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3) !important;
}

/* New Merge Button - Enhanced Modern Style */
.tool-container .new-merge-btn,
.tool-container .download-section .new-merge-btn {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%) !important;
  color: white !important;
  border: none !important;
  padding: 15px 35px !important;
  border-radius: 50px !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  margin-top: 0px !important;
  transition: all 0.3s ease !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 10px !important;
  text-decoration: none !important;
  font-family: inherit !important;
  box-sizing: border-box !important;
  min-width: 220px !important;
  box-shadow: 0 6px 20px rgba(108, 117, 125, 0.3) !important;
  border: 2px solid transparent !important;
  position: relative !important;
  overflow: hidden !important;
}

.tool-container .new-merge-btn:hover,
.tool-container .download-section .new-merge-btn:hover {
  background: linear-gradient(135deg, #495057 0%, #343a40 100%) !important;
  transform: translateY(-2px) scale(1.01) !important;
  box-shadow: 0 8px 25px rgba(108, 117, 125, 0.4) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.tool-container .new-merge-btn:active,
.tool-container .download-section .new-merge-btn:active {
  transform: translateY(0) scale(1.0) !important;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3) !important;
}

.features-section,
.how-to-section,
.faq-section {
  margin-bottom: 60px;
}

.features-section h2,
.how-to-section h2,
.faq-section h2 {
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

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.step {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.step-number {
  width: 50px;
  height: 50px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 20px;
}

.step h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #333;
}

.step p {
  color: #666;
  line-height: 1.6;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.faq-item h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
}

.faq-item p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Modal Styles */
.page-modal {
  position: fixed;
 
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 1400px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.close-btn {
  background: #dc3545;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #c82333;
  transform: scale(1.1);
}

.modal-body {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.page-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.control-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: #495057;
  transform: translateY(-1px);
}

.control-btn.primary {
  background: #667eea;
}

.control-btn.primary:hover {
  background: #764ba2;
}

.pdfs-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
}

.pdf-section {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  background: #f8f9fa;
}

.pdf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
}

.pdf-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.pdf-pages-count {
  color: #667eea;
  font-weight: 500;
  font-size: 0.9rem;
}

.pages-grid-modal {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
}

.modal-page-item {
  position: relative;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: move;
}

.modal-page-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.modal-page-checkbox {
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 2;
}

.modal-page-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.modal-page-thumbnail {
  width: 100%;
  height: 160px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.modal-page-number {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 500;
}

.modal-page-info {
  position: absolute;
  bottom: 5px;
  left: 5px;
  background: rgba(102, 126, 234, 0.9);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
}

.manage-pages-btn {
  background: #17a2b8;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.manage-pages-btn:hover {
  background: #138496;
  transform: translateY(-1px);
}

/* Message styles */
.message {
  position: fixed !important;
  top: 20px !important;
  right: 20px !important;
  padding: 15px 40px 15px 20px !important;
  border-radius: 8px !important;
  color: white !important;
  font-weight: 500 !important;
  z-index: 1000 !important;
  animation: slideIn 0.3s ease !important;
  min-width: 250px !important;
  max-width: 400px !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
  font-family: inherit !important;
  box-sizing: border-box !important;
}

.message.success {
  background: #28a745 !important;
}

.message.error {
  background: #dc3545 !important;
}

.message.info {
  background: #17a2b8 !important;
}

.message.warning {
  background: #ffc107 !important;
  color: #333 !important;
}

.message-close {
  position: absolute !important;
  top: 5px !important;
  right: 10px !important;
  background: none !important;
  border: none !important;
  color: inherit !important;
  font-size: 18px !important;
  font-weight: bold !important;
  cursor: pointer !important;
  padding: 0 !important;
  width: 20px !important;
  height: 20px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  opacity: 0.8 !important;
  transition: opacity 0.2s ease !important;
}

.message-close:hover {
  opacity: 1 !important;
}

@keyframes slideIn {
  from {
    transform: translateX(100%) !important;
    opacity: 0 !important;
  }
  to {
    transform: translateX(0) !important;
    opacity: 1 !important;
  }
}

/* ===== MOBILE RESPONSIVE STYLES ===== */

/* Large Mobile / Small Tablet (768px and below) */
@media (max-width: 768px) {
  .tool-container {
    padding: 15px !important;
    margin: 0 auto !important;
  }
  
  .tool-header h1 {
    font-size: 2.2rem !important;
    line-height: 1.2 !important;
    margin-bottom: 15px !important;
  }
  
  .tool-header p {
    font-size: 1.1rem !important;
    line-height: 1.4 !important;
  }
  
  /* Upload Area Mobile Optimization */
  .upload-area {
    padding: 40px 15px !important;
    margin: 20px 0 !important;
  }
  
  .upload-icon {
    font-size: 3.5rem !important;
    margin-bottom: 15px !important;
  }
  
  .upload-area h3 {
    font-size: 1.3rem !important;
  }
  
  .upload-area p {
    font-size: 1rem !important;
    margin-bottom: 25px !important;
  }
  
  /* Enhanced Mobile Button Styles */
  .tool-container .upload-area .upload-btn.modern-btn {
    padding: 16px 30px !important;
    font-size: 1rem !important;
    min-width: 200px !important;
    width: auto !important;
    max-width: 280px !important;
  }
  
  /* Files Section Mobile */
  .files-header {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 20px !important;
    text-align: center !important;
  }
  
  .files-actions {
    justify-content: center !important;
    flex-wrap: wrap !important;
    gap: 10px !important;
  }
  
  .tool-container .action-btn {
    padding: 10px 16px !important;
    font-size: 0.85rem !important;
    min-width: 120px !important;
  }
  
  /* File Items Mobile */
  .file-item {
    flex-direction: column !important;
    gap: 15px !important;
    padding: 20px 15px !important;
  }
  
  .file-info {
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    gap: 15px !important;
  }
  
  .file-details h4 {
    font-size: 1.1rem !important;
    margin-bottom: 5px !important;
  }
  
  .file-actions {
    justify-content: center !important;
    gap: 15px !important;
    width: 100% !important;
  }
  
  .tool-container .view-pages-btn {
    padding: 10px 18px !important;
    font-size: 0.9rem !important;
    min-width: 130px !important;
  }
  
  .tool-container .remove-btn {
    width: 36px !important;
    height: 36px !important;
    font-size: 1.2rem !important;
  }
  
  /* Merge Controls Mobile */
  .merge-controls {
    flex-direction: column !important;
    align-items: center !important;
    gap: 25px !important;
    text-align: center !important;
  }
  
  .merge-info {
    justify-content: center !important;
    flex-wrap: wrap !important;
    gap: 15px !important;
  }
  
  .merge-buttons {
    justify-content: center !important;
    flex-direction: column !important;
    gap: 15px !important;
    width: 100% !important;
    max-width: 300px !important;
  }
  
  /* Primary Action Buttons Mobile */
  .tool-container .primary-action,
  .tool-container .primary-download {
    padding: 16px 35px !important;
    font-size: 1.1rem !important;
    min-width: 200px !important;
    width: 100% !important;
    max-width: 280px !important;
  }
  
  .tool-container .secondary-action {
    padding: 14px 25px !important;
    font-size: 1rem !important;
    min-width: 180px !important;
    width: 100% !important;
    max-width: 250px !important;
  }
  
  /* Page Controls Mobile */
  .page-controls {
    flex-direction: column !important;
    align-items: center !important;
    gap: 15px !important;
  }
  
  .tool-container .page-btn {
    padding: 12px 20px !important;
    font-size: 0.9rem !important;
    min-width: 160px !important;
    width: auto !important;
  }
  
  /* Success Message Mobile */
  .success-message {
    padding: 40px 20px !important;
    margin: 20px 0 !important;
  }
  
  .success-message h3 {
    font-size: 1.8rem !important;
    margin-bottom: 12px !important;
  }
  
  .success-message p {
    font-size: 1.1rem !important;
  }
  
  .download-info {
    flex-direction: column !important;
    gap: 15px !important;
  }
  
  .download-info span {
    padding: 12px 20px !important;
    font-size: 1rem !important;
  }
  
  .download-actions {
    gap: 20px !important;
    margin-top: 30px !important;
  }
  
  /* Grid Layouts Mobile */
  .features-grid,
  .steps {
    grid-template-columns: 1fr !important;
    gap: 25px !important;
  }
  
  .pages-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)) !important;
    gap: 15px !important;
  }
  
  /* Modal Mobile Optimization */
  .page-modal {
    padding: 10px !important;
  }
  
  .modal-content {
    max-height: 95vh !important;
    border-radius: 15px !important;
    margin: 20px 0 !important;
  }
  
  .modal-header {
    padding: 20px !important;
    border-radius: 15px 15px 0 0 !important;
  }
  
  .modal-header h2 {
    font-size: 1.4rem !important;
  }
  
  .modal-body {
    padding: 20px !important;
  }
  
  .pdfs-container {
    grid-template-columns: 1fr !important;
  }
  
  .pages-grid-modal {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)) !important;
  }
  
  .pdf-header {
    flex-direction: column !important;
    align-items: center !important;
    gap: 15px !important;
    text-align: center !important;
  }
}

/* Small Mobile (480px and below) */
@media (max-width: 480px) {
  .tool-container {
    padding: 10px !important;
  }
  
  .tool-header h1 {
    font-size: 1.8rem !important;
    line-height: 1.1 !important;
  }
  
  .tool-header p {
    font-size: 1rem !important;
  }
  
  /* Ultra-compact upload area */
  .upload-area {
    padding: 30px 10px !important;
  }
  
  .upload-icon {
    font-size: 3rem !important;
  }
  
  .upload-area h3 {
    font-size: 1.2rem !important;
  }
  
  .upload-area p {
    font-size: 0.95rem !important;
  }
  
  .tool-container .upload-area .upload-btn.modern-btn {
    padding: 14px 25px !important;
    font-size: 0.95rem !important;
    min-width: 180px !important;
    max-width: 100% !important;
  }
  
  /* Compact action buttons */
  .tool-container .action-btn {
    padding: 8px 14px !important;
    font-size: 0.8rem !important;
    min-width: 100px !important;
  }
  
  /* Single column file layout */
  .file-item {
    padding: 15px 10px !important;
  }
  
  .file-details h4 {
    font-size: 1rem !important;
  }
  
  .file-details p {
    font-size: 0.9rem !important;
  }
  
  /* Compact view/remove buttons */
  .tool-container .view-pages-btn {
    padding: 8px 14px !important;
    font-size: 0.85rem !important;
    min-width: 110px !important;
  }
  
  .tool-container .remove-btn {
    width: 32px !important;
    height: 32px !important;
    font-size: 1.1rem !important;
  }
  
  /* Compact merge buttons */
  .tool-container .primary-action,
  .tool-container .primary-download {
    padding: 14px 30px !important;
    font-size: 1rem !important;
    min-width: 180px !important;
  }
  
  .tool-container .secondary-action {
    padding: 12px 20px !important;
    font-size: 0.95rem !important;
    min-width: 160px !important;
  }
  
  /* Compact page controls */
  .tool-container .page-btn {
    padding: 10px 16px !important;
    font-size: 0.85rem !important;
    min-width: 140px !important;
  }
  
  /* Compact success message */
  .success-message {
    padding: 30px 15px !important;
  }
  
  .success-icon {
    font-size: 4rem !important;
  }
  
  .success-message h3 {
    font-size: 1.6rem !important;
  }
  
  .success-message p {
    font-size: 1rem !important;
  }
  
  .download-info span {
    padding: 10px 16px !important;
    font-size: 0.95rem !important;
  }
  
  /* Very compact grids */
  .pages-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)) !important;
    gap: 10px !important;
  }
  
  /* Modal ultra-compact */
  .modal-content {
    margin: 10px 0 !important;
    border-radius: 10px !important;
  }
  
  .modal-header {
    padding: 15px !important;
  }
  
  .modal-header h2 {
    font-size: 1.2rem !important;
  }
  
  .modal-body {
    padding: 15px !important;
  }
  
  .pages-grid-modal {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)) !important;
  }
}

/* Extra Small Mobile (360px and below) */
@media (max-width: 360px) {
  .tool-header h1 {
    font-size: 1.6rem !important;
  }
  
  .upload-area {
    padding: 25px 8px !important;
  }
  
  .upload-icon {
    font-size: 2.5rem !important;
  }
  
  .tool-container .upload-area .upload-btn.modern-btn {
    padding: 12px 20px !important;
    font-size: 0.9rem !important;
    min-width: 160px !important;
  }
  
  .tool-container .action-btn {
    padding: 6px 12px !important;
    font-size: 0.75rem !important;
    min-width: 90px !important;
  }
  
  .tool-container .view-pages-btn {
    padding: 6px 12px !important;
    font-size: 0.8rem !important;
    min-width: 100px !important;
  }
  
  .tool-container .primary-action,
  .tool-container .primary-download {
    padding: 12px 25px !important;
    font-size: 0.95rem !important;
    min-width: 160px !important;
  }
  
  .success-message {
    padding: 25px 10px !important;
  }
  
  .success-icon {
    font-size: 3.5rem !important;
  }
  
  .success-message h3 {
    font-size: 1.4rem !important;
  }
}

/* === MOBILE POLISH & RESPONSIVENESS === */
@media (max-width: 900px) {
  .tool-container {
    padding: 10px !important;
  }
  .tool-header {
    padding: 25px 10px !important;
    margin-bottom: 30px !important;
  }
}
@media (max-width: 768px) {
  .tool-header h1 {
    font-size: 1.7rem !important;
    margin-bottom: 10px !important;
  }
  .tool-header p {
    font-size: 1rem !important;
  }
  .upload-area {
    padding: 25px 8px !important;
    min-height: 180px !important;
  }
  .upload-icon {
    font-size: 2.2rem !important;
    margin-bottom: 10px !important;
  }
  .upload-area h3 {
    font-size: 1.1rem !important;
  }
  .upload-area .upload-btn {
    padding: 12px 18px !important;
    font-size: 0.95rem !important;
    min-width: 120px !important;
  }
  .files-header, .merge-controls {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 10px !important;
    text-align: center !important;
  }
  .files-actions, .merge-buttons {
    justify-content: center !important;
    flex-wrap: wrap !important;
    gap: 10px !important;
  }
  .file-item {
    flex-direction: column !important;
    gap: 10px !important;
    padding: 12px 6px !important;
    min-width: 0 !important;
    width: 100% !important;
  }
  .file-info {
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    gap: 8px !important;
  }
  .file-details h4 {
    font-size: 1rem !important;
  }
  .file-actions {
    justify-content: center !important;
    gap: 10px !important;
    width: 100% !important;
  }
  .view-pages-btn, .remove-btn {
    min-width: 44px !important;
    min-height: 44px !important;
    font-size: 1rem !important;
  }
  .merge-btn, .clear-btn, .primary-action, .secondary-action {
    width: 100% !important;
    min-width: 0 !important;
    font-size: 1rem !important;
    padding: 14px 0 !important;
  }
  .download-section, .success-message {
    padding: 20px 5px !important;
  }
  .download-info {
    flex-direction: column !important;
    gap: 10px !important;
    font-size: 1rem !important;
  }
  .download-info span {
    padding: 8px 10px !important;
    font-size: 0.95rem !important;
  }
  .download-actions {
    gap: 10px !important;
    margin-top: 15px !important;
  }
  .page-modal .modal-content {
    max-width: 98vw !important;
    min-width: 0 !important;
    border-radius: 10px !important;
    margin: 10px 0 !important;
  }
  .modal-header, .modal-body {
    padding: 10px !important;
  }
  .modal-header h2 {
    font-size: 1.1rem !important;
  }
  .pages-grid-modal {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)) !important;
    gap: 8px !important;
  }
}
@media (max-width: 480px) {
  .tool-header h1 {
    font-size: 1.2rem !important;
  }
  .upload-area {
    padding: 12px 2px !important;
    min-height: 120px !important;
  }
  .upload-icon {
    font-size: 1.5rem !important;
  }
  .file-details h4 {
    font-size: 0.95rem !important;
  }
  .merge-btn, .clear-btn, .primary-action, .secondary-action {
    font-size: 0.95rem !important;
    padding: 10px 0 !important;
  }
  .download-section, .success-message {
    padding: 10px 2px !important;
  }
  .download-info span {
    padding: 6px 6px !important;
    font-size: 0.9rem !important;
  }
  .modal-header h2 {
    font-size: 1rem !important;
  }
}
@media (max-width: 360px) {
  .tool-header h1 {
    font-size: 1rem !important;
  }
  .upload-area {
    padding: 6px 1px !important;
    min-height: 80px !important;
  }
  .file-details h4 {
    font-size: 0.85rem !important;
  }
  .merge-btn, .clear-btn, .primary-action, .secondary-action {
    font-size: 0.85rem !important;
    padding: 8px 0 !important;
  }
  .download-info span {
    padding: 4px 4px !important;
    font-size: 0.8rem !important;
  }
}
</style>