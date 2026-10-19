const menuToggle = document.getElementById("menuToggle");
const header = document.getElementById("header");
const navLinks = document.querySelectorAll(".nav a");
const yearNode = document.getElementById("year");

menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  menuToggle.classList.toggle("is-open");
  header.classList.toggle("is-open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.classList.remove("is-open");
    header.classList.remove("is-open");
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));

if (yearNode) {
  yearNode.textContent = `${new Date().getFullYear()} ©`;
}

// FigHub 链接按环境自动切换：HTML 里始终写线上地址，本地打开时换成本机服务，
// 因此发布前后不需要改代码（生产域名下不做任何替换）。
//   本地判定：file:// 打开（hostname 为空）、localhost、127.0.0.1、::1，或 URL 带 ?fighub=dev
//   强制线上：?fighub=prod
//   自定义端口：window.YYKJ_FIGHUB_DEV_URL 或 ?fighubUrl=http://127.0.0.1:5177
(() => {
  const PROD = "https://fighub.bjyiyunkeji.online";
  const host = (location.hostname || "").toLowerCase();
  const params = new URLSearchParams(location.search || "");
  const forced = (params.get("fighub") || "").toLowerCase();
  const isLocal = host === "" || host === "localhost" || host === "127.0.0.1" || host === "::1";
  const useLocal = forced === "dev" || (forced !== "prod" && isLocal);
  if (!useLocal) {
    return;
  }
  const target = params.get("fighubUrl") || window.YYKJ_FIGHUB_DEV_URL || "http://127.0.0.1:5176";
  document.querySelectorAll(`a[href^="${PROD}"]`).forEach((link) => {
    link.setAttribute("href", link.getAttribute("href").replace(PROD, target));
    // 本地联调时新开标签更容易对照日志，统一保持原有 target
  });
  document.documentElement.dataset.fighubDev = target;
})();

// 导航滚动高亮：视口中线所在的分区对应导航项加 is-active。
(() => {
  const navByHash = new Map();
  navLinks.forEach((link) => {
    const hash = (link.getAttribute("href") || "").split("#")[1];
    if (hash) navByHash.set(hash, link);
  });
  const sections = [...navByHash.keys()]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!sections.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => link.classList.remove("is-active"));
    const link = navByHash.get(id);
    if (link) link.classList.add("is-active");
  };

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

  sections.forEach((section) => spy.observe(section));
})();

// 页头滚动状态：下滑后加浅阴影，与内容分层。
(() => {
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// 首屏铺满：把页头实测高度写进 --header-h，首屏按「视口 - 页头」取值，底部不留白边。
(() => {
  const root = document.documentElement;
  const sync = () => {
    const h = Math.round(header.getBoundingClientRect().height);
    if (h > 0) root.style.setProperty("--header-h", `${h}px`);
  };
  sync();
  window.addEventListener("resize", sync, { passive: true });
  window.addEventListener("orientationchange", sync);
  if (typeof ResizeObserver === "function") {
    new ResizeObserver(sync).observe(header);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(sync).catch(() => {});
  }
})();

// 点击复制（微信号等）：复制到剪贴板并把标签短暂切换为「已复制」。
(() => {
  document.querySelectorAll("[data-copy]").forEach((node) => {
    const copy = async () => {
      const text = node.getAttribute("data-copy") || "";
      try {
        await navigator.clipboard.writeText(text);
      } catch (error) {
        const helper = document.createElement("textarea");
        helper.value = text;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        document.execCommand("copy");
        helper.remove();
      }
      const tip = node.querySelector("small");
      if (tip && !tip.dataset.busy) {
        const original = tip.textContent;
        tip.dataset.busy = "1";
        tip.textContent = "已复制";
        window.setTimeout(() => {
          tip.textContent = original;
          delete tip.dataset.busy;
        }, 1600);
      }
    };
    node.addEventListener("click", copy);
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        copy();
      }
    });
  });
})();

// 首屏成果抽屉：右侧感应带 / 把手悬停即划出，移开收回；小屏不启用。
(() => {
  const hero = document.getElementById("hero");
  const card = document.getElementById("heroCard");
  const zone = hero ? hero.querySelector(".hero__drawer-zone") : null;
  if (!hero || !card || !zone) return;

  const narrow = window.matchMedia("(max-width: 1100px)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const container = hero.querySelector(".hero__fusion");
  const copy = hero.querySelector(".hero__copy");
  let closeTimer = 0;
  let resizeTimer = 0;

  // 收起状态：文案整体滑到容器内容区正中（展开时回到左侧）。
  const syncCopyShift = () => {
    if (!container || !copy || narrow.matches) return;
    const inner = container.getBoundingClientRect().width - 112; // 容器左右各 56px 内边距
    const shift = Math.max(0, Math.round((inner - copy.offsetWidth) / 2));
    hero.style.setProperty("--copy-shift", `${shift}px`);
    hero.style.setProperty("--copy-w", `${copy.offsetWidth}px`);
  };

  syncCopyShift();
  // 首帧之后再启用过渡，避免加载时文案自己滑一下。
  window.setTimeout(() => hero.classList.add("is-drawer-ready"), 120);
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(syncCopyShift, 160);
    },
    { passive: true }
  );

  const open = () => {
    window.clearTimeout(closeTimer);
    hero.classList.remove("drawer-nudge");
    hero.classList.add("is-drawer-open");
  };

  const close = () => {
    window.clearTimeout(closeTimer);
    hero.classList.remove("is-drawer-open");
  };

  const scheduleClose = () => {
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
      hero.classList.remove("is-drawer-open");
    }, 380);
  };

  [zone, card].forEach((node) => {
    node.addEventListener("mouseenter", open);
    node.addEventListener("mouseleave", scheduleClose);
  });

  // 键盘：焦点进入卡片自动展开。
  card.addEventListener("focusin", open);
  card.addEventListener("focusout", (event) => {
    if (!card.contains(event.relatedTarget)) scheduleClose();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && hero.classList.contains("is-drawer-open")) close();
  });

  // 一次轻推提示：每个会话只提示一次，且尊重“减少动效”。
  if (!reduceMotion.matches) {
    let hinted = false;
    try {
      hinted = window.sessionStorage.getItem("heroDrawerHinted") === "1";
    } catch (error) {
      hinted = false;
    }
    if (!hinted) {
      window.setTimeout(() => {
        if (narrow.matches || hero.classList.contains("is-drawer-open")) return;
        try {
          window.sessionStorage.setItem("heroDrawerHinted", "1");
        } catch (error) {
          /* 忽略隐私模式等存储异常 */
        }
        hero.classList.add("drawer-nudge");
        window.setTimeout(() => hero.classList.remove("drawer-nudge"), 1250);
      }, 1300);
    }
  }
})();
