---
layout: tool
title: "Password Generator - Create Strong Secure Passwords"
description: "Free online password generator. Create strong, secure passwords with customizable length and character sets. Includes password strength checker."
keywords: "password generator, strong password, secure password, random password, password creator"
tool_name: "Password Generator"
tool_category: "Security Tools"
---

<div class="tool-container">
  <div class="tool-header">
    <h1>Password Generator</h1>
    <p>Generate strong, secure passwords to protect your accounts</p>
  </div>

  <div class="generator-section">
    <div class="password-output">
      <h3>Generated Password</h3>
      <div class="password-display">
        <input type="text" id="generatedPassword" readonly placeholder="Click generate to create a password">
        <div class="password-actions">
          <button id="copyPasswordBtn" class="action-btn">📋</button>
          <button id="toggleVisibilityBtn" class="action-btn">👁️</button>
          <button id="regenerateBtn" class="action-btn">🔄</button>
        </div>
      </div>
      
      <div class="strength-meter">
        <div class="strength-bar">
          <div id="strengthFill" class="strength-fill"></div>
        </div>
        <div class="strength-info">
          <span id="strengthText">Password Strength: -</span>
          <span id="strengthScore">Score: -</span>
        </div>
      </div>
    </div>

    <div class="options-panel">
      <h3>Password Options</h3>
      
      <div class="option-group">
        <label for="passwordLength">Length: <span id="lengthValue">16</span></label>
        <input type="range" id="passwordLength" min="4" max="100" value="16">
        <div class="length-presets">
          <button class="preset-btn" data-length="8">8</button>
          <button class="preset-btn" data-length="12">12</button>
          <button class="preset-btn" data-length="16">16</button>
          <button class="preset-btn" data-length="24">24</button>
          <button class="preset-btn" data-length="32">32</button>
        </div>
      </div>

      <div class="character-options">
        <h4>Character Types</h4>
        <label class="checkbox-option">
          <input type="checkbox" id="includeUppercase" checked>
          <span class="checkmark"></span>
          <span>Uppercase (A-Z)</span>
          <span class="char-example">ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
        </label>
        
        <label class="checkbox-option">
          <input type="checkbox" id="includeLowercase" checked>
          <span class="checkmark"></span>
          <span>Lowercase (a-z)</span>
          <span class="char-example">abcdefghijklmnopqrstuvwxyz</span>
        </label>
        
        <label class="checkbox-option">
          <input type="checkbox" id="includeNumbers" checked>
          <span class="checkmark"></span>
          <span>Numbers (0-9)</span>
          <span class="char-example">0123456789</span>
        </label>
        
        <label class="checkbox-option">
          <input type="checkbox" id="includeSymbols" checked>
          <span class="checkmark"></span>
          <span>Symbols</span>
          <span class="char-example">!@#$%^&*()_+-=[]{}|;:,.<>?</span>
        </label>
        
        <label class="checkbox-option">
          <input type="checkbox" id="excludeSimilar">
          <span class="checkmark"></span>
          <span>Exclude similar characters</span>
          <span class="char-example">0O, 1lI, etc.</span>
        </label>
        
        <label class="checkbox-option">
          <input type="checkbox" id="excludeAmbiguous">
          <span class="checkmark"></span>
          <span>Exclude ambiguous characters</span>
          <span class="char-example">{}[]()\/~,;.<></span>
        </label>
      </div>

      <div class="advanced-options">
        <h4>Advanced Options</h4>
        <label class="checkbox-option">
          <input type="checkbox" id="startWithLetter">
          <span class="checkmark"></span>
          <span>Start with letter</span>
        </label>
        
        <label class="checkbox-option">
          <input type="checkbox" id="noRepeatingChars">
          <span class="checkmark"></span>
          <span>No repeating characters</span>
        </label>
        
        <div class="custom-charset">
          <label for="customCharset">Custom character set:</label>
          <input type="text" id="customCharset" placeholder="Enter custom characters (optional)">
        </div>
      </div>

      <button id="generateBtn" class="generate-btn">🔐 Generate Password</button>
    </div>
  </div>

  <div class="password-history">
    <h3>Recent Passwords <span id="historyCount">(0)</span></h3>
    <div class="history-controls">
      <button id="clearHistoryBtn" class="clear-btn">🗑️ Clear History</button>
      <button id="exportPasswordsBtn" class="export-btn">📤 Export All</button>
    </div>
    <div id="passwordHistory" class="history-list">
      <p class="empty-state">No passwords generated yet</p>
    </div>
  </div>

  <div class="password-tips">
    <h3>Password Security Tips</h3>
    <div class="tips-grid">
      <div class="tip">
        <div class="tip-icon">🔢</div>
        <h4>Use 12+ Characters</h4>
        <p>Longer passwords are exponentially harder to crack</p>
      </div>
      <div class="tip">
        <div class="tip-icon">🎭</div>
        <h4>Mix Character Types</h4>
        <p>Combine uppercase, lowercase, numbers, and symbols</p>
      </div>
      <div class="tip">
        <div class="tip-icon">🔄</div>
        <h4>Use Unique Passwords</h4>
        <p>Never reuse passwords across different accounts</p>
      </div>
      <div class="tip">
        <div class="tip-icon">💾</div>
        <h4>Use a Password Manager</h4>
        <p>Store passwords securely with a trusted manager</p>
      </div>
    </div>
  </div>
