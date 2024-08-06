import { cart, removeFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js"
import { formatCurrency } from "../utils/money.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

export function renderOrderSummary() {
    let cartSummaryHTML = "";

    cart.forEach((cartItem) => {
        // Made my own code using find instead of forEach that supersimpledev originally used
        const matchingProduct = getProduct(cartItem.productId);

        // My own version of code for fetching matching delivery option
        const deliveryOptionId = cartItem.deliveryOptionId;
        const deliveryOption = getDeliveryOption(deliveryOptionId);

        const today = dayjs();
        const deliveryDate = today.add(
            deliveryOption.deliveryDays,
            "days"
        );
        const dateString = deliveryDate.format("dddd, MMMM D");

        cartSummaryHTML += `
            <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
                <div class="delivery-date">
                    Delivery date: ${dateString}
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
                        ${generateDeliveryHTML(matchingProduct, cartItem)}
                    </div>
                </div>
            </div>
        `;
    });

    function generateDeliveryHTML(matchingProduct, cartItem) {
        let html = "";
        
        deliveryOptions.forEach((deliveryOption) => {
            const today = dayjs();
            // Two params: <number of time to add e.g. 7: 7 days>, 
            // length of time: days, month 
            const deliveryDate = today.add(
                deliveryOption.deliveryDays, 
                "days"
            );
            const dateString = deliveryDate.format("dddd, MMMM D");
            const priceString = deliveryOption.priceCents === 0 
                ? "FREE" 
                : `$${formatCurrency(deliveryOption.priceCents)} -`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

            html += `
                <div class="delivery-option js-delivery-option"
                    data-product-id="${matchingProduct.id}"
                    data-delivery-option-id="${deliveryOption.id}">
                    <input type="radio"
                        ${isChecked ? "checked": ""}
                        class="delivery-option-input"
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

    document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

    function updateCartQuantity() {
        const cartQuantity = calculateCartQuantity();
        document.querySelector(".js-cart-quantity").innerHTML = `${cartQuantity} items`;
    }

    document.querySelectorAll(".js-delete-link").forEach((link) => {
        link.addEventListener("click", () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.remove(); // Fetch element from html and remove it using .remove()
            updateCartQuantity();
            renderPaymentSummary(); // Render html when an action happens
        });
    });

    document.querySelectorAll(".js-update-link")
        .forEach((link) => {
            link.addEventListener("click", () => {
                const productId = link.dataset.productId;
                const container = document.querySelector(`.js-cart-item-container-${productId}`);
                container.classList.add("is-editing-quantity");
                renderPaymentSummary(); // Render so it aligns
            });
        });

    document.querySelectorAll(".js-save-link")
        .forEach((link) => {
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
        
                updateCartQuantity();
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

    document.addEventListener("DOMContentLoaded", () => {
        updateCartQuantity();
    });
}

// Uses MVC - model view controller with cart.js being the model, 
// and checkout.js being the view and the listeners as controller. 