---
layout: tool
title: "Image Format Converter - Free Online Image Converter"
description: "Convert images between different formats: PNG, JPG, JPEG, ICO, WebP, BMP, GIF. Free online image converter with high quality output."
keywords: "image converter, PNG to ICO, JPG to PNG, JPEG converter, image format converter, free image converter"
tool_name: "Image Format Converter"
tool_category: "Image Tools"
---

<div class="tool-container">
  <div class="tool-header">
    <h1>Image Format Converter</h1>
    <p>Convert images between different formats easily and quickly</p>
  </div>

  <div class="upload-section">
    <div class="upload-area" id="uploadArea">
      <div class="upload-icon">🖼️</div>
      <h3>Drop image file here or click to browse</h3>
      <p>Support for PNG, JPG, JPEG, WebP, BMP, GIF formats</p>
      <input type="file" id="fileInput" accept="image/*" style="display: none;">
      <button class="upload-btn" onclick="document.getElementById('fileInput').click()">Choose Image File</button>
    </div>
  </div>

  <div class="file-info" id="fileInfo" style="display: none;">
    <h3>Selected Image</h3>
    <div class="file-details" id="fileDetails"></div>
    <div class="preview-section">
      <h4>Preview</h4>
      <img id="imagePreview" style="max-width: 300px; max-height: 300px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    </div>
    <div class="conversion-options">
      <h4>Convert To</h4>
      <div class="format-grid">
        <button class="format-btn" data-format="png">PNG</button>
        <button class="format-btn" data-format="jpg">JPG</button>
        <button class="format-btn" data-format="jpeg">JPEG</button>
        <button class="format-btn" data-format="ico">ICO</button>
        <button class="format-btn" data-format="webp">WebP</button>
        <button class="format-btn" data-format="bmp">BMP</button>
        <button class="format-btn" data-format="gif">GIF</button>
      </div>
      <div class="quality-section" id="qualitySection" style="display: none;">
        <h4>Quality Settings</h4>
        <div class="quality-control">
          <label for="qualitySlider">Quality: <span id="qualityValue">90</span>%</label>
          <input type="range" id="qualitySlider" min="10" max="100" value="90">
        </div>
      </div>
      <div class="size-section" id="sizeSection" style="display: none;">
        <h4>ICO Size</h4>
        <div class="size-grid">
          <button class="size-btn active" data-size="16">16x16</button>
          <button class="size-btn" data-size="32">32x32</button>
          <button class="size-btn" data-size="48">48x48</button>
          <button class="size-btn" data-size="64">64x64</button>
          <button class="size-btn" data-size="128">128x128</button>
          <button class="size-btn" data-size="256">256x256</button>
        </div>
      </div>
    </div>
    <div class="conversion-controls">
      <button class="convert-btn" id="convertBtn" disabled>Select Format to Convert</button>
      <button class="clear-btn" id="clearBtn">Clear Image</button>
    </div>
  </div>

  <div class="download-section" id="downloadSection" style="display: none;">
    <div class="success-message">
      <div class="success-icon">✅</div>
      <h3>Conversion Complete!</h3>
      <p>Your image has been successfully converted</p>
      <button class="download-btn" id="downloadBtn">Download Converted Image</button>
      <button class="new-convert-btn" id="newConvertBtn">Convert Another Image</button>
    </div>
  </div>

  <div class="features-section">
    <h2>Features</h2>
    <div class="features-grid">
      <div class="feature">
        <div class="feature-icon">🔒</div>
        <h3>100% Secure</h3>
        <p>Images are processed locally and never uploaded to our servers</p>
      </div>
      <div class="feature">
        <div class="feature-icon">⚡</div>
        <h3>Fast Conversion</h3>
        <p>Convert images instantly in your browser</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📱</div>
        <h3>All Devices</h3>
        <p>Works on desktop, tablet, and mobile devices</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🎨</div>
        <h3>High Quality</h3>
        <p>Maintain image quality with customizable settings</p>
      </div>
    </div>
  </div>

  <div class="supported-formats">
    <h2>Supported Formats</h2>
    <div class="format-list">
      <div class="format-item">
        <h3>PNG</h3>
        <p>Portable Network Graphics - Best for images with transparency</p>
      </div>
      <div class="format-item">
        <h3>JPG/JPEG</h3>
        <p>Joint Photographic Experts Group - Best for photographs</p>
      </div>
      <div class="format-item">
        <h3>ICO</h3>
        <p>Icon format - Perfect for website favicons and desktop icons</p>
      </div>
      <div class="format-item">
        <h3>WebP</h3>
        <p>Modern web format - Smaller file sizes with good quality</p>
      </div>
      <div class="format-item">
        <h3>BMP</h3>
        <p>Bitmap - Uncompressed format for maximum quality</p>
      </div>
      <div class="format-item">
        <h3>GIF</h3>
        <p>Graphics Interchange Format - Good for simple graphics and animations</p>
      </div>
    </div>
  </div>
