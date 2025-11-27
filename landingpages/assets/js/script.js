 /**
  * Email Configuration
  * 
  * SETUP INSTRUCTIONS:
  * 1. Sign up for a free account at https://www.emailjs.com/
  * 2. Create an Email Service (Gmail, Outlook, etc.) and get your Service ID
  * 3. Create an Email Template with the following variables:
  *    - {{to_email}} - Recipient email
  *    - {{from_name}} - Parent's name
  *    - {{parent_name}} - Parent's name
  *    - {{phone}} - Phone number
  *    - {{preferred_branch}} - Preferred branch (from form selection)
  *    - {{source_branch}} - Source branch (Bachupally or Manikonda - detected from page)
  *    - {{child_age}} - Child's age
  *    - {{preferred_time}} - Preferred contact time
  *    - {{message}} - Additional message
  *    - {{form_type}} - Form type (Quick Enquiry or Contact Form)
  *    - {{page_url}} - Page URL where form was submitted
  *    - {{timestamp}} - Submission timestamp
  * 4. Get your Public Key from Account > API Keys
  * 5. Replace the placeholder values below with your actual credentials
  */
 const EMAIL_CONFIG = {
   serviceId: 'YOUR_SERVICE_ID',      // Your EmailJS service ID
   templateId: 'YOUR_TEMPLATE_ID',    // Your EmailJS template ID
   publicKey: 'YOUR_PUBLIC_KEY',      // Your EmailJS public key
   recipientEmail: 'info@rockridgepreschool.com' // Recipient email address
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
     
     // Prepare email template parameters
     const templateParams = {
       to_email: EMAIL_CONFIG.recipientEmail,
       from_name: data.parentName || 'Anonymous',
       parent_name: data.parentName,
       phone: data.phone,
       preferred_branch: data.preferredBranch || 'Not specified',
       source_branch: data.sourceBranch,
       child_age: data.childAge || 'Not specified',
       preferred_time: data.preferredTime || 'Any time',
       message: data.message || 'No additional message provided',
       form_type: formType,
       page_url: data.pageUrl,
       timestamp: data.timestamp,
       subject: `New ${formType} from ${data.sourceBranch} Branch - Rockridge Global Preschool`
     };
     
     try {
       // Check if EmailJS is properly configured
       if (EMAIL_CONFIG.serviceId === 'YOUR_SERVICE_ID' || 
           EMAIL_CONFIG.templateId === 'YOUR_TEMPLATE_ID' || 
           EMAIL_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
         throw new Error('EmailJS is not configured. Please set up your EmailJS credentials.');
       }
       
       // Send email using EmailJS
       await emailjs.send(
         EMAIL_CONFIG.serviceId,
         EMAIL_CONFIG.templateId,
         templateParams
       );
       
       // Show success message
       showFormMessage(form, 'success', 'Thank you! We\'ve received your enquiry and will contact you soon.');
       
       // Reset form
       form.reset();
       
     } catch (error) {
       console.error('Form submission error:', error);
       
       // Show error message
       showFormMessage(form, 'error', 'Sorry, there was an error sending your enquiry. Please call us directly or try again later.');
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

  // Form Submission Handlers
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS when DOM is ready
    if (typeof emailjs !== 'undefined' && EMAIL_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
      emailjs.init(EMAIL_CONFIG.publicKey);
    }
    
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