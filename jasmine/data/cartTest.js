import { addToCart, cart, loadFromStorage } from "../../data/cart.js";

describe("Test suite: addToCart", () => {
    it("Adds an existing product to the cart", () => {
        // Mock feature of jasmine: replaces a method with a fake version
        spyOn(localStorage, "getItem").and.callFake(() => {
            return JSON.stringify([{
                productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
                quantity: 1,
                deliveryOptionId: "1"
            }]);
        });

        spyOn(localStorage, "setItem");

        loadFromStorage();

        // Mock the quantity input element
        const quantityInput = document.createElement('input');
        quantityInput.className = 'js-quantity-selector-e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
        quantityInput.value = '1';
        document.body.appendChild(quantityInput);

        addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
        expect(cart.length).toEqual(1);
        expect(cart[0].quantity).toEqual(2);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1); 

        // Clean up the DOM
        document.body.removeChild(quantityInput);
    });

    // Flaky Test: A test that sometimes passes, or sometimes fails
    // Bc cart length is not always equal to 1
    it("Adds a new product to the cart", () => {
        // Mock feature of jasmine: replaces a method with a fake version
        spyOn(localStorage, "getItem").and.callFake(() => {
            return JSON.stringify([]);
        });

        spyOn(localStorage, "setItem");

        loadFromStorage();

        // Mock the quantity input element
        const quantityInput = document.createElement('input');
        quantityInput.className = 'js-quantity-selector-e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
        quantityInput.value = '1';
        document.body.appendChild(quantityInput);

        addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
        expect(cart.length).toEqual(1);

        // Only works if the method was mocked using spyOn
        // Checks if the method is called along execution
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart[0].productId).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
        expect(cart[0].quantity).toEqual(1);

        // Clean up the DOM
        document.body.removeChild(quantityInput);
    });
});