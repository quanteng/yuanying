/* Floating hand-off navigation for the standalone FigHub prototype. */
(() => {
  "use strict";

  if (new URLSearchParams(window.location.search).get("dock") === "0") return;

  const MODE_KEY = "yykj-ui-prototype-mode";
  const TARGET_KEY = "yykj-ui-prototype-target";
  const currentMode = () => {
    try {
      return localStorage.getItem(MODE_KEY) || "authed";
    } catch {
      return "authed";
    }
  };

  const rememberTarget = () => {
    const target = new URLSearchParams(window.location.search).get("target");
    if (!target) return;
    try {
      sessionStorage.setItem(TARGET_KEY, target);
    } catch {
      /* ignore */
    }
  };

  const applyPendingTarget = () => {
    let target = "";
    try {
      target = sessionStorage.getItem(TARGET_KEY) || "";
      sessionStorage.removeItem(TARGET_KEY);
    } catch {
      target = "";
    }
    if (target && window.location.hash !== target) {
      window.location.hash = target;
      window.setTimeout(() => window.dispatchEvent(new HashChangeEvent("hashchange")), 0);
    }
  };

  const openPage = (hash, mode = currentMode(), scenario = "") => {
    try {
      localStorage.setItem(MODE_KEY, mode);
      sessionStorage.setItem(TARGET_KEY, hash);
      if (scenario) sessionStorage.setItem("yykj-ui-prototype-scenario", scenario);
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  const waitFor = (selector, timeout = 2500) => new Promise((resolve) => {
    const started = Date.now();
    const tick = () => {
      const node = document.querySelector(selector);
      if (node || Date.now() - started > timeout) {
        resolve(node);
        return;
      }
      window.setTimeout(tick, 80);
    };
    tick();
  });

  const closeFloating = () => {
    document.querySelectorAll("[data-proto-close]").forEach((node) => {
      const target = node.closest(".request-modal, .share-modal, .qr-modal, #upgradeModal");
      if (target) target.remove();
    });
  };

  const runScenario = async (name) => {
    closeFloating();
    const root = document.documentElement;
    root.classList.remove("proto-force-drawer");
    if (name.startsWith("admin-") && currentMode() !== "admin") {
      openPage("#admin/tools", "admin", name);
      return;
    }
    if (!name.startsWith("admin-") && ["buy", "pay", "vip", "price-confirm", "password", "email-dialog", "wechat-bind", "refund", "deactivate"].includes(name) && currentMode() === "guest") {
      openPage("#home", "authed", name);
      return;
    }
    if (name === "share") {
      await waitFor("[data-share-open]");
      document.querySelector("[data-share-open]")?.click();
      return;
    }
    if (name === "account-menu") {
      window.location.hash = "#home";
      const trigger = await waitFor("[data-account-trigger]");
      trigger?.click();
      return;
    }
    if (name === "login-qr") {
      window.location.hash = "#login";
      window.setTimeout(() => window.dispatchEvent(new HashChangeEvent("hashchange")), 0);
      window.setTimeout(() => document.querySelector("[data-qr-modal]:not([hidden])")?.scrollIntoView({ block: "center" }), 800);
      return;
    }
    if (name === "request") {
      window.location.hash = "#requests";
      await waitFor("[data-open-request-form]");
      document.querySelector("[data-open-request-form]")?.click();
      return;
    }
    if (name === "buy" || name === "pay" || name === "vip") {
      window.location.hash = "#tool/boundary";
      const selector = name === "buy" ? "[data-buy-now]" : name === "pay" ? "[data-pay-open]" : "[data-vip-open]";
      const trigger = await waitFor(selector);
      trigger?.click();
      return;
    }
    if (name === "price-confirm") {
      window.location.hash = "#pricing";
      const trigger = await waitFor("[data-buy-plan]");
      trigger?.click();
      return;
    }
    if (name === "password") {
      window.location.hash = "#account/security";
      const trigger = await waitFor('[data-security-open="password"]');
      trigger?.click();
      return;
    }
    if (name === "email-dialog") {
      window.location.hash = "#account/security";
      const trigger = await waitFor('[data-security-open="email"]');
      trigger?.click();
      return;
    }
    if (name === "wechat-bind") {
      window.location.hash = "#account/security";
      const trigger = await waitFor("[data-wechat-bind]");
      trigger?.click();
      return;
    }
    if (name === "refund") {
      window.location.hash = "#account/orders";
      const trigger = await waitFor("[data-refund-apply]");
      trigger?.click();
      return;
    }
    if (name === "deactivate") {
      window.location.hash = "#account/security";
      const trigger = await waitFor("[data-account-deactivate]");
      trigger?.click();
      return;
    }
    if (name === "mobile-drawer") {
      root.classList.add("proto-force-drawer");
      window.location.hash = "#home";
      const trigger = await waitFor("[data-nav-toggle]");
      trigger?.click();
      return;
    }
    if (name.startsWith("admin-")) {
      const mode = name.split("-")[1];
      const map = {
        tools: ["#admin/tools", "[data-admin-tool-edit]"],
        tag: ["#admin/tags", "[data-admin-tag-new]"],
        row: ["#admin/help", "[data-admin-row-edit]"],
        dataset: ["#admin/datasets", "[data-admin-dataset-edit]"]
      };
      const entry = map[mode];
      if (!entry) return;
      window.location.hash = entry[0];
      const trigger = await waitFor(entry[1], 4000);
      trigger?.click();
    }
  };

  const pageGroups = [
    {
      title: "官网",
      links: [
        ["官网首页", "../official/index.html", ""],
        ["案例展示", "../official/showcase.html", ""]
      ]
    },
    {
      title: "FigHub 用户端",
      links: [
        ["首页", "#home", "authed"],
        ["工具库", "#tools", "authed"],
        ["工具详情 · boundary", "#tool/boundary", "authed"],
        ["数据集", "#datasets", "authed"],
        ["数据集详情", "#dataset/survey-points", "authed"],
        ["需求墙", "#requests", "authed"],
        ["价格", "#pricing", "authed"],
        ["帮助中心", "#help", "authed"],
        ["关于我们", "#about", "authed"],
        ["服务条款", "#terms", "authed"],
        ["隐私政策", "#privacy", "authed"],
        ["登录", "#login", "guest"],
        ["注册", "#register", "guest"],
        ["找回密码", "#forgot", "guest"],
        ["验证邮箱", "#verify", "authed"]
      ]
    },
    {
      title: "用户中心",
      links: [
        ["我的权益", "#account/entitlements", "authed"],
        ["个人资料", "#account/profile", "authed"],
        ["账号安全", "#account/security", "authed"],
        ["交易记录", "#account/orders", "authed"],
        ["发票管理", "#account/invoices", "authed"]
      ]
    },
    {
      title: "运营后台",
      links: [
        ["工具管理", "#admin/tools", "admin"],
        ["标签管理", "#admin/tags", "admin"],
        ["枚举文案", "#admin/labels", "admin"],
        ["工具说明素材", "#admin/tool_media", "admin"],
        ["工具更新说明", "#admin/tool_updates", "admin"],
        ["数据要求", "#admin/tool_docs", "admin"],
        ["数据集", "#admin/datasets", "admin"],
        ["帮助中心", "#admin/help", "admin"],
        ["需求墙", "#admin/requests", "admin"],
        ["站点设置", "#admin/site", "admin"],
        ["计费产品", "#admin/products", "admin"],
        ["计费方案", "#admin/billing_plans", "admin"],
        ["使用券", "#admin/coupons", "admin"],
        ["用户", "#admin/users", "admin"],
        ["场地台账", "#admin/sites", "admin"],
        ["用户反馈", "#admin/feedback", "admin"],
        ["订单", "#admin/orders", "admin"],
        ["发票", "#admin/invoices", "admin"],
        ["退费管理", "#admin/refunds", "admin"],
        ["使用门禁", "#admin/policies", "admin"],
        ["运营统计", "#admin/stats", "admin"]
      ]
    },
    {
      title: "boundary 工具",
      links: [
        ["boundary 工作台", "../boundary/index.html", ""]
      ]
    }
  ];

  const scenarios = [
    ["账户菜单", "account-menu"],
    ["分享弹窗", "share"],
    ["登录扫码", "login-qr"],
    ["提交需求", "request"],
    ["购买确认", "buy"],
    ["支付方式", "pay"],
    ["VIP 权益", "vip"],
    ["价格确认", "price-confirm"],
    ["修改密码", "password"],
    ["邮箱绑定", "email-dialog"],
    ["微信绑定", "wechat-bind"],
    ["退费申请", "refund"],
    ["注销账号", "deactivate"],
    ["移动导航抽屉", "mobile-drawer"],
    ["后台 · 编辑工具", "admin-tools"],
    ["后台 · 编辑标签", "admin-tag"],
    ["后台 · 内容编辑", "admin-row"],
    ["后台 · 编辑数据集", "admin-dataset"]
  ];

  const makeLink = ([label, href, mode]) => {
    if (!mode) return `<a href="${href}">${label}</a>`;
    return `<a href="#" data-proto-page="${href}" data-proto-mode="${mode}">${label}</a>`;
  };

  const dock = document.createElement("div");
  dock.className = "proto-dock";
  dock.innerHTML = `
    <button class="proto-dock__toggle" type="button" aria-expanded="false">
      <span class="proto-dock__mark">P</span>
      <span>原型导航</span>
      <small>v0 交付</small>
    </button>
    <aside class="proto-dock__panel" aria-label="原型页面与弹窗导航">
      <header class="proto-dock__head">
        <div>
          <span class="proto-dock__eyebrow">UI HANDOFF · FIGHUB</span>
          <strong>页面与状态导航</strong>
        </div>
        <button class="proto-dock__x" type="button" data-proto-toggle aria-label="收起">×</button>
      </header>
      <div class="proto-dock__state">
        <span>预览身份</span>
        <div class="proto-dock__segmented">
          <button type="button" data-proto-mode="guest" class="${currentMode() === "guest" ? "is-active" : ""}">访客</button>
          <button type="button" data-proto-mode="authed" class="${currentMode() === "authed" ? "is-active" : ""}">已登录</button>
          <button type="button" data-proto-mode="admin" class="${currentMode() === "admin" ? "is-active" : ""}">后台</button>
        </div>
      </div>
      <div class="proto-dock__body">
        ${pageGroups.map((group) => `
          <details ${group.title === "FigHub 用户端" ? "open" : ""}>
            <summary>${group.title}<span>${group.links.length}</span></summary>
            <div class="proto-dock__links">${group.links.map(makeLink).join("")}</div>
          </details>
        `).join("")}
        <details open>
          <summary>关键弹窗 / 状态<span>${scenarios.length}</span></summary>
          <div class="proto-dock__scenarios">
            ${scenarios.map(([label, key]) => `<button type="button" data-proto-scenario="${key}">${label}</button>`).join("")}
          </div>
        </details>
      </div>
      <footer class="proto-dock__foot">
        <a href="../index.html">返回交付总览</a>
        <button type="button" data-proto-reset>重置演示数据</button>
      </footer>
    </aside>
  `;
  document.body.append(dock);

  const toggle = (force) => {
    const open = typeof force === "boolean" ? force : !dock.classList.contains("is-open");
    dock.classList.toggle("is-open", open);
    dock.querySelector(".proto-dock__toggle")?.setAttribute("aria-expanded", String(open));
  };

  dock.addEventListener("click", (event) => {
    const page = event.target.closest("[data-proto-page]");
    if (page) {
      event.preventDefault();
      openPage(page.dataset.protoPage, page.dataset.protoMode);
      return;
    }
    const scenario = event.target.closest("[data-proto-scenario]");
    if (scenario) {
      runScenario(scenario.dataset.protoScenario);
      if (window.innerWidth < 980) toggle(false);
      return;
    }
    const mode = event.target.closest("[data-proto-mode]");
    if (mode) {
      openPage(window.location.hash || "#home", mode.dataset.protoMode);
      return;
    }
    if (event.target.closest("[data-proto-toggle]") || event.target.closest(".proto-dock__toggle")) {
      toggle();
      return;
    }
    if (event.target.closest("[data-proto-reset]")) {
      try {
        localStorage.removeItem("yykj16_login_way");
        localStorage.removeItem("yykj16_last_account");
        sessionStorage.clear();
      } catch {
        /* ignore */
      }
      openPage("#home", "authed");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") toggle(false);
  });

  let pendingScenario = "";
  try {
    pendingScenario = sessionStorage.getItem("yykj-ui-prototype-scenario") || "";
    sessionStorage.removeItem("yykj-ui-prototype-scenario");
  } catch {
    pendingScenario = "";
  }
  rememberTarget();
  applyPendingTarget();
  if (pendingScenario) {
    window.setTimeout(() => runScenario(pendingScenario), 900);
  }
})();
