const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString); //Créer une variable qui recupere les parametres d'url
const getId = urlParams.get("_id");


async function fillProducts() {
  await fetch(`http://localhost:3000/api/products/${getId}`)
    .then((response) => response.json())
    .then((responseApiKanap) => productKanap(responseApiKanap))
    .catch(function (e) {
      console.log("Une erreur est survenue : " + e);
    });
}

function productKanap(kanap) {
  const classitemImg = document.querySelector(".item__img");
  let imgApi = document.createElement("img")
  let srcAttribute = document.createAttribute("src")
  srcAttribute.value = kanap.imageUrl
  imgApi.setAttributeNode(srcAttribute)
  let altAttribute = document.createAttribute("alt")
  altAttribute.value = kanap.altTxt
  imgApi.setAttributeNode(altAttribute)
  classitemImg.appendChild(imgApi)

  const idTitle = document.querySelector("#title")
  let titleApi = document.createElement("h1")
  titleApi.innerHTML = kanap.name
  idTitle.appendChild(titleApi)

  const idPrice = document.querySelector("#price")
  let priceApi = document.createElement ("span")
  priceApi.innerHTML = kanap.price
  idPrice.appendChild(priceApi)

  const idDescription = document.querySelector("#description")
  let textApi = document.createElement("p")
  textApi.innerHTML = kanap.description
  idDescription.appendChild(textApi)

  const select = document.querySelector("#colors")
  for( let elem of kanap.colors) {
    let optionColors = document.createElement ("option")
    optionColors.value = elem
    optionColors.innerText = elem
    select.appendChild(optionColors)
  }
  

  //------Récupération de la couleur choisit 


  //Selection du bouton d'envoi au panier
  const btn_ajout = document.querySelector("#addToCart")
  
  //Ecouter le bouton et envoyer 
  btn_ajout.addEventListener("click", (event) => {
    event.preventDefault()

  //Sélection de l'Id HTML
    const idColorChoice = document.querySelector ("#colors")
    const quantity = document.getElementById ("quantity")
  //Mettre le choix dans une variable
    const colorChoice = idColorChoice.value;
    const quantityChoice = parseInt(quantity.value);


    
  //Récupération des valeurs
    let optionProduit = {
      quantite: quantityChoice,
      idProduit: kanap._id,
      colorsProduit: colorChoice,
    }


  //------- Envoi des donées au Local Storage 
      
    //Déclaration de la variable dans laquelle on met les key et les values qui sont dans le Local Storage
    let listKanap = JSON.parse(localStorage.getItem("produit"))
    //JSON.parse pour convertir les données aux format JSON qui sont dans le Local Storage en objet Java Script

    //Si il y a déja des produits enregistré dans le Local Storage
    if(quantityChoice > 0){
      if (listKanap) {
        let ifKanapExist = false
        listKanap.forEach ((kanap, index) => {      
          if (kanap.idProduit === optionProduit.idProduit && kanap.colorsProduit === optionProduit.colorsProduit) {
            listKanap[index].quantite = listKanap[index].quantite + optionProduit.quantite 
            ifKanapExist = true
          }
        })
        if (ifKanapExist === false) {
          listKanap.push(optionProduit)
        }
        localStorage.setItem("produit", JSON.stringify(listKanap))
      } 
      //Si il n'y a pas déja des produits enregistré dans le Local Storage
      else {
        listKanap = []
        listKanap.push(optionProduit)
        localStorage.setItem("produit", JSON.stringify(listKanap))

      }
      alert ("produit ajouté")
      window.location.href = "index.html"
    } else {
      alert("Attention, quantité négative ou nul")
    }

  })
}



fillProducts()

