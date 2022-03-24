/**Representation du format d'un produit */
class Product{
    constructor(jsonProducts){
        jsonProducts && Object.assign(this, jsonProducts);
    }
}