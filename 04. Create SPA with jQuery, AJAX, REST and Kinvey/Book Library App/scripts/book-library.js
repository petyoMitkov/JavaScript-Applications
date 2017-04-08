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
            //$("#formCreateBook").trigger('reset');
            showView("viewCreateBook");
        }
        function showLogoutUser() {
            alert("Good bay.");
            showLoginView();
        }
    }
 
    function actionsGroup() {
        //Bind the form submit actions
        $("#btnLoginUser").click(loginUser);
        $("#btnRegisterUser").click(registerUser);
        $("#createBook").click(createBook);
        $("#editBook").click(editBook);

        $().submit(function(e) { e.preventDefault() });

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
        function loginUser() {
        }
        
        function registerUser() {
            //let fieldName = $("#regName").val();
            //let fieldPass = $("#regPass").val();
            let userData = {
                username: $('#formRegister input[name="username"]').val(),
                password: $('#formRegister input[name="passwd"]').val()
            };
            console.dir(userData);
           
            $.ajax({
                method: "POST",
                url: kinveyBaseUrl + "user/" + kinveyAppKey + "/",
                headers: kinveyAppAuthHeaders,
                contentType: "application/json",
                data: JSON.stringify(userData),
                success: function() { alert("Success Registration!!! \n" + "User: " + userData.username) },
                error: function() { alert("AJAX Error") }
            });           
        }  

        function createBook() {
           
        }
        function editBook() {
          
        }
    }   
     
     


}