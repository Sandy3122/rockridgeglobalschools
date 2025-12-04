/**
 * WhatsApp Configuration
 * Branch-specific WhatsApp numbers
 */
const WHATSAPP_CONFIG = {
  bachupally: {
    phone: '918367677799',
    display: '083676 77799',
    address: 'PLOT NO 855/A, Lahari Green Park Rd, opp. Gothik Pangea, Bowrampet, Bachupally, Hyderabad, Telangana 500090'
  },
  manikonda: {
    phone: '917337477799',
    display: '073374 77799',
    address: 'Plot No: #4-13/29/3, Tanasha Nagar Huda colony, Near Baptist Church, opp. Apmas, Dream Valley Rd, Manikonda, Telangana 500089'
  }
};

/**
 * Detect which branch page the form is submitted from
 * @returns {string} Branch name (Bachupally, Manikonda, or Unknown)
 */
function detectSourceBranch() {
  const body = document.body;
  const url = window.location.href.toLowerCase();
  
  // Check body class
  if (body.classList.contains('bachupally-page')) {
    return 'Bachupally';
  }
  if (body.classList.contains('manikonda-page')) {
    return 'Manikonda';
  }
  
  // Fallback: check URL path
  if (url.includes('bachupally')) {
    return 'Bachupally';
  }
  if (url.includes('manikonda')) {
    return 'Manikonda';
  }
  
  return 'Unknown';
}

/**
 * Get WhatsApp number based on preferred branch or source branch
 * @param {string} preferredBranch - Preferred branch from form
 * @param {string} sourceBranch - Source branch (page location)
 * @returns {string} WhatsApp phone number
 */
function getWhatsAppNumber(preferredBranch, sourceBranch) {
  // If preferred branch is specified, use that
  if (preferredBranch && preferredBranch.toLowerCase().includes('bachupally')) {
    return WHATSAPP_CONFIG.bachupally.phone;
  }
  if (preferredBranch && preferredBranch.toLowerCase().includes('manikonda')) {
    return WHATSAPP_CONFIG.manikonda.phone;
  }
  
  // Otherwise, use source branch
  if (sourceBranch === 'Bachupally') {
    return WHATSAPP_CONFIG.bachupally.phone;
  }
  if (sourceBranch === 'Manikonda') {
    return WHATSAPP_CONFIG.manikonda.phone;
  }
  
  // Default to Bachupally
  return WHATSAPP_CONFIG.bachupally.phone;
}

/**
 * Get branch details for WhatsApp message
 * @param {string} preferredBranch - Preferred branch from form
 * @param {string} sourceBranch - Source branch (page location)
 * @returns {object} Branch details object
 */
function getBranchDetails(preferredBranch, sourceBranch) {
  // If preferred branch is specified, use that
  if (preferredBranch && preferredBranch.toLowerCase().includes('bachupally')) {
    return WHATSAPP_CONFIG.bachupally;
  }
  if (preferredBranch && preferredBranch.toLowerCase().includes('manikonda')) {
    return WHATSAPP_CONFIG.manikonda;
  }
  
  // Otherwise, use source branch
  if (sourceBranch === 'Bachupally') {
    return WHATSAPP_CONFIG.bachupally;
  }
  if (sourceBranch === 'Manikonda') {
    return WHATSAPP_CONFIG.manikonda;
  }
  
  // Default to Bachupally
  return WHATSAPP_CONFIG.bachupally;
}

/**
 * Format form data into a neat WhatsApp message
 * @param {object} data - Form data object
 * @param {object} branchDetails - Branch details object
 * @returns {string} Formatted WhatsApp message
 */
