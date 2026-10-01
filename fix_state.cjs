const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

code = code.replace(
  /const \[uiAlert, setUiAlert\] = useState\(''\);/,
  `const [uiAlert, setUiAlert] = useState('');\n  const [confirmEndGame, setConfirmEndGame] = useState(false);`
);

fs.writeFileSync('src/views/HostView.tsx', code);
