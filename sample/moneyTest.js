import { formatCurrency } from "../scripts/utils/money.js";

// Automated testing
console.log("Test suite: formatCurrency");

// Replaced the if statement from course to a ternary bc it's easier
console.log("Converts cents into dollars:");
console.log(formatCurrency(2095) === "20.95" ? "Passed" : "Failed");

// Test case 2
console.log("Works with 0:");
console.log(formatCurrency(0) === "0.00" ? "Passed" : "Failed");

// Test case 3
console.log("Rounds up to the nearest cent:");
console.log(formatCurrency(2000.5) === "20.01" ? "Passed" : "Failed");

// Group of related tests = test suite
// Aumated testing like this is still long, so a
// `Testing Framework` can be used - Jasmine framework