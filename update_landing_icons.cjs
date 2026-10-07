const fs = require('fs');
let code = fs.readFileSync('src/views/Landing.tsx', 'utf-8');

// Add imports
code = code.replace(
  "import { IconZap, IconFlame } from '../components/icons';",
  "import { IconZap, IconFlame, IconOnTheGo, IconConnect } from '../components/icons';"
);

// Replace On The Go Icon
code = code.replace(
  "<IconFlame className=\"w-7 h-7 text-accent-dare\" />",
  "<IconOnTheGo className=\"w-7 h-7 text-accent-dare\" />"
);

// Replace Join Game Icon
code = code.replace(
  "<IconZap className=\"w-8 h-8 text-accent-consensus\" />",
  "<IconConnect className=\"w-8 h-8 text-accent-consensus\" />"
);

fs.writeFileSync('src/views/Landing.tsx', code);
