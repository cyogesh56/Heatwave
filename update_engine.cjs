const fs = require('fs');
let code = fs.readFileSync('src/lib/engine/stateMachine.ts', 'utf-8');

code = code.replace(
  'public currentPhase: number = 1;',
  'public currentPhase: number = 1;\n  private cardsPlayedInCurrentPhase: number = 0;\n  private maxPhaseAvailable: number = 1;\n  private totalCardsPlayed: number = 0;'
);

code = code.replace(
  'this.allCards = cards;',
  'this.allCards = cards;\n    this.maxPhaseAvailable = cards.length > 0 ? Math.max(...cards.map(c => c.phase)) : 4;'
);

const drawNextCardBody = `  public drawNextCard(activePlayers: string[], targetPhase?: number, targetType?: string): { card: Card, parsedPrompt: string, targetedPlayers?: string[]; assignedResponderName?: string } | null {
    if (targetPhase !== undefined && targetPhase !== this.currentPhase) {
      this.currentPhase = targetPhase;
      this.cardsPlayedInCurrentPhase = 0;
    }

    if (this.cardsPlayedInCurrentPhase >= 5) {
      if (this.currentPhase < this.maxPhaseAvailable) {
        this.currentPhase++;
        this.cardsPlayedInCurrentPhase = 0;
      } else {
        return null;
      }
    }

    if (this.totalCardsPlayed >= 25) {
      return null;
    }

    const playedIds = getPlayedCards();
    
    let availableCards: Card[] = [];
    let searchPhase = this.currentPhase;
    
    while (searchPhase <= 4) {
      availableCards = this.allCards.filter(c => c.phase === searchPhase && !playedIds.includes(c.id));
      if (targetType) {
         availableCards = availableCards.filter(c => c.type === targetType);
      }
      if (availableCards.length > 0) {
        if (this.currentPhase !== searchPhase) {
           this.currentPhase = searchPhase;
           this.cardsPlayedInCurrentPhase = 0;
        }
        break;
      }
      searchPhase++; 
    }

    if (availableCards.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const selectedCard = availableCards[randomIndex];
    markCardAsPlayed(selectedCard.id);
    const parsed = parsePrompt(selectedCard.prompt, activePlayers, selectedCard.options);
    
    this.cardsPlayedInCurrentPhase++;
    this.totalCardsPlayed++;

    const cardToReturn = { ...selectedCard };
    if (parsed.parsedOptions) {
      cardToReturn.options = parsed.parsedOptions;
    }`;

// Now replace the drawNextCard function signature and body up to the parsedOptions part
const regex = /public drawNextCard.*?\n\s*cardToReturn\.options = parsed\.parsedOptions;\n\s*\}/s;
code = code.replace(regex, drawNextCardBody);
fs.writeFileSync('src/lib/engine/stateMachine.ts', code);
