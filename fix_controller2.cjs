const fs = require('fs');
let code = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

code = code.replace(/card\.assignedResponderName/g, 'clientState.currentCard.assignedResponderName');

fs.writeFileSync('src/views/ControllerView.tsx', code);