function formatWhatsAppMessage(data, branchDetails) {
  const branchName = data.preferredBranch && data.preferredBranch !== 'Either branch' 
    ? data.preferredBranch 
    : `${data.sourceBranch} Branch`;
  
  // Format phone number - ensure it has +91 prefix
  let formattedPhone = data.phone.trim();
  const phoneDigits = formattedPhone.replace(/\D/g, '');
  if (phoneDigits.length === 10) {
    formattedPhone = `+91 ${phoneDigits}`;
  } else if (phoneDigits.length > 10 && !formattedPhone.startsWith('+')) {
    formattedPhone = `+${phoneDigits}`;
  }
  
  let message = `*New Enquiry - Rockridge Global Preschool*\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `*Parent's Name:* ${data.parentName}\n\n`;
  message += `*Mobile Number:* ${formattedPhone}\n\n`;
  message += `*Preferred Branch:* ${branchName}\n\n`;
  
  if (data.childAge) {
    message += `*Child's Age:* ${data.childAge}\n\n`;
  }
  
  if (data.preferredTime && data.preferredTime !== 'Any time') {
    message += `*Preferred Contact Time:* ${data.preferredTime}\n\n`;
  }
  
  if (data.message) {
    message += `*Message:* ${data.message}\n\n`;
  }
  
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `*Branch Details:*\n`;
  message += `${branchName}\n`;
  message += `Phone: ${branchDetails.display}\n`;
  message += `Address: ${branchDetails.address}\n\n`;
  message += `Submitted: ${data.timestamp}`;
  
  return message;
}

 // Form submission handler
 function handleFormSubmit(form, formType) {
   return async function(e) {
     e.preventDefault();
     
     // Basic form validation
     const formData = new FormData(form);
     const parentName = formData.get('parentName') || formData.get('heroParentName') || '';
     const phone = formData.get('phone') || formData.get('heroPhone') || '';
     
     if (!parentName.trim()) {
       showFormMessage(form, 'error', 'Please enter your name.');
       return;
     }
     
     if (!phone.trim()) {
       showFormMessage(form, 'error', 'Please enter your mobile number.');
       return;
     }
     
     // Basic phone validation (should be at least 10 digits)
     const phoneDigits = phone.replace(/\D/g, '');
     if (phoneDigits.length < 10) {
       showFormMessage(form, 'error', 'Please enter a valid mobile number.');
       return;
     }
     
     const submitButton = form.querySelector('button[type="submit"]');
     const originalButtonText = submitButton.textContent;
     
     // Disable submit button and show loading state
     submitButton.disabled = true;
     submitButton.textContent = 'Sending...';
     
    // Detect source branch (which page the form was submitted from)
    const sourceBranch = detectSourceBranch();
    
    // Collect form data
    const data = {
      parentName: parentName.trim(),
      phone: phone.trim(),
      preferredBranch: formData.get('preferredBranch') || formData.get('heroPreferredBranch') || '',
      childAge: formData.get('childAge') || formData.get('heroChildAge') || '',
      preferredTime: formData.get('preferredTime') || formData.get('heroPreferredTime') || '',
      message: (formData.get('message') || formData.get('heroMessage') || '').trim(),
      formType: formType,
      sourceBranch: sourceBranch,
      pageUrl: window.location.href,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    
    try {
      // Get branch details and WhatsApp number
      const branchDetails = getBranchDetails(data.preferredBranch, data.sourceBranch);
      const whatsappNumber = getWhatsAppNumber(data.preferredBranch, data.sourceBranch);
      
      // Format WhatsApp message
      const whatsappMessage = formatWhatsAppMessage(data, branchDetails);
      
      // Encode message for URL
      const encodedMessage = encodeURIComponent(whatsappMessage);
      
      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      // Open WhatsApp in a new window/tab
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      // Show success message
      showFormMessage(form, 'success', 'Opening WhatsApp... Please send the message to complete your enquiry.');
      
      // Reset form after a short delay
      setTimeout(() => {
        form.reset();
      }, 1000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Show error message
      showFormMessage(form, 'error', 'Sorry, there was an error. Please call us directly or try again later.');
    } finally {
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
   };
 }
 
 // Show form message (success or error)
 function showFormMessage(form, type, message) {
   // Remove any existing messages
   const existingMessage = form.querySelector('.form-message');
   if (existingMessage) {
     existingMessage.remove();
   }
   
   // Create message element
   const messageEl = document.createElement('div');
   messageEl.className = `form-message form-message-${type}`;
   messageEl.textContent = message;
   messageEl.style.cssText = `
     padding: 12px 16px;
     margin-top: 16px;
     border-radius: 8px;
     font-size: 0.9rem;
     ${type === 'success' 
       ? 'background-color: #d1fae5; color: #065f46; border: 1px solid #10b981;' 
       : 'background-color: #fee2e2; color: #991b1b; border: 1px solid #ef4444;'
     }
   `;
   
   // Insert message before submit button or at the end of form
   const submitButton = form.querySelector('button[type="submit"]');
   if (submitButton && submitButton.parentElement) {
     submitButton.parentElement.insertBefore(messageEl, submitButton);
   } else {
     form.appendChild(messageEl);
   }
   
   // Auto-remove message after 5 seconds
   setTimeout(() => {
     if (messageEl.parentElement) {
       messageEl.remove();
     }
   }, 5000);
 }

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

  // Gallery and Feature Images Lightbox Functionality
  document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const featureCards = document.querySelectorAll('.feature-card');
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCounter = document.getElementById('lightboxCounter');
    
    console.log('Gallery items found:', galleryItems.length);
    console.log('Feature cards found:', featureCards.length);
    console.log('Lightbox element:', lightbox);
    
    if (!lightbox || !lightboxImage || !lightboxCounter) {
      console.warn('Lightbox elements not found', {
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
    const images = [];
    
    // Collect gallery images
    Array.from(galleryItems).forEach((item, idx) => {
      const img = item.querySelector('img');
      if (!img) {
        console.warn('No img found in gallery item', idx);
        return;
      }
      const src = img.getAttribute('src') || img.src;
      images.push({
        src: src,
        alt: img.getAttribute('alt') || img.alt || 'Gallery image',
        type: 'gallery',
        index: idx
      });
    });
    
    // Collect feature card images
    Array.from(featureCards).forEach((card, idx) => {
      const img = card.querySelector('.feature-image');
      if (!img) {
        console.warn('No feature image found in card', idx);
        return;
      }
      const src = img.getAttribute('src') || img.src;
      images.push({
        src: src,
        alt: img.getAttribute('alt') || img.alt || 'Feature image',
        type: 'feature',
        index: idx
      });
    });

    console.log('Total images array:', images.length);

    function openLightbox(index) {
      console.log('Opening lightbox at index:', index);
      if (images.length === 0) {
        console.warn('No images available for lightbox');
        return;
      }
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
      
      // Find the image index in the combined images array
      const imageIndex = images.findIndex(imgData => 
        imgData.type === 'gallery' && imgData.index === index
      );
      
      if (imageIndex === -1) return;
      
      // Make both clickable
      item.style.cursor = 'pointer';
      img.style.cursor = 'pointer';
      
      // Add click handler to the item div
      item.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Gallery item clicked, index:', imageIndex);
        openLightbox(imageIndex);
      });
      
      // Also add to img for redundancy
      img.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Gallery image clicked, index:', imageIndex);
        openLightbox(imageIndex);
      });
    });
    
    // Open lightbox on feature card image click
    featureCards.forEach((card, index) => {
      const img = card.querySelector('.feature-image');
      if (!img) return;
      
      // Find the image index in the combined images array
      const imageIndex = images.findIndex(imgData => 
        imgData.type === 'feature' && imgData.index === index
      );
      
      if (imageIndex === -1) return;
      
      // Make only the image clickable (not the entire card to avoid accidental clicks)
      img.style.cursor = 'pointer';
      
      // Add click handler to the image
      img.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Feature image clicked, index:', imageIndex);
        openLightbox(imageIndex);
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

  // Form Submission Handlers
  document.addEventListener('DOMContentLoaded', function() {
    // Hero form (Quick Enquiry)
    const heroForm = document.getElementById('heroEnquiryForm');
    if (heroForm) {
      heroForm.addEventListener('submit', handleFormSubmit(heroForm, 'Quick Enquiry (Hero)'));
    }
    
    // Contact form
    const contactForm = document.getElementById('contactEnquiryForm');
    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit(contactForm, 'Contact Form'));
    }
  });

  // Testimonials Carousel
  document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('testimonialsCarousel');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const dotsContainer = document.getElementById('testimonialsDots');

    if (!carousel || !prevBtn || !nextBtn || !dotsContainer) {
      return;
    }

    const cards = carousel.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;
    let currentSlideIndex = 0;
    let autoplayInterval = null;

    // Get cards per view based on screen size
    function getCardsPerView() {
      return window.innerWidth <= 840 ? 1 : 2;
    }

    // Calculate total slides (pairs of cards)
    function getTotalSlides() {
      const cardsPerView = getCardsPerView();
      return Math.ceil(totalCards / cardsPerView);
    }

    // Create dots based on slides, not individual cards
    function createDots() {
      dotsContainer.innerHTML = '';
      const totalSlides = getTotalSlides();
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot';
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    // Update dots
    function updateDots() {
      const dots = dotsContainer.querySelectorAll('.testimonial-dot');
      dots.forEach((dot, index) => {
        if (index === currentSlideIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // Go to specific slide
    function goToSlide(slideIndex) {
      const cardsPerView = getCardsPerView();
      const totalSlides = getTotalSlides();
      currentSlideIndex = Math.max(0, Math.min(slideIndex, totalSlides - 1));
      
      // Calculate scroll position based on card width
      if (cards.length > 0) {
        // Use getBoundingClientRect for more accurate width calculation
        const cardRect = cards[0].getBoundingClientRect();
        const carouselRect = carousel.getBoundingClientRect();
        const cardWidth = cardRect.width;
        const gap = 20;
        const scrollPosition = currentSlideIndex * (cardWidth + gap) * cardsPerView;
        
        carousel.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
      updateDots();
      resetAutoplay();
    }

    // Navigate to previous slide
    function prevSlide() {
      const totalSlides = getTotalSlides();
      currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
      goToSlide(currentSlideIndex);
    }

    // Navigate to next slide
    function nextSlide() {
      const totalSlides = getTotalSlides();
      currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
      goToSlide(currentSlideIndex);
    }

    // Start autoplay
    function startAutoplay() {
      autoplayInterval = setInterval(() => {
        nextSlide();
      }, 5000); // Change slide every 5 seconds
    }

    // Reset autoplay
    function resetAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
      }
      startAutoplay();
    }

    // Stop autoplay on user interaction
    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }

    // Handle scroll events to update current index
    carousel.addEventListener('scroll', () => {
      if (cards.length === 0) return;
      
      const cardsPerView = getCardsPerView();
      const cardRect = cards[0].getBoundingClientRect();
      const cardWidth = cardRect.width;
      const gap = 20;
      const scrollLeft = carousel.scrollLeft;
      const slideWidth = (cardWidth + gap) * cardsPerView;
      const newSlideIndex = Math.round(scrollLeft / slideWidth);
      const totalSlides = getTotalSlides();
      
      if (newSlideIndex !== currentSlideIndex && newSlideIndex >= 0 && newSlideIndex < totalSlides) {
        currentSlideIndex = newSlideIndex;
        updateDots();
      }
    });

    // Event listeners
    prevBtn.addEventListener('click', () => {
      prevSlide();
      stopAutoplay();
    });

    nextBtn.addEventListener('click', () => {
      nextSlide();
      stopAutoplay();
    });

    // Pause autoplay on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startAutoplay();
    }

    // Initialize
    createDots();
    startAutoplay();

    // Update on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        createDots(); // Recreate dots when viewport changes
        goToSlide(currentSlideIndex);
        initShowMore(); // Reinitialize show more functionality
      }, 250);
    });
  });

  // Video Auto-play on Scroll and Fullscreen Handling
  document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('schoolVideo');
    const videoSection = document.getElementById('video');
    
    if (video && videoSection) {
      let hasPlayed = false;
      
      // Create Intersection Observer for video auto-play
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Video is in view, try to play
            if (video.paused) {
              const playPromise = video.play();
              
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    // Video started playing successfully
                    hasPlayed = true;
                  })
                  .catch(error => {
                    // Auto-play was prevented, user interaction required
                    console.log('Video auto-play prevented:', error);
                    // Video will play when user clicks play button
                  });
              }
            }
          } else {
            // Video is out of view, pause it (but not if in fullscreen)
            if (!video.paused && !isFullscreen()) {
              video.pause();
            }
          }
        });
      }, {
        threshold: 0.3, // Trigger when 30% of video section is visible
        rootMargin: '0px'
      });
      
      // Observe the video section
      videoObserver.observe(videoSection);
      
      // Fullscreen handling
      function isFullscreen() {
        return !!(document.fullscreenElement || 
                 document.webkitFullscreenElement || 
                 document.mozFullScreenElement || 
                 document.msFullscreenElement);
      }
      
      // Handle fullscreen change events
      function handleFullscreenChange() {
        if (isFullscreen()) {
          // Entered fullscreen - video will use CSS :fullscreen pseudo-class
          // Ensure video maintains aspect ratio and fills screen properly
          const orientation = video.dataset.orientation;
          
          // The CSS will handle the fullscreen styling with object-fit: contain
          // This ensures portrait videos show properly in portrait mode
          // and landscape videos show properly in landscape mode
          
          // Optional: Request orientation lock based on video orientation
          // (Commented out to let users control their device orientation)
          /*
          if (screen.orientation && screen.orientation.lock) {
            if (orientation === 'portrait') {
              screen.orientation.lock('portrait').catch(() => {});
            } else if (orientation === 'landscape') {
              screen.orientation.lock('landscape').catch(() => {});
            }
          }
          */
        } else {
          // Exited fullscreen - styles will reset automatically via CSS
          // Optional: Unlock orientation
          /*
          if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock().catch(() => {});
          }
          */
        }
      }
      
      // Listen for fullscreen changes
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('mozfullscreenchange', handleFullscreenChange);
      document.addEventListener('MSFullscreenChange', handleFullscreenChange);
      
      // Handle video metadata loaded to get actual dimensions
      video.addEventListener('loadedmetadata', function() {
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        const aspectRatio = videoWidth / videoHeight;
        
        // Store aspect ratio for fullscreen handling
        video.dataset.aspectRatio = aspectRatio;
        
        // Determine if video is portrait or landscape
        if (aspectRatio < 1) {
          // Portrait video
          video.dataset.orientation = 'portrait';
        } else {
          // Landscape video
          video.dataset.orientation = 'landscape';
        }
      });
      
      // Ensure video element (not container) enters fullscreen
      // The native fullscreen button will handle this, but we can add a custom handler if needed
      video.addEventListener('webkitbeginfullscreen', function() {
        // iOS Safari fullscreen started
      });
      
      video.addEventListener('webkitendfullscreen', function() {
        // iOS Safari fullscreen ended
      });
      
      // Auto-restart video when it ends
      video.addEventListener('ended', function() {
        // Reset video to beginning
        video.currentTime = 0;
        
        // Check if video section is still in view before auto-restarting
        const rect = videoSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInView) {
          // Video section is still in view, restart playback
          const playPromise = video.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                // Video restarted successfully
                console.log('Video auto-restarted');
              })
              .catch(error => {
                // Auto-restart was prevented
                console.log('Video auto-restart prevented:', error);
              });
          }
        }
      });
    }
  });

  // Show More/Less functionality for testimonials
  document.addEventListener('DOMContentLoaded', function() {
    function collapseAllCards() {
      const testimonialCards = document.querySelectorAll('.testimonial-card');
      testimonialCards.forEach(card => {
        const quote = card.querySelector('.testimonial-quote');
        const showMoreBtn = card.querySelector('.show-more-btn');
        
        if (quote && showMoreBtn && quote.dataset.fullText) {
          // Collapse the card
          quote.classList.add('truncated');
          if (showMoreBtn.textContent === 'Show less') {
            showMoreBtn.textContent = 'Show more';
          }
        }
      });
    }
    
    function initShowMore() {
      const testimonialCards = document.querySelectorAll('.testimonial-card');
      
      testimonialCards.forEach((card, index) => {
        const quote = card.querySelector('.testimonial-quote');
        const showMoreBtn = card.querySelector('.show-more-btn');
        
        if (!quote || !showMoreBtn) return;
        
        // Check if content has data-truncate attribute or is long
        const shouldTruncate = quote.hasAttribute('data-truncate') || quote.textContent.trim().length > 200;
        
        if (shouldTruncate) {
          // Store full text if not already stored
          if (!quote.dataset.fullText) {
            quote.dataset.fullText = quote.textContent.trim();
          }
          
          // Ensure button is visible
          showMoreBtn.style.display = 'block';
          showMoreBtn.textContent = 'Show more';
          
          // Set initial truncated state
          quote.classList.add('truncated');
          
          // Remove any existing event listeners by removing and re-adding
          const newBtn = showMoreBtn.cloneNode(true);
          showMoreBtn.parentNode.replaceChild(newBtn, showMoreBtn);
          
          // Add click handler
          newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (quote.classList.contains('truncated')) {
              // Expand - remove truncated class to show full content
              quote.classList.remove('truncated');
              newBtn.textContent = 'Show less';
            } else {
              // Collapse - add truncated class to hide extra content
              quote.classList.add('truncated');
              newBtn.textContent = 'Show more';
            }
          });
        } else {
          // Content is short, hide button
          showMoreBtn.style.display = 'none';
          quote.classList.remove('truncated');
        }
      });
    }
    
    // Initialize on load
    initShowMore();
    
    // Collapse all when carousel navigates
    const carousel = document.getElementById('testimonialsCarousel');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    
    if (carousel) {
      // Collapse on scroll (when user scrolls carousel)
      let scrollTimeout;
      carousel.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          collapseAllCards();
        }, 150);
      });
      
      // Collapse on button click
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          setTimeout(collapseAllCards, 200);
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          setTimeout(collapseAllCards, 200);
        });
      }
      
      // Collapse on dot click
      const dotsContainer = document.getElementById('testimonialsDots');
      if (dotsContainer) {
        dotsContainer.addEventListener('click', (e) => {
          if (e.target.classList.contains('testimonial-dot')) {
            setTimeout(collapseAllCards, 200);
          }
        });
      }
    }
  });