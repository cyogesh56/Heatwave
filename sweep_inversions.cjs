const fs = require('fs');

// Fix HostView.tsx
let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');

// Fix global alert box
hv = hv.replace(
  /bg-ink-primary text-canvas backdrop-blur-3xl rounded-3xl p-8 border-4 border-accent-dare shadow-2xl animate-pulse/g,
  'bg-surface-card text-ink-primary backdrop-blur-3xl rounded-3xl p-8 border-4 border-accent-dare shadow-2xl animate-pulse'
);

// Fix In the Spotlight
hv = hv.replace(
  /bg-ink-primary backdrop-blur-2xl border-2 border-accent-truth\/40 px-12 py-8 rounded-\[2rem\] flex flex-col items-center gap-3 shadow-2xl/g,
  'bg-surface-card backdrop-blur-2xl border-2 border-accent-truth/40 px-12 py-8 rounded-[2rem] flex flex-col items-center gap-3 shadow-2xl'
);
// Fix In the Spotlight Text
hv = hv.replace(
  /text-5xl font-black tracking-tight bg-gradient-to-br from-white to-white\/70 bg-clip-text text-transparent uppercase/g,
  'text-5xl font-black tracking-tight text-ink-primary opacity-90 uppercase'
);

// Fix Consensus polling table
hv = hv.replace(
  /bg-ink-primary\/5 backdrop-blur-xl rounded-3xl p-8 border border-ink-primary\/10 shadow-2xl/g,
  'bg-surface-card backdrop-blur-xl rounded-3xl p-8 border-2 border-ink-primary/10 shadow-2xl'
);
// Fix progress bar track in Consensus
hv = hv.replace(/bg-ink-primary\/10 rounded-full/g, 'bg-canvas rounded-full shadow-inner');
// Fix progress bar shimmer
hv = hv.replace(/bg-ink-primary\/15 w-full h-full animate-pulse/g, 'bg-white/20 w-full h-full animate-pulse');


fs.writeFileSync('src/views/HostView.tsx', hv);


// Fix ControllerView.tsx
let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf8');

// Fix AlertOverlay
cv = cv.replace(
  /bg-ink-primary text-canvas border-4 border-accent-dare/g,
  'bg-surface-card text-ink-primary border-4 border-accent-dare'
);

fs.writeFileSync('src/views/ControllerView.tsx', cv);

// Fix DESIGN_SYSTEM.md - Ensure we remove the 'asymmetric inversion' rule if we are removing it, but wait, we are just fixing the box so it matches light/dark properly.
console.log('Swept inversions');
