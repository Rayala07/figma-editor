const canvas = document.querySelector("#canvas");

// Array of objects to store each element's data.
const elements = [];
// Var that holds the id of selected rectangle.
let selectedId = null;

let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

let isResizing = false;
let resizeDirection = "";

// Function to create the rectangle data.
const createRectangleData = () => {
  const data = {
    id: Date.now().toString(), // dynamic unq id.
    type: "rectangle",
    x: 20,
    y: 20,
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
    console.log(resizeDirection);
  });

  // Event to resize rectangle : bl
  blHandle.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    isResizing = true;
    resizeDirection = "bl";
    console.log(resizeDirection);
  });

  // Event to resize rectangle : tl
  tlHandle.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    isResizing = true;
    resizeDirection = "tl";
    console.log(resizeDirection);
  });

  // Event to resize rectangle : tr
  trHandle.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    isResizing = true;
    resizeDirection = "tr";
    console.log(resizeDirection);
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

// Event to deselect rectangle.
canvas.addEventListener("click", () => {
  selectedId = null;
  updateSelectedUI();
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
document.addEventListener('mousemove', () => {
    if (!isResizing || !selectedId) return;
    if(resizeDirection === 'br') {
        console.log('resize br');
    }
})

// Flow of calling functions ->
const rectangleData = createRectangleData();
renderRectangle(rectangleData);
