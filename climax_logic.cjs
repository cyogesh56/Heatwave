const fs = require('fs');
let code = fs.readFileSync('src/lib/engine/stateMachine.ts', 'utf-8');

const oldDraw = `    const playedIds = getPlayedCards();
    
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
    }`;

const newDraw = `    const playedIds = getPlayedCards();
    
    let availableCards: Card[] = [];
    let searchPhase = this.currentPhase;
    
    const isFinale = (this.totalCardsPlayed === 24) || (this.currentPhase === this.maxPhaseAvailable && this.cardsPlayedInCurrentPhase === 4);
    
    if (isFinale) {
      // Force the absolute most intense climax card from the highest available phase!
      searchPhase = this.maxPhaseAvailable;
      let finaleCards = this.allCards.filter(c => c.phase === searchPhase && !playedIds.includes(c.id));
      
      // Try to find a 'dare' (physical challenge) in the max phase, which is always the most intense
      const dareCards = finaleCards.filter(c => c.type === 'dare');
      if (dareCards.length > 0) {
         finaleCards = dareCards;
      }
      
      availableCards = finaleCards;
      if (availableCards.length > 0) {
        this.currentPhase = searchPhase;
      }
    }

    if (!isFinale || availableCards.length === 0) {
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
    }`;

code = code.replace(oldDraw, newDraw);
fs.writeFileSync('src/lib/engine/stateMachine.ts', code);
