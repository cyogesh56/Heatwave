const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');

const targetRegex = /\{step === 'rules' && \([\s\S]*?\}\s*<\/div>\s*\)\}/;

const replacement = `{step === 'rules' && (
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 max-w-2xl mx-auto w-full pt-4 pb-2">
              <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-widest mb-2">House Rules</h2>
              <p className="font-body text-ink-primary/70 mb-6 sm:mb-8 font-medium">Customize the chaos, or just play vanilla.</p>
              
              <div className="flex flex-col gap-4 mb-8">
                 <div onClick={() => { setChaosMode(false); setChillMode(false); }} className="p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between shadow-solid-sm bg-surface-card border-ink-primary/20 text-ink-primary hover:-translate-y-0.5">
                   <div className="flex flex-col">
                     <span className="font-display font-black uppercase tracking-widest text-lg">Vanilla</span>
                     <span className="font-body text-sm opacity-80">The default, highly-tested experience.</span>
                   </div>
                   <div className={\`w-12 h-6 rounded-full border-2 \${(!chaosMode && !chillMode) ? 'bg-ink-primary border-ink-primary' : 'bg-ink-primary/5 border-ink-primary/30'} flex items-center p-1 transition-all\`}>
                     <div className={\`w-4 h-4 rounded-full transition-all \${(!chaosMode && !chillMode) ? 'translate-x-6 bg-surface-card' : 'translate-x-0 bg-ink-primary/40'}\`}/>
                   </div>
                 </div>

                 <div onClick={() => setChaosMode(!chaosMode)} className="p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between shadow-solid-sm bg-surface-card border-ink-primary/20 text-ink-primary hover:-translate-y-0.5">
                   <div className="flex flex-col">
                     <span className="font-display font-black uppercase tracking-widest text-lg">Chaos Mode</span>
                     <span className="font-body text-sm opacity-80">3x more likely to drop Powers.</span>
                   </div>
                   <div className={\`w-12 h-6 rounded-full border-2 \${chaosMode ? 'bg-ink-primary border-ink-primary' : 'bg-ink-primary/5 border-ink-primary/30'} flex items-center p-1 transition-all\`}>
                     <div className={\`w-4 h-4 rounded-full transition-all \${chaosMode ? 'translate-x-6 bg-surface-card' : 'translate-x-0 bg-ink-primary/40'}\`}/>
                   </div>
                 </div>
                 
                 <div onClick={() => setChillMode(!chillMode)} className="p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between shadow-solid-sm bg-surface-card border-ink-primary/20 text-ink-primary hover:-translate-y-0.5">
                   <div className="flex flex-col">
                     <span className="font-display font-black uppercase tracking-widest text-lg">Chill Mode</span>
                     <span className="font-body text-sm opacity-80">Disables all countdown timers.</span>
                   </div>
                   <div className={\`w-12 h-6 rounded-full border-2 \${chillMode ? 'bg-ink-primary border-ink-primary' : 'bg-ink-primary/5 border-ink-primary/30'} flex items-center p-1 transition-all\`}>
                     <div className={\`w-4 h-4 rounded-full transition-all \${chillMode ? 'translate-x-6 bg-surface-card' : 'translate-x-0 bg-ink-primary/40'}\`}/>
                   </div>
                 </div>
              </div>
              
              <div className="mt-auto">
                <button 
                  onClick={() => {
                    setHostGameState((prev: any) => prev ? { ...prev, settings: { chaosMode, chillMode } } : prev);
                    setStep('connect');
                  }}
                  className="w-full py-5 bg-ink-primary text-canvas font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-xl hover:-translate-y-1 transition-all active:scale-95"
                >
                  Next
                </button>
              </div>
            </div>
          )}`;

code = code.replace(targetRegex, replacement);
fs.writeFileSync('src/views/LobbyView.tsx', code);
