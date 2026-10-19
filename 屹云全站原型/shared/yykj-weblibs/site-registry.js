/*!
 * 四至（地块范围）特征上报 · 单一源：packages/yykj-weblibs/site-registry.js
 *
 * 工具页在 <head> 引导片段里追加一行即可（与 weblibs.js 同一 base）：
 *
 *   document.write('<script src="' + base + '/shared/yykj-weblibs/site-registry.js"><\/script>');
 *
 * 用法（拿到地块外接矩形后调用一次，返回 Promise，失败时为 null 且绝不影响主流程）：
 *
 *   window.yykjReportSite([minX, minY, maxX, maxY], { crs: "EPSG:4490", label: "场地名" })
 *     .then(function (result) {
 *       if (!result) return;                       // 未登录 / 网络异常：静默跳过
 *       console.log(result.matched ? "同一场地" : "新场地", result.site.site_id);
 *     });
 *
 * 说明：
 * - 只上报四至与坐标系，不包含任何原始数据；服务端只保存四至特征（见《隐私政策》）。
 * - 同一次页面会话内相同四至只上报一次，避免重复计数。
 * - 未登录（401）时静默跳过，不打扰用户。
 */
(function () {
  "use strict";

  var ENDPOINT = "/api/me/sites/match";
  var lastKey = "";

  function platformEndpoint() {
    var base = String(window.YYKJ_WEBLIBS_BASE || window.YYKJ_HEADER_BASE || "").replace(/\/+$/, "");
    return base ? base + ENDPOINT : "";
  }

  function normalize(bounds) {
    if (!bounds) return null;
    var values;
    if (Array.isArray(bounds)) {
      values = bounds.slice(0, 4);
    } else if (typeof bounds === "object") {
      values = [bounds.minX != null ? bounds.minX : bounds.min_x,
                bounds.minY != null ? bounds.minY : bounds.min_y,
                bounds.maxX != null ? bounds.maxX : bounds.max_x,
                bounds.maxY != null ? bounds.maxY : bounds.max_y];
    } else {
      return null;
    }
    if (values.length !== 4) return null;
    var numbers = values.map(function (value) { return Number(value); });
    if (numbers.some(function (value) { return !isFinite(value); })) return null;
    if (!(numbers[2] > numbers[0]) || !(numbers[3] > numbers[1])) return null;
    return numbers;
  }

  window.yykjReportSite = function (bounds, options) {
    var values = normalize(bounds);
    if (!values) return Promise.resolve(null);
    var optionsValue = options || {};
    var key = values.map(function (value) { return value.toFixed(6); }).join(",");
    if (key === lastKey) return Promise.resolve(null);
    var payload = {
      bounds: values,
      crs: String(optionsValue.crs || ""),
      label: String(optionsValue.label || "").slice(0, 60)
    };
    // production 模式下门户强制 CSRF：先取一次令牌（同源/跨子域都带上凭据）。
    var csrfToken = "";
    function fetchCsrf(credentials) {
      var target = platformEndpoint() ? platformEndpoint().replace(/\/api\/me\/sites\/match$/, "/api/csrf") : "/api/csrf";
      return fetch(target, { credentials: credentials })
        .then(function (response) { return response.ok ? response.json() : null; })
        .then(function (data) { csrfToken = (data && data.csrf_token) || ""; })
        .catch(function () { csrfToken = ""; });
    }
    function post(url, credentials, withCsrf) {
      var headers = { "Content-Type": "application/json" };
      if (withCsrf && csrfToken) headers["X-CSRF-Token"] = csrfToken;
      return fetch(url, {
        method: "POST",
        credentials: credentials,
        headers: headers,
        body: JSON.stringify(payload)
      }).then(function (response) { return response.ok ? response.json() : null; });
    }

    // 工具页通常经 FigHub 域代理（同源）；直接用工具域名打开时再试平台地址。
    return fetchCsrf("same-origin")
      .then(function () { return post(ENDPOINT, "same-origin", true); })
      .catch(function () { return null; })
      .then(function (result) {
        if (result) return result;
        var fallback = platformEndpoint();
        if (!fallback || fallback === ENDPOINT) return null;
        return fetchCsrf("include")
          .then(function () { return post(fallback, "include", true); })
          .catch(function () { return null; });
      })
      .then(function (result) {
        if (result) lastKey = key;
        if (result && typeof optionsValue.onResult === "function") {
          try { optionsValue.onResult(result); } catch (error) { /* 回调异常不影响工具 */ }
        }
        return result || null;
      })
      .catch(function () { return null; });
  };
})();
