const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

// Inside handleAction:
// When vote comes in (action.type === 'vote'): stats[playerId].truthsAnswered++ etc. But wait, 'vote' is generic.
// When truth is answered: action.type === 'fail_truth' or 'done' (which isn't tracked explicitly here except maybe phase changes).
// When power is used: action.type === 'power' -> stats[playerId].powersUsed++

code = code.replace(
  /if \(!inv \|\| inv\[powerKey as keyof typeof inv\] <= 0\) return;/,
  `if (!inv || inv[powerKey as keyof typeof inv] <= 0) return;
         setHostGameState((prev) => {
           if (!prev) return prev;
           const s = prev.stats || {};
           if (!s[playerId]) s[playerId] = { powersUsed: 0, truthsAnswered: 0, daresCompleted: 0, targetedCount: 0 };
           s[playerId].powersUsed++;
           return { ...prev, stats: s };
         });`
);

// We need to initialize stats when players join.
code = code.replace(
  /if \(!prev.players\[playerId\]\) return prev;/,
  `if (!prev.players[playerId]) return prev;
            const newStats = { ...prev.stats };
            if (!newStats[playerId]) newStats[playerId] = { powersUsed: 0, truthsAnswered: 0, daresCompleted: 0, targetedCount: 0 };`
);

code = code.replace(
  /return \{ \.\.\.prev, players: newPlayers \};/,
  `return { ...prev, players: newPlayers, stats: newStats };`
);

// Add the superlatives screen for uiState === 'ended'
const endedRegex = /if \(hostGameState.uiState === 'ended'\) \{[\s\S]*?return \([\s\S]*?<\/div>\n  \);\n\}/;
const newEnded = `if (hostGameState.uiState === 'ended') {
    const stats = hostGameState.stats || {};
    let saboteur = { id: '', max: 0 };
    for (const [id, s] of Object.entries(stats)) {
      if (s.powersUsed > saboteur.max) saboteur = { id, max: s.powersUsed };
    }

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-canvas text-ink-primary p-12 text-center"
      >
        <h1 className="text-6xl md:text-8xl font-display font-black uppercase tracking-widest mb-4">Game Over</h1>
        <div className="flex flex-col gap-6 mt-12 bg-surface-card p-12 rounded-[3rem] shadow-2xl border-4 border-ink-primary/10">
          <h2 className="text-3xl font-display font-bold uppercase tracking-widest text-accent-dare mb-4">Superlatives</h2>
          
          <div className="flex items-center gap-4 bg-ink-primary/5 p-6 rounded-2xl">
             <div className="text-4xl">😈</div>
             <div className="flex flex-col text-left">
                <span className="font-meta font-bold uppercase tracking-widest text-sm text-ink-primary/50">The Saboteur</span>
                <span className="font-display font-black text-2xl">{saboteur.max > 0 ? hostGameState.players[saboteur.id]?.name : 'Everyone was too nice'}</span>
                {saboteur.max > 0 && <span className="font-body font-medium text-ink-primary/70">{saboteur.max} powers used</span>}
             </div>
          </div>
        </div>
        
        <button onClick={() => window.location.href = '/'} className="mt-12 px-12 py-6 bg-ink-primary text-canvas font-display font-black text-2xl uppercase tracking-widest rounded-3xl shadow-solid hover:-translate-y-1 transition-all">
          Back to Lobby
        </button>
      </motion.div>
    );
}`;

code = code.replace(endedRegex, newEnded);
fs.writeFileSync('src/views/HostView.tsx', code);
