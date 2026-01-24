const canvas = document.querySelector("#canvas");

// Array of objects to store each element's data.
const elements = [];
// Var that holds the id of selected rectangle.
let selectedId = null;

// Vars to track drag and resize.
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Vars to track resize
let isResizing = false;
let resizeDirection = "";

// Layers panel.
const layersList = document.querySelector("#layers-list");
const bringFrontBtn = document.querySelector("#bring-front");
const sendBackBtn = document.querySelector("#send-back");

// Bring front button.
bringFrontBtn.addEventListener("click", () => {
  if (!selectedId) return;

  const element = elements.find((el) => el.id === selectedId);
  const maxZ = Math.max(...elements.map((el) => el.zIndex));

  element.zIndex = maxZ + 1;

  const rectDiv = canvas.querySelector(`[data-id="${selectedId}"]`);
  rectDiv.style.zIndex = element.zIndex;

  renderLayers();
});

// Send back button.
sendBackBtn.addEventListener("click", () => {
  if (!selectedId) return;

  const element = elements.find((el) => el.id === selectedId);
  const minZ = Math.min(...elements.map((el) => el.zIndex));

  element.zIndex = minZ - 1;

  const rectDiv = canvas.querySelector(`[data-id="${selectedId}"]`);
  rectDiv.style.zIndex = element.zIndex;

  renderLayers();
});

const renderLayers = () => {
  layersList.innerHTML = "";
  elements.forEach((el, idx) => {
    const layer = document.createElement("div");
    layer.classList.add("layer-item");
    layer.innerText = `${el.type === "text" ? "Text" : "Rectangle"} ${idx + 1}`;
    layer.dataset.id = el.id;

    // Highlight selected layer.
    if (el.id == selectedId) {
      layer.classList.add("active");
    }

    // Click layer -> select rectangle.
    layer.addEventListener("click", () => {
      selectedId = el.id;
      updateSelectedUI();
      renderLayers();
    });

    layersList.appendChild(layer);
  });
};

// Properties Panel vars.
const propX = document.querySelector("#propX");
const propY = document.querySelector("#propY");
const propW = document.querySelector("#propW");
const propH = document.querySelector("#propH");
const propBg = document.querySelector("#propBg");
const propText = document.querySelector("#propText");
const textPropRow = document.querySelector("#textPropRow");
const propRotate = document.querySelector("#propRotate");

// Add rectangle button.
const addRectBtn = document.querySelector("#add-rectangle");

addRectBtn.addEventListener("click", () => {
  const rectData = createElementData("rectangle");
  renderElement(rectData);
  renderLayers();
});

// Add text button.
const addTextBtn = document.querySelector("#add-text");

addTextBtn.addEventListener("click", () => {
  const textData = createElementData("text");
  renderElement(textData);
  renderLayers();
});

// // Function to clear the canvas.
// const clearCanvas = () => {
//   canvas.innerHTML = "";
//   elements.length = 0;
// };

// Function to create the rectangle data.
const createElementData = (type) => {
  const data = {
    id: Date.now().toString(), // dynamic unq id.
    type: type,
    x: 20 + elements.length * 25,
    y: 20 + elements.length * 25,
    width: type === "text" ? 150 : 100,
    height: type === "text" ? 50 : 100,
    rotation: 0,
    background: type === "text" ? "#00000000" : "#000000",
    text: type === "text" ? "New Text" : "",
    textColor: "#000000",
    zIndex: elements.length,
  };

  elements.push(data);
  return data;
};

