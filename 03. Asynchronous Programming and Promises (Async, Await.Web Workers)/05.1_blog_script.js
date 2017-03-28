$(document).ready(function() {
    const kinveyAppId = "kid_ByXHxNO2e";
    const serviceUrl = "https://baas.kinvey.com/appdata";
    const kinveyUsername = "peter";
    const kinveyPassword = "p";
    const base64auth = btoa(kinveyUsername + ":" + kinveyPassword);
    const authHeader = { "Authorization" : "Basic " + base64auth };

    $("#btnLoadPosts").click(loadPostsClick);
    $("#btnViewPost").click(viewPostClick);


    function loadPostsClick() {
        let loadPostsRequest = {
            url: serviceUrl + "/" + kinveyAppId + "/posts",
            headers: authHeader
        };
        
        $.ajax(loadPostsRequest)
            .then(displayPosts)
            .catch(displayError);
    }

    function viewPostClick() {
        let selectedPostID = $("#posts").val();   //get post_id from <select>
        //console.dir(selectedPostID);
        if (!selectedPostID) return;

        let requestPosts = $.ajax({
            url: serviceUrl + "/" + kinveyAppId +/posts/ + selectedPostID,
            headers: authHeader
        });
        let requestComments = $.ajax({
            url: serviceUrl + "/" + kinveyAppId + `/comments/?query={"post_id":"${selectedPostID}"}`,
            headers: authHeader
        });
       
        Promise.all([requestPosts, requestComments])
            .then(displayPostWithComments)
            .catch(displayError);
    }

    function displayPosts(posts) {
        $("#posts").empty();
        for (let post of posts) {
            let option = $("<option>")
                .text(post.title)
                .val(post._id);
            $("#posts").append(option);
        } 
        //throw new Error(' '); //for test .catch()
    }

    function displayError(err) {
        let errDiv = $("<div>").text("Error: " + err.status + "(" + err.statusText + ")");
        console.log("hi");
        $(document.body).prepend(errDiv);
        $(errDiv).css("color", "red").css("font-size", "30px");


        setTimeout(function() {
            $(errDiv).fadeOut(function() {
                $(errDiv).remove();
            });
        }, 3000);
    }

    function displayPostWithComments([post, comments]) {
        $("#post-title").text(post.title).css("color", "green");
        $("#post-body").text(post.body).css("color", "green");
        $("#post-comments").empty();

        for (let comment of comments) {
            let commentItem = $("<li>").text(comment.text);
            $("#post-comments").append(commentItem).css("color", "blue");
        }
    }

});