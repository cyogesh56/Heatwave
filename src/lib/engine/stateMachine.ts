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
  private cardsPlayedInCurrentPhase: number = 0;
  private maxPhaseAvailable: number = 1;
  private totalCardsPlayed: number = 0;

  constructor(cards: Card[]) {
    this.allCards = cards;
    this.maxPhaseAvailable = cards.length > 0 ? Math.max(...cards.map(c => c.phase)) : 4;
  }

    public drawNextCard(activePlayers: string[], targetPhase?: number, targetType?: string): { card: Card, parsedPrompt: string, targetedPlayers?: string[]; assignedResponderName?: string } | null {
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
    
    const isFinale = (this.totalCardsPlayed === 24) || (this.currentPhase === this.maxPhaseAvailable && this.cardsPlayedInCurrentPhase === 4);
    
    if (isFinale) {
      // Force the absolute most intense climax card from the highest available phase!
      searchPhase = this.maxPhaseAvailable;
      let finaleCards = this.allCards.filter(c => c.phase === searchPhase && !playedIds.includes(c.id));
      finaleCards = finaleCards.filter(c => {
        const requiresC = c.prompt.includes('[Player C]') || (c.options && c.options.some(o => o.includes('[Player C]')));
        const requiresD = c.prompt.includes('[Player D]') || (c.options && c.options.some(o => o.includes('[Player D]')));
        if (requiresC && activePlayers.length < 3) return false;
        if (requiresD && activePlayers.length < 4) return false;
        return true;
      });
      
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
        availableCards = availableCards.filter(c => {
          const requiresC = c.prompt.includes('[Player C]') || (c.options && c.options.some(o => o.includes('[Player C]')));
          const requiresD = c.prompt.includes('[Player D]') || (c.options && c.options.some(o => o.includes('[Player D]')));
          if (requiresC && activePlayers.length < 3) return false;
          if (requiresD && activePlayers.length < 4) return false;
          return true;
        });
        // Filter out cards that require more players than we have in the room
        availableCards = availableCards.filter(c => {
          const requiresC = c.prompt.includes('[Player C]') || (c.options && c.options.some(o => o.includes('[Player C]')));
          const requiresD = c.prompt.includes('[Player D]') || (c.options && c.options.some(o => o.includes('[Player D]')));
          if (requiresC && activePlayers.length < 3) return false;
          if (requiresD && activePlayers.length < 4) return false;
          return true;
        });
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
    }

    return {
      card: cardToReturn,
      parsedPrompt: parsed.text,
      targetedPlayers: parsed.targetedPlayers,
      assignedResponderName: parsed.assignedResponderName
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