// Function to render the rectangle.
const renderElement = (element) => {
  const rectangle = document.createElement("div");

  rectangle.classList.add("rectangle");

  rectangle.style.position = "absolute";
  rectangle.style.width = element.width + "px";
  rectangle.style.height = element.height + "px";
  rectangle.style.left = element.x + "px";
  rectangle.style.top = element.y + "px";
  rectangle.style.backgroundColor = element.background;
  rectangle.style.transform = `rotate(${element.rotation}deg)`;
  rectangle.style.zIndex = element.zIndex;

  rectangle.dataset.id = element.id;

  if (element.type === "text") {
    const textNode = document.createElement("span");
    textNode.classList.add("text-node");
    textNode.innerText = element.text;

    rectangle.appendChild(textNode);

    rectangle.style.color = element.textColor || "#000000";
    const fontSize = Math.max(
      12,
      Math.min(element.height * 0.18, element.width * 0.18),
    );
    rectangle.style.fontSize = fontSize + "px";
  }

  canvas.appendChild(rectangle);

  // Event to select rectangle.
  rectangle.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedId = element.id;
    updateSelectedUI();
    renderLayers();
    updatePropertiesPanel();
  });

  // Event listener to drag rectangle around the canvas.
  rectangle.addEventListener("mousedown", (e) => {
    if (selectedId !== element.id) return;

    isDragging = true;

    dragOffsetX = e.clientX - element.x;
    dragOffsetY = e.clientY - element.y;
  });

  // Resize handles.
  const brHandle = document.createElement("div");
  brHandle.classList.add("resize-handle", "br");
  rectangle.appendChild(brHandle);
  const blHandle = document.createElement("div");
  blHandle.classList.add("resize-handle", "bl");
  rectangle.appendChild(blHandle);
  const tlHandle = document.createElement("div");
  tlHandle.classList.add("resize-handle", "tl");
  rectangle.appendChild(tlHandle);
  const trHandle = document.createElement("div");
  trHandle.classList.add("resize-handle", "tr");
  rectangle.appendChild(trHandle);

  // Event to resize rectangle : br
  brHandle.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    selectedId = element.id;
    isResizing = true;
    resizeDirection = "br";
    resizeOffsetX = e.clientX - element.x;
    resizeOffsetY = e.clientY - element.y;
  });

  // Event to resize rectangle : bl
  blHandle.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    selectedId = element.id;
    isResizing = true;
    resizeDirection = "bl";
  });

  // Event to resize rectangle : tl
  tlHandle.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    selectedId = element.id;
    isResizing = true;
    resizeDirection = "tl";
  });

  // Event to resize rectangle : tr
  trHandle.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    selectedId = element.id;
    isResizing = true;
    resizeDirection = "tr";
  });
};

// Function to select rectangle.
const updateSelectedUI = () => {
  const allElements = canvas.querySelectorAll(".rectangle");

  allElements.forEach((element) => {
    if (element.dataset.id === selectedId) {
      element.classList.add("selected");
    } else {
      element.classList.remove("selected");
    }
  });
};

// Event to deselect rectangle.
canvas.addEventListener("click", () => {
  selectedId = null;
  updateSelectedUI();
  renderLayers();
  updatePropertiesPanel();
});

// Event to drag rectangle.
document.addEventListener("mousemove", (e) => {
  if (!isDragging || !selectedId) return;

  const element = elements.find((element) => element.id === selectedId);
  const rectDiv = canvas.querySelector(`[data-id="${selectedId}"]`);

  let newX = e.clientX - dragOffsetX;
  let newY = e.clientY - dragOffsetY;

  const maxX = canvas.clientWidth - element.width;
  const maxY = canvas.clientHeight - element.height;

  newX = Math.max(0, Math.min(newX, maxX));
  newY = Math.max(0, Math.min(newY, maxY));

  element.x = newX;
  element.y = newY;

  rectDiv.style.left = newX + "px";
  rectDiv.style.top = newY + "px";
});

// Event to stop dragging rectangle.
document.addEventListener("mouseup", () => {
  isDragging = false;
  isResizing = false;
});

