const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');

const target = `    if (isHostless) {
      if (!hostPlayerName.trim()) { setPopupMessage("Please enter your name!"); return; }
      await initClient(hostServer?.roomCode || '', hostPlayerName);
      navigate('/play');
    } else {
      navigate('/host');
    }`;

const replacement = `    if (isHostless) {
      if (!hostPlayerName.trim()) { setPopupMessage("Please enter your name!"); return; }
      await initClient(hostServer?.roomCode || '', hostPlayerName);
      navigate('/host'); // We still need HostView to mount the game loop!
    } else {
      navigate('/host');
    }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/views/LobbyView.tsx', code);
