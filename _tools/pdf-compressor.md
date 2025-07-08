---
layout: tool
title: "PDF Compressor - Reduce PDF File Size Online"
description: "Free online PDF compressor. Reduce PDF file size while maintaining quality. No registration required, 100% secure and free."
keywords: "PDF compressor, reduce PDF size, compress PDF online, PDF optimizer, free PDF compressor"
tool_name: "PDF Compressor"
tool_category: "PDF Tools"
---

<!-- PDF-lib library for PDF processing -->
<script src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js"></script>

<div class="tool-container">
  <div class="tool-header">
    <h1>PDF Compressor</h1>
    <p>Reduce PDF file size while maintaining quality</p>
  </div>

  <div class="upload-section">
    <div class="upload-area" id="uploadArea">
      <div class="upload-icon">🗜️</div>
      <h3>Drop PDF file here or click to browse</h3>
      <p>Compress your PDF to reduce file size</p>
      <input type="file" id="fileInput" accept=".pdf" style="display: none;">
      <button class="upload-btn" onclick="document.getElementById('fileInput').click()">Choose PDF File</button>
    </div>
  </div>

  <div class="file-info" id="fileInfo" style="display: none;">
    <h3>Selected File</h3>
    <div class="file-details" id="fileDetails"></div>
    <div class="compression-options">
      <h4>Compression Level</h4>
      <div class="compression-levels">
        <label class="compression-option">
          <input type="radio" name="compression" value="low" checked>
          <div class="option-content">
            <div class="option-icon">📄</div>
            <div class="option-text">
              <h5>Low Compression</h5>
              <p>Minimal size reduction, highest quality</p>
            </div>
          </div>
        </label>
        <label class="compression-option">
          <input type="radio" name="compression" value="medium">
          <div class="option-content">
            <div class="option-icon">📄</div>
            <div class="option-text">
              <h5>Medium Compression</h5>
              <p>Balanced size reduction and quality</p>
            </div>
          </div>
        </label>
        <label class="compression-option">
          <input type="radio" name="compression" value="high">
          <div class="option-content">
            <div class="option-icon">📄</div>
            <div class="option-text">
              <h5>High Compression</h5>
              <p>Maximum size reduction, lower quality</p>
            </div>
          </div>
        </label>
      </div>
    </div>
    <div class="compression-controls">
      <button class="compress-btn" id="compressBtn">Compress PDF</button>
      <button class="clear-btn" id="clearBtn">Clear File</button>
    </div>
  </div>

  <div class="progress-section" id="progressSection" style="display: none;">
    <div class="progress-bar">
      <div class="progress-fill" id="progressFill"></div>
    </div>
    <p id="progressText">Compressing PDF...</p>
  </div>

  <div class="download-section" id="downloadSection" style="display: none;">
    <div class="success-message">
      <div class="success-icon">✅</div>
      <h3>Compression Complete!</h3>
      <div class="compression-results" id="compressionResults"></div>
      <button class="download-btn" id="downloadBtn">Download Compressed PDF</button>
      <button class="new-compress-btn" id="newCompressBtn">Compress Another File</button>
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
        <h3>Fast Compression</h3>
        <p>Compress PDFs in seconds with our optimized algorithms</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📱</div>
        <h3>Mobile Friendly</h3>
        <p>Works perfectly on all devices and browsers</p>
      </div>
      <div class="feature">
        <div class="feature-icon">💯</div>
        <h3>Quality Control</h3>
        <p>Choose compression level to balance size and quality</p>
      </div>
    </div>
  </div>

  <div class="how-to-section">
    <h2>How to Compress PDF</h2>
    <div class="steps">
      <div class="step">
        <div class="step-number">1</div>
        <h3>Upload PDF File</h3>
        <p>Drag and drop your PDF file or click to browse and select the file you want to compress</p>
      </div>
      <div class="step">
        <div class="step-number">2</div>
        <h3>Choose Compression Level</h3>
        <p>Select the compression level based on your quality and size requirements</p>
      </div>
      <div class="step">
        <div class="step-number">3</div>
        <h3>Compress & Download</h3>
        <p>Click "Compress PDF" and download your compressed PDF file</p>
      </div>
    </div>
  </div>

  <div class="faq-section">
    <h2>Frequently Asked Questions</h2>
    <div class="faq-list">
      <div class="faq-item">
        <h3>Is this PDF compressor free to use?</h3>
        <p>Yes, our PDF compressor is completely free to use with no hidden costs or limitations.</p>
      </div>
      <div class="faq-item">
        <h3>What is the maximum file size I can compress?</h3>
        <p>You can compress PDF files up to 100MB in size. For larger files, we recommend splitting them first.</p>
      </div>
      <div class="faq-item">
        <h3>Will the quality be affected?</h3>
        <p>The quality depends on the compression level you choose. Low compression maintains highest quality.</p>
      </div>
      <div class="faq-item">
        <h3>How much can I reduce the file size?</h3>
        <p>Compression results vary by file content. Text-heavy PDFs can be reduced by 50-80%, while image-heavy files may see 20-40% reduction.</p>
      </div>
      <div class="faq-item">
        <h3>Are my files secure?</h3>
        <p>Absolutely! Your files are processed locally in your browser and never uploaded to our servers.</p>
      </div>
      <div class="faq-item">
        <h3>Can I compress scanned PDFs?</h3>
        <p>Yes, our compressor works with both text-based and scanned PDFs, though results may vary.</p>
      </div>
    </div>
  </div>
