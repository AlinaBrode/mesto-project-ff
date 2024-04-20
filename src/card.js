export function addCard(item, funcDelCard) {
  const template = document.querySelector("#card-template").content;
  const htmlItem = template.querySelector(".places__item").cloneNode(true);
  htmlItem.querySelector(".card__title").textContent = item.name;

  const cardImage = htmlItem.querySelector(".card__image");
  cardImage.src = item.link;
  cardImage.alt = item.name;

  htmlItem
    .querySelector(".card__delete-button")
    .addEventListener("click", funcDelCard);

  return htmlItem;
}