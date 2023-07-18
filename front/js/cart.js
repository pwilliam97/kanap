// je fais l'appel a l'API
async function afficheCart () {
    const kanapData =  await fetch(`http://localhost:3000/api/products`)
    .then((response) => response.json())
    .catch(function (e) {
      console.log("Une erreur est survenue : " + e);
    });
    //Déclaration de la variable dans laquelle on met les key et les values qui sont dans le Local Storage
    //JSON.parse pour convertir les données aux format JSON qui sont dans le Local Storage en objet Java Script
    let listKanap = JSON.parse(localStorage.getItem("produit"))

    const placeElement = document.querySelector("#cart__items")

    //Si le panier est vide
    if (listKanap === null || listKanap == 0) {
        const panierVide = document.createElement('div')
        panierVide.className ='cart__item'

        const panierVideTxt = document.createElement ('div')
        panierVideTxt.textContent = "Le panier est vide"

        placeElement.appendChild(panierVide)
        panierVide.appendChild(panierVideTxt)
    }

    // SI j'ai quelque chose dans le panier j'affiche les produits du Local Storage
    else {
      // Je déclare un tableau vide

        for (let kanap of listKanap) {
            let kanapInfo = kanapData.find (item => item._id === kanap.idProduit)
          
          // ARTICLE 
            let articleItem = document.createElement ('article')
            articleItem.className = "cart__item"
            articleItem.setAttribute('data-id', kanap.idProduit)
            articleItem.setAttribute('data-color', kanap.colorsProduit)
            placeElement.appendChild(articleItem)
                    
            
          
              // DIV IMAGE 
              const divItemImg = document.createElement ('div')
              divItemImg.className = "cart__item__img"
              articleItem.appendChild(divItemImg)

              const itemImg = document.createElement ('img')              
              divItemImg.appendChild(itemImg) 
              
              const itemSrcAttribute = document.createAttribute('src')
              itemSrcAttribute.value = kanapInfo.imageUrl
              itemImg.setAttributeNode(itemSrcAttribute)

              itemImg.alt = "${kanapInfo.altTxt}"

              
              // DIV CONTENT
              const divItemContent = document.createElement ('div')
              divItemContent.className = "cart__item__content"
              articleItem.appendChild(divItemContent)
              

                  // DIV CONTENT DESCRIPTION 
                    const divContentDescription = document.createElement ('div')
                    divContentDescription.className = "cart__item__content__description"
                    divItemContent.appendChild(divContentDescription)
    
                    const contentTitre = document.createElement('h2')
                    contentTitre.textContent = kanapInfo.name
                    divContentDescription.appendChild(contentTitre)

                    const contentColor = document.createElement('p')
                    contentColor.textContent = kanap.colorsProduit
                    divContentDescription.appendChild(contentColor)

                    const contentPrice = document.createElement('p')
                    contentPrice.textContent = kanapInfo.price
                    divContentDescription.appendChild(contentPrice)

                      const spanEuro = document.createElement('span')
                      spanEuro.textContent = "€"
                      contentPrice.appendChild(spanEuro)

                  // DIV CONTENT SETTINGS
                    const divContentSettings = document.createElement ('div')
                    divContentSettings.className = "cart__item__content__settings"
                    divItemContent.appendChild(divContentSettings)

                      // SETTINGS QUANTITE 
                        const divSettingsQuantite = document.createElement ('div')
                        divSettingsQuantite.className = "cart__item__content__settings__quantity"
                        divContentSettings.appendChild(divSettingsQuantite)
                        
                        const itemSettingsQuantity = document.createElement ('p')
                        itemSettingsQuantity.textContent = "Qté:"
                        divSettingsQuantite.appendChild(itemSettingsQuantity)
                       
                        const itemInput = document.createElement('input')
                        itemInput.className = "itemQuantity"
                        itemInput.setAttribute('type', 'number')
                        itemInput.setAttribute('name', 'itemQuantity')
                        itemInput.setAttribute('min', '1')
                        itemInput.setAttribute('max', '100')
                        itemInput.setAttribute('value', kanap.quantite)         
                        divSettingsQuantite.appendChild(itemInput)

                      // SETTINGS DELETE
                      const divSettingsDelete = document.createElement ('div')
                      divSettingsDelete.className = "cart__item__content__settings__delete"
                      divContentSettings.appendChild(divSettingsDelete)

                      const itemContentDelete = document.createElement ('p')
                      itemContentDelete.className = "deleteItem"
                      itemContentDelete.textContent = "Supprimer"
                      divSettingsDelete.appendChild(itemContentDelete)
                      
        }
        addQuantityListener()
        deleteQuantityListener()
        calculQuantite()
    }

// ---------------------------------------------------------------------- Prix total du panier ------------------------------------------------------- //
  let tableauTotalPriceArticle = []

  let placePriceTotale = document.querySelector("#totalPrice")

  for(let kanap of listKanap) {

    let kanapInfo = kanapData.find (item => item._id === kanap.idProduit)
    //Je recupêre le prix de chaque element du LS
    let totalArticlePanier = kanapInfo.price * kanap.quantite

    //Je push les prix dans le tableau crée au début
    tableauTotalPriceArticle.push(totalArticlePanier)
  }

  if (listKanap === null || listKanap == 0) {
      placePriceTotale.innerHTML = 0
    }

    localStorage.setItem("produit", JSON.stringify(listKanap))

    const reducerQuantite = (accumulator, currentValue) => accumulator + currentValue;
    let totalOfPrice = tableauTotalPriceArticle.reduce(reducerQuantite)

    placePriceTotale.innerHTML = totalOfPrice


}

