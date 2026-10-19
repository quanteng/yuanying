/*!
 * 统一前端库加载器 · 单一源：packages/yykj-weblibs
 *
 * 工具页面只在 <head> 里写一段引导片段（与 /shared/yykj-header 同一约定）：
 *
 *   <script>
 *     (function () {
 *       var host = (location.hostname || "").toLowerCase();
 *       var dev = host === "localhost" || host === "127.0.0.1" || host === "::1";
 *       var base = dev ? "http://127.0.0.1:5176" : "https://fighub.bjyiyunkeji.online";
 *       window.YYKJ_WEBLIBS_BASE = base;
 *       window.YYKJ_WEBLIBS = ["leaflet", "bootstrap", "bootstrap-icons", "flatpickr", "html2canvas"];
 *       document.write('<script src="' + base + '/shared/yykj-weblibs/weblibs.js"><\/script>');
 *     })();
 *   </script>
 *
 * 说明：
 * - 必须在文档解析阶段（<head>）引入；此时用 document.write 顺序注入 CSS/JS，
 *   保证页面底部自己的脚本执行前库已就绪。
 * - 库版本只在本文件的 CATALOG 里登记；升级库 = 改这里 + 替换 vendor 目录。
 * - 字体（bootstrap-icons）跨源加载需要 ACAO，平台侧 /shared/* 已统一放开。
 */
