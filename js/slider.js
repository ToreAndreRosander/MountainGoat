var slideIndex = 1;

function moveSlides(slideChange) {
    let dots = document.getElementsByClassName("slider-span");
    let featuredSlides = document.getElementsByClassName("frontpage-slideshow");
    
    if(slideChange > featuredSlides.length) {
        slideIndex = 1
    }

    if(slideChange < 1) {
        slideIndex = featuredSlides.length
    }

    for(let i = 0; i < featuredSlides.length; i++) {
        featuredSlides[i].style.display = "none";
    }
    
    for(let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    featuredSlides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

function currentSlide(slideChange) {
    moveSlides(slideIndex = slideChange);
}

function changeSlideSpan(slideChange) {
    moveSlides(slideIndex += slideChange);
}

// Frontpage slideshow with latests posts
async function listLatestsPosts(currentPage = 1) {
    let latestPosts = document.getElementById("latest-posts");
    let getPosts = await fetchPosts(3, 0, 0, currentPage);
    let postsResult = await getPosts.json();

    // Using fragment to insert all post cards at once after the loop is done
    let fragment = document.createDocumentFragment();

    for(let i = 0; i < postsResult.length; i++) {

       // Get postdate and convert to readable format
       let postDate  = getDate(postsResult[i].date);

       // Generate post card HTML
       let postCard = document.createElement('a');
       postCard.setAttribute('class', 'latest-posts-slider');
       postCard.setAttribute('href', './single-post.html?slug=' + postsResult[i].slug);

       let postCardImg = document.createElement('img');
       postCardImg.setAttribute('class', 'post-card-img');
       postCardImg.setAttribute('src', postsResult[i]._embedded['wp:featuredmedia']['0'].media_details.sizes.medium.source_url);
       postCardImg.setAttribute('alt', postsResult[i]._embedded['wp:featuredmedia']['0'].alt_text);

       let postCardDiv = document.createElement('div');
       postCardDiv.setAttribute('class', 'post-card-content');

       let postCardTitle = document.createElement('h3');
       postCardTitle.textContent = `${postsResult[i].title.rendered}`;

       let postCardDate = document.createElement('p');
       postCardDate.setAttribute('class', 'text-meta');
       postCardDate.textContent = `${postDate} by ${postsResult[i]._embedded.author[0].name}`;

       postCard.appendChild(postCardImg);
       postCard.appendChild(postCardDiv);
       postCardDiv.appendChild(postCardTitle);
       postCardDiv.appendChild(postCardDate);
       fragment.appendChild(postCard);

    }
    latestPosts.innerHTML = "";
    latestPosts.appendChild(fragment);

    // Set total pages dataset
    let totalPagesData = document.querySelector(".latest-posts-right");
    totalPagesData.dataset.totalpages = getPosts.headers.get('X-WP-TotalPages');

}

function latestPostsMoveRight(page) {
    let latestPostsBtnRight = document.querySelector(".latest-posts-right");
    let latestPostsBtnLeft = document.querySelector(".latest-posts-left");
    let currentPage = page.dataset.page;
    let totalPages = page.dataset.totalpages;

    // Check if current page is the last page
    if(currentPage >= totalPages) {
        var nextPage = parseInt(currentPage);
        var previousPage = parseInt(currentPage) - 1;
    } else {
        var nextPage = parseInt(currentPage) + 1;
        var previousPage = parseInt(currentPage);
    }
    
    listLatestsPosts(nextPage);

    // Set new dataset for previous and next buttons
    latestPostsBtnLeft.dataset.page = previousPage;
    latestPostsBtnRight.dataset.page = nextPage;
}

function latestPostsMoveLeft(page) {
    let latestPostsBtnRight = document.querySelector(".latest-posts-right");
    let latestPostsBtnLeft = document.querySelector(".latest-posts-left");
    let currentPage = page.dataset.page;
    let previousPage = parseInt(currentPage);
    
    // check if current page is the first page
    listLatestsPosts(previousPage);
    if(previousPage === 1) {
        latestPostsBtnLeft.dataset.page = 1;}
    else {
        latestPostsBtnLeft.dataset.page = previousPage - 1;
    }

    latestPostsBtnRight.dataset.page = currentPage;
}