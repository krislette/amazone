export const orders = JSON.parse(localStorage.getItem("orders")) || [];

export function addOrder(order) {
    // Adds order on front of the array
    orders.unshift(order);
    saveToStorage();
}

function saveToStorage() {
    localStorage.setItem("orders", JSON.stringify(orders));
}

export function getOrder(orderId) {
    return orders.find((order) => order.id === orderId);
}