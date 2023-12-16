import { GetColorName } from './color.js';

function getContrastColor(bgColor) {
    const hexToRgb = (hex) => {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return [r, g, b];
    };

    const calculateRelativeLuminance = (rgb) => {
        const sRGB = rgb.map((val) => {
            val /= 255.0;
            return val <= 0.04045 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
        });
        const luminance = 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
        return luminance;
    };

    const bgRgb = hexToRgb(bgColor);
    const bgLuminance = calculateRelativeLuminance(bgRgb);

    return bgLuminance > 0.5 ? '#000' : '#fff';
}

const cardContainer = document.querySelector(".card__container");
const poemText = document.querySelector(".poem__inner span");
const colorName = document.querySelector(".color__name span");
const colorHex = document.querySelector(".color__hex span");
const TUDLogo = document.querySelector(".title__logo svg");

function setData(color, poem) {
    cardContainer.style.backgroundColor = color;
    const textColor = getContrastColor(color);
    cardContainer.style.color = textColor;
    TUDLogo.querySelectorAll('*').forEach(function(el) {
        el.style.fill = textColor;
    });
    poemText.innerHTML = poem;
    colorName.innerHTML = GetColorName(color);
    colorHex.innerHTML = color;
}

const color = decodeURIComponent(color_encoded);
const poem = decodeURIComponent(poem_encoded);
setData(color, poem);