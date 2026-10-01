const fs = require('fs');
let hs = fs.readFileSync('src/lib/peer/HostServer.ts', 'utf8');

hs = hs.replace(
  "  currentCard: any | null;",
  "  currentCard: { card: any, parsedPrompt: string, targetedPlayers?: string[] } | null;"
);
fs.writeFileSync('src/lib/peer/HostServer.ts', hs);
console.log('HostServer fixed');
