// Get the most used tags from wp backend
async function getTags() {
    const tagListContainer = document.getElementById("post-tags");
    const getTags = 'https://rosander.no/blog-backend/wp-json/wp/v2/tags?orderby=count&order=desc';

    try {
        const response = await fetch(getTags);
        const apiResponse = await response.json(); 

        // Using fragment to insert all HTML content at once after the loop is done
        let fragment = document.createDocumentFragment();

        for(let i = 0; i < apiResponse.length; i++) {
            if(i == 5) {
                break;
            }

            var tagSpan = document.createElement('span');
            tagSpan.textContent = apiResponse[i].name;
            tagSpan.setAttribute('onclick', 'displayAllPosts(6, "tags", ' + apiResponse[i].id + ', 1)');
            tagSpan.setAttribute('tabindex', '0');
            fragment.appendChild(tagSpan);
        }
        
        tagListContainer.appendChild(fragment);

    } catch (error) {
        tagListContainer.innerHTML = "<p>Beklager, vi kunne ikke laste stikkord " + error + "</p>";
    }
}

// Retrieve a list of posts from wp backend (number of posts to display, post category/tag/featured, slug, page number)
async function fetchPosts(numberPosts, postType = 0, postTypeId = 0, page = 1) {
    let listAllPostsApi = 'https://rosander.no/blog-backend/wp-json/wp/v2/posts?per_page=' + numberPosts + '&page=' + page + '&_embed';

    if(postType != 0 && postTypeId != 0) {
        listAllPostsApi = 'https://rosander.no/blog-backend/wp-json/wp/v2/posts?per_page=' + numberPosts + '&' + postType + '=' + postTypeId + '&page=' + page + '&_embed';
    }

    try {
        const response = await fetch(listAllPostsApi);
        return response;

    } catch (error) {
        document.getElementById("main-content-posts").innerHTML = "<p>Beklager, det oppstod en feil. " + error + "</p>";
    }
}

// Display posts on blog list page. Check URL for tag or query string, if not retrieve latest posts
async function displayBlogList(numberPosts = 6, page = 1) {
    let postType = "categories";
    let postId = 0;

    let urlString = window.location.search;
    let urlParams = new URLSearchParams(urlString);

    if(urlParams.get('tag')) {
        postType = "tags";
        postId = await getTagId(urlParams.get('tag'));
    } else if(urlParams.get('category')) {
        postType = "categories";
        postId = await getCategoryId(urlParams.get('category'));
    }

    displayAllPosts(numberPosts, postType, postId, page);
}

async function displayFeaturedPosts(numPosts) {
    const postListContainer = document.getElementById("slideshow-container");

    let fetchPostsResult = await fetchPosts(numPosts, "categories", 22, 1);
    let postsResult = await fetchPostsResult.json();
    
    // Using fragment to insert all post cards at once after the loop is done
    let fragment = document.createDocumentFragment();

    for(let i = 0; i < postsResult.length; i++) {
        if(i == numPosts) {
            break;
        }

        // Create post card and append to fragment
        var postCard = document.createElement('div');
        postCard.setAttribute('class', 'frontpage-slideshow fade2');

        var postCardImg = document.createElement('img');
        postCardImg.setAttribute('class', 'post-card-img');
        postCardImg.setAttribute('src', postsResult[i]._embedded['wp:featuredmedia']['0'].source_url);
        postCardImg.setAttribute('alt', postsResult[i]._embedded['wp:featuredmedia']['0'].alt_text);

        var postCardDiv = document.createElement('div');
        postCardDiv.setAttribute('class', 'slider-text-bg');

        var postCardTitle = document.createElement('h3');
        postCardTitle.textContent = `${postsResult[i].title.rendered}`;

        var postCardExcerpt = document.createElement('p');
        postCardExcerpt.innerHTML = stripTags(postsResult[i].excerpt.rendered);

        var postCardUrl = document.createElement('a');
        postCardUrl.setAttribute('title', 'Les mer');
        postCardUrl.setAttribute('href', './post.html?innlegg=' + postsResult[i].slug);
        postCardUrl.textContent = "Les mer";

        postCard.appendChild(postCardImg);
        postCard.appendChild(postCardDiv);
        postCardDiv.appendChild(postCardTitle);
        postCardDiv.appendChild(postCardExcerpt);
        postCardDiv.appendChild(postCardUrl);
        fragment.appendChild(postCard);
    }

    postListContainer.appendChild(fragment);

    // Set the first slide to display block
    moveSlides(1);
}

// Genral function to display all posts
async function displayAllPosts(numberPosts, postType, postId, page = 1) {
    const postListContainer = document.getElementById("main-content-posts");

    let response = await fetchPosts(numberPosts, postType, postId, page);
    let postsResult = await response.json();

    // Using fragment to insert all post cards at once after the loop is done
    let fragment = document.createDocumentFragment();

    for(let i = 0; i < postsResult.length; i++) {
        if(i == numberPosts) {
            break;
        }

        // Get postdate and convert to readable format
        let postDate  = getDate(postsResult[i].date);
                
        // Generate post card HTML
        let postCard = document.createElement('a');
        postCard.setAttribute('class', 'post-card');
        postCard.setAttribute('href', './post.html?innlegg=' + postsResult[i].slug);
    
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
        postCardDate.textContent = `${postDate} av ${postsResult[i]._embedded.author[0].name}`;
    
        postCard.appendChild(postCardImg);
        postCard.appendChild(postCardDiv);
        postCardDiv.appendChild(postCardTitle);
        postCardDiv.appendChild(postCardDate);
        fragment.appendChild(postCard);
    }
    
    let nextPage = page + 1;

    let loadMorePostsDiv = document.createElement('div');
    loadMorePostsDiv.setAttribute('class', 'load-more-posts-div');
    loadMorePostsDiv.setAttribute('id', 'load-more-posts');

    // Check the total pages and if there are more pages, add a button to load more posts
    let totalPagesHeader = response.headers.get("X-WP-TotalPages");

    if(totalPagesHeader >= nextPage) {

        let loadMorePostsBtn = document.createElement('button');
        loadMorePostsBtn.setAttribute('class', 'button-transparent');
                
        loadMorePostsBtn.setAttribute('onclick', 'displayAllPosts(' + numberPosts + ', 0, 0, ' + nextPage + ')');
        loadMorePostsBtn.textContent = "Vis mer";
    
        loadMorePostsDiv.appendChild(loadMorePostsBtn);
    } 

    // Hide the loading spinner
    if(page == 1) {
        postListContainer.innerHTML = "";
        document.querySelector(".loader").style.display = "none";
    }

    fragment.appendChild(loadMorePostsDiv);
    postListContainer.appendChild(fragment);

    // Check if load more posts button should be hidden
    if(totalPagesHeader <= page) { 
        document.getElementById("load-more-posts").style.display = "none";
    }
}

// Get tag id from tag slug
async function getTagId(tagSlug) {
    let fetchTagId = await fetch("https://rosander.no/blog-backend/wp-json/wp/v2/tags?slug=" + tagSlug);
    let responseJson = await fetchTagId.json();
    return responseJson[0].id;
}

// Get category id from category slug
async function getCategoryId(catSlug) {
    let fetchCatId = await fetch("https://rosander.no/blog-backend/wp-json/wp/v2/categories?slug=" + catSlug);
    let responseJson = await fetchCatId.json();
    return responseJson[0].id;
}