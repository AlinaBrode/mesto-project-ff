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

const popupEditProfileFieldName = formEditProfile.querySelector(
  ".popup__input_type_name"
);
const popupEditProfileFieldNameError = formEditProfile.querySelector(
  ".popup__input_type_name-error"
);
const formEditProfileSubmitButton =
  formEditProfile.querySelector(".popup__button");
const popupEditProfileFieldDescription = formEditProfile.querySelector(
  ".popup__input_type_description"
);
const popupEditProfileFieldDescriptionError = formEditProfile.querySelector(
  ".popup__input_type_description-error"
);

const popupNewCardFieldName = formAddCard.querySelector(
  ".popup__input_type_card-name"
);
const popupNewCardFieldNameError = formAddCard.querySelector(
  ".popup__input_type_name-error"
);

const formNewCardSubmitButton = formAddCard.querySelector(".popup__button");
const popupNewCardFieldLink = formAddCard.querySelector(
  ".popup__input_type_url"
);
const popupNewCardFieldLinkError = formAddCard.querySelector(
  ".popup__input_type_url-error"
);

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
  newCardLinkValid();
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
  profileEditNameValid();

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

function isValidString(input) {
  const regex = /^[A-Za-zА-Яа-яёЁ\s\-]+$/;
  return regex.test(input);
}

function setError(field, fieldError, btn, errorClass, message) {
  fieldError.textContent = message;
  field.classList.add(errorClass);
  btn.disabled = true;
}

function clearError(fieldError, btn) {
  fieldError.textContent = "";
  btn.disabled = false;
}

function profileEditFieldValid(field, fieldError, btn, maxLegth) {
  const name = field.value;

  if (name.length == 0) {
    setError(
      field,
      fieldError,
      btn,
      "popup__input-error",
      "Вы пропустили это поле"
    );
  } else if (name.length < 2) {
    setError(
      field,
      fieldError,
      btn,
      "popup__input-error",
      "Минимальное количество символов: 2. Длина текста сейчас: 1 символ."
    );
  } else if (name.length > maxLegth) {
    setError(
      field,
      fieldError,
      btn,
      "popup__input-error",
      `Максимальное количество символов: ${maxLegth}. Длина текста в буквах сейчас: ${name.length}.`
    );
  } else if (!isValidString(name)) {
    setError(
      field,
      fieldError,
      btn,
      "popup__input-error",
      "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы"
    );
  } else {
    clearError(fieldError, btn);
  }
}


function profileEditNameValid() {
  profileEditFieldValid(
    popupEditProfileFieldName,
    popupEditProfileFieldNameError,
    formEditProfileSubmitButton,
    20
  );
}

function profileEditDescriptionValid() {
  profileEditFieldValid(
    popupEditProfileFieldDescription,
    popupEditProfileFieldDescriptionError,
    formEditProfileSubmitButton,
    200
  );
}

function newCardNameValid() {
  profileEditFieldValid(popupNewCardFieldName, popupNewCardFieldNameError, formNewCardSubmitButton, 20);
}

function newCardLinkValid() {
  if (popupNewCardFieldLink.validity.typeMismatch) {
    setError(
      popupNewCardFieldLink,
      popupNewCardFieldLinkError,
      formNewCardSubmitButton,
      "popup__input-error",
      `Введите адрес сайта`
    );
  } else {
    clearError(popupNewCardFieldLinkError, formNewCardSubmitButton);
  }
}

popupEditProfileFieldName.addEventListener("input", profileEditNameValid);
popupEditProfileFieldDescription.addEventListener(
  "input",
  profileEditDescriptionValid
);
popupNewCardFieldName.addEventListener("input", newCardNameValid);
popupNewCardFieldLink.addEventListener("input", newCardLinkValid);
