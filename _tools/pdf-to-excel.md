---
layout: tool
title: "PDF to Excel Converter - Extract Tables from PDF"
description: "Extract tables from PDF files and convert them to Excel format with preserved formatting. Free online tool with advanced formatting preservation, auto-detection, and multiple output formats."
tool_name: "PDF to Excel"
---

<div class="card">
  <div class="card-content">
    <h1 class="text-2xl font-bold text-foreground mb-2">PDF to Excel Converter</h1>
    <p class="text-muted-foreground mb-6">Extract tables from PDF files and convert them to Excel format with preserved formatting</p>
  </div>

  <div class="upload-area" id="uploadArea">
    <div class="upload-content">
      <div class="upload-icon">📊</div>
      <h3>Choose PDF File</h3>
      <p>Drag and drop your PDF file here or click to browse</p>
      <input type="file" id="fileInput" accept=".pdf" hidden>
      <button class="upload-btn" onclick="document.getElementById('fileInput').click()">
        Select PDF File
      </button>
    </div>
  </div>

  <div class="tool-options" id="toolOptions" style="display: none;">
    <h3>Extraction Options</h3>
    <div class="options-grid">
      <div class="option-group">
        <label for="extractionMode">Extraction Mode:</label>
        <select id="extractionMode">
          <option value="auto">🔍 Auto-detect tables</option>
          <option value="all">📝 Extract all text as table</option>
          <option value="structured">📊 Structured data only</option>
          <option value="smart">🧠 Smart detection (mixed content)</option>
          <option value="force">⚡ Force extraction (any content)</option>
        </select>
        <small>Try different modes if no data is found</small>
      </div>
      
      <div class="option-group">
        <label for="pageRange">Page Range:</label>
        <select id="pageRange">
          <option value="all">All pages</option>
          <option value="current">Current page only</option>
          <option value="range">Custom range</option>
        </select>
      </div>
      
      <div class="option-group" id="customRangeGroup" style="display: none;">
        <label for="customRange">Pages (e.g., 1-3, 5):</label>
        <input type="text" id="customRange" placeholder="1-3, 5, 7-9">
      </div>
      
      <div class="option-group">
        <label for="outputFormat">Output Format:</label>
        <select id="outputFormat">
          <option value="xlsx">Excel (.xlsx)</option>
          <option value="csv">CSV (.csv)</option>
          <option value="json">JSON (.json)</option>
        </select>
      </div>
      
      <div class="option-group">
        <label>
          <input type="checkbox" id="preserveFormatting" checked>
          ✨ Preserve formatting (colors, fonts, alignment, number formats)
        </label>
        <small>Creates professional Excel files with proper styling, borders, and data formatting</small>
      </div>
    </div>
  </div>

  <div class="progress-container" id="progressContainer" style="display: none;">
    <div class="progress-bar">
      <div class="progress-fill" id="progressFill"></div>
    </div>
    <div class="progress-text" id="progressText">Processing...</div>
  </div>

  <div class="preview-container" id="previewContainer" style="display: none;">
    <h3>Preview Extracted Data</h3>
    <div class="preview-content" id="previewContent"></div>
    <div class="download-section">
      <button class="download-btn" id="downloadBtn" onclick="downloadExtractedData()">
        Download Excel File
      </button>
    </div>
  </div>

  <div class="error-message" id="errorMessage" style="display: none;"></div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script src="https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js"></script>

<script>
let extractedData = [];
let currentFileName = '';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// File upload handling
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const toolOptions = document.getElementById('toolOptions');
const progressContainer = document.getElementById('progressContainer');
const previewContainer = document.getElementById('previewContainer');
const errorMessage = document.getElementById('errorMessage');
const pageRangeSelect = document.getElementById('pageRange');
const customRangeGroup = document.getElementById('customRangeGroup');