(function () {
  "use strict";

  var VERSION = "2026-10-09.1";
  var CATALOG = {
    leaflet: {
      css: ["vendor/leaflet/1.9.4/leaflet.css"],
      js: ["vendor/leaflet/1.9.4/leaflet.js"]
    },
    "leaflet-draw": {
      css: ["vendor/leaflet-draw/1.0.4/leaflet.draw.css"],
      js: ["vendor/leaflet-draw/1.0.4/leaflet.draw.js"]
    },
    "leaflet.pattern": {
      css: [],
      js: ["vendor/leaflet.pattern/0.1.0/leaflet.pattern.js"]
    },
    bootstrap: {
      css: ["vendor/bootstrap/5.3.0/bootstrap.min.css"],
      js: ["vendor/bootstrap/5.3.0/bootstrap.bundle.min.js"]
    },
    "bootstrap-icons": {
      css: ["vendor/bootstrap-icons/1.11.3/bootstrap-icons.css"],
      js: []
    },
    "font-awesome": {
      css: ["vendor/font-awesome/6.4.0/css/all.min.css"],
      js: []
    },
    flatpickr: {
      css: ["vendor/flatpickr/4.6.13/flatpickr.min.css"],
      js: ["vendor/flatpickr/4.6.13/flatpickr.min.js", "vendor/flatpickr/4.6.13/l10n/zh.js"]
    },
    html2canvas: {
      css: [],
      js: ["vendor/html2canvas/1.4.1/html2canvas.min.js"]
    },
    xlsx: {
      css: [],
      js: ["vendor/xlsx/0.18.5/xlsx.full.min.js"]
    },
    spectrum: {
      css: ["vendor/spectrum/1.8.1/spectrum.css"],
      js: ["vendor/spectrum/1.8.1/spectrum.js"]
    },
    echarts: {
      css: [],
      js: ["vendor/echarts/5.5.1/echarts.min.js"]
    },
    "echarts-gl": {
      css: [],
      js: ["vendor/echarts-gl/2.0.9/echarts-gl.min.js"]
    },
    jszip: {
      css: [],
      js: ["vendor/jszip/3.10.1/jszip.min.js"]
    },
    "file-saver": {
      css: [],
      js: ["vendor/file-saver/2.0.5/FileSaver.min.js"]
    },
    shpjs: {
      css: [],
      js: ["vendor/shpjs/4.0.4/shp.js"]
    },
    togeojson: {
      css: [],
      js: ["vendor/togeojson/0.16.2/togeojson.js"]
    },
    tokml: {
      css: [],
      js: ["vendor/tokml/0.4.0/tokml.js"]
    },
    shapefile: {
      css: [],
      js: ["vendor/shapefile/0.6.6/shapefile.min.js"]
    },
    "shp-write": {
      css: [],
      js: ["vendor/shp-write/0.4.3/shpwrite.js"]
    },
    proj4: {
      css: [],
      js: ["vendor/proj4/2.9.1/proj4.js"]
    },
    geostats: {
      css: [],
      js: ["vendor/geostats/1.7.0/geostats.min.js"]
    },
    "chroma-js": {
      css: [],
      js: ["vendor/chroma-js/2.4.2/chroma.min.js"]
    },
    interactjs: {
      css: [],
      js: ["vendor/interactjs/1.10.27/interact.min.js"]
    },
    "qrcode-generator": {
      css: [],
      js: ["vendor/qrcode-generator/1.4.4/qrcode.js"]
    }
  };

  function currentScript() {
    if (document.currentScript) {
      return document.currentScript;
    }
    var scripts = document.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i--) {
      if ((scripts[i].src || "").indexOf("weblibs.js") !== -1) {
        return scripts[i];
      }
    }
    return null;
  }

  var self = currentScript();
  var ownDir = self && self.src ? self.src.replace(/\/[^/]*$/, "") : "";
  var base = ownDir || (window.YYKJ_WEBLIBS_BASE ? window.YYKJ_WEBLIBS_BASE + "/shared/yykj-weblibs" : "");
  var wanted = window.YYKJ_WEBLIBS;
  if (!wanted && self && self.getAttribute("data-libs")) {
    wanted = self.getAttribute("data-libs").split(/[\s,]+/);
  }
  if (!wanted || !wanted.length) {
    wanted = ["leaflet"];
  }
  if (!base) {
    console.error("[yykj-weblibs] 无法确定共享库基地址，请设置 window.YYKJ_WEBLIBS_BASE");
    return;
  }

  var parsing = document.readyState === "loading";
  if (!parsing) {
    console.warn("[yykj-weblibs] 建议在 <head> 内引入本加载器；当前改为异步加载，页面脚本可能早于库执行。");
  }

  function inject(tagName, attributes) {
    if (parsing) {
      var html = "<" + tagName;
      for (var key in attributes) {
        if (Object.prototype.hasOwnProperty.call(attributes, key)) {
          html += " " + key + '="' + attributes[key] + '"';
        }
      }
      document.write(html + "><\/" + tagName + ">");
      return;
    }
    var element = document.createElement(tagName);
    for (var name in attributes) {
      if (Object.prototype.hasOwnProperty.call(attributes, name)) {
        element.setAttribute(name, attributes[name]);
      }
    }
    (document.head || document.documentElement).appendChild(element);
  }

  var unknown = [];
  var loaded = [];
  for (var i = 0; i < wanted.length; i++) {
    var name = String(wanted[i] || "").trim();
    if (!name) {
      continue;
    }
    var entry = CATALOG[name];
    if (!entry) {
      unknown.push(name);
      continue;
    }
    var index;
    for (index = 0; index < entry.css.length; index++) {
      inject("link", { rel: "stylesheet", href: base + "/" + entry.css[index] });
    }
    for (index = 0; index < entry.js.length; index++) {
      inject("script", { src: base + "/" + entry.js[index] });
    }
    loaded.push(name);
  }

  if (unknown.length) {
    console.warn("[yykj-weblibs] 未登记的库：" + unknown.join(", ") + "（可在 packages/yykj-weblibs/weblibs.js 的 CATALOG 中补充）");
  }
  // 平台级模块：提交前「扣次数」提示（逻辑只在共享库，工具页零改动即生效；
  // 仅当页面带 ?pt= 令牌时启用，用 /api/usage 读取当前可用次数）。
  inject("script", { src: base + "/usage-notice.js", defer: "defer" });
  window.YYKJ_WEBLIBS_VERSION = VERSION;
  window.YYKJ_WEBLIBS_LOADED = loaded;
})();
