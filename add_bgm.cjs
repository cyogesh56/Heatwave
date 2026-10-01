const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

code = code.replace(
  /<div className="min-h-\[100dvh\] w-full flex flex-col transition-colors duration-500 bg-canvas text-ink-primary font-sans overflow-x-hidden">/,
  `<div className="min-h-[100dvh] w-full flex flex-col transition-colors duration-500 bg-canvas text-ink-primary font-sans overflow-x-hidden">
      <audio src="/bgm.mp3" autoPlay loop muted={false} />`
);

fs.writeFileSync('src/views/HostView.tsx', code);
