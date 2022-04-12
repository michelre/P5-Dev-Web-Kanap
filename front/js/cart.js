//*---Script page cart.html---*//

/*---------------------------Affichage Panier-------------------*/

//Récuperer les données du local storage
let products = localStorage.getItem("allEntries");
if (products) {
    products = JSON.parse(products)
   // Gestion asynchrone du chargement des produits et donc du DOM et des évènements
   products = products.map((p) => fetch(`http://localhost:3000/api/products/${p.id}`)
   .then(r => r.json())
   .then((productDetail) => ({...p, price: productDetail.price}))
)
Promise.all(products).then(p => {
   loadCartDOM(p);
   initEvents(p);
   calculateTotal(p)
})
}

//Insérer un produit et ses détails ajouté au panier

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

/*---------------------------Modification Panier-------------------*/

/*Créer des evenements sur le bouton supprimer et le champ de la quantité*/

function initEvents (products){
//Créer un évenement sur le bouton supprimer
const removeCartItemButton = document.querySelectorAll(".deleteItem");
  for(let i = 0; i < removeCartItemButton.length; i++) {
    let removeButton = removeCartItemButton[i];
    removeButton.addEventListener("click", (event) => deleteCartItem(event, products));
  }
//Créer un évenement sur la quantité
const quantityInput = document.querySelectorAll(".itemQuantity");
  for(let i = 0; i < quantityInput.length; i++){
    let newQuantity = quantityInput[i];
    newQuantity.addEventListener("change", (event) => setQuantity(event, products))
  }
}

/*Supprimer un item du panier et du local storage*/

function deleteCartItem (event, products) { 
  //Chercher le produit à supprimer dans le local storage
  const productId = event.target.closest("article").dataset.id;
  const productColor = event.target.closest("article").dataset.color;
  //Supprimer le produit du local storage
  const newBasket = products.filter((product) => !(product.id === productId && product.color === productColor));
  //Mettre à jour le localstorage
  localStorage.setItem("allEntries", JSON.stringify(newBasket));      
  //Supprimer le produit du DOM
  event.target.closest("article").remove();
  alert("Vous êtes sur le point de supprimer cet article de votre panier. Voulez-vous continuer ?");
  //Mettre à jour le total du panier
  calculateTotal(newBasket); 
} 
  
/*Modifier les quantités du panier et du local storage*/

function setQuantity(event, products){
  const newQuantity = event.target.value;
//Condition pour seulement prendre en compte les quantités entre 1 et 100
  if(event.target.value > 0 && event.target.value <101){
    //Récuperer l'id et la couleur du produit actuel
    const article = event.target.closest(".cart__item");
    const articleId = article.dataset.id;
    const articleColor = article.dataset.color;
    //Chercher dans local storage le produit à quantité modifiée
    const look = products.find (
      (product) => product.id === articleId && product.color === articleColor);
    //Remplacer la quantité dans le local storage
    let newQuantityValue = {quantity : newQuantity};
    Object.assign (look, newQuantityValue);
    localStorage.setItem("allEntries", JSON.stringify(products));
    //Recalculer le panier 
    calculateTotal(products);
  } else {
    alert("Veuillez entrer une quantité comprise entre 1 et 100");
  }
}  

/*Calculer la quantité totale et le prix total des articles du panier*/

