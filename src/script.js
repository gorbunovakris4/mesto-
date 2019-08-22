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

const popupForPhotos = new Popup(document.querySelector('.popup-for-photos'), document.querySelector('.user-info__button'), document.querySelector('.popup-for-photos__close'));
const popupForProfile = new Popup(document.querySelector('.popup-for-profile'), document.querySelector('.user-info__edit-button'), document.querySelector('.popup-for-profile__close'));
const popupForAvatar = new Popup(document.querySelector('.popup-for-avatar'), document.querySelector('.user-info__photo'), document.querySelector('.popup-for-avatar__close'));

const cardList = new CardList(document.querySelector('.places-list'));

const SERVER_BASE_URL = 'http://95.216.175.5/cohort1';
const TOCKEN = '37465f82-6757-49ca-8f0e-13e09273b52e';
const CONTENT_TYPE = 'application/json';
const MY_ID = '26751cb353f46b06f586db73';

const BLOCKED_USERS = ["a8f785f65a89fd5aa5faf82c "];

const api = new Api({
    baseUrl: SERVER_BASE_URL,
    headers: {
      authorization: TOCKEN,
      'Content-Type': CONTENT_TYPE
    }
  });

function addCardFromForm(event) {
    event.preventDefault();
    addButton.style.fontSize = '18px';
    addButton.textContent = 'Загрузка...';
    const name = newForm.elements.name;
    const link = newForm.elements.link;
    api.addCard(name.value, link.value);
}

function rewriteProfile(name, job) {
    userName.textContent = name;
    userJob.textContent = job;
    profileForm.elements.userName.value = name;
    profileForm.elements.userJob.value = job;
}

function rewriteAvatar(newUrl) {
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

function showPicture(photo) {
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

api.getUsers();
api.getUserInfo();
api.getInitialCards();
addButton.setAttribute('disabled', 'true');
updateButton.setAttribute('disabled', 'true');
saveButton.classList.add('popup__button_is-active');
