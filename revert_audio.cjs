const fs = require('fs');

// Revert App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
appCode = appCode.replace(/import \{ AudioManager \} from '\.\/components\/AudioManager';\n/, '');
appCode = appCode.replace(/<AudioManager \/>\n\s*/, '');
fs.writeFileSync('src/App.tsx', appCode);

// Revert LobbyView.tsx
let lobbyCode = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');
lobbyCode = lobbyCode.replace(/<UniversalHeader/, `<audio src="/saavane-sensual-music-390794.mp3" autoPlay loop muted={false} />\n      <UniversalHeader`);
fs.writeFileSync('src/views/LobbyView.tsx', lobbyCode);

// Revert HostView.tsx
let hostCode = fs.readFileSync('src/views/HostView.tsx', 'utf-8');
hostCode = hostCode.replace(/<UniversalHeader/, `<audio src="/arpmedia-bedroom-night-sensual-massage-569465.mp3" autoPlay loop muted={false} />\n      <UniversalHeader`);
fs.writeFileSync('src/views/HostView.tsx', hostCode);

