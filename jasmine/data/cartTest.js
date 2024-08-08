import { addToCart, cart, loadFromStorage } from "../../data/cart.js";

// Unit Test: Only testing one piece (unit) of code
describe("Test suite: addToCart", () => {
     // Mock the id var globally to avoid scoping issues
    const productIdToAdd = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";

    // Refactored and optimized this whole code 
    // as an inspiration from orderSummaryTest
    beforeEach(() => {
        // Mock localStorage setItem to avoid modifying original
        spyOn(localStorage, "setItem");

        // Reset the cart array before each test
        cart.length = 0;

        // Select the test container & set up mock quantity input element
        // Disclaimer: Orig el is not input, just for the test
        document.querySelector(".js-test-container").innerHTML = `
            <input class="js-quantity-selector-${productIdToAdd}" type="number" value="1">
        `;
    });

    afterEach(() => {
        // Clean up the test container
        document.querySelector(".js-test-container").innerHTML = "";
    });

    it("Adds an existing product to the cart", () => {
       // Mock feature of jasmine: replaces a method with a fake version
        spyOn(localStorage, "getItem").and.callFake(() => {
            return JSON.stringify([{
                productId: productIdToAdd,
                quantity: 1,
                deliveryOptionId: "1"
            }]);
        });
        loadFromStorage();

        addToCart(productIdToAdd);

        expect(cart.length).toEqual(1);
        expect(cart[0].quantity).toEqual(2);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    });

    // Flaky Test: A test that sometimes passes, or sometimes fails
    // Because cart length is not always equal to 1
    it("Adds a new product to the cart", () => {
        // Mock localStorage getItem method to return an empty cart
        spyOn(localStorage, "getItem").and.callFake(() => {
            return JSON.stringify([]);
        });
        loadFromStorage();

        addToCart(productIdToAdd);

        // tohaveBeenCalledTimes only works if the method was 
        // mocked using spyOn and checks if the method is called along execution
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart.length).toEqual(1);
        expect(cart[0].productId).toEqual(productIdToAdd);
        expect(cart[0].quantity).toEqual(1);
    });
});