// Drag and drop functionality
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
  const files = e.dataTransfer.files;
  if (files.length > 0 && files[0].type === 'application/pdf') {
    handleFileSelect(files[0]);
  } else {
    showError('Please select a valid PDF file');
  }
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleFileSelect(e.target.files[0]);
  }
});

pageRangeSelect.addEventListener('change', (e) => {
  customRangeGroup.style.display = e.target.value === 'range' ? 'block' : 'none';
});

async function handleFileSelect(file) {
  currentFileName = file.name.replace('.pdf', '');
  
  try {
    hideError();
    showProgress('Loading PDF...');
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    
    showProgress('Extracting data from PDF...');
    const data = await extractDataFromPDF(pdf);
    
    if (data.length === 0) {
      throw new Error('No table data found in the PDF. Try a different extraction mode.');
    }
    
    extractedData = data;
    showPreview(data);
    
    hideProgress();
    toolOptions.style.display = 'block';
    previewContainer.style.display = 'block';
    
  } catch (error) {
    hideProgress();
    showError(`Error processing PDF: ${error.message}`);
  }
}

async function extractDataFromPDF(pdf) {
  const extractionMode = document.getElementById('extractionMode').value;
  const pageRange = document.getElementById('pageRange').value;
  const customRange = document.getElementById('customRange').value;
  
  let pagesToProcess = [];
  
  if (pageRange === 'all') {
    for (let i = 1; i <= pdf.numPages; i++) {
      pagesToProcess.push(i);
    }
  } else if (pageRange === 'current') {
    pagesToProcess = [1]; // Default to first page for demo
  } else if (pageRange === 'range' && customRange) {
    pagesToProcess = parsePageRange(customRange, pdf.numPages);
  }
  
  const allData = [];
  let hasTextContent = false;
  let hasImages = false;
  let pagesWithoutData = [];
  
  for (let pageNum of pagesToProcess) {
    updateProgress(`Processing page ${pageNum} of ${pagesToProcess.length}...`);
    
    const page = await pdf.getPage(pageNum);
    
    // Check for images on this page
    try {
      const operatorList = await page.getOperatorList();
      const hasPageImages = operatorList.fnArray.some(fn => fn === 82 || fn === 83); // Image operators
      if (hasPageImages) hasImages = true;
    } catch (e) {
      console.warn('Could not check for images on page', pageNum);
    }
    
    const textContent = await page.getTextContent();
    const textItems = textContent.items;
    
    if (textItems && textItems.length > 0) {
      hasTextContent = true;
    }
    
    let pageData;
    if (extractionMode === 'auto') {
      pageData = extractTablesFromText(textContent);
    } else if (extractionMode === 'all') {
      pageData = extractAllTextAsTable(textContent);
    } else if (extractionMode === 'structured') {
      pageData = extractStructuredData(textContent);
    } else if (extractionMode === 'smart') {
      pageData = extractSmartDetection(textContent, hasPageImages);
    } else if (extractionMode === 'force') {
      pageData = extractForceContent(textContent, page);
    } else {
      pageData = extractTablesFromText(textContent);
    }
    
    if (pageData.data && pageData.data.length > 0) {
      allData.push({
        page: pageNum,
        data: pageData.data,
        formatting: pageData.formatting || []
      });
    } else {
      pagesWithoutData.push(pageNum);
    }
  }
  
  // Enhanced error handling with specific guidance
  if (allData.length === 0) {
    let errorMessage = 'No table data found in the PDF.';
    
    if (hasImages && !hasTextContent) {
      errorMessage = `🖼️ This PDF contains images or scanned content.
      
📋 Try these solutions:
1. Change extraction mode to "All Text"
2. The PDF may be image-based - try OCR conversion first
3. For tables in images, consider using image-to-text tools
4. Check if this is a scanned document that needs text recognition`;
    } else if (!hasTextContent) {
      errorMessage = `📄 This PDF appears to be image-based or contains no readable text.
      
💡 Solutions:
1. Use OCR software to convert images to text first
2. Try a different PDF with text-based content  
3. Convert PDF pages to images and use image-to-text tools
4. Check if the PDF is corrupted or password-protected`;
    } else if (pagesWithoutData.length === pagesToProcess.length) {
      errorMessage = `📊 No structured table data detected on the selected pages.
      
🔧 Try these options:
1. Change extraction mode to "All Text" to extract any available text
2. Use "Smart Detection" mode for different content types
3. Check if the data format is different than expected (lists, paragraphs, etc.)
4. Try selecting different pages that may contain tables`;
    }
    
    throw new Error(errorMessage);
  }
  
  return allData;
}

