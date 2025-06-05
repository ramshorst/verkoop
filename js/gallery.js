document.addEventListener('DOMContentLoaded', function() {
  // Create or get fullscreen gallery container
  const fullscreenGallery = document.querySelector('.fullscreen-gallery');
  const fullscreenImage = fullscreenGallery.querySelector('.fullscreen-image');
  const imageCounter = fullscreenGallery.querySelector('.image-counter');
  const closeGallery = fullscreenGallery.querySelector('.close-gallery');
  const prevButton = fullscreenGallery.querySelector('.prev-image');
  const nextButton = fullscreenGallery.querySelector('.next-image');
  
  let currentIndex = 0;
  let imageSources = [];
  let imageCaptions = [];
  let imageAlts = [];
  let totalImages = 0;
  
  // Get base URL for AJAX requests
  const baseUrl = document.querySelector('base')?.href || 
                 window.location.origin + (document.querySelector('body').dataset.baseurl || '');
  
  // Function to fetch all gallery images
  function fetchGalleryImages() {
    return new Promise((resolve, reject) => {
      // If we're already on the gallery page, use the images on this page
      const galleryItems = document.querySelectorAll('.gallery-item');
      if (galleryItems.length > 0) {
        const sources = [];
        const captions = [];
        const alts = [];
        
        galleryItems.forEach(item => {
          const img = item.querySelector('img');
          sources.push(img.src);
          alts.push(img.alt || '');
          const captionEl = item.querySelector('.gallery-caption');
          captions.push(captionEl ? captionEl.textContent : '');
        });
        
        resolve({ sources, captions, alts });
        return;
      }
      
      // Otherwise fetch the gallery page via AJAX
      const xhr = new XMLHttpRequest();
      const currentLang = document.documentElement.lang || 'en';
      xhr.open('GET', `${baseUrl}/${currentLang}/gallery/`, true);
      
      xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
          // Create temporary div to parse HTML response
          const tempDiv = document.createElement('div');
          tempDiv.style.display = 'none';
          tempDiv.innerHTML = this.responseText;
          document.body.appendChild(tempDiv);
          
          // Extract all gallery images, alts, and captions
          const images = tempDiv.querySelectorAll('.gallery-item img');
          const captions = tempDiv.querySelectorAll('.gallery-caption');
          
          const sources = Array.from(images).map(img => img.src);
          const altTexts = Array.from(images).map(img => img.alt || '');
          const captionTexts = Array.from(captions).map(caption => caption.textContent);
          
          // Clean up
          document.body.removeChild(tempDiv);
          
          resolve({ sources, captions: captionTexts, alts: altTexts });
        } else {
          reject(new Error('Failed to load gallery images'));
        }
      };
      
      xhr.onerror = function() {
        reject(new Error('Network error'));
      };
      
      xhr.send();
    });
  }
  
  // Initialize gallery functionality
  function initGallery() {
    fetchGalleryImages().then(({ sources, captions, alts }) => {
      imageSources = sources;
      imageCaptions = captions;
      imageAlts = alts;
      totalImages = imageSources.length;
      
      // Add click events to home page images
      const mainPropertyImage = document.querySelector('.main-property-image');
      const thumbnails = document.querySelectorAll('.thumbnail img');
      
      // Main featured image
      if (mainPropertyImage) {
        mainPropertyImage.style.cursor = 'pointer';
        mainPropertyImage.addEventListener('click', () => {
          openGallery(mainPropertyImage.src);
        });
      }
      
      // Thumbnail grid on homepage
      if (thumbnails.length > 0) {
        thumbnails.forEach(thumbnail => {
          thumbnail.style.cursor = 'pointer';
          thumbnail.addEventListener('click', () => {
            openGallery(thumbnail.src);
          });
        });
      }
      
      // Legacy hero image support
      const heroImage = document.querySelector('.hero-image');
      if (heroImage) {
        heroImage.style.cursor = 'pointer';
        heroImage.addEventListener('click', () => {
          openGallery(heroImage.src);
        });
      }
      
      // Add click events to gallery items
      const galleryItems = document.querySelectorAll('.gallery-item');
      
      if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
          const img = item.querySelector('img');
          item.addEventListener('click', () => {
            openGallery(img.src);
          });
        });
      }
    }).catch(error => {
      console.error('Error initializing gallery:', error);
    });
  }
  
  // Open gallery with specific image
  function openGallery(imageSrc) {
    // Find the index of the clicked image
    currentIndex = imageSources.findIndex(src => src === imageSrc);
    if (currentIndex === -1) currentIndex = 0;
    
    // Update fullscreen image and counter
    updateGalleryImage();
    
    // Show gallery with animation
    fullscreenGallery.style.display = 'flex';
    setTimeout(() => {
      fullscreenGallery.classList.add('visible');
    }, 10);
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
  }
  
  // Update gallery image and counter
  function updateGalleryImage() {
    fullscreenImage.src = imageSources[currentIndex];
    fullscreenImage.alt = imageAlts[currentIndex] || imageCaptions[currentIndex] || `Property image ${currentIndex + 1}`;
    imageCounter.textContent = `${currentIndex + 1} / ${totalImages}`;
  }
  
  // Gallery navigation
  function nextImage() {
    currentIndex = (currentIndex + 1) % totalImages;
    updateGalleryImage();
  }
  
  function prevImage() {
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;
    updateGalleryImage();
  }
  
  // Close gallery
  function closeGalleryFn() {
    fullscreenGallery.classList.remove('visible');
    setTimeout(() => {
      fullscreenGallery.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 300);
  }
  
  // Event listeners for gallery controls
  closeGallery.addEventListener('click', closeGalleryFn);
  nextButton.addEventListener('click', nextImage);
  prevButton.addEventListener('click', prevImage);
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (fullscreenGallery.style.display === 'flex') {
      if (e.key === 'Escape') {
        closeGalleryFn();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    }
  });
  
  // Swipe navigation for touch devices
  let touchStartX = 0;
  let touchEndX = 0;
  
  fullscreenGallery.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  fullscreenGallery.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
  
  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left, go to next image
      nextImage();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right, go to previous image
      prevImage();
    }
  }
  
  // Initialize gallery
  initGallery();
});