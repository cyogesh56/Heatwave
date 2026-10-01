const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('index.html', 'utf8');
const fontLink = 'family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@700&display=swap';
const newFontLink = 'family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
html = html.replace(fontLink, newFontLink);
fs.writeFileSync('index.html', html);

// 2. Update tailwind.config.js
let tw = fs.readFileSync('tailwind.config.js', 'utf8');
tw = tw.replace(/meta: \['"Space Mono"', 'monospace'\],/, "meta: ['\"Plus Jakarta Sans\"', 'sans-serif'],");
fs.writeFileSync('tailwind.config.js', tw);

// 3. Update DESIGN_SYSTEM.md
let ds = fs.readFileSync('DESIGN_SYSTEM.md', 'utf8');
ds = ds.replace(
  /## 3\. Typography[\s\S]*?## 4\. Contrast/,
  `## 3. Typography
- **Display (The Stage):** \`Fraunces\` (Variable Soft Serif) - used for prompts, hero headers, and expressive sweeping typography.
- **Body & Meta (The Controller):** \`Plus Jakarta Sans\` (Geometric Sans) - used for options, descriptions, pills, badges, timers, and tactical power buttons. Excellent legibility at small sizes.
*Note: No other fonts are permitted in the application.*

## 4. Contrast`
);
fs.writeFileSync('DESIGN_SYSTEM.md', ds);

console.log('Font audit complete');
