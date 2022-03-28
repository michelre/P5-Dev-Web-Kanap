// Script page product.html

/*Récuperer l'id du produit à afficher = récupérer l’id du produit ayant été
cliqué sur la page d’accueil.*/

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const productId = params.get('id');

/*Insérer un produit et ses détails sur la page HTML product*/

fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function(res) {
        return res.json();
    })
    .then(res => {
        const product = new Product(res)
        loadProductDOM(product)
    })

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

let addToCartButton = document.querySelector("#addToCart")
for (let i = 0; i < addToCartButton.length; i++){
    let button = addToCartButton[i]
    button.addEventListener("click", addToCartClicked())
}

function addToCartClicked(event) {
    let button = event.target
}