

export function closeModal(dialog) {
  return function (evt) {
    console.log('parent node', evt.target.parentNode.parentNode);
    dialog.classList.remove('popup_is-opened');
  }
}
