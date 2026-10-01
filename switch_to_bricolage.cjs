const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('index.html', 'utf8');
const oldFontLink = 'family=Fraunces:ital,wght@0,100..900;1,100..900';
const newFontLink = 'family=Bricolage+Grotesque:opsz,wght@12..96,200..800';
html = html.replace(oldFontLink, newFontLink);
fs.writeFileSync('index.html', html);

// 2. Update tailwind.config.js
let tw = fs.readFileSync('tailwind.config.js', 'utf8');
tw = tw.replace(/display: \['"Fraunces"', 'serif'\],/, "display: ['\"Bricolage Grotesque\"', 'sans-serif'],");
fs.writeFileSync('tailwind.config.js', tw);

// 3. Update DESIGN_SYSTEM.md
let ds = fs.readFileSync('DESIGN_SYSTEM.md', 'utf8');
ds = ds.replace(
  /- \*\*Display \(The Stage\):\*\* \`Fraunces\` \(Variable Soft Serif\) - used for prompts, hero headers, and expressive sweeping typography\./,
  '- **Display (The Stage):** `Bricolage Grotesque` (Variable Grotesque Sans) - used for prompts, hero headers, and expressive, high-impact typography.'
);
fs.writeFileSync('DESIGN_SYSTEM.md', ds);

console.log('Switched to Bricolage Grotesque');
