const fs = require('fs');

function cleanFile(filePath, isApp) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let lines = content.split('\n');
  
  if (isApp) {
    // Delete the first 16 lines which contain the broken class
    lines.splice(0, 16);
  } else {
    // Delete lines 10 to 24 in ControllerView
    lines.splice(9, 15);
  }
  
  fs.writeFileSync(filePath, lines.join('\n'));
}

cleanFile('src/App.tsx', true);
cleanFile('src/views/ControllerView.tsx', false);
