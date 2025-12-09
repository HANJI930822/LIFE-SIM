const SAVE_KEY = "lifeSimV17_save";
const TALENTS = [
  {
    id: "t1",
    name: "過目不忘",
    desc: "學習效率+50%",
    type: "good",
    effect: (g) => {
      g.learnBonus = 1.5;
    },
  },
  {
    id: "t2",
    name: "天生神力",
    desc: "健康衰退減半",
    type: "good",
    effect: (g) => {
      g.healthDecay = 0.5;
    },
  },
  {
    id: "t3",
    name: "萬人迷",
    desc: "魅力+20，社交效果+30%",
    type: "good",
    effect: (g) => {
      g.skills.charm += 20;
      g.socialBonus = 1.3;
    },
  },
  {
    id: "t4",
    name: "投資眼光",
    desc: "被動收入+20%",
    type: "good",
    effect: (g) => {
      g.incomeBonus = 1.2;
    },
  },
  {
    id: "t5",
    name: "玻璃心",
    desc: "快樂值下降加倍",
    type: "bad",
    effect: (g) => {
      g.happyDecay = 2;
    },
  },
  {
    id: "t6",
    name: "體弱多病",
    desc: "初始健康-20",
    type: "bad",
    effect: (g) => {
      g.health -= 20;
    },
  },
  {
    id: "t7",
    name: "社交恐懼",
    desc: "魅力-15",
    type: "bad",
    effect: (g) => {
      g.skills.charm -= 15;
    },
  },
  {
    id: "t8",
    name: "富二代心態",
    desc: "工作收入-30%",
    type: "bad",
    effect: (g) => {
      g.workPenalty = 0.7;
    },
  },
  {
    id: "t9",
    name: "天賦異稟",
    desc: "所有技能成長+20%",
    type: "good",
    effect: (g) => {
      g.skillBonus = 1.2;
    },
  },
  {
    id: "t10",
    name: "幸運星",
    desc: "隨機事件正面結果+10%",
    type: "good",
    effect: (g) => {
      g.luckBonus = 0.1;
    },
  },
];
const RANDOM_EVENTS = [
  // === 💰 金錢事件 ===
  {
    title: "💰 路上撿到錢",
    desc: "走路時在地上發現一個錢包",
    choices: [
      {
        text: "送交警察局",
        effect: (g) => {
          g.happy += 10;
          return "做了好事心情很好";
        },
      },
      {
        text: "拿走現金",
        effect: (g) => {
          const money = Math.floor(Math.random() * 50000) + 10000;
          g.money += money;
          g.happy -= 5;
          return `拿到 $${money.toLocaleString()}，但有點心虛`;
        },
      },
    ],
  },
  {
    title: "🎰 朋友邀你投資",
    desc: "朋友說有個穩賺不賠的投資機會",
    choices: [
      {
        text: "投資 $50,000",
        effect: (g) => {
          if (g.money < 50000) return "錢不夠";
          g.money -= 50000;
          if (Math.random() > 0.5) {
            g.money += 100000;
            return "🎉 賺了 $50,000！";
          } else {
            return "😢 血本無歸...";
          }
        },
      },
      {
        text: "拒絕",
        effect: (g) => {
          return "保住了錢包";
        },
      },
    ],
  },
  {
    title: "🏆 中獎了",
    desc: "發票對中獎號",
    effect: (g) => {
      const prizes = [200, 1000, 10000, 200000, 10000000];
      const prize = prizes[Math.floor(Math.random() * prizes.length)];
      g.money += prize;
      g.happy += 20;
      return `中了 $${prize.toLocaleString()}！`;
    },
  },

  // === ❤️ 健康事件 ===
  {
    title: "🤒 感冒了",
    desc: "身體不舒服",
    effect: (g) => {
      g.health -= 10;
      g.money -= 1000;
      return "看醫生花了 $1,000";
    },
  },
  {
    title: "🏃 參加路跑",
    desc: "朋友邀你參加馬拉松",
    choices: [
      {
        text: "參加",
        effect: (g) => {
          g.health += 15;
          g.happy += 10;
          g.stamina -= 30;
          return "完成比賽！身體更健康了";
        },
      },
      {
        text: "拒絕",
        effect: (g) => {
          return "待在家裡休息";
        },
      },
    ],
  },
  {
    title: "💊 發現保健食品",
    desc: "藥局推薦保健食品",
    choices: [
      {
        text: "購買 ($5,000)",
        effect: (g) => {
          g.money -= 5000;
          g.health += 10;
          g.healthDecay *= 0.9;
          return "長期服用改善了健康";
        },
      },
      {
        text: "不買",
        effect: (g) => {
          return "省下一筆錢";
        },
      },
    ],
  },

  // === 😊 快樂事件 ===
  {
    title: "🎮 新遊戲發售",
    desc: "期待已久的遊戲終於上市了",
    choices: [
      {
        text: "購買 ($2,000)",
        effect: (g) => {
          g.money -= 2000;
          g.happy += 25;
          return "玩得超開心！";
        },
      },
      {
        text: "忍住不買",
        effect: (g) => {
          g.happy -= 10;
          return "好想玩...";
        },
      },
    ],
  },
  {
    title: "🎬 朋友約看電影",
    desc: "朋友邀你去看最新電影",
    choices: [
      {
        text: "一起去 ($500)",
        effect: (g) => {
          g.money -= 500;
          g.happy += 15;
          g.skills.communication += 2;
          return "度過愉快的時光";
        },
      },
      {
        text: "婉拒",
        effect: (g) => {
          return "在家休息";
        },
      },
    ],
  },
  {
    title: "🎉 生日派對",
    desc: "今天是你的生日",
    effect: (g) => {
      const gifts = Math.floor(Math.random() * 20000) + 5000;
      g.money += gifts;
      g.happy += 30;
      return `收到 $${gifts.toLocaleString()} 的紅包！`;
    },
  },

  // === 🧠 學習事件 ===
  {
    title: "📚 發現好書",
    desc: "在書店發現一本好書",
    choices: [
      {
        text: "購買 ($800)",
        effect: (g) => {
          g.money -= 800;
          g.intel += 5;
          g.happy += 10;
          return "獲得了新知識";
        },
      },
      {
        text: "不買",
        effect: (g) => {
          return "改天再說";
        },
      },
    ],
  },
  {
    title: "💻 線上課程優惠",
    desc: "看到有興趣的線上課程打折",
    choices: [
      {
        text: "購買 ($3,000)",
        effect: (g) => {
          g.money -= 3000;
          g.intel += 8;
          const skills = ["programming", "art", "finance", "communication"];
          const skill = skills[Math.floor(Math.random() * skills.length)];
          g.skills[skill] += 15;
          return `學到新技能！`;
        },
      },
      {
        text: "放棄",
        effect: (g) => {
          return "省下錢";
        },
      },
    ],
  },

  // === 👥 社交事件 ===
  {
    title: "🎭 社交聚會",
    desc: "被邀請參加聚會",
    choices: [
      {
        text: "參加 ($1,500)",
        effect: (g) => {
          g.money -= 1500;
          g.happy += 15;
          g.skills.charm += 5;
          g.skills.communication += 5;
          if (Math.random() > 0.6) {
            addFriend();
            return "認識了新朋友！";
          }
          return "度過愉快的夜晚";
        },
      },
      {
        text: "不去",
        effect: (g) => {
          return "宅在家裡";
        },
      },
    ],
  },
  {
    title: "💼 人脈介紹",
    desc: "朋友介紹重要人士給你認識",
    effect: (g) => {
      g.skills.communication += 10;
      g.skills.charm += 5;
      addFriend();
      return "建立了有用的人脈";
    },
  },

  // === ⚠️ 危機事件 ===
  {
    title: "🚗 車禍",
    desc: "不小心發生車禍",
    effect: (g) => {
      g.health -= 20;
      g.money -= 30000;
      g.happy -= 15;
      return "受傷住院，花了 $30,000";
    },
  },
  {
    title: "📱 手機壞了",
    desc: "手機摔壞了",
    choices: [
      {
        text: "買新的 ($20,000)",
        effect: (g) => {
          g.money -= 20000;
          g.happy += 5;
          return "換了新手機";
        },
      },
      {
        text: "修理 ($3,000)",
        effect: (g) => {
          g.money -= 3000;
          return "修好了";
        },
      },
      {
        text: "湊合著用",
        effect: (g) => {
          g.happy -= 10;
          return "用得很不方便...";
        },
      },
    ],
  },
  {
    title: "🏠 房東漲租",
    desc: "房東說要漲房租",
    choices: [
      {
        text: "接受",
        effect: (g) => {
          g.yearlyMoney -= 12000;
          return "每月多付 $1,000";
        },
      },
      {
        text: "搬家",
        effect: (g) => {
          g.money -= 10000;
          g.stamina -= 20;
          return "搬家花了 $10,000";
        },
      },
    ],
  },

  // === 🎁 驚喜事件 ===
  {
    title: "🎰 刮刮樂",
    desc: "路過買了刮刮樂",
    effect: (g) => {
      g.money -= 100;
      if (Math.random() > 0.8) {
        const prize = Math.floor(Math.random() * 100000) + 1000;
        g.money += prize;
        g.happy += 30;
        return `中了 $${prize.toLocaleString()}！`;
      }
      return "沒中獎";
    },
  },
  {
    title: "📦 網購驚喜",
    desc: "收到意外的包裹",
    effect: (g) => {
      g.happy += 20;
      return "原來是之前買的東西到了！";
    },
  },
  {
    title: "☀️ 好天氣",
    desc: "今天天氣特別好",
    effect: (g) => {
      g.happy += 10;
      g.health += 5;
      return "心情愉快！";
    },
  },

  // === 💼 工作事件 ===
  {
    title: "💰 年終獎金",
    desc: "公司發年終獎金",
    effect: (g) => {
      if (g.jobId === "none") return "你沒有工作";
      const bonus = Math.floor(Math.random() * 100000) + 50000;
      g.money += bonus;
      g.happy += 25;
      return `領到 $${bonus.toLocaleString()} 年終！`;
    },
  },
  {
    title: "📈 升職機會",
    desc: "老闆提出升職",
    effect: (g) => {
      if (g.jobId === "none") return "你沒有工作";
      g.incomeBonus *= 1.2;
      g.happy += 20;
      return "薪水增加 20%！";
    },
  },
  {
    title: "😰 工作壓力",
    desc: "最近工作壓力很大",
    choices: [
      {
        text: "咬牙撐過",
        effect: (g) => {
          g.health -= 15;
          g.happy -= 20;
          g.money += 30000;
          return "賺了加班費但很累";
        },
      },
      {
        text: "請假休息",
        effect: (g) => {
          g.money -= 10000;
          g.health += 10;
          g.happy += 15;
          return "身心獲得休息";
        },
      },
    ],
  },
  {
    title: "🎯 投資機會",
    desc: "有人向你推薦投資項目",
    condition: () => Game.traits.some((t) => t.id === "businessmind"),
    effect: (g) => {
      if (g.money < 100000) return "資金不足";
      g.money -= 100000;
      const success = Math.random() > 0.3; // 商業頭腦提高成功率到70%
      if (success) {
        g.money += 250000;
        if (!g.successfulInvestments) g.successfulInvestments = 0;
        g.successfulInvestments++;
        return "💰 商業頭腦讓你賺了 $150,000！";
      } else {
        return "😢 投資失敗，損失 $100,000";
      }
    },
  },

  // 特質事件2：藝術比賽（需要藝術天賦）
  {
    title: "🎨 藝術比賽",
    desc: "看到藝術比賽的海報",
    condition: () => Game.traits.some((t) => t.id === "artistic"),
    choices: [
      {
        text: "參加比賽",
        effect: (g) => {
          g.stamina -= 30;
          const prize = Math.floor(Math.random() * 50000) + 20000;
          g.money += prize;
          g.happy += 20;
          g.skills.art += 10;
          return `🏆 藝術天賦讓你得獎！獲得 $${prize.toLocaleString()}`;
        },
      },
      {
        text: "不參加",
        effect: (g) => {
          return "下次再說";
        },
      },
    ],
  },

  // 特質事件3：駭客馬拉松（需要科技達人）
  {
    title: "💻 駭客馬拉松",
    desc: "科技公司舉辦駭客松",
    condition: () => Game.traits.some((t) => t.id === "techsavvy"),
    choices: [
      {
        text: "參加",
        effect: (g) => {
          g.stamina -= 40;
          g.skills.programming += 15;
          if (Math.random() > 0.5) {
            g.money += 100000;
            return "🏆 科技達人贏得首獎 $100,000！";
          } else {
            g.money += 30000;
            return "🎉 獲得參加獎 $30,000";
          }
        },
      },
      {
        text: "不參加",
        effect: (g) => {
          return "太累了";
        },
      },
    ],
  },

  // 特質事件4：意外好運（需要幸運特質）
  {
    title: "🎲 意外好運",
    desc: "今天運氣特別好",
    condition: () => Game.traits.some((t) => t.id === "lucky"),
    effect: (g) => {
      const bonus = Math.floor(Math.random() * 100000) + 50000;
      g.money += bonus;
      g.happy += 15;
      if (!g.luckyEventCount) g.luckyEventCount = 0;
      g.luckyEventCount++;
      return `🍀 幸運特質發動！意外之財 $${bonus.toLocaleString()}`;
    },
  },

  // 特質事件5：壓力事件（特質影響反應）
  {
    title: "😰 壓力事件",
    desc: "遇到讓人焦慮的事",
    effect: (g) => {
      if (g.traits.some((t) => t.id === "optimistic")) {
        g.happy -= 5;
        return "🌟 樂觀特質讓你很快恢復心情";
      } else if (g.traits.some((t) => t.id === "pessimistic")) {
        g.happy -= 25;
        g.health -= 10;
        if (!g.negativeEvents) g.negativeEvents = 0;
        g.negativeEvents++;
        return "😰 陷入深深的焦慮...";
      } else {
        g.happy -= 15;
        return "心情有點低落";
      }
    },
  },

  // 特質事件6：體育挑戰（需要強健體魄）
  {
    title: "🏃 體育挑戰",
    desc: "朋友約你參加三鐵比賽",
    condition: () => Game.traits.some((t) => t.id === "athletic"),
    choices: [
      {
        text: "參加",
        effect: (g) => {
          g.health += 20;
          g.stamina -= 50;
          g.money += 50000;
          return "🏅 強健體魄讓你輕鬆完賽並獲獎！";
        },
      },
      {
        text: "不參加",
        effect: (g) => {
          return "改天吧";
        },
      },
    ],
  },

  // 特質事件7：演講邀請（需要魅力或外向）
  {
    title: "🎤 演講邀請",
    desc: "受邀到大學演講",
    condition: () =>
      Game.traits.some((t) => t.id === "charismatic") ||
      Game.traits.some((t) => t.id === "extrovert"),
    choices: [
      {
        text: "接受邀請",
        effect: (g) => {
          g.money += 30000;
          g.skills.communication += 10;
          g.skills.charm += 8;
          g.happy += 15;
          return "✨ 魅力特質讓你的演講大受歡迎！";
        },
      },
      {
        text: "婉拒",
        effect: (g) => {
          return "太緊張了";
        },
      },
    ],
  },

  // 特質事件8：學術研討會（需要天才頭腦+博士學歷）
  {
    title: "📚 學術研討會",
    desc: "受邀參加國際研討會",
    condition: () =>
      Game.traits.some((t) => t.id === "geniusmind") &&
      Game.education === "phd",
    effect: (g) => {
      g.intel += 15;
      g.skills.communication += 10;
      g.money += 50000;
      g.happy += 20;
      return "🎓 天才頭腦讓你在學術界大放異彩！";
    },
  },

  // 特質事件9：創業機會（需要勇敢特質）
  {
    title: "💡 創業機會",
    desc: "朋友邀你一起創業",
    condition: () => Game.traits.some((t) => t.id === "brave"),
    choices: [
      {
        text: "投資 $500,000",
        effect: (g) => {
          if (g.money < 500000) return "資金不足";
          g.money -= 500000;
          const success = Math.random() > 0.4;
          if (success) {
            g.money += 2000000;
            return "🚀 勇敢的決策讓你賺了 $1,500,000！";
          } else {
            return "😢 創業失敗...";
          }
        },
      },
      {
        text: "拒絕",
        effect: (g) => {
          return "太冒險了";
        },
      },
    ],
  },

  // 特質事件10：孤獨感（內向者影響較小）
  {
    title: "😔 孤獨感",
    desc: "感覺有點孤單",
    effect: (g) => {
      if (g.traits.some((t) => t.id === "introvert")) {
        g.happy -= 3;
        return "🤫 內向的你享受獨處時光";
      } else if (g.traits.some((t) => t.id === "extrovert")) {
        g.happy -= 15;
        return "😢 外向的你很需要社交...";
      } else {
        g.happy -= 8;
        return "有點寂寞";
      }
    },
  },
];
// ===== 個人特質系統 =====
const TRAITS = [
  // 38个特质
  // ===== 20个性格特质 =====
  {
    id: "optimistic",
    name: "🌟 樂觀主義者",
    desc: "總是看到事情光明的一面",
    detailedEffect: "快樂衰減 -30%\n初始快樂 +10",
    category: "personality",
    conflictWith: ["pessimistic"], // ✅ 与悲观冲突
    effect: (g) => {
      g.happyDecay *= 0.7;
      g.happy += 10;
    },
    unlock: "default",
  },

  {
    id: "pessimistic",
    name: "😔 悲觀主義者",
    desc: "容易陷入負面情緒",
    detailedEffect: "快樂衰減 +10%\n智力 +5",
    category: "personality",
    isNegative: true, // ✅ 标记为负面特质
    reward: { money: 50000, intel: 5 }, // ✅ 负面奖励
    conflictWith: ["optimistic"],
    effect: (g) => {
      g.happyDecay *= 1.1;
      g.intel += 5;
    },
    unlock: "default",
  },

  {
    id: "extrovert",
    name: "🎉 外向",
    desc: "善於社交，容易交朋友",
    detailedEffect: "社交效果 +30%\n魅力 +10\n初始好感 +5",
    category: "personality",
    conflictWith: ["introvert"],
    effect: (g) => {
      g.socialBonus *= 1.3;
      g.skills.charm += 10;
    },
    unlock: "default",
  },

  {
    id: "introvert",
    name: "📚 內向",
    desc: "喜歡獨處，深度思考",
    detailedEffect: "學習效率 +30%\n溝通 -5\n魅力成長 -2\n初始智力 +20",
    category: "personality",
    isNegative: true,
    reward: { intel: 20, money: 30000 },
    conflictWith: ["extrovert"],
    effect: (g) => {
      g.learnBonus *= 1.3;
      g.skills.communication -= 5;
    },
    unlock: "default",
  },

  {
    id: "brave",
    name: "💪 勇敢",
    desc: "不畏艱難，勇於挑戰",
    detailedEffect: "健康 +10\n魅力 +5\n投資成功率 +30%\n風險工作收入 +5%",
    category: "personality",
    conflictWith: ["cautious"],
    effect: (g) => {
      g.health += 10;
      g.skills.charm += 5;
    },
    unlock: "default",
  },

  {
    id: "cautious",
    name: "🛡️ 謹慎",
    desc: "小心謹慎，規避風險",
    detailedEffect: "健康衰減 -20%\n快樂 -5\n投資失敗損失 -50%",
    category: "personality",
    isNegative: true,
    reward: { money: 40000, health: 15 },
    conflictWith: ["brave", "impulsive"],
    effect: (g) => {
      g.healthDecay *= 0.8;
      g.happy -= 5;
    },
    unlock: "default",
  },

  {
    id: "ambitious",
    name: "🔥 野心勃勃",
    desc: "追求成功與財富",
    detailedEffect: "收入加成 +20%\n快樂 -10\n工作收入 +30%",
    category: "personality",
    conflictWith: ["content", "laidback"],
    effect: (g) => {
      g.incomeBonus *= 1.2;
      g.happy -= 10;
    },
    unlock: "default",
  },

  {
    id: "content",
    name: "😌 知足常樂",
    desc: "容易感到滿足",
    detailedEffect: "快樂 +15\n收入減少 -10%\n快樂衰減 -40%",
    category: "personality",
    conflictWith: ["ambitious", "competitive"],
    effect: (g) => {
      g.happy += 15;
      g.incomeBonus *= 0.9;
      g.happyDecay *= 0.6;
    },
    unlock: "default",
  },

  {
    id: "stubborn",
    name: "😤 固執",
    desc: "堅持己見，不易改變",
    detailedEffect: "智力 +5\n社交效果 -20%\n魅力 -5",
    category: "personality",
    isNegative: true,
    reward: { intel: 10, money: 35000 },
    conflictWith: ["flexible"],
    effect: (g) => {
      g.intel += 5;
      g.socialBonus *= 0.8;
      g.skills.charm -= 5;
    },
    unlock: "default",
  },

  {
    id: "flexible",
    name: "🌊 靈活",
    desc: "適應力強，隨機應變",
    detailedEffect: "溝通 +10\n魅力 +10\n社交效果 +20%",
    category: "personality",
    conflictWith: ["stubborn"],
    effect: (g) => {
      g.skills.communication += 10;
      g.skills.charm += 10;
      g.socialBonus *= 1.2;
    },
    unlock: "default",
  },

  {
    id: "competitive",
    name: "🏆 好勝",
    desc: "不甘落後，力爭上游",
    detailedEffect: "技能成長 +20%\n快樂 -5",
    category: "personality",
    conflictWith: ["laidback", "content"],
    effect: (g) => {
      g.skillBonus *= 1.2;
      g.happy -= 5;
    },
    unlock: "default",
  },

  {
    id: "laidback",
    name: "😎 隨性",
    desc: "不急不徐，隨遇而安",
    detailedEffect: "快樂 +10\n技能成長 -10%\n健康衰減 -20%",
    category: "personality",
    isNegative: true,
    reward: { happy: 15, money: 25000 },
    conflictWith: ["competitive", "ambitious"],
    effect: (g) => {
      g.happy += 10;
      g.skillBonus *= 0.9;
      g.healthDecay *= 0.8;
    },
    unlock: "default",
  },

  {
    id: "honest",
    name: "🤝 誠實",
    desc: "坦誠待人，值得信賴",
    detailedEffect: "NPC好感成長 +5\n收入 -10%\n社交 +15%",
    category: "personality",
    conflictWith: ["cunning"],
    effect: (g) => {
      g.socialBonus *= 1.15;
      g.incomeBonus *= 0.9;
    },
    unlock: "default",
  },

  {
    id: "cunning",
    name: "🦊 狡猾",
    desc: "善於算計，懂得取巧",
    detailedEffect: "收入加成 +30%\n快樂 -5\nNPC好感 -3",
    category: "personality",
    conflictWith: ["honest"],
    effect: (g) => {
      g.incomeBonus *= 1.3;
      g.happy -= 5;
    },
    unlock: "default",
  },

  {
    id: "impulsive",
    name: "⚡ 衝動",
    desc: "衝動行事，不計後果",
    detailedEffect: "快樂 +5\n隨機事件機率 +50%\n投資波動 +30%",
    category: "personality",
    isNegative: true,
    reward: { money: 45000, charm: 10 },
    conflictWith: ["thoughtful", "cautious"],
    effect: (g) => {
      g.happy += 5;
      g.luckBonus += 0.1;
    },
    unlock: "default",
  },

  {
    id: "thoughtful",
    name: "🤔 深思熟慮",
    desc: "三思而後行",
    detailedEffect: "智力 +8\n快樂 -3\n學習效率 +20%",
    category: "personality",
    conflictWith: ["impulsive"],
    effect: (g) => {
      g.intel += 8;
      g.happy -= 3;
    },
    unlock: "default",
  },

  {
    id: "romantic",
    name: "💕 浪漫主義",
    desc: "追求浪漫與情感",
    detailedEffect: "魅力 +12\n快樂 +8\n戀愛成功率 +40%",
    category: "personality",
    conflictWith: ["realistic"],
    effect: (g) => {
      g.skills.charm += 12;
      g.happy += 8;
    },
    unlock: "default",
  },

  {
    id: "realistic",
    name: "💼 現實主義",
    desc: "注重實際利益",
    detailedEffect: "智力 +5\n金融 +10\n快樂 -5",
    category: "personality",
    conflictWith: ["romantic"],
    effect: (g) => {
      g.intel += 5;
      g.skills.finance += 10;
      g.happy -= 5;
    },
    unlock: "default",
  },

  {
    id: "humorous",
    name: "😄 幽默風趣",
    desc: "善於製造歡樂氣氛",
    detailedEffect: "魅力 +15\n快樂 +10\n社交效果 +25%",
    category: "personality",
    conflictWith: ["serious"],
    effect: (g) => {
      g.skills.charm += 15;
      g.happy += 10;
      g.socialBonus *= 1.25;
    },
    unlock: "default",
  },

  {
    id: "serious",
    name: "😐 嚴肅",
    desc: "做事認真，不苟言笑",
    detailedEffect: "智力 +10\n魅力 -8\n工作效率 +20%",
    category: "personality",
    isNegative: true,
    reward: { intel: 15, money: 40000 },
    conflictWith: ["humorous"],
    effect: (g) => {
      g.intel += 10;
      g.skills.charm -= 8;
    },
    unlock: "default",
  },

  // ===== 12个能力特质 =====
  {
    id: "quicklearner",
    name: "🧠 快速學習",
    desc: "學習能力超群",
    detailedEffect: "學習效率 +40%\n技能成長 +50%",
    category: "ability",
    effect: (g) => {
      g.learnBonus *= 1.4;
    },
    unlock: "default",
  },

  {
    id: "athletic",
    name: "🏃 運動健將",
    desc: "體能優異",
    detailedEffect: "健康 +15\n體力上限 +20\n初始體力 +50%",
    category: "ability",
    effect: (g) => {
      g.health += 15;
      g.maxStamina += 20;
      g.stamina += 20;
    },
    unlock: "default",
  },

  {
    id: "artistic",
    name: "🎨 藝術天賦",
    desc: "藝術感知力強",
    detailedEffect: "藝術 +20\n魅力 +15\n藝術類職業收入 +50%",
    category: "ability",
    effect: (g) => {
      g.skills.art += 20;
      g.skills.charm += 15;
    },
    unlock: "default",
  },

  {
    id: "charismatic",
    name: "✨ 魅力非凡",
    desc: "天生的領袖氣質",
    detailedEffect: "魅力 +15\n社交效果 +30%\n初始好感 +3",
    category: "ability",
    effect: (g) => {
      g.skills.charm += 15;
      g.socialBonus *= 1.3;
    },
    unlock: "default",
  },

  {
    id: "businessmind",
    name: "💰 商業頭腦",
    desc: "天生的商業嗅覺",
    detailedEffect: "收入加成 +30%\n金融 +15\n創業成功率 +50%",
    category: "ability",
    effect: (g) => {
      g.incomeBonus *= 1.3;
      g.skills.finance += 15;
    },
    unlock: "default",
  },

  {
    id: "techsavvy",
    name: "💻 科技達人",
    desc: "精通科技",
    detailedEffect: "程式 +20\n智力 +5\n科技類職業收入 +30%",
    category: "ability",
    effect: (g) => {
      g.skills.programming += 20;
      g.intel += 5;
    },
    unlock: "default",
  },

  {
    id: "medicaltalent",
    name: "⚕️ 醫學天賦",
    desc: "醫學潛力驚人",
    detailedEffect: "醫療 +25\n智力 +8\n健康衰減 -15%",
    category: "ability",
    effect: (g) => {
      g.skills.medical += 25;
      g.intel += 8;
      g.healthDecay *= 0.85;
    },
    unlock: "default",
  },

  {
    id: "culinarygenius",
    name: "👨‍🍳 廚藝天才",
    desc: "料理天賦異稟",
    detailedEffect: "廚藝 +30\n藝術 +10\n快樂 +5",
    category: "ability",
    effect: (g) => {
      g.skills.cooking += 30;
      g.skills.art += 10;
      g.happy += 5;
    },
    unlock: "default",
  },

  {
    id: "polyglot",
    name: "🌍 語言天才",
    desc: "精通多國語言",
    detailedEffect: "溝通 +20\n魅力 +10\n收入加成 +15%",
    category: "ability",
    effect: (g) => {
      g.skills.communication += 20;
      g.skills.charm += 10;
      g.incomeBonus *= 1.15;
    },
    unlock: "default",
  },

  {
    id: "photographicmemory",
    name: "📷 過目不忘",
    desc: "超強記憶力",
    detailedEffect: "智力 +15\n學習效率 +30%\n技能成長 +20%",
    category: "ability",
    effect: (g) => {
      g.intel += 15;
      g.learnBonus *= 1.3;
      g.skillBonus *= 1.2;
    },
    unlock: "default",
  },

  {
    id: "creative",
    name: "💡 創意無限",
    desc: "創意思維出眾",
    detailedEffect: "藝術 +15\n程式 +10\n創業收入 +25%",
    category: "ability",
    effect: (g) => {
      g.skills.art += 15;
      g.skills.programming += 10;
    },
    unlock: "default",
  },

  {
    id: "persuasive",
    name: "🗣️ 說服力強",
    desc: "口才絕佳",
    detailedEffect: "溝通 +18\n魅力 +12\n社交效果 +20%",
    category: "ability",
    effect: (g) => {
      g.skills.communication += 18;
      g.skills.charm += 12;
      g.socialBonus *= 1.2;
    },
    unlock: "default",
  },

  // ===== 6个特殊特质 =====
  {
    id: "lucky",
    name: "🍀 幸運兒",
    desc: "運氣極佳",
    detailedEffect: "幸運加成 +20%\n隨機好事機率 +50%",
    category: "special",
    effect: (g) => {
      g.luckBonus += 0.2;
    },
    unlock: "event",
  },

  {
    id: "workaholic",
    name: "💼 工作狂",
    desc: "沉迷工作",
    detailedEffect: "收入加成 +40%\n健康衰減 +30%",
    category: "special",
    effect: (g) => {
      g.incomeBonus *= 1.4;
      g.healthDecay *= 1.3;
    },
    unlock: "achievement",
  },

  {
    id: "immortal",
    name: "⏳ 長壽基因",
    desc: "超長壽命",
    detailedEffect: "健康衰減 -50%",
    category: "special",
    effect: (g) => {
      g.healthDecay *= 0.5;
    },
    unlock: "age",
  },

  {
    id: "geniusmind",
    name: "🎓 天才心智",
    desc: "智力超群",
    detailedEffect: "智力 +30\n學習效率 +50%",
    category: "special",
    effect: (g) => {
      g.intel += 30;
      g.learnBonus *= 1.5;
    },
    unlock: "achievement",
  },

  {
    id: "socialmaster",
    name: "🌟 社交大師",
    desc: "社交能力頂尖",
    detailedEffect: "溝通 +30\n魅力 +20\n社交效果 x2",
    category: "special",
    effect: (g) => {
      g.skills.communication += 30;
      g.skills.charm += 20;
      g.socialBonus *= 2;
    },
    unlock: "achievement",
  },

  {
    id: "wealthy",
    name: "💎 富可敵國",
    desc: "財富驚人",
    detailedEffect: "收入加成 x2\n快樂 +20",
    category: "special",
    effect: (g) => {
      g.incomeBonus *= 2;
      g.happy += 20;
    },
    unlock: "achievement",
  },
];

