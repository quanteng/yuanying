(() => {
  "use strict";

  const dock = document.createElement("div");
  dock.className = "proto-boundary-dock";
  dock.innerHTML = `
    <span class="proto-boundary-dock__label">UI PROTOTYPE</span>
    <button type="button" class="is-primary" data-proto-sample>载入样例</button>
    <button type="button" data-proto-process>模拟出成果</button>
    <button type="button" data-proto-pay>权益引导</button>
    <a href="../fighub/index.html#tool/boundary">返回 FigHub</a>
    <a href="../index.html">交付总览</a>
  `;
  document.body.append(dock);

  dock.addEventListener("click", (event) => {
    if (event.target.closest("[data-proto-sample]")) {
      window.PROTOTYPE_BOUNDARY?.loadSample();
      return;
    }
    if (event.target.closest("[data-proto-process]")) {
      window.PROTOTYPE_BOUNDARY?.process();
      return;
    }
    if (event.target.closest("[data-proto-pay]")) {
      window.PROTOTYPE_BOUNDARY?.openPurchase();
    }
  });
})();
