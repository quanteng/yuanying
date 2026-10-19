/* Standalone demo API for the FigHub interface prototype.
 *
 * This file is intentionally loaded only by the hand-off prototype. It keeps
 * the real FigHub markup, styles, routing and interactions, while replacing
 * network-backed endpoints with deterministic demo responses.
 */
(() => {
  "use strict";

  const MODE_KEY = "yykj-ui-prototype-mode";
  const data = window.PROTOTYPE_DATA;
  if (!data) {
    console.error("[prototype] fighub/prototype-data.js was not loaded");
    return;
  }

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const parseBody = (body) => {
    if (typeof body !== "string" || !body.trim()) return {};
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  };
  const readMode = () => {
    const requested = new URLSearchParams(window.location.search).get("mode");
    if (["guest", "authed", "admin"].includes(requested)) return requested;
    try {
      return localStorage.getItem(MODE_KEY) || "authed";
    } catch {
      return "authed";
    }
  };
  const writeMode = (mode) => {
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch {
      /* file:// storage can be unavailable in locked-down browsers */
    }
  };
  const currentHash = () => (window.location.hash || "#home").replace(/^#/, "");
  const isAuthRoute = () => /^(login|register|forgot)(\?|$)/.test(currentHash());
  const json = (payload, status = 200) => new Response(
    status === 204 ? null : JSON.stringify(payload),
    {
      status,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    }
  );
  const apiState = {
    mode: readMode(),
    forceSession: false,
    orderCount: 20,
    requestVotes: {}
  };

  const hasSession = () => {
    if (apiState.mode === "guest") return false;
    if (apiState.forceSession) return true;
    return !isAuthRoute();
  };

  const setMode = (mode) => {
    apiState.mode = mode;
    apiState.forceSession = false;
    writeMode(mode);
  };

  const mutateTool = (slug, patch) => {
    const tools = data.adminContent.tools || [];
    const index = tools.findIndex((tool) => tool.slug === slug);
    if (index >= 0) tools[index] = { ...tools[index], ...patch };
    return tools[index] || null;
  };

  const compactOrder = (payload) => {
    const count = ++apiState.orderCount;
    const plan = (data.products || []).flatMap((product) =>
      (product.plans || []).map((item) => ({ product, plan: item }))
    ).find((entry) => entry.plan.code === payload.plan_code) || (data.products || [])[0];
    const amount = plan ? Number(plan.plan.price_cents || 0) : 3900;
    return {
      biz_order_no: `YYKJ-DEMO-${Date.now()}-${count}`,
      amount_cents: amount,
      currency: "CNY",
      status: "pending",
      created_at: new Date().toISOString(),
      items: plan ? [{
        product_code: plan.product.code,
        plan_code: plan.plan.code,
        quantity: 1,
        unit_amount_cents: amount,
        feature_codes: [plan.plan.code],
        duration_days: plan.plan.duration_days,
        quota_total: plan.plan.quota_total,
        max_file_size_mb: plan.plan.max_file_size_mb,
        max_runtime_seconds: plan.plan.max_runtime_seconds,
        concurrency: plan.plan.concurrency,
        export_enabled: plan.plan.export_enabled,
        activation_required: plan.plan.activation_required
      }] : []
    };
  };

  const handleAdmin = (path, method, payload) => {
    if (path === "/api/admin/session") {
      if (method === "POST") {
        setMode("admin");
        return json({ ok: true, authenticated: true });
      }
      return apiState.mode === "admin"
        ? json({ ok: true, authenticated: true })
        : json({ detail: "admin login required" }, 401);
    }
    if (method === "POST" && path === "/api/admin/logout") {
      setMode("authed");
      return json({ ok: true });
    }
    if (apiState.mode !== "admin") return json({ detail: "admin login required" }, 401);

    if (path === "/api/admin/content") return json(clone(data.adminContent));
    if (path === "/api/admin/changes") return json(clone(data.admin.changes));
    if (path === "/api/admin/stats/overview") return json(clone(data.admin.stats));
    if (path === "/api/admin/sites") return json(clone(data.admin.sites));
    if (path === "/api/admin/users") return json(clone(data.admin.users));
    if (path === "/api/admin/orders") return json(clone(data.admin.orders));
    if (path === "/api/admin/invoices") return json(clone(data.admin.invoices));
    if (path === "/api/admin/refunds") return json(clone(data.admin.refunds));
    if (path === "/api/admin/coupons/stats") return json(clone(data.admin.couponStats));
    if (path === "/api/admin/coupons") return json(clone(data.admin.coupons));
    if (path === "/api/admin/coupon-batches") return json(clone(data.admin.batches));
    if (path === "/api/admin/tool-policies") return json(clone(data.admin.policies));
    if (path === "/api/admin/feedback/stats") return json(clone(data.admin.feedbackStats));
    if (path === "/api/admin/feedback") return json(clone(data.admin.feedback));

    const toolMatch = path.match(/^\/api\/admin\/tools\/([^/]+)$/);
    if (toolMatch) {
      const slug = decodeURIComponent(toolMatch[1]);
      if (method === "DELETE") {
        data.adminContent.tools = (data.adminContent.tools || []).filter((tool) => tool.slug !== slug);
        return json({ ok: true });
      }
      if (method === "PATCH") {
        mutateTool(slug, payload);
        return json({ ok: true });
      }
    }
    if (method === "POST" && path === "/api/admin/tools") {
      data.adminContent.tools.push({
        slug: payload.slug || `demo-tool-${Date.now()}`,
        toolCode: payload.tool_code || payload.slug || "",
        route: payload.route || "",
        name: payload.name || "新工具",
        subtitle: payload.subtitle || "",
        tags: payload.tags || "",
        form: payload.form || "tool",
        billing: payload.billing || "free",
        available: String(payload.available) === "true",
        featured: String(payload.featured) !== "false",
        sort: Number(payload.sort || 0),
        image: payload.image || "",
        video: payload.video || "",
        gallery: payload.gallery || "",
        input: payload.input_summary || "",
        result: payload.output_summary || "",
        requirements: String(payload.capabilities || "").split(/[；\n]/).filter(Boolean),
        sampleFiles: []
      });
      return json({ ok: true }, 201);
    }
    if (path === "/api/admin/tools/reorder" && method === "POST") return json({ ok: true });

    const tagMatch = path.match(/^\/api\/admin\/tags\/([^/]+)$/);
    if (tagMatch) {
      const key = decodeURIComponent(tagMatch[1]);
      if (method === "DELETE") {
        data.adminContent.tags = (data.adminContent.tags || []).filter((tag) => tag.key !== key);
      } else if (method === "PATCH") {
        const tag = (data.adminContent.tags || []).find((item) => item.key === key);
        if (tag) Object.assign(tag, payload);
      }
      return json({ ok: true });
    }
    if (method === "POST" && path === "/api/admin/tags") {
      data.adminContent.tags.push({
        key: payload.key || `tag-${Date.now()}`,
        icon: payload.icon || "layers",
        name: payload.name || "新标签",
        description: payload.description || ""
      });
      return json({ ok: true }, 201);
    }

    const datasetMatch = path.match(/^\/api\/admin\/datasets\/([^/]+)$/);
    if (datasetMatch) {
      const id = decodeURIComponent(datasetMatch[1]);
      if (method === "DELETE") {
        data.adminContent.datasets = (data.adminContent.datasets || []).filter((item) => item.id !== id);
      }
      return json({ ok: true });
    }
    if (method === "POST" && path === "/api/admin/datasets") return json({ ok: true }, 201);

    const contentMatch = path.match(/^\/api\/admin\/content\/([^/]+)(?:\/(.*))?$/);
    if (contentMatch) {
      const family = contentMatch[1];
      const rowId = contentMatch[2] ? decodeURIComponent(contentMatch[2]) : "";
      const store = data.adminContent[family];
      if (Array.isArray(store)) {
        if (method === "DELETE") {
          data.adminContent[family] = store.filter((row) => {
            const values = [row.id, row.key, row.code, row.group].filter(Boolean).map(String);
            return !values.includes(rowId) && !values.join(".").includes(rowId);
          });
        } else if (method === "POST") {
          store.push(payload);
        } else if (method === "PATCH") {
          const row = store.find((item) => {
            const values = [item.id, item.key, item.code, item.group].filter(Boolean).map(String);
            return values.includes(rowId) || values.join(".") === rowId;
          });
          if (row) Object.assign(row, payload);
        }
      }
      return json({ ok: true }, method === "POST" ? 201 : 200);
    }

    if (path === "/api/admin/policy" && method === "POST") return json({ ok: true });
    if (path === "/api/admin/feedback" && method === "POST") return json({ ok: true });
    if (path.startsWith("/api/admin/orders/") && method === "POST") {
      return json({ status: "paid", biz_order_no: path.split("/")[4] });
    }
    return json({ ok: true });
  };

  const handleAccount = (path, method, payload) => {
    if (!hasSession()) return json({ detail: "not signed in" }, 401);
    if (path === "/api/me/profile") {
      if (method === "PATCH") {
        data.profile.display_name = payload.display_name || data.profile.display_name;
        data.session.user.name = data.profile.display_name;
        data.session.user.preferred_username = data.profile.display_name;
      }
      return json({ profile: clone(data.profile) });
    }
    if (path === "/api/orders") return json(clone(data.account.orders));
    if (path === "/api/me/entitlements") return json(clone(data.account.entitlements));
    if (path === "/api/invoices") return json(clone(data.account.invoices));
    if (path === "/api/me/membership") return json(clone(data.membership));
    if (path === "/api/me/coupons") {
      if (path.endsWith("/redeem") && method === "POST") return json({ ok: true });
      return json(clone(data.account.coupons));
    }
    if (path === "/api/me/refunds") return json(clone(data.account.refunds));
    if (path === "/api/me/sites") return json(clone(data.account.sites));
    if (path === "/api/share/summary") return json(clone(data.account.share));
    if (path === "/api/share/cards") {
      return json({
        credits: Number(data.account.share.credits || 0) + 1,
        credit_limit_cents: data.account.share.credit_limit_cents
      });
    }
    if (path === "/api/me/password" || path === "/api/me/password/setup/start" || path === "/api/me/password/setup/confirm") {
      return json({ ok: true });
    }
    if (path === "/api/me/email/start") return json({ sent: true, cooldown_seconds: 60 });
    if (path === "/api/me/email/confirm") {
      data.profile.needs_email = false;
      data.session.user.email_verified = true;
      return json({ ok: true, email_verified: true });
    }
    if (path === "/api/me/wechat/unbind") {
      data.profile.wechat_bound = false;
      return json({ ok: true });
    }
    if (path === "/api/me/deactivate") {
      setMode("guest");
      return json({ ok: true });
    }
    if (path.startsWith("/api/me/wechat/bind/qr")) {
      return json({ ticket: "demo-bind", url: `${location.href.split("#")[0]}#wechat-bind` });
    }
    return json({ ok: true });
  };

  const mockFetch = async (input, init = {}) => {
    const raw = typeof input === "string" ? input : String(input && input.url || "");
    const method = String(init.method || (input && input.method) || "GET").toUpperCase();
    if (!raw.startsWith("/api/") && !raw.startsWith("/auth/")) {
      return originalFetch(input, init);
    }

    await new Promise((resolve) => setTimeout(resolve, raw.includes("/admin/content") ? 90 : 28));
    const [pathname, search = ""] = raw.split("?");
    const path = pathname.replace(/\/+$/, "") || pathname;
    const payload = parseBody(init.body);

    if (path === "/auth/logout") {
      setMode("guest");
      return json({ ok: true });
    }
    if (path === "/api/csrf") return json({ csrf_token: "prototype-demo-token" });
    if (path === "/api/track") return json(null, 204);
    if (path === "/api/config") return json(clone(data.config));
    if (path === "/api/products") return json(clone(data.products));
    if (path === "/api/tools") return json(clone(data.tools));
    if (path === "/api/auth/session") {
      return hasSession()
        ? json({ user: clone(data.session.user) })
        : json({ detail: "not signed in" }, 401);
    }
    if (path === "/api/auth/login" || path === "/api/auth/register") {
      setMode("authed");
      apiState.forceSession = true;
      return json({ user: clone(data.session.user), email_verification_sent: true }, path.endsWith("register") ? 201 : 200);
    }
    if (path === "/api/auth/forgot-password" || path === "/api/auth/reset-password" || path === "/api/auth/resend-verification" || path === "/api/auth/verify-email") {
      if (path === "/api/auth/verify-email") {
        data.profile.needs_email = false;
        data.session.user.email_verified = true;
      }
      return json({ ok: true, sent: true });
    }
    if (path === "/api/auth/wechat/qr" || path === "/api/auth/wechat/qr/start" || path === "/api/wechat/register/qr") {
      return json({
        ticket: "demo-qr-ticket",
        session: "demo-register-session",
        url: `${location.href.split("#")[0]}#wechat-demo`,
        image_url: "./images/qrcode/service-qr.jpg",
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
      });
    }
    if (path.includes("/consume") || path.endsWith("/poll")) {
      return json({ status: "pending" });
    }
    if (path.startsWith("/api/admin/")) return handleAdmin(path, method, payload);
    if (path.startsWith("/api/access/")) {
      const toolCode = decodeURIComponent(path.split("/")[3] || "");
      const blocked = ["boundary", "planboring", "vertiplot"].includes(toolCode);
      return blocked ? json({ allowed: false, reason: "purchase_required" }, 200) : json({ allowed: true });
    }
    const activityMatch = path.match(/^\/api\/tools\/([^/]+)\/activity$/);
    if (activityMatch) {
      const code = decodeURIComponent(activityMatch[1]);
      return json(clone(data.activity[code] || { total_runs: 12, covered_runs: 8, recent: [] }));
    }
    const feedbackMatch = path.match(/^\/api\/tools\/([^/]+)\/feedback$/);
    if (feedbackMatch) {
      const code = decodeURIComponent(feedbackMatch[1]);
      if (method === "POST") {
        return json({ ok: true, feedback_id: `FB-DEMO-${Date.now()}` }, 201);
      }
      return json(clone(data.feedback[code] || { feedback: [], eligibility: { login_required: false, eligible: true, runs: 1 } }));
    }
    if (path === "/api/orders" && method === "POST") return json(compactOrder(payload), 201);
    if (path === "/api/orders/credit" && method === "POST") return json({ ...compactOrder(payload), status: "paid" }, 201);
    if (path === "/api/orders/coupon" && method === "POST") return json({ ok: true, status: "paid" });
    if (path === "/api/membership/redeem" && method === "POST") return json({ ok: true, status: "paid" });
    if (path.startsWith("/api/dev/orders/") && path.endsWith("/pay")) return json({ status: "paid" });
    if (path.startsWith("/api/orders/") && path.endsWith("/reconcile")) return json({ status: "paid" });
    if (path.startsWith("/api/orders/") && path.endsWith("/pay")) {
      return json({ checkout_url: "", pay_body_type: "pending" });
    }
    if (path.startsWith("/api/orders/")) {
      return json({ ...compactOrder({}), status: "pending", biz_order_no: path.split("/")[3] });
    }
    if (path.startsWith("/api/requests/") && path.endsWith("/vote")) {
      const requestId = path.split("/")[3];
      apiState.requestVotes[requestId] = (apiState.requestVotes[requestId] || 0) + 1;
      return json({ ok: true, votes: apiState.requestVotes[requestId] });
    }
    if (path === "/api/requests" && method === "POST") return json({ ok: true, id: `request-${Date.now()}` }, 201);
    if (path === "/api/me") {
      return hasSession()
        ? json({ user: clone(data.session.user), profile: clone(data.profile) })
        : json({ detail: "not signed in" }, 401);
    }
    return handleAccount(path, method, payload);
  };

  const originalFetch = window.fetch.bind(window);
  window.fetch = mockFetch;
  window.YYKJ16_RUNTIME.portalBase = "";
  window.PROTOTYPE_API = {
    getMode: () => apiState.mode,
    setMode(mode) {
      setMode(mode === "admin" ? "admin" : mode === "guest" ? "guest" : "authed");
      window.location.reload();
    },
    loginDemo() {
      setMode("authed");
      apiState.forceSession = true;
      window.location.reload();
    },
    data
  };

  document.addEventListener("click", (event) => {
    const logout = event.target.closest('a[href*="/auth/logout"]');
    if (!logout) return;
    event.preventDefault();
    setMode("guest");
    window.location.hash = "#home";
    window.location.reload();
  }, true);
})();
