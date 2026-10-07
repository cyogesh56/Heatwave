const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

code = code.replace(
  "transition={{ type: 'spring', stiffness: 200, damping: 20 }}",
  "transition={{ type: 'spring', stiffness: 200, damping: 20 }}\n        className={`min-h-[100dvh] w-full flex flex-col items-center justify-center ${hostGameState.interstitial?.color || 'bg-accent-dare'} text-canvas p-12 text-center`}"
);

fs.writeFileSync('src/views/HostView.tsx', code);
