const fs = require('fs');

let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf8');

// 1. Remove the old inline PERSONAL UI ALERT
cv = cv.replace(/\{\/\* PERSONAL UI ALERT \*\/\}\n\s*\{clientState\?.players\?\.\[clientNode\?\.\['playerId'\] \|\| ''\]\?\.uiAlert && \(\n\s*<div className="absolute inset-0 z-\[100\] flex items-center justify-center bg-black\/50 backdrop-blur-sm px-6">\n\s*<div className="w-full bg-ink-primary text-canvas border-4 border-accent-dare rounded-3xl p-8 shadow-2xl animate-pulse text-center">\n\s*<h3 className="text-2xl font-display font-black uppercase tracking-widest leading-tight">\n\s*\{clientState\.players\[clientNode!\['playerId'\]\]\.uiAlert\}\n\s*<\/h3>\n\s*<\/div>\n\s*<\/div>\n\s*\)\}/g, '');

// 2. Define AlertOverlay component at the top
const alertComponent = `
const AlertOverlay = ({ state, node }: { state: any, node: any }) => {
  if (!state || !node) return null;
  const globalAlert = state.uiAlert;
  const personalAlert = state.players?.[node.playerId]?.uiAlert;
  
  if (!globalAlert && !personalAlert) return null;
  
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md px-6 pointer-events-none">
       <div className="w-full max-w-sm bg-ink-primary text-canvas border-4 border-accent-dare rounded-[2rem] p-8 shadow-2xl animate-pulse text-center transform scale-105">
          <h3 className="text-2xl font-display font-black uppercase tracking-widest leading-snug">
            {personalAlert || globalAlert}
          </h3>
       </div>
    </div>
  );
};
`;

cv = cv.replace('export const ControllerView: React.FC = () => {', alertComponent + '\nexport const ControllerView: React.FC = () => {');

// 3. Inject it into the waiting block
cv = cv.replace(
  '<div className="min-h-screen w-full flex flex-col items-center justify-center bg-canvas p-8 text-center animate-pulse">',
  '<div className="min-h-screen w-full flex flex-col items-center justify-center bg-canvas p-8 text-center animate-pulse">\n        <AlertOverlay state={clientState} node={clientNode} />'
);

// 4. Inject it into the interstitial block
cv = cv.replace(
  '<div className="min-h-screen w-full flex flex-col items-center justify-center bg-accent-dare text-canvas p-8 text-center transition-all animate-pulse">',
  '<div className="min-h-screen w-full flex flex-col items-center justify-center bg-accent-dare text-canvas p-8 text-center transition-all animate-pulse">\n           <AlertOverlay state={clientState} node={clientNode} />'
);

// 5. Inject it into the main block
cv = cv.replace(
  '<div className="min-h-screen w-full flex flex-col bg-canvas transition-colors duration-500 overflow-hidden relative">',
  '<div className="min-h-screen w-full flex flex-col bg-canvas transition-colors duration-500 overflow-hidden relative">\n      <AlertOverlay state={clientState} node={clientNode} />'
);

fs.writeFileSync('src/views/ControllerView.tsx', cv);
console.log('Alert overlay injected');
