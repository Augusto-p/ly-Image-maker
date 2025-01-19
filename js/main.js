// HTML element references
let uploadPreview = document.getElementById("Upload_Preview");
let canvasPreview = document.getElementById("Canvas_Preview");
let canvasDownload = document.getElementById("Canvas_Download");
let preview = document.getElementById("Preview")
let uploadInput = document.getElementById("upload");
let widthInput = document.getElementById("width");
let heightInput = document.getElementById("height");

// Color palette mapping HEX color codes to indices
let colorPalette = {
    "#000000": 1, // Black
    "#aa0000": 2, // Dark Red
    "#00aa00": 3, // Green
    "#aa5500": 4, // Brown
    "#0000aa": 5, // Blue
    "#aa00aa": 6, // Magenta
    "#00aaaa": 7, // Cyan
    "#aaaaaa": 8  // Light Gray
};

// Handle file upload and preview image
uploadInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        uploadPreview.parentElement.classList.remove("unLoad");
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Display preview with color approximation
document.getElementById("View_Preview").addEventListener("click", async () => {
    const file = uploadInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const ctx = canvasPreview.getContext("2d");
            canvasPreview.width = img.width;
            canvasPreview.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;
            let index = 0;

            // Replace each pixel's color with the closest palette color
            for (let y = 0; y < img.height; y++) {
                for (let x = 0; x < img.width; x++) {
                    let closestColor = findClosestColor(
                        [data[index], data[index + 1], data[index + 2]],
                        Object.keys(colorPalette)
                    );
                    const [r, g, b] = hexToRgb(closestColor);
                    data[index] = r;     // Red
                    data[index + 1] = g; // Green
                    data[index + 2] = b; // Blue
                    data[index + 3] = 255; // Alpha (fully opaque)
                    index += 4;
                }
            }
            ctx.putImageData(imageData, 0, 0);
            preview.src = canvasPreview.toDataURL();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

// Download image encoded as text
document.getElementById("Download").addEventListener("click", () => {
    let width = widthInput.value !== "" ? parseInt(widthInput.value) : undefined;
    let height = heightInput.value !== "" ? parseInt(heightInput.value) : undefined;

    const file = uploadInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            width = width !== undefined ? width : img.width;
            height = height !== undefined ? height : img.height;
            if (width % 2 !== 0) width += 1;

            const scale = Math.min(width / img.width, height / img.height, 1);
            const newWidth = Math.floor(img.width * scale);
            const newHeight = Math.floor(img.height * scale);

            const ctx = canvasDownload.getContext("2d");
            canvasDownload.width = newWidth;
            canvasDownload.height = newHeight;
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
            const data = imageData.data;
            let index = 0;
            let textEncoding = "";

            // Encode pixels into text using the palette
            for (let y = 0; y < newHeight; y++) {
                for (let x = 0; x < newWidth; x += 2) {
                    let colorA = findClosestColor(
                        [data[index], data[index + 1], data[index + 2]],
                        Object.keys(colorPalette)
                    );
                    let colorB = findClosestColor(
                        [data[index + 4], data[index + 5], data[index + 6]],
                        Object.keys(colorPalette)
                    );
                    let colorAIndex = colorPalette[colorA];
                    let colorBIndex = colorPalette[colorB];
                    textEncoding += encodeColors(colorAIndex, colorBIndex);
                    index += 8;
                }
                textEncoding += String.fromCharCode(32); // Add a space to mark the end of the line
            }
            createTextFile(textEncoding, reverseSplit(uploadInput.files[0].name, ".", 1)[0]);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});
