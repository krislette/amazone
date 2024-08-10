import { cart, calculateCartQuantity } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js"
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummary() {
    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.forEach((cartItem) => {
        // For price of the items altogether
        const product = getProduct(cartItem.productId);
        productPriceCents += product.priceCents * cartItem.quantity;

        // For shipping cost
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;
    });

    // Base order price
    const totalBeforeTaxCents = productPriceCents + shippingPriceCents; 

    // Get the tax
    const taxCents = totalBeforeTaxCents * 0.10;

    // Final total price
    const totalCents = totalBeforeTaxCents + taxCents;

    // Call calculateCartQuantity instead of computing all over again
    const paymentSummaryHTML = `
        <div class="payment-summary-title">
            Order Summary
        </div>

        <div class="payment-summary-row">
            <div>Items (${calculateCartQuantity()}):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
        </div>

        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money js-payment-summary-shipping">
                $${formatCurrency(shippingPriceCents)}
            </div>
        </div>

        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
        </div>

        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
        </div>

        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money js-payment-summary-total">
                $${formatCurrency(totalCents)}
            </div>
        </div>

        <button class="place-order-button button-primary js-place-order">
            Place your order
        </button>
    `;

    document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;

    document.querySelector(".js-place-order").addEventListener("click", async () => {
        try {
            const response = await fetch("https://supersimplebackend.dev/orders", {
                method: "POST",
                headers: {
                    // Headers give backend more info about the request
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    // Can't send an object directly, so convert to JSON first
                    cart // I used the shorthand notation here for cart: cart
                })
            });
    
            const order = await response.json();
            addOrder(order);
        } catch (error) {
            console.log("Unexpected error. Try again later.");
        }

        // Go to orders page once order is placed
        window.location.href = "orders.html";
    });
}