// Event to resize rectangle.
document.addEventListener("mousemove", (e) => {
  if (!isResizing || !selectedId) return;

  const element = elements.find((element) => element.id === selectedId);
  const rectDiv = canvas.querySelector(`[data-id="${selectedId}"]`);

  // Convert mouse coords to canvas coords.
  const canvasRect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - canvasRect.left;
  const mouseY = e.clientY - canvasRect.top;

  const MIN_SIZE = 40;

  if (resizeDirection === "br") {
    let newWidth = mouseX - element.x;
    let newHeight = mouseY - element.y;

    newWidth = Math.max(MIN_SIZE, newWidth);
    newHeight = Math.max(MIN_SIZE, newHeight);

    const maxWidth = canvas.clientWidth - element.x;
    const maxHeight = canvas.clientHeight - element.y;

    newWidth = Math.min(newWidth, maxWidth);
    newHeight = Math.min(newHeight, maxHeight);

    element.width = newWidth;
    element.height = newHeight;

    rectDiv.style.width = newWidth + "px";
    rectDiv.style.height = newHeight + "px";

    if (element.type === "text") {
      const fontSize = Math.max(
        12,
        Math.min(element.height * 0.18, element.width * 0.18),
      );
      rectDiv.style.fontSize = fontSize + "px";
    }
  } else if (resizeDirection === "bl") {
    const rightEdge = element.x + element.width;

    let rawWidth = rightEdge - mouseX;
    let rawHeight = mouseY - element.y;

    let newWidth = Math.max(MIN_SIZE, rawWidth);
    let newHeight = Math.max(MIN_SIZE, rawHeight);

    // Only update x if width is not clamped
    let newX = element.x;
    if (rawWidth > MIN_SIZE) {
      newX = mouseX;
    }

    // canvas bottom boundary
    const maxHeight = canvas.clientHeight - element.y;
    newHeight = Math.min(newHeight, maxHeight);

    // canvas left boundary
    if (newX < 0) {
      newX = 0;
      newWidth = rightEdge;
    }

    element.x = newX;
    element.width = newWidth;
    element.height = newHeight;

    rectDiv.style.left = newX + "px";
    rectDiv.style.width = newWidth + "px";
    rectDiv.style.height = newHeight + "px";

    if (element.type === "text") {
      const fontSize = Math.max(
        12,
        Math.min(element.height * 0.18, element.width * 0.18),
      );
      rectDiv.style.fontSize = fontSize + "px";
    }
  } else if (resizeDirection === "tl") {
    const rightEdge = element.x + element.width;
    const bottomEdge = element.y + element.height;

    let rawWidth = rightEdge - mouseX;
    let rawHeight = bottomEdge - mouseY;

    let newWidth = Math.max(MIN_SIZE, rawWidth);
    let newHeight = Math.max(MIN_SIZE, rawHeight);

    // Only update x/y if not clamped
    let newX = element.x;
    let newY = element.y;

    if (rawWidth > MIN_SIZE) {
      newX = mouseX;
    }
    if (rawHeight > MIN_SIZE) {
      newY = mouseY;
    }

    // canvas boundaries
    if (newX < 0) {
      newX = 0;
      newWidth = rightEdge;
    }
    if (newY < 0) {
      newY = 0;
      newHeight = bottomEdge;
    }

    element.x = newX;
    element.y = newY;
    element.width = newWidth;
    element.height = newHeight;

    rectDiv.style.left = newX + "px";
    rectDiv.style.top = newY + "px";
    rectDiv.style.width = newWidth + "px";
    rectDiv.style.height = newHeight + "px";

    if (element.type === "text") {
      const fontSize = Math.max(
        12,
        Math.min(element.height * 0.18, element.width * 0.18),
      );
      rectDiv.style.fontSize = fontSize + "px";
    }
  } else {
    const bottomEdge = element.y + element.height;

    let rawWidth = mouseX - element.x;
    let rawHeight = bottomEdge - mouseY;

    let newWidth = Math.max(MIN_SIZE, rawWidth);
    let newHeight = Math.max(MIN_SIZE, rawHeight);

    // Only update y if height is not clamped
    let newY = element.y;
    if (rawHeight > MIN_SIZE) {
      newY = mouseY;
    }

    // canvas right boundary
    const maxWidth = canvas.clientWidth - element.x;
    newWidth = Math.min(newWidth, maxWidth);

    // canvas top boundary
    if (newY < 0) {
      newY = 0;
      newHeight = bottomEdge;
    }

    element.y = newY;
    element.width = newWidth;
    element.height = newHeight;

    rectDiv.style.top = newY + "px";
    rectDiv.style.width = newWidth + "px";
    rectDiv.style.height = newHeight + "px";

    if (element.type === "text") {
      const fontSize = Math.max(
        12,
        Math.min(element.height * 0.18, element.width * 0.18),
      );
      rectDiv.style.fontSize = fontSize + "px";
    }
  }
});

// Keyboard Controls
document.addEventListener("keydown", (e) => {
  if (!selectedId) return;

  const element = elements.find((element) => element.id === selectedId);
  const rectDiv = canvas.querySelector(`[data-id="${selectedId}"]`);

  const STEP = 5;

  const maxX = canvas.clientWidth - element.width;
  const maxY = canvas.clientHeight - element.height;

  // Move Left.
  if (e.key === "ArrowLeft") {
    element.x = Math.max(0, element.x - STEP);
  }

  // Move Right.
  if (e.key === "ArrowRight") {
    element.x = Math.min(maxX, element.x + STEP);
  }

  // Move Up
  if (e.key === "ArrowUp") {
    element.y = Math.max(0, element.y - STEP);
  }

  // Move Down
  if (e.key === "ArrowDown") {
    const maxY = canvas.clientHeight - element.height;
    element.y = Math.min(maxY, element.y + STEP);
  }

  // Delete
  if (e.key === "Delete") {
    // remove from data
    const index = elements.findIndex((el) => el.id === selectedId);
    if (index !== -1) {
      elements.splice(index, 1);
    }

    // remove from UI
    rectDiv.remove();
    renderLayers();
    updatePropertiesPanel();

    // clear selection
    selectedId = null;
    return;
  }

  // Update UI position
  rectDiv.style.left = element.x + "px";
  rectDiv.style.top = element.y + "px";
});

