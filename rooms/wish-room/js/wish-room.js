const STORAGE_KEY = "belleWishRoom.items.v04";

const DEFAULT_ITEMS = [
  {
    id: "wish-dress-001",
    name: "장미 레이스 롱드레스",
    brand: "LIZ LISA",
    url: "",
    category: "드레스",
    status: "신상 감지",
    price: 245,
    currency: "USD",
    krw: 336500,
    size: "S / M / L",
    color: "핑크, 로즈",
    cardType: "내 카드",
    memo: "LIZ LISA 신상품이 발견되었어요. 장미 레이스가 공주님 취향에 잘 맞아요.",
    image: "assets/items/wish-dress.svg",
    favorite: true,
    basket: false,
    createdAt: 4
  },
  {
    id: "wish-bag-001",
    name: "벨라 퀼팅 체인백",
    brand: "ROJITA",
    url: "",
    category: "가방",
    status: "재입고 감시중",
    price: 18900,
    currency: "JPY",
    krw: 259000,
    size: "ONE SIZE",
    color: "핑크, 아이보리, 베이지",
    cardType: "공용/미정",
    memo: "재입고 알림 설정 완료했어요. 이번엔 놓치지 않게 지켜볼게요.",
    image: "assets/items/wish-bag.svg",
    favorite: true,
    basket: false,
    createdAt: 3
  },
  {
    id: "wish-heels-001",
    name: "리본 펄 스트랩 힐",
    brand: "evelyn",
    url: "",
    category: "신발",
    status: "가격 내려감",
    price: 178,
    oldPrice: 198,
    currency: "USD",
    krw: 244000,
    size: "225 / 230 / 235 / 240",
    color: "핑크, 진주",
    cardType: "내 카드",
    memo: "가격이 내려갔어요! 지금이 좋은 타이밍 같아요.",
    image: "assets/items/wish-heels.svg",
    favorite: false,
    basket: true,
    createdAt: 2
  },
  {
    id: "wish-jewelry-001",
    name: "로즈 크리스탈 주얼리 세트",
    brand: "Taobao/Tmall",
    url: "",
    category: "굿즈·소품",
    status: "살까 말까",
    price: 92,
    currency: "USD",
    krw: 126000,
    size: "ONE SIZE",
    color: "로즈골드, 핑크",
    cardType: "동생 카드",
    memo: "비슷한 상품이 있어서 하루만 더 고민해도 좋겠어요.",
    image: "assets/items/wish-jewelry.svg",
    favorite: true,
    basket: true,
    createdAt: 1
  }
];

const state = {
  items: loadItems(),
  status: "all",
  brand: "all",
  category: "all",
  query: "",
  sort: "latest",
  editingId: null,
  watchScope: "specificProduct"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ITEMS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_ITEMS;
  } catch (error) {
    return DEFAULT_ITEMS;
  }
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
}

