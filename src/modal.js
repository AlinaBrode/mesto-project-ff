export function openPopup(popup) {
  popup.classList.add("popup_is-opened");
  popup.addEventListener("click", onOverlayClose);
  document.addEventListener("keydown", onClosePopupEsc);
}

export function closePopup(popup) {
  popup.classList.remove("popup_is-opened");
  popup.removeEventListener("click", onOverlayClose);
  document.removeEventListener("keydown", onClosePopupEsc);
}

export function onClosePopup(evt) {
  const activePopup = evt.target.closest(".popup");
  if (evt.target.classList.contains("popup__close") && activePopup !== null) {
    closePopup(activePopup);
  }
}

export function onClosePopupEsc(evt) {
  if (evt.key === "Escape") {
    const popup = document.querySelector(".popup_is-opened");
    if (popup !== null) {
      closePopup(popup);
    }
  }
}

export function onOverlayClose(evt) {
  if (evt.target.classList.contains("popup_is-opened")) {
    closePopup(evt.target);
  }
}


