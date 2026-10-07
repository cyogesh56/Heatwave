const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');

code = code.replace(
  "onClick={() => step === 'rules' ? setStep('decks') : step === 'decks' ? setStep('connect') : navigate('/')}",
  "onClick={() => step === 'rules' ? (intent === 'friends' ? setStep('intent') : setStep('vibe')) : (step === 'vibe' ? setStep('intent') : (step === 'intent' ? setStep('connect') : navigate('/')))}"
);

code = code.replace(
  "Step {step === 'connect' ? '1' : step === 'decks' ? '2' : '3'} of 3",
  "Step {step === 'connect' ? '1' : step === 'intent' ? '2' : step === 'vibe' ? '3' : '4'}"
);

fs.writeFileSync('src/views/LobbyView.tsx', code);
