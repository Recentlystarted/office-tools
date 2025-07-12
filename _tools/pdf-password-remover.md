---
layout: tool
title: "PDF Password Remover - Remove PDF Password Protection"
description: "Remove password protection from PDF files instantly. Unlock password-protected PDFs quickly and securely with our free online tool."
keywords: "PDF password remover, unlock PDF, remove PDF password, PDF password protection, decrypt PDF"
permalink: /tools/pdf-password-remover/
---

<div class="card">
    <div class="card-content">
        <h1 class="text-2xl font-bold text-foreground mb-2"><i class="fas fa-unlock-alt"></i> PDF Password Remover</h1>
        <p class="text-muted-foreground mb-6">Remove password protection from your PDF files quickly and securely</p>
    </div>

    <div class="upload-section">
        <div class="upload-area" id="uploadArea">
            <div class="upload-content">
                <i class="fas fa-cloud-upload-alt upload-icon"></i>
                <h3>Select Password-Protected PDF</h3>
                <p>Drop your PDF file here or click to browse</p>
                <input type="file" id="fileInput" accept=".pdf" style="display: none;">
                <button class="btn-primary" onclick="document.getElementById('fileInput').click()">
                    <i class="fas fa-folder-open"></i> Choose PDF File
                </button>
            </div>
        </div>

        <div class="password-section" id="passwordSection" style="display: none;">
            <div class="input-group">
                <label for="pdfPassword">Enter PDF Password:</label>
                <div class="password-input-wrapper">
                    <input type="password" id="pdfPassword" placeholder="Enter the PDF password" class="password-input">
                    <button type="button" class="password-toggle" onclick="togglePasswordVisibility()">
                        <i class="fas fa-eye" id="passwordToggleIcon"></i>
                    </button>
                </div>
            </div>
            <button class="btn-primary" id="removePasswordBtn" onclick="removePassword()">
                <i class="fas fa-unlock"></i> Remove Password
            </button>
        </div>

        <div class="progress-section" id="progressSection" style="display: none;">
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill"></div>
            </div>
            <p class="progress-text" id="progressText">Removing password protection...</p>
        </div>

        <div class="result-section" id="resultSection" style="display: none;">
            <div class="result-content">
                <i class="fas fa-check-circle success-icon"></i>
                <h3>Password Removed Successfully!</h3>
                <p>Your PDF is now unlocked and ready for download</p>
                <button class="btn-success" id="downloadBtn" onclick="downloadFile()">
                    <i class="fas fa-download"></i> Download Unlocked PDF
                </button>
                <button class="btn-secondary" onclick="resetTool()">
                    <i class="fas fa-redo"></i> Remove Another Password
                </button>
            </div>
        </div>
    </div>

    <div class="features-grid">
        <div class="feature-card">
            <i class="fas fa-shield-alt"></i>
            <h3>Secure Processing</h3>
            <p>Your files are processed securely and deleted automatically after conversion</p>
        </div>
        <div class="feature-card">
            <i class="fas fa-bolt"></i>
            <h3>Fast Removal</h3>
            <p>Remove PDF passwords instantly with our optimized processing engine</p>
        </div>
        <div class="feature-card">
            <i class="fas fa-mobile-alt"></i>
            <h3>Any Device</h3>
            <p>Works on desktop, tablet, and mobile devices with any modern browser</p>
        </div>
        <div class="feature-card">
            <i class="fas fa-download"></i>
            <h3>No Registration</h3>
            <p>Remove PDF passwords without creating an account or providing personal information</p>
        </div>
    </div>

    <div class="faq-section">
        <h2>Frequently Asked Questions</h2>
        
        <div class="faq-item">
            <h3><i class="fas fa-question-circle"></i> How does PDF password removal work?</h3>
            <p>Our tool uses advanced algorithms to decrypt password-protected PDFs when you provide the correct password. The password protection is removed, creating an unlocked version of your PDF that can be opened without a password.</p>
        </div>

        <div class="faq-item">
            <h3><i class="fas fa-lock"></i> Is it safe to remove passwords from my PDFs?</h3>
            <p>Yes, our service is completely secure. All files are processed on secure servers and automatically deleted after processing. We don't store your files or passwords, ensuring complete privacy and security.</p>
        </div>

        <div class="faq-item">
            <h3><i class="fas fa-file-pdf"></i> What if I don't know the PDF password?</h3>
            <p>You must know the original password to remove protection. Our tool requires the correct password to decrypt the PDF - we cannot crack or bypass unknown passwords for security and legal reasons.</p>
        </div>

        <div class="faq-item">
            <h3><i class="fas fa-clock"></i> How long does password removal take?</h3>
            <p>Password removal is typically completed within seconds. Processing time may vary slightly based on file size and complexity, but most PDFs are processed almost instantly.</p>
        </div>

        <div class="faq-item">
            <h3><i class="fas fa-mobile-alt"></i> Can I remove passwords on mobile devices?</h3>
            <p>Yes! Our PDF password remover works on all devices including smartphones and tablets. The interface is fully responsive and optimized for mobile use.</p>
        </div>

        <div class="faq-item">
            <h3><i class="fas fa-file-archive"></i> What file size limits apply?</h3>
            <p>You can remove passwords from PDFs up to 100MB in size. For larger files, consider compressing your PDF first or contact us for assistance with bulk processing.</p>
        </div>
    </div>
