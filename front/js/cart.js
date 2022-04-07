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

/*---Supprimer un item du panier et du local storage---*/

//Créer un évenement sur le bouton 
const removeCartItemButton = document.querySelectorAll(".deleteItem");
  for(let i = 0; i < removeCartItemButton.length; i++) {
    let removeButton = removeCartItemButton[i];
    removeButton.addEventListener("click", deleteCartItem)}; 
//Créer la fonction Supprimer
function deleteCartItem (event) { 
  //Chercher le produit à supprimer dans le local storage
  const productId = document.querySelector(".cart__item").dataset.id;
  const productColor = document.querySelector(".cart__item").dataset.color;
  const newBasket = JSON.parse(localStorage.getItem("allEntries"));
  newBasket.find (
    (products) => products.id === productId && products.color === productColor);
  //Supprimer le produit du local storage
      const num = [0];      
      newBasket.splice(num, 1);
  //Mettre à jour le localstorage
      localStorage.removeItem("allEntries");
      localStorage.setItem("allEntries", JSON.stringify(newBasket));
  //Supprimer le produit du DOM
  const removeButton = event.target;
  removeButton.closest("article").style.display = "none";
  alert("Vous êtes sur le point de supprimer cet article de votre panier. Voulez-vous continuer ?");
  //Mettre à jour le total du panier *******Ne se déclenche pas******
  calculateTotal();
  location.reload();
} calculateTotal();
  
/*---Modifier les quantités du panier et du local storage---*/

//Créer un évenement sur la quantité
const quantityInput = document.querySelectorAll(".itemQuantity");
  for(let i = 0; i < quantityInput.length; i++){
    let newQuantity = quantityInput[i];
    newQuantity.addEventListener("change", setQuantity);}
//Créer la fonction pour mettre à jour la quantité
function setQuantity(event){
  const newQuantity = event.target.value;
//Condition pour seulement prendre en compte les quantités entre 1 et 100
  if(event.target.value > 0 && event.target.value <101){
    //Récuperer l'id et la couleur du produit actuel
    const article = event.target.closest(".cart__item");
    const articleId = article.dataset.id;
    const articleColor = article.dataset.color;
    //Chercher dans local storage le produit à quantité modifiée
    const newBasket = JSON.parse(localStorage.getItem("allEntries"));
    const look = newBasket.find (
      (products) => products.id === articleId && products.color === articleColor);
    //Remplacer la quantité dans le local storage
    let newQuantityValue = {quantity : newQuantity};
    Object.assign (look, newQuantityValue);
    localStorage.removeItem("allEntries");
    localStorage.setItem("allEntries", JSON.stringify(newBasket));
  }
//Recalculer le panier *******Ne se déclenche pas******
calculateTotal();
location.reload();
} calculateTotal();


/*---Calculer la quantité totale et le prix total des articles du panier---*/

function calculateTotal(){
//Définir les variables des totaux quantité et prix pour le panier  
  let totalBasket = 0;
  let totalQuantity = 0;
//Faire une boucle pour récupérer toutes les quantités et prix dans le localstorage puis calculer les totaux 
  for (let i = 0; i < products.length; i++) {
    let quantity = products[i].quantity; 
    let price = products[i].price; 
    totalQuantity += parseInt(quantity); 
    totalBasket += quantity * price; 
  }
//Insérer les totaux dans le DOM
  document.querySelector("#totalPrice").innerHTML = totalBasket;
  document.querySelector("#totalQuantity").innerHTML = totalQuantity;
}

