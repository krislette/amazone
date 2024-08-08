import { formatCurrency } from "../../scripts/utils/money.js";

// Provided by jasmine, and this creates a test suite
describe("Test suite: formatCurrency", () => {
    // Provided by jasmine, and this craetes a test
    it("Converts cents into dollars", () => {
        // Code what the test is
        // Expect let's you compare a value to another value
        expect(formatCurrency(2095)).toEqual("20.95");
    });

    it("Works with 0", () => {
        expect(formatCurrency(0)).toEqual("0.00");
    });

    it("Rounds up to the nearest cent", () => {
        expect(formatCurrency(2000.5)).toEqual("20.01");
    });

    it("Rounds down to the nearest cent", () => {
        expect(formatCurrency(2000.4)).toEqual("20.00");
    });

    it("Works with negative numbers", () => {
        expect(formatCurrency(-800)).toEqual("-8.00");
    });
});