---
layout: tool
title: "Text Case Converter - Convert Text Case Online"
description: "Free online text case converter. Convert text to uppercase, lowercase, title case, camel case, and more. No registration required."
keywords: "text case converter, uppercase, lowercase, title case, camel case, text transformer"
tool_name: "Text Case Converter"
tool_category: "Text Tools"
---

<div class="card">
  <div class="card-content">
    <h1 class="text-2xl font-bold text-foreground mb-2">Text Case Converter</h1>
    <p class="text-muted-foreground mb-6">Convert text between different cases - uppercase, lowercase, title case, and more</p>
  </div>

  <div class="converter-section">
    <div class="input-section">
      <h3>Input Text</h3>
      <textarea id="inputText" placeholder="Enter your text here..." rows="8"></textarea>
      <div class="text-stats">
        <span>Characters: <span id="charCount">0</span></span>
        <span>Words: <span id="wordCount">0</span></span>
        <span>Lines: <span id="lineCount">0</span></span>
      </div>
    </div>

    <div class="conversion-buttons">
      <div class="button-grid">
        <button class="convert-btn" data-case="upper">UPPERCASE</button>
        <button class="convert-btn" data-case="lower">lowercase</button>
        <button class="convert-btn" data-case="title">Title Case</button>
        <button class="convert-btn" data-case="sentence">Sentence case</button>
        <button class="convert-btn" data-case="camel">camelCase</button>
        <button class="convert-btn" data-case="pascal">PascalCase</button>
        <button class="convert-btn" data-case="snake">snake_case</button>
        <button class="convert-btn" data-case="kebab">kebab-case</button>
        <button class="convert-btn" data-case="alternating">aLtErNaTiNg CaSe</button>
        <button class="convert-btn" data-case="inverse">iNVERSE cASE</button>
      </div>
    </div>

    <div class="output-section">
      <h3>Output Text</h3>
      <textarea id="outputText" readonly rows="8"></textarea>
      <div class="output-actions">
        <button class="copy-btn" id="copyBtn">📋 Copy to Clipboard</button>
        <button class="clear-btn" id="clearBtn">🗑️ Clear All</button>
        <button class="download-btn" id="downloadBtn">💾 Download as TXT</button>
      </div>
    </div>
  </div>

  <div class="features-section">
    <h2>Features</h2>
    <div class="features-grid">
      <div class="feature">
        <div class="feature-icon">🔤</div>
        <h3>Multiple Case Types</h3>
        <p>Convert to 10+ different text cases including programming formats</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📊</div>
        <h3>Text Statistics</h3>
        <p>Real-time character, word, and line counting</p>
      </div>
      <div class="feature">
        <div class="feature-icon">⚡</div>
        <h3>Instant Conversion</h3>
        <p>Convert text instantly with a single click</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📱</div>
        <h3>Mobile Friendly</h3>
        <p>Works perfectly on all devices and screen sizes</p>
      </div>
    </div>
  </div>
</div>

