# Our Little Universe 💗 我们的小宇宙

一本专属于两个人的数字爱情纪念册:纯 HTML + CSS + JavaScript 编写,
无需服务器、无需数据库、无需注册登录,双击打开或部署后即可使用。

> A Little World Just for Us

## ✨ 功能一览

- 🏠 **首页**:欢迎语、两人头像与昵称、拍立得封面、爱情寄语、
  **自动计算的恋爱天数**(X 年 X 个月 X 天,每天自动更新,整百天还有小惊喜)
- 📖 **我们的故事**:手账风纵向时间轴,拍立得照片 + 和纸胶带 + 手绘贴纸
- 📷 **回忆相册**:瀑布流照片墙,**卡片默认背面朝上(只印一颗小爱心),点一下翻开才看到照片和文案**;
  翻开后点卡片右上角 🔍 可放大查看、左右翻页(支持键盘方向键)
- 🌙 **未来约定**:愿望清单卡片,点击可切换「待完成 / 已完成」,
  状态自动保存在浏览器本地(localStorage)
- 🎉 **纪念日**:自动倒计时,最近的排在最前,跨年也精确无误;
  当天会自动变成「就是今天 🎉」;生日会显示「20 岁生日」,在一起的纪念日显示「1 周年」
- 🎀 全站细节:漂浮爱心背景、点击冒爱心、滚动渐显、卡片悬停、
  手机端汉堡菜单,并适配「减少动态效果」的系统设置

## 📁 文件结构

```
our-love/
├── index.html          # 页面结构(五个版块都在这里)
├── style.css           # 全部视觉样式(配色/动画/响应式)
├── script.js           # 交互逻辑(天数计算/渲染/灯箱/倒计时)
├── config.js           # ⭐ 所有个人信息都在这里修改
└── public/
    └── images/         # 照片统一放这里
        ├── cover.svg            # 首页封面占位图 → 换成你们的合照
        ├── avatar-me.svg        # 你的头像占位图
        ├── avatar-partner.svg   # TA 的头像占位图
        ├── memory-01~08.svg     # 时间轴回忆照片占位图
        └── gallery/
            └── gallery-01~08.svg # 相册照片占位图
```

> 当前所有 `.svg` 都是手绘风占位图。把你们的真实照片
> (jpg / png)放进 `public/images/`,再到 `config.js`
> 里把对应路径改掉即可,例如:`"public/images/cover.jpg"`。

## 🚀 本地运行

方式一(最简单):直接双击 `index.html`,浏览器打开即用。

方式二(推荐,更接近线上效果):在 `our-love` 文件夹里启动一个本地服务器:

```bash
# 有 Node.js 的话
npx serve .
# 或有 Python 的话
python -m http.server 8080
```

然后浏览器访问提示的地址(如 http://localhost:3000 或 http://localhost:8080)。

## ✏️ 常见修改指南(只改 config.js)

| 想改什么 | 怎么做 |
| --- | --- |
| 昵称 | `people.me.nickname` / `people.partner.nickname` |
| 恋爱开始日期 | `loveStartDate: "2024-01-01"` 改成真实日期(格式 `YYYY-MM-DD`) |
| 首页欢迎语 / 寄语 | `site.welcome` / `site.quote` |
| 首页封面照片 | 照片放入 `public/images/` 后修改 `coverImage` |
| 头像 | `people.me.avatar` / `people.partner.avatar` |
| 加一段新回忆 | 在 `memories` 里复制一整段 `{ ... }` 改内容,可放多张照片 |
| 加相册照片 | 在 `gallery` 里复制一段 `{ ... }`,照片放入 `public/images/gallery/`;加 `note` 可写翻面后的悄悄话 |
| 加/改愿望 | 在 `futureWishes` 里复制一段 `{ ... }` |
| 加纪念日(生日等) | 在 `anniversaries` 里复制一段 `{ ... }` |

小贴士:纪念日里的「在一起的纪念日」会根据 `loveStartDate` 自动生成,
不用重复填写;生日请把年份写成出生年份,倒计时会自动逐年滚动。

## ☁️ 部署上线

### GitHub Pages

1. 在 GitHub 新建一个仓库(比如 `our-love`),把 `our-love` 文件夹里的
   全部内容上传(README、index.html、style.css、script.js、config.js、public/)。
2. 仓库页面 → **Settings** → **Pages** →
   Source 选择 `Deploy from a branch`,分支选 `main`,目录选 `/ (root)`,保存。
3. 等一两分钟,访问 `https://你的用户名.github.io/our-love/` 即可。
4. 以后每次修改,把新内容 push 上去就会自动更新。

### Vercel

1. 打开 [vercel.com](https://vercel.com) 用 GitHub 账号登录,
   **Add New… → Project**,选中刚上传的仓库直接 Import。
2. 框架预设留空(纯静态),直接点 **Deploy**。
3. 得到一个 `xxx.vercel.app` 的网址,以后 push 自动重新部署。

## ❓ 小提示

- 照片建议先压缩(单张 2MB 以内),网页加载会快很多。
- 封面建议横版照片(约 5:3.4),相册照片横竖不限(竖版更好看)。
- 所有页面文字都可在 `config.js` / `index.html` 中改成你们自己的话。
