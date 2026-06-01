const records = {
  valmont: {
    name: '발몽 가문',
    rank: '공작가',
    crestClass: 'large-crest rose',
    crestText: 'V',
    motto: '섬김 속의 명예, 품격 속의 아름다움.',
    seat: '에버미어 성',
    region: '서부 지방',
    standing: '궁정과 귀족 사회 전반에서 높은 존중을 받습니다.',
    members: ['아우렐리안 발몽 공작', '알라릭 발몽 경', '에멀린 발몽 영애'],
    related: ['다르쿠르 가문: 신뢰 동맹', '보클랭 가문: 동맹', '벨로즈 가문: 우호'],
    caution: '발몽 가문은 엄격한 전통을 중시합니다. 정식 소개 없이 친근하게 다가가면 무례하게 여겨질 수 있습니다.',
    secret: '잠김. 메이드 조사 보고서 2건과 관련 서신 1건이 더 필요합니다.',
    history: [
      ['태양절 12일', '에버미어 겨울 사교회', '수락'],
      ['첫꽃절 3일', '자선 무도회', '참석'],
      ['서리절 21일', '비공개 만찬', '거절']
    ]
  },
  arcourt: {
    name: '다르쿠르 가문',
    rank: '후작가',
    crestClass: 'large-crest navy',
    crestText: 'A',
    motto: '분명한 맹세는 은빛 검보다 오래 남는다.',
    seat: '루미노르 홀',
    region: '남부 경계령',
    standing: '외교적 절제와 전략적 동맹으로 알려진 가문입니다.',
    members: ['헬리온 다르쿠르 후작', '미렐 다르쿠르 영애', '바스티앙 다르쿠르 경'],
    related: ['발몽 가문: 신뢰 동맹', '몽클레어 가문: 우호', '로리엔 가문: 주시 중'],
    caution: '가문에서 사적인 호칭을 허락하는 서신을 보내기 전까지는 공식 작위를 사용해야 합니다.',
    secret: '일부 잠김. 관련 서신 1건 열람 후 남부 순방 기록이 해금됩니다.',
    history: [
      ['첫꽃절 9일', '남부 순방 환영회', '주최'],
      ['이슬절 18일', '도서관 기증 방문', '수락'],
      ['눈쉼절 2일', '비공개 자문', '대기']
    ]
  },
  belrose: {
    name: '벨로즈 가문',
    rank: '백작가',
    crestClass: 'large-crest ivory',
    crestText: 'B',
    motto: '한 송이 장미가 성문 전체를 지킬 수 있다.',
    seat: '그레이클리프 저택',
    region: '북부 해안',
    standing: '우호적이지만 신중하며, 해안 귀족 사회에서 영향력이 있습니다.',
    members: ['타데우스 벨로즈 백작', '르나르 벨로즈 경', '셀린 벨로즈 영애'],
    related: ['발몽 가문: 우호', '라파예 가문: 중립', '애쉬포드 가문: 교역 접점'],
    caution: '초대장 문구의 정확성을 중시하며, 모호한 약속을 싫어합니다.',
    secret: '잠김. 초대장 기록 1건과 사건 기록 1건이 필요합니다.',
    history: [
      ['서리절 7일', '가을 사냥회', '참석'],
      ['태양절 11일', '해안 연회', '거절'],
      ['비막절 20일', '아침 티타임', '대기']
    ]
  },
  ashford: {
    name: '애쉬포드 가문',
    rank: '백작가',
    crestClass: 'large-crest green',
    crestText: 'AS',
    motto: '숲은 모든 약속을 기억한다.',
    seat: '노스미어 영지',
    region: '북부 지방',
    standing: '영지 영향력을 조심스럽게 유지하는 중립 가문입니다.',
    members: ['로완 애쉬포드 백작', '테사 애쉬포드 영애', '엘리안 애쉬포드 경'],
    related: ['벨로즈 가문: 교역 접점', '드 레이시 가문: 중립', '발몽 가문: 공식 관계'],
    caution: '공식 모임에서 빠른 결정을 재촉하지 않는 편이 좋습니다.',
    secret: '잠김. 방문 귀족 기록 1건이 더 필요합니다.',
    history: [
      ['새싹절 1일', '영지 사안 검토', '관찰'],
      ['비막절 15일', '노스미어 만찬', '초대'],
      ['눈쉼절 4일', '겨울 명부 갱신', '대기']
    ]
  },
  lorien: {
    name: '로리엔 가문',
    rank: '자작가',
    crestClass: 'large-crest violet',
    crestText: 'L',
    motto: '고요한 가지는 부러지기 전 먼저 휘어진다.',
    seat: '레이븐셰이드 궁정',
    region: '동부 숲 지대',
    standing: '겉으로는 예의 바르지만 해결되지 않은 소문이 남아 있습니다.',
    members: ['아드리앙 로리엔 자작', '오필리아 로리엔 영애', '시엘 로리엔 도련님'],
    related: ['다르쿠르 가문: 주시 중', '보클랭 가문: 불명', '몽클레어 가문: 중립'],
    caution: '중재자 없이 봄 축제 분쟁을 언급하지 않는 편이 좋습니다.',
    secret: '비밀 잠김. 소문 보고서 2건과 비밀 서신 1건이 필요합니다.',
    history: [
      ['첫꽃절 6일', '봄 축제 안내장', '발송'],
      ['비막절 13일', '비공개 서신', '보관'],
      ['서리절 29일', '정원 초대장', '미응답']
    ]
  },
  montclair: {
    name: '몽클레어 가문',
    rank: '준남작가',
    crestClass: 'large-crest blue',
    crestText: 'M',
    motto: '탑은 돌들이 뜻을 같이할 때 바로 선다.',
    seat: '하이브룩 탑',
    region: '중앙 고지대',
    standing: '궁정 첫 인사 이후 새롭게 주목받고 있습니다.',
    members: ['쥘 몽클레어 준남작', '르네 몽클레어 도련님', '마리온 몽클레어 영애'],
    related: ['다르쿠르 가문: 우호', '로리엔 가문: 중립', '라파예 가문: 공식 관계'],
    caution: '궁정 내부 예법에 익숙하지 않으므로 부드러운 소개가 권장됩니다.',
    secret: '잠김. 사교계 명부 갱신 1회 후 열람 가능합니다.',
    history: [
      ['태양절 3일', '궁정 첫 인사', '완료'],
      ['비막절 9일', '도서관 문의', '응답'],
      ['눈쉼절 17일', '겨울 참석 여부', '대기']
    ]
  },
  delacy: {
    name: '드 레이시 가문',
    rank: '자작가',
    crestClass: 'large-crest parchment',
    crestText: 'DL',
    motto: '열쇠는 문을 열고, 침묵은 궁정을 연다.',
    seat: '사우스게이트 저택',
    region: '남부 교역로',
    standing: '통상 허가와 신중한 중립 노선으로 알려져 있습니다.',
    members: ['마리우스 드 레이시 자작', '아드리엔 드 레이시 영애', '콜린 드 레이시 경'],
    related: ['애쉬포드 가문: 중립', '라파예 가문: 교역 접점', '발몽 가문: 공식 관계'],
    caution: '사교적 교류에 앞서 교역 논의는 문서로 남기는 것이 좋습니다.',
    secret: '잠김. 거래 관련 서신 1건이 필요합니다.',
    history: [
      ['이슬절 8일', '통상 허가 서신', '수신'],
      ['첫꽃절 22일', '사우스게이트 만찬', '참석'],
      ['서리절 10일', '장부 검토', '보관']
    ]
  },
  vauclain: {
    name: '보클랭 가문',
    rank: '백작가',
    crestClass: 'large-crest crimson',
    crestText: 'VC',
    motto: '자비는 왕관 아래에서 가장 밝게 빛난다.',
    seat: '돈스파이어 저택',
    region: '동부 수도권',
    standing: '자선 후원으로 활발하지만 내부 긴장도 숨겨져 있습니다.',
    members: ['다미앙 보클랭 백작', '로제트 보클랭 영애', '노엘 보클랭 경'],
    related: ['발몽 가문: 동맹', '로리엔 가문: 불명', '벨로즈 가문: 우호'],
    caution: '공개 자선 활동은 언급해도 괜찮지만, 가문 계승 문제는 피해야 합니다.',
    secret: '비밀 잠김. 사건 기록 1건과 보고서 2건이 필요합니다.',
    history: [
      ['새싹절 5일', '자선 무도회', '후원'],
      ['비막절 19일', '비공개 기부', '기록됨'],
      ['눈쉼절 1일', '가족 회의', '불명']
    ]
  },
  lafaye: {
    name: '라파예 가문',
    rank: '준남작가',
    crestClass: 'large-crest gold',
    crestText: 'LF',
    motto: '작은 등불이 오래된 길을 인도한다.',
    seat: '브룩할로우 별장',
    region: '서부 저지대',
    standing: '조용히 신뢰할 만하지만 아직 핵심 사교권에는 가깝지 않습니다.',
    members: ['뤽 라파예 준남작', '미라벨 라파예 영애', '에티엔 라파예 도련님'],
    related: ['드 레이시 가문: 교역 접점', '벨로즈 가문: 중립', '몽클레어 가문: 공식 관계'],
    caution: '화려한 의전보다 담백한 인사를 선호합니다.',
    secret: '잠김. 관련 서신 2건이 필요합니다.',
    history: [
      ['태양절 14일', '영지 사안 안내', '발송'],
      ['이슬절 27일', '브룩할로우 티타임', '수락'],
      ['눈쉼절 8일', '겨울 인사', '대기']
    ]
  }
};

