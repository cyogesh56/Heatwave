const fs = require('fs');

let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');

// Remove the inline hook call
hv = hv.replace(/<TimerBadge timeLeft=\{useSyncTimer\(hostGameState\?\.timers\?\.endsAt\)\} totalTime=\{30\} \/>/g, '<TimerBadge timeLeft={timeLeft} totalTime={30} />');

// Inject the hook into the body
hv = hv.replace(/const \[uiAlert, setUiAlert\] = useState\(''\);/, `const [uiAlert, setUiAlert] = useState('');
  const timeLeft = useSyncTimer(hostGameState?.timers?.endsAt);`);

fs.writeFileSync('src/views/HostView.tsx', hv);

console.log('Fixed React Hook Rule');