</div>

<style>
.tool-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.tool-header {
    text-align: center;
    margin-bottom: 40px;
}

.tool-header h1 {
    color: #2c3e50;
    margin-bottom: 10px;
}

.tool-header i {
    margin-right: 10px;
    color: #e74c3c;
}

.tool-description {
    font-size: 1.2em;
    color: #7f8c8d;
    margin-bottom: 30px;
}

.upload-section {
    background: #fff;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 40px;
}

.upload-area {
    border: 3px dashed #bdc3c7;
    border-radius: 12px;
    padding: 60px 40px;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
}

.upload-area:hover {
    border-color: #e74c3c;
    background-color: #fdf2f2;
}

.upload-area.dragover {
    border-color: #e74c3c;
    background-color: #fdf2f2;
    transform: scale(1.02);
}

.upload-icon {
    font-size: 3em;
    color: #bdc3c7;
    margin-bottom: 20px;
}

.upload-content h3 {
    color: #2c3e50;
    margin-bottom: 10px;
}

.upload-content p {
    color: #7f8c8d;
    margin-bottom: 30px;
}

.btn-primary {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 8px;
    font-size: 1.1em;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.3);
}

.btn-success {
    background: linear-gradient(135deg, #27ae60, #229954);
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 8px;
    font-size: 1.1em;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-right: 15px;
}

.btn-success:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(39, 174, 96, 0.3);
}

.btn-secondary {
    background: #95a5a6;
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 8px;
    font-size: 1.1em;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.btn-secondary:hover {
    background: #7f8c8d;
    transform: translateY(-2px);
}

.password-section {
    margin-top: 30px;
    text-align: center;
}

.input-group {
    margin-bottom: 20px;
}

.input-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #2c3e50;
}

.password-input-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
    max-width: 400px;
}

.password-input {
    width: 100%;
    padding: 12px 45px 12px 15px;
    border: 2px solid #bdc3c7;
    border-radius: 8px;
    font-size: 1em;
    transition: border-color 0.3s ease;
}

.password-input:focus {
    outline: none;
    border-color: #e74c3c;
}

.password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #7f8c8d;
    cursor: pointer;
    font-size: 1em;
}

.password-toggle:hover {
    color: #2c3e50;
}

.progress-section {
    text-align: center;
    margin-top: 30px;
}

.progress-bar {
    width: 100%;
    height: 10px;
    background-color: #ecf0f1;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 15px;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #e74c3c, #c0392b);
    width: 0%;
    transition: width 0.3s ease;
    border-radius: 5px;
}

.progress-text {
    color: #7f8c8d;
    font-size: 1.1em;
}

.result-section {
    text-align: center;
    margin-top: 30px;
}

.success-icon {
    font-size: 3em;
    color: #27ae60;
    margin-bottom: 20px;
}

.result-content h3 {
    color: #2c3e50;
    margin-bottom: 10px;
}

.result-content p {
    color: #7f8c8d;
    margin-bottom: 30px;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    margin-bottom: 50px;
}

.feature-card {
    background: white;
    padding: 30px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.feature-card i {
    font-size: 2.5em;
    color: #e74c3c;
    margin-bottom: 20px;
}

.feature-card h3 {
    color: #2c3e50;
    margin-bottom: 15px;
}

.feature-card p {
    color: #7f8c8d;
    line-height: 1.6;
}

.faq-section {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.faq-section h2 {
    color: #2c3e50;
    text-align: center;
    margin-bottom: 40px;
}

.faq-item {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ecf0f1;
}

.faq-item:last-child {
    border-bottom: none;
}

.faq-item h3 {
    color: #2c3e50;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.faq-item h3 i {
    color: #e74c3c;
}

.faq-item p {
    color: #7f8c8d;
    line-height: 1.6;
}

@media (max-width: 768px) {
    .tool-container {
        padding: 10px;
    }
    
    .upload-section {
        padding: 20px;
    }
    
    .upload-area {
        padding: 40px 20px;
    }
    
    .features-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .faq-section {
        padding: 20px;
    }
    
    .btn-success, .btn-secondary {
        margin-right: 0;
        margin-bottom: 10px;
        width: 100%;
    }
}
</style>

<script>
let selectedFile = null;
let downloadUrl = null;

document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    // File input change handler
    fileInput.addEventListener('change', function(e) {
        handleFileSelect(e.target.files[0]);
    });
    
    // Drag and drop handlers
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });
    
    // Password input enter key handler
    document.getElementById('pdfPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            removePassword();
        }
    });
});

