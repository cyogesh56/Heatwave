const fs = require('fs');
let code = fs.readFileSync('src/lib/engine/stateMachine.ts', 'utf-8');

code = code.replace(
  /const parsed = parsePrompt\(selectedCard\.prompt, activePlayers\);[\s\S]*?return \{[\s\S]*?card: selectedCard,[\s\S]*?parsedPrompt: parsed\.text,[\s\S]*?targetedPlayers: parsed\.targetedPlayers[\s\S]*?\};/,
  `const parsed = parsePrompt(selectedCard.prompt, activePlayers, selectedCard.options);

    // Create a new card object so we don't mutate the original allCards
    const cardToReturn = { ...selectedCard };
    if (parsed.parsedOptions) {
      cardToReturn.options = parsed.parsedOptions;
    }

    return {
      card: cardToReturn,
      parsedPrompt: parsed.text,
      targetedPlayers: parsed.targetedPlayers
    };`
);

fs.writeFileSync('src/lib/engine/stateMachine.ts', code);
