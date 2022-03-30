//*---Script page cart.html---*//

//Récuperer les données du local storage
let productStorage = localStorage.getItem("obj");
let productJson = JSON.parse(productStorage);
for( let i = 0; i < localStorage.length; i++){
  localStorage.key(i);
}
console.log(productJson);
console.log(productStorage);
console.log(localStorage.length);

/*Récuperer l'id du produit à afficher = récupérer l’id du produit ayant été
ajouté au panier.*/

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const productId = params.get('id');

/*Insérer un produit et ses détails ajouté au panier*/

fetch(`http://localhost:3000/api/products/${productJson.id}`)
    .then(function(res) {
        return res.json();
    })
    .then(res => {
        const product = new Product(res);
        loadCartDOM(product);
    })

function loadCartDOM(product){
    document.querySelector("#cart__items").innerHTML +=
    `<article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
                <div class="cart__item__img">
                  <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${productJson.color}</p>
                    <p>${product.price}€</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté :</p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productJson.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
    }
/* Activer le boutton Supprimer*/

const removeCartItemButton = document.querySelector(".deleteItem");
if (removeCartItemButton) {
  removeCartItemButton.addEventListener("click" , deleteCartItem());
}

function deleteCartItem() {
  const cartItems = document.querySelector("#cart__items");
  cartItems.delete();
  console.log(deleteCartItem); //ne marche pas
}