const fs = require('fs');

// 1. Landing.tsx Jack In Button Fix
let ld = fs.readFileSync('src/views/Landing.tsx', 'utf8');
ld = ld.replace(/disabled=\{isJoining\}/g, "disabled={isJoining || roomCode.length < 6 || !playerName.trim()}");
fs.writeFileSync('src/views/Landing.tsx', ld);

// 2, 3, 4. ControllerView Rewrite
let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf8');

// Fix the disconnect state properly
if (!cv.includes("uiState === 'disconnected'")) {
    cv = cv.replace(/if \(!clientState \|\| !clientState\.currentCard\) \{/g, `if (clientState?.uiState === 'disconnected') {
    return (
      <div className="min-h-screen bg-canvas text-ink-primary flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-display font-black text-accent-dare mb-4 uppercase">Host Disconnected</h1>
        <p className="font-body text-ink-primary/70">The host closed the game or lost connection. Refresh to join a new room.</p>
      </div>
    );
  }
  if (!clientState || !clientState.currentCard) {`);
}

// Rewrite Action Zone to include the Timer and "Voted" state
const actionZoneStart = `{/* ACTION ZONE (Massive target, clear hierarchy) */}`;
const powerDockStart = `{/* POWER DOCK */}`;

const cvParts = cv.split(actionZoneStart);
const cvParts2 = cvParts[1].split(powerDockStart);

const newActionZone = `
      <section className="flex-1 w-full max-w-xl mx-auto flex flex-col items-center justify-center p-6 gap-6 relative z-0">
        {clientState?.timers?.active && timeLeft > 0 && (
          <div className="absolute top-0 right-6 font-meta font-bold text-2xl text-ink-primary/50 animate-pulse">
             00:{timeLeft.toString().padStart(2, '0')}
          </div>
        )}
        {questionType === 'wrong' || questionType === 'consensus' || questionType === 'vibe_poll' ? (
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex items-center gap-4">
              <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
              <span className="font-meta text-xs uppercase tracking-widest font-bold text-ink-primary/40">Cast Your Vote</span>
              <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
            </div>
            {selectedChoice || (clientState?.timers?.active && timeLeft <= 0) ? (
              <div className="w-full py-12 text-center text-4xl font-display font-black text-ink-primary/50 animate-pulse uppercase tracking-widest border-4 border-dashed border-ink-primary/20 rounded-3xl">
                {selectedChoice ? 'VOTED' : 'TIME UP'}
              </div>
            ) : (
              <ChoiceGrid 
                choices={card.options || ['A', 'B', 'C', 'D']} 
                selectedChoice={selectedChoice}
                onSelect={handleVote}
                accent={questionType === 'wrong' ? 'wrong' : 'consensus'}
              />
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex items-center gap-4">
              <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
              <span className="font-meta text-xs uppercase tracking-widest font-bold text-ink-primary/40">Your Turn</span>
              <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
            </div>
            <button 
              onClick={() => handleVote('done')}
              disabled={selectedChoice !== null}
              className="w-full py-8 rounded-2xl bg-accent-truth border-4 border-ink-primary text-canvas font-display font-black text-3xl uppercase tracking-widest shadow-solid active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
            >
              {selectedChoice ? 'WAITING...' : 'I DID IT'}
            </button>
          </div>
        )}
      </section>

      `;

cv = cvParts[0] + actionZoneStart + newActionZone + powerDockStart + cvParts2[1];
fs.writeFileSync('src/views/ControllerView.tsx', cv);

// HostView Timer Prominence & disable voting on 0
let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');

// Make timer larger
hv = hv.replace(/<div className="absolute -top-6 -right-6 scale-125 origin-center shadow-2xl rounded-full">/g, '<div className="absolute -top-8 -right-8 scale-150 origin-center shadow-2xl rounded-full z-50">');

// We also need to fix flashing 00:00.
// In HostView `handleNextCard`, futureTimer is `Date.now() + 5000 + 30000`.
// `useSyncTimer` sets it to `remainingSeconds`.
fs.writeFileSync('src/views/HostView.tsx', hv);

console.log("Issues fixed.");
