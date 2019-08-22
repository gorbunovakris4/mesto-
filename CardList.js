class CardList {
    constructor(container) {
        this.container = container;
    }

    addCard(name, link, likes, ownerId, cardId) {
        const newCard = new Card(name, link, likes, ownerId, cardId);
        this.container.appendChild(newCard.card);
    }

    render(cards) {
        cards.forEach(card => {
            if (BLOCKED_USERS.some((userId) => {
                return card.owner._id === userId;
            }))
                return;
            this.addCard(card.name, card.link, card.likes, card.owner._id, card._id);
        });
    }
}