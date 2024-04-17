console.log('Hello, World!');
const numbers = [2, 3, 5];

// Стрелочная функция. Не запнётся ли на ней Internet Explorer?
const doubledNumbers = numbers.map(number => number * 2);

console.log(doubledNumbers); // 4, 6, 10

import jordanImage from './images/card_1.jpg';
import jamesImage from './images/card_2.jpg';
import bryantImage from './images/card_3.jpg';
import './pages/index.css';

import {initialCards} from './cards.js';

const whoIsTheGoat = [
  // меняем исходные пути на переменные
  { name: 'Michael Jordan', link: jordanImage },
  { name: 'Lebron James', link: jamesImage },
  { name: 'Kobe Bryant', link: bryantImage },
]; 

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

