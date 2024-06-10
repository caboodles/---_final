document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const signInButton = document.getElementById("signInButton");
    const statusMessage = document.getElementById("statusMessage");

    function loadUsersFromSessionStorage() {
        const storedUsers = sessionStorage.getItem("users");
        return storedUsers ? JSON.parse(storedUsers) : [];
    }

    function findUser(username) {
        const users = loadUsersFromSessionStorage();
        return users.find((user) => user.userId === username);
    }

    function setLoggedInUser(user) {
        sessionStorage.setItem("loggedInUser", JSON.stringify(user));
    }

    function getLoggedInUser() {
        const user = sessionStorage.getItem("loggedInUser");
        return user ? JSON.parse(user) : null;
    }

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const user = findUser(username);

        if (user) {
            if (user.password === password) {
                setLoggedInUser(user);
                statusMessage.textContent = "로그인 되었습니다!";
                statusMessage.style.color = "green";
                // Redirect to home page or dashboard
                window.location.href = "products.html"; // Adjust the URL as needed
            } else {
                statusMessage.textContent = "올바르지 않은 비밀번호입니다.";
                statusMessage.style.color = "red";
            }
        } else {
            statusMessage.textContent = "존재하지 않는 유저입니다.";
            statusMessage.style.color = "red";
        }
    });

    signInButton.addEventListener("click", () => {
        window.location.href = "sign-in.html";
    });

    // Check if already logged in
    const loggedInUser = getLoggedInUser();
    if (loggedInUser) {
        statusMessage.textContent = `이미 ${loggedInUser.userId}로 로그인되어 있습니다.`;
        statusMessage.style.color = "green";
    }
});
