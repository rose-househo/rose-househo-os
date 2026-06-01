const STORAGE_KEY = "salonMusicRoomV01";

const categoryNames = {
  all: "전체 재생목록",
  pending: "분류 대기",
  favorite: "즐겨찾기",
  kpop: "K-pop",
  jpop: "J-pop",
  utaite: "우타이테",
  vtuber: "버튜버",
  chika: "지하돌",
  work: "작업 BGM",
  tea: "티타임",
  night: "나이트",
  comfort: "우엥 모드",
  live: "라이브 연습"
};

const sampleTracks = [
  {
    id: "sample-1",
    title: "새벽 작업 피아노 BGM",
    artist: "Salon Sample",
    url: "https://www.youtube.com/",
    category: "work",
    source: "youtube",
    tags: ["작업", "새벽", "잔잔함"],
    memo: "코딩/패치 작업할 때 듣기 좋은 샘플 카드",
    favorite: true,
    playCount: 0
  },
  {
    id: "sample-2",
    title: "J-pop 아이돌 작업 리스트",
    artist: "YouTube Playlist",
    url: "https://www.youtube.com/",
    category: "jpop",
    source: "youtube",
    tags: ["J-pop", "아이돌", "작업"],
    memo: "텐션을 살짝 올리고 싶을 때",
    favorite: false,
    playCount: 0
  },
  {
    id: "sample-3",
    title: "라이브 연습 한 곡 반복 후보",
    artist: "Live Practice",
    url: "https://www.youtube.com/",
    category: "live",
    source: "youtube",
    tags: ["라이브연습", "한곡반복", "연출"],
    memo: "전곡 완주 후 다시 반복해서 듣는 용도",
    favorite: false,
    playCount: 0
  }
];

let shelfPage = 0;
const SHELF_PAGE_SIZE = 5;

let state = {
  tracks: [],
  currentTrackId: null,
  category: "all",
  playMode: "normal",
  shuffle: false,
  searchQuery: "",
  autoMeta: {
    lastUrl: "",
    titleAuto: false,
    artistAuto: false,
    tagsAuto: false,
    categoryAuto: false,
    lastAutoTitle: "",
    lastAutoTags: "",
    oEmbedTitle: ""
  },
  artistMemory: {}
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      state = { ...state, ...JSON.parse(raw) };
    } else {
      state.tracks = sampleTracks;
      state.currentTrackId = sampleTracks[0].id;
      saveState();
    }
    state.searchQuery = "";
  } catch (error) {
    console.warn("뮤직룸 저장소를 불러오지 못했습니다.", error);
    state.tracks = sampleTracks;
    state.currentTrackId = sampleTracks[0].id;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toast(message) {
  const stack = $("#toastStack");
  const item = document.createElement("div");
  item.className = "toast";
  item.textContent = message;
  stack.prepend(item);
  setTimeout(() => {
    item.style.opacity = "0";
    item.style.transform = "translateY(8px)";
    item.style.transition = "0.2s ease";
    setTimeout(() => item.remove(), 220);
  }, 3600);
}

function getCurrentTrack() {
  return state.tracks.find((track) => track.id === state.currentTrackId) || null;
}

function getFilteredTracks() {
  let tracks = state.tracks;
  if (state.category === "favorite") {
    tracks = tracks.filter((track) => track.favorite);
  } else if (state.category !== "all") {
    tracks = tracks.filter((track) => track.category === state.category);
  }

  const query = normalizeText(state.searchQuery);
  if (!query) return tracks;

  return tracks.filter((track) => {
    const haystack = normalizeText([
      track.title,
      track.artist,
      track.url,
      categoryLabel(track),
      track.memo,
      (track.tags || []).join(" ")
    ].join(" "));
    return haystack.includes(query);
  });
}

function categoryLabel(track) {
  return categoryNames[track.category] || track.category;
}

function displayDuration(track, index = 0) {
  if (track && track.duration) return track.duration;
  const seed = String(track?.id || track?.title || index).split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const minutes = 3 + (seed % 3);
  const seconds = String(12 + (seed % 47)).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function heartSvg() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s-7.2-4.35-9.42-9.28C.82 7.82 3.1 4.5 6.72 4.5c2.02 0 3.42 1.08 4.28 2.22C11.86 5.58 13.26 4.5 15.28 4.5c3.62 0 5.9 3.32 4.14 7.22C19.2 16.65 12 21 12 21z"/>
    </svg>
  `;
}

function normalizeText(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function getArtistMemoryKey(value) {
  return normalizeText(value)
    .replace(/[()[\]{}"'“”‘’]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getLearnedArtistInfo(...values) {
  const memory = state.artistMemory || {};
  for (const value of values) {
    const key = getArtistMemoryKey(value);
    if (key && memory[key]) return memory[key];
  }

  const joined = normalizeText(values.filter(Boolean).join(" "));
  if (!joined) return null;

  for (const [key, info] of Object.entries(memory)) {
    if (key.length >= 2 && joined.includes(key)) return info;
  }

  return null;
}

function learnArtistFromTrack(track) {
  if (!track || !track.artist || !track.category || track.category === "pending") return;

  const artist = String(track.artist || "").trim();
  if (!artist || artist === "Unknown") return;

  const key = getArtistMemoryKey(artist);
  if (!key) return;

  const tags = Array.from(new Set([
    ...(track.tags || []),
    categoryNames[track.category] || track.category
  ].filter(Boolean)));

  state.artistMemory = state.artistMemory || {};
  state.artistMemory[key] = {
    displayName: artist,
    category: track.category,
    tags,
    learnedAt: new Date().toISOString()
  };
}


function extractYoutubeId(url) {
  const text = String(url || "");
  const patterns = [
    /youtu\.be\/([^?&#]+)/,
    /youtube\.com\/watch\?[^#]*v=([^?&#]+)/,
    /youtube\.com\/shorts\/([^?&#]+)/,
    /youtube\.com\/embed\/([^?&#]+)/
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  return "";
}

function guessTitleFromUrl(url) {
  const text = String(url || "").trim();
  if (!text) return "";
  const id = extractYoutubeId(text);
  if (text.includes("list=")) return "YouTube playlist";
  if (text.includes("/shorts/")) return `YouTube shorts ${id ? "(" + id + ")" : ""}`.trim();
  if (id) return `YouTube track ${id}`;
  try {
    const parsed = new URL(text);
    return parsed.hostname.replace("www.", "");
  } catch {
    return "외부 음악 링크";
  }
}

function extractFirstUrl(text) {
  const matches = String(text || "").match(/https?:\/\/[^\s"'<>]+/ig);
  if (!matches || !matches.length) return "";
  return matches[matches.length - 1].replace(/[)\],.。]+$/, "");
}

function cleanUrlValue(text) {
  const value = String(text || "").trim();
  const extracted = extractFirstUrl(value);
  return extracted || value;
}

function normalizeTrackUrl(url) {
  const value = cleanUrlValue(url);
  if (!value) return "";

  const youtubeId = extractYoutubeId(value);
  if (youtubeId) return `youtube:${youtubeId}`;

  try {
    const parsed = new URL(value);
    parsed.hash = "";
    // 흔한 추적 파라미터 제거
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid"].forEach((key) => {
      parsed.searchParams.delete(key);
    });
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return normalizeText(value);
  }
}

function findDuplicateTrack(url) {
  const target = normalizeTrackUrl(url);
  if (!target) return null;
  return state.tracks.find((track) => normalizeTrackUrl(track.url) === target) || null;
}


function resetAutoFieldsForNewLink(url) {
  const title = buildAutoTitle(url);
  $("#trackTitle").value = title || "";
  $("#trackArtist").value = isYoutubeUrl(url) ? "Unknown" : "";
  $("#trackCategory").value = "pending";
  $("#trackSource").value = isYoutubeUrl(url) ? "youtube" : "external";
  $("#trackTags").value = isYoutubeUrl(url) ? "YouTube" : "";
  state.autoMeta = {
    lastUrl: url,
    titleAuto: true,
    artistAuto: true,
    tagsAuto: true,
    categoryAuto: true,
    lastAutoTitle: title || "",
    lastAutoTags: $("#trackTags").value
  };
  saveState();

  // ★ v0.2.6: 유튜브 링크면 oEmbed로 실제 제목/채널 가져오기 (비동기, UI 블록 없음)
  if (isYoutubeUrl(url) && !String(url).includes("list=")) {
    applyOEmbedToForm(url).catch(() => {
      // 네트워크 오류 등 → 조용히 실패, 기존 "분류 대기" 상태 유지
    });
  }
}

function isYoutubeUrl(url) {
  return /(?:youtube\.com|youtu\.be)/i.test(String(url || ""));
}

function isAutoTitleValue(value) {
  const text = String(value || "").trim();
  if (!text) return true;
  // oEmbed로 실제 가져온 제목은 "자동값"이 아님 → 사용자 수정처럼 보호
  if (state.autoMeta?.oEmbedTitle && text === state.autoMeta.oEmbedTitle) return false;
  return (
    /^YouTube track\s+/i.test(text) ||
    /^YouTube shorts/i.test(text) ||
    /^YouTube playlist$/i.test(text) ||
    /^youtube\.com$/i.test(text) ||
    /^youtu\.be$/i.test(text) ||
    text === state.autoMeta?.lastAutoTitle
  );
}

function buildAutoTitle(url) {
  if (!url) return "";
  if (isYoutubeUrl(url)) {
    if (String(url).includes("list=")) return "YouTube playlist";
    const id = extractYoutubeId(url);
    return id ? `YouTube track ${id}` : "YouTube music link";
  }
  return guessTitleFromUrl(url);
}

// ─── YouTube oEmbed 제목 가져오기 v0.3 LOCK ────────────────────────────────────
// 전략: youtube.com/oembed (공식, CORS 허용) → 실패 시 noembed.com (fallback)
// 비공개·삭제 영상 → 404/error → null 반환, UI는 "분류 대기" 유지
// 플레이리스트 URL → oEmbed 미지원 → null 반환 (제목 없이 pending 처리)
// ────────────────────────────────────────────────────────────────────────────

// 중복 요청 방지: 같은 URL을 여러 번 fetch하지 않도록 메모이즈
const _oEmbedCache = new Map();

async function fetchYoutubeOEmbed(url) {
  if (!isYoutubeUrl(url)) return null;
  if (String(url).includes("list=") && !extractYoutubeId(url)) return null; // 플레이리스트 전용 URL

  if (_oEmbedCache.has(url)) return _oEmbedCache.get(url);

  const encoded = encodeURIComponent(url);

  // 1순위: 공식 YouTube oEmbed (브라우저에서 CORS 허용, API 키 불필요)
  const endpoints = [
    `https://www.youtube.com/oembed?url=${encoded}&format=json`,
    `https://noembed.com/embed?url=${encoded}`          // fallback
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) continue;
      const data = await res.json();
      if (!data || !data.title) continue;

      const result = {
        title: String(data.title || "").trim(),
        channel: String(data.author_name || "").trim()
      };

      _oEmbedCache.set(url, result);
      return result;
    } catch {
      // 이 endpoint 실패 → 다음 시도
    }
  }

  _oEmbedCache.set(url, null); // 실패도 캐시해서 재시도 방지
  return null;
}

