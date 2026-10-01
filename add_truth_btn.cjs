const fs = require('fs');

let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf8');

const oldDareBtn = `<button 
              onClick={() => handleVote('done')}
              disabled={selectedChoice !== null}
              className="w-full py-8 rounded-2xl bg-accent-truth border-4 border-ink-primary text-canvas font-display font-black text-3xl uppercase tracking-widest shadow-solid active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
            >
              {selectedChoice ? 'WAITING...' : 'I DID IT'}
            </button>`;

const newDareBtn = `<button 
              onClick={() => handleVote('done')}
              disabled={selectedChoice !== null}
              className="w-full py-8 rounded-2xl bg-accent-truth border-4 border-ink-primary text-canvas font-display font-black text-3xl uppercase tracking-widest shadow-solid active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
            >
              {selectedChoice ? 'WAITING...' : 'I DID IT'}
            </button>
            {parsedPrompt.toLowerCase().includes('answer a truth') && !selectedChoice && (
              <button 
                onClick={() => {
                  setSelectedChoice('fail');
                  clientNode?.send({ type: 'fail_truth' });
                  if (navigator.vibrate) navigator.vibrate(15);
                }}
                className="mt-2 w-full py-6 rounded-2xl border-4 border-accent-truth text-accent-truth bg-canvas font-display font-black text-2xl uppercase tracking-widest active:bg-accent-truth/10 transition-all"
              >
                ANSWER A TRUTH
              </button>
            )}`;

cv = cv.replace(oldDareBtn, newDareBtn);
fs.writeFileSync('src/views/ControllerView.tsx', cv);

console.log('Truth button added');