// Properties Panel function.
const updatePropertiesPanel = () => {
  if (!selectedId) {
    propX.value = "";
    propY.value = "";
    propW.value = "";
    propH.value = "";
    propBg.value = "#000";
    propText.value = "";
    textPropRow.style.display = "none";
    propRotate.value = 0;
    return;
  }

  const element = elements.find((element) => element.id === selectedId);

  propX.value = Math.round(element.x);
  propY.value = Math.round(element.y);
  propW.value = Math.round(element.width);
  propH.value = Math.round(element.height);
  propBg.value = element.background || "#000";
  propRotate.value = Math.round(element.rotation || 0);

  if (element.type === "text") {
    textPropRow.style.display = "flex";
    propText.value = element.text;
  } else {
    textPropRow.style.display = "none";
    propText.value = "";
  }
};

// Render Changes according to input.
const applyPropertyChanges = () => {
  if (!selectedId) return;

  const element = elements.find((element) => element.id === selectedId);
  const rectDiv = canvas.querySelector(`[data-id="${selectedId}"]`);

  const xVal = propX.value;
  const yVal = propY.value;
  const wVal = propW.value;
  const hVal = propH.value;

  const isValidNum = (val) => {
    return val !== "" && !isNaN(val);
  };

  propX.classList.remove("input-error");
  propY.classList.remove("input-error");
  propW.classList.remove("input-error");
  propH.classList.remove("input-error");

  if (!isValidNum(xVal)) propX.classList.add("input-error");
  if (!isValidNum(yVal)) propY.classList.add("input-error");
  if (!isValidNum(wVal)) propW.classList.add("input-error");
  if (!isValidNum(hVal)) propH.classList.add("input-error");

  if (
    !isValidNum(xVal) ||
    !isValidNum(yVal) ||
    !isValidNum(wVal) ||
    !isValidNum(hVal)
  ) {
    return;
  }

  const newX = Number(xVal);
  const newY = Number(yVal);
  const newW = Number(wVal);
  const newH = Number(hVal);

  const MIN_SIZE = 40;

  const maxX = canvas.clientWidth - element.width;
  const maxY = canvas.clientHeight - element.height;

  const maxW = canvas.clientWidth - element.x;
  const maxH = canvas.clientHeight - element.y;

  // Position
  element.x = Math.max(0, Math.min(newX, maxX));
  element.y = Math.max(0, Math.min(newY, maxY));

  // Size
  element.width = Math.max(MIN_SIZE, Math.min(newW, maxW));
  element.height = Math.max(MIN_SIZE, Math.min(newH, maxH));

  // Background
  element.background = propBg.value;
  rectDiv.style.backgroundColor = element.background;

  // Text Content
  if (element.type === "text") {
    element.text = propText.value;
    const textNode = rectDiv.querySelector(".text-node");
    if (textNode) {
      textNode.innerText = element.text;
    }
  }

  rectDiv.style.left = element.x + "px";
  rectDiv.style.top = element.y + "px";
  rectDiv.style.width = element.width + "px";
  rectDiv.style.height = element.height + "px";

  if (element.type === "text") {
    const fontSize = Math.max(
      12,
      Math.min(element.height * 0.18, element.width * 0.18),
    );
    rectDiv.style.fontSize = fontSize + "px";
  }

  // Rotation
  const rotVal = Number(propRotate.value);
  if (!isNaN(rotVal)) {
    element.rotation = rotVal;
    rectDiv.style.transform = `rotate(${element.rotation}deg)`;
  }
};

// Listen to input changes.
propX.addEventListener("input", applyPropertyChanges);
propY.addEventListener("input", applyPropertyChanges);
propW.addEventListener("input", applyPropertyChanges);
propH.addEventListener("input", applyPropertyChanges);
propBg.addEventListener("input", applyPropertyChanges);
propText.addEventListener("input", applyPropertyChanges);
propRotate.addEventListener("input", applyPropertyChanges);

// Save and Load.
const saveBtn = document.querySelector("#save-project");
const loadBtn = document.querySelector("#load-project");
const loadInput = document.querySelector("#load-input");

// Save logic.
saveBtn.addEventListener("click", () => {
  const data = JSON.stringify(elements, null, 2);

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "project.json";
  a.click();

  URL.revokeObjectURL(url);
});

// Load listener.
loadBtn.addEventListener("click", () => {
  loadInput.click();
});

// Load logic.
loadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    const data = JSON.parse(event.target.result);

    // Clear old state
    elements.length = 0;
    canvas.innerHTML = "";
    selectedId = null;

    // Load new state
    data.forEach((el) => {
      elements.push(el);
      renderElement(el);
    });

    renderLayers();
    updatePropertiesPanel();
  };

  reader.readAsText(file);
});

// Export as PNG.
const exportBtn = document.querySelector("#export-image");

// Function to convert canvas as img.
const exportCanvas = () => {
  const canvasNode = document.querySelector("#canvas");

  html2canvas(canvasNode).then((canvasEl) => {
    const imageData = canvasEl.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = imageData;
    link.download = "design.png";
    link.click();
  });
};

exportBtn.addEventListener("click", exportCanvas);
