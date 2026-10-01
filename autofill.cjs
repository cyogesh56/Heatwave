const fs = require('fs');
let ld = fs.readFileSync('src/views/Landing.tsx', 'utf8');

// Add URLSearchParams
ld = ld.replace(/const \[roomCode, setRoomCode\] = useState\(''\);/, 
`const searchParams = new URLSearchParams(window.location.search);
  const [roomCode, setRoomCode] = useState(searchParams.get('room') || '');`);

fs.writeFileSync('src/views/Landing.tsx', ld);
