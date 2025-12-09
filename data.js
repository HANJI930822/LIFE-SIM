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
          detailedEffect: "快樂衰減 +30%\n智力 +5",
          category: "personality",
          isNegative: true, // ✅ 标记为负面特质
          reward: { money: 50000, intel: 5 }, // ✅ 负面奖励
          conflictWith: ["optimistic"],
          effect: (g) => {
            g.happyDecay *= 1.3;
            g.intel += 5;
          },
          unlock: "default",
        },

        {
          id: "extrovert",
          name: "🎉 外向",
          desc: "善於社交，容易交朋友",
          detailedEffect: "社交效果 +50%\n魅力 +10\n初始好感 +5",
          category: "personality",
          conflictWith: ["introvert"],
          effect: (g) => {
            g.socialBonus *= 1.5;
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
          detailedEffect:
            "健康 +10\n魅力 +5\n投資成功率 +30%\n風險工作收入 +5%",
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
          money: 900000, // ✅ 原 1500000 → 900000 (-40%)
          intel: 130,
          happy: 70,
          yearlyMoney: 18000, // ✅ 原 30000 → 18000 (-40%)
          buff: "智商 +80",
          special: "scientist",
        },
      ];
      // ===== 補上缺失的 LIFE_STAGES 定義 =====

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
      // ===== 補上缺失的 ACHIEVEMENTS 定義 =====
      const ACHIEVEMENTS = [
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
          id: "centenarian",
          name: "百歲人瑞",
          desc: "活到 100 歲",
          icon: "🎂",
          check: (g) => g.age >= 100,
        },
        {
          id: "scholar",
          name: "博學多聞",
          desc: "獲得博士學位",
          icon: "🎓",
          check: (g) => g.education === "phd",
        },
        {
          id: "top_charm",
          name: "萬人迷",
          desc: "魅力達到 100",
          icon: "✨",
          check: (g) => g.skills.charm >= 100,
        },
        {
          id: "top_intel",
          name: "愛因斯坦",
          desc: "智力達到 100",
          icon: "🧠",
          check: (g) => g.intel >= 100,
        },
        {
          id: "social_butterfly",
          name: "社交名流",
          desc: "擁有 10 個以上的朋友",
          icon: "🦋",
          check: (g) => g.npcs.length >= 10,
        },
        {
          id: "happy_life",
          name: "快樂人生",
          desc: "快樂值維持 100",
          icon: "😊",
          check: (g) => g.happy >= 100,
        },
      ];
      // ===== 📖 出身開場劇情 =====
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

      // ✅ 修正與合併後的 finishCharacterCreation 函數
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
          name: "辦事員",
          salary: 25000,
          requirement: { intel: 40 },
          effect: (g) => {
            g.happy -= 2;
          },
          desc: "處理日常文書工作",
        },

        {
          id: "engineer",
          name: "工程師",
          salary: 50000,
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
          desc: "開發軟體系統",
        },

        {
          id: "doctor",
          name: "醫生",
          salary: 120000,
          requirement: { intel: 120, medical: 80 },
          requiredTrait: "athletic",
          traitBonus: { athletic: { salary: 1.2, desc: "運動健將薪資加成" } },
          effect: (g) => {
            g.health -= 5;
            g.skills.medical += 3;
          },
          desc: "救死扶傷的神聖職業",
        },

        {
          id: "artist",
          name: "藝術家",
          salary: 28000,
          requirement: { art: 70, charm: 60 },
          traitBonus: {
            artistic: { salary: 1.5, desc: "藝術天賦薪資加成 50%" },
            pessimistic: { salary: 1.3, desc: "悲觀主義者薪資加成 30%" },
          },
          effect: (g) => {
            g.happy += 10;
            g.skills.art += 3;
          },
          desc: "用藝術表達自我",
        },

        {
          id: "teacher",
          name: "教師",
          salary: 38000,
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
          desc: "教育下一代",
        },

        {
          id: "entrepreneur",
          name: "創業家",
          salary: 80000,
          requirement: { intel: 90, finance: 70, charm: 70 },
          traitBonus: {
            businessmind: { salary: 1.5, desc: "商業頭腦薪資加成" },
            brave: { salary: 1.3, desc: "勇敢者薪資加成" },
            lucky: { salary: 1.4, desc: "幸運兒薪資加成" },
            optimistic: { salary: 1.2, desc: "樂觀主義者薪資加成 20%" },
          },
          effect: (g) => {
            const fluctuation = Math.floor(Math.random() * 120000) - 60000; // ✅ 加大波動 -60k ~ +60k
            g.money += fluctuation;
            g.happy -= 15;
            g.health -= 8;
            if (fluctuation > 0)
              log(`📈 創業獲利 +${fluctuation.toLocaleString()}`);
            else log(`📉 創業虧損 ${Math.abs(fluctuation).toLocaleString()}`);
          },
          desc: "高風險高報酬的創業之路",
        },

        {
          id: "influencer",
          name: "網紅",
          salary: 60000,
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
            g.money += Math.floor(Math.random() * 40000) - 10000; // ✅ 收入波動 -10k ~ +30k
          },
          desc: "依賴流量的不穩定職業",
        },

        {
          id: "scientist",
          name: "科學家",
          salary: 65000,
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
          salary: 100000,
          requirement: { intel: 100, communication: 80 },
          effect: (g) => {
            g.skills.communication += 3;
            g.happy -= 8;
          },
          desc: "為正義辯護",
        },

        {
          id: "chef",
          name: "廚師",
          salary: 42000,
          requirement: { cooking: 80, art: 40 },
          effect: (g) => {
            g.skills.cooking += 3;
            g.happy += 5;
          },
          desc: "烹飪美食的藝術家",
        },

        {
          id: "pilot",
          name: "機師",
          salary: 135000,
          requirement: { intel: 90, health: 80 },
          effect: (g) => {
            g.health -= 5;
            g.happy += 3;
          },
          desc: "翱翔天際的職業",
        },

        {
          id: "athlete",
          name: "運動員",
          salary: 70000,
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
          salary: 45000,
          requirement: { health: 70, communication: 50 },
          effect: (g) => {
            g.health -= 3;
            g.happy -= 5;
          },
          desc: "維護社會治安",
        },

        {
          id: "designer",
          name: "設計師",
          salary: 48000,
          requirement: { art: 80, programming: 40 },
          effect: (g) => {
            g.skills.art += 3;
            g.happy += 3;
          },
          desc: "創造視覺美學",
        },

        // ===== 特殊出身專屬職業 =====
        {
          id: "hackerpro",
          name: "駭客",
          salary: 180000,
          requirement: { intel: 100, programming: 100 },
          originRequired: "hacker",
          effect: (g) => {
            g.skills.programming += 5;
            g.money += Math.floor(Math.random() * 400000) - 100000; // ✅ 大波動 -100k ~ +300k
          },
          desc: "高風險的灰色地帶",
        },

        {
          id: "royaladvisor",
          name: "皇室顧問",
          salary: 200000,
          requirement: { intel: 110, communication: 90 },
          originRequired: "royal",
          effect: (g) => {
            g.skills.charm += 3;
            g.happy += 10;
          },
          desc: "服務皇室的榮耀",
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
              log("⚠️ 電競選手年齡過大，反應速度下降");
            } else {
              g.happy += 15;
            }
          },
          desc: "25 歲巔峰期",
        },

        {
          id: "spyagent",
          name: "間諜",
          salary: 140000,
          requirement: { intel: 100, health: 80 },
          originRequired: "spy",
          effect: (g) => {
            g.health -= 8;
            g.money += Math.floor(Math.random() * 250000) - 50000; // ✅ 危險津貼波動
          },
          desc: "危險的祕密任務",
        },

        {
          id: "michelinchef",
          name: "米其林廚師",
          salary: 120000,
          requirement: { cooking: 100, art: 60 },
          originRequired: "cheffamily",
          effect: (g) => {
            g.skills.cooking += 5;
            g.skills.art += 2;
            g.happy += 8;
          },
          desc: "頂級料理大師",
        },
      ];
      // ==========================================
      // 🆕 新增：職業晉升系統
      // ==========================================
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
        Game.yearsPassed++; // ✅ 修正：game -> Game
        if (Game.yearsPassed % 5 === 0) {
          Game.inflationRate *= 1.03;
          log(`💸 物價上漲了 3%`);
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

      // ===== 🏫 教育系統 =====
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

      // 台灣實際學校名單
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
        {
          id: "car1",
          name: "國產代步車",
          price: 500000,
          charm: 3,
          desc: "遮風避雨就好",
        },
        {
          id: "car2",
          name: "Toyota Camry",
          price: 1200000,
          charm: 8,
          desc: "可靠耐用的中型房車",
        },
        {
          id: "car3",
          name: "Tesla Model 3",
          price: 1800000,
          charm: 15,
          desc: "電動車新潮流",
        },
        {
          id: "car4",
          name: "BMW 5系列",
          price: 3500000,
          charm: 25,
          desc: "豪華品牌象徵",
        },
        {
          id: "car5",
          name: "保時捷 911",
          price: 7000000,
          charm: 40,
          desc: "經典跑車",
        },
        {
          id: "car6",
          name: "法拉利 F8",
          price: 15000000,
          charm: 70,
          desc: "終極夢幻跑車",
        },
      ];

      const HOUSES = [
        {
          id: "house1",
          name: "小套房",
          price: 2500000,
          happy: 5,
          passive: 1800,
          desc: "溫馨的小窩",
        }, // 原3000 → 1800
        {
          id: "house2",
          name: "公寓",
          price: 6000000,
          happy: 12,
          passive: 4800,
          desc: "舒適的居住空間",
        }, // 原8000 → 4800
        {
          id: "house3",
          name: "透天厝",
          price: 12000000,
          happy: 20,
          passive: 9000,
          desc: "寬敞的獨立住宅",
        }, // 原15000 → 9000
        {
          id: "house4",
          name: "別墅",
          price: 25000000,
          happy: 30,
          passive: 18000,
          desc: "豪華的別墅",
        }, // 原30000 → 18000
        {
          id: "house5",
          name: "豪宅",
          price: 80000000,
          happy: 50,
          passive: 48000,
          desc: "頂級豪宅",
        }, // 原80000 → 48000
        {
          id: "house6",
          name: "城堡",
          price: 200000000,
          happy: 80,
          passive: 120000,
          desc: "夢幻的城堡",
        }, // 原200000 → 120000
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
      // ===== 👥 NPC 系統 =====
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