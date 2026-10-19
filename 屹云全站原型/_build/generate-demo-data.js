/**
 * Build the self-contained demo dataset used by the standalone prototype.
 *
 * The FigHub content is read from the current published content bundle. Admin
 * records are synthetic and intentionally contain no production user data.
 */
const fs = require("fs");
const os = require("os");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const repo = path.resolve(root, "..", "..");
const contentPath = path.join(repo, "apps", "fighub", "content", "site-content.js");
const capturePath = path.join(os.tmpdir(), "yykj-admin-capture.json");

const contentContext = { window: {} };
vm.createContext(contentContext);
vm.runInContext(fs.readFileSync(contentPath, "utf8"), contentContext);
const content = contentContext.window.YYKJ16_CONTENT;

const captured = JSON.parse(fs.readFileSync(capturePath, "utf8"));
const adminContent = captured["/api/admin/content"];

const productByTool = Object.fromEntries(
  (adminContent.products || []).map((product) => [product.tool_code, product])
);

const syntheticUsers = [
  ["demo-1001@example.com", "林工", "active", true, "2026-08-16T09:12:00+08:00", "2026-10-18T16:42:00+08:00"],
  ["demo-1002@example.com", "周工", "active", true, "2026-08-20T14:20:00+08:00", "2026-10-18T11:08:00+08:00"],
  ["demo-1003@example.com", "陈工", "active", true, "2026-09-01T10:05:00+08:00", "2026-10-17T20:31:00+08:00"],
  ["demo-1004@example.com", "王工", "active", false, "2026-09-08T08:47:00+08:00", null],
  ["demo-1005@example.com", "赵工", "disabled", true, "2026-09-12T13:36:00+08:00", "2026-10-12T09:14:00+08:00"],
  ["demo-1006@example.com", "孙工", "active", true, "2026-09-18T17:03:00+08:00", "2026-10-18T08:56:00+08:00"],
  ["demo-1007@example.com", "刘工", "active", true, "2026-09-23T11:11:00+08:00", "2026-10-16T15:22:00+08:00"],
  ["demo-1008@example.com", "何工", "active", true, "2026-10-02T09:31:00+08:00", "2026-10-18T19:05:00+08:00"]
].map(([email, name, status, verified, created, login], index) => ({
  id: 1001 + index,
  email,
  display_name: name,
  status,
  email_verified: verified,
  created_at: created,
  last_login: login
}));

const orderItems = (productCode, planCode, featureCode, price) => [{
  product_code: productCode,
  plan_code: planCode,
  quantity: 1,
  unit_amount_cents: price,
  feature_codes: [featureCode],
  duration_days: null,
  quota_total: 1,
  max_file_size_mb: 100,
  max_runtime_seconds: 300,
  concurrency: 1,
  export_enabled: true,
  activation_required: true
}];

const adminOrders = [
  {
    biz_order_no: "YYKJ-DEMO-20261018-001",
    user_id: "local-1001",
    amount_cents: 3900,
    currency: "CNY",
    status: "paid",
    provider_order_no: "DEV-YYKJ-DEMO-001",
    created_at: "2026-10-18T09:22:14+08:00",
    paid_at: "2026-10-18T09:23:02+08:00",
    credit_cents: 0,
    credit_source: "",
    items: orderItems("boundary_basic", "boundary_site", "boundary_basic", 3900)
  },
  {
    biz_order_no: "YYKJ-DEMO-20261018-002",
    user_id: "local-1002",
    amount_cents: 29900,
    currency: "CNY",
    status: "paid",
    provider_order_no: "DEV-YYKJ-DEMO-002",
    created_at: "2026-10-18T10:10:11+08:00",
    paid_at: "2026-10-18T10:11:40+08:00",
    credit_cents: 0,
    credit_source: "",
    items: orderItems("pro_membership", "pro_annual", "pro_membership", 29900)
  },
  {
    biz_order_no: "YYKJ-DEMO-20261018-003",
    user_id: "local-1003",
    amount_cents: 6900,
    currency: "CNY",
    status: "pending",
    provider_order_no: "",
    created_at: "2026-10-18T14:35:09+08:00",
    paid_at: null,
    credit_cents: 0,
    credit_source: "",
    items: orderItems("vertiplot_basic", "vertiplot_site", "vertiplot_basic", 6900)
  },
  {
    biz_order_no: "YYKJ-DEMO-20261017-004",
    user_id: "local-1006",
    amount_cents: 9900,
    currency: "CNY",
    status: "paid",
    provider_order_no: "DEV-YYKJ-DEMO-004",
    created_at: "2026-10-17T16:20:31+08:00",
    paid_at: "2026-10-17T16:21:08+08:00",
    credit_cents: 0,
    credit_source: "",
    items: orderItems("planboring_basic", "planboring_site", "planboring_basic", 9900)
  },
  {
    biz_order_no: "YYKJ-DEMO-20261017-005",
    user_id: "local-1007",
    amount_cents: 3900,
    currency: "CNY",
    status: "refunded",
    provider_order_no: "DEV-YYKJ-DEMO-005",
    created_at: "2026-10-17T09:12:46+08:00",
    paid_at: "2026-10-17T09:13:02+08:00",
    credit_cents: 0,
    credit_source: "",
    items: orderItems("boundary_basic", "boundary_site", "boundary_basic", 3900)
  },
  {
    biz_order_no: "YYKJ-DEMO-20261016-006",
    user_id: "local-1008",
    amount_cents: 6900,
    currency: "CNY",
    status: "paid",
    provider_order_no: "DEV-YYKJ-DEMO-006",
    created_at: "2026-10-16T19:40:12+08:00",
    paid_at: "2026-10-16T19:41:10+08:00",
    credit_cents: 0,
    credit_source: "",
    items: orderItems("vertiplot_basic", "vertiplot_site", "vertiplot_basic", 6900)
  }
];