function formatMoney(value, currency) {
  const amount = Number(value || 0);
  if (currency === "JPY" || currency === "KRW") return amount.toLocaleString("ko-KR");
  return amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function currencySymbol(currency) {
  if (currency === "KRW") return "₩";
  if (currency === "JPY" || currency === "CNY") return "¥";
  return "$";
}

function originalPriceText(item) {
  const currency = item.currency || "USD";
  return `${currencySymbol(currency)} ${formatMoney(item.price, currency)} ${currency}`;
}

function usdApprox(item) {
  const price = Number(item.price || 0);
  if ((item.currency || "USD") === "USD") return price;
  if ((item.currency || "USD") === "JPY") return Math.round((price / 147) * 100) / 100;
  if ((item.currency || "USD") === "CNY") return Math.round((price / 7.2) * 100) / 100;
  if ((item.currency || "USD") === "KRW") return Math.round((price / 1360) * 100) / 100;
  return price;
}

function formatKrw(value) {
  return Number(value || 0).toLocaleString("ko-KR");
}

function statusClass(status) {
  if (status === "가격 내려감") return "sale";
  if (status === "구매 예정") return "plan";
  if (status === "살까 말까") return "ask";
  if (status === "신상" || status === "신상 감지") return "new";
  if (status === "수량 확인 필요" || status === "확인 필요" || status === "감시 실패") return "check";
  return "";
}

function colorDots(colorText) {
  const colors = String(colorText || "핑크").split(",").slice(0, 3);
  return colors.map((color) => {
    const lower = color.trim();
    let hex = "#ffc0cb";
    if (lower.includes("아이보리")) hex = "#fff4e8";
    if (lower.includes("베이지")) hex = "#ead4bf";
    if (lower.includes("진주")) hex = "#f7f2ea";
    if (lower.includes("로즈골드")) hex = "#e9b29f";
    if (lower.includes("골드")) hex = "#e8c47c";
    return `<i style="background:${hex}"></i>`;
  }).join("");
}

function matchesStatus(item) {
  if (state.status === "all") return true;
  if (state.status === "basket") return item.basket || item.status === "구매 예정";
  if (state.status === "newWatch") return item.status === "신상" || item.status === "신상 감지";
  if (state.status === "watchSettings") return item.status.includes("감시") || item.status.includes("확인");
  if (state.status === "settings") return true;
  return item.status === state.status;
}

function getFilteredItems() {
  let list = [...state.items];
  list = list.filter(matchesStatus);
  if (state.brand !== "all") list = list.filter((item) => item.brand === state.brand);
  if (state.category !== "all") list = list.filter((item) => item.category === state.category);
  if (state.query) {
    const keyword = state.query.toLowerCase();
    list = list.filter((item) => [item.name, item.brand, item.category, item.status, item.memo, item.color]
      .join(" ")
      .toLowerCase()
      .includes(keyword));
  }

  list.sort((a, b) => {
    if (state.sort === "krwHigh") return Number(b.krw || 0) - Number(a.krw || 0);
    if (state.sort === "krwLow") return Number(a.krw || 0) - Number(b.krw || 0);
    if (state.sort === "restock") return Number(b.status.includes("재입고")) - Number(a.status.includes("재입고"));
    if (state.sort === "plan") return Number(b.status === "구매 예정") - Number(a.status === "구매 예정");
    return Number(b.createdAt || 0) - Number(a.createdAt || 0);
  });
  return list;
}

function renderProducts() {
  const grid = $("#productGrid");
  const items = getFilteredItems().slice(0, 4);

  if (!items.length) {
    grid.innerHTML = `<div class="empty-card">아직 이 분류에 보관된 위시가 없어요. 새 상품을 살포시 넣어볼까요?</div>`;
    return;
  }

  grid.innerHTML = items.map((item) => `
    <article class="wish-product-card" data-id="${item.id}">
      <div class="product-art">
        <img src="${item.image || "assets/items/wish-dress.svg"}" alt="${item.name}" />
        <button class="heart-btn ${item.favorite ? "is-on" : ""}" data-action="heart" aria-label="즐겨찾기">${item.favorite ? "♥" : "♡"}</button>
        <span class="status-badge ${statusClass(item.status)}">${item.status}</span>
      </div>
      <div class="product-info">
        <h3>${item.name}</h3>
        <p class="brand">${item.brand || "Belle Wish"}</p>
        <p class="price-row">
          <b>${currencySymbol(item.currency)} ${formatMoney(item.price, item.currency)} ${item.currency}</b>
          ${item.oldPrice ? `<del>${currencySymbol(item.currency)}${formatMoney(item.oldPrice, item.currency)}</del>` : ""}
        </p>
        <p class="krw">약 ${formatKrw(item.krw)} KRW</p>
        <div class="options"><span>${item.size || "ONE SIZE"}</span><span class="color-dots">${colorDots(item.color)}</span></div>
        <div class="maid-comment"><span class="comment-face"></span><span>${item.memo || "메이드가 구매 타이밍을 함께 살펴보고 있어요."}</span></div>
      </div>
    </article>
  `).join("");
}

function renderSummary() {
  const restocks = state.items.filter((item) => item.status.includes("재입고")).slice(0, 2);
  const sales = state.items.filter((item) => item.status === "가격 내려감" || item.oldPrice).slice(0, 2);
  const basket = state.items.filter((item) => item.basket || item.status === "구매 예정");
  const totalUsd = basket.reduce((sum, item) => (item.currency || "USD") === "KRW" ? sum : sum + usdApprox(item), 0);
  const totalKrw = basket.reduce((sum, item) => sum + Number(item.krw || 0), 0);

  $("#restockPanel .summary-list").innerHTML = restocks.map((item) => summaryItem(item, "재입고!")).join("") || `<p class="soft-empty">오늘은 조용히 기다리는 중이에요.</p>`;
  $("#salePanel .summary-list").innerHTML = sales.map((item) => saleItem(item)).join("") || `<p class="soft-empty">가격 변동을 기다리고 있어요.</p>`;
  $(".basket-count").textContent = basket.length;
  $(".basket-usd").textContent = `$${totalUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  $(".basket-krw").textContent = `약 ${formatKrw(totalKrw)} KRW`;
  $(".customs-total b").textContent = `$${totalUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const customsState = $(".customs-state");
  if (totalUsd >= 150) {
    customsState.textContent = "기준 초과 가능성이 있어요.";
    customsState.style.color = "#d6484f";
  } else if (totalUsd >= 125) {
    customsState.textContent = "주의가 필요해요.";
    customsState.style.color = "#ca8a22";
  } else {
    customsState.textContent = "안전 범위 내예요. ✓";
    customsState.style.color = "#58a534";
  }
}

function summaryItem(item, chip) {
  return `
    <div class="summary-item">
      <img src="${item.image || "assets/items/wish-dress.svg"}" alt="${item.name}" />
      <div><strong>${item.name}</strong><small>${item.brand || "Belle Wish"}</small></div>
      <span class="chip">${chip}</span>
    </div>
  `;
}

function saleItem(item) {
  const before = item.oldPrice || Math.round(Number(item.price || 0) * 1.12);
  return `
    <div class="summary-item">
      <img src="${item.image || "assets/items/wish-dress.svg"}" alt="${item.name}" />
      <div><strong>${item.name}</strong><small>${currencySymbol(item.currency)}${formatMoney(before, item.currency)} → <span class="sale-price">${currencySymbol(item.currency)}${formatMoney(item.price, item.currency)}</span></small></div>
    </div>
  `;
}

function openModal(item) {
  state.editingId = item ? item.id : null;
  $("#modalTitle").textContent = item ? "위시 카드 수정" : "새 상품 넣기";
  $("#deleteBtn").hidden = !item;
  $("#itemName").value = item?.name || "";
  $("#itemBrand").value = item?.brand || "";
  $("#itemUrl").value = item?.url || "";
  $("#itemCategory").value = item?.category || "드레스";
  $("#itemStatus").value = item?.status || "살까 말까";
  $("#itemPrice").value = item?.price || "";
  $("#itemCurrency").value = item?.currency || "USD";
  $("#itemKrw").value = item?.krw || "";
  $("#itemCardType").value = item?.cardType || "내 카드";
  $("#itemSize").value = item?.size || "";
  $("#itemColor").value = item?.color || "";
  $("#itemImage").value = item?.image || "assets/items/wish-dress.svg";
  $("#itemMemo").value = item?.memo || "";
  $("#modalPreviewImg").src = item?.image || "assets/items/wish-dress.svg";
  $("#detailModal").showModal();
}


function openDetailModal(item) {
  if (!item) return;
  state.editingId = item.id;
  const image = item.image || "assets/items/wish-dress.svg";
  const currency = item.currency || "USD";
  const usd = usdApprox(item);
  const isDomestic = currency === "KRW";
  const price = Number(item.price || 0);
  const oldPrice = Number(item.oldPrice || item.price || 0);
  const hasDrop = oldPrice > price;
  const delta = oldPrice - price;
  const savedPriceText = `${currencySymbol(currency)} ${formatMoney(oldPrice, currency)} ${currency}`;
  const currentPriceText = originalPriceText(item);
  const krwText = `약 ${formatKrw(item.krw)} KRW`;
  const customsRatio = isDomestic
    ? "국내몰"
    : `$${usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / $150.00`;
  const customsExtra = isDomestic
    ? "관세 체크 제외"
    : usd >= 150
      ? `($${(usd - 150).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 초과)`
      : `($${(150 - usd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 여유)`;
  const customsState = isDomestic ? "국내몰" : usd >= 150 ? "주의 구간" : "안전 범위";
  const customsText = isDomestic
    ? "국내몰 · 관세 체크 제외"
    : usd >= 150
      ? `주의 구간 · ${customsRatio}`
      : `안전 범위 · ${customsRatio}`;
  const shippingText = isDomestic ? "국내 배송 · 확인 필요" : "배송비(예상) 확인 필요";
  const stockText = item.status === "품절" ? "품절" : item.status.includes("재입고") ? "확인 필요" : "재고 확인 필요";
  const colorName = item.color || "로즈 핑크";
  const colorTone = colorName.includes("블랙") || colorName.includes("검") ? "#5b4a4a" : colorName.includes("아이보리") ? "#fff2df" : colorName.includes("베이지") ? "#ead2bc" : colorName.includes("골드") ? "#f3c77d" : "#ff9faf";
  const statusOptions = ["신상", "신상 감지", "재입고 감시중", "재입고!", "가격 내려감", "살까 말까", "구매 예정", "구매 완료", "보류", "아카이브", "품절", "확인 필요"];
  const sizes = String(item.size || "ONE SIZE").split("/").map((value) => value.trim()).filter(Boolean);

  $("#detailHeroImg").src = image;
  $("#detailHeroImg").alt = item.name || "위시 상품 이미지";
  ["#detailThumbMain", "#detailThumbSub1", "#detailThumbSub2", "#detailThumbSub3"].forEach((selector) => {
    $(selector).src = image;
  });
  const favBtn = $("#detailFavoriteBtn");
  favBtn.classList.toggle("is-on", !!item.favorite);
  favBtn.textContent = item.favorite ? "♥" : "♡";
  favBtn.setAttribute("aria-label", item.favorite ? "즐겨찾기 해제" : "즐겨찾기");
  $("#detailBadges").innerHTML = `<span class="status-badge ${statusClass(item.status)}">${item.status || "살까 말까"}</span><span class="status-badge ask">구매 고민 기록</span>`;
  $("#detailName").textContent = item.name || "이름 없는 위시";
  $("#detailBrand").textContent = item.brand || "Belle Wish";
  $("#detailShop").textContent = item.brand || "Belle Wish";
  $("#detailUrl").textContent = item.url || "원본 링크 확인 대기";
  $("#detailCategory").textContent = item.category || "기타";
  $("#detailStatusText").textContent = item.status || "살까 말까";
  $("#detailStatusSelect").className = "status-change-select";
  $("#detailStatusSelect").innerHTML = statusOptions.map((status) => `<option${status === item.status ? " selected" : ""}>${status}</option>`).join("");
  $("#detailColor").textContent = colorName;
  $("#detailColorChip").style.background = colorTone;
  $("#detailSizeSelect").innerHTML = sizes.map((size) => `<option>${size}</option>`).join("");
  $("#detailStockStatus").textContent = stockText;
  $("#detailCardType").textContent = item.cardType || "공용/미정";
  $("#detailLastCheckTime").textContent = "오늘 오전 10:45";
  $("#detailMaterial").textContent = item.material || "확인 필요";
  $("#detailOrigin").textContent = item.origin || "확인 필요";
  $("#detailSku").textContent = item.sku || "확인 필요";
  $("#detailWantReason").textContent = item.memo || "마음에 담아둔 이유를 메이드가 함께 정리해둘게요.";
  $("#judgeSavedPrice").textContent = savedPriceText;
  $("#judgeCurrentPrice").textContent = currentPriceText;
  $("#judgePriceDelta").textContent = hasDrop ? `↓ (-${currencySymbol(currency)} ${formatMoney(delta, currency)})` : "변동 없음";
  $("#judgeLowestPrice").textContent = `${currentPriceText} (2025.05.20)`;
  $("#judgeHistory").textContent = hasDrop ? "↗ 7회 변동" : "↗ 확인 대기";
  $("#judgeCustomsState").textContent = customsState;
  $("#judgeCustoms").textContent = customsRatio;
  $("#judgeCustomsExtra").textContent = customsExtra;
  $("#judgeCartImpact").textContent = `약 ${formatKrw(Number(item.krw || 0) + (isDomestic ? 0 : 24600))} KRW`;
  $("#detailMaidComment").textContent = item.memo || "공주님 취향과 잘 맞는 아이템이에요. 가격과 활용도를 한 번 더 보고 구매 타이밍을 정리해드릴게요.";
  $("#detailArchiveText").textContent = item.image ? "대표 이미지 보관 준비 완료" : "이미지 URL 등록 대기";
  $("#detailOpenUrlBtn").disabled = !item.url;

  $("#detailViewModal").classList.add("is-open");
  $("#detailViewModal").removeAttribute("hidden");
  document.body.style.overflow = "hidden";
  // backdrop이 스크롤 컨테이너 — 열 때 맨 위로
  setTimeout(() => { document.getElementById("detailViewModal").scrollTop = 0; }, 0);
}

function collectFormData() {
  const existing = state.items.find((item) => item.id === state.editingId);
  return {
    id: state.editingId || `wish-${Date.now()}`,
    name: $("#itemName").value.trim(),
    brand: $("#itemBrand").value.trim(),
    url: $("#itemUrl").value.trim(),
    category: $("#itemCategory").value,
    status: $("#itemStatus").value,
    price: Number($("#itemPrice").value || 0),
    oldPrice: existing?.oldPrice || null,
    currency: $("#itemCurrency").value,
    krw: Number($("#itemKrw").value || 0),
    size: $("#itemSize").value.trim(),
    color: $("#itemColor").value.trim(),
    cardType: $("#itemCardType").value,
    memo: $("#itemMemo").value.trim(),
    image: $("#itemImage").value.trim() || "assets/items/wish-dress.svg",
    favorite: existing?.favorite || false,
    basket: existing?.basket || $("#itemStatus").value === "구매 예정",
    createdAt: existing?.createdAt || Date.now()
  };
}

function upsertItem(event) {
  event.preventDefault();
  const data = collectFormData();
  if (!data.name) return;
  const index = state.items.findIndex((item) => item.id === data.id);
  if (index >= 0) state.items[index] = data;
  else state.items.unshift(data);
  saveItems();
  $("#detailModal").close();
  renderAll();
}

function deleteCurrentItem() {
  if (!state.editingId) return;
  state.items = state.items.filter((item) => item.id !== state.editingId);
  saveItems();
  $("#detailModal").close();
  renderAll();
}


function openWatchRequestModal() {
  state.watchScope = "specificProduct";
  $$(".watch-type-card").forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.watchScope === state.watchScope);
  });
  $("#watchRequestForm").reset();
  $("#watchMemoCount").textContent = "0";
  $("#watchRequestModal").removeAttribute("hidden");
  $("#watchRequestModal").classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeWatchRequestModal() {
  $("#watchRequestModal").classList.remove("is-open");
  $("#watchRequestModal").setAttribute("hidden", "");
  document.body.style.overflow = "";
}

