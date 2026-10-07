const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');

// 1. Initial State
code = code.replace(
  "const [step, setStep] = useState<'connect' | 'intent' | 'vibe' | 'rules'>('connect');",
  "const [step, setStep] = useState<'connect' | 'intent' | 'vibe' | 'rules'>('intent');"
);

// 2. Header
code = code.replace(
  "onClick={() => step === 'rules' ? (intent === 'friends' ? setStep('intent') : setStep('vibe')) : (step === 'vibe' ? setStep('intent') : (step === 'intent' ? setStep('connect') : navigate('/')))}",
  "onClick={() => step === 'connect' ? setStep('rules') : step === 'rules' ? (intent === 'friends' ? setStep('intent') : setStep('vibe')) : (step === 'vibe' ? setStep('intent') : navigate('/'))}"
);

code = code.replace(
  "Step {step === 'connect' ? '1' : step === 'intent' ? '2' : step === 'vibe' ? '3' : '4'}",
  "Step {step === 'intent' ? '1' : step === 'vibe' ? '2' : step === 'rules' ? (intent === 'friends' ? '2' : '3') : (intent === 'friends' ? '3' : '4')}"
);

// 3. Update Rules Step Button -> to navigate to 'connect'
const rulesBtnRegex = /<button[\s\S]*?onClick=\{\(\) => \{[\s\S]*?setHostGameState\(\(prev: any\) => prev \? \{ \.\.\.prev, settings: \{ chaosMode, chillMode \} \} : prev\);[\s\S]*?handleStart\(\);[\s\S]*?\}\}[\s\S]*?>[\s\S]*?\{chaosMode \|\| chillMode \? 'Launch Custom Game' : 'Play Default Rules'\}[\s\S]*?<\/button>/;

const rulesBtnReplacement = `<button 
                onClick={() => {
                  setHostGameState((prev: any) => prev ? { ...prev, settings: { chaosMode, chillMode } } : prev);
                  setStep('connect');
                }}
                className="w-full py-5 bg-ink-primary text-canvas font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-xl hover:-translate-y-1 transition-all active:scale-95"
              >
                Next
              </button>`;
code = code.replace(rulesBtnRegex, rulesBtnReplacement);

// 4. Update Connect Step Button -> to call handleStart() and handle logic
const connectBtnRegex = /<button[\s\S]*?onClick=\{\(\) => setStep\('intent'\)\}[\s\S]*?disabled=\{connectedPlayers.length < 2 \|\| \(isHostless && !clientNode\)\}[\s\S]*?>[\s\S]*?\{connectedPlayers.length < 2 \? 'Waiting for players\.\.\.' : 'Next'\}[\s\S]*?<\/button>/;

const connectBtnReplacement = `{(() => {
                let limitMsg = '';
                let isValid = false;
                if (intent === 'couples') {
                  isValid = connectedPlayers.length === 2;
                  if (connectedPlayers.length < 2) limitMsg = 'Waiting for 1 more...';
                  else if (connectedPlayers.length > 2) limitMsg = 'Too many players (Max 2)';
                } else if (intent === 'poly') {
                  isValid = connectedPlayers.length >= 3 && connectedPlayers.length <= 4;
                  if (connectedPlayers.length < 3) limitMsg = 'Waiting for players...';
                  else if (connectedPlayers.length > 4) limitMsg = 'Too many players (Max 4)';
                } else {
                  isValid = connectedPlayers.length >= 2 && connectedPlayers.length <= 8;
                  if (connectedPlayers.length < 2) limitMsg = 'Waiting for players...';
                  else if (connectedPlayers.length > 8) limitMsg = 'Too many players (Max 8)';
                }
                
                const isReady = isValid && !(isHostless && !clientNode);
                
                return (
                  <button 
                    onClick={handleStart}
                    disabled={!isReady}
                    className="w-full py-5 bg-accent-consensus text-canvas font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-xl disabled:opacity-50 disabled:shadow-none hover:-translate-y-1 transition-all active:scale-95"
                  >
                    {!isReady ? (limitMsg || 'Complete Setup') : 'Start Game'}
                  </button>
                );
              })()}`;

code = code.replace(connectBtnRegex, connectBtnReplacement);

fs.writeFileSync('src/views/LobbyView.tsx', code);
