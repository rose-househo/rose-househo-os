const toast = document.querySelector('.toast');
let toastTimer = null;

function showToast(message) {
  if (!toast || !message) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
}

const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach((item) => {
  item.addEventListener('click', () => {
    menuItems.forEach((target) => target.classList.remove('active'));
    item.classList.add('active');
    showToast(`${item.dataset.menu} 메뉴를 확인합니다.`);
  });
});

const memoItems = document.querySelectorAll('.memo-item');
memoItems.forEach((item) => {
  item.addEventListener('click', () => {
    memoItems.forEach((target) => target.classList.remove('active'));
    item.classList.add('active');
    const label = item.querySelector('strong')?.textContent || '메모';
    showToast(`${label} 항목을 선택했습니다.`);
  });
});

const visitorTabs = document.querySelectorAll('.visitor-tabs button');
const visitorItems = document.querySelectorAll('.visitor-item');
visitorTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const kind = tab.dataset.visitor;
    visitorTabs.forEach((target) => target.classList.remove('active'));
    tab.classList.add('active');
    visitorItems.forEach((item) => {
      const visible = kind === 'all' || item.dataset.kind === kind;
      item.classList.toggle('is-hidden', !visible);
    });
    showToast('방문객 항목을 다시 정리했습니다.');
  });
});

visitorItems.forEach((item) => {
  item.addEventListener('click', () => {
    visitorItems.forEach((target) => target.classList.remove('active'));
    item.classList.add('active');
    showToast('선택한 방문 요청을 확인합니다.');
  });
});

document.querySelectorAll('[data-toast]').forEach((element) => {
  element.addEventListener('click', (event) => {
    event.stopPropagation();
    showToast(element.dataset.toast);
  });
});

const startButton = document.querySelector('[data-action="start"]');
if (startButton) {
  startButton.addEventListener('click', () => {
    startButton.classList.add('is-started');
    startButton.textContent = '티타임 진행 중';
    showToast('티타임 브리핑을 시작합니다.');
  });
}
