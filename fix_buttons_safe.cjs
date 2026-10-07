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
      
      // Clean existing active states on this line to prevent duplicates
      let modified = line
        .replace(/\bactive:translate-y-\[4px\]/g, '')
        .replace(/\bactive:translate-y-\[2px\]/g, '')
        .replace(/\bactive:translate-y-1/g, '')
        .replace(/\bactive:translate-y-0\.5/g, '')
        .replace(/\bactive:translate-y-0/g, '')
        .replace(/\bactive:shadow-none/g, '')
        .replace(/\s{2,}/g, ' '); // Clean up double spaces created by the removal

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
