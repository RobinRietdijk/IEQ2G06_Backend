import puppeteer from 'puppeteer';
import { GetColorName } from './color.js';
import { HTML, style } from './puppeteer_html.js';

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

function calculateRelativeLuminance(rgb) {
    const sRGB = rgb.map((val) => {
        val /= 255.0;
        return val <= 0.04045 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    const luminance = 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
    return luminance;
}

function getContrastColor(bgColor) {
    const bgRgb = hexToRgb(bgColor);
    const bgLuminance = calculateRelativeLuminance(bgRgb);

    return bgLuminance > 0.5 ? '#000' : '#fff';
}

export async function generateImageOfElement(name, poem, color) {
    const browser = await puppeteer.launch({headless: 'new'});
    const page = await browser.newPage();
    await page.setContent(HTML);
    await page.addStyleTag({ content: style });

    const textColor = getContrastColor(color);
    const colorName = GetColorName(color);
    await page.evaluate((poem, color, textColor, colorName) => {
        const cardContainerEl = document.querySelector(".card__container");
        const poemTextEl = document.querySelector(".poem__inner span");
        const colorNameEl = document.querySelector(".color__name span");
        const colorHexEl = document.querySelector(".color__hex span");
        cardContainerEl.style.backgroundColor = color;
        cardContainerEl.style.color = textColor;
        poemTextEl.innerHTML = poem;
        colorNameEl.innerHTML = colorName;
        colorHexEl.innerHTML = color;
    }, poem, color, textColor, colorName);

    const selector = '#capture';
    const outputPath = `./tmp/${name}.png`;
    const elementHandle = await page.$(selector);

    if (!elementHandle) {
        console.error(`Element with selector "${selector}" not found.`);
        await browser.close();
        return;
    }

    await elementHandle.screenshot({ path: outputPath });
    await browser.close();
}