afficheCart ()



// --------------------------------------------------------- SUPPRESSION ------------------------------------------------------- //

function deleteQuantityListener () {
  const itemDelete = document.querySelectorAll (".deleteItem")
  itemDelete.forEach (p => p.addEventListener ('click', deleteQuantityFromPanier))
}

function deleteQuantityFromPanier (name) {
  let targetDataDelete = name.target.closest ("section > article")
  let listKanap = JSON.parse(localStorage.getItem("produit"))
  let positionItemDelete 
  for (let v = 0; v < listKanap.length; v += 1) {
    if (listKanap[v].idProduit === targetDataDelete.dataset.id && listKanap[v].colorsProduit === targetDataDelete.dataset.color) {
      positionItemDelete = v 
    }
  } 
  listKanap.splice(positionItemDelete, 1)
  localStorage.setItem("produit", JSON.stringify(listKanap))
  alert ("produit supprimé")
  location.reload()
}

//------------------------------------------------------Changement de Quantité --------------------------------------------------------- //

  function addQuantityListener() {
    const itemQuantity = document.querySelectorAll (".itemQuantity")
    itemQuantity.forEach (input => input.addEventListener ('change', updateQuantity))
  }

  function updateQuantity (e) {
    let targetData = e.target.closest("section > article")

      let listKanap = JSON.parse(localStorage.getItem("produit"))
      if (listKanap) {
        for (let kanap of listKanap) {
          if (e.target.value > 0){
            if (kanap.idProduit === targetData.dataset.id && kanap.colorsProduit === targetData.dataset.color) {
              kanap.quantite = parseInt(e.target.value)
            }
          } else {
            alert ("Attention, une quantité est négative ou nulle")
          }

        }
        localStorage.setItem("produit", JSON.stringify(listKanap))
      }
      location.reload()
  }
   

// ------------------------------------------------------------ Quantite Total du Panier ------------------------------------------------------- //

// Je crée un tableau vide pour y stocker tout les quantite

function calculQuantite(){
  let tableauTotalArticle = []
  let placeQuantiteTotale = document.querySelector("#totalQuantity")
  let listKanap = JSON.parse(localStorage.getItem("produit"))

  for(let elem of listKanap) {
    //Je recupêre le prix de chaque element du LS
      let totalArticlePanier = elem.quantite
    //Je push les prix dans le tableau crée au début
      tableauTotalArticle.push(totalArticlePanier)
  }

  localStorage.setItem("produit", JSON.stringify(listKanap))

  const reducerQuantite = (accumulator, currentValue) => accumulator + currentValue;
  let totalOfQuantite = tableauTotalArticle.reduce(reducerQuantite)

  placeQuantiteTotale.innerHTML = totalOfQuantite
}


