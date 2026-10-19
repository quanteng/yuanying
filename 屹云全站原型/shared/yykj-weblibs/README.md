# 共享前端库（packages/yykj-weblibs）

Leaflet / Bootstrap / bootstrap-icons / flatpickr / html2canvas 的**唯一源**，由 FigHub
平台按 `/shared/yykj-weblibs/*` 提供（与 `/shared/yykj-header` 同一约定）。工具页面不得
再写 `unpkg.com`、`cdn.jsdelivr.net`、`cdnjs.cloudflare.com` 等外链。

## 页面接入（唯一写法）

```html
<script>
  (function () {
    var host = (location.hostname || "").toLowerCase();
    var dev = host === "localhost" || host === "127.0.0.1" || host === "::1";
    var base = dev ? "http://127.0.0.1:5176" : "https://fighub.bjyiyunkeji.online";
    window.YYKJ_WEBLIBS_BASE = base;
    window.YYKJ_WEBLIBS = ["leaflet", "bootstrap", "bootstrap-icons", "flatpickr", "html2canvas"];
    document.write('<script src="' + base + '/shared/yykj-weblibs/weblibs.js"><\/script>');
  })();
</script>
```

按需裁剪 `window.YYKJ_WEBLIBS` 数组；不需要的库不要登记。该片段放在 `<head>`，
加载器会用 `document.write` 顺序注入 CSS/JS，页面底部自己的脚本执行前库已就绪。

门店（`apps/fighub`）受 CSP `script-src 'self'` 限制不能内联脚本，改用同源外部引导
`apps/fighub/libs.js`：内容相同，只是把上面这段代码放进一个 `.js` 文件，再由
`index.html` 用 `<script src="./libs.js">` 引入。新增门店用库时只改这个文件里的
`window.YYKJ_WEBLIBS` 数组。

## 已登记库与版本

| 名称 | 版本 | 备注 |
|---|---|---|
| `leaflet` | 1.9.4 | 含 marker / layers 图片 |
| `leaflet-draw` | 1.0.4 | 依赖 `leaflet`，需排在其后 |
| `leaflet.pattern` | 0.1.0 | 原页面引用 0.0.2（npm 上不存在），取 0.1.0 |
| `bootstrap` | 5.3.0 | css + bundle.js |
| `bootstrap-icons` | 1.11.3 | css + woff/woff2（原 1.10.0/1.11.3 混用，统一到 1.11.3） |
| `font-awesome` | 6.4.0 | `@fortawesome/fontawesome-free`，css + webfonts |
| `flatpickr` | 4.6.13 | css + js + 中文语言包 |
| `html2canvas` | 1.4.1 | |
| `xlsx` | 0.18.5 | SheetJS `xlsx.full.min.js` |
| `spectrum` | 1.8.1 | 颜色选择器（当前无工具使用，保留备用；依赖 jQuery） |
| `echarts` | 5.5.1 | |
| `echarts-gl` | 2.0.9 | 依赖先加载 `echarts` |
| `jszip` | 3.10.1 | `shapefile` / `shp-write` 需要先加载 |
| `file-saver` | 2.0.5 | |
| `shpjs` | 4.0.4 | 原引用 4.0.0（npm 上不存在 4.0.0），取 4.0.4 |
| `togeojson` | 0.16.2 | `@mapbox/togeojson`，原引用 0.16.5（不存在） |
| `tokml` | 0.4.0 | 原引用 `@placemarkio/tokml@0.4.1`（无浏览器包），改用 `tokml` UMD 版 |
| `shapefile` | 0.6.6 | 需要 `jszip` |
| `shp-write` | 0.4.3 | `@mapbox/shp-write`，原引用 0.3.2 |
| `proj4` | 2.9.1 | |
| `geostats` | 1.7.0 | 浏览器全局是 `window.geostats`（小写） |
| `chroma-js` | 2.4.2 | |
| `interactjs` | 1.10.27 | |
| `qrcode-generator` | 1.4.4 | `kazuhikoarase/qrcode-generator`（MIT）；全局 `window.qrcode`，用 `createSvgTag()` 出二维码；FigHub 扫码登录 / 微信支付用 |

### 工具 → 库对照

| 工具 | `window.YYKJ_WEBLIBS` |
|---|---|
| boundary | leaflet, bootstrap, bootstrap-icons, flatpickr, html2canvas |
| xy | leaflet, bootstrap-icons, leaflet-draw, xlsx |
| toshp | leaflet, bootstrap-icons |
| groundwater | bootstrap, bootstrap-icons, leaflet |
| dem | bootstrap, bootstrap-icons, echarts, echarts-gl, jszip |
| planboring | bootstrap, bootstrap-icons, leaflet, shpjs, html2canvas, file-saver |
| spatial | leaflet, font-awesome, leaflet.pattern, proj4, togeojson, tokml, shapefile, jszip, shp-write, geostats, chroma-js, interactjs, file-saver, html2canvas, xlsx |

### 迁移时丢弃的库（原本加载但没有任何调用）

- boundary：`shpjs`；groundwater：`leaflet-path-drag`；spatial：`leaflet.browser.print`、
  `@tmcw/togeojson`（与 `@mapbox/togeojson` 重复，后者生效）。

## 升级流程

1. 从可信镜像取包（本机可用的镜像：`registry.npmmirror.com`、`cdn.bootcdn.net`；
   unpkg / jsdelivr / cdnjs 在本网络不可达）。
2. 解包后只放运行所需文件，落到 `vendor/<库>/<新版本>/`，不要就地覆盖旧版本。
3. 改 `weblibs.js` 的 `CATALOG` 指向新版本，同步更新本 README 的版本表。
4. 用任一工具页面验证：地图出影像、图标字体不是方框、控制台无 404。
5. 旧版本目录在所有工具都切换后再删。

## 平台侧要求

- `apps/portal/run_dev.py`（开发，5176）与 `apps/portal/run_server.py`（生产，5176 回环）
  分别挂载 `/shared/yykj-weblibs`。
- `/shared/*` 必须返回 `Access-Control-Allow-Origin: *`，否则 bootstrap-icons 的字体
  跨源加载会被浏览器拦截。
- 生产 nginx 只需把 `/shared/` 透传给 5176（与页眉同一路径）。

## 约定

- 同一时间只维护一个库版本；工具页面不锁版本，统一跟随本目录。
- 新增库先在这里登记，再到工具页面使用；禁止把库文件复制进各工具静态目录。
