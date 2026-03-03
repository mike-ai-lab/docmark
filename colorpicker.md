**1. `manifest.json**`

```json
{
  "manifest_version": 3,
  "name": "Color Picker",
  "version": "1.0",
  "description": "Pick colors from any webpage and easily copy HEX, RGB, and HSL codes.",
  "action": {
    "default_popup": "popup.html"
  },
  "permissions": [
    "activeTab"
  ]
}

```

**2. `popup.html**`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Color Picker</title>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <div class="container">
    <button id="pick-color-btn">Pick Color from Screen</button>
    
    <div id="color-display" class="color-display"></div>
    
    <div class="color-info" id="hex-container" title="Click to copy HEX">
      <span class="label">HEX:</span>
      <span class="value" id="hex-value">-</span>
    </div>
    
    <div class="color-info" id="rgb-container" title="Click to copy RGB">
      <span class="label">RGB:</span>
      <span class="value" id="rgb-value">-</span>
    </div>
    
    <div class="color-info" id="hsl-container" title="Click to copy HSL">
      <span class="label">HSL:</span>
      <span class="value" id="hsl-value">-</span>
    </div>

    <div id="copy-message" class="hidden">Copied to clipboard!</div>
  </div>
  
  <script src="popup.js"></script>
</body>
</html>

```

**3. `popup.css**`

```css
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  width: 250px;
  margin: 0;
  padding: 15px;
  background-color: #f9f9f9;
  color: #333;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

#pick-color-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

#pick-color-btn:hover {
  background-color: #0056b3;
}

.color-display {
  height: 60px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #ffffff; /* Default blank color */
  transition: background-color 0.3s;
}

.color-info {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.color-info:hover {
  background-color: #f0f0f0;
}

.color-info:active {
  transform: scale(0.98);
}

.label {
  font-weight: bold;
  color: #555;
}

.value {
  font-family: monospace;
  font-size: 1.1em;
}

#copy-message {
  text-align: center;
  color: #28a745;
  font-size: 0.9em;
  font-weight: bold;
  min-height: 20px;
}

.hidden {
  visibility: hidden;
}

```

**4. `popup.js**`

```javascript
// Function to convert HEX color string to RGB format
function hexToRgb(hex) {
  // Remove the hash if it exists
  hex = hex.replace(/^#/, '');
  
  // Parse the r, g, b values
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  return `rgb(${r}, ${g}, ${b})`;
}

// Function to convert HEX color string to HSL format
function hexToHsl(hex) {
  hex = hex.replace(/^#/, '');
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

// Function to copy text to the user's clipboard
async function copyToClipboard(text) {
  if (!text || text === '-') return; // Do not copy empty values
  
  try {
    await navigator.clipboard.writeText(text);
    
    // Show brief feedback to the user
    const msg = document.getElementById('copy-message');
    msg.classList.remove('hidden');
    setTimeout(() => {
      msg.classList.add('hidden');
    }, 1500);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

// Initialize the EyeDropper API when the button is clicked
document.getElementById('pick-color-btn').addEventListener('click', async () => {
  // Check if the browser supports the EyeDropper API
  if (!window.EyeDropper) {
    alert("Your browser does not support the EyeDropper API.");
    return;
  }

  const eyeDropper = new EyeDropper();
  
  try {
    // Open the color picker tool
    const result = await eyeDropper.open();
    const hexColor = result.sRGBHex;
    
    // Generate the other color formats
    const rgbColor = hexToRgb(hexColor);
    const hslColor = hexToHsl(hexColor);

    // Update the visual display block
    document.getElementById('color-display').style.backgroundColor = hexColor;

    // Update the text values in the UI
    document.getElementById('hex-value').textContent = hexColor;
    document.getElementById('rgb-value').textContent = rgbColor;
    document.getElementById('hsl-value').textContent = hslColor;
    
  } catch (e) {
    // The user pressed Escape or cancelled the picker
    console.log("Color selection cancelled.");
  }
});

// Setup click-to-copy event listeners for each color format container
document.getElementById('hex-container').addEventListener('click', () => {
  copyToClipboard(document.getElementById('hex-value').textContent);
});

document.getElementById('rgb-container').addEventListener('click', () => {
  copyToClipboard(document.getElementById('rgb-value').textContent);
});

document.getElementById('hsl-container').addEventListener('click', () => {
  copyToClipboard(document.getElementById('hsl-value').textContent);
});

```

---

### **Execution Guide for Muhamad**

1. Create a new, empty folder on your computer (name it something like `ColorPickerExtension`).
2. Create the four files exactly as named above (`manifest.json`, `popup.html`, `popup.css`, `popup.js`) and paste the corresponding code into each.
3. Open Google Chrome and navigate to `chrome://extensions/`.
4. In the top right corner, turn on the **Developer mode** toggle switch.
5. Click the **Load unpacked** button that appears in the top left.
6. Select the folder you created in step 1.
7. The extension is now installed. Pin it to your Chrome toolbar (using the puzzle piece icon) so you can easily click it to start picking colors.

*References: Code utilizes the standard Chrome Extension Manifest V3 architecture (referenced from [Chrome Developers Documentation](https://developer.chrome.com/docs/extensions/mv3/)) and relies on the modern native web `EyeDropper` API for screen color selection (referenced from [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper)).*