// oEmbed 결과를 받아 폼 필드에 반영하고 분류까지 돌리는 통합 함수
async function applyOEmbedToForm(url) {
  const statusEl = $("#autoResult");

  // 가져오는 동안 UI 상태 표시
  if (statusEl) {
    statusEl.textContent = "⏳ YouTube 제목을 가져오는 중…";
    statusEl.classList.add("is-detecting");
  }

  const meta = await fetchYoutubeOEmbed(url);

  if (statusEl) statusEl.classList.remove("is-detecting");

  if (!meta) {
    // 가져오기 실패 → 기존 "분류 대기" 상태 유지, 안내 메시지만 업데이트
    if (statusEl) {
      statusEl.textContent =
        "링크만으로는 영상 제목을 읽지 못했습니다. 그룹명/곡명/메모를 직접 적으면 자동 분류합니다.";
    }
    return;
  }

  // ── 제목 채우기: 아직 자동 생성 제목이거나 비어있을 때만 덮어씀 ──
  const currentTitle = $("#trackTitle").value.trim();
  if (!currentTitle || isAutoTitleValue(currentTitle)) {
    $("#trackTitle").value = meta.title;
    state.autoMeta.titleAuto = true;
    state.autoMeta.lastAutoTitle = meta.title;
    state.autoMeta.oEmbedTitle = meta.title; // ← 진짜 제목 플래그 (재덮어쓰기 방지용)
  }

  // ── 아티스트(채널명) 채우기: "Unknown" 이거나 비어있을 때만 ──
  const currentArtist = $("#trackArtist").value.trim();
  if (!currentArtist || currentArtist === "Unknown") {
    $("#trackArtist").value = meta.channel;
    state.autoMeta.artistAuto = true;
  }

  // ── 태그에 "YouTube" 유지하면서 분류 재실행 ──
  const currentMemo  = $("#trackMemo").value.trim();
  const currentTags  = $("#trackTags").value.trim();

  const detectText = [
    meta.title,
    meta.channel,
    currentMemo,
    currentTags
  ].join(" ");

  const inferred = inferCategoryAndTags(detectText);
  const learned = getLearnedArtistInfo(meta.channel, meta.title);

  if (learned && learned.category) {
    inferred.category = learned.category;
    inferred.tags = Array.from(new Set([...(inferred.tags || []), ...(learned.tags || []), learned.displayName].filter(Boolean)));
  }

  // 태그 병합: 기존 수동 태그 + 새 자동 태그
  const existingTags = currentTags
    .split(",").map((t) => t.trim()).filter(Boolean)
    .filter((t) => t !== "YouTube" && t !== "분류대기"); // 자동 태그 중복 제거
  const merged = Array.from(new Set(["YouTube", ...existingTags, ...inferred.tags]));
  $("#trackTags").value = merged.join(", ");
  state.autoMeta.tagsAuto = true;
  state.autoMeta.lastAutoTags = merged.join(", ");

  // 카테고리 반영 (사용자가 이미 수동으로 바꿨으면 존중)
  if (state.autoMeta.categoryAuto || $("#trackCategory").value === "pending") {
    $("#trackCategory").value = inferred.category;
    state.autoMeta.categoryAuto = true;
  }

  saveState();

  const label = categoryNames[inferred.category] || inferred.category;
  const note = inferred.category === "pending"
    ? "제목을 가져왔지만 장르 힌트가 부족합니다. 메모·태그에 그룹명을 추가해보세요."
    : `"${meta.title}" 기준으로 분류했습니다.`;
  updateAutoResult(inferred, merged, note);

  if (statusEl) {
    statusEl.classList.add("is-detecting");
    setTimeout(() => statusEl.classList.remove("is-detecting"), 600);
  }

  toast(`제목을 가져왔습니다: ${meta.title}`);
}
// ─── oEmbed 블록 끝 ──────────────────────────────────────────────────────────

