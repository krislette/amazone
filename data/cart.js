import { isValidDeliveryOption } from "./deliveryOptions.js";

export let cart;

loadFromStorage();

export function loadFromStorage() {
    cart = JSON.parse(localStorage.getItem("cart"));

    if (!cart) {
        cart = [{
            productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 2,
            deliveryOptionId: "1"
        }, {
            productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
            quantity: 1,
            deliveryOptionId: "2"
        }];
    }
}

function saveToStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId) {
    const matchingItem = cart.find((cartItem) => productId === cartItem.productId);
    const quantityElement = document.querySelector(`.js-quantity-selector-${productId}`);
    const quantity = Number(quantityElement.value);
    
    if (matchingItem) {
        matchingItem.quantity += quantity;
    } else {
        cart.push({
            productId,
            quantity,
            deliveryOptionId: "1"
        });
    }

    saveToStorage();
}

export function removeFromCart(productId) {
    const newCart = [];

    cart.forEach((cartItem) => {
        if (cartItem.productId !== productId) {
            newCart.push(cartItem); 
        }
    });

    cart = newCart;
    saveToStorage();
}

export function calculateCartQuantity() {
    let cartQuantity = 0;

    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    });

    return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
    let matchingItem;
  
    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    });
  
    matchingItem.quantity = newQuantity;
  
    saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
    const matchingItem = cart.find((cartItem) => productId === cartItem.productId);

    if (!matchingItem) return;
    if (!isValidDeliveryOption(deliveryOptionId)) return;

    matchingItem.deliveryOptionId = deliveryOptionId;
    saveToStorage();
}