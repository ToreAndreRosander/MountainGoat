// Retrieve single post from wp backend
async function getSinglePost() {

    // Get URL parameters and assign to the postSlug variable
    let urlString = window.location.search;
    let urlParams = new URLSearchParams(urlString);
    let postSlug = urlParams.get('innlegg');

    // TODO Add check to see if id is set in the url and not undefined
    const contentContainer = document.getElementById("content-container");
    const commentBtnContainer = document.getElementById("comment-btns");
    const pageBgContainer = document.getElementById("page-bg");
    const commentCountContainer = document.getElementById("comment-count");
    const api = 'https://rosander.no/blog-backend/wp-json/wp/v2/posts/?slug=' + postSlug + '&_embed';

    // Using fragment to insert all post cards at the end of the function
    let fragment = document.createDocumentFragment();
    
    try {
        const response = await fetch(api);
        var apiResponse = await response.json();
    } catch (error) {
        // Error title
        let errorHeader = document.createElement("h1");
        errorHeader.textContent = "Å neeei :(";

        // Error message
        let errorContent = document.createElement("p");
        errorContent.textContent = "En feil oppstod når vi skulle laste artikkelen!<br>Feilmelding: " + error;

        // Return home link
        let errorLink = document.createElement("a");
        errorLink.setAttribute = ("href", "./index.html");
        errorLink.textContent = "Gå tilbake til forsiden";
        
        // Append to fragment
        fragment.appendChild(errorHeader);
        fragment.appendChild(errorContent);
        fragment.appendChild(errorLink);
    }  
    
    // Check for api response and display received data
    if(apiResponse) {    
        // Set featured blog image as body background and add fade in class
        pageBgContainer.className += ' bg-fade';
        pageBgContainer.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 20%), rgba(0, 0, 0, 40%)), url(" + apiResponse[0]._embedded['wp:featuredmedia']['0'].source_url + ")";

        // Get the post date andd format it
        date = getDate(apiResponse[0].date);

        // Get post ID
        let postId = apiResponse[0].id;

        // Get comment count
        var commentCount2 = await commentCount(postId, true);

        // Post title
        let postContent = document.createElement('h1');
        postContent.textContent = `${apiResponse[0].title.rendered}`;

        // Post meta content
        let postMeta = document.createElement('p');
        postMeta.setAttribute('class', 'text-post-meta');
        postMeta.innerHTML = `<p>${date} av ${apiResponse[0]._embedded.author[0].name} | <a href="#comment-btns">${commentCount2}</a></p>`;

        // Post content
        let postContentContainer = document.createElement('span');
        postContentContainer.innerHTML = apiResponse[0].content.rendered;

        // create tag section
        let tagSection = document.createElement('section');
        tagSection.setAttribute('class', 'tags-line');
        tagSection.setAttribute('id', 'post-tags');

        let tagText = document.createElement('p');
        tagText.textContent = "Emner:  ";

        tagSection.appendChild(tagText);

        // Create the tag links
        let tagsArray = apiResponse[0]._embedded['wp:term'][0];

        for(let i = 0; i < tagsArray.length; i++) {
            let tagSpan = document.createElement('a');
            tagSpan.textContent = apiResponse[0]._embedded['wp:term'][0][i].name;
            tagSpan.setAttribute('href', './blog.html?category=' + apiResponse[0]._embedded['wp:term'][0][i].slug);
            tagSection.appendChild(tagSpan);
        }

        // Create the comment section HTML
        let loadCommentBtn = document.createElement('button');
        loadCommentBtn.setAttribute('class', 'button-transparent');
        loadCommentBtn.setAttribute('onclick', 'getComments(' + apiResponse[0].id + ')');
        loadCommentBtn.setAttribute('id', 'post-comment-btn');
        loadCommentBtn.textContent = "Se kommetarer";

        let postCommentBtn = document.createElement('button');
        postCommentBtn.setAttribute('class', 'button-transparent');
        postCommentBtn.setAttribute('id', 'comment-form-btn');
        postCommentBtn.setAttribute('onclick', 'loadCommentForm(' + apiResponse[0].id + ')');
        postCommentBtn.textContent = "Skriv kommentar";

        // Change the page title and meta description
        document.title = "MountainGoat | " + apiResponse[0].title.rendered;
        document.getElementsByTagName('meta')["description"].content = stripTags(apiResponse[0].excerpt.rendered);

        // Set post ID and show the comment section
        document.getElementById("input-postid").value = apiResponse[0].id;
        document.getElementById("comment-section").style.display = "flex";

        // Append post content to fragment
        fragment.appendChild(postContent);
        fragment.appendChild(postMeta);
        fragment.appendChild(postContentContainer);

        // Append tag section to fragment

        fragment.appendChild(tagSection);

        // Append the comment buttons to the comment button container
        commentBtnContainer.appendChild(loadCommentBtn);
        commentBtnContainer.appendChild(postCommentBtn);

        // Get post comment count
        commentCountContainer.innerHTML = await commentCount(apiResponse[0].id);

        // Add lightbox click event to the images in the post
        // addLightboxImgChild("wp-block-image");
        setTimeout(addLightboxOnclick, 1000);
    }

    document.querySelector(".loader").style.display = "none";

    // Append the fragment to the content container
    contentContainer.appendChild(fragment);
}