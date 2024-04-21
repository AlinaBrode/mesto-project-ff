export function addCard(item, funcDelCard, funcLikeCard, viewImage) {
  const template = document.querySelector("#card-template").content;
  const htmlItem = template.querySelector(".places__item").cloneNode(true);
  htmlItem.querySelector(".card__title").textContent = item.name;

  const cardImage = htmlItem.querySelector(".card__image");
  cardImage.src = item.link;
  cardImage.alt = item.name;

  cardImage.addEventListener('click',viewImage);

  htmlItem
    .querySelector(".card__delete-button")
    .addEventListener("click", funcDelCard);

  const likeButton = htmlItem.querySelector('.card__like-button');
  likeButton.addEventListener('click',funcLikeCard);
  

  return htmlItem;
}

export function delCard(event) {
  event.target.closest(".places__item").remove();
}

export function likeCard(event) {
  event.target.classList.toggle("card__like-button_is-active");
}