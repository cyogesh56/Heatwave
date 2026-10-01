const fs = require('fs');
let code = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

// Replace AlertOverlay
code = code.replace(
  /<div className="w-full max-w-sm bg-surface-card text-ink-primary border-4 border-accent-dare rounded-\[2rem\] p-8 shadow-2xl animate-pulse text-center transform scale-105">\s*<h3 className="text-2xl font-display font-black uppercase tracking-widest leading-snug">\s*\{personalAlert \|\| globalAlert\}\s*<\/h3>\s*<\/div>/g,
  `<AnimatePresence>
         <motion.div 
           initial={{ scale: 0.5, opacity: 0, y: 50 }}
           animate={{ scale: 1, opacity: 1, y: 0 }}
           exit={{ scale: 0.5, opacity: 0, y: -50 }}
           transition={{ type: 'spring', stiffness: 400, damping: 15 }}
           className="w-full max-w-sm bg-surface-card text-ink-primary border-4 border-accent-dare rounded-[2rem] p-8 shadow-2xl text-center"
         >
            <h3 className="text-2xl font-display font-black uppercase tracking-widest leading-snug">
               {personalAlert || globalAlert}
            </h3>
         </motion.div>
       </AnimatePresence>`
);

// Replace Interstitial
code = code.replace(
  /<div className="min-h-\[100dvh\] w-full flex flex-col items-center justify-center bg-accent-dare text-canvas p-8 text-center transition-all animate-pulse">/g,
  `<motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         exit={{ opacity: 0, scale: 1.05 }}
         transition={{ type: 'spring', stiffness: 200, damping: 20 }}
         className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-accent-dare text-canvas p-8 text-center"
       >`
);

code = code.replace(
  /<\/h1>\n           <p className="text-xl font-body opacity-90">\{clientState.interstitial.subtitle\}<\/p>\n        <\/div>\n     \);\n  \}/g,
  `</h1>\n           <p className="text-xl font-body opacity-90">{clientState.interstitial.subtitle}</p>\n        </motion.div>\n     );\n  }`
);

fs.writeFileSync('src/views/ControllerView.tsx', code);
