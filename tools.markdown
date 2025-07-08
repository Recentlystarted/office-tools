---
layout: default
title: "All Tools - Free Online Office Tools"
description: "Browse all our free online tools for PDF processing, document conversion, and file management. No registration required."
---

<!-- Enhanced SEO Meta Tags -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Free Online Office Tools",
  "description": "Browse all our free online tools for PDF processing, document conversion, and file management. No registration required.",
  "url": "{{ site.url }}/tools.html",
  "mainEntity": {
    "@type": "ItemList",
    "name": "Office Tools",
    "description": "Professional online tools for PDF processing, document conversion, and everyday tasks",
    "numberOfItems": 20,
    "itemListElement": [
      {
        "@type": "SoftwareApplication",
        "name": "PDF Merger",
        "description": "Professional PDF merging with drag & drop interface",
        "url": "{{ site.url }}/tools/pdf-merger",
        "applicationCategory": "PDF Tools",
        "operatingSystem": "Any",
        "isAccessibleForFree": true
      },
      {
        "@type": "SoftwareApplication", 
        "name": "PDF to Word Converter",
        "description": "Convert PDF files to editable Word documents",
        "url": "{{ site.url }}/tools/pdf-to-word",
        "applicationCategory": "PDF Tools",
        "operatingSystem": "Any",
        "isAccessibleForFree": true
      },
      {
        "@type": "SoftwareApplication",
        "name": "Word to PDF Converter", 
        "description": "Convert Word documents to high-quality PDF files",
        "url": "{{ site.url }}/tools/word-to-pdf",
        "applicationCategory": "PDF Tools",
        "operatingSystem": "Any",
        "isAccessibleForFree": true
      },
      {
        "@type": "SoftwareApplication",
        "name": "PDF Compressor",
        "description": "Reduce PDF file size while maintaining quality", 
        "url": "{{ site.url }}/tools/pdf-compressor",
        "applicationCategory": "PDF Tools",
        "operatingSystem": "Any",
        "isAccessibleForFree": true
      }
    ]
  }
}
</script>

<!-- Breadcrumb Navigation -->
<nav class="breadcrumb-nav">
  <div class="container">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="/">Home</a></li>
      <li class="breadcrumb-item active" aria-current="page">All Tools</li>
    </ol>
  </div>
</nav>

