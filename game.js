let currentOriginIndex = 0;
let skillsCollapsed = false;
let currentJobIndex = 0; // 當前顯示的職業索引
let isProcessing = false; // 防止重复点击
let lastUpdateTime = 0;
const UPDATE_THROTTLE = 50; // UI更新节流
let Game = {
  name: "",
  origin: "",
  originId: "",
  education: "none",
  major: "",
  isStudying: false,
  studyProgress: 0,
  age: 0,
  gender: "男",
  money: 0,
  health: 100,
  happy: 80,
  intel: 50,
  stamina: 100,
  maxStamina: 100,

  // ✅ 必須要有這個變數，否則負債判斷會出錯
  debtYears: 0,

  workYears: 0,
  promotionChecked: false,
  children: [],
  inflationRate: 1.0,
  yearsPassed: 0,
  mortgage: {
    active: false,
    totalAmount: 0,
    remaining: 0,
    monthlyPayment: 0,
    years: 0,
  },
  skills: {
    programming: 0,
    art: 0,
    medical: 0,
    cooking: 0,
    finance: 0,
    communication: 0,
    charm: 0,
  },
  jobId: "none",
  jobYears: 0,
  yearlyMoney: 0,
  inventory: [],
  relationships: [],
  npcs: [],
  metNPCs: [],
  talents: [],
  traits: [],
  unlockedTraits: [],
  unlockedAchievements: [],
  happyYears: 0,
  hasBeenInDebt: false,
  totalActions: 0,
  totalEvents: 0,
  learnBonus: 1,
  healthDecay: 1,
  happyDecay: 1,
  socialBonus: 1,
  incomeBonus: 1,
  workPenalty: 1,
  skillBonus: 1,
  luckBonus: 0,
};

let activeEvent = null;
let selectedOriginId = "common";
let currentTraitIndex = 0; // ✅ 新增：當前顯示的特質索引
let availableTraits = []; // ✅ 新增：可選擇的特質列表
let selectedTraits = [];
let traitChoices = [];
// ==========================================
// 🔴 初始化
// ==========================================

function initCreation() {
  renderOriginCard();
}

function renderOriginCard() {
  // 確保索引在範圍內
  if (currentOriginIndex >= ORIGINS.length) currentOriginIndex = 0;
  if (currentOriginIndex < 0) currentOriginIndex = ORIGINS.length - 1;

  const o = ORIGINS[currentOriginIndex];

  let html = `
              <div style="position: relative; min-height: 450px;">
                  <!-- 左箭頭 -->
                  <button onclick="prevOrigin()"
                          style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
                                 width: 60px; height: 60px; border-radius: 50%; font-size: 2em;
                                 background: linear-gradient(135deg, #444, #555); z-index: 100;
                                 border: 3px solid var(--accent); box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
                      ◀
                  </button>

                  <!-- 右箭頭 -->
                  <button onclick="nextOrigin()"
                          style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
                                 width: 60px; height: 60px; border-radius: 50%; font-size: 2em;
                                 background: linear-gradient(135deg, #444, #555); z-index: 100;
                                 border: 3px solid var(--accent); box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
                      ▶
                  </button>

                  <!-- 出身卡片 -->
                  <div style="padding: 0 80px;">
                      <div class="origin-card selected"
                           style="transform: scale(1.05); box-shadow: 0 10px 30px rgba(187, 134, 252, 0.4);
                                  border-color: var(--accent); cursor: default;">
                          <div class="origin-name" style="font-size: 1.8em; text-align: center; margin-bottom: 10px; color: var(--gold);">
                              ${o.name}
                          </div>
                          <div class="origin-parents" style="text-align: center; font-size: 1em; margin-bottom: 15px; color: #888;">
                              👨‍👩‍👦 ${o.parents}
                          </div>
                          <div class="origin-desc" style="line-height: 1.6; margin: 15px 0; font-size: 0.95em; color: var(--text-dim);">
                              ${o.desc}
                          </div>
                          <div class="origin-stats" style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px;">
                              <div style="margin-bottom: 8px;">
                                  💰 初始資金: <span style="color: var(--gold); font-weight: bold;">$${o.money.toLocaleString()}</span>
                              </div>
                              <div style="margin-bottom: 8px;">
                                  🧠 智力: ${o.intel} | 😊 快樂: ${o.happy}
                              </div>
                              <div style="margin-bottom: 8px;">
                                  📅 年收入: $${o.yearlyMoney.toLocaleString()}
                              </div>
                              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.2); color: var(--green);">
                                  ✨ ${o.buff}
                              </div>
                          </div>
                      </div>

                      <!-- 指示器 -->
                      <div style="text-align: center; margin-top: 20px; color: var(--text-dim);">
                          <div style="font-size: 1.1em; margin-bottom: 5px;">
                              出身 ${currentOriginIndex + 1} / ${ORIGINS.length}
                          </div>
                          <div style="font-size: 0.9em;">
                              💡 左右切換查看更多出身背景
                          </div>
                      </div>
                  </div>
              </div>
          `;

  document.getElementById("origin-list").innerHTML = html;

  // 自動選中當前出身
  selectOrigin(o.id);
}

function selectOrigin(id) {
  selectedOriginId = id;
}
function prevOrigin() {
  currentOriginIndex--;
  if (currentOriginIndex < 0) {
    currentOriginIndex = ORIGINS.length - 1;
  }
  renderOriginCard();
}

