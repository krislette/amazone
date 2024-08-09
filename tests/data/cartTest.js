import { addToCart, removeFromCart, cart, loadFromStorage, updateDeliveryOption } from "../../data/cart.js";

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
        expect(localStorage.setItem).toHaveBeenCalledWith(
            "cart",
            JSON.stringify([{
                productId: productIdToAdd,
                quantity: 2,
                deliveryOptionId: "1"
            }])
        );
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
        expect(localStorage.setItem).toHaveBeenCalledWith(
            "cart",
            JSON.stringify([{
                productId: productIdToAdd,
                quantity: 1,
                deliveryOptionId: "1"
            }])
        );
    });
});

// Exercise i, test suite for removeFromCart function on cart.js
describe("Test suite: removeFromCart", () => {
    // Mock the id globally for all test cases
    const productIdToRemove = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";

    // Moved repeating code on beforeEach for simpler setup
    beforeEach(() => {
        spyOn(localStorage, "setItem");

        spyOn(localStorage, "getItem").and.callFake(() => {
            return JSON.stringify([{
                productId: productIdToRemove,
                quantity: 1,
                deliveryOptionId: "1"
            }]);
        });
        loadFromStorage();
    });

    // Test case for removing an item that is in the cart
    it("Removes an existing product from the cart", () => {
        removeFromCart(productIdToRemove);

        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart.length).toEqual(0);

        // Checks if setItem was called once with the correct values
        expect(localStorage.setItem).toHaveBeenCalledWith("cart", JSON.stringify([]));
    });
    
    // Test case for removing an item that is not in the cart
    it("Does nothing if a product is not in the cart", () => {
        removeFromCart("n0n-3x1573n7-1d");

        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart.length).toEqual(1);
        expect(cart[0].productId).toEqual(productIdToRemove);
        expect(cart[0].quantity).toEqual(1);

        // Checks if setItem was called once with the correct values
        expect(localStorage.setItem).toHaveBeenCalledWith(
            "cart",
            JSON.stringify([{
                productId: productIdToRemove,
                quantity: 1,
                deliveryOptionId: "1"
            }])
        );
    });
});

// Exercise k test suite for updateDeliveryOption
describe("Test suite: updateDeliveryOption", () => {
    const productIdToUpdate = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";

    beforeEach(() => {
        spyOn(localStorage, "setItem");

        spyOn(localStorage, "getItem").and.callFake(() => {
            return JSON.stringify([{
                productId: productIdToUpdate,
                quantity: 1,
                deliveryOptionId: "1"
            }]);
        });
        loadFromStorage();
    });

    it("Updates the delivery option", () => {
        updateDeliveryOption(productIdToUpdate, "3");
        expect(cart.length).toEqual(1);
        expect(cart[0].productId).toEqual(productIdToUpdate);
        expect(cart[0].quantity).toEqual(1);
        expect(cart[0].deliveryOptionId).toEqual("3");
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith(
            "cart",
            JSON.stringify([{
                productId: productIdToUpdate,
                quantity: 1,
                deliveryOptionId: "3"
            }])
        );
    });
    
    it("Does nothing if the product is not in the cart", () => {
        updateDeliveryOption("n0n-3x1573n7-1d", "3");
        expect(cart.length).toEqual(1);
        expect(cart[0].productId).toEqual(productIdToUpdate);
        expect(cart[0].quantity).toEqual(1);
        expect(cart[0].deliveryOptionId).toEqual("1");
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    });

    it("Does nothing if the delivery option doesn't exist", () => {
        updateDeliveryOption(productIdToUpdate, "n0n-3x1573n7-1d");
        expect(cart.length).toEqual(1);
        expect(cart[0].productId).toEqual(productIdToUpdate);
        expect(cart[0].quantity).toEqual(1);
        expect(cart[0].deliveryOptionId).toEqual("1");
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    });
});