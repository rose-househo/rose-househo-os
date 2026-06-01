const toast = document.querySelector(".toast");
let toastTimer = null;

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

document.querySelectorAll(".js-toast").forEach((button) => {
  button.addEventListener("click", () => {
    const message = button.getAttribute("data-toast") || "준비 중입니다.";
    showToast(message);
  });
});

document.querySelectorAll(".menu-item").forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();

    document.querySelectorAll(".menu-item").forEach((menuItem) => {
      menuItem.classList.remove("active");
    });

    item.classList.add("active");

    const label = item.querySelector("span:last-child");
    const labelText = label ? label.textContent.trim() : "메뉴";
    showToast(`${labelText} 영역은 1차 클린 베이스에서 자리만 준비했습니다.`);
  });
});