function nextOrigin() {
  currentOriginIndex++;
  if (currentOriginIndex >= ORIGINS.length) {
    currentOriginIndex = 0;
  }
  renderOriginCard();
}
function toggleSkills() {
  skillsCollapsed = !skillsCollapsed;
  updateUI();
}
function showChanges(changes) {
  const changeDiv = document.createElement("div");
  changeDiv.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        background: linear-gradient(135deg, rgba(30, 30, 46, 0.98), rgba(42, 42, 62, 0.98));
        border: 3px solid var(--accent);
        border-radius: 20px;
        padding: 25px 35px;
        z-index: 500;
        box-shadow: 0 15px 50px rgba(187, 134, 252, 0.4), 0 0 20px rgba(187, 134, 252, 0.2);
        min-width: 250px;
        text-align: center;
        animation: popIn 0.3s ease-out forwards;
    `;

  let html =
    '<div style="font-size: 1.3em; font-weight: bold; color: var(--gold); margin-bottom: 15px; text-shadow: 0 0 10px var(--gold);">✨ 數值變化</div>';
  html += '<div style="display: flex; flex-direction: column; gap: 8px;">';

  changes.forEach((change) => {
    const isPositive = change.includes("+");
    const color = isPositive ? "var(--green)" : "var(--red)";
    const icon = isPositive ? "▲" : "▼";
    html += `
            <div style="font-size: 1.05em; padding: 8px 15px; background: rgba(0,0,0,0.3); 
                        border-radius: 8px; color: ${color}; font-weight: bold; 
                        border-left: 3px solid ${color};">
                ${icon} ${change}
            </div>
        `;
  });

  html += "</div>";
  changeDiv.innerHTML = html;
  document.body.appendChild(changeDiv);

  // 2 秒後淡出
  setTimeout(() => {
    changeDiv.style.animation = "fadeOut 0.3s ease-out forwards";
    setTimeout(() => changeDiv.remove(), 300);
  }, 2000);
}
// ===== ✅ 補上缺失的提示窗函式 =====
function showPopup(message, color = "green") {
  const popup = document.createElement("div");

  // 設定顏色變數
  let bgBorder = "var(--green)";
  if (color === "red") bgBorder = "var(--red)";
  if (color === "orange") bgBorder = "var(--orange)";

  popup.style.cssText = `
            position: fixed;
            top: 15%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(20, 20, 30, 0.95);
            border: 2px solid ${bgBorder};
            color: white;
            padding: 15px 30px;
            border-radius: 12px;
            font-weight: bold;
            font-size: 1.1em;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            animation: fadeIn 0.3s;
            text-align: center;
            min-width: 200px;
        `;

  // 加上圖示
  let icon = "✅";
  if (color === "red") icon = "❌";
  if (color === "orange") icon = "⚠️";

  popup.innerHTML = `<div>${icon} ${message.replace(/\n/g, "<br>")}</div>`;

  document.body.appendChild(popup);

  // 2秒後自動消失
  setTimeout(() => {
    popup.style.transition = "opacity 0.5s, transform 0.5s";
    popup.style.opacity = "0";
    popup.style.transform = "translate(-50%, -100%)"; // 往上飄走
    setTimeout(() => {
      if (popup.parentNode) document.body.removeChild(popup);
    }, 500);
  }, 2000);
}
function startGame() {
  const name = document.getElementById("inp-name").value.trim();
  if (!name) return alert("請輸入姓名");

  const origin = ORIGINS.find((o) => o.id === selectedOriginId);
  const gender = document.getElementById("inp-gender").value;

  // 隨機天賦
  let talentPool = [...TALENTS];
  let selectedTalents = [];
  const talentCount = Math.random() > 0.6 ? 2 : 1;
  for (let i = 0; i < talentCount; i++) {
    const idx = Math.floor(Math.random() * talentPool.length);
    selectedTalents.push(talentPool[idx]);
    talentPool.splice(idx, 1);
  }
  const savedAchievements = loadAchievements();
  console.log("📂 載入已保存的成就:", savedAchievements);
  // 初始化遊戲狀態
  Game = {
    ...Game,
    name,
    origin: origin.name,
    originId: origin.id,
    gender,
    money: origin.money,
    intel: origin.intel,
    happy: origin.happy,
    yearlyMoney: origin.yearlyMoney,
    talents: selectedTalents,
    age: 0,
    relationships: [],
    unlockedAchievements: savedAchievements, // ✅ 使用已保存的成就
  };

  // 記錄是否負債過
  if (Game.money < 0) Game.hasBeenInDebt = true;

  // 根據出身添加父母關係
  if (origin.parents && origin.parents !== "無") {
    const parentsSplit = origin.parents.split(" / ");
    if (parentsSplit.length === 2) {
      Game.relationships.push(
        {
          id: "dad",
          name: "爸爸",
          type: "parent",
          relation: 80,
          role: parentsSplit[0],
        },
        {
          id: "mom",
          name: "媽媽",
          type: "parent",
          relation: 90,
          role: parentsSplit[1],
        },
      );
    } else if (parentsSplit.length === 1) {
      Game.relationships.push({
        id: "mom",
        name: "媽媽",
        type: "parent",
        relation: 95,
        role: parentsSplit[0],
      });
    }
  }

  // 應用出身特殊效果
  if (origin.id === "military") Game.health += 20;
  if (origin.id === "doctor") Game.skills.medical += 30;
  if (origin.id === "farmer") {
    Game.health += 15;
    Game.happy += 5;
  }
  if (origin.id === "fisher") Game.health += 10;
  if (origin.id === "aboriginal") {
    Game.skills.charm += 15;
    Game.skills.art += 20;
    Game.happy += 10;
  }
  if (origin.id === "immigrant") Game.skills.communication += 20;
  if (origin.id === "tech") Game.skills.programming += 30;
  if (origin.id === "artist") {
    Game.skills.art += 40;
    Game.skills.charm += 10;
  }
  if (origin.id === "politician") Game.skills.communication += 25;
  if (origin.id === "temple") {
    Game.skills.communication += 15;
    Game.happy += 5;
  }
  if (origin.id === "mafia") {
    Game.skills.charm += 20;
    Game.health += 15;
  }
  if (origin.id === "star") Game.skills.charm += 30;
  switch (origin.id) {
    case "royal":
      Game.relationships.push({
        id: "butler",
        name: "管家阿爾弗雷德",
        type: "servant",
        relation: 80,
        role: "忠誠管家",
      });
      Game.skills.charm += 30;
      break;
    case "mafia":
      Game.relationships.push({
        id: "bodyguard",
        name: "保鑣阿強",
        type: "subordinate",
        relation: 70,
        role: "貼身保鑣",
      });
      break;
    case "hacker":
      Game.relationships.push({
        id: "mentor",
        name: "駭客導師 Ghost",
        type: "mentor",
        relation: 85,
        role: "技術導師",
      });
      Game.skills.programming += 50;
      break;
    case "monk":
      Game.relationships.push({
        id: "master",
        name: "師父玄空",
        type: "master",
        relation: 95,
        role: "授業恩師",
      });
      Game.health += 25;
      Game.happy += 10;
      break;
    case "spy":
      Game.relationships.push({
        id: "handler",
        name: "接頭人 Mr. Smith",
        type: "contact",
        relation: 60,
        role: "神秘接頭人",
      });
      break;
    case "chef_family":
      Game.relationships.push({
        id: "sous_chef",
        name: "副主廚老李",
        type: "colleague",
        relation: 75,
        role: "廚房夥伴",
      });
      Game.skills.cooking += 60;
      Game.skills.art += 20;
      break;
    case "detective":
      Game.relationships.push({
        id: "partner",
        name: "搭檔老王",
        type: "partner",
        relation: 80,
        role: "最佳拍檔",
      });
      break;
    case "esports":
      Game.relationships.push({
        id: "coach",
        name: "教練",
        type: "coach",
        relation: 75,
        role: "戰隊教練",
      });
      break;
    case "fashion":
      Game.relationships.push({
        id: "stylist",
        name: "造型師",
        type: "stylist",
        relation: 70,
        role: "御用造型師",
      });
      Game.skills.charm += 35;
      Game.skills.art += 25;
      break;
    case "scientist_family":
      Game.relationships.push({
        id: "lab_assistant",
        name: "實驗助理",
        type: "assistant",
        relation: 75,
        role: "研究助理",
      });
      break;
  }
  // 應用天賦效果
  // 應用天賦效果
  Game.talents.forEach((t) => t.effect(Game));

  // ✅ 開始特質選擇流程
  currentTraitStep = 0;
  selectedTraits = [];
  showTraitSelection();
}

// ✅ 新增特質選擇函數
function showTraitSelection() {
  document.getElementById("scene-creation").style.display = "none";

  // 初始化可選特質（只有 unlock: 'default' 的）
  availableTraits = TRAITS.filter((t) => t.unlock === "default");
  currentTraitIndex = 0;
  selectedTraits = [];

  let selectionHtml = `
        <div style="padding: 20px; text-align: center; max-width: 600px; margin: 0 auto;">
            <h1 style="font-size: 2em; color: var(--gold); margin-bottom: 10px;">✨ 選擇個人特質</h1>
            <p style="color: var(--text-dim); margin-bottom: 20px;">請選擇 3 個特質來定義你的人生</p>
            
            <!-- 已選特質顯示 -->
            <div id="selected-traits-display" style="margin-bottom: 20px; min-height: 50px;">
                <p style="color: var(--text-dim); font-size: 0.9em;">已選擇：<span id="selected-count">0</span>/3</p>
                <div id="selected-traits-list" style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 10px;"></div>
            </div>
            
            <!-- 特質選擇卡片 -->
            <div id="trait-card-container"></div>
            
            <!-- 完成按鈕 -->
            <button class="btn-main" id="finish-trait-btn" onclick="finishTraitSelection()" disabled style="margin-top: 20px; opacity: 0.5;">
                開始遊戲
            </button>
        </div>
    `;

  document.getElementById("scene-creation").innerHTML = selectionHtml;
  document.getElementById("scene-creation").style.display = "block";

  renderTraitCard();
}

function renderTraitOptions() {
  let html = "";

  traitChoices.forEach((trait, index) => {
    html += `
            <div class="origin-card" onclick="selectTrait(${index})" 
                 style="margin: 15px auto; max-width: 500px; cursor: pointer;">
                <div class="origin-name" style="font-size: 1.5em; margin-bottom: 10px;">
                    ${trait.name}
                </div>
                <div class="origin-desc" style="font-size: 1em; line-height: 1.5; color: var(--text-dim);">
                    ${trait.desc}
                </div>
                <div style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px; font-size: 0.9em; color: var(--green);">
                    類型：${trait.category === "personality" ? "性格特質" : "能力特質"}
                </div>
            </div>
        `;
  });

  document.getElementById("trait-options").innerHTML = html;
}
// ===== ✅ 新增特質卡片渲染函數 =====
function renderTraitCard() {
  // 1. 確保索引在範圍內
  if (currentTraitIndex < 0) currentTraitIndex = availableTraits.length - 1;
  if (currentTraitIndex >= availableTraits.length) currentTraitIndex = 0;

  const trait = availableTraits[currentTraitIndex];
  const isSelected = selectedTraits.includes(trait.id);

  // 2. 設定背景顏色 (根據類型)
  let categoryColor, categoryName, badgeColor;
  if (trait.category === "personality") {
    categoryColor = "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"; // 深藍
    badgeColor = "#2196f3";
    categoryName = "性格特質";
  } else if (trait.category === "ability") {
    categoryColor = "linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%)"; // 紫色
    badgeColor = "#9c27b0";
    categoryName = "能力特質";
  } else {
    categoryColor = "linear-gradient(135deg, #f12711 0%, #f5af19 100%)"; // 橘紅
    badgeColor = "#ff9800";
    categoryName = "特殊特質";
  }

  // 3. 檢查衝突 (Conflict Check)
  let conflictWarning = "";
  if (trait.conflictWith) {
    const conflictingSelected = selectedTraits.filter((id) =>
      trait.conflictWith.includes(id),
    );
    if (conflictingSelected.length > 0) {
      const conflictNames = conflictingSelected
        .map((id) => TRAITS.find((t) => t.id === id).name)
        .join("、");
      conflictWarning = `
            <div style="background: rgba(200, 50, 50, 0.2); padding: 8px; border-radius: 6px; margin-top: 10px; border: 1px solid #ff5252; font-size: 0.85em; display: flex; align-items: center; gap: 5px;">
                <span>⚠️</span> <span>與已選的 <b>${conflictNames}</b> 衝突</span>
            </div>`;
    }
  }

  // 4. 負面獎勵顯示
  let rewardInfo = "";
  if (trait.isNegative && trait.reward) {
    let rewards = [];
    if (trait.reward.money)
      rewards.push(`💰$${(trait.reward.money / 1000).toFixed(0)}k`); // 顯示為 k
    if (trait.reward.intel) rewards.push(`🧠+${trait.reward.intel}`);
    if (trait.reward.health) rewards.push(`❤️+${trait.reward.health}`);
    if (trait.reward.happy) rewards.push(`😊+${trait.reward.happy}`);
    if (trait.reward.charm) rewards.push(`✨+${trait.reward.charm}`);

    if (rewards.length > 0) {
      rewardInfo = `
            <div style="background: rgba(3, 218, 198, 0.1); padding: 8px; border-radius: 6px; margin-top: 10px; border: 1px solid var(--green); font-size: 0.85em; color: var(--green);">
                🎁 <b>補償：</b> ${rewards.join(" ")}
            </div>`;
    }
  }

  // 5. 生成 HTML
  let html = `
    <div class="trait-card-wrapper">
        <button class="trait-nav-btn trait-nav-prev" onclick="prevTrait()">◀</button>
        <button class="trait-nav-btn trait-nav-next" onclick="nextTrait()">▶</button>

        <div class="trait-card-body ${isSelected ? "selected" : ""}" 
             onclick="toggleTraitSelection('${trait.id}')"
             style="background: ${isSelected ? "" : categoryColor};">
             
            ${isSelected ? '<div style="position: absolute; top: 15px; right: 15px; background: var(--green); color: black; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; box-shadow: 0 0 10px var(--green);">✓</div>' : ""}

            <div class="trait-name-text" style="font-size: 1.8em; font-weight: bold; color: white; margin-bottom: 5px; text-shadow: 0 2px 5px rgba(0,0,0,0.5);">
                ${trait.name}
            </div>
            
            <div style="margin-bottom: 15px;">
                <span style="background: rgba(0,0,0,0.3); padding: 4px 12px; border-radius: 20px; font-size: 0.8em; color: rgba(255,255,255,0.9); border: 1px solid rgba(255,255,255,0.2);">
                    ${categoryName}
                </span>
            </div>

            <div class="trait-desc-text" style="color: rgba(255,255,255,0.9); margin-bottom: 15px; font-size: 1.1em; line-height: 1.5; min-height: 3.2em;">
                ${trait.desc}
            </div>

            <div style="background: rgba(0,0,0,0.25); padding: 15px; border-radius: 10px; text-align: left; border: 1px solid rgba(255,255,255,0.1);">
                <div style="font-size: 0.9em; color: var(--gold); margin-bottom: 5px; font-weight: bold; display: flex; align-items: center; gap: 5px;">
                    ✨ 效果詳情
                </div>
                <div style="font-size: 0.95em; line-height: 1.6; white-space: pre-wrap; color: #f0f0f0;">${trait.detailedEffect || "無特殊效果"}</div>
            </div>

            ${rewardInfo}
            ${conflictWarning}

            <div style="margin-top: 15px; font-size: 0.8em; color: rgba(255,255,255,0.5); text-align: center;">
                ${isSelected ? "再次點擊取消選擇" : "點擊卡片進行選擇"} <br>
                (${currentTraitIndex + 1} / ${availableTraits.length})
            </div>
        </div>

        <div class="mobile-nav-container">
            <button class="mobile-nav-btn" onclick="event.stopPropagation(); prevTrait()">◀ 上一個</button>
            <button class="mobile-nav-btn" onclick="event.stopPropagation(); nextTrait()">下一個 ▶</button>
        </div>
    </div>
    `;

  document.getElementById("trait-card-container").innerHTML = html;
  updateSelectedTraitsDisplay();
}
function prevTrait() {
  currentTraitIndex--;
  if (currentTraitIndex < 0) currentTraitIndex = availableTraits.length - 1;
  renderTraitCard();
}

function nextTrait() {
  currentTraitIndex++;
  if (currentTraitIndex >= availableTraits.length) currentTraitIndex = 0;
  renderTraitCard();
}

function toggleTraitSelection(traitId) {
  const trait = TRAITS.find((t) => t.id === traitId);
  const index = selectedTraits.indexOf(traitId);

  if (index !== -1) {
    // 取消选择
    selectedTraits.splice(index, 1);
  } else {
    if (selectedTraits.length >= 3) {
      alert("⚠️ 最多只能選擇 3 個特質！");
      return;
    }

    // ✅ 检查冲突
    const conflicts = [];
    selectedTraits.forEach((selectedId) => {
      const selectedTrait = TRAITS.find((t) => t.id === selectedId);
      if (trait.conflictWith && trait.conflictWith.includes(selectedId)) {
        conflicts.push(selectedTrait.name);
      }
      if (
        selectedTrait.conflictWith &&
        selectedTrait.conflictWith.includes(traitId)
      ) {
        conflicts.push(selectedTrait.name);
      }
    });

    if (conflicts.length > 0) {
      alert(
        `⚠️ 特質衝突！\n\n${trait.name} 與 ${conflicts.join("、")} 互相矛盾，無法同時選擇。`,
      );
      return;
    }

    selectedTraits.push(traitId);
  }

  renderTraitCard();
  updateSelectedTraitsDisplay();
}
function finishCharacterCreation() {
        // 1. 將選擇的特質加入遊戲
        // 注意：這裡使用 TRAITS (全大寫) 和 selectedTraits (全域變數)
        Game.traits = selectedTraits.map((id) =>
          TRAITS.find((t) => t.id === id),
        );
        Game.unlockedTraits = [...selectedTraits];

        // 2. 應用特質效果與計算補償
        let rewardMessages = [];
        Game.traits.forEach((trait) => {
          // 應用效果
          if (trait.effect) {
            trait.effect(Game);
          }

          // 計算負面特質獎勵
          if (trait.isNegative && trait.reward) {
            if (trait.reward.money) {
              Game.money += trait.reward.money;
              rewardMessages.push(
                `💰 補償金 +$${trait.reward.money.toLocaleString()}`,
              );
            }
            if (trait.reward.intel) {
              Game.intel += trait.reward.intel;
              rewardMessages.push(`🧠 智力 +${trait.reward.intel}`);
            }
            if (trait.reward.health) {
              Game.health += trait.reward.health;
              rewardMessages.push(`❤️ 健康 +${trait.reward.health}`);
            }
            if (trait.reward.happy) {
              Game.happy += trait.reward.happy;
              rewardMessages.push(`😊 快樂 +${trait.reward.happy}`);
            }
            if (trait.reward.charm) {
              Game.skills.charm += trait.reward.charm;
              rewardMessages.push(`✨ 魅力 +${trait.reward.charm}`);
            }
          }
        });

        // 3. 顯示補償訊息 (如果有)
        if (rewardMessages.length > 0) {
          alert(`🎁 負面特質補償獎勵：\n\n${rewardMessages.join("\n")}`);
        }

        // 4. 切換介面：隱藏創角，顯示遊戲主畫面
        document.getElementById("scene-creation").style.display = "none";
        const gameScene = document.getElementById("scene-game");
        gameScene.style.display = "block";
        gameScene.classList.add("active");

        // 5. 初始化遊戲各項顯示
        updateUI();
        renderJobs();
        renderShop();
        renderSocial();
        renderAchievements();
        renderStats();

        // 6. 寫入第一筆日誌
        log(`👶 ${Game.name} 出生了！`);
        log(`🏠 出身：${Game.origin}`);
        log(`🎁 天賦：${Game.talents.map((t) => t.name).join("、")}`);
        log(`✨ 特質：${Game.traits.map((t) => t.name).join("、")}`);

        // 7. ✅ 觸發開場劇情 (最重要的部分)
        // 這裡使用 setTimeout 延遲 500毫秒，確保介面切換完成後才彈出，體驗較好
        if (
          typeof ORIGIN_STORY !== "undefined" &&
          ORIGIN_STORY[Game.originId]
        ) {
          setTimeout(() => {
            showModal("📖 人生篇章開啟", ORIGIN_STORY[Game.originId], [
              { text: "開始冒險", action: () => closeModal() },
            ]);
            log(ORIGIN_STORY[Game.originId]);
          }, 500);
        }
      }
function updateSelectedTraitsDisplay() {
  document.getElementById("selected-count").textContent = selectedTraits.length;

  let selectedHtml = "";
  selectedTraits.forEach((id) => {
    const trait = TRAITS.find((t) => t.id === id);
    if (trait) {
      let bgColor =
        trait.category === "personality"
          ? "linear-gradient(135deg, #2196f3, #1976d2)"
          : "linear-gradient(135deg, #9c27b0, #7b1fa2)";

      selectedHtml += `
                <div class="trait-tooltip" style="background: ${bgColor}; padding: 8px 15px; border-radius: 20px; 
                     font-size: 0.9em; color: white; position: relative; cursor: pointer;"
                     onclick="toggleTraitSelection('${id}')">
                    ${trait.name} ✕
                </div>
            `;
    }
  });

  document.getElementById("selected-traits-list").innerHTML = selectedHtml;

  // 更新完成按鈕
  const finishBtn = document.getElementById("finish-trait-btn");
  if (selectedTraits.length === 3) {
    finishBtn.disabled = false;
    finishBtn.style.opacity = "1";
  } else {
    finishBtn.disabled = true;
    finishBtn.style.opacity = "0.5";
  }
}
// ✅ 優化後的特質詳情彈窗 (精緻卡片版)
// ✅ 最終修復版：特質詳情 (解決排版跑掉問題)
function showTraitDetail(traitId) {
  const trait = TRAITS.find((t) => t.id === traitId);
  if (!trait) return;

  // 1. 取得 DOM 元素
  const modalBox = document.querySelector(".modal-box");
  const modalOverlay = document.getElementById("event-modal");
  const title = document.getElementById("ev-title");
  const desc = document.getElementById("ev-desc");
  const btnA = document.getElementById("btn-choice-a");
  const btnB = document.getElementById("btn-choice-b");

  // 2. 開啟「純淨模式」 (移除原本的 padding 和 border)
  modalBox.classList.add("clean-modal");

  // 3. 隱藏原本的通用標題與按鈕 (我們會在卡片內自己畫)
  title.style.display = "none";
  btnA.style.display = "none";
  btnB.style.display = "none";

  // 4. 定義主題顏色
  let themeColor, themeIcon, typeName;
  if (trait.category === "personality") {
    themeColor = "linear-gradient(135deg, #2196f3, #1976d2)";
    themeIcon = "🧘";
    typeName = "性格特質";
  } else if (trait.category === "ability") {
    themeColor = "linear-gradient(135deg, #9c27b0, #7b1fa2)";
    themeIcon = "⚡";
    typeName = "能力特質";
  } else {
    themeColor = "linear-gradient(135deg, #ff9800, #f57c00)";
    themeIcon = "🌟";
    typeName = "特殊特質";
  }

  // 5. 構建 HTML (包含標題、內容、按鈕)
  // 注意：這裡我們自己建立了一個完整的卡片結構

  // 補償獎勵區塊
  let rewardHtml = "";
  if (trait.isNegative && trait.reward) {
    let rewards = [];
    if (trait.reward.money)
      rewards.push(`💰 資金 +$${trait.reward.money.toLocaleString()}`);
    if (trait.reward.intel) rewards.push(`🧠 智力 +${trait.reward.intel}`);
    if (trait.reward.health) rewards.push(`❤️ 健康 +${trait.reward.health}`);
    if (trait.reward.happy) rewards.push(`😊 快樂 +${trait.reward.happy}`);

    if (rewards.length > 0) {
      rewardHtml = `
                <div style="margin-top: 15px; padding: 12px; background: rgba(3, 218, 198, 0.1); border: 1px solid rgba(3, 218, 198, 0.3); border-radius: 8px;">
                    <div style="color: var(--green); font-weight: bold; font-size: 0.9em; margin-bottom: 5px;">🎁 負面特質補償</div>
                    <div style="font-size: 0.85em; color: #eee; line-height: 1.6;">${rewards.join(" / ")}</div>
                </div>
            `;
    }
  }

  const cardHtml = `
        <div style="border-radius: 12px; overflow: hidden; background: #1e1e2e; box-shadow: 0 10px 40px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; max-height: 80vh;">
            
            <div style="background: ${themeColor}; padding: 25px 20px; text-align: center; position: relative; flex-shrink: 0;">
                <div style="font-size: 3em; margin-bottom: 5px; text-shadow: 0 4px 10px rgba(0,0,0,0.3);">${themeIcon}</div>
                <div style="font-size: 1.8em; font-weight: bold; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3); letter-spacing: 1px;">
                    ${trait.name}
                </div>
                <div style="position: absolute; top: 15px; right: 15px; font-size: 0.75em; background: rgba(0,0,0,0.3); color: white; padding: 4px 10px; border-radius: 20px; backdrop-filter: blur(5px);">
                    ${typeName}
                </div>
            </div>

            <div class="trait-card-scroll">
                <div style="text-align: center; color: #b0b0b0; font-size: 1em; line-height: 1.6; margin-bottom: 20px; font-style: italic;">
                    "${trait.desc}"
                </div>

                <div style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 15px; border: 1px solid rgba(255,255,255,0.08);">
                    <div style="color: var(--gold); font-size: 0.95em; font-weight: bold; margin-bottom: 8px; display: flex; align-items: center;">
                        <span style="margin-right: 8px; font-size: 1.2em;">⚡</span> 特質影響
                    </div>
                    <div style="color: #fff; font-size: 0.95em; line-height: 1.8; white-space: pre-line;">
                        ${trait.detailedEffect ? trait.detailedEffect : "無特殊數值影響"}
                    </div>
                </div>

                ${rewardHtml}
            </div>

            <div class="trait-card-footer">
                <button id="trait-close-btn" style="
                    width: 100%; 
                    padding: 12px; 
                    border: none; 
                    border-radius: 8px; 
                    background: ${themeColor}; 
                    color: white; 
                    font-weight: bold; 
                    font-size: 1em; 
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    transition: transform 0.2s;">
                    關閉
                </button>
            </div>
        </div>
    `;

  // 6. 寫入內容
  desc.innerHTML = cardHtml;
  // 因為我們用了 clean-modal，所以要重置 desc 的預設樣式
  desc.style.padding = "0";
  desc.style.margin = "0";
  desc.style.overflow = "visible"; // 讓我們的卡片自己處理 overflow

  // 7. 綁定關閉事件 (包含清理工作)
  document.getElementById("trait-close-btn").onclick = function () {
    modalOverlay.style.display = "none";

    // ⚠️ 重要：復原 Modal 的原始狀態，以免影響其他事件視窗
    modalBox.classList.remove("clean-modal");
    title.style.display = "block";
    desc.style.padding = ""; // 恢復 CSS 定義的 padding
    desc.style.margin = ""; // 恢復 CSS 定義的 margin
    desc.innerHTML = ""; // 清空內容
  };

  modalOverlay.style.display = "flex";
}

function finishTraitSelection() {
  if (selectedTraits.length !== 3) {
    alert("⚠️ 請選擇 3 個特質！");
    return;
  }

  finishCharacterCreation();
}
function selectTrait(index) {
  const selectedTrait = traitChoices[index];
  selectedTraits.push(selectedTrait.id);
  currentTraitStep++;

  // 如果還沒選完3個，繼續選擇
  if (currentTraitStep < 3) {
    showTraitSelection();
  } else {
    // 選完了，開始遊戲
    finishCharacterCreation();
  }
}

// ==========================================
// 🔴 UI 更新
// ==========================================

function log(msg, changes = null) {
  const box = document.getElementById("game-log");
  if (box) {
    const timestamp = `[${Game.age}歲]`;
    let logHtml = `<div style="margin-bottom: 8px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 5px;">`;
    logHtml += `<span style="color: var(--text-dim); font-size: 0.85em;">${timestamp}</span> `;
    logHtml += `<span style="color: var(--text);">${msg}</span>`;

    if (changes && changes.length > 0) {
      logHtml +=
        '<div style="margin-top: 5px; display: flex; flex-wrap: wrap; gap: 8px;">';
      changes.forEach((change) => {
        const isPositive = change.includes("+");
        const color = isPositive ? "var(--green)" : "var(--red)";
        logHtml += `<span style="font-size: 0.8em; padding: 2px 8px; background: rgba(255,255,255,0.1); color: ${color}; border-radius: 4px;">${change}</span>`;
      });
      logHtml += "</div>";
    }
    logHtml += "</div>";

    box.innerHTML += logHtml;

    // ✅ 優化：只保留最近 50 條紀錄，防止記憶體溢出變慢
    const logs = box.getElementsByTagName("div");
    if (logs.length > 50) {
      // 因為一個 log 可能包含子 div，這裡簡單移除最上面的一個區塊
      // 注意：這裡 logs 是 live collection，結構較複雜，建議直接操作 innerHTML 或用 array 管理
      // 簡單優化：當內容過多時，清空前一半
      if (box.innerHTML.length > 10000) {
        box.innerHTML = box.innerHTML.substring(box.innerHTML.length / 2);
      }
    }

    box.scrollTop = box.scrollHeight;
  }
}
// ===== ✅ 成就持久化系统 =====
function saveAchievements() {
  try {
    const achievementData = {
      unlockedAchievements: Game.unlockedAchievements,
      timestamp: Date.now(),
    };
    localStorage.setItem(
      "lifeSimAchievements",
      JSON.stringify(achievementData),
    );
    console.log("✅ 成就已保存", Game.unlockedAchievements);
  } catch (e) {
    console.error("❌ 成就保存失敗", e);
  }
}

function loadAchievements() {
  try {
    const saved = localStorage.getItem("lifeSimAchievements");
    if (saved) {
      const data = JSON.parse(saved);
      return data.unlockedAchievements || [];
    }
  } catch (e) {
    console.error("❌ 成就讀取失敗", e);
  }
  return [];
}

function resetAchievements() {
  if (confirm("確定要重置所有成就嗎？此操作無法復原！")) {
    localStorage.removeItem("lifeSimAchievements");
    Game.unlockedAchievements = [];
    updateUI();
    alert("✅ 成就已重置");
  }
}
// ===== ✅ 成就导出/导入（备份用）=====
function exportAchievements() {
  const data = localStorage.getItem("lifeSimAchievements");
  if (!data) {
    alert("❌ 沒有可導出的成就數據");
    return;
  }

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `成就備份_${new Date().toLocaleDateString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  alert("✅ 成就已導出");
}

function importAchievements() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        localStorage.setItem("lifeSimAchievements", e.target.result);
        Game.unlockedAchievements = data.unlockedAchievements || [];
        updateUI();
        alert("✅ 成就已導入");
      } catch (err) {
        alert("❌ 文件格式錯誤");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function getAchievementStats() {
  const total = ACHIEVEMENTS.length;
  const unlocked = Game.unlockedAchievements.length;
  const percentage = Math.floor((unlocked / total) * 100);
  return { total, unlocked, percentage };
}

function updateUI() {
  // ===== ✅ 新增：UI更新节流 =====
  const now = Date.now();
  if (now - lastUpdateTime < UPDATE_THROTTLE) {
    return;
  }
  lastUpdateTime = now;
  // 基本資訊
  document.getElementById("player-name").textContent = Game.name;
  document.getElementById("age-display").textContent = Game.age;
  document.getElementById("player-origin").textContent = Game.origin;
  document.getElementById("player-job").textContent = JOBS.find(
    (j) => j.id === Game.jobId,
  ).name;
  document.getElementById("money-display").textContent =
    "$" + Game.money.toLocaleString();

  // 數值
  document.getElementById("health").textContent = Math.max(
    0,
    Math.floor(Game.health),
  );
  document.getElementById("happy").textContent = Math.max(
    0,
    Math.floor(Game.happy),
  );
  document.getElementById("intel").textContent = Math.floor(Game.intel);

  // 頭像
  const stage = LIFE_STAGES.find((s) => Game.age >= s.min && Game.age <= s.max);
  document.getElementById("player-avatar").textContent = stage.icon;
  document.getElementById("life-stage").textContent = stage.name;

  // 天賦標籤
  // 天賦顯示
  let talentHtml = "";
  Game.talents.forEach((t) => {
    talentHtml += `<span class="talent-tag ${t.type === "bad" ? "talent-bad" : ""}" title="${t.desc}">${t.name}</span>`;
  });
  document.getElementById("talent-display").innerHTML = talentHtml;

  // 特質顯示（帶詳細效果提示）
  // ===== 特质显示（带点击事件）=====
  let traitHtml = "";
  if (Game.traits && Game.traits.length > 0) {
    traitHtml =
      '<div style="font-size: 0.7em; color: var(--text-dim); margin-bottom: 3px;">✨ 特質</div>';
    Game.traits.forEach((t) => {
      let bgColor = "";
      if (t.category === "personality") {
        bgColor = "background: linear-gradient(135deg, #2196f3, #1976d2);";
      } else if (t.category === "ability") {
        bgColor = "background: linear-gradient(135deg, #9c27b0, #7b1fa2);";
      } else if (t.category === "special") {
        bgColor = "background: linear-gradient(135deg, #ff9800, #f57c00);";
      }

      // ✅ 使用 data 属性存储特质 ID
      traitHtml += `
            <span class="talent-tag trait-tooltip" 
                  style="${bgColor} pointer-events: auto; cursor: pointer;" 
                  data-trait-id="${t.id}"
                  title="點擊查看詳情">
                ${t.name}
            </span>
        `;
    });
  }
  document.getElementById("trait-display").innerHTML = traitHtml;

  // ✅ 重新绑定点击事件（每次 updateUI 都要重新绑定）
  document.querySelectorAll(".trait-tooltip").forEach((el) => {
    el.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      const traitId = this.getAttribute("data-trait-id");
      console.log("点击特质:", traitId); // 调试用
      if (traitId) {
        showTraitDetail(traitId);
      }
    };
  });

  // ===== 📊 技能顯示 (極簡版) =====
  const skillNames = {
    programming: "💻 程式",
    art: "🎨 藝術",
    medical: "⚕️ 醫療",
    cooking: "🍳 烹飪",
    finance: "💰 理財",
    communication: "🗣️ 溝通",
    charm: "✨ 魅力",
  };

  let skillHtml = "";

  // 遍歷所有技能
  Object.keys(Game.skills).forEach((key) => {
    const val = Math.floor(Game.skills[key]);
    if (val > 0) {
      // 只顯示數值 > 0 的技能
      skillHtml += `
                <div class="skill-tag" style="font-size: 0.85em; padding: 4px 8px; margin: 2px;">
                    ${skillNames[key] || key} 
                    <span style="color: var(--gold); font-weight: bold; margin-left: 5px;">${val}</span>
                </div>
            `;
    }
  });

  // 若完全無技能
  if (skillHtml === "") {
    skillHtml =
      '<span style="font-size: 0.8em; color: var(--text-dim); opacity: 0.5; padding: 5px;">( 尚未習得技能 )</span>';
  }

  // 更新容器 (移除原本的 Grid/Card 邏輯，只留標籤)
  const skillsContainer = document.getElementById("skills-container");
  if (skillsContainer) {
    skillsContainer.innerHTML = skillHtml;
    // 強制設定樣式以確保緊湊排列
    skillsContainer.style.display = "flex";
    skillsContainer.style.flexWrap = "wrap";
    skillsContainer.style.gap = "4px";
    skillsContainer.style.justifyContent = "flex-end"; // 靠右對齊 (配合儀表板布局)
  }
  // 體力條
  const stamina = Math.max(0, Math.min(100, Game.stamina));
  const staminaRatio = stamina / 100;
  document.getElementById("stamina-bar").style.transform =
    `scaleX(${staminaRatio})`;
  document.getElementById("stamina-text").textContent =
    `${Math.floor(stamina)}/100`;

  if (stamina < 20) {
    document.getElementById("stamina-bar").classList.add("low");
  } else {
    document.getElementById("stamina-bar").classList.remove("low");
  }

  // 狀態警告
  let alertHtml = "";
  if (Game.money < 0) {
    alertHtml += `<div class="status-alert alert-red">⚠️ 負債警告！剩 ${3 - Game.debtYears} 年</div>`;
  }
  if (Game.happy < 20) {
    alertHtml += `<div class="status-alert alert-orange">☁️ 憂鬱狀態</div>`;
  }
  if (Game.health < 30) {
    alertHtml += `<div class="status-alert alert-red">🏥 重病警告</div>`;
  }
  if (Game.age >= 18 && Game.jobId === "none") {
    alertHtml += `<div class="status-alert alert-blue">💼 尚未就業</div>`;
  }
  document.getElementById("status-alerts").innerHTML = alertHtml;

  // 更新行動按鈕
  updateActionButtons();
}

