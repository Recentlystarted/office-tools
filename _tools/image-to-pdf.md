---
layout: tool
title: "Image to PDF Converter - Convert Images to PDF"
description: "Free online image to PDF converter. Convert JPG, PNG, WEBP, and other image formats to PDF. Batch conversion supported. No registration required."
keywords: "image to PDF, JPG to PDF, PNG to PDF, convert images to PDF, image converter, free PDF tools"
tool_name: "Image to PDF"
tool_category: "PDF Tools"
---

<!-- jsPDF for PDF creation -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<div class="tool-container">
  <div class="tool-header">
    <h1>Image to PDF Converter</h1>
    <p>Convert images to PDF format. Support for multiple images and batch conversion.</p>
  </div>

  <div class="upload-section">
    <div class="upload-area" id="uploadArea">
      <div class="upload-icon">🖼️</div>
      <h3>Drop images here or click to browse</h3>
      <p>Support for JPG, PNG, WEBP, GIF, and BMP formats</p>
      <input type="file" id="fileInput" accept="image/*" multiple style="display: none;">
      <button class="upload-btn" onclick="document.getElementById('fileInput').click()">Choose Images</button>
    </div>
  </div>

  <div class="images-section" id="imagesSection" style="display: none;">
    <div class="images-header">
      <h3>Selected Images (<span id="imageCount">0</span>)</h3>
      <div class="images-actions">
        <button class="action-btn" id="selectAllBtn">Select All</button>
        <button class="action-btn" id="deselectAllBtn">Deselect All</button>
        <button class="action-btn danger" id="removeSelectedBtn">Remove Selected</button>
        <button class="action-btn" id="addMoreBtn">Add More Images</button>
      </div>
    </div>
    
    <div class="images-list" id="imagesList"></div>
    
    <div class="conversion-options">
      <h4>PDF Options</h4>
      <div class="options-grid">
        <div class="option-group">
          <label>Page Size:</label>
          <select id="pageSize">
            <option value="a4">A4 (210 × 297 mm)</option>
            <option value="letter">Letter (8.5 × 11 in)</option>
            <option value="a3">A3 (297 × 420 mm)</option>
            <option value="a5">A5 (148 × 210 mm)</option>
            <option value="custom">Custom Size</option>
          </select>
        </div>
        
        <div class="option-group" id="customSizeGroup" style="display: none;">
          <label>Custom Size (mm):</label>
          <div class="size-inputs">
            <input type="number" id="customWidth" placeholder="Width" value="210">
            <span>×</span>
            <input type="number" id="customHeight" placeholder="Height" value="297">
          </div>
        </div>
        
        <div class="option-group">
          <label>Orientation:</label>
          <select id="orientation">
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
        
        <div class="option-group">
          <label>Image Layout:</label>
          <select id="imageLayout">
            <option value="fit">Fit to Page</option>
            <option value="fill">Fill Page</option>
            <option value="original">Original Size</option>
            <option value="multiple">Multiple per Page</option>
          </select>
        </div>
        
        <div class="option-group" id="imagesPerPageGroup" style="display: none;">
          <label>Images per Page:</label>
          <select id="imagesPerPage">
            <option value="2">2 Images</option>
            <option value="4">4 Images</option>
            <option value="6">6 Images</option>
            <option value="9">9 Images</option>
          </select>
        </div>
        
        <div class="option-group">
          <label>Margin (mm):</label>
          <input type="number" id="margin" value="10" min="0" max="50">
        </div>
        
        <div class="option-group">
          <label>Image Quality:</label>
          <select id="imageQuality">
            <option value="0.9">High (90%)</option>
            <option value="0.8" selected>Medium (80%)</option>
            <option value="0.6">Low (60%)</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="convert-controls">
      <button class="convert-btn" id="convertBtn">Convert to PDF</button>
      <button class="clear-btn" id="clearBtn">Clear All</button>
    </div>
  </div>

  <div class="progress-section" id="progressSection" style="display: none;">
    <div class="progress-bar">
      <div class="progress-fill" id="progressFill"></div>
    </div>
    <p id="progressText">Converting images to PDF...</p>
  </div>

  <div class="download-section" id="downloadSection" style="display: none;">
    <div class="success-message">
      <div class="success-icon">✅</div>
      <h3>PDF Created Successfully!</h3>
      <p>Your images have been converted to PDF format</p>
      <div class="pdf-info">
        <div class="info-item">
          <span class="info-label">Images:</span>
          <span class="info-value" id="totalImages">0</span>
        </div>
        <div class="info-item">
          <span class="info-label">Pages:</span>
          <span class="info-value" id="totalPages">0</span>
        </div>
        <div class="info-item">
          <span class="info-label">File Size:</span>
          <span class="info-value" id="pdfSize">0 MB</span>
        </div>
      </div>
      <div class="download-actions">
        <button class="download-btn" id="downloadBtn">Download PDF</button>
        <button class="new-convert-btn" id="newConvertBtn">Convert More Images</button>
      </div>
    </div>
  </div>

  <div class="features-section">
    <h2>Features</h2>
    <div class="features-grid">
      <div class="feature">
        <div class="feature-icon">📷</div>
        <h3>Multiple Formats</h3>
        <p>Support for JPG, PNG, WEBP, GIF, BMP and more image formats</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🔄</div>
        <h3>Batch Conversion</h3>
        <p>Convert multiple images to PDF in one go</p>
      </div>
      <div class="feature">
        <div class="feature-icon">⚙️</div>
        <h3>Customizable</h3>
        <p>Control page size, layout, quality and margins</p>
      </div>
      <div class="feature">
        <div class="feature-icon">💯</div>
        <h3>High Quality</h3>
        <p>Maintain image quality with adjustable compression</p>
      </div>
    </div>
  </div>

  <div class="how-to-section">
    <h2>How to Convert Images to PDF</h2>
    <div class="steps">
      <div class="step">
        <div class="step-number">1</div>
        <h3>Upload Images</h3>
        <p>Select or drag & drop your image files</p>
      </div>
      <div class="step">
        <div class="step-number">2</div>
        <h3>Arrange & Configure</h3>
        <p>Reorder images and set PDF options</p>
      </div>
      <div class="step">
        <div class="step-number">3</div>
        <h3>Convert & Download</h3>
        <p>Click convert and download your PDF</p>
      </div>
    </div>
  </div>
