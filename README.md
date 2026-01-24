# Edit.It

A lightweight **Figma-like design editor** built using **HTML, CSS, and Vanilla JavaScript** as part of the assignment project.
This tool allows users to visually design layouts using rectangles and text elements, similar to basic Figma functionality.

🔗 **Live Demo**  
[Click here to use Edit.It](https://edit-it-oz5d.onrender.com)

---

## 📌 Features

### Canvas System

* Central design canvas
* Absolute-positioned elements
* Multi-element support

### Element Creation

* ➕ Add Rectangle
* ➕ Add Text

### Interaction System

* Click to select elements
* Drag elements inside canvas
* Resize from 4 corners
* Keyboard movement (Arrow keys)
* Delete selected elements using `Delete` key

### Layers Panel

* Layer list with element names
* Active layer highlighting
* Click layer to select element
* Bring to front
* Send to back

### Properties Panel

* X position
* Y position
* Width
* Height
* Rotation
* Background color
* Text content
* Text color

All properties update **live** on the canvas.

---

## 💾 Persistence

### Auto Save

* Design is automatically saved to `localStorage`
* State is preserved on refresh

### Manual Save / Load

* Export project as JSON file
* Load project JSON file

---

## Export System

### 🖼 Export as PNG

* Converts canvas into PNG image using `html2canvas`

### Export as HTML

* Exports full design as standalone HTML file
* All elements rendered with inline styles
* No JS dependency in exported file

---

## 🧠 Data Model

Each element is stored as an object:

```json
{
  "id": "unique-id",
  "type": "rectangle | text",
  "x": 100,
  "y": 100,
  "width": 150,
  "height": 80,
  "rotation": 0,
  "background": "#000000",
  "text": "Hello",
  "textColor": "#ffffff",
  "zIndex": 1
}

```

## 🛠 Tech Stack

* HTML5
* CSS3
* Vanilla JavaScript
* Browser LocalStorage
* html2canvas

---

## 🚀 How to Run

```bash
# Just open index.html in browser
```

OR use Live Server:

```bash
npm install -g live-server
live-server
```

---

## 🧩 Future Scope

* Grouping elements
* Multi-select
* Undo / Redo
* Zoom in/out
* Grid system
* Snap to grid
* Font family selector
* Text alignment
* Stroke controls

---

## 👨‍💻 Author

**Rayala Viswanath** | 
Frontend Developer

---

## If you like this project

Give it a ⭐ on GitHub
