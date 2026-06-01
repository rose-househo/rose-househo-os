(function () {
  const toast = document.querySelector('.toast');
  const buttons = document.querySelectorAll('[data-toast]');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('show');
    }, 1900);
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      showToast(button.getAttribute('data-toast') || '준비 중인 기능입니다.');
    });
  });
}());