</div>

<script>
// Global variables
let selectedImages = [];
let convertedPdf = null;

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
  const files = Array.from(e.target.files);
  handleFiles(files);
});

document.getElementById('addMoreBtn').addEventListener('click', () => {
  document.getElementById('fileInput').click();
});

async function handleFiles(files) {
  const validFiles = files.filter(file => file.type.startsWith('image/'));
  
  if (validFiles.length === 0) {
    showMessage('Please select valid image files.', 'error');
    return;
  }
  
  if (validFiles.length !== files.length) {
    showMessage(`${files.length - validFiles.length} files were skipped (not images).`, 'warning');
  }
  
  // Process each file
  for (const file of validFiles) {
    await addImageToList(file);
  }
  
  updateImagesList();
  updateImageCount();
  
  if (selectedImages.length > 0) {
    document.getElementById('imagesSection').style.display = 'block';
    document.getElementById('uploadArea').style.display = 'none';
  }
  
  showMessage(`${validFiles.length} images added successfully!`, 'success');
}

async function addImageToList(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        selectedImages.push({
          file: file,
          dataUrl: e.target.result,
          name: file.name,
          size: file.size,
          width: img.width,
          height: img.height,
          selected: true
        });
        resolve();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function updateImagesList() {
  const imagesList = document.getElementById('imagesList');
  imagesList.innerHTML = '';
  
  selectedImages.forEach((image, index) => {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'image-item';
    imageDiv.draggable = true;
    imageDiv.dataset.index = index;
    
    imageDiv.innerHTML = `
      <div class="image-checkbox">
        <input type="checkbox" id="image-${index}" ${image.selected ? 'checked' : ''}>
        <label for="image-${index}"></label>
      </div>
      <div class="image-preview">
        <img src="${image.dataUrl}" alt="${image.name}">
      </div>
      <div class="image-info">
        <h4>${image.name}</h4>
        <p>${(image.size / 1024).toFixed(1)} KB</p>
        <p>${image.width} × ${image.height}px</p>
      </div>
      <div class="image-actions">
        <button class="move-up-btn" onclick="moveImage(${index}, -1)" ${index === 0 ? 'disabled' : ''}>↑</button>
        <button class="move-down-btn" onclick="moveImage(${index}, 1)" ${index === selectedImages.length - 1 ? 'disabled' : ''}>↓</button>
        <button class="remove-btn" onclick="removeImage(${index})">×</button>
      </div>
    `;
    
    imagesList.appendChild(imageDiv);
    
    // Add event listeners
    const checkbox = imageDiv.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', (e) => {
      selectedImages[index].selected = e.target.checked;
      updateImageCount();
    });
    
    // Drag and drop for reordering
    imageDiv.addEventListener('dragstart', handleDragStart);
    imageDiv.addEventListener('dragover', handleDragOver);
    imageDiv.addEventListener('drop', handleDrop);
  });
}

