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

/*Supprimer un item du panier et du local storage*/
function initEvents(products){
    //Créer un évenement sur le bouton
    const removeCartItemButton = document.querySelectorAll(".deleteItem");
    for (let i = 0; i < removeCartItemButton.length; i++) {
        let removeButton = removeCartItemButton[i];
        removeButton.addEventListener("click", (event) => deleteCartItem(event, products))
    }

    /*Modifier les quantités du panier et du local storage*/
    //Créer un évenement sur la quantité
    const quantityInput = document.querySelectorAll(".itemQuantity");
    for (let i = 0; i < quantityInput.length; i++) {
        let newQuantity = quantityInput[i];
        newQuantity.addEventListener("change", (event) => setQuantity(event, products));
    }

}

//Créer la fonction Supprimer
function deleteCartItem(event, products) {
    //Chercher le produit à supprimer dans le local storage
    const productId = event.target.closest('article').dataset.id;
    const productColor = event.target.closest('article').dataset.color;

    const newBasket = products.filter((product) => !(product.id === productId && product.color === productColor))
    localStorage.setItem("allEntries", JSON.stringify(newBasket))

    //Supprimer le produit du DOM
    event.target.closest("article").remove()
    alert("Vous êtes sur le point de supprimer cet article de votre panier. Voulez-vous continuer ?");
    //Mettre à jour le total du panier *******Ne se déclenche pas******
    calculateTotal(newBasket);
}


//Créer la fonction pour mettre à jour la quantité
function setQuantity(event, products) {
    const newQuantity = event.target.value;
//Condition pour seulement prendre en compte les quantités entre 1 et 100
    if (event.target.value > 0 && event.target.value < 101) {
        //Récuperer l'id et la couleur du produit actuel
        const article = event.target.closest(".cart__item");
        const articleId = article.dataset.id;
        const articleColor = article.dataset.color;
        //Chercher dans local storage le produit à quantité modifiée
        const look = products.find(
            (product) => product.id === articleId && product.color === articleColor);
        //Remplacer la quantité dans le local storage
        let newQuantityValue = {quantity: newQuantity};
        Object.assign(look, newQuantityValue);
        localStorage.setItem("allEntries", JSON.stringify(products));
        calculateTotal(products);
    }
}


/*Calculer la quantité totale et le prix total des articles du panier*/

function calculateTotal(products) {
    console.log(products)
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


//Création d'un evenement sur le bouton de commande
const form = document.querySelector(".cart__order__form");
form.addEventListener("submit", (event) => {
    event.preventDefault()
    resetFields(event)
    if(formValidity(event)){
        sendOrder()
    }
});

function resetFields(event){
    const firstName = event.target.firstName;
    document.querySelector("#firstNameErrorMsg").textContent = "";
    firstName.style.color = "black";

    //TODO: Reset tous les champs

}

//Fonction de verification de la validité des données du formulaire
function formValidity(event) {
    //Validation Prénom
    let formValid = true;
    const firstName = event.target.firstName;
    const validFirstName = /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/;
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
    const lastName = document.querySelector("#lastName");
    //Vérifier si le champ est vide
    if (lastName.validity.valueMissing) {
        event.preventDefault();
        document.querySelector("#lastNameErrorMsg").textContent = "Veuillez entrer votre nom";
        formValid = false;
    }
    //Vérifier si le champ est valide (Regex)

    //Validation Adresse
    const address = document.querySelector("#address");
    //Vérifier si le champ est vide
    if (address.validity.valueMissing) {
        event.preventDefault();
        document.querySelector("#addressErrorMsg").textContent = "Veuillez entrer votre adresse";
        formValid = false;
    }
    //Vérifier si le champ est valide (Regex)

    //Validation Ville
    const city = document.querySelector("#city");
    //Vérifier si le champ est vide
    if (city.validity.valueMissing) {
        event.preventDefault();
        document.querySelector("#cityErrorMsg").textContent = "Veuillez entrer votre ville";
        formValid = false;
    }
    //Vérifier si le champ est valide (Regex)

    //Validation Email
    const email = document.querySelector("#email");
    //Vérifier si le champ est vide
    if (email.validity.valueMissing) {
        event.preventDefault();
        document.querySelector("#emailErrorMsg").textContent = "Veuillez entrer votre email";
        formValid = false;
    }
    //Vérifier si le champ est valide (Regex)

    return formValid;
}

function sendOrder(){
    // TODO fetch de type POST pour envoyer la commande
    console.log('sendOrder')
}
