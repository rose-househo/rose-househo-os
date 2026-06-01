const toast = document.querySelector('.toast');
let toastTimer = null;

function showToast(message) {
  if (!toast || !message) return;
  toast.textContent = message;
  toast.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('is-show');
  }, 1800);
}

function setActiveButton(buttons, current) {
  buttons.forEach((button) => button.classList.remove('is-active'));
  current.classList.add('is-active');
}

const navButtons = document.querySelectorAll('.nav-item');
navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setActiveButton(navButtons, button);
    showToast(`${button.dataset.menu} 장부 기준으로 표시합니다.`);
  });
});

const filterButtons = document.querySelectorAll('.filter-tab');
const ledgerRows = document.querySelectorAll('.ledger-row:not(.table-head)');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setActiveButton(filterButtons, button);
    const filter = button.dataset.filter;

    ledgerRows.forEach((row) => {
      const category = row.dataset.category || '';
      const visible = filter === '전체' || category.includes(filter);
      row.classList.toggle('is-hidden', !visible);
    });

    showToast(`${filter} 항목만 장부에 표시합니다.`);
  });
});

document.querySelectorAll('[data-toast]').forEach((button) => {
  button.addEventListener('click', () => {
    showToast(button.dataset.toast);
  });
});