const cards = Array.from(document.querySelectorAll('.record-card'));
const toast = document.getElementById('toast');
const searchInput = document.getElementById('recordSearch');
const filterButtons = Array.from(document.querySelectorAll('.filter-button'));
const resultCount = document.getElementById('resultCount');
const grid = document.querySelector('.record-grid');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
}

function renderList(target, items) {
  target.innerHTML = '';
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    target.appendChild(li);
  });
}

function renderHistory(items) {
  const target = document.getElementById('invitationHistory');
  target.innerHTML = '';
  items.forEach(([date, event, status]) => {
    const li = document.createElement('li');
    const dateNode = document.createElement('b');
    const eventNode = document.createElement('span');
    const statusNode = document.createElement('em');
    dateNode.textContent = date;
    eventNode.textContent = event;
    statusNode.textContent = status;
    li.append(dateNode, eventNode, statusNode);
    target.appendChild(li);
  });
}

function selectRecord(recordId) {
  const record = records[recordId];
  if (!record) return;

  cards.forEach((card) => {
    card.classList.toggle('active', card.dataset.record === recordId);
  });

  const crest = document.getElementById('selectedCrest');
  crest.className = record.crestClass;
  crest.querySelector('span').textContent = record.crestText;

  document.getElementById('selectedName').textContent = record.name;
  document.getElementById('selectedRank').textContent = record.rank;
  document.getElementById('selectedMotto').textContent = record.motto;
  document.getElementById('selectedSeat').textContent = record.seat;
  document.getElementById('selectedRegion').textContent = record.region;
  document.getElementById('selectedStanding').textContent = record.standing;
  document.getElementById('selectedCaution').textContent = record.caution;
  document.getElementById('selectedSecret').textContent = record.secret;

  renderList(document.getElementById('keyMembers'), record.members);
  renderList(document.getElementById('relatedHouses'), record.related);
  renderHistory(record.history);
}

