/**
 * Converts a HEX color code to an RGB array.
 * @param {string} hexColor - The HEX color code (e.g., "#FFFFFF").
 * @returns {number[]} Array containing RGB values [R, G, B].
 */
function hexToRgb(hexColor) {
    hexColor = hexColor.replace("#", "");
    let red = parseInt(hexColor.substring(0, 2), 16);
    let green = parseInt(hexColor.substring(2, 4), 16);
    let blue = parseInt(hexColor.substring(4, 6), 16);
    return [red, green, blue];
}

/**
 * Calculates the Euclidean distance between two RGB colors.
 * @param {number[]} colorA - The first RGB color as an array [R, G, B].
 * @param {number[]} colorB - The second RGB color as an array [R, G, B].
 * @returns {number} The color distance.
 */
function calculateColorDistance(colorA, colorB) {
    let deltaRed = colorA[0] - colorB[0];
    let deltaGreen = colorA[1] - colorB[1];
    let deltaBlue = colorA[2] - colorB[2];
    return Math.sqrt(deltaRed ** 2 + deltaGreen ** 2 + deltaBlue ** 2);
}

/**
 * Finds the closest color in a palette to a given color.
 * @param {number[]} color - The target color as an RGB array [R, G, B].
 * @param {string[]} palette - An array of HEX color codes.
 * @returns {string} The closest HEX color in the palette.
 */
function findClosestColor(color, palette) {
    let minDistance = null;
    let closestColor = null;
    palette.forEach(paletteColor => {
        let distance = calculateColorDistance(color, hexToRgb(paletteColor));
        if (minDistance === null || distance < minDistance) {
            minDistance = distance;
            closestColor = paletteColor;
        }
    });
    return closestColor;
}

/**
 * Converts a decimal number to a binary string of specified length.
 * @param {number} number - The decimal number to convert.
 * @param {number} length - The length of the binary string.
 * @returns {string} Binary representation of the number.
 */
function decimalToBinary(number, length) {
    let binaryString = "";
    let reversedBinary = "";
    while (number > 1) {
        reversedBinary += number % 2;
        number = Math.floor(number / 2);
    }
    reversedBinary += number;
    for (let index = 0; index < length; index++) {
        if (index < (length - reversedBinary.length)) {
            binaryString += "0";
        } else {
            binaryString += reversedBinary[length - index - 1];
        }
    }
    return binaryString;
}

/**
 * Encodes two color indices into a single character.
 * @param {number} colorAIndex - Index of the first color.
 * @param {number} colorBIndex - Index of the second color.
 * @returns {string} Encoded character.
 */
function encodeColors(colorAIndex, colorBIndex) {
    let colorABin = decimalToBinary(colorAIndex - 1, 3);
    let colorBBin = decimalToBinary(colorBIndex - 1, 3);
    let encodedChar = String.fromCharCode(parseInt(`${colorABin}${colorBBin}`, 2) + 33);
    return encodedChar;
}

/**
 * Splits a string from the right a specified number of times.
 * @param {string} str - The input string.
 * @param {string} sep - The delimiter.
 * @param {number} maxSplit - Maximum number of splits. Default is unlimited (-1).
 * @returns {string[]} Array of split parts.
 */
function reverseSplit(str, sep, maxSplit = -1) {
    if (maxSplit < 0) {
        return str.split(sep);
    }

    const parts = str.split(sep);
    if (parts.length <= maxSplit + 1) {
        return parts;
    }

    const result = [
        parts.slice(0, -maxSplit).join(sep),
        ...parts.slice(-maxSplit),
    ];
    return result;
}

/**
 * Creates and downloads a text file with the specified content.
 * @param {string} text - The content of the file.
 * @param {string} fileName - The name of the file (without extension).
 */
function createTextFile(text, fileName) {
    fileName += '.lyim';
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
}
