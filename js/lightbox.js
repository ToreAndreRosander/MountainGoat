var lightBoxElement = document.querySelector(".image-lightbox");

window.onclick = function(event) {
    if (event.target == lightBoxElement) {
        lightBoxElement.style.display = "none";
    }
}

function showLightbox(imageSource) {
    var clickedImageSource = imageSource.src;

    lightboxImage = document.querySelector(".image-lightbox span");
    lightboxImage.style.backgroundImage = "url(" + clickedImageSource + ")";

    lightbox = document.querySelector(".image-lightbox");
    lightbox.style.display = "flex";
}

function addLightboxOnclick() {
    var pageImages = document.querySelectorAll(".wp-block-image img");

    for(var i = 0; i < pageImages.length; i++) {
        pageImages[i].setAttribute("onclick", "showLightbox(this)"); 
    }
}

function addLightboxImgChild(selector) {
    var pageImages = document.querySelectorAll("." + selector);

    for(var i = 0; i < pageImages.length; i++) {
        pageImages[i].addEventListener("click", function(element) {

            if (element.target.nodeName.toLowerCase() == "img") {
                var clickedImageSource = element.target.src;

                lightboxImage = document.querySelector(".image-lightbox span");
                lightboxImage.style.backgroundImage = "url('" + clickedImageSource + "')";

                lightbox = document.querySelector(".image-lightbox");
                lightbox.style.display = "flex";
            }
        });
    }
}