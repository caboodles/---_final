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
    const navMenu = document.querySelector(".nav_menu");

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

        // Add click event listeners to <li> elements in the sidebar
        const sidebarLinks = sidebar.querySelectorAll("li");
        sidebarLinks.forEach(function (li) {
            li.addEventListener("click", function () {
                const anchor = li.querySelector("a");
                if (anchor) {
                    window.location.href = anchor.href;
                }
            });
        });
    } else {
        console.error("Sidebar element not found");
    }

    if (navMenu) {
        // Add click event listeners to <li> elements in the nav menu
        const navMenuLinks = navMenu.querySelectorAll("li");
        navMenuLinks.forEach(function (li) {
            li.addEventListener("click", function () {
                const anchor = li.querySelector("a");
                if (anchor) {
                    window.location.href = anchor.href;
                }
            });
        });
    } else {
        console.error("Nav menu element not found");
    }

    updateNavbarLinks();
});
