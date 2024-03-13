// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

function delCard(event) {
  event.target.closest('.places__item').remove();
}

function addCard(item, funcDelCard) {
  const template = document.querySelector('#card-template').content;
  const htmlItem = template.querySelector('.places__item').cloneNode(true);
  htmlItem.querySelector('.card__title').textContent=item.name;

  const cardImage = htmlItem.querySelector('.card__image');
  cardImage.src = item.link;
  cardImage.alt = item.name;

  htmlItem.querySelector('.card__delete-button').addEventListener('click', funcDelCard);

  return htmlItem;
}

document.querySelector('.places__list').append(...initialCards.map(descr => addCard(descr, delCard)));

