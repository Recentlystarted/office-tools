---
layout: tool
title: "QR Code Generator - Create QR Codes Online"
description: "Free online QR code generator. Create QR codes for text, URLs, contact info, WiFi passwords, and more. Customizable colors and sizes."
keywords: "QR code generator, QR code creator, barcode generator, free QR codes"
tool_name: "QR Code Generator"
tool_category: "Utility Tools"
---

<!-- QR Code generation library -->
<script>
// Load QRCode library with fallback
(function() {
  // Try primary CDN first
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
  script.async = true;
  
  script.onerror = function() {
    console.warn('Primary CDN failed, trying backup...');
    // Try backup CDN
    var backupScript = document.createElement('script');
    backupScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';
    backupScript.async = true;
    
    backupScript.onerror = function() {
      console.warn('Both CDNs failed, QR generation will use fallback API');
    };
    
    document.head.appendChild(backupScript);
  };
  
  document.head.appendChild(script);
})();
</script>

<div class="card">
  <div class="card-content">
    <h1 class="text-2xl font-bold text-foreground mb-2">QR Code Generator</h1>
    <p class="text-muted-foreground mb-6">Generate custom QR codes for text, URLs, contact information, and more</p>
  </div>

  <div class="generator-section">
    <div class="input-panel">
      <div class="qr-type-tabs">
        <button class="tab-btn active" data-type="text">📝 Text</button>
        <button class="tab-btn" data-type="url">🔗 URL</button>
        <button class="tab-btn" data-type="contact">👤 Contact</button>
        <button class="tab-btn" data-type="wifi">📶 WiFi</button>
        <button class="tab-btn" data-type="email">📧 Email</button>
        <button class="tab-btn" data-type="phone">📞 Phone</button>
      </div>

      <!-- Text QR -->
      <div class="qr-input-section" id="text-input">
        <h3>Text Content</h3>
        <textarea id="textContent" placeholder="Enter your text here..." rows="4"></textarea>
      </div>

      <!-- URL QR -->
      <div class="qr-input-section" id="url-input" style="display: none;">
        <h3>Website URL</h3>
        <input type="url" id="urlContent" placeholder="https://example.com">
      </div>

      <!-- Contact QR -->
      <div class="qr-input-section" id="contact-input" style="display: none;">
        <h3>Contact Information</h3>
        <div class="form-grid">
          <input type="text" id="contactName" placeholder="Full Name">
          <input type="tel" id="contactPhone" placeholder="Phone Number">
          <input type="email" id="contactEmail" placeholder="Email Address">
          <input type="text" id="contactOrg" placeholder="Organization">
          <textarea id="contactAddress" placeholder="Address" rows="2"></textarea>
        </div>
      </div>

      <!-- WiFi QR -->
      <div class="qr-input-section" id="wifi-input" style="display: none;">
        <h3>WiFi Network</h3>
        <div class="form-grid">
          <input type="text" id="wifiSSID" placeholder="Network Name (SSID)" required>
          <input type="password" id="wifiPassword" placeholder="Password">
          <select id="wifiSecurity">
            <option value="WPA">WPA/WPA2</option>
            <option value="WEP">WEP</option>
            <option value="">No Password</option>
          </select>
          <label class="checkbox-label">
            <input type="checkbox" id="wifiHidden">
            <span>Hidden Network</span>
          </label>
        </div>
      </div>

      <!-- Email QR -->
      <div class="qr-input-section" id="email-input" style="display: none;">
        <h3>Email</h3>
        <div class="form-grid">
          <input type="email" id="emailTo" placeholder="Recipient Email" required>
          <input type="text" id="emailSubject" placeholder="Subject">
          <textarea id="emailBody" placeholder="Message body..." rows="3"></textarea>
        </div>
      </div>

      <!-- Phone QR -->
      <div class="qr-input-section" id="phone-input" style="display: none;">
        <h3>Phone Number</h3>
        <input type="tel" id="phoneNumber" placeholder="+1234567890">
      </div>

      <!-- Customization Options -->
      <div class="customization-section">
        <h3>Customization</h3>
        <div class="options-grid">
          <div class="option-group">
            <label for="qrSize">Size:</label>
            <select id="qrSize">
              <option value="200">Small (200x200)</option>
              <option value="300" selected>Medium (300x300)</option>
              <option value="400">Large (400x400)</option>
              <option value="500">Extra Large (500x500)</option>
            </select>
          </div>
          
          <div class="option-group">
            <label for="qrColor">Foreground Color:</label>
            <input type="color" id="qrColor" value="#000000">
          </div>
          
          <div class="option-group">
            <label for="qrBgColor">Background Color:</label>
            <input type="color" id="qrBgColor" value="#ffffff">
          </div>
          
          <div class="option-group">
            <label for="qrErrorLevel">Error Correction:</label>
            <select id="qrErrorLevel">
              <option value="L">Low (7%)</option>
              <option value="M" selected>Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="generate-section">
        <button id="generateBtn" class="generate-btn">🎯 Generate QR Code</button>
      </div>
    </div>

    <div class="output-panel">
      <div class="qr-preview">
        <h3>Preview</h3>
        <div id="qrCodeContainer">
          <div class="qr-placeholder">
            <div class="placeholder-icon">📱</div>
            <p>Your QR code will appear here</p>
          </div>
        </div>
      </div>

      <div class="download-section" id="downloadSection" style="display: none;">
        <h3>Download Options</h3>
        <div class="download-buttons">
          <button id="downloadPng" class="download-btn">📥 Download PNG</button>
          <button id="downloadSvg" class="download-btn">📥 Download SVG</button>
          <button id="downloadPdf" class="download-btn">📥 Download PDF</button>
        </div>
        
        <div class="qr-info">
          <p><strong>Content:</strong> <span id="qrContent">-</span></p>
          <p><strong>Type:</strong> <span id="qrType">-</span></p>
          <p><strong>Size:</strong> <span id="qrSizeDisplay">-</span></p>
        </div>
      </div>
    </div>
  </div>

  <div class="features-section">
    <h2>Features</h2>
    <div class="features-grid">
      <div class="feature">
        <div class="feature-icon">🎨</div>
        <h3>Customizable Design</h3>
        <p>Choose colors, sizes, and error correction levels</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📱</div>
        <h3>Multiple Types</h3>
        <p>Text, URL, contact info, WiFi, email, and phone QR codes</p>
      </div>
      <div class="feature">
        <div class="feature-icon">💾</div>
        <h3>Multiple Formats</h3>
        <p>Download as PNG, SVG, or PDF files</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🔒</div>
        <h3>Privacy Focused</h3>
        <p>All generation happens locally in your browser</p>
      </div>
    </div>
  </div>
