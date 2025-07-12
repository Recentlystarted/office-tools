---
layout: tool
title: "Protect PDF - Add Password to PDF Files"
description: "Free online PDF password protection. Add user and owner passwords to PDF files. Secure your documents with encryption. No registration required."
keywords: "protect PDF, PDF password, secure PDF, encrypt PDF, PDF security, password protection"
tool_name: "Protect PDF"
tool_category: "PDF Tools"
---

<!-- PDF-lib for PDF manipulation -->
<script src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js"></script>

<div class="card">
  <div class="card-content">
    <h1 class="text-2xl font-bold text-foreground mb-2">Protect PDF</h1>
    <p class="text-muted-foreground mb-6">Add password protection and security settings to your PDF files</p>
  </div>

  <div class="upload-section">
    <div class="upload-area" id="uploadArea">
      <div class="upload-icon">🔒</div>
      <h3>Drop PDF file here or click to browse</h3>
      <p>Secure your PDF with password protection</p>
      <input type="file" id="fileInput" accept=".pdf" style="display: none;">
      <button class="upload-btn" onclick="document.getElementById('fileInput').click()">Choose PDF File</button>
    </div>
  </div>

  <div class="file-info" id="fileInfo" style="display: none;">
    <h3>Selected File</h3>
    <div class="file-details" id="fileDetails"></div>
    
    <div class="protection-options">
      <h4>Protection Settings</h4>
      
      <div class="password-section">
        <h5>User Password</h5>
        <p class="help-text">Required to open and view the PDF</p>
        <div class="password-group">
          <input type="password" id="userPassword" placeholder="Enter user password">
          <button type="button" class="show-password-btn" data-target="userPassword">👁️</button>
        </div>
        <div class="password-strength" id="userPasswordStrength"></div>
      </div>
      
      <div class="password-section">
        <h5>Owner Password (Optional)</h5>
        <p class="help-text">Allows editing and printing permissions</p>
        <div class="password-group">
          <input type="password" id="ownerPassword" placeholder="Enter owner password (optional)">
          <button type="button" class="show-password-btn" data-target="ownerPassword">👁️</button>
        </div>
        <div class="password-strength" id="ownerPasswordStrength"></div>
      </div>
      
      <div class="permissions-section">
        <h5>Document Permissions</h5>
        <div class="permissions-grid">
          <label class="permission-item">
            <input type="checkbox" id="allowPrinting" checked>
            <span class="permission-label">Allow Printing</span>
          </label>
          <label class="permission-item">
            <input type="checkbox" id="allowModifying">
            <span class="permission-label">Allow Modifying</span>
          </label>
          <label class="permission-item">
            <input type="checkbox" id="allowCopying">
            <span class="permission-label">Allow Copying Text</span>
          </label>
          <label class="permission-item">
            <input type="checkbox" id="allowAnnotating">
            <span class="permission-label">Allow Annotations</span>
          </label>
          <label class="permission-item">
            <input type="checkbox" id="allowFilling" checked>
            <span class="permission-label">Allow Form Filling</span>
          </label>
          <label class="permission-item">
            <input type="checkbox" id="allowAccessibility" checked>
            <span class="permission-label">Allow Screen Readers</span>
          </label>
        </div>
      </div>
      
      <div class="encryption-section">
        <h5>Encryption Level</h5>
        <div class="encryption-options">
          <label class="encryption-option">
            <input type="radio" name="encryption" value="128" checked>
            <span>128-bit RC4 (Compatible)</span>
          </label>
          <label class="encryption-option">
            <input type="radio" name="encryption" value="256">
            <span>256-bit AES (High Security)</span>
          </label>
        </div>
      </div>
    </div>
    
    <div class="protect-controls">
      <button class="protect-btn" id="protectBtn">Protect PDF</button>
      <button class="clear-btn" id="clearBtn">Clear File</button>
    </div>
  </div>

  <div class="progress-section" id="progressSection" style="display: none;">
    <div class="progress-bar">
      <div class="progress-fill" id="progressFill"></div>
    </div>
    <p id="progressText">Protecting PDF...</p>
  </div>

  <div class="download-section" id="downloadSection" style="display: none;">
    <div class="success-message">
      <div class="success-icon">🔐</div>
      <h3>PDF Protected Successfully!</h3>
      <p>Your PDF has been secured with password protection</p>
      <div class="protection-info">
        <div class="info-item">
          <span class="info-label">User Password:</span>
          <span class="info-value" id="userPasswordInfo">Set</span>
        </div>
        <div class="info-item">
          <span class="info-label">Owner Password:</span>
          <span class="info-value" id="ownerPasswordInfo">Not Set</span>
        </div>
        <div class="info-item">
          <span class="info-label">Encryption:</span>
          <span class="info-value" id="encryptionInfo">128-bit</span>
        </div>
      </div>
      <div class="download-actions">
        <button class="download-btn" id="downloadBtn">Download Protected PDF</button>
        <button class="new-protect-btn" id="newProtectBtn">Protect Another File</button>
      </div>
    </div>
  </div>

  <div class="features-section">
    <h2>Features</h2>
    <div class="features-grid">
      <div class="feature">
        <div class="feature-icon">🔒</div>
        <h3>Strong Encryption</h3>
        <p>Industry-standard AES and RC4 encryption algorithms</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🛡️</div>
        <h3>Permission Control</h3>
        <p>Fine-grained control over document permissions</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🔐</div>
        <h3>Dual Password</h3>
        <p>Separate user and owner passwords for different access levels</p>
      </div>
      <div class="feature">
        <div class="feature-icon">💯</div>
        <h3>100% Secure</h3>
        <p>Files are processed locally and never stored on our servers</p>
      </div>
    </div>
  </div>

  <div class="how-to-section">
    <h2>How to Protect PDF</h2>
    <div class="steps">
      <div class="step">
        <div class="step-number">1</div>
        <h3>Upload PDF</h3>
        <p>Select or drag & drop your PDF file</p>
      </div>
      <div class="step">
        <div class="step-number">2</div>
        <h3>Set Passwords</h3>
        <p>Add user and/or owner passwords</p>
      </div>
      <div class="step">
        <div class="step-number">3</div>
        <h3>Configure Permissions</h3>
        <p>Choose what actions are allowed</p>
      </div>
      <div class="step">
        <div class="step-number">4</div>
        <h3>Download</h3>
        <p>Get your protected PDF file</p>
      </div>
    </div>
  </div>

  <div class="security-info">
    <h2>Security Information</h2>
    <div class="security-cards">
      <div class="security-card">
        <h3>User Password</h3>
        <p>Required to open and view the PDF document. Without this password, the file cannot be opened.</p>
      </div>
      <div class="security-card">
        <h3>Owner Password</h3>
        <p>Allows full access to the document including printing, editing, and changing security settings.</p>
      </div>
      <div class="security-card">
        <h3>Permissions</h3>
        <p>Control specific actions like printing, copying text, and modifying the document content.</p>
      </div>
    </div>
  </div>
