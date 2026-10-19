(() => {
  "use strict";
  // 站点身份（名称、主题词、标题、描述）来自内容库的 site 表，由 content_publish 发布到 content/site-content.js。
  const site = window.YYKJ16_CONTENT.site;
  const strings = window.YYKJ16_CONTENT.strings || {};
  const brand = site.brand;
  const subject = site.subject;
  const local = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  // 站点与账号 API 同源（本地与生产一致）：不再有单独的 5175 后端端口。
  const portalBase = window.location.origin;
  window.YYKJ16_RUNTIME = Object.assign({
    environment: local ? "development" : "production",
    portalBase,
    brand,
    subject,
    supportName: `${brand}技术支持`,
    supportUrl: "#about?section=contact"
  }, window.YYKJ16_RUNTIME || {});

  const text = (key) => (strings[key] == null ? key : strings[key]);
  const hydrateContent = () => {
    document.title = site.page_title;
    document.querySelector('meta[name="description"]').setAttribute("content", site.description);
    document.querySelectorAll("[data-brand]").forEach((node) => {
      node.textContent = node.dataset.brand.replace(/\{brand\}/g, brand);
    });
    document.querySelectorAll("[data-brand-attr]").forEach((node) => {
      const value = node.dataset.brandAttr.replace(/\{brand\}/g, brand);
      node.setAttribute("aria-label", value);
      node.setAttribute("title", value);
    });
    document.querySelectorAll("[data-str]").forEach((node) => {
      node.textContent = text(node.dataset.str);
    });
    document.querySelectorAll("[data-str-attr]").forEach((node) => {
      node.dataset.strAttr.split(";").forEach((pair) => {
        const [name, key] = pair.split(":").map((entry) => entry.trim());
        if (name && key) node.setAttribute(name, text(key));
      });
    });
  };
  hydrateContent();
})();
