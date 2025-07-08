---
layout: tool
title: "Color Picker - Free Online Color Tool"
description: "Pick colors, convert between color formats (HEX, RGB, HSL, HSV), generate color palettes, and explore color harmonies. Free online color tools."
tool_name: "Color Picker"
permalink: /tools/color-picker/
---

<div class="tool-container">
  <div class="tool-header">
    <h1>Color Picker & Converter</h1>
    <p>Pick colors, convert formats, and generate beautiful palettes</p>
  </div>

  <div class="color-main">
    <div class="color-picker-section">
      <div class="color-display">
        <div class="color-preview" id="colorPreview"></div>
        <div class="color-info">
          <h3 id="colorName">Select a Color</h3>
          <div class="color-formats">
            <div class="format-group">
              <label>HEX:</label>
              <input type="text" id="hexInput" placeholder="#000000">
              <button class="copy-btn" data-format="hex">📋</button>
            </div>
            <div class="format-group">
              <label>RGB:</label>
              <input type="text" id="rgbInput" placeholder="rgb(0, 0, 0)">
              <button class="copy-btn" data-format="rgb">📋</button>
            </div>
            <div class="format-group">
              <label>HSL:</label>
              <input type="text" id="hslInput" placeholder="hsl(0, 0%, 0%)">
              <button class="copy-btn" data-format="hsl">📋</button>
            </div>
            <div class="format-group">
              <label>HSV:</label>
              <input type="text" id="hsvInput" placeholder="hsv(0, 0%, 0%)">
              <button class="copy-btn" data-format="hsv">📋</button>
            </div>
          </div>
        </div>
      </div>

      <div class="picker-controls">
        <div class="picker-canvas-container">
          <canvas id="colorCanvas" width="300" height="300"></canvas>
          <div class="canvas-cursor" id="canvasCursor"></div>
        </div>
        <div class="hue-slider-container">
          <canvas id="hueCanvas" width="30" height="300"></canvas>
          <div class="hue-cursor" id="hueCursor"></div>
        </div>
      </div>
    </div>

    <div class="color-tools">
      <div class="quick-colors">
        <h3>Quick Colors</h3>
        <div class="preset-colors">
          <div class="preset-color" data-color="#FF0000" style="background: #FF0000;" title="Red"></div>
          <div class="preset-color" data-color="#00FF00" style="background: #00FF00;" title="Green"></div>
          <div class="preset-color" data-color="#0000FF" style="background: #0000FF;" title="Blue"></div>
          <div class="preset-color" data-color="#FFFF00" style="background: #FFFF00;" title="Yellow"></div>
          <div class="preset-color" data-color="#FF00FF" style="background: #FF00FF;" title="Magenta"></div>
          <div class="preset-color" data-color="#00FFFF" style="background: #00FFFF;" title="Cyan"></div>
          <div class="preset-color" data-color="#FFA500" style="background: #FFA500;" title="Orange"></div>
          <div class="preset-color" data-color="#800080" style="background: #800080;" title="Purple"></div>
          <div class="preset-color" data-color="#FFC0CB" style="background: #FFC0CB;" title="Pink"></div>
          <div class="preset-color" data-color="#A52A2A" style="background: #A52A2A;" title="Brown"></div>
          <div class="preset-color" data-color="#808080" style="background: #808080;" title="Gray"></div>
          <div class="preset-color" data-color="#000000" style="background: #000000;" title="Black"></div>
          <div class="preset-color" data-color="#FFFFFF" style="background: #FFFFFF; border: 1px solid #ddd;" title="White"></div>
        </div>
      </div>

      <div class="color-harmony">
        <h3>Color Harmony</h3>
        <div class="harmony-controls">
          <select id="harmonyType">
            <option value="complementary">Complementary</option>
            <option value="triadic">Triadic</option>
            <option value="tetradic">Tetradic</option>
            <option value="analogous">Analogous</option>
            <option value="monochromatic">Monochromatic</option>
            <option value="split-complementary">Split Complementary</option>
          </select>
          <button id="generateHarmony">Generate</button>
        </div>
        <div class="harmony-colors" id="harmonyColors"></div>
      </div>

      <div class="color-variations">
        <h3>Variations</h3>
        <div class="variation-controls">
          <button id="generateTints">Tints</button>
          <button id="generateShades">Shades</button>
          <button id="generateTones">Tones</button>
        </div>
        <div class="variation-colors" id="variationColors"></div>
      </div>
    </div>
  </div>

  <div class="color-history">
    <h3>Color History</h3>
    <div class="history-colors" id="historyColors">
      <p class="history-placeholder">Colors you pick will appear here</p>
    </div>
    <div class="history-controls">
      <button id="clearHistory">Clear History</button>
      <button id="exportHistory">Export Palette</button>
    </div>
  </div>

  <div class="success-message" id="successMessage" style="display: none;"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const colorCanvas = document.getElementById('colorCanvas');
    const hueCanvas = document.getElementById('hueCanvas');
    const colorCtx = colorCanvas.getContext('2d');
    const hueCtx = hueCanvas.getContext('2d');
    const colorPreview = document.getElementById('colorPreview');
    const canvasCursor = document.getElementById('canvasCursor');
    const hueCursor = document.getElementById('hueCursor');
    
    let currentHue = 0;
    let currentSaturation = 100;
    let currentLightness = 50;
    let colorHistory = [];
    
    // Initialize the color picker
    initializeColorPicker();
    
    function initializeColorPicker() {
        drawHueCanvas();
        drawColorCanvas();
        updateColor();
        
        // Canvas event listeners
        colorCanvas.addEventListener('mousedown', startColorDrag);
        hueCanvas.addEventListener('mousedown', startHueDrag);
        
        // Input event listeners
        document.getElementById('hexInput').addEventListener('input', handleHexInput);
        document.getElementById('rgbInput').addEventListener('input', handleRgbInput);
        document.getElementById('hslInput').addEventListener('input', handleHslInput);
        document.getElementById('hsvInput').addEventListener('input', handleHsvInput);
        
        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const format = btn.dataset.format;
                const input = document.getElementById(format + 'Input');
                copyToClipboard(input.value);
            });
        });
        
        // Preset colors
        document.querySelectorAll('.preset-color').forEach(preset => {
            preset.addEventListener('click', () => {
                const color = preset.dataset.color;
                setColorFromHex(color);
            });
        });
        
        // Harmony controls
        document.getElementById('generateHarmony').addEventListener('click', generateColorHarmony);
        
        // Variation controls
        document.getElementById('generateTints').addEventListener('click', () => generateVariations('tints'));
        document.getElementById('generateShades').addEventListener('click', () => generateVariations('shades'));
        document.getElementById('generateTones').addEventListener('click', () => generateVariations('tones'));
        
        // History controls
        document.getElementById('clearHistory').addEventListener('click', clearColorHistory);
        document.getElementById('exportHistory').addEventListener('click', exportColorHistory);
    }
    
    function drawHueCanvas() {
        const gradient = hueCtx.createLinearGradient(0, 0, 0, hueCanvas.height);
        for (let i = 0; i <= 360; i += 60) {
            gradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
        }
        hueCtx.fillStyle = gradient;
        hueCtx.fillRect(0, 0, hueCanvas.width, hueCanvas.height);
    }
    
    function drawColorCanvas() {
        // Clear canvas
        colorCtx.clearRect(0, 0, colorCanvas.width, colorCanvas.height);
        
        // Create saturation gradient (left to right)
        const satGradient = colorCtx.createLinearGradient(0, 0, colorCanvas.width, 0);
        satGradient.addColorStop(0, '#FFFFFF');
        satGradient.addColorStop(1, `hsl(${currentHue}, 100%, 50%)`);
        colorCtx.fillStyle = satGradient;
        colorCtx.fillRect(0, 0, colorCanvas.width, colorCanvas.height);
        
        // Create lightness gradient (top to bottom)
        const lightGradient = colorCtx.createLinearGradient(0, 0, 0, colorCanvas.height);
        lightGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        lightGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        colorCtx.fillStyle = lightGradient;
        colorCtx.fillRect(0, 0, colorCanvas.width, colorCanvas.height);
    }
    
    function startColorDrag(e) {
        updateColorFromCanvas(e);
        
        function onMouseMove(e) {
            updateColorFromCanvas(e);
        }
        
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
    
    function startHueDrag(e) {
        updateHueFromCanvas(e);
        
        function onMouseMove(e) {
            updateHueFromCanvas(e);
        }
        
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
    
    function updateColorFromCanvas(e) {
        const rect = colorCanvas.getBoundingClientRect();
        const x = Math.max(0, Math.min(colorCanvas.width, e.clientX - rect.left));
        const y = Math.max(0, Math.min(colorCanvas.height, e.clientY - rect.top));
        
        currentSaturation = (x / colorCanvas.width) * 100;
        currentLightness = 100 - (y / colorCanvas.height) * 100;
        
        updateColor();
        updateCanvasCursor(x, y);
    }
    
    function updateHueFromCanvas(e) {
        const rect = hueCanvas.getBoundingClientRect();
        const y = Math.max(0, Math.min(hueCanvas.height, e.clientY - rect.top));
        
        currentHue = (y / hueCanvas.height) * 360;
        
        drawColorCanvas();
        updateColor();
        updateHueCursor(y);
    }
    
    function updateCanvasCursor(x, y) {
        canvasCursor.style.left = x + 'px';
        canvasCursor.style.top = y + 'px';
    }
    
    function updateHueCursor(y) {
        hueCursor.style.top = y + 'px';
    }
    
    function updateColor() {
        const hsl = `hsl(${Math.round(currentHue)}, ${Math.round(currentSaturation)}%, ${Math.round(currentLightness)}%)`;
        const rgb = hslToRgb(currentHue, currentSaturation, currentLightness);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        const hsv = hslToHsv(currentHue, currentSaturation, currentLightness);
        
        // Update preview
        colorPreview.style.backgroundColor = hsl;
        
        // Update inputs
        document.getElementById('hexInput').value = hex;
        document.getElementById('rgbInput').value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        document.getElementById('hslInput').value = hsl;
        document.getElementById('hsvInput').value = `hsv(${Math.round(currentHue)}, ${Math.round(hsv.s)}%, ${Math.round(hsv.v)}%)`;
        
        // Update color name
        document.getElementById('colorName').textContent = getColorName(hex);
        
        // Add to history
        addToHistory(hex);
    }
    
    function setColorFromHex(hex) {
        const rgb = hexToRgb(hex);
        if (!rgb) return;
        
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        currentHue = hsl.h;
        currentSaturation = hsl.s;
        currentLightness = hsl.l;
        
        drawColorCanvas();
        updateColor();
        
        // Update cursors
        const x = (currentSaturation / 100) * colorCanvas.width;
        const y = ((100 - currentLightness) / 100) * colorCanvas.height;
        const hueY = (currentHue / 360) * hueCanvas.height;
        
        updateCanvasCursor(x, y);
        updateHueCursor(hueY);
    }
    
    function handleHexInput(e) {
        const hex = e.target.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            setColorFromHex(hex);
        }
    }
    
    function handleRgbInput(e) {
        const rgbMatch = e.target.value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
            const r = parseInt(rgbMatch[1]);
            const g = parseInt(rgbMatch[2]);
            const b = parseInt(rgbMatch[3]);
            if (r <= 255 && g <= 255 && b <= 255) {
                const hex = rgbToHex(r, g, b);
                setColorFromHex(hex);
            }
        }
    }
    
    function handleHslInput(e) {
        const hslMatch = e.target.value.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (hslMatch) {
            currentHue = parseInt(hslMatch[1]);
            currentSaturation = parseInt(hslMatch[2]);
            currentLightness = parseInt(hslMatch[3]);
            
            drawColorCanvas();
            updateColor();
            
            const x = (currentSaturation / 100) * colorCanvas.width;
            const y = ((100 - currentLightness) / 100) * colorCanvas.height;
            const hueY = (currentHue / 360) * hueCanvas.height;
            
            updateCanvasCursor(x, y);
            updateHueCursor(hueY);
        }
    }
    
    function handleHsvInput(e) {
        const hsvMatch = e.target.value.match(/hsv\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (hsvMatch) {
            const h = parseInt(hsvMatch[1]);
            const s = parseInt(hsvMatch[2]);
            const v = parseInt(hsvMatch[3]);
            
            const hsl = hsvToHsl(h, s, v);
            currentHue = hsl.h;
            currentSaturation = hsl.s;
            currentLightness = hsl.l;
            
            drawColorCanvas();
            updateColor();
            
            const x = (currentSaturation / 100) * colorCanvas.width;
            const y = ((100 - currentLightness) / 100) * colorCanvas.height;
            const hueY = (currentHue / 360) * hueCanvas.height;
            
            updateCanvasCursor(x, y);
            updateHueCursor(hueY);
        }
    }
    
    function generateColorHarmony() {
        const harmonyType = document.getElementById('harmonyType').value;
        const harmonyColors = document.getElementById('harmonyColors');
        let colors = [];
        
        switch (harmonyType) {
            case 'complementary':
                colors = [
                    currentHue,
                    (currentHue + 180) % 360
                ];
                break;
            case 'triadic':
                colors = [
                    currentHue,
                    (currentHue + 120) % 360,
                    (currentHue + 240) % 360
                ];
                break;
            case 'tetradic':
                colors = [
                    currentHue,
                    (currentHue + 90) % 360,
                    (currentHue + 180) % 360,
                    (currentHue + 270) % 360
                ];
                break;
            case 'analogous':
                colors = [
                    (currentHue - 30 + 360) % 360,
                    currentHue,
                    (currentHue + 30) % 360
                ];
                break;
            case 'monochromatic':
                colors = [currentHue, currentHue, currentHue, currentHue];
                break;
            case 'split-complementary':
                colors = [
                    currentHue,
                    (currentHue + 150) % 360,
                    (currentHue + 210) % 360
                ];
                break;
        }
        
        harmonyColors.innerHTML = '';
        colors.forEach((hue, index) => {
            const sat = harmonyType === 'monochromatic' ? [100, 75, 50, 25][index] || currentSaturation : currentSaturation;
            const light = harmonyType === 'monochromatic' ? [25, 50, 75, 90][index] || currentLightness : currentLightness;
            const color = `hsl(${hue}, ${sat}%, ${light}%)`;
            const rgb = hslToRgb(hue, sat, light);
            const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
            
            const colorDiv = document.createElement('div');
            colorDiv.className = 'harmony-color';
            colorDiv.style.backgroundColor = color;
            colorDiv.title = hex;
            colorDiv.addEventListener('click', () => {
                setColorFromHex(hex);
                copyToClipboard(hex);
            });
            harmonyColors.appendChild(colorDiv);
        });
    }
    
    function generateVariations(type) {
        const variationColors = document.getElementById('variationColors');
        variationColors.innerHTML = '';
        
        const baseRgb = hslToRgb(currentHue, currentSaturation, currentLightness);
        
        for (let i = 0; i < 5; i++) {
            let r = baseRgb.r, g = baseRgb.g, b = baseRgb.b;
            const factor = (i + 1) * 0.2;
            
            if (type === 'tints') {
                // Mix with white
                r = Math.round(r + (255 - r) * factor);
                g = Math.round(g + (255 - g) * factor);
                b = Math.round(b + (255 - b) * factor);
            } else if (type === 'shades') {
                // Mix with black
                r = Math.round(r * (1 - factor));
                g = Math.round(g * (1 - factor));
                b = Math.round(b * (1 - factor));
            } else if (type === 'tones') {
                // Mix with gray
                const gray = 128;
                r = Math.round(r + (gray - r) * factor);
                g = Math.round(g + (gray - g) * factor);
                b = Math.round(b + (gray - b) * factor);
            }
            
            const hex = rgbToHex(r, g, b);
            const colorDiv = document.createElement('div');
            colorDiv.className = 'variation-color';
            colorDiv.style.backgroundColor = hex;
            colorDiv.title = hex;
            colorDiv.addEventListener('click', () => {
                setColorFromHex(hex);
                copyToClipboard(hex);
            });
            variationColors.appendChild(colorDiv);
        }
    }
    
    function addToHistory(hex) {
        if (!colorHistory.includes(hex)) {
            colorHistory.unshift(hex);
            if (colorHistory.length > 20) {
                colorHistory.pop();
            }
            updateHistoryDisplay();
        }
    }
    
    function updateHistoryDisplay() {
        const historyColors = document.getElementById('historyColors');
        if (colorHistory.length === 0) {
            historyColors.innerHTML = '<p class="history-placeholder">Colors you pick will appear here</p>';
            return;
        }
        
        historyColors.innerHTML = '';
        colorHistory.forEach(hex => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'history-color';
            colorDiv.style.backgroundColor = hex;
            colorDiv.title = hex;
            colorDiv.addEventListener('click', () => {
                setColorFromHex(hex);
                copyToClipboard(hex);
            });
            historyColors.appendChild(colorDiv);
        });
    }
    
    function clearColorHistory() {
        colorHistory = [];
        updateHistoryDisplay();
        showSuccess('Color history cleared');
    }
    
    function exportColorHistory() {
        if (colorHistory.length === 0) {
            showSuccess('No colors to export');
            return;
        }
        
        const palette = {
            name: 'Color Palette',
            colors: colorHistory.map(hex => ({
                hex: hex,
                rgb: hexToRgb(hex),
                name: getColorName(hex)
            }))
        };
        
        const blob = new Blob([JSON.stringify(palette, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'color-palette.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showSuccess('Color palette exported');
    }
    
    // Color conversion functions
    function hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h * 12) % 12;
            return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        };
        
        return {
            r: Math.round(f(0) * 255),
            g: Math.round(f(8) * 255),
            b: Math.round(f(4) * 255)
        };
    }
    
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }
    
    function hslToHsv(h, s, l) {
        s /= 100;
        l /= 100;
        
        const v = l + s * Math.min(l, 1 - l);
        const newS = v === 0 ? 0 : 2 * (1 - l / v);
        
        return {
            h: h,
            s: newS * 100,
            v: v * 100
        };
    }
    
    function hsvToHsl(h, s, v) {
        s /= 100;
        v /= 100;
        
        const l = v * (1 - s / 2);
        const newS = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
        
        return {
            h: h,
            s: newS * 100,
            l: l * 100
        };
    }
    
    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('').toUpperCase();
    }
    
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    function getColorName(hex) {
        // Simple color name mapping
        const colorNames = {
            '#FF0000': 'Red',
            '#00FF00': 'Green',
            '#0000FF': 'Blue',
            '#FFFF00': 'Yellow',
            '#FF00FF': 'Magenta',
            '#00FFFF': 'Cyan',
            '#000000': 'Black',
            '#FFFFFF': 'White',
            '#808080': 'Gray',
            '#FFA500': 'Orange',
            '#800080': 'Purple',
            '#FFC0CB': 'Pink',
            '#A52A2A': 'Brown'
        };
        
        return colorNames[hex.toUpperCase()] || hex;
    }
    
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showSuccess(`Copied ${text} to clipboard`);
        }).catch(() => {
            showSuccess('Failed to copy to clipboard');
        });
    }
    
    function showSuccess(message) {
        const successElement = document.getElementById('successMessage');
        successElement.textContent = message;
        successElement.style.display = 'block';
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 3000);
    }
});
</script>

