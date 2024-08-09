import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

export const deliveryOptions = [{
    id: "1",
    deliveryDays: 7,
    priceCents: 0
}, {
    id: "2",
    deliveryDays: 3,
    priceCents: 499
}, {
    id: "3",
    deliveryDays: 1,
    priceCents: 999
}];

export function getDeliveryOption(deliveryOptionId) {
    // Optimized code with safer handling of user option (when nothing is selected)
    return deliveryOptions.find((option) => option.id === deliveryOptionId) || deliveryOptions[0];
}

function isWeekend(date) {
    const dayOfWeek = date.format("dddd");
    return dayOfWeek === "Saturday" || dayOfWeek === "Sunday";
}

export function calculateDeliveryDate(deliveryOption) {
    let remainingDays = deliveryOption.deliveryDays;
    let deliveryDate = dayjs();

    while (remainingDays > 0) {
        deliveryDate = deliveryDate.add(1, "day");

        // Checker to see if the deliver date is a weekday
        if (!isWeekend(deliveryDate)) {
            remainingDays--;
        }
    }

    return deliveryDate.format("dddd, MMMM D");
}

export function isValidDeliveryOption(deliveryOptionId) {
    // I did a one line return instead of declaring a found var
    return deliveryOptions.find((option) => option.id === deliveryOptionId) !== undefined;
}