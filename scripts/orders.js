import { products, getProduct } from "../data/products.js";
import { orders } from "../data/orders.js";
import { formatCurrency } from "./utils/money.js";
import { createEmptyCartHTML } from "./utils/empty.js";
import { addToCart, calculateCartQuantity } from "../data/cart.js";
import { handleSearch } from "./utils/search.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

async function renderOrdersPage() {
    let ordersHTML = "";

    orders.forEach((order) => {
        const orderTimeString = dayjs(order.orderTime).format("MMMM D");

        ordersHTML += `
            <div class="order-container">
                <div class="order-header">
                    <div class="order-header-left-section">
                        <div class="order-date">
                            <div class="order-header-label">Order Placed:</div>
                            <div>${orderTimeString}</div>
                        </div>
                        <div class="order-total">
                            <div class="order-header-label">Total:</div>
                            <div>$${formatCurrency(order.totalCostCents)}</div>
                        </div>
                    </div>
                    <div class="order-header-right-section">
                        <div class="order-header-label">Order ID:</div>
                        <div>${order.id}</div>
                    </div>
                </div>
                
                <div class="order-details-grid">
                    ${createProductsHTML(order)}
                </div>
            </div>
        `;
    });

    function createProductsHTML(order) {
        let productsListHTML = "";

        order.products.forEach((productDetails) => {
            const product = getProduct(productDetails.productId);

            productsListHTML += `
                <div class="product-image-container">
                    <img src="${product.image}">
                </div>

                <div class="product-details">
                    <div class="product-name">
                        ${product.name}
                    </div>
                    <div class="product-delivery-date">
                        Arriving on: ${
                            dayjs(productDetails.estimatedDeliveryTime).format("MMMM D")
                        }
                    </div>
                    <div class="product-quantity">
                        Quantity: ${productDetails.quantity}
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
                    <div class="button-spacer"></div>
                    <button class="buy-again-button button-primary js-buy-again" 
                        data-product-id="${product.id}">
                        <img class="buy-again-icon" src="images/icons/buy-again.png">
                        <span class="buy-again-message">Buy it again</span>
                    </button>
                </div>

                <div class="product-actions">
                    <a href="/amazone/tracking?orderId=${order.id}&productId=${product.id}">
                        <button class="track-package-button button-secondary">
                            Track package
                        </button>
                    </a>
                </div>
            `;
        });

        return productsListHTML;
    }

    document.querySelector(".js-orders-grid").innerHTML = orders.length === 0 
        ? createEmptyCartHTML()
        : ordersHTML;

    document.querySelectorAll(".js-buy-again").forEach((button) => {
        button.addEventListener("click", () => {
            const productId = button.dataset.productId;

            // Add the product to the cart with the correct quantity
            addToCart(productId);

            document.querySelector(".js-cart-quantity").innerHTML = calculateCartQuantity();
            
            // Show "Added to cart" text temporarily
            button.innerHTML = "Added to cart";
            setTimeout(() => {
                button.innerHTML = `
                    <img class="buy-again-icon" src="images/icons/buy-again.png">
                    <span class="buy-again-message">Buy it again</span>
                `;
            }, 1000);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderOrdersPage();
    handleSearch();
    document.querySelector(".js-cart-quantity").innerHTML = calculateCartQuantity();
});