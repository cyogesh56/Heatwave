const fs = require('fs');

let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');

// Remove TimerBadge from corner of the card
const oldCardTimer = `          {(card.type === 'kahoot' || card.type === 'wrong_answers' || card.type === 'consensus') && (
            <div className="absolute -top-8 -right-8 scale-150 origin-center shadow-2xl rounded-full z-50">
              <TimerBadge timeLeft={timeLeft} totalTime={30} />
            </div>
          )}`;
hv = hv.replace(oldCardTimer, '');

// Inject massive timer into Consensus area
const oldConsensusHeader = `<h3 className="text-xl font-meta uppercase tracking-widest mb-6 text-center text-ink-primary/90">Consensus ({totalVotes} votes)</h3>`;
const newConsensusHeader = `<div className="flex items-center justify-between border-b border-ink-primary/10 pb-6 mb-6">
          <h3 className="text-xl font-meta uppercase tracking-widest text-ink-primary/90">Consensus ({totalVotes} votes)</h3>
          {hostGameState?.timers?.active && (
            <div className={\`text-6xl font-display font-black tabular-nums tracking-tighter \${timeLeft <= 10 ? 'text-accent-wrong animate-pulse' : 'text-accent-consensus'}\`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
          )}
        </div>`;
hv = hv.replace(oldConsensusHeader, newConsensusHeader);

fs.writeFileSync('src/views/HostView.tsx', hv);
console.log('Timer made prominent');
