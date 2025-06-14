let weapons = [];
let filteredWeapons = [];

async function loadWeapons() {
  const res = await fetch("weapons.json");
  weapons = await res.json();
  filteredWeapons = weapons;
  generateFilterOptions();
  loadCheckedWeapons(); // 初回読み込み時に復元
  renderTable(filteredWeapons);
}

function getUnique(key) {
  const values = [...new Set(weapons.map(w => w[key]))];

  // シーズンの場合は並び順を明示的に指定
	  if (key === "type") {
    const typeOrder = [
"wep_sh.png","wep_lo.png","wep_ch.png","wep_sl.png","wep_sp.png","wep_mn.png","wep_sy.png","wep_bl.png","wep_hd.png","wep_st.png","wep_wip.png"
    ];
    return typeOrder.filter(type => values.includes(type));
  }
	  if (key === "sub") {
    const subOrder = [
"sub_spb.png","sub_qb.png","sub_sb.png","sub_sp.png","sub_ss.png","sub_tb.png","sub_cb.png","sub_rb.png","sub_jb.png","sub_ps.png","sub_tr.png","sub_pm.png","sub_lm.png","sub_tp.png",
    ];
    return subOrder.filter(sub => values.includes(sub));
  }
	  if (key === "special") {
    const specialOrder = [
"sp_us.png","sp_gb.png","sp_sw.png","sp_ms.png","sp_af.png","sp_nd.png","sp_ps.png","sp_qi.png","sp_mr.png","sp_jp.png","sp_uh.png","sp_ct.png","sp_sr.png","sp_tt.png","sp_ed.png","sp_dt.png","sp_ti.png","sp_ut.png","sp_ss.png"
    ];
    return specialOrder.filter(special => values.includes(special));
  }
	
  if (key === "season") {
    const seasonOrder = [
      "初期実装", "2022冬", "2023春", "2023夏",
      "2023秋", "2023冬", "2024春", "2024夏", "2025夏", "2025仮"
    ];
    return seasonOrder.filter(season => values.includes(season));
  }
	  if (key === "ra_area") {
    const ra_areaOrder = [
      "短距離", "中距離", "長距離", "短距離チャージャー",
      "長距離チャージャー"
    ];
    return ra_areaOrder.filter(ra_area => values.includes(ra_area));
  }


  // その他はアルファベット順（任意）
  return values.sort();
}

function generateFilterOptions() {
  const filters = document.getElementById("filters");
  filters.innerHTML = '';

  const keys = {
    type: "武器種",
    sub: "サブ",
    special: "スペシャル",
    season: "シーズン",
    ra_area: "Xマッチ区分"
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

      const label = document.createElement(key === "season" || key === "ra_area" ? "span" : "img");

      if (key === "season") {
        label.textContent = val;
        label.className = `season-badge season-${val}`;
      } else if (key === "ra_area") {
        label.textContent = val;
        label.className = `ra_area-badge ra_area-${val}`;
      } else {
        label.src = "img/" + val;
        label.alt = val;
        label.title = val;
      }

      label.style.cursor = "pointer";
      label.style.opacity = 0.3;

      label.addEventListener("click", () => {
        label.classList.toggle("active");
        label.style.opacity = label.classList.contains("active") ? 1 : 0.3;
        applyFilters();
      });

      span.appendChild(label);
      group.appendChild(span);
    });

    filters.appendChild(group);
  }
}

function getActiveFilters() {
  const result = { type: [], sub: [], special: [], season: [], ra_area: [] };

  document.querySelectorAll(".filter-option").forEach(opt => {
    const key = opt.dataset.key;
    const val = opt.dataset.value;
    const item = opt.querySelector("img,span");
    if (item.classList.contains("active")) {
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
      (f.season.length === 0 || f.season.includes(w.season)) &&
      (f.ra_area.length === 0 || f.ra_area.includes(w.ra_area))
    );
  });
  renderTable(filteredWeapons);
}

