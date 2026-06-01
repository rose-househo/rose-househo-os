const toast = document.querySelector('.toast');
let toastTimer = null;

function showToast(message) {
  if (!toast || !message) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
}

const menuButtons = document.querySelectorAll('.menu-item');
menuButtons.forEach((button) => {
  button.addEventListener('click', () => {
    menuButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    showToast(`${button.dataset.menu} 메뉴를 준비하고 있습니다.`);
  });
});

const toastButtons = document.querySelectorAll('[data-toast]');
toastButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showToast(button.dataset.toast);
  });
});

const waterButton = document.querySelector('.water-check');
const waterValue = document.querySelector('.water-value');
const waterPercent = document.querySelector('.water-percent');
const dropRow = document.querySelector('.drop-row');

if (waterButton && waterValue && waterPercent && dropRow) {
  waterButton.addEventListener('click', () => {
    waterValue.textContent = '1,250 ml';
    waterPercent.textContent = '83%';
    const drops = dropRow.querySelectorAll('span');
    drops.forEach((drop, index) => {
      drop.classList.toggle('filled', index < 6);
    });
    showToast('수분 체크 상태가 임시로 반영되었습니다.');
  });
}