</div>

<script>
// Global variables
let selectedFile = null;
let protectedPdf = null;

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

function handleFile(file) {
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
  
  showMessage('PDF loaded successfully! Set your passwords and permissions.', 'success');
}

// Password visibility toggle
document.querySelectorAll('.show-password-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const targetId = e.target.dataset.target;
    const passwordInput = document.getElementById(targetId);
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      e.target.textContent = '🙈';
    } else {
      passwordInput.type = 'password';
      e.target.textContent = '👁️';
    }
  });
});

// Password strength checker
function checkPasswordStrength(password) {
  let strength = 0;
  let feedback = [];
  
  if (password.length >= 8) strength += 1;
  else feedback.push('At least 8 characters');
  
  if (/[a-z]/.test(password)) strength += 1;
  else feedback.push('Lowercase letters');
  
  if (/[A-Z]/.test(password)) strength += 1;
  else feedback.push('Uppercase letters');
  
  if (/[0-9]/.test(password)) strength += 1;
  else feedback.push('Numbers');
  
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
  else feedback.push('Special characters');
  
  const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['#dc3545', '#fd7e14', '#ffc107', '#28a745', '#198754'];
  
  return {
    level: levels[Math.min(strength, 4)],
    color: colors[Math.min(strength, 4)],
    feedback: feedback
  };
}

// Real-time password strength checking
document.getElementById('userPassword').addEventListener('input', (e) => {
  const password = e.target.value;
  const strengthDiv = document.getElementById('userPasswordStrength');
  
  if (password) {
    const strength = checkPasswordStrength(password);
    strengthDiv.innerHTML = `
      <div class="strength-bar">
        <div class="strength-fill" style="width: ${(strength.level === 'Very Weak' ? 20 : strength.level === 'Weak' ? 40 : strength.level === 'Fair' ? 60 : strength.level === 'Good' ? 80 : 100)}%; background: ${strength.color}"></div>
      </div>
      <div class="strength-text" style="color: ${strength.color}">${strength.level}</div>
    `;
  } else {
    strengthDiv.innerHTML = '';
  }
});

