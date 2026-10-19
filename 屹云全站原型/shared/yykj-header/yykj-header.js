(() => {
    // ===== 统一域名解析（表与 platform_portal/config/domains.json 保持同步；窗口显式 window.YYKJ_ENV 优先）=====
    const YYKJ_ENV_DOMAINS = {
        dev: { official: "https://www.bjyiyunkeji.online", fighub: "http://127.0.0.1:5176" },
        prod: { official: "https://www.bjyiyunkeji.online", fighub: "https://fighub.bjyiyunkeji.online" }
    };
    const detectEnvName = () => {
        const forced = window.YYKJ_ENV;
        if (forced === "dev" || forced === "prod") {
            return forced;
        }
        const host = (window.location.hostname || "").toLowerCase();
        if (host === "localhost" || host === "127.0.0.1" || host === "::1") {
            return "dev";
        }
        return "prod";
    };
    const envName = detectEnvName();
    const domains = Object.assign({ env: envName }, YYKJ_ENV_DOMAINS[envName]);
    window.YYKJ_DOMAINS = domains;

    const initHeader = () => {
        if (document.querySelector(".yykj-header")) {
            return;
        }

        const config = window.YYKJ_COMMON_HEADER || {};
        const brand = config.brand || "屹云科技";
        const logoText = config.logoText || "屹";
        const homeUrl = config.homeUrl || domains.fighub + "/";
        const homeTarget = config.homeTarget || "_blank";
        const qrCodeUrl = config.qrcodeUrl || domains.official + "/images/qrcode.jpg";
        const toolName = config.toolName || document.title || "";
        const layout = config.layout || "default";
        const showBrandText = config.showBrandText === true;
        const showToolName = toolName && toolName.length > 0;
        const brandTextMarkup = showBrandText ? `<span class="yykj-brand-text">${brand}</span>` : "";
        const toolNameMarkup = showToolName ? `<div class="yykj-tool-name">${toolName}</div>` : "";

        const header = document.createElement("div");
        header.className = "yykj-header";
        header.innerHTML = `
            <div class="yykj-header-inner">
                <div class="yykj-left">
                    <a class="yykj-brand" href="${homeUrl}" target="${homeTarget}" rel="noopener">
                        <span class="yykj-logo">${logoText}</span>
                        ${brandTextMarkup}
                    </a>
                    ${toolNameMarkup}
                </div>
                <div class="yykj-actions">
                    <a class="yykj-link" href="${homeUrl}" target="${homeTarget}" rel="noopener">\u9996\u9875</a>
                    <button class="yykj-qr-btn" type="button" data-yykj-toggle>\u5173\u6ce8\u516c\u4f17\u53f7</button>
                    <div class="yykj-popover" data-yykj-popover>
                        <div class="yykj-popover-header">
                            <div class="yykj-popover-title">\u83b7\u53d6\u66f4\u65b0\u63d0\u9192</div>
                            <button class="yykj-popover-close" type="button" data-yykj-close>\u00d7</button>
                        </div>
                        <div class="yykj-popover-desc">\u5173\u6ce8\u516c\u4f17\u53f7\uff0c\u63a5\u6536\u65b0\u529f\u80fd\u4e0e\u7ef4\u62a4\u901a\u77e5\uff0c\u53ef\u7559\u8a00\u53cd\u9988\u3002</div>
                        <img class="yykj-qr-img" src="${qrCodeUrl}" alt="\u516c\u4f17\u53f7\u4e8c\u7ef4\u7801">
                        <div class="yykj-popover-tip">\u626b\u7801\u540e\u53ef\u76f4\u63a5\u56de\u590d\u201c\u53cd\u9988/\u66f4\u65b0\u201d</div>
                    </div>
                </div>
            </div>
        `;

        document.body.prepend(header);
        document.body.classList.add("yykj-has-header");
        if (layout === "fullmap") {
            document.body.classList.add("yykj-layout-fullmap");
        }

        const toggleBtn = header.querySelector("[data-yykj-toggle]");
        const popover = header.querySelector("[data-yykj-popover]");
        const closeBtn = header.querySelector("[data-yykj-close]");

        const closePopover = () => popover.classList.remove("open");
        const togglePopover = (event) => {
            event.stopPropagation();
            popover.classList.toggle("open");
        };

        toggleBtn?.addEventListener("click", togglePopover);
        closeBtn?.addEventListener("click", (event) => {
            event.stopPropagation();
            closePopover();
        });

        document.addEventListener("click", (event) => {
            if (!popover.contains(event.target) && !toggleBtn.contains(event.target)) {
                closePopover();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closePopover();
            }
        });

        window.YYKJ_HEADER = { element: header, domains: domains };
        document.dispatchEvent(new CustomEvent("yykj-header-ready", { detail: { header: header, domains: domains } }));
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initHeader);
    } else {
        initHeader();
    }
})();
