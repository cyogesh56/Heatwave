const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');
code = code.replace(/translate-x-6/g, 'translate-x-5');
fs.writeFileSync('src/views/LobbyView.tsx', code);
