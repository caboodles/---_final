document.addEventListener("DOMContentLoaded", () => {
    const signInForm = document.getElementById("signInForm");
    const statusMessage = document.getElementById("statusMessage");

    // 미리 로드된 사용자 데이터
    const preloadedUsers = [
        {
            userId: "admin",
            password: "admin",
            isAdmin: true,
            name: "Admin",
            address: "Admin 주소",
            phone: "01012345678",
            birthdate: "1980-01-01",
            cart: {}, // 초기 카트 비어 있음
            purchased: {}, // 초기 구매 내역 비어 있음
        },
        {
            userId: "sseol",
            password: "password",
            isAdmin: false,
            name: "설이",
            address: "서울시 용산구",
            phone: "01098765432",
            birthdate: "1990-05-15",
            cart: {}, // 초기 카트 비어 있음
            purchased: {}, // 초기 구매 내역 비어 있음
        },
        {
            userId: "jhkim",
            password: "mypassword",
            isAdmin: false,
            name: "김지현",
            address: "서울시 관악구",
            phone: "01045678901",
            birthdate: "1992-07-22",
            cart: {}, // 초기 카트 비어 있음
            purchased: {}, // 초기 구매 내역 비어 있음
        },
    ];

    // 사용자 데이터를 세션 스토리지에 미리 로드
    function preloadUsers() {
        const storedUsers = sessionStorage.getItem("users");
        if (!storedUsers) {
            sessionStorage.setItem("users", JSON.stringify(preloadedUsers));
        }
    }

    // 세션 스토리지에서 사용자 데이터 로드
    function loadUsersFromSessionStorage() {
        const storedUsers = sessionStorage.getItem("users");
        return storedUsers ? JSON.parse(storedUsers) : [];
    }

    // 사용자 데이터를 세션 스토리지에 저장
    function saveUsersToSessionStorage(users) {
        sessionStorage.setItem("users", JSON.stringify(users));
    }

    // 사용자 ID의 고유성 검사
    function isUserIdUnique(userId, users) {
        return !users.some((user) => user.userId === userId);
    }

    // 유효한 전화번호인지 검사
    function isValidPhoneNumber(phone) {
        const phoneRegex = /^\d{10,11}$/; // 10 또는 11자리 숫자
        return phoneRegex.test(phone);
    }

    // 회원가입 폼 제출 이벤트 처리
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
                isAdmin: false, // 기본 관리자 권한 없음
                name: name,
                address: address,
                phone: phone,
                birthdate: birthdate,
                cart: {}, // 초기 카트 비어 있음
                purchased: {}, // 초기 구매 내역 비어 있음
            };

            users.push(newUser); // 새로운 사용자 추가
            saveUsersToSessionStorage(users); // 세션 스토리지에 저장
            statusMessage.textContent = "성공적으로 등록되었습니다!";
            statusMessage.style.color = "green";
            signInForm.reset(); // 폼 초기화
        } else {
            statusMessage.textContent = "이미 존재하는 사용자 아이디입니다!";
            statusMessage.style.color = "red";
        }
    });

    // 페이지 로드 시 사용자 미리 로드
    preloadUsers();
});
