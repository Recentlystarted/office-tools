---
layout: tool
title: "PDF to Word Converter - Convert PDF to Editable Word Document"
description: "Free online PDF to Word converter. Convert PDF files to editable Word documents easily. No registration required, 100% secure and free."
keywords: "PDF to Word, PDF converter, convert PDF to Word, PDF to DOCX, free PDF converter"
tool_name: "PDF to Word Converter"
tool_category: "PDF Tools"
---

<!-- PDF to Word Converter using API -->
<script>
console.log('PDF to Word API converter initialized');
</script>

<div class="max-w-4xl mx-auto px-4 py-8">
  <div class="text-center mb-8">
    <h1 class="text-3xl md:text-4xl font-bold text-foreground mb-4">PDF to Word Converter</h1>
    <p class="text-lg text-muted-foreground max-w-2xl mx-auto">Convert PDF files to editable Word documents easily and securely</p>
  </div>

  <div class="mb-8">
    <div class="upload-area" id="uploadArea">
      <div class="text-6xl mb-4">📝</div>
      <h3 class="text-xl font-semibold text-foreground mb-2">Drop PDF file here or click to browse</h3>
      <p class="text-muted-foreground mb-6">Convert your PDF to editable Word document</p>
      <input type="file" id="fileInput" accept=".pdf" class="hidden">
      <button class="btn btn-primary btn-lg" onclick="document.getElementById('fileInput').click()">Choose PDF File</button>
    </div>
  </div>

  <div class="file-info" id="fileInfo" style="display: none;">
    <h3>Selected File</h3>
    <div class="file-details" id="fileDetails"></div>
    <div class="conversion-controls">
      <button class="convert-btn" id="convertBtn">Convert to Word</button>
      <button class="clear-btn" id="clearBtn">Clear File</button>
    </div>
  </div>

  <div class="progress-section" id="progressSection" style="display: none;">
    <div class="progress-bar">
      <div class="progress-fill" id="progressFill"></div>
    </div>
    <p id="progressText">Converting PDF to Word...</p>
    <div class="progress-details" id="progressDetails" style="display: none;">
      <p class="progress-note">⏱️ Complex PDFs (like bank statements) may take 5-10 minutes to process</p>
      <p class="progress-tip">💡 Tip: Simpler PDFs with just text convert much faster</p>
    </div>
  </div>

  <div class="download-section" id="downloadSection" style="display: none;">
    <div class="success-message">
      <div class="success-icon">✅</div>
      <h3>Conversion Complete!</h3>
      <p>Your PDF has been successfully converted to Word format</p>
      <button class="download-btn" id="downloadBtn">Download Word Document</button>
      <button class="new-convert-btn" id="newConvertBtn">Convert Another File</button>
    </div>
  </div>

  <div class="features-section">
    <h2>Features</h2>
    <div class="features-grid">
      <div class="feature">
        <div class="feature-icon">🔒</div>
        <h3>100% Secure</h3>
        <p>Professional API with secure file handling and automatic cleanup</p>
      </div>
      <div class="feature">
        <div class="feature-icon">⚡</div>
        <h3>Fast Conversion</h3>
        <p>Server-side processing with professional pdf2docx library</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📱</div>
        <h3>Mobile Friendly</h3>
        <p>Works perfectly on all devices and browsers</p>
      </div>
      <div class="feature">
        <div class="feature-icon">💯</div>
        <h3>High Quality</h3>
        <p>Professional DOCX output with images, tables, and formatting preserved</p>
      </div>
    </div>
  </div>

  <div class="how-to-section">
    <h2>How to Convert PDF to Word</h2>
    <div class="steps">
      <div class="step">
        <div class="step-number">1</div>
        <h3>Upload PDF File</h3>
        <p>Drag and drop your PDF file or click to browse and select the file you want to convert</p>
      </div>
      <div class="step">
        <div class="step-number">2</div>
        <h3>Convert & Download</h3>
        <p>Click "Convert to Word" and download your high-quality DOCX document</p>
      </div>
    </div>
  </div>

  <div class="faq-section">
    <h2>Frequently Asked Questions</h2>
    <div class="faq-list">
      <div class="faq-item">
        <h3>Is this PDF to Word converter free to use?</h3>
        <p>Yes, our PDF to Word converter is completely free to use with no hidden costs or limitations.</p>
      </div>        <div class="faq-item">
          <h3>What is the maximum file size I can convert?</h3>
          <p>You can convert PDF files up to 50MB in size using our enhanced API. For larger files, we recommend splitting them first or using our async conversion feature for files up to 100MB.</p>
        </div>
      <div class="faq-item">
        <h3>Will the formatting be preserved?</h3>
        <p>Yes, our converter maintains the original formatting, fonts, and layout as much as possible.</p>
      </div>
      <div class="faq-item">
        <h3>What Word format will I get?</h3>
        <p>You'll receive a .docx file that's compatible with Microsoft Word, Google Docs, and other word processors.</p>
      </div>
      <div class="faq-item">
        <h3>Are my files secure?</h3>
        <p>Yes! Files are processed on our secure server and automatically deleted after conversion. We never store or access your documents.</p>
      </div>
      <div class="faq-item">
        <h3>Can I convert scanned PDFs?</h3>
        <p>Yes, our converter can handle both text-based and scanned PDFs using OCR technology.</p>
      </div>
    </div>
  </div>
