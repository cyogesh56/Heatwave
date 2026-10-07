const EXCLUSION_KEY = 'heatwave_played_cards';
export function getPlayedCards() {
    try {
        const data = localStorage.getItem(EXCLUSION_KEY);
        if (data) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    }
    catch (e) {
        console.error('Failed to parse excluded cards from localStorage', e);
    }
    return [];
}
export function markCardAsPlayed(cardId) {
    try {
        let played = getPlayedCards();
        if (!played.includes(cardId)) {
            played.push(cardId);
            if (played.length > 500) {
                played = played.slice(-500); // Keep only the most recent 500 cards
            }
            localStorage.setItem(EXCLUSION_KEY, JSON.stringify(played));
        }
    }
    catch (e) {
        console.error('Failed to save excluded card', e);
    }
}
export function clearPlayedCards() {
    localStorage.removeItem(EXCLUSION_KEY);
}
