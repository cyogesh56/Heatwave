const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');

// Replace joinUrl
code = code.replace(
  /const joinUrl = `https:\/\/handsy\.party\/play\?room=\$\{roomCode\}`;/,
  'const joinUrl = `${window.location.origin}/?room=${roomCode}`;'
);

// Replace hardcoded domain text
code = code.replace(
  /<p className="font-body text-ink-primary\/50 mt-2 font-medium">handsy\.party<\/p>/,
  '<p className="font-body text-ink-primary/50 mt-2 font-medium">{window.location.host}</p>'
);

fs.writeFileSync('src/views/LobbyView.tsx', code);
