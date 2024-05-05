export function deleteCard(myCohort, cardId, name, description, myToken) {
  return fetch(`https://nomoreparties.co/v1/${myCohort}/cards/${cardId}`, {
    method: "DELETE",
    headers: {
      authorization: myToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      about: description,
    }),
  }).then((data) => data.json());
}

