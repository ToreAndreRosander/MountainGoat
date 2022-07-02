// Validate comment form
function validateCommentForm() {
    // Error counter to check if any errors before submit
        let errors = 0;

        const postId = document.querySelector("#input-postid").value;

        const name = document.querySelector("#name").value;
        const nameError = document.querySelector("#name-error");
        
        const comment = document.querySelector("#comment").value;
        const commentError = document.querySelector("#comment-error");
    
        const email = document.querySelector("#email").value;
        const emailError = document.querySelector("#email-error");
    
        if (inputCheck(name, 5) === true) {
            nameError.style.display = "none";
        } else {
            nameError.style.display = "block";
            errors++;
        }
    
        if (validateEmail(email) === true) {
            emailError.style.display = "none";
        } else {
            emailError.style.display = "block";
            errors++;
        }

        if (inputCheck(comment, 25) === true) {
            commentError.style.display = "none";
        } else {
            commentError.style.display = "block";
            errors++;
        }
    
        // Display submit success message if there are no validation errors
        if(errors == 0 ) {
            
            postCommentForm(postId, name, email, comment);
            
            name.value = '';
            email.value = '';
            comment.value = '';
        } else {
            // Reset the error counter so it is ready for a new check when the user press "submit"
            errors = 0;
        }
    }

    function postCommentForm(postId, name, email, comment) {
        const apiBaseCommentForm = 'https://rosander.no/blog-backend/wp-json/wp/v2/comments';
        const success = document.querySelector("#success");
        const formData = new FormData();
    
        formData.append("post", postId);
        formData.append("author_name", name);
        formData.append("author_email", email);
        formData.append("content", comment);

        fetch(apiBaseCommentForm, {
            method: "POST",
            body: formData
        }).then(res => {
            console.log(res.status)
            success.innerHTML = "<h3 class='text-success'>Your comment has been submitted</h3>";
            document.querySelector("#post-comment-form").style.display = "none";
        });
        getComments(postId);
    }

    function postForm(name, email, subject, message) {
    const apiBaseContactForm = 'https://rosander.no/blog-backend/wp-json/contact-form-7/v1/contact-forms/99/feedback';
    const success = document.querySelector("#success");
    const formData = new FormData();

    formData.append("your_name", name);
    formData.append("your_email", email);
    formData.append("your_subject", subject);
    formData.append("your_message", message);

    fetch(apiBaseContactForm, {
        method: "POST",
        body: formData
    }).then(res => {
        console.log(res.status)
        success.innerHTML = "<h3 class='text-success'>Your form was submitted!</h3>";
    });
}

function validateContactForm() {
    // Error counter to check if any errors before submit
        let errors = 0;

        const name = document.querySelector("#name").value;
        const nameError = document.querySelector("#name-error");
        
        const message = document.querySelector("#message").value;
        const messageError = document.querySelector("#message-error");
    
        const subject = document.querySelector("#subject").value;
        const subjectError = document.querySelector("#subject-error");
    
        const email = document.querySelector("#email").value;
        const emailError = document.querySelector("#email-error");
    
        
    
        if (inputCheck(name, 5) === true) {
            nameError.style.display = "none";
        } else {
            nameError.style.display = "block";
            errors++;
        }
    
        if (validateEmail(email) === true) {
            emailError.style.display = "none";
        } else {
            emailError.style.display = "block";
            errors++;
        }

        if (inputCheck(subject, 15) === true) {
            subjectError.style.display = "none";
        } else {
            subjectError.style.display = "block";
            errors++;
        }

        if (inputCheck(message, 25) === true) {
            messageError.style.display = "none";
        } else {
            messageError.style.display = "block";
            errors++;
        }
    
        // Display submit success message if there are no validation errors
        if(errors == 0 ) {
            
            postForm(name, email, subject, message);
            
            name.value = '';
            subject.value = '';
            email.value = '';
            message.value = '';
        } else {
            // Reset the error counter so it is ready for a new check when the user press "submit"
            errors = 0;
        }
    }