function renderTable(list) {
  const savedChecks = loadCheckedWeapons(); // 保存されたチェック状態を取得

  const tbody = document.getElementById("weaponTableBody");
  tbody.innerHTML = "";

  list.forEach(w => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" class="weapon-check" data-name="${w.name}" ${savedChecks[w.name] ? "checked" : ""}></td>
      <td>${w.name}</td>
      <td><img src="img/${w.type}" alt=""></td>
      <td><img src="img/${w.sub}" alt=""></td>
      <td><img src="img/${w.special}" alt=""></td>
      <td><span class="season-badge season-${w.season}">${w.season}</span></td>
    `;
    tbody.appendChild(row);
  });

  // チェックイベントの追加
  document.querySelectorAll(".weapon-check").forEach(cb => {
    cb.addEventListener("change", saveCheckedWeapons);
  });
}

// チェックボックスの状態保存
function saveCheckedWeapons() {
  const checks = {};
  document.querySelectorAll(".weapon-check").forEach(cb => {
    checks[cb.dataset.name] = cb.checked;
  });
  localStorage.setItem("checkedWeapons", JSON.stringify(checks));
}

// 状態の復元
function loadCheckedWeapons() {
  return JSON.parse(localStorage.getItem("checkedWeapons") || "{}");
}

function selectAll() {
  document.querySelectorAll(".weapon-check").forEach(cb => {
    cb.checked = true;

  });
  saveCheckedWeapons();
}

function deselectAll() {
  const checks = loadCheckedWeapons(); // 既存の状態を読み込む

  // 表示されているチェックボックスだけ変更
  document.querySelectorAll(".weapon-check").forEach(cb => {
    cb.checked = false;
    checks[cb.dataset.name] = false; // 表示されている分だけ上書き
  });

  localStorage.setItem("checkedWeapons", JSON.stringify(checks));
}



function randomizeALL() {
  const savedChecks = loadCheckedWeapons();
  const checkedWeapons = weapons.filter(w => savedChecks[w.name]);
  const display = document.getElementById("random-display");
  if (checkedWeapons.length === 0) {
 document.getElementById("name01").innerHTML  = "選択された武器がありません。";
    return;
  }
  const r = Math.floor(Math.random() * checkedWeapons.length);
const selected = checkedWeapons[r];

// ブキ名（テキスト）
document.getElementById("name01").innerHTML = selected.name;

// 武器種（画像）
document.getElementById("weapon01").innerHTML = `<img src="img/${selected.type}" alt="武器種" >`;

// サブ（画像）
document.getElementById("sub01").innerHTML = `<img src="img/${selected.sub}" alt="サブ">`;

// スペシャル（画像）
document.getElementById("special01").innerHTML = `<img src="img/${selected.special}" alt="スペシャル">`;

}

function randomize() {
  const savedChecks = loadCheckedWeapons();
  const checkedWeapons = filteredWeapons.filter(w => savedChecks[w.name]);

  if (checkedWeapons.length === 0) {
    document.getElementById("name01").innerText = "選択された武器がありません。";
    document.getElementById("weapon01").innerText = "";
    document.getElementById("sub01").innerText = "";
    document.getElementById("special01").innerText = "";
    return;
  }

  const r = Math.floor(Math.random() * checkedWeapons.length);
  const selected = checkedWeapons[r];

  document.getElementById("name01").innerText = selected.name;

  // 🔽以下を innerText から <img> 要素に修正
  document.getElementById("weapon01").innerHTML = `<img src="img/${selected.type}" alt="武器種">`;
  document.getElementById("sub01").innerHTML = `<img src="img/${selected.sub}" alt="サブ">`;
  document.getElementById("special01").innerHTML = `<img src="img/${selected.special}" alt="スペシャル">`;
}

loadWeapons();


const modal = document.querySelector('.js-modal');
const modalButton = document.querySelector('.js-modal-button');

// 追記
const modalClose = document.querySelector('.js-close-button');　// xボタンのjs-close-buttonを取得し変数に格納

modalButton.addEventListener('click', () => {
  modal.classList.add('is-open');
});

// 追記
modalClose.addEventListener('click', () => { // xボタンをクリックしたときのイベントを登録
  modal.classList.remove('is-open'); 
});