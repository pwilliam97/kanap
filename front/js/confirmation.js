const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString); //Créer une variable qui recupere les parametres d'url
const getId = urlParams.get("orderId");

let placeOrderId = document.getElementById("orderId")
placeOrderId.innerHTML = getId
