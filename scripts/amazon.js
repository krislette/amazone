import { addToCart, calculateCartQuantity } from "../data/cart.js"; // You can also import AS 
import { products } from "../data/products.js";
import { handleSearch } from "./utils/search.js";

let productsHTML = "";

const url = new URL(window.location.href);
const search = url.searchParams.get("search");

let filteredProducts = products;

// If a search exists in the URL parameters,
// filter the products that match the search
if (search) {
    // Edited return statement to include partial searches
    // e.g. [keyword]: robe -> rob
    //      [keyword]: bath -> bathroom, bathing
    filteredProducts = products.filter((product) => {
        return product.name.toLowerCase().includes(search.toLowerCase())
            || product.keywords.some((keyword) => keyword.toLowerCase().includes(search.toLowerCase()));
    });
}

filteredProducts.forEach((product) => {
    productsHTML += `
        <div class="product-container">
            <div class="product-image-container">
                <img class="product-image" src="${product.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
                ${product.name}
            </div>

            <div class="product-rating-container">
                <img class="product-rating-stars" src="${product.getStarsUrl()}">
                <div class="product-rating-count link-primary">${product.rating.count}</div>
            </div>

            <div class="product-price">
                ${product.getPrice()}
            </div>

            <div class="product-quantity-container">
                <select class="js-quantity-selector-${product.id}">
                    <option selected value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
            </div>

            <!-- Polymorphism -->
            ${product.createExtraInfoHTML()}

            <div class="product-spacer"></div>

            <div class="added-to-cart js-added-message-${product.id}">
                <img src="images/icons/checkmark.png">
                Added
            </div>

            <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
                Add to Cart
            </button>
        </div>
    `;
});

document.querySelector(".js-products-grid").innerHTML = productsHTML;

function updateCartQuantity() {
    const cartQuantity = calculateCartQuantity();
    document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
}

const addedMessageTimeouts = {}; // object that will contain the timeout ids of diff products

function showProductAdded(productId) {
    const addedElement = document.querySelector(`.js-added-message-${productId}`);
    addedElement.classList.add("show-added-to-cart");
    const previousTimeoutId = addedMessageTimeouts[productId];

    // Checks if there is a timeout id for this product
    // if so, clear the timeout
    if (previousTimeoutId) {
        clearTimeout(previousTimeoutId);
    }
    
    const timeoutId = setTimeout(() => {
        addedElement.classList.remove("show-added-to-cart");
    }, 2000);

    // Adds the timeout id to the object
    // so that we can clear it later
    addedMessageTimeouts[productId] = timeoutId;
}

document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
        // dataset retrieves all the data attribute that we put on the html
        // "data-" is another html attribute which sets an "id" to something on html
        // data-product-name turned into productName
        const { productId } = button.dataset;
        addToCart(productId);
        updateCartQuantity();
        showProductAdded(productId);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    updateCartQuantity();
    handleSearch();
});

//  Line 42: Polymorphism 
// : Have the classes use the same method 
// : and the class itself will determine what 
// : this method does based on the definition
// : (Because we don't know if this one's 
// : a product or a clothing class)