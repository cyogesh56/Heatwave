const fs = require('fs');

let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf8');

const oldReturn = `  if (!clientState || !clientState.currentCard) {
    return (
      <div className="min-h-screen bg-canvas text-ink-primary flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-5"></div>
        <div className="w-16 h-16 bg-surface-card rounded-2xl shadow-solid flex items-center justify-center border-4 border-ink-primary animate-bounce mb-8">
          <IconZap className="w-8 h-8 text-accent-truth" />
        </div>
        <h1 className="text-4xl font-display font-black uppercase tracking-widest">You're In.</h1>
        <p className="font-meta text-ink-primary/50 mt-4 text-sm uppercase tracking-widest font-bold">Look at the big screen. Wait for the Host to start.</p>
      </div>
    );
  }`;

const newReturn = `  if (!clientState || !clientState.currentCard) {
    const isReconnecting = !clientNode;
    return (
      <div className="min-h-screen bg-canvas text-ink-primary flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-5"></div>
        <div className="w-16 h-16 bg-surface-card rounded-2xl shadow-solid flex items-center justify-center border-4 border-ink-primary animate-bounce mb-8">
          <IconZap className="w-8 h-8 text-accent-truth" />
        </div>
        <h1 className="text-4xl font-display font-black uppercase tracking-widest">{isReconnecting ? "Reconnecting..." : "You're In."}</h1>
        <p className="font-meta text-ink-primary/50 mt-4 text-sm uppercase tracking-widest font-bold">{isReconnecting ? "Jacking back into the session..." : "Look at the big screen. Wait for the Host to start."}</p>
      </div>
    );
  }`;

cv = cv.replace(oldReturn, newReturn);
fs.writeFileSync('src/views/ControllerView.tsx', cv);

console.log('Reconnect text added');
