import { Product, Clothing, Appliance } from "../../data/products.js";

// Copied this entirely because I'm too lazy to 
// create a test suite for classes (exercise)
// Note: Original exercise has few errors such as
// commas instead of colons, but I've fixed them
describe("Test suite: Product", () => {
    let product;

    beforeEach(() => {
        product = new Product({
            id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            image: "images/products/athletic-cotton-socks-6-pairs.jpg",
            name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
            rating: {
                stars: 4.5,
                count: 87,
            },
            priceCents: 1090,
            keywords: ["socks", "sports", "apparel"],
        });
    });

    it("Has the correct properties", () => {
        expect(product.id).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
        expect(product.image).toEqual(
            "images/products/athletic-cotton-socks-6-pairs.jpg"
        );
        expect(product.name).toEqual(
            "Black and Gray Athletic Cotton Socks - 6 Pairs"
        );
        expect(product.rating).toEqual({
            stars: 4.5,
            count: 87,
        });
        expect(product.priceCents).toEqual(1090);
    });

    it("Gets the stars url", () => {
        expect(product.getStarsUrl()).toEqual("images/ratings/rating-45.png");
    });

    it("Gets the price", () => {
        expect(product.getPrice()).toEqual("$10.90");
    });

    it("Does not display any extra info", () => {
        expect(product.createExtraInfoHTML()).toEqual("");
    });
});

describe("Test suite: Clothing", () => {
    let clothing;

    beforeEach(() => {
        clothing = new Clothing({
            id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
            image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
            name: "Adults Plain Cotton T-Shirt - 2 Pack",
            rating: {
                stars: 4.5,
                count: 56,
            },
            priceCents: 799,
            keywords: ["tshirts", "apparel", "mens"],
            type: "clothing",
            sizeChartLink: "images/clothing-size-chart.png",
        });
    });

    it("Has the correct properties", () => {
        // Check if inheritance worked correctly.
        expect(clothing.id).toEqual("83d4ca15-0f35-48f5-b7a3-1ea210004f2e");
        expect(clothing.image).toEqual(
            "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg"
        );

        expect(clothing.sizeChartLink).toEqual(
            "images/clothing-size-chart.png"
        );
    });

    it("Gets the stars url", () => {
        expect(clothing.getStarsUrl()).toEqual("images/ratings/rating-45.png");
    });

    it("Gets the price", () => {
        expect(clothing.getPrice()).toEqual("$7.99");
    });

    it("Displays a size chart link in createExtraInfoHTML", () => {
        // It's hard to match a multiline string exactly, so we"ll
        // just check if the result contains certain strings.
        expect(clothing.createExtraInfoHTML()).toContain(
            `<a href="images/clothing-size-chart.png" target="_blank">`
        );

        // Check the text of the link is correct.
        expect(clothing.createExtraInfoHTML()).toContain("Size chart");
    });
});

describe("Test suite: Appliance", () => {
    let appliance;

    beforeEach(() => {
        appliance = new Appliance({
            id: "54e0eccd-8f36-462b-b68a-8182611d9add",
            image: "images/products/black-2-slot-toaster.jpg",
            name: "2 Slot Toaster - Black",
            rating: {
                stars: 5,
                count: 2197,
            },
            priceCents: 1899,
            keywords: ["toaster", "kitchen", "appliances"],
            type: "appliance",
            instructionsLink: "images/appliance-instructions.png",
            warrantyLink: "images/appliance-warranty.png",
        });
    });

    it("Has the correct properties", () => {
        expect(appliance.id).toEqual("54e0eccd-8f36-462b-b68a-8182611d9add");
        expect(appliance.image).toEqual(
            "images/products/black-2-slot-toaster.jpg"
        );

        expect(appliance.instructionsLink).toEqual(
            "images/appliance-instructions.png"
        );
        expect(appliance.warrantyLink).toEqual("images/appliance-warranty.png");
    });

    it("Gets the stars url", () => {
        expect(appliance.getStarsUrl()).toEqual("images/ratings/rating-50.png");
    });

    it("Gets the price", () => {
        expect(appliance.getPrice()).toEqual("$18.99");
    });

    it("Displays instructions and warranty in createExtraInfoHTML", () => {
        expect(appliance.createExtraInfoHTML()).toContain(
            `<a href="images/appliance-instructions.png" target="_blank">`
        );
        expect(appliance.createExtraInfoHTML()).toContain("Instructions");

        expect(appliance.createExtraInfoHTML()).toContain(
            `<a href="images/appliance-warranty.png" target="_blank">`
        );
        expect(appliance.createExtraInfoHTML()).toContain("Warranty");
    });
});