document.addEventListener('DOMContentLoaded', function() {
  // Get all gallery items if they exist
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (galleryItems.length > 0) {
    // Create fullscreen gallery container if it doesn't exist
    let fullscreenGallery = document.querySelector('.fullscreen-gallery');
    
    if (!fullscreenGallery) {
      fullscreenGallery = document.createElement('div');
      fullscreenGallery.className = 'fullscreen-gallery';
      
      const fullscreenImage = document.createElement('img');
      fullscreenImage.className = 'fullscreen-image';
      fullscreenGallery.appendChild(fullscreenImage);
      
      const closeButton = document.createElement('div');
      closeButton.className = 'close-gallery';
      closeButton.innerHTML = '&times;';
      fullscreenGallery.appendChild(closeButton);
      
      const controls = document.createElement('div');
      controls.className = 'gallery-controls';
      
      const prevButton = document.createElement('button');
      prevButton.textContent = 'Previous';
      prevButton.className = 'prev-image';
      
      const nextButton = document.createElement('button');
      nextButton.textContent = 'Next';
      nextButton.className = 'next-image';
      
      controls.appendChild(prevButton);
      controls.appendChild(nextButton);
      fullscreenGallery.appendChild(controls);
      
      document.body.appendChild(fullscreenGallery);
    }
    
    const fullscreenImage = fullscreenGallery.querySelector('.fullscreen-image');
    const closeGallery = fullscreenGallery.querySelector('.close-gallery');
    const prevButton = fullscreenGallery.querySelector('.prev-image');
    const nextButton = fullscreenGallery.querySelector('.next-image');
    
    let currentIndex = 0;
    const imageSources = Array.from(galleryItems).map(item => item.querySelector('img').src);
    
    // Open fullscreen gallery on click
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        currentIndex = index;
        fullscreenImage.src = imageSources[currentIndex];
        fullscreenGallery.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when gallery is open
      });
    });
    
    // Handle thumbnail images in header
    const thumbnailImages = document.querySelectorAll('.thumbnail-images img');
    const mainImage = document.querySelector('.main-image img');
    
    if (thumbnailImages.length > 0 && mainImage) {
      thumbnailImages.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
          mainImage.src = thumbnail.src;
        });
      });
    }
    
    // Close gallery
    closeGallery.addEventListener('click', () => {
      fullscreenGallery.style.display = 'none';
      document.body.style.overflow = 'auto'; // Restore scrolling
    });
    
    // Next image
    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % imageSources.length;
      fullscreenImage.src = imageSources[currentIndex];
    });
    
    // Previous image
    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
      fullscreenImage.src = imageSources[currentIndex];
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (fullscreenGallery.style.display === 'flex') {
        if (e.key === 'Escape') {
          fullscreenGallery.style.display = 'none';
          document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowRight') {
          currentIndex = (currentIndex + 1) % imageSources.length;
          fullscreenImage.src = imageSources[currentIndex];
        } else if (e.key === 'ArrowLeft') {
          currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
          fullscreenImage.src = imageSources[currentIndex];
        }
      }
    });
  }
});