const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');

// Add isJoining state
code = code.replace(
  "const [hostPlayerName, setHostPlayerName] = useState('');",
  "const [hostPlayerName, setHostPlayerName] = useState('');\n  const [isJoining, setIsJoining] = useState(false);"
);

// Fix the dots in toggles
// Vanilla toggle
code = code.replace(
  "'translate-x-6 bg-surface-card' : 'translate-x-0 bg-ink-primary/40'",
  "'translate-x-6 bg-surface-card' : 'translate-x-0 bg-ink-primary'"
);
// Chaos toggle
code = code.replace(
  "'translate-x-6 bg-surface-card' : 'translate-x-0 bg-ink-primary/40'",
  "'translate-x-6 bg-surface-card' : 'translate-x-0 bg-ink-primary'"
);
// Chill toggle
code = code.replace(
  "'translate-x-6 bg-surface-card' : 'translate-x-0 bg-ink-primary/40'",
  "'translate-x-6 bg-surface-card' : 'translate-x-0 bg-ink-primary'"
);

// Fix the join button
const joinRegex = /<button[\s\S]*?onClick=\{\(\) => initClient\(hostServer\?\.roomCode \|\| '', hostPlayerName\)\}[\s\S]*?disabled=\{!hostPlayerName\.trim\(\)\}[\s\S]*?>[\s\S]*?Join[\s\S]*?<\/button>/;

const joinReplacement = `<button 
                    onClick={async () => {
                      setIsJoining(true);
                      await initClient(hostServer?.roomCode || '', hostPlayerName);
                      setIsJoining(false);
                    }}
                    disabled={!hostPlayerName.trim() || isJoining}
                    className="w-full mt-2 py-3 bg-accent-dare text-canvas font-display font-bold text-lg uppercase tracking-widest rounded-xl disabled:opacity-50 active:scale-95 transition-all"
                  >
                    {isJoining ? 'Joining...' : 'Join'}
                  </button>`;

code = code.replace(joinRegex, joinReplacement);

// Disable input while joining
code = code.replace(
  "className=\"w-full bg-canvas text-ink-primary text-center text-xl font-body p-3 rounded-xl border-2 border-ink-primary/10 focus:border-accent-dare outline-none transition-colors\"",
  "disabled={isJoining}\n                    className=\"w-full bg-canvas text-ink-primary text-center text-xl font-body p-3 rounded-xl border-2 border-ink-primary/10 focus:border-accent-dare outline-none transition-colors disabled:opacity-50\""
);

fs.writeFileSync('src/views/LobbyView.tsx', code);
