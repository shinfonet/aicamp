// assets/js/banner.js

document.addEventListener('DOMContentLoaded', function() {
    const bannerDiv = document.getElementById('banner');
    console.log("Banner element:", bannerDiv);
    let currentIndex = 0;

    function changeBannerImage() {
        bannerDiv.style.backgroundImage = `url(${bannerImages[currentIndex]})`;
        currentIndex = (currentIndex + 1) % bannerImages.length;
    }

    // Initial image
    changeBannerImage();

    // Change image every 5 seconds
    setInterval(changeBannerImage, 5000);
});