function updateActionButtons() {
  const btns = document.getElementById("action-buttons");
  let html = "";
  const age = Game.age;

  if (age <= 2) {
    html = `
            <button onclick="action('cry')">😭 哭鬧<span class="cost-tag">⚡-10</span></button>
            <button onclick="action('sleep')">😴 睡覺<span class="cost-tag">⚡-20</span></button>
            <button onclick="action('play_toy')">🧸 玩玩具<span class="cost-tag">⚡-15</span></button>
            <button onclick="action('act_cute')">🥺 賣萌<span class="cost-tag">⚡-15</span></button>
            <button onclick="action('explore_house')">🏠 探索家裡<span class="cost-tag">⚡-20</span></button>
            <button onclick="action('learn_speak')">🗣️ 牙牙學語<span class="cost-tag">⚡-25</span></button>
        `;
  } else if (age <= 5) {
    html = `
            <button onclick="action('kindergarten')">🏫 上幼兒園<span class="cost-tag">⚡-20</span></button>
            <button onclick="action('play_outside')">🌳 戶外玩耍<span class="cost-tag">⚡-20</span></button>
            <button onclick="action('draw')">🖍️ 畫畫<span class="cost-tag">⚡-15</span></button>
            <button onclick="action('prank')">🤡 惡作劇<span class="cost-tag">⚡-15</span></button>
            <button onclick="action('ask_pocket_money')">💰 要零用錢<span class="cost-tag">⚡-10</span></button>
            <button onclick="action('learn_music')">🎵 學才藝<span class="cost-tag">⚡-25 / $-5k</span></button>
        `;
  } else if (age <= 12) {
    html = `
            <button onclick="action('study_hard')">📚 認真讀書<span class="cost-tag">⚡-30</span></button>
            <button onclick="action('read_comic')">📚 看漫畫<span class="cost-tag">⚡-15</span></button>
            <button onclick="action('sports')">⚽ 運動<span class="cost-tag">⚡-20</span></button>
            <button onclick="action('play_game')">🎮 打電動<span class="cost-tag">⚡-15</span></button>
            <button onclick="action('internet_surf')">🌐 上網<span class="cost-tag">⚡-15</span></button>
            <button onclick="action('cram_school')">📖 補習班<span class="cost-tag">⚡-25 / $-2k</span></button>
        `;
  } else if (age <= 17) {
    html = `
            <button onclick="action('exam_prep')">📝 準備考試<span class="cost-tag">⚡-35</span></button>
            <button onclick="action('club')">🎭 參加社團<span class="cost-tag">⚡-20</span></button>
            <button onclick="action('date_crush')">💕 約會<span class="cost-tag">⚡-30 / $-500</span></button>
            <button onclick="action('skip_class')">🏃 翹課<span class="cost-tag">⚡-10</span></button>
            <button onclick="action('part_time')">💼 打工<span class="cost-tag">⚡-30</span></button>
            <button onclick="action('write_novel')">✍️ 寫小說<span class="cost-tag">⚡-25</span></button>
        `;
  } else {
    html = `
            <button onclick="action('work')">💼 上班<span class="cost-tag">⚡-35</span></button>
            <button onclick="action('side_hustle')">💻 接案副業<span class="cost-tag">⚡-30</span></button>
            <button onclick="action('socialize')">🍻 社交<span class="cost-tag">⚡-20 / $-2k</span></button>
            <button onclick="action('lottery')">🎫 買彩券<span class="cost-tag">⚡-5 / $-500</span></button>
            <button onclick="action('invest')">📈 投資<span class="cost-tag">⚡-20 / $-1w</span></button>
            <button onclick="action('exercise')">💪 健身<span class="cost-tag">⚡-25 / $-1.5k</span></button>
            <button onclick="action('travel')">✈️ 旅遊<span class="cost-tag">⚡-30 / $-2w</span></button>
            <button onclick="action('night_club')">🕺 去夜店<span class="cost-tag">⚡-30 / $-3k</span></button>
        `;
  }

  btns.innerHTML = html;

  // 檢查狀態禁用按鈕
  const allBtns = btns.querySelectorAll("button");
  allBtns.forEach((btn) => {
    if (Game.stamina < 10 || Game.health <= 0) {
      btn.disabled = true;
      btn.style.opacity = 0.5;
    }
  });
}

function getActionName(type) {
  const actionNames = {
    // === 嬰兒期 ===
    cry: "😭 哭鬧",
    sleep: "😴 睡覺",
    play_toy: "🧸 玩玩具",
    learn_speak: "🗣️ 牙牙學語",
    crawl: "🐛 爬行",
    watch_mobile: "👀 看手機",
    explore_house: "🏠 探索家裡", // 新增
    act_cute: "🥺 賣萌", // 新增

    // === 幼兒期 ===
    kindergarten: "🏫 上幼兒園",
    draw: "🖍️ 畫畫",
    watch_tv: "📺 看電視",
    make_friend: "👫 交朋友",
    play_outside: "🌳 戶外玩耍",
    learn_music: "🎵 學才藝",
    ask_pocket_money: "💰 要零用錢", // 新增
    prank: "🤡 惡作劇", // 新增

    // === 兒童期 ===
    study_hard: "📚 認真讀書",
    cram_school: "📖 補習班",
    sports: "⚽ 運動",
    play_game: "🎮 打電動",
    help_parent: "🏠 幫忙家務",
    read_book: "📕 看課外書",
    read_comic: "📚 看漫畫", // 新增
    internet_surf: "🌐 上網", // 新增

    // === 青少年期 ===
    exam_prep: "📝 準備考試",
    club: "🎭 參加社團",
    date_crush: "💕 約會",
    rebel: "😤 叛逆",
    part_time: "💼 打工",
    learn_code: "💻 自學程式",
    skip_class: "🏃 翹課", // 新增
    write_novel: "✍️ 寫小說", // 新增

    // === 成年期 ===
    work: "💼 上班",
    study_skill: "📖 進修技能",
    socialize: "🍻 社交",
    relax: "🎮 放鬆",
    invest: "📈 投資",
    exercise: "💪 健身",
    volunteer: "🤝 志工",
    travel: "✈️ 旅遊",
    lottery: "🎫 買彩券", // 新增
    side_hustle: "💻 接案副業", // 新增
    night_club: "🕺 去夜店", // 新增
  };

  return actionNames[type] || type;
}
// 🎲 隨機整數輔助函式 (包含 min 與 max)
function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// ✅ 修正後的 action 函數 (確保 ID 與 HTML 一致)