const adminInvoices = [
  {
    invoice_id: "INV-DEMO-001",
    biz_order_no: "YYKJ-DEMO-20261018-002",
    user_id: "local-1002",
    amount_cents: 29900,
    status: "issued",
    profile: { title: "北京示例环境科技有限公司", tax_no: "91110108MA01DEMO2X" },
    invoice_no: "26611000000012345678",
    download_url: "https://example.com/demo-invoice-001.pdf",
    email: "finance@example.com",
    created_at: "2026-10-18T11:20:00+08:00"
  },
  {
    invoice_id: "INV-DEMO-002",
    biz_order_no: "YYKJ-DEMO-20261017-004",
    user_id: "local-1006",
    amount_cents: 9900,
    status: "reviewing",
    profile: { title: "华东示例检测有限公司", tax_no: "91310000MA1DEMO8Q" },
    invoice_no: "",
    download_url: "",
    email: "invoice@example.com",
    created_at: "2026-10-17T18:02:00+08:00"
  },
  {
    invoice_id: "INV-DEMO-003",
    biz_order_no: "YYKJ-DEMO-20261016-006",
    user_id: "local-1008",
    amount_cents: 6900,
    status: "rejected",
    profile: { title: "个人", tax_no: "" },
    invoice_no: "",
    download_url: "",
    email: "demo-1008@example.com",
    created_at: "2026-10-16T21:11:00+08:00"
  }
];

const adminRefunds = [
  {
    refund_id: "RF-DEMO-001",
    user_id: "local-1007",
    biz_order_no: "YYKJ-DEMO-20261017-005",
    amount_cents: 3900,
    reason: "重复购买，原订单已通过额度覆盖。",
    status: "requested",
    note: "",
    created_at: "2026-10-18T08:42:00+08:00",
    updated_at: "2026-10-18T08:42:00+08:00"
  },
  {
    refund_id: "RF-DEMO-002",
    user_id: "local-1003",
    biz_order_no: "YYKJ-DEMO-20261018-003",
    amount_cents: 6900,
    reason: "项目场地临时调整，申请取消。",
    status: "approved",
    note: "已核对，未生成成果。",
    created_at: "2026-10-18T15:04:00+08:00",
    updated_at: "2026-10-18T15:20:00+08:00"
  }
];

