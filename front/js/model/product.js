/**Representation du format d'un produit */
class Product{
    constructor(jsonProducts){
        //jsonProducts && Object.assign(this, jsonProducts);
        this.id = jsonProducts._id;
        this.name = jsonProducts.name;
        this.price = jsonProducts.price;
        this.imageUrl = jsonProducts.imageUrl;
        this.description = jsonProducts.description;
        this.altTxt = jsonProducts.altTxt;
        this.colors = jsonProducts.colors;
    }
}
