/* Demo backend for the standalone boundary workbench prototype. */
(() => {
  "use strict";

  const previewGeoJson = {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      properties: { name: "样例地块（示例数据）" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [111.45574, 36.08637],
          [111.46034, 36.08343],
          [111.46877, 36.08434],
          [111.47216, 36.08916],
          [111.46872, 36.09318],
          [111.46031, 36.09411],
          [111.45486, 36.09045],
          [111.45574, 36.08637]
        ]]
      }
    }]
  };
  const bounds = [111.45486, 36.08343, 111.47216, 36.09411];
  const responseJson = (payload, status = 200) => new Response(
    JSON.stringify(payload),
    { status, headers: { "Content-Type": "application/json; charset=utf-8" } }
  );
  const sampleWorkbook = () => new Blob(
    ["Standalone prototype sample workbook. The UI preview uses deterministic geometry."],
    { type: "application/vnd.ms-excel" }
  );
  const demoPackage = () => new Blob(
    [
      "FigHub boundary prototype demo package\n",
      "Contains: boundary.shp / boundary.shx / boundary.dbf / preview.jpg / fields.csv\n",
      "This placeholder validates the download interaction in the hand-off prototype.\n"
    ],
    { type: "application/zip" }
  );

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const raw = typeof input === "string" ? input : String(input && input.url || "");
    const method = String(init.method || (input && input.method) || "GET").toUpperCase();
    const apiIndex = raw.indexOf("/api/");
    const sampleIndex = raw.indexOf("/samples/");
    const normalized = apiIndex >= 0 ? raw.slice(apiIndex) : sampleIndex >= 0 ? raw.slice(sampleIndex) : raw;
    if (normalized.startsWith("/samples/")) {
      return new Response(sampleWorkbook(), {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.ms-excel",
          "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent("样例数据.xls")}`
        }
      });
    }
    if (!normalized.startsWith("/api/")) return originalFetch(input, init);

    await new Promise((resolve) => setTimeout(resolve, 120));
    const path = normalized.split("?")[0].replace(/\/+$/, "");
    if (path === "/api/detect_meridian") {
      return responseJson({ success: true, meridian: 111.46 });
    }
    if (path === "/api/preview_boundary") {
      return responseJson({
        success: true,
        preview_geojson: JSON.stringify(previewGeoJson),
        bounds,
        meridian: 111
      });
    }
    if (path === "/api/get_centroid") {
      return responseJson({
        success: true,
        lon: 111.464037,
        lat: 36.087586,
        ydmj: 110559.3,
        xzqdm: "141029",
        xzqmc: "山西省临汾市乡宁县"
      });
    }
    if (path === "/api/process_boundary") {
      return new Response(demoPackage(), {
        status: 200,
        headers: {
          "Content-Type": "application/zip",
          "X-Output-Warning": encodeURIComponent("原型演示：下载包为占位文件，展示下载与完成状态用")
        }
      });
    }
    if (path === "/api/get_boundary_image") {
      return responseJson({
        success: true,
        filename: "边界预览.jpg",
        image_data: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
          "<svg xmlns='http://www.w3.org/2000/svg' width='960' height='640'><rect width='960' height='640' fill='#dce7dc'/><path d='M180 150h610v340H180z' fill='#ff6a5e' fill-opacity='.12' stroke='#ff6a5e' stroke-width='5'/><text x='480' y='610' text-anchor='middle' font-family='Microsoft YaHei' font-size='24' fill='#34454b'>边界成果预览（原型）</text></svg>"
        )
      });
    }
    if (path === "/api/me/sites/match") return responseJson({ matched: false, site: null });
    if (path === "/api/usage") return responseJson({ remaining: 3, total: 3 });
    return responseJson({ success: true });
  };

  window.PROTOTYPE_BOUNDARY = {
    previewGeoJson,
    bounds,
    loadSample: () => window.loadSampleData?.(),
    process: () => window.processData?.(),
    openPurchase: () => window.showUpgradeModal?.(
      "原型演示：当前账号还没有这个场地的使用权益。",
      "../fighub/index.html#pricing"
    )
  };
})();
