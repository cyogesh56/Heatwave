const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

code = code.replace(
  '    if (hostGameState?.uiState === \\\'voting\\\' && Object.keys(votes).length > 0 && Object.keys(votes).length >= requiredVotes) {\n       startReveal();\n    }\n  }, [votes]);',
  '    if (hostGameState?.uiState === \\\'voting\\\' && Object.keys(votes).length > 0 && Object.keys(votes).length >= requiredVotes) {\n       startReveal();\n    }\n  }, [votes, hostGameState?.players]);'
);

fs.writeFileSync('src/views/HostView.tsx', code);
