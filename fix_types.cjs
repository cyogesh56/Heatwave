const fs = require('fs');

let sm = fs.readFileSync('src/lib/engine/stateMachine.ts', 'utf8');

sm = sm.replace(/export interface Card \{/g, `export interface Card {
  options?: string[];`);
sm = sm.replace(/type: 'truth' \| 'dare' \| 'kahoot';/g, `type: 'truth' | 'dare' | 'kahoot' | 'wrong_answers' | 'consensus' | 'vibe_poll' | 'fill_blank';`);

fs.writeFileSync('src/lib/engine/stateMachine.ts', sm);

let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');
hv = hv.replace(/drawn.card.options = Object.values\(newPlayers\).map\(p => p.name\);/g, `drawn.card.options = Object.values(newPlayers).map((p: any) => p.name);`);
hv = hv.replace(/timers: \{\n\s*active: !!futureTimer,\n\s*endsAt: futureTimer\n\s*\}/g, `timers: {
          active: !!futureTimer,
          endsAt: futureTimer,
          remainingSeconds: 0
        }`);

// Also fix the random <TimerBadge timeLeft={timeLeft} left at the bottom of the card block
hv = hv.replace(/<TimerBadge timeLeft=\{timeLeft\} totalTime=\{30\} \/>/, `<TimerBadge timeLeft={useSyncTimer(hostGameState?.timers?.endsAt)} totalTime={30} />`);

fs.writeFileSync('src/views/HostView.tsx', hv);

let hs = fs.readFileSync('src/lib/peer/HostServer.ts', 'utf8');
hs = hs.replace(/timers: \{\n\s*active: boolean;\n\s*remainingSeconds: number;\n\s*\};/g, `timers: {
    active: boolean;
    remainingSeconds: number;
    endsAt?: number | null;
  };`);
fs.writeFileSync('src/lib/peer/HostServer.ts', hs);

console.log('Types fixed');
