(function () {
  const toast = document.querySelector('.toast');
  let timer = null;

  function showToast(message) {
    if (!toast || !message) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(timer);
    timer = window.setTimeout(function () {
      toast.classList.remove('show');
    }, 1700);
  }

  document.querySelectorAll('[data-toast]').forEach(function (element) {
    element.addEventListener('click', function (event) {
      event.preventDefault();
      showToast(element.getAttribute('data-toast'));
    });
  });

  document.querySelectorAll('.pill, .tag-cloud button').forEach(function (button) {
    button.addEventListener('click', function () {
      showToast('필터 기능은 다음 단계에서 연결돼요.');
    });
  });

  document.querySelectorAll('.option-section input').forEach(function (input) {
    input.addEventListener('change', function () {
      showToast('보기 옵션은 다음 단계에서 연결돼요.');
    });
  });
})();
