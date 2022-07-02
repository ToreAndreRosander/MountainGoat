const commentContainer = document.querySelector("#comment-container");
const commentForm = document.querySelector("#post-comment-form");

function loadCommentSection() {
    commentContainer.style.display = "flex";
}

function loadCommentForm() {
    commentForm.style.display = "flex";
}

async function commentCount(postId) {
    const commentApi = 'https://rosander.no/blog-backend/wp-json/wp/v2/comments?post=' + postId;

    try {
        let response = await fetch(commentApi);
        let data = await response.json(); 

        if(data.length === 1) {
            return data.length + " comment";
        } else if(data.length > 1) {
            return data.length + " comments";
        } else if(data.length === 0) {
            document.getElementById("post-comment-btn").style.display = "none";
            return "No comments yet :(";
        }

    } catch (error) {
        return "Sorry, an error occurred while retrieving the comment count! Error message:" + error;
    }
}

async function getComments(postId) {

    let commentApi = 'https://rosander.no/blog-backend/wp-json/wp/v2/comments?post=' + postId;
    let commentContainer = document.getElementById("comment-container");

    try {
        let response = await fetch(commentApi);
        let data = await response.json();
       
        commentContainer.innerHTML = "";
        
        let postContent = document.createElement('h2');
        postContent.textContent = "Comments";

        commentContainer.appendChild(postContent);

        for(let i = 0; i < data.length; i++) {

            // Get comment post date
            var publishedDate  = getDate(data[i].date);

            // create comment section
            let singleCommentSection = document.createElement('section');
            singleCommentSection.setAttribute('class', 'single-comment');

            // Comment content
            let commentAuthor = document.createElement('h4');
            commentAuthor.setAttribute('class', 'comment-author');
            commentAuthor.textContent = "By " + data[i].author_name;

            let commentDate = document.createElement('p');
            commentDate.setAttribute('class', 'comment-meta');
            commentDate.textContent = "On " + stripTags(publishedDate);

            let commentContent = document.createElement('p');
            commentContent.setAttribute('class', 'comment-meta');
            commentContent.textContent = stripTags(data[i].content.rendered);

            singleCommentSection.appendChild(commentAuthor);

            singleCommentSection.appendChild(commentContent);
            singleCommentSection.appendChild(commentDate);

            commentContainer.appendChild(singleCommentSection);
        }
    } catch (error) {
        commentContainer.innerHTML = "Sorry, an error occurred while retrieving the comment count! Error message:" + error;
    }
}