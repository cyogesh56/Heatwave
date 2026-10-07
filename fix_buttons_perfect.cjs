const fs = require('fs');

const files = [
  'src/views/Landing.tsx',
  'src/views/LobbyView.tsx',
  'src/views/ControllerView.tsx',
  'src/views/HostView.tsx',
  'src/components/ui/ChoiceGrid.tsx',
  'src/components/ui/PowerDock.tsx',
  'src/components/ui/ThemeToggle.tsx',
  'src/components/ui/GamePopup.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf-8');

  const lines = code.split('\n');
  const newLines = lines.map(line => {
    // Only modify if it's an interactive element
    if (line.includes('<button') || line.includes('cursor-pointer') || line.includes('onClick')) {
      
      let modified = line
        .replace(/ active:translate-y-\[4px\]/g, '')
        .replace(/ active:translate-y-\[2px\]/g, '')
        .replace(/ active:translate-y-1/g, '')
        .replace(/ active:translate-y-0\.5/g, '')
        .replace(/ active:translate-y-0/g, '')
        .replace(/ active:shadow-none/g, '');

      if (modified.includes('shadow-solid-sm')) {
        return modified.replace('shadow-solid-sm', 'shadow-solid-sm active:translate-y-[2px] active:shadow-none');
      } else if (modified.includes('shadow-solid')) {
        return modified.replace('shadow-solid', 'shadow-solid active:translate-y-[4px] active:shadow-none');
      }
      return modified;
    }
    return line;
  });

  fs.writeFileSync(file, newLines.join('\n'));
});
