import "./pages/index.css";

import { initialCards } from "./cards.js";
import { addCard, likeCard, delCard } from "./card.js";
import {
  openPopup,
  closePopup,
  onClosePopupEsc,
  onOverlayClose,
} from "./modal.js";

const profileAddButton = document.querySelector(".profile__add-button");
const profileEditButton = document.querySelector(".profile__edit-button");
const popupTypeEdit = document.querySelector(".popup_type_edit");
const popupTypeNewCard = document.querySelector(".popup_type_new-card");
const popupTypeImage = document.querySelector(".popup_type_image");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const formEditProfile = document.forms["edit-profile"];
const formAddCard = document.forms["new-place"];
const popupImage = document.querySelector(".popup__image");
const popupCaption = document.querySelector(".popup__caption");
const placesList = document.querySelector(".places__list");

function viewImage(event) {
  openPopup(popupTypeImage);

  popupImage.src = event.target.src;
  popupImage.alt = event.target.alt;
  popupCaption.textContent = event.target.alt;
}

placesList.append(
  ...initialCards.map((descr) => addCard(descr, delCard, likeCard, viewImage))
);

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = formEditProfile.name.value;
  profileDescription.textContent = formEditProfile.description.value;
  closePopup(popupTypeEdit);
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
}

formEditProfile.addEventListener("submit", handleProfileFormSubmit);
formAddCard.addEventListener("submit", handleAddCard);

function openDialogEditProfile(evt) {
  formEditProfile.name.value = profileTitle.textContent;
  formEditProfile.description.value = profileDescription.textContent;

  openPopup(popupTypeEdit);
}

function openDialogNewCard(evt) {
  openPopup(popupTypeNewCard);
}

profileAddButton.addEventListener("click", openDialogNewCard);
profileEditButton.addEventListener("click", openDialogEditProfile);

// находим все крестики проекта по универсальному селектору
const closeButtons = document.querySelectorAll(".popup__close");

// с окончанием `s` нужно обязательно, так как много кнопок
closeButtons.forEach((button) => {
  // находим 1 раз ближайший к крестику попап
  const popup = button.closest(".popup");
  // устанавливаем обработчик закрытия на крестик
  button.addEventListener("click", () => closePopup(popup));
});
