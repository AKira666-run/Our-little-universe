/* ============================================================
   💗 Our Little Universe · script.js(交互逻辑)
   ------------------------------------------------------------
   页面上所有"会动"的内容都由这里渲染:
   · 恋爱天数(自动计算,每天自动更新)
   · 时间轴回忆 / 相册照片墙 / 愿望清单 / 纪念日倒计时
   · 漂浮爱心背景、照片放大查看、点击冒爱心等小惊喜

   ★ 所有个人信息都在 config.js 里,这个文件一般不用改 ★
   ============================================================ */

(function () {
  "use strict";

  /* 如果找不到配置(比如 config.js 被误删或改坏),给出友好提示 */
  if (typeof CONFIG === "undefined") {
    const warn = () => document.body.insertAdjacentHTML("afterbegin",
      `<div style="position:fixed;top:0;left:0;right:0;z-index:9999;background:#ffe0e8;color:#b04a75;
        padding:12px;text-align:center;font-size:14px">
        😢 没有找到配置内容:请确认 config.js 和 index.html 在同一文件夹,且内容格式正确
      </div>`);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", warn);
    } else { warn(); }
    return;
  }

  /* 标记 JS 已就绪(样式表据此隐藏待显示的元素) */
  document.documentElement.classList.add("js");

  /* ============ 小工具函数 ============ */
  const DAY_MS = 24 * 60 * 60 * 1000;                 // 一天的毫秒数
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** "2024-02-14" → 当天 0 点的 Date 对象 */
  function toDate(str) {
    const [y, m, d] = String(str).split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  /** 把时间规整到当天 0 点,方便按天计算 */
  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  /** Date → "2024年2月14日" */
  function fmtDate(date) {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
  /** "2024-02-14" → "2024年2月14日" */
  function fmtDateStr(str) {
    const d = toDate(str);
    return isNaN(d.getTime()) ? String(str) : fmtDate(d);
  }
  /** 转义特殊字符,防止文字里的引号、尖括号弄坏页面 */
  function esc(text) {
    return String(text ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  /** 根据 HTML 字符串创建元素 */
  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function setText(id, text) {
    const node = document.getElementById(id);
    if (node) node.textContent = text ?? "";
  }
  /** 每个模块独立容错:一处出错不影响其他模块 */
  function safe(name, fn) {
    try { fn(); }
    catch (err) { console.error(`[Our Little Universe] ${name} 出错:`, err); }
  }

  /* ============ ① 基础信息(标题/昵称/头像/文案) ============ */
  function renderBasicInfo() {
    const { site, people } = CONFIG;
    document.title = `${site.name} ♡ 我们的小宇宙`;
    setText("navLogoText", site.name);
    setText("siteTitle", site.name);
    setText("siteSubtitle", site.subtitle);
    setText("welcomeText", site.welcome);
    setText("loveQuote", `「 ${site.quote} 」`);
    setText("footerText", `${people.me.nickname} & ${people.partner.nickname} · ${site.footer}`);

    const avatarMe = document.getElementById("avatarMe");
    const avatarPartner = document.getElementById("avatarPartner");
    if (avatarMe) avatarMe.src = people.me.avatar;
    if (avatarPartner) avatarPartner.src = people.partner.avatar;
    setText("nicknameMe", `${people.me.emoji || ""} ${people.me.nickname}`.trim());
    setText("nicknamePartner", `${people.partner.emoji || ""} ${people.partner.nickname}`.trim());

    const cover = document.getElementById("coverImage");
    if (cover) cover.src = CONFIG.coverImage;
  }

  /* ============ ② 恋爱天数 ============ */
  /** 计算 start 到 end 相差的 年/月/日(按日历精确计算) */
  function durationBetween(start, end) {
    let y = end.getFullYear() - start.getFullYear();
    let m = end.getMonth() - start.getMonth();
    let d = end.getDate() - start.getDate();
    if (d < 0) {
      m -= 1;
      // 借上个月的天数:end 所在月的上一个月份有多少天
      d += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    }
    if (m < 0) { y -= 1; m += 12; }
    return { y, m, d };
  }

  /** 数字从 0 滚动到目标值 */
  function animateNumber(node, target, duration = 1600) {
    if (REDUCED) { node.textContent = target; return; }
    const t0 = performance.now();
    (function tick(t) {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);       // easeOutCubic
      node.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  function renderDays() {
    const numEl = document.getElementById("daysNumber");
    const sinceEl = document.getElementById("daysSince");
    const chipsEl = document.getElementById("daysChips");
    const badgeEl = document.getElementById("daysBadge");
    if (!numEl) return;

    // 校验日期格式,给出友好提示
    const parts = String(CONFIG.loveStartDate || "").split("-").map(Number);
    const valid = parts.length === 3 && parts.every(n => Number.isFinite(n) && n > 0);
    if (!valid) {
      numEl.textContent = "0";
      sinceEl.textContent = '请把 config.js 里的 loveStartDate 改成 "2024-01-01" 这样的格式哦 🌱';
      if (badgeEl) badgeEl.hidden = true;
      return;
    }

    const start = startOfDay(toDate(CONFIG.loveStartDate));
    const today = startOfDay(new Date());
    // 在一起天数:把开始那天算作第 1 天
    const days = Math.floor((today - start) / DAY_MS) + 1;

    if (days <= 0) {
      numEl.textContent = "0";
      sinceEl.textContent = `恋爱开始日期 ${fmtDate(start)} 还没到呢,去 config.js 改成真实的日子吧 🌱`;
      if (badgeEl) badgeEl.hidden = true;
      return;
    }

    animateNumber(numEl, days);
    sinceEl.textContent = `自 ${fmtDate(start)} 起 · 今天是第 ${days} 天`;

    // 已经在一起 X 年 X 个月 X 天
    const { y, m, d } = durationBetween(start, today);
    const chips = [];
    if (y > 0) chips.push(`${y} 年`);
    if (m > 0) chips.push(`${m} 个月`);
    chips.push(`${d} 天`);
    chipsEl.innerHTML = chips.map(c => `<span class="chip">${c}</span>`).join("");

    // 整百天小惊喜:100 天、520 天、1000 天……
    const milestones = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1314, 2000, 3000];
    if (badgeEl) {
      if (milestones.includes(days)) {
        badgeEl.textContent = `🎉 今天正是在一起的第 ${days} 天!`;
        badgeEl.hidden = false;
      } else {
        badgeEl.hidden = true;
      }
    }
  }

  /* ============ ③ 重要回忆入口(首页) ============ */
  function renderMemoryEntries() {
    const box = document.getElementById("memoryEntries");
    if (!box) return;
    CONFIG.memories.slice(0, 3).forEach((mem, i) => {
      const card = el(`
        <button class="entry-card" type="button" aria-label="查看回忆:${esc(mem.title)}">
          <span class="entry-emoji" aria-hidden="true">${esc(mem.emoji || "💗")}</span>
          <span class="entry-main">
            <span class="entry-title">${esc(mem.title)}</span>
            <span class="entry-date">${fmtDateStr(mem.date)}</span>
          </span>
          <span class="entry-arrow" aria-hidden="true">→</span>
        </button>`);
      // 点击入口 → 平滑滚动到时间轴对应的那段回忆
      card.addEventListener("click", () => {
        const target = document.getElementById(`memory-${i}`);
        if (target) target.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "center" });
      });
      box.appendChild(card);
    });
  }

  /* ============ ④ 我们的故事(时间轴) ============ */
  // 各张拍立得的不同倾斜角,让排版更像手账
  const TILTS = [-2.5, 1.8, -1.2, 2.2, -2, 1.5, -1.6, 2];

  function renderTimeline() {
    const wrap = document.getElementById("timeline");
    if (!wrap) return;
    CONFIG.memories.forEach((mem, i) => {
      const side = i % 2 === 0 ? "left" : "right";
      const photos = (mem.photos || []).map((src, k) => `
        <figure class="polaroid tl-photo" style="--tilt:${TILTS[(i + k) % TILTS.length]}deg">
          <img src="${esc(src)}" alt="${esc(mem.title)} · 照片${k + 1}" loading="lazy"
               data-lightbox data-caption="${esc(mem.title)} · ${esc(fmtDateStr(mem.date))}">
        </figure>`).join("");

      wrap.appendChild(el(`
        <div class="tl-item ${side}" id="memory-${i}">
          <div class="tl-dot" aria-hidden="true">${esc(mem.emoji || "💗")}</div>
          <article class="tl-card reveal">
            <span class="tl-date">📅 ${esc(fmtDateStr(mem.date))}</span>
            <h3 class="tl-title">${esc(mem.title)}</h3>
            <p class="tl-text">${esc(mem.text)}</p>
            ${photos ? `<div class="tl-photos">${photos}</div>` : ""}
          </article>
        </div>`));
    });
  }

  /* ============ ⑤ 回忆相册(照片墙 · 初始背面朝上,点开才能看) ============ */
  function renderGallery() {
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;
    (CONFIG.gallery || []).forEach((g, i) => {
      const card = el(`
        <figure class="polaroid g-item g-flip reveal" style="--tilt:${TILTS[i % TILTS.length]}deg">
          <div class="g-flip-inner" role="button" tabindex="0" aria-pressed="false"
               aria-label="点击翻开这张照片">
            <div class="g-face g-front">
              <img src="${esc(g.src)}" alt="${esc(g.title)}" loading="lazy"
                   data-lightbox data-caption="${esc(g.title)}">
              <figcaption>
                <span class="g-title">${esc(g.title)}</span>
                ${g.note ? `<span class="g-note">${esc(g.note)}</span>` : ""}
              </figcaption>
            </div>
            <div class="g-face g-back">
              <span class="g-back-heart">💗</span>
            </div>
          </div>
          <button class="g-zoom" type="button" aria-label="放大查看:${esc(g.title)}" title="放大查看">🔍</button>
        </figure>`);

      const inner = card.querySelector(".g-flip-inner");

      // 点一下 → 翻开看照片;再点一下 → 合回去
      const flip = () => {
        const on = card.classList.toggle("opened");
        inner.setAttribute("aria-pressed", String(on));
        inner.setAttribute("aria-label", on ? "点击合上这张照片" : "点击翻开这张照片");
      };
      card.addEventListener("click", e => {
        if (e.target.closest(".g-zoom")) return;   // 放大按钮不参与翻面
        flip();
      });
      // 键盘也能翻:Enter / 空格
      inner.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          flip();
        }
      });

      // 翻开后右上角出现 🔍 → 交给灯箱放大查看
      const img = card.querySelector("img");
      card.querySelector(".g-zoom").addEventListener("click", e => {
        e.stopPropagation();
        img.dispatchEvent(new Event("zoom-request", { bubbles: true }));
      });

      grid.appendChild(card);
    });
  }

  /* ============ ⑥ 未来约定(愿望清单) ============ */
  const WISH_KEY = "our-little-universe-wishes";   // localStorage 存储键名

  /** 读取保存在本机的愿望完成状态(数量变化后也能对齐) */
  function loadWishState(len) {
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(WISH_KEY) || "[]") || []; }
    catch (e) { saved = []; }
    return Array.from({ length: len }, (_, i) => saved[i] === true);
  }
  function saveWishState(states) {
    try { localStorage.setItem(WISH_KEY, JSON.stringify(states)); } catch (e) { /* 忽略 */ }
  }

  function renderWishes() {
    const grid = document.getElementById("wishGrid");
    if (!grid) return;
    const states = loadWishState((CONFIG.futureWishes || []).length);

    // 刷新进度条与进度文字
    const refresh = () => {
      const done = states.filter(Boolean).length;
      const total = states.length;
      const bar = document.getElementById("wishBarFill");
      const text = document.getElementById("wishProgressText");
      if (bar) bar.style.width = total ? `${(done / total) * 100}%` : "0";
      if (text) {
        text.textContent = (total > 0 && done === total)
          ? `全部 ${total} 个愿望都实现啦,你们太棒了!🎊`
          : `已完成 ${done} / ${total} · 愿望正在慢慢发光 ✨`;
      }
    };

    (CONFIG.futureWishes || []).forEach((w, i) => {
      const card = el(`
        <button class="wish reveal" type="button" aria-pressed="${states[i]}">
          <span class="wish-check" aria-hidden="true">${states[i] ? "✓" : ""}</span>
          <span class="wish-emoji" aria-hidden="true">${esc(w.emoji || "🌟")}</span>
          <span class="wish-title">${esc(w.title)}</span>
          ${w.note ? `<span class="wish-note">${esc(w.note)}</span>` : ""}
          <span class="wish-stamp" aria-hidden="true">已完成 ✔</span>
          <span class="wish-hint" aria-hidden="true">点击卡片切换状态</span>
        </button>`);
      if (states[i]) card.classList.add("done");

      // 点击卡片 → 切换 待完成 / 已完成,并保存在本机(无需服务器)
      card.addEventListener("click", () => {
        states[i] = !states[i];
        card.classList.toggle("done", states[i]);
        card.setAttribute("aria-pressed", String(states[i]));
        card.querySelector(".wish-check").textContent = states[i] ? "✓" : "";
        saveWishState(states);
        refresh();
      });
      grid.appendChild(card);
    });
    refresh();
  }

  /* ============ ⑦ 纪念日(倒计时) ============ */
  function renderAnniversaries() {
    const grid = document.getElementById("annivGrid");
    if (!grid) return;
    const today = startOfDay(new Date());

    // 「在一起的纪念日」由恋爱开始日期自动生成,永远和天数保持一致
    const list = [
      { emoji: "💗", name: "在一起的纪念日", date: CONFIG.loveStartDate, note: "我们故事开始的那一天", isLove: true },
      ...(CONFIG.anniversaries || []),
    ];

    // 计算每个纪念日的下一次日期:今年的过了就算明年(跨年也准确)
    const items = list.map(a => {
      const d = toDate(a.date);
      if (isNaN(d.getTime())) return null;
      let next = new Date(today.getFullYear(), d.getMonth(), d.getDate());
      if (next.getTime() < today.getTime()) {
        next = new Date(today.getFullYear() + 1, d.getMonth(), d.getDate());
      }
      const days = Math.round((next - today) / DAY_MS);
      const times = next.getFullYear() - d.getFullYear() + 1;   // 将是第几次
      // 名字里带「生日」的按周岁显示(也可以写 type: "birthday")
      const isBirthday = a.type === "birthday" || /生日/.test(a.name || "");
      return { ...a, next, days, times, birthYear: d.getFullYear(), isBirthday };
    }).filter(Boolean)
      .sort((a, b) => a.days - b.days);                          // 最近的排在前面

    items.forEach((a, idx) => {
      const isToday = a.days === 0;
      const year = a.next.getFullYear();
      const nth = a.times - 1;                                   // 第几个周年(在一起的那年算第 0 个)
      // 底部那句小字:生日说「几岁」,在一起的纪念日说「N 周年」,其他保留次数说法
      const sub = a.isBirthday
        ? `${year - a.birthYear} 岁生日(${year} 年)`
        : a.isLove
          ? (nth > 0 ? `${nth} 周年纪念(${year} 年)` : `故事开始的那一年 🌱`)
          : (a.times > 1 ? `将是第 ${a.times} 个这样的日子(${year} 年)` : `就在今年 🌱`);

      grid.appendChild(el(`
        <div class="anniv-card reveal ${isToday ? "today" : ""}">
          ${idx === 0 ? `<span class="anniv-badge">最近 ✨</span>` : ""}
          <span class="anniv-emoji" aria-hidden="true">${esc(a.emoji || "🎉")}</span>
          <h3 class="anniv-name">${esc(a.name)}</h3>
          <p class="anniv-date">每年 ${a.next.getMonth() + 1} 月 ${a.next.getDate()} 日${a.note ? ` · ${esc(a.note)}` : ""}</p>
          ${isToday
            ? `<p class="anniv-count">就是今天,快庆祝吧 🎉</p>`
            : `<p class="anniv-count"><span class="anniv-num">${a.days}</span>天后</p>`}
          <p class="anniv-sub">${sub}</p>
        </div>`));
    });
  }

  /* ============ ⑧ 照片灯箱(点击放大 / 左右翻页) ============ */
  function initLightbox() {
    const box = document.getElementById("lightbox");
    const img = document.getElementById("lightboxImg");
    const cap = document.getElementById("lightboxCaption");
    if (!box || !img) return;

    const items = Array.from(document.querySelectorAll("[data-lightbox]"));
    let index = 0;

    function show(i) {
      index = (i + items.length) % items.length;      // 循环翻页
      const node = items[index];
      img.src = node.getAttribute("src");
      img.alt = node.alt || "照片";
      if (cap) cap.textContent = node.dataset.caption || "";
      // 让图片每次都重新播放浮现动画
      img.style.animation = "none";
      void img.offsetWidth;
      img.style.animation = "";
    }
    function open(i) {
      show(i);
      box.classList.add("open");
      box.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";        // 打开时锁定页面滚动
    }
    function close() {
      box.classList.remove("open");
      box.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    items.forEach((node, i) => {
      // 相册卡片的照片:点击是「翻面」,放大交给卡片上的 🔍 按钮
      node.addEventListener("click", () => {
        if (!node.closest(".g-flip")) open(i);
      });
      node.addEventListener("zoom-request", () => open(i));
    });
    document.getElementById("lightboxClose")?.addEventListener("click", close);
    document.getElementById("lightboxPrev")?.addEventListener("click", () => show(index - 1));
    document.getElementById("lightboxNext")?.addEventListener("click", () => show(index + 1));
    // 点击黑色背景也能关闭
    box.addEventListener("click", e => { if (e.target === box) close(); });
    // 键盘支持:Esc 关闭,←/→ 翻页
    document.addEventListener("keydown", e => {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
  }

  /* ============ ⑨ 漂浮爱心背景 ============ */
  function initFloatingBg() {
    const box = document.getElementById("floatingBg");
    if (!box || REDUCED) return;
    const icons = ["💗", "⭐", "🌸", "✨", "💜", "☁️", "🌷", "🫧"];
    const count = window.innerWidth < 700 ? 10 : 16;
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.textContent = icons[i % icons.length];
      s.style.left = Math.random() * 100 + "%";
      s.style.fontSize = 12 + Math.random() * 20 + "px";
      s.style.animationDuration = 14 + Math.random() * 14 + "s";
      s.style.animationDelay = -Math.random() * 28 + "s";   // 负延迟:打开页面时已经在半空中
      s.style.opacity = 0.25 + Math.random() * 0.3;
      box.appendChild(s);
    }
  }

  /* ============ ⑩ 点击任意处冒出小爱心 ============ */
  function initClickHearts() {
    if (REDUCED) return;
    const icons = ["💗", "✨", "💜", "🌸"];
    document.addEventListener("pointerdown", e => {
      const s = document.createElement("span");
      s.className = "click-heart";
      s.textContent = icons[Math.floor(Math.random() * icons.length)];
      s.style.left = e.clientX + "px";
      s.style.top = e.clientY + "px";
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 900);
    });
  }

  /* ============ ⑪ 滚动显现动画 ============ */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || REDUCED) {
      items.forEach(node => node.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);     // 只播放一次
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(node => io.observe(node));
  }

  /* ============ ⑫ 导航栏(高亮 / 汉堡菜单) ============ */
  function initNav() {
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");
    const navbar = document.getElementById("navbar");

    // 手机端开合菜单
    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        toggle.classList.toggle("active", open);
        toggle.setAttribute("aria-expanded", String(open));
      });
      links.addEventListener("click", e => {
        if (e.target.closest("a")) {
          links.classList.remove("open");
          toggle.classList.remove("active");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    // 滚动时给导航加深一点阴影
    if (navbar) {
      window.addEventListener("scroll",
        () => navbar.classList.toggle("scrolled", window.scrollY > 30),
        { passive: true });
    }

    // 滚动到某个区域时,高亮对应的导航项
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));
    if ("IntersectionObserver" in window && navLinks.length) {
      const spy = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(l =>
              l.classList.toggle("active", l.getAttribute("href") === `#${id}`));
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      document.querySelectorAll("main section").forEach(s => spy.observe(s));
    }
  }

  /* ============ 启动 ============ */
  function init() {
    safe("基础信息", renderBasicInfo);
    safe("恋爱天数", renderDays);
    safe("回忆入口", renderMemoryEntries);
    safe("时间轴", renderTimeline);
    safe("相册", renderGallery);
    safe("愿望清单", renderWishes);
    safe("纪念日", renderAnniversaries);
    safe("灯箱", initLightbox);
    safe("滚动显现", initReveal);
    safe("导航栏", initNav);
    safe("漂浮背景", initFloatingBg);
    safe("点击爱心", initClickHearts);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
