const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');

// Add imports
code = code.replace(
  "import { IconZap, IconUsers, IconFlame, IconSpark } from '../components/icons';",
  "import { IconUsers, IconFlame, IconCouple, IconPoly, IconArrowLeft, IconDrink, IconMoon } from '../components/icons';"
);

// Replace Back arrow text with icon
code = code.replace(
  "← Back",
  "<div className=\"flex items-center gap-2\"><IconArrowLeft className=\"w-5 h-5\" /> Back</div>"
);

// Replace Couples Icon (was IconFlame)
code = code.replace(
  "<IconFlame className=\"w-7 h-7 text-accent-truth\" />",
  "<IconCouple className=\"w-7 h-7 text-accent-truth\" />"
);

// Replace Poly Icon (was IconZap)
code = code.replace(
  "<IconZap className=\"w-7 h-7 text-accent-dare\" />",
  "<IconPoly className=\"w-7 h-7 text-accent-dare\" />"
);

// Replace First Date Icon (was IconSpark)
code = code.replace(
  "<IconSpark className=\"w-7 h-7 text-accent-consensus\" />",
  "<IconDrink className=\"w-7 h-7 text-accent-consensus\" />"
);

// Replace After Dark Icon (was IconFlame)
code = code.replace(
  "<IconFlame className=\"w-7 h-7 text-accent-dare\" />",
  "<IconMoon className=\"w-7 h-7 text-accent-dare\" />"
);

fs.writeFileSync('src/views/LobbyView.tsx', code);
