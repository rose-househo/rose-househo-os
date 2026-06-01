const toast = document.querySelector('.toast');
let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 1700);
}

const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach((item) => {
  item.addEventListener('click', () => {
    menuItems.forEach((button) => button.classList.remove('active'));
    item.classList.add('active');
    showToast(`${item.dataset.menu} 메뉴를 열었습니다.`);
  });
});

document.querySelectorAll('.action-bar button').forEach((button) => {
  button.addEventListener('click', () => {
    showToast(`${button.textContent.trim()} 처리를 준비했습니다.`);
  });
});

document.querySelectorAll('.suggestion, .soft-button, .compact-card button').forEach((button) => {
  button.addEventListener('click', () => {
    showToast('작성 보조 항목을 확인했습니다.');
  });
});

document.querySelectorAll('.check-card input').forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    showToast(checkbox.checked ? '항목을 체크했습니다.' : '체크를 해제했습니다.');
  });
});

document.querySelectorAll('.editor-meta select').forEach((select) => {
  select.addEventListener('change', () => {
    showToast(`${select.value} 기준으로 변경했습니다.`);
  });
});
