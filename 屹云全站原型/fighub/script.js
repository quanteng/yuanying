(() => {
  "use strict";

  const runtime = window.YYKJ16_RUNTIME || {};
  const content = window.YYKJ16_CONTENT;
  const portalBase = String(runtime.portalBase || "").replace(/\/$/, "");
  const app = document.querySelector("#app");
  const toast = document.querySelector("#toast");

  // Dev convenience: reload the tab when styles.css / script.js change on disk.
  // A long-lived SPA tab otherwise keeps the previous script and stylesheets.
  if (runtime.environment === "development") {
    const assetStamps = new Map();
    const checkAssets = async () => {
      for (const asset of ["./styles.css", "./script.js"]) {
        try {
          const response = await fetch(asset, { method: "HEAD", cache: "no-store" });
          const stamp = response.headers.get("etag") || response.headers.get("last-modified") || "";
          if (!stamp) continue;
          const previous = assetStamps.get(asset);
          if (previous && previous !== stamp) { window.location.reload(); return; }
          assetStamps.set(asset, stamp);
        } catch { /* the dev helper must never break the page */ }
      }
    };
    checkAssets();
    window.setInterval(checkAssets, 5000);
  }

  const storageGet = (key, fallback = "") => {
    try {
      const value = window.localStorage.getItem(key);
      return value == null ? fallback : value;
    } catch {
      return fallback;
    }
  };
  const storageSet = (key, value) => {
    try { window.localStorage.setItem(key, value); } catch { /* storage may be unavailable in private browsing */ }
  };
  const readRequestVoteState = () => {
    let parsed;
    try { parsed = JSON.parse(storageGet("yykj16_request_votes", "{}")); } catch { parsed = {}; }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return { voted: {}, counts: {} };
    const voted = {};
    const counts = {};
    if (parsed.voted && typeof parsed.voted === "object" && !Array.isArray(parsed.voted)) {
      Object.entries(parsed.voted).forEach(([id, value]) => { if (value === true) voted[id] = true; });
    }
    if (parsed.counts && typeof parsed.counts === "object" && !Array.isArray(parsed.counts)) {
      Object.entries(parsed.counts).forEach(([id, value]) => {
        const count = Number(value);
        if (Number.isFinite(count) && count > 0) counts[id] = Math.floor(count);
      });
    }
    // Accept the pre-envelope format so an older browser does not lose vote state.
    if (!parsed.voted && !parsed.counts) {
      Object.entries(parsed).forEach(([id, value]) => {
        if (value === true) voted[id] = true;
        else if (Number.isFinite(Number(value)) && Number(value) > 0) counts[id] = Math.floor(Number(value));
      });
    }
    return { voted, counts };
  };
  const requestVoteState = readRequestVoteState();

  const tags = content.tags;
  const strings = content.strings || {};
  const t = (key, params) => {
    const template = strings[key];
    if (template == null) return key;
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match));
  };

  const tools = content.tools;
  const requests = content.requests;
  const datasets = content.datasets;
  const requestTypes = content.labels.requestType;
  const requestStatuses = content.labels.requestStatus;
  const state = {
    query: "",
    filters: [],
    profile: storageGet("yykj16_display_name", t("account.default_profile")) || t("account.default_profile"),
    requestFilter: "all",
    requestSort: "newest",
    session: null,
    config: null,
    products: [],
    membership: null,
    share: null,
    coupons: [],
    referral: "",
    resetEmail: "",
    requestVotes: requestVoteState.voted,
    requestVoteCounts: requestVoteState.counts,
    datasetQuery: "",
    datasetFilter: "all",
    toolAccess: {},
    toolTab: "illustration",
    toolFeedback: [],
    toolFeedbackEligibility: null,
    detailSlide: 0
  };

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  // Tool descriptions may embed {link} for the compliance system URL; plain-text surfaces
  // (tool cards) swap it for the system name without the anchor.
  const plainDescription = (value) => String(value ?? "").replace(/\{link\}/g, t("detail.compliance_link"));
  const icon = (name, label = "") => `<svg class="ui-icon" aria-hidden="true"${label ? ` role="img" aria-label="${esc(label)}"` : ""}><use href="#icon-${esc(name)}"></use></svg>`;
  const themeStorageKey = "yykj16_theme";
  const normalizeTheme = (value) => value === "dark" ? "dark" : "light";
  let activeTheme = normalizeTheme(storageGet(themeStorageKey, "light"));
  let shareTrigger = null;
  let sharePreviousOverflow = "";
  let sharePreviousFocus = null;
  let requestTrigger = null;
  let purchaseInFlight = false;
  let searchFocusPending = false;
  const purchaseAttempts = new Map();
  const visitorKey = "yykj16_visitor";
  const visitorId = (() => {
    let value = storageGet(visitorKey, "");
    if (!value) {
      value = globalThis.crypto?.randomUUID?.() || `v-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      storageSet(visitorKey, value);
    }
    return value;
  })();
  let lastTrackedRoute = "";
  const trackRoute = () => {
    const path = `#${route()}`;
    if (path === lastTrackedRoute) return;
    lastTrackedRoute = path;
    // Remember where the visitor came from so login returns there (not the account page).
    if (!["login", "register", "forgot", "verify"].includes(route())) storageSet("yykj16_last_route", route());
    try {
      fetch(`${portalBase}/api/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, visitor: visitorId }),
        keepalive: true
      }).catch(() => { /* statistics must never break the page */ });
    } catch { /* statistics must never break the page */ }
  };
  const currentReturnPath = () => {
    const name = route();
    if (!["login", "register", "forgot", "verify"].includes(name)) return `/#${name}`;
    const remembered = storageGet("yykj16_last_route", "");
    return remembered && remembered !== "login" && remembered !== "register" ? `/#${remembered}` : "/#home";
  };
  const adminState = { session: null, loaded: false, tools: [], tags: [], catalog: {}, products: [], datasets: [], rows: {}, sites: [], runs: [], users: null, orders: null, invoices: null, refunds: null, coupons: [], couponBatches: [], couponStats: null, generatedCodes: [], toolPolicies: [], feedback: [], feedbackStats: null, editing: null, editingTag: null, editingRow: null, editingRowId: "", editingDataset: null, editingDatasetId: "", message: "", error: "", stats: null };

  const applyTheme = (theme, persist = true) => {
    activeTheme = normalizeTheme(theme);
    document.documentElement.dataset.theme = activeTheme;
    if (persist) storageSet(themeStorageKey, activeTheme);
    const toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      const nextTheme = activeTheme === "dark" ? "light" : "dark";
      const label = nextTheme === "dark" ? t("theme.to_dark") : t("theme.to_light");
      toggle.innerHTML = icon(nextTheme === "dark" ? "moon" : "sun");
      toggle.setAttribute("aria-label", label);
      toggle.setAttribute("title", label);
      toggle.setAttribute("aria-pressed", String(activeTheme === "dark"));
    }
  };
  const shareModal = () => document.querySelector("[data-share-modal]");
  // Mobile drawer navigation. The panel lives at body level (same pattern as the share modal) so the
  // sticky header's backdrop-filter can never become the containing block of a fixed overlay.
  const navDrawerNode = () => document.querySelector("[data-nav-drawer]");
  const syncNavToggle = () => {
    const open = document.documentElement.dataset.drawer === "open";
    document.querySelectorAll("[data-nav-toggle]").forEach((node) => node.setAttribute("aria-expanded", String(open)));
  };
  const openNavDrawer = () => {
    const drawer = navDrawerNode();
    if (!drawer) return;
    drawer.hidden = false;
    document.documentElement.dataset.drawer = "open";
    syncNavToggle();
    const closeButton = drawer.querySelector("[data-nav-close]");
    if (closeButton) closeButton.focus();
  };
  const closeNavDrawer = () => {
    const drawer = navDrawerNode();
    if (!drawer || drawer.hidden) return;
    drawer.hidden = true;
    delete document.documentElement.dataset.drawer;
    syncNavToggle();
    const active = document.activeElement;
    if (active && drawer.contains(active)) active.blur();
  };
  const shareLink = () => state.referral || window.location.href;
  const updateShareLinks = () => {
    const modal = shareModal();
    if (!modal) return;
    modal.querySelector("[data-share-link]").value = shareLink();
  };
  const openShare = (trigger) => {
    const modal = shareModal();
    if (!modal) return;
    shareTrigger = trigger || null;
    sharePreviousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    sharePreviousOverflow = document.body.style.overflow;
    updateShareLinks();
    const earnSubmit = modal.querySelector("[data-share-submit]");
    const earnLogin = modal.querySelector("[data-share-login]");
    if (earnSubmit) earnSubmit.hidden = !state.session;
    if (earnLogin) earnLogin.hidden = Boolean(state.session);
    const earnStatus = modal.querySelector("[data-share-status]");
    if (earnStatus) { earnStatus.className = "status"; earnStatus.textContent = ""; }
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const input = modal.querySelector("[data-share-link]");
    input.focus();
    input.select();
  };
  const closeShare = () => {
    const modal = shareModal();
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = sharePreviousOverflow;
    const target = sharePreviousFocus || shareTrigger;
    if (target && target.isConnected) target.focus();
    shareTrigger = null;
    sharePreviousFocus = null;
  };
  const copyText = async (value) => {
    try {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(value);
          return true;
        } catch { /* fall back to the legacy copy path when permission is denied */ }
      }
      const input = document.createElement("textarea");
      input.value = value;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.append(input);
      input.select();
      const copied = document.execCommand("copy");
      input.remove();
      return copied;
    } catch { return false; }
  };
  applyTheme(activeTheme, false);
  const tool = (slug) => tools.find((item) => item.slug === slug);
  const formLabel = content.labels.form;
  const billingLabel = content.labels.billing;
  const tag = (key) => tags.find((item) => item.key === key) || tags[0];
  const tagChips = (item) => item.tags.map((key) => `<span class="tool-tag tool-tag--${key}">${icon(tag(key).icon)}${tag(key).name}</span>`).join("");
  const formChip = (item) => `<span class="badge ${item.form === "service" ? "badge--custom" : "badge--self"}">${formLabel[item.form]}</span>`;
  const billingChip = (item) => `<span class="badge ${item.billing === "free" ? "badge--free" : item.billing === "paid" ? "badge--paid" : "badge--quote"}">${billingLabel[item.billing]}</span>`;
  const statusChip = (item) => `<span class="badge${item.available ? "" : " badge--request-status"}">${item.available ? content.labels.status.available : content.labels.status.preparing}</span>`;
  const toolBadges = (item) => `${formChip(item)}${billingChip(item)}`;
  const showToast = (message) => { toast.textContent = message; toast.classList.add("is-visible"); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200); };
  let csrfToken = null;
  let csrfPromise = null;
  const apiUrl = (path) => `${portalBase}${path}`;
  // Fetch the CSRF token once per session with a single in-flight guard: concurrent
  // POSTs (e.g. QR login + site match) must share one /api/csrf request, otherwise two
  // parallel /api/csrf calls can mint two different session/token pairs and the later
  // POST carries a stale token -> "csrf validation failed".
  const ensureCsrfToken = () => {
    if (csrfToken) return Promise.resolve(csrfToken);
    if (!csrfPromise) {
      csrfPromise = fetch(apiUrl("/api/csrf"), { credentials: "include" })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          csrfToken = (data && data.csrf_token) || null;
          return csrfToken;
        })
        .finally(() => { csrfPromise = null; });
    }
    return csrfPromise;
  };
  const apiRequest = async (path, options = {}) => {
    const { timeoutMs = 20000, signal: outerSignal, ...fetchOptions } = options;
    const method = String(fetchOptions.method || "GET").toUpperCase();
    const headers = new Headers(fetchOptions.headers || {});
    headers.set("Accept", "application/json");
    // FormData uploads must keep the browser-generated multipart boundary.
    if (fetchOptions.body && !headers.has("Content-Type") && !(fetchOptions.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
    if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
      try {
        const token = await ensureCsrfToken();
        if (token) headers.set("X-CSRF-Token", token);
      } catch { /* the API response below carries the actionable error */ }
    }
    const doRequest = async (skipCsrfReset) => {
      // Timeout guard: a hung API request must never leave checkout/modal spinners
      // spinning forever (2026-10-18 stall audit).
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), Math.max(1000, Number(timeoutMs) || 20000));
      if (outerSignal) {
        if (outerSignal.aborted) controller.abort();
        else outerSignal.addEventListener("abort", () => controller.abort(), { once: true });
      }
      let response;
      try {
        response = await fetch(apiUrl(path), {
          ...fetchOptions,
          method,
          headers,
          credentials: "include",
          signal: controller.signal
        });
      } catch (error) {
        if (error && error.name === "AbortError") {
          const timeout = new Error(t("toast.request_timeout"));
          timeout.status = 0;
          throw timeout;
        }
        throw error;
      } finally {
        window.clearTimeout(timer);
      }
      let payload = null;
      try { payload = await response.json(); } catch { payload = null; }
      if (!response.ok) {
        const detail = payload?.detail;
        if (!skipCsrfReset && response.status === 403 && detail === "csrf validation failed") {
          // Session token may have rotated: clear the cache, re-fetch once and retry once.
          csrfToken = null;
          try {
            const token = await ensureCsrfToken();
            if (token) headers.set("X-CSRF-Token", token);
          } catch { /* keep the original 403 as the actionable error */ }
          return doRequest(true);
        }
        const message = typeof detail === "string" ? detail
          : detail && typeof detail.message === "string" ? detail.message
          : null;
        const error = new Error(message || t("toast.request_failed", { status: response.status }));
        error.status = response.status;
        error.payload = payload;
        throw error;
      }
      return payload;
    };
    return doRequest(false);
  };
  const moneyCents = (value, currency = "CNY") => `${currency === "CNY" ? "¥" : currency + " "}${(Number(value || 0) / 100).toFixed(2)}`;

  // ------------------------------------------- QR modal (scan login / payment)
  // The QR image is rendered locally by the shared qrcode-generator library
  // (/shared/yykj-weblibs); no external service is contacted and polling uses
  // the same-origin API only. All copy lives in the content library.
  const qrModalNode = () => document.querySelector("[data-qr-modal]");
  const inWeChatBrowser = () => /micromessenger/i.test(navigator.userAgent || "");
  let qrWatch = null;

  const stopQrWatch = () => {
    if (!qrWatch) return;
    qrWatch.stopped = true;
    window.clearTimeout(qrWatch.timer);
    if (qrWatch.countdown) window.clearInterval(qrWatch.countdown);
    qrWatch = null;
  };

  const renderQrSvg = (host, text, fallback) => {
    if (!host) return false;
    const lib = window.qrcode;
    if (typeof lib !== "function" || !text) {
      host.textContent = fallback || "";
      return false;
    }
    try {
      const qr = lib(0, "M");
      qr.addData(String(text));
      qr.make();
      host.innerHTML = qr.createSvgTag(5, 3);
      return true;
    } catch {
      host.textContent = fallback || "";
      return false;
    }
  };

  const openQrModal = ({ eyebrow, title, note, amount }) => {
    // On the auth card the QR renders inline ([data-auth-qr]); payment and
    // account-binding flows keep using the global modal.
    const inline = document.querySelector("[data-auth-qr]");
    const modal = inline || qrModalNode();
    if (!modal) return null;
    stopQrWatch();
    const parts = {
      eyebrow: modal.querySelector("[data-qr-eyebrow]"),
      title: modal.querySelector("[data-qr-title]"),
      code: modal.querySelector("[data-qr-code]"),
      amountRow: modal.querySelector("[data-qr-amount]"),
      amountValue: modal.querySelector("[data-qr-amount-value]"),
      note: modal.querySelector("[data-qr-note]"),
      status: modal.querySelector("[data-qr-status]"),
      refresh: modal.querySelector("[data-qr-refresh]"),
      expired: modal.querySelector("[data-qr-expired]"),
      extra: modal.querySelector("[data-qr-extra]")
    };
    if (parts.eyebrow) parts.eyebrow.textContent = eyebrow || content.site.brand || "";
    if (parts.title) parts.title.textContent = title || "";
    if (parts.note) parts.note.textContent = note || "";
    if (parts.status) { parts.status.className = "qr-modal__status"; parts.status.textContent = ""; }
    if (parts.amountRow) {
      parts.amountRow.hidden = amount == null;
      if (amount != null && parts.amountValue) parts.amountValue.textContent = amount;
    }
    if (parts.refresh) { parts.refresh.hidden = true; parts.refresh.dataset.qrAction = ""; parts.refresh.dataset.qrTarget = ""; }
    if (parts.expired) { parts.expired.hidden = true; parts.expired.dataset.qrAction = ""; parts.expired.dataset.qrTarget = ""; }
    if (parts.extra) parts.extra.innerHTML = "";
    if (parts.code) parts.code.textContent = t("auth.wechat_qr_waiting");
    if (!inline) {
      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    return { modal, parts, inline };
  };

  const closeQrModal = () => {
    const modal = qrModalNode();
    stopQrWatch();
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  const setQrStatus = (parts, text, tone = "") => {
    if (!parts || !parts.status) return;
    parts.status.className = "qr-modal__status" + (tone ? ` is-${tone}` : "");
    parts.status.textContent = text || "";
  };

  const showQrRefresh = (parts, action, target, label) => {
    if (!parts) return;
    // ProcessOn covers the QR itself with the expired overlay; that overlay is a
    // button, so it also serves keyboard users and the extra refresh button is
    // only used where no overlay exists (payment / binding modals).
    const overlay = Boolean(parts.expired);
    if (parts.expired) {
      parts.expired.hidden = false;
      parts.expired.dataset.qrAction = action;
      parts.expired.dataset.qrTarget = target || "";
      setQrStatus(parts, "");
    }
    if (parts.refresh) {
      parts.refresh.hidden = overlay;
      parts.refresh.textContent = label || t("auth.wechat_qr_refresh");
      parts.refresh.dataset.qrAction = action;
      parts.refresh.dataset.qrTarget = target || "";
    }
  };

  const goToReturnPath = (value) => {
    const target = String(value || "").trim() || "/#account";
    if (target.startsWith("/#")) { window.location.hash = target.slice(1); return; }
    if (target.startsWith("#")) { window.location.hash = target; return; }
    window.location.hash = `#${target.replace(/^\/+/, "")}`;
  };

  const watchQrPoll = (delay, step) => {
    const watch = { stopped: false, timer: 0, step };
    qrWatch = watch;
    watch.timer = window.setTimeout(() => { if (!watch.stopped) step(watch); }, delay);
    return watch;
  };

  const scheduleQrPoll = (watch, delay) => {
    window.clearTimeout(watch.timer);
    watch.timer = window.setTimeout(() => { if (!watch.stopped) watch.step(watch); }, delay);
  };

  const startWechatQrLogin = async (next, target = null) => {
    const ui = openQrModal({
      eyebrow: t("auth.eyebrow"),
      title: t("auth.wechat_qr_title"),
      note: t("auth.wechat_qr_notice"),
      amount: null
    });
    if (!ui) return;
    const { parts } = ui;
    const returnPath = next || "/#account";
    let payload;
    try {
      payload = await apiRequest(`/api/auth/wechat/qr?next=${encodeURIComponent(returnPath)}`, { method: "POST", body: "{}" });
    } catch (error) {
      setQrStatus(parts, error.message || t("auth.wechat_error"), "error");
      return;
    }
    if (!renderQrSvg(parts.code, payload.url, t("auth.wechat_error"))) {
      setQrStatus(parts, t("auth.wechat_error"), "error");
      return;
    }
    setQrStatus(parts, t("auth.wechat_qr_scanning"));
    const poll = async (watch) => {
      let result;
      try {
        result = await apiRequest(`/api/auth/wechat/qr/${encodeURIComponent(payload.ticket)}/consume`, { method: "POST", body: "{}" });
      } catch {
        scheduleQrPoll(watch, 2400);
        return;
      }
      if (watch.stopped) return;
      if (result && result.status === "ok") {
        stopQrWatch();
        setQrStatus(parts, t("auth.wechat_qr_success"), "success");
        await hydrateSession();
        goToReturnPath(result.next || returnPath);
        window.setTimeout(closeQrModal, 500);
        return;
      }
      if (result && result.status === "pending") {
        setQrStatus(parts, t("auth.wechat_qr_confirm"));
        scheduleQrPoll(watch, 1600);
        return;
      }
      if (result && result.status === "unbound") {
        // Unbound WeChat cannot log in: guide to register/login and bind (no auto-account).
        stopQrWatch();
        if (parts.code) parts.code.innerHTML = `<div class="qr-modal__state"><span class="qr-modal__state-icon">!</span><strong>${esc(t("auth.wechat_unbound_badge"))}</strong></div>`;
        setQrStatus(parts, "");
        if (parts.note) parts.note.textContent = t("auth.wechat_unbound_lede");
        if (parts.extra) {
          parts.extra.innerHTML =
            `<a class="button button--primary button--small" href="#register" data-qr-action>${t("auth.wechat_unbound_register")}</a>` +
            `<a class="button button--outline button--small" href="#account/settings" data-qr-action>${t("auth.wechat_unbound_bind")}</a>`;
        }
        return;
      }
      setQrStatus(parts, t("auth.wechat_qr_expired"), "error");
      showQrRefresh(parts, "login", returnPath, t("auth.wechat_qr_refresh"));
    };
    watchQrPoll(1200, poll);
    if (target && target.dataset) target.dataset.wechatNext = returnPath;
  };

  // Register page: scene QR -> follow the service account -> account auto-created.
  const startWechatRegister = async (next, target = null) => {
    const ui = openQrModal({
      eyebrow: t("auth.eyebrow"),
      title: t("auth.wechat_register_title"),
      // Inside WeChat the same phone cannot scan its own screen: ask for a
      // long-press recognition instead of a scan (ProcessOn does the same).
      note: inWeChatBrowser() ? t("auth.wechat_register_lede_wechat") : t("auth.wechat_register_notice"),
      amount: null
    });
    if (!ui) return;
    const { parts } = ui;
    const returnPath = next || "/#account";
    let payload;
    try {
      payload = await apiRequest(`/api/wechat/register/qr?next=${encodeURIComponent(returnPath)}`, { method: "POST", body: "{}" });
    } catch (error) {
      setQrStatus(parts, error.message || t("auth.wechat_error"), "error");
      showQrRefresh(parts, "register-refresh", returnPath, t("auth.wechat_qr_refresh"));
      return;
    }
    if (parts.code) {
      parts.code.innerHTML = `<img class="qr-modal__image" src="${esc(payload.image_url)}" alt="${esc(t("auth.wechat_register_title"))}">`;
    }
    setQrStatus(parts, t("auth.wechat_register_waiting"));
    const poll = async (watch) => {
      let result;
      try {
        result = await apiRequest(`/api/wechat/register/${encodeURIComponent(payload.session)}/poll`, { method: "POST", body: "{}" });
      } catch (error) {
        scheduleQrPoll(watch, 2400);
        return;
      }
      if (watch.stopped) return;
      if (result && result.status === "ok") {
        stopQrWatch();
        setQrStatus(parts, t("auth.wechat_register_success"), "success");
        authRegisterDone = true;
        await hydrateSession();
        const target = result.next || returnPath;
        if (result.existing) {
          authRegisterDone = false;
          showToast(t("toast.wechat_register_existing"));
          goToReturnPath(target);
          window.setTimeout(closeQrModal, 400);
          return;
        }
        if (!result.needs_email) {
          authRegisterDone = false;
          goToReturnPath(target);
          window.setTimeout(closeQrModal, 400);
          return;
        }
        window.setTimeout(() => showRegisterDone(target), 400);
        return;
      }
      if (result && result.status === "scanned") {
        setQrStatus(parts, t("auth.wechat_register_scanned"));
        scheduleQrPoll(watch, 1200);
        return;
      }
      if (result && result.status === "waiting") {
        scheduleQrPoll(watch, 1600);
        return;
      }
      if (result && result.status === "failed") {
        stopQrWatch();
        setQrStatus(parts, t("auth.wechat_register_failed"), "error");
        showQrRefresh(parts, "register", payload.session, t("auth.wechat_register_retry"));
        return;
      }
      setQrStatus(parts, t("auth.wechat_qr_expired"), "error");
      showQrRefresh(parts, "register-refresh", returnPath, t("auth.wechat_qr_refresh"));
    };
    const watch = watchQrPoll(1500, poll);
    const deadline = payload.expires_at ? Date.parse(payload.expires_at) : 0;
    if (deadline) {
      watch.countdown = window.setInterval(() => {
        if (watch.stopped) { window.clearInterval(watch.countdown); return; }
        const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
        if (left <= 0) {
          stopQrWatch();
          setQrStatus(parts, t("auth.wechat_qr_expired"), "error");
          showQrRefresh(parts, "register-refresh", returnPath, t("auth.wechat_qr_refresh"));
          return;
        }
        const mins = Math.floor(left / 60);
        const secs = String(left % 60).padStart(2, "0");
        setQrStatus(parts, `${t("auth.wechat_register_waiting")} ${mins}:${secs}`);
      }, 1000);
    }
    if (target && target.dataset) target.dataset.wechatNext = returnPath;
  };

  // Account settings: bind the next scanned WeChat to the signed-in account.
  const startWechatBind = async () => {
    const ui = openQrModal({
      eyebrow: t("account.wechat_bind_title"),
      title: t("account.wechat_bind_title"),
      note: t("account.wechat_bind_lede"),
      amount: null
    });
    if (!ui) return;
    const { parts } = ui;
    let payload;
    try {
      payload = await apiRequest("/api/me/wechat/bind/qr", { method: "POST", body: "{}" });
    } catch (error) {
      setQrStatus(parts, error.message || t("auth.wechat_error"), "error");
      return;
    }
    if (!renderQrSvg(parts.code, payload.url, t("auth.wechat_error"))) {
      setQrStatus(parts, t("auth.wechat_error"), "error");
      return;
    }
    setQrStatus(parts, t("auth.wechat_qr_scanning"));
    const poll = async (watch) => {
      let result;
      try {
        result = await apiRequest(
          `/api/me/wechat/bind/qr/${encodeURIComponent(payload.ticket)}/consume`,
          { method: "POST", body: "{}" }
        );
      } catch {
        scheduleQrPoll(watch, 2400);
        return;
      }
      if (watch.stopped) return;
      if (result && result.status === "ok") {
        stopQrWatch();
        setQrStatus(parts, t("account.wechat_bind_success"), "success");
        window.setTimeout(async () => { closeQrModal(); await hydrateAccount("security"); }, 700);
        return;
      }
      if (result && result.status === "pending") {
        setQrStatus(parts, t("auth.wechat_qr_confirm"));
        scheduleQrPoll(watch, 1600);
        return;
      }
      if (result && result.status === "failed") {
        stopQrWatch();
        setQrStatus(parts, result.reason === "taken" ? t("account.wechat_bind_taken") : t("auth.wechat_error"), "error");
        return;
      }
      setQrStatus(parts, t("auth.wechat_qr_expired"), "error");
      showQrRefresh(parts, "bind", "", t("auth.wechat_qr_refresh"));
    };
    watchQrPoll(1200, poll);
  };

  const handleCheckoutPaid = (order, options = {}) => {
    showToast(t("toast.paid"));
    // VIP purchase: refresh membership then re-render so the price row switches to the VIP price.
    if (options.vipRefresh) {
      state.membership = null;
      hydrateSession().then(() => render());
      return;
    }
    if (options.inPlaceSlug) { renderPurchaseSuccess(options.inPlaceSlug); return; }
    if (route().startsWith("account")) { hydrateAccount("orders"); return; }
    window.location.hash = "#account/orders";
  };

  const waitForOrderPaid = async (orderNo, timeoutMs = 15000) => {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      try {
        // Reconcile first: the callback may never arrive (key/network/deploy window),
        // an active query settles the order right away.
        const order = await apiRequest(`/api/orders/${encodeURIComponent(orderNo)}/reconcile`, { method: "POST", body: "{}" })
          .catch(() => apiRequest(`/api/orders/${encodeURIComponent(orderNo)}`));
        if (order && order.status === "paid") return true;
      } catch { /* transient errors keep polling until the deadline */ }
      await new Promise((resolve) => window.setTimeout(resolve, 1500));
    }
    return false;
  };

  const startWechatPayQr = (order, payment, options = {}) => {
    const ui = openQrModal({
      eyebrow: content.site.brand || "",
      title: t("pay.qr_title"),
      note: t("pay.qr_lede"),
      amount: moneyCents(order.amount_cents, order.currency)
    });
    if (!ui) return;
    const { parts } = ui;
    if (!renderQrSvg(parts.code, payment.checkout_url, t("pay.qr_expired"))) {
      setQrStatus(parts, t("pay.qr_expired"), "error");
      return;
    }
    setQrStatus(parts, t("pay.qr_waiting"));
    const deadline = payment.expires_at ? Date.parse(payment.expires_at) : 0;
    // Ask WeChat to confirm every third tick (~6s): covers "paid but callback lost"
    // without hammering the query API. Keeps the QR window closing within seconds.
    let ticks = 0;
    const poll = async (watch) => {
      ticks += 1;
      let current;
      try {
        current = ticks % 3 === 1
          ? await apiRequest(`/api/orders/${encodeURIComponent(order.biz_order_no)}/reconcile`, { method: "POST", body: "{}" })
              .catch(() => apiRequest(`/api/orders/${encodeURIComponent(order.biz_order_no)}`))
          : await apiRequest(`/api/orders/${encodeURIComponent(order.biz_order_no)}`);
      } catch {
        scheduleQrPoll(watch, 2400);
        return;
      }
      if (watch.stopped) return;
      if (current && current.status === "paid") {
        stopQrWatch();
        setQrStatus(parts, t("pay.qr_paid"), "success");
        window.setTimeout(() => { closeQrModal(); handleCheckoutPaid(order, options); }, 650);
        return;
      }
      if (deadline && Date.now() > deadline) {
        stopQrWatch();
        setQrStatus(parts, t("pay.qr_expired"), "error");
        showQrRefresh(parts, "pay", order.biz_order_no, t("pay.qr_refresh"));
        return;
      }
      setQrStatus(parts, t("pay.qr_waiting") + " " + t("pay.qr_keep_open"));
      scheduleQrPoll(watch, 2000);
    };
    watchQrPoll(1500, poll);
  };

  const payWithWechatJsapi = (payment, order, options = {}) => {
    let params = null;
    try { params = JSON.parse(payment.pay_body || "{}"); } catch { params = null; }
    if (!params || !params.paySign) { showToast(t("pay.jsapi_failed")); return; }
    showToast(t("pay.jsapi_launching"));
    const invoke = () => {
      window.WeixinJSBridge.invoke("getBrandWCPayRequest", params, (result) => {
        const message = String((result && result.err_msg) || "");
        if (message === "get_brand_wcpay_request:ok") {
          waitForOrderPaid(order.biz_order_no).then((paid) => {
            if (paid) handleCheckoutPaid(order, options);
            else showToast(t("pay.qr_keep_open"));
          });
          return;
        }
        if (message === "get_brand_wcpay_request:cancel") { showToast(t("toast.pay_failed")); return; }
        showToast(t("pay.jsapi_failed"));
      });
    };
    if (typeof window.WeixinJSBridge === "undefined") {
      document.addEventListener("WeixinJSBridgeReady", invoke, { once: true });
      return;
    }
    invoke();
  };

  const startCheckout = async (order, options = {}) => {
    const config = await apiRequest("/api/config");
    if (config.dev_payment_enabled) {
      await apiRequest(`/api/dev/orders/${encodeURIComponent(order.biz_order_no)}/pay`, { method: "POST", body: "{}" });
      handleCheckoutPaid(order, options);
      return "dev";
    }
    if (!config.wechat_pay_enabled && !config.daxpay_configured) {
      showToast(t("toast.order_created_no_channel", { order: order.biz_order_no }));
      return "none";
    }
    const payment = await apiRequest(`/api/orders/${encodeURIComponent(order.biz_order_no)}/pay`, { method: "POST", body: "{}" });
    if (payment.pay_body_type === "wechat_jsapi") { payWithWechatJsapi(payment, order, options); return "jsapi"; }
    if (payment.pay_body_type === "wechat_native" && payment.checkout_url) { startWechatPayQr(order, payment, options); return "native"; }
    if (payment.checkout_url) { window.location.href = payment.checkout_url; return "redirect"; }
    showToast(t("toast.order_created_pay", { order: order.biz_order_no }));
    return "pending";
  };

  const route = () => (window.location.hash.slice(1).split("?")[0] || "home");
  const query = () => new URLSearchParams(window.location.hash.split("?")[1] || "");
  const routeTool = () => route().startsWith("tool/") ? tool(route().slice(5)) : null;
  const routeDataset = () => route().startsWith("dataset/") ? datasets.find((item) => item.id === route().slice(8)) : null;
  const image = (item) => item.image ? `<img class="tool-card__image" src="./images/tools/${esc(item.image)}" alt="${esc(t("tools.image_alt", { name: item.name }))}">` : `<div class="tool-card__image tool-card__image--empty" aria-label="${t("tools.preview_empty")}"><span>${t("tools.preview_label")}</span></div>`;
  const video = (item) => item.video
    ? `<div class="detail-visual"><video controls preload="metadata" src="${esc(item.video)}"></video></div>`
    : item.image
      ? `<div class="detail-visual detail-visual--cover"><img src="./images/tools/${esc(item.image)}" alt="${esc(t("tools.image_alt", { name: item.name }))}"></div>`
      : `<div class="detail-visual detail-visual--empty"><span>${t("detail.video_empty")}</span></div>`;
  const toolMediaFor = (code) => (content.toolMedia || []).filter((media) => media.toolCode === code && media.status !== false).sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0));
  const toolUpdatesFor = (code) => (content.toolUpdates || []).filter((update) => update.toolCode === code && update.status === "published").sort((a, b) => Number(b.sort || 0) - Number(a.sort || 0));
  const toolDocsFor = (code) => (content.toolDocs || []).filter((doc) => doc.toolCode === code && doc.status !== false).sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0));
  const publicFeedbackHtml = (items) => items.length
    ? `<ul class="detail-public-feedback">${items.map((item) => `<li><span>${esc({satisfied:t("detail.feedback_satisfied"), neutral:t("detail.feedback_neutral"), problem:t("detail.feedback_problem")}[item.rating] || item.rating)}</span><p>${esc(item.detail || t("detail.feedback_no_text"))}</p>${item.admin_reply ? `<small>${esc(item.admin_reply)}</small>` : ""}</li>`).join("")}</ul>`
    : `<p class="empty-panel">${t("detail.feedback_empty")}</p>`;
  // Feedback input unlocks only for a signed-in user with at least one recorded run of this tool.
  const feedbackInputHtml = (item, eligibility) => {
    if (!eligibility) return `<p class="detail-feedback__hint">${t("detail.feedback_loading")}</p>`;
    if (eligibility.login_required) return `<p class="detail-feedback__hint">${t("detail.feedback_login")}<a class="text-link" href="#login">${t("header.login")}</a></p>`;
    if (!eligibility.eligible) return `<p class="detail-feedback__hint">${t("detail.feedback_after_use")}</p>`;
    return `<form class="detail-feedback" data-tool-feedback="${esc(item.toolCode)}"><p class="detail-feedback__title">${t("detail.feedback_title")}</p><div class="detail-feedback__choices"><button type="button" data-feedback-rating="satisfied">${t("detail.feedback_satisfied")}</button><button type="button" data-feedback-rating="neutral">${t("detail.feedback_neutral")}</button><button type="button" data-feedback-rating="problem">${t("detail.feedback_problem")}</button></div><textarea name="detail" rows="3" hidden placeholder="${t("detail.feedback_placeholder")}"></textarea><button class="button button--outline button--small" type="submit" data-feedback-submit hidden>${t("detail.feedback_submit")}</button><p class="status" data-feedback-status></p></form>`;
  };
  const feedbackPanelHtml = (item, items, eligibility) => `${feedbackInputHtml(item, eligibility)}${publicFeedbackHtml(items)}`;
  const mediaSource = (media) => media.src.startsWith("http") ? media.src : `./${esc(media.src)}`;
  const detailCarousel = (slides) => {
    const index = Math.max(0, Math.min(state.detailSlide, slides.length - 1));
    const items = slides.map((entry, position) => `<div class="detail-slide${position === index ? " is-active" : ""}"><img src="${mediaSource(entry)}" alt="${esc(entry.title)}" loading="lazy"></div>`).join("");
    const dots = slides.map((_, position) => `<button type="button" class="detail-carousel__dot${position === index ? " is-active" : ""}" data-detail-dot="${position}" aria-label="${t("detail.slide_dot", { index: position + 1 })}"></button>`).join("");
    return `<div class="detail-carousel"><button type="button" class="detail-carousel__arrow detail-carousel__arrow--prev" data-detail-prev aria-label="${t("detail.slide_prev")}">‹</button><div class="detail-carousel__stage">${items}</div><button type="button" class="detail-carousel__arrow detail-carousel__arrow--next" data-detail-next aria-label="${t("detail.slide_next")}">›</button><div class="detail-carousel__dots">${dots}</div></div>`;
  };
  const detailMedia = (item) => {
    const media = toolMediaFor(item.toolCode);
    if (!media.length) return video(item);
    const slides = media.filter((entry) => entry.mediaType !== "video");
    if (slides.length === 1) {
      const entry = slides[0];
      return `<div class="detail-schematic"><img src="${mediaSource(entry)}" alt="${esc(entry.title)}" loading="lazy"><button type="button" class="detail-fullscreen" data-detail-fullscreen data-fullscreen-src="${mediaSource(entry)}" aria-label="${t("detail.fullscreen")}">${icon("expand", t("detail.fullscreen"))}</button></div>`;
    }
    if (slides.length > 1) return detailCarousel(slides);
    const movie = media.find((entry) => entry.mediaType === "video");
    if (movie) return `<div class="detail-visual"><video controls preload="metadata" src="${mediaSource(movie)}"${movie.poster ? ` poster="${mediaSource({ src: movie.poster })}"` : ""}></video></div>`;
    return video(item);
  };

  function toolCard(item) {
    const href = `#tool/${esc(item.slug)}`;
    return `<article class="tool-card"><div class="tool-card__media"><a class="tool-card__media-link" href="${href}">${image(item)}</a><div class="tool-card__meta">${toolBadges(item)}</div></div><div class="tool-card__body"><h3><a href="${href}">${esc(item.name)}</a></h3><div class="tool-card__tags">${tagChips(item)}</div><p>${esc(plainDescription(item.description))}</p></div></article>`;
  }

  function home() {
    return `<div class="page"><section class="hero"><div class="container hero-inner"><p class="eyebrow">${t("home.hero.eyebrow")}</p><h1>${t("home.hero.title")}</h1><p class="hero-lede">${t("home.hero.lede")}</p><div class="hero-actions"><a class="button button--primary" href="#tools">${t("home.hero.primary")}</a><a class="button button--outline" href="#pricing">${t("home.hero.secondary")}</a></div><div class="stats"><div class="stat"><strong>${tools.length}</strong><span>${esc(content.site.home_stat_tools_label)}</span></div><div class="stat"><strong>${esc(content.site.home_stat_images_value)}</strong><span>${esc(content.site.home_stat_images_label)}</span></div><div class="stat"><strong>${esc(content.site.home_stat_account_value)}</strong><span>${esc(content.site.home_stat_account_label)}</span></div></div></div></section><section class="section"><div class="container"><div class="section-heading"><div><p class="eyebrow">${t("home.why.eyebrow")}</p><h2>${t("home.why.title")}</h2><p>${t("home.why.lede")}</p></div><a class="text-link" href="#about">${t("home.why.link")}</a></div><div class="category-grid">${tags.map((item) => `<a class="category-card" href="#tools?tag=${item.key}"><span class="category-icon" aria-hidden="true">${icon(item.icon)}</span><strong>${item.name}</strong><span>${item.description}</span></a>`).join("")}</div></div></section><section class="section section--wash"><div class="container"><div class="section-heading"><div><p class="eyebrow">${t("home.popular.eyebrow")}</p><h2>${t("home.popular.title")}</h2></div><a class="text-link" href="#tools">${t("home.popular.link")}</a></div><div class="tool-grid">${tools.filter((item) => item.featured !== false).slice(0, 4).map((item) => toolCard(item)).join("")}</div></div></section><section class="cta"><div class="container cta-inner"><h2>${t("home.cta.title")}</h2><p>${t("home.cta.lede")}</p><div class="hero-actions"><a class="button button--primary" href="#register">${t("home.cta.primary")}</a><a class="button button--outline" href="#about?section=contact">${t("home.cta.secondary")}</a></div></div></section></div>`;
  }

  const visibleTools = () => tools.filter((item) => (!state.filters.length || item.tags.some((key) => state.filters.includes(key))) && `${item.name} ${item.description} ${item.result}`.includes(state.query));
  const toolResultsHtml = () => { const visible = visibleTools(); return visible.length ? `<div class="tool-grid">${visible.map((item) => toolCard(item)).join("")}</div>` : `<div class="empty-panel">${t("tools.empty")}<br><a class="text-link" href="#requests">${t("tools.empty_link")}</a></div>`; };
  const visibleDatasets = () => datasets.filter((item) => (state.datasetFilter === "all" || item.type === state.datasetFilter) && `${item.name} ${item.description} ${item.formats}`.includes(state.datasetQuery));
  const datasetResultsHtml = () => { const visible = visibleDatasets(); return visible.length ? `<div class="dataset-grid">${visible.map(datasetCard).join("")}</div>` : `<div class="empty-panel">${t("datasets.empty")}</div>`; };
  function toolsPage() {
    const visible = visibleTools();
    return `<div class="page"><section class="page-heading"><div class="container"><p class="eyebrow">${t("tools.eyebrow")}</p><h1>${t("tools.title")}</h1><p>${t("tools.lede")}</p></div></section><section class="section"><div class="container"><div class="toolbar"><input id="tools-search" type="search" value="${esc(state.query)}" placeholder="${t("tools.search_placeholder")}" aria-label="${t("tools.search_aria")}"><span class="tool-count">${t("tools.count", { count: visible.length })}</span></div><div class="filter-row"><button class="filter-button${!state.filters.length ? " is-active" : ""}" data-filter="all">${icon("grid")}${t("common.all")}</button>${tags.map((item) => `<button class="filter-button${state.filters.includes(item.key) ? " is-active" : ""}" data-filter="${item.key}">${icon(item.icon)}${item.name}</button>`).join("")}</div><div data-tool-results>${toolResultsHtml()}</div></div></section></div>`;
  }

  function detail(item) {
    // Paid tool: only a confirmed entitlement shows "start"; unknown or locked (incl. anonymous)
    // renders the purchase entry, so visitors see the per-site price and the sample link first.
    const requiresPurchase = item.billing === "paid" && state.toolAccess[item.slug] !== true;
    // {link} in the description -> compliance-system anchor (URL from content site.compliance_url).
    const complianceUrl = String((content.site && content.site.compliance_url) || "");
    const complianceAnchor = complianceUrl
      ? `<a class="text-link" href="${esc(complianceUrl)}" target="_blank" rel="noopener noreferrer">${t("detail.compliance_link")}</a>`
      : t("detail.compliance_link");
    const ledeHtml = String(item.description || "").split("{link}").map((part) => esc(part)).join(complianceAnchor);
    const actionLabel = item.form === "service"
      ? t("detail.submit_request")
      : item.available
        ? t(requiresPurchase ? "detail.purchase_required" : "detail.start")
        : t("detail.preparing");
    const entry = toolEntry(item);
    // Paid tool without access: price + coupon/credit entry above the buttons, primary pays now.
    const action = item.form === "service"
      ? `<a class="button button--primary detail-cta" href="#about?section=contact">${actionLabel}</a>`
      : item.available
        ? requiresPurchase
          ? `<div class="detail-buy"><button class="button button--primary detail-buy__pay" type="button" data-buy-now="${esc(item.slug)}">${actionLabel}</button><a class="button button--outline detail-buy__demo" href="${esc(entry.demo)}"><span>${t("detail.demo_button")}</span><em>${t("detail.demo_note")}</em></a></div>`
          : `<button class="button button--primary detail-cta" data-launch="${item.slug}">${actionLabel}</button>`
        : `<button class="button button--primary detail-cta" disabled>${actionLabel}</button>`;
    const payEntry = requiresPurchase
      ? `<div class="detail-pay" data-pay-entry="${esc(item.slug)}"><div class="detail-pay__row"><span class="skeleton skeleton--text"></span></div></div>`
      : "";
    const docs = toolDocsFor(item.toolCode);
    // Data tab: content rows are split on "；" and rendered as short one-line items.
    const docItems = (text) => String(text || "").split(/[；;]/).map((entry) => entry.trim()).filter(Boolean);
    const docsPanel = docs.length
      ? `<div class="detail-doc-list">${docs.map((doc) => `<section class="detail-doc"><h3>${esc(doc.title)}</h3><ul class="detail-doc__list">${docItems(doc.content).map((entry) => `<li>${esc(entry)}</li>`).join("")}</ul></section>`).join("")}</div>`
      : `<p class="empty-panel">${t("detail.data_empty")}</p>`;
    const updates = toolUpdatesFor(item.toolCode);
    const updatesPanel = updates.length
      ? `<ul class="detail-updates detail-updates--full">${updates.map((update) => `<li><strong>${esc(update.version)}</strong><span>${esc(update.title)}</span><small>${esc(update.publishedAt)}</small><p>${esc(update.summary)}</p></li>`).join("")}</ul>`
      : `<p class="empty-panel">${t("detail.updates_empty")}</p>`;
    const feedbackPanel = feedbackPanelHtml(item, state.toolFeedback || [], state.toolFeedbackEligibility);
    const tabs = [
      ["illustration", t("detail.tab_illustration")],
      ["data", t("detail.tab_data")],
      ["updates", t("detail.tab_updates")],
      ["feedback", t("detail.tab_feedback")]
    ].map(([key, label]) => `<button type="button" class="detail-tab${state.toolTab === key ? " is-active" : ""}" data-tool-tab="${key}">${label}</button>`).join("");
    const panel = state.toolTab === "illustration" ? detailMedia(item) : state.toolTab === "updates" ? updatesPanel : state.toolTab === "feedback" ? feedbackPanel : docsPanel;
    const billing = `<div class="detail-billing"><p class="detail-label">${t("detail.billing_title")}</p><ul class="detail-billing__list"><li>${t("detail.billing_site")}</li><li>${t("detail.billing_window")}</li><li>${t("detail.billing_vip")}</li></ul></div>`;
    return `<div class="page"><section class="detail-page"><div class="container"><div class="detail-grid"><div class="detail-copy"><nav class="breadcrumbs"><a href="#home">${t("common.home")}</a><span>/</span><a href="#tools">${t("detail.breadcrumb_tools")}</a><span>/</span><span>${esc(item.name)}</span></nav><div class="detail-title"><h1>${esc(item.name)}${tagChips(item)}</h1>${toolBadges(item)}</div><p class="detail-copy__lede">${ledeHtml}</p><p class="detail-label">${t("detail.capabilities")}</p><div class="detail-chips">${item.requirements.map((entry) => `<div class="fact"><strong>${esc(entry)}</strong></div>`).join("")}</div>${billing}<div class="detail-purchase">${payEntry}<div class="detail-actions">${action}</div><div class="detail-trust" data-tool-activity="${esc(item.toolCode)}"><span class="skeleton skeleton--text"></span><span class="skeleton skeleton--text skeleton--short"></span></div></div></div><section class="detail-panel"><nav class="detail-tabs">${tabs}</nav><div class="detail-panel__body" data-tool-feedback-panel="${esc(item.toolCode)}">${panel}</div></section></div></div></section>${purchaseModal(item, entry)}</div>`;
  }

  // Billing modes as a metric strip (reuses the home stats component).
  // Two identity cards: member (register to get) vs VIP member.
  const usageCompare = () => {
    const products = state.products || [];
    const membership = products.find((product) => product.tool_code === "membership");
    const plan = membership && (membership.plans || [])[0];
    const priceText = plan ? moneyCents(plan.price_cents, plan.currency) : "";
    const listText = plan ? moneyCents(Number(plan.list_price_cents || 0), plan.currency) : "";
    const showList = Boolean(plan) && Number(plan.list_price_cents || 0) > Number(plan.price_cents || 0);
    const proCta = plan
      ? state.membership?.active
        ? `<button class="button button--primary" type="button" disabled>${t("pricing.member_active")}</button>`
        : `<button class="button button--primary" type="button" data-buy-plan="${esc(membership.code)}|${esc(plan.code)}">${t("pricing.compare_pro_action")} · ${priceText} ${t("pricing.per_year")}</button>`
      : "";
    const memberCta = state.session
      ? `<button class="button button--outline" type="button" data-scroll-to="[data-pricing-products]">${t("pricing.compare_payg_action")}</button>`
      : `<a class="button button--outline" href="#register">${t("pricing.compare_member_action")}</a>`;
    const memberRows = [
      ["pricing.compare_row_tool_price", `<span data-price-min="1"></span> ${t("pricing.per_site")}${t("pricing.compare_price_original")}`],
      ["pricing.compare_row_share", `${t("pricing.compare_share_member")} <button class="text-link link-button" type="button" data-share-open>${t("pricing.share_go")}</button>`],
      ["pricing.pro_row_credits", t("pricing.compare_none")],
      ["pricing.compare_row_free", t("pricing.compare_free_use")],
      ["pricing.pro_row_window", t("pricing.pro_window_payg")],
      ["pricing.pro_row_custom", t("pricing.pro_custom_payg")],
      ["pricing.compare_row_suitable", t("pricing.compare_suitable_payg")]
    ];
    const vipRows = [
      ["pricing.compare_row_tool_price", t("pricing.compare_tool_price_vip")],
      ["pricing.compare_row_share", t("pricing.compare_share_vip")],
      ["pricing.pro_row_credits", t("pricing.compare_credits_vip")],
      ["pricing.compare_row_free", t("pricing.compare_free_use")],
      ["pricing.pro_row_window", t("pricing.pro_window_pro")],
      ["pricing.pro_row_custom", t("pricing.pro_custom_pro")],
      ["pricing.compare_row_suitable", t("pricing.compare_suitable_pro")]
    ];
    const rows = (items) => `<ul class="member-card__list">${items.map(([label, value]) => `<li><span>${t(label)}</span><strong>${value}</strong></li>`).join("")}</ul>`;
    return `<div class="member-cards"><article class="member-card"><div class="member-card__head"><h3>${t("pricing.compare_col_member")}</h3></div><p class="member-card__price"><span class="member-card__amount">${t("pricing.member_card_amount_free")}</span><span class="member-card__unit">${t("pricing.member_card_unit_free")}</span></p>${rows(memberRows)}<div class="member-card__cta">${memberCta}</div></article><article class="member-card member-card--pro"><div class="member-card__head"><h3>${t("pricing.compare_pro_title")}</h3><span class="badge badge--self">${t("pricing.compare_pro_badge")}</span></div><p class="member-card__price"><span class="member-card__amount">${priceText}</span><span class="member-card__unit">${t("pricing.per_year")}</span>${showList ? `<s>${listText}</s>` : ""}</p><p class="member-card__note">${t("pricing.member_card_note")}</p>${rows(vipRows)}<div class="member-card__cta">${proCta}</div></article></div>`;
  };


  const rulesCard = () => `<section class="pricing-rules"><h2>${t("pricing.rules_title")}</h2><ul>${["rule1", "rule2", "rule3", "rule4", "rule5"].map((key) => `<li>${t(`pricing.${key}`)}</li>`).join("")}</ul></section>`;

  function pricing() {
    return `<div class="page pricing-page"><section class="page-heading"><div class="container"><p class="eyebrow">${t("pricing.eyebrow")}</p><h1>${t("pricing.title")}</h1><p>${t("pricing.lede")}</p></div></section><section class="section pricing-plans-section"><div class="container"><div data-pricing-pro>${usageCompare()}</div><p class="pricing-footnote">${t("pricing.site_note")}<a class="text-link" href="#help">${t("pricing.faq_link")}</a></p></div></section><section class="section pricing-tools-section"><div class="container"><div class="section-heading"><div><h2>${t("pricing.products_title")}</h2><p>${t("pricing.products_lede")}</p></div></div><div class="pricing-tool-grid" data-pricing-products><div class="empty-panel">${t("pricing.loading")}</div></div></div></section></div>`;
  }

  // The plan section lists every tool: paid with plans can buy, paid without a
  // product shows pending, free links to the tool, custom links to contact.
  const toolPlanActions = (item, product) => {
    if (item.billing === "paid" && product && (product.plans || []).length) {
      const member = state.membership && state.membership.active ? state.membership : null;
      const buy = product.plans.map((plan) => {
      const list = Number(plan.list_price_cents || 0);
      const base = Number(plan.price_cents || 0);
      const price = planPrice(plan);
      const effective = price.pay;
      const vipRedeemable = Boolean(member) && member.credits_remaining > 0 && base <= Number(member.credit_limit_cents || 0);
      const tag = member
        ? `<span class="badge">${t("pricing.member_price_tag")}</span>`
        : price.hasVipDeal
          ? `<span class="badge">${t("detail.vip_price_tag", { price: moneyCents(price.vip, plan.currency) })}</span>`
          : "";
      const was = member && price.vip < price.list ? `<s>${moneyCents(price.list, plan.currency)}</s>` : "";
        const redeem = vipRedeemable
          ? `<button class="text-link link-button pricing-redeem" type="button" data-plan-redeem="${esc(product.code)}|${esc(plan.code)}">${t("pricing.redeem_button", { count: member.credits_remaining })}</button>`
            : "";
        return `<span class="pricing-plan-name">${esc(plan.display_name)}</span><button class="button pricing-buy" type="button" data-buy-plan="${esc(product.code)}|${esc(plan.code)}"><span class="pricing-buy__price">${moneyCents(effective, plan.currency)}<small>${t("pricing.per_site")}</small></span><span class="pricing-buy__meta">${tag}${was}</span></button>${redeem}`;
      }).join("");
      return `${buy}<a class="pricing-trial" href="${esc(toolEntry(item).demo)}" data-trial-sample="${esc(item.slug)}">${t("pricing.trial_button")}<span class="tool-tag">${t("pricing.trial_note")}</span></a>`;
    }
    if (item.billing === "paid") return `<span class="pricing-pending">${t("pricing.plan_pending")}</span>`;
    if (item.billing === "quote") return `<a class="button button--outline" href="#about?section=contact">${t("pricing.custom_button")}</a>`;
    return `<a class="button button--outline" href="#tool/${esc(item.slug)}">${t("pricing.free_use")}</a>`;
  };

  const pricingToolPlans = (products) => {
    const byTool = {};
    (products || []).forEach((product) => { byTool[product.tool_code] = product; });
    const ready = (item) => Boolean(byTool[item.toolCode]) && (byTool[item.toolCode].plans || []).length > 0;
    const rank = (item) => item.billing === "paid" ? (ready(item) ? 0 : 3) : item.billing === "free" ? 1 : 2;
    return [...tools]
      .sort((left, right) => rank(left) - rank(right) || left.sort - right.sort)
      .map((item) => {
        const product = byTool[item.toolCode];
        const pending = item.billing === "paid" && !ready(item);
        const thumb = item.image
          ? `<img class="pricing-tool-thumb" src="./images/tools/thumbs/${esc(item.image)}" alt="" loading="lazy">`
          : `<span class="pricing-tool-thumb pricing-tool-thumb--empty" aria-hidden="true"></span>`;
        return `<article class="pricing-tool-card${pending ? " is-pending" : ""}" data-pricing-tool="${esc(item.slug)}"><div class="pricing-tool-card__main">${thumb}<div class="pricing-tool-card__body"><h3>${esc(item.name)}</h3><p>${esc(item.description || t("pricing.product_fallback"))}</p></div></div><div class="pricing-tool-card__actions">${toolPlanActions(item, product)}</div></article>`;
      })
      .join("");
  };

  // Payment step: confirm tool/plan/amount first, then create the order.
  let pendingPlan = null;
  const planModal = () => document.querySelector("[data-plan-modal]");
  const closePlanModal = () => { planModal()?.remove(); };
  const openPlanPurchase = (productCode, planCode) => {
    const product = (state.products || []).find((entry) => entry.code === productCode);
    const plan = product ? (product.plans || []).find((entry) => entry.code === planCode) : null;
    if (!product || !plan) { showToast(t("toast.order_failed")); return; }
    const item = tools.find((tool) => tool.toolCode === product.tool_code);
    const effectivePrice = state.membership?.active ? Math.round(plan.price_cents * state.membership.discount_percent / 100) : plan.price_cents;
    const listPrice = Number(plan.list_price_cents || 0);
    const wasPrice = listPrice > effectivePrice ? ` <s>${moneyCents(listPrice, plan.currency)}</s>` : "";
    closePlanModal();
    const modal = document.createElement("div");
    modal.className = "request-modal";
    modal.setAttribute("data-plan-modal", "");
    modal.innerHTML = `<div class="request-modal__backdrop" data-close-plan></div><section class="request-modal__card" role="dialog" aria-modal="true"><div class="request-modal__heading"><div><p class="eyebrow">${t("purchase.eyebrow")}</p><h2>${t("pricing.confirm_title")}</h2><p>${t("pricing.confirm_lede")}</p></div><button class="icon-button" type="button" data-close-plan aria-label="${t("common.close")}">×</button></div><div class="plan-confirm"><div><span>${t("pricing.confirm_tool")}</span><strong>${esc(item ? item.name : product.display_name)}</strong></div><div><span>${t("pricing.confirm_plan")}</span><strong>${esc(plan.display_name)}</strong></div><div><span>${t("pricing.confirm_amount")}</span><strong>${moneyCents(effectivePrice, plan.currency)}<small>${t("pricing.per_site")}</small>${wasPrice}</strong></div></div>${state.config?.dev_payment_enabled ? `<p class="plan-confirm__note">${t("pricing.confirm_dev_note")}</p>` : ""}<div class="request-modal__actions"><button class="button button--outline" type="button" data-close-plan>${t("common.cancel")}</button><button class="button button--primary" type="button" data-plan-confirm="${esc(productCode)}|${esc(planCode)}">${t("pricing.confirm_submit")}</button></div></section>`;
    document.body.append(modal);
  };

  const afterAuth = async () => {
    csrfToken = null;
    await hydrateSession();
    const intent = pendingPlan;
    pendingPlan = null;
    if (intent) {
      const [productCode, planCode] = intent.split("|");
      window.location.hash = "#pricing";
      window.setTimeout(() => openPlanPurchase(productCode, planCode), 0);
      return;
    }
    window.location.hash = query().get("next") === "pricing" ? "#pricing" : "#account";
  };

  // The server price wins: resolve each card through its price_plan code.
  // The server price wins: the site-priced card shows the cheapest plan.
  const applyMinPrice = (products) => {
    const plans = (products || []).flatMap((product) => product.plans || []);
    if (!plans.length) return;
    const cheapest = plans.reduce((min, plan) => (plan.price_cents < min.price_cents ? plan : min));
    document.querySelectorAll("[data-price-min]").forEach((node) => {
      node.textContent = t("pricing.price_from", { price: moneyCents(cheapest.price_cents, cheapest.currency) });
    });
  };

  // #pricing?tool=<slug>: scroll to and highlight the matching pricing card after the
  // purchase modal confirms. Cards are rendered by hydratePricing via innerHTML, so the
  // focus step has to run after hydration completes.
  const focusPricingTool = () => {
    const slug = query().get("tool");
    if (!slug) return false;
    const card = document.querySelector(`[data-pricing-tool="${CSS.escape(slug)}"]`);
    if (!card) return false;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.add("is-highlighted");
    window.setTimeout(() => card.classList.remove("is-highlighted"), 1800);
    return true;
  };

  const hydratePricing = async () => {
    const target = document.querySelector("[data-pricing-products]");
    if (!target) return;
    try {
      const products = await apiRequest("/api/products");
      state.products = Array.isArray(products) ? products : [];
      state.membership = state.session ? await apiRequest("/api/me/membership").catch(() => null) : null;
      state.share = state.session ? await apiRequest("/api/share/summary").catch(() => null) : null;
      const compareBlock = document.querySelector("[data-pricing-pro]");
      if (compareBlock) compareBlock.innerHTML = usageCompare();
      target.innerHTML = pricingToolPlans(state.products);
      applyMinPrice(state.products);
      focusPricingTool();
    } catch (error) {
      target.innerHTML = `<div class="empty-panel">${t("pricing.error")}<br><button class="text-link link-button" type="button" data-pricing-retry>${t("common.reload")}</button></div>`;
    }
  };

  function help() {
    const items = content.help || [];
    const groups = [];
    items.forEach((item) => {
      let bucket = groups.find((entry) => entry.name === item.group);
      if (!bucket) { bucket = { name: item.group || "", items: [] }; groups.push(bucket); }
      bucket.items.push(item);
    });
    const sections = groups.map((group) => `<section class="section"><div class="container"><div class="section-heading"><div><h2>${esc(group.name)}</h2></div></div><div class="help-grid">${group.items.map((item) => `<article class="help-card"><h3>${esc(item.title)}</h3><p>${esc(item.copy)}</p><a class="text-link" href="${esc(item.href)}">${t("help.link")}</a></article>`).join("")}</div></div></section>`).join("");
    return `<div class="page"><section class="page-heading"><div class="container"><p class="eyebrow">${t("help.eyebrow")}</p><h1>${t("help.title")}</h1><p>${t("help.lede")}</p></div></section>${sections}</div>`;
  }

  function requestCard(item) {
    const voted = Boolean(state.requestVotes[item.id]);
    const voteCount = item.votes + Number(state.requestVoteCounts[item.id] || 0);
    return `<article class="request-card"><button class="request-vote${voted ? " is-voted" : ""}" type="button" data-request-vote="${esc(item.id)}" aria-pressed="${voted}" aria-label="${esc(t("requests.vote_aria", { title: item.title }))}">${icon("arrow-up")}<strong>${voteCount}</strong></button><div class="request-card__body"><div class="request-card__top"><h2>${esc(item.title)}</h2><div class="request-badges"><span class="badge badge--request-type">${requestTypes[item.type]}</span><span class="badge badge--request-status badge--${esc(item.status)}">${requestStatuses[item.status]}</span></div></div><p>${esc(item.summary)}</p><div class="request-card__meta"><span>${esc(item.author)}</span><span>${esc(item.time)}</span>${item.tool ? `<span>${esc(t("requests.tool_prefix", { tool: item.tool }))}</span>` : ""}</div></div></article>`;
  }

  function requestsPage() {
    let visible = requests.filter((item) => state.requestFilter === "all" || item.type === state.requestFilter);
    if (state.requestFilter === "mine") visible = requests.filter((item) => item.author === state.profile);
    visible = [...visible].sort((a, b) => state.requestSort === "top" ? (b.votes + Number(state.requestVoteCounts[b.id] || 0)) - (a.votes + Number(state.requestVoteCounts[a.id] || 0)) : b.time.localeCompare(a.time));
    return `<div class="page requests-page"><section class="page-heading"><div class="container"><p class="eyebrow">${t("requests.eyebrow")}</p><h1>${t("requests.title")}</h1><p>${t("requests.lede")}</p><button class="button button--primary" type="button" data-open-request-form>${icon("layers")}${t("requests.submit")}</button></div></section><section class="section"><div class="container request-shell"><div class="request-toolbar"><div class="request-filter-row"><button class="filter-button${state.requestFilter === "all" ? " is-active" : ""}" type="button" data-request-filter="all">${t("common.all")}</button>${Object.entries(requestTypes).map(([key, label]) => `<button class="filter-button${state.requestFilter === key ? " is-active" : ""}" type="button" data-request-filter="${key}">${label}</button>`).join("")}</div><div class="request-sort-row"><button class="sort-button${state.requestSort === "newest" ? " is-active" : ""}" type="button" data-request-sort="newest">${t("requests.sort_newest")}</button><button class="sort-button${state.requestSort === "top" ? " is-active" : ""}" type="button" data-request-sort="top">${t("requests.sort_top")}</button><button class="sort-button${state.requestFilter === "mine" ? " is-active" : ""}" type="button" data-request-filter="mine">${t("requests.mine")}</button></div></div><div class="request-list">${visible.length ? visible.map(requestCard).join("") : `<div class="empty-panel">${t("requests.empty")}<br><button class="text-link link-button" type="button" data-open-request-form>${t("requests.empty_link")}</button></div>`}</div></div></section><div class="request-modal" data-request-modal hidden><div class="request-modal__backdrop" data-close-request></div><section class="request-modal__card" role="dialog" aria-modal="true" aria-labelledby="request-modal-title"><div class="request-modal__heading"><div><p class="eyebrow">${t("requests.eyebrow")}</p><h2 id="request-modal-title">${t("requests.modal_title")}</h2><p>${t("requests.modal_lede")}</p></div><button class="icon-button" type="button" data-close-request aria-label="${t("requests.close_aria")}">×</button></div><form class="form-stack request-form" data-request-submit><label class="field">${t("requests.field_type")}<select name="type" required>${Object.entries(requestTypes).map(([key, label]) => `<option value="${key}">${label}</option>`).join("")}</select></label><label class="field">${t("requests.field_title")}<input name="title" maxlength="80" placeholder="${t("requests.field_title_placeholder")}" required></label><label class="field">${t("requests.field_summary")}<textarea name="summary" maxlength="500" placeholder="${t("requests.field_summary_placeholder")}" required></textarea></label><label class="field">${t("requests.field_tool")}<select name="tool"><option value="">${t("requests.field_tool_none")}</option>${tools.map((item) => `<option value="${esc(item.name)}">${esc(item.name)}</option>`).join("")}</select></label><div class="request-modal__actions"><button class="button button--outline" type="button" data-close-request>${t("common.cancel")}</button><button class="button button--primary" type="submit">${t("requests.submit")}</button></div><p class="status" data-request-status aria-live="polite"></p></form></section></div></div>`;
  }

  function datasetCard(item) {
    return `<a class="dataset-card" href="#dataset/${esc(item.id)}" data-dataset-detail="${esc(item.id)}"><div class="dataset-card__icon">${icon(item.icon)}</div><div class="dataset-card__heading"><h2>${esc(item.name)}</h2><span class="dataset-access dataset-access--${esc(item.access)}">${esc(item.accessLabel)}</span></div><p>${esc(item.description)}</p><div class="dataset-card__meta"><span>${icon("file-check")}${esc(t("datasets.records", { count: item.records }))}</span><span>${icon("database")}${esc(t("datasets.files", { count: item.files }))}</span><strong>${esc(item.formats)}</strong></div></a>`;
  }

  function datasetsPage() {
    const visible = visibleDatasets();
    const filters = [...new Set(datasets.map((item) => item.type))];
    return `<div class="page datasets-page"><section class="page-heading"><div class="container"><p class="eyebrow">${t("datasets.eyebrow")}</p><h1>${t("datasets.title")}</h1><p>${t("datasets.lede")}</p></div></section><section class="section"><div class="container dataset-shell"><div class="dataset-toolbar"><div class="dataset-search"><span aria-hidden="true">⌕</span><input id="dataset-search" type="search" value="${esc(state.datasetQuery)}" placeholder="${t("datasets.search_placeholder")}" aria-label="${t("datasets.search_aria")}"></div><div class="dataset-filter-row"><button class="filter-button${state.datasetFilter === "all" ? " is-active" : ""}" type="button" data-dataset-filter="all">${t("common.all")}</button>${filters.map((filter) => `<button class="filter-button${state.datasetFilter === filter ? " is-active" : ""}" type="button" data-dataset-filter="${esc(filter)}">${esc(filter)}</button>`).join("")}</div></div><div data-dataset-results>${datasetResultsHtml()}</div></div></section></div>`;
  }

  function datasetDetail(item) {
    const previewRows = item.preview;
    return `<div class="page dataset-detail-page"><section class="detail-page"><div class="container"><nav class="breadcrumbs"><a href="#home">${t("common.home")}</a><span>/</span><a href="#datasets">${t("nav.datasets")}</a><span>/</span><span>${esc(item.name)}</span></nav><div class="dataset-detail__hero"><div class="dataset-detail__icon">${icon(item.icon)}</div><div><span class="badge">${esc(item.type)}</span><h1>${esc(item.name)}</h1><p>${esc(item.description)}</p></div><div class="dataset-detail__actions"><button class="icon-button" type="button" data-dataset-action="save" aria-label="${t("datasets.save_aria")}">${icon("heart")}</button><button class="icon-button" type="button" data-dataset-action="share" aria-label="${t("datasets.share_aria")}">${icon("share")}</button></div></div><div class="dataset-stats"><div><strong>${esc(item.records)}</strong><span>${t("datasets.stat_records")}</span></div><div><strong>${esc(item.files)}</strong><span>${t("datasets.stat_files")}</span></div><div><strong>${esc(item.formats)}</strong><span>${t("datasets.stat_formats")}</span></div><div><strong>${esc(item.updated)}</strong><span>${t("datasets.stat_updated")}</span></div></div><section class="dataset-detail__section"><h2>${t("datasets.about_section")}</h2><p>${esc(item.about)}</p></section><section class="dataset-detail__section"><h2>${t("datasets.file_section")}</h2><div class="dataset-file-list">${item.fileList.map((file) => `<div class="dataset-file"><span>${icon("file-check")}</span><div><strong>${esc(file.name)}</strong><small>${esc(file.meta)}</small></div><button class="button button--outline button--small" type="button" data-dataset-download="${esc(item.id)}" data-dataset-file="${esc(file.name)}">${item.access === "paid" ? t("datasets.download_paid") : t("datasets.download_free")}</button></div>`).join("")}</div></section><section class="dataset-detail__section"><h2>${t("datasets.field_section")}</h2><div class="table-wrap"><table><thead><tr><th>${t("datasets.table_field")}</th><th>${t("datasets.table_desc")}</th><th>${t("datasets.table_type")}</th></tr></thead><tbody>${item.fields.map(([field, description, type]) => `<tr><td>${esc(field)}</td><td>${esc(description)}</td><td>${esc(type)}</td></tr>`).join("")}</tbody></table></div></section><section class="dataset-detail__section"><h2>${t("datasets.preview_section")}</h2><div class="table-wrap"><table><thead><tr>${item.fields.slice(0, 4).map(([field]) => `<th>${esc(field)}</th>`).join("")}</tr></thead><tbody>${previewRows.map((row) => `<tr>${row.map((value) => `<td>${esc(value)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section><section class="dataset-detail__notice"><strong>${t("datasets.notice_title")}</strong><p>${t("datasets.notice_body")}</p></section></div></section></div>`;
  }

  function about() {
    return `<div class="page about-page"><section class="about-hero"><div class="container about-hero__copy"><p class="eyebrow">${t("about.eyebrow")}</p><h1>${t("about.hero.title")}</h1><p>${t("about.hero.lede")}</p><div class="about-hero__actions"><a class="button button--primary" href="#tools">${t("about.hero.primary")}</a><a class="button button--outline" href="#about?section=contact">${t("about.hero.secondary")}</a></div></div></section><section class="about-section"><div class="container"><div class="about-section__heading"><p class="eyebrow">${t("about.section_mission")}</p><h2>${t("about.mission.title")}</h2><p>${t("about.mission.desc")}</p></div><div class="about-value-grid"><article class="about-value"><h3>${t("about.mission.value1_title")}</h3><p>${t("about.mission.value1_desc")}</p></article><article class="about-value"><h3>${t("about.mission.value2_title")}</h3><p>${t("about.mission.value2_desc")}</p></article><article class="about-value"><h3>${t("about.mission.value3_title")}</h3><p>${t("about.mission.value3_desc")}</p></article></div></div></section><section class="about-section about-section--wash"><div class="container"><div class="about-section__heading"><p class="eyebrow">${t("about.section_features")}</p><h2>${t("about.features.title")}</h2></div><div class="about-feature-grid"><article class="about-feature"><h3>${t("about.feature1_title")}</h3><p>${t("about.feature1_desc")}</p></article><article class="about-feature"><h3>${t("about.feature2_title")}</h3><p>${t("about.feature2_desc")}</p></article><article class="about-feature"><h3>${t("about.feature3_title")}</h3><p>${t("about.feature3_desc")}</p></article><article class="about-feature"><h3>${t("about.feature4_title")}</h3><p>${t("about.feature4_desc")}</p></article></div></div></section><section class="about-section"><div class="container about-story"><p class="eyebrow">${t("about.story.eyebrow")}</p><h2>${t("about.story.title")}</h2><p>${t("about.story.para1")}</p><p>${t("about.story.para2")}</p><div class="story-note"><strong>${t("about.story.note_title")}</strong><span>${t("about.story.note_desc")}</span></div></div></section><section class="about-section"><div class="container"><div class="about-section__heading"><p class="eyebrow">${t("about.section_commitments")}</p><h2>${t("about.commitments.title")}</h2></div><div class="about-commitment-grid"><article class="about-commitment"><h3>${t("about.commitment1_title")}</h3><p>${t("about.commitment1_desc")}</p></article><article class="about-commitment"><h3>${t("about.commitment2_title")}</h3><p>${t("about.commitment2_desc")}</p></article><article class="about-commitment"><h3>${t("about.commitment3_title")}</h3><p>${t("about.commitment3_desc")}</p></article></div></div></section><section class="about-contact" id="contact"><div class="container"><div class="about-section__heading"><p class="eyebrow">${t("about.contact.eyebrow")}</p><h2>${t("about.contact.title")}</h2><p>${t("about.contact.lede")}</p></div><div class="contact-grid"><article class="contact-card"><h3>${t("about.contact.direct")}</h3><div class="contact-list"><div class="contact-item"><span>${t("about.contact.phone")}</span><div><strong>${esc(content.site.contact_phone)}</strong></div><button class="copy-button" data-copy="${esc(content.site.contact_phone)}">${t("about.contact.copy")}</button></div><div class="contact-item"><span>${t("about.contact.wechat")}</span><div><strong>${esc(content.site.contact_wechat)}</strong></div><button class="copy-button" data-copy="${esc(content.site.contact_wechat)}">${t("about.contact.copy")}</button></div></div></article><article class="contact-card"><h3>${t("about.contact.follow")}</h3><div class="about-qr"><img src="${esc(content.site.qr_image)}" alt="${t("about.contact.qr_alt")}"></div><p>${t("about.contact.follow_note")}</p></article></div></div></section><section class="cta"><div class="container cta-inner"><h2>${t("about.cta.title")}</h2><p>${t("about.cta.lede")}</p><a class="button button--primary" href="#tools">${t("about.cta.button")}</a></div></section></div>`;
  }

  // ------------------------------------------- Auth card
  // Two ways only: WeChat scan (default) and email. They are switched by the
  // icon in the card's top-right corner (desktop icon <-> QR icon). The card has
  // a stable height so switching never makes the panel jump.
  const AUTH_WAY_KEY = "yykj16_login_way";
  const AUTH_ACCOUNT_KEY = "yykj16_last_account";
  // Set while the "account created -> bind email" screen is on screen so render()
  // does not bounce a freshly created session straight to #account.
  let authRegisterDone = false;
  // Session-only switch state: the register page always opens on the QR, and the
  // sign-in page remembers the last choice.
  let authWaySession = "";
  const authWay = () => {
    if (authWaySession) return authWaySession;
    // The register card always opens on the QR; only sign-in remembers the choice.
    if (route() === "register") return "wechat";
    return storageGet(AUTH_WAY_KEY, "wechat") === "email" ? "email" : "wechat";
  };
  const setAuthWay = (way) => {
    authWaySession = way === "email" ? "email" : "wechat";
    if (route() === "login") storageSet(AUTH_WAY_KEY, authWaySession);
  };
  const authLastAccount = () => storageGet(AUTH_ACCOUNT_KEY, "");
  const rememberAccount = (email) => { if (email) storageSet(AUTH_ACCOUNT_KEY, String(email)); };
  const authConsent = (register) => `<p class="auth-consent">${register ? t("auth.consent_register_lead") : t("auth.consent_lead")} <a href="#terms">《${t("auth.terms_link")}》</a> ${t("auth.consent_and")} <a href="#privacy">《${t("auth.privacy_link")}》</a></p>`;
  const authLastLoginTip = () => {
    const account = authLastAccount();
    if (!account || route() !== "login") return "";
    return `<div class="auth-last-login"><span>${t("auth.last_login", { account: esc(account) })}</span><button class="text-link link-button" type="button" data-auth-switch-account>${t("auth.last_login_switch")}</button></div>`;
  };
  const authExchange = () => {
    const toEmail = authWay() === "wechat";
    const label = toEmail ? t("auth.exchange_to_email") : t("auth.exchange_to_wechat");
    // WeChat view shows the envelope (switch to email); email view shows the QR
    // icon (switch back to scan), matching NetEase's top-right toggle.
    return `<button class="auth-exchange" type="button" data-auth-exchange="${toEmail ? "email" : "wechat"}" aria-label="${esc(label)}" title="${esc(label)}">${icon(toEmail ? "mail" : "qrcode")}</button>`;
  };
  const authLoginTitle = (way) => (way === "wechat" ? t("auth.login_title_wechat") : t("auth.login_title_email"));

  function authQrPanel(register, way) {
    const next = currentReturnPath();
    const inWeChat = inWeChatBrowser();
    let body;
    if (!register && inWeChat) {
      body = `<a class="button button--primary button--full" href="${portalBase}/auth/wechat/start?next=${encodeURIComponent(next)}">${t("auth.wechat_oauth_button")}</a>
        <p class="auth-qr__note">${t("auth.wechat_oauth_note")}</p>`;
    } else {
      body = `<p class="auth-qr__note" data-qr-note>${register ? (inWeChat ? t("auth.wechat_register_lede_wechat") : t("auth.wechat_register_notice")) : t("auth.wechat_qr_notice")}</p>
        <div class="auth-qr__media"><div class="auth-qr__frame" data-qr-code aria-live="polite"></div><button class="auth-qr__expired" type="button" data-qr-expired hidden>${t("auth.qr_expired_overlay")}</button></div>
        <p class="qr-modal__status" data-qr-status aria-live="polite"></p>
        <button class="button button--outline button--small" type="button" data-qr-refresh hidden>${t("auth.wechat_qr_refresh")}</button>`;
    }
    return `<div class="auth-panel" data-auth-panel="wechat"${way === "wechat" ? "" : " hidden"}>
        <div class="auth-qr" data-auth-qr>${body}</div>
        <p class="auth-switch">${register ? t("auth.switch_have") : t("auth.switch_none")}<a href="${register ? "#login" : "#register"}">${register ? t("auth.switch_login") : t("auth.switch_register")}</a></p>
      </div>`;
  }

  function authEmailField(name = "email") {
    return `<label class="field"><input type="email" name="${name}" autocomplete="email" placeholder="${t("auth.email_placeholder")}" aria-label="${esc(t("auth.email_label"))}" required></label>`;
  }

  function authEmailLoginPanel(way) {
    return `<div class="auth-panel" data-auth-panel="email"${way === "email" ? "" : " hidden"}>
        <form class="form-stack" data-auth-form>
          ${authEmailField()}
          <label class="field"><input type="password" name="password" autocomplete="current-password" placeholder="${t("auth.password_placeholder")}" aria-label="${esc(t("auth.password_label"))}" required></label>
          <label class="auth-remember"><input type="checkbox" name="remember" checked>${t("auth.remember_30d")}</label>
          <button class="button button--primary button--full" type="submit">${t("auth.submit_login")}</button>
          <p class="status" data-auth-status aria-live="polite"></p>
        </form>
        <div class="auth-links"><a href="#forgot">${t("auth.forgot_link")}</a><a href="#register">${t("auth.new_user_register")}</a></div>
      </div>`;
  }

  function authEmailRegisterPanel(way) {
    return `<div class="auth-panel" data-auth-panel="email"${way === "email" ? "" : " hidden"}>
        <form class="form-stack" data-auth-form>
          ${authEmailField()}
          <label class="field"><input type="password" name="password" autocomplete="new-password" placeholder="${t("auth.password_placeholder")}" aria-label="${esc(t("auth.password_label"))}" required></label>
          <label class="field"><input type="password" name="password_confirmation" autocomplete="new-password" placeholder="${t("auth.confirm_placeholder")}" aria-label="${esc(t("auth.confirm_label"))}" required></label>
          <button class="button button--primary button--full" type="submit">${t("auth.submit_register")}</button>
          <p class="status" data-auth-status aria-live="polite"></p>
        </form>
        <p class="auth-switch"><a href="#login">${t("auth.login_existing")}</a></p>
      </div>`;
  }

  function authForgotPanel() {
    if (state.resetEmail) {
      const resetForm = `<form class="form-stack" data-reset-form><div class="readonly-item"><span>${t("auth.email_label")}</span><strong>${esc(state.resetEmail)}</strong></div><label class="field"><input name="code" inputmode="numeric" maxlength="6" placeholder="${t("auth.forgot_code_placeholder")}" aria-label="${esc(t("auth.forgot_code_label"))}" required></label><label class="field"><input type="password" name="password" autocomplete="new-password" placeholder="${t("auth.password_placeholder")}" aria-label="${esc(t("auth.forgot_new_password"))}" required></label><label class="field"><input type="password" name="password_confirmation" autocomplete="new-password" placeholder="${t("auth.confirm_placeholder")}" aria-label="${esc(t("auth.confirm_label"))}" required></label><button class="button button--primary button--full" type="submit">${t("auth.forgot_reset")}</button><button class="text-link link-button" type="button" data-reset-resend>${t("auth.forgot_resend")}</button><p class="status" data-reset-status aria-live="polite"></p></form>`;
      return `${resetForm}<p class="auth-switch"><a href="#login">${t("auth.forgot_back")}</a></p>`;
    }
    return `<form class="form-stack" data-auth-form>${authEmailField()}<button class="button button--primary button--full" type="submit">${t("auth.submit_forgot")}</button><p class="status" data-auth-status aria-live="polite"></p></form><p class="auth-switch"><a href="#login">${t("auth.forgot_back")}</a></p>`;
  }

  function auth(mode) {
    const register = mode === "register";
    const forgot = mode === "forgot";
    const wechatReady = Boolean(state.config && (register ? state.config.wechat_register_enabled : state.config.wechat_login_configured));
    const way = authWay();
    // The register card greets the visitor first (ProcessOn's welcome heading);
    // sign-in keeps its short heading.
    const title = forgot
      ? t("auth.forgot_title")
      : register
        ? t("auth.welcome", { brand: content.site.brand || "" })
        : authLoginTitle(way);
    const body = forgot
      ? authForgotPanel()
      : `${authQrPanel(register, way)}${register ? authEmailRegisterPanel(way) : authEmailLoginPanel(way)}`;
    const notice = !forgot && !wechatReady ? `<p class="provider-note">${t("auth.provider_note")}</p>` : "";
    return `<div class="page"><section class="auth-page"><div class="container"><div class="auth-card">${forgot ? "" : authExchange()}<h1>${title}</h1>${authLastLoginTip()}${body}${notice}${forgot ? "" : authConsent(register)}</div></div></section></div>`;
  }

  // Scan-registration done screen: bind an email, or skip. Mirrors ProcessOn's
  // "account created, bind email" gate (skip link + customer-service QR).
  const showRegisterDone = (next) => {
    const card = document.querySelector(".auth-card");
    if (!card) { goToReturnPath(next); return; }
    const target = next || "/#home";
    card.innerHTML = `<span class="auth-done__badge" aria-hidden="true">${icon("badge-check")}</span><h1>${t("auth.bind_title")}</h1><p class="auth-card__lede">${t("auth.bind_lede")}</p>
      <form class="form-stack" data-register-done-form data-next="${esc(target)}">
        ${authEmailField()}
        <div class="field field--inline"><input name="code" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="${t("auth.done_code")}" aria-label="${esc(t("auth.done_code"))}" required><button class="button button--outline button--small" type="button" data-register-done-send>${t("auth.done_send")}</button></div>
        <button class="button button--primary button--full" type="submit">${t("auth.bind_submit")}</button>
        <p class="status" data-register-done-status aria-live="polite"></p>
      </form>
      <div class="auth-bind__bottom"><button class="text-link link-button" type="button" data-register-done-skip>${t("auth.done_skip")}</button><span class="auth-bind__service">${t("auth.support")}<span class="auth-bind__qr"><img src="${esc(content.site.qr_image)}" alt="${esc(t("menu.support_qr_alt"))}"><small>${t("auth.support_hint")}</small></span></span></div>`;
  };

  // Start (or restart) the inline QR for the active auth mode.
  let authQrKey = "";
  let authQrHost = null;
  const initAuthQr = () => {
    if (authRegisterDone) return;
    const host = document.querySelector("[data-auth-qr]");
    if (!host) { authQrKey = ""; authQrHost = null; return; }
    const mode = route();
    if (authWay() !== "wechat" || host.hidden) return;
    const key = `${mode}:wechat`;
    // A re-render (config/session hydration) swaps the DOM nodes; the poll must
    // then restart so it writes into the live card instead of detached nodes.
    if (authQrKey === key && authQrHost === host) return;
    authQrKey = key;
    authQrHost = host;
    const next = currentReturnPath();
    if (mode === "register") startWechatRegister(next);
    else startWechatQrLogin(next);
  };

  const switchAuthWay = (way) => {
    setAuthWay(way);
    const target = authWay();
    document.querySelectorAll("[data-auth-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.authPanel !== target;
    });
    const exchange = document.querySelector("[data-auth-exchange]");
    if (exchange) {
      const toEmail = target === "wechat";
      const label = toEmail ? t("auth.exchange_to_email") : t("auth.exchange_to_wechat");
      exchange.dataset.authExchange = toEmail ? "email" : "wechat";
      exchange.setAttribute("aria-label", label);
      exchange.setAttribute("title", label);
      exchange.innerHTML = icon(toEmail ? "mail" : "qrcode");
    }
    // The heading follows the mode but stays on the same fixed line.
    if (route() === "login") {
      const heading = document.querySelector(".auth-card h1");
      if (heading) heading.textContent = authLoginTitle(target);
    }
    if (target === "wechat") { authQrKey = ""; authQrHost = null; initAuthQr(); }
    else stopQrWatch();
  };


  const verifyPage = () => {
    if (!state.session) {
      return `<div class="page"><section class="auth-page"><div class="container"><div class="auth-card"><p class="eyebrow">${t("auth.eyebrow")}</p><h1>${t("verify.title")}</h1><div class="empty-panel">${t("verify.login_required")}<br><a class="button button--primary button--small" href="#login">${t("header.login")}</a></div></div></div></section></div>`;
    }
    const email = state.session.email || "";
    const body = state.session.email_verified === true
      ? `<div class="empty-panel">${t("verify.done")}<br><a class="button button--primary button--small" href="#account">${t("account.nav_profile")}</a></div>`
      : `<p class="verify-mail"><span>${icon("mail")}${esc(email)}</span></p><form class="form-stack" data-verify-form><label class="field">${t("verify.code_label")}<input name="code" inputmode="numeric" maxlength="6" placeholder="${t("verify.code_placeholder")}" required></label><button class="button button--primary button--full" type="submit">${t("verify.submit")}</button><button class="text-link link-button" type="button" data-verify-resend>${t("verify.resend")}</button><p class="status" data-verify-page-status aria-live="polite"></p></form><p class="auth-switch"><a href="#account">${t("verify.skip")}</a></p>`;
    return `<div class="page"><section class="auth-page"><div class="container"><div class="auth-card auth-card--verify"><span class="verify-badge" aria-hidden="true">${icon("mail")}</span><h1>${t("verify.title")}</h1><p class="auth-card__lede">${t("verify.lede")}</p>${body}</div></div></section></div>`;
  };

  // ------------------------------------------- Account centre v12.
  // One skeleton for every view: a functional page title, the tab bar, then a
  // single full-width sheet, so no view ever changes width. Numbers and account
  // states share one tile grid, and the sheet keeps a fixed minimum height so
  // the footer never jumps between views. The head carries no avatar, name or
  // status pill any more: account states live once, inside the security view.
  const accountViewAlias = (view) => {
    if (view === "settings") return "security";
    if (!view || view === "overview") return "entitlements";
    return ["profile", "security", "entitlements", "orders", "invoices"].includes(view) ? view : "entitlements";
  };

  function account(view = "entitlements") {
    const current = accountViewAlias(view);
    const labels = {
      entitlements: t("account.nav_entitlements"),
      profile: t("account.nav_profile"),
      security: t("account.nav_security"),
      orders: t("account.nav_orders"),
      invoices: t("account.nav_invoices")
    };
    const loading = `<div class="account-loading">${t("account.loading")}</div>`;
    const tab = (key) => `<button type="button" class="ac-tab${key === current ? " is-active" : ""}" data-account-view="${key}" role="tab" aria-selected="${key === current}">${labels[key]}</button>`;
    const closeButton = `<button class="icon-button" type="button" data-security-close aria-label="${t("common.close")}">×</button>`;

    const emailDialog = `<div class="request-modal" data-security-dialog="email" hidden><div class="request-modal__backdrop" data-security-close></div><section class="request-modal__card" role="dialog" aria-modal="true"><div class="request-modal__heading"><div><h2>${t("account.email_action")}</h2><p data-email-current></p></div>${closeButton}</div><form class="form-stack" data-email-bind-card data-email-bind-form hidden><label class="field">${t("account.email_row_title")}<input type="email" name="email" autocomplete="email" placeholder="${esc(t("account.email_bind_placeholder"))}" required></label><div class="field field--inline"><input name="code" inputmode="numeric" maxlength="6" placeholder="${t("account.email_bind_code_placeholder")}" aria-label="${esc(t("account.email_bind_code_placeholder"))}" required><button class="button button--outline button--small" type="button" data-email-bind-send>${t("account.email_bind_send")}</button></div><div class="request-modal__actions request-modal__actions--single"><button class="button button--primary" type="submit">${t("account.email_bind_submit")}</button></div><p class="status" data-email-bind-status aria-live="polite"></p></form><div class="form-stack" data-account-verify hidden><p class="ac-hint">${t("account.verify_lede")}</p><div class="field field--inline"><input data-verify-code inputmode="numeric" maxlength="6" placeholder="${t("account.verify_placeholder")}" aria-label="${esc(t("account.verify_placeholder"))}"><button class="button button--primary button--small" type="button" data-verify-submit>${t("account.verify_submit")}</button></div><button class="text-link link-button" type="button" data-verify-send>${t("account.verify_send")}</button><p class="status" data-verify-status aria-live="polite"></p></div></section></div>`;
    const passwordDialog = `<div class="request-modal" data-security-dialog="password" hidden><div class="request-modal__backdrop" data-security-close></div><section class="request-modal__card" role="dialog" aria-modal="true"><div class="request-modal__heading"><div><h2>${t("account.password_row_title")}</h2></div>${closeButton}</div><form class="form-stack" data-password-form hidden><label class="field">${t("account.password_current")}<input type="password" name="current_password" autocomplete="current-password" required></label><label class="field">${t("account.password_new")}<input type="password" name="new_password" autocomplete="new-password" placeholder="${t("account.password_placeholder")}" required></label><label class="field">${t("account.password_confirm")}<input type="password" name="new_password_confirmation" autocomplete="new-password" required></label><div class="request-modal__actions request-modal__actions--single"><button class="button button--primary" type="submit">${t("account.password_submit")}</button></div><p class="status" data-password-status aria-live="polite"></p></form><form class="form-stack" data-password-setup-card hidden><div class="field field--inline"><input name="code" inputmode="numeric" maxlength="6" placeholder="${t("account.password_setup_code")}" aria-label="${esc(t("account.password_setup_code"))}" required><button class="button button--outline button--small" type="button" data-password-setup-send>${t("account.password_setup_send")}</button></div><label class="field">${t("account.password_setup_new")}<input type="password" name="password" autocomplete="new-password" required></label><div class="request-modal__actions request-modal__actions--single"><button class="button button--primary" type="submit">${t("account.password_setup_submit")}</button></div><p class="status" data-password-setup-status aria-live="polite"></p></form></section></div>`;
    const wechatDialog = `<div class="request-modal" data-security-dialog="wechat" hidden><div class="request-modal__backdrop" data-security-close></div><section class="request-modal__card" role="dialog" aria-modal="true"><div class="request-modal__heading"><div><h2>${t("account.wechat_unbind_button")}</h2><p>${t("account.wechat_unbind_confirm")}</p></div>${closeButton}</div><div class="request-modal__actions"><button class="button button--outline" type="button" data-security-close>${t("common.cancel")}</button><button class="button button--primary" type="button" data-wechat-unbind-confirm>${t("account.wechat_unbind_button")}</button></div><p class="status" data-wechat-unbind-status aria-live="polite"></p></section></div>`;

    // One row holds the avatar (with its centred button) and the name field as a
    // single group; the save action gets its own line under that group.
    const profilePanel = `<div class="ac-grid"><section class="ac-panel"><h3>${t("account.profile_avatar_section")}</h3><form class="account-form" data-profile-form><div class="ac-profile"><div class="ac-profile__avatar"><span class="ac-avatar-lg" data-account-profile-avatar aria-hidden="true"></span><label class="button button--outline button--small">${t("account.avatar_change")}<input type="file" accept="image/png,image/jpeg,image/webp" data-avatar-input hidden></label><span class="ac-hint">${t("account.avatar_hint")}</span></div><label class="field">${t("account.profile_display_name")}<input name="display_name" value="${esc(state.profile)}" maxlength="64" aria-label="${esc(t("account.profile_display_name"))}" required></label></div><div class="account-actions"><button class="button button--primary button--small" type="submit">${t("account.profile_save")}</button><p class="status" data-profile-status aria-live="polite"></p><p class="status" data-avatar-status aria-live="polite"></p></div></form></section><section class="ac-panel"><h3>${t("account.profile_info_section")}</h3><dl class="ac-kv"><div><dt>${t("account.info_login_way")}</dt><dd data-account-login-way></dd></div><div><dt>${t("account.profile_email")}</dt><dd data-profile-email></dd></div><div><dt>${t("profile.joined")}</dt><dd data-account-joined></dd></div></dl><a class="ac-inline-link ac-panel__link" href="#account/security">${t("account.email_manage_link")}</a></section></div>`;

    const securityPanel = `<div class="ac-grid ac-grid--3"><section class="ac-bind"><div class="ac-bind__head"><span class="account-dot" data-security-dot="email"></span><strong>${t("account.email_row_title")}</strong><span class="ac-bind__state" data-security-state="email"></span></div><p class="ac-bind__value" data-security-email>${t("account.email_reading")}</p><button class="button button--outline button--small" type="button" data-security-open="email">${t("account.email_action")}</button></section><section class="ac-bind"><div class="ac-bind__head"><span class="account-dot" data-security-dot="wechat"></span><strong>${t("account.wechat_row_title")}</strong><span class="ac-bind__state" data-security-state="wechat"></span></div><p class="ac-bind__value" data-wechat-bind-state>${t("account.wechat_bind_lede")}</p><div class="ac-bind__actions"><button class="button button--outline button--small" type="button" data-wechat-bind>${t("account.wechat_bind_button")}</button><button class="button button--outline button--small" type="button" data-wechat-unbind hidden>${t("account.wechat_unbind_button")}</button></div></section><section class="ac-bind"><div class="ac-bind__head"><span class="account-dot" data-security-dot="password"></span><strong>${t("account.password_row_title")}</strong><span class="ac-bind__state" data-security-state="password"></span></div><p class="ac-bind__value">${t("account.password_hint")}</p><button class="button button--outline button--small" type="button" data-security-open="password">${t("account.password_action")}</button></section></div><section class="ac-danger"><div class="ac-danger__text"><strong>${t("account.deactivate_title")}</strong><p>${t("account.deactivate_lede")}</p></div><button class="button button--outline button--small" type="button" data-account-deactivate>${t("account.deactivate_button")}</button></section>${emailDialog}${passwordDialog}${wechatDialog}`;

    const entitlementsPanel = `<div class="ac-split"><aside class="ac-split__aside"><section class="ac-rail" data-account-vip>${loading}</section><section class="ac-rail" data-account-coupons>${loading}</section><div class="ac-rail__stats"><div class="ac-mini"><strong data-account-count="orders">--</strong><span>${t("account.stat_orders")}</span></div><div class="ac-mini"><strong data-account-count="entitlements">--</strong><span>${t("account.stat_entitlements")}</span></div><div class="ac-mini"><strong data-account-count="coupons">--</strong><span>${t("account.stat_coupons")}</span></div><div class="ac-mini"><strong data-account-count="sites">--</strong><span>${t("account.sites_count")}</span></div></div></aside><section class="ac-split__main"><h3 class="ac-subhead">${t("account.entitlements_table_feature")}</h3><div data-account-entitlements>${loading}</div><section class="ac-sites"><h3>${t("account.sites_title")}</h3><p class="ac-hint">${t("account.sites_hint")}</p><div class="ac-sites__list" data-account-sites>${loading}</div></section></section></div>`;

    const ordersPanel = `<div data-account-orders>${loading}</div>`;

    const invoicesPanel = `<div data-account-invoices>${loading}</div><form class="account-form invoice-form" data-invoice-form hidden><h3>${t("account.invoice_form_title")}</h3><div class="invoice-form__grid"><label class="field">${t("account.invoice_order")}<select name="biz_order_no" required><option value="">${t("account.invoice_order_placeholder")}</option></select></label><label class="field">${t("account.invoice_type")}<select name="invoice_type"><option value="company">${t("account.invoice_type_company")}</option><option value="personal">${t("account.invoice_type_personal")}</option></select></label><label class="field">${t("account.invoice_title")}<input name="title" maxlength="200" required></label><label class="field">${t("account.invoice_tax_no")}<input name="tax_no" maxlength="40"></label><label class="field">${t("account.invoice_email")}<input type="email" name="email" maxlength="254"></label></div><div class="account-actions"><button class="button button--primary" type="submit">${t("account.invoice_submit")}</button><p class="status" data-invoice-status aria-live="polite"></p></div></form>`;

    const panels = { entitlements: entitlementsPanel, profile: profilePanel, security: securityPanel, orders: ordersPanel, invoices: invoicesPanel };

    return `<div class="page page--account"><section class="account-page"><div class="container"><nav class="ac-tabs" role="tablist" aria-label="${t("account.nav_aria")}">${["entitlements", "profile", "security", "orders", "invoices"].map(tab).join("")}</nav><main class="account-paper">${panels[current]}</main></div></section></div>`;
  }

  const renderAccountError = (error) => {
    const panel = document.querySelector(".account-paper");
    if (!panel) return;
    if (error?.status === 401) panel.innerHTML = `<div class="empty-panel">${t("account.error_unauthorized")}<br><a class="button button--primary button--small" href="#login">${t("header.login")}</a></div>`;
    else panel.innerHTML = `<div class="empty-panel">${t("account.error_load")}<br><button class="text-link link-button" type="button" data-account-retry>${t("common.reload")}</button></div>`;
  };

  // Static map: the publisher scans literal t() keys, so building a key by
  // concatenation would be reported as a missing copy entry.
  const refundStatusLabel = (status) => ({
    requested: t("account.refund_status_requested"),
    approved: t("account.refund_status_approved"),
    refunded: t("account.refund_status_refunded"),
    rejected: t("account.refund_status_rejected"),
    canceled: t("account.refund_status_canceled")
  }[status] || status);

  const renderOrders = (orders, refunds = []) => {
    const target = document.querySelector("[data-account-orders]");
    if (!target) return;
    if (!orders.length) { target.innerHTML = `<div class="empty-panel">${t("account.orders_empty")}<br><a class="text-link" href="#pricing">${t("account.orders_empty_link")}</a></div>`; return; }
    const byOrder = new Map();
    refunds.forEach((refund) => { if (!byOrder.has(refund.biz_order_no)) byOrder.set(refund.biz_order_no, refund); });
    target.innerHTML = `<div class="table-wrap"><table><thead><tr><th>${t("account.orders_table_no")}</th><th>${t("account.orders_table_amount")}</th><th>${t("account.orders_table_status")}</th><th>${t("account.orders_table_created")}</th><th>${t("account.orders_table_action")}</th></tr></thead><tbody>${orders.map((order) => {
      const resumable = ["pending", "created", "unpaid"].includes(order.status);
      const refund = byOrder.get(order.biz_order_no);
      let action = "—";
      if (resumable) action = `<button class="button button--outline button--small" type="button" data-order-pay="${esc(order.biz_order_no)}">${t("account.order_pay")}</button><button class="text-link link-button" type="button" data-order-reconcile="${esc(order.biz_order_no)}">${t("account.order_reconcile")}</button>`;
      else if (order.status === "paid" && !refund) action = `<button class="button button--outline button--small" type="button" data-refund-apply="${esc(order.biz_order_no)}" data-refund-amount="${esc(order.amount_cents)}">${t("account.refund_apply")}</button>`;
      else if (refund) {
        const label = refundStatusLabel(refund.status);
        const cancel = refund.status === "requested" ? `<button class="text-link link-button" type="button" data-refund-cancel="${esc(refund.refund_id)}">${t("account.refund_cancel")}</button>` : "";
        action = `<span class="refund-state">${esc(label)}</span>${cancel}`;
      }
      return `<tr><td>${esc(order.biz_order_no)}</td><td>${moneyCents(order.amount_cents, order.currency)}</td><td>${esc(content.labels.orderStatus[order.status] || order.status)}</td><td>${esc(String(order.created_at || "").replace("T", " ").slice(0, 19))}</td><td class="order-actions">${action}</td></tr>`;
    }).join("")}</tbody></table></div>`;
  };

  const renderEntitlements = (entitlements) => {
    const target = document.querySelector("[data-account-entitlements]");
    if (!target) return;
    if (!entitlements.length) { target.innerHTML = `<div class="empty-panel">${t("account.entitlements_empty")}<br><a class="text-link" href="#pricing">${t("account.entitlements_empty_link")}</a></div>`; return; }
    target.innerHTML = `<div class="table-wrap"><table><thead><tr><th>${t("account.entitlements_table_feature")}</th><th>${t("account.entitlements_table_status")}</th><th>${t("account.entitlements_table_period")}</th><th>${t("account.entitlements_table_quota")}</th></tr></thead><tbody>${entitlements.map((item) => `<tr><td>${esc(item.feature_code)}</td><td>${esc(item.status)}</td><td>${esc(item.end_at ? item.end_at.replace("T", " ").slice(0, 19) : t("account.entitlements_by_count"))}</td><td>${item.remaining_quota == null ? t("account.entitlements_unlimited") : esc(item.remaining_quota)}</td></tr>`).join("")}</tbody></table></div>`;
  };

  const renderCoupons = (coupons) => {
    const box = document.querySelector("[data-account-coupons]");
    if (!box) return;
    const active = coupons.filter((item) => item.status === "unused");
    const toolName = (code) => (code === "all" ? t("coupon.tool_all") : (tool(code) ? tool(code).name : code));
    const list = active.slice(0, 6).map((item) => `<p class="ac-coupon"><span>${esc(toolName(item.tool_code))}${item.channel ? ` · ${esc(item.channel)}` : ""}</span><small>${t("coupon.quota_times", { count: Number(item.quota || 1) })} · ${esc(String(item.expires_at || "").slice(0, 10))}</small></p>`).join("");
    box.innerHTML = `<div class="ac-rail__head"><strong>${t("account.coupon_title")}</strong><span>${active.length}</span></div>${list || `<p class="ac-hint">${t("account.coupon_empty")}</p>`}<form class="ac-coupon-claim" data-coupon-claim-form><input name="code" maxlength="64" placeholder="${esc(t("account.coupon_claim_placeholder"))}" aria-label="${esc(t("account.coupon_claim_placeholder"))}"><button class="button button--outline button--small" type="submit">${t("account.coupon_claim")}</button></form><a class="ac-rail__link" href="#pricing">${t("account.coupon_use")}</a>`;
  };

  const renderInvoices = (invoices, orders) => {
    const target = document.querySelector("[data-account-invoices]");
    if (target) target.innerHTML = invoices.length ? `<div class="table-wrap"><table><thead><tr><th>${t("account.invoices_table_no")}</th><th>${t("account.invoices_table_order")}</th><th>${t("account.invoices_table_amount")}</th><th>${t("account.invoices_table_status")}</th></tr></thead><tbody>${invoices.map((item) => `<tr><td>${esc(item.invoice_id)}</td><td>${esc(item.biz_order_no)}</td><td>${moneyCents(item.amount_cents)}</td><td>${esc(content.labels.invoiceStatus[item.status] || item.status)}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty-panel">${t("account.invoices_empty")}</div>`;
    const form = document.querySelector("[data-invoice-form]");
    const paidOrders = orders.filter((order) => order.status === "paid");
    if (form && paidOrders.length) {
      form.hidden = false;
      const select = form.querySelector('select[name="biz_order_no"]');
      select.innerHTML = `<option value="">${t("account.invoice_order_placeholder")}</option>` + paidOrders.map((order) => `<option value="${esc(order.biz_order_no)}">${esc(order.biz_order_no)} · ${moneyCents(order.amount_cents, order.currency)}</option>`).join("");
    }
  };

  // Registered sites: show the four-boundary range plus usage count, removable.
  const siteNum = (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return "--";
    return Math.abs(number) >= 1000 ? number.toFixed(0) : number.toFixed(2).replace(/\.?0+$/, "");
  };
  const renderSites = (sites) => {
    const box = document.querySelector("[data-account-sites]");
    if (!box) return;
    if (!sites.length) {
      box.innerHTML = `<p class="ac-sites__empty">${t("account.sites_empty")}</p>`;
      return;
    }
    box.innerHTML = sites.map((site) => {
      const bounds = Array.isArray(site.bounds) ? site.bounds : [];
      const range = bounds.length === 4 ? `${siteNum(bounds[0])}, ${siteNum(bounds[1])} → ${siteNum(bounds[2])}, ${siteNum(bounds[3])}` : "--";
      const label = String(site.label || "").trim() || t("account.sites_unnamed");
      return `<div class="ac-site"><span class="ac-site__name">${esc(label)}</span><span class="ac-site__bounds" title="${esc(t("account.sites_bounds"))}">${esc(range)}</span><span class="ac-site__meta">${esc(t("account.sites_used", { count: site.hit_count || 1 }))}</span><button class="button button--outline button--small" type="button" data-site-remove="${esc(site.site_id)}">${t("account.sites_remove")}</button></div>`;
    }).join("");
  };

  const renderAccountCards = (membership, sites = []) => {
    renderSites(sites);
    const vip = document.querySelector("[data-account-vip]");
    if (vip) {
      const active = Boolean(membership && membership.active);
      const until = active && membership.end_at ? String(membership.end_at).slice(0, 10) : "";
      const status = active ? t("account.vip_active", { date: until }) : t("account.vip_inactive");
      vip.innerHTML = `<div class="ac-rail__head"><strong>${t("account.vip_title")}</strong><span>${esc(status)}</span></div><a class="ac-rail__link" href="#pricing">${active ? t("account.vip_action_renew") : t("account.vip_action_open")}</a>`;
    }
    const couponBox = document.querySelector("[data-account-coupons]");
    if (couponBox) renderCoupons(state.coupons || []);
  };

  const hydrateAccount = async (view) => {
    const current = accountViewAlias(view);
    try {
      const [profileResult, ordersResult, entitlementResult, invoiceResult, membershipResult, couponResult, refundResult, sitesResult] = await Promise.all([apiRequest("/api/me/profile"), apiRequest("/api/orders"), apiRequest("/api/me/entitlements"), apiRequest("/api/invoices"), apiRequest("/api/me/membership").catch(() => null), apiRequest("/api/me/coupons").catch(() => ({ coupons: [] })), apiRequest("/api/me/refunds").catch(() => ({ refunds: [] })), apiRequest("/api/me/sites").catch(() => ({ sites: [] }))]);
      const profile = profileResult.profile || {};
      state.profile = profile.display_name || profile.email || state.profile;
      storageSet("yykj16_display_name", state.profile);
      // After a profile change, refresh the form input and the header name too
      // (otherwise they keep the stale value captured at sign-in).
      const profileInput = document.querySelector('[data-profile-form] input[name="display_name"]');
      if (profileInput && document.activeElement !== profileInput) {
        profileInput.value = state.profile;
      }
      document.querySelectorAll("[data-account-name]").forEach((box) => {
        box.textContent = state.profile;
      });
      const picture = String((state.session && state.session.picture) || "");
      const avatarSrc = picture ? `${portalBase}/api/me/avatar?v=${encodeURIComponent(picture.slice(-24))}` : "";
      const fillAvatar = (box) => {
        box.innerHTML = avatarSrc ? `<img src="${avatarSrc}" alt="">` : esc(state.profile.slice(0, 1).toUpperCase());
      };
      document.querySelectorAll("[data-account-avatar], [data-account-profile-avatar]").forEach(fillAvatar);
      document.querySelectorAll("[data-account-avatar-hero]").forEach((box) => {
        box.innerHTML = picture ? `<img src="${portalBase}/api/me/avatar" alt="">` : esc(state.profile.slice(0, 1).toUpperCase());
      });
      document.querySelectorAll("[data-account-name-hero]").forEach((box) => { box.textContent = state.profile; });
      const heroEmail = document.querySelector("[data-account-email-hero]");
      if (heroEmail) {
        heroEmail.textContent = state.session && state.session.auth_provider === "wechat"
          ? t("account.chip_wechat")
          : (profile.email || t("account.email_fallback"));
      }
      const heroJoined = document.querySelector("[data-account-joined-hero]");
      if (heroJoined) {
        const joined = String(profile.joined_at || "").slice(0, 10);
        heroJoined.textContent = joined ? `${t("profile.joined")} ${joined}` : "";
      }
      const joinedBox = document.querySelector("[data-account-joined]");
      if (joinedBox) {
        const joined = String(profile.joined_at || "").slice(0, 10);
        joinedBox.textContent = joined;
      }
      const setState = (key, text, tone) => {
        const short = tone.replace("is-", "");
        document.querySelectorAll(`[data-security-state="${key}"]`).forEach((node) => {
          node.textContent = text;
          node.dataset.tone = short;
        });
        document.querySelectorAll(`[data-security-dot="${key}"]`).forEach((dot) => {
          dot.className = `account-dot ${tone}`;
        });
      };
      setState(
        "email",
        profile.needs_email ? t("account.state_unverified") : t("account.state_verified"),
        profile.needs_email ? "is-warn" : "is-on"
      );
      setState(
        "wechat",
        profile.wechat_bound ? t("account.state_bound") : t("account.state_unbound"),
        profile.wechat_bound ? "is-on" : "is-off"
      );
      const hasPasswordNow = profile.has_password !== false;
      setState(
        "password",
        hasPasswordNow ? t("account.state_set") : t("account.state_unset"),
        hasPasswordNow ? "is-on" : "is-off"
      );
      const emailValue = profile.wechat_bound && (!profile.email || String(profile.email).endsWith("@wechat.local"))
        ? t("account.wechat_account")
        : (profile.email || t("account.email_fallback"));
      const securityEmail = document.querySelector("[data-security-email]");
      if (securityEmail) securityEmail.textContent = emailValue;
      const dialogEmail = document.querySelector("[data-email-current]");
      if (dialogEmail) dialogEmail.textContent = emailValue;
      const email = document.querySelector("[data-profile-email]");
      if (email) email.textContent = profile.email || t("account.email_fallback");
      const loginWay = document.querySelector("[data-account-login-way]");
      if (loginWay) {
        loginWay.textContent = state.session && state.session.auth_provider === "wechat"
          ? t("account.info_login_wechat")
          : t("account.info_login_email");
      }
      state.profileHasPassword = profile.has_password !== false;
      // With a password show the change form, without one show the setup form:
      // either way the dialog is never empty.
      const passwordCard = document.querySelector("[data-password-form]");
      if (passwordCard) passwordCard.hidden = !state.profileHasPassword;
      const setupCard = document.querySelector("[data-password-setup-card]");
      if (setupCard) setupCard.hidden = state.profileHasPassword;
      const securityPasswordAction = document.querySelector('[data-security-open="password"]');
      if (securityPasswordAction) {
        securityPasswordAction.textContent = state.profileHasPassword ? t("account.password_change_action") : t("account.password_setup_action");
      }
      const unbindButton = document.querySelector("[data-wechat-unbind]");
      if (unbindButton) unbindButton.hidden = !profile.wechat_bound;
      const bindButtonNode = document.querySelector("[data-wechat-bind]");
      if (bindButtonNode) bindButtonNode.hidden = Boolean(profile.wechat_bound);
      const emailCard = document.querySelector("[data-email-bind-card]");
      const sessionSub = String((state.session && state.session.sub) || "");
      const showVerifyBlock = sessionSub.startsWith("local-") && state.session.email_verified === false && !profile.needs_email;
      if (emailCard) emailCard.hidden = showVerifyBlock;
      const bindState = document.querySelector("[data-wechat-bind-state]");
      const bindButton = document.querySelector("[data-wechat-bind]");
      if (bindState) bindState.textContent = profile.wechat_bound ? t("account.wechat_bind_note") : t("account.wechat_bind_lede");
      if (bindButton) {
        bindButton.disabled = Boolean(profile.wechat_bound);
        bindButton.textContent = profile.wechat_bound ? t("account.wechat_bind_bound") : t("account.wechat_bind_button");
      }
      const orders = Array.isArray(ordersResult.orders) ? ordersResult.orders : [];
      const entitlements = Array.isArray(entitlementResult.entitlements) ? entitlementResult.entitlements : [];
      const invoices = Array.isArray(invoiceResult.invoices) ? invoiceResult.invoices : [];
      const refunds = Array.isArray(refundResult && refundResult.refunds) ? refundResult.refunds : [];
      const coupons = Array.isArray(couponResult && couponResult.coupons) ? couponResult.coupons : [];
      state.coupons = coupons;
      const setCount = (key, value) => {
        document.querySelectorAll(`[data-account-count="${key}"]`).forEach((node) => {
          node.replaceChildren(document.createTextNode(String(value)));
        });
      };
      setCount("orders", orders.length);
      setCount("entitlements", entitlements.filter((item) => item.status === "active" || item.status === "pending").length);
      setCount("coupons", coupons.filter((item) => item.status === "unused").length);
      if (current === "orders") renderOrders(orders, refunds);
      if (current === "entitlements") renderEntitlements(entitlements);
      if (current === "invoices") renderInvoices(invoices, orders);
      const sites = Array.isArray(sitesResult.sites) ? sitesResult.sites : [];
      renderAccountCards(membershipResult, sites);
      setCount("sites", sites.length);
      const verifyBox = document.querySelector("[data-account-verify]");
      if (verifyBox) verifyBox.hidden = !showVerifyBlock;
      return { profile, orders, entitlements, invoices };
    } catch (error) { renderAccountError(error); return null; }
  };

  const purchasePlan = async (value, options = {}) => {
    const [productCode, planCode] = String(value || "").split("|");
    if (!productCode || !planCode) return;
    if (purchaseInFlight) {
      showToast(t("toast.order_creating"));
      return;
    }
    const attemptKey = `${productCode}|${planCode}`;
    let idempotencyKey = purchaseAttempts.get(attemptKey);
    if (!idempotencyKey) {
      const randomPart = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      idempotencyKey = `v16-${productCode}-${planCode}-${randomPart}`;
      purchaseAttempts.set(attemptKey, idempotencyKey);
    }
    purchaseInFlight = true;
    try {
      const order = options.creditSource
        ? await apiRequest("/api/orders/credit", { method: "POST", headers: { "Idempotency-Key": idempotencyKey }, body: JSON.stringify({ product_code: productCode, plan_code: planCode, credit_source: options.creditSource }) })
        : await apiRequest("/api/orders", { method: "POST", headers: { "Idempotency-Key": idempotencyKey }, body: JSON.stringify({ product_code: productCode, plan_code: planCode }) });
      if (order && order.status === "paid") {
        // The credit already covers the full price (zero top-up): the backend
        // returns a paid order, matching the redemption semantics.
        purchaseAttempts.delete(attemptKey);
        showToast(t("pricing.redeem_done"));
        if (options.inPlaceSlug) { renderPurchaseSuccess(options.inPlaceSlug, true); return; }
        window.location.hash = "#account/orders";
        return;
      }
      await startCheckout(order, options);
      purchaseAttempts.delete(attemptKey);
    } catch (error) {
      if (error.status === 401) window.location.hash = "#login";
      else showToast(error.message || t("toast.order_failed"));
    } finally {
      purchaseInFlight = false;
    }
  };

  const resumeOrderPayment = async (orderNo) => {
    if (!orderNo || purchaseInFlight) { if (purchaseInFlight) showToast(t("toast.order_busy")); return; }
    purchaseInFlight = true;
    try {
      const order = await apiRequest(`/api/orders/${encodeURIComponent(orderNo)}`);
      await startCheckout(order, {});
    } catch (error) {
      if (error.status === 401) window.location.hash = "#login";
      else if (error.status === 503) showToast(t("toast.pay_no_channel"));
      else showToast(error.message || t("toast.pay_failed"));
    } finally { purchaseInFlight = false; }
  };

  const activityAgo = (createdAt) => {
    const stamp = Date.parse(String(createdAt || ""));
    if (!Number.isFinite(stamp)) return t("detail.activity_ticker_now");
    const minutes = Math.max(0, Math.round((Date.now() - stamp) / 60000));
    if (minutes < 1) return t("detail.activity_ticker_now");
    if (minutes < 60) return t("detail.activity_ticker_minutes", { count: minutes });
    const hours = Math.round(minutes / 60);
    if (hours < 24) return t("detail.activity_ticker_hours", { count: hours });
    return t("detail.activity_ticker_days", { count: Math.max(1, Math.round(hours / 24)) });
  };

  const hydrateToolActivity = async (toolCode) => {
    const node = document.querySelector(`[data-tool-activity="${CSS.escape(toolCode)}"]`);
    if (!node) return;
    try {
      const activity = await apiRequest(`/api/tools/${encodeURIComponent(toolCode)}/activity`);
      // /api/tools/<code>/activity returns recent newest-first.
      const latest = (activity.recent || [])[0];
      node.innerHTML = `<span>${t("detail.activity_total", { count: activity.total_runs || 0 })}</span><span>${t("detail.activity_done", { count: activity.covered_runs || 0 })}</span>${latest ? `<small>${activityAgo(latest.created_at)}</small>` : ""}`;
    } catch {
      node.textContent = "";
    }
  };

  const hydrateToolFeedback = async (toolCode) => {
    try {
      const payload = await apiRequest(`/api/tools/${encodeURIComponent(toolCode)}/feedback`);
      state.toolFeedback = (payload && payload.feedback) || [];
      state.toolFeedbackEligibility = (payload && payload.eligibility) || null;
    } catch {
      state.toolFeedback = [];
      state.toolFeedbackEligibility = { login_required: false, eligible: false, runs: 0 };
    }
    if (state.toolTab === "feedback") {
      const panel = document.querySelector(`[data-tool-feedback-panel="${CSS.escape(toolCode)}"]`);
      const item = routeTool();
      if (panel && item) panel.innerHTML = feedbackPanelHtml(item, state.toolFeedback, state.toolFeedbackEligibility);
    }
  };

  const accountOrigin = () => encodeURIComponent(window.location.origin);
  const logoutUrl = () => {
    const suffix = window.location.origin === portalBase ? "" : `&origin=${accountOrigin()}`;
    return `${portalBase}/auth/logout?next=/${suffix}`;
  };
  const syncProfileName = (name) => {
    if (state.session) state.session.name = name;
    const headerName = document.querySelector("[data-account-name]");
    if (headerName) headerName.textContent = name;
    const headerAvatar = document.querySelector("[data-account-avatar]");
    if (headerAvatar) headerAvatar.textContent = String(name || "").slice(0, 1).toUpperCase();
    document.querySelectorAll("[data-account-title]").forEach((box) => { box.textContent = name; });
    document.querySelectorAll("[data-account-hero-avatar]").forEach((box) => {
      box.textContent = String(name || "").slice(0, 1).toUpperCase();
    });
    const identity = document.querySelector(".account-user");
    if (!identity) return;
    const avatar = identity.querySelector(".avatar");
    if (avatar) avatar.textContent = name.slice(0, 1);
    const strong = identity.querySelector("strong");
    if (strong) strong.textContent = name;
  };
  let verifyBarDismissed = false;
  const needsEmailVerification = () => Boolean(
    state.session
    && String(state.session.sub || "").startsWith("local-")
    && state.session.email_verified === false
    && !String(state.session.email || "").endsWith("@wechat.local")
    && state.config
    && state.config.smtp_configured
  );
  const syncVerifyBar = () => {
    const bar = document.querySelector("[data-verify-bar]");
    if (!bar) return;
    bar.hidden = !(needsEmailVerification() && !verifyBarDismissed);
  };

  // Progressive login challenge: the block is created only when the server
  // answers 428 after repeated failures, so normal sign-in stays one step.
  const showAuthCaptcha = (question) => {
    const form = document.querySelector("[data-auth-form]");
    if (!form) return;
    let box = form.querySelector("[data-auth-captcha]");
    if (!box) {
      box = document.createElement("div");
      box.className = "auth-captcha";
      box.setAttribute("data-auth-captcha", "");
      box.innerHTML = "<span data-captcha-question></span><input name=\"captcha_answer\" inputmode=\"numeric\" autocomplete=\"off\"><small></small>";
      const submit = form.querySelector('button[type="submit"]');
      if (submit) form.insertBefore(box, submit);
      else form.append(box);
    }
    const label = box.querySelector("[data-captcha-question]");
    const hint = box.querySelector("small");
    const input = box.querySelector("input");
    if (label) label.textContent = question || "";
    if (hint) hint.textContent = t("auth.captcha_help");
    if (input) {
      input.placeholder = t("auth.captcha_placeholder");
      input.focus();
    }
    box.hidden = false;
  };

  const hydrateConfig = async () => {
    try {
      state.config = await apiRequest("/api/config");
    } catch {
      state.config = null;
    }
    syncVerifyBar();
    if (route() === "login" || route() === "register") render();
  };

  // ------------------------------------------- Header account menu (ProcessOn-style)
  // Logged out: sign-in / sign-up buttons. Logged in: avatar + name opens the
  // account dropdown (account centre, profile, orders, invoices, settings,
  // support, sign out).
  let accountMenuDismiss = null;
  let accountMenuKeydown = null;
  const accountMenuParts = () => {
    const host = document.querySelector("[data-header-account]");
    if (!host) return null;
    return {
      host,
      trigger: host.querySelector("[data-account-trigger]"),
      menu: host.querySelector("[data-account-menu]")
    };
  };
  const accountMenuName = () => {
    const session = state.session || {};
    return session.name || session.preferred_username || session.email || session.sub || "";
  };
  const closeAccountMenu = () => {
    const parts = accountMenuParts();
    if (accountMenuDismiss) { document.removeEventListener("click", accountMenuDismiss, true); accountMenuDismiss = null; }
    if (accountMenuKeydown) { document.removeEventListener("keydown", accountMenuKeydown, true); accountMenuKeydown = null; }
    if (!parts || !parts.menu || parts.menu.hidden) return;
    parts.menu.hidden = true;
    if (parts.trigger) parts.trigger.setAttribute("aria-expanded", "false");
  };
  const openAccountMenu = () => {
    const parts = accountMenuParts();
    if (!parts || !parts.menu || !parts.trigger || !parts.menu.innerHTML.trim()) return;
    parts.menu.hidden = false;
    parts.trigger.setAttribute("aria-expanded", "true");
    accountMenuDismiss = (event) => { if (!parts.host.contains(event.target)) closeAccountMenu(); };
    document.addEventListener("click", accountMenuDismiss, true);
    accountMenuKeydown = (event) => {
      if (event.key === "Escape") { event.preventDefault(); closeAccountMenu(); parts.trigger.focus(); return; }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      const items = [...parts.menu.querySelectorAll(".account-menu__item")];
      if (!items.length) return;
      event.preventDefault();
      const index = items.indexOf(document.activeElement);
      const step = event.key === "ArrowDown" ? 1 : -1;
      const next = index === -1 ? 0 : (index + step + items.length) % items.length;
      items[next].focus();
    };
    document.addEventListener("keydown", accountMenuKeydown, true);
  };
  const toggleAccountMenu = () => {
    const parts = accountMenuParts();
    if (!parts || !parts.menu) return;
    if (parts.menu.hidden) openAccountMenu();
    else closeAccountMenu();
  };
  // Item order mirrors ProcessOn's avatar menu: my tools -> account centre /
  // orders / support -> sign out.
  const accountMenuHtml = () => {
    const item = (href, iconName, label, extra = "") =>
      `<a class="account-menu__item" role="menuitem" href="${esc(href)}"${extra}>${icon(iconName)}<span>${esc(label)}</span></a>`;
    return [
      item("#account/entitlements", "grid", t("menu.tools")),
      `<div class="account-menu__separator" role="separator"></div>`,
      item("#account", "user", t("menu.account")),
      item("#account/orders", "wallet", t("menu.orders")),
      `<div class="account-menu__separator" role="separator"></div>`,
      `<div class="account-menu__item account-menu__item--support" role="menuitem" tabindex="0">${icon("mail")}<span>${esc(t("menu.support"))}</span><div class="account-menu__qr"><img src="${esc(content.site.qr_image)}" alt="${esc(t("menu.support_qr_alt"))}"><small>${esc(t("menu.support_hint"))}</small></div></div>`,
      `<div class="account-menu__separator" role="separator"></div>`,
      `<a class="account-menu__item account-menu__item--logout" role="menuitem" href="${esc(logoutUrl())}"><span>${esc(t("menu.logout"))}</span></a>`
    ].join("");
  };

  const syncHeaderAuth = () => {
    const parts = accountMenuParts();
    const drawerAccount = document.querySelector("[data-drawer-account]");
    const drawerLogin = document.querySelector("[data-drawer-login]");
    if (!parts || !parts.trigger || !parts.menu) return;
    if (state.session) {
      const name = accountMenuName();
      parts.host.classList.add("is-authed");
      parts.trigger.className = "header-account__trigger";
      parts.trigger.setAttribute("href", "#account");
      parts.trigger.setAttribute("aria-haspopup", "menu");
      parts.trigger.setAttribute("aria-expanded", "false");
      parts.trigger.setAttribute("aria-label", t("menu.aria"));
      const picture = String((state.session && state.session.picture) || "");
      parts.trigger.innerHTML = `<span class="header-account__avatar" data-account-avatar>${picture ? `<img src="${portalBase}/api/me/avatar" alt="">` : esc(name.slice(0, 1).toUpperCase())}</span><span class="header-account__name" data-account-name>${esc(name)}</span>${icon("arrow-up", t("menu.open"))}`;
      parts.menu.innerHTML = accountMenuHtml();
      if (drawerAccount) drawerAccount.hidden = false;
      if (drawerLogin) drawerLogin.hidden = true;
      return;
    }
    closeAccountMenu();
    parts.host.classList.remove("is-authed");
    parts.trigger.className = "header-login";
    parts.trigger.innerHTML = t("header.login");
    parts.trigger.setAttribute("href", "#login");
    parts.trigger.removeAttribute("aria-haspopup");
    parts.trigger.removeAttribute("aria-expanded");
    parts.trigger.removeAttribute("aria-label");
    parts.menu.innerHTML = "";
    parts.menu.hidden = true;
    if (drawerAccount) drawerAccount.hidden = true;
    if (drawerLogin) drawerLogin.hidden = false;
  };

  const hydrateSession = async () => {
    try {
      const payload = await apiRequest("/api/auth/session");
      state.session = payload.user || null;
    } catch {
      state.session = null;
    }
    state.toolAccess = {};
    syncVerifyBar();
    syncHeaderAuth();
    if (route() === "pricing" || routeTool() || route() === "login" || route() === "register") render();
  };

  // Server-side events (verification in another tab, password change,
  // deactivation) must reconcile with the open page, not only after reload.
  let lastSessionRefresh = 0;
  const refreshSession = async () => {
    const now = Date.now();
    if (now - lastSessionRefresh < 4000) return;
    lastSessionRefresh = now;
    const previous = state.session;
    try {
      const payload = await apiRequest("/api/auth/session");
      state.session = payload.user || null;
    } catch {
      state.session = null;
    }
    state.toolAccess = {};
    syncVerifyBar();
    syncHeaderAuth();
    const changed = Boolean(previous?.sub) !== Boolean(state.session?.sub)
      || Boolean(state.session && previous && (
        previous.email_verified !== state.session.email_verified
        || previous.name !== state.session.name
        || previous.preferred_username !== state.session.preferred_username
      ));
    if (changed && (route().startsWith("account") || route() === "verify" || routeTool())) render();
  };
  window.addEventListener("focus", () => { refreshSession(); });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") refreshSession();
  });

  function toolEntry(item) {
    const code = item.toolCode;
    const path = item.route;
    // Tool entry goes through the portal route /tools/<route> in every environment:
    // dev 307-redirects to the local port, production to the tool subdomain. A hard-coded
    // production host made local clicks jump online with a local (invalid) tool token.
    const url = `${portalBase}${path}`;
    return {
      code,
      url,
      // The tool backend decides the free sample path (no ?demo= parameter in the link).
      demo: url
    };
  }

  function purchaseModal(item, entry) {
    return `<div class="request-modal" data-purchase-modal hidden><div class="request-modal__backdrop" data-close-purchase></div><section class="request-modal__card" role="dialog" aria-modal="true" aria-labelledby="purchase-modal-title"><div class="request-modal__heading"><div><p class="eyebrow">${t("purchase.eyebrow")}</p><h2 id="purchase-modal-title">${t("purchase.title")}</h2><p>${t("purchase.lede")}</p></div><button class="icon-button" type="button" data-close-purchase aria-label="${t("common.close")}">×</button></div><div data-purchase-body><div class="empty-panel">${t("pricing.loading")}</div></div></section></div>`;
  }

  function closePurchase() {
    const modal = document.querySelector("[data-purchase-modal]");
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
  }

  // In-place purchase: the tool detail modal lists the plans and pays without
  // leaving the page. Plan/price data comes from /api/products (hydrated lazily).
  const purchaseProduct = (item) => (state.products || []).find((product) => product.tool_code === item.toolCode) || null;

  const purchaseBody = (item) => {
    const product = purchaseProduct(item);
    const plans = (product && product.plans) || [];
    if (!plans.length) return `<div class="purchase-pending">${t("pricing.plan_pending")}</div>`;
    const member = state.membership && state.membership.active ? state.membership : null;
    const creditSource = member && member.credits_remaining > 0 ? "membership" : "";
    const creditLimit = Number((member && member.credit_limit_cents) || 0);
    const usableCoupon = (state.coupons || []).find((entry) => entry.status === "unused" && (entry.tool_code === "all" || entry.tool_code === item.toolCode));
    const rows = plans.map((plan) => {
      const list = Number(plan.list_price_cents || 0);
      const base = Number(plan.price_cents || 0);
      const effective = planPrice(plan).pay;
      const was = list > effective ? `<s>${moneyCents(list, plan.currency)}</s>` : "";
      const vipRedeemable = Boolean(member) && member.credits_remaining > 0 && base <= Number(member.credit_limit_cents || 0);
      const couponRedeemable = Boolean(usableCoupon);
      const redeem = vipRedeemable
        ? `<button class="text-link link-button" type="button" data-plan-redeem="${esc(product.code)}|${esc(plan.code)}" data-redeem-slug="${esc(item.slug)}">${t("pricing.redeem_button", { count: member.credits_remaining })}</button>`
        : couponRedeemable
          ? `<button class="text-link link-button" type="button" data-coupon-redeem="${esc(product.code)}|${esc(plan.code)}" data-coupon-id="${esc(usableCoupon.coupon_id)}" data-redeem-slug="${esc(item.slug)}">${t("pricing.coupon_redeem_button")}</button>`
          : "";
      // Plans above the credit face value: credit covers the face value and the
      // remainder is paid in cash (a zero remainder behaves like a redemption).
      const topupPayable = Math.max(0, effective - creditLimit);
      const topupEligible = Boolean(creditSource) && creditLimit > 0 && base > creditLimit;
      const topup = topupEligible
        ? topupPayable > 0
          ? `<button class="button button--outline" type="button" data-plan-topup="${esc(product.code)}|${esc(plan.code)}" data-topup-source="${creditSource}" data-topup-slug="${esc(item.slug)}">${t("purchase.topup_button", { credit: moneyCents(creditLimit, plan.currency), amount: moneyCents(topupPayable, plan.currency) })}</button>`
          : `<button class="text-link link-button" type="button" data-plan-topup="${esc(product.code)}|${esc(plan.code)}" data-topup-source="${creditSource}" data-topup-slug="${esc(item.slug)}">${t("pricing.redeem_button", { count: member.credits_remaining })}</button>`
        : "";
      return `<div class="purchase-plan"><div class="purchase-plan__info"><span class="purchase-plan__name">${esc(plan.display_name)}</span><span class="purchase-plan__price">${moneyCents(effective, plan.currency)}<small>${t("pricing.per_site")}</small>${was}</span></div><div class="purchase-plan__actions"><button class="button button--primary" type="button" data-purchase-plan="${esc(product.code)}|${esc(plan.code)}" data-purchase-tool="${esc(item.slug)}">${t("purchase.pay")}</button>${redeem}${topup}</div></div>`;
    }).join("");
    const note = state.config?.dev_payment_enabled ? `<p class="plan-confirm__note">${t("pricing.confirm_dev_note")}</p>` : "";
    return `${rows}${note}`;
  };

  // Coupon/credit redemption: the payment-method sheet is where the user reviews and confirms.
  const usableCouponsFor = (item) => (state.coupons || []).filter(
    (entry) => entry.status === "unused" && (entry.tool_code === "all" || entry.tool_code === item.toolCode)
  );

  const planForPurchase = (item) => {
    const product = purchaseProduct(item);
    const plans = (product && product.plans) || [];
    return { product, plan: plans[0] || null, plans };
  };

  // Price rules (must match billing.create_order):
  //   regular users pay the list price; VIP members pay list x member discount (80% by default).
  const planPrice = (plan) => {
    const member = state.membership && state.membership.active ? state.membership : null;
    const base = Number(plan.price_cents || 0);
    const listRaw = Number(plan.list_price_cents || 0);
    const list = listRaw > 0 ? listRaw : base;
    const percent = member ? Number(member.discount_percent || 100) : 80;
    const vip = Math.round((list * percent) / 100);
    return { member: Boolean(member), list, vip, pay: member ? vip : list, hasVipDeal: vip < list };
  };

  const payEntryHtml = (item) => {
    const { plan } = planForPurchase(item);
    if (!plan) return "";
    const price = planPrice(plan);
    const member = state.membership && state.membership.active ? state.membership : null;
    const coupons = usableCouponsFor(item);
    const creditLimit = Number((member && member.credit_limit_cents) || 0);
    const creditCount = member && member.credits_remaining > 0 ? member.credits_remaining : 0;
    const creditUsable = creditCount > 0 && creditLimit > 0 && Number(plan.price_cents || 0) <= creditLimit;
    const entry = coupons.length
      ? `<button class="text-link link-button detail-pay__entry" type="button" data-pay-open="${esc(item.slug)}">${t("detail.pay_entry_coupon", { count: coupons.length })}</button>`
      : creditUsable
        ? `<button class="text-link link-button detail-pay__entry" type="button" data-pay-open="${esc(item.slug)}">${t("detail.pay_entry_credit", { count: creditCount })}</button>`
        : "";
    const unit = t("pricing.per_site");
    // Two price tiles on one row: regular price + VIP price (2026-10-17).
    const baseCard = `<div class="detail-price-tile${price.member ? "" : " is-active"}">
        <span class="detail-price-tile__label">${t("detail.price_label")}</span>
        <span class="detail-price-tile__value"><strong class="detail-pay__amount">${moneyCents(price.list, plan.currency)}</strong><small>${unit}</small></span>
      </div>`;
    const vipCard = price.hasVipDeal
      ? (price.member
        ? `<div class="detail-price-tile detail-price-tile--vip detail-pay__vip is-active">
            <span class="detail-price-tile__label">${t("detail.vip_price_label")}</span>
            <span class="detail-price-tile__value"><strong>${moneyCents(price.vip, plan.currency)}</strong><small>${unit}</small></span>
            <span class="detail-price-tile__cta">${t("detail.vip_active")}</span>
          </div>`
        : `<button class="detail-price-tile detail-price-tile--vip detail-pay__vip" type="button" data-vip-open>
            <span class="detail-price-tile__label">${t("detail.vip_price_label")}</span>
            <span class="detail-price-tile__value"><strong>${moneyCents(price.vip, plan.currency)}</strong><small>${unit}</small></span>
            <span class="detail-price-tile__cta">${t("detail.vip_open")} →</span>
          </button>`)
      : "";
    return `<div class="detail-pay__row">${baseCard}${vipCard}</div>${entry ? `<div class="detail-pay__entries">${entry}</div>` : ""}`;
  };

  const hydrateDetailPay = async (item) => {
    const node = document.querySelector(`[data-pay-entry="${CSS.escape(item.slug)}"]`);
    if (!node) return;
    try {
      if (!(state.products || []).length) state.products = await apiRequest("/api/products");
      if (state.session) {
        state.membership = await apiRequest("/api/me/membership").catch(() => state.membership);
        state.share = await apiRequest("/api/share/summary").catch(() => state.share);
        const couponPayload = await apiRequest("/api/me/coupons").catch(() => ({ coupons: [] }));
        state.coupons = Array.isArray(couponPayload && couponPayload.coupons) ? couponPayload.coupons : [];
      }
    } catch {
      /* catalog unavailable: keep the row empty instead of showing a wrong price */
    }
    if (!node.isConnected) return;
    node.innerHTML = payEntryHtml(item);
  };

  const payOptions = (item) => {
    const { product, plan } = planForPurchase(item);
    if (!product || !plan) return [];
    const price = planPrice(plan);
    const member = state.membership && state.membership.active ? state.membership : null;
    const options = [{
      key: "online",
      name: t("detail.pay_online"),
      meta: `${moneyCents(price.pay, plan.currency)} ${t("pricing.per_site")}${price.member ? ` · ${t("pricing.member_price_tag")}` : ""}`,
    }];
    usableCouponsFor(item).forEach((coupon) => {
      options.push({
        key: "coupon",
        couponId: coupon.coupon_id,
        name: t("pricing.coupon_redeem_button"),
        meta: t("detail.pay_coupon_meta", {
          count: Number(coupon.quota || 1),
          scope: coupon.tool_code && coupon.tool_code !== "all" ? item.name : t("coupon.tool_all"),
          date: String(coupon.expires_at || "").slice(0, 10) || t("coupon.no_expiry"),
        }),
      });
    });
    const base = Number(plan.price_cents || 0);
    if (member && member.credits_remaining > 0 && base <= Number(member.credit_limit_cents || 0)) {
      options.push({ key: "membership", name: t("pricing.redeem_button", { count: member.credits_remaining }), meta: t("detail.pay_credit_meta") });
    }
    return options;
  };

  const openPayEntry = (item) => {
    const options = payOptions(item);
    const { plan } = planForPurchase(item);
    if (!plan) return;
    const price = planPrice(plan);
    const vipHint = !price.member && price.hasVipDeal
      ? `<button class="pay-option pay-option--vip" type="button" data-vip-open><span class="pay-option__name">${t("detail.vip_price_line", { price: moneyCents(price.vip, plan.currency) })}</span><span class="pay-option__meta">${t("detail.vip_open")}</span></button>`
      : "";
    closePlanModal();
    document.querySelector("[data-pay-modal]")?.remove();
    const modal = document.createElement("div");
    modal.className = "request-modal";
    modal.setAttribute("data-pay-modal", "");
    const rows = options.map((option, index) => `<button type="button" class="pay-option${index === 0 ? " is-active" : ""}" data-pay-method="${esc(option.key)}"${option.couponId ? ` data-coupon-id="${esc(option.couponId)}"` : ""}><span class="pay-option__name">${esc(option.name)}</span><span class="pay-option__meta">${esc(option.meta)}</span></button>`).join("");
    modal.innerHTML = `<div class="request-modal__backdrop" data-close-pay></div><section class="request-modal__card" role="dialog" aria-modal="true"><div class="request-modal__heading"><div><p class="eyebrow">${t("purchase.eyebrow")}</p><h2>${t("detail.pay_title")}</h2><p>${t("detail.pay_lede")}</p></div><button class="icon-button" type="button" data-close-pay aria-label="${t("common.close")}">×</button></div><div class="pay-options">${rows}${vipHint}</div><div class="request-modal__actions"><button class="button button--outline" type="button" data-close-pay>${t("common.cancel")}</button><button class="button button--primary" type="button" data-pay-confirm="${esc(item.slug)}">${t("pricing.confirm_submit")}</button></div></section>`;
    document.body.append(modal);
  };

  const confirmPayEntry = (slug) => {
    const modal = document.querySelector("[data-pay-modal]");
    const item = tool(slug);
    if (!modal || !item) return;
    const active = modal.querySelector(".pay-option.is-active");
    const method = active ? active.dataset.payMethod : "online";
    modal.remove();
    if (method === "online") { buyNowFlow(item, { forceChooser: false }); return; }
    if (method === "coupon" && active?.dataset.couponId) { redeemCoupon(item, active.dataset.couponId); return; }
    redeemCredit(item);
  };

  // VIP upsell modal: benefits + price, with a one-click purchase button.
  const openVipModal = async () => {
    document.querySelector("[data-vip-modal]")?.remove();
    const modal = document.createElement("div");
    modal.className = "request-modal";
    modal.setAttribute("data-vip-modal", "");
    modal.innerHTML = `<div class="request-modal__backdrop" data-close-vip></div><section class="request-modal__card request-modal__card--vip" role="dialog" aria-modal="true"><div class="vip-head"><div><p class="eyebrow">${t("purchase.eyebrow")}</p><h2>${t("detail.vip_modal_title")}</h2><p class="vip-lede">${t("detail.vip_modal_lede")}</p></div><button class="icon-button" type="button" data-close-vip aria-label="${t("common.close")}">×</button></div><p class="vip-loading">${t("pricing.loading")}</p></section>`;
    document.body.append(modal);
    if (!(state.products || []).length) {
      try { state.products = await apiRequest("/api/products"); } catch { /* falls back to the pending notice below */ }
    }
    const product = (state.products || []).find((entry) => entry.tool_code === "membership");
    const plan = product && (product.plans || [])[0];
    const card = modal.querySelector(".request-modal__card");
    if (!plan) {
      const loading = modal.querySelector(".vip-loading");
      if (loading) loading.textContent = t("pricing.plan_pending");
      return;
    }
    const price = planPrice(plan);
    const member = state.membership && state.membership.active ? state.membership : null;
    const benefits = [t("detail.vip_benefit_discount"), t("detail.vip_benefit_credits"), t("detail.vip_benefit_window")];
    card.innerHTML = `<div class="vip-head"><div><p class="eyebrow">${t("purchase.eyebrow")}</p><h2>${t("detail.vip_modal_title")}</h2><p class="vip-lede">${t("detail.vip_modal_lede")}</p></div><button class="icon-button" type="button" data-close-vip aria-label="${t("common.close")}">×</button></div><div class="vip-price"><span class="vip-price__amount">${moneyCents(Number(plan.price_cents || 0), plan.currency)}</span><span class="vip-price__unit">${t("pricing.per_year")}</span><s class="vip-price__was">${moneyCents(price.list, plan.currency)}</s></div><ul class="vip-benefits">${benefits.map((entry) => `<li>${esc(entry)}</li>`).join("")}</ul>${member ? `<p class="vip-member-state">${t("detail.vip_already")}</p>` : `<button class="button button--primary vip-cta" type="button" data-vip-buy="${esc(product.code)}|${esc(plan.code)}">${t("detail.vip_modal_cta", { price: moneyCents(Number(plan.price_cents || 0), plan.currency) })}</button>`}`;
  };

  const redeemCoupon = async (item, couponId) => {
    const { product, plan } = planForPurchase(item);
    if (!product || !plan) return;
    try {
      await apiRequest("/api/orders/coupon", { method: "POST", body: JSON.stringify({ coupon_id: couponId, tool_code: item.toolCode }) });
      state.coupons = [];
      showToast(t("pricing.coupon_redeem_done"));
      renderPurchaseSuccess(item.slug, true);
    } catch (error) {
      showToast(error.message || t("toast.order_failed"));
    }
  };

  const redeemCredit = async (item) => {
    const { product, plan } = planForPurchase(item);
    if (!product || !plan) return;
    try {
      await apiRequest("/api/membership/redeem", { method: "POST", body: JSON.stringify({ product_code: product.code, plan_code: plan.code }) });
      state.membership = null;
      showToast(t("pricing.redeem_done"));
      renderPurchaseSuccess(item.slug, true);
    } catch (error) {
      showToast(error.message || t("toast.order_failed"));
    }
  };

  // Primary CTA pays immediately; only multi-plan tools open the plan chooser first.
  const buyNowFlow = async (item, options = {}) => {
    if (!item) return;
    if (!state.session) { window.location.hash = "#login"; return; }
    if (needsEmailVerification()) { showToast(t("verify.order_blocked")); window.location.hash = "#verify"; return; }
    if (!(state.products || []).length) {
      try {
        state.products = await apiRequest("/api/products");
      } catch {
        showToast(t("toast.order_failed"));
        return;
      }
    }
    const { product, plan, plans } = planForPurchase(item);
    if (!product || !plan) { showToast(t("pricing.plan_pending")); return; }
    if (plans.length > 1 && options.forceChooser !== false) { openPurchase(item); return; }
    purchasePlan(`${product.code}|${plan.code}`, { inPlaceSlug: item.slug });
  };

  const openPurchase = async (item) => {
    const modal = document.querySelector("[data-purchase-modal]");
    if (!modal || !item) return;
    const body = modal.querySelector("[data-purchase-body]");
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    if (body) body.innerHTML = `<div class="empty-panel">${t("pricing.loading")}</div>`;
    try {
      if (!(state.products || []).length) state.products = await apiRequest("/api/products");
      if (state.session) {
        // Refresh on every open: credits can change while the SPA stays alive.
        state.membership = await apiRequest("/api/me/membership").catch(() => state.membership);
        state.share = await apiRequest("/api/share/summary").catch(() => state.share);
        const couponPayload = await apiRequest("/api/me/coupons").catch(() => ({ coupons: [] }));
        state.coupons = Array.isArray(couponPayload && couponPayload.coupons) ? couponPayload.coupons : [];
      }
    } catch {
      /* keep the pending state below when the catalog is unavailable */
    }
    if (body) body.innerHTML = purchaseBody(item);
  };

  const renderPurchaseSuccess = (slug, redeemed = false) => {
    const item = tool(slug);
    if (item) state.toolAccess[item.slug] = true;
    const launch = item ? document.querySelector(`[data-launch="${CSS.escape(item.slug)}"]`) : null;
    if (launch) launch.textContent = t("detail.start");
    // The purchase CTA (data-buy-now) flips to "start" in place and drops the price/entry row.
    const buyNow = item ? document.querySelector(`[data-buy-now="${CSS.escape(item.slug)}"]`) : null;
    if (buyNow) {
      delete buyNow.dataset.buyNow;
      buyNow.dataset.launch = item.slug;
      buyNow.textContent = t("detail.start");
    }
    if (item) document.querySelector(`[data-pay-entry="${CSS.escape(item.slug)}"]`)?.remove();
    const modal = document.querySelector("[data-purchase-modal]");
    const body = modal?.querySelector("[data-purchase-body]");
    if (!modal || !body) return;
    // Direct pay (no modal): still surface the result so the fallback "open tool" stays visible.
    if (modal.hidden) { modal.hidden = false; modal.setAttribute("aria-hidden", "false"); }
    const title = redeemed ? t("purchase.redeem_success_title") : t("purchase.success_title");
    body.innerHTML = `<div class="purchase-success"><p class="purchase-success__title">${title}</p><p class="purchase-success__lede">${t("purchase.success_lede")}</p><div class="request-modal__actions"><button class="button button--primary" type="button" data-purchase-open="${esc(slug)}">${t("purchase.open_tool")}</button><a class="button button--outline" href="#account/orders" data-close-purchase>${t("purchase.view_orders")}</a></div></div>`;
    // Auto-open right after payment/redeem; the button above stays as the
    // fallback when the browser blocks the popup window.
    if (item && item.available) window.setTimeout(() => openTool(item), 450);
  };

  const openTool = async (item) => {
    if (!item?.available) { showToast(t("toast.tool_preparing")); return; }
    const entry = toolEntry(item);
    try {
      const access = await apiRequest(`/api/access/${encodeURIComponent(entry.code)}`);
      // Hand the signed token to the tool service for the /api/runs callback.
      const token = access && access.tool_token ? `?pt=${encodeURIComponent(access.tool_token)}` : "";
      window.open(`${entry.url}${token}`, "_blank", "noopener");
    } catch (error) {
      if (error.status === 401) window.location.hash = "#login";
      else if (error.status === 403) openPurchase(item);
      else if (error.status === 404) showToast(t("toast.tool_no_account"));
      else if (error.status === 503) showToast(t("toast.account_not_ready"));
      else showToast(error.message || t("toast.tool_unavailable"));
    }
  };

  const hydrateToolAccess = async (item) => {
    if (!state.session || item.billing !== "paid" || Object.prototype.hasOwnProperty.call(state.toolAccess, item.slug)) return;
    try {
      const result = await apiRequest(`/api/access/${encodeURIComponent(item.toolCode)}?probe=1`);
      state.toolAccess[item.slug] = Boolean(result && result.allowed);
    } catch {
      state.toolAccess[item.slug] = false;
    }
    if (routeTool() === item) render();
  };

  // Legal copy lives in the content store: a "## heading" line becomes a
  // section title, every other line becomes a paragraph.
  const legalCopy = (text) => String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.startsWith("## ") ? `<h2>${esc(line.slice(3))}</h2>` : `<p>${esc(line)}</p>`)
    .join("");
  function legal(privacy) { return `<div class="page"><section class="page-heading"><div class="container"><p class="eyebrow">${privacy ? t("legal.privacy.eyebrow") : t("legal.terms.eyebrow")}</p><h1>${privacy ? t("legal.privacy.title") : t("legal.terms.title")}</h1><p>${t("legal.lede")}</p></div></section><section class="section"><div class="container legal-copy"><div class="legal-copy__body">${legalCopy(privacy ? t("legal.privacy.body") : t("legal.terms.body"))}</div></div></section></div>`; }

  let adminLoading = false;
  const hydrateAdminSession = async () => {
    if (adminLoading) return;
    adminLoading = true;
    try {
      await apiRequest("/api/admin/session");
      adminState.session = true;
    } catch (error) {
      adminState.session = error.status === 503 ? "disabled" : false;
    }
    adminLoading = false;
    if (route().startsWith("admin")) render();
  };
  const loadAdminContent = async () => {
    if (adminLoading) return;
    adminLoading = true;
    try {
      const [contentPayload, changesPayload, statsPayload, sitesPayload, usersPayload, ordersPayload, invoicesPayload, refundsPayload, couponsPayload, couponBatchesPayload, couponStatsPayload, toolPoliciesPayload, feedbackPayload, feedbackStatsPayload] = await Promise.all([
        apiRequest("/api/admin/content"),
        apiRequest("/api/admin/changes").catch(() => ({ changes: [] })),
        apiRequest("/api/admin/stats/overview?days=7").catch(() => null),
        apiRequest("/api/admin/sites").catch(() => null),
        apiRequest("/api/admin/users?limit=200").catch(() => null),
        apiRequest("/api/admin/orders?limit=200").catch(() => null),
        apiRequest("/api/admin/invoices?limit=200").catch(() => null),
        apiRequest("/api/admin/refunds?limit=200").catch(() => null),
        apiRequest("/api/admin/coupons?limit=500").catch(() => ({ coupons: [] })),
        apiRequest("/api/admin/coupon-batches").catch(() => ({ batches: [] })),
        apiRequest("/api/admin/coupons/stats").catch(() => null),
        apiRequest("/api/admin/tool-policies").catch(() => ({ policies: [] })),
        apiRequest("/api/admin/feedback?limit=500").catch(() => ({ feedback: [] })),
        apiRequest("/api/admin/feedback/stats").catch(() => null)
      ]);
      adminState.sites = (sitesPayload && sitesPayload.sites) || [];
      adminState.runs = (sitesPayload && sitesPayload.runs) || [];
      adminState.users = usersPayload;
      adminState.orders = ordersPayload;
      adminState.invoices = invoicesPayload;
      adminState.refunds = refundsPayload;
      adminState.coupons = (couponsPayload && couponsPayload.coupons) || [];
      adminState.couponBatches = (couponBatchesPayload && couponBatchesPayload.batches) || [];
      adminState.couponStats = couponStatsPayload;
      adminState.toolPolicies = (toolPoliciesPayload && toolPoliciesPayload.policies) || [];
      adminState.feedback = (feedbackPayload && feedbackPayload.feedback) || [];
      adminState.feedbackStats = feedbackStatsPayload;
      adminState.tools = contentPayload.tools || [];
      adminState.tags = contentPayload.tags || [];
      adminState.catalog = contentPayload.catalog || {};
      adminState.products = contentPayload.products || [];
      adminState.datasets = contentPayload.datasets || [];
      adminState.rows = {
        help: contentPayload.help || [],
        requests: contentPayload.requests || [],
        site: contentPayload.site || [],
        labels: contentPayload.labels || [],
        strings: contentPayload.strings || [],
        products: contentPayload.billing_products || [],
        billing_plans: contentPayload.billing_plans || [],
        tool_media: contentPayload.tool_media || [],
        tool_updates: contentPayload.tool_updates || [],
        tool_docs: contentPayload.tool_docs || []
      };
      adminState.changes = changesPayload.changes || [];
      adminState.stats = statsPayload;
      adminState.loaded = true;
      adminState.error = "";
    } catch (error) {
      if (error.status === 401) { adminState.session = false; adminState.loaded = false; }
      else if (error.status === 503) adminState.session = "disabled";
      else adminState.error = error.message || t("admin.load_failed");
    }
    adminLoading = false;
    if (route().startsWith("admin")) render();
  };
  const adminToolPayload = (form) => {
    const data = new FormData(form);
    const tags = [...form.querySelectorAll('input[name="tags"]:checked')].map((node) => node.value);
    return {
      slug: String(data.get("slug") || "").trim(),
      tool_code: String(data.get("tool_code") || "").trim(),
      route: String(data.get("route") || "").trim(),
      name: String(data.get("name") || "").trim(),
      subtitle: String(data.get("subtitle") || "").trim(),
      tags: tags.join("|"),
      form: String(data.get("form") || "tool"),
      billing: String(data.get("billing") || "free"),
      available: data.get("available") === "on",
      featured: data.get("featured") === "on",
      sort: String(data.get("sort") || "0").trim(),
      image: String(data.get("image") || "").trim(),
      video: String(data.get("video") || "").trim(),
      gallery: String(data.get("gallery") || "").trim(),
      sample_files: String(data.get("sample_files") || "").trim(),
      input_summary: String(data.get("input_summary") || "").trim(),
      output_summary: String(data.get("output_summary") || "").trim(),
      capabilities: String(data.get("capabilities") || "").trim()
    };
  };
  const adminLogin = () => `<div class="page"><section class="admin-page"><div class="container"><div class="admin-card admin-card--login"><h1>${t("admin.login_title")}</h1><p class="admin-lede">${t("admin.login_lede")}</p><form class="form-stack" data-admin-login-form><label class="field">${t("admin.password_label")}<input type="password" name="password" autocomplete="current-password" required></label><button class="button button--primary button--full" type="submit">${t("admin.login_submit")}</button><p class="status" data-admin-status aria-live="polite"></p></form></div></div></section></div>`;
  const ADMIN_NAV_GROUPS = [
    { key: "content", label: t("admin.section_content"), items: [["tools", "admin.nav_tools"], ["tags", "admin.nav_tags"], ["labels", "admin.family_labels"], ["tool_media", "admin.family_tool_media"], ["tool_updates", "admin.family_tool_updates"], ["tool_docs", "admin.family_tool_docs"], ["datasets", "admin.family_datasets"], ["help", "admin.family_help"], ["requests", "admin.family_requests"], ["site", "admin.family_site"]] },
    { key: "products", label: t("admin.section_products"), items: [["products", "admin.family_products"], ["billing_plans", "admin.family_billing_plans"], ["coupons", "admin.nav_coupons"]] },
    { key: "users", label: t("admin.section_users"), items: [["users", "admin.nav_users"], ["sites", "admin.family_sites"], ["feedback", "admin.nav_feedback"]] },
    { key: "finance", label: t("admin.section_finance"), items: [["orders", "admin.nav_orders"], ["invoices", "admin.nav_invoices"], ["refunds", "admin.nav_refunds"]] },
    { key: "system", label: t("admin.section_system"), items: [["policies", "admin.nav_policies"], ["stats", "admin.nav_stats"]] },
  ];

  const adminSidebar = (active) => `<aside class="admin-sidebar"><div class="admin-sidebar__inner">${ADMIN_NAV_GROUPS.map((group) => `<div class="admin-nav-group"><h2 class="admin-nav-group__title">${esc(group.label)}</h2>${group.items.map(([key, labelKey]) => `<button type="button" class="admin-nav-item ${active === key ? "is-active" : ""}" data-admin-nav="${key}">${t(labelKey)}</button>`).join("")}</div>`).join("")}</div></aside>`;

  const adminShell = (active, inner) => `<div class="page"><section class="admin-page"><div class="container"><header class="admin-header"><div><p class="eyebrow">${esc(content.site.brand)}</p><h1>${t("admin.title")}</h1></div><div class="admin-header__actions"><a class="button button--outline button--small" href="#home">${t("admin.back_site")}</a><button class="button button--outline button--small" type="button" data-admin-logout>${t("admin.logout")}</button></div></header><div class="admin-layout">${adminSidebar(active)}<div class="admin-main">${adminState.message ? `<p class="admin-notice admin-notice--ok">${esc(adminState.message)}</p>` : ""}${adminState.error ? `<p class="admin-notice admin-notice--error">${esc(adminState.error)}</p>` : ""}${inner}</div></div></div></section></div>`;
  const adminToolDialog = () => {
    const tool = adminState.editing;
    if (!tool) return "";
    const editing = Boolean(tool.slug && adminState.tools.some((item) => item.slug === tool.slug));
    const tagBoxes = adminState.tags.map((tag) => {
      const checked = String(tool.tags || "").split("|").includes(tag.key) ? " checked" : "";
      return `<label class="admin-check"><input type="checkbox" name="tags" value="${esc(tag.key)}"${checked}>${esc(tag.name)}</label>`;
    }).join("");
    return `<div class="request-modal" data-admin-modal><div class="request-modal__backdrop" data-admin-close></div><section class="request-modal__card admin-dialog" role="dialog" aria-modal="true"><div class="request-modal__heading"><div><p class="eyebrow">${t("admin.title")}</p><h2>${editing ? t("admin.tools_edit_title") : t("admin.tools_new_title")}</h2></div><button class="icon-button" type="button" data-admin-close aria-label="${t("common.close")}">×</button></div><form class="form-stack admin-form" data-admin-tool-form data-admin-editing="${editing ? "1" : "0"}"><div class="admin-form-grid"><label class="field">${t("admin.field_slug")}<input name="slug" value="${esc(tool.slug || "")}" ${editing ? "readonly" : ""} required></label><label class="field">${t("admin.field_tool_code")}<input name="tool_code" value="${esc(tool.tool_code || "")}"></label><label class="field">${t("admin.field_route")}<input name="route" value="${esc(tool.route || "")}" placeholder="/tools/..."></label><label class="field">${t("admin.field_name")}<input name="name" value="${esc(tool.name || "")}" required></label><label class="field admin-form-grid--wide">${t("admin.field_subtitle")}<input name="subtitle" value="${esc(tool.subtitle || "")}"></label><div class="field admin-form-grid--wide"><span>${t("admin.field_tags")}</span><div class="admin-checks">${tagBoxes}</div></div><label class="field">${t("admin.field_form")}<select name="form"><option value="tool"${tool.form === "service" ? "" : " selected"}>${esc((content.labels.form || {}).tool || "tool")}</option><option value="service"${tool.form === "service" ? " selected" : ""}>${esc((content.labels.form || {}).service || "service")}</option></select></label><label class="field">${t("admin.field_billing")}<select name="billing">${["free", "paid", "quote"].map((key) => `<option value="${key}"${tool.billing === key ? " selected" : ""}>${esc((content.labels.billing || {})[key] || key)}</option>`).join("")}</select></label><label class="field">${t("admin.field_sort")}<input name="sort" type="number" value="${esc(tool.sort || "0")}"></label><div class="field"><span>${t("admin.field_flags")}</span><div class="admin-checks"><label class="admin-check"><input type="checkbox" name="available"${tool.available === "true" ? " checked" : ""}>${t("admin.field_available")}</label><label class="admin-check"><input type="checkbox" name="featured"${tool.featured !== "false" ? " checked" : ""}>${t("admin.field_featured")}</label></div></div><label class="field">${t("admin.field_image")}<input name="image" value="${esc(tool.image || "")}"></label><label class="field">${t("admin.field_video")}<input name="video" value="${esc(tool.video || "")}"></label><label class="field admin-form-grid--wide">${t("admin.field_gallery")}<input name="gallery" value="${esc(tool.gallery || "")}" placeholder="sample-01.png,sample-02.png"></label><label class="field admin-form-grid--wide">${t("admin.field_sample_files")}<input name="sample_files" value="${esc(tool.sample_files || "")}" placeholder="sample-input|./downloads/slug/sample-input.csv|note"></label><label class="field admin-form-grid--wide">${t("admin.field_input")}<input name="input_summary" value="${esc(tool.input_summary || "")}"></label><label class="field admin-form-grid--wide">${t("admin.field_output")}<input name="output_summary" value="${esc(tool.output_summary || "")}"></label><label class="field admin-form-grid--wide">${t("admin.field_capabilities")}<textarea name="capabilities" rows="2">${esc(tool.capabilities || "")}</textarea></label></div><div class="request-modal__actions"><button class="button button--outline" type="button" data-admin-close>${t("common.cancel")}</button><button class="button button--primary" type="submit">${t("admin.save")}</button></div><p class="status" data-admin-dialog-status aria-live="polite"></p></form></section></div>`;
  };
  const adminToolsPage = () => {
    const rows = adminState.tools.map((tool, index) => {
      const tags = String(tool.tags || "").split("|").filter(Boolean).map((key) => {
        const entry = adminState.tags.find((item) => item.key === key);
        return `<span class="tool-tag">${esc(entry ? entry.name : key)}</span>`;
      }).join("");
      const catalog = adminState.catalog[tool.slug] || {};
      const badge = catalog.registered
        ? `<span class="badge badge--self">${t("admin.catalog_registered")}</span><span class="admin-muted">${esc(catalog.access_mode || "")}</span>`
        : `<span class="badge badge--request-status">${t("admin.catalog_missing")}</span>`;
      return `<tr><td><strong>${esc(tool.name)}</strong><small>${esc(tool.slug)}</small></td><td>${tags}</td><td>${esc((content.labels.form || {})[tool.form] || tool.form)}</td><td>${esc((content.labels.billing || {})[tool.billing] || tool.billing)}</td><td><button class="admin-toggle ${tool.available === "true" ? "is-on" : ""}" type="button" data-admin-toggle="${esc(tool.slug)}:available">${tool.available === "true" ? esc(content.labels.status.available) : esc(content.labels.status.preparing)}</button></td><td class="admin-move"><button type="button" data-admin-move="${esc(tool.slug)}:up" ${index === 0 ? "disabled" : ""} aria-label="${t("admin.move_up")}">↑</button><button type="button" data-admin-move="${esc(tool.slug)}:down" ${index === adminState.tools.length - 1 ? "disabled" : ""} aria-label="${t("admin.move_down")}">↓</button><span>${esc(tool.sort)}</span></td><td><input type="checkbox" data-admin-featured="${esc(tool.slug)}" ${tool.featured !== "false" ? "checked" : ""}></td><td>${badge}</td><td class="admin-actions"><button class="button button--outline button--small" type="button" data-admin-tool-edit="${esc(tool.slug)}">${t("admin.edit")}</button><button class="button button--outline button--small" type="button" data-admin-tool-delete="${esc(tool.slug)}">${t("admin.delete")}</button></td></tr>`;
    }).join("");
    const changes = (adminState.changes || []).slice(0, 6).map((entry) => `<li><span>${esc(String(entry.ts || "").replace("T", " ").replace("+00:00", ""))}</span><code>${esc(entry.action || "")}</code><strong>${esc(entry.target || "")}</strong></li>`).join("");
    return `<section class="admin-card"><div class="admin-toolbar"><p>${t("admin.tools_count", { count: adminState.tools.length })}</p><button class="button button--primary button--small" type="button" data-admin-tool-new>${t("admin.tools_add")}</button></div><div class="table-wrap"><table class="admin-table"><thead><tr><th>${t("admin.col_tool")}</th><th>${t("admin.col_tags")}</th><th>${t("admin.col_form")}</th><th>${t("admin.col_billing")}</th><th>${t("admin.col_status")}</th><th>${t("admin.col_sort")}</th><th>${t("admin.col_featured")}</th><th>${t("admin.col_catalog")}</th><th>${t("admin.col_actions")}</th></tr></thead><tbody>${rows}</tbody></table></div>${changes ? `<div class="admin-changes"><h3>${t("admin.changes_title")}</h3><ul class="admin-list">${changes}</ul></div>` : ""}</section>${adminToolDialog()}`;
  };
  const adminTagDialog = () => {
    const tag = adminState.editingTag;
    if (!tag) return "";
    const editing = Boolean(tag.key && adminState.tags.some((item) => item.key === tag.key));
    return `<div class="request-modal" data-admin-modal><div class="request-modal__backdrop" data-admin-close></div><section class="request-modal__card admin-dialog" role="dialog" aria-modal="true"><div class="request-modal__heading"><div><p class="eyebrow">${t("admin.title")}</p><h2>${editing ? t("admin.tags_edit_title") : t("admin.tags_new_title")}</h2></div><button class="icon-button" type="button" data-admin-close aria-label="${t("common.close")}">×</button></div><form class="form-stack admin-form" data-admin-tag-form data-admin-editing="${editing ? "1" : "0"}"><div class="admin-form-grid"><label class="field">${t("admin.tags_key")}<input name="key" value="${esc(tag.key || "")}" ${editing ? "readonly" : ""} required></label><label class="field">${t("admin.tags_icon")}<input name="icon" value="${esc(tag.icon || "layers")}"></label><label class="field">${t("admin.tags_name")}<input name="name" value="${esc(tag.name || "")}" required></label><label class="field admin-form-grid--wide">${t("admin.tags_description")}<input name="description" value="${esc(tag.description || "")}"></label></div><div class="request-modal__actions"><button class="button button--outline" type="button" data-admin-close>${t("common.cancel")}</button><button class="button button--primary" type="submit">${t("admin.save")}</button></div><p class="status" data-admin-dialog-status aria-live="polite"></p></form></section></div>`;
  };
  const adminTagsPage = () => {
    const rows = adminState.tags.map((tag) => `<tr><td><code>${esc(tag.key)}</code></td><td>${icon(tag.icon || "layers")}</td><td>${esc(tag.name)}</td><td>${esc(tag.description)}</td><td class="admin-actions"><button class="button button--outline button--small" type="button" data-admin-tag-edit="${esc(tag.key)}">${t("admin.edit")}</button><button class="button button--outline button--small" type="button" data-admin-tag-delete="${esc(tag.key)}">${t("admin.delete")}</button></td></tr>`).join("");
    return `<section class="admin-card"><div class="admin-toolbar"><p>${t("admin.tags_count", { count: adminState.tags.length })}</p><button class="button button--primary button--small" type="button" data-admin-tag-new>${t("admin.tags_add")}</button></div><div class="table-wrap"><table class="admin-table"><thead><tr><th>${t("admin.tags_key")}</th><th>${t("admin.tags_icon")}</th><th>${t("admin.tags_name")}</th><th>${t("admin.tags_description")}</th><th>${t("admin.col_actions")}</th></tr></thead><tbody>${rows}</tbody></table></div></section>${adminTagDialog()}`;
  };

  // --------------------------------------------------------- generic families
  const adminRowIdFields = { help: ["key"], requests: ["id"], site: ["key"], labels: ["group", "key"], strings: ["key"], products: ["code"], billing_plans: ["code"], tool_media: ["id"], tool_updates: ["id"], tool_docs: ["id"] };
  const adminRowId = (family, row) => (adminRowIdFields[family] || []).map((field) => String(row[field] ?? "")).join(".");
  const adminSelectOptions = (source) => () => Object.entries(source || {});
  const adminToolOptions = () => tools.map((tool) => [tool.name, tool.name]);
  const adminFamilyMeta = {
    help: {
      columns: [
        [() => t("admin.col_key"), (row) => `<code>${esc(row.key)}</code>`],
        [() => t("admin.field_group"), (row) => esc(row.group)],
        [() => t("admin.col_title"), (row) => esc(row.title)],
        [() => t("admin.col_href"), (row) => `<code>${esc(row.href)}</code>`]
      ],
      fields: [
        { name: "key", label: () => t("admin.field_key"), required: true, locked: true },
        { name: "group", label: () => t("admin.field_group"), required: true },
        { name: "sort", label: () => t("admin.field_sort"), type: "number" },
        { name: "title", label: () => t("admin.field_title"), required: true },
        { name: "copy", label: () => t("admin.field_copy"), type: "textarea", required: true, wide: true },
        { name: "href", label: () => t("admin.field_href"), required: true, wide: true }
      ],
      blank: () => ({ key: "", group: t("admin.help_default_group"), sort: String(((adminState.rows.help || []).length + 1) * 10), title: "", copy: "", href: "#tools" }),
      reorder: true
    },
    requests: {
      columns: [
        [() => t("admin.col_title"), (row) => `<strong>${esc(row.title)}</strong><small>${esc(row.id)}</small>`],
        [() => t("admin.col_request_type"), (row) => esc((content.labels.requestType || {})[row.type] || row.type)],
        [() => t("admin.col_status"), (row) => esc((content.labels.requestStatus || {})[row.status] || row.status)],
        [() => t("admin.col_votes"), (row) => esc(row.votes)],
        [() => t("admin.col_time"), (row) => esc(row.time)]
      ],
      fields: [
        { name: "id", label: () => t("admin.field_request_id"), required: true, locked: true },
        { name: "type", label: () => t("admin.field_request_type"), type: "select", options: adminSelectOptions(content.labels.requestType), required: true },
        { name: "status", label: () => t("admin.field_status"), type: "select", options: adminSelectOptions(content.labels.requestStatus), required: true },
        { name: "title", label: () => t("admin.field_title"), required: true },
        { name: "votes", label: () => t("admin.field_votes"), type: "number" },
        { name: "author", label: () => t("admin.field_author"), required: true },
        { name: "time", label: () => t("admin.field_time"), required: true, placeholder: "2026-09-18" },
        { name: "tool", label: () => t("admin.field_tool"), type: "select", options: adminToolOptions, allowEmpty: true },
        { name: "summary", label: () => t("admin.field_summary"), type: "textarea", required: true, wide: true }
      ],
      blank: () => ({ id: "", type: Object.keys(content.labels.requestType || {})[0] || "new-tool", status: Object.keys(content.labels.requestStatus || {})[0] || "under-review", title: "", summary: "", votes: "0", author: t("admin.requests_default_author"), time: new Date().toISOString().slice(0, 10), tool: "" }),
      reorder: false
    },
    site: {
      columns: [
        [() => t("admin.col_key"), (row) => `<code>${esc(row.key)}</code>`],
        [() => t("admin.col_value"), (row) => esc(row.value)]
      ],
      fields: [
        { name: "key", label: () => t("admin.field_key"), required: true, locked: true },
        { name: "value", label: () => t("admin.field_value"), type: "textarea", wide: true }
      ],
      blank: () => ({ key: "", value: "" }),
      reorder: false
    },
    labels: {
      columns: [
        [() => t("admin.col_group"), (row) => `<code>${esc(row.group)}</code>`],
        [() => t("admin.col_key"), (row) => `<code>${esc(row.key)}</code>`],
        [() => t("admin.col_value"), (row) => esc(row.value)]
      ],
      fields: [
        { name: "group", label: () => t("admin.field_group"), required: true, locked: true },
        { name: "key", label: () => t("admin.field_key"), required: true, locked: true },
        { name: "value", label: () => t("admin.field_value"), required: true, wide: true }
      ],
      blank: () => ({ group: "request_type", key: "", value: "" }),
      reorder: false
    },
    products: {
      columns: [
        [() => t("admin.col_key"), (row) => `<code>${esc(row.code)}</code>`],
        [() => t("admin.col_name"), (row) => esc(row.display_name)],
        [() => t("admin.field_tool_code"), (row) => `<code>${esc(row.tool_code)}</code>`],
        [() => t("admin.col_status"), (row) => row.enabled !== "false" ? t("admin.enabled_on") : t("admin.enabled_off")]
      ],
      fields: [
        { name: "code", label: () => t("admin.field_key"), required: true, locked: true },
        { name: "tool_code", label: () => t("admin.field_tool_code"), required: true },
        { name: "display_name", label: () => t("admin.field_name"), required: true },
        { name: "sort", label: () => t("admin.field_sort"), type: "number" },
        { name: "enabled", label: () => t("admin.field_flags"), type: "checkbox", checkboxLabel: () => t("admin.col_status") },
        { name: "description", label: () => t("admin.field_description"), type: "textarea", wide: true }
      ],
      blank: () => ({ code: "", tool_code: "", display_name: "", description: "", enabled: "true", sort: "0" }),
      reorder: false
    },
    billing_plans: {
      columns: [
        [() => t("admin.col_key"), (row) => `<code>${esc(row.code)}</code>`],
        [() => t("admin.col_product"), (row) => `<code>${esc(row.product_code)}</code>`],
        [() => t("admin.col_name"), (row) => esc(row.display_name)],
        [() => t("admin.col_price"), (row) => `${moneyCents(row.price_cents)}${Number(row.list_price_cents || 0) > Number(row.price_cents || 0) ? ` <s class="admin-muted">${moneyCents(row.list_price_cents)}</s>` : ""}`],
        [() => t("admin.col_status"), (row) => row.enabled !== "false" ? t("admin.enabled_on") : t("admin.enabled_off")]
      ],
      fields: [
        { name: "code", label: () => t("admin.field_key"), required: true, locked: true },
        { name: "product_code", label: () => t("admin.col_product"), required: true },
        { name: "display_name", label: () => t("admin.field_name"), required: true },
        { name: "price_cents", label: () => t("admin.field_price_cents"), type: "number", required: true },
        { name: "list_price_cents", label: () => t("admin.field_list_price_cents"), type: "number" },
        { name: "feature_codes", label: () => t("admin.field_feature_codes"), required: true },
        { name: "quota_total", label: () => t("admin.field_quota_total"), type: "number" },
        { name: "duration_days", label: () => t("admin.field_duration_days"), type: "number" },
        { name: "sort", label: () => t("admin.field_sort"), type: "number" },
        { name: "max_file_size_mb", label: () => t("admin.field_max_file"), type: "number" },
        { name: "max_runtime_seconds", label: () => t("admin.field_max_runtime"), type: "number" },
        { name: "concurrency", label: () => t("admin.field_concurrency"), type: "number" },
        { name: "export_enabled", label: () => t("admin.field_flags"), type: "checkbox", checkboxLabel: () => t("admin.field_export_enabled") },
        { name: "activation_required", label: () => t("admin.field_flags"), type: "checkbox", checkboxLabel: () => t("admin.field_activation_required") },
        { name: "enabled", label: () => t("admin.field_flags"), type: "checkbox", checkboxLabel: () => t("admin.enabled_on") }
      ],
      blank: () => ({ code: "", product_code: "", display_name: t("admin.plan_default_name"), price_cents: "", list_price_cents: "", feature_codes: "", quota_total: "1", duration_days: "", sort: "10", max_file_size_mb: "100", max_runtime_seconds: "300", concurrency: "1", export_enabled: "true", activation_required: "true", enabled: "true" }),
      reorder: false
    },
    tool_media: {
      columns: [
        [() => t("admin.col_key"), (row) => `<code>${esc(row.id)}</code>`],
        [() => t("admin.field_tool_code"), (row) => `<code>${esc(row.tool_code)}</code>`],
        [() => t("admin.media_slot"), (row) => esc(row.slot)],
        [() => t("admin.media_type"), (row) => esc(row.media_type)],
        [() => t("admin.col_title"), (row) => esc(row.title)],
        [() => t("admin.col_status"), (row) => row.status !== "false" ? t("admin.enabled_on") : t("admin.enabled_off")]
      ],
      fields: [
        { name: "id", label: () => t("admin.field_key"), required: true, locked: true },
        { name: "tool_code", label: () => t("admin.field_tool_code"), required: true },
        { name: "slot", label: () => t("admin.media_slot"), type: "select", options: () => [["hero", "hero"], ["workflow", "workflow"], ["result", "result"], ["tutorial", "tutorial"]], required: true },
        { name: "media_type", label: () => t("admin.media_type"), type: "select", options: () => [["image", "image"], ["gif", "gif"], ["steps", "steps"], ["video", "video"]], required: true },
        { name: "title", label: () => t("admin.col_title"), required: true },
        { name: "src", label: () => t("admin.media_src"), required: true },
        { name: "poster", label: () => t("admin.media_poster") },
        { name: "sort", label: () => t("admin.field_sort"), type: "number" },
        { name: "status", label: () => t("admin.field_flags"), type: "checkbox", checkboxLabel: () => t("admin.enabled_on") }
      ],
      blank: () => ({ id: "", tool_code: "boundary", slot: "hero", media_type: "image", title: "", src: "", poster: "", sort: "10", status: "true" }),
      reorder: true
    },
    tool_updates: {
      columns: [
        [() => t("admin.col_key"), (row) => `<code>${esc(row.id)}</code>`],
        [() => t("admin.field_tool_code"), (row) => `<code>${esc(row.tool_code)}</code>`],
        [() => t("admin.update_version"), (row) => esc(row.version)],
        [() => t("admin.update_kind"), (row) => esc(row.kind)],
        [() => t("admin.col_title"), (row) => esc(row.title)],
        [() => t("admin.col_status"), (row) => esc(row.status)]
      ],
      fields: [
        { name: "id", label: () => t("admin.field_key"), required: true, locked: true },
        { name: "tool_code", label: () => t("admin.field_tool_code"), required: true },
        { name: "version", label: () => t("admin.update_version"), required: true },
        { name: "published_at", label: () => t("admin.update_date"), required: true, placeholder: "2026-10-14" },
        { name: "kind", label: () => t("admin.update_kind"), type: "select", options: () => [["feature", "feature"], ["fix", "fix"], ["improve", "improve"], ["doc", "doc"]], required: true },
        { name: "title", label: () => t("admin.col_title"), required: true },
        { name: "summary", label: () => t("admin.update_summary"), required: true, wide: true },
        { name: "detail", label: () => t("admin.update_detail"), type: "textarea", wide: true },
        { name: "related_feedback", label: () => t("admin.update_feedback"), wide: true },
        { name: "sort", label: () => t("admin.field_sort"), type: "number" },
        { name: "status", label: () => t("admin.update_status"), type: "select", options: () => [["published", "published"], ["draft", "draft"]], required: true }
      ],
      blank: () => ({ id: "", tool_code: "boundary", version: "", published_at: new Date().toISOString().slice(0, 10), kind: "improve", title: "", summary: "", detail: "", related_feedback: "", sort: "10", status: "published" }),
      reorder: true
    },
    tool_docs: {
      columns: [
        [() => t("admin.col_key"), (row) => `<code>${esc(row.id)}</code>`],
        [() => t("admin.field_tool_code"), (row) => `<code>${esc(row.tool_code)}</code>`],
        [() => t("admin.doc_section"), (row) => esc(row.section)],
        [() => t("admin.col_title"), (row) => esc(row.title)],
        [() => t("admin.col_status"), (row) => row.status !== "false" ? t("admin.enabled_on") : t("admin.enabled_off")]
      ],
      fields: [
        { name: "id", label: () => t("admin.field_key"), required: true, locked: true },
        { name: "tool_code", label: () => t("admin.field_tool_code"), required: true },
        { name: "section", label: () => t("admin.doc_section"), required: true },
        { name: "title", label: () => t("admin.col_title"), required: true },
        { name: "content", label: () => t("admin.doc_content"), type: "textarea", required: true, wide: true },
        { name: "sort", label: () => t("admin.field_sort"), type: "number" },
        { name: "status", label: () => t("admin.field_flags"), type: "checkbox", checkboxLabel: () => t("admin.enabled_on") }
      ],
      blank: () => ({ id: "", tool_code: "boundary", section: "data", title: "", content: "", sort: "10", status: "true" }),
      reorder: true
    }
  };

  const adminFamilyTitle = (family) => t(`admin.family_${family}`);

  const adminFieldHtml = (field, row, editing) => {
    const value = row ? String(row[field.name] ?? "") : "";
    const wide = field.wide ? " admin-form-grid--wide" : "";
    const required = field.required ? " required" : "";
    const readonly = field.locked && editing ? " readonly" : "";
    let control = "";
    if (field.type === "textarea") {
      control = `<textarea name="${field.name}" rows="3"${required}>${esc(value)}</textarea>`;
    } else if (field.type === "checkbox") {
      return `<div class="field${wide}"><span>${field.label()}</span><label class="admin-check"><input type="checkbox" name="${field.name}"${value !== "false" && value !== "" ? " checked" : ""}>${field.checkboxLabel ? field.checkboxLabel() : ""}</label></div>`;
    } else if (field.type === "select") {
      const entries = (field.options ? field.options() : []) || [];
      const known = entries.some(([key]) => String(key) === value);
      const fallback = value && !known ? `<option value="${esc(value)}" selected>${esc(value)}</option>` : "";
      control = `<select name="${field.name}"${required}>${field.allowEmpty ? '<option value=""></option>' : ""}${fallback}${entries.map(([key, text]) => `<option value="${esc(key)}"${String(key) === value ? " selected" : ""}>${esc(text)}</option>`).join("")}</select>`;
    } else {
      control = `<input name="${field.name}" type="${field.type || "text"}" value="${esc(value)}"${required}${readonly}${field.placeholder ? ` placeholder="${esc(field.placeholder)}"` : ""}>`;
    }
    return `<label class="field${wide}">${field.label()}${control}</label>`;
  };

  const adminFamilyPage = (family) => {
    const meta = adminFamilyMeta[family];
    const rows = adminState.rows[family] || [];
    const head = meta.columns.map(([label]) => `<th>${label()}</th>`).join("") + (meta.reorder ? `<th>${t("admin.col_sort")}</th>` : "") + `<th>${t("admin.col_actions")}</th>`;
    const body = rows.map((row, index) => {
      const id = adminRowId(family, row);
      const cells = meta.columns.map(([, render]) => `<td>${render(row)}</td>`).join("");
      const move = meta.reorder
        ? `<td class="admin-move"><button type="button" data-admin-row-move="${family}:${esc(id)}:up" ${index === 0 ? "disabled" : ""} aria-label="${t("admin.move_up")}">↑</button><button type="button" data-admin-row-move="${family}:${esc(id)}:down" ${index === rows.length - 1 ? "disabled" : ""} aria-label="${t("admin.move_down")}">↓</button><span>${esc(row.sort)}</span></td>`
        : "";
      return `<tr>${cells}${move}<td class="admin-actions"><button class="button button--outline button--small" type="button" data-admin-row-edit="${family}:${esc(id)}">${t("admin.edit")}</button><button class="button button--outline button--small" type="button" data-admin-row-delete="${family}:${esc(id)}">${t("admin.delete")}</button></td></tr>`;
    }).join("");
    return `<section class="admin-card"><div class="admin-toolbar"><p>${t("admin.rows_count", { count: rows.length, name: adminFamilyTitle(family) })}</p><button class="button button--primary button--small" type="button" data-admin-row-new="${family}">${t("admin.row_new", { name: adminFamilyTitle(family) })}</button></div><div class="table-wrap"><table class="admin-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div></section>${adminFamilyDialog(family)}`;
  };

  const adminFamilyDialog = (family) => {
    const row = adminState.editingRow;
    if (!row) return "";
    const meta = adminFamilyMeta[family];
    const editing = Boolean(adminState.editingRowId);
    return `<div class="request-modal" data-admin-modal><div class="request-modal__backdrop" data-admin-close></div><section class="request-modal__card admin-dialog" role="dialog" aria-modal="true"><div class="request-modal__heading"><div><p class="eyebrow">${t("admin.title")}</p><h2>${editing ? t("admin.row_edit_title", { name: adminFamilyTitle(family) }) : t("admin.row_new_title", { name: adminFamilyTitle(family) })}</h2></div><button class="icon-button" type="button" data-admin-close aria-label="${t("common.close")}">×</button></div><form class="form-stack admin-form" data-admin-row-form data-family="${family}" data-editing="${editing ? "1" : "0"}" data-row-id="${esc(adminState.editingRowId)}"><div class="admin-form-grid">${meta.fields.map((field) => adminFieldHtml(field, row, editing)).join("")}</div><div class="request-modal__actions"><button class="button button--outline" type="button" data-admin-close>${t("common.cancel")}</button><button class="button button--primary" type="submit">${t("admin.save")}</button></div><p class="status" data-admin-dialog-status aria-live="polite"></p></form></section></div>`;
  };

  // ---------------------------------------------------------------- datasets
  const adminDatasetFields = ["id", "type", "icon", "name", "description", "records", "files", "formats", "access", "access_label", "updated", "about"];
  const adminDatasetSubSpecs = [
    ["files", () => t("admin.dataset_files"), () => t("admin.dataset_add_file"), [["name", () => t("admin.dataset_file_name")], ["meta", () => t("admin.dataset_file_meta")]]],
    ["fields", () => t("admin.dataset_fields"), () => t("admin.dataset_add_field"), [["name", () => t("admin.dataset_field_name")], ["description", () => t("admin.dataset_field_desc")], ["type", () => t("admin.dataset_field_type")]]],
    ["preview", () => t("admin.dataset_preview"), () => t("admin.dataset_add_preview"), [["value1", () => t("admin.dataset_value1")], ["value2", () => t("admin.dataset_value2")], ["value3", () => t("admin.dataset_value3")], ["value4", () => t("admin.dataset_value4")]]]
  ];

  const adminDatasetSubHtml = (dataset, kind, title, addLabel, columns) => {
    const rows = (dataset.children && dataset.children[kind]) || [];
    const body = rows.map((row, index) => `<div class="admin-subrow" data-ds-row>${columns.map(([name, label]) => `<input data-ds-field="${name}" value="${esc(row[name] || "")}" placeholder="${esc(label())}" aria-label="${esc(label())}">`).join("")}<button class="icon-button" type="button" data-admin-sub-remove="${kind}:${index}" aria-label="${t("admin.sub_remove")}">×</button></div>`).join("");
    return `<div class="field admin-form-grid--wide"><span>${title()} (${rows.length})</span><div class="admin-subtable" data-ds-kind="${kind}">${body}</div><button class="button button--outline button--small" type="button" data-admin-sub-add="${kind}">${addLabel()}</button></div>`;
  };

  const adminDatasetDialog = () => {
    const dataset = adminState.editingDataset;
    if (!dataset) return "";
    const editing = Boolean(adminState.editingDatasetId);
    const mainFields = [
      { name: "id", label: () => t("admin.dataset_id"), required: true, locked: true },
      { name: "type", label: () => t("admin.dataset_type"), required: true },
      { name: "icon", label: () => t("admin.dataset_icon"), required: true },
      { name: "name", label: () => t("admin.field_name"), required: true },
      { name: "access", label: () => t("admin.dataset_access"), type: "select", options: () => [["free", content.labels.datasetAccess ? content.labels.datasetAccess.free : "free"], ["paid", content.labels.datasetAccess ? content.labels.datasetAccess.paid : "paid"]], required: true },
      { name: "access_label", label: () => t("admin.dataset_access_label"), required: true },
      { name: "records", label: () => t("admin.dataset_records"), required: true },
      { name: "files", label: () => t("admin.dataset_files_count"), type: "number", required: true },
      { name: "formats", label: () => t("admin.dataset_formats"), required: true },
      { name: "updated", label: () => t("admin.dataset_updated"), required: true },
      { name: "description", label: () => t("admin.dataset_description"), required: true, wide: true },
      { name: "about", label: () => t("admin.dataset_about"), type: "textarea", required: true, wide: true }
    ];
    return `<div class="request-modal" data-admin-modal><div class="request-modal__backdrop" data-admin-close></div><section class="request-modal__card admin-dialog" role="dialog" aria-modal="true"><div class="request-modal__heading"><div><p class="eyebrow">${t("admin.title")}</p><h2>${editing ? t("admin.row_edit_title", { name: t("admin.family_datasets") }) : t("admin.row_new_title", { name: t("admin.family_datasets") })}</h2></div><button class="icon-button" type="button" data-admin-close aria-label="${t("common.close")}">×</button></div><form class="form-stack admin-form" data-admin-dataset-form data-editing="${editing ? "1" : "0"}" data-row-id="${esc(adminState.editingDatasetId)}"><div class="admin-form-grid">${mainFields.map((field) => adminFieldHtml(field, dataset, editing)).join("")}${adminDatasetSubSpecs.map(([kind, title, addLabel, columns]) => adminDatasetSubHtml(dataset, kind, title, addLabel, columns)).join("")}</div><div class="request-modal__actions"><button class="button button--outline" type="button" data-admin-close>${t("common.cancel")}</button><button class="button button--primary" type="submit">${t("admin.save")}</button></div><p class="status" data-admin-dialog-status aria-live="polite"></p></form></section></div>`;
  };

  const adminDatasetPayloadFrom = (form) => {
    const payload = { children: {} };
    adminDatasetFields.forEach((name) => { payload[name] = String(form.elements[name] ? form.elements[name].value : "").trim(); });
    adminDatasetSubSpecs.forEach(([kind, , , columns]) => {
      payload.children[kind] = [...form.querySelectorAll(`[data-ds-kind="${kind}"] [data-ds-row]`)].map((node) => {
        const row = {};
        columns.forEach(([name]) => {
          const input = node.querySelector(`[data-ds-field="${name}"]`);
          row[name] = input ? input.value.trim() : "";
        });
        return row;
      });
    });
    return payload;
  };

  const collectDatasetDialog = () => {
    const form = document.querySelector("[data-admin-dataset-form]");
    if (!form || !adminState.editingDataset) return;
    adminState.editingDataset = { ...adminState.editingDataset, ...adminDatasetPayloadFrom(form) };
  };

  const adminDatasetsPage = () => {
    const rows = adminState.datasets.map((dataset) => {
      const children = dataset.children || {};
      return `<tr><td><strong>${esc(dataset.name)}</strong><small>${esc(dataset.id)}</small></td><td>${esc(dataset.type)}</td><td>${dataset.access === "paid" ? t("admin.dataset_access_paid") : t("admin.dataset_access_free")}</td><td>${esc(dataset.files)}</td><td>${(children.files || []).length}</td><td>${(children.fields || []).length}</td><td>${(children.preview || []).length}</td><td>${esc(dataset.updated)}</td><td class="admin-actions"><button class="button button--outline button--small" type="button" data-admin-dataset-edit="${esc(dataset.id)}">${t("admin.edit")}</button><button class="button button--outline button--small" type="button" data-admin-dataset-delete="${esc(dataset.id)}">${t("admin.delete")}</button></td></tr>`;
    }).join("");
    const head = [t("admin.col_name"), t("admin.col_type"), t("admin.col_access"), t("admin.dataset_files_count"), t("admin.dataset_file_rows"), t("admin.dataset_field_rows"), t("admin.dataset_preview_rows"), t("admin.dataset_updated"), t("admin.col_actions")].map((label) => `<th>${label}</th>`).join("");
    return `<section class="admin-card"><div class="admin-toolbar"><p>${t("admin.rows_count", { count: adminState.datasets.length, name: t("admin.family_datasets") })} <span class="admin-muted">${t("admin.dataset_placeholder_hint")}</span></p><button class="button button--primary button--small" type="button" data-admin-dataset-new>${t("admin.row_new", { name: t("admin.family_datasets") })}</button></div><div class="table-wrap"><table class="admin-table"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div></section>${adminDatasetDialog()}`;
  };

  const adminStatsPage = () => {
    const stats = adminState.stats;
    if (!stats) return `<section class="admin-card"><p class="empty-panel">${t("admin.stats_empty")}</p></section>`;
    const cards = [
      [t("admin.stats_views"), stats.visits.views],
      [t("admin.stats_visitors"), stats.visits.visitors],
      [t("admin.stats_registrations"), stats.users.registrations],
      [t("admin.stats_logins"), stats.users.logins],
      [t("admin.stats_orders"), stats.orders.created],
      [t("admin.stats_paid"), stats.orders.paid],
      [t("admin.stats_gmv"), moneyCents(stats.orders.gmv_cents)],
      [t("admin.stats_invoices"), stats.invoices.submitted]
    ].map(([label, value]) => `<div class="admin-stat"><span>${label}</span><strong>${esc(String(value))}</strong></div>`).join("");
    const peak = Math.max(1, ...stats.by_day.map((day) => day.views));
    const bars = stats.by_day.map((day) => `<div class="admin-bar" title="${esc(day.date)} · ${day.views}"><div class="admin-bar__fill" style="height:${Math.round((day.views / peak) * 100)}%"></div><span>${esc(day.date.slice(5))}</span></div>`).join("");
    const topPages = stats.top_pages.length ? stats.top_pages.map((page) => `<li><code>${esc(page.path)}</code><span>${page.views}</span></li>`).join("") : `<li class="admin-muted">${t("admin.stats_empty")}</li>`;
    const topTools = stats.top_tools.length ? stats.top_tools.map((tool) => `<li><code>${esc(tool.tool)}</code><span>${tool.opens}</span></li>`).join("") : `<li class="admin-muted">${t("admin.stats_empty")}</li>`;
    return `<section class="admin-card"><div class="admin-toolbar"><p>${t("admin.stats_range", { days: stats.range_days })}</p></div><div class="admin-stat-grid">${cards}</div><h3>${t("admin.stats_by_day")}</h3><div class="admin-bars">${bars}</div><div class="admin-two-col"><div><h3>${t("admin.stats_top_pages")}</h3><ul class="admin-list">${topPages}</ul></div><div><h3>${t("admin.stats_top_tools")}</h3><ul class="admin-list">${topTools}</ul></div></div></section>`;
  };

  const adminSitesPage = () => {
    const sites = adminState.sites || [];
    const runs = adminState.runs || [];
    const siteRows = sites.length ? sites.map((site) => `<tr><td><strong>${esc(site.label)}</strong><small>${esc(site.site_id)}</small></td><td>${esc(site.user_id)}</td><td>${esc(site.tool_code)}</td><td>${esc(site.runs)}</td><td>${site.window_until ? esc(String(site.window_until).replace("T", " ").slice(0, 16)) : t("admin.window_none")}</td><td>${esc(String(site.last_run_at).replace("T", " ").slice(0, 16))}</td></tr>`).join("") : `<tr><td colspan="6" class="admin-muted">${t("admin.sites_empty")}</td></tr>`;
    const runRows = runs.length ? runs.map((run) => `<tr><td>${esc(String(run.created_at).replace("T", " ").slice(0, 19))}</td><td>${esc(run.tool_code)}</td><td>${esc(run.site_id || "-")}</td><td>${run.decision === "covered" ? t("admin.decision_covered") : t("admin.decision_purchase")}</td><td>${esc(run.reason)}</td></tr>`).join("") : `<tr><td colspan="5" class="admin-muted">${t("admin.runs_empty")}</td></tr>`;
    return `<section class="admin-card"><div class="admin-toolbar"><p>${t("admin.sites_count", { count: sites.length })}</p></div><div class="table-wrap"><table class="admin-table"><thead><tr><th>${t("admin.site_col_site")}</th><th>${t("admin.site_col_user")}</th><th>${t("admin.col_tool")}</th><th>${t("admin.col_runs")}</th><th>${t("admin.site_col_window")}</th><th>${t("admin.col_time")}</th></tr></thead><tbody>${siteRows}</tbody></table></div></section><section class="admin-card"><div class="admin-toolbar"><p>${t("admin.runs_title")}</p></div><div class="table-wrap"><table class="admin-table"><thead><tr><th>${t("admin.col_time")}</th><th>${t("admin.col_tool")}</th><th>${t("admin.site_col_site")}</th><th>${t("admin.site_col_decision")}</th><th>${t("admin.site_col_reason")}</th></tr></thead><tbody>${runRows}</tbody></table></div></section>`;
  };
  const adminPoliciesPage = () => {
    const policies = adminState.toolPolicies || [];
    const toolOptions = adminState.tools.map((item) => `<option value="${esc(item.toolCode)}">${esc(item.name)}</option>`).join("");
    const rows = policies.length ? policies.map((policy) => `<tr><td><code>${esc(policy.tool_code)}</code></td><td>${esc(policy.access_mode)}</td><td>${policy.trial_allowed ? t("admin.enabled_on") : t("admin.enabled_off")}</td><td>${esc(policy.maintenance_reason || "—")}</td><td>${policy.enabled ? t("admin.enabled_on") : t("admin.enabled_off")}</td></tr>`).join("") : `<tr><td colspan="5" class="admin-muted">${t("admin.policy_empty")}</td></tr>`;
    return `<section class="admin-card"><div class="admin-toolbar"><p>${t("admin.policy_title")}</p></div><div class="table-wrap"><table class="admin-table"><thead><tr><th>${t("admin.col_tool")}</th><th>${t("admin.policy_mode")}</th><th>${t("admin.policy_trial")}</th><th>${t("admin.policy_reason")}</th><th>${t("admin.col_status")}</th></tr></thead><tbody>${rows}</tbody></table></div><form class="admin-form" data-admin-policy-form><h3>${t("admin.policy_save")}</h3><label class="field">${t("admin.col_tool")}<select name="tool_code" required>${toolOptions}</select></label><label class="field">${t("admin.policy_mode")}<select name="access_mode"><option value="paid">paid</option><option value="preview">preview</option><option value="login_required">login_required</option><option value="public">public</option><option value="maintenance">maintenance</option><option value="disabled">disabled</option></select></label><label class="field">${t("admin.policy_trial")}<select name="trial_allowed"><option value="false">${t("admin.enabled_off")}</option><option value="true">${t("admin.enabled_on")}</option></select></label><label class="field">${t("admin.policy_reason")}<input name="maintenance_reason" maxlength="200"></label><button class="button button--primary button--small" type="submit">${t("admin.save")}</button></form></section>`;
  };
  const adminFeedbackPage = () => {
    const stats = adminState.feedbackStats || {};
    const items = adminState.feedback || [];
    const rows = items.length ? items.map((item) => `<tr><td><code>${esc(item.feedback_id)}</code></td><td>${esc(item.tool_code)}</td><td>${esc(item.rating)}</td><td>${esc(item.detail || "—")}</td><td>${esc(item.status)}</td><td><textarea data-feedback-reply="${esc(item.feedback_id)}" rows="2" maxlength="2000">${esc(item.admin_reply || "")}</textarea></td><td><select data-feedback-status="${esc(item.feedback_id)}"><option value="new"${item.status === "new" ? " selected" : ""}>new</option><option value="reviewing"${item.status === "reviewing" ? " selected" : ""}>reviewing</option><option value="resolved"${item.status === "resolved" ? " selected" : ""}>resolved</option><option value="closed"${item.status === "closed" ? " selected" : ""}>closed</option></select><button class="button button--primary button--small" type="button" data-feedback-save="${esc(item.feedback_id)}">${t("admin.save")}</button></td></tr>`).join("") : `<tr><td colspan="7" class="admin-muted">${t("admin.feedback_empty")}</td></tr>`;
    const cards = [
      [t("admin.feedback_total"), stats.total || 0],
      [t("admin.feedback_resolved"), stats.resolved || 0]
    ].map(([label, value]) => `<div class="admin-stat"><span>${label}</span><strong>${esc(String(value))}</strong></div>`).join("");
    return `<section class="admin-card"><div class="admin-toolbar"><p>${t("admin.feedback_title")}</p></div><div class="admin-stat-grid">${cards}</div><div class="table-wrap"><table class="admin-table"><thead><tr><th>${t("admin.col_id")}</th><th>${t("admin.col_tool")}</th><th>${t("admin.feedback_rating")}</th><th>${t("admin.feedback_detail")}</th><th>${t("admin.col_status")}</th><th>${t("admin.feedback_reply")}</th><th>${t("admin.col_actions")}</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
  };
  const adminCouponsPage = () => {
    const stats = adminState.couponStats || {};
    const batches = adminState.couponBatches || [];
    const coupons = adminState.coupons || [];
    const toolOptions = adminState.tools.map((item) => `<option value="${esc(item.toolCode)}">${esc(item.name)}</option>`).join("");
    const batchOptions = batches.map((batch) => `<option value="${esc(batch.batch_code)}">${esc(batch.batch_code)} · ${esc(batch.name)}</option>`).join("");
    const accountOptions = ((adminState.users && adminState.users.accounts) || []).map((user) => `<option value="${esc(user.id)}">${esc(user.email || user.display_name || user.id)}</option>`).join("");
    const couponStatus = (status) => ({ unused: t("admin.coupon_status_unused"), used: t("admin.coupon_status_used"), expired: t("admin.coupon_status_expired"), void: t("admin.coupon_status_void") }[status] || status);
    const couponTool = (code) => code === "all" ? t("coupon.tool_all") : code;
    const batchRows = batches.length ? batches.map((batch) => `<tr><td><code>${esc(batch.batch_code)}</code></td><td>${esc(batch.name)}</td><td>${esc(batch.tool_scope)}</td><td>${batch.valid_days}</td><td>${batch.per_user_limit || "—"}</td><td>${batch.quota || 1}</td><td>${esc(batch.channel || "—")}</td><td>${batch.status}</td></tr>`).join("") : `<tr><td colspan="8" class="admin-muted">${t("admin.coupon_batches_empty")}</td></tr>`;
    const couponRows = coupons.length ? coupons.map((coupon) => `<tr><td><code>${esc(coupon.coupon_id)}</code><small>${esc(coupon.code || "")}</small></td><td>${esc(coupon.batch_code)}</td><td>${esc(couponTool(coupon.tool_code))}</td><td>${coupon.quota || 1}</td><td>${esc(coupon.user_id || t("admin.coupon_unassigned"))}</td><td>${esc(couponStatus(coupon.status))}</td><td>${esc(coupon.source)}</td><td>${esc(coupon.channel || "—")}</td><td>${esc(String(coupon.expires_at || "").slice(0, 10))}</td><td>${coupon.status === "void" ? "—" : `<button class="button button--outline button--small" type="button" data-admin-coupon-void="${esc(coupon.coupon_id)}">${t("admin.coupon_void")}</button>`}</td></tr>`).join("") : `<tr><td colspan="10" class="admin-muted">${t("admin.coupons_empty")}</td></tr>`;
    const statCards = [
      [t("admin.coupon_total"), stats.total || 0],
      [t("admin.coupon_used"), stats.used || 0],
      [t("admin.coupon_expired"), stats.expired || 0],
      [t("admin.coupon_redemptions"), stats.redemptions || 0]
    ].map(([label, value]) => `<div class="admin-stat"><span>${label}</span><strong>${esc(String(value))}</strong></div>`).join("");
    const sourceRows = Object.entries(stats.by_source || {}).map(([source, count]) => `<li><code>${esc(source)}</code><span>${count}</span></li>`).join("") || `<li class="admin-muted">${t("admin.coupon_source_empty")}</li>`;
    const generated = adminState.generatedCodes || [];
    return `<section class="admin-card"><div class="admin-toolbar"><p>${t("admin.coupon_title")}</p></div><div class="admin-stat-grid">${statCards}</div><div class="admin-two-col"><div><h3>${t("admin.coupon_by_source")}</h3><ul class="admin-list">${sourceRows}</ul></div><div class="admin-forms">${adminCouponForms(toolOptions, batchOptions, accountOptions)}</div></div>${generated.length ? `<section class="admin-card"><h3>${t("admin.coupon_generated")}</h3><button class="button button--outline button--small" type="button" data-admin-coupon-csv>${t("admin.coupon_download_csv")}</button><textarea class="admin-code-box" readonly>${esc(generated.map((item) => item.code).join("\n"))}</textarea></section>` : ""}<h3>${t("admin.coupon_batches_title")}</h3><div class="table-wrap"><table class="admin-table"><thead><tr><th>${t("admin.coupon_col_batch")}</th><th>${t("admin.col_name")}</th><th>${t("admin.coupon_col_scope")}</th><th>${t("admin.coupon_col_days")}</th><th>${t("admin.coupon_col_limit")}</th><th>${t("admin.coupon_col_quota")}</th><th>${t("admin.coupon_col_channel")}</th><th>${t("admin.col_status")}</th></tr></thead><tbody>${batchRows}</tbody></table></div><h3>${t("admin.coupon_list_title")}</h3><div class="table-wrap"><table class="admin-table"><thead><tr><th>${t("admin.coupon_col_id")}</th><th>${t("admin.coupon_col_batch")}</th><th>${t("admin.col_tool")}</th><th>${t("admin.coupon_col_quota")}</th><th>${t("admin.col_user")}</th><th>${t("admin.col_status")}</th><th>${t("admin.coupon_col_source")}</th><th>${t("admin.coupon_col_channel")}</th><th>${t("admin.coupon_col_expires")}</th><th>${t("admin.col_actions")}</th></tr></thead><tbody>${couponRows}</tbody></table></div></section>`;
  };
  const adminCouponForms = (toolOptions, batchOptions, accountOptions) => `
    <form class="admin-form" data-admin-coupon-batch-form>
      <h3>${t("admin.coupon_batch_create")}</h3>
      <label class="field">${t("admin.coupon_col_batch")}<input name="batch_code" maxlength="64" required></label>
      <label class="field">${t("admin.col_name")}<input name="name" maxlength="120" required></label>
      <label class="field">${t("admin.coupon_col_scope")}<select name="tool_scope"><option value="per_tool">per_tool</option><option value="all">all</option></select></label>
      <label class="field">${t("admin.coupon_col_days")}<input name="valid_days" type="number" min="1" value="30"></label>
      <label class="field">${t("admin.coupon_col_limit")}<input name="per_user_limit" type="number" min="0" value="0"></label>
      <label class="field">${t("admin.coupon_col_quota")}<input name="quota" type="number" min="1" max="999" value="1"></label>
      <label class="field">${t("admin.coupon_col_channel")}<input name="channel" maxlength="60" placeholder="${t("admin.coupon_channel_placeholder")}"></label>
      <button class="button button--primary button--small" type="submit">${t("admin.coupon_batch_save")}</button>
    </form>
    <form class="admin-form" data-admin-coupon-issue-form>
      <h3>${t("admin.coupon_issue")}</h3>
      <label class="field">${t("admin.coupon_col_batch")}<select name="batch_code" required>${batchOptions}</select></label>
      <label class="field">${t("admin.col_user")}<select name="account_id" required><option value="">${t("admin.coupon_user_select")}</option>${accountOptions}</select></label>
      <label class="field">${t("admin.col_tool")}<select name="tool_code"><option value="all">${t("coupon.tool_all")}</option>${toolOptions}</select></label>
      <label class="field">${t("admin.coupon_col_source")}<select name="source"><option value="manual">manual</option><option value="compensation">compensation</option></select></label>
      <label class="field">${t("admin.coupon_col_channel")}<input name="channel" maxlength="60" placeholder="${t("admin.coupon_channel_placeholder")}"></label>
      <button class="button button--primary button--small" type="submit">${t("admin.coupon_issue_save")}</button>
    </form>
    <form class="admin-form" data-admin-coupon-generate-form>
      <h3>${t("admin.coupon_generate")}</h3>
      <label class="field">${t("admin.coupon_col_batch")}<select name="batch_code" required>${batchOptions}</select></label>
      <label class="field">${t("admin.coupon_count")}<input name="count" type="number" min="1" max="500" value="1"></label>
      <label class="field">${t("admin.col_tool")}<select name="tool_code"><option value="all">${t("coupon.tool_all")}</option>${toolOptions}</select></label>
      <label class="field">${t("admin.coupon_col_channel")}<input name="channel" maxlength="60" placeholder="${t("admin.coupon_channel_placeholder")}"></label>
      <button class="button button--primary button--small" type="submit">${t("admin.coupon_generate_save")}</button>
    </form>`;
  const adminUsersPage = () => {
    const payload = adminState.users || { accounts: [], total: 0 };
    const rows = (payload.accounts || []).map((user) => `<tr><td>${esc(user.email)}</td><td>${esc(user.display_name || "-")}</td><td>${user.status === "active" ? t("admin.account_active") : t("admin.account_disabled")}</td><td>${user.email_verified ? t("admin.verified_yes") : t("admin.verified_no")}</td><td>${esc(String(user.created_at || "").replace("T", " ").slice(0, 19))}</td></tr>`).join("");
    return `<section class="admin-card"><div class="admin-toolbar"><p>${t("admin.users_count", { count: payload.total || 0 })}</p></div><div class="table-wrap"><table class="admin-table"><thead><tr><th>${t("admin.col_email")}</th><th>${t("admin.col_display_name")}</th><th>${t("admin.col_status")}</th><th>${t("admin.col_email_verified")}</th><th>${t("admin.col_time")}</th></tr></thead><tbody>${rows || `<tr><td colspan="5" class="admin-muted">${t("admin.users_empty")}</td></tr>`}</tbody></table></div></section>`;
  };
  const adminOrdersPage = () => {
    const payload = adminState.orders || { orders: [], total: 0 };
    // Pending orders get a reconcile button: query WeChat and settle if it says SUCCESS.
    const rows = (payload.orders || []).map((order) => `<tr><td>${esc(order.biz_order_no)}</td><td>${esc(order.user_id)}</td><td>${moneyCents(order.amount_cents, order.currency)}</td><td>${esc(content.labels.orderStatus[order.status] || order.status)}</td><td>${esc(String(order.created_at || "").replace("T", " ").slice(0, 19))}</td><td>${order.status === "pending" ? `<button class="button button--outline button--small" type="button" data-admin-order-reconcile="${esc(order.biz_order_no)}">${t("admin.order_reconcile")}</button>` : ""}</td></tr>`).join("");
    return `<section class="admin-card"><div class="admin-toolbar"><p>${t("admin.orders_count", { count: payload.total || 0 })}</p></div><div class="table-wrap"><table class="admin-table"><thead><tr><th>${t("admin.col_order_no")}</th><th>${t("admin.col_user")}</th><th>${t("admin.col_amount")}</th><th>${t("admin.col_status")}</th><th>${t("admin.col_time")}</th><th>${t("admin.invoice_col_actions")}</th></tr></thead><tbody>${rows || `<tr><td colspan="6" class="admin-muted">${t("admin.orders_empty")}</td></tr>`}</tbody></table></div></section>`;
  };
  const adminInvoicesPage = () => {
    const payload = adminState.invoices || { invoices: [], total: 0 };
    const rows = (payload.invoices || []).map((invoice) => `<tr><td><strong>${esc(invoice.biz_order_no)}</strong><small>${esc(invoice.invoice_id)}</small></td><td>${esc(invoice.profile?.title || "-")}<small>${esc(invoice.profile?.tax_no || "")}</small></td><td>${esc(invoice.user_id)}</td><td>${moneyCents(invoice.amount_cents)}</td><td>${esc(content.labels.invoiceStatus[invoice.status] || invoice.status)}</td><td><input data-admin-invoice-no="${esc(invoice.invoice_id)}" value="${esc(invoice.invoice_no || "")}" placeholder="${t("admin.invoice_no_placeholder")}" maxlength="60"><input data-admin-invoice-url="${esc(invoice.invoice_id)}" value="${esc(invoice.download_url || "")}" placeholder="${t("admin.invoice_url_placeholder")}" maxlength="300"></td><td><button class="button button--outline button--small" type="button" data-admin-invoice-action="reviewing" data-invoice-id="${esc(invoice.invoice_id)}">${t("admin.invoice_review")}</button><button class="button button--primary button--small" type="button" data-admin-invoice-action="issued" data-invoice-id="${esc(invoice.invoice_id)}">${t("admin.invoice_issue")}</button><button class="button button--outline button--small" type="button" data-admin-invoice-action="rejected" data-invoice-id="${esc(invoice.invoice_id)}">${t("admin.invoice_reject")}</button></td></tr>`).join("");
    return `<section class="admin-card"><div class="admin-toolbar"><p>${t("admin.invoices_count", { count: payload.total || 0 })}</p></div><div class="table-wrap"><table class="admin-table"><thead><tr><th>${t("admin.col_order_no")}</th><th>${t("admin.invoice_col_title")}</th><th>${t("admin.col_user")}</th><th>${t("admin.col_amount")}</th><th>${t("admin.col_status")}</th><th>${t("admin.invoice_col_no")}</th><th>${t("admin.invoice_col_actions")}</th></tr></thead><tbody>${rows || `<tr><td colspan="7" class="admin-muted">${t("admin.invoices_empty")}</td></tr>`}</tbody></table></div></section>`;
  };
  const adminRefundsPage = () => {
    const payload = adminState.refunds || { refunds: [], total: 0 };
    const rows = (payload.refunds || []).map((refund) => `<tr><td><strong>${esc(refund.biz_order_no)}</strong><small>${esc(refund.refund_id)}</small></td><td>${esc(refund.user_id)}</td><td>${moneyCents(refund.amount_cents)}</td><td>${esc(refund.reason)}</td><td>${esc((content.labels.refundStatus || {})[refund.status] || refund.status)}</td><td><input data-admin-refund-note="${esc(refund.refund_id)}" value="${esc(refund.note || "")}" placeholder="${t("admin.refund_note_placeholder")}" maxlength="200"></td><td><button class="button button--primary button--small" type="button" data-admin-refund-action="approved" data-refund-id="${esc(refund.refund_id)}">${t("admin.refund_approve")}</button><button class="button button--outline button--small" type="button" data-admin-refund-action="refunded" data-refund-id="${esc(refund.refund_id)}">${t("admin.refund_done")}</button><button class="button button--outline button--small" type="button" data-admin-refund-action="rejected" data-refund-id="${esc(refund.refund_id)}">${t("admin.refund_reject")}</button></td></tr>`).join("");
    return `<section class="admin-card"><div class="admin-toolbar"><p>${t("admin.refunds_count", { count: payload.total || 0 })}</p></div><div class="table-wrap"><table class="admin-table"><thead><tr><th>${t("admin.col_order_no")}</th><th>${t("admin.col_user")}</th><th>${t("admin.col_amount")}</th><th>${t("admin.refund_col_reason")}</th><th>${t("admin.col_status")}</th><th>${t("admin.refund_col_note")}</th><th>${t("admin.invoice_col_actions")}</th></tr></thead><tbody>${rows || `<tr><td colspan="7" class="admin-muted">${t("admin.refunds_empty")}</td></tr>`}</tbody></table></div></section>`;
  };
  function admin(view = "tools") {
    if (adminState.session === "disabled") return adminShell(view, `<section class="admin-card"><p class="empty-panel">${t("admin.disabled")}</p></section>`);
    if (adminState.session === null) {
      hydrateAdminSession();
      return adminShell(view, `<section class="admin-card"><p class="empty-panel">${t("admin.loading")}</p></section>`);
    }
    if (adminState.session === false) return adminLogin();
    if (!adminState.loaded) {
      loadAdminContent();
      return adminShell(view, `<section class="admin-card"><p class="empty-panel">${t("admin.loading")}</p></section>`);
    }
    const inner = view === "tags" ? adminTagsPage()
      : view === "stats" ? adminStatsPage()
      : view === "sites" ? adminSitesPage()
      : view === "users" ? adminUsersPage()
      : view === "orders" ? adminOrdersPage()
      : view === "invoices" ? adminInvoicesPage()
      : view === "refunds" ? adminRefundsPage()
      : view === "coupons" ? adminCouponsPage()
      : view === "feedback" ? adminFeedbackPage()
      : view === "policies" ? adminPoliciesPage()
      : view === "datasets" ? adminDatasetsPage()
      : adminFamilyMeta[view] ? adminFamilyPage(view)
      : adminToolsPage();
    return adminShell(view, inner);
  }

  function render() {
    const current = route();
    const item = routeTool();
    const params = query();
    closeAccountMenu();
    if (current !== "register") authRegisterDone = false;
    if (current !== "login" && current !== "register" && current !== "forgot") authWaySession = "";
    if (state.session && (current === "login" || (current === "register" && !authRegisterDone))) {
      window.location.hash = "#account";
      return;
    }
    if ((current === "login" || current === "register") && params.get("wechat") === "error") {
      showToast(t("auth.wechat_error"));
      window.location.hash = current === "register" ? "#register" : "#login";
      return;
    }
    if ((current === "login" || current === "register") && params.get("wechat") === "unbound") {
      showToast(t("auth.wechat_unbound_lede"));
      window.location.hash = "#login";
      return;
    }
    document.documentElement.dataset.page = current === "pricing" ? "pricing" : item ? "tool" : "";
    if (current === "tools" && params.get("tag")) { const value = params.get("tag"); state.filters = tags.some((entry) => entry.key === value) ? [value] : []; }
    if (current === "home") app.innerHTML = home();
    else if (current === "tools") app.innerHTML = toolsPage();
    else if (current === "requests") app.innerHTML = requestsPage();
    else if (current === "datasets") app.innerHTML = datasetsPage();
    else if (routeDataset()) app.innerHTML = datasetDetail(routeDataset());
    else if (item) app.innerHTML = detail(item);
    else if (current === "pricing") app.innerHTML = pricing();
    else if (current === "help") app.innerHTML = help();
    else if (current === "about") app.innerHTML = about();
    else if (current === "verify") app.innerHTML = verifyPage();
    else if (current === "register" && authRegisterDone) { /* keep the sign-up-done card */ }
    else if (current === "login" || current === "register" || current === "forgot") app.innerHTML = auth(current);
    else if (current.startsWith("account")) app.innerHTML = account(current.split("/")[1] || "overview");
    else if (current === "admin" || current.startsWith("admin/")) app.innerHTML = admin(current.split("/")[1] || "tools");
    else if (current === "privacy") app.innerHTML = legal(true);
    else if (current === "terms") app.innerHTML = legal(false);
    else app.innerHTML = home();
    if (item) { hydrateToolAccess(item); hydrateToolActivity(item.toolCode); hydrateToolFeedback(item.toolCode); hydrateDetailPay(item); }
    // Keep the authentication and about hero hierarchy identical to the reference layout:
    // the page title is the first visible heading, without a duplicated brand eyebrow.
    if (current === "about") document.querySelector(".about-hero__copy > .eyebrow")?.remove();
    if (current === "login" || current === "register" || current === "forgot" || current === "verify") document.querySelector(".auth-card > .eyebrow")?.remove();
    if (current === "login" || current === "register" || current === "forgot") {
      const label = current === "register" ? t("auth.register_title") : current === "forgot" ? t("auth.forgot_title") : t("auth.login_title");
      document.title = `${label} · ${content.site.brand || "FigHub"}`;
      initAuthQr();
    }
    if (current === "about") {
      const sectionTitles = [t("about.section_mission"), t("about.section_features"), t("about.section_commitments")];
      document.querySelectorAll(".about-page .about-section__heading h2").forEach((heading, index) => {
        if (sectionTitles[index]) heading.textContent = sectionTitles[index];
      });
      const story = document.querySelector(".about-story");
      if (story) {
        const storyHeading = story.querySelector("h2");
        if (storyHeading) storyHeading.textContent = t("about.story.eyebrow");
        story.querySelectorAll("p:not(.eyebrow), .story-note, .story-close, .story-steps").forEach((node) => node.remove());
        const steps = document.createElement("div");
        steps.className = "story-steps";
        steps.innerHTML = `<article><span class="story-step__index">01</span><div><h3>${t("about.story.step1_title")}</h3><p>${t("about.story.step1_desc")}</p></div></article><article><span class="story-step__index">02</span><div><h3>${t("about.story.step2_title")}</h3><p>${t("about.story.step2_desc")}</p></div></article><article><span class="story-step__index">03</span><div><h3>${t("about.story.step3_title")}</h3><p>${t("about.story.step3_desc")}</p></div></article>`;
        story.append(steps);
      }
      const contactHeading = document.querySelector(".about-contact h2");
      if (contactHeading) contactHeading.textContent = t("about.contact.heading");
      const featureIcons = ["target", "globe", "route", "expand"];
      const valueIcons = ["target", "route", "globe"];
      document.querySelectorAll(".about-value").forEach((card, index) => {
        if (!card.querySelector(".value-icon")) {
          const iconNode = document.createElement("span");
          iconNode.className = "value-icon";
          iconNode.innerHTML = icon(valueIcons[index] || "layers");
          iconNode.setAttribute("aria-hidden", "true");
          card.prepend(iconNode);
        }
      });
      document.querySelectorAll(".about-feature").forEach((card, index) => {
        if (!card.querySelector(".feature-icon")) {
          const iconNode = document.createElement("span");
          iconNode.className = "feature-icon";
          iconNode.innerHTML = icon(featureIcons[index] || "layers");
          iconNode.setAttribute("aria-hidden", "true");
          card.prepend(iconNode);
        }
      });
      const commitmentGrid = document.querySelector(".about-commitment-grid");
      if (commitmentGrid && !commitmentGrid.querySelector("[data-commitment=delivery]")) {
        commitmentGrid.insertAdjacentHTML("beforeend", '<article class="about-commitment" data-commitment="delivery"><span class="commitment-icon" aria-hidden="true">' + icon("badge-check") + `</span><div><h3>${t("about.commitment4_title")}</h3><p>${t("about.commitment4_desc")}</p></div></article>`);
      }
      const commitmentIcons = ["shield-check", "refresh", "eye", "badge-check"];
      document.querySelectorAll(".about-commitment").forEach((card, index) => {
        if (!card.querySelector(".commitment-icon")) {
          const iconNode = document.createElement("span");
          iconNode.className = "commitment-icon";
          iconNode.innerHTML = icon(commitmentIcons[index] || "badge-check");
          iconNode.setAttribute("aria-hidden", "true");
          card.prepend(iconNode);
        }
      });
    }
    if (current === "home") {
      const reasonSection = document.querySelector(".hero")?.nextElementSibling;
      const reasonHeading = reasonSection?.querySelector(".section-heading");
      if (reasonSection && reasonHeading) {
        reasonSection.classList.add("reason-section");
        reasonHeading.querySelector("h2").textContent = t("home.why.eyebrow");
        reasonHeading.querySelector("p:last-of-type").textContent = t("home.why.lede_final");
        reasonHeading.querySelector(".text-link")?.remove();
        const reasons = [
          ["shield-check", t("home.why.reason1_title"), t("home.why.reason1_desc")],
          ["layers", t("home.why.reason2_title"), t("home.why.reason2_desc")],
          ["file-check", t("home.why.reason3_title"), t("home.why.reason3_desc")],
          ["wallet", t("home.why.reason4_title"), t("home.why.reason4_desc")]
        ];
        reasonSection.querySelectorAll(".category-card").forEach((card, index) => {
          const item = reasons[index];
          if (!item) { card.remove(); return; }
          card.removeAttribute("href");
          card.classList.add("reason-card");
          card.querySelector(".category-icon").innerHTML = icon(item[0]);
          card.querySelector("strong").textContent = item[1];
          card.querySelector("span:last-child").textContent = item[2];
        });
        const popularSection = reasonSection.nextElementSibling;
        if (popularSection) {
          const categorySection = document.createElement("section");
          categorySection.className = "section category-section";
          categorySection.innerHTML = `<div class="container"><div class="section-heading"><div><h2>${t("home.tags.title")}</h2><p>${t("home.tags.lede")}</p></div></div><div class="category-grid">` + tags.map((item) => `<article class="category-card"><span class="category-icon" aria-hidden="true">${icon(item.icon)}</span><strong>${item.name}</strong><span>${item.description}</span></article>`).join("") + `</div></div>`;
          popularSection.before(categorySection);
          popularSection.classList.add("popular-section");
          const popularHeading = popularSection.querySelector(".section-heading");
          if (popularHeading) {
            popularHeading.querySelector("h2").textContent = t("home.popular.eyebrow");
            const subtitle = document.createElement("p");
            subtitle.textContent = t("home.popular.lede");
            popularHeading.querySelector("h2").after(subtitle);
          }
        }
      }
    }
    const activeNav = current === "tools" || item ? "tools" : current === "datasets" || routeDataset() ? "datasets" : current === "requests" ? "requests" : current.startsWith("account") ? "account" : current;
    document.querySelectorAll("[data-nav]").forEach((node) => node.classList.toggle("is-active", node.dataset.nav === activeNav));
    applyTheme(activeTheme, false);
    if (current === "pricing") hydratePricing();
    if (current.startsWith("account")) hydrateAccount(current.split("/")[1] || "overview");
    closeNavDrawer();
    window.scrollTo(0, 0);
    if (current === "about" && params.get("section") === "contact") window.setTimeout(() => document.querySelector("#contact")?.scrollIntoView(), 0);
    if (current === "pricing" && params.get("to")) {
      const anchors = { tools: "[data-pricing-products]", pro: "[data-pricing-pro]", share: "[data-pricing-share]", rules: "[data-pricing-rules]" };
      const selector = anchors[params.get("to")];
      if (selector) window.setTimeout(() => document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    }
    syncVerifyBar();
    trackRoute();
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-account-trigger]")) {
      // The avatar is a menu toggle only when signed in; signed out this must
      // fall through so the link can actually open the login card.
      const host = document.querySelector("[data-header-account]");
      if (host && host.classList.contains("is-authed")) {
        event.preventDefault();
        toggleAccountMenu();
      }
      return;
    }
    if (event.target.closest("[data-account-menu]")) {
      const link = event.target.closest("a.account-menu__item");
      if (link) closeAccountMenu();
      return;
    }
    if (event.target.closest("[data-nav-toggle]")) {
      const drawer = navDrawerNode();
      if (drawer && !drawer.hidden) closeNavDrawer(); else openNavDrawer();
      return;
    }
    if (event.target.closest("[data-nav-close]")) { closeNavDrawer(); return; }
    if (event.target.closest(".site-drawer__nav a")) closeNavDrawer();
    const themeToggle = event.target.closest("[data-theme-toggle]");
    if (themeToggle) { applyTheme(activeTheme === "dark" ? "light" : "dark"); return; }
    const adminNav = event.target.closest("[data-admin-nav]");
    if (adminNav) { window.location.hash = `#admin/${adminNav.dataset.adminNav}`; return; }
    const adminOrderReconcile = event.target.closest("[data-admin-order-reconcile]");
    if (adminOrderReconcile) {
      const orderNo = adminOrderReconcile.dataset.adminOrderReconcile;
      adminState.error = "";
      adminState.message = t("admin.order_reconcile_running");
      adminOrderReconcile.disabled = true;
      apiRequest(`/api/admin/orders/${encodeURIComponent(orderNo)}/reconcile`, { method: "POST", body: "{}" })
        .then((order) => {
          adminState.message = order && order.status === "paid" ? t("admin.order_reconcile_paid") : t("admin.order_reconcile_pending");
          loadAdminContent();
        })
        .catch((error) => { adminState.error = error.message || t("admin.order_reconcile_failed"); render(); });
      return;
    }
    const invoiceAction = event.target.closest("[data-admin-invoice-action]");
    if (invoiceAction) {
      const invoiceId = invoiceAction.dataset.invoiceId;
      const action = invoiceAction.dataset.adminInvoiceAction;
      const selector = (attribute) => `[${attribute}="${window.CSS && CSS.escape ? CSS.escape(invoiceId) : invoiceId}"]`;
      const numberInput = document.querySelector(selector("data-admin-invoice-no"));
      const urlInput = document.querySelector(selector("data-admin-invoice-url"));
      const payload = { status: action };
      if (numberInput && numberInput.value.trim()) payload.invoice_no = numberInput.value.trim();
      if (urlInput && urlInput.value.trim()) payload.download_url = urlInput.value.trim();
      adminState.error = "";
      apiRequest(`/api/admin/invoices/${encodeURIComponent(invoiceId)}`, { method: "POST", body: JSON.stringify(payload) })
        .then(() => { adminState.message = t("admin.invoice_updated"); loadAdminContent(); })
        .catch((error) => { adminState.error = error.message || t("admin.invoice_failed"); render(); });
      return;
    }
    const refundAction = event.target.closest("[data-admin-refund-action]");
    if (refundAction) {
      const refundId = refundAction.dataset.refundId;
      const noteInput = document.querySelector(`[data-admin-refund-note="${window.CSS && CSS.escape ? CSS.escape(refundId) : refundId}"]`);
      adminState.error = "";
      apiRequest(`/api/admin/refunds/${encodeURIComponent(refundId)}`, {
        method: "POST",
        body: JSON.stringify({ status: refundAction.dataset.adminRefundAction, note: noteInput ? noteInput.value.trim() : "" })
      })
        .then(() => { adminState.message = t("admin.refund_updated"); loadAdminContent(); })
        .catch((error) => { adminState.error = error.message || t("admin.refund_failed"); render(); });
      return;
    }
    const couponVoid = event.target.closest("[data-admin-coupon-void]");
    if (couponVoid) {
      if (!window.confirm(t("admin.coupon_void_confirm"))) return;
      adminState.error = "";
      apiRequest(`/api/admin/coupons/${encodeURIComponent(couponVoid.dataset.adminCouponVoid)}/void`, { method: "POST", body: "{}" })
        .then(() => { adminState.message = t("admin.coupon_voided"); loadAdminContent(); })
        .catch((error) => { adminState.error = error.message || t("admin.save_failed"); render(); });
      return;
    }
    const couponCsv = event.target.closest("[data-admin-coupon-csv]");
    if (couponCsv) {
      const codes = adminState.generatedCodes || [];
      if (!codes.length) return;
      const csvValue = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
      const rows = codes.map((item) => [item.batch_code, item.channel || "", item.tool_code, item.code].map(csvValue).join(","));
      const blob = new Blob([["batch_code,channel,tool_code,code", ...rows].join("\r\n") + "\r\n"], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `coupons-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      return;
    }
    const feedbackSave = event.target.closest("[data-feedback-save]");
    if (feedbackSave) {
      const id = feedbackSave.dataset.feedbackSave;
      const reply = document.querySelector(`[data-feedback-reply="${CSS.escape(id)}"]`);
      const status = document.querySelector(`[data-feedback-status="${CSS.escape(id)}"]`);
      adminState.error = "";
      apiRequest(`/api/admin/feedback/${encodeURIComponent(id)}`, {
        method: "POST",
        body: JSON.stringify({
          status: status ? status.value : "new",
          admin_reply: reply ? reply.value : ""
        })
      })
        .then(() => { adminState.message = t("admin.feedback_saved"); loadAdminContent(); })
        .catch((error) => { adminState.error = error.message || t("admin.save_failed"); render(); });
      return;
    }
    if (event.target.closest("[data-admin-logout]")) {
      apiRequest("/api/admin/logout", { method: "POST" }).catch(() => { /* the session is dropped locally either way */ }).then(() => {
        adminState.session = false;
        adminState.loaded = false;
        adminState.tools = [];
        adminState.tags = [];
        adminState.changes = [];
        adminState.stats = null;
        adminState.editing = null;
        adminState.editingTag = null;
        adminState.message = "";
        adminState.error = "";
        render();
      });
      return;
    }
    if (event.target.closest("[data-admin-close]")) { adminState.editing = null; adminState.editingTag = null; render(); return; }
    if (event.target.closest("[data-admin-tool-new]")) {
      adminState.editing = { slug: "", tool_code: "", route: "", name: "", subtitle: "", tags: "", form: "tool", billing: "free", available: "true", featured: "true", sort: String(adminState.tools.length + 1), image: "", video: "", gallery: "", sample_files: "", input_summary: "", output_summary: "", capabilities: "" };
      render();
      return;
    }
    const adminToolEdit = event.target.closest("[data-admin-tool-edit]");
    if (adminToolEdit) {
      const entry = adminState.tools.find((item) => item.slug === adminToolEdit.dataset.adminToolEdit);
      if (entry) { adminState.editing = { ...entry }; render(); }
      return;
    }
    const adminToolDelete = event.target.closest("[data-admin-tool-delete]");
    if (adminToolDelete) {
      if (!window.confirm(t("admin.delete_confirm"))) return;
      const slug = adminToolDelete.dataset.adminToolDelete;
      adminState.error = "";
      apiRequest(`/api/admin/tools/${encodeURIComponent(slug)}`, { method: "DELETE" })
        .then(() => { adminState.message = t("admin.saved"); adminState.editing = null; loadAdminContent(); })
        .catch((error) => { adminState.error = error.message || t("admin.save_failed"); render(); });
      return;
    }
    const adminMove = event.target.closest("[data-admin-move]");
    if (adminMove) {
      const [slug, direction] = adminMove.dataset.adminMove.split(":");
      const slugs = adminState.tools.map((item) => item.slug);
      const index = slugs.indexOf(slug);
      const target = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || target < 0 || target >= slugs.length) return;
      [slugs[index], slugs[target]] = [slugs[target], slugs[index]];
      adminState.error = "";
      apiRequest("/api/admin/tools/reorder", { method: "POST", body: JSON.stringify({ slugs }) })
        .then(() => { adminState.message = t("admin.saved"); loadAdminContent(); })
        .catch((error) => { adminState.error = error.message || t("admin.save_failed"); render(); });
      return;
    }
    const adminFeatured = event.target.closest("[data-admin-featured]");
    if (adminFeatured) {
      const entry = adminState.tools.find((item) => item.slug === adminFeatured.dataset.adminFeatured);
      if (!entry) return;
      adminState.error = "";
      apiRequest(`/api/admin/tools/${encodeURIComponent(entry.slug)}`, { method: "PATCH", body: JSON.stringify({ ...entry, featured: adminFeatured.checked }) })
        .then(() => { adminState.message = t("admin.saved"); loadAdminContent(); })
        .catch((error) => { adminFeatured.checked = !adminFeatured.checked; adminState.error = error.message || t("admin.save_failed"); render(); });
      return;
    }
    const adminToggle = event.target.closest("[data-admin-toggle]");
    if (adminToggle) {
      const [slug, field] = adminToggle.dataset.adminToggle.split(":");
      const entry = adminState.tools.find((item) => item.slug === slug);
      if (!entry || field !== "available") return;
      adminState.error = "";
      apiRequest(`/api/admin/tools/${encodeURIComponent(slug)}`, { method: "PATCH", body: JSON.stringify({ ...entry, available: entry.available !== "true" }) })
        .then(() => { adminState.message = t("admin.saved"); loadAdminContent(); })
        .catch((error) => { adminState.error = error.message || t("admin.save_failed"); render(); });
      return;
    }
    if (event.target.closest("[data-admin-tag-new]")) { adminState.editingTag = { key: "", icon: "layers", name: "", description: "" }; render(); return; }
    const adminTagEdit = event.target.closest("[data-admin-tag-edit]");
    if (adminTagEdit) {
      const entry = adminState.tags.find((item) => item.key === adminTagEdit.dataset.adminTagEdit);
      if (entry) { adminState.editingTag = { ...entry }; render(); }
      return;
    }
    const adminTagDelete = event.target.closest("[data-admin-tag-delete]");
    if (adminTagDelete) {
      if (!window.confirm(t("admin.delete_confirm"))) return;
      const key = adminTagDelete.dataset.adminTagDelete;
      adminState.error = "";
      apiRequest(`/api/admin/tags/${encodeURIComponent(key)}`, { method: "DELETE" })
        .then(() => { adminState.message = t("admin.saved"); adminState.editingTag = null; loadAdminContent(); })
        .catch((error) => { adminState.error = error.message || t("admin.save_failed"); render(); });
      return;
    }
    const rowNew = event.target.closest("[data-admin-row-new]");
    if (rowNew) {
      const family = rowNew.dataset.adminRowNew;
      const meta = adminFamilyMeta[family];
      if (meta) { adminState.editingRow = meta.blank(); adminState.editingRowId = ""; render(); }
      return;
    }
    const rowEdit = event.target.closest("[data-admin-row-edit]");
    if (rowEdit) {
      const [family, ...rest] = rowEdit.dataset.adminRowEdit.split(":");
      const id = rest.join(":");
      const entry = (adminState.rows[family] || []).find((row) => adminRowId(family, row) === id);
      if (entry) { adminState.editingRow = { ...entry }; adminState.editingRowId = id; render(); }
      return;
    }
    const rowDelete = event.target.closest("[data-admin-row-delete]");
    if (rowDelete) {
      if (!window.confirm(t("admin.delete_confirm"))) return;
      const [family, ...rest] = rowDelete.dataset.adminRowDelete.split(":");
      const id = rest.join(":");
      adminState.error = "";
      apiRequest(`/api/admin/content/${family}/${encodeURIComponent(id)}`, { method: "DELETE" })
        .then(() => { adminState.message = t("admin.saved"); adminState.editingRow = null; adminState.editingRowId = ""; loadAdminContent(); })
        .catch((error) => { adminState.error = error.message || t("admin.save_failed"); render(); });
      return;
    }
    const rowMove = event.target.closest("[data-admin-row-move]");
    if (rowMove) {
      const [family, id, direction] = rowMove.dataset.adminRowMove.match(/^([^:]+):(.+):(up|down)$/)?.slice(1) || [];
      const rows = adminState.rows[family];
      if (!rows) return;
      const ids = rows.map((row) => adminRowId(family, row));
      const index = ids.indexOf(id);
      const target = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || target < 0 || target >= ids.length) return;
      [ids[index], ids[target]] = [ids[target], ids[index]];
      adminState.error = "";
      apiRequest(`/api/admin/content/${family}/reorder`, { method: "POST", body: JSON.stringify({ ids }) })
        .then(() => { adminState.message = t("admin.saved"); loadAdminContent(); })
        .catch((error) => { adminState.error = error.message || t("admin.save_failed"); render(); });
      return;
    }
    if (event.target.closest("[data-admin-dataset-new]")) {
      adminState.editingDataset = { children: { files: [], fields: [], preview: [] }, access: "free", icon: "database" };
      adminState.editingDatasetId = "";
      render();
      return;
    }
    const datasetEdit = event.target.closest("[data-admin-dataset-edit]");
    if (datasetEdit) {
      const entry = adminState.datasets.find((dataset) => dataset.id === datasetEdit.dataset.adminDatasetEdit);
      if (entry) {
        adminState.editingDataset = JSON.parse(JSON.stringify({ ...entry, children: entry.children || { files: [], fields: [], preview: [] } }));
        adminState.editingDatasetId = entry.id;
        render();
      }
      return;
    }
    const datasetDelete = event.target.closest("[data-admin-dataset-delete]");
    if (datasetDelete) {
      if (!window.confirm(t("admin.delete_confirm"))) return;
      const id = datasetDelete.dataset.adminDatasetDelete;
      adminState.error = "";
      apiRequest(`/api/admin/datasets/${encodeURIComponent(id)}`, { method: "DELETE" })
        .then(() => { adminState.message = t("admin.saved"); adminState.editingDataset = null; loadAdminContent(); })
        .catch((error) => { adminState.error = error.message || t("admin.save_failed"); render(); });
      return;
    }
    const subAdd = event.target.closest("[data-admin-sub-add]");
    if (subAdd) {
      collectDatasetDialog();
      const kind = subAdd.dataset.adminSubAdd;
      if (adminState.editingDataset?.children?.[kind]) { adminState.editingDataset.children[kind].push({}); render(); }
      return;
    }
    const subRemove = event.target.closest("[data-admin-sub-remove]");
    if (subRemove) {
      collectDatasetDialog();
      const [kind, index] = subRemove.dataset.adminSubRemove.split(":");
      const rows = adminState.editingDataset?.children?.[kind];
      if (rows) { rows.splice(Number(index), 1); render(); }
      return;
    }
    const headerSearch = event.target.closest(".header-search");
    if (headerSearch) {
      if (route() === "tools") { const input = document.querySelector("#tools-search"); input.focus(); input.select(); }
      else { searchFocusPending = true; window.location.hash = "#tools"; }
      return;
    }
    const shareOpen = event.target.closest("[data-share-open]");
    if (shareOpen) { closeNavDrawer(); openShare(shareOpen); return; }
    const shareClose = event.target.closest("[data-share-close]");
    if (shareClose) { closeShare(); return; }
    const sharePlatform = event.target.closest("[data-share-platform]");
    if (sharePlatform) {
      event.preventDefault();
      copyText(shareLink()).then((copied) => showToast(copied ? t("share.copied_wechat") : shareLink()));
      return;
    }
    const securityOpen = event.target.closest("[data-security-open]");
    if (securityOpen) {
      event.preventDefault();
      const dialog = document.querySelector(`[data-security-dialog="${securityOpen.dataset.securityOpen}"]`);
      if (dialog) {
        dialog.hidden = false;
        dialog.querySelector("input")?.focus();
      }
      return;
    }
    if (event.target.closest("[data-security-close]")) {
      document.querySelectorAll("[data-security-dialog]").forEach((dialog) => { dialog.hidden = true; });
      return;
    }
    const authExchange = event.target.closest("[data-auth-exchange]");
    if (authExchange) { switchAuthWay(authExchange.dataset.authExchange); return; }
    if (event.target.closest("[data-auth-switch-account]")) {
      storageSet(AUTH_ACCOUNT_KEY, "");
      switchAuthWay("email");
      const input = document.querySelector("[data-auth-panel=email] input[name=email]");
      if (input) input.focus();
      return;
    }
    const doneSend = event.target.closest("[data-register-done-send]");
    if (doneSend) {
      const form = doneSend.closest("[data-register-done-form]");
      const status = form ? form.querySelector("[data-register-done-status]") : null;
      const email = form ? String(new FormData(form).get("email") || "").trim() : "";
      if (!email) { if (status) { status.className = "status is-error"; status.textContent = t("auth.error_required"); } return; }
      if (status) { status.className = "status"; status.textContent = t("pricing.loading"); }
      apiRequest("/api/me/email/start", { method: "POST", body: JSON.stringify({ email }) })
        .then(() => { if (status) { status.className = "status is-success"; status.textContent = t("account.email_bind_sent"); } })
        .catch((error) => { if (status) { status.className = "status is-error"; status.textContent = error.message || t("auth.error_email"); } });
      return;
    }
    if (event.target.closest("[data-register-done-skip]")) {
      const form = document.querySelector("[data-register-done-form]");
      authRegisterDone = false;
      goToReturnPath(form ? form.dataset.next : "/#home");
      return;
    }
    if (event.target.closest("[data-wechat-unbind]")) {
      if (state.profileHasPassword === false) { showToast(t("account.wechat_unbind_guard")); return; }
      const dialog = document.querySelector('[data-security-dialog="wechat"]');
      if (dialog) dialog.hidden = false;
      return;
    }
    if (event.target.closest("[data-wechat-unbind-confirm]")) {
      const status = document.querySelector("[data-wechat-unbind-status]");
      if (status) { status.className = "status"; status.textContent = t("pricing.loading"); }
      apiRequest("/api/me/wechat/unbind", { method: "POST", body: "{}" })
        .then(async () => { showToast(t("account.wechat_unbind_success")); await hydrateAccount("security"); })
        .catch((error) => {
          if (status) { status.className = "status is-error"; status.textContent = error.message || t("account.wechat_unbind_guard"); }
          else showToast(error.message || t("account.wechat_unbind_guard"));
        });
      return;
    }
    const setupSend = event.target.closest("[data-password-setup-send]");
    if (setupSend) {
      const form = setupSend.closest("[data-password-setup-card]");
      const status = form ? form.querySelector("[data-password-setup-status]") : null;
      if (status) { status.className = "status"; status.textContent = t("pricing.loading"); }
      apiRequest("/api/me/password/setup/start", { method: "POST", body: "{}" })
        .then(() => { if (status) { status.className = "status is-success"; status.textContent = t("account.email_bind_sent"); } })
        .catch((error) => { if (status) { status.className = "status is-error"; status.textContent = error.message || t("account.password_setup_need_email"); } });
      return;
    }
    const emailBindSend = event.target.closest("[data-email-bind-send]");
    if (emailBindSend) {
      const form = emailBindSend.closest("[data-email-bind-form]");
      const status = form ? form.querySelector("[data-email-bind-status]") : null;
      const email = form ? String(new FormData(form).get("email") || "").trim() : "";
      if (status) { status.className = "status"; status.textContent = t("pricing.loading"); }
      apiRequest("/api/me/email/start", { method: "POST", body: JSON.stringify({ email }) })
        .then(() => { if (status) { status.className = "status is-success"; status.textContent = t("account.email_bind_sent"); } })
        .catch((error) => {
          if (status) { status.className = "status is-error"; status.textContent = error.message || t("auth.error_email"); }
        });
      return;
    }
    if (event.target.closest("[data-wechat-bind]")) { startWechatBind(); return; }
    if (event.target.closest("[data-qr-action]")) { closeQrModal(); return; }
    if (event.target.closest("[data-qr-close]")) { closeQrModal(); return; }
    const qrRefresh = event.target.closest("[data-qr-refresh], [data-qr-expired]");
    if (qrRefresh) {
      const action = qrRefresh.dataset.qrAction;
      const target = qrRefresh.dataset.qrTarget || "";
      if (action === "login") startWechatQrLogin(target);
      else if (action === "pay" && target) resumeOrderPayment(target);
      else if (action === "bind") startWechatBind();
      else if (action === "register-refresh") startWechatRegister(target);
      else if (action === "register" && target) {
        const modal = qrModalNode();
        const parts = modal ? { status: modal.querySelector("[data-qr-status]") } : null;
        apiRequest(`/api/wechat/register/${encodeURIComponent(target)}/retry`, { method: "POST", body: "{}" })
          .then((result) => {
            if (result && result.status === "registered") {
              return apiRequest(`/api/wechat/register/${encodeURIComponent(target)}/poll`, { method: "POST", body: "{}" });
            }
            throw new Error(t("auth.wechat_register_failed"));
          })
          .then(async (result) => {
            if (!result || result.status !== "ok") throw new Error(t("auth.wechat_register_failed"));
            if (parts) setQrStatus(parts, t("auth.wechat_register_success"), "success");
            await hydrateSession();
            if (result.needs_email) showToast(t("toast.wechat_register_needs_email"));
        else if (result.existing) showToast(t("toast.wechat_register_existing"));
            goToReturnPath(result.next || "/#account");
            window.setTimeout(closeQrModal, 500);
          })
          .catch((error) => {
            if (parts) setQrStatus(parts, error.message || t("auth.wechat_register_failed"), "error");
          });
      }
      return;
    }
    const shareCopy = event.target.closest("[data-share-copy]");
    if (shareCopy) {
      copyText(shareLink()).then((copied) => showToast(copied ? t("share.copied") : shareLink()));
      return;
    }
    const orderPay = event.target.closest("[data-order-pay]");
    if (orderPay) { resumeOrderPayment(orderPay.dataset.orderPay); return; }
    const orderReconcile = event.target.closest("[data-order-reconcile]");
    if (orderReconcile) {
      // "I already paid": reconcile with WeChat and settle in place (self-service
      // recovery when the async callback never arrived).
      const orderNo = orderReconcile.dataset.orderReconcile;
      orderReconcile.disabled = true;
      apiRequest(`/api/orders/${encodeURIComponent(orderNo)}/reconcile`, { method: "POST", body: "{}" })
        .then((order) => {
          if (order && order.status === "paid") { showToast(t("toast.paid")); hydrateAccount("orders"); return; }
          showToast(t("account.order_reconcile_pending"));
          orderReconcile.disabled = false;
        })
        .catch((error) => {
          showToast(error.message || t("account.order_reconcile_failed"));
          orderReconcile.disabled = false;
        });
      return;
    }
    if (event.target.closest("[data-close-plan]")) { closePlanModal(); return; }
    const planConfirm = event.target.closest("[data-plan-confirm]");
    if (planConfirm) {
      const value = planConfirm.dataset.planConfirm;
      closePlanModal();
      purchasePlan(value);
      return;
    }
    const planRedeem = event.target.closest("[data-plan-redeem]");
    const shareSubmit = event.target.closest("[data-share-submit]");
    if (shareSubmit) {
      if (!state.session) { closeShare(); window.location.hash = "#login"; return; }
      const modal = shareModal();
      const status = modal?.querySelector("[data-share-status]");
      if (status) { status.className = "status"; status.textContent = t("pricing.loading"); }
      apiRequest("/api/share/cards", { method: "POST", body: JSON.stringify({ tool_code: "" }) })
        .then((result) => {
          if (result.url) {
            state.referral = result.url;
            const input = modal?.querySelector("[data-share-link]");
            if (input) input.value = result.url;
          }
          if (typeof result.credits === "number") {
            state.share = { credits: result.credits, history: (state.share && state.share.history) || [], credit_limit_cents: result.credit_limit_cents || 0 };
            const plansBlock = document.querySelector("[data-pricing-products]");
            if (plansBlock && state.products) plansBlock.innerHTML = pricingToolPlans(state.products);
          }
          apiRequest("/api/me/coupons").then((payload) => {
            state.coupons = Array.isArray(payload && payload.coupons) ? payload.coupons : [];
          }).catch(() => {});
          if (status) {
            status.className = "status is-success";
            status.textContent = result.granted
              ? t("coupon.share_granted", { count: result.reward || 1 })
              : t("pricing.share_limited");
          }
          if (result.granted && shareSubmit) shareSubmit.hidden = true;
        })
        .catch((error) => { if (status) { status.className = "status"; status.textContent = error.message || t("admin.load_failed"); } });
      return;
    }
    if (event.target.closest("[data-share-login]")) { closeShare(); return; }
    const scrollTo = event.target.closest("[data-scroll-to]");
    if (scrollTo) {
      const node = document.querySelector(scrollTo.dataset.scrollTo);
      if (node) { node.scrollIntoView({ behavior: "smooth", block: "start" }); node.classList.add("is-highlighted"); window.setTimeout(() => node.classList.remove("is-highlighted"), 1600); }
      return;
    }
    if (planRedeem) {
      if (needsEmailVerification()) { showToast(t("verify.order_blocked")); window.location.hash = "#verify"; return; }
      const [productCode, planCode] = planRedeem.dataset.planRedeem.split("|");
      const redeemSlug = planRedeem.dataset.redeemSlug || "";
      closePlanModal();
      apiRequest("/api/membership/redeem", { method: "POST", body: JSON.stringify({ product_code: productCode, plan_code: planCode }) })
        .then(() => {
          state.membership = null;
          showToast(t("pricing.redeem_done"));
          if (redeemSlug) { renderPurchaseSuccess(redeemSlug, true); return; }
          window.location.hash = "#account/orders";
        })
        .catch((error) => showToast(error.message || t("toast.order_failed")));
      return;
    }
    const couponRedeem = event.target.closest("[data-coupon-redeem]");
    if (couponRedeem) {
      if (needsEmailVerification()) { showToast(t("verify.order_blocked")); window.location.hash = "#verify"; return; }
      const [productCode, planCode] = couponRedeem.dataset.couponRedeem.split("|");
      const couponId = couponRedeem.dataset.couponId || "";
      const redeemSlug = couponRedeem.dataset.redeemSlug || "";
      apiRequest("/api/orders/coupon", { method: "POST", body: JSON.stringify({ product_code: productCode, plan_code: planCode, coupon_id: couponId }) })
        .then(() => {
          state.coupons = [];
          showToast(t("pricing.coupon_redeem_done"));
          if (redeemSlug) { renderPurchaseSuccess(redeemSlug, true); return; }
          window.location.hash = "#account/orders";
        })
        .catch((error) => showToast(error.message || t("toast.order_failed")));
      return;
    }
    const buyPlan = event.target.closest("[data-buy-plan]");
    if (buyPlan) {
      if (!state.session) {
        pendingPlan = buyPlan.dataset.buyPlan;
        window.location.hash = "#login?next=pricing";
        return;
      }
      if (needsEmailVerification()) { showToast(t("verify.order_blocked")); window.location.hash = "#verify"; return; }
      const [productCode, planCode] = buyPlan.dataset.buyPlan.split("|");
      openPlanPurchase(productCode, planCode);
      return;
    }
    if (event.target.closest("[data-pricing-retry]")) { hydratePricing(); return; }
    if (event.target.closest("[data-account-retry]")) { hydrateAccount(route().split("/")[1] || "overview"); return; }
    if (event.target.closest(".header-search")) { window.location.hash = "#tools"; window.setTimeout(() => document.querySelector("#tools-search")?.focus(), 0); return; }
    const requestFilter = event.target.closest("[data-request-filter]");
    if (requestFilter) { state.requestFilter = requestFilter.dataset.requestFilter; render(); return; }
    const requestSort = event.target.closest("[data-request-sort]");
    if (requestSort) { state.requestSort = requestSort.dataset.requestSort; render(); return; }
    const requestVote = event.target.closest("[data-request-vote]");
    if (requestVote) {
      const item = requests.find((entry) => entry.id === requestVote.dataset.requestVote);
      if (!item) return;
      if (!state.session) {
        showToast(t("requests.vote_login"));
        window.location.hash = "#login";
        return;
      }
      if (state.requestVotes[item.id]) { showToast(t("requests.vote_already")); return; }
      apiRequest(`/api/requests/${encodeURIComponent(item.id)}/vote`, { method: "POST", body: "{}" })
        .then((result) => {
          state.requestVotes[item.id] = true;
          if (result && Number.isFinite(Number(result.votes))) item.votes = Number(result.votes);
          storageSet("yykj16_request_votes", JSON.stringify({ voted: state.requestVotes, counts: state.requestVoteCounts }));
          render();
          showToast(result && result.granted === false ? t("requests.vote_already") : t("requests.vote_recorded"));
        })
        .catch((error) => showToast(error.message || t("requests.vote_already")));
      return;
    }
    if (event.target.closest("[data-open-request-form]")) {
      requestTrigger = event.target.closest("[data-open-request-form]");
      const modal = document.querySelector("[data-request-modal]");
      modal?.removeAttribute("hidden");
      modal?.querySelector('input[name="title"]')?.focus();
      return;
    }
    if (event.target.closest("[data-close-request]")) {
      const modal = document.querySelector("[data-request-modal]");
      modal?.setAttribute("hidden", "");
      requestTrigger?.focus();
      requestTrigger = null;
      return;
    }
    const datasetFilter = event.target.closest("[data-dataset-filter]");
    if (datasetFilter) { state.datasetFilter = datasetFilter.dataset.datasetFilter; render(); return; }
    const datasetAction = event.target.closest("[data-dataset-action]");
    if (datasetAction) { showToast(datasetAction.dataset.datasetAction === "save" ? t("toast.dataset_saved") : t("toast.dataset_shared")); return; }
    const datasetDownload = event.target.closest("[data-dataset-download]");
    if (datasetDownload) {
      const item = datasets.find((entry) => entry.id === datasetDownload.dataset.datasetDownload);
      if (!item) return;
      if (item.access === "paid") { showToast(t("toast.dataset_paid")); window.location.hash = "#about?section=contact"; return; }
      const file = datasetDownload.dataset.datasetFile || "";
      if (!file) { showToast(t("toast.dataset_download")); return; }
      window.location.href = apiUrl(`/api/datasets/${encodeURIComponent(item.id)}/files/${encodeURIComponent(file)}`);
      return;
    }
    // Buttons only: the form also stores its current rating in data-feedback-rating,
    // so a bare closest() would re-capture every click inside the form (incl. submit).
    const feedbackChoice = event.target.closest("button[data-feedback-rating]");
    if (feedbackChoice) {
      const form = feedbackChoice.closest("[data-tool-feedback]");
      if (!form) return;
      form.dataset.feedbackRating = feedbackChoice.dataset.feedbackRating;
      form.querySelectorAll("[data-feedback-rating]").forEach((button) => button.classList.toggle("is-active", button === feedbackChoice));
      const textarea = form.querySelector("textarea");
      const submit = form.querySelector("[data-feedback-submit]");
      if (textarea) textarea.hidden = feedbackChoice.dataset.feedbackRating === "satisfied";
      if (submit) submit.hidden = false;
      return;
    }
    const filter = event.target.closest("[data-filter]");
    if (filter) { const key = filter.dataset.filter; if (key === "all") state.filters = []; else state.filters = state.filters.includes(key) ? state.filters.filter((entry) => entry !== key) : [...state.filters, key]; state.query = ""; render(); return; }
    const launch = event.target.closest("[data-launch]");
    if (launch) { openTool(tool(launch.dataset.launch)); return; }
    const purchaseClose = event.target.closest("[data-close-purchase]");
    if (purchaseClose) { closePurchase(); return; }
    if (event.target.closest("[data-close-pay]")) { document.querySelector("[data-pay-modal]")?.remove(); return; }
    if (event.target.closest("[data-close-vip]")) { document.querySelector("[data-vip-modal]")?.remove(); return; }
    if (event.target.closest("[data-vip-open]")) { openVipModal(); return; }
    const vipBuy = event.target.closest("[data-vip-buy]");
    if (vipBuy) {
      if (!state.session) { window.location.hash = "#login"; return; }
      if (needsEmailVerification()) { showToast(t("verify.order_blocked")); window.location.hash = "#verify"; return; }
      document.querySelector("[data-vip-modal]")?.remove();
      purchasePlan(vipBuy.dataset.vipBuy, { vipRefresh: true });
      return;
    }
    const payMethod = event.target.closest("[data-pay-method]");
    if (payMethod) {
      const modal = payMethod.closest("[data-pay-modal]");
      modal?.querySelectorAll("[data-pay-method]").forEach((node) => node.classList.toggle("is-active", node === payMethod));
      const confirm = modal?.querySelector("[data-pay-confirm]");
      if (confirm) confirm.textContent = payMethod.dataset.payMethod === "online" ? t("pricing.confirm_submit") : t("detail.pay_confirm_redeem");
      return;
    }
    const payConfirm = event.target.closest("[data-pay-confirm]");
    if (payConfirm) { confirmPayEntry(payConfirm.dataset.payConfirm); return; }
    const payOpen = event.target.closest("[data-pay-open]");
    if (payOpen) {
      const item = tool(payOpen.dataset.payOpen);
      if (item) openPayEntry(item);
      return;
    }
    const buyNow = event.target.closest("[data-buy-now]");
    if (buyNow) {
      const item = tool(buyNow.dataset.buyNow);
      // Buy CTA opens the payment sheet first: the amount follows the user's VIP status.
      if (item) {
        if (!state.session) { window.location.hash = "#login"; return; }
        if (needsEmailVerification()) { showToast(t("verify.order_blocked")); window.location.hash = "#verify"; return; }
        openPayEntry(item);
      }
      return;
    }
    const purchasePlanButton = event.target.closest("[data-purchase-plan]");
    if (purchasePlanButton) {
      if (needsEmailVerification()) { showToast(t("verify.order_blocked")); window.location.hash = "#verify"; return; }
      purchasePlan(purchasePlanButton.dataset.purchasePlan, { inPlaceSlug: purchasePlanButton.dataset.purchaseTool || "" });
      return;
    }
    const topupButton = event.target.closest("[data-plan-topup]");
    if (topupButton) {
      if (needsEmailVerification()) { showToast(t("verify.order_blocked")); window.location.hash = "#verify"; return; }
      purchasePlan(topupButton.dataset.planTopup, {
        inPlaceSlug: topupButton.dataset.topupSlug || "",
        creditSource: topupButton.dataset.topupSource || "",
      });
      return;
    }
    const purchaseOpen = event.target.closest("[data-purchase-open]");
    if (purchaseOpen) {
      const item = tool(purchaseOpen.dataset.purchaseOpen);
      closePurchase();
      if (item) openTool(item);
      return;
    }
    const copy = event.target.closest("[data-copy]");
    if (copy) { navigator.clipboard?.writeText(copy.dataset.copy).then(() => showToast(t("toast.contact_copied"))).catch(() => showToast(copy.dataset.copy)); return; }
    const accountView = event.target.closest("[data-account-view]");
    if (accountView) { window.location.hash = `#account/${accountView.dataset.accountView}`; return; }
    const toolTab = event.target.closest("[data-tool-tab]");
    if (toolTab) { state.toolTab = toolTab.dataset.toolTab; render(); return; }
    const detailPrev = event.target.closest("[data-detail-prev]");
    if (detailPrev) { const item = routeTool(); if (item) { const count = toolMediaFor(item.toolCode).filter((entry) => entry.mediaType !== "video").length; state.detailSlide = (state.detailSlide - 1 + count) % count; render(); } return; }
    const detailNext = event.target.closest("[data-detail-next]");
    if (detailNext) { const item = routeTool(); if (item) { const count = toolMediaFor(item.toolCode).filter((entry) => entry.mediaType !== "video").length; state.detailSlide = (state.detailSlide + 1) % count; render(); } return; }
    const detailDot = event.target.closest("[data-detail-dot]");
    if (detailDot) { state.detailSlide = Number(detailDot.dataset.detailDot || 0); render(); return; }
    const detailFullscreen = event.target.closest("[data-detail-fullscreen]");
    if (detailFullscreen) {
      const src = detailFullscreen.dataset.fullscreenSrc;
      if (src) window.open(src, "_blank", "noopener");
      return;
    }
    if (event.target.closest("[data-reset-resend]")) {
      const status = document.querySelector("[data-reset-status]");
      apiRequest("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email: state.resetEmail }) })
        .then((result) => { if (status) status.textContent = result && result.sent ? t("auth.forgot_sent") : t("auth.forgot_unavailable"); })
        .catch(() => { if (status) status.textContent = t("auth.forgot_unavailable"); });
      return;
    }

    const refundApply = event.target.closest("[data-refund-apply]");
    if (refundApply) {
      event.preventDefault();
      document.querySelector("[data-refund-modal]")?.remove();
      const orderNo = refundApply.dataset.refundApply;
      const amount = moneyCents(Number(refundApply.dataset.refundAmount || 0));
      const modal = document.createElement("div");
      modal.className = "request-modal";
      modal.setAttribute("data-refund-modal", "");
      modal.innerHTML = `<div class="request-modal__backdrop" data-close-refund></div><section class="request-modal__card" role="dialog" aria-modal="true"><div class="request-modal__heading"><div><p class="eyebrow">${t("account.refund_title")}</p><h2>${t("account.refund_title")}</h2><p>${esc(orderNo)} · ${amount}</p><p class="tool-tag">${t("account.refund_policy")}</p></div><button class="icon-button" type="button" data-close-refund aria-label="${t("common.close")}">×</button></div><form class="form-stack" data-refund-form data-order-no="${esc(orderNo)}"><label class="field">${t("account.refund_reason")}<textarea name="reason" rows="4" maxlength="500" placeholder="${t("account.refund_reason_placeholder")}" required></textarea></label><div class="request-modal__actions"><button class="button button--outline" type="button" data-close-refund>${t("common.cancel")}</button><button class="button button--primary" type="submit">${t("account.refund_submit")}</button></div><p class="status" data-refund-status aria-live="polite"></p></form></section>`;
      document.body.append(modal);
      const textarea = modal.querySelector("textarea");
      if (textarea) textarea.focus();
      return;
    }
    if (event.target.closest("[data-close-refund]")) {
      document.querySelector("[data-refund-modal]")?.remove();
      return;
    }
    const refundCancel = event.target.closest("[data-refund-cancel]");
    if (refundCancel) {
      event.preventDefault();
      apiRequest(`/api/me/refunds/${encodeURIComponent(refundCancel.dataset.refundCancel)}/cancel`, { method: "POST", body: "{}" })
        .then(async () => { showToast(t("account.refund_canceled")); await hydrateAccount("orders"); })
        .catch((error) => showToast(error.message || t("account.refund_failed")));
      return;
    }
    const siteRemove = event.target.closest("[data-site-remove]");
    if (siteRemove) {
      event.preventDefault();
      apiRequest(`/api/me/sites/${encodeURIComponent(siteRemove.dataset.siteRemove)}`, { method: "DELETE", body: "{}" })
        .then(async () => { showToast(t("account.sites_removed")); await hydrateAccount("entitlements"); })
        .catch((error) => showToast(error.message || t("account.sites_failed")));
      return;
    }
    const deactivateTrigger = event.target.closest("[data-account-deactivate]");
    if (deactivateTrigger) {
      event.preventDefault();
      document.querySelector("[data-deactivate-modal]")?.remove();
      const modal = document.createElement("div");
      modal.className = "request-modal";
      modal.setAttribute("data-deactivate-modal", "");
      const notes = String(t("account.deactivate_consequences")).split("；").map((item) => item.trim()).filter(Boolean);
      modal.innerHTML = `<div class="request-modal__backdrop" data-close-deactivate></div><section class="request-modal__card" role="dialog" aria-modal="true"><div class="request-modal__heading"><div><h2>${t("account.deactivate_title")}</h2><p>${t("account.deactivate_confirm_lede")}</p></div><button class="icon-button" type="button" data-close-deactivate aria-label="${t("common.close")}">×</button></div><form class="form-stack" data-deactivate-form><ul class="ac-notes">${notes.map((item) => `<li>${esc(item)}</li>`).join("")}</ul><label class="field">${t("account.deactivate_type_word")}<input name="confirm" autocomplete="off" placeholder="${t("account.deactivate_word_placeholder")}" required></label>${state.profileHasPassword === false ? "" : `<label class="field">${t("account.deactivate_password")}<input type="password" name="password" autocomplete="current-password" required></label>`}<div class="request-modal__actions"><button class="button button--outline" type="button" data-close-deactivate>${t("common.cancel")}</button><button class="button button--primary" type="submit">${t("account.deactivate_submit")}</button></div><p class="status" data-deactivate-status aria-live="polite"></p></form></section>`;
      document.body.append(modal);
      return;
    }
    if (event.target.closest("[data-close-deactivate]")) {
      document.querySelector("[data-deactivate-modal]")?.remove();
      return;
    }
    const verifyResend = event.target.closest("[data-verify-resend]");
    if (verifyResend && state.session) {
      const status = document.querySelector("[data-verify-page-status]");
      apiRequest("/api/auth/resend-verification", { method: "POST", body: JSON.stringify({ email: state.session.email }) })
        .then((result) => { if (status) status.textContent = result && result.sent ? t("verify.sent") : t("verify.unavailable"); })
        .catch(() => { if (status) status.textContent = t("verify.unavailable"); });
      return;
    }
    if (event.target.closest("[data-verify-bar-close]")) {
      verifyBarDismissed = true;
      syncVerifyBar();
      return;
    }
    const verifySend = event.target.closest("[data-verify-send]");
    if (verifySend && state.session) {
      const status = document.querySelector("[data-verify-status]");
      apiRequest("/api/auth/resend-verification", { method: "POST", body: JSON.stringify({ email: state.session.email }) })
        .then((result) => { if (status) status.textContent = result && result.sent ? t("account.verify_sent") : t("auth.forgot_unavailable"); })
        .catch(() => { if (status) status.textContent = t("auth.forgot_unavailable"); });
      return;
    }

    const verifySubmit = event.target.closest("[data-verify-submit]");
    if (verifySubmit && state.session) {
      const status = document.querySelector("[data-verify-status]");
      const input = document.querySelector("[data-verify-code]");
      const code = String((input && input.value) || "").trim();
      if (!code) { if (status) status.textContent = t("account.verify_failed"); return; }
      apiRequest("/api/auth/verify-email", { method: "POST", body: JSON.stringify({ email: state.session.email, code }) })
        .then(() => {
          state.session.email_verified = true;
          syncVerifyBar();
          const box = document.querySelector("[data-account-verify]");
          if (box) box.hidden = true;
          showToast(t("account.verify_done"));
        })
        .catch(() => { if (status) status.textContent = t("account.verify_failed"); });
      return;
    }

  });
  document.addEventListener("change", (event) => {
    const avatarInput = event.target.closest("[data-avatar-input]");
    if (!avatarInput) return;
    const status = document.querySelector("[data-avatar-status]");
    const file = avatarInput.files && avatarInput.files[0];
    if (!file) return;
    if (status) { status.className = "status"; status.textContent = t("account.avatar_uploading"); }
    apiRequest("/api/me/avatar", { method: "POST", body: file, headers: { "Content-Type": file.type } })
      .then(async () => {
        if (status) { status.className = "status is-success"; status.textContent = t("account.avatar_done"); }
        avatarInput.value = "";
        await hydrateSession();
        await hydrateAccount("profile");
      })
      .catch((error) => {
        if (status) { status.className = "status is-error"; status.textContent = error.message || t("account.avatar_failed"); }
      });
  });

  document.addEventListener("input", (event) => {
    if (event.target.id === "tools-search") { state.query = event.target.value.trim(); document.querySelector("[data-tool-results]").innerHTML = toolResultsHtml(); }
    if (event.target.id === "dataset-search") { state.datasetQuery = event.target.value.trim(); document.querySelector("[data-dataset-results]").innerHTML = datasetResultsHtml(); }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !navDrawerNode()?.hidden) { event.preventDefault(); closeNavDrawer(); return; }
    if (event.key === "Escape" && !shareModal()?.hidden) { event.preventDefault(); closeShare(); }
    if (event.key === "Escape" && !qrModalNode()?.hidden) { event.preventDefault(); closeQrModal(); }
    if (event.key === "Escape" && document.querySelector("[data-admin-modal]")) { event.preventDefault(); adminState.editing = null; adminState.editingTag = null; render(); return; }
    if (event.key === "Escape" && planModal()) { event.preventDefault(); closePlanModal(); return; }
    const purchaseModalNode = document.querySelector("[data-purchase-modal]");
    if (event.key === "Escape" && purchaseModalNode && !purchaseModalNode.hidden) { event.preventDefault(); closePurchase(); }
    const requestModal = document.querySelector("[data-request-modal]");
    if (event.key === "Escape" && requestModal && !requestModal.hidden) {
      event.preventDefault();
      requestModal.setAttribute("hidden", "");
      requestTrigger?.focus();
      requestTrigger = null;
    }
  });
  document.addEventListener("submit", (event) => {
    const refundForm = event.target.closest("[data-refund-form]");
    if (refundForm) {
      event.preventDefault();
      const status = refundForm.querySelector("[data-refund-status]");
      const reason = String(new FormData(refundForm).get("reason") || "").trim();
      const orderNo = refundForm.dataset.orderNo || "";
      status.className = "status";
      if (reason.length < 5) { status.textContent = t("account.refund_reason_short"); return; }
      status.textContent = t("account.refund_sending");
      apiRequest(`/api/orders/${encodeURIComponent(orderNo)}/refund`, { method: "POST", body: JSON.stringify({ reason }) })
        .then(async () => {
          document.querySelector("[data-refund-modal]")?.remove();
          showToast(t("account.refund_done"));
          await hydrateAccount("orders");
        })
        .catch((error) => {
          status.className = "status is-error";
          status.textContent = error.message || t("account.refund_failed");
        });
      return;
    }
    const registerDoneForm = event.target.closest("[data-register-done-form]");
    if (registerDoneForm) {
      event.preventDefault();
      const formData = new FormData(registerDoneForm);
      const status = registerDoneForm.querySelector("[data-register-done-status]");
      const email = String(formData.get("email") || "").trim();
      const code = String(formData.get("code") || "").trim();
      if (!email || !code) { status.className = "status is-error"; status.textContent = t("auth.error_required"); return; }
      status.className = "status";
      status.textContent = t("account.email_bind_sending");
      apiRequest("/api/me/email/confirm", { method: "POST", body: JSON.stringify({ email, code }) })
        .then(async () => {
          status.className = "status is-success";
          status.textContent = t("account.email_bind_success");
          authRegisterDone = false;
          await hydrateSession();
          showToast(t("account.email_bind_success"));
          goToReturnPath(registerDoneForm.dataset.next || "/#home");
        })
        .catch((error) => {
          status.className = "status is-error";
          status.textContent = error.message || t("auth.code_invalid");
        });
      return;
    }
    const adminLoginForm = event.target.closest("[data-admin-login-form]");
    if (adminLoginForm) {
      event.preventDefault();
      const password = String(new FormData(adminLoginForm).get("password") || "");
      const status = adminLoginForm.querySelector("[data-admin-status]");
      status.className = "status";
      if (!password) { status.textContent = t("admin.login_failed"); return; }
      status.textContent = t("admin.loading");
      apiRequest("/api/admin/session", { method: "POST", body: JSON.stringify({ password }) })
        .then(() => { adminState.session = true; adminState.loaded = false; adminState.error = ""; render(); })
        .catch((error) => {
          status.className = "status";
          status.textContent = error.status === 429 ? t("auth.too_many") : error.status === 503 ? t("admin.disabled") : t("admin.login_failed");
        });
      return;
    }
    const adminToolForm = event.target.closest("[data-admin-tool-form]");
    if (adminToolForm) {
      event.preventDefault();
      const payload = adminToolPayload(adminToolForm);
      const editing = adminToolForm.dataset.adminEditing === "1";
      const status = adminToolForm.querySelector("[data-admin-dialog-status]");
      status.className = "status";
      status.textContent = t("admin.saving");
      const request = editing
        ? apiRequest(`/api/admin/tools/${encodeURIComponent(payload.slug)}`, { method: "PATCH", body: JSON.stringify(payload) })
        : apiRequest("/api/admin/tools", { method: "POST", body: JSON.stringify(payload) });
      request.then(() => {
        adminState.editing = null;
        adminState.message = t("admin.saved");
        adminState.error = "";
        loadAdminContent();
      }).catch((error) => {
        status.className = "status";
        status.textContent = error.message || t("admin.save_failed");
      });
      return;
    }
    const adminTagForm = event.target.closest("[data-admin-tag-form]");
    if (adminTagForm) {
      event.preventDefault();
      const data = new FormData(adminTagForm);
      const payload = {
        key: String(data.get("key") || "").trim(),
        icon: String(data.get("icon") || "").trim() || "layers",
        name: String(data.get("name") || "").trim(),
        description: String(data.get("description") || "").trim()
      };
      const editing = adminTagForm.dataset.adminEditing === "1";
      const status = adminTagForm.querySelector("[data-admin-dialog-status]");
      status.className = "status";
      status.textContent = t("admin.saving");
      const request = editing
        ? apiRequest(`/api/admin/tags/${encodeURIComponent(payload.key)}`, { method: "PATCH", body: JSON.stringify(payload) })
        : apiRequest("/api/admin/tags", { method: "POST", body: JSON.stringify(payload) });
      request.then(() => {
        adminState.editingTag = null;
        adminState.message = t("admin.saved");
        adminState.error = "";
        loadAdminContent();
      }).catch((error) => {
        status.className = "status";
        status.textContent = error.message || t("admin.save_failed");
      });
      return;
    }
    const adminRowForm = event.target.closest("[data-admin-row-form]");
    if (adminRowForm) {
      event.preventDefault();
      const family = adminRowForm.dataset.family;
      const meta = adminFamilyMeta[family];
      const editing = adminRowForm.dataset.editing === "1";
      const rowId = adminRowForm.dataset.rowId;
      const data = new FormData(adminRowForm);
      const payload = {};
      meta.fields.forEach((field) => { payload[field.name] = String(data.get(field.name) ?? "").trim(); });
      const status = adminRowForm.querySelector("[data-admin-dialog-status]");
      status.className = "status";
      status.textContent = t("admin.saving");
      const request = editing
        ? apiRequest(`/api/admin/content/${family}/${encodeURIComponent(rowId)}`, { method: "PATCH", body: JSON.stringify(payload) })
        : apiRequest(`/api/admin/content/${family}`, { method: "POST", body: JSON.stringify(payload) });
      request.then(() => {
        adminState.editingRow = null;
        adminState.editingRowId = "";
        adminState.message = t("admin.saved");
        adminState.error = "";
        loadAdminContent();
      }).catch((error) => {
        status.className = "status";
        status.textContent = error.message || t("admin.save_failed");
      });
      return;
    }
    const adminDatasetForm = event.target.closest("[data-admin-dataset-form]");
    if (adminDatasetForm) {
      event.preventDefault();
      const editing = adminDatasetForm.dataset.editing === "1";
      const rowId = adminDatasetForm.dataset.rowId;
      const payload = adminDatasetPayloadFrom(adminDatasetForm);
      const status = adminDatasetForm.querySelector("[data-admin-dialog-status]");
      status.className = "status";
      status.textContent = t("admin.saving");
      const request = editing
        ? apiRequest(`/api/admin/datasets/${encodeURIComponent(rowId)}`, { method: "PATCH", body: JSON.stringify(payload) })
        : apiRequest("/api/admin/datasets", { method: "POST", body: JSON.stringify(payload) });
      request.then(() => {
        adminState.editingDataset = null;
        adminState.editingDatasetId = "";
        adminState.message = t("admin.saved");
        adminState.error = "";
        loadAdminContent();
      }).catch((error) => {
        status.className = "status";
        status.textContent = error.message || t("admin.save_failed");
      });
      return;
    }
    const couponBatchForm = event.target.closest("[data-admin-coupon-batch-form]");
    if (couponBatchForm) {
      event.preventDefault();
      const data = new FormData(couponBatchForm);
      const payload = {
        batch_code: String(data.get("batch_code") || "").trim(),
        name: String(data.get("name") || "").trim(),
        kind: "trial_times",
        tool_scope: String(data.get("tool_scope") || "per_tool").trim(),
        valid_days: Number(data.get("valid_days") || 30),
        per_user_limit: Number(data.get("per_user_limit") || 0),
        quota: Number(data.get("quota") || 1),
        channel: String(data.get("channel") || "").trim(),
        status: "active"
      };
      adminState.error = "";
      apiRequest("/api/admin/coupon-batches", { method: "POST", body: JSON.stringify(payload) })
        .then(() => { adminState.message = t("admin.coupon_batch_created"); loadAdminContent(); })
        .catch((error) => { adminState.error = error.message || t("admin.save_failed"); render(); });
      return;
    }
    const couponIssueForm = event.target.closest("[data-admin-coupon-issue-form]");
    if (couponIssueForm) {
      event.preventDefault();
      const data = new FormData(couponIssueForm);
      const payload = {
        batch_code: String(data.get("batch_code") || "").trim(),
        account_id: String(data.get("account_id") || "").trim(),
        tool_code: String(data.get("tool_code") || "all").trim(),
        source: String(data.get("source") || "manual").trim(),
        channel: String(data.get("channel") || "").trim()
      };
      adminState.error = "";
      apiRequest("/api/admin/coupons/issue", { method: "POST", body: JSON.stringify(payload) })
        .then(() => { adminState.message = t("admin.coupon_issue_done"); loadAdminContent(); })
        .catch((error) => { adminState.error = error.message || t("admin.save_failed"); render(); });
      return;
    }
    const couponGenerateForm = event.target.closest("[data-admin-coupon-generate-form]");
    if (couponGenerateForm) {
      event.preventDefault();
      const data = new FormData(couponGenerateForm);
      const payload = {
        batch_code: String(data.get("batch_code") || "").trim(),
        count: Number(data.get("count") || 1),
        tool_code: String(data.get("tool_code") || "all").trim(),
        source: "manual",
        channel: String(data.get("channel") || "").trim()
      };
      adminState.error = "";
      apiRequest("/api/admin/coupons/generate", { method: "POST", body: JSON.stringify(payload) })
        .then((result) => { adminState.generatedCodes = (result && result.codes) || []; adminState.message = t("admin.coupon_generated"); render(); })
        .catch((error) => { adminState.error = error.message || t("admin.save_failed"); render(); });
      return;
    }
    const policyForm = event.target.closest("[data-admin-policy-form]");
    if (policyForm) {
      event.preventDefault();
      const data = new FormData(policyForm);
      const payload = {
        tool_code: String(data.get("tool_code") || "").trim(),
        access_mode: String(data.get("access_mode") || "paid").trim(),
        trial_allowed: String(data.get("trial_allowed") || "false") === "true",
        maintenance_reason: String(data.get("maintenance_reason") || "").trim(),
        enabled: true
      };
      adminState.error = "";
      apiRequest("/api/admin/tool-policies", { method: "POST", body: JSON.stringify(payload) })
        .then(() => { adminState.message = t("admin.policy_saved"); loadAdminContent(); })
        .catch((error) => { adminState.error = error.message || t("admin.save_failed"); render(); });
      return;
    }
    const couponClaimForm = event.target.closest("[data-coupon-claim-form]");
    if (couponClaimForm) {
      event.preventDefault();
      const code = String(new FormData(couponClaimForm).get("code") || "").trim();
      if (!code) return;
      apiRequest("/api/me/coupons/redeem", { method: "POST", body: JSON.stringify({ code }) })
        .then(async () => { showToast(t("account.coupon_claimed")); await hydrateAccount("entitlements"); })
        .catch((error) => showToast(error.message || t("account.coupon_claim_failed")));
      return;
    }
    const toolFeedbackForm = event.target.closest("[data-tool-feedback]");
    if (toolFeedbackForm) {
      event.preventDefault();
      if (!state.session) { showToast(t("detail.feedback_login")); window.location.hash = "#login"; return; }
      const toolCode = toolFeedbackForm.dataset.toolFeedback;
      const rating = toolFeedbackForm.dataset.feedbackRating || "satisfied";
      const detailText = String(new FormData(toolFeedbackForm).get("detail") || "").trim();
      const status = toolFeedbackForm.querySelector("[data-feedback-status]");
      if (status) { status.className = "status"; status.textContent = t("pricing.loading"); }
      apiRequest(`/api/tools/${encodeURIComponent(toolCode)}/feedback`, { method: "POST", body: JSON.stringify({ rating, detail: detailText }) })
        .then(() => {
          if (status) { status.className = "status is-success"; status.textContent = t("detail.feedback_done"); }
          toolFeedbackForm.reset();
          toolFeedbackForm.querySelectorAll("[data-feedback-rating]").forEach((button) => button.classList.remove("is-active"));
          toolFeedbackForm.querySelector("textarea").hidden = true;
          toolFeedbackForm.querySelector("[data-feedback-submit]").hidden = true;
        })
        .catch((error) => { if (status) { status.className = "status is-error"; status.textContent = error.message || t("detail.feedback_failed"); } });
      return;
    }
    const authForm = event.target.closest("[data-auth-form]");
    if (authForm) {
      event.preventDefault();
      const mode = route();
      const formData = new FormData(authForm);
      const email = String(formData.get("email") || "").trim();
      const status = authForm.querySelector("[data-auth-status]");
      status.className = "status";
      if (mode === "forgot") {
        if (!email) { status.textContent = t("auth.error_required"); return; }
        status.textContent = t("auth.logging_in");
        apiRequest("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) })
          .then((result) => {
            if (result && result.sent) { state.resetEmail = email; render(); return; }
            status.textContent = result && result.provider === "wechat" ? t("auth.wechat_forgot") : t("auth.forgot_unavailable");
          })
          .catch(() => { status.textContent = t("auth.forgot_unavailable"); });
        return;
      }
      const password = String(formData.get("password") || "");
      if (!email || !password) { status.textContent = t("auth.error_required"); return; }
      if (mode === "register") {
        const confirmation = String(formData.get("password_confirmation") || "");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { status.textContent = t("auth.error_email"); return; }
        if (password.length < 8) { status.textContent = t("auth.error_password"); return; }
        if (password !== confirmation) { status.textContent = t("auth.error_confirm"); return; }
        status.textContent = t("auth.registering");
        const name = String(formData.get("name") || "").trim();
        apiRequest("/api/auth/register", { method: "POST", body: JSON.stringify({ email, password, name: name || null, ref: query().get("ref") || null }) })
          .then(async (result) => {
            if (result && result.email_verification_sent) {
              showToast(t("auth.verify_mail_sent"));
              await hydrateSession();
              window.location.hash = "#verify";
              return;
            }
            await afterAuth();
          })
          .catch((error) => { status.textContent = error.status === 409 ? t("auth.error_exists") : error.status === 429 ? t("auth.too_many") : t("auth.error_register"); });
        return;
      }
      status.textContent = t("auth.logging_in");
      const captchaInput = authForm.querySelector('input[name="captcha_answer"]');
      const captchaAnswer = captchaInput ? String(new FormData(authForm).get("captcha_answer") || "").trim() : "";
      const rememberInput = authForm.querySelector('input[name="remember"]');
      const remember = rememberInput ? Boolean(rememberInput.checked) : true;
      apiRequest("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password, captcha_answer: captchaAnswer || null, remember }) })
        .then(async () => { rememberAccount(email); await afterAuth(); })
        .catch((error) => {
          const detail = error.payload && error.payload.detail;
          if (error.status === 428 && detail && typeof detail === "object" && detail.question) {
            showAuthCaptcha(detail.question);
            status.textContent = t("auth.captcha_note");
            return;
          }
          status.textContent = error.status === 429 ? t("auth.too_many")
            : error.status === 403 ? t("auth.error_deactivated")
            : t("auth.error_credentials");
        });
      return;
    }
    const resetForm = event.target.closest("[data-reset-form]");
    if (resetForm) {
      event.preventDefault();
      const formData = new FormData(resetForm);
      const code = String(formData.get("code") || "").trim();
      const password = String(formData.get("password") || "");
      const confirmation = String(formData.get("password_confirmation") || "");
      const status = resetForm.querySelector("[data-reset-status]");
      status.className = "status";
      if (!code || !password) { status.textContent = t("auth.error_required"); return; }
      if (password.length < 8) { status.textContent = t("auth.error_password"); return; }
      if (password !== confirmation) { status.textContent = t("auth.error_confirm"); return; }
      status.textContent = t("auth.logging_in");
      apiRequest("/api/auth/reset-password", { method: "POST", body: JSON.stringify({ email: state.resetEmail, code, new_password: password }) })
        .then(() => { state.resetEmail = ""; showToast(t("auth.forgot_done")); window.location.hash = "#login"; })
        .catch((error) => { status.textContent = error.status === 429 ? t("auth.too_many") : t("account.verify_failed"); });
      return;
    }
    const deactivateForm = event.target.closest("[data-deactivate-form]");
    if (deactivateForm) {
      event.preventDefault();
      const status = deactivateForm.querySelector("[data-deactivate-status]");
      const deactivateData = new FormData(deactivateForm);
      const password = String(deactivateData.get("password") || "");
      const confirm = String(deactivateData.get("confirm") || "").trim();
      if (confirm !== t("account.deactivate_word")) { status.textContent = t("account.deactivate_word_mismatch"); return; }
      if (state.profileHasPassword !== false && !password) { status.textContent = t("account.deactivate_failed"); return; }
      apiRequest("/api/me/deactivate", { method: "POST", body: JSON.stringify({ password, confirm }) })
        .then(() => {
          state.session = null;
          document.querySelector("[data-deactivate-modal]")?.remove();
          showToast(t("account.deactivate_done"));
          window.location.hash = "#home";
          window.location.reload();
        })
        .catch((error) => { status.className = "status"; status.textContent = error.message || (error.status === 400 ? t("account.deactivate_failed") : t("account.deactivate_failed")); });
      return;
    }
    const verifyForm = event.target.closest("[data-verify-form]");
    if (verifyForm) {
      event.preventDefault();
      const status = verifyForm.querySelector("[data-verify-page-status]");
      const code = String(new FormData(verifyForm).get("code") || "").trim();
      status.className = "status";
      if (!code) { status.textContent = t("verify.failed"); return; }
      apiRequest("/api/auth/verify-email", { method: "POST", body: JSON.stringify({ email: state.session.email, code }) })
        .then(() => {
          if (state.session) state.session.email_verified = true;
          syncVerifyBar();
          showToast(t("verify.done"));
          window.location.hash = "#account";
        })
        .catch((error) => { status.textContent = error.status === 429 ? t("auth.too_many") : t("verify.failed"); });
      return;
    }
    const passwordSetupForm = event.target.closest("[data-password-setup-card]");
    if (passwordSetupForm) {
      event.preventDefault();
      const status = passwordSetupForm.querySelector("[data-password-setup-status]");
      const data = new FormData(passwordSetupForm);
      const code = String(data.get("code") || "").trim();
      const password = String(data.get("password") || "");
      if (status) { status.className = "status"; status.textContent = t("pricing.loading"); }
      apiRequest("/api/me/password/setup/confirm", { method: "POST", body: JSON.stringify({ code, password }) })
        .then(async () => {
          if (status) { status.className = "status is-success"; status.textContent = t("account.password_setup_success"); }
          await hydrateAccount("security");
        })
        .catch((error) => { if (status) { status.className = "status is-error"; status.textContent = error.message || t("account.password_setup_new"); } });
      return;
    }
    const emailBindForm = event.target.closest("[data-email-bind-form]");
    if (emailBindForm) {
      event.preventDefault();
      const status = emailBindForm.querySelector("[data-email-bind-status]");
      const code = String(new FormData(emailBindForm).get("code") || "").trim();
      if (!code) {
        if (status) status.textContent = t("account.email_bind_code_placeholder");
        return;
      }
      if (status) { status.className = "status"; status.textContent = t("pricing.loading"); }
      apiRequest("/api/me/email/confirm", { method: "POST", body: JSON.stringify({ code }) })
        .then(async (result) => {
          if (status) { status.className = "status is-success"; status.textContent = t("account.email_bind_success"); }
          if (result && result.user) state.session = Object.assign({}, state.session, result.user);
          syncVerifyBar();
          await hydrateAccount("security");
        })
        .catch((error) => {
          if (status) { status.className = "status is-error"; status.textContent = error.message || t("verify.failed"); }
        });
      return;
    }
    const profileForm = event.target.closest("[data-profile-form]");
    if (profileForm) {
      event.preventDefault();
      const value = String(new FormData(profileForm).get("display_name") || "").trim();
      const status = profileForm.querySelector("[data-profile-status]");
      if (!value) { status.textContent = t("account.profile_need_name"); return; }
      status.textContent = t("account.profile_saving");
      apiRequest("/api/me/profile", { method: "PATCH", body: JSON.stringify({ display_name: value }) }).then((result) => {
        state.profile = result.profile?.display_name || value;
        storageSet("yykj16_display_name", state.profile);
        profileForm.querySelector('input[name="display_name"]').value = state.profile;
        syncProfileName(state.profile);
        status.className = "status is-success";
        status.textContent = t("account.profile_saved");
      }).catch((error) => { status.className = "status"; status.textContent = error.status === 401 ? t("account.session_expired") : (error.message || t("account.profile_failed")); });
      return;
    }
    const passwordForm = event.target.closest("[data-password-form]");
    if (passwordForm) {
      event.preventDefault();
      const data = new FormData(passwordForm);
      const currentPassword = String(data.get("current_password") || "");
      const newPassword = String(data.get("new_password") || "");
      const confirmation = String(data.get("new_password_confirmation") || "");
      const status = passwordForm.querySelector("[data-password-status]");
      status.className = "status";
      if (!currentPassword || !newPassword) { status.textContent = t("account.password_required"); return; }
      if (newPassword.length < 8) { status.textContent = t("account.password_short"); return; }
      if (newPassword !== confirmation) { status.textContent = t("account.password_mismatch"); return; }
      status.textContent = t("account.password_saving");
      apiRequest("/api/me/password", { method: "POST", body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }) })
        .then(() => { status.className = "status is-success"; status.textContent = t("account.password_saved"); passwordForm.reset(); })
        .catch((error) => {
          const detail = String(error.message || "");
          status.className = "status";
          status.textContent = error.status === 401 ? t("account.session_expired")
            : error.status === 429 ? t("auth.too_many")
            : detail.includes("current password") ? t("account.password_current_invalid")
            : detail.includes("password") ? t("account.password_short")
            : t("account.password_failed");
        });
      return;
    }
    const invoiceForm = event.target.closest("[data-invoice-form]");
    if (invoiceForm) {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(invoiceForm).entries());
      const status = invoiceForm.querySelector("[data-invoice-status]");
      status.textContent = t("account.invoice_submitting");
      apiRequest("/api/invoices", { method: "POST", body: JSON.stringify(data) }).then(() => {
        status.className = "status is-success";
        status.textContent = t("account.invoice_submitted");
        hydrateAccount("invoices");
      }).catch((error) => { status.className = "status"; status.textContent = error.message || t("account.invoice_failed"); });
      return;
    }
    const requestForm = event.target.closest("[data-request-submit]");
    if (requestForm) {
      event.preventDefault();
      const formData = new FormData(requestForm);
      const status = requestForm.querySelector("[data-request-status]");
      const title = String(formData.get("title") || "").trim();
      const summary = String(formData.get("summary") || "").trim();
      if (!title || !summary) { if (status) status.textContent = t("requests.status_need_fields"); return; }
      if (!state.session) { if (status) status.textContent = t("requests.status_need_login"); return; }
      const payload = { type: String(formData.get("type") || "other"), title, summary, tool: String(formData.get("tool") || "") };
      if (status) status.textContent = t("pricing.loading");
      apiRequest("/api/requests", { method: "POST", body: JSON.stringify(payload) })
        .then((result) => {
          requests.unshift({ id: result && result.id ? result.id : `request-${Date.now()}`, type: payload.type, title, summary, votes: 0, status: "under-review", author: state.profile, time: new Date().toISOString().slice(0, 10), tool: payload.tool });
          requestForm.reset();
          document.querySelector("[data-request-modal]")?.setAttribute("hidden", "");
          state.requestFilter = "all";
          state.requestSort = "newest";
          render();
          showToast(t("requests.added"));
        })
        .catch((error) => { if (status) status.textContent = error.message || t("admin.load_failed"); });
    }
  });
  window.addEventListener("hashchange", () => { render(); if (!shareModal()?.hidden) updateShareLinks(); if (searchFocusPending) { searchFocusPending = false; const input = document.querySelector("#tools-search"); input.focus(); input.select(); } });
  render();
  hydrateConfig();
  hydrateSession();
})();
