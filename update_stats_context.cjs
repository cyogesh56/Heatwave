const fs = require('fs');
let code = fs.readFileSync('src/context/GameContext.tsx', 'utf-8');

code = code.replace(
  /if \(prev\.uiState !== 'waiting' && !prev\.players\[playerId\]\) return prev;/,
  `if (prev.uiState !== 'waiting' && !prev.players[playerId]) return prev;
            const newStats = { ...(prev.stats || {}) };
            if (!newStats[playerId]) newStats[playerId] = { powersUsed: 0, truthsAnswered: 0, daresCompleted: 0, targetedCount: 0 };`
);

code = code.replace(
  /return \{ \.\.\.prev, players: newPlayers \};/,
  `return { ...prev, players: newPlayers, stats: newStats };`
);
fs.writeFileSync('src/context/GameContext.tsx', code);