function updateAutoResult(inferred, tags, note = "") {
  const label = categoryNames[inferred.category] || inferred.category;
  const result = $("#autoResult");
  if (!result) return;

  const lines = [
    { className: "auto-result-title", text: "살롱 메이드 자동 감지 결과" },
    { className: "auto-result-line", text: `카테고리: ${label}` },
    { className: "auto-result-line", text: `태그: ${tags.length ? tags.join(", ") : "태그 없음"}` }
  ];

  if (note) {
    lines.push({ className: "auto-result-line", text: "" });
    lines.push({ className: "auto-result-line", text: note });
  }

  result.innerHTML = lines
    .map((line) => `<span class="${line.className}">${escapeHtml(line.text)}</span>`)
    .join("");
}

function runLinkAutoRefresh({ force = false, reason = "auto" } = {}) {
  const urlInput = $("#trackUrl");
  const raw = urlInput.value.trim();
  const extracted = extractFirstUrl(raw) || raw;

  if (!extracted) return;

  if (extracted !== raw) {
    urlInput.value = extracted;
  }

  const previousUrl = state.autoMeta?.lastUrl || "";
  const isNewUrl = previousUrl && previousUrl !== extracted;

  if (isNewUrl || force) {
    resetAutoFieldsForNewLink(extracted);
  }

  const currentTitle = $("#trackTitle").value.trim();
  const currentArtist = $("#trackArtist").value.trim();
  const currentTags = $("#trackTags").value.trim();
  const currentMemo = $("#trackMemo").value.trim();

  const autoTitle = buildAutoTitle(extracted);
  const canReplaceTitle = force || isNewUrl || isAutoTitleValue(currentTitle);

  if (canReplaceTitle && autoTitle) {
    $("#trackTitle").value = autoTitle;
    state.autoMeta.titleAuto = true;
    state.autoMeta.lastAutoTitle = autoTitle;
  }

  if (!currentArtist && isYoutubeUrl(extracted)) {
    $("#trackArtist").value = "Unknown";
    state.autoMeta.artistAuto = true;
  } else if (isNewUrl && state.autoMeta.artistAuto) {
    $("#trackArtist").value = isYoutubeUrl(extracted) ? "Unknown" : "";
  }

  // ★ URL(extracted)과 자동 생성 제목은 분류 키워드 검사에서 제외한다.
  //   inferCategoryAndTags 내부에서도 URL을 제거하지만,
  //   여기서 미리 걷어내면 "YouTube track xxxx" 같은 자동 제목이 오인식되는 것도 막는다.
  const titleVal = $("#trackTitle").value.trim();
  const titleForDetect = isAutoTitleValue(titleVal) ? "" : titleVal;
  const detectText = [
    titleForDetect,
    $("#trackArtist").value,
    currentMemo,
    isNewUrl ? "" : currentTags
  ].join(" ");
  const inferred = inferCategoryAndTags(detectText);

  const existingTags = (isNewUrl || state.autoMeta.tagsAuto)
    ? []
    : currentTags.split(",").map((tag) => tag.trim()).filter(Boolean);

  const merged = Array.from(new Set([...existingTags, ...inferred.tags]));
  $("#trackTags").value = merged.join(", ");

  const currentCategory = $("#trackCategory").value;
  if (force || isNewUrl || currentCategory === "pending" || state.autoMeta.categoryAuto) {
    $("#trackCategory").value = inferred.category;
    state.autoMeta.categoryAuto = true;
  }

  state.autoMeta.lastUrl = extracted;
  state.autoMeta.tagsAuto = true;
  state.autoMeta.lastAutoTags = merged.join(", ");
  saveState();

  const note = inferred.category === "pending"
    ? "링크만으로는 영상 제목을 읽지 못합니다. 그룹명/곡명/메모를 추가하면 더 정확해집니다."
    : "새 링크 기준으로 자동값을 갱신했습니다.";
  updateAutoResult(inferred, merged, note);

  const result = $("#autoResult");
  if (result) {
    result.classList.add("is-detecting");
    setTimeout(() => result.classList.remove("is-detecting"), 550);
  }

  if (reason === "paste") {
    toast("새 링크를 감지해서 자동 보조했습니다.");
  }
}


