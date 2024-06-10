document.addEventListener("DOMContentLoaded", function () {
    const noticeBoard = document.getElementById("noticeBoard");
    const noticeModal = document.getElementById("noticeModal");
    const closeModal = document.getElementsByClassName("close")[0];
    const addNoticeBtn = document.getElementById("addNoticeBtn");
    const noticeForm = document.getElementById("noticeForm");

    // Retrieve notices from sessionStorage
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
        // Add more initial notices if needed
    ];

    function saveNotices() {
        sessionStorage.setItem("notices", JSON.stringify(notices));
    }

    function renderNotices() {
        noticeBoard.innerHTML = "";
        notices
            .sort((a, b) => b.important - a.important)
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
                        saveNotices(); // Save updated clicks to sessionStorage
                    }
                });
                noticeBoard.appendChild(noticeCard);
            });
    }

    // Get logged-in user
    function getLoggedInUser() {
        const user = sessionStorage.getItem("loggedInUser");
        return user ? JSON.parse(user) : null;
    }

    // Check if user is admin
    function isAdmin() {
        const user = getLoggedInUser();
        return user && user.isAdmin;
    }

    if (isAdmin()) {
        addNoticeBtn.style.display = "block";
    } else {
        addNoticeBtn.style.display = "none";
    }

    addNoticeBtn.addEventListener("click", function () {
        noticeModal.style.display = "flex";
    });

    closeModal.addEventListener("click", function () {
        noticeModal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target == noticeModal) {
            noticeModal.style.display = "none";
        }
    });

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
            notices.push(newNotice);
            renderNotices();
            saveNotices(); // Save notices to sessionStorage
            noticeModal.style.display = "none";
            noticeForm.reset();
        }
    });

    renderNotices();
});
