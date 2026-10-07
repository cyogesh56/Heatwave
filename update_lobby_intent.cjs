const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');

// Replace the step state definition
code = code.replace(
  "const [step, setStep] = useState<'connect' | 'decks' | 'rules'>('connect');",
  "const [step, setStep] = useState<'connect' | 'intent' | 'vibe' | 'rules'>('connect');\n  const [intent, setIntent] = useState<'friends' | 'couples' | 'poly' | null>(null);"
);

// Replace the Next button target in the connect step
code = code.replace(
  "onClick={() => setStep('decks')}",
  "onClick={() => setStep('intent')}"
);

// Replace the back button in UniversalHeader inside LobbyView
code = code.replace(
  "onClick={() => step === 'rules' ? setStep('decks') : (step === 'decks' ? setStep('connect') : navigate('/'))}",
  "onClick={() => step === 'rules' ? (intent === 'friends' ? setStep('intent') : setStep('vibe')) : (step === 'vibe' ? setStep('intent') : (step === 'intent' ? setStep('connect') : navigate('/')))}"
);

// Replace the entire 'decks' step with 'intent' and 'vibe' steps
const oldDecksRegex = /\{\s*step === 'decks' && \([\s\S]*?\}\s*\)/;
const newIntentVibe = `{step === 'intent' && (
          <div className="flex-1 w-full flex flex-col items-center justify-center pt-8 pb-4">
            <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-widest mb-6 text-center">Who are you playing with?</h2>
            
            <div className="flex flex-col gap-4 w-full max-w-lg">
              <motion.div 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { setIntent('friends'); setSelectedDecks(['just_friends']); setStep('rules'); }}
                className="bg-surface-card p-6 rounded-3xl border-4 border-accent-consensus shadow-solid-sm cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-full bg-accent-consensus/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <IconUsers className="w-7 h-7 text-accent-consensus" />
                </div>
                <div className="text-left">
                  <h3 className="font-display font-black text-xl uppercase tracking-widest">New Friends</h3>
                  <p className="font-body text-ink-primary/60 text-sm font-medium">Up to 8 players. Casual & fun group party. No after-dark content.</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { setIntent('couples'); setStep('vibe'); }}
                className="bg-surface-card p-6 rounded-3xl border-4 border-accent-truth shadow-solid-sm cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-full bg-accent-truth/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <IconFlame className="w-7 h-7 text-accent-truth" />
                </div>
                <div className="text-left">
                  <h3 className="font-display font-black text-xl uppercase tracking-widest">Couples</h3>
                  <p className="font-body text-ink-primary/60 text-sm font-medium">2 players. Intimate, revealing, and deeply personal.</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { setIntent('poly'); setStep('vibe'); }}
                className="bg-surface-card p-6 rounded-3xl border-4 border-accent-dare shadow-solid-sm cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-full bg-accent-dare/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <IconZap className="w-7 h-7 text-accent-dare" />
                </div>
                <div className="text-left">
                  <h3 className="font-display font-black text-xl uppercase tracking-widest">The Polycule</h3>
                  <p className="font-body text-ink-primary/60 text-sm font-medium">3-4 players. Group dynamics, compersion, and multi-target tension.</p>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {step === 'vibe' && (
          <div className="flex-1 w-full flex flex-col items-center justify-center pt-8 pb-4">
            <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-widest mb-6 text-center">Set the Vibe</h2>
            
            <div className="flex flex-col gap-4 w-full max-w-lg">
              <motion.div 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { 
                  if (intent === 'couples') setSelectedDecks(['first_date']);
                  if (intent === 'poly') setSelectedDecks(['polyamory']); // In poly, first date just uses standard poly without after dark
                  setStep('rules'); 
                }}
                className="bg-surface-card p-6 rounded-3xl border-4 border-accent-consensus shadow-solid-sm cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-full bg-accent-consensus/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <IconSpark className="w-7 h-7 text-accent-consensus" />
                </div>
                <div className="text-left">
                  <h3 className="font-display font-black text-xl uppercase tracking-widest">First Date</h3>
                  <p className="font-body text-ink-primary/60 text-sm font-medium">Light, fun, breaking the ice safely.</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { 
                  if (intent === 'couples') setSelectedDecks(['couples', 'after_dark']);
                  if (intent === 'poly') setSelectedDecks(['polyamory', 'after_dark']);
                  setStep('rules'); 
                }}
                className="bg-surface-card p-6 rounded-3xl border-4 border-accent-dare shadow-solid-sm cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-full bg-accent-dare/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <IconFlame className="w-7 h-7 text-accent-dare" />
                </div>
                <div className="text-left">
                  <h3 className="font-display font-black text-xl uppercase tracking-widest">After Dark</h3>
                  <p className="font-body text-ink-primary/60 text-sm font-medium">Intense, NSFW, high heat and deep vulnerability.</p>
                </div>
              </motion.div>
            </div>
          </div>
        )}`;

code = code.replace(oldDecksRegex, newIntentVibe);
fs.writeFileSync('src/views/LobbyView.tsx', code);