function extractTablesFromText(textContent) {
  const items = textContent.items;
  const lines = [];
  const formatting = [];
  let currentLine = [];
  let currentLineFormatting = [];
  let lastY = null;
  
  // Group text items by Y coordinate (lines)
  items.forEach(item => {
    const y = Math.round(item.transform[5]);
    
    if (lastY !== null && Math.abs(y - lastY) > 5) {
      if (currentLine.length > 0) {
        const sortedItems = currentLine
          .map((item, index) => ({ item, formatting: currentLineFormatting[index] }))
          .sort((a, b) => a.item.transform[4] - b.item.transform[4]);
        
        lines.push(sortedItems.map(x => x.item));
        formatting.push(sortedItems.map(x => x.formatting));
        currentLine = [];
        currentLineFormatting = [];
      }
    }
    
    currentLine.push(item);
    
    // Extract formatting information
    const fontSize = Math.round(item.transform[0] || 12);
    const fontStyle = item.fontName || '';
    const textColor = item.color || '000000';
    
    currentLineFormatting.push({
      fontSize: fontSize,
      bold: fontStyle.toLowerCase().includes('bold'),
      italic: fontStyle.toLowerCase().includes('italic'),
      textColor: Array.isArray(textColor) ? rgbToHex(textColor) : textColor,
      fontFamily: fontStyle
    });
    
    lastY = y;
  });
  
  if (currentLine.length > 0) {
    const sortedItems = currentLine
      .map((item, index) => ({ item, formatting: currentLineFormatting[index] }))
      .sort((a, b) => a.item.transform[4] - b.item.transform[4]);
    
    lines.push(sortedItems.map(x => x.item));
    formatting.push(sortedItems.map(x => x.formatting));
  }
  
  // Convert lines to table data with formatting
  const tableData = [];
  const tableFormatting = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineFormat = formatting[i];
    const row = line.map(item => item.str.trim()).filter(str => str.length > 0);
    
    if (row.length > 1) { // Only include lines with multiple columns
      tableData.push(row);
      
      // Map formatting to final row structure
      const rowFormatting = [];
      let dataIndex = 0;
      
      line.forEach((item, itemIndex) => {
        if (item.str.trim().length > 0) {
          rowFormatting[dataIndex] = lineFormat[itemIndex];
          dataIndex++;
        }
      });
      
      tableFormatting.push(rowFormatting);
    }
  }
  
  return { data: tableData, formatting: tableFormatting };
}

function extractAllTextAsTable(textContent) {
  const items = textContent.items;
  const text = items.map(item => item.str).join(' ');
  
  // Split by common delimiters and create a simple table
  const lines = text.split(/[\n\r]+/).filter(line => line.trim().length > 0);
  const tableData = [];
  const tableFormatting = [];
  
  lines.forEach(line => {
    // Try to split by tabs, multiple spaces, or common separators
    let columns = line.split(/\t|  +|\|/).map(col => col.trim()).filter(col => col.length > 0);
    if (columns.length > 0) {
      tableData.push(columns);
      
      // Create basic formatting for each cell
      const rowFormatting = columns.map((col, index) => ({
        fontSize: 11,
        bold: index === 0 && /^[A-Z\s]+$/.test(col), // First column headers often bold
        italic: false,
        textColor: '000000',
        textAlign: isNumeric(col) ? 'right' : 'left'
      }));
      
      tableFormatting.push(rowFormatting);
    }
  });
  
  return { data: tableData, formatting: tableFormatting };
}