<style>
.tool-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.tool-header {
    text-align: center;
    margin-bottom: 30px;
}

.tool-header h1 {
    color: #333;
    margin-bottom: 10px;
}

.tool-header p {
    color: #666;
    font-size: 1.1rem;
}

.color-main {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
    margin-bottom: 30px;
}

.color-picker-section {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.color-display {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
}

.color-preview {
    width: 100px;
    height: 100px;
    border-radius: 12px;
    border: 3px solid #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    background: #000;
}

.color-info {
    flex: 1;
}

.color-info h3 {
    margin-bottom: 15px;
    color: #333;
}

.color-formats {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.format-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.format-group label {
    width: 40px;
    font-weight: 500;
    color: #666;
}

.format-group input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-family: monospace;
}

.copy-btn {
    padding: 8px 12px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.copy-btn:hover {
    background: #5a67d8;
}

.picker-controls {
    display: flex;
    gap: 20px;
}

.picker-canvas-container, .hue-slider-container {
    position: relative;
}

#colorCanvas {
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: crosshair;
}

#hueCanvas {
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
}

.canvas-cursor {
    position: absolute;
    width: 12px;
    height: 12px;
    border: 2px solid white;
    border-radius: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 0 1px rgba(0,0,0,0.3);
}

.hue-cursor {
    position: absolute;
    width: 100%;
    height: 4px;
    background: white;
    border: 1px solid #333;
    pointer-events: none;
    transform: translateY(-50%);
}