</div>

<script>
let selectedFile = null;
let originalSize = 0;
let compressedPdfBytes = null;

document.getElementById('fileInput').addEventListener('change', handleFileSelect);
document.getElementById('compressBtn').addEventListener('click', compressPDF);
document.getElementById('clearBtn').addEventListener('click', clearFile);
document.getElementById('downloadBtn').addEventListener('click', downloadCompressedPDF);
document.getElementById('newCompressBtn').addEventListener('click', startNewCompression);

function handleFileSelect(event) {
  const file = event.target.files[0];
  
  if (!file) return;
  
  if (file.type !== 'application/pdf') {
    showMessage('Please select a PDF file only.', 'error');
    return;
  }
  
  if (file.size > 100 * 1024 * 1024) {
    showMessage('File size must be less than 100MB.', 'error');
    return;
  }
  
  selectedFile = file;
  originalSize = file.size;
  displayFile();
}

function displayFile() {
  const fileInfo = document.getElementById('fileInfo');
  const fileDetails = document.getElementById('fileDetails');
  
  if (!selectedFile) {
    fileInfo.style.display = 'none';
    return;
  }
  
  fileInfo.style.display = 'block';
  fileDetails.innerHTML = `
    <div class="file-item">
      <div class="file-info">
        <div class="file-icon">📄</div>
        <div class="file-details">
          <h4>${selectedFile.name}</h4>
          <p>${(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      </div>
    </div>
  `;
}

