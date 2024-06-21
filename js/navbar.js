document.addEventListener("DOMContentLoaded", function () {
    // 로그인된 사용자 정보를 세션 스토리지에서 가져오기
    function getLoggedInUser() {
        const user = sessionStorage.getItem("loggedInUser");
        return user ? JSON.parse(user) : null;
    }

    // 로그아웃 함수
    function logout() {
        sessionStorage.removeItem("loggedInUser");
        window.location.href = "login.html"; // 로그아웃 시 로그인 페이지로 이동
    }

    // 네비게이션 링크 업데이트 함수
    function updateNavbarLinks() {
        const user = getLoggedInUser();

        // 네비게이션 링크 요소 가져오기
        const loginLink = document.getElementById("loginLink");
        const logoutLink = document.getElementById("logoutLink");
        const signInLink = document.getElementById("signInLink");
        const myPageLink = document.getElementById("myPageLink");

        // 로그인 여부에 따라 링크 표시/숨기기
        if (user) {
            if (loginLink) loginLink.style.display = "none";
            if (logoutLink) logoutLink.style.display = "inline-block";
            if (signInLink) signInLink.style.display = "none";
            if (myPageLink) {
                myPageLink.style.display = "inline-block";
                myPageLink.href = "my-page.html"; // 마이 페이지 링크 설정
            }
        } else {
            if (loginLink) loginLink.style.display = "inline-block";
            if (logoutLink) logoutLink.style.display = "none";
            if (signInLink) signInLink.style.display = "inline-block";
            if (myPageLink) myPageLink.style.display = "none";
        }

        if (logoutLink) logoutLink.addEventListener("click", logout); // 로그아웃 클릭 시 로그아웃 함수 호출
    }

    const hamburgerBtn = document.getElementById("hamburgerBtn"); // 햄버거 버튼 요소
    const sidebar = document.getElementById("sidebar"); // 사이드바 요소
    const navbar = document.querySelector(".navbar"); // 네비게이션 바 요소
    const navMenu = document.querySelector(".nav_menu"); // 네비게이션 메뉴 요소

    if (hamburgerBtn) {
        // 햄버거 버튼 클릭 시 사이드바 토글
        hamburgerBtn.addEventListener("click", function () {
            if (sidebar) {
                sidebar.classList.toggle("show"); // 사이드바 표시/숨기기 토글
            } else {
                console.error("Sidebar element not found"); // 사이드바 요소가 없을 때 오류 로그
            }
        });
    } else {
        console.error("Hamburger button not found"); // 햄버거 버튼 요소가 없을 때 오류 로그
    }

    if (sidebar) {
        // 사이드바에 마우스를 올리면 네비게이션 바 색상 변경
        sidebar.addEventListener("mouseenter", function () {
            navbar.classList.add("orange"); // 네비게이션 바에 orange 클래스 추가
        });

        sidebar.addEventListener("mouseleave", function () {
            navbar.classList.remove("orange"); // 네비게이션 바에서 orange 클래스 제거
        });

        // 사이드바 항목 클릭 시 해당 링크로 이동
        const sidebarLinks = sidebar.querySelectorAll("li");
        sidebarLinks.forEach(function (li) {
            li.addEventListener("click", function () {
                const anchor = li.querySelector("a");
                if (anchor) {
                    window.location.href = anchor.href; // 클릭한 항목의 링크로 이동
                }
            });
        });
    } else {
        console.error("Sidebar element not found"); // 사이드바 요소가 없을 때 오류 로그
    }

    if (navMenu) {
        // 네비게이션 메뉴 항목 클릭 시 해당 링크로 이동
        const navMenuLinks = navMenu.querySelectorAll("li");
        navMenuLinks.forEach(function (li) {
            li.addEventListener("click", function () {
                const anchor = li.querySelector("a");
                if (anchor) {
                    window.location.href = anchor.href; // 클릭한 항목의 링크로 이동
                }
            });
        });
    } else {
        console.error("Nav menu element not found"); // 네비게이션 메뉴 요소가 없을 때 오류 로그
    }

    updateNavbarLinks(); // 페이지 로드 시 네비게이션 링크 업데이트
});