function extractStructuredData(textContent) {
  const items = textContent.items;
  const structuredData = [];
  const structuredFormatting = [];
  
  // Look for patterns that suggest tabular data
  let currentRow = [];
  let currentRowFormatting = [];
  let lastY = null;
  
  items.forEach(item => {
    const y = Math.round(item.transform[5]);
    const x = Math.round(item.transform[4]);
    const text = item.str.trim();
    
    if (text.length === 0) return;
    
    // Check if this is a new row
    if (lastY !== null && Math.abs(y - lastY) > 10) {
      if (currentRow.length > 1) {
        structuredData.push(currentRow.map(item => item.text));
        structuredFormatting.push(currentRowFormatting);
        currentRow = [];
        currentRowFormatting = [];
      }
    }
    
    currentRow.push({ x, y, text });
    
    // Extract formatting
    const fontSize = Math.round(item.transform[0] || 12);
    const fontStyle = item.fontName || '';
    
    currentRowFormatting.push({
      fontSize: fontSize,
      bold: fontStyle.toLowerCase().includes('bold'),
      italic: fontStyle.toLowerCase().includes('italic'),
      textColor: Array.isArray(item.color) ? rgbToHex(item.color) : (item.color || '000000'),
      textAlign: isNumeric(text) ? 'right' : 'left'
    });
    
    lastY = y;
  });
  
  if (currentRow.length > 1) {
    structuredData.push(currentRow.map(item => item.text));
    structuredFormatting.push(currentRowFormatting);
  }
  
  return { data: structuredData, formatting: structuredFormatting };
}

// Enhanced extraction functions for different content types

function extractSmartDetection(textContent, hasImages) {
  const items = textContent.items;
  
  if (!items || items.length === 0) {
    return { data: [], formatting: [] };
  }
  
  // First try structured table detection
  let result = extractTablesFromText(textContent);
  
  // If no structured tables found, try different approaches
  if (!result.data || result.data.length === 0) {
    // Try all text extraction
    result = extractAllTextAsTable(textContent);
    
    // If still no data and has images, provide guidance
    if ((!result.data || result.data.length === 0) && hasImages) {
      // Create a basic data structure with guidance
      const allText = items.map(item => item.str).filter(str => str.trim().length > 0);
      
      if (allText.length > 0) {
        // Group text into meaningful chunks
        const chunks = [];
        let currentChunk = [];
        
        allText.forEach(text => {
          if (text.trim().length > 0) {
            currentChunk.push(text.trim());
            // Break chunks on certain patterns
            if (text.includes('\n') || currentChunk.length >= 5) {
              if (currentChunk.length > 0) {
                chunks.push(currentChunk.join(' '));
                currentChunk = [];
              }
            }
          }
        });
        
        if (currentChunk.length > 0) {
          chunks.push(currentChunk.join(' '));
        }
        
        // Convert chunks to table format
        const tableData = chunks.map(chunk => [chunk]);
        result = { 
          data: tableData, 
          formatting: tableData.map(() => [{ 
            fontSize: 11, 
            bold: false, 
            italic: false, 
            textColor: '000000',
            textAlign: 'left'
          }])
        };
      }
    }
  }
  
  return result;
}

