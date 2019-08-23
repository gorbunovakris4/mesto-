export default class Popup {
    constructor(element, openButton, closeButton) {
        this.popupElement = element;
        this.openButton = openButton;
        this.closeButton = closeButton;
        this.openButton.addEventListener('click', this.open.bind(this));
        this.closeButton.addEventListener('click', this.close.bind(this));
    }

    open() {
        this.popupElement.classList.add('popup_is-opened');
    }

    close() {
        this.popupElement.classList.remove('popup_is-opened');
    }
}
