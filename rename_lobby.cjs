const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');

code = code.replace(
  "{ id: 'base', name: 'The Base Journey', desc: 'The classic experience. Deep questions, absurd dares, and high-tension consensus.' },",
  "{ id: 'couples', name: 'Couples', desc: 'The classic experience. Deep questions, absurd dares, and high-tension consensus.' },"
);
code = code.replace(
  "const [selectedDecks, setSelectedDecks] = useState<string[]>(['base']);",
  "const [selectedDecks, setSelectedDecks] = useState<string[]>(['couples']);"
);

fs.writeFileSync('src/views/LobbyView.tsx', code);
