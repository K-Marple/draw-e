// Grab needed document elements
const canvas = document.getElementById("canvas");
const tools = document.querySelectorAll(".tool");
const fillColor = document.getElementById("fill-color");
const lineSize = document.getElementById("lineSize");
const colors = document.querySelectorAll(".colors .option");
const colorPicker = document.getElementById("color-picker");
const clearBtn = document.getElementById("clear");
const saveBtn = document.getElementById("save");
const ctx = canvas.getContext("2d");

// Set up variables
let prevMouseX;
let prevMouseY;
let snapshot;
let isDrawing = false;
let selectedTool = "brush";
let brushSize = 5;
let selectedColor = "#000";

// Set up canvas
const setCanvas = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvas();
});

// Logic for changing between tools, colors, and shapes
tools.forEach((tool) => {
  tool.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    tool.classList.add("active");
    selectedTool = tool.id;
  });
});

lineSize.addEventListener("change", () => (brushWidth = lineSize.value));

colors.forEach((color) => {
  color.addEventListener("click", () => {
    document.querySelector(".options .selected").classList.remove("selected");
    color.classList.add("selected");
    selectedColor = window
      .getComputedStyle(color)
      .getPropertyValue("background-color");
  });
});

colorPicker.parentElement.style.background = colorPicker.value;

colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvas();
});

saveBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}`.jpg;
  link.href = canvas.toDataURL();
  link.click();
});

// Draw shapes
const drawRect = (e) => {
  if (!fillColor.checked) {
    const width = prevMouseX - e.offsetX;
    const height = prevMouseY - e.offsetY;
    return ctx.strokeRect(e.offsetX, e.offsetY, width, height);
  }
  const width = prevMouseX - e.offsetX;
  const height = prevMouseY - e.offsetY;
  ctx.fillRect(e.offsetX, e.offsetY, width, height);
};

const drawCircle = (e) => {
  ctx.beginPath();
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2),
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawSquare = (e) => {
  const side = Math.abs(prevMouseX - e.offsetX);
  ctx.beginPath();
  ctx.rect(e.offsetX, e.offsetY, side, side);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawLine = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
};

const drawPencil = (e) => {
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
};

// Drawing on canvas
const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.lineSize = brushSize;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);

  if (
    (selectedTool === "brush" && selectedTool === "pencil") ||
    selectedTool === "eraser"
  ) {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else if (selectedTool === "triangle") {
    drawTriangle(e);
  } else if (selectedTool === "square") {
    drawSquare(e);
  } else if (selectedTool === "line") {
    drawLine(e);
  } else {
    drawPencil(e);
  }
};

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => (isDrawing = false));
