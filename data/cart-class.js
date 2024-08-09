import { isValidDeliveryOption } from "./deliveryOptions.js";

class Cart {
    cartItems; // Can be also equal to cartItems = undefined
    #localStorageKey; // To make something private, use "#" (hash) instead of private keyword

    constructor(localStorageKey) {
        this.#localStorageKey = localStorageKey;
        this.#loadFromStorage(); // Private method
    }
    
    // Private method
    #loadFromStorage() {
        this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey));
    
        if (!this.cartItems) {
            this.cartItems = [{
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

    saveToStorage() {
        localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
    }
    
    addToCart(productId) {
        const matchingItem = this.cartItems.find((cartItem) => productId === cartItem.productId);
        const quantityElement = document.querySelector(`.js-quantity-selector-${productId}`);
        const quantity = Number(quantityElement.value);
        
        if (matchingItem) {
            matchingItem.quantity += quantity;
        } else {
            this.cartItems.push({
                productId,
                quantity,
                deliveryOptionId: "1"
            });
        }
    
        this.saveToStorage();
    }
    
    removeFromCart(productId) {
        const newCart = [];
    
        this.cartItems.forEach((cartItem) => {
            if (cartItem.productId !== productId) {
                newCart.push(cartItem); 
            }
        });
    
        this.cartItems = newCart;
        this.saveToStorage();
    }
    
    calculateCartQuantity() {
        let cartQuantity = 0;
    
        this.cartItems.forEach((cartItem) => {
            cartQuantity += cartItem.quantity;
        });
    
        return cartQuantity;
    }
    
    updateQuantity(productId, newQuantity) {
        let matchingItem;
      
        this.cartItems.forEach((cartItem) => {
            if (productId === cartItem.productId) {
                matchingItem = cartItem;
            }
        });
      
        matchingItem.quantity = newQuantity;
      
        this.saveToStorage();
    }
    
    updateDeliveryOption(productId, deliveryOptionId) {
        const matchingItem = this.cartItems.find((cartItem) => productId === cartItem.productId);
    
        if (!matchingItem) return;
        if (!isValidDeliveryOption(deliveryOptionId)) return;
    
        matchingItem.deliveryOptionId = deliveryOptionId;
        this.saveToStorage();
    }
}

const cart = new Cart("cart-oop");
const businessCart = new Cart("cart-business");

// Check if an object is an instance of a specific class
console.log(cart instanceof Cart);
console.log(businessCart instanceof Cart);

// No console .logs because I removed them from checkout.js
// > import "../data/cart-oop.js";