</div>

<script>
// Character sets
const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  similar: '0O1lI',
  ambiguous: '{}[]()\/~,;.<>'
};

// Global variables
let passwordHistory = [];
let isPasswordVisible = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  const generateBtn = document.getElementById('generateBtn');
  const copyBtn = document.getElementById('copyPasswordBtn');
  const toggleBtn = document.getElementById('toggleVisibilityBtn');
  const regenerateBtn = document.getElementById('regenerateBtn');
  const lengthSlider = document.getElementById('passwordLength');
  const lengthValue = document.getElementById('lengthValue');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const exportPasswordsBtn = document.getElementById('exportPasswordsBtn');

  // Load history from localStorage
  loadPasswordHistory();

  // Event listeners
  generateBtn.addEventListener('click', generatePassword);
  copyBtn.addEventListener('click', copyPassword);
  toggleBtn.addEventListener('click', togglePasswordVisibility);
  regenerateBtn.addEventListener('click', generatePassword);
  clearHistoryBtn.addEventListener('click', clearPasswordHistory);
  exportPasswordsBtn.addEventListener('click', exportPasswords);

  // Length slider
  lengthSlider.addEventListener('input', function() {
    lengthValue.textContent = this.value;
  });

  // Preset buttons
  presetBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const length = parseInt(this.dataset.length);
      lengthSlider.value = length;
      lengthValue.textContent = length;
      
      // Highlight active preset
      presetBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Auto-generate on option change
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (document.getElementById('generatedPassword').value) {
        generatePassword();
      }
    });
  });

  // Generate initial password
  generatePassword();
});

function generatePassword() {
  const length = parseInt(document.getElementById('passwordLength').value);
  const options = getPasswordOptions();
  
  if (!validateOptions(options)) {
    return;
  }
  
  const password = createPassword(length, options);
  
  // Update display
  document.getElementById('generatedPassword').value = password;
  updateStrengthMeter(password);
  
  // Add to history
  addToHistory(password);
  
  showMessage('Password generated successfully!', 'success');
}

function getPasswordOptions() {
  return {
    includeUppercase: document.getElementById('includeUppercase').checked,
    includeLowercase: document.getElementById('includeLowercase').checked,
    includeNumbers: document.getElementById('includeNumbers').checked,
    includeSymbols: document.getElementById('includeSymbols').checked,
    excludeSimilar: document.getElementById('excludeSimilar').checked,
    excludeAmbiguous: document.getElementById('excludeAmbiguous').checked,
    startWithLetter: document.getElementById('startWithLetter').checked,
    noRepeatingChars: document.getElementById('noRepeatingChars').checked,
    customCharset: document.getElementById('customCharset').value.trim()
  };
}

