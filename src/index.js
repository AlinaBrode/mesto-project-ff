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
} from "./modal.js";
import { enableValidation, clearValidation } from "./validation.js";
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

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(validationConfig);

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
  clearValidation(popupTypeImage, validationConfig);
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
  // TODO: clearValidation
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
  clearValidation(popupTypeEdit, validationConfig);
  openPopup(popupTypeEdit);
}

function openDialogNewCard(evt) {
  formAddCard['place-name'].value = "";
  formAddCard.link.value = "";
  clearValidation(popupTypeNewCard, validationConfig);
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

  let cardAction = null;
  let classListAction = null;

  if (event.target.classList.contains("card__like-button_is-active")) {
    cardAction = removeLike;
    classListAction = () => {event.target.classList.remove("card__like-button_is-active")}
  } else {
    cardAction = setLike;
    classListAction = () => {event.target.classList.add("card__like-button_is-active");}
  }

  cardAction(cardId)
  .then((data) => {
    classListAction();
    event.target.nextElementSibling.textContent = data.likes.length;
  })
  .catch(logError);
}

profileImage.addEventListener("click", (evt) => {
  formNewAvatar.link.value = "";
  clearValidation(popupTypeNewAvatar,validationConfig);
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
