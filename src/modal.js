export function openPopup(popup, onOverlayClose, onClosePopupEsc) {
  popup.classList.add("popup_is-opened");
  popup.addEventListener("click", onOverlayClose);
  document.addEventListener("keydown", onClosePopupEsc);

  // находим все крестики проекта по универсальному селектору
  const closeButtons = document.querySelectorAll(".popup__close");

  // с окончанием `s` нужно обязательно, так как много кнопок
  closeButtons.forEach((button) => {
    // находим 1 раз ближайший к крестику попап
    const popup = button.closest(".popup");
    // устанавливаем обработчик закрытия на крестик
    button.addEventListener("click", () => closePopup(popup));
  });
}

export function closePopup(popup, onOverlayClose, onClosePopupEsc) {
  popup.classList.remove("popup_is-opened");
  popup.removeEventListener("click", onOverlayClose);
  document.removeEventListener("keydown", onClosePopupEsc);
}

export function onClosePopup(evt) {
  const activePopup = evt.target.closest(".popup");
  if (evt.target.classList.contains("popup__close") && activePopup !== null) {
    closePopup(activePopup, onOverlayClose, onClosePopupEsc);
  }
}

export function onClosePopupEsc(evt) {
  const popup = document.querySelector(".popup_is-opened");
  if (evt.key === "Escape" && popup !== null) {
    closePopup(popup, onOverlayClose, onClosePopupEsc);
  }
}

export function onOverlayClose(evt) {
  if (evt.target.classList.contains("popup_is-opened")) {
    closePopup(evt.target, onOverlayClose, onClosePopupEsc);
  }
}