function validateOptions(options) {
  if (!options.includeUppercase && !options.includeLowercase && 
      !options.includeNumbers && !options.includeSymbols && 
      !options.customCharset) {
    showMessage('Please select at least one character type.', 'warning');
    return false;
  }
  
  return true;
}

function createPassword(length, options) {
  let charset = '';
  
  // Build character set
  if (options.customCharset) {
    charset = options.customCharset;
  } else {
    if (options.includeUppercase) charset += CHAR_SETS.uppercase;
    if (options.includeLowercase) charset += CHAR_SETS.lowercase;
    if (options.includeNumbers) charset += CHAR_SETS.numbers;
    if (options.includeSymbols) charset += CHAR_SETS.symbols;
  }
  
  // Remove similar characters if requested
  if (options.excludeSimilar) {
    charset = charset.split('').filter(char => !CHAR_SETS.similar.includes(char)).join('');
  }
  
  // Remove ambiguous characters if requested
  if (options.excludeAmbiguous) {
    charset = charset.split('').filter(char => !CHAR_SETS.ambiguous.includes(char)).join('');
  }
  
  let password = '';
  
  // Generate password
  if (options.noRepeatingChars && charset.length < length) {
    showMessage('Cannot generate password: not enough unique characters.', 'warning');
    return '';
  }
  
  const usedChars = new Set();
  
  for (let i = 0; i < length; i++) {
    let char;
    let attempts = 0;
    
    do {
      char = charset[Math.floor(Math.random() * charset.length)];
      attempts++;
      
      // Prevent infinite loop
      if (attempts > 100) break;
      
    } while (options.noRepeatingChars && usedChars.has(char));
    
    password += char;
    if (options.noRepeatingChars) usedChars.add(char);
  }
  
  // Ensure starts with letter if requested
  if (options.startWithLetter) {
    const letters = (CHAR_SETS.uppercase + CHAR_SETS.lowercase).split('').filter(char => charset.includes(char));
    if (letters.length > 0) {
      const firstChar = letters[Math.floor(Math.random() * letters.length)];
      password = firstChar + password.slice(1);
    }
  }
  
  return password;
}

function updateStrengthMeter(password) {
  const strength = calculatePasswordStrength(password);
  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');
  const strengthScore = document.getElementById('strengthScore');
  
  strengthFill.style.width = `${strength.percentage}%`;
  strengthFill.className = `strength-fill ${strength.level}`;
  
  strengthText.textContent = `Password Strength: ${strength.label}`;
  strengthScore.textContent = `Score: ${strength.score}/100`;
}

function calculatePasswordStrength(password) {
  let score = 0;
  let feedback = [];
  
  // Length scoring
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 25;
  if (password.length >= 16) score += 15;
  
  // Character variety
  if (/[a-z]/.test(password)) score += 5;
  if (/[A-Z]/.test(password)) score += 5;
  if (/[0-9]/.test(password)) score += 5;
  if (/[^A-Za-z0-9]/.test(password)) score += 10;
  
  // Pattern checks
  if (!/(.)\1{2,}/.test(password)) score += 5; // No repeated chars
  if (!/012|123|234|345|456|567|678|789|890/.test(password)) score += 5; // No sequences
  
  // Additional complexity
  const uniqueChars = new Set(password).size;
  if (uniqueChars / password.length > 0.7) score += 5;
  
  let level, label;
  if (score < 30) {
    level = 'weak';
    label = 'Weak';
  } else if (score < 60) {
    level = 'fair';
    label = 'Fair';
  } else if (score < 80) {
    level = 'good';
    label = 'Good';
  } else {
    level = 'strong';
    label = 'Strong';
  }
  
  return {
    score: Math.min(score, 100),
    percentage: Math.min(score, 100),
    level: level,
    label: label
  };
}

