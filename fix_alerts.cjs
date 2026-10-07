const fs = require('fs');

// Fix HostView.tsx
let hostCode = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

// Remove uiAlert from renderRevealArea
const targetRenderReveal = `  const renderRevealArea = () => {
    if (uiAlert) {
      return (
        <div className="w-full max-w-4xl mt-0 bg-surface-card text-ink-primary backdrop-blur-3xl rounded-3xl p-8 border-4 border-accent-dare shadow-2xl animate-pulse">
           <h3 className="text-xl md:text-2xl lg:text-3xl font-display font-black text-center">{uiAlert}</h3>
        </div>
      );
    }`;

const newRenderReveal = `  const renderRevealArea = () => {`;

hostCode = hostCode.replace(targetRenderReveal, newRenderReveal);

// Add Toast to HostView render
const hostRenderTarget = `        <div className="flex-1 flex flex-col items-center justify-center p-8">`;
const hostToast = `        {uiAlert && (
           <div className="fixed top-12 md:top-auto md:bottom-12 left-1/2 -translate-x-1/2 z-[9999] px-8 py-4 bg-accent-dare text-canvas rounded-full shadow-2xl pointer-events-none">
              <h3 className="text-lg md:text-2xl font-display font-black text-center whitespace-nowrap uppercase tracking-widest">{uiAlert}</h3>
           </div>
        )}
        <div className="flex-1 flex flex-col items-center justify-center p-8">`;

hostCode = hostCode.replace(hostRenderTarget, hostToast);
fs.writeFileSync('src/views/HostView.tsx', hostCode);


// Fix ControllerView.tsx
let controllerCode = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

const controllerOldAlert = `  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md px-6 pointer-events-none">
       <AnimatePresence>
         <motion.div 
           initial={{ scale: 0.5, opacity: 0, y: 50 }}
           animate={{ scale: 1, opacity: 1, y: 0 }}
           exit={{ scale: 0.5, opacity: 0, y: -50 }}
           transition={{ type: 'spring', stiffness: 400, damping: 15 }}
           className="w-full max-w-sm bg-accent-dare text-canvas rounded-[2rem] p-8 shadow-2xl flex flex-col items-center justify-center pointer-events-auto"
         >
           <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-black text-center uppercase tracking-widest">{globalAlert || personalAlert}</h3>
         </motion.div>
       </AnimatePresence>
    </div>
  );`;

const controllerNewAlert = `  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 w-full max-w-md pointer-events-none flex justify-center">
       <AnimatePresence>
         <motion.div 
           initial={{ scale: 0.5, opacity: 0, y: -50 }}
           animate={{ scale: 1, opacity: 1, y: 0 }}
           exit={{ scale: 0.5, opacity: 0, y: -50 }}
           transition={{ type: 'spring', stiffness: 400, damping: 15 }}
           className="bg-accent-dare text-canvas rounded-full px-6 py-3 shadow-2xl pointer-events-auto border-4 border-black/20"
         >
           <h3 className="text-sm sm:text-base font-display font-black text-center uppercase tracking-widest">{globalAlert || personalAlert}</h3>
         </motion.div>
       </AnimatePresence>
    </div>
  );`;

controllerCode = controllerCode.replace(controllerOldAlert, controllerNewAlert);
fs.writeFileSync('src/views/ControllerView.tsx', controllerCode);