// ─── inferCategoryAndTags v0.3 LOCK ────────────────────────────────────────────
// 핵심 설계 원칙:
//   1. URL / videoId 영역은 키워드 검사에서 완전히 제외한다.
//   2. 사람이 직접 입력한 텍스트(제목·아티스트·메모·태그)만 분류에 사용한다.
//   3. J-pop 신호가 하나라도 있으면 K-pop보다 무조건 우선한다.
//   4. "아이돌/여돌/걸그룹" 단어만으로는 K-pop/J-pop을 확정하지 않는다.
//   5. 힌트가 부족하면 무조건 pending을 반환한다.
// ─────────────────────────────────────────────────────────────────────────────
function inferCategoryAndTags(sourceText) {
  // ── 0. URL 제거: videoId 안의 우연한 문자열이 키워드로 오인되는 것을 막는다 ──
  const stripped = String(sourceText || "")
    .replace(/https?:\/\/\S+/gi, " ")      // URL 전체 제거
    .replace(/\bv=[A-Za-z0-9_-]{6,}\b/gi, " ")  // ?v=xxxx 파라미터 잔여 제거
    .replace(/\b[A-Za-z0-9_-]{11}\b/g, " ");     // 유튜브 11자 videoId 형태 제거

  const text = normalizeText(stripped);
  let category = "pending";
  const tags = new Set();

  const add = (...items) => items.forEach((item) => item && tags.add(item));

  // ── 1. 매칭 헬퍼 ──────────────────────────────────────────────────────────
  function matchesKoreanOrSymbol(alias) {
    return text.includes(normalizeText(alias));
  }
  function matchesLatin(alias) {
    const esc = normalizeText(alias)
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\s+/g, "\\s+");
    return new RegExp(`(^|[^a-z0-9])${esc}([^a-z0-9]|$)`, "i").test(text);
  }
  function aliasMatches(alias) {
    const norm = normalizeText(alias);
    if (!norm) return false;
    return /^[a-z0-9\s._=≠-]+$/i.test(norm)
      ? matchesLatin(norm)
      : matchesKoreanOrSymbol(norm);
  }

  // ── 2. 아티스트 DB ─────────────────────────────────────────────────────────
  // 주의: 멤버 이름처럼 단독으로 쓰면 오해의 소지가 큰 짧은 단어는
  //       aliases 배열에서 제외하거나 그룹명과 함께 쓸 때만 인식하도록 보수적으로 관리한다.
  const artistAliases = [
    // ── K-pop ──
    {
      name: "여자친구",
      category: "kpop",
      tags: ["K-pop", "아이돌", "여자친구"],
      aliases: ["여자친구", "gfriend", "g-friend"]
      // "소원/예린/은하…" 같은 멤버 단독 이름은 제거 (일반 한국어 이름과 충돌)
    },
    {
      name: "VIVIZ",
      category: "kpop",
      tags: ["K-pop", "아이돌", "VIVIZ"],
      aliases: ["viviz", "비비지"]
    },
    {
      name: "IVE",
      category: "kpop",
      tags: ["K-pop", "아이돌", "IVE"],
      // "ive" 3글자는 영어 단어 'I've'와 충돌 → word-boundary 매칭으로 처리되므로 유지
      // 단, videoId에서 이미 제거됐으므로 안전
      aliases: ["아이브", "장원영", "안유진", "ive"]
    },
    {
      name: "NewJeans",
      category: "kpop",
      tags: ["K-pop", "아이돌", "NewJeans"],
      aliases: ["newjeans", "new jeans", "뉴진스"]
    },
    {
      name: "aespa",
      category: "kpop",
      tags: ["K-pop", "아이돌", "aespa"],
      aliases: ["aespa", "에스파"]
    },
    {
      name: "LE SSERAFIM",
      category: "kpop",
      tags: ["K-pop", "아이돌", "LE SSERAFIM"],
      aliases: ["le sserafim", "lesserafim", "르세라핌"]
    },
    {
      name: "TWICE",
      category: "kpop",
      tags: ["K-pop", "아이돌", "TWICE"],
      aliases: ["twice", "트와이스"]
    },
    {
      name: "Red Velvet",
      category: "kpop",
      tags: ["K-pop", "아이돌", "Red Velvet"],
      aliases: ["red velvet", "레드벨벳"]
    },
    {
      name: "OH MY GIRL",
      category: "kpop",
      tags: ["K-pop", "아이돌", "오마이걸"],
      aliases: ["oh my girl", "오마이걸"]
    },
    {
      name: "Lovelyz",
      category: "kpop",
      tags: ["K-pop", "아이돌", "러블리즈"],
      aliases: ["lovelyz", "러블리즈"]
    },
    {
      name: "fromis_9",
      category: "kpop",
      tags: ["K-pop", "아이돌", "fromis_9"],
      aliases: ["fromis_9", "fromis 9", "프로미스나인", "프나"]
    },
    // ── J-pop ──
    {
      name: "=LOVE",
      category: "jpop",
      tags: ["J-pop", "아이돌", "이코러브"],
      aliases: ["=love", "イコラブ", "イコールラブ", "이코러브", "이콜러브"]
    },
    {
      name: "≠ME",
      category: "jpop",
      tags: ["J-pop", "아이돌", "노이미"],
      aliases: ["≠me", "ノイミー", "노이미"]
    },
    {
      name: "FRUITS ZIPPER",
      category: "jpop",
      tags: ["J-pop", "아이돌", "FRUITS ZIPPER"],
      aliases: ["fruits zipper", "프루츠지퍼", "후르츠지퍼"]
    },
    {
      name: "KAWAII LAB.",
      category: "jpop",
      tags: ["J-pop", "아이돌", "카와라보"],
      aliases: ["kawaii lab", "카와라보", "cutie street", "큐티스트릿", "candy tune", "캔디튠"]
    },
    {
      name: "Mafumafu",
      category: "utaite",
      tags: ["우타이테", "歌い手", "커버"],
      aliases: ["mafumafu", "まふまふ"]
    },
    {
      name: "Soraru",
      category: "utaite",
      tags: ["우타이테", "歌い手", "커버"],
      aliases: ["soraru", "そらる"]
    },
    {
      name: "Amatsuki",
      category: "utaite",
      tags: ["우타이테", "歌い手", "커버"],
      aliases: ["amatsuki", "天月", "아마츠키"]
    },
    {
      name: "Utaite",
      category: "utaite",
      tags: ["우타이테", "歌い手", "커버"],
      aliases: ["우타이테", "歌い手", "歌ってみた", "utattemita", "utaite", "불러보았다"]
    },
    {
      name: "Hololive",
      category: "vtuber",
      tags: ["버튜버", "VTuber", "Hololive"],
      aliases: ["hololive", "홀로라이브", "ホロライブ", "호시마치 스이세이", "hoshimachi suisei", "suisei", "스이세이"]
    },
    {
      name: "Nijisanji",
      category: "vtuber",
      tags: ["버튜버", "VTuber", "Nijisanji"],
      aliases: ["nijisanji", "니지산지", "にじさんじ"]
    },
    {
      name: "VTuber",
      category: "vtuber",
      tags: ["버튜버", "VTuber"],
      aliases: ["vtuber", "v-tuber", "브이튜버", "버튜버", "virtual youtuber", "버추얼 유튜버"]
    },
    {
      name: "Underground Idol",
      category: "chika",
      tags: ["지하돌", "일본 아이돌", "라이브"],
      aliases: ["지하돌", "地下アイドル", "地下 idol", "chika idol", "chika-idol", "idol live", "対バン", "대반", "라이브 아이돌"]
    },
    {
      name: "iLiFE!",
      category: "chika",
      tags: ["지하돌", "J-pop", "아이돌", "iLiFE!", "아이라이프"],
      aliases: ["ilife", "i life", "ilife!", "iLiFE!", "アイライフ", "あいらいふ", "아이라이프"]
    },
    {
      name: "≒JOY",
      category: "jpop",
      tags: ["J-pop", "아이돌", "니아조이"],
      aliases: ["≒joy", "near equal joy", "ニアジョイ", "니아조이", "니어조이"]
    },
    {
      name: "高嶺のなでしこ",
      category: "jpop",
      tags: ["J-pop", "아이돌", "타카네노나데시코"],
      aliases: ["高嶺のなでしこ", "たかねこ", "타카네노나데시코", "타카네코", "takane no nadeshiko", "takaneko"]
    },
    {
      name: "AKB48",
      category: "jpop",
      tags: ["J-pop", "아이돌", "AKB48"],
      aliases: ["akb48", "akb 48", "에케비"]
    },
    {
      name: "SKE48",
      category: "jpop",
      tags: ["J-pop", "아이돌", "SKE48"],
      aliases: ["ske48", "ske 48"]
    },
    {
      name: "NMB48",
      category: "jpop",
      tags: ["J-pop", "아이돌", "NMB48"],
      aliases: ["nmb48", "nmb 48"]
    },
    {
      name: "HKT48",
      category: "jpop",
      tags: ["J-pop", "아이돌", "HKT48"],
      aliases: ["hkt48", "hkt 48"]
    },
    {
      name: "STU48",
      category: "jpop",
      tags: ["J-pop", "아이돌", "STU48"],
      aliases: ["stu48", "stu 48"]
    },
    {
      name: "Nogizaka46",
      category: "jpop",
      tags: ["J-pop", "아이돌", "노기자카"],
      aliases: ["nogizaka46", "nogizaka", "乃木坂", "노기자카", "노기"]
    },
    {
      name: "Sakurazaka46",
      category: "jpop",
      tags: ["J-pop", "아이돌", "사쿠라자카"],
      aliases: ["sakurazaka46", "sakurazaka", "桜坂46", "사쿠라자카"]
    },
    {
      name: "Hinatazaka46",
      category: "jpop",
      tags: ["J-pop", "아이돌", "히나타자카"],
      aliases: ["hinatazaka46", "hinatazaka", "日向坂46", "히나타자카"]
    }
  ];

  // ── 3. 명시적 J/K-pop 키워드 검사 (URL 제거된 text 기준) ──────────────────
  // "일본" 단독 키워드를 J-pop 신호로 인정 (일본 여돌, 일본 아이돌 언급 맥락)
  const hasExplicitJpop = /(j-pop|jpop|제이팝|일본\s*아이돌|일본아이돌|일본\s*여돌|일본여돌|일본\s*걸그룹|japanese\s*idol|ジャニーズ|地下アイドル|지하돌|한국\s*아님|일본\s*곡)/i.test(text);
  const hasExplicitKpop = /(k-pop|kpop|케이팝|한국\s*아이돌|한국아이돌|한국\s*여돌|한국여돌|한국\s*걸그룹|korean\s*idol)/i.test(text);
  const hasExplicitUtaite = /(우타이테|歌い手|歌ってみた|utattemita|불러보았다)/i.test(text);
  const hasExplicitVtuber = /(vtuber|v-tuber|버튜버|브이튜버|virtual\s*youtuber|홀로라이브|hololive|니지산지|nijisanji)/i.test(text);
  const hasExplicitChika = /(지하돌|地下アイドル|chika\s*idol|idol\s*live|対バン|대반|라이브\s*아이돌)/i.test(text);

  // ── 4. 아티스트 DB 매칭 ───────────────────────────────────────────────────
  const matchedGroups = artistAliases.filter((group) =>
    group.aliases.some((alias) => aliasMatches(alias))
  );
  const matchedUtaite = matchedGroups.find((g) => g.category === "utaite") || null;
  const matchedVtuber = matchedGroups.find((g) => g.category === "vtuber") || null;
  const matchedChika = matchedGroups.find((g) => g.category === "chika") || null;
  const matchedJpop = matchedGroups.find((g) => g.category === "jpop") || null;
  const matchedKpop = matchedGroups.find((g) => g.category === "kpop") || null;
  const learnedArtist = getLearnedArtistInfo(text);

  // ── 5. K-pop / J-pop 확정 (J-pop 우선) ──────────────────────────────────
  // 규칙: J-pop 신호(명시 키워드 OR J-pop 그룹 매칭) 하나라도 있으면 J-pop 우선.
  //       K-pop 그룹명 OR 명시 키워드가 있어야 K-pop 확정.
  //       "아이돌/여돌/걸그룹" 단독어는 절대로 K/J-pop 확정에 쓰지 않는다.
  if (hasExplicitUtaite || matchedUtaite) {
    category = "utaite";
    add("우타이테");
    if (matchedUtaite) add(...matchedUtaite.tags);
  } else if (hasExplicitVtuber || matchedVtuber) {
    category = "vtuber";
    add("버튜버");
    if (matchedVtuber) add(...matchedVtuber.tags);
  } else if (hasExplicitChika || matchedChika) {
    category = "chika";
    add("지하돌");
    if (matchedChika) add(...matchedChika.tags);
  } else if (hasExplicitJpop || matchedJpop) {
    category = "jpop";
    add("J-pop");
    if (matchedJpop) add(...matchedJpop.tags);
  } else if (hasExplicitKpop || matchedKpop) {
    category = "kpop";
    add("K-pop");
    if (matchedKpop) add(...matchedKpop.tags);
  } else if (learnedArtist && learnedArtist.category) {
    category = learnedArtist.category;
    add(...(learnedArtist.tags || []), learnedArtist.displayName);
  }
  // else → category는 "pending" 유지 (아이돌 단독어, 링크만 있는 경우 포함)

  // "아이돌/여돌/걸그룹" 단독어는 태그만 추가, 카테고리는 바꾸지 않는다
  if (/(여돌|걸그룹|아이돌|girl group)/i.test(text)) {
    add("아이돌");
    // category는 건드리지 않음 — 이미 jpop/kpop이면 유지, pending이면 그대로
  }

  // cover/커버 단독어는 우타이테 확정 조건으로 쓰지 않는다.
  // K-pop 커버, J-pop 커버, 보컬 커버가 모두 있기 때문에 태그만 추가한다.
  if (/(cover|covered by|커버|커버곡|cover song)/i.test(text)) {
    add("커버");
  }

  // ── 6. 나머지 카테고리 (K/J-pop이 아닐 때만 덮어쓴다) ─────────────────────
  // 우선순위: live > night > tea > comfort > work
  // K/J-pop으로 이미 확정됐으면 아래 규칙이 카테고리를 바꾸지 않는다.
  const isKJpop = category === "kpop" || category === "jpop" || category === "utaite" || category === "vtuber" || category === "chika";

  if (/(live|라이브|연습곡|리허설|rehearsal|연출|무대|안무|한곡반복|한 곡 반복)/i.test(text)) {
    // 라이브 연습은 장르보다 용도가 우선 → K/J-pop 위에도 덮어씀
    category = "live";
    add("라이브연습", "한곡반복");
  } else if (!isKJpop) {
    if (/(night|sleep|수면|잠|새벽|midnight|오르골|music\s*box|sleeping\s*music)/i.test(text)) {
      category = "night";
      add("나이트", "수면");
    } else if (/(tea|티타임|cafe|카페|jazz|재즈|waltz|왈츠|홍차|디저트)/i.test(text)) {
      category = "tea";
      add("티타임");
    } else if (/(우엥|위로|힐링|calm|잔잔|울적|relaxing|relaxation|soothing|meditation|healing)/i.test(text)) {
      category = "comfort";
      add("우엥모드", "힐링", "잔잔함");
    } else if (/(bgm|piano|피아노|lofi|lo-fi|study|work|coding|코딩|작업|집중)/i.test(text)) {
      category = "work";
      add("작업", "집중");
    }
  }

  // ── 7. 공통 보조 태그 ─────────────────────────────────────────────────────
  if (/playlist/i.test(text)) add("플레이리스트");
  // "YouTube" 태그는 소스가 유튜브일 때 runLinkAutoRefresh에서 붙이므로 여기선 생략

  // ── 8. 안전망: 힌트 텍스트가 사실상 없으면 무조건 pending ─────────────────
  // URL을 걷어낸 compact 텍스트가 비어있거나 자동 생성 제목 잔여물만 있으면 분류 포기
  const compact = text
    .replace(/youtube\s*(track|playlist|shorts|music\s*link)?/gi, "")
    .replace(/unknown/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const hasRealHint = compact.length >= 2;  // 의미있는 힌트가 2글자 이상이어야 분류
  if (!hasRealHint) {
    category = "pending";
    tags.clear();
    add("분류대기");
  }

  return { category, tags: Array.from(tags) };
}
// ─── inferCategoryAndTags 끝 ─────────────────────────────────────────────────

