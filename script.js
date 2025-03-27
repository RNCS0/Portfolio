//Gallery
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const galleryImages = document.querySelectorAll('.gallery-img');
    let currentIndex = 0;

    function openModal(index) {
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10);
        updateModalImage(index);
    }

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            modalImg.src = '';
        }, 300);
    }
    const images = document.querySelectorAll('.gallery-img');
        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
        });

    function updateModalImage(index) {
        const img = galleryImages[index];
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        
        // Add caption if available
        const caption = img.parentElement.querySelector('.gallery-caption');
        if (caption) {
            if (!modal.querySelector('.modal-caption')) {
                const modalCaption = document.createElement('div');
                modalCaption.className = 'modal-caption';
                modal.appendChild(modalCaption);
            }
            modal.querySelector('.modal-caption').textContent = caption.textContent;
        }
        
        currentIndex = index;
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        updateModalImage(currentIndex);
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        updateModalImage(currentIndex);
    }

    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => openModal(index));
    });

    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('show')) {
            if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'Escape') {
                closeModal();
            }
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    modal.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, {passive: false});
});

document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('show')) {
        switch(e.key) {
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
            case 'Escape':
                closeModal();
                break;
            case 'Home':
                updateModalImage(0);
                break;
            case 'End':
                updateModalImage(galleryImages.length - 1);
                break;
        }
    }

    let touchStartX = 0;
    let touchEndX = 0;

    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    modal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            showNextImage();
        }
        if (touchEndX > touchStartX + 50) {
            showPrevImage();
        }
    }
});

//Resume
document.addEventListener('DOMContentLoaded', () => {
    const resumeSections = document.querySelectorAll('.resume-section');
    
    const resumeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    resumeSections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        resumeObserver.observe(section);
    });
    
    const skillsItems = document.querySelectorAll('.skills-list li');
    skillsItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.05)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
        });
    });
});
// Update datetime
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
    const dateTimeString = now.toLocaleDateString('en-US', options);
    document.getElementById('datetime').textContent = dateTimeString;
}

// Update time every second
setInterval(updateDateTime, 1000);
updateDateTime(); // Initial call

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll-based animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.classList.remove('not-visible');
        } else {
            entry.target.classList.remove('visible'); // Remove visibility
            entry.target.classList.add('not-visible');
        }
    });
}, {
    threshold: 0.1
});


document.querySelectorAll('section, .work-carousel-container').forEach(section => {
    observer.observe(section);
});

// Automatic horizontal scrolling for work carousel
const carousels = document.querySelectorAll('.work-carousel');
let scrollIntervalId;

function cloneCarouselItems() {
    carousels.forEach(carousel => {
        const items = carousel.querySelectorAll('.work-item');
        items.forEach(item => {
            const clone = item.cloneNode(true);
            carousel.appendChild(clone);
        });
    });
}

function autoScroll() {
    carousels.forEach(carousel => {
        if (!carousel.matches(':hover')) { // Only scroll if not hovered
            let scrollPosition = parseFloat(carousel.dataset.scrollPos) || 0;
            const scrollWidth = carousel.scrollWidth / 2;
            const itemWidth = carousel.querySelector('.work-item').offsetWidth;
            const maxScroll = scrollWidth - itemWidth;
            
            scrollPosition += 1;
            
            if (scrollPosition >= maxScroll) {
                scrollPosition = 0;
                carousel.style.transition = 'none';
                carousel.style.transform = `translateX(0)`;
                void carousel.offsetWidth;
                carousel.style.transition = 'transform 0.5s ease';
            }
            
            carousel.style.transform = `translateX(-${scrollPosition}px)`;
            carousel.dataset.scrollPos = scrollPosition;
        }
    });
}

