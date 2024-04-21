import "./pages/index.css";

import { initialCards } from "./cards.js";
import { addCard, likeCard, delCard } from "./card.js";
import { openPopup, closePopup } from "./modal.js";

const profileAddButton = document.querySelector(".profile__add-button");
const profileEditButton = document.querySelector(".profile__edit-button");
const pageContent = document.querySelector(".page__content");
const popupTypeEdit = document.querySelector(".popup_type_edit");
const popupTypeNewCard = document.querySelector(".popup_type_new-card");
const popupTypeImage = document.querySelector(".popup_type_image");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const formEditProfile = document.forms["edit-profile"];
const formAddCard = document.forms["new-place"];
const popupImage = document.querySelector(".popup__image");
const allPopups = document.querySelectorAll(".popup");
const popupCaption = document.querySelector(".popup__caption");
const placesList = document.querySelector(".places__list");

function viewImage(event) {
  event.stopPropagation();
  openPopup(popupTypeImage);
  document.addEventListener("click", onOverlayClose);
  document.addEventListener("keydown", onClosePopupEsc);

  popupImage.src = event.target.src;
  popupImage.alt = event.target.alt;
  popupCaption.textContent = event.target.alt;
}

placesList.append(
  ...initialCards.map((descr) => addCard(descr, delCard, likeCard, viewImage))
);

function handleFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = formEditProfile.name.value;
  profileDescription.textContent = formEditProfile.description.value;
  closePopup(popupTypeEdit);
  document.removeEventListener("click", onOverlayClose);
  document.removeEventListener("keydown", onClosePopupEsc);
}

function handleAddCard(evt) {
  evt.preventDefault(); // prevents closing of popup by overlay-click logic

  const cardTitle = formAddCard["place-name"].value;
  const cardLink = formAddCard.link.value;
  formAddCard["place-name"].value = "";
  formAddCard.link.value = "";
  const newCard = addCard(
    {
      name: cardTitle,
      link: cardLink,
    },
    delCard,
    likeCard,
    viewImage
  );

  placesList.prepend(newCard);
  closePopup(popupTypeNewCard);
  document.removeEventListener("click", onOverlayClose);
  document.addEventListener("keydown", onClosePopupEsc);
}

formEditProfile.addEventListener("submit", handleFormSubmit);
formAddCard.addEventListener("submit", handleAddCard);

function openDialogEditProfile(evt) {
  formEditProfile.name.value = profileTitle.textContent;
  formEditProfile.description.value = profileDescription.textContent;

  evt.stopPropagation(); // prevents closing of popup by overlay-click logic

  openPopup(popupTypeEdit);
  document.addEventListener("click", onOverlayClose);
  document.addEventListener("keydown", onClosePopupEsc);
}

function openDialogNewCard(evt) {
  evt.stopPropagation(); // prevents closing of popup by overlay-click logic

  openPopup(popupTypeNewCard);
  document.addEventListener("click", onOverlayClose);
  document.addEventListener("keydown", onClosePopupEsc);
}

profileAddButton.addEventListener("click", openDialogNewCard);
profileEditButton.addEventListener("click", openDialogEditProfile);

function onClosePopup(evt) {
  if (evt.target.classList.contains("popup__close")) {
    closePopup(evt.target.closest(".popup"));
    document.removeEventListener("click", onOverlayClose);
    document.addEventListener("keydown", onClosePopupEsc);
  }
}

function onClosePopupEsc(evt) {
  if (evt.key === "Escape") {
    closePopup(document.querySelector(".popup_is-opened"));
    document.removeEventListener("click", onOverlayClose);
    document.addEventListener("keydown", onClosePopupEsc);
  }
}

pageContent.addEventListener("click", onClosePopup);

function onOverlayClose(evt) {
  for (const currentPopup of allPopups) {
    if (
      currentPopup.classList.contains("popup_is-opened") &&
      !currentPopup.querySelector(".popup__content").contains(evt.target)
    ) {
      closePopup(currentPopup);
      document.removeEventListener("click", onOverlayClose);
      document.addEventListener("keydown", onClosePopupEsc);
    }
  }
}
