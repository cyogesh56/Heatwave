const fs = require('fs');
let code = fs.readFileSync('src/views/Landing.tsx', 'utf-8');
code = code.replace(
  "import { IconFlame, IconUsers, IconZap } from '../components/icons';",
  "import { IconFlame, IconUsers, IconZap, IconOnTheGo, IconConnect } from '../components/icons';"
);
fs.writeFileSync('src/views/Landing.tsx', code);