function watchTypeFromScope(scope) {
  if (scope === "specificProduct") return "product";
  if (scope === "brandNew") return "brand";
  if (scope === "categoryNew") return "category";
  return "product";
}

function collectWatchData() {
  const scope = state.watchScope || "specificProduct";
  const brand = $("#watchBrand").value.trim();
  const category = $("#watchCategory").value;
  const keywords = $("#watchKeywords").value.trim();
  const color = document.querySelector("input[name='watchColor']:checked")?.value || "";
  const size = $("#watchSize").value.trim();
  const conditions = $$("input[name='watchConditions']:checked").map((item) => item.value);
  const isProductWatch = scope === "specificProduct";
  const titleBase = keywords || brand || category || "새 위시";
  const status = isProductWatch ? "재입고 감시중" : "신상 감지";
  const memo = $("#watchMemo").value.trim() || `메이드가 ${conditions.join(", ") || "변화"} 조건을 확인해드릴게요.`;
  return {
    id: `wish-watch-${Date.now()}`,
    name: isProductWatch ? `${titleBase} 감시` : `${titleBase} 신상 감시`,
    brand: brand || "감시 브랜드",
    url: $("#watchUrl").value.trim(),
    category,
    status,
    price: 0,
    oldPrice: null,
    currency: "KRW",
    krw: 0,
    size,
    color,
    cardType: "공용/미정",
    memo,
    image: "assets/items/wish-bag.svg",
    favorite: false,
    basket: false,
    createdAt: Date.now(),
    watchType: watchTypeFromScope(scope),
    watchScope: scope,
    watchConditions: conditions,
    watchKeywords: keywords
  };
}

