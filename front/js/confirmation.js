//*---Script page confirmation.html---*//

//Récuperer le numéro de commande
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const orderId = params.get('orderId');

//Insérer le numéro de commande dans le DOM
document.querySelector("#orderId").innerText = orderId;