function fillAutoFields() {
  runLinkAutoRefresh({ force: true, reason: "button" });

  // ★ v0.2.6: 버튼 클릭 시에도 oEmbed 재시도 (캐시 미스면 새로 fetch)
  const url = $("#trackUrl").value.trim();
  if (isYoutubeUrl(url) && !String(url).includes("list=")) {
    // 캐시 무효화해서 강제 재시도
    _oEmbedCache.delete(url);
    applyOEmbedToForm(url).catch(() => {});
  }
}

function autoTagOnly() {
  const text = [
    $("#trackTitle").value,
    $("#trackArtist").value,
    $("#trackUrl").value,
    $("#trackMemo").value,
    $("#trackTags").value
  ].join(" ");
  const inferred = inferCategoryAndTags(text);
  $("#trackCategory").value = inferred.category;
  const existing = $("#trackTags").value.split(",").map((tag) => tag.trim()).filter(Boolean);
  const merged = Array.from(new Set([...existing, ...inferred.tags]));
  $("#trackTags").value = merged.join(", ");
  const label = categoryNames[inferred.category] || inferred.category;
  $("#autoResult").textContent = `살롱 메이드 분류 결과\n카테고리: ${label}\n태그: ${merged.length ? merged.join(", ") : "태그 없음"}`;
  toast("카테고리와 태그를 자동 생성했습니다.");
}