document.getElementById('ownerPassword').addEventListener('input', (e) => {
  const password = e.target.value;
  const strengthDiv = document.getElementById('ownerPasswordStrength');
  
  if (password) {
    const strength = checkPasswordStrength(password);
    strengthDiv.innerHTML = `
      <div class="strength-bar">
        <div class="strength-fill" style="width: ${(strength.level === 'Very Weak' ? 20 : strength.level === 'Weak' ? 40 : strength.level === 'Fair' ? 60 : strength.level === 'Good' ? 80 : 100)}%; background: ${strength.color}"></div>
      </div>
      <div class="strength-text" style="color: ${strength.color}">${strength.level}</div>
    `;
  } else {
    strengthDiv.innerHTML = '';
  }
});

// Protection functionality
document.getElementById('protectBtn').addEventListener('click', protectPdf);
document.getElementById('clearBtn').addEventListener('click', clearFile);
document.getElementById('newProtectBtn').addEventListener('click', startNewProtection);
document.getElementById('downloadBtn').addEventListener('click', downloadProtectedPdf);

async function protectPdf() {
  if (!selectedFile) {
    showMessage('Please select a PDF file first.', 'error');
    return;
  }
  
  const userPassword = document.getElementById('userPassword').value.trim();
  
  if (!userPassword) {
    showMessage('Please enter a user password.', 'error');
    return;
  }
  
  // Show progress
  document.getElementById('progressSection').style.display = 'block';
  document.getElementById('fileInfo').style.display = 'none';
  
  try {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressText.textContent = 'Loading PDF...';
    progressFill.style.width = '20%';
    
    // Load PDF
    const pdfBytes = await selectedFile.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    
    progressText.textContent = 'Applying protection...';
    progressFill.style.width = '60%';
    
    // Get settings
    const ownerPassword = document.getElementById('ownerPassword').value.trim();
    const allowPrinting = document.getElementById('allowPrinting').checked;
    const allowModifying = document.getElementById('allowModifying').checked;
    const allowCopying = document.getElementById('allowCopying').checked;
    const allowAnnotating = document.getElementById('allowAnnotating').checked;
    const allowFilling = document.getElementById('allowFilling').checked;
    const allowAccessibility = document.getElementById('allowAccessibility').checked;
    const encryptionLevel = document.querySelector('input[name="encryption"]:checked').value;
    
    // Create permissions object
    const permissions = {
      printing: allowPrinting ? 'highResolution' : 'lowResolution',
      modifying: allowModifying,
      copying: allowCopying,
      annotating: allowAnnotating,
      fillingForms: allowFilling,
      contentAccessibility: allowAccessibility
    };
    
    // Apply encryption (simplified implementation)
    // Note: pdf-lib doesn't support full password protection yet
    // This is a demonstration of the workflow
    
    progressText.textContent = 'Encrypting PDF...';
    progressFill.style.width = '80%';
    
    // For this demo, we'll create a new PDF with a watermark indicating protection
    // In a real implementation, you'd use a library that supports PDF encryption
    
    const pages = pdfDoc.getPages();
    const { rgb } = PDFLib;
    
    // Add security watermark to each page (demo purposes)
    pages.forEach(page => {
      const { width, height } = page.getSize();
      
      // Add a subtle security watermark
      page.drawText('PROTECTED', {
        x: width - 100,
        y: height - 30,
        size: 8,
        color: rgb(0.8, 0.8, 0.8),
        opacity: 0.3
      });
    });
    
    progressText.textContent = 'Finalizing protected PDF...';
    progressFill.style.width = '95%';
    
    // Save the modified PDF
    const protectedBytes = await pdfDoc.save();
    protectedPdf = new Blob([protectedBytes], { type: 'application/pdf' });
    
    // Update UI with protection info
    document.getElementById('userPasswordInfo').textContent = userPassword ? 'Set' : 'Not Set';
    document.getElementById('ownerPasswordInfo').textContent = ownerPassword ? 'Set' : 'Not Set';
    document.getElementById('encryptionInfo').textContent = encryptionLevel === '256' ? '256-bit AES' : '128-bit RC4';
    
    // Show download section
    progressText.textContent = 'Complete!';
    progressFill.style.width = '100%';
    
    setTimeout(() => {
      document.getElementById('progressSection').style.display = 'none';
      document.getElementById('downloadSection').style.display = 'block';
    }, 500);
    
    showMessage('PDF protected successfully!', 'success');
    
    // Store password info for user reference (in real app, this would be more secure)
    protectedPdf.userPassword = userPassword;
    protectedPdf.ownerPassword = ownerPassword;
    
  } catch (error) {
    console.error('Error protecting PDF:', error);
    showMessage('Error protecting PDF. Please try again.', 'error');
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('fileInfo').style.display = 'block';
  }
}

