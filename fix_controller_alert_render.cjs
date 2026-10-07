const fs = require('fs');
let code = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

// The main render block starts with:
// return (
//   <div className="min-h-[100dvh] bg-canvas text-ink-primary font-sans flex flex-col relative pb-32">
// We just need to insert <AlertOverlay state={clientState} node={clientNode} /> right after that.

code = code.replace(
  '<div className="min-h-[100dvh] bg-canvas text-ink-primary font-sans flex flex-col relative pb-32">',
  '<div className="min-h-[100dvh] bg-canvas text-ink-primary font-sans flex flex-col relative pb-32">\n      <AlertOverlay state={clientState} node={clientNode} />'
);

fs.writeFileSync('src/views/ControllerView.tsx', code);
