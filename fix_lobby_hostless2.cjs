const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');

// Add clientNode to useGame
code = code.replace(
  "const { hostServer, hostGameState, setHostGameState, startGame, isHost, initClient } = useGame();",
  "const { hostServer, hostGameState, setHostGameState, startGame, isHost, initClient, clientNode } = useGame();"
);

// Remove the input from the rules step
const rulesTarget = `{isHostless && (
              <div className="flex flex-col gap-2 mb-6">
                <label className="font-meta font-bold text-xs uppercase tracking-widest text-ink-primary/50">Your Display Name</label>
                <input 
                  type="text" 
                  maxLength={12}
                  value={hostPlayerName}
                  onChange={(e) => setHostPlayerName(e.target.value)}
                  placeholder="e.g. Maverick"
                  className="w-full bg-surface-card text-ink-primary text-xl font-body p-4 rounded-2xl border-4 border-ink-primary/10 focus:border-accent-consensus outline-none transition-colors shadow-solid-sm"
                />
              </div>
            )}`;
code = code.replace(rulesTarget, "");

// Modify step === 'connect'
const connectTarget = `<div className="w-full max-w-sm flex-1 flex flex-col justify-end">
              <button 
                onClick={() => setStep('intent')}
                disabled={connectedPlayers.length < 2}
                className="w-full py-5 bg-accent-consensus text-canvas font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-xl disabled:opacity-50 disabled:shadow-none hover:-translate-y-1 transition-all active:scale-95"
              >
                {connectedPlayers.length < 2 ? 'Waiting for players...' : 'Next'}
              </button>
            </div>`;

const connectReplacement = `<div className="w-full max-w-sm flex-1 flex flex-col justify-end gap-4">
              {isHostless && !clientNode && (
                <div className="flex flex-col gap-2 p-4 bg-surface-card border-4 border-accent-dare/20 rounded-2xl mb-2">
                  <label className="font-meta font-bold text-xs uppercase tracking-widest text-ink-primary/50 text-center">Join as Player 1</label>
                  <input 
                    type="text" 
                    maxLength={12}
                    value={hostPlayerName}
                    onChange={(e) => setHostPlayerName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-canvas text-ink-primary text-center text-xl font-body p-3 rounded-xl border-2 border-ink-primary/10 focus:border-accent-dare outline-none transition-colors"
                  />
                  <button 
                    onClick={() => initClient(hostServer?.roomCode || '', hostPlayerName)}
                    disabled={!hostPlayerName.trim()}
                    className="w-full mt-2 py-3 bg-accent-dare text-canvas font-display font-bold text-lg uppercase tracking-widest rounded-xl disabled:opacity-50 active:scale-95 transition-all"
                  >
                    Join
                  </button>
                </div>
              )}
              <button 
                onClick={() => setStep('intent')}
                disabled={connectedPlayers.length < 2 || (isHostless && !clientNode)}
                className="w-full py-5 bg-accent-consensus text-canvas font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-xl disabled:opacity-50 disabled:shadow-none hover:-translate-y-1 transition-all active:scale-95"
              >
                {connectedPlayers.length < 2 ? 'Waiting for players...' : 'Next'}
              </button>
            </div>`;

code = code.replace(connectTarget, connectReplacement);

// Fix Launch Button
code = code.replace(
  "disabled={isHostless && !hostPlayerName.trim()}\n                className=\"w-full py-5 bg-ink-primary text-canvas disabled:opacity-50 font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-xl hover:-translate-y-1 transition-all active:scale-95\"",
  "className=\"w-full py-5 bg-ink-primary text-canvas font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-xl hover:-translate-y-1 transition-all active:scale-95\""
);

// Fix handleStart to just navigate
const startTarget = `if (isHostless) {
      if (!hostPlayerName.trim()) { setPopupMessage("Please enter your name!"); return; }
      await initClient(hostServer?.roomCode || '', hostPlayerName);
      navigate('/host'); // We still need HostView to mount the game loop!
    } else {
      navigate('/host');
    }`;
const startReplacement = `navigate('/host');`;
code = code.replace(startTarget, startReplacement);

fs.writeFileSync('src/views/LobbyView.tsx', code);
