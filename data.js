// ==========================================
// 🚗 資產清單：車子 (Cars)
// ==========================================
const CAR_DATA = [
    { id: 'toyota', name: "國產代步車", price: 600000, charm: 2, img: "images/toyota.jpg" },
    { id: 'tesla', name: "特斯拉 Model 3", price: 1800000, charm: 10, img: "images/tesla.jpg" },
    { id: 'porsche', name: "保時捷 911", price: 6000000, charm: 30, img: "images/porsche.jpg" },
    { id: 'ferrari', name: "法拉利 F8", price: 15000000, charm: 60, img: "images/ferrari.jpg" },
    // ⬇️ 以後想加新車，直接在下面複製貼上一行即可
    // { id: 'lamborghini', name: "藍寶堅尼", price: 20000000, charm: 80, img: "images/lambo.jpg" },
];

// ==========================================
// 🏠 資產清單：房子 (Houses)
// ==========================================
const HOUSE_DATA = [
    { id: 'apt', name: "單身公寓", price: 3000000, happy: 2, img: "images/apartment.jpg" },
    { id: 'mansion', name: "市中心豪宅", price: 20000000, happy: 10, img: "images/mansion.jpg" },
    { id: 'villa', name: "私人海景別墅", price: 100000000, happy: 30, img: "images/villa.jpg" },
    // ⬇️ 想加新房子寫這裡
];

// ==========================================
// ⚡ 隨機事件庫 (Events)
// ==========================================
// 這裡可以無限擴充！
const EVENT_DATA = [
    {
        title: "撿到錢包",
        desc: "路邊有個鼓鼓的錢包...",
        choices: [
            { txt: "私吞 (+$5000, 魅力-5)", effect: (p) => { p.money += 5000; p.charm -= 5; return "良心不安，但錢包很香。"; } },
            { txt: "送警局 (魅力+10)", effect: (p) => { p.charm += 10; return "你是個好人！"; } }
        ]
    },
    {
        title: "AI 危機",
        desc: "公司引進 AI，你可能被裁員。",
        choices: [
            { txt: "學習 AI (智力+5)", effect: (p) => { p.intel += 5; p.happy -= 5; return "你保住了工作，但很累。"; } },
            { txt: "擺爛 (快樂+5)", effect: (p) => { p.happy += 5; p.money -= 5000; return "被扣薪水了。"; } }
        ]
    },
    // ⬇️ 以後要在這裡加新事件，複製下面這塊格式修改即可：
    /*
    {
        title: "新事件標題",
        desc: "發生了什麼事...",
        choices: [
            { txt: "選項A", effect: (p) => { p.money += 100; return "結果A文字"; } },
            { txt: "選項B", effect: (p) => { p.health -= 10; return "結果B文字"; } }
        ]
    },
    */
];