function updateImageCount() {
  const selectedCount = selectedImages.filter(img => img.selected).length;
  document.getElementById('imageCount').textContent = selectedCount;
}

// Image management functions
function moveImage(index, direction) {
  const newIndex = index + direction;
  if (newIndex >= 0 && newIndex < selectedImages.length) {
    [selectedImages[index], selectedImages[newIndex]] = [selectedImages[newIndex], selectedImages[index]];
    updateImagesList();
  }
}

function removeImage(index) {
  selectedImages.splice(index, 1);
  updateImagesList();
  updateImageCount();
  
  if (selectedImages.length === 0) {
    document.getElementById('imagesSection').style.display = 'none';
    document.getElementById('uploadArea').style.display = 'block';
  }
}

// Drag and drop for reordering
let draggedIndex = null;

function handleDragStart(e) {
  draggedIndex = parseInt(e.target.dataset.index);
  e.target.style.opacity = '0.5';
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const dropIndex = parseInt(e.target.closest('.image-item').dataset.index);
  
  if (draggedIndex !== null && draggedIndex !== dropIndex) {
    const draggedItem = selectedImages[draggedIndex];
    selectedImages.splice(draggedIndex, 1);
    selectedImages.splice(dropIndex, 0, draggedItem);
    updateImagesList();
  }
  
  e.target.style.opacity = '1';
  draggedIndex = null;
}

// Action buttons
document.getElementById('selectAllBtn').addEventListener('click', () => {
  selectedImages.forEach(img => img.selected = true);
  updateImagesList();
  updateImageCount();
});

document.getElementById('deselectAllBtn').addEventListener('click', () => {
  selectedImages.forEach(img => img.selected = false);
  updateImagesList();
  updateImageCount();
});

document.getElementById('removeSelectedBtn').addEventListener('click', () => {
  selectedImages = selectedImages.filter(img => !img.selected);
  updateImagesList();
  updateImageCount();
  
  if (selectedImages.length === 0) {
    document.getElementById('imagesSection').style.display = 'none';
    document.getElementById('uploadArea').style.display = 'block';
  }
});

// Options handling
document.getElementById('pageSize').addEventListener('change', (e) => {
  const customGroup = document.getElementById('customSizeGroup');
  if (e.target.value === 'custom') {
    customGroup.style.display = 'block';
  } else {
    customGroup.style.display = 'none';
  }
});

document.getElementById('imageLayout').addEventListener('change', (e) => {
  const imagesPerPageGroup = document.getElementById('imagesPerPageGroup');
  if (e.target.value === 'multiple') {
    imagesPerPageGroup.style.display = 'block';
  } else {
    imagesPerPageGroup.style.display = 'none';
  }
});

// Conversion functionality
document.getElementById('convertBtn').addEventListener('click', convertToPdf);
document.getElementById('clearBtn').addEventListener('click', clearAll);
document.getElementById('newConvertBtn').addEventListener('click', startNewConversion);
document.getElementById('downloadBtn').addEventListener('click', downloadPdf);

