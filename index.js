// Adding an eventListener to the currency drop down list
document.getElementById("currencySelector").addEventListener("change", currencySelection);

// Function constructors for StoreItems, CartItems, and Review Objects
function StoreItem(
  id,
  name,
  price,
  quantityOnHand,
  maxPerCustomer,
  category,
  shippingCost,
  review,
  description,
  image
) {
  this.id = id;
  this.name = name;
  this.price = price;
  this.quantityOnHand = quantityOnHand;
  this.maxPerCustomer = maxPerCustomer;
  this.category = category;
  this.shippingCost = shippingCost;
  this.review = review;
  this.description = description;
  this.image = image;
}

function CartItem(id, price, quantity, shipping, image) {
  this.id = id;
  this.price = price;
  this.quantity = quantity;
  this.shippingCost = shipping;
  this.image = image;
}

function Review(review, rating) {
  this.review = review;
  this.rating = rating;
}

// Array for store items
let products = [];
// Array for cart items
let cart = [];

// Function to find individual categories and populate dropdown
function populateMenu(itemArray) {
  var itemCat = [];
  // Looping through the array that is passed in as an argument and assigning the variable the value of false
  for (let i = 0; i < itemArray.length; i++) {
    let foundCat = false;
    // Looping through the itemCat array and checking if the category is already in the itemCat array, if so, change variable to true
    for (let j = 0; j < itemCat.length; j++) {
      if (itemArray[i].category === itemCat[j]) {
        foundCat = true;
      }
    }
    // If foundCat variable is false, add item.category to itemCat array
    if (foundCat === false) {
      itemCat.push(itemArray[i].category);
    }
  }
  // Looping through itemCat array and adding all categories as options in the dropdown list
  for (let k = 0; k < itemCat.length; k++) {
    let tempOp = document.createElement("option");

    tempOp.innerHTML = itemCat[k];
    tempOp.value = itemCat[k];

    document.getElementById("displayFilter").appendChild(tempOp);
  }
}

// Function to show selected item category
function showMenu() {
  // What the user has selected
  let menuCatSelected = document.getElementById("displayFilter").value;

  // Array to store relevant items
  let selectedElements = [];

  let menuParent = document.getElementById("inventoryOutput");

  menuParent.innerHTML = ""; // Ensure it's empty

  for (let i = 0; i < products.length; i++) {
    if (products[i].category === menuCatSelected) {
      selectedElements.push(products[i]);
    } else if (menuCatSelected === "All") {
      displayStoreItems();
    }
  }

  // Display items in the selectedElements array
  selectedElements.forEach((product) => {
    let index = products.findIndex((element) => {
      return element.id === product.id;
    });
    // Creating a div element
    let tempDiv = document.createElement("div");
    // Giving  the new element an id
    tempDiv.id = "storeItems";
    // Information that will be displayed in each new div element
    let info = `<img src = '${product.image}' width=250><br> 
    ProductID: ${product.id}<br> 
     ${product.name} <br> 
    $${product.price} <br>
    In Stock: ${product.quantityOnHand}<br>
    Max per Customer: ${product.maxPerCustomer}<br><br>
     <button type='submit' onclick = 'itemDetails(${index});'>Item Details</button> 
     <button type='submit' id='cartBtn' onclick='addToCart(${product.id},${index});'>Add to Cart</button> 
     <button type='submit' onclick='itemReview(${product.id})'>Customer Reviews</button>`;
    tempDiv.innerHTML = info;
    // Appending new div element to it's parent element, the inventoryOutput element
    menuParent.appendChild(tempDiv);
  });
}

// Function to display items from the storeItemObjects array
function displayStoreItems() {
  document.getElementById("inventoryOutput").innerHTML = "";
  // Looping through the products array
  products.forEach((product, index) => {
    // Creating a div element
    let tempDiv = document.createElement("div");
    // Giving  the new element an id
    tempDiv.id = "storeItems";
    // Information that will be displayed in each new div element
    let info = `<img src = '${product.image}' width=250><br> 
    ProductID: ${product.id}<br> 
     ${product.name} <br>
      $${product.price} <br>
       In Stock: ${product.quantityOnHand}<br> 
       Max per Customer: ${product.maxPerCustomer}<br><br>
       <button type='submit' onclick='itemDetails(${index});'>Item Details</button> 
       <button type='submit' id='cartBtn' onclick='addToCart(${product.id}, ${index});'>Add to Cart</button>
        <button type='submit' onclick='itemReview(${product.id})'>Customer Reviews</button>`;
    tempDiv.innerHTML = info;
    // Appending new div element to it's parent element, the inventoryOutput element
    document.getElementById("inventoryOutput").appendChild(tempDiv);
  });
}
// Function to display item name and description
function itemDetails(index) {
  alert(`Details for ${products[index].name}:\n\n${products[index].description}`);
}

