//*---Script page cart.html---*//

//Récuperer les données du local storage
let products = localStorage.getItem("allEntries");
if (products) {
    products = JSON.parse(products)
   
}
//Insérer un produit et ses détails ajouté au panier
loadCartDOM(products);

function loadCartDOM(products) {
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        document.querySelector("#cart__items").innerHTML +=
            `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                    <div class="cart__item__img">
                      <img src="${product.image}" alt="${product.altTxt}">
                    </div>
                    <div class="cart__item__content">
                      <div class="cart__item__content__description">
                        <h2>${product.name}</h2>
                        <p>${product.color}</p>
                        <p>${product.price}€</p>
                      </div>
                      <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                          <p>Qté :</p>
                          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                          <p class="deleteItem">Supprimer</p>
                        </div>
                      </div>
                    </div>
                  </article>`;
    }
}

/*Supprimer un item du panier et du local storage*/

//Créer un évenement sur le bouton Supprimer
const removeCartItemButton = document.querySelectorAll(".deleteItem");
    console.log(removeCartItemButton);
  for(let i = 0; i < removeCartItemButton.length; i++) {
    let removeButton = removeCartItemButton[i]
    removeButton.addEventListener("click", deleteCartItem); 
//Créer la fonction Supprimer
function deleteCartItem (event) {
  let removeButton = event.target;
  //Supprimer le produit du DOM
  removeButton.closest("article").style.display = "none";
  console.log('clicked')};
  //Chercher le produit à supprimer dans le local storage
  let products = JSON.parse(localStorage.getItem("allEntries"));
  let productId = document.querySelector(".cart__item").dataset.id;
  let productColor = document.querySelector(".cart__item").dataset.color;
    for (let i = 0; i < products.length; i++) {
    const product = products[i];
    if (productId === product.id && productColor === product.color) {
  //Supprimer le produit du local storage
      const num = [i];
      let newBasket = JSON.parse(localStorage.getItem("allEntries"));
      //newBasket.splice(num, 0);
  //Mettre à jour le localstorage
      localStorage.allEntries = JSON.stringify(newBasket);
    }
  } 
   /*console.log(product.id);
    console.log(product.color);
    console.log(productId);
    console.log(productColor);*/
     
  //Mettre à jour le total du panier
  calculateTotal();
  }

function setQuantity(){
    /**
     - Mettre à jour la quantité du produit dans le localStorage
     - Recalculer le total
     */
     calculateTotal();  
}

function calculateTotal(){
//Définir les variables des totaux quantité et prix pour le panier  
  let totalBasket = 0;
  let totalQuantity = 0;
//Faire une boucle pour récupérer toutes les quantités et prix dans le localstorage puis calculer les totaux 
  for (let i = 0; i < products.length; i++) {
    let quantity = products[i].quantity;
    let price = products[i].price;
    totalQuantity += quantity;
    totalBasket += quantity * price;
  }
//Insérer les totaux dans le DOM
  document.querySelector("#totalPrice").innerHTML = totalBasket;
  document.querySelector("#totalQuantity").innerHTML = totalQuantity;
}