<div class="tools-page">
  <div class="hero-section">
    <div class="container">
      <h1>Free Online Tools</h1>
      <p>Professional tools for PDFs, documents, and everyday tasks</p>
      
      <!-- Search and Filter Section -->
      <div class="search-section">
        <div class="search-box">
          <input type="text" id="toolSearch" placeholder="🔍 Search tools..." />
          <button id="clearSearch" class="clear-btn" style="display: none;">✕</button>
        </div>
        
        <div class="filter-tabs">
          <button class="filter-tab active" data-category="all">All Tools</button>
          <button class="filter-tab" data-category="pdf">PDF Tools</button>
          <button class="filter-tab" data-category="text">Text Tools</button>
          <button class="filter-tab" data-category="utility">Utility Tools</button>
          <button class="filter-tab" data-category="developer">Developer Tools</button>
        </div>
        
        <div class="tools-count">
          <span id="toolsCount">20</span> tools available
        </div>
      </div>
    </div>
  </div>

  <div class="tools-section">
    <div class="container">
      <div class="tools-grid" id="toolsGrid">
        
        <!-- PDF Tools -->
        <div class="tool-card" data-category="pdf" data-keywords="merge combine join pdf files">
          <div class="tool-icon">🔗</div>
          <h3>PDF Merger</h3>
          <p>Professional PDF merging with drag & drop interface</p>
          <div class="tool-features">
            <span class="feature-tag">Drag & Drop</span>
            <span class="feature-tag">Multiple Files</span>
            <span class="feature-tag">Fast Processing</span>
          </div>
          <a href="/tools/pdf-merger" class="tool-btn">Start Merging</a>
        </div>

        <div class="tool-card" data-category="pdf" data-keywords="pdf word docx convert export">
          <div class="tool-icon">📝</div>
          <h3>PDF to Word</h3>
          <p>Convert PDF files to editable Word documents</p>
          <div class="tool-features">
            <span class="feature-tag">Text Extraction</span>
            <span class="feature-tag">Format Preserved</span>
            <span class="feature-tag">DOCX Output</span>
          </div>
          <a href="/tools/pdf-to-word" class="tool-btn">Convert PDF</a>
        </div>

        <div class="tool-card" data-category="pdf" data-keywords="word pdf docx convert create">
          <div class="tool-icon">📄</div>
          <h3>Word to PDF</h3>
          <p>Convert Word documents to high-quality PDF files</p>
          <div class="tool-features">
            <span class="feature-tag">High Quality</span>
            <span class="feature-tag">Fast Processing</span>
            <span class="feature-tag">Format Preserved</span>
          </div>
          <a href="/tools/word-to-pdf" class="tool-btn">Convert Word</a>
        </div>

        <div class="tool-card" data-category="pdf" data-keywords="compress reduce size optimize pdf">
          <div class="tool-icon">🗜️</div>
          <h3>PDF Compressor</h3>
          <p>Reduce PDF file size while maintaining quality</p>
          <div class="tool-features">
            <span class="feature-tag">3 Levels</span>
            <span class="feature-tag">Quality Preserved</span>
            <span class="feature-tag">Size Optimized</span>
          </div>
          <a href="/tools/pdf-compressor" class="tool-btn">Compress PDF</a>
        </div>

        <div class="tool-card" data-category="pdf" data-keywords="view preview pdf pages thumbnails">
          <div class="tool-icon">👁️</div>
          <h3>PDF Viewer</h3>
          <p>View and manage PDF pages with preview</p>
          <div class="tool-features">
            <span class="feature-tag">Page Preview</span>
            <span class="feature-tag">Thumbnails</span>
            <span class="feature-tag">Page Selection</span>
          </div>
          <a href="/tools/pdf-viewer" class="tool-btn">View PDF</a>
        </div>

        <div class="tool-card" data-category="pdf" data-keywords="image pdf convert create photos pictures">
          <div class="tool-icon">📷</div>
          <h3>Image to PDF</h3>
          <p>Convert images to PDF documents with custom layouts</p>
          <div class="tool-features">
            <span class="feature-tag">Multiple Images</span>
            <span class="feature-tag">Custom Layout</span>
            <span class="feature-tag">High Quality</span>
          </div>
          <a href="/tools/image-to-pdf" class="tool-btn">Convert to PDF</a>
        </div>

        <div class="tool-card" data-category="pdf" data-keywords="pdf edit modify text annotations">
          <div class="tool-icon">✏️</div>
          <h3>PDF Editor</h3>
          <p>Edit PDF files with text, annotations, and signatures</p>
          <div class="tool-features">
            <span class="feature-tag">Text Editing</span>
            <span class="feature-tag">Annotations</span>
            <span class="feature-tag">Signatures</span>
          </div>
          <a href="/tools/pdf-editor" class="tool-btn">Edit PDF</a>
        </div>

        <div class="tool-card" data-category="pdf" data-keywords="pdf excel convert export spreadsheet">
          <div class="tool-icon">📊</div>
          <h3>PDF to Excel</h3>
          <p>Convert PDF files to Excel spreadsheets with data preservation</p>
          <div class="tool-features">
            <span class="feature-tag">Data Tables</span>
            <span class="feature-tag">Format Preserved</span>
            <span class="feature-tag">XLSX Output</span>
          </div>
          <a href="/tools/pdf-to-excel" class="tool-btn">Convert to Excel</a>
        </div>

        <div class="tool-card" data-category="pdf" data-keywords="pdf protect password encrypt security">
          <div class="tool-icon">🔐</div>
          <h3>Protect PDF</h3>
          <p>Add password protection and encryption to PDF files</p>
          <div class="tool-features">
            <span class="feature-tag">Password Protection</span>
            <span class="feature-tag">Encryption</span>
            <span class="feature-tag">Secure</span>
          </div>
          <a href="/tools/protect-pdf" class="tool-btn">Protect PDF</a>
        </div>

        <div class="tool-card" data-category="pdf" data-keywords="pdf rotate pages orientation portrait landscape">
          <div class="tool-icon">🔄</div>
          <h3>Rotate PDF</h3>
          <p>Rotate PDF pages to correct orientation</p>
          <div class="tool-features">
            <span class="feature-tag">Page Rotation</span>
            <span class="feature-tag">Batch Process</span>
            <span class="feature-tag">Preview</span>
          </div>
          <a href="/tools/rotate-pdf" class="tool-btn">Rotate PDF</a>
        </div>

        <div class="tool-card" data-category="pdf" data-keywords="pdf split pages extract divide separate">
          <div class="tool-icon">✂️</div>
          <h3>Split PDF</h3>
          <p>Split PDF files into separate pages or ranges</p>
          <div class="tool-features">
            <span class="feature-tag">Page Ranges</span>
            <span class="feature-tag">Extract Pages</span>
            <span class="feature-tag">Multiple Files</span>
          </div>
          <a href="/tools/split-pdf" class="tool-btn">Split PDF</a>
        </div>

        <!-- Text Tools -->
        <div class="tool-card" data-category="text" data-keywords="text case uppercase lowercase title camel snake">
          <div class="tool-icon">🔤</div>
          <h3>Text Case Converter</h3>
          <p>Convert text between different cases and formats</p>
          <div class="tool-features">
            <span class="feature-tag">Multiple Cases</span>
            <span class="feature-tag">Real-time</span>
            <span class="feature-tag">Programming</span>
          </div>
          <a href="/tools/text-case-converter" class="tool-btn">Convert Text</a>
        </div>

        <!-- Utility Tools -->
        <div class="tool-card" data-category="utility" data-keywords="qr code generator wifi contact url">
          <div class="tool-icon">📱</div>
          <h3>QR Code Generator</h3>
          <p>Create custom QR codes for text, URLs, and contacts</p>
          <div class="tool-features">
            <span class="feature-tag">Multiple Types</span>
            <span class="feature-tag">Custom Design</span>
            <span class="feature-tag">Download</span>
          </div>
          <a href="/tools/qr-code-generator" class="tool-btn">Generate QR</a>
        </div>

        <div class="tool-card" data-category="utility" data-keywords="password generate secure strong random">
          <div class="tool-icon">🔐</div>
          <h3>Password Generator</h3>
          <p>Generate strong, secure passwords</p>
          <div class="tool-features">
            <span class="feature-tag">Customizable</span>
            <span class="feature-tag">Strength Check</span>
            <span class="feature-tag">Secure</span>
          </div>
          <a href="/tools/password-generator" class="tool-btn">Generate</a>
        </div>

        <div class="tool-card" data-category="utility" data-keywords="url shorten link short custom alias">
          <div class="tool-icon">🔗</div>
          <h3>URL Shortener</h3>
          <p>Create short, memorable links</p>
          <div class="tool-features">
            <span class="feature-tag">Custom Aliases</span>
            <span class="feature-tag">QR Codes</span>
            <span class="feature-tag">Analytics</span>
          </div>
          <a href="/tools/url-shortener" class="tool-btn">Shorten URL</a>
        </div>

        <!-- Developer Tools -->
        <div class="tool-card" data-category="developer" data-keywords="base64 encode decode converter">
          <div class="tool-icon">⚡</div>
          <h3>Base64 Encoder/Decoder</h3>
          <p>Encode and decode Base64 strings and files</p>
          <div class="tool-features">
            <span class="feature-tag">Text & Files</span>
            <span class="feature-tag">Batch Process</span>
            <span class="feature-tag">Developer</span>
          </div>
          <a href="/tools/base64-encoder-decoder" class="tool-btn">Encode/Decode</a>
        </div>

        <div class="tool-card" data-category="developer" data-keywords="json format validate beautify minify">
          <div class="tool-icon">📋</div>
          <h3>JSON Formatter</h3>
          <p>Format, validate, and beautify JSON data</p>
          <div class="tool-features">
            <span class="feature-tag">Validate</span>
            <span class="feature-tag">Format</span>
            <span class="feature-tag">Error Check</span>
          </div>
          <a href="/tools/json-formatter" class="tool-btn">Format JSON</a>
        </div>

        <div class="tool-card" data-category="developer" data-keywords="color picker hex rgb hsl palette">
          <div class="tool-icon">🎨</div>
          <h3>Color Picker</h3>
          <p>Advanced color picker with multiple formats</p>
          <div class="tool-features">
            <span class="feature-tag">Multiple Formats</span>
            <span class="feature-tag">Palettes</span>
            <span class="feature-tag">Eyedropper</span>
          </div>
          <a href="/tools/color-picker" class="tool-btn">Pick Colors</a>
        </div>

        <div class="tool-card" data-category="developer" data-keywords="url encode decode uri component">
          <div class="tool-icon">🌐</div>
          <h3>URL Encoder/Decoder</h3>
          <p>Encode and decode URLs with advanced options</p>
          <div class="tool-features">
            <span class="feature-tag">URL Analysis</span>
            <span class="feature-tag">Multiple Modes</span>
            <span class="feature-tag">Developer</span>
          </div>
          <a href="/tools/url-encoder-decoder" class="tool-btn">Encode/Decode</a>
        </div>

        <!-- Image Tools -->
        <div class="tool-card" data-category="image" data-keywords="image convert format png jpg jpeg ico webp bmp gif">
          <div class="tool-icon">🖼️</div>
          <h3>Image Format Converter</h3>
          <p>Convert images between different formats including ICO, PNG, JPG</p>
          <div class="tool-features">
            <span class="feature-tag">Multiple Formats</span>
            <span class="feature-tag">ICO Support</span>
            <span class="feature-tag">Quality Control</span>
          </div>
          <a href="/tools/image-converter" class="tool-btn">Convert Images</a>
        </div>

      </div>
      
      <!-- No Results Message -->
      <div id="noResults" class="no-results" style="display: none;">
        <div class="no-results-content">
          <div class="no-results-icon">🔍</div>
          <h3>No tools found</h3>
          <p>Try adjusting your search terms or browse by category</p>
          <button id="clearFilters" class="tool-btn">Clear Filters</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Benefits Section -->
  <div class="benefits-section">
    <div class="container">
      <h2>Why Choose Our Tools?</h2>
      <div class="benefits-grid">
        
        <div class="benefit">
          <div class="benefit-icon">🔒</div>
          <h3>Privacy First</h3>
          <p>All processing happens in your browser. Files never leave your device.</p>
        </div>

        <div class="benefit">
          <div class="benefit-icon">⚡</div>
          <h3>Lightning Fast</h3>
          <p>No uploads, no waiting. Get results instantly.</p>
        </div>

        <div class="benefit">
          <div class="benefit-icon">💯</div>
          <h3>100% Free</h3>
          <p>All tools are completely free with no hidden costs.</p>
        </div>

        <div class="benefit">
          <div class="benefit-icon">📱</div>
          <h3>Works Everywhere</h3>
          <p>Desktop, tablet, or phone - it all works.</p>
        </div>

        <div class="benefit">
          <div class="benefit-icon">💎</div>
          <h3>High Quality</h3>
          <p>Keep your original file quality.</p>
        </div>

      </div>
    </div>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('toolSearch');
  const clearSearch = document.getElementById('clearSearch');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const toolCards = document.querySelectorAll('.tool-card');
  const toolsCount = document.getElementById('toolsCount');
  const noResults = document.getElementById('noResults');
  const clearFilters = document.getElementById('clearFilters');
  
  let currentCategory = 'all';
  let currentSearch = '';
  
  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      currentSearch = e.target.value.toLowerCase();
      
      if (clearSearch) {
        clearSearch.style.display = currentSearch ? 'block' : 'none';
      }
      
      filterTools();
    });
  }
  
  // Clear search
  if (clearSearch) {
    clearSearch.addEventListener('click', function() {
      if (searchInput) {
        searchInput.value = '';
        currentSearch = '';
        clearSearch.style.display = 'none';
        filterTools();
        searchInput.focus();
      }
    });
  }
  
  // Category filters
  filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Update active tab
      filterTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      currentCategory = this.dataset.category;
      filterTools();
    });
  });
  
  // Clear all filters
  if (clearFilters) {
    clearFilters.addEventListener('click', function() {
      // Reset search
      if (searchInput) {
        searchInput.value = '';
        currentSearch = '';
      }
      if (clearSearch) {
        clearSearch.style.display = 'none';
      }
      
      // Reset category
      currentCategory = 'all';
      filterTabs.forEach(t => t.classList.remove('active'));
      document.querySelector('[data-category="all"]').classList.add('active');
      
      filterTools();
    });
  }
  
  function filterTools() {
    let visibleCount = 0;
    
    toolCards.forEach(card => {
      const category = card.dataset.category;
      const keywords = card.dataset.keywords || '';
      const title = card.querySelector('h3').textContent.toLowerCase();
      const description = card.querySelector('p').textContent.toLowerCase();
      
      // Check category filter
      const categoryMatch = currentCategory === 'all' || category === currentCategory;
      
      // Check search filter
      const searchMatch = !currentSearch || 
        title.includes(currentSearch) || 
        description.includes(currentSearch) || 
        keywords.includes(currentSearch);
      
      if (categoryMatch && searchMatch) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    // Update count
    if (toolsCount) {
      toolsCount.textContent = visibleCount;
    }
    
    // Show/hide no results message
    if (noResults) {
      if (visibleCount === 0) {
        noResults.style.display = 'block';
      } else {
        noResults.style.display = 'none';
      }
    }
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Focus search on Ctrl+F or Cmd+F
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
      }
    }
    
    // Clear search on Escape
    if (e.key === 'Escape' && searchInput && document.activeElement === searchInput) {
      searchInput.value = '';
      currentSearch = '';
      if (clearSearch) {
        clearSearch.style.display = 'none';
      }
      filterTools();
    }
  });
  
  // Initialize
  filterTools();
});
</script>