function extractForceContent(textContent, page) {
  const items = textContent.items;
  
  if (!items || items.length === 0) {
    return { data: [['No text content found']], formatting: [[{ fontSize: 11, bold: false, italic: false, textColor: '000000', textAlign: 'left' }]] };
  }
  
  // Extract all text with positioning
  const positionedText = items.map(item => ({
    text: item.str.trim(),
    x: Math.round(item.transform[4] || 0),
    y: Math.round(item.transform[5] || 0),
    fontSize: Math.round(item.transform[0] || 12),
    fontName: item.fontName || ''
  })).filter(item => item.text.length > 0);
  
  if (positionedText.length === 0) {
    return { data: [['No readable text found']], formatting: [[{ fontSize: 11, bold: false, italic: false, textColor: '000000', textAlign: 'left' }]] };
  }
  
  // Sort by Y position (top to bottom) then X position (left to right)
  positionedText.sort((a, b) => {
    const yDiff = b.y - a.y; // Higher Y first (top to bottom)
    if (Math.abs(yDiff) > 10) return yDiff;
    return a.x - b.x; // Left to right for same line
  });
  
  // Group into logical rows
  const rows = [];
  let currentRow = [];
  let currentRowFormatting = [];
  let lastY = null;
  
  positionedText.forEach(item => {
    if (lastY !== null && Math.abs(item.y - lastY) > 15) {
      // New row
      if (currentRow.length > 0) {
        rows.push(currentRow);
        rows.forEach((row, index) => {
          if (!currentRowFormatting[index]) currentRowFormatting[index] = [];
        });
        currentRow = [];
      }
    }
    
    currentRow.push(item.text);
    lastY = item.y;
  });
  
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }
  
  // Ensure we have data
  if (rows.length === 0) {
    const allText = positionedText.map(item => item.text).join(' ');
    rows.push([allText]);
  }
  
  // Create formatting for all cells
  const formatting = rows.map(row => 
    row.map((cell, index) => ({
      fontSize: 11,
      bold: index === 0 && /^[A-Z\s]+$/.test(cell), // First column headers often bold
      italic: false,
      textColor: '000000',
      textAlign: isNumeric(cell) ? 'right' : 'left'
    }))
  );
  
  return { data: rows, formatting: formatting };
}

// Helper function to convert RGB array to hex
function rgbToHex(rgb) {
  if (!Array.isArray(rgb) || rgb.length < 3) return '000000';
  
  const toHex = (val) => {
    const hex = Math.round(val * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return toHex(rgb[0]) + toHex(rgb[1]) + toHex(rgb[2]);
}

function parsePageRange(rangeStr, maxPages) {
  const pages = [];
  const parts = rangeStr.split(',');
  
  parts.forEach(part => {
    part = part.trim();
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim()));
      for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
        if (!pages.includes(i)) pages.push(i);
      }
    } else {
      const page = parseInt(part);
      if (page >= 1 && page <= maxPages && !pages.includes(page)) {
        pages.push(page);
      }
    }
  });
  
  return pages.sort((a, b) => a - b);
}

function showPreview(data) {
  const previewContent = document.getElementById('previewContent');
  let html = '';
  
  data.forEach((pageData, index) => {
    html += `<h4>Page ${pageData.page}</h4>`;
    
    if (pageData.data && pageData.data.length > 0) {
      html += '<div class="table-preview">';
      html += '<table class="preview-table">';
      
      pageData.data.forEach((row, rowIndex) => {
        html += '<tr>';
        row.forEach((cell, cellIndex) => {
          const tag = rowIndex === 0 ? 'th' : 'td';
          let style = '';
          
          // Apply formatting if available
          if (pageData.formatting && 
              pageData.formatting[rowIndex] && 
              pageData.formatting[rowIndex][cellIndex]) {
            const format = pageData.formatting[rowIndex][cellIndex];
            const styles = [];
            
            if (format.bold) styles.push('font-weight: bold');
            if (format.italic) styles.push('font-style: italic');
            if (format.fontSize) styles.push(`font-size: ${format.fontSize}px`);
            if (format.textColor && format.textColor !== '000000') {
              styles.push(`color: #${format.textColor}`);
            }
            if (format.textAlign) styles.push(`text-align: ${format.textAlign}`);
            
            if (styles.length > 0) {
              style = ` style="${styles.join('; ')}"`;
            }
          }
          
          html += `<${tag}${style}>${escapeHtml(cell)}</${tag}>`;
        });
        html += '</tr>';
      });
      
      html += '</table>';
      html += '</div>';
      
      // Show formatting info
      if (pageData.formatting && pageData.formatting.length > 0) {
        html += '<div class="formatting-info">';
        html += '<p><small><em>✨ Professional formatting detected and will be preserved in Excel export:</em></small></p>';
        html += '<ul><li>🎨 Header styling with blue background</li>';
        html += '<li>💰 Currency formatting for monetary values</li>';
        html += '<li>📊 Number alignment and thousand separators</li>';
        html += '<li>📋 Alternating row colors for readability</li>';
        html += '<li>🔲 Professional borders and cell styling</li></ul>';
        html += '</div>';
      } else {
        html += '<div class="formatting-info">';
        html += '<p><small><em>📊 Standard Excel formatting will be applied (headers, borders, number formatting)</em></small></p>';
        html += '</div>';
      }
    } else {
      html += '<p>No table data found on this page.</p>';
    }
  });
  
  previewContent.innerHTML = html;
}