function action(type) {
  // 1. 防抖與狀態檢查
  if (isProcessing) return;
  if (Game.stamina <= 0) {
    alert("❌ 體力不足！");
    return;
  }

  isProcessing = true;
  let cost = 20;
  let effects = {};
  let actionName = getActionName(type);
  let crit = false; // 是否觸發暴擊 (大成功)

  // 🎲 暴擊判定：10% 機率觸發「大成功」，效果提升 50%~100%
  if (Math.random() < 0.1) {
    crit = true;
    actionName = "✨ 大成功！" + actionName;
  }

  // 輔助：計算數值 (基礎值 * 學習加成 * 暴擊加成)
  const calc = (baseMin, baseMax, multiplier = 1) => {
    let val = rnd(baseMin, baseMax) * multiplier;
    if (crit) val = Math.floor(val * 1.5);
    return Math.floor(val);
  };

  // 2. 行動邏輯 Switch
  switch (type) {
    // === 0-2 歲 ===
    case "cry":
      cost = 10;
      effects = { happy: rnd(3, 6) };
      break;
    case "sleep":
      cost = 20;
      effects = { health: rnd(2, 5), happy: rnd(2, 4) };
      break;
    case "play_toy":
      cost = 15;
      effects = { happy: rnd(6, 12), intel: rnd(0, 1) };
      break;
    case "act_cute": // 新增：賣萌
      cost = 15;
      effects = {
        happy: rnd(5, 10),
        skills: { charm: calc(2, 4, Game.skillBonus) },
      };
      // 小機率獲得父母零用錢
      if (Math.random() < 0.3) {
        const bonus = rnd(100, 500);
        effects.money = bonus;
        log(`😍 父母被你萌到了，給了零用錢 $${bonus}`);
      }
      break;
    case "explore_house": // 新增：探索
      cost = 20;
      effects = { intel: calc(2, 5, Game.learnBonus) };
      if (Math.random() < 0.2) {
        effects.health = -rnd(1, 5);
        log("🤕 探索時不小心撞到了頭...");
      }
      break;
    case "learn_speak":
      cost = 25;
      effects = {
        intel: calc(2, 4, Game.learnBonus),
        skills: { communication: calc(2, 5, Game.skillBonus) },
      };
      break;

    // === 3-5 歲 ===
    case "kindergarten":
      cost = 20;
      effects = {
        intel: calc(2, 4, Game.learnBonus),
        skills: { communication: calc(2, 4, Game.skillBonus) },
        happy: rnd(2, 6),
      };
      break;
    case "play_outside":
      cost = 20;
      effects = {
        health: rnd(3, 7),
        happy: rnd(5, 12),
        skills: { charm: calc(1, 3, Game.skillBonus) },
      };
      break;
    case "draw":
      cost = 15;
      effects = {
        skills: { art: calc(3, 6, Game.skillBonus) },
        happy: rnd(3, 8),
      };
      break;
    case "prank": // 新增：惡作劇
      cost = 15;
      effects = { happy: rnd(10, 20), skills: { charm: -rnd(1, 3) } }; // 快樂但扣魅力
      if (Math.random() < 0.4) {
        effects.happy = -5;
        log("😡 惡作劇被抓到，被罵了一頓...");
      }
      break;
    case "ask_pocket_money": // 新增：要零用錢
      cost = 10;
      // 看魅力決定成功率
      if (Math.random() * 100 < Game.skills.charm + 20) {
        const money = rnd(500, 2000);
        effects = { money: money, happy: 5 };
        log(`💰 成功要到了零用錢 $${money}！`);
      } else {
        effects = { happy: -5 };
        log("😢 爸媽不給零用錢...");
      }
      break;
    case "learn_music":
      if (Game.money < 5000) {
        isProcessing = false;
        return alert("💸 金錢不足！");
      }
      cost = 25;
      effects = {
        money: -5000,
        skills: { art: calc(5, 9, Game.skillBonus) },
        happy: rnd(2, 6),
      };
      break;

    // === 6-12 歲 ===
    case "study_hard":
      cost = 30;
      effects = { intel: calc(4, 8, Game.learnBonus), happy: -rnd(2, 5) };

      // ✨【關鍵修復】如果有在學，增加學習進度
      if (Game.isStudying) {
        studyProgress();
      }
      break;
    case "read_comic": // 新增：看漫畫
      cost = 15;
      effects = { happy: rnd(8, 15), intel: -rnd(0, 2) }; // 快樂但可能微扣智力
      break;
    case "internet_surf": // 新增：上網
      cost = 15;
      effects = {
        intel: rnd(1, 3),
        happy: rnd(5, 10),
        health: -rnd(1, 3),
      };
      break;
    case "sports":
      cost = 20;
      effects = {
        health: rnd(4, 8),
        happy: rnd(4, 8),
        skills: { charm: calc(1, 3, Game.skillBonus) },
      };
      break;
    case "play_game":
      cost = 15;
      effects = { happy: rnd(10, 18), intel: -rnd(1, 3) };
      break;
    case "help_parent":
      cost = 20;
      effects = {
        happy: rnd(3, 7),
        skills: { communication: calc(2, 5, Game.skillBonus) },
      };
      break;
    case "cram_school":
      if (Game.money < 2000) {
        isProcessing = false;
        return alert("💸 金錢不足！");
      }
      cost = 25;
      effects = {
        intel: calc(7, 12, Game.learnBonus),
        money: -2000,
        happy: -rnd(4, 8),
      };
      break;

    // === 13-17 歲 ===
    case "exam_prep":
      cost = 35;
      effects = {
        intel: calc(8, 15, Game.learnBonus),
        happy: -rnd(5, 12),
      };
      break;
    case "club":
      cost = 20;
      effects = {
        skills: {
          communication: calc(3, 7, Game.skillBonus),
          charm: calc(2, 5, Game.skillBonus),
        },
        happy: rnd(8, 15),
      };
      break;
    case "skip_class": // 新增：翹課
      cost = 10;
      effects = { happy: rnd(15, 25), intel: -rnd(5, 10) };
      if (Math.random() < 0.3) {
        log("📞 學校打電話回家了... 被禁足");
        effects.happy = -20;
      }
      break;
    case "write_novel": // 新增：寫小說
      cost = 25;
      effects = {
        skills: { art: calc(3, 8, Game.skillBonus) },
        intel: calc(2, 5, Game.learnBonus),
      };
      if (Math.random() < 0.1) {
        log("🌟 小說在網路上爆紅！");
        effects.happy = 20;
        effects.skills.charm = 10;
      }
      break;
    case "date_crush":
      if (Game.money < 500) {
        isProcessing = false;
        return alert("💸 金錢不足！");
      }
      cost = 30;
      effects = {
        money: -500,
        happy: rnd(10, 20),
        skills: { charm: calc(4, 8, Game.skillBonus) },
      };
      break;
    case "part_time":
      cost = 30;
      const salary = rnd(10000, 18000); // 隨機薪水
      effects = {
        money: salary,
        happy: -rnd(3, 8),
        skills: { communication: calc(2, 5, Game.skillBonus) },
      };
      break;
    case "learn_code":
      cost = 35;
      effects = {
        intel: calc(4, 8, Game.learnBonus),
        skills: { programming: calc(6, 12, Game.skillBonus) },
        happy: -rnd(3, 6),
      };
      break;

    // === 18歲以上 ===
    // 在 switch (type) 裡面找到這段並替換
    case "work":
      cost = 35;
      const job = JOBS.find((j) => j.id === Game.jobId);
      if (job && job.salary > 0) {
        // ✨【關鍵修復】加入 inflationRate (通膨率) 計算
        // 確保薪水會隨著物價上漲而增加，避免後期餓死
        const inflation = Game.inflationRate || 1;

        const base = Math.floor(
          (job.salary * Game.incomeBonus * inflation) / Game.workPenalty,
        );
        const fluctuation = 1 + (Math.random() * 0.2 - 0.1);
        const finalSal = Math.floor(base * fluctuation);

        effects = {
          money: finalSal,
          happy: -rnd(3, 8),
          health: -rnd(2, 5),
        };
        Game.jobYears++;

        if (job.effect) job.effect(Game);
      } else {
        effects = { happy: -10 };
        log("😟 沒有工作只能待在家...");
      }
      break;
    case "side_hustle": // 新增：接案副業
      cost = 30;
      const hustleMoney = rnd(5000, 50000);
      effects = { money: hustleMoney, health: -rnd(5, 10), happy: -5 };
      break;
    case "lottery": // 新增：買彩券
      if (Game.money < 500) {
        isProcessing = false;
        return alert("💸 金錢不足！");
      }
      cost = 5;
      effects = { money: -500, happy: 2 };
      if (Math.random() < 0.01) {
        // 1% 中大獎
        const jackpot = rnd(100000, 1000000);
        effects.money += jackpot;
        effects.happy = 50;
        log(`🎉 中大獎啦！！獲得 $${jackpot.toLocaleString()}`);
      } else if (Math.random() < 0.1) {
        effects.money += 2000;
        log("🎫 中了小獎 $2,000");
      }
      break;
    case "night_club": // 新增：去夜店
      if (Game.money < 3000) {
        isProcessing = false;
        return alert("💸 金錢不足！");
      }
      cost = 30;
      effects = {
        money: -3000,
        happy: rnd(20, 40),
        skills: { charm: calc(5, 10, Game.skillBonus) },
        health: -rnd(5, 15),
      };
      break;
    case "socialize":
      if (Game.money < 2000) {
        isProcessing = false;
        return alert("💸 金錢不足！");
      }
      cost = 20;
      effects = {
        money: -2000,
        happy: rnd(8, 15),
        skills: {
          communication: calc(4, 9, Game.skillBonus),
          charm: calc(2, 6, Game.skillBonus),
        },
      };
      if (Math.random() < 0.6) addFriend();
      break;
    case "invest":
      if (Game.money < 10000) {
        isProcessing = false;
        return alert("💸 金錢不足！");
      }
      cost = 20;
      // 投資波動變大 (-30% ~ +40%)
      const roi = Math.random() * 0.7 - 0.3;
      const profit = Math.floor(10000 * roi);

      // 商業頭腦特質加成
      if (Game.traits.some((t) => t.id === "businessmind")) {
        if (profit > 0)
          profit *= 1.5; // 賺更多
        else profit *= 0.5; // 賠更少
      }

      effects = {
        money: profit,
        skills: { finance: calc(4, 9, Game.skillBonus) },
        happy: profit > 0 ? rnd(5, 10) : -rnd(10, 20),
      };
      break;
    case "exercise":
      if (Game.money < 1500) {
        isProcessing = false;
        return alert("💸 金錢不足！");
      }
      cost = 25;
      effects = {
        money: -1500,
        health: rnd(5, 10),
        skills: { charm: calc(2, 5, Game.skillBonus) },
        happy: rnd(3, 8),
      };
      break;
    case "travel":
      if (Game.money < 20000) {
        isProcessing = false;
        return alert("💸 金錢不足！");
      }
      cost = 30;
      effects = {
        money: -20000,
        happy: rnd(20, 35),
        intel: rnd(2, 5),
        skills: { communication: calc(2, 6, Game.skillBonus) },
      };
      break;
    default:
      isProcessing = false;
      return alert("❌ 未知操作: " + type);
  }

  // 3. 再次檢查體力 (保險)
  if (Game.stamina < cost) {
    isProcessing = false;
    return alert("❌ 體力不足！");
  }

  Game.stamina -= cost;
  Game.totalActions++;

  // 4. 應用數值效果
  const changes = [];
  Object.keys(effects).forEach((key) => {
    if (key === "skills") {
      Object.keys(effects.skills).forEach((sk) => {
        const val = Math.floor(effects.skills[sk]); // 確保整數
        Game.skills[sk] += val;
        changes.push(`${sk} ${val > 0 ? "+" : ""}${val}`);
      });
    } else {
      const val = Math.floor(effects[key]); // 確保整數
      Game[key] += val;
      changes.push(`${key} ${val > 0 ? "+" : ""}${val}`);
    }
  });

  // 5. 更新畫面與日誌
  updateUI();
  log(actionName, changes);
  if (changes.length > 0 && changes.length <= 4) showChanges(changes); // 變化太多就不彈窗擋畫面了

  setTimeout(() => {
    isProcessing = false;
  }, 300);
}
// 新增函數
function triggerOriginEvent() {
  const originEvents = {
    // === 基礎出身 ===
    common: [
      {
        title: "💸 物價上漲",
        desc: "最近物價飛漲，家裡的開銷變大了。",
        choices: [
          {
            txt: "減少零用錢",
            effect: (g) => {
              g.happy -= 5;
              return "共體時艱";
            },
          },
          {
            txt: "幫忙打工",
            effect: (g) => {
              g.money += 1000;
              g.stamina -= 20;
              return "賺點小錢補貼家用";
            },
          },
        ],
      },
    ],
    rich: [
      {
        title: "🏢 家族企業危機",
        desc: "父親公司遭惡意收購，需要緊急資金援助。",
        choices: [
          {
            txt: "投資500萬救公司",
            effect: (g) => {
              if (g.money >= 5000000) {
                g.money -= 5000000;
                g.money += 12000000;
                return "成功拯救！獲利700萬";
              }
              return "資金不足，眼看公司倒閉";
            },
          },
          {
            txt: "袖手旁觀",
            effect: (g) => {
              g.yearlyMoney = 0;
              g.happy -= 20;
              return "家族企業倒閉，失去被動收入";
            },
          },
        ],
      },
      {
        title: "🏎️ 豪車聚會",
        desc: "富二代朋友們邀請你參加超跑聚會。",
        choices: [
          {
            txt: "參加",
            effect: (g) => {
              g.money -= 50000;
              g.skills.charm += 10;
              return "花錢社交，魅力提升";
            },
          },
          {
            txt: "不去",
            effect: (g) => {
              g.intel += 2;
              return "在家看財報";
            },
          },
        ],
      },
    ],
    genius: [
      {
        title: "🔬 國家級實驗",
        desc: "國家科學院邀請你參與機密實驗。",
        choices: [
          {
            txt: "參加",
            effect: (g) => {
              g.intel += 20;
              g.money += 100000;
              g.health -= 10;
              return "智力大增，但身體疲憊";
            },
          },
          {
            txt: "專注個人研究",
            effect: (g) => {
              g.intel += 5;
              return "穩步前進";
            },
          },
        ],
      },
    ],
    mafia: [
      {
        title: "🗡️ 幫派鬥爭",
        desc: "敵對幫派找上門來尋仇！",
        choices: [
          {
            txt: "正面對決",
            effect: (g) => {
              if (Math.random() > 0.4) {
                g.money += 2000000;
                g.health -= 20;
                g.skills.charm += 20;
                return "大獲全勝！搶地盤賺200萬";
              } else {
                g.health -= 50;
                g.money -= 500000;
                return "重傷住院，損失慘重";
              }
            },
          },
          {
            txt: "談判和解",
            effect: (g) => {
              g.money -= 300000;
              g.skills.communication += 15;
              return "花錢消災，磨練口才";
            },
          },
        ],
      },
      {
        title: "📦 神秘貨物",
        desc: "叔叔讓你幫忙運送一批「海鮮」。",
        effect: (g) => {
          g.money += 100000;
          g.happy -= 5;
          return "賺了10萬跑路費，但心裡毛毛的";
        },
      },
    ],
    politician: [
      {
        title: "🗳️ 選舉醜聞",
        desc: "父親的政敵散布假新聞攻擊家族。",
        choices: [
          {
            txt: "公開澄清",
            effect: (g) => {
              g.skills.communication += 10;
              g.happy -= 10;
              return "努力澄清，身心俱疲";
            },
          },
          {
            txt: "動用網軍",
            effect: (g) => {
              g.money -= 200000;
              g.luckBonus -= 0.1;
              return "雖然壓下新聞，但有損陰德";
            },
          },
        ],
      },
    ],
    hacker: [
      {
        title: "💻 銀行漏洞",
        desc: "你發現了某大銀行的資安漏洞。",
        choices: [
          {
            txt: "通報銀行",
            effect: (g) => {
              g.money += 500000;
              g.happy += 10;
              return "獲得白帽駭客獎金50萬";
            },
          },
          {
            txt: "盜取資金",
            effect: (g) => {
              if (Math.random() > 0.3) {
                g.money += 10000000;
                return "神不知鬼不覺轉走1000萬！";
              } else {
                g.money = 0;
                g.happy -= 50;
                return "被抓包！資產凍結！";
              }
            },
          },
        ],
      },
    ],
    royal: [
      {
        title: "💍 政治聯姻",
        desc: "鄰國皇室提出聯姻請求。",
        choices: [
          {
            txt: "為了國家接受",
            effect: (g) => {
              g.money += 10000000;
              g.happy -= 30;
              return "獲得巨額嫁妝，但失去了自由";
            },
          },
          {
            txt: "追求真愛拒絕",
            effect: (g) => {
              g.happy += 20;
              g.yearlyMoney /= 2;
              return "被削減皇室津貼，但心靈自由";
            },
          },
        ],
      },
    ],
    temple: [
      {
        title: "👻 法會委託",
        desc: "有富商撞邪，請求舉辦法會。",
        choices: [
          {
            txt: "親自主持",
            effect: (g) => {
              g.money += 100000;
              g.stamina -= 30;
              return "富商康復，捐贈10萬香油錢";
            },
          },
          {
            txt: "推薦師父",
            effect: (g) => {
              g.skills.communication += 5;
              return "結個善緣";
            },
          },
        ],
      },
    ],
    farmer: [
      {
        title: "🌾 乾旱危機",
        desc: "今年雨水不足，農作物面臨枯死。",
        choices: [
          {
            txt: "興建灌溉系統",
            effect: (g) => {
              g.money -= 50000;
              g.yearlyMoney += 500;
              return "雖然花錢，但保障了未來收成";
            },
          },
          {
            txt: "祈雨",
            effect: (g) => {
              if (Math.random() > 0.5) {
                g.yearlyMoney += 1000;
                return "奇蹟降雨！大豐收！";
              } else {
                g.money -= 10000;
                return "沒用，損失慘重";
              }
            },
          },
        ],
      },
    ],
    singleparent: [
      {
        title: "🍲 媽媽生病",
        desc: "媽媽過勞生病了，家裡頓時失去依靠。",
        choices: [
          {
            txt: "請假照顧",
            effect: (g) => {
              g.money -= 5000;
              g.happy += 10;
              return "媽媽康復了，感情更深厚";
            },
          },
          {
            txt: "努力賺錢請看護",
            effect: (g) => {
              g.money -= 20000;
              g.happy -= 10;
              return "經濟壓力好大";
            },
          },
        ],
      },
    ],
    tech: [
      {
        title: "🤖 AI 覺醒",
        desc: "你寫的 AI 程式似乎產生了自我意識。",
        choices: [
          {
            txt: "發布論文",
            effect: (g) => {
              g.intel += 20;
              g.skills.programming += 20;
              return "震驚學術界！";
            },
          },
          {
            txt: "賣給科技巨頭",
            effect: (g) => {
              g.money += 2000000;
              return "獲得專利買斷費200萬";
            },
          },
        ],
      },
    ],
    star: [
      {
        title: "📸 狗仔隊",
        desc: "你和朋友吃飯被狗仔隊偷拍亂寫。",
        choices: [
          {
            txt: "發文反擊",
            effect: (g) => {
              g.skills.charm -= 5;
              return "引發網戰，形象受損";
            },
          },
          {
            txt: "冷處理",
            effect: (g) => {
              g.happy -= 5;
              return "忍一時風平浪靜";
            },
          },
        ],
      },
    ],
    monk: [
      {
        title: "🧘 閉關修行",
        desc: "師父問你要不要進行七日斷食閉關。",
        choices: [
          {
            txt: "參加",
            effect: (g) => {
              g.health += 20;
              g.intel += 10;
              g.happy += 20;
              return "身心靈淨化，境界提升";
            },
          },
          {
            txt: "婉拒",
            effect: (g) => {
              return "還是正常作息就好";
            },
          },
        ],
      },
    ],
    spy: [
      {
        title: "🕵️ 雙面間諜",
        desc: "敵國情報員試圖吸收你。",
        choices: [
          {
            txt: "假意投誠",
            effect: (g) => {
              g.money += 1000000;
              g.health -= 20;
              return "獲得敵方經費100萬，但每天提心吊膽";
            },
          },
          {
            txt: "舉報",
            effect: (g) => {
              g.money += 200000;
              return "獲得國家獎金20萬";
            },
          },
        ],
      },
    ],
  };

  // 預設事件 (避免該出身沒有事件時報錯)
  const defaultEvents = [
    {
      title: "🌟 命運的轉折",
      desc: "你感覺今天會有好事發生。",
      effect: (g) => {
        g.happy += 5;
        return "心情不錯";
      },
    },
  ];

  const originId = Game.originId;
  const events = originEvents[originId] || defaultEvents;

  // 20% 機率觸發出身事件
  if (Math.random() < 0.2) {
    const event = events[Math.floor(Math.random() * events.length)];

    if (event.choices) {
      showOriginEventModal(event);
    } else if (event.effect) {
      const result = event.effect(Game);
      log(`🎭 【${Game.origin}專屬】${event.title}：${result}`);
      Game.totalEvents++;
    }
  }
}
function showEventModal(event) {
  const modal = document.getElementById("event-modal");
  document.getElementById("ev-title").textContent = event.title;
  document.getElementById("ev-desc").textContent = event.desc;

  const btnA = document.getElementById("btn-choice-a");
  const btnB = document.getElementById("btn-choice-b");

  // 設定選項 A
  if (event.choices && event.choices[0]) {
    btnA.textContent = event.choices[0].text || event.choices[0].txt;
    btnA.style.display = "block";
    btnA.onclick = () => {
      const result = event.choices[0].effect(Game);
      log(
        `👉 選擇：${event.choices[0].text || event.choices[0].txt} → ${result}`,
      );
      closeModal();
      updateUI();
    };
  } else {
    btnA.style.display = "none";
  }

  // 設定選項 B
  if (event.choices && event.choices[1]) {
    btnB.textContent = event.choices[1].text || event.choices[1].txt;
    btnB.style.display = "block";
    btnB.onclick = () => {
      const result = event.choices[1].effect(Game);
      log(
        `👉 選擇：${event.choices[1].text || event.choices[1].txt} → ${result}`,
      );
      closeModal();
      updateUI();
    };
  } else {
    btnB.style.display = "none";
  }

  modal.style.display = "flex";
}
// ==========================================
// 🔴 隨機事件系統
// ==========================================

// 修改 game.js 裡的 triggerRandomEvent
function checkPromotion() {
        // ✅ 修正：game -> Game
        if (!Game.job || Game.job === "無業" || Game.promotionChecked) return;

        const promotion = JOB_PROMOTIONS[Game.job];
        if (!promotion) return;

        const req = promotion.requirement;
        let canPromote = true;

        if (req.age && Game.age < req.age) canPromote = false;
        if (req.intel && Game.intel < req.intel) canPromote = false;
        if (req.communication && Game.skills.communication < req.communication)
          canPromote = false;
        if (req.leadership && Game.skills.leadership < req.leadership)
          canPromote = false;
        if (req.workYears && Game.workYears < req.workYears) canPromote = false;

        if (canPromote) {
          showModal(
            "🎉 晉升機會",
            `恭喜！你可以從「${Game.job}」晉升為「${promotion.next}」\n薪水將增加 $${promotion.salaryIncrease.toLocaleString()}/年`,
            "接受晉升",
            "暫不晉升",
            () => {
              const currentJob = JOBS.find((j) => j.name === Game.job);
              Game.job = promotion.next;
              if (currentJob) {
                currentJob.salary += promotion.salaryIncrease;
              }
              log(`✨ 你晉升為 ${promotion.next}！`);
              Game.promotionChecked = true;
              updateUI();
            },
            () => {
              log(`你選擇暫不晉升`);
              Game.promotionChecked = true;
            },
          );
        }
      }
      // ==========================================
      // 🆕 新增：子女養育系統 (已修正變數名稱 Game)
      // ==========================================
function createChild(name, age = 0) {
        return {
          name: name,
          age: age,
          health: 100,
          intel: 50 + Math.floor(Game.intel * 0.3), // ✅ 修正：game -> Game
          personality: ["乖巧", "叛逆", "聰明", "運動", "文靜"][
            Math.floor(Math.random() * 5)
          ],
          education: "學齡前",
          relationship: 80,
          expenses: 20000,
        };
      }

 function tryHaveBaby() {
        if (!Game.partner) {
          // ✅ 修正：game -> Game
          showPopup("❌ 需要先有伴侶", "red");
          return;
        }

        if (Game.age < 20 || Game.age > 45) {
          showPopup("❌ 年齡不適合生育 (20-45歲)", "red");
          return;
        }

        if (Game.money < 100000) {
          showPopup("❌ 存款不足 $100,000", "red");
          return;
        }

        showModal(
          "👶 考慮生育",
          `生育需要：\n• 初期費用 $100,000\n• 每年養育費 $20,000+\n• 大量時間與精力\n\n是否準備好迎接新生命？`,
          "🍼 準備好了",
          "❌ 暫不考慮",
          () => {
            Game.money -= 100000;
            const babyName = prompt("請為寶寶取名：", "小寶") || "小寶";
            const baby = createChild(babyName, 0);
            Game.children.push(baby); // ✅ 修正：game -> Game
            log(`🎉 恭喜！你的孩子 ${babyName} 出生了！`);
            Game.happy += 30;
            updateUI();
            renderChildrenList();
          },
        );
      }

function updateChildren() {
        Game.children.forEach((child) => {
          // ✅ 修正：game -> Game
          child.age++;

          if (child.age === 6) child.education = "小學";
          if (child.age === 12) child.education = "國中";
          if (child.age === 15) child.education = "高中";
          if (child.age === 18) {
            showModal(
              "🎓 子女升學",
              `${child.name} 高中畢業了！選擇未來方向：`,
              "💰 直接工作",
              "📚 上大學 ($200k)",
              () => {
                child.education = "就業";
                log(`${child.name} 開始工作了！`);
              },
              () => {
                if (Game.money >= 200000) {
                  Game.money -= 200000;
                  child.education = "大學";
                  child.intel += 30;
                  log(`${child.name} 進入大學就讀！`);
                } else {
                  showPopup("❌ 學費不足", "red");
                }
              },
            );
          }

          let cost = child.expenses;
          if (child.education === "大學") cost += 50000;
          Game.money -= cost;

          if (child.education !== "就業") {
            child.intel += Math.floor(Math.random() * 3 + 1);
          }
        });
      }

function interactWithChild(childIndex) {
        const child = Game.children[childIndex]; // ✅ 修正：game -> Game
        if (!child) return;

        showModal(
          `💕 與 ${child.name} 互動`,
          `年齡：${child.age}歲 | 個性：${child.personality}\n教育：${child.education} | 智力：${child.intel}\n關係：${child.relationship}/100`,
          "🎮 陪伴玩耍 (-20體力)",
          "📖 輔導功課 (-30體力)",
          () => {
            if (Game.stamina >= 20) {
              Game.stamina -= 20;
              child.relationship = Math.min(100, child.relationship + 5);
              Game.happy += 10;
              log(`陪 ${child.name} 玩耍，關係更親密了！`);
              updateUI();
            } else {
              showPopup("❌ 體力不足", "red");
            }
          },
          () => {
            if (Game.stamina >= 30 && Game.intel >= 80) {
              Game.stamina -= 30;
              child.intel += 3;
              child.relationship = Math.min(100, child.relationship + 3);
              log(`輔導 ${child.name} 功課，智力提升了！`);
              updateUI();
            } else {
              showPopup("❌ 需要體力30和智力80", "red");
            }
          },
        );
      }

function renderChildrenList() {
        const container = document.getElementById("children-list");
        if (!container) return;

        if (Game.children.length === 0) {
          // ✅ 修正：game -> Game
          container.innerHTML =
            '<div style="color: var(--text-dim); text-align: center; padding: 10px;">尚無子女</div>';
          return;
        }

        container.innerHTML = Game.children
          .map(
            (child, index) => `
    <div class="job-card" onclick="interactWithChild(${index})" style="cursor: pointer;">
      <div class="job-name">${child.name} (${child.age}歲)</div>
      <div style="font-size: 0.85em; color: var(--text-dim); margin-top: 5px;">
        ${child.personality} | ${child.education} | 智力 ${child.intel}
      </div>
      <div style="font-size: 0.8em; color: var(--green); margin-top: 3px;">
        關係：${"❤️".repeat(Math.floor(child.relationship / 20))} ${child.relationship}/100
      </div>
      <div style="font-size: 0.75em; color: var(--orange); margin-top: 2px;">
        年度花費：$${child.education === "大學" ? (child.expenses + 50000).toLocaleString() : child.expenses.toLocaleString()}
      </div>
    </div>
  `,
          )
          .join("");
      }
      // ==========================================
      // 🆕 新增：通膨與房貸系統 (已修正變數名稱 Game)
      // ==========================================
