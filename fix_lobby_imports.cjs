const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');
code = code.replace(
  "import { IconZap } from '../components/icons';",
  "import { IconZap, IconUsers, IconFlame, IconSpark } from '../components/icons';"
);
fs.writeFileSync('src/views/LobbyView.tsx', code);
