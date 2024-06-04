let currentIndex = 0;

function showImage(index) {
    const gallery = document.querySelector('.gallery');
    const images = document.querySelectorAll('.gallery-image');
    const totalImages = images.length;

    if (index >= totalImages) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = totalImages - 1;
    } else {
        currentIndex = index;
    }

    gallery.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function nextImage() {
    showImage(currentIndex + 1);
}

function prevImage() {
    showImage(currentIndex - 1);
}

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const images = document.querySelectorAll('.gallery-image');

    lightboxImage.src = images[index].src;
    lightbox.style.display = 'block';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
}

// Add event listeners for opening lightbox
document.querySelectorAll('.gallery-image').forEach((img, index) => {
    img.addEventListener('click', () => openLightbox(index));
});

// Initial display
showImage(currentIndex);
