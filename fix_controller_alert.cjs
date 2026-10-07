const fs = require('fs');
let code = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

code = code.replace(
  'className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md px-6 pointer-events-none"',
  'className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-start justify-center px-6 pointer-events-none w-full"'
);

// We should also make the toast itself look like a toast, not a huge modal.
code = code.replace(
  'className="w-full max-w-sm bg-surface-card text-ink-primary border-4 border-accent-dare rounded-[2rem] p-8 shadow-2xl text-center"',
  'className="w-full max-w-sm bg-surface-card text-ink-primary border-2 border-accent-dare rounded-2xl p-4 shadow-2xl text-center backdrop-blur-xl"'
);

code = code.replace(
  'className="text-2xl font-display font-black uppercase tracking-widest leading-snug"',
  'className="text-sm font-display font-black uppercase tracking-widest leading-snug"'
);

fs.writeFileSync('src/views/ControllerView.tsx', code);
