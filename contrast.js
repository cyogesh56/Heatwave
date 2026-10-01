function hexToRgb(hex) {
    hex = hex.replace('#', '');
    return { r: parseInt(hex.substring(0, 2), 16), g: parseInt(hex.substring(2, 4), 16), b: parseInt(hex.substring(4, 6), 16) };
}

function getLuminance(r, g, b) {
    var a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1, hex2) {
    var rgb1 = hexToRgb(hex1);
    var rgb2 = hexToRgb(hex2);
    var lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    var lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    var brightest = Math.max(lum1, lum2);
    var darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

console.log("Contrast: Deep Fig (#1C1024) on White (#FFFFFF):", getContrastRatio('#1C1024', '#FFFFFF').toFixed(2));
console.log("Contrast: Lavender Silk (#FDF6FF) on Fig Slate (#311938):", getContrastRatio('#FDF6FF', '#311938').toFixed(2));
console.log("Contrast: Deep Fig (#1C1024) on Tangerine (#FF7700):", getContrastRatio('#1C1024', '#FF7700').toFixed(2));
console.log("Contrast: White (#FFFFFF) on Hot Coral (#D91456):", getContrastRatio('#FFFFFF', '#D91456').toFixed(2));
