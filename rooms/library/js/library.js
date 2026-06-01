const toast = document.querySelector('.toast');
let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 1600);
}

document.querySelectorAll('.menu-item').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.menu-item').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    showToast(`${button.dataset.menu} 메뉴를 열었습니다.`);
  });
});

document.querySelectorAll('.filter-select').forEach((button) => {
  button.addEventListener('click', () => {
    const group = button.dataset.filter ? '[data-filter]' : '[data-sort]';
    document.querySelectorAll(group).forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    showToast(`${button.textContent.trim()} 기준으로 정리합니다.`);
  });
});

document.querySelectorAll('.favorite').forEach((button) => {
  button.addEventListener('click', () => {
    const isOn = button.classList.toggle('is-on');
    button.setAttribute('aria-label', isOn ? '즐겨찾기 해제' : '즐겨찾기 추가');
    showToast(isOn ? '즐겨찾기에 보관했습니다.' : '즐겨찾기에서 해제했습니다.');
  });
});

const searchInput = document.querySelector('.search-box input');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.trim().toLowerCase();
    document.querySelectorAll('.resource-card').forEach((card) => {
      const haystack = `${card.dataset.title || ''} ${card.dataset.tags || ''}`.toLowerCase();
      card.classList.toggle('is-hidden-by-search', keyword.length > 0 && !haystack.includes(keyword));
    });
  });
}

const viewButton = document.querySelector('.view-button');
if (viewButton) {
  viewButton.addEventListener('click', () => {
    viewButton.classList.toggle('is-active');
    document.body.classList.toggle('list-mode');
    showToast(document.body.classList.contains('list-mode') ? '넓은 카드 보기로 전환했습니다.' : '카드 보기로 전환했습니다.');
  });
}

document.querySelectorAll('.action-bar button, .summary-strip button, .panel-card button, .keywords button, .pagination button, .status-row button').forEach((button) => {
  button.addEventListener('click', () => {
    const label = button.dataset.action || button.textContent.trim() || button.getAttribute('aria-label') || '선택';
    showToast(`${label} 작업을 준비했습니다.`);
  });
});
