const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');

// Change state from 'connect' | 'decks' to include 'rules'
code = code.replace(/const \[step, setStep\] = useState<'connect' \| 'decks'>\('connect'\);/, `const [step, setStep] = useState<'connect' | 'decks' | 'rules'>('connect');
  const [chaosMode, setChaosMode] = useState(false);
  const [chillMode, setChillMode] = useState(false);`);
  
// Change Start Heatwave button to go to rules
code = code.replace(
  /onClick=\{handleStart\}\n                disabled=\{selectedDecks.length === 0\}\n                className="w-full py-5 bg-accent-truth text-canvas font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-xl disabled:opacity-50 disabled:shadow-none hover:-translate-y-1 transition-all active:scale-95"\n              >\n                Start Heatwave/,
  `onClick={() => setStep('rules')}
                disabled={selectedDecks.length === 0}
                className="w-full py-5 bg-accent-truth text-canvas font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-xl disabled:opacity-50 disabled:shadow-none hover:-translate-y-1 transition-all active:scale-95"
              >
                Configure Rules`
);

// Add the rules step UI before the Persistent Connected Players Dock
const rulesBlock = `
        {step === 'rules' && (
          <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 max-w-2xl mx-auto w-full pt-4 pb-2">
            <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-widest mb-2">House Rules</h2>
            <p className="font-body text-ink-primary/70 mb-6 sm:mb-8 font-medium">Customize the chaos, or just play vanilla.</p>
            
            <div className="flex flex-col gap-4 mb-8">
               <div onClick={() => setChaosMode(!chaosMode)} className={\`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between shadow-solid-sm \${chaosMode ? 'bg-accent-dare-fill border-ink-primary text-ink-dark' : 'bg-surface-card border-ink-primary/20 text-ink-primary'}\`}>
                 <div className="flex flex-col">
                   <span className="font-display font-black uppercase tracking-widest text-lg">Chaos Mode</span>
                   <span className="font-body text-sm opacity-80">3x more likely to drop Powers.</span>
                 </div>
                 <div className={\`w-12 h-6 rounded-full border-2 \${chaosMode ? 'bg-ink-primary border-ink-primary' : 'bg-transparent border-ink-primary/30'} flex items-center p-1 transition-all\`}>
                   <div className={\`w-4 h-4 rounded-full bg-surface-card transition-all \${chaosMode ? 'translate-x-6' : 'translate-x-0 bg-ink-primary/30'}\`}/>
                 </div>
               </div>
               
               <div onClick={() => setChillMode(!chillMode)} className={\`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between shadow-solid-sm \${chillMode ? 'bg-accent-consensus-fill border-ink-primary text-ink-dark' : 'bg-surface-card border-ink-primary/20 text-ink-primary'}\`}>
                 <div className="flex flex-col">
                   <span className="font-display font-black uppercase tracking-widest text-lg">Chill Mode</span>
                   <span className="font-body text-sm opacity-80">Disables all countdown timers.</span>
                 </div>
                 <div className={\`w-12 h-6 rounded-full border-2 \${chillMode ? 'bg-ink-primary border-ink-primary' : 'bg-transparent border-ink-primary/30'} flex items-center p-1 transition-all\`}>
                   <div className={\`w-4 h-4 rounded-full bg-surface-card transition-all \${chillMode ? 'translate-x-6' : 'translate-x-0 bg-ink-primary/30'}\`}/>
                 </div>
               </div>
            </div>
            
            <div className="mt-auto">
              <button 
                onClick={() => {
                  setHostGameState(prev => prev ? { ...prev, settings: { chaosMode, chillMode } } : prev);
                  handleStart();
                }}
                className="w-full py-5 bg-ink-primary text-canvas font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-xl hover:-translate-y-1 transition-all active:scale-95"
              >
                {chaosMode || chillMode ? 'Launch Custom Game' : 'Play Default Rules'}
              </button>
            </div>
          </div>
        )}
        `;

code = code.replace(/\{\/\* Persistent Connected Players Dock \*\/\}/, rulesBlock + '\n        {/* Persistent Connected Players Dock */}');

// Header back button logic
code = code.replace(
  /onClick=\{\(\) => step === 'decks' \? setStep\('connect'\) : navigate\('\/'\)\}/,
  `onClick={() => step === 'rules' ? setStep('decks') : (step === 'decks' ? setStep('connect') : navigate('/'))}`
);

fs.writeFileSync('src/views/LobbyView.tsx', code);
