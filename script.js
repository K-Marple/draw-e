// Grab needed document elements
var canvas = document.getElementById("canvas");
var tools = document.querySelectorAll(".tool");
var fillColor = document.getElementById("fill-color");
var lineWidth = document.getElementById("lineWidth");
var colors = document.querySelectorAll(".colors .option");
var colorPicker = document.getElementById("color-picker");
var clearBtn = document.getElementById("clear");
var saveBtn = document.getElementById("save");
var ctx = canvas.getContext("2d");
// Set up variables
var prevMouseX;
var prevMouseY;
var snapshot;
var isDrawing = false;
var selectedTool = "brush";
var brushSize = 5;
var selectedColor = "#000";
// Set up canvas
var setCanvas = function () {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
};
window.addEventListener("load", function () {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvas();
});
// Logic for changing between tools, colors, and shapes
tools.forEach(function (tool) {
    tool.addEventListener("click", function () {
        var activeOption = document.querySelector(".options .active");
        if (activeOption) {
            activeOption.classList.remove("active");
        }
        tool.classList.add("active");
        selectedTool = tool.id;
    });
});
lineWidth.addEventListener("change", function () { return (brushSize = Number(lineWidth.value)); });
colors.forEach(function (color) {
    color.addEventListener("click", function () {
        var activeOption = document.querySelector(".options .selected");
        if (activeOption) {
            activeOption.classList.remove("selected");
        }
        color.classList.add("selected");
        selectedColor = window
            .getComputedStyle(color)
            .getPropertyValue("background-color");
    });
});
colorPicker.parentElement.style.background = colorPicker.value;
colorPicker.addEventListener("change", function () {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});
clearBtn.addEventListener("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvas();
});
saveBtn.addEventListener("click", function () {
    var link = document.createElement("a");
    link.download = "".concat(Date.now(), ".jpg");
    link.href = canvas.toDataURL();
    link.click();
});
// Draw shapes
var drawRect = function (e) {
    if (!fillColor.checked) {
        var width_1 = prevMouseX - e.offsetX;
        var height_1 = prevMouseY - e.offsetY;
        return ctx.strokeRect(e.offsetX, e.offsetY, width_1, height_1);
    }
    var width = prevMouseX - e.offsetX;
    var height = prevMouseY - e.offsetY;
    ctx.fillRect(e.offsetX, e.offsetY, width, height);
};
var drawCircle = function (e) {
    ctx.beginPath();
    var radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
};
var drawTriangle = function (e) {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
};
var drawSquare = function (e) {
    var side = Math.abs(prevMouseX - e.offsetX);
    ctx.beginPath();
    ctx.rect(e.offsetX, e.offsetY, side, side);
    fillColor.checked ? ctx.fill() : ctx.stroke();
};
var drawLine = function (e) {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
};
var drawPencil = function (e) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
};
// Drawing on canvas
var startDraw = function (e) {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};
var drawing = function (e) {
    if (!isDrawing)
        return;
    ctx.putImageData(snapshot, 0, 0);
    if ((selectedTool === "brush" || selectedTool === "pencil") ||
        selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
    else if (selectedTool === "rectangle") {
        drawRect(e);
    }
    else if (selectedTool === "circle") {
        drawCircle(e);
    }
    else if (selectedTool === "triangle") {
        drawTriangle(e);
    }
    else if (selectedTool === "square") {
        drawSquare(e);
    }
    else if (selectedTool === "line") {
        drawLine(e);
    }
    else {
        drawPencil(e);
    }
};
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", function () { return (isDrawing = false); });