function initCarousels() {
    cloneCarouselItems();
    
    function autoScroll() {
        carousels.forEach(carousel => {
            if (!carousel.matches(':hover')) {
                let scrollPosition = parseFloat(carousel.dataset.scrollPos) || 0;
                const scrollWidth = carousel.scrollWidth / 2;
                const itemWidth = carousel.querySelector('.work-item').offsetWidth;
                const maxScroll = scrollWidth - itemWidth;
                
                scrollPosition += 1;
                
                if (scrollPosition >= maxScroll) {
                    scrollPosition = 0;
                    carousel.style.transition = 'none';
                    carousel.style.transform = `translateX(0)`;
                    // Force reflow
                    void carousel.offsetWidth;
                }
                
                carousel.style.transform = `translateX(-${scrollPosition}px)`;
                carousel.dataset.scrollPos = scrollPosition;
                
                // Only add transition after reset
                if (scrollPosition > 0) {
                    carousel.style.transition = 'transform 0.5s ease';
                }
            }
        });
        requestAnimationFrame(autoScroll);
    }
    
    requestAnimationFrame(autoScroll);
    
    carousels.forEach(carousel => {
        const images = carousel.querySelectorAll('img');
        let isTouching = false;
        
        carousel.addEventListener('mouseenter', () => {
            isTouching = true;
        });
        
        carousel.addEventListener('mouseleave', () => {
            isTouching = false;
        });
        
        carousel.addEventListener('touchstart', () => {
            isTouching = true;
        }, {passive: true});
        
        carousel.addEventListener('touchend', () => {
            isTouching = false;
        }, {passive: true});
        
        images.forEach(img => {
            img.addEventListener('mouseenter', () => {
                isTouching = true;
            });
            
            img.addEventListener('mouseleave', () => {
                isTouching = false;
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', initCarousels);



document.querySelectorAll('.work-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.opacity = '1';
        item.style.boxShadow = '0px 0px 10px 3px rgb(112, 112, 112)';
        item.style.transition = '0.5s ease';
        item.style.transform = 'scale(1.05)';
    });
    item.addEventListener('mouseleave', () => {
        item.style.opacity = '0.5';
        item.style.boxShadow = 'none';
        item.style.transition = '0.5s ease';
        item.style.transform = 'scale(1)';
    });
});


lucide.createIcons();

document.addEventListener("DOMContentLoaded", () => {
    const profileImage = document.getElementById("profile-image");

    const firstImage = "img/profile1.jpg";
    const secondImage = "img/profile2.jpg"; 

    profileImage.src = firstImage;

    profileImage.addEventListener("click", () => {
        profileImage.src = profileImage.src.includes(firstImage) ? secondImage : firstImage;
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector("h1");

    title.addEventListener("mousemove", (e) => {
        const { left, top, width, height } = title.getBoundingClientRect();
        const mouseX = e.clientX - left;
        const mouseY = e.clientY - top;
        const percentageX = (mouseX / width) * 100;
        const percentageY = (mouseY / height) * 100; 

        title.style.background = `radial-gradient(circle at ${percentageX}% ${percentageY}%, #1c1c1c, #ffffff, #1c1c1c)`;
        title.style.backgroundClip = "text";
        title.style.webkitBackgroundClip = "text";
    });
});

//Mouse Circle
document.addEventListener("DOMContentLoaded", () => {
    if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
        const cursor = document.createElement("div");
        cursor.classList.add("custom-cursor");
        document.body.appendChild(cursor);

        document.addEventListener("mousemove", (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        });

        document.querySelectorAll(".work-item, a, button, h1, .resume-item, .skills-list").forEach(element => {
            element.addEventListener("mouseenter", () => {
                cursor.style.opacity = "0.2";
                cursor.style.height = "180px";
                cursor.style.width = "180px";
            });
            element.addEventListener("mouseleave", () => {
                cursor.style.opacity = "1";
                cursor.style.height = "80px";
                cursor.style.width = "80px";
            });
        });
    }
});


// Responsive Carousel
carousels.forEach(carousel => {
    let touchStartX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, {passive: true});
    
    carousel.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        if (touchEndX < touchStartX - 50) {
            // Simulate right swipe
            carousel.scrollLeft += 200;
        } else if (touchEndX > touchStartX + 50) {
            // Simulate left swipe
            carousel.scrollLeft -= 200;
        }
    }, {passive: true});
});

// Optimize modal for mobile
const modalContent = document.querySelector('.modal-content');
window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        modalContent.style.maxHeight = '80vh';
        modalContent.style.maxWidth = '90vw';
    } else {
        modalContent.style.maxHeight = '100%';
        modalContent.style.maxWidth = '100%';
    }
});



