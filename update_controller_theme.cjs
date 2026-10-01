const fs = require('fs');
let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf8');

const hookStart = `  React.useEffect(() => {
    if (!clientState && !clientNode) {`;

const newEffect = `  React.useEffect(() => {
    if (clientState?.theme) {
      if (clientState.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [clientState?.theme]);\n\n`;

cv = cv.replace(hookStart, newEffect + hookStart);
fs.writeFileSync('src/views/ControllerView.tsx', cv);
console.log('Controller theme sync added');
