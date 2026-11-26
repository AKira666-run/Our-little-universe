/* ============================================================
   💗 Our Little Universe · config.js(内容配置文件)
   ------------------------------------------------------------
   ★ 这是你唯一需要经常修改的文件 ★
   网站上的所有文字、日期、照片路径都集中在这里,
   其他文件(script.js / style.css)一般不需要动。

   目录:
   ① 网站标题与文案
   ② 我们俩的昵称和头像
   ③ 恋爱开始日期(恋爱天数由此自动计算)
   ④ 首页封面照片
   ⑤ 我们的故事(时间轴回忆)
   ⑥ 回忆相册
   ⑦ 未来约定清单
   ⑧ 纪念日(自动倒计时)

   小贴士:
   · 日期格式统一写成 "YYYY-MM-DD",例如 "2024-02-14";
   · 照片请先放进 public/images/ 文件夹,再在这里填写路径;
   · 带 ⚠️ 的地方都是占位内容,记得换成你们自己的信息。
   ============================================================ */

const CONFIG = {

  /* ---------- ① 网站标题与文案 ---------- */
  site: {
    name: "Our Little Universe",             // 网站名称
    subtitle: "A Little World Just for Us",  // 英文副标题
    // 首页那句温柔的欢迎语
    welcome: "欢迎来到只属于我们两个人的小宇宙 🌷",
    // 首页爱情寄语(显示在信纸卡片上)
    quote: "把平凡的日子过成纪念日,把我们过成彼此的宇宙。✨",
    // 页脚小话
    footer: "这本小册子会一直更新,直到把所有愿望都变成回忆。",
  },

  /* ---------- ② 我们俩 ---------- */
  // ⚠️ 下面两个昵称是占位内容,请改成你们自己的昵称
  people: {
    me: {
      nickname: "孙思远",                  // ← 改成你的昵称
      emoji: "🧸",                           // 代表你的小图标
      avatar: "public/images/avatar-me.svg", // ← 可换成你自己的照片(建议正方形)
    },
    partner: {
      nickname: "杨许诺",                  // ← 改成女朋友的昵称
      emoji: "🐰",                           // 代表她的小图标
      avatar: "public/images/avatar-partner.svg",
    },
  },

  /* ---------- ③ 恋爱开始日期 ---------- */
  // ⚠️ 占位日期,请改成你们在一起的那一天
  // 首页恋爱天数、"X年X个月X天"、纪念日倒计时都由它自动计算
  loveStartDate: "2025-11-30",

  /* ---------- ④ 首页封面照片 ---------- */
  // ⚠️ 目前是占位图。把你们的合照放进 public/images/ 后,
  //    例如照片叫 cover.jpg,就把下面改成:coverImage: "public/images/cover.jpg"
  coverImage: "public/images/1.jpg",

  /* ---------- ⑤ 我们的故事(时间轴) ---------- */
  // 每段回忆包含:date 日期 / title 标题 / emoji 小图标 /
  //            text 回忆描述 / photos 照片数组(可以放多张)
  // ✚ 增加新回忆:复制一整段 { ... },粘贴到列表末尾并修改内容即可
  memories: [
    {
      date: "2025-11-25",            // ⚠️ 占位日期
      title: "你向我表白",
      emoji: "❤",
      text: "✏️ 在昆明湖，特别冷，但是也特别震惊，给我鼻涕都冻出来了。",
      photos: ["public/images/2.jpg"],
    },
    {
      date: "2025-11-27",            // ⚠️ 占位日期
      title: "我们第一次看电影",
      emoji: "🎬",
      text: "✏️ 第一次看了疯狂动物城，你还说我的笑特别魔性，这也是我们第一次约会",
      photos: ["public/images/3.jpg"],
    },
    {
      date: "2025-11-29",            // ⚠️ 占位日期
      title: "我们第一次一起吃饭",
      emoji: "🍽️",
      text: "✏️ 铁锅炖特别香",
      photos: ["public/images/4.jpg"],
    },
    {
      date: "2025-12-30",            // ⚠️ 占位日期
      title: "我们的第一个月",
      emoji: "💌",
      text: "✏️ 特别感动，这个手工册我仍然好好保留着",
      photos: ["public/images/5.jpg"],
    },
    {
      date: "2026-01-01",            // ⚠️ 占位日期
      title: "我们第一次跨年",
      emoji: "🎆",
      text: "✏️ 第一次一起跨年，住的房间特别冷",
      photos: ["public/images/6.jpg"],
    },
    {
      date: "2026-01-10",            // ⚠️ 占位日期
      title: "我们第一次一起旅游",
      emoji: "📷",
      text: "✏️ 第一次去洛阳，特别冷，但是玩的很不错，尤其是住的地方特别好",
      photos: ["public/images/7.jpg"],
    },
    {
      date: "2026-04-05",            // ⚠️ 占位日期
      title: "我们第一次去游乐场",
      emoji: "🎡",
      text: "✏️ 第一去游乐场，去了乐华，玩了闪电，特别惊悚",
      photos: ["public/images/8.jpg"],
    },
    {
      date: "2026-05-01",            // ⚠️ 占位日期
      title: "我们一起去成都",
      emoji: "🐼",
      text: "✏️ 去成都看了熊猫，吃了火锅，路途上也发生了一些不愉快，好在都解决了",
      photos: ["public/images/9.jpg"],
    },
    {
      date: "2026-09-01",            // ⚠️ 占位日期
      title: "我们一起去青岛",
      emoji: "🌊",
      text: "✏️ 去青岛感受了“红瓦绿树，碧海蓝天”，这也是你最喜欢的城市之一",
      photos: ["public/images/10.jpg"],
    },
  ],

  /* ---------- ⑥ 回忆相册 ---------- */
  // 每张照片包含:title 一句话说明 / src 照片路径
  // (照片下方和放大查看时都不再显示日期;个别条目里留下的 date 只作记录,不影响显示)
  // 可选:加一个 note 写句补充说明,翻开后显示在标题下面
  // ✚ 增加照片:先把图片放进 public/images/gallery/,
  //            再复制一段 { ... } 并修改内容即可,数量不限
  gallery: [
    { title: "购买了情侣围巾", src: "public/images/gallery/11.jpg" },
    { date: "2026-04-24", title: "运动会和历小麒合照", src: "public/images/gallery/12.jpg" },
    { date: "2026-05-23", title: "一起去拼豆", src: "public/images/gallery/13.jpg" },
    { date: "2025-12-29", title: "生病了你给我买梨汤", src: "public/images/gallery/14.jpg" },
    { date: "2024-05-20", title: "你最爱的一张", src: "public/images/gallery/15.jpg" },
    { date: "2024-06-01", title: "你给我过生日", src: "public/images/gallery/16.jpg" },
    { date: "2024-07-07", title: "在茅坡看见了小狗亲亲", src: "public/images/gallery/17.jpg" },
    { date: "2024-08-08", title: "你给我挖耳朵", src: "public/images/gallery/18.jpg" },
  ],

  /* ---------- ⑦ 未来约定 ---------- */
  // 下面是示例愿望,随意增删修改;
  // 网页上点击卡片可以在「待完成 / 已完成」之间切换,状态会自动保存
  futureWishes: [
    { emoji: "⛰️", title: "一起去爬山",       note: "在山顶吹吹风，看最美的风景" },
    { emoji: "✈️", title: "一起出国旅行",   note: "手牵手漫步异国街头，感受异域风情" },
    { emoji: "🎤", title: "一起看一场演唱会", note: "在人群里大声合唱" },
    { emoji: "💰", title: "一起攒钱",         note: "为了我们未来的家和远方一起努力" },
    { emoji: "📷", title: "一起拍一套写真",   note: "把现在的我们存进照片里" },
    { emoji: "🌅", title: "一起看一次日出",   note: "熬一个通宵,换一次黎明" },
  ],

  /* ---------- ⑧ 纪念日(自动倒计时) ---------- */
  // 日期写第一次发生的年份;名字里带「生日」的会自动按周岁显示(如「20 岁生日」)
  // 「在一起的纪念日」会根据 loveStartDate 自动生成,不用在这里重复填
  anniversaries: [
    { emoji: "🎂", name: "SSY的生日",         date: "2007-10-20" },  // ← 改成你的生日
    { emoji: "🎁", name: "YXN的生日",         date: "2007-01-31" },  // ← 改成她的生日
    { emoji: "✨", name: "第一次见面的日子", date: "2025-11-01" },
    { emoji: "🧳", name: "第一次旅行的日子", date: "2026-01-10" },
  ],
};
