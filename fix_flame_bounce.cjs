const fs = require('fs');

let ld = fs.readFileSync('src/views/Landing.tsx', 'utf8');

// Remove from wrapper
ld = ld.replace(
  'className="w-20 h-20 sm:w-24 sm:h-24 bg-surface-card rounded-3xl shadow-glow-active flex items-center justify-center border-4 border-accent-dare rotate-3 animate-slow-bounce"',
  'className="w-20 h-20 sm:w-24 sm:h-24 bg-surface-card rounded-3xl shadow-glow-active flex items-center justify-center border-4 border-accent-dare rotate-3"'
);

// Add to IconFlame
ld = ld.replace(
  '<IconFlame className="w-12 h-12 text-accent-dare" />',
  '<IconFlame className="w-12 h-12 text-accent-dare animate-slow-bounce" />'
);

fs.writeFileSync('src/views/Landing.tsx', ld);
console.log('Fixed flame bounce');
