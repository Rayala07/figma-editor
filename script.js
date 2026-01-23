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

const renderLayers = () => {
  layersList.innerHTML = "";
  elements.forEach((el, idx) => {
    const layer = document.createElement("div");
    layer.classList.add("layer-item");
    layer.innerText = `Rectangle ${idx + 1}`;
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

// Add rectangle button.
const addRectBtn = document.querySelector("#add-rectangle");

addRectBtn.addEventListener("click", () => {
  const data = createRectangleData();
  renderRectangle(data);
  renderLayers();
});

// Function to clear the canvas.
const clearCanvas = () => {
  canvas.innerHTML = "";
  elements.length = 0;
};

// Function to create the rectangle data.
const createRectangleData = () => {
  const data = {
    id: Date.now().toString(), // dynamic unq id.
    type: "rectangle",
    x: 20 + elements.length * 15,
    y: 20 + elements.length * 15,
    width: 100,
    height: 100,
  };

  elements.push(data);
  return data;
};

// Function to render the rectangle.
const renderRectangle = (element) => {
  const rectangle = document.createElement("div");

  rectangle.classList.add("rectangle");

  rectangle.style.position = "absolute";
  rectangle.style.width = element.width + "px";
  rectangle.style.height = element.height + "px";
  rectangle.style.left = element.x + "px";
  rectangle.style.top = element.y + "px";
  rectangle.style.backgroundColor = "red";

  rectangle.dataset.id = element.id;

  canvas.appendChild(rectangle);

  // Event listener to select rectangle.
  rectangle.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedId = element.id;
    updateSelectedUI();
    renderLayers();
  });

  // Event to deselect rectangle.
  canvas.addEventListener("click", () => {
    selectedId = null;
    updateSelectedUI();
    renderLayers();
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
  const allRectangles = canvas.querySelectorAll("div");

  allRectangles.forEach((rectangle) => {
    if (rectangle.dataset.id === selectedId) {
      rectangle.classList.add("selected");
    } else {
      rectangle.classList.remove("selected");
    }
  });
};

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

    // clear selection
    selectedId = null;
    return;
  }

  // Update UI position
  rectDiv.style.left = element.x + "px";
  rectDiv.style.top = element.y + "px";
});