function copyPassword() {
  const password = document.getElementById('generatedPassword').value;
  
  if (!password) {
    showMessage('No password to copy. Generate one first.', 'warning');
    return;
  }
  
  navigator.clipboard.writeText(password).then(function() {
    showMessage('Password copied to clipboard!', 'success');
  }).catch(function() {
    // Fallback for older browsers
    const passwordInput = document.getElementById('generatedPassword');
    passwordInput.select();
    document.execCommand('copy');
    showMessage('Password copied to clipboard!', 'success');
  });
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById('generatedPassword');
  const toggleBtn = document.getElementById('toggleVisibilityBtn');
  
  isPasswordVisible = !isPasswordVisible;
  passwordInput.type = isPasswordVisible ? 'text' : 'password';
  toggleBtn.textContent = isPasswordVisible ? '🙈' : '👁️';
}

function addToHistory(password) {
  const timestamp = new Date().toLocaleString();
  const historyItem = {
    password: password,
    timestamp: timestamp,
    strength: calculatePasswordStrength(password)
  };
  
  passwordHistory.unshift(historyItem);
  
  // Limit history to 20 items
  if (passwordHistory.length > 20) {
    passwordHistory = passwordHistory.slice(0, 20);
  }
  
  updateHistoryDisplay();
  savePasswordHistory();
}

function updateHistoryDisplay() {
  const historyContainer = document.getElementById('passwordHistory');
  const historyCount = document.getElementById('historyCount');
  
  historyCount.textContent = `(${passwordHistory.length})`;
  
  if (passwordHistory.length === 0) {
    historyContainer.innerHTML = '<p class="empty-state">No passwords generated yet</p>';
    return;
  }
  
  const historyHTML = passwordHistory.map((item, index) => `
    <div class="history-item">
      <div class="history-password">
        <input type="password" value="${item.password}" readonly>
        <div class="history-actions">
          <button class="history-btn" onclick="copyHistoryPassword(${index})">📋</button>
          <button class="history-btn" onclick="toggleHistoryPassword(${index})">👁️</button>
          <button class="history-btn" onclick="removeHistoryItem(${index})">🗑️</button>
        </div>
      </div>
      <div class="history-info">
        <span class="history-time">${item.timestamp}</span>
        <span class="history-strength strength-${item.strength.level}">${item.strength.label}</span>
      </div>
    </div>
  `).join('');
  
  historyContainer.innerHTML = historyHTML;
}

function copyHistoryPassword(index) {
  const password = passwordHistory[index].password;
  navigator.clipboard.writeText(password).then(function() {
    showMessage('Password copied from history!', 'success');
  });
}

function toggleHistoryPassword(index) {
  const passwordInput = document.querySelectorAll('.history-password input')[index];
  const isVisible = passwordInput.type === 'text';
  passwordInput.type = isVisible ? 'password' : 'text';
}

function removeHistoryItem(index) {
  passwordHistory.splice(index, 1);
  updateHistoryDisplay();
  savePasswordHistory();
  showMessage('Password removed from history.', 'info');
}

function clearPasswordHistory() {
  if (passwordHistory.length === 0) {
    showMessage('History is already empty.', 'info');
    return;
  }
  
  if (confirm('Are you sure you want to clear all password history?')) {
    passwordHistory = [];
    updateHistoryDisplay();
    savePasswordHistory();
    showMessage('Password history cleared.', 'info');
  }
}

function exportPasswords() {
  if (passwordHistory.length === 0) {
    showMessage('No passwords to export.', 'warning');
    return;
  }
  
  const exportData = passwordHistory.map(item => 
    `${item.password}\t${item.timestamp}\t${item.strength.label}`
  ).join('\n');
  
  const header = 'Password\tGenerated\tStrength\n';
  const content = header + exportData;
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `passwords_${new Date().toISOString().split('T')[0]}.txt`;
  link.click();
  URL.revokeObjectURL(url);
  
  showMessage('Passwords exported successfully!', 'success');
}

function savePasswordHistory() {
  try {
    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
  } catch (e) {
    console.warn('Could not save password history to localStorage');
  }
}