function renderCategories() {
  $$("#categoryList button").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === state.category);
  });
  $("#listTitle").textContent = categoryNames[state.category] || "재생목록";
}

function renderPlayer() {
  const track = getCurrentTrack();
  const favoriteButton = $("#toggleFavorite");
  const dockFavorite = $("#dockFavorite");

  if (!track) {
    $("#nowTitle").textContent = "아직 선택된 곡이 없습니다";
    $("#nowMeta").textContent = "재생목록에서 곡을 선택해주세요";
    if ($("#nowDescription")) $("#nowDescription").textContent = "공주님의 살롱에 올릴 음악을 골라주세요.";
    $("#fakeDuration").textContent = "--:--";
    if ($("#dockTitle")) $("#dockTitle").textContent = "아직 선택된 곡이 없습니다";
    if ($("#dockArtist")) $("#dockArtist").textContent = "재생목록에서 곡을 선택해주세요";
    if ($("#dockDuration")) $("#dockDuration").textContent = "--:--";
    if (favoriteButton) {
      favoriteButton.innerHTML = heartSvg();
      favoriteButton.classList.remove("is-on");
    }
    if (dockFavorite) {
      dockFavorite.innerHTML = "♡";
      dockFavorite.classList.remove("is-on");
    }
    return;
  }

  const duration = track.category === "live" ? "03:28" : "03:48";
  const sourceLabel = track.source === "youtube" ? "YouTube" : track.source === "local" ? "MP3" : "External";
  const description = track.memo || "A gentle breeze, a quiet heart, and a melody that stays.";

  $("#nowTitle").textContent = track.title;
  $("#nowMeta").textContent = `${track.artist || "Unknown"} · ${categoryLabel(track)} · ${sourceLabel}`;
  if ($("#nowDescription")) $("#nowDescription").textContent = description;
  $("#fakeDuration").textContent = duration;
  if ($("#dockTitle")) $("#dockTitle").textContent = track.title;
  if ($("#dockArtist")) $("#dockArtist").textContent = track.artist || "Unknown";
  if ($("#dockDuration")) $("#dockDuration").textContent = duration;
  if ($("#salonRecommendTitle")) $("#salonRecommendTitle").textContent = track.title;
  if ($("#salonRecommendArtist")) $("#salonRecommendArtist").textContent = track.artist || "Salon Maid";

  if (favoriteButton) {
    favoriteButton.innerHTML = heartSvg();
    favoriteButton.classList.toggle("is-on", !!track.favorite);
  }
  if (dockFavorite) {
    dockFavorite.innerHTML = track.favorite ? "❤︎" : "♡";
    dockFavorite.classList.toggle("is-on", !!track.favorite);
  }

  const modeText = {
    normal: "일반 재생",
    repeatOne: "한 곡 반복",
    repeatAll: "재생목록 반복",
    shuffle: "랜덤 재생"
  }[state.playMode] || "일반 재생";
  if ($("#modeHint")) $("#modeHint").textContent = `현재 모드: ${modeText}`;
  $$(".mode-list button").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.playMode);
  });
  $("#repeatToggle").classList.toggle("is-on", state.playMode === "repeatOne" || state.playMode === "repeatAll");
  if ($("#dockRepeat")) $("#dockRepeat").classList.toggle("is-on", state.playMode === "repeatOne" || state.playMode === "repeatAll");
  if ($("#dockShuffle")) $("#dockShuffle").classList.toggle("is-on", state.playMode === "shuffle");
}

function renderTracks() {
  const tracks = getFilteredTracks();
  const pageCount = Math.max(1, Math.ceil(tracks.length / SHELF_PAGE_SIZE));
  shelfPage = Math.min(Math.max(0, shelfPage), pageCount - 1);
  const visibleTracks = tracks.slice(shelfPage * SHELF_PAGE_SIZE, shelfPage * SHELF_PAGE_SIZE + SHELF_PAGE_SIZE);
  $("#trackCount").textContent = `${tracks.length}곡`;
  const list = $("#trackList");

  if (!tracks.length) {
    list.innerHTML = `<div class="track-card"><div class="track-thumb" aria-hidden="true"></div><div class="track-body"><h3>아직 곡이 없습니다</h3><small>링크를 추가하면 여기에 표시됩니다.</small></div></div>`;
    const prev = $("#shelfPrev");
    const next = $("#shelfNext");
    if (prev) prev.disabled = true;
    if (next) next.disabled = true;
    renderCompactLists(tracks);
    return;
  }

  list.innerHTML = visibleTracks.map((track, index) => `
    <article class="track-card ${track.id === state.currentTrackId ? "is-active" : ""}">
      <div class="track-thumb thumb-${(shelfPage * SHELF_PAGE_SIZE + index) % 5}" aria-hidden="true"></div>
      <div class="track-body">
        <div class="track-top">
          <div>
            <h3>${escapeHtml(track.title)}</h3>
            <small>${escapeHtml(track.artist || "Unknown")} · ${escapeHtml(categoryLabel(track))}</small>
          </div>
          <button type="button" class="heart-icon-btn ${track.favorite ? "is-on" : ""}" data-fav="${track.id}" aria-label="즐겨찾기">${heartSvg()}</button>
        </div>
        <p>${escapeHtml(track.memo || "메모 없음")}</p>
      </div>
      <div class="track-actions">
        <button type="button" data-select="${track.id}" aria-label="재생">▶</button>
        <button type="button" data-open="${track.id}" aria-label="외부 링크 열기">↗</button>
      </div>
    </article>
  `).join("");

  const prev = $("#shelfPrev");
  const next = $("#shelfNext");
  if (prev) prev.disabled = shelfPage <= 0;
  if (next) next.disabled = shelfPage >= pageCount - 1;

  renderCompactLists(tracks);

  list.querySelectorAll("[data-select]").forEach((button) => {
    button.addEventListener("click", () => selectTrack(button.dataset.select));
  });
  list.querySelectorAll("[data-open]").forEach((button) => {
    button.addEventListener("click", () => openTrack(button.dataset.open));
  });
  list.querySelectorAll("[data-fav]").forEach((button) => {
    button.addEventListener("click", () => toggleFavorite(button.dataset.fav));
  });
}