// ------------------------------------------------------------------- Formulaire --------------------------------------------------------------- //


const btnFormulaire = document.querySelector("#order")

//****PRENOM******/
function controlePrenom() {
  if (new RegExp(/^[a-zA-Z\s,'-]{3,20}$/).test(contact.firstName)) {
    return true;
  }
  else {
    document.querySelector("#firstNameErrorMsg").textContent = "Erreur Prénom invalide"
    return false;
  }
}



   //****NOM******/
   function controleNom() {
    if (new RegExp(/^[a-zA-Z\s,'-]{3,20}$/).test(contact.lastName)) {
      return true;
    }
    else {
      document.querySelector("#lastNameErrorMsg").textContent = "Erreur Nom invalide"
      return false;
    }
  }

  
  //****ADRESSE******/
  function controleAdresse() {
    if (new RegExp(/^[a-zA-Z0-9\s,'-]{3,}$/).test(contact.address)) {
      return true;
    }
    else {
      document.querySelector("#addressErrorMsg").textContent = "Erreur Adresse invalide"
      return false;
    }
  }

  
  //****VILLE******/
  function controleVille() {
    if (new RegExp(/^[a-zA-Z\s,'-]{3,20}$/).test(contact.city)) {
      return true;
    }
    else {
      document.querySelector("#cityErrorMsg").textContent = "Erreur ville invalide"
      return false;
    }
  }


      //****EMAIL******/
   function controleEmail() {
    if (new RegExp(/^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/).test(contact.email)) {
      return true;
    }
    else {
      document.querySelector("#emailErrorMsg").textContent = "Erreur Email invalide"
      return false;
    }
  }   

  let contact = {
    firstName : document.querySelector("#firstName").value,
    lastName : document.querySelector("#lastName").value,
    address : document.querySelector("#address").value,
    city : document.querySelector("#city").value,
    email : document.querySelector("#email").value,
  }


btnFormulaire.addEventListener("click", (event) => {
  event.preventDefault();

  // ------- VALIDATION ------ // 
    controlePrenom();
    controleNom();
    controleAdresse();
    controleVille()
    controleEmail()

  // ---------------------------------- Récupération des valeurs du Local Storage ----------------------------- //

  if( controlePrenom() && controleNom( ) && controleAdresse() && controleVille() && controleEmail()) {
    localStorage.setItem ("contact", JSON.stringify(contact))
  } else {
    alert("Veuillez remplir le formulaire correctement")
    return false
  };
  console.log('ok2')

  let products = []
  let listKanap = localStorage.getItem("produit")
  let listKanapEnvoi = JSON.parse(listKanap)
  for (let elem of listKanapEnvoi ){
    products.push(elem.idProduit)
  }


  let aEnvoyer = {
    contact,
    products
  }
  
  let options = { 
    headers: {"Content-Type":"application/json"},
    method:"POST",
    body:JSON.stringify(aEnvoyer),
  };


  fetch("http://localhost:3000/api/products/order",options)
  .then((reponse) => reponse.json()) 
  .then((reponse2) => {
    let repOrderId = reponse2.orderId;
    localStorage.clear()
    document.location.href = `confirmation.html?orderId=${repOrderId}`
  })
  .catch(function (e) {
    console.log("Une erreur est survenue : " + e);
  });

} 


)



let contactData = JSON.parse(localStorage.getItem("contact"))
function remplissageInput(input) {
  if (typeof contactData !== null || contactData !== 'undefined') {
    document.querySelector(`input`).value =  contactData[input]
  } 
}

document.querySelector("#firstName").setAttribute('value', contactData.firstName)
document.querySelector("#lastName").setAttribute('value',  contactData.lastName)
document.querySelector("#address").setAttribute('value',  contactData.address)
document.querySelector("#city").setAttribute('value',  contactData.city)
document.querySelector("#email").setAttribute('value',  contactData.email)











