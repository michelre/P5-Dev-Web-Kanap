// Script page product.html

/*Récuperer l'id du produit à afficher = récupérer l’id du produit ayant été
cliqué sur la page d’accueil.*/

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const productId = params.get('id');

/*Insérer un produit et ses détails sur la page HTML product*/

//Récuperer les données du produit sur le localhost grace à l'id
fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function(res) {
        return res.json();
    })
    .then(res => {
        const product = new Product(res)
        loadProductDOM(product)
    })
//Remplir le HTML avec les données récupérées
function loadProductDOM(product){
    document.querySelector('.item__content__description').innerHTML += product.description
    document.querySelector(".item__img").innerHTML += 
        `<div class="item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
        </div>`
    document.querySelector("#title").innerHTML += product.name
    document.querySelector("#price").innerHTML += product.price
    for(let colors of product.colors){
        document.querySelector("#colors").innerHTML += 
        `<option value="${colors}">${colors}</option>`
    }
}

/*Ajouter le produit au panier quand on clique sur le bouton*/

// Créer un evenement sur le bouton ajouter au panier
const button = document.querySelector("#addToCart");
button.addEventListener("click", addToLocalStorage());

//Créer une fonction callback pr envoyer array au local storage 
function addToLocalStorage(){ 
    // créer array du produit avec son ID, qte et couleur
    const quantityInput = document.querySelector("#quantity"); // Créer un message erreur si quantité=0 et sup à 100
    if(quantityInput) {document.querySelector("#quantity").value;}
    //if(quantityInput < 1 && quantityInput >100) {alert("Merci d'entrer une quantité comprise entre 1 et 100")};
    const colorInput = document.querySelector("#color"); //Créer un message erreur si couleur non selectionnée
    if(colorInput) {document.querySelector("#color").value;}
    const productJson = {
        id : productId,
        quantity : quantityInput, //ne marche pas
        color: colorInput,  //ne marche pas
    };
    //Convertir en Json pour garder l'array dans le localstorage
    let productStorage = JSON.stringify(productJson);
    localStorage.setItem("obj", productStorage);
    //Pouvoir ajouter plusieurs produits dans le localstorage **ne marche pas**
    let existingEntries = JSON.parse(localStorage.getItem("allEntries"));
        if(existingEntries == null) existingEntries = [];
    existingEntries.push(productJson);
    localStorage.setItem("allEntries", JSON.stringify(existingEntries)); 
    // Créer un message d'alerte pr confimer que le produit a été ajouté au panier
    //alert("Votre produit a bien été ajouté au panier");       

    //Vérifier que le produit n'est pas déjà ds le local storage avt de l'ajouter, si m prod m couleur; seulement chger la qté
    
    console.log(quantityInput);
    console.log(colorInput);
    console.log(productJson);
    console.log(localStorage.length);
};


