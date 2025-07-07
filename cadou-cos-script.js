/**
 * Ecwid Free Gift Automation Script
 * This script automatically adds a specific free gift product to the cart
 * if it's not already present.
 */

// IMPORTANT: Replace this with the actual Product ID of your free gift.
const FREE_GIFT_PRODUCT_ID = 764956019; // Example: 12345678

// Function to check if the gift is in the cart
function isGiftInCart(cart) {
    if (!cart || !cart.items) {
        return false;
    }
    return cart.items.some(item => item.productId === FREE_GIFT_PRODUCT_ID);
}

// Function to add the gift to the cart
function addFreeGiftToCart() {
    Ecwid.Cart.addProduct({
        id: FREE_GIFT_PRODUCT_ID,
        quantity: 1,
        // Using selectedPrice: 0 ensures it's added as free,
        // especially if your product had a default price set to something other than 0.
        selectedPrice: 0 
    }, function(success, product, cart) {
        if (success) {
            console.log('Free gift added to cart:', product.name);
        } else {
            console.error('Failed to add free gift to cart.');
            // You might want to log this error to an external service
            // or notify yourself if this happens often.
        }
    });
}

// Listen for Ecwid API to be loaded
Ecwid.OnAPILoaded.add(function() {
    console.log("Ecwid JS API is loaded. Checking for free gift...");

    // Initial check when the page loads
    Ecwid.Cart.get(function(cart) {
        if (!isGiftInCart(cart)) {
            addFreeGiftToCart();
        }
    });

    // Listen for cart changes (e.g., if a user removes the item, it gets added back)
    // This is optional, but helps ensure the gift is always there.
    // Be careful with this, as it could annoy users if they explicitly remove it.
    // For "every order," it's generally fine.
    Ecwid.OnCartChanged.add(function(cart) {
        if (!isGiftInCart(cart)) {
            console.log("Free gift missing from cart, re-adding...");
            addFreeGiftToCart();
        }
    });

    // Optional: Also check when the checkout process starts
    Ecwid.OnPageLoaded.add(function(page) {
        if (page.type === 'CHECKOUT') {
            Ecwid.Cart.get(function(cart) {
                if (!isGiftInCart(cart)) {
                    addFreeGiftToCart();
                }
            });
        }
    });
});