<script>
// Global variables
let inputText = '';
let outputText = '';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  const inputTextarea = document.getElementById('inputText');
  const outputTextarea = document.getElementById('outputText');
  const convertButtons = document.querySelectorAll('.convert-btn');
  const copyBtn = document.getElementById('copyBtn');
  const clearBtn = document.getElementById('clearBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  // Update text statistics
  function updateStats(text) {
    const charCount = text.length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lineCount = text ? text.split('\n').length : 0;
    
    document.getElementById('charCount').textContent = charCount;
    document.getElementById('wordCount').textContent = wordCount;
    document.getElementById('lineCount').textContent = lineCount;
  }

  // Text conversion functions
  function convertToUpperCase(text) {
    return text.toUpperCase();
  }

  function convertToLowerCase(text) {
    return text.toLowerCase();
  }

  function convertToTitleCase(text) {
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  function convertToSentenceCase(text) {
    return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => 
      c.toUpperCase()
    );
  }

  function convertToCamelCase(text) {
    return text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
  }

  function convertToPascalCase(text) {
    return text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => 
        word.toUpperCase()
      )
      .replace(/\s+/g, '');
  }

  function convertToSnakeCase(text) {
    return text
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  }

  function convertToKebabCase(text) {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  function convertToAlternatingCase(text) {
    return text
      .split('')
      .map((char, index) => 
        index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
      )
      .join('');
  }

  function convertToInverseCase(text) {
    return text
      .split('')
      .map(char => 
        char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
      )
      .join('');
  }

  // Main conversion function
  function convertText(caseType, text) {
    switch (caseType) {
      case 'upper': return convertToUpperCase(text);
      case 'lower': return convertToLowerCase(text);
      case 'title': return convertToTitleCase(text);
      case 'sentence': return convertToSentenceCase(text);
      case 'camel': return convertToCamelCase(text);
      case 'pascal': return convertToPascalCase(text);
      case 'snake': return convertToSnakeCase(text);
      case 'kebab': return convertToKebabCase(text);
      case 'alternating': return convertToAlternatingCase(text);
      case 'inverse': return convertToInverseCase(text);
      default: return text;
    }
  }

  // Event listeners
  inputTextarea.addEventListener('input', function() {
    inputText = this.value;
    updateStats(inputText);
  });

  convertButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const caseType = this.dataset.case;
      const text = inputTextarea.value;
      
      console.log('Button clicked:', caseType, 'Text:', text); // Debug log
      
      if (!text.trim()) {
        showMessage('Please enter some text to convert.', 'warning');
        return;
      }
      
      outputText = convertText(caseType, text);
      outputTextarea.value = outputText;
      
      console.log('Converted text:', outputText); // Debug log
      
      // Highlight the clicked button
      convertButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      showMessage(`Text converted to ${this.textContent}!`, 'success');
    });
  });

  copyBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    const textToCopy = outputTextarea.value;
    
    if (!textToCopy) {
      showMessage('No text to copy. Please convert some text first.', 'warning');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      showMessage('Text copied to clipboard!', 'success');
    } catch (err) {
      console.error('Clipboard error:', err);
      // Fallback for older browsers
      try {
        outputTextarea.select();
        outputTextarea.setSelectionRange(0, 99999); // For mobile devices
        document.execCommand('copy');
        showMessage('Text copied to clipboard!', 'success');
      } catch (fallbackErr) {
        console.error('Fallback copy error:', fallbackErr);
        showMessage('Copy failed. Please select and copy manually.', 'error');
      }
    }
  });

  clearBtn.addEventListener('click', function(e) {
    e.preventDefault();
    inputTextarea.value = '';
    outputTextarea.value = '';
    inputText = '';
    outputText = '';
    updateStats('');
    convertButtons.forEach(btn => btn.classList.remove('active'));
    showMessage('All text cleared.', 'info');
    inputTextarea.focus();
  });

  downloadBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const textToDownload = outputTextarea.value;
    
    if (!textToDownload) {
      showMessage('No text to download. Please convert some text first.', 'warning');
      return;
    }
    
    try {
      const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `converted-text-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showMessage('Text file downloaded!', 'success');
    } catch (error) {
      console.error('Download error:', error);
      showMessage('Download failed. Please try again.', 'error');
    }
  });

  // Initialize stats
  updateStats('');
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
/* Text Case Converter specific styles */
.converter-section {
  margin: 20px 0;
}

.input-section, .output-section {
  margin: 20px 0;
}

.input-section h3, .output-section h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

#inputText, #outputText {
  width: 100%;
  min-height: 150px;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.3s ease;
}

#inputText:focus, #outputText:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

#outputText {
  background-color: #f8f9fa;
}

.text-stats {
  display: flex;
  gap: 20px;
  margin-top: 8px;
  font-size: 0.9rem;
  color: #666;
}

.text-stats span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.conversion-buttons {
  margin: 30px 0;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
  margin: 20px 0;
}

.convert-btn {
  background: #f8f9fa;
  border: 2px solid #dee2e6;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.convert-btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
  transform: translateY(-1px);
}

.convert-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.output-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.copy-btn, .clear-btn, .download-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.clear-btn {
  background: #6c757d;
}

.download-btn {
  background: #17a2b8;
}

.copy-btn:hover, .clear-btn:hover, .download-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.copy-btn:hover {
  background: #218838;
}

.clear-btn:hover {
  background: #5a6268;
}

.download-btn:hover {
  background: #138496;
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

.notification.info {
  background: #d1ecf1;
  color: #0c5460;
  border-color: #b8daff;
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
  .button-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 8px;
  }
  
  .output-actions {
    flex-direction: column;
  }
  
  .text-stats {
    flex-direction: column;
    gap: 8px;
  }
  
  .notification {
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>