</div>

<script>
let selectedFile = null;
let convertedImage = null;
let selectedFormat = null;
let selectedQuality = 90;
let selectedSize = 32;

document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
});

function setupEventListeners() {
  const fileInput = document.getElementById('fileInput');
  const uploadArea = document.getElementById('uploadArea');
  
  fileInput.addEventListener('change', handleFileSelect);
  
  // Make upload area clickable
  uploadArea.addEventListener('click', () => fileInput.click());
  
  // Format buttons
  document.querySelectorAll('.format-btn').forEach(btn => {
    btn.addEventListener('click', () => selectFormat(btn.dataset.format));
  });
  
  // Size buttons for ICO
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => selectSize(btn.dataset.size));
  });
  
  // Quality slider
  const qualitySlider = document.getElementById('qualitySlider');
  qualitySlider.addEventListener('input', (e) => {
    selectedQuality = e.target.value;
    document.getElementById('qualityValue').textContent = selectedQuality;
  });
  
  // Control buttons
  document.getElementById('convertBtn').addEventListener('click', convertImage);
  document.getElementById('clearBtn').addEventListener('click', clearImage);
  document.getElementById('downloadBtn').addEventListener('click', downloadImage);
  document.getElementById('newConvertBtn').addEventListener('click', startNewConversion);
  
  // Drag and drop
  setupDragAndDrop();
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    showMessage('Please select an image file only.', 'error');
    return;
  }
  
  if (file.size > 50 * 1024 * 1024) {
    showMessage('File size must be less than 50MB.', 'error');
    return;
  }
  
  selectedFile = file;
  displayImage();
}

function displayImage() {
  const fileInfo = document.getElementById('fileInfo');
  const fileDetails = document.getElementById('fileDetails');
  const imagePreview = document.getElementById('imagePreview');
  
  if (!selectedFile) {
    fileInfo.style.display = 'none';
    return;
  }
  
  fileInfo.style.display = 'block';
  
  // Display file details
  fileDetails.innerHTML = `
    <div class="file-item">
      <div class="file-info">
        <div class="file-icon">🖼️</div>
        <div class="file-details">
          <h4>${selectedFile.name}</h4>
          <p>${(selectedFile.size / 1024 / 1024).toFixed(2)} MB | ${selectedFile.type}</p>
        </div>
      </div>
    </div>
  `;
  
  // Show image preview
  const reader = new FileReader();
  reader.onload = function(e) {
    imagePreview.src = e.target.result;
  };
  reader.readAsDataURL(selectedFile);
}

