(function () {
  const toast = document.querySelector('.toast');
  let timer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message || '준비 중이에요.';
    toast.classList.add('show');
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      toast.classList.remove('show');
    }, 1600);
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-toast]');
    if (!target) return;
    showToast(target.getAttribute('data-toast'));
  });
}());