async function convertToPdf() {
  const selectedImagesList = selectedImages.filter(img => img.selected);
  
  if (selectedImagesList.length === 0) {
    showMessage('Please select at least one image to convert.', 'error');
    return;
  }
  
  // Show progress
  document.getElementById('progressSection').style.display = 'block';
  document.getElementById('imagesSection').style.display = 'none';
  
  try {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressText.textContent = 'Initializing PDF creation...';
    progressFill.style.width = '10%';
    
    // Get options
    const pageSize = document.getElementById('pageSize').value;
    const orientation = document.getElementById('orientation').value;
    const imageLayout = document.getElementById('imageLayout').value;
    const imagesPerPage = parseInt(document.getElementById('imagesPerPage').value);
    const margin = parseFloat(document.getElementById('margin').value);
    const quality = parseFloat(document.getElementById('imageQuality').value);
    
    // Calculate page dimensions
    let pageWidth, pageHeight;
    if (pageSize === 'custom') {
      pageWidth = parseFloat(document.getElementById('customWidth').value);
      pageHeight = parseFloat(document.getElementById('customHeight').value);
    } else {
      const pageSizes = {
        a4: [210, 297],
        letter: [215.9, 279.4],
        a3: [297, 420],
        a5: [148, 210]
      };
      [pageWidth, pageHeight] = pageSizes[pageSize];
    }
    
    if (orientation === 'landscape') {
      [pageWidth, pageHeight] = [pageHeight, pageWidth];
    }
    
    // Create PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: [pageWidth, pageHeight]
    });
    
    const effectiveWidth = pageWidth - (margin * 2);
    const effectiveHeight = pageHeight - (margin * 2);
    
    progressText.textContent = 'Processing images...';
    
    if (imageLayout === 'multiple') {
      await processMultipleImagesPerPage(pdf, selectedImagesList, imagesPerPage, effectiveWidth, effectiveHeight, margin, quality, progressFill, progressText);
    } else {
      await processSingleImagePerPage(pdf, selectedImagesList, imageLayout, effectiveWidth, effectiveHeight, margin, quality, progressFill, progressText);
    }
    
    progressText.textContent = 'Finalizing PDF...';
    progressFill.style.width = '95%';
    
    // Generate PDF blob
    convertedPdf = pdf.output('blob');
    
    // Update UI
    document.getElementById('totalImages').textContent = selectedImagesList.length;
    document.getElementById('totalPages').textContent = pdf.getNumberOfPages();
    document.getElementById('pdfSize').textContent = (convertedPdf.size / 1024 / 1024).toFixed(2) + ' MB';
    
    // Show download section
    progressText.textContent = 'Complete!';
    progressFill.style.width = '100%';
    
    setTimeout(() => {
      document.getElementById('progressSection').style.display = 'none';
      document.getElementById('downloadSection').style.display = 'block';
    }, 500);
    
    showMessage('Images converted to PDF successfully!', 'success');
    
  } catch (error) {
    console.error('Error converting images to PDF:', error);
    showMessage('Error converting images to PDF. Please try again.', 'error');
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('imagesSection').style.display = 'block';
  }
}

async function processSingleImagePerPage(pdf, images, layout, effectiveWidth, effectiveHeight, margin, quality, progressFill, progressText) {
  for (let i = 0; i < images.length; i++) {
    const progress = 20 + (i / images.length) * 70;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Processing image ${i + 1} of ${images.length}...`;
    
    if (i > 0) {
      pdf.addPage();
    }
    
    const image = images[i];
    const imgRatio = image.width / image.height;
    const pageRatio = effectiveWidth / effectiveHeight;
    
    let imgWidth, imgHeight, x, y;
    
    switch (layout) {
      case 'fit':
        if (imgRatio > pageRatio) {
          imgWidth = effectiveWidth;
          imgHeight = effectiveWidth / imgRatio;
        } else {
          imgHeight = effectiveHeight;
          imgWidth = effectiveHeight * imgRatio;
        }
        x = margin + (effectiveWidth - imgWidth) / 2;
        y = margin + (effectiveHeight - imgHeight) / 2;
        break;
        
      case 'fill':
        if (imgRatio > pageRatio) {
          imgHeight = effectiveHeight;
          imgWidth = effectiveHeight * imgRatio;
        } else {
          imgWidth = effectiveWidth;
          imgHeight = effectiveWidth / imgRatio;
        }
        x = margin + (effectiveWidth - imgWidth) / 2;
        y = margin + (effectiveHeight - imgHeight) / 2;
        break;
        
      case 'original':
        const scale = Math.min(effectiveWidth / (image.width * 0.264583), effectiveHeight / (image.height * 0.264583), 1);
        imgWidth = image.width * 0.264583 * scale;
        imgHeight = image.height * 0.264583 * scale;
        x = margin + (effectiveWidth - imgWidth) / 2;
        y = margin + (effectiveHeight - imgHeight) / 2;
        break;
    }
    
    pdf.addImage(image.dataUrl, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST');
  }
}

async function processMultipleImagesPerPage(pdf, images, imagesPerPage, effectiveWidth, effectiveHeight, margin, quality, progressFill, progressText) {
  const cols = Math.ceil(Math.sqrt(imagesPerPage));
  const rows = Math.ceil(imagesPerPage / cols);
  
  const cellWidth = effectiveWidth / cols;
  const cellHeight = effectiveHeight / rows;
  const cellMargin = 5;
  
  for (let i = 0; i < images.length; i += imagesPerPage) {
    if (i > 0) {
      pdf.addPage();
    }
    
    const progress = 20 + (i / images.length) * 70;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Processing page ${Math.floor(i / imagesPerPage) + 1}...`;
    
    for (let j = 0; j < imagesPerPage && (i + j) < images.length; j++) {
      const image = images[i + j];
      const row = Math.floor(j / cols);
      const col = j % cols;
      
      const cellX = margin + col * cellWidth + cellMargin;
      const cellY = margin + row * cellHeight + cellMargin;
      const availableWidth = cellWidth - (cellMargin * 2);
      const availableHeight = cellHeight - (cellMargin * 2);
      
      const imgRatio = image.width / image.height;
      const cellRatio = availableWidth / availableHeight;
      
      let imgWidth, imgHeight, x, y;
      
      if (imgRatio > cellRatio) {
        imgWidth = availableWidth;
        imgHeight = availableWidth / imgRatio;
      } else {
        imgHeight = availableHeight;
        imgWidth = availableHeight * imgRatio;
      }
      
      x = cellX + (availableWidth - imgWidth) / 2;
      y = cellY + (availableHeight - imgHeight) / 2;
      
      pdf.addImage(image.dataUrl, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST');
    }
  }
}

function downloadPdf() {
  if (!convertedPdf) {
    showMessage('No PDF available for download.', 'error');
    return;
  }
  
  const url = URL.createObjectURL(convertedPdf);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'images_to_pdf_' + new Date().getTime() + '.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  // Auto-clear after download
  setTimeout(() => {
    clearAll();
    showMessage('Files cleared for privacy.', 'info');
  }, 2000);
}

function clearAll() {
  selectedImages = [];
  convertedPdf = null;
  
  document.getElementById('imagesSection').style.display = 'none';
  document.getElementById('progressSection').style.display = 'none';
  document.getElementById('downloadSection').style.display = 'none';
  document.getElementById('uploadArea').style.display = 'block';
  
  document.getElementById('fileInput').value = '';
  document.getElementById('imagesList').innerHTML = '';
  document.getElementById('imageCount').textContent = '0';
  
  showMessage('All files cleared.', 'info');
}

function startNewConversion() {
  clearAll();
  showMessage('Ready for new conversion!', 'success');
}

// Drag and drop functionality for upload area
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
    handleFiles(files);
  }
});
</script>

