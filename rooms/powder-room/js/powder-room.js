const powderShell = document.querySelector(".powder-shell");
const toast = document.querySelector(".room-toast");
const maidChatModal = document.querySelector(".maid-chat-modal");
const routineScreen = document.querySelector(".routine-screen");
const plaqueTitle = document.querySelector(".title-plaque h1");
const plaqueSubtitle = document.querySelector(".title-plaque p");
let toastTimer = null;

function showPowderToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1500);
}

function openMaidChat() {
  if (!maidChatModal) return;
  maidChatModal.classList.add("is-open");
  maidChatModal.setAttribute("aria-hidden", "false");
}

function closeMaidChat() {
  if (!maidChatModal) return;
  maidChatModal.classList.remove("is-open");
  maidChatModal.setAttribute("aria-hidden", "true");
}

function setActiveNav(sectionName) {
  if (!powderShell) return;
  const navItems = powderShell.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.section === sectionName);
  });
}

function setPlaqueText(title, subtitle) {
  if (plaqueTitle) plaqueTitle.textContent = title;
  if (plaqueSubtitle) plaqueSubtitle.textContent = subtitle;
}

function showHomeScreen() {
  if (!powderShell) return;
  setPlaqueText("공주님 전용 파우더룸", "오늘의 피부와 기분을 메이드와 함께 준비해요");
  powderShell.classList.remove("is-routine");
  if (routineScreen) routineScreen.setAttribute("aria-hidden", "true");
  setActiveNav("home");
}

function showRoutineScreen() {
  if (!powderShell) return;
  setPlaqueText("오늘 루틴", "공주님의 피부 컨디션에 맞춰 오늘의 케어 순서를 정리했어요.");
  powderShell.classList.add("is-routine");
  if (routineScreen) routineScreen.setAttribute("aria-hidden", "false");
  setActiveNav("routine");
}

if (powderShell) {
  powderShell.addEventListener("click", (event) => {
    const actionTarget = event.target.closest("[data-action]");
    const sectionTarget = event.target.closest("[data-section]");

    if (actionTarget) {
      const action = actionTarget.dataset.action;

      if (action === "close-maid-chat") {
        closeMaidChat();
        return;
      }

      if (action === "open-maid-chat") {
        openMaidChat();
        return;
      }

      if (action === "view-routine") {
        showRoutineScreen();
        return;
      }

      showPowderToast("아직 연결 전입니다. 다음 단계에서 기능을 이어갈게요.");
      return;
    }

    if (sectionTarget) {
      const sectionName = sectionTarget.dataset.section;

      if (sectionName === "home") {
        showHomeScreen();
        return;
      }

      if (sectionName === "routine") {
        showRoutineScreen();
        return;
      }

      setActiveNav(sectionName);
      setPlaqueText("공주님 전용 파우더룸", "오늘의 피부와 기분을 메이드와 함께 준비해요");
      powderShell.classList.remove("is-routine");
      if (routineScreen) routineScreen.setAttribute("aria-hidden", "true");

      if (sectionName === "maid-chat") {
        openMaidChat();
        return;
      }

      showPowderToast("메뉴 입구만 준비되어 있어요.");
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMaidChat();
});
