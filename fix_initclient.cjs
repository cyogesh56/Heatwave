const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');
code = code.replace(
  "const { hostServer, hostGameState, setHostGameState, startGame, isHost } = useGame();",
  "const { hostServer, hostGameState, setHostGameState, startGame, isHost, initClient } = useGame();"
);
fs.writeFileSync('src/views/LobbyView.tsx', code);