function renderCompactLists(tracks) {
  const source = tracks.length ? tracks : state.tracks;
  const compact = (items) => items.slice(0, 3).map((track, index) => `
    <div class="compact-track">
      <span class="compact-cover thumb-${index % 5}" aria-hidden="true"></span>
      <div>
        <strong>${escapeHtml(track.title)}</strong>
        <small>${escapeHtml(track.artist || "Unknown")}</small>
      </div>
      <span class="compact-track-time">${displayDuration(track, index)}</span>
      <button type="button" class="compact-heart ${track.favorite ? "is-on" : ""}" data-compact-fav="${track.id}" aria-label="즐겨찾기">${track.favorite ? "❤︎" : "♡"}</button>
    </div>
  `).join("") || `<div class="compact-track"><span class="compact-cover" aria-hidden="true"></span><div><strong>아직 곡이 없습니다</strong><small>음악을 추가해주세요</small></div><span class="compact-track-time">--:--</span><button type="button">♡</button></div>`;

  const recommended = $("#recommendedTrackList");
  const recent = $("#recentTrackList");
  const side = $("#sidePlaylistList");
  if (recommended) recommended.innerHTML = compact(source);
  if (recent) recent.innerHTML = compact([...state.tracks].sort((a, b) => (b.playCount || 0) - (a.playCount || 0)));
  if (side) {
    side.innerHTML = source.slice(0, 4).map((track, index) => `
      <div class="side-playlist-item">
        <span class="compact-cover thumb-${index % 5}" aria-hidden="true"></span>
        <div>
          <strong>${escapeHtml(track.title)}</strong>
          <small>${escapeHtml(track.artist || "Unknown")}</small>
        </div>
        <button type="button" class="compact-heart ${track.favorite ? "is-on" : ""}" data-compact-fav="${track.id}" aria-label="즐겨찾기">${track.favorite ? "❤︎" : "♡"}</button>
        <button type="button" class="side-more" data-select-compact="${track.id}" aria-label="선택">⋯</button>
      </div>
    `).join("");
  }

  $$('[data-select-compact]').forEach((button) => {
    button.addEventListener('click', () => selectTrack(button.dataset.selectCompact));
  });
  $$('[data-compact-fav]').forEach((button) => {
    button.addEventListener('click', () => toggleFavorite(button.dataset.compactFav));
  });
}

function renderSalon() {
  const current = getCurrentTrack();
  const text = current
    ? `공주님, 현재 선택된 곡은 “${current.title}”입니다. ${current.category === "live" ? "라이브 연습용으로 한 곡 반복에 잘 맞습니다." : "작업 상태에 맞춰 재생 모드를 고를 수 있습니다."}`
    : "공주님, 오늘의 BGM을 준비하고 있습니다.";
  if ($("#salonMiniMessage")) $("#salonMiniMessage").textContent = text;
  if ($("#todayBgmText")) $("#todayBgmText").textContent = text;
}

function renderAll() {
  renderCategories();
  renderPlayer();
  renderTracks();
  renderSalon();
}

function selectTrack(id) {
  state.currentTrackId = id;
  const track = getCurrentTrack();
  if (track) track.playCount = (track.playCount || 0) + 1;
  saveState();
  renderAll();
  toast("선택한 곡을 살롱 플레이어에 올렸습니다.");
}

function openTrack(id = state.currentTrackId) {
  const track = state.tracks.find((item) => item.id === id);
  if (!track || !track.url) {
    toast("열 수 있는 링크가 없습니다.");
    return;
  }
  window.open(track.url, "_blank", "noopener,noreferrer");
}

function toggleFavorite(id = state.currentTrackId) {
  const track = state.tracks.find((item) => item.id === id);
  if (!track) return;
  track.favorite = !track.favorite;
  saveState();
  renderAll();
}

function deleteTrack(id) {
  state.tracks = state.tracks.filter((track) => track.id !== id);
  if (state.currentTrackId === id) {
    state.currentTrackId = state.tracks[0]?.id || null;
  }
  saveState();
  renderAll();
  toast("곡을 삭제했습니다.");
}

function saveTrack() {
  if ($("#trackUrl").value.trim()) {
    runLinkAutoRefresh({ force: false, reason: "save" });
  }

  const title = $("#trackTitle").value.trim();
  const url = $("#trackUrl").value.trim();

  if (!title || !url) {
    toast("곡 제목과 링크는 꼭 필요합니다.");
    return;
  }

  const duplicate = findDuplicateTrack(url);
  if (duplicate) {
    state.currentTrackId = duplicate.id;
    saveState();
    renderAll();
    toast(`이미 등록된 곡입니다: ${duplicate.title}`);
    return;
  }

  // ★ URL과 자동 생성 제목은 분류에서 제외한다
  const titleForDetect = isAutoTitleValue(title) ? "" : title;
  const auto = inferCategoryAndTags([
    titleForDetect,
    $("#trackArtist").value,
    // url 제외 — inferCategoryAndTags 내부에서도 URL을 걷어내지만 명시적으로 뺀다
    $("#trackTags").value,
    $("#trackMemo").value
  ].join(" "));
  const tags = $("#trackTags").value.split(",").map((tag) => tag.trim()).filter(Boolean);
  const mergedTags = Array.from(new Set([...tags, ...auto.tags]));

  const track = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    title,
    artist: $("#trackArtist").value.trim(),
    url,
    category: ($("#trackCategory").value === "pending" && auto.category !== "pending") ? auto.category : ($("#trackCategory").value || auto.category),
    source: $("#trackSource").value,
    tags: mergedTags,
    memo: $("#trackMemo").value.trim(),
    favorite: false,
    playCount: 0
  };

  state.tracks.unshift(track);
  state.currentTrackId = track.id;
  learnArtistFromTrack(track);
  saveState();
  clearForm();
  renderAll();
  toast("뮤직룸에 저장했습니다.");
}

function clearForm() {
  ["#trackTitle", "#trackArtist", "#trackUrl", "#trackTags", "#trackMemo"].forEach((selector) => {
    $(selector).value = "";
  });
  $("#trackCategory").value = "pending";
  $("#trackSource").value = "youtube";
  state.autoMeta = {
    lastUrl: "",
    titleAuto: false,
    artistAuto: false,
    tagsAuto: false,
    categoryAuto: false,
    lastAutoTitle: "",
    lastAutoTags: "",
    oEmbedTitle: ""   // ★ v0.2.6
  };
  saveState();
  const result = $("#autoResult");
  if (result) {
    result.textContent = "링크를 붙여넣으면 제목과 채널을 자동으로 확인합니다. 부족한 정보는 직접 적어두면 다음부터 더 잘 기억합니다.";
  }
}

function setMode(mode) {
  state.playMode = mode;
  saveState();
  renderAll();
}