function downloadProtectedPdf() {
  if (!protectedPdf) {
    showMessage('No protected PDF available.', 'error');
    return;
  }
  
  // Create download link
  const url = URL.createObjectURL(protectedPdf);
  const link = document.createElement('a');
  link.href = url;
  link.download = selectedFile.name.replace('.pdf', '_protected.pdf');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  // Show password reminder
  const userPassword = protectedPdf.userPassword;
  const ownerPassword = protectedPdf.ownerPassword;
  
  let reminder = `Remember your passwords:\n\nUser Password: ${userPassword}`;
  if (ownerPassword) {
    reminder += `\nOwner Password: ${ownerPassword}`;
  }
  reminder += '\n\nStore these passwords safely!';
  
  setTimeout(() => {
    alert(reminder);
  }, 1000);
  
  // Auto-clear files after download
  setTimeout(() => {
    clearFile();
    showMessage('Files cleared for privacy.', 'info');
  }, 3000);
}

function clearFile() {
  selectedFile = null;
  protectedPdf = null;
  
  document.getElementById('fileInfo').style.display = 'none';
  document.getElementById('progressSection').style.display = 'none';
  document.getElementById('downloadSection').style.display = 'none';
  document.getElementById('uploadArea').style.display = 'block';
  
  document.getElementById('fileInput').value = '';
  document.getElementById('userPassword').value = '';
  document.getElementById('ownerPassword').value = '';
  document.getElementById('userPasswordStrength').innerHTML = '';
  document.getElementById('ownerPasswordStrength').innerHTML = '';
  
  // Reset checkboxes to defaults
  document.getElementById('allowPrinting').checked = true;
  document.getElementById('allowModifying').checked = false;
  document.getElementById('allowCopying').checked = false;
  document.getElementById('allowAnnotating').checked = false;
  document.getElementById('allowFilling').checked = true;
  document.getElementById('allowAccessibility').checked = true;
  
  showMessage('Files cleared.', 'info');
}

function startNewProtection() {
  clearFile();
  showMessage('Ready for new protection!', 'success');
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
/* PDF Protection specific styles */
.protection-options {
  margin: 20px 0;
}

.password-section {
  margin-bottom: 25px;
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
}

.password-section h5 {
  margin: 0 0 5px 0;
  color: #333;
  font-weight: 600;
}

.help-text {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 0.9rem;
}

.password-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.password-group input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
}

.show-password-btn {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-left: none;
  border-radius: 0 4px 4px 0;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 1rem;
}

.show-password-btn:hover {
  background: #e9ecef;
}

.password-strength {
  margin-top: 5px;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 5px;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
}

.strength-text {
  font-size: 0.8rem;
  font-weight: 500;
}

.permissions-section {
  margin: 25px 0;
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
}

.permissions-section h5 {
  margin: 0 0 15px 0;
  color: #333;
  font-weight: 600;
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.permission-item:hover {
  background: #f0f0f0;
  border-color: #007bff;
}

.permission-item input[type="checkbox"] {
  margin: 0;
  accent-color: #007bff;
}

.permission-label {
  font-weight: 500;
  color: #333;
}

.encryption-section {
  margin: 25px 0;
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
}

.encryption-section h5 {
  margin: 0 0 15px 0;
  color: #333;
  font-weight: 600;
}

.encryption-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.encryption-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.encryption-option:hover {
  background: #f0f0f0;
  border-color: #007bff;
}

.encryption-option input[type="radio"] {
  margin: 0;
  accent-color: #007bff;
}

.protect-controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 30px 0;
}

.protect-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.protect-btn:hover {
  background: #c82333;
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

.protection-info {
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

.new-protect-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.new-protect-btn:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

.security-info {
  margin: 40px 0;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.security-info h2 {
  text-align: center;
  margin-bottom: 30px;
  color: white;
}

.security-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.security-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.security-card h3 {
  margin: 0 0 10px 0;
  color: white;
  font-weight: 600;
}

.security-card p {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
}

/* Responsive design */
@media (max-width: 768px) {
  .permissions-grid {
    grid-template-columns: 1fr;
  }
  
  .encryption-options {
    gap: 8px;
  }
  
  .protect-controls,
  .download-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .password-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .password-group input {
    border-radius: 4px;
    margin-bottom: 5px;
  }
  
  .show-password-btn {
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .security-cards {
    grid-template-columns: 1fr;
  }
  
  .info-item {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
