// Quote rotation
const quotes = [
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
];

// Cart functionality
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

// Initialize cart and other functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart first
    window.cart = new Cart();
    
    // Then initialize other functionality
    updateQuote();
    initCarousel();
    
    // Update cart count on page load
    window.cart.updateCartCount();
});

// Rest of the script.js content remains unchanged
function updateQuote() {
    const quoteElement = document.getElementById('dynamic-quote');
    const authorElement = document.getElementById('quote-author');
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    if (quoteElement && authorElement) {
        quoteElement.textContent = `"${randomQuote.text}"`;
        authorElement.textContent = `- ${randomQuote.author}`;
    }
}

// Story box animations
const storyBoxes = document.querySelectorAll('.story-box');
const storyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            storyObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

storyBoxes.forEach(box => {
    storyObserver.observe(box);
});

// Products carousel
const carousel = document.querySelector('.carousel-container');
const prevButton = document.querySelector('.carousel-button.prev');
const nextButton = document.querySelector('.carousel-button.next');
const cards = document.querySelectorAll('.product-card');
let currentIndex = 0;
const cardsToShow = 4;
const cardWidth = 100 / cardsToShow;

// Initialize carousel
function initCarousel() {
    if (!carousel) return;
    
    carousel.style.transform = 'translateX(0)';
    cards.forEach(card => {
        card.style.flex = `0 0 ${cardWidth}%`;
    });
    updateCarouselButtons();
}

// Update carousel buttons state
function updateCarouselButtons() {
    if (!prevButton || !nextButton) return;
    
    prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
    prevButton.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
    
    const maxIndex = cards.length - cardsToShow;
    nextButton.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
    nextButton.style.cursor = currentIndex >= maxIndex ? 'not-allowed' : 'pointer';
}

// Slide carousel
function slideCarousel(direction) {
    const maxIndex = cards.length - cardsToShow;
    
    if (direction === 'prev' && currentIndex > 0) {
        currentIndex--;
    } else if (direction === 'next' && currentIndex < maxIndex) {
        currentIndex++;
    }
    
    const offset = -currentIndex * cardWidth;
    carousel.style.transform = `translateX(${offset}%)`;
    updateCarouselButtons();
}

// Event listeners for carousel buttons
if (prevButton && nextButton) {
    prevButton.addEventListener('click', () => slideCarousel('prev'));
    nextButton.addEventListener('click', () => slideCarousel('next'));
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else if (currentScroll < lastScroll) {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});