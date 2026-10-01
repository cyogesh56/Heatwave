const fs = require('fs');

let file = fs.readFileSync('src/lib/peer/HostServer.ts', 'utf8');
file = file.replace(/players: Record<string, \{ name: string, isReady: boolean \}>;/, 
  "players: Record<string, { name: string, isReady: boolean, inventory: { deflect: number, killswitch: number, override: number } }>;");
fs.writeFileSync('src/lib/peer/HostServer.ts', file);

let gc = fs.readFileSync('src/context/GameContext.tsx', 'utf8');
gc = gc.replace(/\[playerId\]: \{ name: action\.name, isReady: false \}/, 
  "[playerId]: { name: action.name, isReady: false, inventory: { deflect: 0, killswitch: 0, override: 0 } }");
gc = gc.replace(/window\.dispatchEvent\(new CustomEvent\('player-action', \{ detail: \{ playerId, action \} \}\)\);/, 
  `
          if (action.type === 'power') {
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
          }
          window.dispatchEvent(new CustomEvent('player-action', { detail: { playerId, action } }));
  `);
fs.writeFileSync('src/context/GameContext.tsx', gc);
