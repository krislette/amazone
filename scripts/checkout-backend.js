import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";
import { loadProducts } from "../data/products-backend.js";

// Using a callback function
loadProducts(() => {
    renderOrderSummary();
    renderPaymentSummary();
    renderCheckoutHeader();
});

// Used a promise instead of a callback function
// Promises help keep code flat and avoid too much nesting
// As opposed to using callback functions
new Promise((resolve) => {
    loadProducts(() => {
        resolve();
    });

}).then(() => {
    renderOrderSummary();
    renderPaymentSummary();
    renderCheckoutHeader();
});

// Three steps using promises
new Promise((resolve) => {
    loadProducts(() => {
        // Resolves can take a parameter
        resolve("value");
    });

// And then that can be shared to a then(parameter)
// To let us share values across steps
}).then((value) => {
    console.log(value);
    return new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    });

}).then(() => {
    renderOrderSummary();
    renderPaymentSummary();
    renderCheckoutHeader();
});


// Using Promise.all to let us run multiple promises
// at the same time and wait for ALL OF THEM to finish
// Array of promises
Promise.all([
    new Promise((resolve) => {
        loadProducts(() => {
            // Resolves can take a parameter
            resolve("value");
        });
    }),
    new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    })

    // .then() adds a next step to a promise
]).then((values) => {
    console.log(values);
    renderOrderSummary();
    renderPaymentSummary();
    renderCheckoutHeader();
});