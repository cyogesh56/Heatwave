const fs = require('fs');
let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf8');

const oldWaiting = `  if (!clientState || !clientState.currentCard) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-8 text-center font-display">
        <h1 className="text-3xl font-bold animate-pulse">Waiting for Host...</h1>
        <p className="text-gray-400 mt-4 text-sm font-sans">Look at the TV screen!</p>
      </div>
    );
  }`;

const newWaiting = `  if (!clientState || !clientState.currentCard) {
    return (
      <div className="min-h-screen bg-deck-after-dark text-black flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-5"></div>
        <div className="w-16 h-16 bg-surface-card rounded-2xl shadow-glow-active flex items-center justify-center border-[3.5px] border-accent-truth animate-spin-slow mb-8">
          <IconZap className="w-8 h-8 text-accent-truth" />
        </div>
        <h1 className="text-4xl font-display font-black uppercase tracking-widest">You're In.</h1>
        <p className="font-meta text-black/50 mt-4 text-sm uppercase tracking-widest font-bold">Look at the big screen.</p>
      </div>
    );
  }`;

cv = cv.replace(oldWaiting, newWaiting);
fs.writeFileSync('src/views/ControllerView.tsx', cv);
