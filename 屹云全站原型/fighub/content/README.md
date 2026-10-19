# 站点内容配置

前端所有"展示内容"都来自**内容库**：`platform_portal/db/content.sqlite3`。
CSV / XLSX 形态已退役——库是唯一事实源，编辑入口是管理台（`http://127.0.0.1:5176/#admin`，开发口令 `admin-dev-12345`）。

`site-content.js` 是**生成物**，不要手改；每次在管理台保存内容时，服务端会在同一次操作里重新生成它。

## 谁在管什么

管理台页签：工具管理、标签管理、帮助中心、价格方案、需求墙、数据集、站点设置、枚举文案、运营统计。
库里的表与之对应：`tools`、`tags`、`plans`、`help`、`requests`、`datasets`/`dataset_files`/`dataset_fields`/`dataset_preview`、`site`、`labels`、`strings`、`content_changes`（变更日志）。

## 日常操作

```powershell
# 正常路径：打开管理台改内容，保存即校验 + 重新发布（失败自动回滚，不会留下半成品）
http://127.0.0.1:5176/#admin

# 只校验"生成物与内容库是否一致"（提交前 / 排查用）
cd platform_portal
& .\.venv\Scripts\python.exe -m yykj_portal.content_publish --site-root ..\Web_YYKJsite_16 --check

# 手工重新发布一次（例如恢复了数据库备份之后）
& .\.venv\Scripts\python.exe -m yykj_portal.content_publish --site-root ..\Web_YYKJsite_16
```

## 约定

- **发布校验**：`content_publish` 会校验标签引用、必填项、`form`/`billing`/`access` 枚举、需求类型与状态是否在 `labels` 里、以及 `script.js` / `index.html` 里 `t("key")`、`data-str` 引用的文案是否存在；任何一条不通过就拒绝发布并回滚数据库事务。
- **站点名称**：改 `site` 表的 `brand`（主题词改 `subject`）；`{brand}` / `{subject}` 占位符在发布时替换，页面文案里可以放心使用。
- **多值**：同一字段用 `|` 分隔，例如工具的 `tags`、`capabilities`，价格方案的 `features`。
- **排序**：`sort` 越小越靠前（首页热门工具取 `featured` 为真且排序前 4 个）。
- **文案**：新增/修改页面文案在"枚举文案 / 站点设置 / 文案"对应的 `strings` 表里；`t("key")` 引用的 key 必须存在。
- **备份/恢复**：直接复制 `platform_portal/db/content.sqlite3`；恢复后跑一次上面的"手工重新发布"即可让站点跟上。库为空时发布会明确报错（"内容库为空"），不会把站点发布成空白。

## 生成物结构

`site-content.js` 暴露 `window.YYKJ16_CONTENT`（必须在 `runtime-config.js` 之前加载），字段名与前端渲染代码一致：

```
tags[]      { key, icon, name, description }
tools[]     { slug, toolCode, route, name, description, tags[], form, billing, image, video, available, input, result, requirements[], sort, featured }
plans[]     { key, label, name, price, pricePlan, note, features[] }（卡片价格按 pricePlan 取后端实时价覆盖）
datasets[]  { id, type, icon, name, description, records, files, formats, access, accessLabel, updated, about, fileList[], fields[][], preview[][] }
requests[]  { id, type, title, summary, votes, status, author, time, tool }
help[]      [ title, copy, href ]
strings     { key: value }（页面文案，t("key") 查表）
labels      { form{}, billing{}, status{}, requestType{}, requestStatus{}, orderStatus{}, invoiceStatus{} }
site        { brand, subject, page_title, description, page_title_template, meta_description_template, contact_phone, contact_wechat, qr_image, home_stat_* }
```