function randomTrack() {
  const tracks = getFilteredTracks();
  if (!tracks.length) {
    toast("랜덤으로 고를 곡이 없습니다.");
    return;
  }
  const picked = tracks[Math.floor(Math.random() * tracks.length)];
  selectTrack(picked.id);
  toast("살롱 메이드가 랜덤으로 골랐습니다.");
}

function recommendBgm() {
  const hour = new Date().getHours();
  let category = "work";
  let reason = "작업 집중용 BGM을 추천드립니다.";

  if (hour >= 22 || hour < 6) {
    category = "night";
    reason = "지금 시간에는 나이트 BGM이나 잔잔한 작업곡을 추천드립니다.";
  } else if (hour >= 14 && hour <= 17) {
    category = "tea";
    reason = "티타임 시간대라 부드러운 BGM을 추천드립니다.";
  }

  const candidates = state.tracks.filter((track) => track.category === category);
  const picked = candidates[0] || state.tracks.find((track) => track.category === "work") || state.tracks[0];

  if (picked) {
    state.currentTrackId = picked.id;
    $("#todayBgmText").textContent = `${reason}\n오늘의 추천: ${picked.title}`;
    saveState();
    renderAll();
    toast("오늘의 BGM을 골랐습니다.");
  }
}

function bindEvents() {
  $$("#categoryList button").forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.dataset.category;
      shelfPage = 0;
      saveState();
      renderAll();
    });
  });

  $("#saveTrack").addEventListener("click", saveTrack);
  $("#clearForm").addEventListener("click", clearForm);
  $("#autoFillFromLink").addEventListener("click", fillAutoFields);
  $("#autoTagTrack").addEventListener("click", autoTagOnly);
  let linkDetectTimer = null;
  function scheduleLinkDetect(reason = "input") {
    clearTimeout(linkDetectTimer);
    linkDetectTimer = setTimeout(() => {
      if ($("#trackUrl").value.trim()) runLinkAutoRefresh({ force: false, reason });
    }, 220);
  }

  $("#trackUrl").addEventListener("input", () => {
    const input = $("#trackUrl");
    const cleaned = cleanUrlValue(input.value);
    if (cleaned && cleaned !== input.value.trim() && /https?:\/\//i.test(input.value)) {
      input.value = cleaned;
    }
    scheduleLinkDetect("input");
  });

  $("#trackUrl").addEventListener("paste", (event) => {
    const pasted = event.clipboardData ? event.clipboardData.getData("text") : "";
    const cleaned = cleanUrlValue(pasted);
    if (cleaned) {
      event.preventDefault();
      const input = $("#trackUrl");
      input.value = cleaned;
      input.classList.add("is-replaced");
      setTimeout(() => input.classList.remove("is-replaced"), 650);
      resetAutoFieldsForNewLink(cleaned);
      scheduleLinkDetect("paste");
      toast("새 링크로 교체했습니다.");
    } else {
      scheduleLinkDetect("paste");
    }
  });

  $("#trackUrl").addEventListener("blur", () => {
    const input = $("#trackUrl");
    if (input.value.trim()) {
      const cleaned = cleanUrlValue(input.value);
      if (cleaned && cleaned !== input.value.trim()) input.value = cleaned;
      runLinkAutoRefresh({ force: false, reason: "blur" });
    }
  });
  $("#trackTitle").addEventListener("input", () => {
    state.autoMeta.titleAuto = false;
    saveState();
  });
  $("#trackArtist").addEventListener("input", () => {
    state.autoMeta.artistAuto = false;
    saveState();
  });
  $("#trackTags").addEventListener("input", () => {
    state.autoMeta.tagsAuto = false;
    saveState();
  });
  $("#trackCategory").addEventListener("change", () => {
    state.autoMeta.categoryAuto = false;
    saveState();
  });

  const shelfPrev = $("#shelfPrev");
  const shelfNext = $("#shelfNext");
  if (shelfPrev) {
    shelfPrev.addEventListener("click", () => {
      shelfPage = Math.max(0, shelfPage - 1);
      renderTracks();
    });
  }
  if (shelfNext) {
    shelfNext.addEventListener("click", () => {
      shelfPage += 1;
      renderTracks();
    });
  }
  $("#randomTrack").addEventListener("click", randomTrack);
  $("#recommendBgm").addEventListener("click", recommendBgm);
  $("#toggleFavorite").addEventListener("click", () => toggleFavorite());
  $("#openYoutube").addEventListener("click", () => openTrack());
  $("#playTrack").addEventListener("click", () => toast("아직 앱 안 직접 재생은 준비 중입니다. 지금은 ‘열어 듣기’ 버튼으로 바로 확인해주세요."));
  $("#pauseTrack").addEventListener("click", () => toast("앱 안 일시정지는 나중에 플레이어 연동 때 사용할 예정입니다."));
  $("#stopTrack").addEventListener("click", () => toast("앱 안 정지는 나중에 플레이어 연동 때 사용할 예정입니다."));
  $("#prevTrack").addEventListener("click", () => moveTrack(-1));
  $("#nextTrack").addEventListener("click", () => moveTrack(1));
  $("#shuffleToggle").addEventListener("click", () => setMode("shuffle"));
  $("#repeatToggle").addEventListener("click", () => {
    const next = state.playMode === "repeatOne" ? "repeatAll" : "repeatOne";
    setMode(next);
  });

  $$(".mode-list button").forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  if ($("#toggleImportPanel")) {
    $("#toggleImportPanel").addEventListener("click", () => {
      const drawer = $("#importDrawer");
      const isOpen = drawer.classList.toggle("is-open");
      $("#toggleImportPanel").setAttribute("aria-expanded", String(isOpen));
      $("#toggleImportPanel").classList.toggle("is-open", isOpen);
    });
  }
  if ($("#salonListenNow")) $("#salonListenNow").addEventListener("click", () => openTrack());
  if ($("#dockFavorite")) $("#dockFavorite").addEventListener("click", () => toggleFavorite());
  if ($("#dockPrev")) $("#dockPrev").addEventListener("click", () => moveTrack(-1));
  if ($("#dockNext")) $("#dockNext").addEventListener("click", () => moveTrack(1));
  if ($("#dockPlay")) $("#dockPlay").addEventListener("click", () => openTrack());
  if ($("#dockShuffle")) $("#dockShuffle").addEventListener("click", () => setMode("shuffle"));
  if ($("#dockRepeat")) $("#dockRepeat").addEventListener("click", () => {
    const next = state.playMode === "repeatOne" ? "repeatAll" : "repeatOne";
    setMode(next);
  });
  if ($("#collapseDock")) $("#collapseDock").addEventListener("click", () => toast("하단 플레이어는 이번 1차 UI에서 고정 상태로 둡니다."));
  if ($("#dockList")) $("#dockList").addEventListener("click", () => toast("재생 목록 패널은 다음 단계에서 연결할 수 있습니다."));
}

function moveTrack(direction) {
  const tracks = getFilteredTracks();
  if (!tracks.length) return;
  const index = tracks.findIndex((track) => track.id === state.currentTrackId);
  const nextIndex = index === -1 ? 0 : (index + direction + tracks.length) % tracks.length;
  selectTrack(tracks[nextIndex].id);
}

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  bindEvents();
  renderAll();
});
