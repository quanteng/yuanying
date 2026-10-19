/*!
 * 统一底图加载器 · 单一源：packages/yykj-basemap
 *
 * 工具页面只在 <head> 里写一段引导片段（与 /shared/yykj-header、/shared/yykj-weblibs 同一约定）：
 *
 *   <script>
 *     (function () {
 *       var host = (location.hostname || "").toLowerCase();
 *       var dev = host === "localhost" || host === "127.0.0.1" || host === "::1";
 *       var base = dev ? "http://127.0.0.1:5176" : "https://fighub.bjyiyunkeji.online";
 *       window.YYKJ_BASEMAP_BASE = base;
 *       document.write('<script src="' + base + '/shared/yykj-basemap/basemaps.js"><\/script>');
 *     })();
 *   </script>
 *
 * 页面脚本里的唯一写法：
 *
 *   var layer = YYKJ_BASEMAPS.layer("imagery");   // 在线影像（实时拉取）
 *
 * 约定（2026-10-12 起）：
 * - 底图一律**在线实时获取**，不再落地本地瓦片、不再写运行缓存；每次打开都取当期影像。
 * - 瓦片地址只在本文件登记，工具页面不得写 tile.openstreetmap.org / map.geoq.cn /
 *   basemaps.cartocdn.com / services.arcgisonline.com 等境外瓦片域名（巡检 scripts\check_basemap.py）。
 * - 需要网络：外网不可达时底图会空白，页面应提示"底图需要外网"，不影响工具本身出成果。
 */