</div>

<script>
let selectedFile = null;
let convertedDoc = null;

// Initialize when DOM is ready - API-based approach (no PDF.js needed)
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing PDF to Word converter with API...');
  
  // Setup file input immediately
  setupFileInput();
  
  // Initialize buttons immediately
  initializeButtons();
});

function setupFileInput() {
  console.log('Setting up file input...');
  const fileInput = document.getElementById('fileInput');
  const uploadArea = document.getElementById('uploadArea');
  
  if (fileInput) {
    fileInput.addEventListener('change', handleFileSelect);
    console.log('File input listener added');
  } else {
    console.error('File input not found');
  }
  
  if (uploadArea) {
    // Make upload area clickable
    uploadArea.addEventListener('click', () => {
      if (fileInput) fileInput.click();
    });
  }
}

function handleFileSelect(event) {
  console.log('File selected, processing...');
  const file = event.target.files[0];
  
  if (!file) {
    console.log('No file selected');
    return;
  }
  
  console.log('File details:', {
    name: file.name,
    type: file.type,
    size: file.size
  });
  
  if (file.type !== 'application/pdf') {
    showMessage('Please select a PDF file only.', 'error');
    return;
  }
  
  if (file.size > 50 * 1024 * 1024) {
    showMessage('File size must be less than 50MB.', 'error');
    return;
  }
  
  selectedFile = file;
  console.log('File accepted, displaying file info...');
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
  convertedDoc = null;
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

function startNewConversion() {
  clearFile();
  showMessage('Ready for new conversion!', 'success');
}

async function convertPDF() {
  if (!selectedFile) {
    showMessage('Please select a PDF file first.', 'error');
    return;
  }
  
  // Check file size and determine conversion method
  const fileSize = selectedFile.size;
  const isLargeFile = fileSize > 20 * 1024 * 1024; // 20MB threshold for async
  const isComplexFile = selectedFile.name.toLowerCase().includes('bank') || 
                       selectedFile.name.toLowerCase().includes('statement') ||
                       fileSize > 10 * 1024 * 1024; // 10MB+ likely complex
  
  if (fileSize > 50 * 1024 * 1024) {
    showMessage('File too large. Maximum size is 50MB. Please compress your PDF first.', 'error');
    return;
  }
  
  // Show warning for complex files
  if (isComplexFile && !isLargeFile) {
    const proceed = confirm('This appears to be a complex PDF (like a bank statement). Conversion may take 5-10 minutes. Do you want to proceed?');
    if (!proceed) {
      return;
    }
  }
  
  // Show progress
  document.getElementById('progressSection').style.display = 'block';
  document.getElementById('fileInfo').style.display = 'none';
  
  // Show additional info for complex files
  if (isComplexFile) {
    document.getElementById('progressDetails').style.display = 'block';
  }
  
  try {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    // Prepare form data for API
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    if (isLargeFile) {
      // Use async conversion for large files
      showMessage('Large file detected. Using async conversion...', 'info');
      await convertPDFAsync(formData, progressFill, progressText);
    } else {
      // Use regular conversion with extended timeout for complex files
      await convertPDFSync(formData, progressFill, progressText);
    }
    
  } catch (error) {
    console.error('Error converting PDF:', error);
    showMessage('Error converting PDF: ' + error.message, 'error');
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('fileInfo').style.display = 'block';
  }
}

async function convertPDFSync(formData, progressFill, progressText) {
  // Upload to API
  progressText.textContent = 'Uploading PDF to server...';
  progressFill.style.width = '10%';
  
  progressText.textContent = 'Processing with enhanced API...';
  progressFill.style.width = '30%';
  
  // Create AbortController for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 10 * 60 * 1000); // 10 minutes timeout for complex PDFs
  
  // Handle abort
  controller.signal.addEventListener('abort', () => {
    clearTimeout(timeoutId);
    throw new Error('Processing was cancelled or timed out. Complex PDFs may require up to 10 minutes.');
  });
  
  // Call the enhanced modular API with fallback to legacy
  let response;
  try {
    response = await fetch('https://api.tundasportsclub.com/api/pdf/convert', {
      method: 'POST',
      body: formData,
      mode: 'cors',
      credentials: 'omit',
      signal: controller.signal,
      headers: {
        'Accept': 'application/octet-stream, application/json'
      }
    });
    clearTimeout(timeoutId);
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Conversion timed out. This appears to be a complex PDF that requires more processing time. Please try with a simpler PDF or contact support.');
    }
    
    // Fallback to legacy endpoint if modular fails
    console.log('Trying legacy endpoint...');
    const fallbackController = new AbortController();
    const fallbackTimeoutId = setTimeout(() => {
      fallbackController.abort();
    }, 10 * 60 * 1000);
    
    try {
      response = await fetch('https://api.tundasportsclub.com/convert', {
        method: 'POST',
        body: formData,
        mode: 'cors',
        credentials: 'omit',
        signal: fallbackController.signal,
        headers: {
          'Accept': 'application/octet-stream, application/json'
        }
      });
      clearTimeout(fallbackTimeoutId);
    } catch (fallbackError) {
      clearTimeout(fallbackTimeoutId);
      
      if (fallbackError.name === 'AbortError') {
        throw new Error('Conversion timed out. This PDF appears to be very complex. Please try with a simpler PDF.');
      }
      
      throw new Error('Unable to connect to conversion server. Please check your internet connection and try again. If the issue persists, the PDF might be too complex for processing.');
    }
  }
  
  progressText.textContent = 'Converting to Word format...';
  progressFill.style.width = '70%';
  
  if (!response.ok) {
    let errorMessage = 'Conversion failed';
    try {
      // Try to get JSON error message
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      // If JSON parsing fails, provide specific error based on status
      if (response.status === 500) {
        errorMessage = 'Server error during conversion. This might be due to a complex PDF structure (like bank statements with tables). Please try a simpler PDF or contact support.';
      } else if (response.status === 413) {
        errorMessage = 'File too large. Please use a smaller PDF file.';
      } else if (response.status === 400) {
        errorMessage = 'Invalid PDF file. Please check your file and try again.';
      } else if (response.status === 502 || response.status === 503) {
        errorMessage = 'Server temporarily unavailable. Please try again in a few minutes.';
      } else if (response.status === 504) {
        errorMessage = 'Request timed out. This PDF might be too complex. Please try with a simpler document.';
      } else {
        errorMessage = `Server error: ${response.status}. Please try again later.`;
      }
    }
    throw new Error(errorMessage);
  }
  
  progressText.textContent = 'Finalizing conversion...';
  progressFill.style.width = '90%';
  
  // Get the converted file
  const blob = await response.blob();
  convertedDoc = blob;
  
  progressText.textContent = 'Conversion complete!';
  progressFill.style.width = '100%';
  
  // Clear timeout since we completed successfully
  clearTimeout(timeoutId);
  
  // Show download section
  setTimeout(() => {
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('downloadSection').style.display = 'block';
  }, 500);
}

