

export function closeModal(dialog) {
  return function (evt) {
    dialog.classList.remove('popup_is-opened');
  }
}

export function openPopup(popup) {
  popup.classList.add("popup_is-opened");
}

export function closePopup(popup) {
  popup.classList.remove("popup_is-opened");
}