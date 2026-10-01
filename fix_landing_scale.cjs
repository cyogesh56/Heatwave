const fs = require('fs');

let ld = fs.readFileSync('src/views/Landing.tsx', 'utf8');

// 1. Fix Hero Step
ld = ld.replace(
  'className="text-6xl md:text-8xl font-display font-black tracking-tighter text-ink-primary uppercase"', 
  'className="text-5xl sm:text-6xl md:text-8xl font-display font-black tracking-tighter text-ink-primary uppercase"'
);

ld = ld.replace(
  'className="text-xl font-body text-ink-primary/70 max-w-md font-medium leading-relaxed"',
  'className="text-lg sm:text-xl font-body text-ink-primary/70 max-w-md font-medium leading-relaxed px-4"'
);

ld = ld.replace(
  'className="mt-8 px-12 py-5 bg-accent-truth text-white font-display font-bold text-2xl uppercase tracking-widest rounded-full shadow-[0_10px_40px_rgba(79,70,229,0.4)] hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(79,70,229,0.6)] transition-all duration-300 active:scale-95"',
  'className="mt-6 sm:mt-8 w-full max-w-[280px] sm:max-w-sm py-4 sm:py-5 bg-accent-truth text-white font-display font-bold text-lg sm:text-2xl uppercase tracking-widest rounded-full shadow-[0_10px_40px_rgba(79,70,229,0.4)] hover:-translate-y-1 transition-all duration-300 active:scale-95"'
);

// 2. Fix Setup Step
ld = ld.replace(
  'className="text-4xl font-display font-black mb-12 uppercase tracking-wide"',
  'className="text-3xl sm:text-4xl font-display font-black mb-8 sm:mb-12 uppercase tracking-wide text-center"'
);

ld = ld.replace(
  /className="flex-1 bg-surface-card border-\[3\.5px\] border-accent-truth rounded-3xl p-10/g,
  'className="flex-1 bg-surface-card border-[3.5px] border-accent-truth rounded-3xl p-6 sm:p-10'
);

ld = ld.replace(
  /className="flex-1 bg-surface-card border-\[3\.5px\] border-accent-consensus rounded-3xl p-10/g,
  'className="flex-1 bg-surface-card border-[3.5px] border-accent-consensus rounded-3xl p-6 sm:p-10'
);

ld = ld.replace(
  /className="text-3xl font-display font-black mb-4"/g,
  'className="text-2xl sm:text-3xl font-display font-black mb-2 sm:mb-4"'
);

ld = ld.replace(
  /className="font-body text-ink-primary\/60 font-medium"/g,
  'className="font-body text-sm sm:text-base text-ink-primary/60 font-medium px-2"'
);

// 3. Fix Join Step
ld = ld.replace(
  'className="text-3xl font-display font-black text-center mb-8 uppercase tracking-wide"',
  'className="text-2xl sm:text-3xl font-display font-black text-center mb-6 sm:mb-8 uppercase tracking-wide"'
);

ld = ld.replace(
  'className="w-full bg-ink-primary/5 text-ink-primary text-center text-4xl tracking-[0.25em] font-mono p-4 rounded-xl border-2 border-ink-primary/10 focus:border-accent-consensus focus:bg-surface-card outline-none transition-colors uppercase"',
  'className="w-full bg-ink-primary/5 text-ink-primary text-center text-3xl sm:text-4xl tracking-[0.2em] sm:tracking-[0.25em] font-mono p-3 sm:p-4 rounded-xl border-2 border-ink-primary/10 focus:border-accent-consensus focus:bg-surface-card outline-none transition-colors uppercase"'
);

ld = ld.replace(
  'className="w-full max-w-md bg-surface-card border-[3.5px] border-accent-consensus rounded-3xl p-8 shadow-tactile"',
  'className="w-full max-w-md bg-surface-card border-[3.5px] border-accent-consensus rounded-3xl p-6 sm:p-8 shadow-tactile"'
);

fs.writeFileSync('src/views/Landing.tsx', ld);

console.log('Fixed landing page scale.');
