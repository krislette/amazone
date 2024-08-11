export function createEmptyCartHTML() {
    // Created empty cart indicator
    return `
        <div class="empty-cart-container">
            <img src="https://m.media-amazon.com/images/G/01/cart/empty/kettle-desaturated._CB445243794_.svg" 
                alt="Empty Cart Icon" class="empty-cart-icon">
            <h2>Your Amazone Cart is empty</h2>
            <p>It looks like you haven't added any items to your cart yet. Browse our products and add something you like.</p>
            <a href="/amazone" class="link-primary">Shop today's deals</a>
        </div>
    `;
}