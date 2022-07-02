function getDate(date) {
    var dateSettings = { year: 'numeric', month: 'long', day: 'numeric' };
    var postDate  = new Date(date);
    return postDate.toLocaleDateString("en-US", dateSettings);
}

function validateCommentForm(inputName, inputEmail, inputComment) {
// Error counter to check if any errors before submit
    let errors = 0;

    if (inputCheck(inputName, 2) === true) {
        nameError.style.display = "none";
    } else {
        nameError.style.display = "block";
        errors++;
    }

    if (emailCheck(inputEmail) === true) {
        emailError.style.display = "none";
    } else {
        emailError.style.display = "block";
        errors++;
    }
    if (inputCheck(inputComment, 25) === true) {
        commentError.style.display = "none";
    } else {
        commentError.style.display = "block";
        errors++;
    }

    // Display submit success message if there are no validation errors
    if(errors == 0 ) {
        formSuccess.style.display = "block";
        formName.value = '';
        formSubject.value = '';
        formEmail.value = '';
    } else {
        // Reset the error counter so it is ready for a new check when the user press "submit"
        errors = 0;
    }
}

function inputCheck(value, len) {
    if (value.trim().length >= len) {
      return true;
    } else {
      return false;
    }
}

function validateEmail(email) {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const patternMatch = regEx.test(email);
    return patternMatch;
}

// Remove HTML tags from string
function stripTags(htmlString) {
    if(htmlString) {
        cleanString = htmlString.toString();
        return cleanString.replace( /(<([^>]+)>)/ig, '');
    } else {
        return false;
    }
}                  