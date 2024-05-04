import "./pages/index.css";

import { initialCards } from "./cards.js";
import { addCard } from "./card.js";
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
const formAddCard = document.forms["new-place"];
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

function onConfirmDelete(event) {
  event.preventDefault();

  fetch(
    `https://nomoreparties.co/v1/${myCohort}/cards/${popupConfirmDeleteButton.cardId}`,
    {
      method: "DELETE",
      headers: {
        authorization: myToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formEditProfile.name.value,
        about: formEditProfile.description.value,
      }),
    }
  )
    .then((data) => data.json())
    .then((data) => {
      window.location.reload();
    });
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

  fetch(`https://nomoreparties.co/v1/${myCohort}/users/me`, {
    method: "PATCH",
    headers: {
      authorization: myToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: formEditProfile.name.value,
      about: formEditProfile.description.value,
    }),
  })
    .then((data) => data.json())
    .then((data) => {
      profileTitle.textContent = data.name;
      profileDescription.textContent = data.about;
    });

  closePopup(popupTypeEdit);
}

function handleAddCard(evt) {
  evt.preventDefault(); // prevents closing of popup by overlay-click logic

  const cardTitle = formAddCard["place-name"].value;
  const cardLink = formAddCard.link.value;
  formAddCard["place-name"].value = "";
  formAddCard.link.value = "";
  newCardLinkValid();

  fetch(`https://nomoreparties.co/v1/${myCohort}/cards`, {
    method: "POST",
    headers: {
      authorization: myToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: cardTitle,
      link: cardLink,
    }),
  })
    .then((data) => data.json())
    .then((data) => {
      const newCard = addCard(data, delCard, likeCard, viewImage, profileInfo);

      placesList.prepend(newCard);
      closePopup(popupTypeNewCard);
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

/*
fetch('https://nomoreparties.co/v1/wff-cohort-12/cards', {
  headers: {
    authorization: '90ad5c9a-5357-4276-be02-5ea1b5321bf2'
  }
})
  .then(res => res.json())
  .then((result) => {
    console.log(result);
  }); */

const promiseGetProfile = fetch(
  "https://nomoreparties.co/v1/wff-cohort-12/users/me",
  {
    headers: {
      authorization: "90ad5c9a-5357-4276-be02-5ea1b5321bf2",
    },
  }
)
  .then((res) => res.json())
  .then((result) => {
    profileInfo = result;
    profileTitle.textContent = result.name;
    profileDescription.textContent = result.about;
    profileImage.style.backgroundImage = `url('${result.avatar}')`;
  });

const promiseGetCards = fetch(`https://nomoreparties.co/v1/${myCohort}/cards`, {
  headers: {
    authorization: myToken,
  },
})
  .then((res) => res.json())
  .then((result) => {
    cardsList = result;
  });

const promiseGetProfileAndCards = Promise.all([
  promiseGetProfile,
  promiseGetCards,
]);

promiseGetProfileAndCards.then(() => {
  placesList.append(
    ...cardsList.map((descr) =>
      addCard(descr, delCard, likeCard, viewImage, profileInfo)
    )
  );
});

function likeCard(event) {
  if (event.target.classList.contains("card__like-button_is-active")) {
    fetch(
      `https://nomoreparties.co/v1/${myCohort}/cards/likes/${event.target.cardId}`,
      {
        method: "DELETE",
        headers: {
          authorization: myToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formEditProfile.name.value,
          about: formEditProfile.description.value,
        }),
      }
    )
      .then((data) => data.json())
      .then((data) => {
        window.location.reload();
        // event.target.classList.add("card__like-button_is-active");
      });
  } else {
    fetch(
      `https://nomoreparties.co/v1/${myCohort}/cards/likes/${event.target.cardId}`,
      {
        method: "PUT",
        headers: {
          authorization: myToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formEditProfile.name.value,
          about: formEditProfile.description.value,
        }),
      }
    )
      .then((data) => data.json())
      .then((data) => {
        window.location.reload();
        // event.target.classList.remove("card__like-button_is-active");
      });
  }
}

profileImage.addEventListener("click", (evt) => {
  openPopup(popupTypeNewAvatar);
});

formNewAvatar.addEventListener("submit", (evt) => {
  evt.preventDefault();
  closePopup(popupTypeNewAvatar);
  console.log("new avatar link", formNewAvatar.link.value);
  fetch(`https://nomoreparties.co/v1/${myCohort}/users/me/avatar`, {
    method: "PATCH",
    headers: {
      authorization: myToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      avatar: formNewAvatar.link.value,
    }),
  })
    .then((data) => data.json())
    .then((data) => {
      window.location.reload();
    });
});
