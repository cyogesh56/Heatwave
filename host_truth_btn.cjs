const fs = require('fs');
let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');

const drawBtn = `<button onClick={handleNextCard} className="w-full py-6 bg-accent-dare text-canvas font-display font-black text-2xl uppercase tracking-widest rounded-3xl shadow-solid hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all">
            Draw Next Card
          </button>`;

const replacement = `<button onClick={handleNextCard} className="w-full py-6 bg-accent-dare text-canvas font-display font-black text-2xl uppercase tracking-widest rounded-3xl shadow-solid hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all">
            Draw Next Card
          </button>
          {parsedPrompt.toLowerCase().includes('answer a truth') && (
             <button onClick={() => window.dispatchEvent(new CustomEvent('player-action', { detail: { playerId: 'host', action: { type: 'fail_truth' } } }))} className="w-full py-4 bg-transparent border-4 border-accent-truth text-accent-truth font-display font-black text-xl uppercase tracking-widest rounded-3xl hover:bg-accent-truth/10 transition-all">
               Answer a Truth Instead
             </button>
          )}`;

hv = hv.replace(drawBtn, replacement);
fs.writeFileSync('src/views/HostView.tsx', hv);
console.log('Added to host');
