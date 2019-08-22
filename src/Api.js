class Api {
    constructor(options) {
        this.baseUrl = options.baseUrl;
        this.headers = options.headers;
    }

    getUsers() {
        return fetch(this.baseUrl + '/users', {
            headers: this.headers
        })
            .then(res => {
                if (res.ok)
                    return res.json();
            })
            .then((result) => {
                if (result) {
                    console.log(result);
                    console.log("Students with default profile: " + result.reduce((prev, user) => {
                        return prev + Number((user.name === "Jacques Cousteau") && (user.about === "Sailor, researcher"));
                    }, -1));
                    console.log("Students with default avatar: " + result.reduce((prev, user) => {
                        return prev + Number(user.avatar === "https://pictures.s3.yandex.net/frontend-developer/common/ava.jpg");
                    }, -1));
                } else {
                    console.log('Произошла ошибка');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getUserInfo() {
        return fetch(this.baseUrl + '/users/me', {
            headers: this.headers
        })
            .then(res => {
                if (res.ok)
                    return res.json();
            })
            .then((result) => {
                if (result) {
                    rewriteProfile(result.name, result.about);
                    rewriteAvatar(result.avatar);
                } else {
                    console.log('Произошла ошибка');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    updateUserInfo(name, about) {
        return fetch(this.baseUrl + '/users/me', {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify({ name, about })
        })
            .then(res => {
                if (res.ok)
                    return res.json();
            })
            .then((result) => {
                if (result) {
                    rewriteProfile(result.name, result.about);
                } else {
                    console.log('Произошла ошибка');
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                popupForProfile.popupElement.classList.remove('popup_is-opened');
                saveButton.textContent = "Сохранить";
            });
    }

    updateUserAvatar(avatar) {
        return fetch(this.baseUrl + '/users/me/avatar', {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify({ avatar })
        })
            .then(res => {
                if (res.ok)
                    return res.json();
            })
            .then((result) => {
                if (result) {
                    rewriteAvatar(result.avatar);
                } else {
                    console.log('Произошла ошибка');
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                popupForAvatar.popupElement.classList.remove('popup_is-opened');
                avatarForm.reset();
                updateButton.setAttribute('disabled', true);
                updateButton.classList.remove('popup__button_is-active');
                updateButton.textContent = "Сохранить";
            });
    }

    getInitialCards() {
        return fetch(this.baseUrl + '/cards', {
            headers: this.headers
        })
            .then(res => {
                if (res.ok)
                    return res.json();
            })
            .then((result) => {
                if (result) {
                    cardList.render(result);
                    console.log(result);
                    console.log(result.reduce((prev, card) => {
                        prev.push(card.owner);
                        return prev;
                    }, []));
                } else {
                    console.log('Произошла ошибка');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    addCard(name, link) {
        return fetch(this.baseUrl + '/cards', {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ name, link })
        })
            .then(res => {
                if (res.ok)
                    return res.json();
            })
            .then((result) => {
                if (result)
                    cardList.addCard(result.name, result.link, result.likes, result.owner._id, result._id);
                else {
                    console.log('Произошла ошибка');
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                popupForPhotos.popupElement.classList.remove('popup_is-opened');
                newForm.reset();
                addButton.setAttribute('disabled', true);
                addButton.classList.remove('popup__button_is-active');
                addButton.style.fontSize = '36px';
                addButton.textContent = "+";
            });
    }

    deleteCard(card) {
        return fetch(this.baseUrl + '/cards/' + card.id, {
            method: 'DELETE',
            headers: this.headers
        })
        .then(res => {
            if (res.ok)
                card.remove();
            else
                console.log('Произошла ошибка');

        })
        .catch((err) => {
            console.log(err);
        })
    }

    likeCard(card) {
        return fetch(this.baseUrl + '/cards/like/' + card.id, {
            method: 'PUT',
            headers: this.headers
        })
        .then(res => {
            if (res.ok)
                return res.json();
            else
                console.log('Произошла ошибка');

        })
        .then(result => {
            card.likes = result.likes;
            card.renderLikeCounter(result.likes);
            card.card.querySelector('.place-card__like-icon').classList.add('place-card__like-icon_liked');
        })
        .catch((err) => {
            console.log(err);
        })
    }

    dislikeCard(card) {
        return fetch(this.baseUrl + '/cards/like/' + card.id, {
            method: 'DELETE',
            headers: this.headers
        })
        .then(res => {
            if (res.ok)
                return res.json();
            else
                console.log('Произошла ошибка');

        })
        .then(result => {
            card.likes = result.likes;
            card.renderLikeCounter(result.likes);
            card.card.querySelector('.place-card__like-icon').classList.remove('place-card__like-icon_liked');
        })
        .catch((err) => {
            console.log(err);
        })
    }

}