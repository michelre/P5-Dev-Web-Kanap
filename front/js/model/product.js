/**Representation du format d'un produit */
class Product{
    constructor(jsonProducts){
        this.id = jsonProducts._id;
        this.name = jsonProducts.name;
        this.colors = jsonProducts.colors;
        this.price = jsonProducts.price;
        this.imageUrl = jsonProducts.imageUrl;
        this.description = jsonProducts.description;
        this.altTxt = jsonProducts.altTxt;
    }
}