function selectFormat(format) {
  selectedFormat = format;
  
  // Update button states
  document.querySelectorAll('.format-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Show/hide quality section
  const qualitySection = document.getElementById('qualitySection');
  const sizeSection = document.getElementById('sizeSection');
  
  if (['jpg', 'jpeg', 'webp'].includes(format)) {
    qualitySection.style.display = 'block';
  } else {
    qualitySection.style.display = 'none';
  }
  
  if (format === 'ico') {
    sizeSection.style.display = 'block';
  } else {
    sizeSection.style.display = 'none';
  }
  
  // Enable convert button
  const convertBtn = document.getElementById('convertBtn');
  convertBtn.disabled = false;
  convertBtn.textContent = `Convert to ${format.toUpperCase()}`;
}

function selectSize(size) {
  selectedSize = parseInt(size);
  
  // Update button states
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
}

function convertImage() {
  if (!selectedFile || !selectedFormat) {
    showMessage('Please select a file and format first.', 'error');
    return;
  }
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  img.onload = function() {
    // Set canvas size based on format
    if (selectedFormat === 'ico') {
      canvas.width = selectedSize;
      canvas.height = selectedSize;
    } else {
      canvas.width = img.width;
      canvas.height = img.height;
    }
    
    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Convert to desired format
    let mimeType;
    let quality = selectedQuality / 100;
    
    switch (selectedFormat) {
      case 'png':
        mimeType = 'image/png';
        break;
      case 'jpg':
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'webp':
        mimeType = 'image/webp';
        break;
      case 'bmp':
        mimeType = 'image/bmp';
        break;
      case 'ico':
        mimeType = 'image/png'; // ICO will be handled as PNG
        break;
      case 'gif':
        mimeType = 'image/gif';
        break;
      default:
        mimeType = 'image/png';
    }
    
    // Convert canvas to blob
    canvas.toBlob(function(blob) {
      convertedImage = blob;
      showDownloadSection();
      showMessage('Image converted successfully!', 'success');
    }, mimeType, quality);
  };
  
  img.onerror = function() {
    showMessage('Error loading image. Please try another file.', 'error');
  };
  
  // Load image
  const reader = new FileReader();
  reader.onload = function(e) {
    img.src = e.target.result;
  };
  reader.readAsDataURL(selectedFile);
}

function downloadImage() {
  if (!convertedImage) {
    showMessage('No converted image available.', 'error');
    return;
  }
  
  const url = URL.createObjectURL(convertedImage);
  const link = document.createElement('a');
  link.href = url;
  
  const originalName = selectedFile.name.replace(/\.[^/.]+$/, '');
  link.download = `${originalName}.${selectedFormat}`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  showMessage('Image downloaded successfully!', 'success');
}

function clearImage() {
  selectedFile = null;
  convertedImage = null;
  selectedFormat = null;
  
  document.getElementById('fileInfo').style.display = 'none';
  document.getElementById('downloadSection').style.display = 'none';
  document.getElementById('fileInput').value = '';
  
  // Reset format buttons
  document.querySelectorAll('.format-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const convertBtn = document.getElementById('convertBtn');
  convertBtn.disabled = true;
  convertBtn.textContent = 'Select Format to Convert';
}

function showDownloadSection() {
  document.getElementById('fileInfo').style.display = 'none';
  document.getElementById('downloadSection').style.display = 'block';
}

function startNewConversion() {
  clearImage();
  showMessage('Ready for new conversion!', 'success');
}

function setupDragAndDrop() {
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
      if (file.type.startsWith('image/')) {
        if (file.size > 50 * 1024 * 1024) {
          showMessage('File size must be less than 50MB.', 'error');
          return;
        }
        selectedFile = file;
        displayImage();
      } else {
        showMessage('Please select an image file only.', 'error');
      }
    }
  });
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
</script>

<style>
.tool-container {
  max-width: 1000px;
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
  border: 2px dashed #667eea;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #764ba2;
  background: #f0f2ff;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #667eea;
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
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background: #764ba2;
  transform: translateY(-2px);
}

.file-info {
  margin-bottom: 40px;
}

.file-info h3 {
  margin-bottom: 20px;
  color: #333;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.file-icon {
  font-size: 2rem;
}

.file-details h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.file-details p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.preview-section {
  margin-bottom: 30px;
  text-align: center;
}

.preview-section h4 {
  margin-bottom: 15px;
  color: #333;
}

.conversion-options {
  margin-bottom: 30px;
}

.conversion-options h4 {
  margin-bottom: 15px;
  color: #333;
}

.format-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.format-btn {
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.format-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.format-btn.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.quality-section, .size-section {
  margin-top: 20px;
}

.quality-control {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quality-control label {
  font-weight: 500;
  color: #333;
}

.quality-control input[type="range"] {
  width: 100%;
}

.size-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
}

.size-btn {
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.size-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.size-btn.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.conversion-controls {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.convert-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.convert-btn:hover:not(:disabled) {
  background: #764ba2;
  transform: translateY(-2px);
}

.convert-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.clear-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #495057;
}

.download-section {
  text-align: center;
  margin-bottom: 40px;
}

.success-message {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 12px;
  padding: 40px;
  color: #155724;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.success-message h3 {
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.download-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 20px;
  margin-right: 10px;
  transition: all 0.3s ease;
}

.download-btn:hover {
  background: #218838;
  transform: translateY(-2px);
}

.new-convert-btn {
  background: #17a2b8;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
}

.new-convert-btn:hover {
  background: #138496;
  transform: translateY(-2px);
}

.features-section,
.supported-formats {
  margin-bottom: 60px;
}

.features-section h2,
.supported-formats h2 {
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

.format-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.format-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.format-item h3 {
  color: #667eea;
  margin-bottom: 10px;
}

.format-item p {
  color: #666;
  line-height: 1.6;
  margin: 0;
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
    padding: 30px 15px;
  }
  
  .conversion-controls {
    flex-direction: column;
  }
  
  .features-grid,
  .format-list {
    grid-template-columns: 1fr;
  }
  
  .format-grid {
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  }
  
  .download-btn,
  .new-convert-btn {
    display: block;
    width: 100%;
    margin: 10px 0;
  }
}
</style>
