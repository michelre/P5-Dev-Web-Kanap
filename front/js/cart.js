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
            `<article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
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

function deleteCartItem() {
    /**
     - Supprimer l'article du localStorage
     - Supprimer l'article du DOM
     - Recalculer le total
     */
    const cartItems = document.querySelector("#cart__items");
    cartItems.delete();
}

function setQuantity(){
    /**
     - Mettre à jour la quantité du produit dans le localStorage
     - Recalculer le total
     */
}

function calculateTotal(){
    /**
     * Faire la somme des produits du localStorage (quantité * prix unitaire)
     */
}

/* Activer le boutton Supprimer*///ne marche pas

const removeCartItemButton = document.querySelector(".deleteItem");
if (removeCartItemButton) {
    removeCartItemButton.addEventListener("click", deleteCartItem);

}


/**
 * TODO:
 * Permettre la modification des quantités
 * Permettre la suppression d'un produit
 * Afficher le prix total du panier
 */