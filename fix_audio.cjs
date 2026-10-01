const fs = require('fs');

// Remove from HostView
let hostCode = fs.readFileSync('src/views/HostView.tsx', 'utf-8');
hostCode = hostCode.replace(/<audio src="\/arpmedia-bedroom-night-sensual-massage-569465\.mp3" autoPlay loop muted=\{false\} \/>/, '');
fs.writeFileSync('src/views/HostView.tsx', hostCode);

// Remove from LobbyView
let lobbyCode = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');
lobbyCode = lobbyCode.replace(/<audio src="\/saavane-sensual-music-390794\.mp3" autoPlay loop muted=\{false\} \/>/, '');
fs.writeFileSync('src/views/LobbyView.tsx', lobbyCode);

// Add to App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
appCode = appCode.replace(/import \{ PortraitEnforcer \} from '\.\/components\/ui\/PortraitEnforcer';/, `import { PortraitEnforcer } from './components/ui/PortraitEnforcer';\nimport { AudioManager } from './components/AudioManager';`);
appCode = appCode.replace(/<PortraitEnforcer \/>/, `<PortraitEnforcer />\n        <AudioManager />`);
fs.writeFileSync('src/App.tsx', appCode);

