(function () {
  const toast = document.querySelector(".toast");
  let toastTimer = null;

  const ROOM_LINKS = {
    "Rose Hall 열기": "__ROOT__",
    "집사 집무실 이동": "butler-office",
    "집무실로 이동": "butler-office",
    "집사 집무실로 이동": "butler-office",
    "회의실 이동": "meeting-room",
    "Belle Étage 이동": "belle-etage",
    "Belle Étage 기록 보기": "belle-etage",
    "오늘의 브리핑 열기": "belle-etage",
    "파우더룸 이동": "powder-room",
    "드레스룸 이동": "dress-room",
    "위시룸 이동": "wish-room",
    "나이트 체임버 이동": "night-chamber",
    "입욕 · 회복실 이동": "bath-chamber",
    "운동 · 식단 관리실 이동": "health-room",
    "영감 보관실 이동": "lumi-archive",
    "뮤직룸 이동": "music-room",
    "티룸 이동": "tea-room",
    "Library 이동": "library",
    "Study 이동": "study",
    "장부실 이동": "royal-ledger",
    "로즈 도서관 이동": "rose-library",
    "기억창고 이동": "lumi-archive"
  };

  function isInsideRooms() {
    return window.location.pathname.indexOf("/rooms/") !== -1;
  }

  function roomUrl(slug) {
    if (slug === "__ROOT__") {
      return isInsideRooms() ? "../../" : "./";
    }
    return isInsideRooms() ? "../" + slug + "/" : "rooms/" + slug + "/";
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message + " 준비 중입니다.";
    toast.classList.add("show");

    if (toastTimer) {
      window.clearTimeout(toastTimer);
    }

    toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 1600);
  }

  // ── Menu Pagination ──────────────────────────────────
  var currentNavPage = 1;
  var totalNavPages = 2;

  var page1El = document.getElementById("nav-page-1");
  var page2El = document.getElementById("nav-page-2");
  var labelEl = document.getElementById("nav-page-label");
  var prevBtn = document.getElementById("nav-prev");
  var nextBtn = document.getElementById("nav-next");

  function showNavPage(n) {
    currentNavPage = n;
    if (page1El) page1El.classList.toggle("nav-page--hidden", n !== 1);
    if (page2El) page2El.classList.toggle("nav-page--hidden", n !== 2);
    if (labelEl) labelEl.textContent = "୨୧ " + n + " / " + totalNavPages + " ୨୧";
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      if (currentNavPage > 1) showNavPage(currentNavPage - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      if (currentNavPage < totalNavPages) showNavPage(currentNavPage + 1);
    });
  }

  document.addEventListener("keydown", function (e) {
    var tag = document.activeElement && document.activeElement.tagName.toLowerCase();
    var ce = document.activeElement && document.activeElement.getAttribute("contenteditable");
    if (tag === "input" || tag === "textarea" || tag === "select" || ce === "true" || ce === "") return;

    if (e.key === "ArrowLeft") {
      if (currentNavPage > 1) showNavPage(currentNavPage - 1);
    } else if (e.key === "ArrowRight") {
      if (currentNavPage < totalNavPages) showNavPage(currentNavPage + 1);
    }
  });

  showNavPage(1);

  // ── Room link data-action handler ───────────────────
  document.querySelectorAll("[data-action]").forEach(function (target) {
    const action = target.getAttribute("data-action") || "이동";
    const slug = ROOM_LINKS[action];

    if (slug && target.tagName.toLowerCase() === "a") {
      target.setAttribute("href", roomUrl(slug));
    }

    target.addEventListener("click", function (event) {
      const currentAction = target.getAttribute("data-action") || "이동";
      const currentSlug = ROOM_LINKS[currentAction];

      if (currentSlug) {
        event.preventDefault();
        window.location.href = roomUrl(currentSlug);
        return;
      }

      event.preventDefault();
      showToast(currentAction || "이동");
    });
  });
}());
