// Category filtering
const categoryButtons = document.querySelectorAll('.category-btn');
const productCards = document.querySelectorAll('.product-card');

// Initialize cart first
window.cart = new Cart();

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const category = button.dataset.category;
        
        productCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Products grid animation
const productsGrid = document.querySelector('.products-grid');

const productsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        productsGrid.classList.add('visible');
        productCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        });
        productsObserver.unobserve(productsGrid);
    }
}, {
    threshold: 0.2
});

productsObserver.observe(productsGrid);

// Cart class definition
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.updateCartCount();
        this.setupEventListeners();
        this.setupStorageListener();
    }

    setupEventListeners() {
        const cartButtons = document.querySelectorAll('.btn-cart');
        cartButtons.forEach(button => {
            // Remove existing listeners
            button.replaceWith(button.cloneNode(true));
        });

        // Add new listeners
        document.querySelectorAll('.btn-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = button.closest('.product-card');
                this.addItem(productCard);
                
                // Add animation effect
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 100);
            });
        });
    }

    setupStorageListener() {
        // Listen for cart updates from other tabs/windows
        window.addEventListener('storage', (e) => {
            if (e.key === 'cart') {
                this.items = JSON.parse(e.newValue || '[]');
                this.updateCartCount();
            }
        });
    }

    addItem(productCard) {
        if (!productCard) return;

        const title = productCard.querySelector('h3')?.textContent;
        const priceElement = productCard.querySelector('.price');
        const imageElement = productCard.querySelector('img');

        if (!title || !priceElement || !imageElement) return;

        const price = parseFloat(priceElement.textContent.replace('$', ''));
        const image = imageElement.src;
        
        const item = {
            id: Date.now(),
            title,
            price,
            image
        };
        
        this.items.push(item);
        this.saveCart();
        this.updateCartCount();
        this.showNotification(`${title} added to cart`);
    }

    removeItem(id) {
        const index = this.items.findIndex(item => item.id === id);
        if (index > -1) {
            const item = this.items[index];
            this.items.splice(index, 1);
            this.saveCart();
            this.updateCartCount();
            this.showNotification(`${item.title} removed from cart`);
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const cartIcons = document.querySelectorAll('.cart-icon');
        cartIcons.forEach(cartIcon => {
            // Remove existing count
            const existingCount = cartIcon.querySelector('.cart-count');
            if (existingCount) {
                existingCount.remove();
            }

            // Add new count if there are items
            if (this.items.length > 0) {
                const cartCount = document.createElement('div');
                cartCount.className = 'cart-count';
                cartCount.textContent = this.items.length;
                
                // Delay adding visible class for animation
                requestAnimationFrame(() => {
                    cartCount.classList.add('visible');
                });
                
                cartIcon.appendChild(cartCount);
            }
        });
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
        
        // Trigger animation
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        });
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + item.price, 0);
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    // Update cart count on page load
    window.cart.updateCartCount();
});