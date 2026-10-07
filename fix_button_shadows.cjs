const fs = require('fs');

const files = [
  'src/views/Landing.tsx',
  'src/views/LobbyView.tsx',
  'src/views/ControllerView.tsx',
  'src/views/HostView.tsx',
  'src/components/ui/ChoiceGrid.tsx',
  'src/components/ui/PowerDock.tsx',
  'src/components/ui/ThemeToggle.tsx',
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf-8');

  // Replace shadow-solid-sm
  code = code.replace(/shadow-solid-sm(?!.*active:shadow-none)/g, 'shadow-solid-sm active:translate-y-[2px] active:shadow-none');

  // Replace shadow-solid (must not be followed by -sm)
  code = code.replace(/shadow-solid(?!-sm)(?!.*active:shadow-none)/g, 'shadow-solid active:translate-y-[4px] active:shadow-none');
  
  fs.writeFileSync(file, code);
});