function submitWatchRequest(event) {
  event.preventDefault();
  const data = collectWatchData();
  state.items.unshift(data);
  saveItems();
  closeWatchRequestModal();
  renderAll();
}


function renderAll() {
  renderProducts();
  renderSummary();
}

$("#brandSelect").addEventListener("change", (event) => {
  state.brand = event.target.value;
  $$(".filter-pill[data-brand]").forEach((pill) => pill.classList.toggle("is-active", pill.dataset.brand === state.brand));
  renderProducts();
});

$("#categorySelect").addEventListener("change", (event) => {
  state.category = event.target.value;
  renderProducts();
});

$("#searchInput").addEventListener("input", (event) => {
  state.query = event.target.value.trim();
  renderProducts();
});

$(".favorite-brand-row").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-brand]");
  if (!button) return;
  state.brand = button.dataset.brand;
  $("#brandSelect").value = state.brand;
  $$(".filter-pill[data-brand]").forEach((pill) => pill.classList.toggle("is-active", pill === button));
  renderProducts();
});

$(".wish-menu").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-status]");
  if (!button) return;
  state.status = button.dataset.status;
  $$(".wish-menu-item").forEach((item) => item.classList.toggle("is-active", item === button));
  renderProducts();
});

$("#sortSelect").addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

$$(".view-btn").forEach((button) => {
  button.addEventListener("click", () => {
    $(".wish-room").dataset.view = button.dataset.view;
    $$(".view-btn").forEach((item) => item.classList.toggle("is-active", item === button));
  });
});

