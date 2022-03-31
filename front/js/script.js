// Script page index.html

/* Importer les produits sur la page index.html */

fetch("http://localhost:3000/api/products")
    .then( data => data.json())
    .then( jsonListProducts => {
        for(let jsonProducts of jsonListProducts){
            let product = new Product(jsonProducts);
            document.querySelector(".items").innerHTML += 
                `<a href="./product.html?id=${product.id}">
                    <article>
                        <img src="${product.imageUrl}" alt="${product.altTxt}">
                        <h3 class="productName">${product.name}</h3>
                        <p class="productDescription">${product.description}</p>
                    </article>
                </a>`
        }
    })