function filterRecords() {
  const query = searchInput.value.trim().toLowerCase();
  const activeFilter = document.querySelector('.filter-button.active').dataset.filter;
  let visibleCount = 0;

  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    const tags = card.dataset.tags || '';
    const queryMatch = !query || text.includes(query);
    const filterMatch = activeFilter === 'all' || tags.includes(activeFilter);
    const isVisible = queryMatch && filterMatch;
    card.classList.toggle('hidden', !isVisible);
    if (isVisible) visibleCount += 1;
  });

  resultCount.textContent = `총 142개 가문 중 ${visibleCount}개 표시`;
}

cards.forEach((card) => {
  card.addEventListener('click', () => selectRecord(card.dataset.record));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectRecord(card.dataset.record);
    }
  });
});

Array.from(document.querySelectorAll('.open-record')).forEach((button) => {
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    selectRecord(button.dataset.record);
    showToast('상세 기록지는 후속 가문 상세 페이지에서 열릴 예정입니다.');
  });
});

Array.from(document.querySelectorAll('.menu-item')).forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.menu-item').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    showToast('선택한 서가로 이동할 예정입니다.');
  });
});

Array.from(document.querySelectorAll('.register-tab')).forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.register-tab').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    showToast('선택한 탭 기준으로 명부가 정리됩니다.');
  });
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    filterRecords();
  });
});

searchInput.addEventListener('input', filterRecords);

document.getElementById('sortSelect').addEventListener('change', (event) => {
  showToast(`${event.target.options[event.target.selectedIndex].text} 기준으로 정렬합니다.`);
});

Array.from(document.querySelectorAll('.view-toggle button')).forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.view-toggle button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    grid.classList.toggle('list-view', button.dataset.view === 'list');
  });
});

document.querySelector('.full-record-button').addEventListener('click', () => {
  showToast('후속 귀족 상세 기록 페이지 연결 버튼입니다.');
});
