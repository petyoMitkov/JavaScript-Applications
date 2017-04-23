function startApp() {
    sessionStorage.clear(); //Clear user auth data
    
    showHideMenuLinks();
    showView("viewHome");
    showViewGroup();
     

    actionsGroup(); 


    function showHideMenuLinks() {
        $("#linkHome").show();
        if (sessionStorage.getItem("authToken")) {
            //We have logged in user
            $("#linkLogin").hide();
            $("#linkRegister").hide();
            $("#linkListBooks").show();
            $("#linkCreateBook").show();
            $("#linkLogout").show();
        } else {
            //No logged in user
            $("#linkLogin").show();
            $("#linkRegister").show();
            $("#linkListBooks").hide();
            $("#linkCreateBook").hide();
            $("#linkLogout").hide();
        }
    }

    function showView(viewName) {
        //Hide all views and show the selected view only
        $("main > section").hide();
        $("#" + viewName).show();

        //$("#box").text(" ");
        $("#box").show();
       
    }
    function showViewGroup() {
        //Bind the navigation menu links, show views
        $("#linkHome").click(showHomeView);
        $("#linkLogin").click(showLoginView);
        $("#linkRegister").click(showRegisterView);
        $("#linkListBooks").click(showBooksView);
        $("#linkCreateBook").click(showCreateBook);
        $("#linkLogout").click(showLogoutUser);

        //Show view functions        
        function showHomeView() {
            showView("viewHome");
            
        }
        function showLoginView() {
            showView("viewLogin");
            $("#formLogin").trigger("reset");
        }
        function showRegisterView() {
            $("#formRegister").trigger("reset");
            showView("viewRegister");
        }
        function showBooksView() {
            $("#books").trigger("reset");
            showView("viewBooks");
        }
        function showCreateBook() {
            $("#formCreateBook").trigger('reset');
            showView("viewCreateBook");
        }
        function showLogoutUser() {
            //alert("Good bay.");
            showHomeView();
        }
    }
 
    function actionsGroup() {
        //Bind the form submit actions
        $("#viewLogin").submit(loginUser);
        $("#formRegister").submit(registerUser); //Call the form, not the <input type=button/>
        $("#formCreateBook").submit(createBook);
        $("#editBook").click(editBook);

        $("#linkLogout").click(logout);

        //Bind the info / error boxes: hide on click
        $("#infoBox, #errorBox").click(function() {
            $(this).fadeOut();
        });

        //Attach AJAX "loading" event listener
        $(document).on({
            ajaxStart: function() { $("#loadingBox").show() },
            ajaxStop: function() { $("#loadingBox").hide() } 
        });


        const kinveyBaseUrl = "https://baas.kinvey.com/";
        const kinveyAppKey = "kid_H1wL3TMTe";
        const kinveyAppSecret = "ff69a457c44e48c397483db6d89896d8";
        const kinveyAppAuthHeaders = {
            "Authorization": "Basic " + btoa(kinveyAppKey + ":" + kinveyAppSecret),
        };
                     
        //Action functions
        function loginUser(event) {
            event.preventDefault(); // !!!!!! Very importent, do not forget
            $("#box").hide();
            let userData = {
                username: $('#formLogin input[name="username"]').val(),
                password: $('#formLogin input[name="passwd"]').val()
            };
            //console.dir(userData);

            $.ajax({
                method: "POST",
                url: kinveyBaseUrl + "user/" + kinveyAppKey + "/login",
                headers: kinveyAppAuthHeaders,
                data: JSON.stringify(userData),
                contentType: "application/json",
                success: loginSuccess,
                error: handleAjaxError
            });
            //listBooks();


            function loginSuccess(userInfo) {
                saveAuthInSession(userInfo);
                showHideMenuLinks();
                showView("viewBooks");
                showInfoBox("Successul Login!");
                listBooksFromKinvey();
            }
        }
        
        function registerUser(event) {
            event.preventDefault(); // !!!!!! Very importent, do not forget
            $("#box").hide();
            let userData = {
                username: $('#formRegister input[name="username"]').val(),
                password: $('#formRegister input[name="passwd"]').val()
            };

            //console.dir(userData);
           
            $.ajax({
                method: "POST",
                url: kinveyBaseUrl + "user/" + kinveyAppKey + "/",
                headers: kinveyAppAuthHeaders,
                contentType: "application/json",
                data: JSON.stringify(userData),
                success: registerUserSuccess,
                error: handleAjaxError
            }); 

            function registerUserSuccess(userInfo) {
                //alert("Success Registration!!! \n" + "User: " + userData.username);
                saveAuthInSession(userInfo);
                showHideMenuLinks();
                showView("viewBooks"); 
                showInfoBox("Registration Successful!" + "\n" + " User: " + userInfo.username); 
                listBooksFromKinvey();    
            }       
        }  
        
        function saveAuthInSession(userInfo) {
                let userAuth = userInfo._kmd.authtoken;
                sessionStorage.setItem("authToken", userAuth);

                let userId = userInfo._id;
                sessionStorage.setItem("userId", userId);

                let username = userInfo.username;
                sessionStorage.setItem("username", username);

                $("#loggedInUser").text("Welcome, " + username + "!");  
        } 
        function showInfoBox(massage) {
            $("#box").hide();        
            $('#infoBox').text(massage);
            $("#infoBox").show();
            $("#infoBox").fadeOut(2500);
            setTimeout(function() {
                     $("#box").show(1);
            }, 2490);       
        }      
        function handleAjaxError(response) {
            let errorMsg = JSON.stringify(response);
            if (response.readyState === 0)
                errorMsg = "Cannot connect due to network error.";
            if (response.responseJSON && response.responseJSON.description )
                errorMsg = response.responseJSON.description;

            showError(errorMsg);
        }
        function showError(errorMsg) {
            $("#errorBox").text("Error: " + errorMsg);
            $("#errorBox").show();
            $("#errorBox").fadeOut(10000);
        }

        function logout() {
            sessionStorage.clear();
            $("#loggedInUser").text("");
            showHideMenuLinks();
            //showView("viewHome");  // contend in view group functions
            showInfoBox("Logout Successful");
        }

        function listBooksFromKinvey() {
            $("#books").empty();
            showView("viewBooks");

            $.ajax({
                method: "GET",
                url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books",
                headers: getKinveyUserAuthHeaders(),
                success: loadBooksSuccess,
                error: handleAjaxError
            });

            function loadBooksSuccess(books) {                
                let booksTable = $(`
                    <table>
                        <tr>
                            <th>Taitle</th>
                            <th>Author</th>
                            <th>Descrition</th>
                            <th>Actions</th>
                        </tr>
                    </table>`);
                
                for (let book of books) {
                    appendBookRow(book, booksTable);
                    $("#books").append(booksTable);
                }
                if (books.length === 0) {
                    showError("No books in library.");
                }

                function appendBookRow (book, booksTable) {
                    let links = [];
                    if (book._acl.creator === sessionStorage.getItem("userId")) {
                        // let deleteLink = $("<a href='#'>[Delete]</a>")
                        let deleteLink = $("<button type='button' id='btnDeleteBook'>Delete</button>")
                            .click(function() { deleteBookById(book._id); });
                        let editLink = $("<button type='button' id='btnEditBook'>Edit</button>")
                            .click(function () { loaldBookForEdit(book._id); });
                        links.push(deleteLink);
                        links.push(" ");
                        links.push(editLink);
                    }                  

                    let tr = $(`<tr>`);
                    
                    tr.append(
                        $("<td>").text(book.title),
                        $("<td>").text(book.author),
                        $("<td>").text(book.description),
                        $("<td>").append(links)
                    );

                    booksTable.append(tr);
                } 
            }
        }

        function getKinveyUserAuthHeaders() {
            return {
                "Authorization": "Kinvey " + sessionStorage.getItem("authToken"),
            };
        }

        function createBook(event) {
            event.preventDefault();
            let bookData = {
                title: $("#formCreateBook input[name=title]").val(),
                author: $("#formCreateBook input[name=author]").val(),
                description: $("#formCreateBook textarea[name=description]").val()
            };

            $.ajax({
                method: "POST",
                url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books",
                headers: getKinveyUserAuthHeaders(),
                data: bookData,
                success: createBookSuccess,
                error: handleAjaxError 
            });

            function createBookSuccess(response) {
                listBooksFromKinvey();
                showInfoBox("Book created.");
            }
        }

        function deleteBookById(bookId) {
            $.ajax({
                method: "DELETE",
                url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books/" + bookId,
                headers: getKinveyUserAuthHeaders(),
                success: deleteBookSuccess,
                error: handleAjaxError
            });

            function deleteBookSuccess() {
                listBooksFromKinvey();
                showInfoBox("Book deleted.")
            }
        }   

        function loaldBookForEdit(bookId) {
            $.ajax({
                method: "GET",
                url: kinveyBookUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books/" + bookId,
                headers: getKinveyUserAuthHeaders(),
                success: loadBookForEditSuccess,
                error: handleAjaxError
            });

            function loadBookForEditSuccess(book) {
                $("#formEditBook input[name=id]").val(book._id);
                $("#formEditBook input[name=title]").val(book.title);
                $("#formEditBook input[name=author]").val(book.author);
                $("#formEditBook textarea[name=description]").val(book.description);
            
                showView("viewEditBook");
            }
        }  

        function editBook(bookId) {
            let bookData = {
                title: $("#formEditBook input[name=title]").val(),
                author: $("#formEditBook input[name=author]").val(),
                description: $("#formEditBook textarea[name=description]").val()
            };
            $.ajax({
                method: "PUT", 
                url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books/" + $("#formEditBook input[name=id]").val(), 
                headers: getKinveyUserAuthHeaders(),
                data: bookData,
                success: editBookSuccess,
                error: handleAjaxError
            });        
            
            function editBookSuccess() {
                listBooksFromKinvey();
                
            }
        }      
    }      
    
}