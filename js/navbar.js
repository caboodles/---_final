document.addEventListener("DOMContentLoaded", function () {
    function getLoggedInUser() {
        const user = sessionStorage.getItem("loggedInUser");
        return user ? JSON.parse(user) : null;
    }

    function logout() {
        sessionStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    }

    function updateNavbarLinks() {
        const user = getLoggedInUser();

        const loginLink = document.getElementById("loginLink");
        const logoutLink = document.getElementById("logoutLink");
        const signInLink = document.getElementById("signInLink");
        const myPageLink = document.getElementById("myPageLink");

        if (user) {
            if (loginLink) loginLink.style.display = "none";
            if (logoutLink) logoutLink.style.display = "inline-block";
            if (signInLink) signInLink.style.display = "none";
            if (myPageLink) {
                myPageLink.style.display = "inline-block";
                myPageLink.href = "my-page.html";
            }
        } else {
            if (loginLink) loginLink.style.display = "inline-block";
            if (logoutLink) logoutLink.style.display = "none";
            if (signInLink) signInLink.style.display = "inline-block";
            if (myPageLink) myPageLink.style.display = "none";
        }

        if (logoutLink) logoutLink.addEventListener("click", logout);
    }

    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const sidebar = document.getElementById("sidebar");
    const navbar = document.querySelector(".navbar");

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", function () {
            if (sidebar) {
                sidebar.classList.toggle("show");
            } else {
                console.error("Sidebar element not found");
            }
        });
    } else {
        console.error("Hamburger button not found");
    }
    if (sidebar) {
        sidebar.addEventListener("mouseenter", function () {
            navbar.classList.add("orange");
        });

        sidebar.addEventListener("mouseleave", function () {
            navbar.classList.remove("orange");
        });
    } else {
        console.error("Sidebar element not found");
    }

    updateNavbarLinks();
});