function updateInflation() {
  Game.yearsPassed++; 
  if (Game.yearsPassed % 5 === 0) {
    // 產生 0.0 ~ 3.0 之間的隨機數字 (例如 1.5, 2.7)
    const percent = Math.random() * 3;
    
    // 計算倍率 (例如 1.5% -> 0.015 -> 1.015)
    const multiplier = 1 + (percent / 100);
    
    Game.inflationRate *= multiplier;
    
    // 顯示時取小數點後 1 位，看起來比較整潔
    log(`💸 物價上漲了 ${percent.toFixed(1)}%`);
  }
}

function getInflatedPrice(basePrice) {
        return Math.floor(basePrice * Game.inflationRate); // ✅ 修正：game -> Game
      }

function payMortgage() {
        if (Game.mortgage.active) {
          // ✅ 修正：game -> Game
          if (Game.money >= Game.mortgage.monthlyPayment) {
            Game.money -= Game.mortgage.monthlyPayment;
            Game.mortgage.remaining -= Game.mortgage.monthlyPayment;
            Game.mortgage.years--;

            if (Game.mortgage.remaining <= 0 || Game.mortgage.years <= 0) {
              log(`🎉 房貸繳清了！`);
              Game.mortgage.active = false;
            } else {
              log(
                `繳房貸 $${Game.mortgage.monthlyPayment.toLocaleString()}，剩 ${Game.mortgage.years} 年`,
              );
            }
          } else {
            log(`⚠️ 無法繳納房貸！健康與快樂下降`);
            Game.health -= 10;
            Game.happy -= 15;
          }
        }
      }

function buyHouseWithMortgage(house) {
        const realPrice = getInflatedPrice(house.price);
        const downPayment = Math.floor(realPrice * 0.3);
        const loanAmount = realPrice - downPayment;

        showModal(
          "🏠 購屋方案",
          `${house.name}\n房價：$${realPrice.toLocaleString()}\n頭期款(30%)：$${downPayment.toLocaleString()}\n貸款金額：$${loanAmount.toLocaleString()}\n貸款年限：20年\n年繳金額：$${Math.floor(loanAmount / 20).toLocaleString()}`,
          "💰 全額付清",
          "🏦 申請貸款",
          () => {
            if (Game.money >= realPrice) {
              Game.money -= realPrice;
              // 🔴 修正：items -> inventory
              Game.inventory.push(house.name);
              if (house.happyBonus) Game.happy += house.happyBonus;
              log(`全額購買了 ${house.name}！`);
              updateUI();
              renderShop();
            } else {
              showPopup("❌ 金錢不足", "red");
            }
          },
          () => {
            if (Game.money >= downPayment) {
              if (Game.mortgage.active) {
                showPopup("❌ 已有貸款進行中", "red");
                return;
              }
              Game.money -= downPayment;
              Game.mortgage = {
                active: true,
                totalAmount: loanAmount,
                remaining: loanAmount,
                monthlyPayment: Math.floor(loanAmount / 20),
                years: 20,
                itemName: house.name,
              };
              // 🔴 修正：items -> inventory
              Game.inventory.push(house.name);
              if (house.happyBonus) Game.happy += house.happyBonus;
              log(
                `貸款購買了 ${house.name}！每年繳納 $${Game.mortgage.monthlyPayment.toLocaleString()}`,
              );
              updateUI();
              renderShop();
            } else {
              showPopup("❌ 頭期款不足", "red");
            }
          },
        );
      }

function nextYear() {
        // ===== 1. 防止重複執行 =====
        if (isProcessing) {
          console.log("⚠️ 正在處理中...");
          return;
        }
        isProcessing = true;

        try {
          // ===== 2. 優先檢查負債（最高優先級，在健康檢查之前）=====
          if (Game.money < 0) {
            if (typeof Game.debtYears === "undefined") Game.debtYears = 0;
            Game.debtYears++;
            Game.hasBeenInDebt = true;

            // ✅ 負債滿3年立即結束遊戲
            if (Game.debtYears >= 3) {
              log("💀 負債已達3年，遊戲結束！");
              isProcessing = false;
              showEnding();
              return;
            }

            // 未滿3年才扣屬性並顯示警告
            Game.happy -= 20;
            Game.health -= 5;
            log(`⚠️ 你已負債第 ${Game.debtYears} 年！(-20快樂, -5健康)`);
            if (typeof showChanges === "function") {
              showChanges(["-20 😊 快樂", "-5 ❤️ 健康"]);
            }
          } else if (Game.debtYears > 0) {
            // 如果還清債務，重置負債年數
            log("✅ 債務已清償！");
            Game.debtYears = 0;
          }

          // ===== 3. 健康檢查（放在負債檢查之後）=====
          if (Game.health <= 0) {
            isProcessing = false;
            showEnding();
            return;
          }

          // 保存舊的人生階段
          const oldStage =
            LIFE_STAGES.find((s) => Game.age >= s.min && Game.age <= s.max) ||
            LIFE_STAGES[LIFE_STAGES.length - 1];

          // ===== 4. 過年：增加年齡、重置體力、增加工齡 =====
          Game.age++;
          Game.stamina = 100;
          Game.workYears++;
          Game.promotionChecked = false;

          // 初始化年份計數器
          if (!Game.yearsPassed) Game.yearsPassed = 0;

          // 通膨系統
          updateInflation();

          // 房貸扣款
          if (Game.mortgage && Game.mortgage.active) {
            payMortgage();
          }

          // 子女成長
          if (Game.children) {
            updateChildren();
          }

          // 升遷檢查
          checkPromotion();

          // ===== 5. 每5年自動存檔 =====
          if (Game.age % 5 === 0) {
            saveGame();
          }

          // ===== 6. 生活費扣除 =====
          let livingCost = 0;
          if (Game.age < 18) {
            livingCost = 0; // 未成年無生活費
          } else if (Game.age >= 18 && Game.age < 25) {
            livingCost = 15000;
          } else if (Game.age >= 25 && Game.age < 40) {
            livingCost = 30000;
          } else if (Game.age >= 40 && Game.age < 60) {
            livingCost = 50000;
          } else if (Game.age >= 60) {
            livingCost = 70000;
          }

          // 擁有房子減免40%生活費
          const inventory = Game.inventory;
          const hasHouse = inventory.some((i) => i.startsWith("house"));
          const hasCar = inventory.some((i) => i.startsWith("car"));

          if (hasHouse) {
            livingCost = Math.floor(livingCost * 0.6);
          }

          // 擁有車子增加保養費
          if (hasCar) {
            livingCost += 12000;
          }

          // 計算通膨影響
          livingCost = Math.floor(livingCost * (Game.inflationRate || 1));

          if (livingCost > 0) {
            Game.money -= livingCost;
            log(`💰 生活費支出：-${livingCost.toLocaleString()}`);
          }

          // ===== 7. 隨機緊急事件 (15%機率) =====
          if (Math.random() < 0.15) {
            const emergencies = [
              { name: "🚗 車子維修", cost: 8000 },
              { name: "📱 手機壞掉", cost: 15000 },
              { name: "🦷 看牙醫", cost: 12000 },
              { name: "🏥 突發疾病", cost: 20000 },
              { name: "🔧 家電故障", cost: 30000 },
            ];
            const emergency =
              emergencies[Math.floor(Math.random() * emergencies.length)];
            const realCost = Math.floor(
              emergency.cost * (Game.inflationRate || 1),
            );
            Game.money -= realCost;
            Game.happy -= 5;
            log(`${emergency.name}，支出 ${realCost.toLocaleString()} 元`);
          }

          // NPC 生命週期更新
          if (Game.relationships) {
            updateNPCLifecycle();
          }

          // ===== 8. 年度收入 =====
          const yearChanges = [];

          // 家庭年度收入
          if (Game.yearlyMoney > 0) {
            Game.money += Game.yearlyMoney;
            yearChanges.push(
              `+${Game.yearlyMoney.toLocaleString()} 💰 家庭收入`,
            );
          }

          // 房產被動收入
          inventory.forEach((item) => {
            if (typeof HOUSES !== "undefined") {
              const house = HOUSES.find((h) => h.id === item);
              if (house && house.passive) {
                const rent = Math.floor(
                  house.passive * (Game.inflationRate || 1),
                );
                Game.money += rent;
                yearChanges.push(
                  `+${rent.toLocaleString()} 🏠 ${house.name}租金收入`,
                );
              }
            }
          });

          // ===== 9. 年度屬性衰減 =====
          let baseHealthLoss = 5;
          if (Game.age < 40) {
            baseHealthLoss = 2;
          } else if (Game.age >= 60) {
            baseHealthLoss = 3;
          } else if (Game.age >= 80) {
            baseHealthLoss = 5;
          }

          let actualHealthLoss = Math.floor(
            baseHealthLoss * (Game.healthDecay || 1),
          );
          Game.health -= actualHealthLoss;
          Game.happy -= Math.floor(3 * (Game.happyDecay || 1));

          // 快樂值過高計數
          if (Game.happy > 80) {
            Game.happyYears++;
          }

          // 顯示年度總結
          if (yearChanges.length > 0) {
            log(`🎂 ${Game.age} 歲：${yearChanges.join("、")}`);
          }

          // ===== 10. 人生階段檢查 =====
          const newStage =
            LIFE_STAGES.find((s) => Game.age >= s.min && Game.age <= s.max) ||
            LIFE_STAGES[LIFE_STAGES.length - 1];

          if (oldStage && newStage && oldStage.name !== newStage.name) {
            log(`${newStage.icon} 進入${newStage.name}階段！`);
            if (typeof showPopup === "function") {
              showPopup(`${newStage.icon} 進入${newStage.name}`, "blue");
            }
          }

          // ===== 11. 更新UI、檢查成就 =====
          checkAchievements();
          updateUI();

          if (typeof renderChildrenList === "function") {
            renderChildrenList();
          }
        } catch (error) {
          console.error("❌ 遊戲發生錯誤:", error);
          alert("❌ 遊戲發生錯誤，請按F12查看控制台");
        } finally {
          // 延遲重置鎖，避免連點
          setTimeout(() => {
            isProcessing = false;
          }, 300);
        }
      }
function triggerRandomEvent() {
  const availableEvents = RANDOM_EVENTS.filter((event) => {
    if (event.condition) {
      return event.condition();
    }
    return true;
  });

  if (availableEvents.length === 0) return;

  // 隨機選擇
  const event =
    availableEvents[Math.floor(Math.random() * availableEvents.length)];

  if (event.choices) {
    showEventModal(event);
  } else if (event.effect) {
    const result = event.effect(Game);
    log(`${event.title}：${event.desc} - ${result}`);
  }

  Game.totalEvents++;
  updateUI();
}

function showEnding() {
  // ===== 1. 安全讀取變數，防止 undefined 錯誤 =====
  const money = Game.money || 0;
  const age = Game.age || 0;
  const happy = Game.happy || 0;
  const skills = Game.skills || {};
  const jobId = Game.jobId || "none";
  const originId = Game.originId || "common";

  // ✅ 關鍵修復：正確讀取 debtYears
  const debtYears = Game.debtYears || 0;

  let endingType = "";
  let endingIcon = "";
  let endingDesc = "";
  let specialEnding = false;

  // ===== 2. 【最高優先級】破產結局檢查 =====
  if (debtYears >= 3) {
    endingType = "💸 破產結局";
    endingIcon = "💸";
    endingDesc = `你已經連續負債 ${debtYears} 年，最終因無力償還債務而宣告破產。債權人收走了你所有的財產，你的信用破產，人生從此陷入困境。或許從頭開始，會是更好的選擇...`;
    specialEnding = true;
  }
  // ===== 3. 健康歸零結局檢查 =====
  else if (Game.health <= 0) {
    if (age < 30) {
      endingType = "💔 英年早逝";
      endingIcon = "💔";
      endingDesc =
        "由於過度勞累和不健康的生活方式，你在年輕時就離開了人世。生命短暫，健康才是最重要的財富。";
    } else if (age >= 60) {
      endingType = "🌅 壽終正寢";
      endingIcon = "🌅";
      endingDesc =
        "你走完了自己的人生旅程，在家人的陪伴下安詳離世。雖然有遺憾，但也算是圓滿的一生。";
    } else {
      endingType = "⚰️ 中年病逝";
      endingIcon = "⚰️";
      endingDesc =
        "長期的健康問題最終奪走了你的生命。如果當初更注重身體健康，或許會有不同的結局。";
    }
    specialEnding = true;
  }

  // ===== 4. 特殊出身結局（只在非破產、非死亡時檢查）=====
  if (!specialEnding) {
    switch (originId) {
      case "royal":
        if (money >= 100000000 && happy >= 80) {
          endingType = "👑 皇室傳奇";
          endingIcon = "👑";
          endingDesc =
            "你成功治理王國，讓人民富足安樂。歷史將銘記你作為一位明君的偉大功績。";
          specialEnding = true;
        }
        break;
      case "mafia":
        if (money >= 50000000 && (skills.charm || 0) >= 100) {
          endingType = "🎩 黑道教父";
          endingIcon = "🎩";
          endingDesc =
            "你成為了地下世界的傳奇人物，權力和財富都達到了巔峰。雖然手段不光彩，但你確實站上了頂點。";
          specialEnding = true;
        }
        break;
      case "hacker":
        if ((skills.programming || 0) >= 150) {
          endingType = "💻 駭客傳說";
          endingIcon = "💻";
          endingDesc =
            "你成為了網路世界的傳奇駭客，技術無人能及。你的代碼改變了世界，名字永遠刻在網路歷史中。";
          specialEnding = true;
        }
        break;
      case "monk":
        if (happy >= 95 && age >= 80) {
          endingType = "🙏 得道高僧";
          endingIcon = "🙏";
          endingDesc =
            "你修行一生，最終參透了生命的真諦。在寺廟中圓寂，留下了無數智慧的教誨。";
          specialEnding = true;
        }
        break;
      case "star":
        if ((skills.charm || 0) >= 150) {
          endingType = "⭐ 巨星殞落";
          endingIcon = "⭐";
          endingDesc =
            "你成為了娛樂圈的超級巨星，粉絲遍布全球。你的作品將永遠流傳下去。";
          specialEnding = true;
        }
        break;
      case "politician":
        if ((skills.communication || 0) >= 150) {
          endingType = "🏛️ 政壇傳奇";
          endingIcon = "🏛️";
          endingDesc =
            "你成為了極具影響力的政治家，推動了許多重要的改革，人民將永遠記得你的貢獻。";
          specialEnding = true;
        }
        break;
      case "scientistfamily":
      case "genius":
        if ((Game.intel || 0) >= 180) {
          endingType = "🧠 科學巨擘";
          endingIcon = "🧠";
          endingDesc =
            "你的研究成果改變了世界，獲得了諾貝爾獎。你的名字將永遠留在科學史冊上。";
          specialEnding = true;
        }
        break;
    }
  }

  // ===== 5. 一般結局（如果沒有觸發特殊結局）=====
  if (!specialEnding) {
    if (money >= 100000000) {
      endingType = "💰 億萬富翁";
      endingIcon = "💰";
      endingDesc =
        "你累積了驚人的財富，成為了億萬富翁。金錢雖不是一切，但你確實達到了財務自由。";
    } else if (money >= 10000000) {
      endingType = "🏆 成功人士";
      endingIcon = "🏆";
      endingDesc =
        "你過上了富足的生活，擁有令人羨慕的成就。這是一個相當成功的人生。";
    } else if (age >= 100) {
      endingType = "🎂 長壽之星";
      endingIcon = "🎂";
      endingDesc =
        "你活過了一百歲！雖然財富不多，但能活這麼久本身就是一種成就。";
    } else if (happy <= 20) {
      endingType = "😢 憂鬱人生";
      endingIcon = "😢";
      endingDesc =
        "你的人生充滿了不快樂，最終在憂鬱中結束。或許下一次，你能找到更多快樂。";
    } else if (age < 30) {
      endingType = "🌱 未完的人生";
      endingIcon = "🌱";
      endingDesc =
        "你的人生還未真正展開就結束了。太多的可能性還未實現，實在令人惋惜。";
    } else if (jobId === "none" && age >= 50) {
      endingType = "🎮 啃老人生";
      endingIcon = "🎮";
      endingDesc =
        "你一輩子沒有工作過，靠著家人的資助勉強度日。人生就這樣平淡地結束了。";
    } else {
      endingType = "📖 平凡人生";
      endingIcon = "📖";
      endingDesc = "你過完了平凡的一生。雖然沒有轟轟烈烈，但也算是安穩度過。";
    }
  }

  // ===== 6. 渲染結局畫面 =====
  const iconEl = document.getElementById("ending-icon");
  const titleEl = document.getElementById("ending-title");
  const descEl = document.getElementById("ending-desc");
  const statsEl = document.getElementById("ending-stats");
  const overlayEl = document.getElementById("ending-overlay");

  if (iconEl) iconEl.textContent = endingIcon;
  if (titleEl) titleEl.textContent = endingType;
  if (descEl) descEl.textContent = endingDesc;

  // 準備統計數據（額外安全檢查）
  const partnerName =
    Game.partner && Game.partner.name ? Game.partner.name : "無";
  const childCount =
    Game.children && Game.children.length ? Game.children.length : 0;
  const achCount =
    Game.unlockedAchievements && Game.unlockedAchievements.length
      ? Game.unlockedAchievements.length
      : 0;

  const finalStatsHtml = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: left;">
      <div>👤 姓名</div><div>${Game.name || "???"}</div>
      <div>🎂 享年</div><div>${age}歲</div>
      <div>💰 最終資產</div><div>${money.toLocaleString()}</div>
      <div>🧠 智力</div><div>${Math.floor(Game.intel || 0)}</div>
      <div>😊 快樂</div><div>${Math.floor(happy)}</div>
      <div>🏠 出身</div><div>${Game.origin || "???"}</div>
      <div>🏆 成就數</div><div>${achCount}</div>
      <div>💑 伴侶</div><div>${partnerName}</div>
      <div>👶 子女</div><div>${childCount}人</div>
    </div>
  `;

  if (statsEl) statsEl.innerHTML = finalStatsHtml;

  // ===== 7. 強制顯示結局畫面 =====
  if (overlayEl) {
    overlayEl.style.display = "flex";
  }
}
// ===== 👥 NPC 系統函數 =====
function generateNPC(type) {
  const templates = NPC_TEMPLATES[type];
  if (!templates || templates.length === 0) return null;

  const template = templates[Math.floor(Math.random() * templates.length)];
  const npc = {
    id: `npc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: template.name,
    type: type,
    personality: template.personality,
    relation: template.baseRelation,
    gender: template.gender || (Math.random() > 0.5 ? "male" : "female"),
    age: Game.age + (Math.floor(Math.random() * 6) - 3), // 年齡差距 -3 到 +3
    metAt: Game.age,
    lastInteraction: Game.age,
  };

  return npc;
}

function addNPC(type) {
  const npc = generateNPC(type);
  if (!npc) return null;

  Game.npcs.push(npc);
  Game.metNPCs.push(npc.id);

  log(`👤 認識了新朋友：${npc.name}`);
  return npc;
}

function getNPCsByType(type) {
  return Game.npcs.filter((npc) => npc.type === type);
}

