const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-12',
  headers: {
    authorization: '90ad5c9a-5357-4276-be02-5ea1b5321bf2',
    'Content-Type': 'application/json'
  }
}

export function deleteCard(cardId, name, description) {
  return fetch(config.baseUrl + `/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      about: description,
    }),
  }).then((data) => data.json());
}

