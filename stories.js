// Intersection Observer for story cards
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply fade-in effect to story cards
document.querySelectorAll('.story-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// Stories grid animation
const storiesGrid = document.querySelector('.stories-grid');
const storyCards = document.querySelectorAll('.story-card');

const storiesObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        storiesGrid.classList.add('visible');
        storyCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        });
        storiesObserver.unobserve(storiesGrid);
    }
}, {
    threshold: 0.2
});

storiesObserver.observe(storiesGrid);

// Share story button interaction
const shareButton = document.querySelector('.btn-share');
if (shareButton) {
    shareButton.addEventListener('click', () => {
        // Add click animation
        shareButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            shareButton.style.transform = 'scale(1)';
        }, 100);
        
        // Show form modal (to be implemented)
        showShareModal();
    });
}

// Share story modal
function showShareModal() {
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Share Your Story</h2>
            <form id="share-story-form">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="story">Your Story</label>
                    <textarea id="story" rows="5" required></textarea>
                </div>
                <button type="submit" class="submit-story">Submit Story</button>
            </form>
        </div>
    `;
    
    // Style the modal
    Object.assign(modal.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '1000',
        opacity: '0',
        transition: 'opacity 0.3s ease'
    });
    
    // Style modal content
    const modalContent = modal.querySelector('.modal-content');
    Object.assign(modalContent.style, {
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        maxWidth: '500px',
        width: '90%',
        transform: 'translateY(-20px)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'translateY(0)';
    }, 10);
    
    // Close button functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.style.opacity = '0';
        modalContent.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    });
    
    // Form submission
    const form = modal.querySelector('#share-story-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Handle form submission (to be implemented)
        modal.style.opacity = '0';
        modalContent.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(modal);
            showNotification('Thank you for sharing your story!');
        }, 300);
    });
}

// Notification system
function showNotification(message) {
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