const ORIGINS = [
  // ===== 基础出身 =====
  {
    id: "common",
    name: "平凡",
    desc: "普通的小康家庭",
    parents: "公務員 & 老師",
    money: 30000, // ✅ 原 50000 → 30000 (-40%)
    intel: 50,
    happy: 80,
    yearlyMoney: 500, // ✅ 原 1000 → 500 (-50%)
    buff: "無特殊加成",
  },

  {
    id: "rich",
    name: "富二代",
    desc: "父母是成功的企業家",
    parents: "CEO & 董事",
    money: 3000000, // ✅ 原 5000000 → 3000000 (-40%)
    intel: 40,
    happy: 90,
    yearlyMoney: 60000, // ✅ 原 100000 → 60000 (-40%)
    buff: "每年被動收入 6萬，魅力 +10",
  },

  {
    id: "genius",
    name: "天才",
    desc: "智商遠超常人",
    parents: "研究員 & 教授",
    money: -50000, // ⭐ 保持负债不变
    intel: 120,
    happy: 60,
    yearlyMoney: 0, // ⭐ 本来就是 0
    buff: "智商 +120，初始負債 5萬",
  },

  {
    id: "star",
    name: "星二代",
    desc: "父母是知名藝人",
    parents: "影帝 & 歌后",
    money: 600000, // ✅ 原 1000000 → 600000 (-40%)
    intel: 50,
    happy: 70,
    yearlyMoney: 30000, // ✅ 原 50000 → 30000 (-40%)
    buff: "魅力自然高",
  },

  {
    id: "scholar",
    name: "書香世家",
    desc: "知識分子家庭",
    parents: "大學教授 & 圖書館長",
    money: 120000, // ✅ 原 200000 → 120000 (-40%)
    intel: 80,
    happy: 75,
    yearlyMoney: 3000, // ✅ 原 5000 → 3000 (-40%)
    buff: "智商高，愛讀書",
  },

  {
    id: "military",
    name: "軍人世家",
    desc: "軍人家庭背景",
    parents: "將軍 & 軍醫",
    money: 90000, // ✅ 原 150000 → 90000 (-40%)
    intel: 60,
    happy: 70,
    yearlyMoney: 1800, // ✅ 原 3000 → 1800 (-40%)
    buff: "健康 +20",
  },

  {
    id: "doctor",
    name: "醫生世家",
    desc: "醫療背景家庭",
    parents: "主任醫師 & 護理師",
    money: 480000, // ✅ 原 800000 → 480000 (-40%)
    intel: 85,
    happy: 75,
    yearlyMoney: 6000, // ✅ 原 10000 → 6000 (-40%)
    buff: "醫學技能 +30",
  },

  // ===== 困难出身 =====
  {
    id: "farmer",
    name: "農家",
    desc: "務農家庭",
    parents: "果農 & 菜農",
    money: 12000, // ✅ 原 20000 → 12000 (-40%)
    intel: 40,
    happy: 85,
    yearlyMoney: 300, // ✅ 原 500 → 300 (-40%)
    buff: "健康 +15，快樂 +5",
  },

  {
    id: "fisher",
    name: "漁民",
    desc: "漁村家庭",
    parents: "漁民 & 漁民",
    money: 18000, // ✅ 原 30000 → 18000 (-40%)
    intel: 45,
    happy: 80,
    yearlyMoney: 600, // ✅ 原 1000 → 600 (-40%)
    buff: "健康 +10",
  },

  {
    id: "aboriginal",
    name: "原住民",
    desc: "原住民部落",
    parents: "頭目 & 織布師",
    money: 6000, // ✅ 原 10000 → 6000 (-40%)
    intel: 45,
    happy: 90,
    yearlyMoney: 300, // ✅ 原 500 → 300 (-40%)
    buff: "魅力 +15，藝術 +20，快樂 +10",
  },

  {
    id: "immigrant",
    name: "移民",
    desc: "新移民家庭",
    parents: "移工 & 移工",
    money: 18000, // ✅ 原 30000 → 18000 (-40%)
    intel: 55,
    happy: 75,
    yearlyMoney: 480, // ✅ 原 800 → 480 (-40%)
    buff: "溝通 +20",
  },

  {
    id: "singleparent",
    name: "單親家庭",
    desc: "單親撫養",
    parents: "單親媽媽",
    money: -12000, // ✅ 原 -20000 → -12000 (债务减少40%)
    intel: 55,
    happy: 65,
    yearlyMoney: 0, // ⭐ 保持 0
    buff: "堅強獨立",
  },

  // ===== 特殊出身 =====
  {
    id: "tech",
    name: "科技新貴",
    desc: "科技業父母",
    parents: "PM & 工程師",
    money: 300000, // ✅ 原 500000 → 300000 (-40%)
    intel: 75,
    happy: 70,
    yearlyMoney: 9000, // ✅ 原 15000 → 9000 (-40%)
    buff: "程式 +30",
  },

  {
    id: "artist",
    name: "藝術家庭",
    desc: "藝術世家",
    parents: "畫家 & 音樂家",
    money: 48000, // ✅ 原 80000 → 48000 (-40%)
    intel: 65,
    happy: 85,
    yearlyMoney: 1200, // ✅ 原 2000 → 1200 (-40%)
    buff: "藝術 +40，魅力 +10",
  },

  {
    id: "politician",
    name: "政治世家",
    desc: "政治人物家庭",
    parents: "立委 & 市長",
    money: 1200000, // ✅ 原 2000000 → 1200000 (-40%)
    intel: 70,
    happy: 75,
    yearlyMoney: 18000, // ✅ 原 30000 → 18000 (-40%)
    buff: "溝通 +25",
  },

  {
    id: "orphan",
    name: "孤兒",
    desc: "從小在育幼院長大",
    parents: "無",
    money: 0, // ⭐ 保持 0
    intel: 50,
    happy: 50,
    yearlyMoney: 0, // ⭐ 保持 0
    buff: "堅韌不拔 +30",
  },

  {
    id: "temple",
    name: "宮廟世家",
    desc: "宮廟管理家庭",
    parents: "廟祝 & 乩童",
    money: 180000, // ✅ 原 300000 → 180000 (-40%)
    intel: 50,
    happy: 80,
    yearlyMoney: 3000, // ✅ 原 5000 → 3000 (-40%)
    buff: "溝通 +15，快樂 +5",
  },

  {
    id: "mafia",
    name: "黑道世家",
    desc: "黑道背景",
    parents: "堂主 & 堂口大姐",
    money: 300000, // ✅ 原 500000 → 300000 (-40%)
    intel: 45,
    happy: 60,
    yearlyMoney: 12000, // ✅ 原 20000 → 12000 (-40%)
    buff: "魅力 +20，健康 +15",
  },

  // ===== 頂級特殊出身 =====
  {
    id: "royal",
    name: "皇族",
    desc: "顯赫的皇室血統",
    parents: "國王 & 王后",
    money: 6000000, // ✅ 原 10000000 → 6000000 (-40%)
    intel: 70,
    happy: 60,
    yearlyMoney: 120000, // ✅ 原 200000 → 120000 (-40%)
    buff: "每年 12萬被動收入，魅力 +100",
    special: "royal",
  },

  {
    id: "hacker",
    name: "駭客世家",
    desc: "頂尖駭客家庭",
    parents: "白帽駭客 & 資安專家",
    money: 180000, // ✅ 原 300000 → 180000 (-40%)
    intel: 100,
    happy: 65,
    yearlyMoney: 4800, // ✅ 原 8000 → 4800 (-40%)
    buff: "程式能力 +50",
    special: "hacker",
  },

  {
    id: "detective",
    name: "偵探世家",
    desc: "名偵探家族",
    parents: "名侦探 & 犯罪心理學家",
    money: 108000, // ✅ 原 180000 → 108000 (-40%)
    intel: 90,
    happy: 70,
    yearlyMoney: 2400, // ✅ 原 4000 → 2400 (-40%)
    buff: "智商 +40",
    special: "detective",
  },

  {
    id: "cheffamily",
    name: "名廚世家",
    desc: "米其林家族",
    parents: "米其林主廚 & 甜點師",
    money: 300000, // ✅ 原 500000 → 300000 (-40%)
    intel: 60,
    happy: 85,
    yearlyMoney: 7200, // ✅ 原 12000 → 7200 (-40%)
    buff: "廚藝 +60，藝術 +20",
    special: "chef",
  },

  {
    id: "monk",
    name: "修行世家",
    desc: "佛門世家",
    parents: "住持 & 法師",
    money: 3000, // ✅ 原 5000 → 3000 (-40%)
    intel: 75,
    happy: 90,
    yearlyMoney: 0, // ⭐ 保持 0
    buff: "健康 +25，快樂 +10",
    special: "monk",
  },

  {
    id: "circus",
    name: "馬戲團世家",
    desc: "馬戲團家族",
    parents: "團長 & 空中飛人",
    money: 30000, // ✅ 原 50000 → 30000 (-40%)
    intel: 50,
    happy: 80,
    yearlyMoney: 1200, // ✅ 原 2000 → 1200 (-40%)
    buff: "魅力 +25，健康 +10",
    special: "circus",
  },

  {
    id: "diplomat",
    name: "外交世家",
    desc: "外交官家族",
    parents: "大使 & 外交官",
    money: 720000, // ✅ 原 1200000 → 720000 (-40%)
    intel: 85,
    happy: 75,
    yearlyMoney: 15000, // ✅ 原 25000 → 15000 (-40%)
    buff: "溝通 +35",
    special: "diplomat",
  },

  {
    id: "esports",
    name: "電競世家",
    desc: "電競冠軍家庭",
    parents: "電競教練 & 職業選手",
    money: 360000, // ✅ 原 600000 → 360000 (-40%)
    intel: 65,
    happy: 85,
    yearlyMoney: 9000, // ✅ 原 15000 → 9000 (-40%)
    buff: "反應力超群",
    special: "esports",
  },

  {
    id: "spy",
    name: "間諜世家",
    desc: "情報世家",
    parents: "特務 & 情報員",
    money: 480000, // ✅ 原 800000 → 480000 (-40%)
    intel: 95,
    happy: 60,
    yearlyMoney: 12000, // ✅ 原 20000 → 12000 (-40%)
    buff: "智商 +45",
    special: "spy",
  },

  {
    id: "archaeologist",
    name: "考古世家",
    desc: "考古學家家族",
    parents: "考古學家 & 博物館長",
    money: 150000, // ✅ 原 250000 → 150000 (-40%)
    intel: 88,
    happy: 78,
    yearlyMoney: 3600, // ✅ 原 6000 → 3600 (-40%)
    buff: "智商 +38",
    special: "archaeologist",
  },

  {
    id: "fashion",
    name: "時尚世家",
    desc: "時尚設計師家族",
    parents: "時裝設計師 & 超模",
    money: 1800000, // ✅ 原 3000000 → 1800000 (-40%)
    intel: 60,
    happy: 80,
    yearlyMoney: 30000, // ✅ 原 50000 → 30000 (-40%)
    buff: "魅力 +35，藝術 +25",
    special: "fashion",
  },

  {
    id: "scientistfamily",
    name: "科學家族",
    desc: "諾貝爾家族",
    parents: "諾貝爾獎得主 & 研究員",
    money: 500000, // ✅ 原 1500000 → 900000 (-40%)
    intel: 130,
    happy: 70,
    yearlyMoney: 18000, // ✅ 原 30000 → 18000 (-40%)
    buff: "智商 +80",
    special: "scientist",
  },
];
const LIFE_STAGES = [
  { min: 0, max: 2, name: "嬰兒期", icon: "👶" },
  { min: 3, max: 5, name: "幼兒期", icon: "🧸" },
  { min: 6, max: 12, name: "兒童期", icon: "🎒" },
  { min: 13, max: 17, name: "青春期", icon: "🎧" },
  { min: 18, max: 30, name: "青年期", icon: "💼" },
  { min: 31, max: 50, name: "壯年期", icon: "👨‍💼" },
  { min: 51, max: 65, name: "中年期", icon: "👓" },
  { min: 66, max: 200, name: "老年期", icon: "👴" }, // 確保最大值夠大
];
const ACHIEVEMENTS = [
  // ==========================================
  // 💰 財富與資產 (Money & Assets)
  // ==========================================
  {
    id: "first_bucket",
    name: "第一桶金",
    desc: "擁有 100 萬現金",
    icon: "💰",
    check: (g) => g.money >= 1000000,
  },
  {
    id: "multi_millionaire",
    name: "千萬富翁",
    desc: "擁有 1000 萬現金",
    icon: "💎",
    check: (g) => g.money >= 10000000,
  },
  {
    id: "billionaire",
    name: "億萬富翁",
    desc: "擁有 1 億現金",
    icon: "🏦",
    check: (g) => g.money >= 100000000,
  },
  {
    id: "trillionaire",
    name: "富可敵國",
    desc: "擁有 10 億現金",
    icon: "🌍",
    check: (g) => g.money >= 1000000000,
  },
  {
    id: "money_god",
    name: "鈔能力者",
    desc: "擁有 50 億現金",
    icon: "🤑",
    check: (g) => g.money >= 5000000000,
  },

  {
    id: "car_lover",
    name: "車庫滿滿",
    desc: "擁有 3 輛以上的車",
    icon: "🏎️",
    check: (g) => g.inventory.filter((i) => i.startsWith("car")).length >= 3,
  },
  {
    id: "jay_leno",
    name: "汽車收藏家",
    desc: "擁有 6 輛所有的車",
    icon: "🅿️",
    check: (g) => g.inventory.filter((i) => i.startsWith("car")).length >= 6,
  },

  {
    id: "landlord",
    name: "包租公",
    desc: "擁有 3 間以上的房產",
    icon: "🔑",
    check: (g) => g.inventory.filter((i) => i.startsWith("house")).length >= 3,
  },
  {
    id: "real_estate_tycoon",
    name: "地產大亨",
    desc: "擁有 6 間所有的房產",
    icon: "🏘️",
    check: (g) => g.inventory.filter((i) => i.startsWith("house")).length >= 6,
  },

  {
    id: "luxury_beginner",
    name: "小小奢華",
    desc: "擁有 1 件奢侈品",
    icon: "⌚",
    check: (g) => g.inventory.filter((i) => i.startsWith("lux")).length >= 1,
  },
  {
    id: "luxury_king",
    name: "極致奢華",
    desc: "擁有 5 件所有的奢侈品",
    icon: "👑",
    check: (g) => g.inventory.filter((i) => i.startsWith("lux")).length >= 5,
  },

  {
    id: "shopaholic",
    name: "購物狂",
    desc: "總共擁有超過 15 件物品",
    icon: "🛍️",
    check: (g) => g.inventory.length >= 15,
  },
  {
    id: "warehouse",
    name: "移動倉庫",
    desc: "總共擁有超過 30 件物品",
    icon: "📦",
    check: (g) => g.inventory.length >= 30,
  },

  // ==========================================
  // 📉 貧窮與負債 (Poverty & Debt)
  // ==========================================
  {
    id: "poor_guy",
    name: "月光族",
    desc: "18歲後現金低於 1000 元",
    icon: "💸",
    check: (g) => g.age >= 18 && g.money < 1000 && g.money >= 0,
  },
  {
    id: "debt_starter",
    name: "負債累累",
    desc: "負債超過 100 萬",
    icon: "😰",
    check: (g) => g.money <= -1000000,
  },
  {
    id: "bankruptcy_expert",
    name: "破產專家",
    desc: "負債超過 1000 萬",
    icon: "📉",
    check: (g) => g.money <= -10000000,
  },
  {
    id: "debt_king",
    name: "債務王",
    desc: "負債超過 5000 萬",
    icon: "💀",
    check: (g) => g.money <= -50000000,
  },
  {
    id: "homeless",
    name: "無家可歸",
    desc: "30歲且沒有房產",
    icon: "⛺",
    check: (g) =>
      g.age >= 30 && !g.inventory.some((i) => i.startsWith("house")),
  },

  // ==========================================
  // 🧠 屬性極限 (Stats Limits)
  // ==========================================
  {
    id: "genius_brain",
    name: "愛因斯坦",
    desc: "智力達到 120",
    icon: "🧠",
    check: (g) => g.intel >= 120,
  },
  {
    id: "super_brain",
    name: "超級電腦",
    desc: "智力達到 180",
    icon: "💾",
    check: (g) => g.intel >= 180,
  },

  {
    id: "charm_master",
    name: "萬人迷",
    desc: "魅力達到 120",
    icon: "✨",
    check: (g) => g.skills.charm >= 120,
  },
  {
    id: "idol_king",
    name: "國民偶像",
    desc: "魅力達到 180",
    icon: "🌟",
    check: (g) => g.skills.charm >= 180,
  },

  {
    id: "muscle_man",
    name: "健美先生",
    desc: "健康達到 120",
    icon: "💪",
    check: (g) => g.health >= 120,
  },
  {
    id: "iron_body",
    name: "金剛不壞",
    desc: "健康達到 150",
    icon: "🛡️",
    check: (g) => g.health >= 150,
  },

  {
    id: "happy_life",
    name: "快樂似神仙",
    desc: "快樂達到 120",
    icon: "😊",
    check: (g) => g.happy >= 120,
  },
  {
    id: "nirvana",
    name: "極樂世界",
    desc: "快樂達到 150",
    icon: "🌈",
    check: (g) => g.happy >= 150,
  },

  {
    id: "all_rounder",
    name: "全能天才",
    desc: "所有技能都超過 60",
    icon: "🎯",
    check: (g) => Object.values(g.skills).every((s) => s >= 60),
  },
  {
    id: "perfect_human",
    name: "完美人類",
    desc: "健康、快樂、智力同時達到 120",
    icon: "😇",
    check: (g) => g.health >= 120 && g.happy >= 120 && g.intel >= 120,
  },

  // ==========================================
  // 🛠️ 技能專精 (Skill Mastery)
  // ==========================================
  {
    id: "hacker_god",
    name: "駭客任務",
    desc: "程式技能達到 100",
    icon: "💻",
    check: (g) => g.skills.programming >= 100,
  },
  {
    id: "invest_god",
    name: "華爾街之狼",
    desc: "理財技能達到 100",
    icon: "📈",
    check: (g) => g.skills.finance >= 100,
  },
  {
    id: "art_master",
    name: "達文西再世",
    desc: "藝術技能達到 100",
    icon: "🎨",
    check: (g) => g.skills.art >= 100,
  },
  {
    id: "medical_god",
    name: "神醫下山",
    desc: "醫療技能達到 100",
    icon: "⚕️",
    check: (g) => g.skills.medical >= 100,
  },
  {
    id: "chef_god",
    name: "食神",
    desc: "烹飪技能達到 100",
    icon: "🍳",
    check: (g) => g.skills.cooking >= 100,
  },
  {
    id: "talk_master",
    name: "談判專家",
    desc: "溝通技能達到 100",
    icon: "🗣️",
    check: (g) => g.skills.communication >= 100,
  },
  {
    id: "leader_god",
    name: "天生領袖",
    desc: "領導力達到 100",
    icon: "🚩",
    check: (g) => g.skills.leadership >= 100,
  },

  // ==========================================
  // 🎂 壽命與階段 (Life Stages)
  // ==========================================
  {
    id: "adult",
    name: "成年禮",
    desc: "平安活到 18 歲",
    icon: "🕯️",
    check: (g) => g.age >= 18,
  },
  {
    id: "thirty_standing",
    name: "三十而立",
    desc: "活到 30 歲",
    icon: "🚶",
    check: (g) => g.age >= 30,
  },
  {
    id: "midlife",
    name: "中年危機",
    desc: "活到 40 歲",
    icon: "🧔",
    check: (g) => g.age >= 40,
  },
  {
    id: "know_destiny",
    name: "知天命",
    desc: "活到 50 歲",
    icon: "🧘",
    check: (g) => g.age >= 50,
  },
  {
    id: "retirement",
    name: "光榮退休",
    desc: "活到 65 歲",
    icon: "👴",
    check: (g) => g.age >= 65,
  },
  {
    id: "longevity",
    name: "長命百歲",
    desc: "活到 100 歲",
    icon: "🎂",
    check: (g) => g.age >= 100,
  },
  {
    id: "history_witness",
    name: "歷史見證者",
    desc: "活到 110 歲",
    icon: "📜",
    check: (g) => g.age >= 110,
  },
  {
    id: "immortal_legend",
    name: "不朽傳奇",
    desc: "活到 125 歲",
    icon: "🐉",
    check: (g) => g.age >= 125,
  },

  // ==========================================
  // 💼 職業與教育 (Career & Education)
  // ==========================================
  {
    id: "bachelor",
    name: "大學生",
    desc: "獲得大學學位",
    icon: "🎓",
    check: (g) => g.education === "university",
  },
  {
    id: "master_degree",
    name: "碩士生",
    desc: "獲得碩士學位",
    icon: "📜",
    check: (g) => g.education === "master",
  },
  {
    id: "phd_degree",
    name: "博學多聞",
    desc: "獲得博士學位",
    icon: "👨‍🎓",
    check: (g) => g.education === "phd",
  },

  {
    id: "work_rookie",
    name: "職場菜鳥",
    desc: "工作年資達到 1 年",
    icon: "🐤",
    check: (g) => g.jobYears >= 1,
  },
  {
    id: "work_veteran",
    name: "資深社畜",
    desc: "工作年資達到 20 年",
    icon: "🕰️",
    check: (g) => g.jobYears >= 20,
  },
  {
    id: "work_legend",
    name: "公司元老",
    desc: "工作年資達到 40 年",
    icon: "🏺",
    check: (g) => g.jobYears >= 40,
  },
  {
    id: "lifetime_dedication",
    name: "終身奉獻",
    desc: "工作年資達到 60 年",
    icon: "🏆",
    check: (g) => g.jobYears >= 60,
  },

  {
    id: "manager",
    name: "基層主管",
    desc: "職位達到主管",
    icon: "📋",
    check: (g) => g.job === "主管",
  },
  {
    id: "director",
    name: "高層領導",
    desc: "職位達到部門經理",
    icon: "💼",
    check: (g) => g.job === "部門經理",
  },
  {
    id: "ceo",
    name: "打工皇帝",
    desc: "職位達到總經理",
    icon: "👔",
    check: (g) => g.job === "總經理",
  },

  {
    id: "freelancer_king",
    name: "斜槓青年",
    desc: "無正職但存款超過 500 萬",
    icon: "☕",
    check: (g) => g.jobId === "none" && g.money >= 5000000,
  },
  {
    id: "neet_king",
    name: "啃老之王",
    desc: "50歲且從未工作過(年資0)",
    icon: "🎮",
    check: (g) => g.age >= 50 && g.jobYears === 0,
  },

  // ==========================================
  // 👥 社交與家庭 (Social & Family)
  // ==========================================
  {
    id: "friend_collector",
    name: "好人緣",
    desc: "認識 5 個 NPC",
    icon: "👋",
    check: (g) => g.npcs.length >= 5,
  },
  {
    id: "social_butterfly",
    name: "社交名流",
    desc: "認識 15 個 NPC",
    icon: "🦋",
    check: (g) => g.npcs.length >= 15,
  },
  {
    id: "party_king",
    name: "派對之王",
    desc: "認識 30 個 NPC",
    icon: "🕺",
    check: (g) => g.npcs.length >= 30,
  },

  {
    id: "in_love",
    name: "墜入愛河",
    desc: "擁有戀人",
    icon: "❤️",
    check: (g) => g.npcs.some((n) => n.type === "lover"),
  },
  {
    id: "married",
    name: "成家立業",
    desc: "擁有配偶",
    icon: "💍",
    check: (g) => g.npcs.some((n) => n.type === "spouse"),
  },
  {
    id: "parent",
    name: "初為父母",
    desc: "擁有 1 個孩子",
    icon: "👶",
    check: (g) => g.children.length >= 1,
  },
  {
    id: "big_family",
    name: "多子多孫",
    desc: "擁有 3 個以上的孩子",
    icon: "👨‍👩‍👧‍👦",
    check: (g) => g.children.length >= 3,
  },
  {
    id: "super_clan",
    name: "超級家族",
    desc: "擁有 5 個以上的孩子",
    icon: "🏰",
    check: (g) => g.children.length >= 5,
  },

  {
    id: "loner",
    name: "孤獨美食家",
    desc: "50歲且沒有伴侶和孩子",
    icon: "🍜",
    check: (g) =>
      g.age >= 50 &&
      !g.npcs.some((n) => n.type === "spouse") &&
      g.children.length === 0,
  },
  {
    id: "widow",
    name: "孤單老人",
    desc: "80歲且朋友少於 2 人",
    icon: "🍂",
    check: (g) => g.age >= 80 && g.npcs.length < 2,
  },

  // ==========================================
  // 🎭 特殊與惡搞 (Special & Fun)
  // ==========================================
  {
    id: "unlucky",
    name: "衰神附體",
    desc: "快樂值低於 5",
    icon: "🌧️",
    check: (g) => g.happy <= 5,
  },
  {
    id: "sick_bay",
    name: "藥罐子",
    desc: "健康值低於 10",
    icon: "🤒",
    check: (g) => g.health <= 10,
  },
  {
    id: "stress_explosion",
    name: "壓力山大",
    desc: "健康與快樂同時低於 30",
    icon: "🤯",
    check: (g) => g.health <= 30 && g.happy <= 30,
  },
  {
    id: "dumb_luck",
    name: "傻人有傻福",
    desc: "智力低於 30 但現金超過 1000 萬",
    icon: "🤪",
    check: (g) => g.intel <= 30 && g.money >= 10000000,
  },
  {
    id: "action_master",
    name: "過動兒",
    desc: "總行動次數超過 1000 次",
    icon: "⚡",
    check: (g) => g.totalActions >= 1000,
  },
  {
    id: "event_magnet",
    name: "事件體質",
    desc: "觸發超過 50 次隨機事件",
    icon: "🎲",
    check: (g) => g.totalEvents >= 50,
  },
  {
    id: "lucky_star",
    name: "天選之人",
    desc: "觸發 5 次以上「大成功」",
    icon: "🍀",
    check: (g) => g.luckyEventCount >= 5,
  },
];
const ORIGIN_STORY = {
  common:
    "你出生在一個平凡的家庭，父母看著你的眼神充滿慈愛，雖然家裡不富裕，但也不愁吃穿。牆上的日曆顯示著今天是發薪日，爸爸買了一個小蛋糕慶祝你的誕生。",
  rich: "你出生在頂級私立醫院的豪華產房，窗外停著爸爸的司機和保鑣。你的搖籃是義大利進口的，旁邊堆滿了還沒拆封的名牌嬰兒用品。",
  genius:
    "你出生的那一刻沒有哭，而是睜大眼睛觀察著周圍。父母是頂尖研究員，他們看著你的眼神像是在看一個偉大的實驗數據，床邊放著微積分課本當作胎教音樂。",
  star: "閃光燈閃個不停，你剛出生就登上了娛樂版頭條。雖然你還看不清楚，但周圍充滿了粉絲的尖叫聲和經紀人的講電話聲。",
  scholar:
    "家裡充滿了舊書的味道，父母正在輕聲討論要讓你先學論語還是莎士比亞。你的嬰兒床邊不是玩具，而是一座小小的書山。",
  military:
    "父親穿著軍裝抱起你，粗糙的手掌雖然溫暖但充滿厚繭。他看著你，彷彿已經看到了你未來穿上軍服、保家衛國的模樣。",
  doctor:
    "你出生在父母工作的醫院，護理師阿姨們輪流來抱你。空氣中瀰漫著消毒水的味道，這將是你未來最熟悉的氣味。",
  farmer:
    "清晨的雞啼聲迎接你的到來。窗外是一望無際的稻田，父母雖然汗流浹背，但看著你的笑容就像看著豐收的作物一樣燦爛。",
  fisher:
    "海浪拍打岸邊的聲音是你聽到的第一個旋律。空氣中帶著鹹鹹的海風，父親說你是海的女兒/兒子，將來要征服這片大海。",
  aboriginal:
    "部落的長老為你唱起古老的祝福歌謠，祖靈的庇佑環繞著你。你在山林的懷抱中誕生，註定擁有與自然溝通的天賦。",
  immigrant:
    "父母用你不熟悉的家鄉話輕聲哄著你。雖然在這個新國度一切都很陌生且艱難，但他們看著你的眼神充滿了對新生活的希望。",
  singleparent:
    "媽媽緊緊抱著你，雖然只有她一個人，但她的懷抱比任何地方都溫暖。她輕聲承諾，會給你雙倍的愛。",
  tech: "你的第一張照片是用最新的原型機拍的。家裡到處都是電路板和螢幕，父母正在討論要寫一個 AI 程式來幫你換尿布。",
  artist:
    "家裡播放著古典樂，牆上掛滿了父母的畫作。你抓周抓到了一支畫筆，父母開心地說你是天生的藝術家。",
  politician:
    "你的滿月酒席上冠蓋雲集，立委、議員們輪流抱著你拍照。你還不懂事，就已經成為了父母建立親民形象的最佳助選員。",
  orphan:
    "你是個被遺落在育幼院門口的孩子，院長奶奶收留了你。雖然沒有父母的疼愛，但這裡有很多和你一樣的兄弟姊妹。",
  temple:
    "晨鐘暮鼓是你生命的節奏。你在繚繞的香火中長大，信徒們都說你看起來特別有靈氣，彷彿是神明賜予的孩子。",
  mafia:
    "滿屋子刺青的叔叔伯伯圍著你看，雖然他們長相兇狠，但遞過來的紅包卻特別厚。父親說，只要有他在，沒人敢欺負你。",
  royal:
    "皇家禮炮鳴響，全國慶祝你的誕生。你躺在鑲金的搖籃裡，管家阿爾弗雷德正在為你準備溫熱的牛奶，你註定生而不凡。",
  hacker:
    "你的房間沒有窗戶，只有多個螢幕發出的幽光。父母教你的第一個字不是「爸爸」，而是「sudo」。",
  detective:
    "家裡總是充滿謎團，父母看你的眼神像是在審視嫌疑犯。你在充滿邏輯與推理的環境下長大，學會的第一件事是觀察細節。",
  cheffamily:
    "廚房傳來的香氣是你童年的記憶。你的奶瓶裡裝的不是普通牛奶，而是經過父母精心調配的頂級配方。",
  monk: "你在深山的古剎中醒來，師父慈悲地看著你。這裡沒有塵世的喧囂，只有風吹過松林的聲音，你將走上一條修行的道路。",
  circus:
    "你的搖籃是空中的吊床，周圍是大象和獅子。掌聲和歡呼聲是你習以為常的背景音，你的童年註定充滿驚奇。",
  diplomat:
    "你的護照上蓋滿了各國的印章。從小你就習慣在不同的國家醒來，聽著不同的語言，世界就是你的遊樂場。",
  esports:
    "鍵盤的敲擊聲是你聽過最美妙的音樂。父母是傳奇選手，他們看著你的手指，期待著你繼承他們的APM（手速）。",
  spy: "家裡有很多不能打開的抽屜和祕密房間。父母總是突然消失又突然出現，你從小就學會了保守秘密。",
  archaeologist:
    "你的玩具是鏟子和刷子。父母帶回來的不是伴手禮，而是千年前的化石碎片，歷史的塵埃是你童年的養分。",
  fashion:
    "你的尿布是高級訂製款。從小你就坐在時裝秀的第一排，鎂光燈是你最熟悉的朋友，時尚早已融入你的血液。",
  scientistfamily:
    "家裡的書架上擺滿了諾貝爾獎章。父母對你的期許不是賺大錢，而是解開宇宙的奧祕。",
};
const JOBS = [
  {
    id: "none",
    name: "無業",
    salary: 0,
    requirement: {},
    effect: null,
    desc: "待業中",
  },
  {
    id: "clerk",
    name: "行政人員",
    salary: 32000,
    requirement: { intel: 40 },
    effect: (g) => {
      g.happy -= 2;
    },
    desc: "穩定的辦公室工作",
  },
  {
    id: "engineer",
    name: "工程師",
    salary: 75000,
    requirement: { intel: 80, programming: 70 },
    traitBonus: {
      techsavvy: { salary: 1.3, desc: "科技達人薪資加成 30%" },
      quicklearner: { salary: 1.2, desc: "快速學習者薪資加成 20%" },
      introvert: { salary: 1.1, desc: "內向者薪資加成 10%" },
    },
    effect: (g) => {
      g.skills.programming += 2;
      g.happy -= 5;
      g.health -= 3;
    },
    desc: "高薪但爆肝的科技業",
  },
  {
    id: "doctor",
    name: "主治醫師",
    salary: 180000,
    requirement: { intel: 120, medical: 80 },
    requiredTrait: "athletic",
    traitBonus: { athletic: { salary: 1.2, desc: "運動健將薪資加成" } },
    effect: (g) => {
      g.health -= 5;
      g.skills.medical += 3;
    },
    desc: "社會地位極高的職業",
  },
  {
    id: "artist",
    name: "藝術家",
    salary: 35000,
    requirement: { art: 70, charm: 60 },
    traitBonus: {
      artistic: { salary: 1.5, desc: "藝術天賦薪資加成 50%" },
      pessimistic: { salary: 1.3, desc: "悲觀主義者薪資加成 30%" },
    },
    effect: (g) => {
      g.happy += 10;
      g.skills.art += 3;
    },
    desc: "收入不穩定的創作生活",
  },
  {
    id: "teacher",
    name: "教師",
    salary: 55000,
    requirement: { intel: 70, communication: 60 },
    traitBonus: {
      extrovert: { salary: 1.2, desc: "外向者薪資加成" },
      charismatic: { salary: 1.15, desc: "魅力非凡薪資加成" },
      optimistic: { salary: 1.1, desc: "樂觀主義者薪資加成 10%" },
    },
    effect: (g) => {
      g.happy += 5;
      g.skills.communication += 2;
    },
    desc: "作育英才的鐵飯碗",
  },
  {
    id: "entrepreneur",
    name: "創業家",
    salary: 90000,
    requirement: { intel: 90, finance: 70, charm: 70 },
    traitBonus: {
      businessmind: { salary: 1.5, desc: "商業頭腦薪資加成" },
      brave: { salary: 1.3, desc: "勇敢者薪資加成" },
      lucky: { salary: 1.4, desc: "幸運兒薪資加成" },
      optimistic: { salary: 1.2, desc: "樂觀主義者薪資加成 20%" },
    },
    effect: (g) => {
      const fluctuation = Math.floor(Math.random() * 200000) - 80000;
      g.money += fluctuation;
      g.happy -= 15;
      g.health -= 8;
      if (fluctuation > 0) log(`📈 創業獲利 +${fluctuation.toLocaleString()}`);
      else log(`📉 創業虧損 ${Math.abs(fluctuation).toLocaleString()}`);
    },
    desc: "高風險高報酬",
  },
  {
    id: "influencer",
    name: "網紅",
    salary: 80000,
    requirement: { charm: 90, communication: 70 },
    requiredTrait: "extrovert",
    traitBonus: {
      extrovert: { salary: 1.3, desc: "外向者薪資加成" },
      charismatic: { salary: 1.4, desc: "魅力非凡薪資加成" },
      artistic: { salary: 1.2, desc: "藝術天賦薪資加成" },
      optimistic: { salary: 1.15, desc: "樂觀主義者薪資加成 15%" },
    },
    effect: (g) => {
      g.skills.charm += 2;
      g.happy += 8;
      g.money += Math.floor(Math.random() * 60000) - 20000;
    },
    desc: "流量變現的時代",
  },
  {
    id: "scientist",
    name: "科學家",
    salary: 85000,
    requirement: { intel: 110 },
    traitBonus: {
      geniusmind: { salary: 1.5, desc: "天才心智薪資加成" },
      introvert: { salary: 1.2, desc: "內向者薪資加成" },
      quicklearner: { salary: 1.3, desc: "快速學習者薪資加成 30%" },
    },
    effect: (g) => {
      g.intel += 5;
      g.happy += 3;
    },
    desc: "探索未知的真理",
  },
  {
    id: "lawyer",
    name: "律師",
    salary: 150000,
    requirement: { intel: 100, communication: 80 },
    effect: (g) => {
      g.skills.communication += 3;
      g.happy -= 8;
    },
    desc: "高工時高報酬",
  },
  {
    id: "chef",
    name: "主廚",
    salary: 55000,
    requirement: { cooking: 80, art: 40 },
    effect: (g) => {
      g.skills.cooking += 3;
      g.happy += 5;
    },
    desc: "餐廳的靈魂人物",
  },
  {
    id: "pilot",
    name: "機師",
    salary: 250000,
    requirement: { intel: 90, health: 80 },
    effect: (g) => {
      g.health -= 5;
      g.happy += 3;
    },
    desc: "夢幻的高薪職業",
  },
  {
    id: "athlete",
    name: "職業運動員",
    salary: 80000,
    requirement: { health: 90, charm: 60 },
    effect: (g) => {
      g.health += 3;
      if (g.age > 35) {
        g.happy -= 10;
        log("⚠️ 運動員年齡過大，職業生涯走下坡");
      }
    },
    desc: "35 歲後職業生涯走下坡",
  },
  {
    id: "police",
    name: "警察",
    salary: 65000,
    requirement: { health: 70, communication: 50 },
    effect: (g) => {
      g.health -= 3;
      g.happy -= 5;
    },
    desc: "含加給的優渥薪資",
  },
  {
    id: "designer",
    name: "設計師",
    salary: 45000,
    requirement: { art: 80, programming: 40 },
    effect: (g) => {
      g.skills.art += 3;
      g.happy += 3;
    },
    desc: "燃燒熱情的職業",
  },

  // 特殊出身職業
  {
    id: "hackerpro",
    name: "黑帽駭客",
    salary: 200000,
    requirement: { intel: 100, programming: 100 },
    originRequired: "hacker",
    effect: (g) => {
      g.skills.programming += 5;
      g.money += Math.floor(Math.random() * 500000) - 100000;
    },
    desc: "游走法律邊緣",
  },
  {
    id: "royaladvisor",
    name: "皇室顧問",
    salary: 300000,
    requirement: { intel: 110, communication: 90 },
    originRequired: "royal",
    effect: (g) => {
      g.skills.charm += 3;
      g.happy += 10;
    },
    desc: "頂級榮耀與薪資",
  },
  {
    id: "esportsplayer",
    name: "電競選手",
    salary: 100000,
    requirement: { intel: 70 },
    originRequired: "esports",
    effect: (g) => {
      if (g.age > 28) {
        g.happy -= 15;
        log("⚠️ 選手年齡過大，反應速度下降");
      } else {
        g.happy += 15;
      }
    },
    desc: "青春飯",
  },
  {
    id: "spyagent",
    name: "特務",
    salary: 180000,
    requirement: { intel: 100, health: 80 },
    originRequired: "spy",
    effect: (g) => {
      g.health -= 8;
      g.money += Math.floor(Math.random() * 300000) - 50000;
    },
    desc: "高風險津貼",
  },
  {
    id: "michelinchef",
    name: "米其林主廚",
    salary: 200000,
    requirement: { cooking: 100, art: 60 },
    originRequired: "cheffamily",
    effect: (g) => {
      g.skills.cooking += 5;
      g.skills.art += 2;
      g.happy += 8;
    },
    desc: "料理界的頂點",
  },
];
const JOB_PROMOTIONS = {
  實習生: {
    next: "正職員工",
    requirement: { age: 22, intel: 60, communication: 30 },
    salaryIncrease: 10000,
  },
  正職員工: {
    next: "資深員工",
    requirement: { age: 28, intel: 80, communication: 50, workYears: 5 },
    salaryIncrease: 20000,
  },
  資深員工: {
    next: "主管",
    requirement: { age: 35, intel: 100, leadership: 60, workYears: 10 },
    salaryIncrease: 40000,
  },
  主管: {
    next: "部門經理",
    requirement: { age: 40, intel: 120, leadership: 80, workYears: 15 },
    salaryIncrease: 80000,
  },
  部門經理: {
    next: "總經理",
    requirement: { age: 45, intel: 150, leadership: 100, workYears: 20 },
    salaryIncrease: 150000,
  },
};
const EDUCATION_LEVELS = [
  { id: "none", name: "無學歷", minAge: 0, unlock: true },
  {
    id: "kindergarten",
    name: "幼兒園",
    minAge: 3,
    unlock: true,
    bonus: { intel: 2 },
  },
  {
    id: "elementary",
    name: "小學",
    minAge: 6,
    unlock: true,
    bonus: { intel: 5, "skills.communication": 5 },
  },
  {
    id: "middle",
    name: "國中",
    minAge: 13,
    unlock: true,
    bonus: { intel: 10, "skills.communication": 10 },
  },
  {
    id: "high",
    name: "高中",
    minAge: 16,
    unlock: false,
    requirement: { intel: 40 },
    bonus: { intel: 15, "skills.communication": 15 },
  },
  {
    id: "university",
    name: "大學",
    minAge: 19,
    unlock: false,
    requirement: { intel: 60 },
    bonus: { intel: 25, "skills.communication": 20 },
    cost: 200000,
  },
  {
    id: "master",
    name: "碩士",
    minAge: 23,
    unlock: false,
    requirement: { intel: 80 },
    bonus: { intel: 35, "skills.communication": 25 },
    cost: 300000,
  },
  {
    id: "phd",
    name: "博士",
    minAge: 26,
    unlock: false,
    requirement: { intel: 100 },
    bonus: { intel: 50, "skills.communication": 30 },
    cost: 500000,
  },
];
const TAIWAN_SCHOOLS = {
  kindergarten: [
    "何嘉仁幼兒園",
    "康橋幼兒園",
    "芝麻街美語幼兒園",
    "吉的堡幼兒園",
    "小哈佛幼兒園",
    "道禾幼兒園",
    "信誼幼兒園",
    "市立幼兒園",
  ],
  elementary: [
    "台北市立國語實小",
    "新北市板橋國小",
    "桃園市中壢國小",
    "台中市力行國小",
    "台南市勝利國小",
    "高雄市鼓山國小",
    "新竹市東門國小",
    "台北市敦化國小",
  ],
  middle: [
    "台北市立金華國中",
    "新北市立板橋國中",
    "桃園市立青溪國中",
    "台中市立居仁國中",
    "台南市立建興國中",
    "高雄市立明華國中",
    "新竹市立建華國中",
    "台北市立中正國中",
  ],
  high: [
    // 頂尖高中（需要高智力）
    { name: "台北市立建國中學", requirement: 90, prestige: "top" },
    { name: "台北市立北一女中", requirement: 90, prestige: "top" },
    { name: "國立師大附中", requirement: 85, prestige: "top" },
    { name: "台中市立台中一中", requirement: 85, prestige: "top" },
    { name: "台南市立台南一中", requirement: 85, prestige: "top" },
    { name: "高雄市立高雄中學", requirement: 85, prestige: "top" },

    // 優質高中
    { name: "台北市立成功高中", requirement: 75, prestige: "good" },
    { name: "台北市立中山女中", requirement: 75, prestige: "good" },
    { name: "新北市立板橋高中", requirement: 70, prestige: "good" },
    { name: "桃園市立武陵高中", requirement: 80, prestige: "good" },
    { name: "新竹市立新竹高中", requirement: 75, prestige: "good" },
    { name: "台中市立台中女中", requirement: 80, prestige: "good" },

    // 一般高中
    { name: "台北市立松山高中", requirement: 60, prestige: "normal" },
    { name: "新北市立新莊高中", requirement: 55, prestige: "normal" },
    { name: "桃園市立中壢高中", requirement: 60, prestige: "normal" },
    { name: "台中市立惠文高中", requirement: 65, prestige: "normal" },
    { name: "台南市立台南二中", requirement: 60, prestige: "normal" },
    { name: "高雄市立新莊高中", requirement: 55, prestige: "normal" },
  ],
  university: [
    // 頂尖大學
    { name: "國立台灣大學", requirement: 85, prestige: "top" },
    { name: "國立清華大學", requirement: 80, prestige: "top" },
    { name: "國立陽明交通大學", requirement: 80, prestige: "top" },
    { name: "國立成功大學", requirement: 75, prestige: "top" },

    // 優質大學
    { name: "國立政治大學", requirement: 70, prestige: "good" },
    { name: "國立中央大學", requirement: 68, prestige: "good" },
    { name: "國立中興大學", requirement: 65, prestige: "good" },
    { name: "國立中山大學", requirement: 65, prestige: "good" },
    { name: "國立台灣師範大學", requirement: 70, prestige: "good" },

    // 一般大學
    { name: "國立台北大學", requirement: 60, prestige: "normal" },
    { name: "國立台灣科技大學", requirement: 65, prestige: "normal" },
    { name: "國立台北科技大學", requirement: 63, prestige: "normal" },
    { name: "輔仁大學", requirement: 60, prestige: "normal" },
    { name: "東吳大學", requirement: 58, prestige: "normal" },
    { name: "淡江大學", requirement: 55, prestige: "normal" },
    { name: "逢甲大學", requirement: 58, prestige: "normal" },
  ],
};
const MAJORS = {
  university: [
    {
      id: "cs",
      name: "資訊工程學系",
      skills: { programming: 30 },
      intel: 10,
    },
    {
      id: "business",
      name: "企業管理學系",
      skills: { finance: 30, communication: 20 },
      intel: 5,
    },
    {
      id: "medicine",
      name: "醫學系",
      skills: { medical: 40 },
      intel: 20,
      requirement: 85,
    },
    {
      id: "art",
      name: "藝術學系",
      skills: { art: 35, charm: 15 },
      intel: 5,
    },
    {
      id: "engineering",
      name: "電機工程學系",
      skills: { programming: 20, communication: 10 },
      intel: 15,
    },
    {
      id: "education",
      name: "教育學系",
      skills: { communication: 30 },
      intel: 10,
    },
    {
      id: "law",
      name: "法律學系",
      skills: { communication: 25 },
      intel: 15,
    },
    {
      id: "economics",
      name: "經濟學系",
      skills: { finance: 35 },
      intel: 12,
    },
  ],
  master: [
    {
      id: "mba",
      name: "MBA 企管碩士",
      skills: { finance: 40, communication: 30 },
      intel: 15,
    },
    {
      id: "cs_master",
      name: "資工碩士",
      skills: { programming: 45 },
      intel: 20,
    },
    {
      id: "med_master",
      name: "醫學碩士",
      skills: { medical: 55 },
      intel: 25,
    },
  ],
  phd: [
    {
      id: "cs_phd",
      name: "資工博士",
      skills: { programming: 60 },
      intel: 30,
    },
    {
      id: "med_phd",
      name: "醫學博士",
      skills: { medical: 70 },
      intel: 35,
    },
  ],
};
const CARS = [
  { id: "car1", name: "二手代步車", price: 300000, charm: 2, desc: "能動就好" },
  {
    id: "car2",
    name: "Toyota Altis",
    price: 900000,
    charm: 5,
    desc: "神車，省油好開",
  },
  {
    id: "car3",
    name: "Tesla Model 3",
    price: 1700000,
    charm: 15,
    desc: "科技新貴的最愛",
  },
  {
    id: "car4",
    name: "BMW 5系列",
    price: 3200000,
    charm: 25,
    desc: "成功的象徵",
  },
  {
    id: "car5",
    name: "Porsche 911",
    price: 8500000,
    charm: 45,
    desc: "男人的夢想",
  },
  {
    id: "car6",
    name: "Ferrari F8",
    price: 18000000,
    charm: 80,
    desc: "頂級超跑",
  },
];
const HOUSES = [
  {
    id: "house1",
    name: "老舊套房",
    price: 8500000,
    happy: 5,
    passive: 15000,
    desc: "市區的小蝸居",
  },
  {
    id: "house2",
    name: "電梯大樓",
    price: 25000000,
    happy: 15,
    passive: 35000,
    desc: "標準的三房兩廳",
  },
  {
    id: "house3",
    name: "市區透天",
    price: 45000000,
    happy: 25,
    passive: 60000,
    desc: "稀有的市區透天",
  },
  {
    id: "house4",
    name: "郊區別墅",
    price: 80000000,
    happy: 40,
    passive: 100000,
    desc: "有車庫和花園",
  },
  {
    id: "house5",
    name: "信義區豪宅",
    price: 350000000,
    happy: 60,
    passive: 300000,
    desc: "俯瞰城市夜景",
  },
  {
    id: "house6",
    name: "私人莊園",
    price: 2000000000,
    happy: 100,
    passive: 1000000,
    desc: "富可敵國的象徵",
  },
];
const LUXURIES = [
  {
    id: "lux1",
    name: "勞力士手錶",
    price: 500000,
    charm: 10,
    desc: "時間的藝術品",
  },
  {
    id: "lux2",
    name: "名牌包",
    price: 300000,
    charm: 8,
    desc: "LV、Gucci、Hermès",
  },
  {
    id: "lux3",
    name: "高級音響",
    price: 800000,
    happy: 10,
    desc: "享受頂級音質",
  },
  {
    id: "lux4",
    name: "遊艇",
    price: 50000000,
    charm: 50,
    happy: 30,
    desc: "海上移動城堡",
  },
  {
    id: "lux5",
    name: "私人飛機",
    price: 300000000,
    charm: 100,
    happy: 50,
    desc: "終極奢華",
  },
];
const NPC_TEMPLATES = {
  classmate: [
    { name: "陳奕安", personality: "friendly", baseRelation: 50 },
    { name: "林俊佑", personality: "quiet", baseRelation: 40 },
    { name: "王雲哲", personality: "outgoing", baseRelation: 60 },
    { name: "張劍輝", personality: "smart", baseRelation: 45 },
    { name: "劉謙停", personality: "athletic", baseRelation: 55 },
    { name: "買名翔", personality: "artistic", baseRelation: 50 },
    { name: "楊正熙", personality: "leader", baseRelation: 65 },
    { name: "鄭順吉", personality: "kind", baseRelation: 70 },
    {
      name: "陳雅婷",
      personality: "kind",
      baseRelation: 70,
      gender: "female",
    },
    {
      name: "林佳穎",
      personality: "smart",
      baseRelation: 48,
      gender: "female",
    },
    {
      name: "黃怡君",
      personality: "artistic",
      baseRelation: 50,
      gender: "female",
    },
    {
      name: "張心怡",
      personality: "gentle",
      baseRelation: 60,
      gender: "female",
    },
    {
      name: "李詩涵",
      personality: "quiet",
      baseRelation: 42,
      gender: "female",
    },
    {
      name: "王雅雯",
      personality: "outgoing",
      baseRelation: 62,
      gender: "female",
    },
    {
      name: "吳佩君",
      personality: "kind",
      baseRelation: 68,
      gender: "female",
    },
    {
      name: "劉欣怡",
      personality: "cheerful",
      baseRelation: 58,
      gender: "female",
    },
    {
      name: "蔡宜庭",
      personality: "artistic",
      baseRelation: 52,
      gender: "female",
    },
    {
      name: "楊靜怡",
      personality: "gentle",
      baseRelation: 56,
      gender: "female",
    },
  ],
  colleague: [
    // 男性同事
    {
      name: "王經理志明",
      personality: "strict",
      baseRelation: 30,
      gender: "male",
    },
    {
      name: "陳工程師建國",
      personality: "quiet",
      baseRelation: 40,
      gender: "male",
    },
    {
      name: "林主管文龍",
      personality: "competitive",
      baseRelation: 35,
      gender: "male",
    },
    {
      name: "張協理俊宏",
      personality: "leader",
      baseRelation: 45,
      gender: "male",
    },
    {
      name: "黃資深員工志豪",
      personality: "helpful",
      baseRelation: 60,
      gender: "male",
    },

    // 女性同事
    {
      name: "李姐淑芬",
      personality: "helpful",
      baseRelation: 65,
      gender: "female",
    },
    {
      name: "劉小姐雅芳",
      personality: "cheerful",
      baseRelation: 55,
      gender: "female",
    },
    {
      name: "吳主任美玲",
      personality: "strict",
      baseRelation: 32,
      gender: "female",
    },
    {
      name: "陳秘書佩珊",
      personality: "kind",
      baseRelation: 58,
      gender: "female",
    },
    {
      name: "楊組長淑惠",
      personality: "competitive",
      baseRelation: 38,
      gender: "female",
    },
  ],

  neighbor: [
    // 男性鄰居
    {
      name: "隔壁老王",
      personality: "nosy",
      baseRelation: 45,
      gender: "male",
    },
    {
      name: "樓下陳伯伯",
      personality: "kind",
      baseRelation: 60,
      gender: "male",
    },
    {
      name: "對門的大學生小傑",
      personality: "friendly",
      baseRelation: 50,
      gender: "male",
    },
    {
      name: "一樓林先生",
      personality: "quiet",
      baseRelation: 42,
      gender: "male",
    },

    // 女性鄰居
    {
      name: "樓上陳太太",
      personality: "gossipy",
      baseRelation: 40,
      gender: "female",
    },
    {
      name: "王媽媽",
      personality: "kind",
      baseRelation: 65,
      gender: "female",
    },
    {
      name: "便利商店店員小美",
      personality: "friendly",
      baseRelation: 55,
      gender: "female",
    },
    {
      name: "鄰居李阿姨",
      personality: "helpful",
      baseRelation: 58,
      gender: "female",
    },
  ],

  romantic: [
    // 適合當戀愛對象的女生
    {
      name: "林心如",
      personality: "gentle",
      baseRelation: 30,
      gender: "female",
      charm: 80,
    },
    {
      name: "陳雨涵",
      personality: "artistic",
      baseRelation: 28,
      gender: "female",
      charm: 75,
    },
    {
      name: "張詩婷",
      personality: "quiet",
      baseRelation: 25,
      gender: "female",
      charm: 78,
    },
    {
      name: "黃怡安",
      personality: "cheerful",
      baseRelation: 32,
      gender: "female",
      charm: 82,
    },
    {
      name: "李雅筑",
      personality: "smart",
      baseRelation: 26,
      gender: "female",
      charm: 76,
    },
    {
      name: "王思涵",
      personality: "kind",
      baseRelation: 30,
      gender: "female",
      charm: 79,
    },
    {
      name: "吳佳蓉",
      personality: "outgoing",
      baseRelation: 35,
      gender: "female",
      charm: 77,
    },
    {
      name: "劉婉婷",
      personality: "gentle",
      baseRelation: 28,
      gender: "female",
      charm: 81,
    },

    // 適合當戀愛對象的男生
    {
      name: "陳柏宇",
      personality: "confident",
      baseRelation: 28,
      gender: "male",
      charm: 78,
    },
    {
      name: "林子軒",
      personality: "mature",
      baseRelation: 25,
      gender: "male",
      charm: 80,
    },
    {
      name: "張文凱",
      personality: "cheerful",
      baseRelation: 30,
      gender: "male",
      charm: 75,
    },
    {
      name: "黃俊凱",
      personality: "athletic",
      baseRelation: 32,
      gender: "male",
      charm: 77,
    },
    {
      name: "李冠廷",
      personality: "smart",
      baseRelation: 26,
      gender: "male",
      charm: 76,
    },
    {
      name: "王宥勝",
      personality: "gentle",
      baseRelation: 28,
      gender: "male",
      charm: 79,
    },
    {
      name: "吳承澔",
      personality: "confident",
      baseRelation: 30,
      gender: "male",
      charm: 82,
    },
    {
      name: "劉彥廷",
      personality: "mature",
      baseRelation: 27,
      gender: "male",
      charm: 81,
    },
  ],

  // 額外：老師/長輩
  teacher: [
    {
      name: "王老師淑貞",
      personality: "strict",
      baseRelation: 50,
      gender: "female",
    },
    {
      name: "陳老師文雄",
      personality: "kind",
      baseRelation: 60,
      gender: "male",
    },
    {
      name: "林老師美惠",
      personality: "helpful",
      baseRelation: 65,
      gender: "female",
    },
    {
      name: "張老師志成",
      personality: "strict",
      baseRelation: 48,
      gender: "male",
    },
    {
      name: "黃老師雅芳",
      personality: "gentle",
      baseRelation: 62,
      gender: "female",
    },
  ],

  // 額外：朋友的朋友
  friend: [
    {
      name: "陳品翰",
      personality: "outgoing",
      baseRelation: 45,
      gender: "male",
    },
    {
      name: "林思妤",
      personality: "cheerful",
      baseRelation: 50,
      gender: "female",
    },
    {
      name: "黃宇辰",
      personality: "friendly",
      baseRelation: 48,
      gender: "male",
    },
    {
      name: "張詠晴",
      personality: "kind",
      baseRelation: 52,
      gender: "female",
    },
    {
      name: "李承翰",
      personality: "athletic",
      baseRelation: 46,
      gender: "male",
    },
    {
      name: "王芷萱",
      personality: "artistic",
      baseRelation: 50,
      gender: "female",
    },
  ],
};
const NPC_INTERACTIONS = {
  chat: { cost: 10, relationChange: 5, moneyChange: 0, desc: "閒聊" },
  help: {
    cost: 20,
    relationChange: 10,
    moneyChange: -1000,
    desc: "幫助對方",
  },
  gift: {
    cost: 15,
    relationChange: 15,
    moneyChange: -3000,
    desc: "送禮物",
  },
  date: {
    cost: 25,
    relationChange: 20,
    moneyChange: -2000,
    desc: "約會",
    requireRelation: 50,
  },
  argue: { cost: 5, relationChange: -20, moneyChange: 0, desc: "爭吵" },
};
const NPC_DIALOGUES = {
  // 閒聊 (chat)
  chat: {
    friendly: [
      "嘿！最近過得怎麼樣？",
      "上次那家餐廳真的不錯，改天一起去？",
      "看到你真開心！",
    ],
    quiet: [
      "......（微笑點頭）",
      "最近讀了一本好書...",
      "這裡有點吵，不過看到你還不錯。",
    ],
    outgoing: [
      "唷！今晚要不要去嗨一下？",
      "我有個超酷的計畫，要不要聽聽？",
      "你今天的穿搭很帥喔！",
    ],
    strict: [
      "最近工作還順利嗎？",
      "要在社會上立足，規劃很重要。",
      "別浪費時間在無意義的事情上。",
    ],
    kind: [
      "要記得多休息喔。",
      "有什麼煩惱都可以跟我說。",
      "看到你這麼努力，我也要加油了。",
    ],
    high_relation: [
      // 好感度 > 80 專用
      "你是我最信任的人。",
      "只要你需要，我隨時都在。",
      "認識你真是我這輩子最幸運的事。",
    ],
  },
  // 送禮 (gift)
  gift: {
    friendly: "哇！這太棒了，謝謝你！",
    quiet: "這...是給我的？謝謝...",
    outgoing: "天啊！這正是我想要的！愛死你了！",
    strict: "讓你破費了，我會好好珍惜的。",
    kind: "你是認真的嗎？太感動了...",
  },
};
const DATE_LOCATIONS = [
  {
    id: "park",
    name: "🌳 公園散步",
    cost: 0,
    desc: "免費且放鬆，適合聊天",
    effect: { happy: 5, relation: 3 },
    minRelation: 0,
  },
  {
    id: "cafe",
    name: "☕ 咖啡廳",
    cost: 800,
    desc: "安靜的氛圍，適合深入交流",
    effect: { happy: 10, relation: 8 },
    minRelation: 20,
  },
  {
    id: "movie",
    name: "🎬 電影院",
    cost: 1500,
    desc: "看場熱門電影，話題滿滿",
    effect: { happy: 15, relation: 12 },
    minRelation: 30,
  },
  {
    id: "restaurant",
    name: "🍷 高級餐廳",
    cost: 5000,
    desc: "浪漫的燭光晚餐，大幅提升關係",
    effect: { happy: 25, relation: 25 },
    minRelation: 50,
  },
  {
    id: "trip",
    name: "✈️ 兩天一夜旅遊",
    cost: 20000,
    desc: "創造專屬回憶 (需戀人關係)",
    effect: { happy: 50, relation: 40 },
    minRelation: 80,
    loversOnly: true,
  },
];
const calc = (min, max, bonus = 1) => Math.floor((Math.random() * (max - min + 1) + min) * bonus);
const ACTIONS_POOL = {
  // 👶 嬰兒期 (0-2歲) - 充滿本能與混亂
  infant: [
    { id: "cry", name: "😭 哭鬧", cost: { stamina: 10 }, effect: (g) => { g.happy += calc(3, 6); return "肺活量+1，爸媽崩潰了"; } },
    { id: "sleep", name: "😴 睡覺", cost: { stamina: 20 }, effect: (g) => { g.health += calc(2, 5); g.happy += calc(2, 4); return "夢到了奶奶海"; } },
    { id: "play_toy", name: "🧸 玩玩具", cost: { stamina: 15 }, effect: (g) => { g.happy += calc(6, 12); g.intel += calc(0, 1); return "把玩具咬得全是口水"; } },
    { id: "act_cute", name: "🥺 賣萌", cost: { stamina: 15 }, effect: (g) => { g.skills.charm += calc(2, 4, g.skillBonus); g.happy += 5; if(Math.random()<0.3){ g.money+=500; return "爸媽被萌到了，給了零用錢！"; } return "大家都說你可愛"; } },
    { id: "explore", name: "🏠 探索", cost: { stamina: 20 }, effect: (g) => { g.intel += calc(2, 5, g.learnBonus); return "發現沙發底下有枚硬幣"; } },
    { id: "learn_speak", name: "🗣️ 學說話", cost: { stamina: 25 }, effect: (g) => { g.skills.communication += calc(2, 5, g.skillBonus); g.intel += 2; return "叫出了第一聲爸爸/媽媽！"; } },
    { id: "crawl", name: "🐛 爬行", cost: { stamina: 30 }, effect: (g) => { g.health += 5; return "在家裡飆車"; } },
    { id: "milk", name: "🍼 喝奶奶", cost: { stamina: 10 }, effect: (g) => { g.health += 3; g.happy += 3; return "飽足感 MAX"; } },
    { id: "stare", name: "👀 發呆", cost: { stamina: 5 }, effect: (g) => { g.intel += 1; return "思考嬰兒人生的意義..."; } },
    { id: "poop", name: "💩 便便", cost: { stamina: 20 }, effect: (g) => { g.health += 2; g.happy += 5; return "通體舒暢！但需要換尿布"; } },
    { id: "bite", name: "🦷 咬東西", cost: { stamina: 15 }, effect: (g) => { g.health += 1; return "正在長牙齒，什麼都想咬"; } },
    { id: "roll", name: "🔄 翻身", cost: { stamina: 25 }, effect: (g) => { g.health += 3; return "世界旋轉了起來"; } },
  ],

  // 🧸 幼兒期 (3-5歲) - 好奇心爆發
  toddler: [
    { id: "kindergarten", name: "🏫 上幼兒園", cost: { stamina: 20 }, effect: (g) => { g.intel += calc(2, 4, g.learnBonus); g.skills.communication += 2; return "交到了第一個朋友"; } },
    { id: "play_outside", name: "🌳 戶外玩耍", cost: { stamina: 20 }, effect: (g) => { g.health += calc(3, 7); g.happy += 5; return "弄得全身都是泥巴"; } },
    { id: "draw", name: "🖍️ 畫畫", cost: { stamina: 15 }, effect: (g) => { g.skills.art += calc(3, 6, g.skillBonus); return "畫了一隻長得像爸爸的豬"; } },
    { id: "prank", name: "🤡 惡作劇", cost: { stamina: 15 }, effect: (g) => { g.happy += 15; g.skills.charm -= 2; return "把遙控器藏在冰箱裡"; } },
    { id: "ask_money", name: "💰 要零用錢", cost: { stamina: 10 }, effect: (g) => { if(Math.random() < 0.4 + g.skills.charm/200){ const m = calc(100, 500); g.money += m; return `成功用可愛攻勢要到了 $${m}`; } g.happy -= 5; return "被拒絕了...哭倒在地"; } },
    { id: "blocks", name: "🧱 堆積木", cost: { stamina: 15 }, effect: (g) => { g.intel += 3; g.skills.art += 1; return "蓋了一座歪歪斜斜的塔"; } },
    { id: "watch_tv", name: "📺 看卡通", cost: { stamina: 10 }, effect: (g) => { g.happy += 8; g.intel -= 1; return "跟著電視一起唱跳"; } },
    { id: "sing", name: "🎵 唱歌", cost: { stamina: 15 }, effect: (g) => { g.skills.charm += 2; g.happy += 5; return "魔音傳腦"; } },
    { id: "ask_why", name: "❓ 問為什麼", cost: { stamina: 20 }, effect: (g) => { g.intel += 4; g.skills.communication += 1; return "爸媽被問到崩潰"; } },
    { id: "refuse_eat", name: "🥕 挑食", cost: { stamina: 10 }, effect: (g) => { g.health -= 2; g.happy += 5; return "把紅蘿蔔偷偷丟掉"; } },
    { id: "mud_pie", name: "🥧 做泥巴派", cost: { stamina: 25 }, effect: (g) => { g.skills.art += 3; g.skills.cooking += 1; return "看起來很好吃(不能吃)"; } },
    { id: "share_toy", name: "🤝 分享玩具", cost: { stamina: 15 }, effect: (g) => { g.skills.charm += 5; return "學會了分享"; } },
  ],

  // 🎒 兒童期 (6-12歲) - 學習與玩樂
  child: [
    { id: "study_hard", name: "📚 認真讀書", cost: { stamina: 30 }, effect: (g) => { g.intel += calc(4, 8, g.learnBonus); if(g.isStudying) g.studyProgress+=10; return "考了一百分！"; } },
    { id: "read_comic", name: "📖 看漫畫", cost: { stamina: 15 }, effect: (g) => { g.happy += 10; g.intel += 1; return "學到了奇怪的戰鬥姿勢"; } },
    { id: "sports", name: "⚽ 運動", cost: { stamina: 20 }, effect: (g) => { g.health += 5; g.skills.charm += 1; return "雖然輸了但很開心"; } },
    { id: "play_game", name: "🎮 打電動", cost: { stamina: 15 }, effect: (g) => { g.happy += 15; g.intel -= 1; g.health -= 2; return "再玩一局就好..."; } },
    { id: "internet", name: "🌐 上網", cost: { stamina: 15 }, effect: (g) => { g.intel += 2; g.happy += 5; g.health -= 2; return "發現了新世界"; } },
    { id: "cram_school", name: "🏫 補習班", cost: { stamina: 25, money: 2000 }, effect: (g) => { g.intel += calc(6, 12, g.learnBonus); g.happy -= 5; return "好想回家..."; } },
    { id: "help_house", name: "🧹 幫忙家務", cost: { stamina: 20 }, effect: (g) => { g.money += 500; g.happy += 2; return "獲得父母獎勵 $500"; } },
    { id: "piano", name: "🎹 練鋼琴", cost: { stamina: 20 }, effect: (g) => { g.skills.art += calc(3, 6, g.skillBonus); return "鄰居覺得很吵"; } },
    { id: "science", name: "🧪 科學實驗", cost: { stamina: 20 }, effect: (g) => { g.intel += 4; return "差點燒掉眉毛"; } },
    { id: "climb_tree", name: "🌳 爬樹", cost: { stamina: 25 }, effect: (g) => { g.health += 4; if(Math.random()<0.2){ g.health-=5; return "摔下來了！痛！"; } return "風景真好"; } },
    { id: "catch_bug", name: "🐞 抓昆蟲", cost: { stamina: 20 }, effect: (g) => { g.happy += 5; g.intel += 2; return "抓到獨角仙了！"; } },
    { id: "secret_base", name: "🏰 秘密基地", cost: { stamina: 25 }, effect: (g) => { g.happy += 10; g.skills.leadership += 2; return "你是孩子王"; } },
    { id: "forget_hw", name: "📝 忘記作業", cost: { stamina: 5 }, effect: (g) => { g.happy += 5; g.intel -= 2; return "老師很生氣，但你很優閒"; } },
  ],

  // 🎧 青春期 (13-17歲) - 叛逆與探索
  teen: [
    { id: "exam_prep", name: "📝 準備考試", cost: { stamina: 35 }, effect: (g) => { g.intel += calc(8, 15, g.learnBonus); g.happy -= 5; return "為了考上第一志願"; } },
    { id: "club", name: "🎭 參加社團", cost: { stamina: 20 }, effect: (g) => { g.skills.communication += 3; g.skills.charm += 2; g.happy += 5; return "社團生活真豐富"; } },
    { id: "date", name: "💕 約會", cost: { stamina: 30, money: 1000 }, effect: (g) => { g.happy += 15; g.skills.charm += 5; return "手牽手心跳加速"; } },
    { id: "skip_class", name: "🏃 翹課", cost: { stamina: 10 }, effect: (g) => { g.happy += 20; g.intel -= 5; if(Math.random()<0.3){ g.happy-=30; return "被教官抓到了！記大過！"; } return "牆外的空氣真香"; } },
    { id: "part_time", name: "💼 打工", cost: { stamina: 30 }, effect: (g) => { const m = calc(3000, 5000); g.money += m; g.skills.communication += 2; return `便利商店打工賺了 $${m}`; } },
    { id: "write_novel", name: "✍️ 寫小說", cost: { stamina: 25 }, effect: (g) => { g.skills.art += 4; g.intel += 2; if(Math.random()<0.1){ g.money+=10000; g.happy+=20; return "小說在網路上爆紅！賺了版稅"; } return "沒人看，但寫得很爽"; } },
    { id: "code", name: "💻 自學程式", cost: { stamina: 25 }, effect: (g) => { g.skills.programming += calc(5, 10, g.skillBonus); return "Hello World!"; } },
    { id: "volunteer", name: "🤝 志工服務", cost: { stamina: 25 }, effect: (g) => { g.happy += 10; g.skills.charm += 5; return "幫助別人讓心靈富足"; } },
    { id: "gym", name: "💪 健身", cost: { stamina: 25, money: 500 }, effect: (g) => { g.health += 8; g.skills.charm += 2; return "肌肉開始線條分明"; } },
    { id: "social_media", name: "📱 滑IG", cost: { stamina: 15 }, effect: (g) => { g.happy += 5; g.intel -= 1; return "發了一張文青照"; } },
    { id: "dye_hair", name: "💇 染頭髮", cost: { stamina: 10, money: 2000 }, effect: (g) => { g.money -= 2000; g.skills.charm += 5; return "染了超酷的顏色，教官氣瘋"; } },
    { id: "love_letter", name: "💌 寫情書", cost: { stamina: 20 }, effect: (g) => { g.skills.art += 2; g.happy -= 5; return "寫了又撕，撕了又寫..."; } },
    { id: "sneak_out", name: "🌙 半夜溜出門", cost: { stamina: 30 }, effect: (g) => { if(Math.random()<0.5){ g.happy+=15; return "看夜景吃宵夜"; } g.health-=10; return "遇到不良少年勒索..."; } },
  ],

  // 💼 成年人 (18歲以上) - 現實與夢想
  adult: [
    // 基礎生存
    { id: "work", name: "💼 上班", cost: { stamina: 35 }, condition: (g)=>g.jobId!=='none', effect: (g) => { 
        const job = JOBS.find(j=>j.id===g.jobId); 
        const base = (job.salary + (g.salaryBonus||0)) * (g.inflationRate||1);
        const pay = Math.floor(base * g.incomeBonus);
        g.money += pay; g.jobYears++; g.health-=2; g.happy-=5; 
        if(job.effect) job.effect(g);
        return `社畜的一天，獲得 $${pay.toLocaleString()}`; 
    }},
    { id: "find_job", name: "📰 找工作", cost: { stamina: 20 }, condition: (g)=>g.jobId==='none', effect: (g) => { return "請到「職業頁面」投履歷"; } },
    { id: "side_hustle", name: "🛵 跑外送", cost: { stamina: 30 }, effect: (g) => { const m = calc(5000, 15000) * (g.inflationRate||1); g.money += m; g.health -= 3; return `風吹日曬賺了 $${Math.floor(m).toLocaleString()}`; } },
    
    // 投資理財
    { id: "lottery", name: "🎫 買彩券", cost: { stamina: 5, money: 500 }, effect: (g) => { 
        g.money -= 500; 
        if(Math.random()<0.0001){ g.money+=100000000; g.happy+=100; return "中了頭獎一億！！！改變人生！"; }
        if(Math.random()<0.1){ g.money+=2000; return "中了小獎 $2000"; }
        return "貢獻公益..."; 
    }},
    { id: "invest", name: "📈 投資股票", cost: { stamina: 10, money: 50000 }, effect: (g) => {
        g.money -= 50000;
        const roi = (Math.random() * 0.6 - 0.25) + (g.skills.finance/200); // -25% ~ +35%
        const profit = Math.floor(50000 * (1 + roi));
        g.money += profit;
        if(profit > 50000) { g.happy+=5; return `股票漲了！變現 $${profit.toLocaleString()}`; }
        else { g.happy-=10; return `被套牢...剩 $${profit.toLocaleString()}`; }
    }},
    { id: "crypto", name: "🪙 加密貨幣", cost: { stamina: 15, money: 100000 }, effect: (g) => {
        g.money -= 100000;
        const roi = Math.random() * 3; // 0 ~ 3倍 (波動極大)
        if(Math.random() < 0.4) { g.happy-=20; return "交易所倒閉！血本無歸..."; }
        const profit = Math.floor(100000 * roi);
        g.money += profit;
        return `幣圈一天人間一年！資產變 $${profit.toLocaleString()}`;
    }},

    // 休閒娛樂
    { id: "socialize", name: "🍻 居酒屋", cost: { stamina: 20, money: 3000 }, effect: (g) => { g.money -= 3000; g.happy += 15; g.skills.communication += 3; return "抱怨老闆真爽"; } },
    { id: "travel", name: "✈️ 出國旅遊", cost: { stamina: 0, money: 80000 }, effect: (g) => { g.money -= 80000; g.happy += 50; g.stamina = 100; return "身心靈徹底充電！"; } },
    { id: "night_club", name: "🕺 去夜店", cost: { stamina: 30, money: 6000 }, effect: (g) => { g.money -= 6000; g.happy += 25; g.skills.charm += 5; g.health -= 5; return "嗨了一整晚，腰酸背痛"; } },
    { id: "luxury_meal", name: "🍣 Omakase", cost: { stamina: 5, money: 8000 }, effect: (g) => { g.money -= 8000; g.happy += 20; g.health += 2; return "享受頂級壽司"; } },
    { id: "online_shopping", name: "🛍️ 網購舒壓", cost: { stamina: 10, money: 5000 }, effect: (g) => { g.money -= 5000; g.happy += 10; return "買了一堆不需要的東西"; } },
    { id: "fishing", name: "🎣 釣魚", cost: { stamina: 25 }, effect: (g) => { g.happy += 5; if(Math.random()<0.2) { g.happy+=15; return "釣到大魚！"; } return "餵蚊子..."; } },
    { id: "massage", name: "💆 按摩", cost: { stamina: 0, money: 2000 }, effect: (g) => { g.money -= 2000; g.stamina += 20; g.health += 2; return "師傅手勁很強"; } },

    // 自我提升
    { id: "learn_skill", name: "📖 進修技能", cost: { stamina: 30, money: 5000 }, effect: (g) => { 
        const skills = ['programming','art','finance','communication','medical','cooking','leadership'];
        const s = skills[Math.floor(Math.random()*skills.length)];
        g.skills[s] += 5; g.money -= 5000; return `參加課程，${s} 技能提升了`; 
    }},
    { id: "gym", name: "💪 健身房", cost: { stamina: 25, money: 1000 }, effect: (g) => { g.money -= 1000; g.health += 10; g.skills.charm += 2; return "深蹲救台灣"; } },
    
    // 健康與風險
    { id: "hospital", name: "🏥 健康檢查", cost: { stamina: 10, money: 10000 }, effect: (g) => { g.money -= 10000; g.health += 20; return "醫生說要少熬夜"; } },
    { id: "casino", name: "🎲 去賭場", cost: { stamina: 15, money: 50000 }, effect: (g) => { 
        g.money -= 50000; 
        if(Math.random() < 0.48) { const win = 50000 * 2; g.money += win; g.happy+=20; return `賭贏了！獲得 $${win.toLocaleString()}`; }
        g.happy -= 30; return "輸到脫褲子...";
    }},
    
    // 特殊與惡搞
    { id: "overtime", name: "🔥 加班", cost: { stamina: 40 }, effect: (g) => { g.money += 3000; g.health -= 5; g.happy -= 10; return "肝在燃燒，錢包微鼓"; } },
    { id: "do_nothing", name: "🛌 躺平", cost: { stamina: 5 }, effect: (g) => { g.happy += 2; g.money -= 500; return "不想努力了，消耗存款 $500"; } },
    { id: "office_gossip", name: "👂 茶水間八卦", cost: { stamina: 10 }, effect: (g) => { g.skills.communication += 2; g.skills.leadership -= 1; return "聽說經理有外遇..."; } },
    { id: "clean_house", name: "🧹 大掃除", cost: { stamina: 30 }, effect: (g) => { g.happy += 5; if(Math.random()<0.1) { g.money+=1000; return "在沙發縫隙找到私房錢！"; } return "家裡煥然一新"; } },
  ]
};
const LOCATIONS = [
  { id: "home", name: "溫暖的家", icon: "🏠", desc: "你的避風港，睡覺補體力的地方。" },
  { id: "park", name: "公園", icon: "🌳", desc: "散步運動的好去處，偶爾會遇到熟人。" },
  { id: "school", name: "學校/圖書館", icon: "🏫", desc: "學習知識、進修技能的場所。" },
  
  { id: "mall", name: "購物中心", icon: "🛍️", desc: "充滿慾望的地方，可以買奢侈品或吃大餐。" },
  { id: "cbd", name: "金融中心", icon: "🏢", desc: "銀行、證券交易所，金錢流動的中心。" },
  { id: "hospital", name: "醫院", icon: "🏥", desc: "生病受傷來這裡，也能進行健康檢查。" },
  
  { id: "temple", name: "寺廟", icon: "⛩️", desc: "祈求平安、改運的心靈寄託。" },
  { id: "club_area", name: "娛樂區", icon: "💃", desc: "夜店、賭場，紙醉金迷的夜生活。" },
  { id: "airport", name: "機場", icon: "✈️", desc: "通往世界的門戶，可出國旅遊。" }
];