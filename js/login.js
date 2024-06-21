document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const signInButton = document.getElementById("signInButton");
    const statusMessage = document.getElementById("statusMessage");

    // 세션 스토리지에서 사용자 데이터 로드
    function loadUsersFromSessionStorage() {
        const storedUsers = sessionStorage.getItem("users");
        return storedUsers ? JSON.parse(storedUsers) : [];
    }

    // 사용자 ID로 사용자 검색
    function findUser(username) {
        const users = loadUsersFromSessionStorage();
        return users.find((user) => user.userId === username);
    }

    // 로그인된 사용자 세션 스토리지에 저장
    function setLoggedInUser(user) {
        sessionStorage.setItem("loggedInUser", JSON.stringify(user));
    }

    // 로그인된 사용자 정보 로드
    function getLoggedInUser() {
        const user = sessionStorage.getItem("loggedInUser");
        return user ? JSON.parse(user) : null;
    }

    // 로그인 폼 제출 이벤트 처리
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
                // 제품 페이지로 리디렉션
                window.location.href = "products.html"; // 필요에 따라 URL 조정
            } else {
                statusMessage.textContent = "올바르지 않은 비밀번호입니다.";
                statusMessage.style.color = "red";
            }
        } else {
            statusMessage.textContent = "존재하지 않는 유저입니다.";
            statusMessage.style.color = "red";
        }
    });

    // 회원가입 페이지로 이동
    signInButton.addEventListener("click", () => {
        window.location.href = "sign-in.html";
    });

    // 이미 로그인된 경우 메시지 표시
    const loggedInUser = getLoggedInUser();
    if (loggedInUser) {
        statusMessage.textContent = `이미 ${loggedInUser.userId}로 로그인되어 있습니다.`;
        statusMessage.style.color = "green";
    }
});
