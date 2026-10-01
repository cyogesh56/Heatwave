const fs = require('fs');
let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');

// 1. Fix bg-ink-primary/90 by making it bg-ink-primary 
hv = hv.replace(/bg-ink-primary\/90/g, 'bg-ink-primary');

// 2. Fix the overflow issues cutting the shadows
// Fix the main container
hv = hv.replace(/mx-auto overflow-hidden">/, 'mx-auto overflow-visible">');
// Fix the right-side container
hv = hv.replace(/max-h-\[40vh\] lg:max-h-none overflow-y-auto pr-2">/, 'max-h-[40vh] lg:max-h-none overflow-visible p-6">');

fs.writeFileSync('src/views/HostView.tsx', hv);
console.log('HostView fixed');
