const fs = require('fs');
let code = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

const newAlertOverlay = `const AlertOverlay = ({ state, node }: { state: any, node: any }) => {
  if (!state || !node) return null;
  const globalAlert = state.uiAlert;
  const personalAlert = state.players?.[node.playerId]?.uiAlert;

  React.useEffect(() => {
    if (personalAlert || globalAlert) {
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
  }, [personalAlert, globalAlert]);
  
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-start justify-center px-6 pointer-events-none w-full">
       <AnimatePresence>
         {(globalAlert || personalAlert) && (
           <motion.div 
             initial={{ scale: 0.8, opacity: 0, y: -20 }}
             animate={{ scale: 1, opacity: 1, y: 0 }}
             exit={{ scale: 0.8, opacity: 0, y: -20 }}
             transition={{ type: 'spring', stiffness: 400, damping: 15 }}
             className="w-full max-w-sm bg-surface-card text-ink-primary border-4 border-accent-dare rounded-2xl p-4 shadow-2xl text-center backdrop-blur-xl"
           >
              <h3 className="text-sm font-display font-black uppercase tracking-widest leading-snug">
                 {personalAlert || globalAlert}
              </h3>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};`;

code = code.replace(
  /const AlertOverlay = \(\{ state, node \}: \{ state: any, node: any \}\) => \{[\s\S]*?\};\n/,
  newAlertOverlay + '\n'
);

fs.writeFileSync('src/views/ControllerView.tsx', code);
