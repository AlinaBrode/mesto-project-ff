export function addCard(
  item,
  funcDelCard,
  funcLikeCard,
  viewImage,
  profileInfo
) {
  const template = document.querySelector("#card-template").content;
  const htmlItem = template.querySelector(".places__item").cloneNode(true);
  htmlItem.querySelector(".card__title").textContent = item.name;

  const cardImage = htmlItem.querySelector(".card__image");
  cardImage.src = item.link;
  cardImage.alt = item.name;

  cardImage.addEventListener("click", viewImage);

  const delButton = htmlItem.querySelector(".card__delete-button");

  delButton.addEventListener("click", funcDelCard);

  const likeButton = htmlItem.querySelector(".card__like-button");
  likeButton.addEventListener("click", funcLikeCard);
  const isCardOwner = item.owner._id === profileInfo._id;
  if (!isCardOwner) {
    delButton.remove();
  } else {
    delButton.cardId = item._id;
  }

  likeButton.disabled = isCardOwner;

  const likeCount = htmlItem.querySelector(".like-count");
  likeCount.textContent = item.likes.length.toString();
 

  return htmlItem;
}

export function likeCard(event) {
  event.target.classList.toggle("card__like-button_is-active");
}
