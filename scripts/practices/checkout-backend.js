import { renderOrderSummary } from "../checkout/orderSummary.js";
import { renderPaymentSummary } from "../checkout/paymentSummary.js";
import { renderCheckoutHeader } from "../checkout/checkoutHeader.js";
import { loadProducts, loadProductsFetch } from "../../data/products-backend.js";

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

// A version and final version of the code that uses loadProductsFetch
// which returns a promise automatically
Promise.all([
    loadProductsFetch(),
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

// Async makes a function return a promise
// Async and await are also kinda like shortcuts
// for promises because promises are long
// as can be seen from above
async function loadPage() {
    try {
        // Instead of using .then for the next step,
        // you can just type await in front
        await loadProductsFetch(); // Returns a promise
        
        // Value can be caught using a variable instead of then
        const value = await new Promise((resolve, reject) => {
            // In promises, you can't use `throw` because it doesnt work in the future
            // instead, you can use `reject` to let you essentially ~throw and error
            // into the future (asynchronously)
            loadCart(() => {
                resolve("value3");
            });
        })
        console.log(value);
    } catch (error) {
        console.log("Unexpected error. Please try again later");
    }

    renderOrderSummary();
    renderPaymentSummary();
    renderCheckoutHeader();
}

loadPage();