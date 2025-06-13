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
  filters.innerHTML = '';

  const keys = {
    type: "武器種",
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

      if (key === "season") {
        const spanLabel = document.createElement("span");
        spanLabel.textContent = val;
        spanLabel.className = `season-badge season-${val}`;
        spanLabel.style.cursor = "pointer";
        spanLabel.addEventListener("click", () => {
          spanLabel.classList.toggle("active");
          spanLabel.style.opacity = spanLabel.classList.contains("active") ? 1 : 0.3;
          applyFilters();
        });
        span.appendChild(spanLabel);
      } else {
        const img = document.createElement("img");
        img.src = "img/" + val;
        img.alt = val;
        img.title = val;
        img.style.opacity = 0.3;
        img.addEventListener("click", () => {
          img.classList.toggle("active");
          img.style.opacity = img.classList.contains("active") ? 1 : 0.3;
          applyFilters();
        });
        span.appendChild(img);
      }

      group.appendChild(span); // ← ここを共通化して1回だけ呼ぶ
    });

    filters.appendChild(group);
  }
}


function getActiveFilters() {
  const result = {
    type: [],
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
      (f.type.length === 0 || f.type.includes(w.type)) &&
      (f.sub.length === 0 || f.sub.includes(w.sub)) &&
      (f.special.length === 0 || f.special.includes(w.special)) &&
      (f.season.length === 0 || f.season.includes(w.season))
    );
  });

  renderTable(filteredWeapons);
}

function renderTable(list) {
//追加1
  // 1. 現在のチェック状態を保存
  const currentChecks = {};
  document.querySelectorAll(".weapon-check").forEach(cb => {
    currentChecks[cb.dataset.name] = cb.checked;
  });
		
  const tbody = document.getElementById("weaponTableBody");
  tbody.innerHTML = "";
  list.forEach((w, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
       <td><input type="checkbox" class="weapon-check" data-name="${w.name}" ${currentChecks[w.name] !== false ? "checked" : ""}></td>
      <td>${w.name}</td>
      <td><img src="img/${w.type}" alt=""></td>
      <td><img src="img/${w.sub}" alt=""></td>
      <td><img src="img/${w.special}" alt=""></td>
      <td><span class="season-badge season-${w.season}">${w.season}</span></td>
    `;
    tbody.appendChild(row);
	  //追加2
	        // 2. 保存していたチェック状態を復元
const cb = row.querySelector(".weapon-check");
if (currentChecks[w.name]) cb.checked = true;
  });
}
	

function selectAll() {
  document.querySelectorAll(".weapon-check").forEach(cb => cb.checked = true);
}

function deselectAll() {
  document.querySelectorAll(".weapon-check").forEach(cb => cb.checked = false);
}



function randomizeALL() {
  // DOM上のチェック済み武器名一覧を取得
  const checkedNames = Array.from(document.querySelectorAll(".weapon-check:checked"))
                            .map(cb => cb.dataset.name);

  // JSONデータから、名前がチェックされている武器だけを抽出
  const checkedWeapons = weapons.filter(w => checkedNames.includes(w.name));

  const display = document.getElementById("random-display");
  if (checkedWeapons.length === 0) {
    display.innerText = "選択された武器がありません。";
    return;
  }

  const r = Math.floor(Math.random() * checkedWeapons.length);
  display.innerText = "ランダム選出: " + checkedWeapons[r].name;
}

function randomize() {
  const checked = Array.from(document.querySelectorAll(".weapon-check:checked"));
  const display = document.getElementById("random-display");
  if (checked.length === 0) {
    display.innerText = "選択された武器がありません。";
    return;
  }
  const r = Math.floor(Math.random() * checked.length);
  display.innerText = "ランダム選出: " + checked[r].dataset.name;
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
const seasonList = ['初期実装', '2023春', '2023夏シーズン', '2023秋', '2024冬', '2024春'];
createSeasonButtons(seasonList);