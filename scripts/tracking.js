import { getOrder } from "../data/orders.js";
import { getProduct } from "../data/products.js";
import { calculateCartQuantity } from "../data/cart.js";
import { handleSearch } from "./utils/search.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

function renderTrackingPage() {
    const url = new URL(window.location.href);
    const orderId = url.searchParams.get("orderId");
    const productId = url.searchParams.get("productId");

    const order = getOrder(orderId);
    const product = getProduct(productId);
    
    // Added a checker for invalid URL of product and order
    // I could also use some improvements here to make it more robust
    // but I'll leave that to my future self
    if (!order || !product) {
        window.location.href = "/amazone/orders";
        return;
    }

    const productDetails = order.products.find((details) => details.productId === product.id);

    // Calculate the percent progress of the delivery
    const today = dayjs();
    const orderTime = dayjs(order.orderTime);
    const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);
    const percentProgress = ((today - orderTime) / (deliveryTime - orderTime)) * 100;

    const deliveredMessage = today < deliveryTime ? "Arriving on" : "Delivered on";
 
    const trackingHTML = `
        <a class="back-to-orders-link link-primary" href="/amazone/orders">
            View all orders
        </a>

        <div class="delivery-date">
            ${deliveredMessage} ${
                dayjs(productDetails.estimatedDeliveryTime).format('dddd, MMMM D')
            }
        </div>

        <div class="product-info">
            ${product.name}
        </div>

        <div class="product-info">
            Quantity: ${productDetails.quantity}
        </div>

        <img class="product-image" src="${product.image}">

        <div class="progress-labels-container">
            <div class="progress-label ${percentProgress < 50 ? "current-status" : ""}">
                Preparing
            </div>
            <div class="progress-label ${(percentProgress >= 50 && percentProgress < 100) ? "current-status" : ""}">
                Shipped
            </div>
            <div class="progress-label ${percentProgress >= 100 ? "current-status" : ""}">
                Delivered
            </div>
        </div>

        <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${percentProgress}%;"></div>
        </div>
    `;

    document.querySelector(".js-order-tracking").innerHTML = trackingHTML;
}

document.addEventListener("DOMContentLoaded", () => {
    renderTrackingPage();
    handleSearch();
    document.querySelector(".js-cart-quantity").innerHTML = calculateCartQuantity();
});