function interactWithNPC(npcId, interactionType) {
  const npc = Game.npcs.find((n) => n.id === npcId);
  if (!npc) return;

  const interaction = NPC_INTERACTIONS[interactionType];
  if (!interaction) return;

  // 檢查關係需求
  if (
    interaction.requireRelation &&
    npc.relation < interaction.requireRelation
  ) {
    alert(`❌ 關係不夠好，需要好感度 ${interaction.requireRelation} 以上`);
    return;
  }

  // 檢查體力
  if (Game.stamina < interaction.cost) {
    alert("⚡ 體力不足！");
    return;
  }

  // 檢查金錢
  if (
    interaction.moneyChange < 0 &&
    Game.money < Math.abs(interaction.moneyChange)
  ) {
    alert("💸 金錢不足！");
    return;
  }

  // 執行互動
  Game.stamina -= interaction.cost;
  Game.money += interaction.moneyChange;

  // ===== ✅ 計算特質對關係的影響 =====
  let relationChange = interaction.relationChange;
  let bonusMessages = [];

  // 特質加成1：外向特質（聊天 +5）
  if (
    Game.traits.some((t) => t.id === "extrovert") &&
    interactionType === "chat"
  ) {
    relationChange += 5;
    bonusMessages.push("🎉 外向特質：聊天效果 +5");
  }

  // 特質加成2：魅力特質（所有互動 +3）
  if (Game.traits.some((t) => t.id === "charismatic")) {
    relationChange += 3;
    bonusMessages.push("✨ 魅力特質：好感度 +3");
  }

  // 特質加成3：社交大師（所有效果 x1.5）
  if (Game.traits.some((t) => t.id === "socialmaster")) {
    relationChange = Math.floor(relationChange * 1.5);
    bonusMessages.push("👑 社交大師：效果 +50%");
  }

  // 特質減益1：內向特質（聊天 -2）
  if (
    Game.traits.some((t) => t.id === "introvert") &&
    interactionType === "chat"
  ) {
    relationChange -= 2;
    bonusMessages.push("😅 內向特質：聊天效果 -2");
  }

  // 特質加成4：樂觀特質（所有互動 +2）
  if (Game.traits.some((t) => t.id === "optimistic")) {
    relationChange += 2;
    bonusMessages.push("🌟 樂觀特質：正能量 +2");
  }

  // 特質減益2：悲觀特質（所有互動 -2）
  if (Game.traits.some((t) => t.id === "pessimistic")) {
    relationChange -= 2;
    bonusMessages.push("😔 悲觀特質：負能量 -2");
  }

  // 特質加成5：勇敢特質（約會 +5）
  if (Game.traits.some((t) => t.id === "brave") && interactionType === "date") {
    relationChange += 5;
    bonusMessages.push("💪 勇敢特質：約會更大膽 +5");
  }

  npc.relation = Math.max(0, Math.min(100, npc.relation + relationChange));
  npc.lastInteraction = Game.age;

  // 根據 NPC 性格調整關係變化
  let personalityBonus = 0;
  if (npc.personality === "friendly" && interactionType === "chat")
    personalityBonus = 3;
  if (npc.personality === "kind" && interactionType === "help")
    personalityBonus = 5;
  if (npc.personality === "outgoing" && interactionType === "chat")
    personalityBonus = 2;
  if (npc.personality === "gentle" && interactionType === "date")
    personalityBonus = 4;

  npc.relation += personalityBonus;
  npc.relation = Math.max(0, Math.min(100, npc.relation));

  // ===== ✅ 顯示訊息 =====
  const changes = [];
  if (interaction.moneyChange !== 0) {
    changes.push(
      `💰 ${interaction.moneyChange > 0 ? "+" : ""}$${Math.abs(interaction.moneyChange).toLocaleString()}`,
    );
  }
  changes.push(
    `💗 好感度 ${relationChange + personalityBonus > 0 ? "+" : ""}${relationChange + personalityBonus}`,
  );

  let logMessage = `與 ${npc.name} ${interaction.desc}`;
  if (bonusMessages.length > 0) {
    logMessage += "\n" + bonusMessages.join("\n");
  }

  log(logMessage, changes);

  // 檢查關係里程碑
  if (npc.relation >= 80 && npc.type === "romantic") {
    if (Math.random() > 0.7) {
      showConfessionEvent(npc);
    }
  }

  updateUI();
  renderSocial();
}

function showConfessionEvent(npc) {
  showModal("💕 心動時刻", `${npc.name} 似乎對你有好感...\n要向對方告白嗎？`, [
    {
      text: "❤️ 告白",
      action: () => {
        if (npc.relation >= 80) {
          npc.type = "lover";
          npc.relation = 85;
          log(`💕 ${npc.name} 接受了你的告白！`);
          showModal("💕 戀愛開始", `恭喜！你和 ${npc.name} 開始交往了！`, [
            { text: "太好了！", action: () => closeModal() },
          ]);
        } else {
          npc.relation -= 10;
          log(`😢 ${npc.name} 拒絕了你...`);
          alert("😢 對方拒絕了...");
        }
        closeModal();
        updateUI();
        renderSocial();
      },
    },
    {
      text: "不要",
      action: () => closeModal(),
    },
  ]);
}

function proposeMarriage(npcId) {
  const npc = Game.npcs.find((n) => n.id === npcId);
  if (!npc || npc.type !== "lover") {
    alert("❌ 只能向戀人求婚！");
    return;
  }

  if (npc.relation < 90) {
    alert("❌ 感情還不夠深厚（需要好感度 90+）");
    return;
  }

  if (Game.money < 100000) {
    alert("💸 結婚需要至少 $100,000 準備婚禮");
    return;
  }

  showModal("💍 求婚", `向 ${npc.name} 求婚？\n婚禮費用：$100,000`, [
    {
      text: "💍 求婚",
      action: () => {
        Game.money -= 100000;
        npc.type = "spouse";
        npc.relation = 95;

        // 移除戀人，改成配偶
        const index = Game.relationships.findIndex((r) => r.id === npcId);
        if (index !== -1) {
          Game.relationships[index].type = "spouse";
        }

        Game.happy += 50;
        log(`💒 與 ${npc.name} 結婚了！`);

        showModal(
          "💒 結婚典禮",
          `恭喜！你和 ${npc.name} 結為夫妻！\n獲得 +50 快樂`,
          [{ text: "太幸福了！", action: () => closeModal() }],
        );

        closeModal();
        updateUI();
        renderSocial();
      },
    },
    {
      text: "再想想",
      action: () => closeModal(),
    },
  ]);
}

function updateNPCRelations() {
  // 每年自動衰減長時間未互動的關係
  Game.npcs.forEach((npc) => {
    const yearsSinceInteraction = Game.age - npc.lastInteraction;
    if (yearsSinceInteraction > 3) {
      npc.relation = Math.max(0, npc.relation - 2);
    }
  });
}

function checkAchievements() {
  ACHIEVEMENTS.forEach((ach) => {
    if (!Game.unlockedAchievements.includes(ach.id)) {
      if (ach.check(Game)) {
        Game.unlockedAchievements.push(ach.id);

        // ✅ 立即保存成就
        saveAchievements();

        // 显示解锁提示
        const toast = document.createElement("div");
        toast.style.cssText = `
                    position: fixed;
                    top: 80px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(135deg, #ffd700, #ffa000);
                    color: black;
                    padding: 15px 25px;
                    border-radius: 12px;
                    font-weight: bold;
                    z-index: 400;
                    box-shadow: 0 8px 25px rgba(255, 215, 0, 0.6);
                    animation: slideIn 0.5s;
                    font-size: 1.1em;
                    border: 3px solid #fff;
                `;
        toast.innerHTML = `🏆 成就解鎖：${ach.icon} ${ach.name}`;
        document.body.appendChild(toast);

        setTimeout(() => {
          toast.style.animation = "slideIn 0.5s reverse";
          setTimeout(() => document.body.removeChild(toast), 500);
        }, 3000);

        log(`🏆 成就解鎖：${ach.name}`);
      }
    }
  });
}
// ===== 🏫 教育系統函數 =====
function canEnterEducation(eduId) {
  const edu = EDUCATION_LEVELS.find((e) => e.id === eduId);
  if (!edu) return false;

  // 檢查年齡
  if (Game.age < edu.minAge) return false;

  // 檢查是否已經有更高學歷
  const currentEduIndex = EDUCATION_LEVELS.findIndex(
    (e) => e.id === Game.education,
  );
  const targetEduIndex = EDUCATION_LEVELS.findIndex((e) => e.id === eduId);
  if (currentEduIndex >= targetEduIndex) return false;

  // 檢查需求
  if (edu.requirement) {
    if (edu.requirement.intel && Game.intel < edu.requirement.intel) {
      return false;
    }
  }

  // 檢查金錢
  if (edu.cost && Game.money < edu.cost) {
    return false;
  }

  return true;
}

function enterEducation(eduId, majorId = null) {
  const edu = EDUCATION_LEVELS.find((e) => e.id === eduId);
  if (!edu) return;

  if (!canEnterEducation(eduId)) {
    alert("⚠️ 不符合入學條件！");
    return;
  }

  // 扣除學費
  if (edu.cost) {
    Game.money -= edu.cost;
  }

  Game.isStudying = true;
  Game.studyProgress = 0;

  let eduName = edu.name;
  if (majorId) {
    const majors = MAJORS[eduId];
    const major = majors?.find((m) => m.id === majorId);
    if (major) {
      Game.major = majorId;
      eduName += ` - ${major.name}`;
    }
  }

  log(`📚 開始就讀${eduName}`);
  showModal("🎓 入學通知", `恭喜你進入${eduName}！\n努力學習吧！`, [
    { text: "開始學習", action: () => closeModal() },
  ]);

  updateUI();
}

function studyProgress() {
  if (!Game.isStudying) return;

  Game.studyProgress += 10 + Game.learnBonus * 5;

  if (Game.studyProgress >= 100) {
    graduateEducation();
  }
}

function graduateEducation() {
  const currentEdu = Game.education;
  const nextEduIndex =
    EDUCATION_LEVELS.findIndex((e) => e.id === currentEdu) + 1;
  const nextEdu = EDUCATION_LEVELS[nextEduIndex];

  if (nextEdu) {
    Game.education = nextEdu.id;
    Game.isStudying = false;
    Game.studyProgress = 0;

    // 應用學歷加成
    if (nextEdu.bonus) {
      Object.keys(nextEdu.bonus).forEach((key) => {
        if (key.startsWith("skills.")) {
          const skillName = key.split(".")[1];
          Game.skills[skillName] += nextEdu.bonus[key];
        } else {
          Game[key] += nextEdu.bonus[key];
        }
      });
    }

    // 應用主修加成
    if (Game.major) {
      const majors = MAJORS[nextEdu.id];
      const major = majors?.find((m) => m.id === Game.major);
      if (major) {
        if (major.intel) Game.intel += major.intel;
        if (major.skills) {
          Object.keys(major.skills).forEach((skill) => {
            Game.skills[skill] += major.skills[skill];
          });
        }
      }
    }

    log(`🎓 恭喜畢業！取得${nextEdu.name}學歷`);
    showModal("🎉 畢業典禮", `恭喜你完成學業！\n取得${nextEdu.name}學歷`, [
      { text: "太好了！", action: () => closeModal() },
    ]);

    // 解鎖成就
    if (nextEdu.id === "phd") {
      Game.unlockedAchievements.push("scholar");
    }
  }

  updateUI();
}

function showEducationMenu() {
  let html = '<div style="padding: 20px;">';
  html += `<h2 style="color: var(--gold); margin-bottom: 20px;">🎓 教育系統</h2>`;
  html += `<p style="color: var(--text-dim); margin-bottom: 15px;">當前學歷：${EDUCATION_LEVELS.find((e) => e.id === Game.education)?.name || "無"}</p>`;

  if (Game.isStudying) {
    html += `<div style="margin-bottom: 20px;">`;
    html += `<p style="color: var(--blue);">📚 學習中... ${Math.floor(Game.studyProgress)}%</p>`;
    html += `<div style="background: #333; height: 20px; border-radius: 10px; overflow: hidden; margin-top: 10px;">`;
    html += `<div style="width: ${Game.studyProgress}%; height: 100%; background: linear-gradient(90deg, var(--blue), var(--green)); transition: width 0.3s;"></div>`;
    html += `</div></div>`;
  }

  html += '<div style="display: flex; flex-direction: column; gap: 10px;">';

  EDUCATION_LEVELS.forEach((edu, index) => {
    if (index === 0) return; // 跳過 none

    const canEnter = canEnterEducation(edu.id);
    const currentEduIndex = EDUCATION_LEVELS.findIndex(
      (e) => e.id === Game.education,
    );
    const isCompleted = currentEduIndex >= index;

    let statusColor = isCompleted
      ? "var(--green)"
      : canEnter
        ? "var(--blue)"
        : "var(--red)";
    let statusText = isCompleted
      ? "✅ 已完成"
      : canEnter
        ? "可入學"
        : "❌ 未達標";

    html += `<div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px; border-left: 3px solid ${statusColor};">`;
    html += `<div style="display: flex; justify-content: space-between; align-items: center;">`;
    html += `<div>`;
    html += `<div style="font-size: 1.1em; font-weight: bold; color: var(--gold);">${edu.name}</div>`;
    html += `<div style="font-size: 0.85em; color: var(--text-dim); margin-top: 5px;">`;
    html += `最低年齡: ${edu.minAge}歲`;
    if (edu.requirement?.intel) html += ` | 智力需求: ${edu.requirement.intel}`;
    if (edu.cost) html += ` | 學費: $${edu.cost.toLocaleString()}`;
    html += `</div></div>`;
    html += `<div style="color: ${statusColor}; font-weight: bold;">${statusText}</div>`;
    html += `</div></div>`;
  });

  html += "</div></div>";

  showModal("🎓 教育系統", html, [
    { text: "關閉", action: () => closeModal() },
  ]);
}

function renderAchievements() {
  let html = "";

  ACHIEVEMENTS.forEach((ach) => {
    const unlocked = Game.unlockedAchievements.includes(ach.id);

    html += `
                          <div class="job-card" style="opacity: ${unlocked ? 1 : 0.4}; cursor: default;">
                              <div style="display: flex; align-items: center; gap: 10px;">
                                  <div style="font-size: 2em;">${unlocked ? ach.icon || "🏆" : "🔒"}</div>
                                  <div>
                                      <div class="job-name">${ach.name}</div>
                                      <div style="font-size: 0.85em; color: var(--text-dim);">${ach.desc}</div>
                                  </div>
                              </div>
                          </div>
                      `;
  });

  document.getElementById("achievement-list").innerHTML = html;
}

