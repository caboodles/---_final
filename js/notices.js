document.addEventListener("DOMContentLoaded", function () {
    const noticeBoard = document.getElementById("noticeBoard");
    const noticeModal = document.getElementById("noticeModal");
    const closeModal = document.getElementsByClassName("close")[0];
    const addNoticeBtn = document.getElementById("addNoticeBtn");
    const noticeForm = document.getElementById("noticeForm");

    // 세션 스토리지에서 공지사항 로드
    let notices = JSON.parse(sessionStorage.getItem("notices")) || [
        {
            title: "농장 방문 시간 변경 안내",
            writer: "Admin",
            date: "2024-06-01",
            content:
                "농장 방문 시간이 2024년 6월 3일부터 변경됩니다. 새로운 방문 시간은 오전 10시부터 오후 4시까지 입니다.",
            clicks: 0,
            important: true,
        },
        {
            title: "새로운 상품 입고 안내",
            writer: "Admin",
            date: "2024-06-03",
            content: "새로운 상품이 입고되었습니다. 많은 관심 부탁드립니다.",
            clicks: 0,
            important: false,
        },
    ];

    // 공지사항 세션 스토리지에 저장
    function saveNotices() {
        sessionStorage.setItem("notices", JSON.stringify(notices));
    }

    // 공지사항 렌더링
    function renderNotices() {
        noticeBoard.innerHTML = ""; // 기존 공지사항 초기화
        notices
            .sort((a, b) => b.important - a.important) // 긴급 공지를 상단에 정렬
            .forEach((notice, index) => {
                const noticeCard = document.createElement("div");
                noticeCard.className =
                    "notice-card" + (notice.important ? " important" : "");
                noticeCard.innerHTML = `
                <div class="notice-header">
                    <div class="notice-number">#${index + 1}</div>
                    <div class="notice-title">${notice.title}</div>
                    <div class="notice-writer">by ${notice.writer}</div>
                    <div class="notice-date">${notice.date}</div>
                    <div class="notice-clicks">Clicks: ${notice.clicks}</div>
                </div>
                <div class="notice-content">${notice.content}</div>
            `;
                noticeCard.addEventListener("click", function () {
                    const content = this.querySelector(".notice-content");
                    content.style.display =
                        content.style.display === "block" ? "none" : "block";
                    if (content.style.display === "block") {
                        notice.clicks++;
                        this.querySelector(
                            ".notice-clicks"
                        ).textContent = `Clicks: ${notice.clicks}`;
                        saveNotices(); // 클릭 수 업데이트 후 세션 스토리지에 저장
                    }
                });
                noticeBoard.appendChild(noticeCard); // 공지사항 카드 DOM에 추가
            });
    }

    // 로그인된 사용자 가져오기
    function getLoggedInUser() {
        const user = sessionStorage.getItem("loggedInUser");
        return user ? JSON.parse(user) : null;
    }

    // 사용자 관리자 여부 확인
    function isAdmin() {
        const user = getLoggedInUser();
        return user && user.isAdmin;
    }

    // 관리자인 경우 공지 추가 버튼 표시
    if (isAdmin()) {
        addNoticeBtn.style.display = "block";
    } else {
        addNoticeBtn.style.display = "none";
    }

    // 공지 추가 버튼 클릭 시 모달 표시
    addNoticeBtn.addEventListener("click", function () {
        noticeModal.style.display = "flex";
    });

    // 모달 닫기 버튼 클릭 시 모달 숨김
    closeModal.addEventListener("click", function () {
        noticeModal.style.display = "none";
    });

    // 모달 외부 클릭 시 모달 숨김
    window.addEventListener("click", function (event) {
        if (event.target == noticeModal) {
            noticeModal.style.display = "none";
        }
    });

    // 공지사항 폼 제출 시 새 공지사항 추가
    noticeForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const newNotice = {
            title: document.getElementById("title").value,
            writer: document.getElementById("writer").value,
            date: new Date().toISOString().split("T")[0],
            content: document.getElementById("content").value,
            clicks: 0,
            important: document.getElementById("important").checked,
        };
        if (newNotice.title && newNotice.writer && newNotice.content) {
            notices.push(newNotice); // 새 공지사항 배열에 추가
            renderNotices(); // 공지사항 다시 렌더링
            saveNotices(); // 세션 스토리지에 저장
            noticeModal.style.display = "none"; // 모달 숨김
            noticeForm.reset(); // 폼 초기화
        }
    });

    renderNotices(); // 페이지 로드 시 공지사항 렌더링
});
