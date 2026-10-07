const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');
code = code.replace(
  'font-display text-4xl">Loading Deck...',
  'font-display text-2xl md:text-3xl lg:text-4xl">Loading Deck...'
);
fs.writeFileSync('src/views/HostView.tsx', code);
