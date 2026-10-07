const fs = require('fs');

const views = [
  'src/views/ControllerView.tsx',
  'src/views/HostView.tsx',
  'src/views/Landing.tsx',
  'src/views/LobbyView.tsx',
];

views.forEach(file => {
  let code = fs.readFileSync(file, 'utf-8');

  // Replace pill shapes (rounded-full) in main action buttons
  // Note: We don't want to replace small icon buttons like the X close button (w-10 h-10 rounded-full)
  // We'll target ones with px- py- padding
  code = code.replace(/className="([^"]*)rounded-full([^"]*px-[^"]*py-[^"]*)"/g, 'className="$1rounded-2xl$2"');
  code = code.replace(/className="([^"]*px-[^"]*py-[^"]*)rounded-full([^"]*)"/g, 'className="$1rounded-2xl$2"');
  
  // Replace rounded-3xl buttons
  code = code.replace(/className="([^"]*)rounded-3xl([^"]*px-[^"]*py-[^"]*)"/g, 'className="$1rounded-2xl$2"');
  code = code.replace(/className="([^"]*px-[^"]*py-[^"]*)rounded-3xl([^"]*)"/g, 'className="$1rounded-2xl$2"');

  // Replace rounded-xl buttons
  code = code.replace(/className="([^"]*)rounded-xl([^"]*px-[^"]*py-[^"]*)"/g, 'className="$1rounded-2xl$2"');
  code = code.replace(/className="([^"]*px-[^"]*py-[^"]*)rounded-xl([^"]*)"/g, 'className="$1rounded-2xl$2"');

  // Add uniform shadow-solid-sm to buttons that have background colors but lack shadow
  code = code.replace(/className="([^"]*)(bg-accent-[^\s"]+|bg-ink-primary)([^"]*)rounded-2xl([^"]*)"/g, (match, p1, p2, p3, p4) => {
    if (!match.includes('shadow-')) {
      return `className="${p1}${p2}${p3}rounded-2xl shadow-solid-sm active:translate-y-0.5 active:shadow-none transition-all${p4}"`;
    }
    return match;
  });

  fs.writeFileSync(file, code);
});
