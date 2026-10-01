const fs = require('fs');

let gc = fs.readFileSync('src/context/GameContext.tsx', 'utf8');

const oldJoin = `if (action.type === 'join') {
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
          });
        }`;

const newJoin = `if (action.type === 'join') {
          setHostGameState(prev => {
            if (!prev) return prev;
            // Block new players mid-game, but allow reconnects
            if (prev.uiState !== 'waiting' && !prev.players[playerId]) return prev;
            
            // Preserve inventory on reconnect
            const existingInv = prev.players[playerId]?.inventory || { deflect: 0, killswitch: 0, override: 0 };
            
            const nextState = {
              ...prev,
              players: {
                ...prev.players,
                [playerId]: { name: action.name, isReady: false, inventory: existingInv, isConnected: true }
              }
            };

            if (prev.uiState !== 'waiting') {
              setTimeout(() => {
                server.broadcast(nextState);
              }, 300);
            }
            
            return nextState;
          });
        }`;

gc = gc.replace(oldJoin, newJoin);

const oldDisconnect = `} else if (action.type === 'disconnect') {
          setHostGameState(prev => {
            if (!prev) return prev;
            const newPlayers = { ...prev.players };
            delete newPlayers[playerId];
            return { ...prev, players: newPlayers };
          });
        }`;

const newDisconnect = `} else if (action.type === 'disconnect') {
          setHostGameState(prev => {
            if (!prev) return prev;
            if (prev.uiState === 'waiting') {
               const newPlayers = { ...prev.players };
               delete newPlayers[playerId];
               return { ...prev, players: newPlayers };
            }
            
            const nextState = {
               ...prev,
               players: {
                 ...prev.players,
                 [playerId]: { ...prev.players[playerId], isConnected: false }
               }
            };
            setTimeout(() => {
                server.broadcast(nextState);
            }, 100);
            return nextState;
          });
        }`;

gc = gc.replace(oldDisconnect, newDisconnect);
fs.writeFileSync('src/context/GameContext.tsx', gc);
console.log('Sync fixed');