(function () {
  "use strict";

  var VERSION = "2026-10-12.2";
  var CATALOG = {
    imagery: {
      label: "在线影像",
      minZoom: 0,
      maxZoom: 19,
      // Esri 影像在国内多数区域只到 z18，z19 会返回 "Map data not yet available" 灰块，
      // 因此原生层级封顶 18，更高层级由 Leaflet 放大（比灰块/糊图更可用）。
      maxNativeZoom: 18,
      // 原型包使用本地矢量底图，便于离线评审；正式站点仍使用共享在线影像。
      urlTemplate: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InRlcnJhaW4iIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZThlZWU1Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU1IiBzdG9wLWNvbG9yPSIjZDhlMmQ1Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2M5ZDdjYSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxwYXR0ZXJuIGlkPSJwYXJjZWxzIiB3aWR0aD0iNjQiIGhlaWdodD0iNTIiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgtOCkiPgogICAgICA8cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNTIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2I5YzhiOCIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIuNiIvPgogICAgICA8cGF0aCBkPSJNMCAxOGg2NE0wIDM3aDY0TTIyIDB2NTJNNDYgMHY1MiIgc3Ryb2tlPSIjYzNkMGMxIiBzdHJva2Utd2lkdGg9Ii43IiBvcGFjaXR5PSIuNTUiLz4KICAgIDwvcGF0dGVybj4KICAgIDxmaWx0ZXIgaWQ9InNvZnQiPgogICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI4Ii8+CiAgICA8L2ZpbHRlcj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIGZpbGw9InVybCgjdGVycmFpbikiLz4KICA8cGF0aCBkPSJNLTIwIDE5MEMzNiAxNDIgNzQgMTU2IDExOCAxMThzNjUtOTEgMTUwLTY3djIxNUgtMjBaIiBmaWxsPSIjYzJkMGJkIiBvcGFjaXR5PSIuNTUiLz4KICA8cGF0aCBkPSJNLTEyIDU4QzU1IDc4IDgzIDUwIDE0MyA3MHM2NSA1NSAxMjYgNDR2MzhjLTcyIDE4LTExMC0zNS0xNjUtMzJTMjUgMTQ1LTEyIDEyMloiIGZpbGw9IiNiN2M3YjQiIG9wYWNpdHk9Ii41IiBmaWx0ZXI9InVybCgjc29mdCkiLz4KICA8cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0idXJsKCNwYXJjZWxzKSIvPgogIDxwYXRoIGQ9Ik0tMTUgMjE0QzYyIDE4MyA5MyAyMDcgMTUxIDE2NXM3NC01OCAxMjItMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2E4YjhhOCIgc3Ryb2tlLXdpZHRoPSI2IiBvcGFjaXR5PSIuNjUiLz4KICA8cGF0aCBkPSJNLTE1IDIxNEM2MiAxODMgOTMgMjA3IDE1MSAxNjVzNzQtNTggMTIyLTMwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmNGY3ZjIiIHN0cm9rZS13aWR0aD0iMiIgb3BhY2l0eT0iLjc1Ii8+CiAgPHBhdGggZD0iTTI5LTE4QzU1IDMzIDQzIDcyIDc2IDExMXM2MCA1MCA2NiAxNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QxYWE3OSIgc3Ryb2tlLXdpZHRoPSI1IiBvcGFjaXR5PSIuNSIvPgogIDxwYXRoIGQ9Ik0yOS0xOEM1NSAzMyA0MyA3MiA3NiAxMTFzNjAgNTAgNjYgMTYwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmYmY3ZWIiIHN0cm9rZS13aWR0aD0iMS42IiBvcGFjaXR5PSIuOCIvPgogIDxnIGZpbGw9IiM4ZWFhOTIiIG9wYWNpdHk9Ii40MiI+CiAgICA8ZWxsaXBzZSBjeD0iMjAxIiBjeT0iNTQiIHJ4PSIxOCIgcnk9IjEwIi8+CiAgICA8ZWxsaXBzZSBjeD0iMjE2IiBjeT0iNzYiIHJ4PSIyMyIgcnk9IjEyIi8+CiAgICA8ZWxsaXBzZSBjeD0iMzIiIGN5PSIxNjMiIHJ4PSIxNiIgcnk9IjkiLz4KICA8L2c+CiAgPGcgZmlsbD0iIzllYjViOCIgb3BhY2l0eT0iLjQyIj4KICAgIDxyZWN0IHg9IjExMiIgeT0iMjA0IiB3aWR0aD0iMjEiIGhlaWdodD0iMTMiIHJ4PSIyIi8+CiAgICA8cmVjdCB4PSIxNDAiIHk9IjE4OSIgd2lkdGg9IjE3IiBoZWlnaHQ9IjEwIiByeD0iMiIvPgogIDwvZz4KICA8cGF0aCBkPSJNMCAyNDdjNDUtOSA2NCA1IDEwMS03czczLTEyIDE1NS0xIiBmaWxsPSJub25lIiBzdHJva2U9IiNhOGM0ZDAiIHN0cm9rZS13aWR0aD0iMyIgb3BhY2l0eT0iLjUiLz4KPC9zdmc+Cg==",
      hosts: [],
      attribution: "Prototype terrain"
    },
    gray: {
      label: "在线浅色底图",
      minZoom: 0,
      maxZoom: 19,
      maxNativeZoom: 18,
      urlTemplate: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InRlcnJhaW4iIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZThlZWU1Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU1IiBzdG9wLWNvbG9yPSIjZDhlMmQ1Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2M5ZDdjYSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxwYXR0ZXJuIGlkPSJwYXJjZWxzIiB3aWR0aD0iNjQiIGhlaWdodD0iNTIiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgtOCkiPgogICAgICA8cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNTIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2I5YzhiOCIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIuNiIvPgogICAgICA8cGF0aCBkPSJNMCAxOGg2NE0wIDM3aDY0TTIyIDB2NTJNNDYgMHY1MiIgc3Ryb2tlPSIjYzNkMGMxIiBzdHJva2Utd2lkdGg9Ii43IiBvcGFjaXR5PSIuNTUiLz4KICAgIDwvcGF0dGVybj4KICAgIDxmaWx0ZXIgaWQ9InNvZnQiPgogICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI4Ii8+CiAgICA8L2ZpbHRlcj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIGZpbGw9InVybCgjdGVycmFpbikiLz4KICA8cGF0aCBkPSJNLTIwIDE5MEMzNiAxNDIgNzQgMTU2IDExOCAxMThzNjUtOTEgMTUwLTY3djIxNUgtMjBaIiBmaWxsPSIjYzJkMGJkIiBvcGFjaXR5PSIuNTUiLz4KICA8cGF0aCBkPSJNLTEyIDU4QzU1IDc4IDgzIDUwIDE0MyA3MHM2NSA1NSAxMjYgNDR2MzhjLTcyIDE4LTExMC0zNS0xNjUtMzJTMjUgMTQ1LTEyIDEyMloiIGZpbGw9IiNiN2M3YjQiIG9wYWNpdHk9Ii41IiBmaWx0ZXI9InVybCgjc29mdCkiLz4KICA8cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0idXJsKCNwYXJjZWxzKSIvPgogIDxwYXRoIGQ9Ik0tMTUgMjE0QzYyIDE4MyA5MyAyMDcgMTUxIDE2NXM3NC01OCAxMjItMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2E4YjhhOCIgc3Ryb2tlLXdpZHRoPSI2IiBvcGFjaXR5PSIuNjUiLz4KICA8cGF0aCBkPSJNLTE1IDIxNEM2MiAxODMgOTMgMjA3IDE1MSAxNjVzNzQtNTggMTIyLTMwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmNGY3ZjIiIHN0cm9rZS13aWR0aD0iMiIgb3BhY2l0eT0iLjc1Ii8+CiAgPHBhdGggZD0iTTI5LTE4QzU1IDMzIDQzIDcyIDc2IDExMXM2MCA1MCA2NiAxNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QxYWE3OSIgc3Ryb2tlLXdpZHRoPSI1IiBvcGFjaXR5PSIuNSIvPgogIDxwYXRoIGQ9Ik0yOS0xOEM1NSAzMyA0MyA3MiA3NiAxMTFzNjAgNTAgNjYgMTYwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmYmY3ZWIiIHN0cm9rZS13aWR0aD0iMS42IiBvcGFjaXR5PSIuOCIvPgogIDxnIGZpbGw9IiM4ZWFhOTIiIG9wYWNpdHk9Ii40MiI+CiAgICA8ZWxsaXBzZSBjeD0iMjAxIiBjeT0iNTQiIHJ4PSIxOCIgcnk9IjEwIi8+CiAgICA8ZWxsaXBzZSBjeD0iMjE2IiBjeT0iNzYiIHJ4PSIyMyIgcnk9IjEyIi8+CiAgICA8ZWxsaXBzZSBjeD0iMzIiIGN5PSIxNjMiIHJ4PSIxNiIgcnk9IjkiLz4KICA8L2c+CiAgPGcgZmlsbD0iIzllYjViOCIgb3BhY2l0eT0iLjQyIj4KICAgIDxyZWN0IHg9IjExMiIgeT0iMjA0IiB3aWR0aD0iMjEiIGhlaWdodD0iMTMiIHJ4PSIyIi8+CiAgICA8cmVjdCB4PSIxNDAiIHk9IjE4OSIgd2lkdGg9IjE3IiBoZWlnaHQ9IjEwIiByeD0iMiIvPgogIDwvZz4KICA8cGF0aCBkPSJNMCAyNDdjNDUtOSA2NCA1IDEwMS03czczLTEyIDE1NS0xIiBmaWxsPSJub25lIiBzdHJva2U9IiNhOGM0ZDAiIHN0cm9rZS13aWR0aD0iMyIgb3BhY2l0eT0iLjUiLz4KPC9zdmc+Cg==",
      hosts: [],
      attribution: "Prototype terrain"
    },
    street: {
      label: "在线街道图",
      minZoom: 0,
      maxZoom: 19,
      maxNativeZoom: 18,
      urlTemplate: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InRlcnJhaW4iIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZThlZWU1Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU1IiBzdG9wLWNvbG9yPSIjZDhlMmQ1Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2M5ZDdjYSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxwYXR0ZXJuIGlkPSJwYXJjZWxzIiB3aWR0aD0iNjQiIGhlaWdodD0iNTIiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgtOCkiPgogICAgICA8cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNTIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2I5YzhiOCIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIuNiIvPgogICAgICA8cGF0aCBkPSJNMCAxOGg2NE0wIDM3aDY0TTIyIDB2NTJNNDYgMHY1MiIgc3Ryb2tlPSIjYzNkMGMxIiBzdHJva2Utd2lkdGg9Ii43IiBvcGFjaXR5PSIuNTUiLz4KICAgIDwvcGF0dGVybj4KICAgIDxmaWx0ZXIgaWQ9InNvZnQiPgogICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI4Ii8+CiAgICA8L2ZpbHRlcj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIGZpbGw9InVybCgjdGVycmFpbikiLz4KICA8cGF0aCBkPSJNLTIwIDE5MEMzNiAxNDIgNzQgMTU2IDExOCAxMThzNjUtOTEgMTUwLTY3djIxNUgtMjBaIiBmaWxsPSIjYzJkMGJkIiBvcGFjaXR5PSIuNTUiLz4KICA8cGF0aCBkPSJNLTEyIDU4QzU1IDc4IDgzIDUwIDE0MyA3MHM2NSA1NSAxMjYgNDR2MzhjLTcyIDE4LTExMC0zNS0xNjUtMzJTMjUgMTQ1LTEyIDEyMloiIGZpbGw9IiNiN2M3YjQiIG9wYWNpdHk9Ii41IiBmaWx0ZXI9InVybCgjc29mdCkiLz4KICA8cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0idXJsKCNwYXJjZWxzKSIvPgogIDxwYXRoIGQ9Ik0tMTUgMjE0QzYyIDE4MyA5MyAyMDcgMTUxIDE2NXM3NC01OCAxMjItMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2E4YjhhOCIgc3Ryb2tlLXdpZHRoPSI2IiBvcGFjaXR5PSIuNjUiLz4KICA8cGF0aCBkPSJNLTE1IDIxNEM2MiAxODMgOTMgMjA3IDE1MSAxNjVzNzQtNTggMTIyLTMwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmNGY3ZjIiIHN0cm9rZS13aWR0aD0iMiIgb3BhY2l0eT0iLjc1Ii8+CiAgPHBhdGggZD0iTTI5LTE4QzU1IDMzIDQzIDcyIDc2IDExMXM2MCA1MCA2NiAxNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QxYWE3OSIgc3Ryb2tlLXdpZHRoPSI1IiBvcGFjaXR5PSIuNSIvPgogIDxwYXRoIGQ9Ik0yOS0xOEM1NSAzMyA0MyA3MiA3NiAxMTFzNjAgNTAgNjYgMTYwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmYmY3ZWIiIHN0cm9rZS13aWR0aD0iMS42IiBvcGFjaXR5PSIuOCIvPgogIDxnIGZpbGw9IiM4ZWFhOTIiIG9wYWNpdHk9Ii40MiI+CiAgICA8ZWxsaXBzZSBjeD0iMjAxIiBjeT0iNTQiIHJ4PSIxOCIgcnk9IjEwIi8+CiAgICA8ZWxsaXBzZSBjeD0iMjE2IiBjeT0iNzYiIHJ4PSIyMyIgcnk9IjEyIi8+CiAgICA8ZWxsaXBzZSBjeD0iMzIiIGN5PSIxNjMiIHJ4PSIxNiIgcnk9IjkiLz4KICA8L2c+CiAgPGcgZmlsbD0iIzllYjViOCIgb3BhY2l0eT0iLjQyIj4KICAgIDxyZWN0IHg9IjExMiIgeT0iMjA0IiB3aWR0aD0iMjEiIGhlaWdodD0iMTMiIHJ4PSIyIi8+CiAgICA8cmVjdCB4PSIxNDAiIHk9IjE4OSIgd2lkdGg9IjE3IiBoZWlnaHQ9IjEwIiByeD0iMiIvPgogIDwvZz4KICA8cGF0aCBkPSJNMCAyNDdjNDUtOSA2NCA1IDEwMS03czczLTEyIDE1NS0xIiBmaWxsPSJub25lIiBzdHJva2U9IiNhOGM0ZDAiIHN0cm9rZS13aWR0aD0iMyIgb3BhY2l0eT0iLjUiLz4KPC9zdmc+Cg==",
      hosts: [],
      attribution: "Prototype terrain"
    }
  };

  function currentScript() {
    if (document.currentScript) {
      return document.currentScript;
    }
    var scripts = document.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i--) {
      if ((scripts[i].src || "").indexOf("basemaps.js") !== -1) {
        return scripts[i];
      }
    }
    return null;
  }

  var self = currentScript();
  var ownDir = self && self.src ? self.src.replace(/\/[^/]*$/, "") : "";
  var base = ownDir || (window.YYKJ_BASEMAP_BASE ? window.YYKJ_BASEMAP_BASE + "/shared/yykj-basemap" : "");

  function entry(name) {
    return CATALOG[name] || null;
  }

  function url(name) {
    var item = entry(name);
    if (!item) {
      console.warn("[yykj-basemap] 未登记的底图：" + name);
      return "";
    }
    return item.urlTemplate;
  }

  function layer(name, options) {
    var item = entry(name);
    if (!item) {
      console.warn("[yykj-basemap] 未登记的底图：" + name);
      return null;
    }
    if (!window.L) {
      console.error("[yykj-basemap] 需要先加载 Leaflet（window.YYKJ_WEBLIBS 里登记 leaflet）");
      return null;
    }
    var opts = options || {};
    if (opts.online === false || opts.offline) {
      console.warn("[yykj-basemap] 本地瓦片/离线底图已下线（统一在线实时获取），" + name + " 仍按在线图层加载");
    }
    var settings = {
      minZoom: item.minZoom,
      maxNativeZoom: item.maxNativeZoom,
      maxZoom: opts.maxZoom || item.maxZoom,
      attribution: opts.attribution || item.attribution,
      crossOrigin: "anonymous",
      detectRetina: false
    };
    Object.keys(opts).forEach(function (key) {
      if (key === "online" || key === "offline" || key === "maxZoom" || key === "attribution") {
        return;
      }
      settings[key] = opts[key];
    });
    return window.L.tileLayer(item.urlTemplate, settings);
  }

  window.YYKJ_BASEMAPS = {
    version: VERSION,
    base: base,
    layerMode: "online-only",
    catalog: CATALOG,
    has: function (name) {
      return !!entry(name);
    },
    url: url,
    layer: layer,
    maxNativeZoom: function (name) {
      var item = entry(name);
      return item ? item.maxNativeZoom : 0;
    },
    onlineHosts: function (name) {
      var item = entry(name);
      return item ? item.hosts.slice() : [];
    }
  };
})();
