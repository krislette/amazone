import {
    cart,
    removeFromCart,
    calculateCartQuantity,
    updateQuantity
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

let cartSummaryHTML = "";

console.log('Cart:', JSON.stringify(cart, null, 2));
console.log('Products:', JSON.stringify(products, null, 2));

cart.forEach((cartItem) => {
    // Made my own code using find instead of forEach that supersimpledev originally used
    let matchingProduct = products.find(({ id }) => id === cartItem.productId);

    cartSummaryHTML += `
        <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
                Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image"
                src="${matchingProduct.image}">

                <div class="cart-item-details">
                <div class="product-name">
                    ${matchingProduct.name}
                </div>
                <div class="product-price">
                    ${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                    <span>
                        Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                        Update
                    </span>
                    <input class="quantity-input js-quantity-input-${matchingProduct.id}">
                    <span class="save-quantity-link link-primary js-save-link"
                        data-product-id="${matchingProduct.id}">
                        Save
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                        Delete
                    </span>
                </div>
                </div>

                <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                <div class="delivery-option">
                    <input type="radio" checked
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                    <div>
                    <div class="delivery-option-date">
                        Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                        FREE Shipping
                    </div>
                    </div>
                </div>
                <div class="delivery-option">
                    <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                    <div>
                    <div class="delivery-option-date">
                        Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                        $4.99 - Shipping
                    </div>
                    </div>
                </div>
                <div class="delivery-option">
                    <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                    <div>
                    <div class="delivery-option-date">
                        Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                        $9.99 - Shipping
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    `;
});

document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

function updateCartQuantity() {
    const cartQuantity = calculateCartQuantity();
    document.querySelector('.js-cart-quantity').innerHTML = `${cartQuantity} items`;
}

document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove(); // Fetch element from html and remove it using .remove()
        updateCartQuantity();
    });
});

document.querySelectorAll('.js-update-link')
    .forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.classList.add("is-editing-quantity");
        });
    });

document.querySelectorAll('.js-save-link')
    .forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;

            const container = document.querySelector(
                `.js-cart-item-container-${productId}`
            );
            container.classList.remove('is-editing-quantity');

            const quantityInput = document.querySelector(
                `.js-quantity-input-${productId}`
            );
            const newQuantity = Number(quantityInput.value);
            updateQuantity(productId, newQuantity);

            const quantityLabel = document.querySelector(
                `.js-quantity-label-${productId}`
            );
            quantityLabel.innerHTML = newQuantity;
    
            updateCartQuantity();
        });
    });

document.addEventListener("DOMContentLoaded", () => {
    updateCartQuantity();
});