import { cart, removeFromCart, updateQuantity, updateDeliveryOption } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { deliveryOptions, getDeliveryOption, calculateDeliveryDate } from "../../data/deliveryOptions.js"
import { formatCurrency } from "../utils/money.js";
import { createEmptyCartHTML } from "../utils/empty.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";

export function renderOrderSummary() {
    let cartSummaryHTML = "";

    cart.forEach((cartItem) => {
        // Made my own code using find instead of forEach that supersimpledev originally used
        const matchingProduct = getProduct(cartItem.productId);

        // My own version of code for fetching matching delivery option
        const deliveryOptionId = cartItem.deliveryOptionId;
        const deliveryOption = getDeliveryOption(deliveryOptionId);
        const dateString = calculateDeliveryDate(deliveryOption);

        cartSummaryHTML += `
            <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
                <div class="delivery-date">
                    Delivery date: ${dateString}
                </div>

                <div class="cart-item-details-grid">
                    <img class="product-image"
                        src="${matchingProduct.image}">

                    <div class="cart-item-details">
                        <div class="product-name 
                            js-product-name-${matchingProduct.id}">
                            ${matchingProduct.name}
                        </div>
                        <div class="product-price
                            js-product-price-${matchingProduct.id}">
                            ${matchingProduct.getPrice()}
                        </div>
                        <div class="product-quantity js-product-quantity-${matchingProduct.id}">
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
                            <span class="delete-quantity-link 
                                link-primary 
                                js-delete-link 
                                js-delete-link-${matchingProduct.id}" 
                                data-product-id="${matchingProduct.id}">
                                Delete
                            </span>
                        </div>
                    </div>

                    <div class="delivery-options">
                        <div class="delivery-options-title">
                            Choose a delivery option:
                        </div>
                        ${generateDeliveryHTML(matchingProduct, cartItem)}
                    </div>
                </div>
            </div>
        `;
    });

    function generateDeliveryHTML(matchingProduct, cartItem) {
        let html = "";
        
        deliveryOptions.forEach((deliveryOption) => {
            const dateString = calculateDeliveryDate(deliveryOption);
            const priceString = deliveryOption.priceCents === 0 
                ? "FREE" 
                : `$${formatCurrency(deliveryOption.priceCents)} -`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

            html += `
                <div class="delivery-option 
                    js-delivery-option 
                    js-delivery-option-${matchingProduct.id}-${deliveryOption.id}"
                    data-product-id="${matchingProduct.id}"
                    data-delivery-option-id="${deliveryOption.id}">
                    <input type="radio"
                        ${isChecked ? "checked" : ""}
                        class="delivery-option-input 
                        js-delivery-option-input-${matchingProduct.id}-${deliveryOption.id}"
                        name="delivery-option-${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                            ${dateString}
                        </div>
                        <div class="delivery-option-price">
                            ${priceString} Shipping
                        </div>
                    </div>
                </div>
            `
        });

        return html;
    }

    // Check the HTML to display based on the cart's status
    document.querySelector(".js-order-summary").innerHTML = cart.length === 0 
        ? createEmptyCartHTML() 
        : cartSummaryHTML;

    document.querySelectorAll(".js-delete-link").forEach((link) => {
        link.addEventListener("click", () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);
            renderCheckoutHeader();
            renderOrderSummary();
            renderPaymentSummary(); // Render html when an action happens
        });
    });

    document.querySelectorAll(".js-update-link").forEach((link) => {
        link.addEventListener("click", () => {
            const productId = link.dataset.productId;
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.classList.add("is-editing-quantity");
            renderPaymentSummary(); // Render so it aligns
        });
    });

    document.querySelectorAll(".js-save-link").forEach((link) => {
        link.addEventListener("click", () => {
            const productId = link.dataset.productId;

            const container = document.querySelector(
                `.js-cart-item-container-${productId}`
            );
            container.classList.remove("is-editing-quantity");

            const quantityInput = document.querySelector(
                `.js-quantity-input-${productId}`
            );
            const newQuantity = Number(quantityInput.value);
            updateQuantity(productId, newQuantity);

            const quantityLabel = document.querySelector(
                `.js-quantity-label-${productId}`
            );
            quantityLabel.innerHTML = newQuantity;
    
            renderCheckoutHeader();
            renderPaymentSummary(); // Always render payment sum
        });
    });

    document.querySelectorAll(".js-delivery-option").forEach((element) => {
        element.addEventListener("click", () => {
            const { productId, deliveryOptionId } = element.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
            renderOrderSummary(); // Recursion
            renderPaymentSummary(); // Don't forget
        });
    })
}

// Uses MVC - model view controller with cart.js being the model, 
// and checkout.js being the view and the listeners as controller. 