/*!
 * 提交前「扣次数」提示 · 单一源：packages/yykj-weblibs/usage-notice.js
 *
 * 设计（2026-10-17）：
 * - 逻辑只在 FigHub 共享库，工具页面不写任何扣费/确认代码；
 * - 工具页由 weblibs.js 自动注入本文件（无需逐个工具 embed）；
 * - 仅当页面带有 FigHub 签发的 ?pt= 令牌时启用：用令牌向
 *   /api/usage 换取「是否付费工具 / 可开通新场地数 / 已覆盖复算场地数」；
 * - 在提交类按钮（提交参数 / 生成… 或 [data-usage-submit]）点击时拦截一次，
 *   弹出「本次提交会占用 1 次场地使用次数」确认；确认后原按钮逻辑照常执行。
 *
 * 工具侧接入：默认零配置；特殊按钮可加 data-usage-submit 或设置
 *   window.YYKJ_USAGE_NOTICE = { selector: "#mySubmit" }。
 */
(function () {
  "use strict";

  if (window.YYKJ_USAGE_NOTICE_READY) {
    return;
  }
  window.YYKJ_USAGE_NOTICE_READY = true;

  var CONFIG = window.YYKJ_USAGE_NOTICE || {};
  var DEFAULT_SELECTORS = [
    "[data-usage-submit]",
    "#processBtn",
    "#generateBoringBtn",
    "#submitBtn",
    "#runBtn",
    "#startBtn"
  ];
  var ACTION_TEXT = /(提交参数|提交成果|开始处理|生成成果|生成布点|开始生成|确认提交|生成图例|生成图件)/;
  var STATE = {
    token: "",
    enabled: false,
    info: null,
    loading: null,
    lastFetch: 0
  };

  function portalBase() {
    var base = String(
      window.YYKJ_WEBLIBS_BASE || window.YYKJ_HEADER_BASE || ""
    ).replace(/\/+$/, "");
    if (base) return base;
    var host = String(location.hostname || "").toLowerCase();
    if (host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]") {
      return "http://127.0.0.1:5176";
    }
    return "https://fighub.bjyiyunkeji.online";
  }

  function token() {
    try {
      return new URLSearchParams(location.search).get("pt") || "";
    } catch (error) {
      return "";
    }
  }

  function fetchUsage(force) {
    if (!STATE.token) return Promise.resolve(null);
    var now = Date.now();
    if (!force && STATE.info && now - STATE.lastFetch < 30000) {
      return Promise.resolve(STATE.info);
    }
    if (STATE.loading) return STATE.loading;
    var url = portalBase() + "/api/usage?pt=" + encodeURIComponent(STATE.token);
    STATE.loading = fetch(url, { credentials: "omit", headers: { Accept: "application/json" } })
      .then(function (response) {
        if (!response.ok) return null;
        return response.json();
      })
      .then(function (payload) {
        STATE.info = payload || null;
        STATE.lastFetch = Date.now();
        if (payload && payload.paid === false) {
          STATE.enabled = false;
        }
        return STATE.info;
      })
      .catch(function () {
        // 读不到次数不阻断提交流程：保留通用提示（enabled 初始为 true）
        return null;
      })
      .then(function (result) {
        STATE.loading = null;
        return result;
      });
    return STATE.loading;
  }

  function isAction(element) {
    if (!element || element.disabled) return false;
    if (element.closest("[data-yykj-usage-modal]")) return false;
    if (element.closest("[role='dialog'], .modal, .offcanvas, [data-pay-modal], [data-qr-modal]")) return false;
    if (CONFIG.selector) {
      try {
        if (element.matches(CONFIG.selector)) return true;
      } catch (error) {
        /* 非法选择器忽略 */
      }
    }
    for (var i = 0; i < DEFAULT_SELECTORS.length; i += 1) {
      if (element.matches(DEFAULT_SELECTORS[i])) return true;
    }
    var text = (element.textContent || element.value || "").trim();
    if (!text || !ACTION_TEXT.test(text)) return false;
    if (/(取消|关闭|删除|移除|返回|登录|退出|清空|重置)/.test(text)) return false;
    return /btn-primary|btn-success|primary/.test(String(element.className || ""));
  }

  function summaryHtml(info) {
    if (!info) {
      return "正在读取你的可用次数…";
    }
    var parts = [];
    if (info.remaining_sites === null) {
      parts.push("当前次数不限");
    } else if (typeof info.remaining_sites === "number") {
      parts.push("当前可开通新场地 <strong>" + info.remaining_sites + "</strong> 个");
    }
    if (info.covered_sites) {
      parts.push("复算窗口内已覆盖 <strong>" + info.covered_sites + "</strong> 个场地");
    }
    if (!parts.length) {
      parts.push("当前没有可用场地额度，提交新场地时会提示开通");
    }
    return parts.join(" · ");
  }

  function closeModal(overlay) {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    document.body.style.overflow = "";
  }

  function confirmSubmit(button, proceed) {
    var overlay = document.createElement("div");
    overlay.setAttribute("data-yykj-usage-modal", "");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "yykjUsageTitle");
    overlay.style.cssText = "position:fixed;inset:0;z-index:3000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(15,23,42,.5);";
    var info = STATE.info;
    var windowDays = (info && info.window_days) || 7;
    overlay.innerHTML =
      '<div style="width:min(460px,100%);background:#fff;border-radius:16px;padding:22px 24px;box-shadow:0 28px 60px -28px rgba(15,23,42,.55);">' +
      '  <div style="display:inline-flex;align-items:center;gap:6px;margin-bottom:10px;padding:4px 10px;border-radius:999px;background:#eef5ff;color:#2f6fe4;font-size:12px;font-weight:700;">使用次数</div>' +
      '  <h2 id="yykjUsageTitle" style="margin:0 0 8px;font-size:19px;line-height:26px;font-weight:750;color:#17293a;">提交前确认</h2>' +
      '  <p style="margin:0 0 6px;font-size:14px;line-height:22px;color:#33475f;">本次提交会占用 <strong>1 次</strong> 场地使用次数。</p>' +
      '  <p style="margin:0 0 10px;font-size:13px;line-height:20px;color:#5b6b7d;">' + summaryHtml(info) + "</p>" +
      '  <div style="display:grid;gap:6px;margin:12px 0 18px;padding:12px 14px;border-radius:12px;background:#f6f9fd;color:#5b6b7d;font-size:12.5px;line-height:19px;">' +
      "    <div>· 同一场地 " + windowDays + " 天内重复提交不扣次数</div>" +
      "    <div>· 示例数据免费体验，不扣次数</div>" +
      "    <div>· 取消后可继续调整参数，不会产生任何扣费</div>" +
      "  </div>" +
      '  <div style="display:flex;gap:10px;justify-content:flex-end;">' +
      '    <button type="button" data-yykj-usage-cancel style="min-height:40px;padding:0 16px;border:1px solid #d8e0ea;border-radius:10px;background:#fff;color:#33475f;font-size:14px;font-weight:600;cursor:pointer;">取消</button>' +
      '    <button type="button" data-yykj-usage-confirm style="min-height:40px;padding:0 18px;border:0;border-radius:10px;background:linear-gradient(135deg,#5a9cff,#3f7ceb);color:#fff;font-size:14px;font-weight:700;cursor:pointer;">确认提交</button>' +
      "  </div>" +
      "</div>";
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
    function cancel() {
      closeModal(overlay);
    }
    overlay.querySelector("[data-yykj-usage-cancel]").addEventListener("click", cancel);
    overlay.querySelector("[data-yykj-usage-confirm]").addEventListener("click", function () {
      closeModal(overlay);
      fetchUsage(true);
      proceed();
    });
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) cancel();
    });
    document.addEventListener("keydown", function onKey(event) {
      if (event.key !== "Escape") return;
      document.removeEventListener("keydown", onKey);
      cancel();
    });
    var confirmButton = overlay.querySelector("[data-yykj-usage-confirm]");
    if (confirmButton) confirmButton.focus();
  }

  function intercept(event, element, retrigger) {
    if (!STATE.enabled || !isAction(element)) return;
    if (element.getAttribute("data-yykj-usage-confirmed") === "1") {
      element.removeAttribute("data-yykj-usage-confirmed");
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    fetchUsage(false).then(function () {
      confirmSubmit(element, function () {
        element.setAttribute("data-yykj-usage-confirmed", "1");
        retrigger(element);
      });
    });
  }

  function closestAction(node) {
    var element = node && node.closest
      ? node.closest("button, input[type='submit'], a.btn")
      : null;
    return element;
  }

  document.addEventListener(
    "click",
    function (event) {
      var element = closestAction(event.target);
      if (!element) return;
      intercept(event, element, function (button) {
        button.click();
      });
    },
    true
  );

  document.addEventListener(
    "submit",
    function (event) {
      var form = event.target;
      if (!form || !form.querySelector) return;
      if (!STATE.enabled) return;
      var submitter = event.submitter || form.querySelector("[data-usage-submit], button[type='submit'], input[type='submit']");
      if (!submitter || !isAction(submitter)) return;
      if (form.getAttribute("data-yykj-usage-confirmed") === "1") {
        form.removeAttribute("data-yykj-usage-confirmed");
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      fetchUsage(false).then(function () {
        confirmSubmit(submitter, function () {
          form.setAttribute("data-yykj-usage-confirmed", "1");
          if (typeof form.requestSubmit === "function") {
            form.requestSubmit(submitter);
          } else {
            form.submit();
          }
        });
      });
    },
    true
  );

  STATE.token = token();
  if (!STATE.token) {
    return;
  }
  STATE.enabled = true;
  fetchUsage(true);
  window.YYKJ_USAGE_NOTICE_API = {
    refresh: function () {
      return fetchUsage(true);
    },
    state: STATE
  };
})();