function downloadExtractedData() {
  const outputFormat = document.getElementById('outputFormat').value;
  
  if (outputFormat === 'xlsx') {
    downloadAsExcel();
  } else if (outputFormat === 'csv') {
    downloadAsCSV();
  } else if (outputFormat === 'json') {
    downloadAsJSON();
  }
}

function downloadAsExcel() {
  const workbook = XLSX.utils.book_new();
  const preserveFormatting = document.getElementById('preserveFormatting').checked;
  
  extractedData.forEach((pageData, index) => {
    if (pageData.data.length > 0) {
      const worksheet = createFormattedWorksheet(
        pageData.data, 
        preserveFormatting ? (pageData.formatting || []) : []
      );
      XLSX.utils.book_append_sheet(workbook, worksheet, `Page_${pageData.page}`);
    }
  });
  
  if (workbook.SheetNames.length === 0) {
    showError('No data to export');
    return;
  }
  
  // Write file with advanced formatting
  const wbout = XLSX.write(workbook, { 
    bookType: 'xlsx', 
    type: 'binary',
    cellStyles: true,
    sheetStubs: false
  });
  
  // Convert to blob and download
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${currentFileName}_extracted.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper function to convert string to ArrayBuffer
function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

function createFormattedWorksheet(data, formatting) {
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  
  // Set column widths based on content
  const columnWidths = [];
  data.forEach(row => {
    row.forEach((cell, colIndex) => {
      const cellLength = String(cell).length;
      if (!columnWidths[colIndex] || columnWidths[colIndex] < cellLength) {
        columnWidths[colIndex] = Math.min(Math.max(cellLength + 2, 10), 50); // Min 10, Max 50
      }
    });
  });
  
  worksheet['!cols'] = columnWidths.map(width => ({ wch: width }));
  
  // Get the range of the worksheet
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  
  // Apply formatting to each cell
  for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex++) {
    for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
      const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
      const cell = worksheet[cellAddress];
      
      if (cell) {
        // Initialize cell style object
        if (!cell.s) cell.s = {};
        
        // Header row formatting (first row)
        if (rowIndex === 0) {
          cell.s = {
            font: { 
              bold: true, 
              color: { rgb: "FFFFFF" },
              size: 12,
              name: "Calibri"
            },
            fill: { 
              fgColor: { rgb: "4472C4" },
              patternType: "solid"
            },
            alignment: { 
              horizontal: "center", 
              vertical: "center",
              wrapText: false
            },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } }
            }
          };
        } else {
          // Data row formatting
          const isEvenRow = rowIndex % 2 === 0;
          
          cell.s = {
            font: { 
              size: 11,
              color: { rgb: "000000" },
              name: "Calibri"
            },
            alignment: { 
              horizontal: detectAlignment(cell.v),
              vertical: "center",
              wrapText: true
            },
            border: {
              top: { style: "thin", color: { rgb: "D0D0D0" } },
              bottom: { style: "thin", color: { rgb: "D0D0D0" } },
              left: { style: "thin", color: { rgb: "D0D0D0" } },
              right: { style: "thin", color: { rgb: "D0D0D0" } }
            },
            fill: {
              fgColor: { rgb: isEvenRow ? "F2F2F2" : "FFFFFF" },
              patternType: "solid"
            }
          };
          
          // Apply number formatting based on content
          const cellValue = String(cell.v).trim();
          
          if (isNumeric(cellValue)) {
            cell.t = 'n';
            const numValue = parseFloat(cellValue.replace(/[,$]/g, ''));
            cell.v = numValue;
            
            // Format based on value type
            if (isCurrency(cellValue)) {
              cell.s.numFmt = '"$"#,##0.00';
            } else if (isPercentage(cellValue)) {
              cell.s.numFmt = '0.00%';
              cell.v = numValue / 100; // Convert percentage to decimal
            } else if (Number.isInteger(numValue)) {
              cell.s.numFmt = '#,##0';
            } else {
              cell.s.numFmt = '#,##0.00';
            }
          } else if (isDate(cellValue)) {
            cell.t = 'd';
            cell.s.numFmt = 'mm/dd/yyyy';
          }
        }
        
        // Apply specific formatting from PDF analysis if available
        if (formatting[rowIndex] && formatting[rowIndex][colIndex]) {
          const cellFormat = formatting[rowIndex][colIndex];
          
          if (cellFormat.bold) {
            cell.s.font.bold = true;
          }
          
          if (cellFormat.italic) {
            cell.s.font.italic = true;
          }
          
          if (cellFormat.fontSize && cellFormat.fontSize > 8) {
            cell.s.font.size = Math.min(18, cellFormat.fontSize);
          }
          
          if (cellFormat.textAlign) {
            cell.s.alignment.horizontal = cellFormat.textAlign;
          }
          
          if (cellFormat.backgroundColor && cellFormat.backgroundColor !== 'FFFFFF') {
            cell.s.fill = { 
              fgColor: { rgb: cellFormat.backgroundColor },
              patternType: "solid"
            };
          }
          
          if (cellFormat.textColor && cellFormat.textColor !== '000000') {
            cell.s.font.color = { rgb: cellFormat.textColor };
          }
        }
      }
    }
  }
  
  // Set row heights for better appearance
  const rows = [];
  for (let i = 0; i <= range.e.r; i++) {
    if (i === 0) {
      rows.push({ hpt: 30 }); // Header row height
    } else {
      // Calculate row height based on content length
      let maxContentLength = 0;
      for (let j = range.s.c; j <= range.e.c; j++) {
        const cellAddress = XLSX.utils.encode_cell({ r: i, c: j });
        const cell = worksheet[cellAddress];
        if (cell && cell.v) {
          const contentLength = String(cell.v).length;
          maxContentLength = Math.max(maxContentLength, contentLength);
        }
      }
      const height = Math.max(20, Math.min(40, 20 + (maxContentLength / 50) * 10));
      rows.push({ hpt: height });
    }
  }
  worksheet['!rows'] = rows;
  
  return worksheet;
}

