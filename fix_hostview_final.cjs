const fs = require('fs');

let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');

// 1. handleNextCard Options Injection & Timer Logic
const oldHandleNextCard = `    if (drawn) {
      setVotes({});
      const nextState = {
        ...hostGameState,
        players: newPlayers,
        currentCard: drawn,
        uiState: 'voting' as const
      };
      setHostGameState(nextState);
      hostServer?.broadcast(nextState);
      setTimeLeft(30);
      if (alertMsg) {
        setUiAlert(alertMsg);
        setTimeout(() => setUiAlert(''), 4000);
      }
    }`;

const newHandleNextCard = `    if (drawn) {
      setVotes({});
      
      // Inject options for Kahoot/Consensus if missing, or Vibe Poll
      if (drawn.card.type === 'vibe_poll') {
         drawn.card.options = Object.values(newPlayers).map(p => p.name);
      } else if (!drawn.card.options && (drawn.card.type === 'kahoot' || drawn.card.type === 'wrong_answers' || drawn.card.type === 'consensus')) {
         drawn.card.options = ['A', 'B', 'C', 'D'];
      }

      // Timer Logic
      const isVoting = ['kahoot', 'wrong_answers', 'consensus', 'vibe_poll'].includes(drawn.card.type);
      const isDare = drawn.card.type === 'dare';
      
      let futureTimer = null;
      if (isVoting) {
         futureTimer = Date.now() + 5000 + (30 * 1000); // 5s read + 30s vote
      } else if (isDare && drawn.card.prompt.includes('60')) {
         futureTimer = Date.now() + 5000 + (60 * 1000); // 60s dare timer
      }

      const nextState = {
        ...hostGameState,
        players: newPlayers,
        currentCard: drawn,
        uiState: 'voting' as const,
        timers: {
          active: !!futureTimer,
          endsAt: futureTimer
        }
      };
      setHostGameState(nextState);
      hostServer?.broadcast(nextState);
      
      if (alertMsg) {
        setUiAlert(alertMsg);
        setTimeout(() => setUiAlert(''), 4000);
      }
    }`;

hv = hv.replace(oldHandleNextCard, newHandleNextCard);

// 2. Remove Draw Next Card from header and put it in main reveal area
hv = hv.replace(
    `<div className="flex items-center gap-4">
          <button onClick={handleNextCard} className="font-meta text-sm uppercase tracking-widest bg-ink-primary/10 px-5 py-2 rounded-full border border-ink-primary/30 shadow-lg hover:bg-ink-primary hover:text-canvas  transition-colors">
            Draw Next Card
          </button>
        </div>`,
    ''
);

const oldRevealTruthDare = `if (card.type !== 'kahoot' && card.type !== 'wrong_answers' && card.type !== 'consensus') {
      return (
        <div className="relative group w-full max-w-md mt-0">
          <div className="absolute inset-0 bg-accent-truth blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full"></div>
          <div className="relative bg-ink-primary/90 backdrop-blur-2xl border-2 border-accent-truth/40 px-12 py-8 rounded-[2rem] flex flex-col items-center gap-3 shadow-2xl transition-transform hover:scale-105 duration-300">
            <span className="font-meta text-accent-truth uppercase tracking-widest text-sm font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-truth animate-ping"></span>
              In the Spotlight
            </span>
            <h2 className="text-4xl font-black tracking-tight bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">Truth or Dare</h2>
          </div>
        </div>
      );
    }`;

const newRevealTruthDare = `if (!['kahoot', 'wrong_answers', 'consensus', 'vibe_poll'].includes(card.type)) {
      return (
        <div className="flex flex-col gap-8 w-full max-w-md items-center mt-0">
          <div className="relative group w-full">
            <div className="absolute inset-0 bg-accent-truth blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full"></div>
            <div className="relative bg-ink-primary/90 backdrop-blur-2xl border-2 border-accent-truth/40 px-12 py-8 rounded-[2rem] flex flex-col items-center gap-3 shadow-2xl transition-transform hover:scale-105 duration-300">
              <span className="font-meta text-accent-truth uppercase tracking-widest text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-truth animate-ping"></span>
                In the Spotlight
              </span>
              <h2 className="text-5xl font-black tracking-tight bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent uppercase">{card.type}</h2>
            </div>
          </div>
          <button onClick={handleNextCard} className="w-full py-6 bg-accent-dare text-canvas font-display font-black text-2xl uppercase tracking-widest rounded-3xl shadow-solid hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all">
            Draw Next Card
          </button>
        </div>
      );
    }`;

hv = hv.replace(oldRevealTruthDare, newRevealTruthDare);

// Add button under voting
const oldVotingReveal = `</div>
      </div>
    );`;

const newVotingReveal = `</div>
        <button onClick={handleNextCard} className="mt-8 w-full py-6 bg-accent-dare text-canvas font-display font-black text-2xl uppercase tracking-widest rounded-3xl shadow-solid hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all">
          Draw Next Card
        </button>
      </div>
    );`;
hv = hv.replace(oldVotingReveal, newVotingReveal);

// Remove local setTimeLeft logic if any exists, we use calculated timer
// Let's add a robust Sync Timer hook at the top of HostView
hv = `import { useSyncTimer } from '../hooks/useSyncTimer';\n` + hv;

hv = hv.replace(/const \[timeLeft, setTimeLeft\] = useState\(30\);/g, '');

hv = hv.replace(/<TimerBadge timeLeft=\{timeLeft\} totalTime=\{30\} \/>/g, `<TimerBadge timeLeft={useSyncTimer(hostGameState?.timers?.endsAt)} totalTime={30} />`);

fs.writeFileSync('src/views/HostView.tsx', hv);

// CREATE SYNC TIMER HOOK
const hookCode = `import { useState, useEffect } from 'react';

export function useSyncTimer(endsAt?: number | null) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!endsAt) {
      setTimeLeft(0);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endsAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 200);

    return () => clearInterval(interval);
  }, [endsAt]);

  return timeLeft;
}
`;
if (!fs.existsSync('src/hooks')) fs.mkdirSync('src/hooks');
fs.writeFileSync('src/hooks/useSyncTimer.ts', hookCode);

console.log('HostView + Hooks updated');
