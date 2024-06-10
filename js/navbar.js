document.addEventListener("DOMContentLoaded", function () {
    function getLoggedInUser() {
        const user = sessionStorage.getItem("loggedInUser");
        return user ? JSON.parse(user) : null;
    }

    function logout() {
        sessionStorage.removeItem("loggedInUser");
        window.location.href = "login.html"; // Redirect to login page after logout
    }

    function updateNavbarLinks() {
        const user = getLoggedInUser();

        const loginLink = document.getElementById("loginLink");
        const logoutLink = document.getElementById("logoutLink");
        const signInLink = document.getElementById("signInLink");
        const myPageLink = document.getElementById("myPageLink");

        if (user) {
            loginLink.style.display = "none";
            logoutLink.style.display = "inline-block";
            signInLink.style.display = "none";
            myPageLink.style.display = "inline-block";
            myPageLink.href = "my-page.html"; // Set the URL for My Page
        } else {
            loginLink.style.display = "inline-block";
            logoutLink.style.display = "none";
            signInLink.style.display = "inline-block";
            myPageLink.style.display = "none";
        }

        logoutLink.addEventListener("click", logout);
    }

    updateNavbarLinks();
});