async function convertPDFAsync(formData, progressFill, progressText) {
  // Start async conversion
  progressText.textContent = 'Starting async conversion for large file...';
  progressFill.style.width = '10%';
  
  // Submit for async processing
  let response = await fetch('https://api.tundasportsclub.com/api/pdf/convert-async', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('Failed to start async conversion');
  }
  
  const { job_id } = await response.json();
  
  progressText.textContent = 'Processing large file... This may take a few minutes.';
  progressFill.style.width = '30%';
  
  // Poll for status
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes max
  
  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    
    const statusResponse = await fetch(`https://api.tundasportsclub.com/api/pdf/status/${job_id}`);
    const statusData = await statusResponse.json();
    
    if (statusData.status === 'completed') {
      progressText.textContent = 'Downloading converted file...';
      progressFill.style.width = '90%';
      
      // Download the result
      const downloadResponse = await fetch(`https://api.tundasportsclub.com/api/pdf/download/${job_id}`);
      convertedDoc = await downloadResponse.blob();
      
      progressText.textContent = 'Conversion complete!';
      progressFill.style.width = '100%';
      
      setTimeout(() => {
        document.getElementById('progressSection').style.display = 'none';
        document.getElementById('downloadSection').style.display = 'block';
      }, 500);
      return;
      
    } else if (statusData.status === 'failed') {
      throw new Error(statusData.error || 'Conversion failed');
    }
    
    // Update progress
    const progress = Math.min(30 + (attempts * 1.5), 80);
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Processing... (${Math.round(progress)}%)`;
    
    attempts++;
  }
  
  throw new Error('Conversion timed out. Please try again with a smaller file.');
}

function initializeButtons() {
  console.log('Initializing buttons...');
  const convertBtn = document.getElementById('convertBtn');
  const clearBtn = document.getElementById('clearBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const newConvertBtn = document.getElementById('newConvertBtn');
  
  if (convertBtn) convertBtn.addEventListener('click', convertPDF);
  if (clearBtn) clearBtn.addEventListener('click', clearFile);
  if (downloadBtn) downloadBtn.addEventListener('click', downloadWord);
  if (newConvertBtn) newConvertBtn.addEventListener('click', startNewConversion);
  
  // Setup drag and drop functionality
  setupDragAndDrop();
  
  console.log('All button event listeners setup complete!');
}

function setupDragAndDrop() {
  const uploadArea = document.getElementById('uploadArea');
  
  if (!uploadArea) {
    console.error('Upload area not found');
    return;
  }

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
        selectedFile = file;
        displayFile();
      } else {
        showMessage('Please select a PDF file only.', 'error');
      }
    }
  });
}

function downloadWord() {
  if (!convertedDoc) {
    showMessage('No converted document available.', 'error');
    return;
  }
  
  // Create download link
  const url = URL.createObjectURL(convertedDoc);
  const link = document.createElement('a');
  link.href = url;
  
  // Use .docx extension for proper Word format from API
  const originalName = selectedFile.name.replace('.pdf', '');
  link.download = `${originalName}_converted.docx`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  showMessage('Document downloaded successfully!', 'success');
  
  // Optional: Clear files after download for privacy
  setTimeout(() => {
    showMessage('Ready for next conversion. Previous files cleared for privacy.', 'info');
  }, 2000);
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
  border: 2px dashed #667eea !important;
  border-radius: 12px !important;
  padding: 40px 20px !important;
  text-align: center !important;
  background: #f8f9fa !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  margin: 20px 0 !important;
}

.upload-area:hover {
  border-color: #764ba2 !important;
  background: #f0f2ff !important;
}

.upload-icon {
  font-size: 3rem !important;
  margin-bottom: 15px !important;
  color: #667eea !important;
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
  background: #667eea !important;
  color: white !important;
  border: none !important;
  padding: 12px 24px !important;
  border-radius: 25px !important;
  font-size: 1rem !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
}

.upload-btn:hover {
  background: #764ba2 !important;
  transform: translateY(-2px) !important;
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

.conversion-options {
  margin-bottom: 30px;
}

.conversion-options h4 {
  margin-bottom: 15px;
  color: #333;
}

.option-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.option-item:hover {
  background: #e9ecef;
}

.option-item input[type="checkbox"] {
  margin: 0;
}

.option-label {
  font-weight: 500;
  color: #333;
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

.convert-btn:hover {
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
  
  .conversion-controls {
    flex-direction: column;
  }
  
  .features-grid,
  .steps {
    grid-template-columns: 1fr;
  }
  
  .option-group {
    grid-template-columns: 1fr;
  }
  
  .download-btn,
  .new-convert-btn {
    display: block;
    width: 100%;
    margin: 10px 0;
  }
}
</style>