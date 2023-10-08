var cart = []
function addToCart(productName,produtvalue){
    cart.push({name:productName,value:produtvalue})
    console.log(cart)
}


function submit(){
    if(cart.length==0){
        alert("CART EMPTY")
    }else{
        var jsonData = {
            data:cart,
        };
        // Convert the JSON data to a string
        var jsonString = JSON.stringify(jsonData);
        var form = document.getElementById("jsonForm");
        var jsonDataInput = document.getElementById("jsonData");
        jsonDataInput.value = jsonString;
        form.submit();    
    }
}
 