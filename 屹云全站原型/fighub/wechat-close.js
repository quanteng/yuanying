/*!
 * 微信扫码结果页的“返回微信”按钮（同源脚本，符合站点 CSP）。
 *
 * 页面由 portal 的 /auth/wechat/callback 在手机微信内渲染；点按钮时优先调用
 * 微信内置浏览器桥关掉当前网页（回到用户进来前的位置），不支持时退回历史的
 * 上一页，再不行就提示手动关闭。
 */
(function () {
  "use strict";

  var bind = function () {
    var button = document.querySelector("[data-wechat-close]");
    if (!button || button.dataset.wechatCloseBound === "true") return;
    button.dataset.wechatCloseBound = "true";
    button.addEventListener("click", function () {
      var bridge = window.WeixinJSBridge;
      if (bridge && typeof bridge.invoke === "function") {
        try {
          bridge.invoke("closeWindow", {}, function () {});
          return;
        } catch (error) {
          /* fall through to the browser history fallback */
        }
      }
      if (window.history.length > 1) {
        window.history.back();
        return;
      }
      button.textContent = "请点右上角「···」→ 关闭";
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