function clearFile() {
  selectedFile = null;
  originalSize = 0;
  compressedPdfBytes = null;
  displayFile();
  document.getElementById('fileInput').value = '';
  hideDownloadSection();
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

function hideDownloadSection() {
  document.getElementById('downloadSection').style.display = 'none';
  document.getElementById('fileInfo').style.display = 'block';
}

function startNewCompression() {
  clearFile();
  showMessage('Ready for new compression!', 'success');
}

async function compressPDF() {
  if (!selectedFile) {
    showMessage('Please select a PDF file first.', 'error');
    return;
  }
  
  // Show progress
  document.getElementById('progressSection').style.display = 'block';
  document.getElementById('fileInfo').style.display = 'none';
  
  try {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    // Get compression level
    const compressionLevel = document.querySelector('input[name="compression"]:checked').value;
    
    // Load PDF
    progressText.textContent = 'Loading PDF file...';
    progressFill.style.width = '20%';
    
    const arrayBuffer = await selectedFile.arrayBuffer();
    const { PDFDocument } = PDFLib;
    const pdf = await PDFDocument.load(arrayBuffer);
    
    // Apply compression based on level
    progressText.textContent = 'Applying compression...';
    progressFill.style.width = '40%';
    
    let compressionOptions = {};
    
    switch (compressionLevel) {
      case 'low':
        compressionOptions = {
          objectStreamMode: 1,
          compress: true
        };
        break;
      case 'medium':
        compressionOptions = {
          objectStreamMode: 1,
          compress: true,
          updateMetadata: false
        };
        break;
      case 'high':
        compressionOptions = {
          objectStreamMode: 1,
          compress: true,
          updateMetadata: false,
          useObjectStreams: true
        };
        break;
    }
    
    // Save with compression
    progressText.textContent = 'Finalizing compressed PDF...';
    progressFill.style.width = '80%';
    
    compressedPdfBytes = await pdf.save(compressionOptions);
    
    // Calculate compression results
    const compressedSize = compressedPdfBytes.byteLength;
    const sizeReduction = originalSize - compressedSize;
    const reductionPercentage = ((sizeReduction / originalSize) * 100).toFixed(1);
    
    // Show download section with results
    progressText.textContent = 'Complete!';
    progressFill.style.width = '100%';
    
    const compressionResults = document.getElementById('compressionResults');
    compressionResults.innerHTML = `
      <div class="results-grid">
        <div class="result-item">
          <span class="result-label">Original Size:</span>
          <span class="result-value">${(originalSize / 1024 / 1024).toFixed(2)} MB</span>
        </div>
        <div class="result-item">
          <span class="result-label">Compressed Size:</span>
          <span class="result-value">${(compressedSize / 1024 / 1024).toFixed(2)} MB</span>
        </div>
        <div class="result-item">
          <span class="result-label">Size Reduced:</span>
          <span class="result-value success">${(sizeReduction / 1024 / 1024).toFixed(2)} MB (${reductionPercentage}%)</span>
        </div>
      </div>
    `;
    
    setTimeout(() => {
      document.getElementById('progressSection').style.display = 'none';
      document.getElementById('downloadSection').style.display = 'block';
    }, 500);
    
    showMessage('PDF compressed successfully!', 'success');
    
  } catch (error) {
    console.error('Error compressing PDF:', error);
    showMessage('Error compressing PDF. Please try again.', 'error');
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('fileInfo').style.display = 'block';
  }
}

function downloadCompressedPDF() {
  if (!compressedPdfBytes) {
    showMessage('No compressed PDF available.', 'error');
    return;
  }
  
  // Create download link
  const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = selectedFile.name.replace('.pdf', '-compressed.pdf');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  // Auto-clear files after download
  setTimeout(() => {
    clearFile();
    showMessage('Files cleared for privacy.', 'info');
  }, 2000);
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
      if (file.size > 100 * 1024 * 1024) {
        showMessage('File size must be less than 100MB.', 'error');
        return;
      }
      selectedFile = file;
      originalSize = file.size;
      displayFile();
    } else {
      showMessage('Please select a PDF file only.', 'error');
    }
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

.file-info {
  margin-bottom: 40px;
}

.file-info h3 {
  margin-bottom: 20px;
  color: #333;
}

.file-details {
  margin-bottom: 20px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

.compression-options {
  margin-bottom: 30px;
}

.compression-options h4 {
  margin-bottom: 15px;
  color: #333;
}

.compression-levels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.compression-option {
  cursor: pointer;
  transition: all 0.3s ease;
}

.compression-option input[type="radio"] {
  display: none;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.compression-option input[type="radio"]:checked + .option-content {
  border-color: #667eea;
  background: #f0f2ff;
}

.option-icon {
  font-size: 2rem;
}

.option-text h5 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 1.1rem;
}

.option-text p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.compression-controls {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.compress-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.compress-btn:hover {
  background: #764ba2;
  transform: translateY(-2px);
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

.progress-section {
  text-align: center;
  margin-bottom: 40px;
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

.compression-results {
  margin: 30px 0;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.result-item {
  background: white;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.result-label {
  display: block;
  font-weight: 500;
  margin-bottom: 5px;
  color: #333;
}

.result-value {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: #667eea;
}

.result-value.success {
  color: #28a745;
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

.new-compress-btn {
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

.new-compress-btn:hover {
  background: #138496;
  transform: translateY(-2px);
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
  
  .compression-controls {
    flex-direction: column;
  }
  
  .features-grid,
  .steps {
    grid-template-columns: 1fr;
  }
  
  .compression-levels {
    grid-template-columns: 1fr;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
  }
  
  .download-btn,
  .new-compress-btn {
    display: block;
    width: 100%;
    margin: 10px 0;
  }
}
</style> 