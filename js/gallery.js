document.addEventListener('DOMContentLoaded', function() {
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
  
  // Create the full image list from the gallery data
  // This will be used on all pages, even the homepage
  const baseUrl = document.querySelector('base')?.href || window.location.origin + (document.querySelector('body').dataset.baseurl || '');
  
  // First, get all images from the gallery page
  const allGalleryImages = [];
  
  // Use a hidden div to temporarily store all gallery data
  // We'll extract all the image paths from the gallery.yml data
  const tempDiv = document.createElement('div');
  tempDiv.style.display = 'none';
  document.body.appendChild(tempDiv);
  
  // AJAX request to get gallery page content
  const xhr = new XMLHttpRequest();
  const currentLang = document.documentElement.lang || 'en';
  xhr.open('GET', `${baseUrl}/${currentLang}/gallery/`, true);
  
  xhr.onload = function() {
    if (this.status >= 200 && this.status < 300) {
      tempDiv.innerHTML = this.responseText;
      
      // Extract all gallery images
      const galleryImages = tempDiv.querySelectorAll('.gallery-item img');
      galleryImages.forEach(img => {
        allGalleryImages.push(img.src);
      });
      
      // Clean up
      document.body.removeChild(tempDiv);
      
      // Now initialize gallery functionality with all images
      initializeGallery(allGalleryImages);
    }
  };
  
  xhr.send();
  
  function initializeGallery(allImages) {
    const imageSources = allImages;
    
    // Get all gallery items if they exist on the current page
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
      // Open fullscreen gallery on click
      galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const imgSrc = img.src;
        
        item.addEventListener('click', () => {
          // Find the index of this image in the full gallery
          currentIndex = imageSources.indexOf(imgSrc);
          if (currentIndex === -1) currentIndex = 0;
          
          fullscreenImage.src = imageSources[currentIndex];
          fullscreenGallery.style.display = 'flex';
          document.body.style.overflow = 'hidden';
        });
      });
    }
    
    // Handle thumbnail images in header
    const thumbnailImages = document.querySelectorAll('.thumbnail-images img');
    const mainImage = document.querySelector('.main-image img');
    
    if (thumbnailImages.length > 0 && mainImage) {
      // Make main image clickable to open gallery
      mainImage.style.cursor = 'pointer';
      mainImage.addEventListener('click', () => {
        // Find this image in the full gallery
        const imgSrc = mainImage.src;
        currentIndex = imageSources.indexOf(imgSrc);
        if (currentIndex === -1) currentIndex = 0;
        
        fullscreenImage.src = imageSources[currentIndex];
        fullscreenGallery.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
      
      // Make thumbnails clickable to both change main image and open gallery
      thumbnailImages.forEach((thumbnail) => {
        thumbnail.style.cursor = 'pointer';
        thumbnail.addEventListener('click', (e) => {
          e.preventDefault(); // Prevent default behavior
          
          // Update main image
          mainImage.src = thumbnail.src;
          
          // Open gallery with this image
          const imgSrc = thumbnail.src;
          currentIndex = imageSources.indexOf(imgSrc);
          if (currentIndex === -1) currentIndex = 0;
          
          fullscreenImage.src = imageSources[currentIndex];
          fullscreenGallery.style.display = 'flex';
          document.body.style.overflow = 'hidden';
        });
      });
    }
    
    // Gallery navigation functions
    function nextImage() {
      currentIndex = (currentIndex + 1) % imageSources.length;
      fullscreenImage.src = imageSources[currentIndex];
    }
    
    function prevImage() {
      currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
      fullscreenImage.src = imageSources[currentIndex];
    }
    
    // Close gallery
    closeGallery.addEventListener('click', () => {
      fullscreenGallery.style.display = 'none';
      document.body.style.overflow = 'auto'; // Restore scrolling
    });
    
    // Next image
    nextButton.addEventListener('click', nextImage);
    
    // Previous image
    prevButton.addEventListener('click', prevImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (fullscreenGallery.style.display === 'flex') {
        if (e.key === 'Escape') {
          fullscreenGallery.style.display = 'none';
          document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowRight') {
          nextImage();
        } else if (e.key === 'ArrowLeft') {
          prevImage();
        }
      }
    });
  }
});