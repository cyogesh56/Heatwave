const fs = require('fs');
let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');

// Find where useSyncTimer is imported
// Call it inside the component body
const componentStart = `export default function HostView() {`;
const hookCall = `\n  const timeLeft = useSyncTimer(hostGameState?.timers?.endsAt);\n`;

hv = hv.replace(componentStart, componentStart + hookCall);

hv = hv.replace(/<TimerBadge timeLeft=\{useSyncTimer\(hostGameState\?\.timers\?\.endsAt\)\} totalTime=\{30\} \/>/g, `<TimerBadge timeLeft={timeLeft} totalTime={30} />`);

fs.writeFileSync('src/views/HostView.tsx', hv);
console.log('Fixed inline hook');
