
let weaponData = [];
let selectedFilters = { type: [], sub: [], special: [], season: [] };

async function loadWeapons() {
  const res = await fetch("weapons.json");
  weaponData = await res.json();
  generateFilterOptions();
  renderWeaponList();
}

function generateFilterOptions() {
  const filters = { type: [], sub: [], special: [], season: [] };
  weaponData.forEach(w => {
    if (!filters.type.includes(w.type)) filters.type.push(w.type);
    if (!filters.sub.includes(w.sub)) filters.sub.push(w.sub);
    if (!filters.special.includes(w.special)) filters.special.push(w.special);
    if (!filters.season.includes(w.season)) filters.season.push(w.season);
  });
  const filterSection = document.getElementById("filter-section");
  ["type", "sub", "special", "season"].forEach(category => {
    const wrapper = document.createElement("div");
    filters[category].forEach((item, i) => {
      if (category === "season") {
        const btn = document.createElement("button");
        btn.className = "filter-btn";
        btn.innerText = item;
        btn.style.backgroundColor = `hsl(${(i * 40) % 360}, 70%, 60%)`;
        btn.onclick = () => toggleFilter(category, item, btn);
        wrapper.appendChild(btn);
      } else {
        const img = document.createElement("img");
        img.src = "img/" + item;
        img.className = "filter-btn";
        img.onclick = () => toggleFilter(category, item, img);
        wrapper.appendChild(img);
      }
    });
    filterSection.appendChild(wrapper);
  });
}

function toggleFilter(category, value, el) {
  const idx = selectedFilters[category].indexOf(value);
  if (idx === -1) {
    selectedFilters[category].push(value);
    el.classList.add("active");
  } else {
    selectedFilters[category].splice(idx, 1);
    el.classList.remove("active");
  }
  renderWeaponList();
}

function renderWeaponList() {
  const list = document.getElementById("weapon-list");
  list.innerHTML = "";
  weaponData.forEach(w => {
    const match = Object.keys(selectedFilters).every(cat =>
      selectedFilters[cat].length === 0 || selectedFilters[cat].includes(w[cat])
    );
    if (match) {
      const div = document.createElement("div");
      div.className = "weapon-item";
      div.innerHTML = `
        <input type="checkbox" class="weapon-check" data-name="${w.name}">
        ${w.name}
        <img src="img/${w.sub}">
        <img src="img/${w.special}">
        <span>${w.season}</span>
      `;
      list.appendChild(div);
    }
  });
}

function selectAll() {
  document.querySelectorAll(".weapon-check").forEach(cb => cb.checked = true);
}

function deselectAll() {
  document.querySelectorAll(".weapon-check").forEach(cb => cb.checked = false);
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

window.onload = loadWeapons;
