export function createCard(
  item,
  funcDelCard,
  funcLikeCard,
  viewImage,
  profileInfo
) {

  const weLikeIt = item.likes.some(likeItem => profileInfo._id == likeItem._id);

  const template = document.querySelector("#card-template").content;
  const htmlItem = template.querySelector(".places__item").cloneNode(true);
  htmlItem.querySelector(".card__title").textContent = item.name;
  htmlItem.setAttribute('id', 'a' + item._id);

  const cardImage = htmlItem.querySelector(".card__image");
  cardImage.src = item.link;
  cardImage.alt = item.name;

  cardImage.addEventListener("click", viewImage);

  const delButton = htmlItem.querySelector(".card__delete-button");

  delButton.addEventListener("click", funcDelCard);

  const likeButton = htmlItem.querySelector(".card__like-button");
  likeButton.addEventListener("click", funcLikeCard);
  likeButton.cardId = item._id;
  if (weLikeIt) {
    likeButton.classList.add('card__like-button_is-active');
  }

  const isCardOwner = item.owner._id === profileInfo._id;
  if (!isCardOwner) {
    delButton.remove();
  } else {
    delButton.cardId = item._id;
  }

  const likeCount = htmlItem.querySelector(".like-count");
  likeCount.textContent = item.likes.length;
 

  return htmlItem;
}