$("#productGrid").addEventListener("click", (event) => {
  const card = event.target.closest(".wish-product-card");
  if (!card) return;
  const item = state.items.find((entry) => entry.id === card.dataset.id);
  if (!item) return;
  if (event.target.closest("[data-action='heart']")) {
    item.favorite = !item.favorite;
    saveItems();
    renderProducts();
    return;
  }
  openDetailModal(item);
});

$("#openCreateBtn").addEventListener("click", openWatchRequestModal);
$("#moreWishBtn").addEventListener("click", () => openModal(null));
$("#itemImage").addEventListener("input", (event) => {
  $("#modalPreviewImg").src = event.target.value || "assets/items/wish-dress.svg";
});
$(".modal-frame").addEventListener("submit", upsertItem);
$("#deleteBtn").addEventListener("click", deleteCurrentItem);
function closeDetailViewModal() {
  $("#detailViewModal").classList.remove("is-open");
  $("#detailViewModal").setAttribute("hidden", "");
  document.body.style.overflow = "";
}
$("#detailCloseBtn").addEventListener("click", closeDetailViewModal);
$("#detailViewModal").addEventListener("mousedown", (event) => {
  if (event.target === $("#detailViewModal")) closeDetailViewModal();
});
$("#detailFavoriteBtn").addEventListener("click", () => {
  const item = state.items.find((entry) => entry.id === state.editingId);
  if (!item) return;
  item.favorite = !item.favorite;
  saveItems();
  openDetailModal(item);
  renderProducts();
});