.color-tools {
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.color-tools h3 {
    margin-bottom: 15px;
    color: #333;
    font-size: 1.1rem;
}

.preset-colors {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(30px, 1fr));
    gap: 8px;
}

.preset-color {
    width: 30px;
    height: 30px;
    border-radius: 6px;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.preset-color:hover {
    transform: scale(1.1);
}

.harmony-controls {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.harmony-controls select {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
}

.harmony-controls button {
    padding: 8px 16px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.harmony-controls button:hover {
    background: #5a67d8;
}

.harmony-colors, .variation-colors {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.harmony-color, .variation-color {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    cursor: pointer;
    transition: transform 0.2s ease;
    border: 1px solid rgba(0,0,0,0.1);
}

.harmony-color:hover, .variation-color:hover {
    transform: scale(1.1);
}

.variation-controls {
    display: flex;
    gap: 8px;
    margin-bottom: 15px;
}

.variation-controls button {
    padding: 6px 12px;
    background: #e9ecef;
    color: #333;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.3s ease;
}

.variation-controls button:hover {
    background: #dee2e6;
}

.color-history {
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.color-history h3 {
    margin-bottom: 15px;
    color: #333;
}

.history-colors {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 15px;
    min-height: 50px;
    align-items: center;
}

.history-placeholder {
    color: #666;
    font-style: italic;
    margin: 0;
}

.history-color {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    cursor: pointer;
    transition: transform 0.2s ease;
    border: 1px solid rgba(0,0,0,0.1);
}

.history-color:hover {
    transform: scale(1.1);
}

.history-controls {
    display: flex;
    gap: 10px;
}

.history-controls button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.3s ease;
}

#clearHistory {
    background: #dc3545;
    color: white;
}

#clearHistory:hover {
    background: #c82333;
}

#exportHistory {
    background: #28a745;
    color: white;
}

#exportHistory:hover {
    background: #218838;
}

.success-message {
    background: #d4edda;
    color: #155724;
    padding: 12px 20px;
    border-radius: 8px;
    margin: 20px 0;
    border: 1px solid #c3e6cb;
    text-align: center;
}

@media (max-width: 968px) {
    .color-main {
        grid-template-columns: 1fr;
    }
    
    .color-display {
        flex-direction: column;
        align-items: center;
    }
    
    .picker-controls {
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .tool-container {
        padding: 15px;
    }
    
    .color-picker-section, .color-tools, .color-history {
        padding: 20px;
    }
    
    .color-display {
        gap: 15px;
    }
    
    .picker-controls {
        flex-direction: column;
        align-items: center;
    }
    
    .format-group {
        flex-wrap: wrap;
    }
    
    .format-group label {
        width: auto;
    }
    
    .preset-colors {
        grid-template-columns: repeat(6, 1fr);
    }
    
    .harmony-controls {
        flex-direction: column;
    }
    
    .variation-controls {
        flex-wrap: wrap;
    }
    
    .history-controls {
        flex-direction: column;
    }
}
</style>
