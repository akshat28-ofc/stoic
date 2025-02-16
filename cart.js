// Cart functionality
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.renderCart();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.handleCheckout());
        }
    }

    addItem(item) {
        this.items.push(item);
        this.saveCart();
        this.renderCart();
        this.showNotification(`${item.title} added to cart`);
    }

    removeItem(index) {
        const item = this.items[index];
        this.items.splice(index, 1);
        this.saveCart();
        this.renderCart();
        this.showNotification(`${item.title} removed from cart`);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    calculateTotals() {
        const subtotal = this.items.reduce((sum, item) => sum + item.price, 0);
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + tax;
        return { subtotal, tax, total };
    }

    formatPrice(price) {
        return `$${price.toFixed(2)}`;
    }

    renderCart() {
        const cartItems = document.getElementById('cart-items');
        const emptyCart = document.getElementById('empty-cart');
        const cartContainer = document.querySelector('.cart-container');

        if (this.items.length === 0) {
            if (cartContainer) cartContainer.style.display = 'none';
            if (emptyCart) emptyCart.classList.add('visible');
            return;
        }

        if (cartContainer) cartContainer.style.display = 'grid';
        if (emptyCart) emptyCart.classList.remove('visible');

        if (cartItems) {
            cartItems.innerHTML = this.items.map((item, index) => `
                <div class="cart-item">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="item-details">
                        <h3 class="item-title">${item.title}</h3>
                        <span class="item-price">${this.formatPrice(item.price)}</span>
                    </div>
                    <div class="item-actions">
                        <button class="remove-btn" onclick="cart.removeItem(${index})">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        const { subtotal, tax, total } = this.calculateTotals();
        
        document.getElementById('subtotal').textContent = this.formatPrice(subtotal);
        document.getElementById('tax').textContent = this.formatPrice(tax);
        document.getElementById('total').textContent = this.formatPrice(total);
    }

    handleCheckout() {
        // Implement checkout logic here
        this.showNotification('Redirecting to payment...');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'var(--accent)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: '1000',
            opacity: '0',
            transform: 'translateY(20px)',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize cart
window.cart = new Cart();