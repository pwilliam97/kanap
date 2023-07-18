let classItem = document.querySelector(".items");



async function fillProducts() {
    await fetch('http://localhost:3000/api/products')
        .then((response) => response.json())
        .then((responseApiKanap) => { displayKanap(responseApiKanap) })
        .catch(function (e) {
            console.log("Une erreur est survenue : " + e);
          });
}

function displayKanap(arr) {
    for (let elem of arr) {
        let linkApi = document.createElement("a")
        
        linkApi.href = `product.html?_id=${elem._id}`
        classItem.appendChild(linkApi)

        let articleApi = document.createElement("article")
        linkApi.appendChild(articleApi)

        let imgApi = document.createElement("img")
        let srcAttribute = document.createAttribute("src")
        srcAttribute.value = elem.imageUrl
        imgApi.setAttributeNode(srcAttribute)
        let altAttribute = document.createAttribute("alt")
        altAttribute.value = elem.altTxt
        imgApi.setAttributeNode(altAttribute)
        articleApi.appendChild(imgApi)

        let titleApi = document.createElement("h3")
        titleApi.innerHTML = elem.name
        articleApi.appendChild(titleApi)

        let textApi = document.createElement("p")
        textApi.innerHTML = elem.description 
        articleApi.appendChild(textApi)

        let classProductName = document.createAttribute("class")
        classProductName.value = "productName"
        titleApi.setAttributeNode(classProductName)

        let classProductDescription = document.createAttribute("class")
        classProductDescription.value = "productDescription"
        textApi.setAttributeNode(classProductDescription)
    }
}

fillProducts()