// 썸네일 클릭 → 대표 이미지 교체
$(".detail-thumbs").addEventListener("click", (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;
  const img = btn.querySelector("img");
  if (!img) return;
  // 대표 이미지 교체
  $("#detailHeroImg").src = img.src;
  // is-active 이동
  $$(".detail-thumbs button").forEach((b) => b.classList.remove("is-active"));
  btn.classList.add("is-active");
  // thumb-check는 is-active 버튼에만 있어야 하므로 처리
  $$(".detail-thumbs .thumb-check").forEach((c) => c.style.display = "none");
  const check = btn.querySelector(".thumb-check");
  if (check) check.style.display = "";
});


$("#watchRequestCloseBtn").addEventListener("click", closeWatchRequestModal);
$("#watchLaterBtn").addEventListener("click", closeWatchRequestModal);
$("#watchBackBtn").addEventListener("click", closeWatchRequestModal);
$("#watchRequestModal").addEventListener("mousedown", (event) => {
  if (event.target === $("#watchRequestModal")) closeWatchRequestModal();
});
$(".watch-type-grid").addEventListener("click", (event) => {
  const card = event.target.closest(".watch-type-card");
  if (!card) return;
  state.watchScope = card.dataset.watchScope || "specificProduct";
  $$(".watch-type-card").forEach((item) => item.classList.toggle("is-selected", item === card));
});
$("#watchRequestForm").addEventListener("submit", submitWatchRequest);
$("#watchMemo").addEventListener("input", (event) => {
  $("#watchMemoCount").textContent = String(event.target.value.length);
});
$("#watchPasteBtn").addEventListener("click", async () => {
  if (!navigator.clipboard) return;
  try {
    const text = await navigator.clipboard.readText();
    $("#watchUrl").value = text;
  } catch (error) {
    $("#watchUrl").focus();
  }
});


renderAll();