const adminCoupons = [
  {
    coupon_id: "CP-DEMO-001",
    batch_code: "welcome_2026q4",
    code: "YK-DEMO-8A31C2",
    user_id: "local-1001",
    tool_code: "all",
    status: "unused",
    source: "welcome",
    source_ref: "demo-1001@example.com",
    claimed_at: "2026-10-17T10:20:00+08:00",
    expires_at: "2026-11-16T23:59:59+08:00",
    used_at: "",
    order_no: "",
    quota: 1,
    channel: "公众号"
  },
  {
    coupon_id: "CP-DEMO-002",
    batch_code: "share_reward",
    code: "YK-DEMO-61F4A9",
    user_id: "local-1002",
    tool_code: "boundary",
    status: "used",
    source: "share",
    source_ref: "share-card-02",
    claimed_at: "2026-10-16T11:02:00+08:00",
    expires_at: "2026-11-15T23:59:59+08:00",
    used_at: "2026-10-18T09:22:00+08:00",
    order_no: "YYKJ-DEMO-20261018-001",
    quota: 1,
    channel: "分享卡"
  },
  {
    coupon_id: "CP-DEMO-003",
    batch_code: "welcome_2026q4",
    code: "YK-DEMO-2C76E5",
    user_id: "local-1006",
    tool_code: "vertiplot",
    status: "expired",
    source: "welcome",
    source_ref: "demo-1006@example.com",
    claimed_at: "2026-09-15T09:00:00+08:00",
    expires_at: "2026-10-15T23:59:59+08:00",
    used_at: "",
    order_no: "",
    quota: 1,
    channel: "公众号"
  },
  {
    coupon_id: "CP-DEMO-004",
    batch_code: "service_recovery",
    code: "YK-DEMO-1B9D03",
    user_id: "local-1008",
    tool_code: "all",
    status: "unused",
    source: "compensation",
    source_ref: "ticket-2031",
    claimed_at: "2026-10-18T13:15:00+08:00",
    expires_at: "2026-11-17T23:59:59+08:00",
    used_at: "",
    order_no: "",
    quota: 2,
    channel: "人工发放"
  }
];

const adminBatches = [
  {
    batch_code: "welcome_2026q4",
    name: "新用户欢迎券",
    kind: "trial_times",
    tool_scope: "per_tool",
    valid_days: 30,
    per_user_limit: 1,
    quota: 1,
    channel: "公众号",
    status: "active",
    created_at: "2026-10-01T09:00:00+08:00"
  },
  {
    batch_code: "share_reward",
    name: "分享奖励使用券",
    kind: "trial_times",
    tool_scope: "per_tool",
    valid_days: 30,
    per_user_limit: 0,
    quota: 1,
    channel: "分享卡",
    status: "active",
    created_at: "2026-10-08T10:30:00+08:00"
  },
  {
    batch_code: "service_recovery",
    name: "服务补偿使用券",
    kind: "trial_times",
    tool_scope: "all",
    valid_days: 30,
    per_user_limit: 0,
    quota: 2,
    channel: "人工发放",
    status: "active",
    created_at: "2026-10-12T14:00:00+08:00"
  }
];

const adminFeedback = [
  {
    feedback_id: "FB-DEMO-001",
    tool_code: "boundary",
    user_id: "local-1001",
    run_id: "RUN-DEMO-001",
    order_no: "YYKJ-DEMO-20261018-001",
    rating: "satisfied",
    detail: "成果包字段说明清楚，图件可以直接放进报告。",
    status: "resolved",
    admin_reply: "感谢反馈，后续会继续完善图例与比例尺选项。",
    created_at: "2026-10-18T10:04:00+08:00",
    updated_at: "2026-10-18T10:40:00+08:00"
  },
  {
    feedback_id: "FB-DEMO-002",
    tool_code: "xy",
    user_id: "local-1003",
    run_id: "RUN-DEMO-004",
    order_no: "",
    rating: "neutral",
    detail: "希望右侧结果表可以固定表头，并支持一键复制异常点。",
    status: "reviewing",
    admin_reply: "",
    created_at: "2026-10-18T12:40:00+08:00",
    updated_at: "2026-10-18T12:40:00+08:00"
  },
  {
    feedback_id: "FB-DEMO-003",
    tool_code: "boundary",
    user_id: "local-1006",
    run_id: "RUN-DEMO-008",
    order_no: "YYKJ-DEMO-20261017-004",
    rating: "problem",
    detail: "样例数据载入后，地图缩放没有回到图斑范围。",
    status: "new",
    admin_reply: "",
    created_at: "2026-10-18T16:15:00+08:00",
    updated_at: "2026-10-18T16:15:00+08:00"
  },
  {
    feedback_id: "FB-DEMO-004",
    tool_code: "vertiplot",
    user_id: "local-1008",
    run_id: "RUN-DEMO-012",
    order_no: "YYKJ-DEMO-20261016-006",
    rating: "satisfied",
    detail: "垂向图的配色和导出尺寸符合项目要求。",
    status: "closed",
    admin_reply: "已记录，感谢使用。",
    created_at: "2026-10-17T09:50:00+08:00",
    updated_at: "2026-10-17T10:10:00+08:00"
  }
];

