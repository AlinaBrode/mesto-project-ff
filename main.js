(()=>{"use strict";function e(e,t,n,o,r){var a=e.likes.some((function(e){return r._id==e._id})),i=document.querySelector("#card-template").content.querySelector(".places__item").cloneNode(!0);i.querySelector(".card__title").textContent=e.name;var c=i.querySelector(".card__image");c.src=e.link,c.alt=e.name,c.addEventListener("click",o);var u=i.querySelector(".card__delete-button");u.addEventListener("click",t);var p=i.querySelector(".card__like-button");return p.addEventListener("click",n),p.cardId=e._id,a&&p.classList.add("card__like-button_is-active"),e.owner._id===r._id?u.cardId=e._id:u.remove(),i.querySelector(".like-count").textContent=e.likes.length,i}function t(e){e.classList.add("popup_is-opened"),e.addEventListener("click",r),document.addEventListener("keydown",o)}function n(e){e.classList.remove("popup_is-opened"),e.removeEventListener("click",r),document.removeEventListener("keydown",o)}function o(e){if("Escape"===e.key){var t=document.querySelector(".popup_is-opened");null!==t&&n(t)}}function r(e){e.target.classList.contains("popup_is-opened")&&n(e.target)}function a(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,o=new Array(t);n<t;n++)o[n]=e[n];return o}var i="90ad5c9a-5357-4276-be02-5ea1b5321bf2",c="wff-cohort-12",u=document.querySelector(".profile__add-button"),p=document.querySelector(".profile__edit-button"),l=document.querySelector(".popup_type_edit"),d=document.querySelector(".popup_type_new-card"),s=document.querySelector(".popup_type_new-avatar"),_=document.querySelector(".popup_type_image"),f=document.querySelector(".popup_type_delete-confirm"),m=document.querySelector(".profile__title"),y=document.querySelector(".profile__image"),v=document.querySelector(".profile__description"),h=document.forms["edit-profile"],b=h.querySelector(".submit__button"),S=document.forms["new-place"],q=S.querySelector(".submit__button"),g=document.forms["new-avatar"],E=document.querySelector(".submit__button"),L=document.querySelector(".popup__image"),k=document.querySelector(".popup__caption"),C=document.querySelector(".places__list"),w=document.querySelector(".popup_type_delete-confirm").querySelector(".popup__form"),j=w.querySelector(".popup__button"),x=null,T=null,A=h.querySelector(".popup__input_type_name"),I=h.querySelector(".popup__input_type_name-error"),z=h.querySelector(".popup__button"),O=h.querySelector(".popup__input_type_description"),N=h.querySelector(".popup__input_type_description-error"),D=S.querySelector(".popup__input_type_card-name"),J=S.querySelector(".popup__input_type_name-error"),P=S.querySelector(".popup__button"),H=S.querySelector(".popup__input_type_url"),M=S.querySelector(".popup__input_type_url-error");function U(e){j.cardId=e.target.cardId,t(f)}function $(e){t(_),L.src=e.target.src,L.alt=e.target.alt,k.textContent=e.target.alt}function Z(e,t,n,o,r){t.textContent=r,e.classList.add(o),n.disabled=!0}function B(e,t){e.textContent="",t.disabled=!1}function F(e,t,n,o){var r=e.value;0==r.length?Z(e,t,n,"popup__input-error","Вы пропустили это поле"):r.length<2?Z(e,t,n,"popup__input-error","Минимальное количество символов: 2. Длина текста сейчас: 1 символ."):r.length>o?Z(e,t,n,"popup__input-error","Максимальное количество символов: ".concat(o,". Длина текста в буквах сейчас: ").concat(r.length,".")):/^[A-Za-zА-Яа-яёЁ\s\-]+$/.test(r)?B(t,n):Z(e,t,n,"popup__input-error","Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы")}function G(){F(A,I,z,20)}function K(){H.validity.typeMismatch?Z(H,M,P,"popup__input-error","Введите адрес сайта"):B(M,P)}w.addEventListener("submit",(function(e){e.preventDefault(),fetch("https://nomoreparties.co/v1/".concat(c,"/cards/").concat(j.cardId),{method:"DELETE",headers:{authorization:i,"Content-Type":"application/json"},body:JSON.stringify({name:h.name.value,about:h.description.value})}).then((function(e){return e.json()})).then((function(e){window.location.reload()}))})),h.addEventListener("submit",(function(e){e.preventDefault(),b.textContent="Сохрюнение...",console.log("profile form submit",b),fetch("https://nomoreparties.co/v1/".concat(c,"/users/me"),{method:"PATCH",headers:{authorization:i,"Content-Type":"application/json"},body:JSON.stringify({name:h.name.value,about:h.description.value})}).then((function(e){return e.json()})).then((function(e){m.textContent=e.name,v.textContent=e.about})).finally((function(){b.textContent="сОХРЯНЕНИЕ..."})),n(l)})),S.addEventListener("submit",(function(t){t.preventDefault();var o=S["place-name"].value,r=S.link.value;S["place-name"].value="",S.link.value="",K(),q.textContent="Сохрагниение...",fetch("https://nomoreparties.co/v1/".concat(c,"/cards"),{method:"POST",headers:{authorization:i,"Content-Type":"application/json"},body:JSON.stringify({name:o,link:r})}).then((function(e){return e.json()})).then((function(t){var o=e(t,U,V,$,x);C.prepend(o),n(d)})).finally((function(){q.textContent="сОХРЯНЕНИЕ..."}))})),u.addEventListener("click",(function(e){t(d)})),p.addEventListener("click",(function(e){h.name.value=m.textContent,h.description.value=v.textContent,G(),t(l)})),document.querySelectorAll(".popup__close").forEach((function(e){var t=e.closest(".popup");e.addEventListener("click",(function(){return n(t)}))})),A.addEventListener("input",G),O.addEventListener("input",(function(){F(O,N,z,200)})),D.addEventListener("input",(function(){F(D,J,P,20)})),H.addEventListener("input",K);var Q=fetch("https://nomoreparties.co/v1/wff-cohort-12/users/me",{headers:{authorization:"90ad5c9a-5357-4276-be02-5ea1b5321bf2"}}).then((function(e){return e.json()})).then((function(e){x=e,m.textContent=e.name,v.textContent=e.about,y.style.backgroundImage="url('".concat(e.avatar,"')")})),R=fetch("https://nomoreparties.co/v1/".concat(c,"/cards"),{headers:{authorization:i}}).then((function(e){return e.json()})).then((function(e){T=e}));function V(e){e.target.classList.contains("card__like-button_is-active")?fetch("https://nomoreparties.co/v1/".concat(c,"/cards/likes/").concat(e.target.cardId),{method:"DELETE",headers:{authorization:i,"Content-Type":"application/json"},body:JSON.stringify({name:h.name.value,about:h.description.value})}).then((function(e){return e.json()})).then((function(e){window.location.reload()})):fetch("https://nomoreparties.co/v1/".concat(c,"/cards/likes/").concat(e.target.cardId),{method:"PUT",headers:{authorization:i,"Content-Type":"application/json"},body:JSON.stringify({name:h.name.value,about:h.description.value})}).then((function(e){return e.json()})).then((function(e){window.location.reload()}))}Promise.all([Q,R]).then((function(){var t;C.append.apply(C,function(e){if(Array.isArray(e))return a(e)}(t=T.map((function(t){return e(t,U,V,$,x)})))||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(t)||function(e,t){if(e){if("string"==typeof e)return a(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?a(e,t):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}())})),y.addEventListener("click",(function(e){t(s)})),g.addEventListener("submit",(function(e){e.preventDefault(),n(s),E.textContent="Сохрюнение...",fetch("https://nomoreparties.co/v1/".concat(c,"/users/me/avatar"),{method:"PATCH",headers:{authorization:i,"Content-Type":"application/json"},body:JSON.stringify({avatar:g.link.value})}).then((function(e){return e.json()})).then((function(e){window.location.reload()})).finally((function(){E.textContent="сОХРЯНЕНИЕ..."}))}))})();