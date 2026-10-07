const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');

const target = `          </div>
        )}}
            </div>

            <div className="w-full shrink-0 pt-4">
              <button 
                onClick={() => setStep('rules')}
                disabled={selectedDecks.length === 0}
                className="w-full py-5 bg-accent-truth text-canvas font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-xl disabled:opacity-50 disabled:shadow-none hover:-translate-y-1 transition-all active:scale-95"
              >
                Configure Rules
              </button>
            </div>
          </div>
        )}`;

const replacement = `          </div>
        )}`;

code = code.replace(target, replacement);
fs.writeFileSync('src/views/LobbyView.tsx', code);
