// Script de la page product.html
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const productId = params.get('id');

fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function(res) {
        return res.json();
    })
    .then(res => {
        const product = new Product(res)
        loadProductDOM(product)
    })

function loadProductDOM(product){
    document.querySelector('.item__content__description').innerHTML += product.name
    /*
    Opérations de mise à jour du DOM:
    - Description
    - Prix
    - Couleurs
     */
}


/*async function getProduct(){
    let productData = await fetch(`http://localhost:3000/api/products/${productId}`)
    productData = await productData.json()
    const product = new Product(productData)
    document.querySelector('.item__content__description').innerHTML = product.name
}

getProduct();*/