function loadPasswordHistory() {
  try {
    const saved = localStorage.getItem('passwordHistory');
    if (saved) {
      passwordHistory = JSON.parse(saved);
      updateHistoryDisplay();
    }
  } catch (e) {
    console.warn('Could not load password history from localStorage');
  }
}

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
/* Password Generator specific styles */
.generator-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin: 20px 0;
}

.password-output {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 12px;
  border: 2px solid #e9ecef;
}

.password-display {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

#generatedPassword {
  flex: 1;
  padding: 15px;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: bold;
  border: 2px solid #007bff;
  border-radius: 8px;
  background: white;
}

.password-actions {
  display: flex;
  gap: 5px;
}

.action-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.strength-meter {
  margin-top: 15px;
}

.strength-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: width 0.5s ease, background-color 0.3s ease;
  border-radius: 4px;
}

.strength-fill.weak { background: #dc3545; }
.strength-fill.fair { background: #fd7e14; }
.strength-fill.good { background: #ffc107; }
.strength-fill.strong { background: #28a745; }

.strength-info {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.9rem;
  color: #666;
}

.options-panel {
  background: white;
  padding: 25px;
  border-radius: 12px;
  border: 2px solid #e9ecef;
}

.option-group {
  margin-bottom: 25px;
}

.option-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 10px;
  color: #2c3e50;
}

#passwordLength {
  width: 100%;
  margin-bottom: 10px;
}

.length-presets {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.preset-btn {
  background: #f8f9fa;
  border: 2px solid #dee2e6;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.preset-btn:hover, .preset-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.character-options h4, .advanced-options h4 {
  color: #495057;
  margin-bottom: 15px;
  font-size: 1rem;
}

.checkbox-option {
  display: block;
  position: relative;
  padding-left: 30px;
  margin-bottom: 12px;
  cursor: pointer;
  user-select: none;
  line-height: 1.4;
}

.checkbox-option input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: absolute;
  top: 2px;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: #eee;
  border: 2px solid #ddd;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.checkbox-option:hover input ~ .checkmark {
  background-color: #ccc;
}

.checkbox-option input:checked ~ .checkmark {
  background-color: #007bff;
  border-color: #007bff;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-option input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-option .checkmark:after {
  left: 5px;
  top: 1px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
}

.char-example {
  display: block;
  font-family: monospace;
  font-size: 0.8rem;
  color: #666;
  margin-top: 2px;
  word-break: break-all;
}

.custom-charset {
  margin-top: 15px;
}

.custom-charset label {
  font-weight: 500;
  margin-bottom: 5px;
}

.custom-charset input {
  width: 100%;
  padding: 8px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-family: monospace;
}

.generate-btn {
  width: 100%;
  background: #28a745;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
}

.generate-btn:hover {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40,167,69,0.3);
}

.password-history {
  margin: 40px 0;
  background: white;
  padding: 25px;
  border-radius: 12px;
  border: 2px solid #e9ecef;
}

.history-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.clear-btn, .export-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.export-btn {
  background: #17a2b8;
}

.clear-btn:hover {
  background: #5a6268;
}

.export-btn:hover {
  background: #138496;
}

.history-list {
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
}

.history-password {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
}

.history-password input {
  flex: 1;
  padding: 8px;
  font-family: monospace;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.history-actions {
  display: flex;
  gap: 5px;
}

.history-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.history-btn:hover {
  background: #0056b3;
}

.history-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #666;
}

.history-strength {
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.history-strength.strength-weak { background: #f8d7da; color: #721c24; }
.history-strength.strength-fair { background: #fff3cd; color: #856404; }
.history-strength.strength-good { background: #d4edda; color: #155724; }
.history-strength.strength-strong { background: #d1ecf1; color: #0c5460; }

.empty-state {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}

.password-tips {
  margin: 40px 0;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.tip {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  text-align: center;
}

.tip-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.tip h4 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.tip p {
  color: #666;
  font-size: 0.9rem;
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
  
  .password-display {
    flex-direction: column;
  }
  
  .password-actions {
    justify-content: center;
  }
  
  .history-controls {
    flex-direction: column;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
  
  .notification {
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>