function calculateTotal(products){
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

/*---------------------------Formulaire Panier-------------------*/


//Création d'un evenement sur le formulaire de commande

const form = document.querySelector(".cart__order__form");
form.addEventListener("submit" , (event) => {
  event.preventDefault()
  resetFields (event)
  if (formValidity (event)) {
    sendOrder(event)
  }
});  

//Fonction pour réinitialiser les champs du formulaire après une mauvaise entrée ou une entrée nulle

function resetFields (event) {
  const firstName = event.target.firstName;
  document.querySelector("#firstNameErrorMsg").textContent = "";
  firstName.style.color = "black";
  const lastName = event.target.lastName;
  document.querySelector("#lastNameErrorMsg").textContent = "";
  lastName.style.color = "black";
  const address = event.target.address;
  document.querySelector("#addressErrorMsg").textContent = "";
  address.style.color = "black";
  const city = event.target.city;
  document.querySelector('#cityErrorMsg').textContent = "";
  city.style.color = "black";
  const email = event.target.email;
  document.querySelector("#emailErrorMsg").textContent = "";
  email.style.color = "black";
}
  

//Fonction de verification de la validité des données du formulaire

function formValidity(event) {
  let formValid = true;
  //Validation Prénom
  const firstName = event.target.firstName;
  const validFirstName = /^([a-zA-ZàâäéèëêîïôöùûüçæœÂÀÄÉÈÊËÎÏÔÖÛÜÙÇÆŒ]{2,})+([-'\s][a-zA-ZàâäéèëêîïôöùûüçæœÂÀÄÉÈÊËÎÏÔÖÛÜÙÇÆŒ]+)?$/;
    //Vérifier si le champ est vide
    if (firstName.validity.valueMissing) {
      event.preventDefault();
      document.querySelector("#firstNameErrorMsg").textContent = "Veuillez entrer votre prénom";
      formValid = false;
    }
    //Vérifier si le champ est valide (Regex)
    else if (validFirstName.test(firstName.value) == false) {
      event.preventDefault();
      document.querySelector("#firstNameErrorMsg").textContent = "Le format de votre prénom n'est pas correct";
      firstName.style.color = "darkorange";
      formValid = false;
    }
  //Validation Nom
  const lastName = event.target.lastName;
  const validLastName = /^([a-zA-ZàâäéèëêîïôöùûüçæœÂÀÄÉÈÊËÎÏÔÖÛÜÙÇÆŒ]{2,})+([-'\s][a-zA-ZàâäéèëêîïôöùûüçæœÂÀÄÉÈÊËÎÏÔÖÛÜÙÇÆŒ]+)?$/;
    //Vérifier si le champ est vide
    if (lastName.validity.valueMissing) {
      event.preventDefault();
      document.querySelector("#lastNameErrorMsg").textContent = "Veuillez entrer votre nom";
      formValid = false;
    }
    //Vérifier si le champ est valide (Regex)
    else if (validLastName.test(lastName.value) == false){
      event.preventDefault();
      document.querySelector("#lastNameErrorMsg").textContent = "Le format de votre nom n'est pas correct";
      lastName.style.color = "darkorange";
      formValid = false;
    }

  //Validation Adresse
  const address = document.querySelector("#address");
  const validAddress = /^[a-zA-Z0-9àâäéèëêîïôöùûüçæœÂÀÄÉÈÊËÎÏÔÖÛÜÙÇÆŒ\s,.'-]{5,}$/;
    //Vérifier si le champ est vide
    if (address.validity.valueMissing) {
      event.preventDefault();
      document.querySelector("#addressErrorMsg").textContent = "Veuillez entrer votre adresse";
      formValid = false;
    }
    //Vérifier si le champ est valide (Regex)
    else if (validAddress.test(address.value) == false){
      event.preventDefault();
      document.querySelector("#addressErrorMsg").textContent = "Le format de votre adresse n'est pas correct";
      address.style.color = "darkorange";
      formValid = false;
    }
 
  //Validation Ville
  const city = document.querySelector("#city");
  const validCity = /^([a-zA-ZàâäéèëêîïôöùûüçæœÂÀÄÉÈÊËÎÏÔÖÛÜÙÇÆŒ]{2,})+([-'\s][a-zA-ZàâäéèëêîïôöùûüçæœÂÀÄÉÈÊËÎÏÔÖÛÜÙÇÆŒ]+[-'\s][a-zA-ZàâäéèëêîïôöùûüçæœÂÀÄÉÈÊËÎÏÔÖÛÜÙÇÆŒ]+)?$/;
    //Vérifier si le champ est vide
    if (city.validity.valueMissing) {
      event.preventDefault();
      document.querySelector("#cityErrorMsg").textContent = "Veuillez entrer votre ville";
      formValid = false;
    }
    //Vérifier si le champ est valide (Regex)
    else if (validCity.test(city.value) == false) {
      event.preventDefault();
      document.querySelector("#cityErrorMsg").textContent = "Le format de votre ville n'est pas correct";
      city.style.color = "darkorange";
      formValid = false;
    }
    
  //Validation Email
  const email = document.querySelector("#email");
  const validEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,5})$/;
    //Vérifier si le champ est vide
    if (email.validity.valueMissing) {
      event.preventDefault();
      document.querySelector("#emailErrorMsg").textContent = "Veuillez entrer votre email";
      formValid = false;
    }
    //Vérifier si le champ est valide (Regex)
    else if (validEmail.test(email.value) == false) {
      event.preventDefault();
      document.querySelector("#emailErrorMsg").textContent = "Le format de votre email n'est pas correct";
      email.style.color = "darkorange";
      formValid = false;
    }
  return formValid;
}

//Fonction pour envoyer la commande

function sendOrder(event){
  //Créer un objet contact
  contact = {
    firstName : document.querySelector("#firstName").value,
    lastName : document.querySelector("#lastName").value,
    address : document.querySelector("#address").value,
    city: document.querySelector("#city").value,
    email : document.querySelector("#email").value,
  }; 
  //Créer un tableau de produit avec les ID du panier
  let basket = JSON.parse(localStorage.getItem("allEntries"));
  let products = [];
  if (basket === null) {
    event.preventDefault(); //ne marche pas, la requete est envoyee avec panier vide
    alert("Votre panier est vide, veuillez y ajouter un produit avant de passer commande.");
  } else {
    for (let item of basket){
      products.push(item.id);       
      }; 
  };
  //Récuperer les données saisies à envoyer au serveur
  const order = {
    contact,
    products,
  };
  //Créer la requête Fetch de type POST
  const promise = fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(order),
  });
  //Pour voir le résultat du serveur, vider le panier et aller la page de confirmation en ayant recuperé le numéro de commande
  promise.then(async(response) =>{
    try{
      const content = await response.json();
      localStorage.clear();
      location.href = `./confirmation.html?orderId=${content.orderId}`;
    }catch(error){
      alert("Une erreur est survenue, veuillez recommencer ultérieurement.");
    }
  })
return
}