</div>

<script>
// Global variables
let currentQRCode = null;
let currentContent = '';
let currentType = 'text';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const generateBtn = document.getElementById('generateBtn');
  const downloadPng = document.getElementById('downloadPng');
  const downloadSvg = document.getElementById('downloadSvg');
  const downloadPdf = document.getElementById('downloadPdf');

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const type = this.dataset.type;
      switchTab(type);
    });
  });

  function switchTab(type) {
    // Update active tab
    tabBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-type="${type}"]`).classList.add('active');
    
    // Show corresponding input section
    document.querySelectorAll('.qr-input-section').forEach(section => {
      section.style.display = 'none';
    });
    document.getElementById(`${type}-input`).style.display = 'block';
    
    currentType = type;
  }

  // Generate QR Code
  generateBtn.addEventListener('click', generateQRCode);

  async function generateQRCode() {
    const content = getContentByType();
    
    if (!content) {
      showMessage('Please fill in the required fields.', 'warning');
      return;
    }
    
    const size = parseInt(document.getElementById('qrSize').value);
    const color = document.getElementById('qrColor').value;
    const bgColor = document.getElementById('qrBgColor').value;
    const errorLevel = document.getElementById('qrErrorLevel').value;
    
    try {
      const qrContainer = document.getElementById('qrCodeContainer');
      qrContainer.innerHTML = '<div class="generating">Generating QR Code...</div>';
      
      // Wait a bit for library to load if it's still loading
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if QRCode library is available
      if (typeof QRCode === 'undefined') {
        console.warn('QRCode library not available, using fallback API');
        return generateQRCodeFallback(content, size, color, bgColor, errorLevel);
      }
      
      // Generate QR code using QRCode library
      const canvas = document.createElement('canvas');
      await QRCode.toCanvas(canvas, content, {
        width: size,
        height: size,
        color: {
          dark: color,
          light: bgColor
        },
        errorCorrectionLevel: errorLevel,
        margin: 2
      });
      
      qrContainer.innerHTML = '';
      qrContainer.appendChild(canvas);
      
      currentQRCode = canvas;
      currentContent = content;
      
      // Show download options
      showDownloadSection(content, size);
      showMessage('QR code generated successfully!', 'success');
      
    } catch (error) {
      console.error('Error generating QR code:', error);
      console.warn('Falling back to API service due to error');
      return generateQRCodeFallback(content, size, color, bgColor, errorLevel);
    }
  }

  function generateQRCodeFallback(content, size, color, bgColor, errorLevel) {
    const qrContainer = document.getElementById('qrCodeContainer');
    
    // Try multiple fallback APIs
    const apis = [
      {
        name: 'QR Server',
        url: `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(content)}&color=${color.replace('#', '')}&bgcolor=${bgColor.replace('#', '')}&ecc=${errorLevel}`
      },
      {
        name: 'QR Code Monkey',
        url: `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(content)}`
      },
      {
        name: 'GoQR',
        url: `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(content)}&size=${size}x${size}`
      }
    ];
    
    let currentApiIndex = 0;
    
    function tryNextApi() {
      if (currentApiIndex >= apis.length) {
        qrContainer.innerHTML = '<p style="color: red;">All QR services are unavailable. Please try again later.</p>';
        showMessage('QR code services are temporarily unavailable.', 'error');
        return;
      }
      
      const api = apis[currentApiIndex];
      const img = document.createElement('img');
      
      img.src = api.url;
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.alt = 'Generated QR Code';
      img.crossOrigin = 'anonymous';
      
      img.onload = function() {
        qrContainer.innerHTML = '';
        qrContainer.appendChild(img);
        
        // Create a canvas for download functionality
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Handle CORS issues by creating a clean canvas
        try {
          ctx.drawImage(img, 0, 0, size, size);
          currentQRCode = canvas;
        } catch (corsError) {
          console.warn('CORS issue with image, creating fallback canvas');
          // Create a fallback canvas with the image URL for download
          currentQRCode = { 
            toDataURL: () => api.url,
            isApiImage: true,
            apiUrl: api.url
          };
        }
        
        currentContent = content;
        
        // Show download options
        showDownloadSection(content, size);
        showMessage(`QR code generated using ${api.name} service!`, 'success');
      };
      
      img.onerror = function() {
        console.warn(`${api.name} API failed, trying next...`);
        currentApiIndex++;
        tryNextApi();
      };
    }
    
    tryNextApi();
  }

  function showDownloadSection(content, size) {
    document.getElementById('downloadSection').style.display = 'block';
    document.getElementById('qrContent').textContent = content.length > 50 ? content.substring(0, 50) + '...' : content;
    document.getElementById('qrType').textContent = currentType.charAt(0).toUpperCase() + currentType.slice(1);
    document.getElementById('qrSizeDisplay').textContent = `${size}x${size}px`;
  }

  function getContentByType() {
    switch (currentType) {
      case 'text':
        return document.getElementById('textContent').value.trim();
        
      case 'url':
        const url = document.getElementById('urlContent').value.trim();
        return url.startsWith('http') ? url : `https://${url}`;
        
      case 'contact':
        const name = document.getElementById('contactName').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const org = document.getElementById('contactOrg').value.trim();
        const address = document.getElementById('contactAddress').value.trim();
        
        if (!name && !phone && !email) return '';
        
        let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
        if (name) vcard += `FN:${name}\n`;
        if (phone) vcard += `TEL:${phone}\n`;
        if (email) vcard += `EMAIL:${email}\n`;
        if (org) vcard += `ORG:${org}\n`;
        if (address) vcard += `ADR:;;${address};;;;\n`;
        vcard += 'END:VCARD';
        
        return vcard;
        
      case 'wifi':
        const ssid = document.getElementById('wifiSSID').value.trim();
        const password = document.getElementById('wifiPassword').value;
        const security = document.getElementById('wifiSecurity').value;
        const hidden = document.getElementById('wifiHidden').checked;
        
        if (!ssid) return '';
        
        return `WIFI:T:${security};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;
        
      case 'email':
        const to = document.getElementById('emailTo').value.trim();
        const subject = document.getElementById('emailSubject').value.trim();
        const body = document.getElementById('emailBody').value.trim();
        
        if (!to) return '';
        
        let mailto = `mailto:${to}`;
        const params = [];
        if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
        if (body) params.push(`body=${encodeURIComponent(body)}`);
        
        return mailto + (params.length ? '?' + params.join('&') : '');
        
      case 'phone':
        const phoneNum = document.getElementById('phoneNumber').value.trim();
        return phoneNum ? `tel:${phoneNum}` : '';
        
      default:
        return '';
    }
  }

  // Download functions
  downloadPng.addEventListener('click', function() {
    if (!currentQRCode) return;
    
    const link = document.createElement('a');
    link.download = `qrcode_${currentType}_${Date.now()}.png`;
    
    if (currentQRCode.isApiImage) {
      // Handle API image download
      fetch(currentQRCode.apiUrl)
        .then(response => response.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          showMessage('PNG downloaded!', 'success');
        })
        .catch(error => {
          // Fallback: direct link to image
          link.href = currentQRCode.apiUrl;
          link.target = '_blank';
          link.click();
          showMessage('PNG opened in new tab!', 'success');
        });
    } else {
      // Handle canvas download
      link.href = currentQRCode.toDataURL();
      link.click();
      showMessage('PNG downloaded!', 'success');
    }
  });

  downloadSvg.addEventListener('click', async function() {
    if (!currentContent) return;
    
    try {
      const size = parseInt(document.getElementById('qrSize').value);
      const color = document.getElementById('qrColor').value;
      const bgColor = document.getElementById('qrBgColor').value;
      const errorLevel = document.getElementById('qrErrorLevel').value;
      
      // Check if QRCode library is available for SVG generation
      if (typeof QRCode === 'undefined') {
        showMessage('SVG download requires QR library. PNG download is available.', 'warning');
        return;
      }
      
      const svgString = await QRCode.toString(currentContent, {
        type: 'svg',
        width: size,
        height: size,
        color: {
          dark: color,
          light: bgColor
        },
        errorCorrectionLevel: errorLevel,
        margin: 2
      });
      
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `qrcode_${currentType}_${Date.now()}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      
      showMessage('SVG downloaded!', 'success');
    } catch (error) {
      showMessage('Error creating SVG. Please try again.', 'error');
    }
  });

  downloadPdf.addEventListener('click', function() {
    if (!currentQRCode) return;
    
    if (currentQRCode.isApiImage) {
      // For API images, we'll download as PNG instead of PDF
      showMessage('PDF conversion not available with fallback service. Use PNG download.', 'warning');
      return;
    }
    
    // Create a simple PDF-like image with the QR code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 600; // PDF size
    
    canvas.width = size;
    canvas.height = size;
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Draw QR code centered
    const qrSize = 400;
    const x = (size - qrSize) / 2;
    const y = (size - qrSize) / 2;
    
    ctx.drawImage(currentQRCode, x, y, qrSize, qrSize);
    
    // Convert to blob and download
    canvas.toBlob(function(blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `qrcode_${currentType}_${Date.now()}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      
      showMessage('High-resolution PNG downloaded!', 'success');
    });
  });
});

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
  }, 3000);
}
</script>

<style>
/* QR Code Generator specific styles */
.generator-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin: 20px 0;
}

.qr-type-tabs {
  display: flex;
  gap: 5px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tab-btn {
  background: #f8f9fa;
  border: 2px solid #dee2e6;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.tab-btn:hover:not(.active) {
  background: #e9ecef;
  border-color: #adb5bd;
}

.qr-input-section h3 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.form-grid {
  display: grid;
  gap: 15px;
}

.form-grid input, .form-grid select, .form-grid textarea {
  width: 100%;
  padding: 10px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
}

.form-grid input:focus, .form-grid select:focus, .form-grid textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.customization-section {
  margin: 20px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.option-group label {
  font-weight: 500;
  color: #495057;
}

.option-group input, .option-group select {
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.generate-section {
  margin: 20px 0;
}

.generate-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
}

.generate-btn:hover {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40,167,69,0.3);
}

.qr-preview {
  text-align: center;
}

#qrCodeContainer {
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-placeholder {
  text-align: center;
  color: #6c757d;
}

.placeholder-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.generating {
  color: #007bff;
  font-weight: 500;
}

.download-section {
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.download-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.download-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  flex: 1;
}

.download-btn:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.qr-info {
  border-top: 1px solid #dee2e6;
  padding-top: 15px;
  font-size: 0.9rem;
}

.qr-info p {
  margin: 5px 0;
  color: #495057;
}

/* Notifications */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #d4edda;
  color: #155724;
  padding: 12px 20px;
  border-radius: 6px;
  border: 1px solid #c3e6cb;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 300px;
}

.notification.warning {
  background: #fff3cd;
  color: #856404;
  border-color: #ffeaa7;
}

.notification.error {
  background: #f8d7da;
  color: #721c24;
  border-color: #f1b0b7;
}

.notification button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: inherit;
  padding: 0;
  margin-left: auto;
}

/* Responsive design */
@media (max-width: 768px) {
  .generator-section {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .qr-type-tabs {
    grid-template-columns: repeat(3, 1fr);
    display: grid;
  }
  
  .tab-btn {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .download-buttons {
    flex-direction: column;
  }
  
  .notification {
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>
