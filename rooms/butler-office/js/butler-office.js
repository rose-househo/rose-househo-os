(() => {
  const shell = document.querySelector('.office-shell');
  const timerText = document.getElementById('timerText');
  const timerHint = document.getElementById('timerHint');
  const deskStatus = document.getElementById('deskStatus');
  const startButton = document.getElementById('startWorkButton');
  const endButton = document.getElementById('endWorkButton');
  const pauseButton = document.getElementById('pauseTimerButton');

  let elapsed = 0;
  let startedAt = null;
  let intervalId = null;
  let paused = false;

  function formatTime(totalSeconds) {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  function renderTimer() {
    const runningSeconds = startedAt && !paused ? Math.floor((Date.now() - startedAt) / 1000) : 0;
    timerText.textContent = formatTime(elapsed + runningSeconds);
  }

  function startTimer() {
    if (startedAt && !paused) return;
    shell.dataset.workState = 'running';
    deskStatus.textContent = '작업 중';
    timerHint.textContent = '진행 모드입니다.';
    pauseButton.textContent = '일시 정지';
    paused = false;
    startedAt = Date.now();
    clearInterval(intervalId);
    intervalId = setInterval(renderTimer, 1000);
    renderTimer();
  }

  function pauseTimer() {
    if (!startedAt && !paused) return;
    if (!paused) {
      elapsed += Math.floor((Date.now() - startedAt) / 1000);
      startedAt = null;
      paused = true;
      pauseButton.textContent = '다시 시작';
      timerHint.textContent = '잠시 멈춤 상태입니다.';
      deskStatus.textContent = '일시 정지';
      shell.dataset.workState = 'idle';
      clearInterval(intervalId);
      renderTimer();
      return;
    }
    startTimer();
  }

  function endTimer() {
    if (startedAt && !paused) {
      elapsed += Math.floor((Date.now() - startedAt) / 1000);
    }
    startedAt = null;
    paused = false;
    clearInterval(intervalId);
    renderTimer();
    timerHint.textContent = '오늘 작업을 종료했습니다.';
    deskStatus.textContent = '작업 종료';
    shell.dataset.workState = 'idle';
    pauseButton.textContent = '일시 정지';
  }

  startButton?.addEventListener('click', startTimer);
  pauseButton?.addEventListener('click', pauseTimer);
  endButton?.addEventListener('click', endTimer);
  renderTimer();
})();
