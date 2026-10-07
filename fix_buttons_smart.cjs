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

  const lines = code.split('\n');
  const newLines = lines.map(line => {
    // Only modify if the line seems to be interactive
    if (line.includes('<button') || line.includes('cursor-pointer') || line.includes('onClick')) {
      // Check if it already has active:shadow-none
      if (!line.includes('active:shadow-none')) {
        // If it has shadow-solid-sm
        if (line.includes('shadow-solid-sm')) {
          return line.replace('shadow-solid-sm', 'shadow-solid-sm active:translate-y-[2px] active:shadow-none');
        }
        // If it has shadow-solid
        else if (line.includes('shadow-solid')) {
          return line.replace('shadow-solid', 'shadow-solid active:translate-y-[4px] active:shadow-none');
        }
      }
    }
    return line;
  });

  fs.writeFileSync(file, newLines.join('\n'));
});
