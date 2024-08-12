
// JavaScript to filter products based on category selection
const categoryLinks = document.querySelectorAll('.category-link');
const products = document.querySelectorAll('.product');

categoryLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default anchor click behavior
        const selectedCategory = this.getAttribute('data-category');

        products.forEach(product => {
            if (selectedCategory === 'all' || product.dataset.category === selectedCategory) {
                product.style.display = 'block'; // Show product
            } else {
                product.style.display = 'none'; // Hide product
            }
        });
    });
});



// Initialize cart
let cart = [];

// Function to update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const subtotalElement = document.querySelector('.subtotal');
    const totalElement = document.querySelector('.total');
    const cartIconCount = document.querySelector('.cart-icon .badge');
    
    // Clear current cart items
    cartItemsContainer.innerHTML = '';

    let subtotal = 0;

    // Populate cart items
    cart.forEach((item, index) => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item', 'd-flex', 'justify-content-between', 'align-items-center', 'mb-3');

        cartItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 100px;">
            <div class="flex-grow-1 mx-3">
                <h5 class="product-name">${item.name}</h5>
                <p class="product-price">$${item.price}</p>
            </div>
            <input type="number" class="form-control quantity" value="${item.quantity}" min="1" style="width: 70px;" data-index="${index}">
            <button class="btn btn-danger ml-2 remove-item" data-index="${index}">Remove</button>
        `;

        cartItemsContainer.appendChild(cartItemDiv);
        subtotal += item.price * item.quantity;
    });

    // Update subtotal and total
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${subtotal.toFixed(2)}`;

          // Update cart icon count
    cartIconCount.textContent = cart.reduce((total, item) => total + item.quantity, 0); // Calculate total items in cart
}

   // Function to update the cart count in the header
function updateCartCount() {
    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
      cartCountElement.textContent = cart.length;
    }
  }

// Function to add item to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.name === product.name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    updateCartDisplay();
}

// Function to remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// Event delegation for cart items
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-item')) {
        const index = event.target.getAttribute('data-index');
        removeFromCart(index);
    }
});


// Event delegation for quantity change
document.addEventListener('input', (event) => {
    if (event.target.classList.contains('quantity')) {
        const index = event.target.getAttribute('data-index');
        const newQuantity = parseInt(event.target.value);
        if (newQuantity > 0) {
            cart[index].quantity = newQuantity; // Update quantity
            updateCartDisplay(); // Update cart display after quantity change
        } else {
            // Optionally handle cases where quantity is set to 0 or negative
            event.target.value = 1; // Reset to 1 if invalid
        }
    }
});


// Fetch product data from API
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products'); // actual API endpoint
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Display products on the product page
function displayProducts(products) {
    const productsContainer = document.querySelector('.product-section'); //  container for products
    products.map(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <h5>${product.name}</h5>
            <p>${product.description}</p>
            <p>$${product.price}</p>
            <button class="btn btn-primary add-to-cart" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Add to Cart</button>
        `;
        productsContainer.appendChild(productDiv);
    });
}

// Event listener for add to cart buttons
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-cart')) {
        const product = {
            id: event.target.getAttribute('data-id'),
            name: event.target.getAttribute('data-name'),
            price: parseFloat(event.target.getAttribute('data-price')),
            image: event.target.closest('.product').querySelector('img').src };
            addToCart(product);
    }
});

// Handle checkout form submission
document.getElementById('checkout-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const orderDetails = {};
    formData.forEach((value, key) => {
        orderDetails[key] = value;
    });
    console.log('Order placed:', orderDetails);
    // Here you can send orderDetails to your server
});

// Initialize the app
fetchProducts();
updateCartDisplay();

