const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

const target = `    if (playerIds.length > 0 && Math.random() < 0.4) {
       const randomId = playerIds[Math.floor(Math.random() * playerIds.length)];
       const powers = ['deflect', 'killswitch', 'override'];
       const randomPower = powers[Math.floor(Math.random() * powers.length)];
       newPlayers[randomId].inventory[randomPower] += 1;
       alertMsg = \`📦 \${newPlayers[randomId].name} discovered a \${randomPower.toUpperCase()}!\`;
       newPlayers[randomId].uiAlert = \`📦 You discovered a \${randomPower.toUpperCase()}!\`;
       targetPlayerId = randomId;
    }

    if (drawn) {
      setVotes({});`;

const replacement = `    if (!drawn) {
       setHostGameState(prev => {
          if (!prev) return null;
          const next = { ...prev, uiState: 'ended' as const };
          hostServer?.broadcast(next);
          return next;
       });
       return;
    }

    if (playerIds.length > 0 && Math.random() < 0.4) {
       const randomId = playerIds[Math.floor(Math.random() * playerIds.length)];
       const powers = ['deflect', 'killswitch', 'override'];
       const randomPower = powers[Math.floor(Math.random() * powers.length)];
       newPlayers[randomId].inventory[randomPower] += 1;
       alertMsg = \`📦 \${newPlayers[randomId].name} discovered a \${randomPower.toUpperCase()}!\`;
       newPlayers[randomId].uiAlert = \`📦 You discovered a \${randomPower.toUpperCase()}!\`;
       targetPlayerId = randomId;
    }

    if (drawn) {
      setVotes({});`;

code = code.replace(target, replacement);
fs.writeFileSync('src/views/HostView.tsx', code);
