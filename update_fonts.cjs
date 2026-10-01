const fs = require('fs');

// Update index.html
let html = fs.readFileSync('index.html', 'utf8');
const oldLink = 'family=Plus+Jakarta+Sans:wght@600;700&family=Space+Mono:wght@700&family=Syne:wght@800&display=swap';
const newLink = 'family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@700&display=swap';
html = html.replace(oldLink, newLink);
fs.writeFileSync('index.html', html);

// Update tailwind.config.js
let tw = fs.readFileSync('tailwind.config.js', 'utf8');
tw = tw.replace(/display: \['Syne', 'sans-serif'\],/, "display: ['Fraunces', 'serif'],");
fs.writeFileSync('tailwind.config.js', tw);

console.log('Fonts updated successfully');
