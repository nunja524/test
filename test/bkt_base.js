let weapons = [];
let filteredWeapons = [];

async function loadWeapons() {
  const res = await fetch("weapons.json");
  weapons = await res.json();
  filteredWeapons = weapons;
  generateFilterOptions();
  renderTable(filteredWeapons);
}

function getUnique(key) {
  return [...new Set(weapons.map(w => w[key]))];
}

function generateFilterOptions() {
  const filters = document.getElementById("filters");
  filters.innerHTML = ''; // 追加
  const keys = {
    weaponType: "武器種",
    sub: "サブ",
    special: "スペシャル",
    season: "シーズン"
  };

  for (const key in keys) {
    const group = document.createElement("div");
    group.className = "filter-group";
    group.innerHTML = `<strong>${keys[key]}</strong>: `;

    getUnique(key).forEach(val => {
      const span = document.createElement("span");
      span.className = "filter-option";
      span.dataset.key = key;
      span.dataset.value = val;

      const img = document.createElement("img");
      img.src = key === "season" ? "" : val;
      img.alt = val;
      img.title = val;
      img.className = "";

      if (key === "season") {
        img = document.createElement("span");
        img.textContent = val;
        img.className = "";
        img.style.border = "1px solid #aaa";
        img.style.padding = "2px 6px";
        img.style.margin = "2px";
        img.style.cursor = "pointer";
        img.style.opacity = 0.3;
      }

      img.addEventListener("click", () => {
        img.classList.toggle("active");
        img.style.opacity = img.classList.contains("active") ? 1 : 0.3;
        applyFilters(); // 自動検索
      });

      span.appendChild(img);
      group.appendChild(span);
    });

    filters.appendChild(group);
  }
}

function getActiveFilters() {
  const result = {
    weaponType: [],
    sub: [],
    special: [],
    season: []
  };

  document.querySelectorAll(".filter-option").forEach(opt => {
    const key = opt.dataset.key;
    const val = opt.dataset.value;
    const img = opt.querySelector("img,span");
    if (img.classList.contains("active")) {
      result[key].push(val);
    }
  });

  return result;
}

function applyFilters() {
  const f = getActiveFilters();
  filteredWeapons = weapons.filter(w => {
    return (
      (f.weaponType.length === 0 || f.weaponType.includes(w.weaponType)) &&
      (f.sub.length === 0 || f.sub.includes(w.sub)) &&
      (f.special.length === 0 || f.special.includes(w.special)) &&
      (f.season.length === 0 || f.season.includes(w.season))
    );
  });

  renderTable(filteredWeapons);
}

function renderTable(list) {
  const tbody = document.getElementById("weaponTableBody");
  tbody.innerHTML = "";
  list.forEach((w, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" class="weaponCheck" data-name="${w.name}" checked></td>
      <td>${w.name}</td>
      <td><img src="${w.weaponType}" alt=""></td>
      <td><img src="${w.sub}" alt=""></td>
      <td><img src="${w.special}" alt=""></td>
      <td>${w.season}</td>
    `;
    tbody.appendChild(row);
  });
}

function selectAll() {
  document.querySelectorAll(".weaponCheck").forEach(cb => cb.checked = true);
}

function deselectAll() {
  document.querySelectorAll(".weaponCheck").forEach(cb => cb.checked = false);
}

function randomPick() {
  const checked = Array.from(document.querySelectorAll(".weaponCheck:checked"));
  if (checked.length === 0) {
    document.getElementById("randomResult").textContent = "選択された武器がありません。";
    return;
  }
  const random = checked[Math.floor(Math.random() * checked.length)];
  document.getElementById("randomResult").textContent = ` ${random.dataset.name}`;
}

loadWeapons();
// 色のグラデーション生成（赤→紫：例 6段階）
function generateSeasonColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    // HSVのH値を0°（赤）から270°（紫）まで均等に割る
    const h = Math.round((270 / (count - 1)) * i);
    const color = `hsl(${h}, 70%, 50%)`; // 彩度・明度は固定
    colors.push(color);
  }
  return colors;
}

// ボタン生成とカラー適用（季節一覧に応じて）
function createSeasonButtons(seasonList) {
  const container = document.querySelector('.season-buttons');
  container.innerHTML = '';

  const colors = generateSeasonColors(seasonList.length);

  seasonList.forEach((season, index) => {
    const button = document.createElement('button');
    button.textContent = season;
    button.className = 'season-btn';
    button.dataset.value = season;
    button.style.backgroundColor = colors[index];

    // ON/OFF切り替え
    button.addEventListener('click', () => {
      button.classList.toggle('active');
      // 必要に応じて検索処理をトリガー
    });

    container.appendChild(button);
  });
}

// 使用例：シーズンリストから生成
const seasonList = ['初期実装', '2023春', '2023夏', '2023秋', '2024冬', '2024春'];
createSeasonButtons(seasonList);