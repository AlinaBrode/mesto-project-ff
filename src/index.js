console.log("Hello, World!");
const numbers = [2, 3, 5];

// Стрелочная функция. Не запнётся ли на ней Internet Explorer?
const doubledNumbers = numbers.map((number) => number * 2);

console.log(doubledNumbers); // 4, 6, 10

import jordanImage from "./images/card_1.jpg";
import jamesImage from "./images/card_2.jpg";
import bryantImage from "./images/card_3.jpg";
import logoImage from "./images/logo.svg";
import "./pages/index.css";

import { initialCards } from "./cards.js";
import { addCard } from "./card.js";
import { openModal, closeModal } from "./modal.js";

const whoIsTheGoat = [
  // меняем исходные пути на переменные
  { name: "Michael Jordan", link: jordanImage },
  { name: "Lebron James", link: jamesImage },
  { name: "Kobe Bryant", link: bryantImage },
];

function delCard(event) {
  event.target.closest(".places__item").remove();
}

document
  .querySelector(".places__list")
  .append(...initialCards.map((descr) => addCard(descr, delCard)));

const addButton = document.querySelector(".profile__add-button");
const editButton = document.querySelector(".profile__edit-button");
const dialogNewCard = document.querySelector(".popup_type_new-card");
const dialogEditCard = document.querySelector(".popup_type_edit");
const pageContent = document.querySelector(".page__content");
const popupTypeEdit = document.querySelector(".popup_type_edit");
const popupTypeNewCard = document.querySelector(".popup_type_new-card");
const popupTypeImage = document.querySelector(".popup_type_image");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const formEditProfile = document.forms["edit-profile"];
const formAddCard = document.forms["new-place"];

function handleFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = document.forms["edit-profile"].name.value;
  profileDescription.textContent =
    document.forms["edit-profile"].description.value;
  dialogEditCard.classList.remove("popup_is-opened");
}

function handleAddCard(evt) {
  evt.preventDefault();
  const cardTitle = document.forms["new-place"]["place-name"].value;
  const cardLink = document.forms["new-place"].link.value;
  document.forms["new-place"]["place-name"].value = '';
  document.forms["new-place"].link.value = '';
  const newCard = addCard(
    {
      name: cardTitle,
      link: cardLink,
    },
    delCard
  );
  document
  .querySelector(".places__list").prepend(newCard);
  dialogNewCard.classList.remove("popup_is-opened");
}

formEditProfile.addEventListener("submit", handleFormSubmit);
formAddCard.addEventListener("submit", handleAddCard);

function openDialogEditProfile(evt) {
  document.forms["edit-profile"].name.value = profileTitle.textContent;
  document.forms["edit-profile"].description.value =
    profileDescription.textContent;

  if (
    evt.target.classList.contains("profile__add-button") ||
    evt.target.classList.contains("profile__edit-button")
  ) {
    evt.stopPropagation();
    console.log("propagation is stopped");
  }
  dialogEditCard.classList.add("popup_is-opened");
}

function openDialogNewCard(evt) {
  if (
    evt.target.classList.contains("profile__add-button") ||
    evt.target.classList.contains("profile__edit-button")
  ) {
    evt.stopPropagation();
    console.log("propagation is stopped");
  }
  dialogNewCard.classList.add("popup_is-opened");
}

addButton.addEventListener("click", openDialogNewCard);
editButton.addEventListener("click", openDialogEditProfile);

function closePopup(evt) {
  if (evt.target.classList.contains("popup__close")) {
    evt.target.parentNode.parentNode.classList.remove("popup_is-opened");
  }
}

function closePopupEsc(evt) {
  if (evt.key === "Escape") {
    popupTypeEdit.classList.remove("popup_is-opened");
    popupTypeNewCard.classList.remove("popup_is-opened");
    popupTypeImage.classList.remove("popup_is-opened");
  }
}

pageContent.addEventListener("click", closePopup);
document.addEventListener("keydown", closePopupEsc);

document.addEventListener("click", function (evt) {
  let allPopups = document.querySelectorAll(".popup__content");
  console.log("overlay click found");
  for (let currentPopup of allPopups) {
    console.log(
      "current popup",
      currentPopup,
      currentPopup.contains(evt.target)
    );
    if (
      currentPopup.parentNode.classList.contains("popup_is-opened") &&
      !currentPopup.contains(evt.target)
    ) {
      currentPopup.parentNode.classList.remove("popup_is-opened");
      console.log("we removed it");
    }
  }
});
