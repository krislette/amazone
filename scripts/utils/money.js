export function formatCurrency(priceCents) {
    // toFixed has problems when it comes to rounding 
    // so round the number first before applying toFixed
    return (Math.round(priceCents) / 100).toFixed(2);
}