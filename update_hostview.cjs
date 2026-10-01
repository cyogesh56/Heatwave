const fs = require('fs');
let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');

// 1. Add startReveal function and the auto-advance useEffects
const autoAdvanceLogic = `
  const startReveal = () => {
    if (hostGameState?.revealCountdown) return;
    setHostGameState(prev => {
      if (!prev) return prev;
      const n = { ...prev, revealCountdown: 5, timers: { ...prev.timers, active: false, remainingSeconds: 0 } };
      hostServer?.broadcast(n);
      return n;
    });
  };

  useEffect(() => {
    const activeCount = Object.values(hostGameState?.players || {}).filter(p => p.isConnected !== false).length;
    if (hostGameState?.uiState === 'voting' && Object.keys(votes).length > 0 && Object.keys(votes).length >= activeCount) {
       startReveal();
    }
  }, [votes]);

  useEffect(() => {
    if (timeLeft <= 0 && hostGameState?.timers?.active && !hostGameState?.revealCountdown) {
       startReveal();
    }
  }, [timeLeft]);

  useEffect(() => {
    if (hostGameState?.revealCountdown && hostGameState.revealCountdown > 0) {
       const t = setTimeout(() => {
          if (hostGameState.revealCountdown === 1) {
             handleNextCard();
          } else {
             setHostGameState(prev => {
                if (!prev) return prev;
                const n = { ...prev, revealCountdown: prev.revealCountdown - 1 };
                hostServer?.broadcast(n);
                return n;
             });
          }
       }, 1000);
       return () => clearTimeout(t);
    }
  }, [hostGameState?.revealCountdown]);

  useEffect(() => {
    if (!hostGameState) return;
    const activeCount = Object.values(hostGameState.players || {}).filter((p: any) => p.isConnected !== false).length;
    
    if (hostGameState.readyPlayers && hostGameState.readyPlayers.length >= Math.ceil(activeCount / 2)) {
       startReveal();
    }

    if (hostGameState.juryState?.active) {
       const juryVotes = Object.values(hostGameState.juryState.votes);
       const requiredVotes = Math.max(1, activeCount - 1);
       if (juryVotes.length >= requiredVotes) {
          const yesVotes = juryVotes.filter(v => v === 'yes').length;
          if (yesVotes >= Math.ceil(requiredVotes / 2)) {
             startReveal();
          } else {
             window.dispatchEvent(new CustomEvent('player-action', { detail: { playerId: hostGameState.juryState.targetId, action: { type: 'fail_truth' } } }));
          }
       }
    }
  }, [hostGameState?.readyPlayers, hostGameState?.juryState?.votes]);
`;

// Insert autoAdvanceLogic right after useEffects in HostView
hv = hv.replace(
  "    window.addEventListener('player-action', handleAction);\n    return () => window.removeEventListener('player-action', handleAction);\n  }, [hostGameState, gameEngine]); // Dependencies needed to read latest state",
  "    window.addEventListener('player-action', handleAction);\n    return () => window.removeEventListener('player-action', handleAction);\n  }, [hostGameState, gameEngine]); // Dependencies needed to read latest state\n\n" + autoAdvanceLogic
);

// 2. Add action handling for did_it, jury_vote, ready
const newActions = `      } else if (action.type === 'did_it') {
         setHostGameState(prev => {
            if (!prev) return prev;
            const n = { ...prev, juryState: { active: true, targetId: playerId, votes: {} } };
            hostServer?.broadcast(n);
            return n;
         });
      } else if (action.type === 'jury_vote') {
         setHostGameState(prev => {
            if (!prev || !prev.juryState) return prev;
            const newVotes = { ...prev.juryState.votes, [playerId]: action.vote };
            const n = { ...prev, juryState: { ...prev.juryState, votes: newVotes } };
            hostServer?.broadcast(n);
            return n;
         });
      } else if (action.type === 'ready') {
         setHostGameState(prev => {
            if (!prev) return prev;
            const rp = [...(prev.readyPlayers || []), playerId];
            const n = { ...prev, readyPlayers: Array.from(new Set(rp)) };
            hostServer?.broadcast(n);
            return n;
         });
`;
hv = hv.replace(
  "      } else if (action.type === 'fail_truth') {",
  newActions + "      } else if (action.type === 'fail_truth') {"
);

// 3. Update nextState in handleNextCard to reset the new variables
hv = hv.replace(
  "        timers: {\n          active: !!futureTimer,",
  "        readyPlayers: [],\n        juryState: undefined,\n        revealCountdown: undefined,\n        timers: {\n          active: !!futureTimer,"
);

// 4. Update renderRevealArea to show the auto-advance countdown if active, and remove the manual "Draw Next Card" button, but keep a fallback "Force Advance" button
hv = hv.replace(
  /<button onClick=\{handleNextCard\} className="w-full py-6 bg-accent-dare text-canvas font-display font-black text-2xl uppercase tracking-widest rounded-3xl shadow-solid hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all">\n\s*Draw Next Card\n\s*<\/button>/g,
  `{hostGameState?.revealCountdown ? (
     <div className="w-full py-6 bg-accent-truth text-canvas font-display font-black text-2xl uppercase tracking-widest rounded-3xl shadow-solid text-center animate-pulse">
       ADVANCING IN {hostGameState.revealCountdown}...
     </div>
  ) : (
     <button onClick={handleNextCard} className="w-full py-4 bg-transparent border-4 border-ink-primary/20 text-ink-primary/40 font-display font-bold text-sm uppercase tracking-widest rounded-xl hover:bg-ink-primary/5 transition-all">
       Force Advance
     </button>
  )}`
);

// 5. Add bottom bar with online players
const bottomBar = `
      {/* Bottom Bar: Online Players */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-surface-card/90 backdrop-blur-md px-8 py-4 rounded-full border-2 border-ink-primary/10 shadow-xl z-50">
        {Object.entries(hostGameState.players).map(([id, p]: any) => (
           <div key={id} className="flex items-center gap-2">
             <div className={\`w-3 h-3 rounded-full shadow-solid-sm \${p.isConnected !== false ? 'bg-accent-wrong' : 'bg-accent-dare'}\`} />
             <span className="font-meta text-sm font-bold uppercase tracking-widest text-ink-primary/70">{p.name}</span>
           </div>
        ))}
      </div>
`;
hv = hv.replace(
  "      </main>\n    </div>",
  "      </main>\n" + bottomBar + "    </div>"
);

fs.writeFileSync('src/views/HostView.tsx', hv);
console.log('HostView updated');