// Adding items to the cart
function addToCart(id, i) {
  // Checking to see if item is already in cart
  if (cart.some((item) => item.id === id)) {
    // Finding the index of the items in the cart and assigning it to the variable index
    let index = cart.findIndex((element) => {
      return element.id === id;
    });
    let idx = products.findIndex((element) => {
      return element.id === id;
    });

    // Validating that you cannot add more items to the cart than what's in inventory or the maxPerCustomer.
    if (products[idx].quantityOnHand === 0 && cart[index].quantity > products[idx].quantityOnHand) {
      alert("Sorry, there is not enough inventory to complete your order.");
    } else if (cart[index].quantity < products[idx].maxPerCustomer) {
      // Using the index to increase the cart quantity of the specific item
      cart[index].quantity = cart[index].quantity + 1;
      // Subtracting product from the quantity on hand
      products[idx].quantityOnHand = products[idx].quantityOnHand - 1;
    }
  } else {
    // If the item is not already in the cart, add it
    cart.push(
      new CartItem(
        products[i].id,
        products[i].price,
        1,
        products[i].shippingCost,
        products[i].image
      )
    );
    products[i].quantityOnHand = products[i].quantityOnHand - 1;
  }
  showMenu();
  displayCartItems();
  totals();
}

function displayCartItems() {
  // clearing cartOutput div so old items are not repeated when a new item is added
  let cartOutput = (document.getElementById("cartOutput").innerHTML = "");
  // Looping through the cart array
  cart.forEach((item, index) => {
    // Creating a div element
    let cartDiv = document.createElement("div");
    // Modifying the new element by assigning it an 'id'
    cartDiv.id = "cartItems";
    // Creating the inner HTML which will be displayed when new item is added to the cart
    let info = ` 
    <div>Product ID:${item.id} </div>
   <div> Price: $${item.price}  </div>
   <div> Shipping: $${item.shippingCost} </div>
   <div> <img src='${item.image}' width='150'> </div> 
   <div id='alignItems'> <div class="btn minus" onclick="decrease(${item.id})">-</div> 
   <div id='itemQty'>${item.quantity}</div>
   <div class="btn plus" onclick="addToCart(${item.id})">+</div></div>
   <div>Subtotal: $${(item.price * item.quantity).toFixed(2)} </div>
   <div><button class='remove' type='submit' onclick='removeFromCart(${
     item.id
   })'>Remove</button> </div></div><br>`;

    cartDiv.innerHTML = info;
    // Appending the new element to it's parent
    document.getElementById("cartOutput").appendChild(cartDiv);
  });
}

// Decreasing the cart quantity
function decrease(id) {
  if (cart.some((item) => item.id === id)) {
    // Finding the index of the items in the cart
    let index = cart.findIndex((element) => {
      return element.id === id;
    });
    // Finding the index of the products
    let index2 = products.findIndex((element) => {
      return element.id === id;
    });

    if (cart[index].quantity > 1) {
      // Using the index to decrease the cart quantity of the specific item
      cart[index].quantity = cart[index].quantity - 1;
      products[index2].quantityOnHand = products[index2].quantityOnHand + 1;
    }
  }

  showMenu();
  displayCartItems();
  totals();
}

// Function to remove item from the cart
function removeFromCart(id) {
  // Finding the index of the selected item to remove from the cart array
  let index = cart.findIndex((element) => {
    return element.id === id;
  });
  // Finding the index of the selected item to change the quantity on hand
  let index2 = products.findIndex((element) => {
    return element.id === id;
  });
  products[index2].quantityOnHand = products[index2].quantityOnHand + cart[index].quantity;
  // Removing the found item
  cart.splice(index, 1);
  showMenu();
  displayCartItems();
  totals();
  displayEmptyCart();
}

