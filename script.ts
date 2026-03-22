// Grab needed document elements
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const tools = document.querySelectorAll<HTMLElement>(".tool");
const fillColor = document.getElementById("fill-color") as HTMLInputElement;
const lineWidth = document.getElementById("lineWidth") as HTMLInputElement;
const colors = document.querySelectorAll<HTMLElement>(".colors .option");
const colorPicker = document.getElementById("color-picker") as HTMLInputElement;
const clearBtn = document.getElementById("clear") as HTMLButtonElement;
const saveBtn = document.getElementById("save") as HTMLButtonElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

// Set up variables
let prevMouseX: number;
let prevMouseY: number;
let snapshot: any;
let isDrawing: boolean = false;
let selectedTool: string = "brush";
let brushSize: number = 5;
let selectedColor: string = "#000";

// Set up canvas
const setCanvas = (): void => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

window.addEventListener("load", (): void => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvas();
});

// Logic for changing between tools, colors, and shapes
tools.forEach((tool: HTMLElement) => {
  tool.addEventListener("click", () => {
    const activeOption = document.querySelector(".options .active") as HTMLElement | null;
    if (activeOption) {
      activeOption.classList.remove("active");
    }
    tool.classList.add("active");
    selectedTool = tool.id;
  });
});

lineWidth.addEventListener("change", () => (brushSize = Number(lineWidth.value)));

colors.forEach((color: HTMLElement) => {
  color.addEventListener("click", () => {
    const activeOption = document.querySelector(".options .selected") as HTMLElement | null;
    if (activeOption) {
      activeOption.classList.remove("selected");
    }
    color.classList.add("selected");
    selectedColor = window
      .getComputedStyle(color)
      .getPropertyValue("background-color");
  });
});

colorPicker.parentElement!.style.background = colorPicker.value;

colorPicker.addEventListener("change", () => {
  colorPicker.parentElement!.style.background = colorPicker.value;
  colorPicker.parentElement!.click();
});

clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvas();
});

saveBtn.addEventListener("click", () => {
  const link = document.createElement("a") as HTMLAnchorElement;
  link.download = `${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

// Draw shapes
const drawRect = (e: MouseEvent): void => {
  if (!fillColor.checked) {
    const width = prevMouseX - e.offsetX;
    const height = prevMouseY - e.offsetY;
    return ctx.strokeRect(e.offsetX, e.offsetY, width, height);
  }
  const width = prevMouseX - e.offsetX;
  const height = prevMouseY - e.offsetY;
  ctx.fillRect(e.offsetX, e.offsetY, width, height);
};

const drawCircle = (e: MouseEvent): void => {
  ctx.beginPath();
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2),
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTriangle = (e: MouseEvent): void => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawSquare = (e: MouseEvent): void => {
  const side = Math.abs(prevMouseX - e.offsetX);
  ctx.beginPath();
  ctx.rect(e.offsetX, e.offsetY, side, side);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawLine = (e: MouseEvent): void => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
};

const drawPencil = (e: MouseEvent): void => {
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
};

// Drawing on canvas
const startDraw = (e: MouseEvent): void => {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushSize;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e: MouseEvent): void => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);

  if (
    (selectedTool === "brush" || selectedTool === "pencil") ||
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
