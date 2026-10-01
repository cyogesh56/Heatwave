const fs = require('fs');

let css = fs.readFileSync('src/styles/tokens.css', 'utf8');
css += `
@keyframes slow-bounce {
  0%, 100% {
    transform: translateY(-10%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
.animate-slow-bounce {
  animation: slow-bounce 3s infinite;
}
`;
fs.writeFileSync('src/styles/tokens.css', css);
console.log('CSS bounce added');
