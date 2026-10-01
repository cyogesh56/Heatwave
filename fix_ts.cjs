const fs = require('fs');

let hostServerCode = fs.readFileSync('src/lib/peer/HostServer.ts', 'utf-8');
hostServerCode = hostServerCode.replace(
  'currentCard: { card: any, parsedPrompt: string, targetedPlayers?: string[] } | null;',
  'currentCard: { card: any, parsedPrompt: string, targetedPlayers?: string[], assignedResponderName?: string } | null;'
);
fs.writeFileSync('src/lib/peer/HostServer.ts', hostServerCode);

let hostViewCode = fs.readFileSync('src/views/HostView.tsx', 'utf-8');
hostViewCode = hostViewCode.replace(
  'p.name === hostGameState.currentCard.assignedResponderName',
  'p.name === hostGameState.currentCard?.assignedResponderName'
);
fs.writeFileSync('src/views/HostView.tsx', hostViewCode);

