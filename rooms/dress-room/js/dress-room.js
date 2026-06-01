(() => {
  const toast = document.querySelector('.toast');
  let toastTimer = null;

  const showToast = (message) => {
    if (!toast || !message) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 1800);
  };

  document.querySelectorAll('[data-toast]').forEach((button) => {
    button.addEventListener('click', () => {
      showToast(button.getAttribute('data-toast'));
    });
  });
})();
