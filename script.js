// ================================
// Update DateTime
// ================================
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    document.getElementById('datetime').textContent = now.toLocaleDateString('en-US', options);
}
setInterval(updateDateTime, 1000);
updateDateTime();

// ================================
// Smooth Scroll for Navigation
// ================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ================================
// Scroll Animations (fade-in on view)
// ================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.classList.remove('not-visible');
        } else {
            entry.target.classList.remove('visible');
            entry.target.classList.add('not-visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section, .work-carousel-container').forEach(section => {
    observer.observe(section);
});

// ================================
// Custom Cursor for Desktop
// ================================
document.addEventListener('DOMContentLoaded', () => {
    if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        document.querySelectorAll(".work-item, a, button, h1, .resume-item, .skills-list").forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.opacity = "0.2";
                cursor.style.height = "180px";
                cursor.style.width = "180px";
            });
            element.addEventListener('mouseleave', () => {
                cursor.style.opacity = "1";
                cursor.style.height = "80px";
                cursor.style.width = "80px";
            });
        });
    }
});

// ================================
// RNCS H1 Mousemove Radial Gradient Effect
// ================================
document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('h1');
    if (title) {
        title.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = title.getBoundingClientRect();
            const mouseX = e.clientX - left;
            const mouseY = e.clientY - top;
            const percentageX = (mouseX / width) * 100;
            const percentageY = (mouseY / height) * 100;

            title.style.background = `radial-gradient(circle at ${percentageX}% ${percentageY}%, #1c1c1c, #ffffff, #1c1c1c)`;
            title.style.backgroundClip = "text";
            title.style.webkitBackgroundClip = "text";
        });
    }
});

// ================================
// Profile Image Switch on Click
// ================================
document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.getElementById("profile-image");
    if (profileImage) {
        const firstImage = "img/profile1.jpg";
        const secondImage = "img/profile2.jpg";

        profileImage.src = firstImage;

        profileImage.addEventListener('click', () => {
            profileImage.src = profileImage.src.includes(firstImage) ? secondImage : firstImage;
        });
    }
});

// ================================
// Hover Video for Work Section (Desktop only)
// ================================
document.addEventListener('DOMContentLoaded', () => {
    const floatingPreview = document.getElementById('floating-preview');
    const workItems = document.querySelectorAll('.work-item');
    
    const isMobile = ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    if (!isMobile) {
        workItems.forEach(item => {
            const videoSrc = item.getAttribute('data-video-src');
            
            item.addEventListener('mouseenter', () => {
                if (videoSrc) {
                    floatingPreview.style.transition = 'none';
                    floatingPreview.style.transform = 'translateY(-50%) scale(0.8)';
                    floatingPreview.style.opacity = '0';
                    
                    setTimeout(() => {
                        floatingPreview.src = videoSrc;
                        floatingPreview.play();
                        floatingPreview.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        floatingPreview.style.opacity = '1';
                        floatingPreview.style.transform = 'translateY(-50%) scale(1)';
                    }, 50);
                }
            });
            
            item.addEventListener('mouseleave', () => {
                floatingPreview.pause();
                floatingPreview.currentTime = 0;
                floatingPreview.style.opacity = '0';
                floatingPreview.style.transform = 'translateY(-50%) scale(0.8)';
            });
        });
    } else {
        workItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    if (isMobile && item.getAttribute('data-video-src')) {
                        e.preventDefault();
                        item.classList.add('active');
                        setTimeout(() => {
                            item.classList.remove('active');
                        }, 300);
                        console.log(`Clicked on ${item.querySelector('.work-title').textContent}`);
                    }
                });
            });
    }
});
  
// ================================
// Gallery Lightbox Functionality (Updated for Mobile Swipe)
// ================================
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('modal');
    const lightboxImage = document.getElementById('modal-image');
    const closeButton = document.querySelector('.modal-close');
    const galleryItems = document.querySelectorAll('.gallery-img');
    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    
    const prevButton = document.createElement('button');
    prevButton.className = 'modal-nav modal-prev';
    prevButton.innerHTML = '&larr;';
    lightbox.appendChild(prevButton);
    
    const nextButton = document.createElement('button');
    nextButton.className = 'modal-nav modal-next';
    nextButton.innerHTML = '&rarr;';
    lightbox.appendChild(nextButton);
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            currentIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    closeButton.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; 
        }
    });
    
    lightboxImage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    lightboxImage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
        const threshold = 50;
        
        if (touchEndX < touchStartX - threshold) {
            navigate(1);
        } else if (touchEndX > touchStartX + threshold) {
            navigate(-1);
        }
    }
    
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; 
        } else if (e.key === 'ArrowLeft') {
            navigate(-1);
        } else if (e.key === 'ArrowRight') {
            navigate(1);
        }
    });
    
    prevButton.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(-1);
    });
    
    nextButton.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(1);
    });
    
    function updateLightboxImage() {
        const activeImage = galleryItems[currentIndex];
        lightboxImage.src = activeImage.src;
        lightboxImage.alt = activeImage.alt;
    }
    
    function navigate(direction) {
        currentIndex += direction;
        
        if (currentIndex >= galleryItems.length) {
            currentIndex = 0;
        } else if (currentIndex < 0) {
            currentIndex = galleryItems.length - 1;
        }
        
        updateLightboxImage();
        
        lightboxImage.classList.add('swipe-animation');
        setTimeout(() => {
            lightboxImage.classList.remove('swipe-animation');
        }, 300);
    }
});
  
  
  



lucide.createIcons();
