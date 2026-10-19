# 屹云科技全站 UI 交互原型（v0 交付）

这是一份**可独立运行的前端交互原型**，覆盖：

- 屹云科技官网
- FigHub 用户端
- FigHub 用户中心
- FigHub 运营后台
- boundary 边界成果工作台
- 页面之间的跳转、登录/访客/管理员状态、关键弹窗与抽屉

入口：双击 `index.html`。不需要启动后端。

> 如果浏览器策略禁止 `file://` 页面加载脚本，可在本目录运行：
>
> ```powershell
> python -m http.server 8099 --bind 127.0.0.1
> ```
>
> 然后打开 `http://127.0.0.1:8099/`。

## 目录

```text
屹云全站原型/
├─ index.html                  # 交付总览、页面地图、设计基线
├─ official/                   # 官网（首页 + 案例展示）
├─ fighub/                     # FigHub + 用户中心 + 运营后台
├─ boundary/                   # boundary 三栏工作台
├─ shared/                     # 页眉、前端库、底图加载器
├─ previews/                   # 总览页使用的预览图
└─ _build/                     # 演示数据生成脚本（不是运行依赖）
```

## 页面入口

### 官网

- 首页：`official/index.html`
- 案例展示：`official/showcase.html`

### FigHub 用户端

基础地址：`fighub/index.html?mode=authed`

| 页面 | 地址 |
|---|---|
| 首页 | `#home` |
| 工具库 | `#tools` |
| 工具详情（boundary） | `#tool/boundary` |
| 数据集 | `#datasets` |
| 数据集详情 | `#dataset/survey-points` |
| 需求墙 | `#requests` |
| 价格 | `#pricing` |
| 帮助中心 | `#help` |
| 关于我们 | `#about` |
| 服务条款 | `#terms` |
| 隐私政策 | `#privacy` |

### 认证与用户中心

| 页面 | 地址 |
|---|---|
| 登录 | `fighub/index.html?mode=guest#login` |
| 注册 | `fighub/index.html?mode=guest#register` |
| 找回密码 | `fighub/index.html?mode=guest#forgot` |
| 验证邮箱 | `fighub/index.html?mode=authed#verify` |
| 我的权益 | `fighub/index.html?mode=authed#account/entitlements` |
| 个人资料 | `fighub/index.html?mode=authed#account/profile` |
| 账号安全 | `fighub/index.html?mode=authed#account/security` |
| 交易记录 | `fighub/index.html?mode=authed#account/orders` |
| 发票管理 | `fighub/index.html?mode=authed#account/invoices` |

### 运营后台

基础地址：`fighub/index.html?mode=admin#admin/<view>`

可用 view：

`tools`、`tags`、`labels`、`tool_media`、`tool_updates`、`tool_docs`、`datasets`、`help`、`requests`、`site`、`products`、`billing_plans`、`coupons`、`users`、`sites`、`feedback`、`orders`、`invoices`、`refunds`、`policies`、`stats`。

### boundary

- 工作台：`boundary/index.html`
- 左下角原型操作：
  - 载入样例
  - 模拟出成果
  - 权益引导
  - 返回 FigHub / 交付总览

## 关键交互

FigHub 左下角「原型导航」可以切换：

- 访客
- 已登录
- 后台

还可以直接打开以下状态：

- 分享弹窗
- 扫码登录
- 提交需求
- 购买 / 支付方式 / VIP 权益
- 价格确认
- 修改密码 / 注销账号 / 退费申请
- 移动端导航抽屉
- 后台工具 / 标签 / 内容族 / 数据集编辑弹窗

## 给 v0 的改版约束

1. **保留路由和状态**：不要把所有视图做成互相独立的静态截图页。
2. **保留主链路**：官网 → FigHub → 工具详情 → 购买/支付 → 用户中心 → boundary。
3. **保留工具即时反馈**：参数变化后自动回填/更新，不增加“生成”作为必经步骤。
4. **保留弹窗上下文**：分享、扫码、购买、支付、VIP、需求、安全、退费、注销、后台编辑都应覆盖。
5. **同时交付桌面与移动端**：至少检查 1440px 与 390px 宽度。
6. **颜色语义不变**：蓝色表示交互；红/绿只表示错误/成功、超限/达标。
7. **页眉与品牌落点一致**：官网、FigHub、工具页可以有不同页眉背景，但品牌、登录入口和返回路径应统一。

## 与正式站的关系

原型复用当前前端结构与真实内容库文案，但所有网络请求已替换为演示 API：

- 不连接生产账号、订单、支付或管理后台
- 用户、订单、发票、退费、使用券等数据均为脱敏演示数据
- boundary 下载包为占位文件，只用于展示完成态与下载交互
- boundary 底图为本地矢量示意底图，便于离线评审

本原型不修改工作区中的正式站点文件。

## 验证

浏览器回归脚本：

```powershell
node _build/verify-prototype.js
```

最近一次结果：**76 项通过，0 项失败**。报告见 `_verify/report.md` 与 `_verify/report.json`，覆盖：

- 官网 2 页
- FigHub 公共页、认证页、用户中心
- 运营后台 21 个视图
- 分享、需求、购买、支付、VIP、价格确认、账号安全、扫码绑定、退费、注销
- boundary 样例、预览、参数回填、成果下载
- 390px 移动端抽屉与后台宽度

同目录上级的 `屹云全站原型-v0.zip` 是精简交付包（约 15 MB，已排除未使用的视频与库文件）。
