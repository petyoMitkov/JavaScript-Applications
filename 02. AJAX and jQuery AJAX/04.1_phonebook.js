$(function() {
    $("#btnLoad").click(loadContacts);

    function loadContacts() {
    	$("#phonebook").empty();
        $.get("https://phonebook-f6ac7.firebaseio.com/phonebook.json")
        	.then(displayContacts)
        	.catch(displayError);
    }

    function displayContacts(contacts) {
    	//alert(contacts.contact2.person);
        let keys = Object.keys(contacts);
        for (let key of keys) {
            let contact = contacts[key];
            let text = contact.person + ": " + contact.phone;
            //console.log(text);
            if (contact.person) {
                $("<li>").text(text).appendTo("#phonebook");
            }        
        }
    }

    function displayError() {
    	$("#phonebook")
    	.append($("<div style='background-color: #F8A9AB; display: inline-block'>")
    		.text("There is an Error! GET Request is broken."));
    }
});