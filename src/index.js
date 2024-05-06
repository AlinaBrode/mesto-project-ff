import "./pages/index.css";

import {
  deleteCard,
  submitProfileForm,
  remoteCreateCard,
  getProfileAndCards,
  setLike,
  removeLike,
  patchAvatar,
} from "./api.js";
import { createCard } from "./card.js";

import {
  openPopup,
  closePopup,
  onClosePopupEsc,
  onOverlayClose,
} from "./modal.js";

const myToken = "90ad5c9a-5357-4276-be02-5ea1b5321bf2";
const myCohort = "wff-cohort-12";
const profileAddButton = document.querySelector(".profile__add-button");
const profileEditButton = document.querySelector(".profile__edit-button");
const popupTypeEdit = document.querySelector(".popup_type_edit");
const popupTypeNewCard = document.querySelector(".popup_type_new-card");
const popupTypeNewAvatar = document.querySelector(".popup_type_new-avatar");
const popupTypeImage = document.querySelector(".popup_type_image");
const popupTypeDelConfirm = document.querySelector(
  ".popup_type_delete-confirm"
);
const profileTitle = document.querySelector(".profile__title");
const profileImage = document.querySelector(".profile__image");
const profileDescription = document.querySelector(".profile__description");
const formEditProfile = document.forms["edit-profile"];
const buttonEditProfile = formEditProfile.querySelector(".submit__button");
const formAddCard = document.forms["new-place"];
const buttonNewPlace = formAddCard.querySelector(".submit__button");
const formNewAvatar = document.forms["new-avatar"];
const buttonNewAvatar = document.querySelector(".submit__button");
const popupImage = document.querySelector(".popup__image");
const popupCaption = document.querySelector(".popup__caption");
const placesList = document.querySelector(".places__list");
const popupConfirmDelete = document.querySelector(".popup_type_delete-confirm");
const confirmDeleteForm = popupConfirmDelete.querySelector(".popup__form");
const popupConfirmDeleteButton =
  confirmDeleteForm.querySelector(".popup__button");

let profileInfo = null;
let cardsList = null;

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

function delCard(event) {
  popupConfirmDeleteButton.cardId = event.target.cardId;
  openPopup(popupTypeDelConfirm);
}

function logError(err) {
  console.log(err); // выводим ошибку в консоль
}

function onConfirmDelete(event) {
  event.preventDefault();

  deleteCard(
    popupConfirmDeleteButton.cardId,
    formEditProfile.name.value,
    formEditProfile.description.value
  )
    .then((data) => {
      document.querySelector(`#a${popupConfirmDeleteButton.cardId}`).remove(); //cardId can have a digit at the beginning, that is not correct js id, so 'a' at the beginning
      closePopup(popupTypeDelConfirm);
    })
    .catch(logError);
}

confirmDeleteForm.addEventListener("submit", onConfirmDelete);

function viewImage(event) {
  openPopup(popupTypeImage);

  popupImage.src = event.target.src;
  popupImage.alt = event.target.alt;
  popupCaption.textContent = event.target.alt;
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  buttonEditProfile.textContent = "Сохранение...";
  submitProfileForm(
    formEditProfile.name.value,
    formEditProfile.description.value
  )
    .then((data) => {
      profileTitle.textContent = data.name;
      profileDescription.textContent = data.about;
    })
    .catch(logError)
    .finally(() => {
      buttonEditProfile.textContent = "Сохранение...";
      closePopup(popupTypeEdit);
    });
}

function handleAddCard(evt) {
  evt.preventDefault(); // prevents closing of popup by overlay-click logic

  const cardTitle = formAddCard["place-name"].value;
  const cardLink = formAddCard.link.value;
  formAddCard["place-name"].value = "";
  formAddCard.link.value = "";
  newCardLinkValid();
  buttonNewPlace.textContent = "Сохранение...";
  remoteCreateCard(cardTitle, cardLink)
    .then((data) => {
      const newCard = createCard(
        data,
        delCard,
        likeCard,
        viewImage,
        profileInfo
      );

      placesList.prepend(newCard);
      closePopup(popupTypeNewCard);
    })
    .catch(logError)
    .finally(() => {
      buttonNewPlace.textContent = "Сохранить...";
    });
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
  profileEditFieldValid(
    popupNewCardFieldName,
    popupNewCardFieldNameError,
    formNewCardSubmitButton,
    20
  );
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

getProfileAndCards()
  .then((profileCards) => {
    const [infoProfile, infoCards] = profileCards;

    profileInfo = infoProfile;
    profileTitle.textContent = infoProfile.name;
    profileDescription.textContent = infoProfile.about;
    profileImage.style.backgroundImage = `url('${infoProfile.avatar}')`;

    placesList.append(
      ...infoCards.map((descr) =>
        createCard(descr, delCard, likeCard, viewImage, infoProfile)
      )
    );
  })
  .catch(logError);

function likeCard(event) {
  const cardId = event.target.cardId;

  if (event.target.classList.contains("card__like-button_is-active")) {
    removeLike(cardId)
      .then((data) => {
        event.target.classList.remove("card__like-button_is-active");
        event.target.nextElementSibling.textContent = data.likes.length;
      })
      .catch(logError);
  } else {
    setLike(cardId)
      .then((data) => {
        event.target.classList.add("card__like-button_is-active");
        event.target.nextElementSibling.textContent = data.likes.length;
      })
      .catch(logError);
  }
}

profileImage.addEventListener("click", (evt) => {
  openPopup(popupTypeNewAvatar);
});

formNewAvatar.addEventListener("submit", (evt) => {
  evt.preventDefault();
  closePopup(popupTypeNewAvatar);
  buttonNewAvatar.textContent = "Сохранение...";

  patchAvatar(formNewAvatar.link.value)
    .then((data) => {
      profileImage.style.backgroundImage = `url('${data.avatar}')`;
    })
    .catch(logError)
    .finally(() => {
      buttonNewAvatar.textContent = "Сохранить...";
    });
});
