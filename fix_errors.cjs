const fs = require('fs');

// Fix GameContext.tsx
let contextCode = fs.readFileSync('src/context/GameContext.tsx', 'utf-8');
contextCode = contextCode.replace(
  /const newStats = \{ \.\.\.\(prev\.stats \|\| \{\}\) \};\n            if \(\!newStats\[playerId\]\) newStats\[playerId\] = \{ powersUsed: 0, truthsAnswered: 0, daresCompleted: 0, targetedCount: 0 \};/,
  ``
);
contextCode = contextCode.replace(
  /if \(prev\.uiState !== 'waiting' && \!prev\.players\[playerId\]\) return prev;/,
  `if (prev.uiState !== 'waiting' && !prev.players[playerId]) return prev;`
);

contextCode = contextCode.replace(
  /return \{ \.\.\.prev, players: newPlayers, stats: newStats \};/g,
  `const stats = { ...(prev.stats || {}) };
            if (!stats[playerId]) stats[playerId] = { powersUsed: 0, truthsAnswered: 0, daresCompleted: 0, targetedCount: 0 };
            return { ...prev, players: newPlayers, stats };`
);
fs.writeFileSync('src/context/GameContext.tsx', contextCode);

// Fix LobbyView.tsx
let lobbyCode = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');
lobbyCode = lobbyCode.replace(
  /const \{ hostServer, hostGameState, startGame, isHost \} = useGame\(\);/,
  `const { hostServer, hostGameState, setHostGameState, startGame, isHost } = useGame();`
);
lobbyCode = lobbyCode.replace(
  /setHostGameState\(prev => prev \? \{ \.\.\.prev, settings: \{ chaosMode, chillMode \} \} : prev\);/,
  `setHostGameState((prev: any) => prev ? { ...prev, settings: { chaosMode, chillMode } } : prev);`
);
fs.writeFileSync('src/views/LobbyView.tsx', lobbyCode);
