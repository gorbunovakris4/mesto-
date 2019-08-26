import Popup from './Popup.js';
import CardList from './Cardlist.js';

const newForm = document.forms.new;
const addButton = document.querySelector('.popup-for-photos__button');
const profileForm = document.forms.profile;
const saveButton = document.querySelector('.popup-for-profile__button');
const userName = document.querySelector('.user-info__name');
const userJob = document.querySelector('.user-info__job');
const avatarForm = document.forms.avatar;
const updateButton = document.querySelector('.popup-for-avatar__button');
const userAvatar = document.querySelector('.user-info__photo');
const root = document.querySelector('.root');

export const popupForPhotos = new Popup(document.querySelector('.popup-for-photos'), document.querySelector('.user-info__button'), document.querySelector('.popup-for-photos__close'));
export const popupForProfile = new Popup(document.querySelector('.popup-for-profile'), document.querySelector('.user-info__edit-button'), document.querySelector('.popup-for-profile__close'));
export const popupForAvatar = new Popup(document.querySelector('.popup-for-avatar'), document.querySelector('.user-info__photo'), document.querySelector('.popup-for-avatar__close'));

export const cardList = new CardList(document.querySelector('.places-list'));

const SERVER_BASE_URL = 'http://praktikum.tk/cohort1';
const TOCKEN = '37465f82-6757-49ca-8f0e-13e09273b52e';
const CONTENT_TYPE = 'application/json';
export const MY_ID = '26751cb353f46b06f586db73';

class Api {
    constructor(options) {
        this.baseUrl = options.baseUrl;
        this.headers = options.headers;
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
                    // result.forEach(card => {
                    //     console.log(card.owner);
                    // });
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

function addCardFromForm(event) {
    event.preventDefault();
    addButton.style.fontSize = '18px';
    addButton.textContent = 'Загрузка...';
    const name = newForm.elements.name;
    const link = newForm.elements.link;
    api.addCard(name.value, link.value);
}

export function rewriteProfile(name, job) {
    userName.textContent = name;
    userJob.textContent = job;
    profileForm.elements.userName.value = name;
    profileForm.elements.userJob.value = job;
}

export function rewriteAvatar(newUrl) {
    userAvatar.style.backgroundImage = "url(" + newUrl + ")";
}

function changeAvatar(event) {
    event.preventDefault();
    updateButton.textContent = 'Загрузка...';
    api.updateUserAvatar(event.currentTarget.elements.avatarUrl.value);
}

function changeProfile(event) {
    event.preventDefault();
    saveButton.textContent = 'Загрузка...';
    api.updateUserInfo(event.currentTarget.elements.userName.value, event.currentTarget.elements.userJob.value);

}

function isValidUrl(link) {
    return link.value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.([-a-zA-Z0-9@:%_\+.~#?&//=]*)([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
}

function isValidLink(link) {
    if (link.value.length === 0)
        return false;
    if (link.classList.contains('popup__input_type_link-url')) {
        return isValidUrl(link);
    }
    return link.value.length > 1 && link.value.length < 31; 
}

function validatorForLink(link) {
    if (link.value.length === 0) {
        link.nextElementSibling.textContent = 'Это обязательное поле';
        return;
    }
    if (link.classList.contains('popup__input_type_link-url')) {
        link.nextElementSibling.textContent = 'Здесь должна быть ссылка';
    } else if (link.value.length < 2 || link.value.length > 30)
        link.nextElementSibling.textContent = 'Должно быть от 2 до 30 символов';
}

function inputHandler(event) {
    const currentForm = event.currentTarget;
    const name = currentForm.elements[0];
    const link = currentForm.elements[1];
    if (name.value.length < 2 || name.value.length > 30 || !isValidLink(link)) {
        if (name.value.length === 0) {
            name.nextElementSibling.textContent = 'Это обязательное поле';
        } else if (name.value.length < 2 || name.value.length > 30) {
            name.nextElementSibling.textContent = 'Должно быть от 2 до 30 символов';
        } else {
            name.nextElementSibling.textContent = '';
        }
        if (!isValidLink(link))
            validatorForLink(link);
        else
        link.nextElementSibling.textContent = '';

        currentForm.querySelector('.popup__button').setAttribute('disabled', 'true');
        currentForm.querySelector('.popup__button').classList.remove('popup__button_is-active');
    } else {
        name.nextElementSibling.textContent = '';
        link.nextElementSibling.textContent = '';
        currentForm.querySelector('.popup__button').removeAttribute('disabled');
        currentForm.querySelector('.popup__button').classList.add('popup__button_is-active');
    }
}

function inputHandlerForAvatar(event) {
    const currentForm = event.currentTarget;
    const link = currentForm.elements[0];
    if (!isValidLink(link)) {
        validatorForLink(link);

        currentForm.querySelector('.popup__button').setAttribute('disabled', 'true');
        currentForm.querySelector('.popup__button').classList.remove('popup__button_is-active');
    } else {
        link.nextElementSibling.textContent = '';
        currentForm.querySelector('.popup__button').removeAttribute('disabled');
        currentForm.querySelector('.popup__button').classList.add('popup__button_is-active');
    }
}

export function showPicture(photo) {
    const closingIcon = document.createElement('img');
    const picture = document.createElement('img');
    let photoLink = photo.style.backgroundImage;
    const container = document.createElement('div');
    const popup = document.createElement('div');

    closingIcon.setAttribute('src', "./images/close.svg");
    closingIcon.setAttribute('alt', '');
    closingIcon.classList.add('photo-popup__close');
    photoLink = photoLink.substring(5, photoLink.length-2);
    picture.setAttribute('src', photoLink);
    picture.setAttribute('alt', '');
    picture.classList.add('popup__image');
    container.classList.add('photo-popup__content');
    container.appendChild(closingIcon);
    container.appendChild(picture);
    popup.classList.add('popup', 'popup_is-opened', 'photo-popup');
    popup.appendChild(container);
    root.appendChild(popup);
    document.querySelector('.photo-popup__close').addEventListener('click', function() {
        root.removeChild(popup);
    });
}


newForm.addEventListener('input', inputHandler);
newForm.addEventListener('submit', addCardFromForm);

profileForm.addEventListener('input', inputHandler);
profileForm.addEventListener('submit', changeProfile);

avatarForm.addEventListener('input', inputHandlerForAvatar);
avatarForm.addEventListener('submit', changeAvatar);



export const api = new Api({
    baseUrl: SERVER_BASE_URL,
    headers: {
      authorization: TOCKEN,
      'Content-Type': CONTENT_TYPE
    }
  });

api.getUserInfo();
api.getInitialCards();
addButton.setAttribute('disabled', 'true');
updateButton.setAttribute('disabled', 'true');
saveButton.classList.add('popup__button_is-active');
