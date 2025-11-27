 // Smooth scroll animations on scroll
 const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all sections
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
  });

  // Add parallax effect to hero image
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-main-image');
    const nav = document.querySelector('.topnav');
    
    if (heroImage && scrolled < 500) {
      heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
    
    if (nav) {
      if (scrolled > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  });

  // Gallery Lightbox Functionality
  document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCounter = document.getElementById('lightboxCounter');
    
    console.log('Gallery items found:', galleryItems.length);
    console.log('Lightbox element:', lightbox);
    
    if (!galleryItems.length || !lightbox || !lightboxImage || !lightboxCounter) {
      console.warn('Gallery lightbox elements not found', {
        galleryItems: galleryItems.length,
        lightbox: !!lightbox,
        lightboxImage: !!lightboxImage,
        lightboxCounter: !!lightboxCounter
      });
      return;
    }
    
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-nav.prev');
    const nextBtn = lightbox.querySelector('.lightbox-nav.next');
    
    let currentIndex = 0;
    const images = Array.from(galleryItems).map((item, idx) => {
      const img = item.querySelector('img');
      if (!img) {
        console.warn('No img found in gallery item', idx);
        return null;
      }
      // Use getAttribute to get the original src, not the resolved URL
      const src = img.getAttribute('src') || img.src;
      return {
        src: src,
        alt: img.getAttribute('alt') || img.alt || 'Gallery image'
      };
    }).filter(img => img !== null);

    console.log('Images array:', images);

    function openLightbox(index) {
      console.log('Opening lightbox at index:', index);
      if (index < 0 || index >= images.length) {
        console.warn('Invalid index:', index);
        return;
      }
      currentIndex = index;
      updateLightboxImage();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      console.log('Lightbox opened, active class added');
    }

    function closeLightbox() {
      console.log('Closing lightbox');
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function updateLightboxImage() {
      const imageData = images[currentIndex];
      if (imageData) {
        lightboxImage.src = imageData.src;
        lightboxImage.alt = imageData.alt;
        lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
        console.log('Updated lightbox image:', imageData.src);
      }
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % images.length;
      updateLightboxImage();
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightboxImage();
    }

    // Open lightbox on gallery item click (both div and img)
    galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      if (!img) return;
      
      // Make both clickable
      item.style.cursor = 'pointer';
      img.style.cursor = 'pointer';
      
      // Add click handler to the item div
      item.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Gallery item clicked, index:', index);
        openLightbox(index);
      });
      
      // Also add to img for redundancy
      img.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Gallery image clicked, index:', index);
        openLightbox(index);
      });
    });

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeLightbox();
      });
    }

    // Navigation buttons
    if (nextBtn) {
      nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showNext();
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showPrev();
      });
    }

    // Close on backdrop click
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });

    // Prevent closing when clicking on image or buttons
    if (lightboxImage) {
      lightboxImage.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }
    
    const lightboxImageWrapper = lightbox.querySelector('.lightbox-image-wrapper');
    if (lightboxImageWrapper) {
      lightboxImageWrapper.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('active')) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        showNext();
      } else if (e.key === 'ArrowLeft') {
        showPrev();
      }
    });
  });