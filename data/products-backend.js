import { formatCurrency } from "../scripts/utils/money.js";

export let products = [];

export function getProduct(productId) {
    // One-line code for finding a product
    return products.find((product) => product.id === productId);
}

// Product class for better code, also parent class
export class Product {
    id;
    image;
    name;
    rating;
    priceCents;

    constructor(productDetails) {
        this.id = productDetails.id;
        this.image = productDetails.image;
        this.name = productDetails.name;
        this.rating = productDetails.rating;
        this.priceCents = productDetails.priceCents;
    }

    getStarsUrl() {
        return `images/ratings/rating-${this.rating.stars * 10}.png`;
    }

    getPrice() {
        return `$${formatCurrency(this.priceCents)}`;
    }

    createExtraInfoHTML() {
        // No extra info because it's not a clothing with no size chart
        return "";
    }
}

// Keyword: `extends` to inherit properties & methods
export class Clothing extends Product {
    sizeChartLink;

    constructor(productDetails) {
        // Calls the constructor of the parent class 
        super(productDetails);
        this.sizeChartLink = productDetails.sizeChartLink;
    }

    // Method overriding: Overridden method from Products to do something different
    createExtraInfoHTML() {
        // super.createExtraInfoHTML(); // If you really want to use the parent's method
        return `
            <a href="${this.sizeChartLink}" target="_blank">
                Size chart
            </a>
        `;
    }
}

// For exercise, made my own class
export class Appliance extends Product {
    instructionsLink;
    warrantyLink;

    constructor(productDetails) {
        super(productDetails);
        this.instructionsLink = productDetails.instructionsLink;
        this.warrantyLink = productDetails.warrantyLink;
    }

    createExtraInfoHTML() {
        return `
            <a href="${this.instructionsLink}" target="_blank">
                Instructions    
            </a>
            <a href="${this.warrantyLink}" target="_blank">
                Warranty
            </a>
        `;
    }
}

export function loadProductsFetch() {
    // Fetch returns/creates a promise
    const promise = fetch(
        "https://supersimplebackend.dev/products"
    ).then((response) => {
        // Response.json is asynchronous and returns a promise
        return response.json()
    }).then((data) => {
        // It will then give the producs data
        products = data.map((productDetails) => {
            switch (productDetails.type) {
                case "clothing":
                    return new Clothing(productDetails);

                case "appliance":
                    return new Appliance(productDetails);

                default:
                    return new Product(productDetails);
            }
        });

        console.log("Products loaded successfully");
    });

    return promise;
}

export function loadProducts(fun) {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("load", () => {
        products = JSON.parse(xhr.response).map((productDetails) => {
            switch (productDetails.type) {
                case "clothing":
                    return new Clothing(productDetails);

                case "appliance":
                    return new Appliance(productDetails);

                default:
                    return new Product(productDetails);
            }
        });

        console.log("Products loaded successfully");

        fun(); // Fun for function - a callback function
    });

    xhr.open("GET", "https://supersimplebackend.dev/products");
    xhr.send();
}