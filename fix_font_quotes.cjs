const fs = require('fs');
let tw = fs.readFileSync('tailwind.config.js', 'utf8');
tw = tw.replace(/display: \['Fraunces', 'serif'\],/, "display: ['\"Fraunces\"', 'serif'],");
fs.writeFileSync('tailwind.config.js', tw);
console.log('Fixed quotes in tailwind.config.js');
