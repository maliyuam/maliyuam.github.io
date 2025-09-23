// Advanced loading system
export function initLoader() {
    const loader = document.getElementById('loader');
    
    // Preload critical images
    const imagesToPreload = [
        '/assets/images/ma-image-profile-1.jpg',
        '/assets/images/profile.jpg'
    ];

    // Track loading progress
    let loadedItems = 0;
    const totalItems = imagesToPreload.length;

    // Update loader progress
    const updateProgress = () => {
        loadedItems++;
        const progress = (loadedItems / totalItems) * 100;
        const loaderBar = loader.querySelector('.loader-bar');
        if (loaderBar) {
            loaderBar.style.width = `${progress}%`;
        }
    };

    // Preload images
    imagesToPreload.forEach(imageSrc => {
        const img = new Image();
        img.onload = updateProgress;
        img.src = imageSrc;
    });

    // Remove loader when everything is ready
    window.addEventListener('load', () => {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.style.display = 'none';
            document.body.classList.add('loaded');
        }, 600);
    });
}