const fs = require('fs');
let hs = fs.readFileSync('src/lib/peer/HostServer.ts', 'utf8');

hs = hs.replace(
  "  theme?: 'light' | 'dark';\n};",
  "  theme?: 'light' | 'dark';\n  readyPlayers?: string[];\n  juryState?: { active: boolean; targetId: string; votes: Record<string, 'yes'|'no'> };\n  revealCountdown?: number | null;\n};"
);

fs.writeFileSync('src/lib/peer/HostServer.ts', hs);
console.log('HostServer updated');