<style>
/* Image to PDF specific styles */
.images-section {
  margin: 20px 0;
}

.images-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.images-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  background: #17a2b8;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #138496;
  transform: translateY(-1px);
}

.action-btn.danger {
  background: #dc3545;
}

.action-btn.danger:hover {
  background: #c82333;
}

.images-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin: 20px 0;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
}

.image-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: move;
  transition: all 0.3s ease;
}

.image-item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0,123,255,0.2);
}

.image-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #007bff;
}

.image-preview {
  flex-shrink: 0;
}

.image-preview img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.image-info {
  flex: 1;
  min-width: 0;
}

.image-info h4 {
  margin: 0 0 5px 0;
  font-size: 0.9rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-info p {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
}

.image-actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.move-up-btn, .move-down-btn, .remove-btn {
  background: #6c757d;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.move-up-btn:hover, .move-down-btn:hover {
  background: #5a6268;
}

.remove-btn {
  background: #dc3545;
  font-size: 1rem;
}

.remove-btn:hover {
  background: #c82333;
}

.move-up-btn:disabled, .move-down-btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.conversion-options {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
}

.conversion-options h4 {
  margin: 0 0 20px 0;
  color: #333;
  font-weight: 600;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-group label {
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.option-group select,
.option-group input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
}

.size-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.size-inputs input {
  flex: 1;
}

.size-inputs span {
  font-weight: bold;
  color: #666;
}

.convert-controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 30px 0;
}

.convert-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.convert-btn:hover {
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

.pdf-info {
  margin: 20px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.info-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.info-label {
  font-weight: 600;
  color: #333;
}

.info-value {
  color: #666;
  font-weight: 500;
}

.download-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.download-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.download-btn:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

.new-convert-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.new-convert-btn:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

/* Responsive design */
@media (max-width: 768px) {
  .images-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .images-actions {
    justify-content: center;
  }
  
  .images-list {
    grid-template-columns: 1fr;
    max-height: 300px;
  }
  
  .image-item {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  
  .image-actions {
    flex-direction: row;
    justify-content: center;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .convert-controls,
  .download-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .size-inputs {
    flex-direction: column;
    align-items: stretch;
  }
  
  .info-item {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
