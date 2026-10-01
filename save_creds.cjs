const fs = require('fs');
let ld = fs.readFileSync('src/views/Landing.tsx', 'utf8');

ld = ld.replace(/await initClient\(roomCode, playerName\);/g, `localStorage.setItem('handsy_room', roomCode);
        localStorage.setItem('handsy_name', playerName);
        await initClient(roomCode, playerName);`);

fs.writeFileSync('src/views/Landing.tsx', ld);
console.log('Saved creds');
