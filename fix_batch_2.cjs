const fs = require('fs');

// 5. Phone lock disconnects session (ClientNode.ts)
let clientCode = fs.readFileSync('src/lib/peer/ClientNode.ts', 'utf8');
clientCode = clientCode.replace(
    /this\.playerId = Math\.random\(\)\.toString\(36\)\.substring\(2, 9\);/,
    `const savedId = localStorage.getItem(\`handsy_player_\${roomCode}\`);
    if (savedId) {
      this.playerId = savedId;
    } else {
      this.playerId = Math.random().toString(36).substring(2, 9);
      localStorage.setItem(\`handsy_player_\${roomCode}\`, this.playerId);
    }`
);
fs.writeFileSync('src/lib/peer/ClientNode.ts', clientCode);

// 6. Block joining mid game + Reconnects + 16. Power deduction fix
let ctxCode = fs.readFileSync('src/context/GameContext.tsx', 'utf8');

const oldJoin = `if (action.type === 'join') {
          setHostGameState(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              players: {
                ...prev.players,
                [playerId]: { name: action.name, isReady: false, inventory: { deflect: 0, killswitch: 0, override: 0 } }
              }
            };
          });`;

const newJoin = `if (action.type === 'join') {
          setHostGameState(prev => {
            if (!prev) return prev;
            // Block new players mid-game, but allow reconnects
            if (prev.uiState !== 'waiting' && !prev.players[playerId]) return prev;
            
            // Preserve inventory on reconnect
            const existingInv = prev.players[playerId]?.inventory || { deflect: 0, killswitch: 0, override: 0 };
            
            return {
              ...prev,
              players: {
                ...prev.players,
                [playerId]: { name: action.name, isReady: false, inventory: existingInv }
              }
            };
          });`;

ctxCode = ctxCode.replace(oldJoin, newJoin);

const oldPower = `if (action.type === 'power') {
            setHostGameState(prev => {
              if (!prev) return prev;
              const player = prev.players[playerId];
              if (!player || player.inventory[action.power as keyof typeof player.inventory] <= 0) return prev;
              
              // Deduct power
              return {
                ...prev,
                players: {
                  ...prev.players,
                  [playerId]: {
                    ...player,
                    inventory: {
                      ...player.inventory,
                      [action.power]: player.inventory[action.power as keyof typeof player.inventory] - 1
                    }
                  }
                }
              };
            });
          }`;

const newPower = `if (action.type === 'power') {
            setHostGameState(prev => {
              if (!prev) return prev;
              const player = prev.players[playerId];
              const basePower = action.power.split('_')[0] as keyof typeof player.inventory;
              
              if (!player || player.inventory[basePower] <= 0) return prev;
              
              return {
                ...prev,
                players: {
                  ...prev.players,
                  [playerId]: {
                    ...player,
                    inventory: {
                      ...player.inventory,
                      [basePower]: player.inventory[basePower] - 1
                    }
                  }
                }
              };
            });
          }`;

ctxCode = ctxCode.replace(oldPower, newPower);

fs.writeFileSync('src/context/GameContext.tsx', ctxCode);
console.log("Batch 2 applied.");
