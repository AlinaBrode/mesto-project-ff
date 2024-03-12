// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

function addCard(item, delCard) {
  const template = document.querySelector('#card-template').content;
  let htmlItem = template.querySelector('.places__item').cloneNode(true);
  htmlItem.querySelector('.card__title').textContent=item.name;
  htmlItem.querySelector('.card__image').src=item.link;
  return htmlItem;
}


document.querySelector('.places__list').append(...initialCards.map(addCard));
