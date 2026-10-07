const fs = require('fs');
let code = fs.readFileSync('src/views/Landing.tsx', 'utf-8');

code = code.replace(
  "const [step, setStep] = useState<'hero' | 'setup' | 'join'>('hero');",
  "const [step, setStep] = useState<'hero' | 'setup' | 'join'>(new URLSearchParams(window.location.search).get('room') ? 'join' : 'hero');"
);

fs.writeFileSync('src/views/Landing.tsx', code);
