import { cart, calculateCartQuantity } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js"

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
            <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
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
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
        </div>

        <button class="place-order-button button-primary">
            Place your order
        </button>
    `;

    document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;
}