// Function to empty the cart in one click
function clearCart() {
  // Looping through the cart array
  for (let i = 0; i < cart.length; i++) {
    //
    products.findIndex((item) => {
      // Checking to see if the cart items id matches the products id
      if (item.id === cart[i].id) {
        // Adding the item quantity from the cart back on to the products quantity
        item.quantityOnHand = item.quantityOnHand + cart[i].quantity;
      }
    });
  }
  // Clearing the cart array
  cart = [];
  showMenu();
  displayCartItems();
  totals();
  displayEmptyCart();
}

// Function to display empty cart notice
function displayEmptyCart() {
  if (cart.length === 0) {
    document.getElementById("cartOutput").innerHTML =
      "<p id='cartMessage'>Your cart is empty</p> <br>";
  }
}

// Function converting the currency
function currencySelection(event) {
  let flag = document.querySelector(".currencyFlag");

  // Looping through the products array
  products.forEach((item) => {
    // Validating whether 'USD' or 'CDN' has been selected and changing  the appropriate currency for the store items.
    if (event.target.value === "USD") {
      flag.src = "img/america-flag.jpg";
      item.price = (item.price * 0.73608).toFixed(2);
      item.shippingCost = (item.shippingCost * 0.73608).toFixed(2);
    } else {
      flag.src = "img/canada-flag-.jpg";
      item.price = (item.price * 1.3585488).toFixed(2);
      item.shippingCost = (item.shippingCost * 1.3585488).toFixed(2);
    }
  });
  // Looping through the cart array
  cart.forEach((item) => {
    // Validating whether 'USD' or 'CDN' has been selected and changing  the appropriate currency in the cart.
    if (event.target.value === "USD") {
      item.price = (item.price * 0.73608).toFixed(2);
      item.shippingCost = (item.shippingCost * 0.73608).toFixed(2);
    } else {
      item.price = (item.price * 1.3585488).toFixed(2);
      item.shippingCost = (item.shippingCost * 1.3585488).toFixed(2);
    }
  });

  displayCartItems();
  totals();
  showMenu();
}

// Function adding up the costs of the items
function totals() {
  let input = document.querySelectorAll(".subTotal");

  let subTotal = 0;
  let shipping = 0;
  // Looping through the cart array
  cart.forEach((item) => {
    subTotal += item.quantity * item.price;
  });
  input[0].value = `$${subTotal.toFixed(2)}`;

  cart.forEach((item) => {
    shipping += item.quantity * item.shippingCost;
  });
  input[1].value = `$${shipping.toFixed(2)}`;

  let subTotal1 = shipping + subTotal;
  let tax = subTotal1 * 0.13;
  let total = tax + subTotal1;

  input[2].value = ` $${subTotal1.toFixed(2)}`;
  input[3].value = ` $${tax.toFixed(2)}`;
  input[4].value = ` $${total.toFixed(2)}`;
}

// Function to add review
function review(id) {
  let reviewDesc = document.getElementById("reviewDesc");
  let reviewNum = document.getElementById("reviewNum");
  let reviewId = document.getElementById("reviewId");

  // Searching the products array to find the index of the product id that matches the parameter id
  let index = products.findIndex((element) => {
    return element.id == id;
  });

  // Validating that the product id is actually in the products array
  if (index === -1 || reviewNum.value < 1 || reviewNum.value > 5 || reviewNum.value === "") {
    alert("That is not a valid review");
  } else {
    // Using the index value to add the review object to the array in the item object
    products[index].review.push(new Review(reviewDesc.value, parseInt(reviewNum.value)));
    itemReview(id);
  }

  // Resetting the input fields
  reviewId.value = "";
  reviewDesc.value = "";
  reviewNum.value = "";
}

// Function to display the review
function itemReview(id) {
  // Looping through the products array to find the index of the entered product ID and assigning it to the index variable
  let index = products.findIndex((element) => {
    return element.id == id;
  });
  // Declaring an empty string
  let info = "";

  let prodRating = 0;
  // Assigning the products.review array to the variable ratAvg
  let ratAvg = products[index].review;
  // Looping through the items review array and averaging the rating
  for (let i = 0; i < ratAvg.length; i++) {
    prodRating += ratAvg[i].rating / ratAvg.length;
  }

  ratAvg.forEach((review, index) => {
    info += `${index + 1}: ${review.review}\n`;
  });

  alert(
    `Reviews for ${products[index].name}:\n\n${info}\n\n Average rating: ${prodRating.toFixed(1)}`
  );
}
