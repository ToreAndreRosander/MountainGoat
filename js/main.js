function getDate(date) {
    var dateSettings = { year: 'numeric', month: 'long', day: 'numeric' };
    var postDate  = new Date(date);
    return postDate.toLocaleDateString("nb-NO", dateSettings);
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