// Script page product.html

/*Récuperer l'id du produit à afficher = récupérer l’id du produit ayant été
cliqué sur la page d’accueil.*/

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const productId = params.get('id');
let product = null;

/*Insérer un produit et ses détails sur la page HTML product*/

//Récuperer les données du produit sur le localhost grace à l'id
fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function(res) {
        return res.json();
    })
    .then(res => {
        product = new Product(res)
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
button.addEventListener("click", addToLocalStorage);

//Créer une fonction callback pr envoyer array au local storage 
function addToLocalStorage() { 
    //Quantité
    let quantityInput = document.querySelector("#quantity"); 
    if(quantityInput) {
        quantityInput = parseInt(quantityInput.value);
    };
    // Créer un message erreur si quantité=0 et sup à 100?
    if(quantityInput < 1 || quantityInput > 100){ 
        alert("Veuillez entrer une quantité comprise entre 1 et 100");
        return
    };
    //Couleur
    let colorInput = document.querySelector("#colors"); 
    //Créer un message erreur si couleur non selectionnée
    if(colorInput.value === '') { 
        alert("Veuillez sélectionner une couleur");
        return
    };
    colorInput = colorInput.value;
    // Créer array du produit avec son ID, qte, couleur, img, nom (pas ds prix ds le localstorage)
    const productJson = {
        id : productId,
        quantity : quantityInput, 
        color: colorInput, 
        image : product.imageUrl,
        name: product.name,
        alt : product.altTxt, 
    };
    //Récuperer les entrées existantes dans le local storage et les convertir en JS pr lecture 
    let existingEntries = JSON.parse(localStorage.getItem("allEntries"));
    //Vérifier que le produit n'est pas déjà ds le local storage avt de l'ajouter
    if (existingEntries == null) {
            existingEntries = [];
        }
    let exists = false;
    for(let i = 0; i < existingEntries.length; i++) {
        if(existingEntries[i].id === productId && existingEntries[i].color === colorInput) {
            existingEntries[i].quantity += quantityInput
            exists = true
        }
    }    
    // Pouvoir ajouter plusieurs produits dans le localstorage 
    if(!exists) {
        existingEntries.push(productJson);
    }
    //Convertir l'objet JS en chaine de caractere Json afin de le stocker ds le localstorage    
    localStorage.setItem("allEntries", JSON.stringify(existingEntries)); 
    // Créer un message d'alerte pr confimer que le produit a été ajouté au panier
    alert("Votre produit a bien été ajouté au panier");      
};


