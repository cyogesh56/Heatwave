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

  // Replace active:translate-y-[4px] and [2px] back to normal
  code = code.replace(/active:translate-y-\[4px\] /g, '');
  code = code.replace(/active:translate-y-\[2px\] /g, '');

  // Ensure active:translate-y-1 for shadow-solid
  code = code.replace(/shadow-solid(?!\s|-sm|-md|-lg)/g, match => {
    return 'shadow-solid';
  });

  // Actually, let's just make it very simple:
  // Find all shadow-solid-sm or shadow-solid. If they don't have active:shadow-none, we add them at the END of the className string.
  // Wait, parsing classNames is hard. Let's just fix the double active:translate-y issues!

  fs.writeFileSync(file, code);
});
