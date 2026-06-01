const toast = document.querySelector(".toast");
let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

const menuItems = document.querySelectorAll(".menu-item");
menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    menuItems.forEach((button) => button.classList.remove("active"));
    item.classList.add("active");
    showToast(`${item.dataset.menu} 메뉴로 이동했어요.`);
  });
});

const actionButtons = document.querySelectorAll(".action-button, .soft-button, .status-card");
actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const label = button.innerText.trim().split("\n")[0];
    if (label) showToast(`${label}을 준비했어요.`);
  });
});

const waterCard = document.querySelector(".water-card");
const waterDrops = document.querySelectorAll(".water-drops span");
let waterCount = 5;

if (waterCard && waterDrops.length) {
  waterCard.addEventListener("click", (event) => {
    if (!event.target.closest("button")) return;
    waterCount = Math.min(waterCount + 1, waterDrops.length);
    waterDrops.forEach((drop, index) => {
      drop.classList.toggle("filled", index < waterCount);
    });
    showToast(`물 섭취 기록 ${waterCount}잔으로 저장했어요.`);
  });
}
