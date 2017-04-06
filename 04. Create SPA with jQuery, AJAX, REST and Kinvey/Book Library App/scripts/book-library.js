function startApp() {
    sessionStorage.clear(); //Clear user auth data
    showHideMenuLinks();
    showViewGroup();

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

    function showViewGroup() {
        //Bind the navigation menu links, show views
        $("#linkHome").click(showHomeView);
        $("#linkLogin").click(showLoginView);
        $("#linkRegister").click(showRegisterView);
        $("#linkListBooks").click(showBooksView);
        $("#linkCreateBook").click(showCreateBook);
        $("#linkLogout").click(showLogoutUser);

        //For start view
        showView("viewHome");

        //Show view functuins
        function showView(viewName) {
            //Hide all views and show the selected view only
            $("main > section").hide();
            $("#" + viewName).show();
        }
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
 

}