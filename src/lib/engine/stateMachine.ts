import { getPlayedCards, markCardAsPlayed } from './exclusions';
import { parsePrompt } from './parser';

export type Card = {
  options?: string[];
  id: string;
  phase: number;
  type: 'truth' | 'dare' | 'kahoot' | 'wrong_answers' | 'consensus' | 'vibe_poll' | 'fill_blank';
  prompt: string;
  decks: string[];
};

export class GameEngine {
  private allCards: Card[] = [];
  public currentPhase: number = 1;

  constructor(cards: Card[]) {
    this.allCards = cards;
  }

  public drawNextCard(activePlayers: string[], targetPhase?: number, targetType?: string): { card: Card, parsedPrompt: string, targetedPlayers?: string[] } | null {
    if (targetPhase !== undefined) {
      this.currentPhase = targetPhase;
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
        this.currentPhase = searchPhase; 
        break;
      }
      const allPhaseCards = this.allCards.filter(c => c.phase === searchPhase);
      if (allPhaseCards.length > 0) {
         availableCards = allPhaseCards;
         this.currentPhase = searchPhase;
         break;
      }
      searchPhase++; 
    }

    if (availableCards.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const selectedCard = availableCards[randomIndex];
    markCardAsPlayed(selectedCard.id);
    const parsed = parsePrompt(selectedCard.prompt, activePlayers, selectedCard.options);

    // Create a new card object so we don't mutate the original allCards
    const cardToReturn = { ...selectedCard };
    if (parsed.parsedOptions) {
      cardToReturn.options = parsed.parsedOptions;
    }

    return {
      card: cardToReturn,
      parsedPrompt: parsed.text,
      targetedPlayers: parsed.targetedPlayers
    };
  }

  public escalatePhase() {
    if (this.currentPhase < 4) {
      this.currentPhase++;
    }
  }

  public deescalatePhase() {
    if (this.currentPhase > 1) {
      this.currentPhase--;
    }
  }
}