function isNumeric(value) {
  if (typeof value === 'number') return true;
  const str = String(value).trim().replace(/[,$]/g, '');
  return !isNaN(parseFloat(str)) && isFinite(str);
}

function isCurrency(value) {
  const str = String(value).trim();
  // Check for currency patterns: $1234.56, 1234.56, 164796.00, etc.
  return /^\$?\d{1,3}(,\d{3})*(\.\d{2})?$/.test(str) || 
         /^\d+\.\d{2}$/.test(str) ||
         (isNumeric(str) && parseFloat(str.replace(/[,$]/g, '')) > 100);
}

function isPercentage(value) {
  const str = String(value).trim();
  return /%/.test(str) || (isNumeric(str) && parseFloat(str) <= 1 && parseFloat(str) >= 0);
}

function isDate(value) {
  const str = String(value).trim();
  const datePatterns = [
    /^\d{1,2}\/\d{1,2}\/\d{4}$/,
    /^\d{4}-\d{2}-\d{2}$/,
    /^\d{1,2}-\d{1,2}-\d{4}$/,
    /^[A-Za-z]{3}\s\d{1,2},?\s\d{4}$/
  ];
  
  return datePatterns.some(pattern => pattern.test(str)) && !isNumeric(str);
}

function detectAlignment(value) {
  const str = String(value).trim();
  
  // Numbers and currency align right
  if (isNumeric(str) || isCurrency(str)) {
    return "right";
  }
  
  // Short uppercase text (likely headers) center
  if (str.length <= 15 && /^[A-Z\s]+$/.test(str)) {
    return "center";
  }
  
  // Everything else aligns left
  return "left";
}

