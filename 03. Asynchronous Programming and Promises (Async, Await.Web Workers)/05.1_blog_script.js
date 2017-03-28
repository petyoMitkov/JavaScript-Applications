$(document).ready(function() {
	//alert("test");
	const kinveyAppId = "kid_ByXHxNO2e";
	const serverUrl = "https://baas.kinvey.com/appdata";
	const kinveyUsername = "peter";
	const kinveyPassword = "p";
	const base64auth = btoa(kinveyUsername + ":" + kinveyPassword);
	const authHeader = { "Authorization" : "Basic " + base64auth };

	$("#btnLoadPosts").click(loadPostsClick);
	$("#btnViewPost").click(viewPostClick);


	function loadPostsClick() {
		//alert("test");
		let loadPostsRequest = {
			url: serverUrl + "/" + kinveyAppId + "/posts",
			headers: authHeader
		};

		$.ajax(loadPostsRequest)
			.then(displayPosts)
			.catch(displayError);
	}

	function viewPostClick() {
		//alert("test");

	}

	function displayPosts(posts) {
		$("#posts").empty();
		for (let post of posts) {
			let option = $("<option>")
				.text(post.title)
				.val(post._id);
			$("#posts").append(option);
		} 
		throw new Error(' '); //for test .catch()
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

});