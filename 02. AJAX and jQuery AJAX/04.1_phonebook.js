$(function() {
    $("#btnLoad").click(loadContacts);
    $('#btnCreate').click(createContact);

    function loadContacts() {
    	$("#phonebook").empty();
        $.get("https://phonebook-f6ac7.firebaseio.com/phonebook.json")
        	.then(displayContacts)
        	.catch(displayError);
    }

    function displayContacts(contacts) {
    	//alert(contacts.contact2.person);
        let keys = Object.keys(contacts);  //get Object keys
        for (let key of keys) {
            let contact = contacts[key];
            let text = contact.person + ": " + contact.phone + ' ';
            if (contact.person) {          
                let li = $("<li>");     
                li.text(text).appendTo("#phonebook");  //add <li> (contacts) to $phonebook

                li.append(                //add Delete element and append event
                    $("<a href='#'>[Delete]</a>").click(function() {
                        deleteContact(key);
                    }) );            
            }        
        }
    }

    function displayError() {
    	$("#phonebook")
    	.append($("<div style='background-color: #E62F34; display: inline-block'>")
    		.text("Error: You try to add new Contact with empty field or there is Database problem."));
    }

    function deleteContact(key) {
        let delRequest = {
            method: "DELETE",
            url: "https://phonebook-f6ac7.firebaseio.com/phonebook/" + key + ".json"
        };
        $.ajax(delRequest)
            .then(loadContacts)
            .catch(displayError);
    }

    function createContact() {
        let person = $("#person").val();
        let phone = $("#phone").val();
        let newContact = {
            person,
            phone
        };
        let newContactRequest = {
            method: "POST",
            url: "https://phonebook-f6ac7.firebaseio.com/phonebook.json", 
            data: JSON.stringify(newContact)
        };
        if (person != "" || phone != "") {
            $.ajax(newContactRequest)
                .then(loadContacts)
                .catch(displayError);

            $("#person").val("");
            $("#phone").val("");
        } else {
            displayError();
        }


    }
});