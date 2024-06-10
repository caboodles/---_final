document.addEventListener("DOMContentLoaded", () => {
    const signInForm = document.getElementById("signInForm");
    const statusMessage = document.getElementById("statusMessage");

    // Preload users if not already in session storage
    const preloadedUsers = [
        {
            userId: "admin",
            password: "admin",
            isAdmin: true,
            name: "Admin",
            address: "Admin 주소",
            phone: "01012345678",
            birthdate: "1980-01-01",
            cart: {}, // Empty cart initially
            purchased: {}, // Empty purchased history initially
        },
        {
            userId: "sseol",
            password: "password",
            isAdmin: false,
            name: "설이",
            address: "서울시 용산구",
            phone: "01098765432",
            birthdate: "1990-05-15",
            cart: {}, // Empty cart initially
            purchased: {}, // Empty purchased history initially
        },
        {
            userId: "jhkim",
            password: "mypassword",
            isAdmin: false,
            name: "김지현",
            address: "서울시 관악구",
            phone: "01045678901",
            birthdate: "1992-07-22",
            cart: {}, // Empty cart initially
            purchased: {}, // Empty purchased history initially
        },
    ];

    function preloadUsers() {
        const storedUsers = sessionStorage.getItem("users");
        if (!storedUsers) {
            sessionStorage.setItem("users", JSON.stringify(preloadedUsers));
        }
    }

    function loadUsersFromSessionStorage() {
        const storedUsers = sessionStorage.getItem("users");
        return storedUsers ? JSON.parse(storedUsers) : [];
    }

    function saveUsersToSessionStorage(users) {
        sessionStorage.setItem("users", JSON.stringify(users));
    }

    function isUserIdUnique(userId, users) {
        return !users.some((user) => user.userId === userId);
    }

    function isValidPhoneNumber(phone) {
        const phoneRegex = /^\d{10,11}$/; // Matches exactly 10 or 11 digits
        return phoneRegex.test(phone);
    }

    signInForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const userId = document.getElementById("userId").value;
        const password = document.getElementById("password").value;
        const name = document.getElementById("name").value;
        const address = document.getElementById("address").value;
        const phone = document.getElementById("phone").value;
        const birthdate = document.getElementById("birthdate").value;

        const users = loadUsersFromSessionStorage();

        if (!isValidPhoneNumber(phone)) {
            statusMessage.textContent = "유효하지 않은 전화번호입니다.";
            statusMessage.style.color = "red";
            return;
        }

        if (isUserIdUnique(userId, users)) {
            const newUser = {
                userId: userId,
                password: password,
                isAdmin: false, // Default to false
                name: name,
                address: address,
                phone: phone,
                birthdate: birthdate,
                cart: {}, // Empty cart initially
                purchased: {}, // Empty purchased history initially
            };

            users.push(newUser);
            saveUsersToSessionStorage(users);
            statusMessage.textContent = "성공적으로 등록되었습니다!";
            statusMessage.style.color = "green";
            signInForm.reset();
        } else {
            statusMessage.textContent = "이미 존재하는 사용자 아이디입니다!";
            statusMessage.style.color = "red";
        }
    });

    // Preload users on page load
    preloadUsers();
});