<style>
.tools-page {
  background: #f8f9fa;
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.hero-section p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.tools-section {
  padding: 60px 0;
}

.search-section {
  margin-top: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.search-box {
  position: relative;
  margin-bottom: 30px;
}

.search-box input {
  width: 100%;
  padding: 15px 50px 15px 20px;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.search-box input:focus {
  outline: none;
  background: white;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
}

.clear-btn {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.filter-tabs {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.filter-tab {
  padding: 8px 20px;
  border: none;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.filter-tab:hover,
.filter-tab.active {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
}

.tools-count {
  text-align: center;
  opacity: 0.8;
  font-size: 0.9rem;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 40px;
}

.tool-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid #e9ecef;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.tool-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
  display: block;
}

.tool-card h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #333;
  font-weight: 600;
}

.tool-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.tool-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.feature-tag {
  background: #f8f9fa;
  color: #495057;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #e9ecef;
}

.tool-btn {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-align: center;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.tool-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  text-decoration: none;
  color: white;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.no-results h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #333;
}

.benefits-section {
  background: white;
  padding: 80px 0;
  margin-top: 60px;
}

.benefits-section h2 {
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 50px;
  color: #333;
  font-weight: 600;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.benefit {
  text-align: center;
  padding: 30px 20px;
}

.benefit-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  display: block;
}

.benefit h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #333;
  font-weight: 600;
}

.benefit p {
  color: #666;
  line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    padding: 40px 0;
  }
  
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .filter-tabs {
    gap: 8px;
  }
  
  .filter-tab {
    padding: 6px 16px;
    font-size: 0.85rem;
  }
  
  .search-box input {
    padding: 12px 40px 12px 16px;
    font-size: 1rem;
  }
  
  .tool-card {
    padding: 20px;
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

@media (max-width: 480px) {
  .filter-tabs {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  .filter-tab {
    flex-shrink: 0;
  }
}
</style>