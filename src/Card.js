class Card {
    constructor(name, link, likes, ownerId, cardId) {
        this.likes = likes;
        this.card = this.create(name, link, likes, ownerId);
        this.id = cardId;
    }

    createDeleteIcon() {
        const deleteIcon = document.createElement('button');
        deleteIcon.classList.add('place-card__delete-icon');
        deleteIcon.addEventListener('click', this.delete.bind(this));
        return deleteIcon;
    }

    create(name, link, likes, ownerId) {
        const card = document.createElement('div');
        const cardImage = document.createElement('div');
        const cardDescription = document.createElement('div');
        const cardName = document.createElement('h3');
        const likeCount = document.createElement('p');
        const likeIcon = document.createElement('button');
        const likeContainer = document.createElement('div');

        card.classList.add('place-card');
        cardImage.classList.add('place-card__image');
        cardDescription.classList.add("place-card__description");
        cardName.classList.add("place-card__name");
        likeCount.classList.add("place-card__like-count");
        likeIcon.classList.add("place-card__like-icon");
        likeContainer.classList.add("place-card__like-container");

        if (this.isLiked()) {
            likeIcon.classList.add('place-card__like-icon_liked');
        }

        cardImage.style.backgroundImage = "url(" + link + ")";
        cardName.textContent = name;
        likeCount.textContent = likes.length;

        cardImage.addEventListener('click', this.showPicture);
        likeIcon.addEventListener('click', this.like.bind(this));
       
        if (ownerId === MY_ID) {
            cardImage.appendChild(this.createDeleteIcon()); 
        }

        card.appendChild(cardImage);
        cardDescription.appendChild(cardName);
        likeContainer.appendChild(likeIcon);
        likeContainer.appendChild(likeCount);
        cardDescription.appendChild(likeContainer);
        card.appendChild(cardDescription);

        return card;
    }

    renderLikeCounter(likes) {
        this.card.querySelector('.place-card__like-count').textContent = likes.length;
    }

    like() {
        if (this.isLiked()) {
            api.dislikeCard(this);
        }
        else {
            api.likeCard(this);
        }
    }

    isLiked() {
        return this.likes.some(owner => {
            return owner._id === MY_ID;
        })
    }

    delete() {
        if(window.confirm('Вы действительно хотите удалить эту карточку?')) {
            api.deleteCard(this);
        }            
    }

    remove() {
       this.card.querySelector('.place-card__like-icon').removeEventListener('click', this.like);
       this.card.querySelector('.place-card__delete-icon').removeEventListener('click', this.delete.bind(this));
       this.card.querySelector('.place-card__image').removeEventListener('click', this.showPicture);

        cardList.container.removeChild(this.card);
    }

    showPicture(event) {
        if (event.target.classList.contains('place-card__image'))
            showPicture(event.target);
    }
}