function downloadAsCSV() {
  let csvContent = '';
  
  extractedData.forEach((pageData, index) => {
    if (index > 0) csvContent += '\n\n';
    csvContent += `--- Page ${pageData.page} ---\n`;
    
    pageData.data.forEach(row => {
      csvContent += row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',') + '\n';
    });
  });
  
  downloadFile(csvContent, `${currentFileName}_extracted.csv`, 'text/csv');
}

function downloadAsJSON() {
  const jsonData = {
    filename: currentFileName,
    extractedAt: new Date().toISOString(),
    pages: extractedData
  };
  
  downloadFile(JSON.stringify(jsonData, null, 2), `${currentFileName}_extracted.json`, 'application/json');
}

function downloadFile(content, filename, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function showProgress(message) {
  progressContainer.style.display = 'block';
  updateProgress(message);
}

function updateProgress(message) {
  document.getElementById('progressText').textContent = message;
}

function hideProgress() {
  progressContainer.style.display = 'none';
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

function hideError() {
  errorMessage.style.display = 'none';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
</script>

<style>
.tool-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.tool-header {
  text-align: center;
  margin-bottom: 30px;
}

.tool-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.upload-area {
  border: 2px dashed #3498db;
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-area.drag-over {
  border-color: #2980b9;
  background-color: #ecf0f1;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.upload-icon {
  font-size: 48px;
  color: #3498db;
}

.upload-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
}

.upload-btn:hover {
  background: #2980b9;
}

.tool-options {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.option-group label {
  font-weight: 600;
  color: #2c3e50;
}

.option-group select,
.option-group input {
  padding: 8px 12px;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
  font-size: 14px;
}

.progress-container {
  margin: 20px 0;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background: #ecf0f1;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2980b9);
  width: 0%;
  transition: width 0.3s ease;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.progress-text {
  text-align: center;
  color: #7f8c8d;
  font-size: 14px;
}

.preview-container {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.table-preview {
  max-height: 400px;
  overflow: auto;
  margin: 15px 0;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.preview-table th {
  background: #3498db;
  color: white;
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
}

.preview-table td {
  padding: 10px 8px;
  border-bottom: 1px solid #ecf0f1;
}

.preview-table tr:nth-child(even) {
  background: #f8f9fa;
}

.formatting-info {
  margin-top: 10px;
  padding: 8px 12px;
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  border-radius: 4px;
}

.formatting-info p {
  margin: 0;
  color: #1976d2;
}

.download-section {
  text-align: center;
  margin-top: 20px;
}

.download-btn {
  background: #27ae60;
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background 0.3s ease;
}

.download-btn:hover {
  background: #219a52;
}

.error-message {
  background: #e74c3c;
  color: white;
  padding: 15px;
  border-radius: 5px;
  margin: 10px 0;
  text-align: center;
}

@media (max-width: 768px) {
  .tool-container {
    padding: 15px;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .upload-area {
    padding: 30px 20px;
  }
  
  .preview-table {
    font-size: 14px;
  }
  
  .preview-table th,
  .preview-table td {
    padding: 8px 6px;
  }
}
</style>
