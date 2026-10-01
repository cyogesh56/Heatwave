const fs = require('fs');

let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');

const oldLoot = `    // Loot drop logic
    const newPlayers = JSON.parse(JSON.stringify(hostGameState.players));
    const playerIds = Object.keys(newPlayers);
    let alertMsg = '';
    
    if (playerIds.length > 0 && Math.random() < 0.4) {
       const randomId = playerIds[Math.floor(Math.random() * playerIds.length)];
       const powers = ['deflect', 'killswitch', 'override'];
       const randomPower = powers[Math.floor(Math.random() * powers.length)];
       newPlayers[randomId].inventory[randomPower] += 1;
       alertMsg = \`📦 \${newPlayers[randomId].name} found a \${randomPower.toUpperCase()}!\`;
    }`;

const newLoot = `    // Loot drop logic
    const newPlayers = JSON.parse(JSON.stringify(hostGameState.players));
    const playerIds = Object.keys(newPlayers);
    let alertMsg = '';
    let targetPlayerId = '';
    
    if (playerIds.length > 0 && Math.random() < 0.4) {
       const randomId = playerIds[Math.floor(Math.random() * playerIds.length)];
       const powers = ['deflect', 'killswitch', 'override'];
       const randomPower = powers[Math.floor(Math.random() * powers.length)];
       newPlayers[randomId].inventory[randomPower] += 1;
       alertMsg = \`📦 \${newPlayers[randomId].name} discovered a \${randomPower.toUpperCase()}!\`;
       newPlayers[randomId].uiAlert = \`📦 You discovered a \${randomPower.toUpperCase()}!\`;
       targetPlayerId = randomId;
    }`;

hv = hv.replace(oldLoot, newLoot);

const oldSetAlert = `      if (alertMsg) {
        setUiAlert(alertMsg);
        setTimeout(() => setUiAlert(''), 4000);
      }`;

const newSetAlert = `      if (alertMsg) {
        setUiAlert(alertMsg);
        setTimeout(() => {
          setUiAlert('');
          if (targetPlayerId) {
             setHostGameState(prev => {
                if (!prev) return prev;
                const p = { ...prev.players };
                if (p[targetPlayerId]) {
                   p[targetPlayerId] = { ...p[targetPlayerId], uiAlert: undefined };
                }
                const n = { ...prev, players: p };
                hostServer?.broadcast(n);
                return n;
             });
          }
        }, 4000);
      }`;

hv = hv.replace(oldSetAlert, newSetAlert);

fs.writeFileSync('src/views/HostView.tsx', hv);
console.log('Loot drop logic fixed');
