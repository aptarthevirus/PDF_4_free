# PDF Downloader - Free4U

A simple, elegant PDF downloader web application built with HTML, CSS, and JavaScript.

## 🚀 Features

- **Direct URL Downloads**: Fetch and save PDF files by pasting the direct link
- **Error Handling**: Built-in validation and helpful error messages for invalid URLs and CORS restrictions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations and gradients
- **Lightweight**: No dependencies, pure vanilla JavaScript

## 🛠️ Tech Stack

- **HTML5**: Semantic structure
- **CSS3**: Modern styling with gradients, animations, and flexbox layout
- **JavaScript (ES6)**: Async/await for file downloads and blob handling

## 📂 Project Files

| File | Purpose |
|------|---------|
| `index.html` | Main entry point with the user interface |
| `PDF.CSS` | Modern styling and responsive design |
| `pdf.js` | Download logic and error handling |

## 📝 How to Use

1. **Open the app**: Open `index.html` in any modern web browser
2. **Enter URL**: Paste the direct link to a PDF file in the input field
3. **Download**: Click the "Download PDF" button
4. **Save**: The file will automatically download to your device
## note: no log in needed.

## ⚠️ Important Notes

- **CORS Restrictions**: Some PDF servers may block cross-origin requests. If you see a CORS error, the PDF must be downloaded directly.
- **Direct Links Only**: Paste direct links to PDF files (URLs ending in `.pdf` or returning `application/pdf` content-type)
- **No Backend Required**: This app works entirely in the browser

## 🌐 Live Demo

Visit the live demo: https://aptarthevirus.github.io/PDF_4_free/

## 🔧 Recent Fixes (v2.0)

- ✅ Changed HTTP method from POST to GET for proper PDF downloads
- ✅ Improved URL validation and error handling
- ✅ Enhanced CSS with modern gradients and animations
- ✅ Added responsive design for mobile devices
- ✅ Better error messages for common issues (CORS, empty files, invalid URLs)
- ✅ Dynamic filename extraction from URL

## 🐛 Known Limitations

- **CORS Policy**: Many PDF hosting services restrict cross-origin requests for security
- **File Size**: Large PDFs may take time to download depending on connection speed
- **Browser Support**: Requires modern browser with ES6 and Fetch API support

Open source and free to use

## 👤 Author

Created by aptarthevirus or Aptar Hussain

---

<img width="1366" height="768" alt="updated" src="https://github.com/user-attachments/assets/1aa1199a-6bc3-41bf-9ecc-e9483dfbeb5d" />