function showAchievementToast(name) {
  const toast = document.createElement("div");
  toast.className = "achievement-toast";
  toast.innerHTML = `
                      <div class="achievement-icon">🏆</div>
                      <div>
                          <div style="font-size: 0.9em;">解鎖成就</div>
                          <div style="font-size: 1.1em;">${name}</div>
                      </div>
                  `;
  toast.style.cssText = `
                      position: fixed;
                      top: 80px;
                      right: 20px;
                      background: linear-gradient(135deg, #ffd700, #ffb300);
                      color: #000;
                      padding: 15px;
                      border-radius: 10px;
                      box-shadow: 0 5px 20px rgba(255, 215, 0, 0.5);
                      z-index: 150;
                      animation: slideIn 0.5s;
                      font-weight: bold;
                      display: flex;
                      gap: 10px;
                      align-items: center;
                  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideIn 0.5s reverse";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 3000);
}

function renderJobs() {
  // 過濾可用職業（排除 none 和出身限定職業）
  const availableJobs = JOBS.filter((job) => {
    if (job.id === "none") return false;
    if (job.originRequired && job.originRequired !== Game.originId)
      return false;
    return true;
  });

  if (availableJobs.length === 0) {
    document.getElementById("job-list").innerHTML =
      '<div style="text-align: center; color: var(--text-dim); padding: 30px;">暫無可用職業</div>';
    return;
  }

  // 確保索引不超出範圍
  if (currentJobIndex >= availableJobs.length) currentJobIndex = 0;
  if (currentJobIndex < 0) currentJobIndex = availableJobs.length - 1;

  const job = availableJobs[currentJobIndex];

  // 檢查是否符合條件
  let canApply = true;
  let reqText = "";

  if (job.requirement) {
    Object.keys(job.requirement).forEach((key) => {
      const required = job.requirement[key];
      const current =
        key === "intel"
          ? Game.intel
          : key === "health"
            ? Game.health
            : Game.skills[key] || 0;

      if (current < required) canApply = false;

      const emoji = key === "intel" ? "🧠" : key === "health" ? "❤️" : "📊";
      const status = current >= required ? "✅" : "❌";
      reqText += `<div style="margin: 3px 0;">${status} ${emoji} ${key}: ${current}/${required}</div>`;
    });
  } else {
    reqText = '<div style="color: var(--green);">✅ 無特殊要求</div>';
  }

  const isCurrentJob = Game.jobId === job.id;

  let html = `
              <div style="position: relative; min-height: 350px;">
                  <!-- 左右切換按鈕 -->
                  <button onclick="prevJob()"
                          style="position: absolute; left: -10px; top: 50%; transform: translateY(-50%);
                                 width: 50px; height: 50px; border-radius: 50%; font-size: 1.5em;
                                 background: linear-gradient(135deg, #444, #555); z-index: 10;">
                      ◀
                  </button>

                  <button onclick="nextJob()"
                          style="position: absolute; right: -10px; top: 50%; transform: translateY(-50%);
                                 width: 50px; height: 50px; border-radius: 50%; font-size: 1.5em;
                                 background: linear-gradient(135deg, #444, #555); z-index: 10;">
                      ▶
                  </button>

                  <!-- 職業卡片 -->
                  <div style="padding: 0 60px;">
                      <div class="job-card" style="background: linear-gradient(135deg, #2a2a3e, #3a3a4e);
                           border: 3px solid ${isCurrentJob ? "var(--gold)" : canApply ? "var(--blue)" : "var(--red)"};
                           padding: 25px; cursor: ${canApply && !isCurrentJob ? "pointer" : "default"};"
                           ${canApply && !isCurrentJob ? `onclick="selectJob('${job.id}')"` : ""}>

                          <div style="text-align: center; margin-bottom: 15px;">
                              <div style="font-size: 2em; margin-bottom: 5px;">💼</div>
                              <div class="job-name" style="font-size: 1.5em; color: var(--gold);">
                                  ${job.name} ${isCurrentJob ? "✓ 當前職業" : ""}
                              </div>
                          </div>

                          <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                              <div style="font-size: 1.2em; color: var(--green); margin-bottom: 10px;">
                                  💰 月薪: $${job.salary.toLocaleString()}
                              </div>
                              <div style="color: var(--text-dim); font-size: 0.95em; line-height: 1.5;">
                                  ${job.desc}
                              </div>
                          </div>

                          <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px;">
                              <div style="font-weight: bold; margin-bottom: 8px; color: var(--accent);">
                                  📋 任職條件：
                              </div>
                              ${reqText}
                          </div>

                          ${
                            !canApply && !isCurrentJob
                              ? '<div style="text-align: center; margin-top: 15px; padding: 12px; background: var(--red); border-radius: 8px; font-weight: bold;">❌ 條件不符，無法應徵</div>'
                              : ""
                          }

                          ${
                            canApply && !isCurrentJob
                              ? '<div style="text-align: center; margin-top: 15px; padding: 12px; background: var(--green); color: black; border-radius: 8px; font-weight: bold; animation: pulse 2s infinite;">👆 點擊卡片應徵此職業</div>'
                              : ""
                          }

                          ${
                            isCurrentJob
                              ? '<div style="text-align: center; margin-top: 15px; padding: 12px; background: var(--gold); color: black; border-radius: 8px; font-weight: bold;">✅ 這是你目前的工作</div>'
                              : ""
                          }
                      </div>

                      <!-- 頁碼指示器 -->
                      <div style="text-align: center; margin-top: 15px; color: var(--text-dim); font-size: 0.9em;">
                          職業 ${currentJobIndex + 1} / ${availableJobs.length}
                          <div style="margin-top: 8px; font-size: 0.85em;">
                              💡 左右切換查看更多職業
                          </div>
                      </div>
                  </div>
              </div>
          `;

  document.getElementById("job-list").innerHTML = html;
}

// ✅ 修正後的 selectJob 函數
function selectJob(jobId) {
  const job = JOBS.find((j) => j.id === jobId);
  if (!job) return;

  // 檢查特質需求
  if (job.requiredTrait) {
    const hasTrait = Game.traits.some((t) => t.id === job.requiredTrait);
    if (!hasTrait) {
      const traitName =
        TRAITS.find((t) => t.id === job.requiredTrait)?.name || "特定特質";
      alert(`❌ 此職業需要特質：${traitName}`);
      return;
    }
  }

  // 檢查技能需求
  let canApply = true;
  let missingReqs = [];

  if (job.requirement.intel && Game.intel < job.requirement.intel) {
    canApply = false;
    missingReqs.push(`智力 ${job.requirement.intel}`);
  }

  Object.keys(job.requirement).forEach((skill) => {
    if (skill !== "intel" && Game.skills[skill] < job.requirement[skill]) {
      canApply = false;
      missingReqs.push(`${skill} ${job.requirement[skill]}`);
    }
  });

  if (!canApply) {
    alert("❌ 不符合條件：" + missingReqs.join(", "));
    return;
  }

  // 計算特質加成
  let finalSalary = job.salary;
  let bonusMessages = [];

  if (job.traitBonus) {
    Game.traits.forEach((trait) => {
      if (job.traitBonus[trait.id]) {
        const bonus = job.traitBonus[trait.id];
        finalSalary *= bonus.salary;
        bonusMessages.push(`✨ ${trait.name}：${bonus.desc}`);
      }
    });
  }

  // 更新遊戲狀態
  Game.jobId = jobId;
  Game.jobYears = 0;
  Game.job = "實習生"; // ✨【關鍵修復】初始化職稱，讓升遷系統有起點

  let message = `🎉 成功應徵 ${job.name}！\n月薪：$${Math.floor(finalSalary).toLocaleString()}`;
  if (bonusMessages.length > 0) {
    message += "\n\n特質加成：\n" + bonusMessages.join("\n");
  }

  log(message);
  alert(message);
  updateUI();
}

function renderSocial() {
  let html = "";

  // === NPC 列表 ===
  if (Game.npcs && Game.npcs.length > 0) {
    html += '<div style="margin-bottom: 20px;">';
    html +=
      '<h3 style="color: var(--gold); margin-bottom: 10px;">👥 人際關係</h3>';

    Game.npcs.forEach((npc) => {
      // 計算顏色
      const relationColor =
        npc.relation >= 80
          ? "var(--green)"
          : npc.relation >= 50
            ? "var(--blue)"
            : npc.relation >= 30
              ? "var(--orange)"
              : "var(--red)";

      // 設定圖示
      let typeIcon = "👤";
      let typeName = "朋友";
      if (npc.type === "romantic") {
        typeIcon = "💕";
        typeName = "曖昧對象";
      }
      if (npc.type === "lover") {
        typeIcon = "❤️";
        typeName = "戀人";
      }
      if (npc.type === "spouse") {
        typeIcon = "💑";
        typeName = "配偶";
      }
      if (npc.type === "colleague") {
        typeIcon = "💼";
        typeName = "同事";
      }
      if (npc.type === "classmate") {
        typeIcon = "📚";
        typeName = "同學";
      }

      // 互動按鈕邏輯
      let actionButtons = `
        <button class="btn-job" style="flex: 1; min-width: 80px; padding: 8px; font-size: 0.85em;" onclick="interactWithNPC('${npc.id}', 'chat')">💬 閒聊</button>
        <button class="btn-job" style="flex: 1; min-width: 80px; padding: 8px; font-size: 0.85em;" onclick="interactWithNPC('${npc.id}', 'gift')">🎁 送禮</button>
      `;

      if (npc.type === "romantic" || npc.type === "lover") {
        actionButtons += `<button class="btn-buy" style="flex: 1; min-width: 80px; padding: 8px; font-size: 0.85em;" onclick="interactWithNPC('${npc.id}', 'date')">💕 約會</button>`;
      }
      if (npc.type === "lover" && npc.relation >= 90) {
        actionButtons += `<button class="btn-main" style="flex: 1; min-width: 100px; padding: 8px; font-size: 0.85em;" onclick="proposeMarriage('${npc.id}')">💍 求婚</button>`;
      }

      // 修正：直接使用 html 變數串接，不要用未定義的 npcHtml
      html += `
        <div class="job-card" style="cursor: default;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-size: 1.1em; font-weight: bold; color: var(--gold);">
                        ${typeIcon} ${npc.name}
                    </div>
                    <div style="font-size: 0.85em; color: var(--text-dim); margin-top: 3px;">
                        ${typeName} | ${npc.age}歲
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="color: ${relationColor}; font-weight: bold;">
                        💗 ${npc.relation}
                    </div>
                </div>
            </div>
            <div style="margin-top: 10px; display: flex; gap: 5px; flex-wrap: wrap;">
                ${actionButtons}
            </div>
        </div>
      `;
    });
    html += "</div>";
  }

  // === 固定關係 (父母等) ===
  if (Game.relationships.length > 0) {
    // ... (你可以保留原本處理 relationships 的代碼，或者簡化顯示)
    // 這裡為了避免錯誤，確保主要邏輯正確即可
  }

  if (!html && Game.relationships.length === 0) {
    html =
      '<div style="color: var(--text-dim); text-align: center; padding: 20px;">還沒有任何人際關係</div>';
  }

  // 交友軟體按鈕區域
  const hasPartner =
    Game.relationships.some(
      (r) => r.type === "partner" || r.type === "spouse",
    ) || Game.npcs.some((n) => n.type === "lover" || n.type === "spouse");
  document.getElementById("find-partner-area").style.display =
    Game.age >= 18 && !hasPartner ? "block" : "none";

  document.getElementById("npc-list").innerHTML = html;
}
function prevJob() {
  currentJobIndex--;
  const availableJobs = JOBS.filter((job) => {
    if (job.id === "none") return false;
    if (job.originRequired && job.originRequired !== Game.originId)
      return false;
    return true;
  });

  if (currentJobIndex < 0) {
    currentJobIndex = availableJobs.length - 1;
  }

  renderJobs();
}

function nextJob() {
  currentJobIndex++;
  const availableJobs = JOBS.filter((job) => {
    if (job.id === "none") return false;
    if (job.originRequired && job.originRequired !== Game.originId)
      return false;
    return true;
  });

  if (currentJobIndex >= availableJobs.length) {
    currentJobIndex = 0;
  }

  renderJobs();
}

function findPartner() {
  if (Game.money < 500) return alert("沒錢使用交友軟體");

  Game.money -= 500;
  const chance = (Game.skills.charm / 150) * 0.8 + 0.2;

  if (Math.random() < chance) {
    const names = [
      "小美",
      "阿豪",
      "雅婷",
      "志明",
      "Emily",
      "Jack",
      "小琳",
      "大衛",
      "凱莉",
      "俊傑",
    ];
    const name = names[Math.floor(Math.random() * names.length)];

    Game.relationships.push({
      id: "partner_" + Date.now(),
      name: name,
      type: "partner",
      relation: 50,
      role: "伴侶",
    });

    log(`💖 配對成功！和 ${name} 開始交往`);
  } else {
    Game.happy -= 10;
    log("💔 沒有配對成功...");
  }

  updateUI();
  renderSocial();
}
function giveGiftToNPC(npcId) {
  if (isProcessing) return;
  isProcessing = true;

  const npc = Game.relationships.find((n) => n.id === npcId);
  if (!npc) {
    isProcessing = false;
    return;
  }

  if (Game.money < 5000) {
    isProcessing = false;
    alert("💸 送禮需要 5000 元");
    return;
  }

  Game.money -= 5000;
  const relationGain = Math.floor(10 * Game.socialBonus);
  npc.relation += relationGain;

  if (npc.relation > 100) npc.relation = 100;

  // 生病时送礼额外加健康
  if (npc.isSick) {
    npc.health += 10;
    log(`🎁 送禮給 ${npc.name}，好友度 +${relationGain}，健康 +10`);
  } else {
    log(`🎁 送禮給 ${npc.name}，好友度 +${relationGain}`);
  }

  updateUI();

  setTimeout(() => {
    isProcessing = false;
  }, 300);
}

// NPC 更新生命周期
function updateNPCLifecycle() {
  const toRemove = [];

  Game.relationships.forEach((npc, index) => {
    // 跳过特殊 NPC（配偶、子女）
    if (npc.type === "spouse" || npc.type === "child") {
      // 配偶和子女也会变老
      if (!npc.age) npc.age = npc.type === "spouse" ? Game.age : 0;
      npc.age++;

      // 子女成年后变成朋友
      if (npc.type === "child" && npc.age >= 18) {
        npc.type = "friend";
        npc.relation += 10;
        log(`👨‍👩‍👧 ${npc.name} 已成年，關係轉為朋友`);
      }
      return;
    }

    // 初始化 NPC 年龄（如果没有）
    if (!npc.age) {
      npc.age = Math.floor(Math.random() * 20) + Game.age - 10;
      if (npc.age < 0) npc.age = Game.age;
    }

    // NPC 年龄增长
    npc.age++;

    // 初始化健康值
    if (!npc.health) {
      npc.health = 100;
    }

    // ===== NPC 健康衰减 =====
    let healthDecay = 3;
    if (npc.age > 60) healthDecay = 5;
    if (npc.age > 80) healthDecay = 10;
    npc.health -= healthDecay;

    // ===== NPC 生病事件 =====
    if (npc.health < 50 && npc.health > 0 && !npc.isSick) {
      npc.isSick = true;
      log(`🏥 ${npc.name} 生病了（${npc.age}歲）`);

      // 20% 机率触发帮助事件
      if (Math.random() < 0.2) {
        showNPCSickEvent(npc);
      }
    } else if (npc.health >= 50 && npc.isSick) {
      npc.isSick = false;
      log(`❤️ ${npc.name} 康復了`);
    }

    // ===== NPC 死亡 =====
    if (npc.health <= 0 || (npc.age > 85 && Math.random() < 0.15)) {
      toRemove.push(index);
      log(`💀 ${npc.name} 去世了，享年 ${npc.age} 歲`);
      Game.happy -= 15;

      // 好友去世特殊提示
      if (npc.relation > 80) {
        Game.happy -= 10;
        showDeathModal(npc);
      }
    }

    // ===== NPC 结婚生子（朋友类型）=====
    if (
      npc.type === "friend" &&
      npc.age >= 25 &&
      npc.age <= 40 &&
      !npc.hasFamily
    ) {
      if (Math.random() < 0.1) {
        npc.hasFamily = true;
        log(`💑 ${npc.name} 結婚了`);
      }
    }

    if (npc.hasFamily && !npc.hasChild && npc.age >= 28 && npc.age <= 45) {
      if (Math.random() < 0.08) {
        npc.hasChild = true;
        log(`👶 ${npc.name} 有了孩子`);
      }
    }

    // ===== 关系自然衰减 =====
    if (npc.relation > 0) {
      npc.relation -= 2;
      if (npc.relation < 0) npc.relation = 0;
    }

    // 关系太低自动断联
    if (npc.relation < 20 && npc.type === "friend") {
      toRemove.push(index);
      log(`💔 與 ${npc.name} 失去聯絡`);
    }
  });

  // 移除死亡或断联的 NPC（从后往前删除避免索引错乱）
  toRemove
    .sort((a, b) => b - a)
    .forEach((index) => {
      Game.relationships.splice(index, 1);
    });
}

// NPC 生病事件
function showNPCSickEvent(npc) {
  const modal = document.getElementById("event-modal");
  const title = document.getElementById("ev-title");
  const desc = document.getElementById("ev-desc");
  const btnA = document.getElementById("btn-choice-a");
  const btnB = document.getElementById("btn-choice-b");

  title.textContent = "🏥 朋友生病";
  desc.textContent = `你的朋友 ${npc.name}（${npc.age}歲）生病了，需要醫療費用 20,000 元。你願意幫助嗎？`;

  btnA.textContent = "💰 幫助（-20,000）";
  btnA.onclick = () => {
    if (Game.money >= 20000) {
      Game.money -= 20000;
      npc.health += 30;
      npc.relation += 20;
      log(`❤️ 幫助了 ${npc.name}，關係大幅提升`);
    } else {
      alert("💸 金錢不足！");
    }
    modal.style.display = "none";
    updateUI();
  };

  btnB.textContent = "😔 無能為力";
  btnB.onclick = () => {
    npc.relation -= 10;
    log(`💔 ${npc.name} 感到失望`);
    modal.style.display = "none";
    updateUI();
  };

  btnB.style.display = "block";
  modal.style.display = "flex";
}

// NPC 死亡提示
function showDeathModal(npc) {
  const modal = document.getElementById("event-modal");
  const title = document.getElementById("ev-title");
  const desc = document.getElementById("ev-desc");
  const btnA = document.getElementById("btn-choice-a");
  const btnB = document.getElementById("btn-choice-b");

  title.textContent = "💀 悲傷的消息";
  desc.innerHTML = `
        <div style="text-align: center; line-height: 1.8;">
            <div style="font-size: 1.5em; margin-bottom: 15px;">🕯️</div>
            <div style="font-weight: bold; font-size: 1.2em; margin-bottom: 10px;">${npc.name}</div>
            <div style="color: var(--text-dim);">享年 ${npc.age} 歲</div>
            <div style="margin-top: 15px; color: var(--text-dim);">好友度：${npc.relation}</div>
            <div style="margin-top: 10px; font-style: italic;">
                "謝謝你陪伴我的人生旅程"
            </div>
        </div>
    `;

  btnA.textContent = "😢 哀悼";
  btnA.onclick = () => {
    modal.style.display = "none";
  };

  btnB.style.display = "none";
  modal.style.display = "flex";
}
function addFriend() {
  // ===== ✅ 使用真实的台湾姓名 =====
  const names = [
    // 男生名字
    "陳冠宇",
    "林子翔",
    "張家豪",
    "李宗翰",
    "王建民",
    "黃俊傑",
    "吳承恩",
    "劉柏廷",
    "許志豪",
    "鄭宇軒",
    "謝承翰",
    "楊承翰",
    "蔡政霖",
    "賴彥廷",
    "徐浩宇",
    "周柏辰",
    "蕭宇恩",
    "羅竣宇",
    "簡紹宇",
    "曾柏翰",
    "彭昱翔",
    "洪子軒",
    "江承恩",
    "何冠霖",
    "呂柏勳",
    "蘇建文",
    "丁紹恩",
    "施宗翰",
    "高宇辰",
    "魏承佑",
    "范宗佑",
    "孫浩宇",
    "潘柏翰",
    "葉俊宏",
    "莊宇翔",
    "游承翰",
    "詹柏勳",
    "邱建安",
    "方宗佑",
    "侯宇恩",
    "戴承翰",
    "田柏宇",

    // 女生名字
    "陳思妤",
    "林雨涵",
    "張家瑜",
    "李芷瑄",
    "王靖雯",
    "黃詩涵",
    "吳欣怡",
    "劉怡萱",
    "許芷寧",
    "鄭雨彤",
    "謝宜庭",
    "楊詩涵",
    "蔡宜蓁",
    "賴宜萱",
    "徐芷若",
    "周欣妤",
    "蕭雨晴",
    "羅雅婷",
    "簡心妤",
    "曾詩涵",
    "彭詩婷",
    "洪芷瑄",
    "江欣妮",
    "何雨萱",
    "呂芷寧",
    "蘇雅文",
    "丁欣妤",
    "施宜庭",
    "高宇晴",
    "魏詩涵",
    "范芷瑄",
    "孫雨彤",
    "潘欣怡",
    "葉芷妤",
    "莊詩婷",
    "游宜萱",
    "詹芷涵",
    "邱雨涵",
    "方芷瑄",
    "侯欣妤",
    "戴詩涵",
    "田宜萱",
  ];

  const name = names[Math.floor(Math.random() * names.length)];
  const id = `friend_${Date.now()}_${Math.random()}`;

  // 初始化年龄和健康
  const age = Math.floor(Math.random() * 20) + Game.age - 10;
  const finalAge = age > 0 ? age : Game.age;

  Game.relationships.push({
    id,
    name,
    type: "friend",
    relation: 50,
    age: finalAge,
    health: 100,
    isSick: false,
    hasFamily: false,
    hasChild: false,
  });

  log(`🤝 認識了新朋友：${name}（${finalAge}歲）`);
}

function renderShop() {
  // 車庫
  let carHtml = "";
  CARS.forEach((car) => {
    const owned = Game.inventory.includes(car.id);
    carHtml += `
                          <div class="job-card" style="cursor: default;">
                              <div class="job-name">${car.name} ${owned ? "✓ (已擁有)" : ""}</div>
                              <div class="job-salary">✨ 魅力 +${car.charm}</div>
                              <div style="font-size: 0.85em; color: var(--text-dim); margin: 5px 0;">
                                  ${car.desc}
                              </div>
                              <div style="margin-top: 8px;">
                                  <button class="btn-buy" onclick="buyItem('${car.id}')" ${owned ? "disabled" : ""}>
                                      購買 $${(car.price / 10000).toFixed(0)}萬
                                  </button>
                              </div>
                          </div>
                      `;
  });

  // 房產
  let houseHtml = "";
  HOUSES.forEach((house) => {
    const owned = Game.inventory.includes(house.id);
    houseHtml += `
                          <div class="job-card" style="cursor: default;">
                              <div class="job-name">${house.name} ${owned ? "✓ (已擁有)" : ""}</div>
                              <div class="job-salary">
                                  😊 快樂 +${house.happy} | 💰 被動收入 $${house.passive.toLocaleString()}/月
                              </div>
                              <div style="font-size: 0.85em; color: var(--text-dim); margin: 5px 0;">
                                  ${house.desc}
                              </div>
                              <div style="margin-top: 8px;">
                                  <button class="btn-buy" onclick="buyItem('${house.id}')" ${owned ? "disabled" : ""}>
                                      購買 $${(house.price / 10000).toFixed(0)}萬
                                  </button>
                              </div>
                          </div>
                      `;
  });

  // 奢侈品
  let luxHtml = "";
  LUXURIES.forEach((lux) => {
    const owned = Game.inventory.includes(lux.id);
    luxHtml += `
                          <div class="job-card" style="cursor: default;">
                              <div class="job-name">${lux.name} ${owned ? "✓ (已擁有)" : ""}</div>
                              <div class="job-salary">
                                  ${lux.charm ? `✨ 魅力 +${lux.charm}` : ""}
                                  ${lux.happy ? `😊 快樂 +${lux.happy}` : ""}
                              </div>
                              <div style="font-size: 0.85em; color: var(--text-dim); margin: 5px 0;">
                                  ${lux.desc}
                              </div>
                              <div style="margin-top: 8px;">
                                  <button class="btn-buy" onclick="buyItem('${lux.id}')" ${owned ? "disabled" : ""}>
                                      購買 $${(lux.price / 10000).toFixed(0)}萬
                                  </button>
                              </div>
                          </div>
                      `;
  });

  document.getElementById("car-shop").innerHTML = carHtml;
  document.getElementById("house-shop").innerHTML = houseHtml;
  document.getElementById("luxury-shop").innerHTML = luxHtml;
}

function buyItem(id) {
  const car = CARS.find((c) => c.id === id);
  const house = HOUSES.find((h) => h.id === id);
  const lux = LUXURIES.find((l) => l.id === id);
  const item = car || house || lux;

  if (!item) return;
  if (Game.inventory.includes(id)) return alert("已擁有");
  if (Game.money < item.price) return alert("錢不夠");

  Game.money -= item.price;
  Game.inventory.push(id);

  if (car) {
    Game.skills.charm += car.charm;
    log(`🏎️ 購買了 ${car.name}`);
  } else if (house) {
    Game.happy += house.happy;
    log(`🏘️ 購買了 ${house.name}`);
  } else {
    if (lux.charm) Game.skills.charm += lux.charm;
    if (lux.happy) Game.happy += lux.happy;
    log(`💎 購買了 ${lux.name}`);
  }

  checkAchievements();
  updateUI();
  renderShop();
}

function renderStats() {
  const highestSkill = Object.keys(Game.skills).reduce((a, b) =>
    Game.skills[a] > Game.skills[b] ? a : b,
  );

  const totalWealth =
    Game.money +
    Game.inventory.reduce((sum, id) => {
      const item = [...CARS, ...HOUSES, ...LUXURIES].find((i) => i.id === id);
      return sum + (item ? item.price : 0);
    }, 0);

  const html = `
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9em;">
                          <div>🎂 當前年齡: ${Game.age}歲</div>
                          <div>🏠 出身: ${Game.origin}</div>
                          <div>💰 總資產: $${totalWealth.toLocaleString()}</div>
                          <div>💼 工作年資: ${Game.jobYears}年</div>
                          <div>👥 人際關係: ${Game.relationships.length}人</div>
                          <div>🏆 成就數: ${Game.unlockedAchievements.length}/${ACHIEVEMENTS.length}</div>
                          <div>🎯 執行行動: ${Game.totalActions}次</div>
                          <div>📢 觸發事件: ${Game.totalEvents}次</div>
                          <div>😊 快樂年數: ${Game.happyYears}年</div>
                          <div>🌟 最強技能: ${highestSkill}</div>
                      </div>
                  `;

  document.getElementById("stats-panel").innerHTML = html;
}

function nav(page, event) {
  event.preventDefault();
  event.stopPropagation();

  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("page-" + page).classList.add("active");

  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));
  event.currentTarget.classList.add("active");

  // 更新特定頁面的資料
  if (page === "profile") {
    // ✅ 成就统计
    const stats = getAchievementStats();
    let achievementHtml = `
            <div style="background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 160, 0, 0.2));
                        padding: 15px;
                        border-radius: 12px;
                        margin-bottom: 15px;
                        border: 2px solid var(--gold);
                        text-align: center;">
                <div style="font-size: 1.3em; font-weight: bold; color: var(--gold); margin-bottom: 10px;">
                    🏆 成就收集進度
                </div>
                <div style="font-size: 2em; font-weight: bold; color: var(--gold); margin: 10px 0;">
                    ${stats.unlocked} / ${stats.total}
                </div>
                <div style="background: rgba(0,0,0,0.3); height: 20px; border-radius: 10px; overflow: hidden; margin: 10px 0;">
                    <div style="width: ${stats.percentage}%; height: 100%; background: linear-gradient(90deg, var(--gold), var(--green)); transition: width 0.5s;"></div>
                </div>
                <div style="color: var(--text-dim); font-size: 0.9em;">
                    完成度：${stats.percentage}%
                </div>
            </div>
        `;

    // 显示所有成就（包括未解锁的）
    ACHIEVEMENTS.forEach((ach) => {
      const isUnlocked = Game.unlockedAchievements.includes(ach.id);
      achievementHtml += `
                <div style="background: ${isUnlocked ? "linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 160, 0, 0.15))" : "rgba(0,0,0,0.3)"};
                            padding: 12px;
                            border-radius: 10px;
                            margin-bottom: 10px;
                            border: 2px solid ${isUnlocked ? "var(--gold)" : "rgba(255,255,255,0.1)"};
                            ${isUnlocked ? "box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);" : "opacity: 0.6; filter: grayscale(0.8);"}">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="font-size: 2em;">${isUnlocked ? ach.icon : "🔒"}</div>
                        <div style="flex: 1;">
                            <div style="font-weight: bold; color: ${isUnlocked ? "var(--gold)" : "var(--text-dim)"}; font-size: 1em;">
                                ${ach.name}
                            </div>
                            <div style="color: var(--text-dim); font-size: 0.85em; margin-top: 3px;">
                                ${isUnlocked ? ach.desc : "???"}
                            </div>
                        </div>
                        ${isUnlocked ? '<div style="color: var(--green); font-weight: bold; font-size: 1.2em;">✓</div>' : ""}
                    </div>
                </div>
            `;
    });

    // ✅ 加入重置按钮
    achievementHtml += `
            <button class="btn-main" onclick="resetAchievements()" 
                    style="background: linear-gradient(135deg, var(--red), #c62828); margin-top: 15px;">
                🗑️ 重置所有成就
            </button>
        `;
    achievementHtml += `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
        <button class="btn-main" onclick="exportAchievements()" 
                style="background: linear-gradient(135deg, var(--blue), #1976d2); font-size: 0.9em; padding: 10px;">
            📤 導出成就
        </button>
        <button class="btn-main" onclick="importAchievements()" 
                style="background: linear-gradient(135deg, var(--green), #00897b); color: black; font-size: 0.9em; padding: 10px;">
            📥 導入成就
        </button>
    </div>
`;
    document.getElementById("achievement-list").innerHTML = achievementHtml;
  }
  renderStats();
}

function closeModal() {
  document.getElementById("event-modal").style.display = "none";
}

function restartGame() {
  if (
    confirm("確定要重新開始嗎？\n\n⚠️ 當前進度將會清除\n✅ 已解鎖的成就會保留")
  ) {
    location.reload();
  }
}
// ==========================================
// 🔴 出身專屬事件系統
// ==========================================

function triggerOriginEvent() {
  const originEvents = {
    rich: [
      {
        title: "🏢 家族企業危機",
        desc: "父親公司遭惡意收購，需要緊急資金援助",
        choices: [
          {
            txt: "投資500萬救公司",
            effect: (g) => {
              if (g.money >= 5000000) {
                g.money -= 5000000;
                g.money += 10000000;
                return "成功拯救企業，公司價值翻倍！賺回1000萬";
              }
              return "資金不足，無法投資";
            },
          },
          {
            txt: "袖手旁觀",
            effect: (g) => {
              g.yearlyMoney = 0;
              g.happy -= 20;
              return "家族企業倒閉，失去零用錢來源";
            },
          },
        ],
      },
      {
        title: "💎 繼承遺產",
        desc: "遠房親戚突然過世，留下一筆遺產給你",
        effect: (g) => {
          g.money += 3000000;
          g.happy += 10;
          return "獲得300萬遺產";
        },
      },
    ],
    genius: [
      {
        title: "🎓 獎學金機會",
        desc: "頂尖大學因你優異成績提供全額獎學金",
        effect: (g) => {
          g.intel += 20;
          g.money += 500000;
          return "智力+20，獲得50萬獎學金";
        },
      },
      {
        title: "🔬 研究突破",
        desc: "你的研究獲得重大突破",
        effect: (g) => {
          g.intel += 15;
          g.money += 200000;
          g.happy += 15;
          return "學術聲譽大增";
        },
      },
    ],
    mafia: [
      {
        title: "🗡️ 幫派鬥爭",
        desc: "敵對幫派找上門來尋仇",
        choices: [
          {
            txt: "正面對決",
            effect: (g) => {
              if (Math.random() > 0.5) {
                g.money += 1000000;
                g.health -= 20;
                g.skills.charm += 10;
                return "打贏了！搶到100萬，威名遠播";
              } else {
                g.health -= 40;
                g.money -= 500000;
                return "重傷住院，損失慘重";
              }
            },
          },
          {
            txt: "談判和解",
            effect: (g) => {
              g.money -= 300000;
              g.skills.communication += 10;
              return "花30萬擺平，學會談判技巧";
            },
          },
        ],
      },
      {
        title: "💰 地盤擴張",
        desc: "有機會擴張家族勢力範圍",
        effect: (g) => {
          if (g.money >= 500000) {
            g.money -= 500000;
            g.yearlyMoney += 10000;
            return "投資50萬擴張地盤，年收入+1萬";
          }
          return "資金不足";
        },
      },
    ],
    hacker: [
      {
        title: "💻 暗網委託",
        desc: "收到高額駭客任務委託，但可能違法",
        choices: [
          {
            txt: "接受任務",
            effect: (g) => {
              if (g.skills.programming > 80) {
                g.money += 2000000;
                g.skills.programming += 10;
                return "任務成功！賺200萬，技術大增";
              } else {
                g.happy -= 15;
                g.money -= 100000;
                return "技術不足導致失敗，損失10萬";
              }
            },
          },
          {
            txt: "拒絕任務",
            effect: (g) => {
              g.happy += 5;
              g.intel += 3;
              return "保持道德底線，心安理得";
            },
          },
        ],
      },
      {
        title: "🛡️ 資安漏洞發現",
        desc: "發現重大資安漏洞",
        effect: (g) => {
          g.skills.programming += 15;
          g.money += 500000;
          return "獲得漏洞獎金50萬";
        },
      },
    ],
    royal: [
      {
        title: "👑 皇室召見",
        desc: "遠房皇室親戚邀請參加貴族宴會",
        effect: (g) => {
          g.skills.charm += 15;
          g.skills.communication += 10;
          g.money += 500000;
          return "社交圈大幅提升，魅力+15";
        },
      },
      {
        title: "💍 聯姻提議",
        desc: "其他貴族家族提出聯姻",
        choices: [
          {
            txt: "接受聯姻",
            effect: (g) => {
              g.money += 5000000;
              g.happy -= 20;
              return "獲得500萬嫁妝但失去自由";
            },
          },
          {
            txt: "拒絕聯姻",
            effect: (g) => {
              g.happy += 15;
              return "追求真愛，心靈自由";
            },
          },
        ],
      },
    ],
    monk: [
      {
        title: "🙏 頓悟時刻",
        desc: "修行時突然開悟，身心靈得到昇華",
        effect: (g) => {
          g.happy += 30;
          g.intel += 10;
          g.health += 15;
          return "身心靈全面提升";
        },
      },
      {
        title: "📿 雲遊四方",
        desc: "師父建議你雲遊參學",
        effect: (g) => {
          g.intel += 15;
          g.skills.communication += 10;
          g.happy += 20;
          return "見識大增，心胸開闊";
        },
      },
    ],
    esports: [
      {
        title: "🎮 戰隊邀請",
        desc: "頂級職業戰隊想高薪簽約你",
        choices: [
          {
            txt: "簽約當選手",
            effect: (g) => {
              g.jobId = "esports_player";
              g.money += 800000;
              g.happy += 20;
              return "成為職業選手，簽約金80萬";
            },
          },
          {
            txt: "拒絕簽約",
            effect: (g) => {
              g.intel += 5;
              return "專注本業發展";
            },
          },
        ],
      },
      {
        title: "🏆 比賽邀請",
        desc: "受邀參加電競比賽",
        effect: (g) => {
          if (Math.random() > 0.6) {
            g.money += 500000;
            g.happy += 20;
            return "奪冠！獲得獎金50萬";
          } else {
            g.happy += 5;
            return "雖敗猶榮，獲得經驗";
          }
        },
      },
    ],
    spy: [
      {
        title: "🕵️ 機密任務",
        desc: "父親希望你協助執行情報工作",
        choices: [
          {
            txt: "接受任務",
            effect: (g) => {
              if (g.intel > 90) {
                g.money += 1500000;
                g.health -= 10;
                g.intel += 10;
                return "任務成功！賺150萬但有一定風險";
              } else {
                g.happy -= 10;
                g.health -= 15;
                return "能力不足，任務失敗";
              }
            },
          },
          {
            txt: "拒絕任務",
            effect: (g) => {
              g.happy += 5;
              return "選擇平凡生活";
            },
          },
        ],
      },
      {
        title: "🔐 破譯密碼",
        desc: "發現神秘加密訊息",
        effect: (g) => {
          if (g.intel > 100) {
            g.money += 800000;
            g.intel += 15;
            return "成功破譯，獲得80萬獎勵";
          }
          return "難度太高，無法破譯";
        },
      },
    ],
    chef_family: [
      {
        title: "🍳 美食大賽",
        desc: "受邀參加國際烹飪大賽",
        effect: (g) => {
          if (g.skills.cooking > 80) {
            g.money += 1000000;
            g.skills.cooking += 20;
            g.happy += 25;
            return "奪冠！獲得100萬獎金";
          } else {
            g.skills.cooking += 10;
            g.happy += 10;
            return "雖未得獎但技術精進";
          }
        },
      },
      {
        title: "⭐ 米其林評鑑",
        desc: "米其林評審來訪餐廳",
        effect: (g) => {
          g.skills.cooking += 15;
          g.money += 500000;
          g.happy += 20;
          return "獲得星級認證，名聲大噪";
        },
      },
    ],
    fashion: [
      {
        title: "👗 時裝週邀請",
        desc: "巴黎時裝週邀請你走秀",
        effect: (g) => {
          g.skills.charm += 20;
          g.money += 800000;
          g.happy += 15;
          return "大放異彩，魅力+20";
        },
      },
      {
        title: "📸 時尚雜誌封面",
        desc: "國際時尚雜誌想邀你當封面",
        effect: (g) => {
          g.skills.charm += 15;
          g.money += 500000;
          return "登上封面，知名度大增";
        },
      },
    ],
    scientist_family: [
      {
        title: "🔬 論文發表",
        desc: "你的研究論文受到學界關注",
        effect: (g) => {
          g.intel += 20;
          g.money += 1000000;
          g.happy += 15;
          return "學術地位提升，獲得研究經費";
        },
      },
      {
        title: "🏅 科學獎項",
        desc: "獲得重要科學獎項提名",
        effect: (g) => {
          if (g.intel > 120) {
            g.money += 5000000;
            g.intel += 25;
            g.happy += 30;
            return "獲獎！得到500萬獎金";
          } else {
            g.intel += 10;
            return "雖未獲獎但備受肯定";
          }
        },
      },
    ],
  };

  const originId = Game.originId;
  const events = originEvents[originId];

  if (events && events.length > 0) {
    const event = events[Math.floor(Math.random() * events.length)];

    if (event.choices) {
      showOriginEventModal(event);
    } else if (event.effect) {
      const result = event.effect(Game);
      log(`🎭 【${Game.origin}專屬】${event.title}：${result}`);
      Game.totalEvents++;
    }
  }
}

function showOriginEventModal(event) {
  document.getElementById("ev-title").textContent =
    `【${Game.origin}專屬】${event.title}`;
  document.getElementById("ev-desc").textContent = event.desc;

  const btnA = document.getElementById("btn-choice-a");
  const btnB = document.getElementById("btn-choice-b");

  btnA.textContent = event.choices[0].txt;
  btnB.textContent = event.choices[1].txt;

  btnA.onclick = () => {
    const result = event.choices[0].effect(Game);
    log(`🎭 【${Game.origin}專屬】${event.title}`);
    log(`   └─ 選擇：${event.choices[0].txt} → ${result}`);
    closeModal();
    updateUI();
    checkAchievements();
  };

  btnB.onclick = () => {
    const result = event.choices[1].effect(Game);
    log(`🎭 【${Game.origin}專屬】${event.title}`);
    log(`   └─ 選擇：${event.choices[1].txt} → ${result}`);
    closeModal();
    updateUI();
    checkAchievements();
  };

  document.getElementById("event-modal").style.display = "flex";
}
function saveGame() {
  const saveData = {
    version: "17.0",
    timestamp: Date.now(),
    player: Game.name,
    age: Game.age,
    money: Game.money,
    health: Game.health,
    happy: Game.happy,
    intel: Game.intel,
    stamina: Game.stamina,
    skills: { ...Game.skills },
    job: Game.job,
    origin: Game.origin,
    traits: [...Game.traits],
    talents: [...Game.talents],
    inventory: [...Game.inventory],
    npcs: Game.npcs.map((n) => ({ ...n })),
    unlockedAchievements: [...Game.unlockedAchievements],
    stats: { ...Game.stats },
    lifeStage: Game.lifeStage,
    partner: Game.partner,
    gender: Game.gender,

    // ✅ 補上這些遺漏的重要變數
    children: Game.children || [],
    mortgage: Game.mortgage || {},
    inflationRate: Game.inflationRate || 1.0,
    yearsPassed: Game.yearsPassed || 0,
    debtYears: Game.debtYears || 0,
    hasBeenInDebt: Game.hasBeenInDebt || false,
  };

  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    if (typeof showPopup === "function") showPopup("💾 存檔成功！", "green");
    return true;
  } catch (e) {
    console.error("存檔錯誤:", e);
    return false;
  }
}

function loadGame() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) {
      if (typeof showPopup === "function") showPopup("❌ 沒有存檔記錄", "red");
      else alert("❌ 沒有存檔記錄");
      return false;
    }

    const data = JSON.parse(saved);

    Game.name = data.player;
    Game.age = data.age;
    Game.money = data.money;
    Game.health = data.health;
    Game.happy = data.happy;
    Game.intel = data.intel;
    Game.stamina = data.stamina;
    Game.skills = data.skills;
    Game.job = data.job;
    Game.origin = data.origin;
    Game.traits = data.traits || [];
    Game.talents = data.talents || [];
    Game.inventory = data.inventory || [];
    Game.npcs = data.npcs || [];
    Game.unlockedAchievements = data.unlockedAchievements || [];
    Game.stats = data.stats || {};
    Game.lifeStage = data.lifeStage;
    Game.partner = data.partner;
    Game.gender = data.gender;

    // ✅ 補上遺漏的讀取邏輯
    Game.children = data.children || [];
    Game.mortgage = data.mortgage || {
      active: false,
      totalAmount: 0,
      remaining: 0,
      monthlyPayment: 0,
      years: 0,
    };
    Game.inflationRate = data.inflationRate || 1.0;
    Game.yearsPassed = data.yearsPassed || 0;
    Game.debtYears = data.debtYears || 0;
    Game.hasBeenInDebt = data.hasBeenInDebt || false;

    document.getElementById("scene-creation").style.display = "none";
    document.getElementById("scene-game").classList.add("active");
    document.getElementById("scene-game").style.display = "block";

    updateUI();

    const date = new Date(data.timestamp);
    if (typeof showPopup === "function") {
      showPopup(`✅ 讀取成功！\n${date.toLocaleString("zh-TW")}`, "green");
    }
    return true;
  } catch (e) {
    console.error("讀檔錯誤:", e);
    alert("❌ 讀檔失敗");
    return false;
  }
}
// ✅ 補上缺失的 showModal 函數
function showModal(title, description, actions) {
  const modal = document.getElementById("event-modal");
  document.getElementById("ev-title").textContent = title;
  document.getElementById("ev-desc").textContent = description;

  const btnA = document.getElementById("btn-choice-a");
  const btnB = document.getElementById("btn-choice-b");

  // 先隱藏所有按鈕
  btnA.style.display = "none";
  btnB.style.display = "none";

  // 設定按鈕 A
  if (actions && actions[0]) {
    btnA.textContent = actions[0].text;
    btnA.style.display = "block";
    btnA.onclick = actions[0].action;
  }

  // 設定按鈕 B
  if (actions && actions[1]) {
    btnB.textContent = actions[1].text;
    btnB.style.display = "block";
    btnB.onclick = actions[1].action;
  }

  modal.style.display = "flex";
}
initCreation();