const fs = require('fs');

let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

// Fix Reveal Area Box padding and gaps
code = code.replace(
  'className="w-full max-w-4xl mt-0 bg-surface-card backdrop-blur-xl rounded-3xl p-8 border-2 border-ink-primary/10 shadow-2xl"',
  'className="w-full max-w-4xl mt-0 bg-surface-card backdrop-blur-xl rounded-3xl p-5 sm:p-8 border-2 border-ink-primary/10 shadow-2xl"'
);

// Fix Reveal Header Layout
code = code.replace(
  'className="flex items-center justify-between border-b border-ink-primary/10 pb-6 mb-6"',
  'className="flex flex-col sm:flex-row items-center justify-between border-b border-ink-primary/10 pb-4 sm:pb-6 mb-4 sm:mb-6 gap-2 sm:gap-4"'
);

// Fix Title Font Size
code = code.replace(
  '<h3 className="text-xl font-meta uppercase tracking-widest text-ink-primary/90">',
  '<h3 className="text-sm sm:text-xl font-meta uppercase tracking-widest text-ink-primary/90 text-center sm:text-left">'
);

// Fix Timer Font Size
code = code.replace(
  'className={`text-4xl md:text-5xl lg:text-6xl font-display font-black tabular-nums tracking-tighter',
  'className={`text-3xl md:text-5xl lg:text-6xl font-display font-black tabular-nums tracking-tighter'
);

// Fix Options Gap
code = code.replace(
  '<div className="flex flex-col gap-6">',
  '<div className="flex flex-col gap-3 sm:gap-6">'
);

// Fix Option Labels and Gap
code = code.replace(
  'className="flex items-center gap-4"',
  'className="flex items-center gap-2 sm:gap-4"'
);
code = code.replace(
  'className="w-48 text-right font-bold text-sm sm:text-base opacity-90 truncate"',
  'className="w-24 sm:w-32 md:w-48 text-right font-bold text-xs sm:text-base opacity-90 truncate leading-tight"'
);

// Fix Draw Next Card Button
code = code.replace(
  'className="mt-8 w-full py-6 bg-accent-dare text-canvas font-display font-black text-2xl uppercase tracking-widest rounded-2xl shadow-solid hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all"',
  'className="mt-6 sm:mt-8 w-full py-4 sm:py-6 bg-accent-dare text-canvas font-display font-black text-xl sm:text-2xl uppercase tracking-widest rounded-2xl shadow-solid hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all"'
);

// Fix Main Container Padding & Shrink & Scroll
// add pb-32 to allow scrolling past the fixed players dock on mobile
code = code.replace(
  'className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 lg:p-12 gap-8 lg:gap-16 relative z-0 w-full max-w-[1600px] mx-auto overflow-visible"',
  'className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 pb-32 lg:p-12 gap-4 sm:gap-8 lg:gap-16 relative z-0 w-full max-w-[1600px] mx-auto overflow-visible"'
);

// Add shrink-0 to Right Side
code = code.replace(
  'className="w-full lg:w-1/2 flex flex-col items-center justify-center min-h-[400px]"',
  'className="w-full lg:w-1/2 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] shrink-0"'
);

fs.writeFileSync('src/views/HostView.tsx', code);
