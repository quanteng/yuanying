/*!
 * 共享前端库引导（FigHub 门店）
 *
 * 工具页在 <head> 里内联引导片段；门店页面受 CSP（script-src 'self'）限制
 * 不能内联脚本，所以用这个同源外部文件做同样的事：声明所需的共享库，
 * 再按 /shared/yykj-weblibs 的加载器顺序注入。库版本只在
 * packages/yykj-weblibs/weblibs.js 的 CATALOG 里维护。
 */
(function () {
  "use strict";
  var base = "../shared/yykj-weblibs";
  window.YYKJ_WEBLIBS_BASE = location.protocol === "file:" ? ".." : new URL("..", location.href).href.replace(/\/$/, "");
  window.YYKJ_WEBLIBS = ["qrcode-generator"];
  document.write('<script src="' + base + '/weblibs.js" data-libs="qrcode-generator"><\/script>');
})();