const adminStats = {
  range_days: 7,
  visits: { views: 1688, visitors: 236 },
  top_pages: [
    { path: "#tool/boundary", views: 326 },
    { path: "#home", views: 214 },
    { path: "#tools", views: 173 },
    { path: "#pricing", views: 136 },
    { path: "#tool/xy", views: 121 }
  ],
  top_tools: [
    { tool: "boundary", opens: 98 },
    { tool: "xy", opens: 54 },
    { tool: "vertiplot", opens: 31 }
  ],
  users: { registrations: 242, logins: 119 },
  orders: { created: 132, paid: 116, gmv_cents: 842400 },
  invoices: { submitted: 3 },
  by_day: [
    { date: "2026-10-13", views: 122, visitors: 18, registrations: 11, orders_created: 6, orders_paid: 5, gmv_cents: 43200 },
    { date: "2026-10-14", views: 182, visitors: 27, registrations: 16, orders_created: 9, orders_paid: 8, gmv_cents: 57600 },
    { date: "2026-10-15", views: 238, visitors: 36, registrations: 22, orders_created: 12, orders_paid: 10, gmv_cents: 73200 },
    { date: "2026-10-16", views: 264, visitors: 41, registrations: 19, orders_created: 14, orders_paid: 12, gmv_cents: 86400 },
    { date: "2026-10-17", views: 302, visitors: 45, registrations: 24, orders_created: 16, orders_paid: 14, gmv_cents: 102600 },
    { date: "2026-10-18", views: 336, visitors: 52, registrations: 28, orders_created: 19, orders_paid: 17, gmv_cents: 126000 },
    { date: "2026-10-19", views: 244, visitors: 38, registrations: 21, orders_created: 15, orders_paid: 13, gmv_cents: 93600 }
  ]
};

const adminSites = {
  sites: [
    ["SITE-DEMO-001", "某工业园区 A 地块", "local-1001", 3, [116.301, 36.22, 116.3155, 36.2315]],
    ["SITE-DEMO-002", "某化工地块 B 区", "local-1002", 2, [118.742, 32.048, 118.758, 32.061]],
    ["SITE-DEMO-003", "某填埋场调查区", "local-1006", 1, [113.21, 23.08, 113.225, 23.094]]
  ].map(([site_id, label, user_id, runs, bounds], index) => ({
    site_id,
    label,
    user_id,
    tool_code: "boundary",
    centroid_lat: (bounds[1] + bounds[3]) / 2,
    centroid_lon: (bounds[0] + bounds[2]) / 2,
    area_m2: 110559.3 + index * 20480,
    point_count: 7 + index,
    bounds,
    crs: "EPSG:4326",
    runs,
    first_seen_at: `2026-10-${15 + index}T09:20:00+08:00`,
    last_run_at: `2026-10-${18 - index}T14:30:00+08:00`,
    window_until: `2026-10-${25 - index}T14:30:00+08:00`
  })),
  runs: [
    {
      run_id: "RUN-DEMO-012",
      user_id: "local-1001",
      tool_code: "boundary",
      decision: "covered",
      site_id: "SITE-DEMO-001",
      reason: "site_window",
      created_at: "2026-10-18T14:30:00+08:00"
    },
    {
      run_id: "RUN-DEMO-011",
      user_id: "local-1002",
      tool_code: "boundary",
      decision: "covered",
      site_id: "SITE-DEMO-002",
      reason: "bound",
      created_at: "2026-10-18T11:22:00+08:00"
    },
    {
      run_id: "RUN-DEMO-010",
      user_id: "local-1006",
      tool_code: "boundary",
      decision: "purchase_required",
      site_id: "SITE-DEMO-003",
      reason: "window_expired",
      created_at: "2026-10-17T18:05:00+08:00"
    }
  ]
};

const adminPolicies = content.tools.map((tool, index) => ({
  tool_code: tool.toolCode,
  access_mode: tool.billing === "paid" ? "paid" : "preview",
  trial_allowed: true,
  maintenance_reason: index === 2 ? "示例：服务升级窗口" : "",
  enabled: index !== 2,
  updated_at: "2026-10-18T09:00:00+08:00"
}));

