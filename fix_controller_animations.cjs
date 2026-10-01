const fs = require('fs');
let code = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

if (!code.includes("import { motion, AnimatePresence } from 'framer-motion';")) {
    code = code.replace("import { UniversalHeader } from '../components/ui/UniversalHeader';", "import { UniversalHeader } from '../components/ui/UniversalHeader';\nimport { motion, AnimatePresence } from 'framer-motion';");
}

// 1. AlertOverlay Animation
const oldAlert = `<div className="w-full max-w-sm bg-surface-card text-ink-primary border-4 border-accent-dare rounded-[2rem] p-8 shadow-2xl animate-pulse text-center transform scale-105">
          <h3 className="text-2xl font-display font-black uppercase tracking-widest leading-snug">
             {personalAlert || globalAlert}
          </h3>
       </div>`;
       
const newAlert = `<AnimatePresence>
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
       </AnimatePresence>`;

code = code.replace(oldAlert, newAlert);

// 2. Interstitial Animation
const oldInter = `<div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-accent-dare text-canvas p-8 text-center transition-all animate-pulse">
           <AlertOverlay state={clientState} node={clientNode} />
           <h1 className="text-4xl font-display font-black uppercase tracking-widest mb-4">{clientState.interstitial.title}</h1>`;

const newInter = `<motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         exit={{ opacity: 0, scale: 1.05 }}
         transition={{ type: 'spring', stiffness: 200, damping: 20 }}
         className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-accent-dare text-canvas p-8 text-center"
       >
           <AlertOverlay state={clientState} node={clientNode} />
           <h1 className="text-4xl font-display font-black uppercase tracking-widest mb-4">{clientState.interstitial.title}</h1>`;

code = code.replace(oldInter, newInter);
code = code.replace(/<\/h1>\n           <p className="text-xl font-body opacity-90">\{clientState.interstitial.subtitle\}<\/p>\n        <\/div>\n     \);\n  \}/g, `</h1>\n           <p className="text-xl font-body opacity-90">{clientState.interstitial.subtitle}</p>\n        </motion.div>\n     );\n  }`);


fs.writeFileSync('src/views/ControllerView.tsx', code);
