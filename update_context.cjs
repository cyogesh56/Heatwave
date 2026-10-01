const fs = require('fs');
let code = fs.readFileSync('src/context/GameContext.tsx', 'utf8');
code = code.replace(/window\.dispatchEvent\(new CustomEvent\('player-action', \{ detail: \{ playerId, action \} \}\)\);/, 
`
        if (action.type === 'join') {
          setHostGameState(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              players: {
                ...prev.players,
                [playerId]: { name: action.name, isReady: false }
              }
            };
          });
        } else if (action.type === 'disconnect') {
          setHostGameState(prev => {
            if (!prev) return prev;
            const newPlayers = { ...prev.players };
            delete newPlayers[playerId];
            return { ...prev, players: newPlayers };
          });
        } else {
          window.dispatchEvent(new CustomEvent('player-action', { detail: { playerId, action } }));
        }
`);
fs.writeFileSync('src/context/GameContext.tsx', code);