const session = {
  user: {
    sub: "local-1001",
    name: "林工",
    preferred_username: "林工",
    email: "demo-1001@example.com",
    email_verified: true,
    auth_provider: "email"
  }
};

const profile = {
  display_name: "林工",
  email: "demo-1001@example.com",
  joined_at: "2026-08-16T09:12:00+08:00",
  has_password: true,
  wechat_bound: false,
  needs_email: false
};

const memberOrder = adminOrders[0];
const demoData = {
  content,
  adminContent,
  admin: {
    stats: adminStats,
    sites: adminSites,
    users: { accounts: syntheticUsers, total: 242 },
    orders: { orders: adminOrders, total: 132 },
    invoices: { invoices: adminInvoices, total: 3 },
    refunds: { refunds: adminRefunds, total: 2 },
    coupons: { coupons: adminCoupons, total: 42 },
    batches: { batches: adminBatches },
    couponStats: {
      total: 42,
      used: 11,
      expired: 5,
      redemptions: 11,
      by_source: { welcome: 30, share: 9, compensation: 3 }
    },
    policies: { policies: adminPolicies },
    feedback: { feedback: adminFeedback, total: 4 },
    feedbackStats: { total: 4, resolved: 1, by_rating: { satisfied: 2, neutral: 1, problem: 1 } },
    changes: {
      changes: [
        { ts: "2026-10-18T16:20:00+08:00", action: "update", target: "tools/boundary" },
        { ts: "2026-10-18T15:06:00+08:00", action: "update", target: "tool_updates/boundary-v1.5" },
        { ts: "2026-10-18T11:32:00+08:00", action: "create", target: "datasets/survey-points" }
      ]
    }
  },
  session,
  profile,
  membership: {
    active: false,
    end_at: "",
    discount_percent: 80,
    credits_remaining: 0,
    credit_limit_cents: 5000
  },
  account: {
    orders: {
      orders: [
        {
          ...memberOrder,
          biz_order_no: "YYKJ-DEMO-20261018-001",
          user_id: "local-1001"
        },
        {
          ...adminOrders[1],
          biz_order_no: "YYKJ-DEMO-20261018-002",
          user_id: "local-1001"
        }
      ]
    },
    entitlements: {
      entitlements: [
        {
          feature_code: "boundary_basic",
          status: "active",
          end_at: "2026-10-25T14:30:00+08:00",
          remaining_quota: 1
        }
      ]
    },
    invoices: {
      invoices: [
        {
          invoice_id: "INV-DEMO-001",
          biz_order_no: "YYKJ-DEMO-20261018-002",
          amount_cents: 29900,
          status: "issued"
        }
      ]
    },
    coupons: { coupons: [adminCoupons[0]] },
    refunds: { refunds: [] },
    sites: {
      sites: [
        {
          site_id: "SITE-DEMO-001",
          label: "某工业园区 A 地块",
          bounds: [116.301, 36.22, 116.3155, 36.2315],
          hit_count: 3
        }
      ]
    },
    share: {
      credits: 1,
      credit_limit_cents: 5000,
      history: [
        { created_at: "2026-10-17T10:20:00+08:00", channel: "微信" }
      ]
    }
  },
  activity: {
    boundary: {
      total_runs: 128,
      covered_runs: 96,
      recent: [{ created_at: new Date(Date.now() - 42 * 60 * 1000).toISOString() }]
    },
    xy: {
      total_runs: 84,
      covered_runs: 71,
      recent: [{ created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() }]
    }
  },
  feedback: {
    boundary: {
      feedback: [
        {
          rating: "satisfied",
          detail: "成果包字段和命名都很清楚。",
          admin_reply: "感谢反馈。"
        },
        {
          rating: "neutral",
          detail: "希望增加历史成果对比。",
          admin_reply: ""
        }
      ],
      eligibility: { login_required: false, eligible: true, runs: 3 }
    }
  },
  products: adminContent.products,
  tools: content.tools,
  config: captured["/api/config"],
  productByTool
};

const output = `/* Generated demo data for the standalone UI prototype. */\nwindow.PROTOTYPE_DATA = ${JSON.stringify(demoData, null, 2)};\n`;
fs.writeFileSync(path.join(root, "fighub", "prototype-data.js"), output, "utf8");
console.log(`Wrote fighub/prototype-data.js (${Buffer.byteLength(output)} bytes)`);