function handleFileSelect(file) {
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
        alert('Please select a PDF file');
        return;
    }
    
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
        alert('File size must be less than 100MB');
        return;
    }
    
    selectedFile = file;
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('passwordSection').style.display = 'block';
    
    // Update UI to show selected file
    const uploadContent = document.querySelector('.upload-content');
    uploadContent.innerHTML = `
        <i class="fas fa-file-pdf upload-icon" style="color: #e74c3c;"></i>
        <h3>${file.name}</h3>
        <p>Size: ${formatFileSize(file.size)}</p>
        <p>Ready to remove password protection</p>
    `;
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('pdfPassword');
    const toggleIcon = document.getElementById('passwordToggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleIcon.className = 'fas fa-eye';
    }
}

async function removePassword() {
    const password = document.getElementById('pdfPassword').value.trim();
    
    if (!selectedFile) {
        alert('Please select a PDF file first');
        return;
    }
    
    if (!password) {
        alert('Please enter the PDF password');
        return;
    }
    
    // Show progress
    document.getElementById('passwordSection').style.display = 'none';
    document.getElementById('progressSection').style.display = 'block';
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    try {
        // Animate progress
        progressFill.style.width = '30%';
        progressText.textContent = 'Verifying password...';
        
        // Create FormData
        const formData = new FormData();
        formData.append('pdf', selectedFile);
        formData.append('password', password);
        
        // Update progress
        progressFill.style.width = '60%';
        progressText.textContent = 'Removing password protection...';
        
        // Make API call to remove password
        const response = await fetch('https://api.tundasportsclub.com/remove-pdf-password', {
            method: 'POST',
            body: formData
        });
        
        progressFill.style.width = '90%';
        progressText.textContent = 'Finalizing...';
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to remove password');
        }
        
        // Get the unlocked PDF blob
        const blob = await response.blob();
        downloadUrl = URL.createObjectURL(blob);
        
        // Complete progress
        progressFill.style.width = '100%';
        progressText.textContent = 'Password removed successfully!';
        
        setTimeout(() => {
            document.getElementById('progressSection').style.display = 'none';
            document.getElementById('resultSection').style.display = 'block';
        }, 500);
        
    } catch (error) {
        console.error('Password removal failed:', error);
        document.getElementById('progressSection').style.display = 'none';
        document.getElementById('passwordSection').style.display = 'block';
        
        if (error.message.includes('Invalid password') || error.message.includes('Incorrect password')) {
            alert('Incorrect password. Please check your password and try again.');
            document.getElementById('pdfPassword').focus();
        } else {
            alert('Error removing password: ' + error.message);
        }
    }
}

function downloadFile() {
    if (!downloadUrl) {
        alert('No file available for download');
        return;
    }
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = selectedFile.name.replace('.pdf', '_unlocked.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function resetTool() {
    selectedFile = null;
    downloadUrl = null;
    
    document.getElementById('fileInput').value = '';
    document.getElementById('pdfPassword').value = '';
    document.getElementById('passwordToggleIcon').className = 'fas fa-eye';
    document.getElementById('pdfPassword').type = 'password';
    
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('passwordSection').style.display = 'none';
    document.getElementById('uploadArea').style.display = 'block';
    
    // Reset upload area content
    const uploadContent = document.querySelector('.upload-content');
    uploadContent.innerHTML = `
        <i class="fas fa-cloud-upload-alt upload-icon"></i>
        <h3>Select Password-Protected PDF</h3>
        <p>Drop your PDF file here or click to browse</p>
        <input type="file" id="fileInput" accept=".pdf" style="display: none;">
        <button class="btn-primary" onclick="document.getElementById('fileInput').click()">
            <i class="fas fa-folder-open"></i> Choose PDF File
        </button>
    `;
    
    // Re-attach event listener to new file input
    document.getElementById('fileInput').addEventListener('change', function(e) {
        handleFileSelect(e.target.files[0]);
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
</script>
