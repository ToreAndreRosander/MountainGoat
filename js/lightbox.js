// Lightbox javascript
var lightBoxElement = document.querySelector(".image-lightbox");

window.onclick = function(event) {
    if (event.target == lightBoxElement) {
        lightBoxElement.style.display = "none";
    }
}

function showLightbox(imageSource) {
    // Get image source
    var clickedImageSource = imageSource.src;

    // Set image-lightbox span background image
    lightboxImage = document.querySelector(".image-lightbox span");
    lightboxImage.style.backgroundImage = "url(" + clickedImageSource + ")";

    // Show image-lightbox
    lightbox = document.querySelector(".image-lightbox");
    lightbox.style.display = "flex";
}

function addLightboxOnclick() {
    var pageImages = document.querySelectorAll(".wp-block-image img");

    for(var i = 0; i < pageImages.length; i++) {

        // Add event listner for click on all img childs of the selector
        pageImages[i].setAttribute("onclick", "showLightbox(this)"); 

    }
}

// Add lightbox click event to the images in the post, takes the parent class of the <img> element as a parameter
function addLightboxImgChild(selector) {
    
    var pageImages = document.querySelectorAll("." + selector);

    for(var i = 0; i < pageImages.length; i++) {

        // Add event listner for click on all img childs of the selector
        pageImages[i].addEventListener("click", function(element) {

            if (element.target.nodeName.toLowerCase() == "img") {

                var clickedImageSource = element.target.src;

                // Set image-lightbox span background image
                lightboxImage = document.querySelector(".image-lightbox span");
                lightboxImage.style.backgroundImage = "url('" + clickedImageSource + "')";

                // Show image-lightbox
                lightbox = document.querySelector(".image-lightbox");
                lightbox.style.display = "flex";
            }
        });
    }
}