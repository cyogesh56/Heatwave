const fs = require('fs');

let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

const endedUI = `
  if (hostGameState.uiState === 'ended') {
    return (
      <div className="min-h-[100dvh] bg-canvas text-ink-primary flex flex-col items-center justify-center p-12 text-center">
        <h1 className="text-6xl md:text-8xl font-display font-black text-accent-dare mb-6 uppercase tracking-widest">Game Over</h1>
        <p className="text-xl md:text-2xl font-body text-ink-primary/70 mb-12">The decks have run dry. The heat has subsided.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
          {Object.entries(hostGameState.players || {}).map(([id, p]: any) => (
             <div key={id} className="bg-surface-card p-6 rounded-3xl border-4 border-ink-primary/10 shadow-solid flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full border-4 border-ink-primary bg-accent-consensus-fill mb-4"></div>
                <h3 className="font-display font-black text-2xl uppercase tracking-widest">{p.name}</h3>
                <div className="mt-4 flex gap-4 opacity-70">
                  <div className="flex flex-col items-center">
                    <span className="font-meta font-bold text-2xl">{hostGameState.stats?.[id]?.powersUsed || 0}</span>
                    <span className="font-meta text-xs uppercase tracking-widest">Powers</span>
                  </div>
                </div>
             </div>
          ))}
        </div>

        <button 
          onClick={() => window.location.href = '/'} 
          className="px-12 py-6 bg-ink-primary text-canvas font-display font-black text-2xl uppercase tracking-widest rounded-[2rem] shadow-solid hover:-translate-y-2 transition-all active:scale-95"
        >
          Return to Lobby
        </button>
      </div>
    );
  }
`;

code = code.replace(
  /  if \(hostGameState.uiState === 'interstitial' && hostGameState.interstitial\) \{/,
  endedUI + "\n  if (hostGameState.uiState === 'interstitial' && hostGameState.interstitial) {"
);

fs.writeFileSync('src/views/HostView.tsx', code);
