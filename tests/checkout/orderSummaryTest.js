import { loadFromStorage, cart } from "../../data/cart.js";
import { renderOrderSummary } from "../../scripts/checkout/orderSummary.js";

// Integration Test: Test a whole block of code with lots of units/functions
describe("Test suite: renderOrderSummary", () => {
    // Place variables on top to prevent scoping issues
    const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
    const productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";

    // Jasmine hooks: Lets devs run some code for each test (like a function)
    // 1. beforeEach() = runs code before each test
    // 2. afterEach() = runs code after each test
    // 3. beforeAll() = runs code before all tests
    // 4. afterAll() = runs code after all tests

    // Before each HOOK which will run the function before each of the tests
    beforeEach(() => {
        // Mock this so that local storage is not modified on tests
        spyOn(localStorage, "setItem");

        document.querySelector(".js-test-container").innerHTML = `
            <div class="js-order-summary"></div>
            <div class="js-checkout-header"></div>
            <div class="js-payment-summary"></div>
            <div class="js-modal">
                <div class="modal-content">
                    <button class="js-close-modal-button">OK</button>
                </div>
            </div>
        `;

        // Mocking localstorage: getItem
        spyOn(localStorage, "getItem").and.callFake(() => {
            return JSON.stringify([{
                productId: productId1,
                quantity: 2,
                deliveryOptionId: "1"
            }, {
                productId: productId2,
                quantity: 1,
                deliveryOptionId: "2"
            }]);
        });
        loadFromStorage();

        renderOrderSummary();
    });

    afterEach(() => {
        // Clear HTML so that jasmine page remains clean
        document.querySelector(".js-test-container").innerHTML = "";
    });

    it("Displays the cart", () => {
        // Expect to always check/test something
        expect(
            document.querySelectorAll(".js-cart-item-container").length
        ).toEqual(2);

        // toContain checks if a value CONTAINS a string if there's too many value inside a string
        expect(
            document.querySelector(`.js-product-quantity-${productId1}`).innerText
        ).toContain("Quantity: 2");
 
        expect(
            document.querySelector(`.js-product-quantity-${productId2}`).innerText
        ).toContain("Quantity: 1");

        // Exercise: Expects that the page correctly displays the name
        expect(
            document.querySelector(`.js-product-name-${productId1}`).innerText
        ).toEqual("Black and Gray Athletic Cotton Socks - 6 Pairs");

        expect(
            document.querySelector(`.js-product-name-${productId2}`).innerText
        ).toEqual("Intermediate Size Basketball");

        // Exercise: Expects that the page correctly displays the price
        expect(
            document.querySelector(`.js-product-price-${productId1}`).innerText
        ).toEqual("$10.90");

        expect(
            document.querySelector(`.js-product-price-${productId2}`).innerText
        ).toEqual("$20.95");
    });
    
    it("Removes a product", () => {
        // Tests when delete is clicked using .click (no need to actually click it)
        document.querySelector(`.js-delete-link-${productId1}`).click(); 

        // Test expectation for the length of the cart when an item is removed
        expect(
            document.querySelectorAll(".js-cart-item-container").length
        ).toEqual(1);

        // Test expectation that prod1 is null since it is already removed
        expect(
            document.querySelector(`.js-cart-item-container-${productId1}`)
        ).toEqual(null);
        
        // Test expectation that prod2 is NOT null using .not since it is not removed
        expect(
            document.querySelector(`.js-cart-item-container-${productId2}`)
        ).not.toEqual(null);

        expect(
            document.querySelector(`.js-product-name-${productId2}`).innerText
        ).toEqual("Intermediate Size Basketball");

        expect(
            document.querySelector(`.js-product-price-${productId2}`).innerText
        ).toEqual("$20.95");
        
        expect(cart.length).toEqual(1);
        expect(cart[0].productId).toEqual(productId2);
    });

    // Exercise 16 solution to check if options are showed properly on the page
    it("Updates the delivery option", () => {
        document.querySelector(`.js-delivery-option-${productId1}-3`).click();

        expect(
            document.querySelector(`.js-delivery-option-input-${productId1}-3`).checked
        ).toEqual(true);

        expect(
            document.querySelector(".js-payment-summary-shipping").innerText
        ).toEqual("$14.98");

        expect(
            document.querySelector(".js-payment-summary-total").innerText
        ).toEqual("$63.50");

        expect(cart.length).toEqual(2);
        expect(cart[0].productId).toEqual(productId1);
        expect(cart[0].deliveryOptionId).toEqual("3");
    });
});