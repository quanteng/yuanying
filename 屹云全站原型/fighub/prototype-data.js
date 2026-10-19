/* Generated demo data for the standalone UI prototype. */
window.PROTOTYPE_DATA = {
  "content": {
    "tags": [
      {
        "key": "boundary",
        "icon": "layers",
        "name": "边界",
        "description": "调查范围、分区与拐点"
      },
      {
        "key": "point",
        "icon": "target",
        "name": "点位",
        "description": "坐标与点位数据"
      },
      {
        "key": "elevation",
        "icon": "compass",
        "name": "高程",
        "description": "地形高程成果"
      },
      {
        "key": "boring",
        "icon": "grid",
        "name": "钻孔",
        "description": "钻孔布点规划"
      },
      {
        "key": "groundwater",
        "icon": "globe",
        "name": "地下水",
        "description": "地下水位成果图"
      },
      {
        "key": "sample",
        "icon": "database",
        "name": "样品",
        "description": "分层采样与垂向分布"
      },
      {
        "key": "figure",
        "icon": "map",
        "name": "图件",
        "description": "专题图件排版与定制"
      },
      {
        "key": "data",
        "icon": "refresh",
        "name": "数据",
        "description": "格式转换与成果查看"
      }
    ],
    "tools": [
      {
        "slug": "boundary",
        "toolCode": "boundary",
        "route": "/tools/boundary",
        "name": "边界成果整理",
        "description": "上传地块边界文件，满足{link}要求，直接得到可用于提交和出图的成果包。",
        "tags": [
          "boundary"
        ],
        "form": "tool",
        "billing": "paid",
        "image": "boundary.png",
        "video": "",
        "gallery": [],
        "sampleFiles": [
          {
            "name": "样例边界",
            "path": "./downloads/boundary/sample-input.zip",
            "note": "Shapefile（已脱敏）"
          }
        ],
        "available": true,
        "input": "地块边界文件",
        "result": "标准成果包",
        "requirements": [
          "坐标系识别",
          "行政区自动匹配",
          "快速输出成果"
        ],
        "sort": 10,
        "featured": true
      },
      {
        "slug": "xy",
        "toolCode": "xy",
        "route": "/tools/xy",
        "name": "坐标成果处理",
        "description": "整理点位坐标，得到位置准确、可继续叠加使用的数据文件。",
        "tags": [
          "point"
        ],
        "form": "tool",
        "billing": "free",
        "image": "xy.png",
        "video": "./media/videos/xy/demo.mp4",
        "gallery": [
          "sample-01.png",
          "sample-02.png"
        ],
        "sampleFiles": [
          {
            "name": "样例坐标",
            "path": "./downloads/xy/sample-input.csv",
            "note": "12 个点的 X/Y 示例（已平移）"
          }
        ],
        "available": true,
        "input": "点位坐标表",
        "result": "统一坐标数据（可直接用于制图与报告）",
        "requirements": [
          "批量处理点位",
          "核对坐标信息",
          "减少位置偏移"
        ],
        "sort": 20,
        "featured": true
      },
      {
        "slug": "toshp",
        "toolCode": "toshp",
        "route": "/tools/toshp",
        "name": "空间格式转换",
        "description": "在常用空间数据格式之间转换，方便项目交付与复用。",
        "tags": [
          "data"
        ],
        "form": "tool",
        "billing": "free",
        "image": "toshp.png",
        "video": "./media/videos/toshp/demo.mp4",
        "gallery": [
          "sample-01.png",
          "sample-02.png"
        ],
        "sampleFiles": [
          {
            "name": "样例图层",
            "path": "./downloads/toshp/sample-input.zip",
            "note": "WGS84 面图层（已脱敏）"
          }
        ],
        "available": false,
        "input": "待转换的空间数据文件",
        "result": "可复用的空间文件（可直接用于制图与报告）",
        "requirements": [
          "常用格式互转",
          "保留字段信息",
          "结果便于交付"
        ],
        "sort": 30,
        "featured": true
      },
      {
        "slug": "dem",
        "toolCode": "dem",
        "route": "/tools/elevation",
        "name": "地形高程成果",
        "description": "得到可用于分析、制图和报告的地形高程成果。",
        "tags": [
          "elevation"
        ],
        "form": "tool",
        "billing": "paid",
        "image": "dem.png",
        "video": "./media/videos/dem/demo.mp4",
        "gallery": [
          "sample-01.png",
          "sample-02.png"
        ],
        "sampleFiles": [
          {
            "name": "样例点位+边界",
            "path": "./downloads/dem/sample-input.zip",
            "note": "点位 xlsx 与边界 kml（已平移）"
          }
        ],
        "available": false,
        "input": "高程点或等高线数据",
        "result": "地形高程成果（可直接用于制图与报告）",
        "requirements": [
          "范围随项目调整",
          "高程关系直观",
          "支持成果导出"
        ],
        "sort": 40,
        "featured": true
      },
      {
        "slug": "groundwater",
        "toolCode": "groundwater",
        "route": "/tools/groundwater",
        "name": "地下水成果制图",
        "description": "得到地下水位分布、等值线和可用于报告的成图结果。",
        "tags": [
          "groundwater"
        ],
        "form": "tool",
        "billing": "paid",
        "image": "groundwater.png",
        "video": "./media/videos/groundwater/demo.mp4",
        "gallery": [
          "sample-01.png",
          "sample-02.png"
        ],
        "sampleFiles": [
          {
            "name": "样例监测井",
            "path": "./downloads/groundwater/sample-input.xlsx",
            "note": "含水位值的监测井表（已平移）"
          }
        ],
        "available": false,
        "input": "监测井水位数据",
        "result": "地下水专题图（可直接进报告）",
        "requirements": [
          "看清水位空间变化",
          "图例与标注完整",
          "结果可继续编辑"
        ],
        "sort": 50,
        "featured": true
      },
      {
        "slug": "spatial",
        "toolCode": "spatial_viewer",
        "route": "/tools/spatial",
        "name": "空间成果查看",
        "description": "快速看清数据位置、范围和图层关系，及时发现错位或缺失。",
        "tags": [
          "data"
        ],
        "form": "tool",
        "billing": "free",
        "image": "spatial.png",
        "video": "./media/videos/spatial/demo.mp4",
        "gallery": [
          "sample-01.png",
          "sample-02.png"
        ],
        "sampleFiles": [
          {
            "name": "样例图层",
            "path": "./downloads/spatial/sample-input.zip",
            "note": "WGS84 面图层（已脱敏）"
          }
        ],
        "available": true,
        "input": "需要查看的图层数据",
        "result": "空间成果视图（用于核对数据）",
        "requirements": [
          "多图层同时查看",
          "范围关系直观",
          "快速核对数据"
        ],
        "sort": 60,
        "featured": true
      },
      {
        "slug": "layout",
        "toolCode": "layout",
        "route": "/tools/layout",
        "name": "专题图件排版",
        "description": "得到版式统一、可直接放入报告和汇报材料的专题图件。",
        "tags": [
          "figure"
        ],
        "form": "tool",
        "billing": "free",
        "image": "layout.png",
        "video": "./media/videos/layout/demo.mp4",
        "gallery": [
          "sample-01.png",
          "sample-02.png"
        ],
        "sampleFiles": [],
        "available": false,
        "input": "图件与图层数据",
        "result": "专题成果图件（可直接进报告）",
        "requirements": [
          "版式更统一",
          "图例信息完整",
          "导出清晰成图"
        ],
        "sort": 70,
        "featured": true
      },
      {
        "slug": "planboring",
        "toolCode": "planboring",
        "route": "/tools/planboring",
        "name": "钻孔布点规划",
        "description": "得到覆盖调查范围、可直接实施的钻孔点位图和布点成果。",
        "tags": [
          "boring"
        ],
        "form": "tool",
        "billing": "paid",
        "image": "planboring.png",
        "video": "./media/videos/planboring/demo.mp4",
        "gallery": [
          "sample-01.png",
          "sample-02.png"
        ],
        "sampleFiles": [
          {
            "name": "样例调查分区",
            "path": "./downloads/planboring/sample-input.zip",
            "note": "调查分区 Shapefile（已脱敏）"
          }
        ],
        "available": true,
        "input": "调查范围与点位数据",
        "result": "钻孔点位图与布点方案（可直接进报告）",
        "requirements": [
          "点位布局更合理",
          "范围覆盖更完整",
          "方案调整更方便"
        ],
        "sort": 80,
        "featured": true
      },
      {
        "slug": "vertiplot",
        "toolCode": "vertiplot",
        "route": "/tools/vertiplot",
        "name": "垂向分布制图",
        "description": "得到剖面和垂向分布图，直观看清不同深度的变化。",
        "tags": [
          "sample"
        ],
        "form": "tool",
        "billing": "paid",
        "image": "vertiplot.png",
        "video": "./media/videos/vertiplot/demo.mp4",
        "gallery": [
          "sample-01.png",
          "sample-02.png"
        ],
        "sampleFiles": [
          {
            "name": "样例纵表",
            "path": "./downloads/vertiplot/sample-input.xlsx",
            "note": "公开示例纵表"
          }
        ],
        "available": true,
        "input": "分层采样数据",
        "result": "垂向分布专题图（可直接进报告）",
        "requirements": [
          "深度关系更清楚",
          "剖面成果更直观",
          "成果图可直接导出"
        ],
        "sort": 90,
        "featured": true
      },
      {
        "slug": "custom",
        "toolCode": "custom",
        "route": "",
        "name": "任务定制",
        "description": "把调查目标交给技术人员，获得可直接交付的空间成果与图件。",
        "tags": [
          "figure"
        ],
        "form": "service",
        "billing": "quote",
        "image": "custom.png",
        "video": "",
        "gallery": [
          "sample-01.png",
          "sample-02.png"
        ],
        "sampleFiles": [],
        "available": true,
        "input": "项目数据与目标说明",
        "result": "定制成果图件与数据文件（可直接进报告）",
        "requirements": [
          "按项目目标沟通",
          "成果范围一起确认",
          "交付图件与数据文件"
        ],
        "sort": 100,
        "featured": true
      },
      {
        "slug": "data-import",
        "toolCode": "data_import",
        "route": "/tools/data-import",
        "name": "数据接入（智能导入）",
        "description": "上传即识别：列自动识别、字段映射、规范化台账与核对报告。",
        "tags": [
          "data"
        ],
        "form": "tool",
        "billing": "free",
        "image": "data-import.png",
        "video": "./media/videos/data-import/demo.mp4",
        "gallery": [
          "sample-01.png",
          "sample-02.png"
        ],
        "sampleFiles": [
          {
            "name": "示例点位表",
            "path": "./downloads/data-import/sample-points.xlsx",
            "note": "脱敏样例（BORING 模板）"
          },
          {
            "name": "示例检测长表",
            "path": "./downloads/data-import/sample-detections.xlsx",
            "note": "脱敏样例（有机污染物长表）"
          }
        ],
        "available": true,
        "input": "Excel / CSV（点位表或检测长表）",
        "result": "规范化台账 + 核对报告",
        "requirements": [
          "自动识别列结构",
          "统一字段命名",
          "输出可直接使用的台账"
        ],
        "sort": 110,
        "featured": true
      },
      {
        "slug": "coc-cleaning",
        "toolCode": "coc_cleaning",
        "route": "/tools/coc-cleaning",
        "name": "检测数据清洗",
        "description": "污染物名称归并（别名表）、单位换算、检出限处理与清洗报告。",
        "tags": [
          "sample"
        ],
        "form": "tool",
        "billing": "free",
        "image": "coc-cleaning.png",
        "video": "./media/videos/coc-cleaning/demo.mp4",
        "gallery": [
          "sample-01.png",
          "sample-02.png"
        ],
        "sampleFiles": [
          {
            "name": "示例检测数据",
            "path": "./downloads/coc-cleaning/sample-detections.xlsx",
            "note": "脱敏样例（有机污染物长表）"
          },
          {
            "name": "示例别名规则",
            "path": "./downloads/coc-cleaning/sample-alias-rules.xlsx",
            "note": "别名归并规则示例（可替换）"
          }
        ],
        "available": true,
        "input": "检测数据长表（+ 可选别名规则表）",
        "result": "清洗结果 + 问题清单",
        "requirements": [
          "名称归并到标准名称",
          "数值与单位解析",
          "检出限（<）标记"
        ],
        "sort": 120,
        "featured": true
      },
      {
        "slug": "risk-check",
        "toolCode": "risk_check",
        "route": "/tools/risk-check",
        "name": "超标比对",
        "description": "检测数据对标准值（筛选值 / 修复目标值）逐条比对，输出超标清单。",
        "tags": [
          "data"
        ],
        "form": "tool",
        "billing": "paid",
        "image": "risk-check.png",
        "video": "./media/videos/risk-check/demo.mp4",
        "gallery": [
          "sample-01.png",
          "sample-02.png"
        ],
        "sampleFiles": [
          {
            "name": "示例检测数据",
            "path": "./downloads/risk-check/sample-detections.xlsx",
            "note": "脱敏样例（有机污染物长表）"
          },
          {
            "name": "超标演示数据",
            "path": "./downloads/risk-check/sample-over-demo.xlsx",
            "note": "演示数据：含 3 条超标"
          },
          {
            "name": "示例标准值",
            "path": "./downloads/risk-check/sample-standards.xlsx",
            "note": "标准值表（多级表头 + 规划分类）"
          }
        ],
        "available": true,
        "input": "检测数据 + 标准值表",
        "result": "比对结果 + 超标清单（含超标倍数）",
        "requirements": [
          "规划分类与深度分段选择",
          "单位自动换算",
          "超标倍数与判定"
        ],
        "sort": 130,
        "featured": true
      },
      {
        "slug": "boring-cleaning",
        "toolCode": "boring_cleaning",
        "route": "/tools/boring-cleaning",
        "name": "钻孔数据整理",
        "description": "钻孔台账清洗：孔号、深度段与分层规范化，输出可直接使用的钻孔表。",
        "tags": [
          "boring"
        ],
        "form": "tool",
        "billing": "free",
        "image": "boring-cleaning.png",
        "video": "./media/videos/boring-cleaning/demo.mp4",
        "gallery": [
          "sample-01.png",
          "sample-02.png"
        ],
        "sampleFiles": [],
        "available": true,
        "input": "钻孔台账（Excel/CSV）",
        "result": "标准钻孔台账 + 核对清单",
        "requirements": [
          "孔号 / 深度段规范化",
          "分层与岩性字段核对",
          "输出标准钻孔台账"
        ],
        "sort": 140,
        "featured": true
      },
      {
        "slug": "sample-cleaning",
        "toolCode": "sample_cleaning",
        "route": "/tools/sample-cleaning",
        "name": "样品数据整理",
        "description": "样品台账清洗：编号、深度、样品类型规范与缺失核对。",
        "tags": [
          "sample"
        ],
        "form": "tool",
        "billing": "free",
        "image": "sample-cleaning.png",
        "video": "./media/videos/sample-cleaning/demo.mp4",
        "gallery": [
          "sample-01.png",
          "sample-02.png"
        ],
        "sampleFiles": [],
        "available": true,
        "input": "样品台账（Excel/CSV）",
        "result": "标准样品台账 + 缺失核对",
        "requirements": [
          "样品编号规范",
          "深度与类型核对",
          "缺失与重复检查"
        ],
        "sort": 150,
        "featured": true
      },
      {
        "slug": "imagery-download",
        "toolCode": "imagery_download",
        "route": "/tools/imagery-download",
        "name": "影像下载",
        "description": "上传边界或绘制范围查询历史影像，按日期下载完整 GeoTIFF。",
        "tags": [
          "data"
        ],
        "form": "tool",
        "billing": "free",
        "image": "imagery-download.png",
        "video": "./media/videos/imagery-download/demo.mp4",
        "gallery": [
          "sample-01.png",
          "sample-02.png"
        ],
        "sampleFiles": [],
        "available": true,
        "input": "矢量边界 / 手绘范围",
        "result": "历史影像 GeoTIFF（按日期）",
        "requirements": [
          "范围查询与矩形包络",
          "多日期影像查询",
          "完整 GeoTIFF 下载"
        ],
        "sort": 160,
        "featured": true
      },
      {
        "slug": "history-archive",
        "toolCode": "history_archive",
        "route": "/tools/history-archive",
        "name": "历史资料整理",
        "description": "历史影像、POI 与其他要素的建库、检索与版本快照。",
        "tags": [
          "data"
        ],
        "form": "tool",
        "billing": "free",
        "image": "history-archive.png",
        "video": "./media/videos/history-archive/demo.mp4",
        "gallery": [
          "sample-01.png",
          "sample-02.png"
        ],
        "sampleFiles": [],
        "available": true,
        "input": "边界版本 + 年份范围",
        "result": "历史资料版本（影像 + POI + 要素）",
        "requirements": [
          "历史影像与 POI 建库",
          "逻辑要素与不可变修订",
          "检索与版本快照"
        ],
        "sort": 170,
        "featured": true
      },
      {
        "slug": "report-builder",
        "toolCode": "report_builder",
        "route": "/tools/report-builder",
        "name": "报告装配",
        "description": "锁定成果版本，按模板章节预检并装配 DOCX 报告。",
        "tags": [
          "figure"
        ],
        "form": "tool",
        "billing": "paid",
        "image": "report-builder.png",
        "video": "./media/videos/report-builder/demo.mp4",
        "gallery": [
          "sample-01.png",
          "sample-02.png"
        ],
        "sampleFiles": [],
        "available": true,
        "input": "已保存的成果版本",
        "result": "DOCX 报告（含图件槽）",
        "requirements": [
          "锁定成果版本",
          "模板章节预检",
          "一次性生成 DOCX"
        ],
        "sort": 180,
        "featured": true
      },
      {
        "slug": "aggregation",
        "toolCode": "aggregation",
        "route": "/tools/aggregation",
        "name": "空间聚合",
        "description": "超标记录的空间聚合与图斑汇总（聚合契约 v2）。",
        "tags": [
          "figure"
        ],
        "form": "tool",
        "billing": "paid",
        "image": "aggregation.png",
        "video": "./media/videos/aggregation/demo.mp4",
        "gallery": [
          "sample-01.png",
          "sample-02.png"
        ],
        "sampleFiles": [],
        "available": true,
        "input": "超标纵表（OVER=1）+ 范围成果",
        "result": "聚合成果（图斑 + 关系 + 版本）",
        "requirements": [
          "OVER=1 记录聚合",
          "图斑与关系汇总",
          "输出聚合成果版本"
        ],
        "sort": 190,
        "featured": true
      },
      {
        "slug": "remediation",
        "toolCode": "remediation",
        "route": "/tools/remediation",
        "name": "修复单元",
        "description": "修复单元划定：来源图斑 + 控制点 + 成员血缘。",
        "tags": [
          "figure"
        ],
        "form": "tool",
        "billing": "paid",
        "image": "remediation.png",
        "video": "./media/videos/remediation/demo.mp4",
        "gallery": [
          "sample-01.png",
          "sample-02.png"
        ],
        "sampleFiles": [],
        "available": true,
        "input": "聚合成果（契约 v2）",
        "result": "修复单元成果（图斑 + 血缘）",
        "requirements": [
          "修复单元划定",
          "控制点与成员血缘",
          "成果走版本快照"
        ],
        "sort": 200,
        "featured": true
      },
      {
        "slug": "numerical-sim",
        "toolCode": "numerical_sim",
        "route": "/tools/numerical-sim",
        "name": "数值模拟",
        "description": "场地地下水 / 溶质数值模拟（规划能力，入口已接入平台）。",
        "tags": [
          "groundwater"
        ],
        "form": "tool",
        "billing": "quote",
        "image": "numerical-sim.png",
        "video": "./media/videos/numerical-sim/demo.mp4",
        "gallery": [
          "sample-01.png",
          "sample-02.png"
        ],
        "sampleFiles": [],
        "available": true,
        "input": "场地水文地质条件 / 参数",
        "result": "模拟结果与成果展示图",
        "requirements": [
          "地下水 / 溶质模拟",
          "情景与参数模板",
          "模拟结果展示"
        ],
        "sort": 210,
        "featured": true
      }
    ],
    "datasets": [
      {
        "id": "admin-boundaries",
        "type": "行政区划",
        "icon": "map",
        "name": "全国行政区划边界示例数据",
        "description": "用于外业调查制图、范围裁切和边界关系测试的标准化行政区划样例。",
        "records": "3,200",
        "files": "1",
        "formats": "GeoJSON",
        "access": "free",
        "accessLabel": "公开示例",
        "updated": "2026-09",
        "about": "包含省、市、县三级行政区划的示例边界数据，适合用于地图展示、空间范围裁切和工具联调。数据已做示例化处理，不作为正式测绘成果使用。",
        "fileList": [
          {
            "name": "行政区划边界_示例.geojson",
            "meta": "GeoJSON · 2.8 MB · 3,200 条记录"
          }
        ],
        "fields": [
          [
            "名称",
            "行政区划名称",
            "string"
          ],
          [
            "级别",
            "省、市、县层级",
            "number"
          ],
          [
            "代码",
            "行政区划代码",
            "string"
          ],
          [
            "geometry",
            "边界几何",
            "MultiPolygon"
          ]
        ],
        "preview": [
          [
            "山西省",
            "1",
            "140000",
            "MultiPolygon"
          ],
          [
            "太原市",
            "2",
            "140100",
            "MultiPolygon"
          ]
        ]
      },
      {
        "id": "survey-points",
        "type": "点位数据",
        "icon": "database",
        "name": "外业调查点位样例数据",
        "description": "用于坐标处理、点位核对和地图展示的调查点位样例文件。",
        "records": "1,248",
        "files": "2",
        "formats": "CSV / XLSX",
        "access": "free",
        "accessLabel": "免费样例",
        "updated": "2026-09",
        "about": "包含点位编号、经纬度、采样时间和调查类型等字段，适合验证坐标导入、字段映射和成果预览流程。",
        "fileList": [
          {
            "name": "调查点位_示例.csv",
            "meta": "CSV · 186 KB · 1,248 条记录"
          },
          {
            "name": "调查点位_字段说明.xlsx",
            "meta": "XLSX · 24 KB · 2 个工作表"
          }
        ],
        "fields": [
          [
            "point_id",
            "点位编号",
            "string"
          ],
          [
            "longitude",
            "经度",
            "number"
          ],
          [
            "latitude",
            "纬度",
            "number"
          ],
          [
            "survey_type",
            "调查类型",
            "string"
          ]
        ],
        "preview": [
          [
            "P-0001",
            "112.5482",
            "37.8751",
            "土壤调查"
          ],
          [
            "P-0002",
            "112.5621",
            "37.8614",
            "地下水调查"
          ]
        ]
      },
      {
        "id": "groundwater-monitoring",
        "type": "监测数据",
        "icon": "compass",
        "name": "地下水监测样例数据",
        "description": "用于地下水位分析、等值线制图和成果检查的时间序列样例数据。",
        "records": "8,640",
        "files": "3",
        "formats": "CSV",
        "access": "paid",
        "accessLabel": "权益下载",
        "updated": "2026-08",
        "about": "包含监测点、监测日期、水位和基础空间位置字段，适合演示地下水成果制图和时间序列分析。该数据集为教学与测试样例。",
        "fileList": [
          {
            "name": "地下水监测_2024.csv",
            "meta": "CSV · 1.2 MB · 2,880 条记录"
          },
          {
            "name": "地下水监测_2025.csv",
            "meta": "CSV · 1.4 MB · 3,120 条记录"
          },
          {
            "name": "地下水监测_2026.csv",
            "meta": "CSV · 1.1 MB · 2,640 条记录"
          }
        ],
        "fields": [
          [
            "well_id",
            "监测井编号",
            "string"
          ],
          [
            "observed_at",
            "监测日期",
            "date"
          ],
          [
            "water_level",
            "地下水位",
            "number"
          ],
          [
            "longitude",
            "经度",
            "number"
          ]
        ],
        "preview": [
          [
            "GW-001",
            "2025-06-12",
            "824.31",
            "112.5482"
          ],
          [
            "GW-002",
            "2025-06-12",
            "819.74",
            "112.5621"
          ]
        ]
      }
    ],
    "requests": [
      {
        "id": "coordinate-check",
        "type": "new-tool",
        "title": "批量坐标点校核与异常提示",
        "summary": "导入调查点位后，自动检查坐标格式、重复点和明显偏移，并给出可核对的结果表。",
        "votes": 7,
        "status": "under-review",
        "author": "外业调查用户",
        "time": "2026-09-18",
        "tool": "坐标成果处理"
      },
      {
        "id": "map-legend",
        "type": "improvement",
        "title": "专题图件增加统一图例和比例尺",
        "summary": "希望图件排版时可以统一设置图例、比例尺、指北针和输出尺寸，减少重复调整。",
        "votes": 5,
        "status": "under-review",
        "author": "匿名用户",
        "time": "2026-09-16",
        "tool": "专题图件排版"
      },
      {
        "id": "process-detail",
        "type": "bug",
        "title": "上传后显示处理进度和错误明细",
        "summary": "文件处理时间较长时，希望能看到当前进度，以及哪些文件或字段没有通过检查。",
        "votes": 3,
        "status": "planned",
        "author": "项目用户",
        "time": "2026-09-12",
        "tool": "空间格式转换"
      }
    ],
    "toolMedia": [
      {
        "id": "boundary-hero",
        "toolCode": "boundary",
        "slot": "hero",
        "mediaType": "image",
        "title": "上传格式与成果包组成",
        "src": "images/tools/boundary/hero-schematic.svg",
        "poster": "",
        "sort": 10,
        "status": true
      }
    ],
    "toolUpdates": [
      {
        "id": "boundary-20261014",
        "toolCode": "boundary",
        "version": "v1.0",
        "publishedAt": "2026-10-14",
        "kind": "feature",
        "title": "成果字段与命名按提交要求整理",
        "summary": "成果包里的字段、日期格式与命名都按提交要求输出，可直接提交。",
        "detail": "",
        "relatedFeedback": "",
        "status": "published",
        "sort": 10
      },
      {
        "id": "boundary-20261015-sample",
        "toolCode": "boundary",
        "version": "v1.1",
        "publishedAt": "2026-10-15",
        "kind": "feature",
        "title": "没购买也能先用示例数据跑一遍",
        "summary": "示例数据免费体验：先看清成果包的字段与命名，再决定是否开通。",
        "detail": "",
        "relatedFeedback": "",
        "status": "published",
        "sort": 20
      },
      {
        "id": "boundary-20261016-detail",
        "toolCode": "boundary",
        "version": "v1.2",
        "publishedAt": "2026-10-16",
        "kind": "improve",
        "title": "详情页与购买流程重做",
        "summary": "一图看懂 / 数据说明 / 价格与 VIP 价一目了然，支持用券或额度兑换。",
        "detail": "",
        "relatedFeedback": "",
        "status": "published",
        "sort": 30
      },
      {
        "id": "boundary-20261016-copy",
        "toolCode": "boundary",
        "version": "v1.3",
        "publishedAt": "2026-10-16",
        "kind": "doc",
        "title": "说明按接收要求口径改写",
        "summary": "上传格式、成果包内容、识别失败怎么办三条说明改短句；成果命名与字段口径对齐提交要求。",
        "detail": "",
        "relatedFeedback": "",
        "status": "published",
        "sort": 40
      },
      {
        "id": "boundary-20261016-account",
        "toolCode": "boundary",
        "version": "v1.4",
        "publishedAt": "2026-10-16",
        "kind": "feature",
        "title": "购买后权益跟着账号走，重启也不丢",
        "summary": "订单与场地权益持久化保存；同一个场地复算窗口内不重复收费，账号中心能看到已登记的场地四至。",
        "detail": "",
        "relatedFeedback": "",
        "status": "published",
        "sort": 50
      },
      {
        "id": "boundary-20261016-entry",
        "toolCode": "boundary",
        "version": "v1.5",
        "publishedAt": "2026-10-16",
        "kind": "improve",
        "title": "示例数据直接体验，自己的数据按权益放行",
        "summary": "从 FigHub 进入工具后，上传自己的地块边界会先核对场地权益，没有权益会在工具里直接给出开通入口。",
        "detail": "",
        "relatedFeedback": "",
        "status": "published",
        "sort": 60
      }
    ],
    "toolDocs": [
      {
        "id": "boundary-shp",
        "toolCode": "boundary",
        "section": "data",
        "title": "上传文件格式",
        "content": "Shapefile 整套（.shp/.shx/.dbf/.prj）；dxf · kml · kmz；xlsx · xls · csv · txt；文件能读即可，不必先统一坐标系",
        "sort": 10,
        "status": true
      },
      {
        "id": "boundary-fields",
        "toolCode": "boundary",
        "section": "data",
        "title": "成果包内容",
        "content": "同名文件夹：边界文件 + 字段说明 + 成果图；地块面积自动计算，可手工修正；字段按接收要求写入；命名：所处阶段 + 地块编码",
        "sort": 20,
        "status": true
      },
      {
        "id": "boundary-fallback",
        "toolCode": "boundary",
        "section": "data",
        "title": "识别不到时怎么办",
        "content": "带号认不出 → 手工指定中央经线；行政区认不出 → 手工填写（接收要求必填）",
        "sort": 30,
        "status": true
      }
    ],
    "help": [
      {
        "group": "使用与工具",
        "title": "你们产出的是什么？",
        "copy": "可直接进报告的专题图件——点位图、等值线图、剖面图、柱状图、垂向分布图等，具体以各工具说明为准。",
        "href": "#tools"
      },
      {
        "group": "使用与工具",
        "title": "如何选择工具？",
        "copy": "先看工具详情中的输入要求和结果说明，再决定是否开始处理。",
        "href": "#tools"
      },
      {
        "group": "使用与工具",
        "title": "权益什么时候生效？",
        "copy": "支付成功后权益写入账户，需要上传的工具按服务端规则开始计时。",
        "href": "#account/entitlements"
      },
      {
        "group": "使用与工具",
        "title": "订单和发票在哪里？",
        "copy": "登录后打开用户中心，可以查看订单状态并提交发票申请。",
        "href": "#account/orders"
      },
      {
        "group": "使用与工具",
        "title": "文件会被保存吗？",
        "copy": "每个工具的文件处理方式和保存边界会在详情页说明。",
        "href": "#privacy"
      },
      {
        "group": "使用与工具",
        "title": "遇到错误怎么办？",
        "copy": "保存页面提示和订单号，再通过联系我们获得支持。",
        "href": "#about?section=contact"
      },
      {
        "group": "使用与工具",
        "title": "没有找到需要的工具？",
        "copy": "告诉我们你想完成的成果，我们会评估是否加入工具计划。",
        "href": "#requests"
      },
      {
        "group": "支付与计费",
        "title": "「按场地计价」是什么意思？",
        "copy": "按调查项目的场地（地块）计费：一个场地买一次，含一份可交付成果；同一场地 7 天内改数据、改参数、重新出图不重复收费（VIP 30 天）。换场地或换一套调查数据需要重新购买。",
        "href": "#pricing"
      },
      {
        "group": "支付与计费",
        "title": "能开发票吗？",
        "copy": "支持。登录后在用户中心提交发票申请，选择已支付订单即可。",
        "href": "#account/invoices"
      },
      {
        "group": "支付与计费",
        "title": "通用工具为什么免费？",
        "copy": "坐标处理、格式转换、成果查看、图件排版属于通用能力，注册即可用；只有固定数据输入、固定专题输出的工具收费。",
        "href": "#pricing"
      },
      {
        "group": "支付与计费",
        "title": "买一次能用几次？",
        "copy": "一次购买对应一个场地的一份成果；同一场地在 7 天内（VIP 30 天）反复调整不再收费。",
        "href": "#pricing"
      },
      {
        "group": "支付与计费",
        "title": "换数据或换场地要再买吗？",
        "copy": "要。换场地或换一套数据视为新的成果，需要重新购买。",
        "href": "#pricing"
      },
      {
        "group": "支付与计费",
        "title": "成果不达交付要求怎么办？",
        "copy": "联系我们，协助重做一次。",
        "href": "#about?section=contact"
      }
    ],
    "strings": {
      "nav.home": "首页",
      "nav.aria": "主导航",
      "nav.tools": "工具",
      "nav.datasets": "数据集",
      "nav.help": "帮助",
      "nav.pricing": "价格",
      "nav.about": "关于",
      "nav.requests": "需求墙",
      "header.search": "搜索工具",
      "header.login": "登录",
      "header.logout": "退出",
      "header.register": "注册",
      "theme.to_dark": "切换深色模式",
      "theme.to_light": "切换浅色模式",
      "common.all": "全部",
      "common.cancel": "取消",
      "common.close": "关闭",
      "common.reload": "重新加载",
      "common.home": "首页",
      "footer.slogan": "从调查数据，到报告级专题图件。",
      "footer.product": "产品",
      "footer.users": "用户",
      "footer.legal": "法律",
      "footer.other": "其他",
      "footer.all_tools": "所有工具",
      "footer.pricing": "价格方案",
      "footer.help_center": "帮助中心",
      "footer.account": "账户中心",
      "footer.entitlements": "我的权益",
      "footer.orders": "交易记录",
      "footer.invoices": "发票管理",
      "footer.terms": "服务条款",
      "footer.privacy": "隐私政策",
      "footer.contact": "联系我们",
      "footer.bottom_service": "调查数据处理与专题图件制作",
      "share.title": "分享",
      "share.copy_link": "复制链接",
      "share.wechat": "微信",
      "share.hint": "复制链接分享给好友，对方打开即可进入本站",
      "share.link_label": "分享链接",
      "share.brand_line": "调查数据整理与专题图件制作",
      "share.copied_wechat": "链接已复制，打开微信粘贴给好友或群聊",
      "share.copied": "分享链接已复制",
      "home.hero.eyebrow": "外业调查 · 专题图件工作台",
      "home.hero.title": "数据进，图件出",
      "home.hero.lede": "外业调查的图件工作台——把钻孔、采样、边界、坐标，整理成可直接进报告的专题图件。",
      "home.hero.primary": "开始使用",
      "home.hero.secondary": "查看价格",
      "home.why.eyebrow": "为什么选择我们",
      "home.why.title": "简单、清楚、面向交付",
      "home.why.lede": "每个工具都围绕一类专题图件成果设计。",
      "home.why.link": "了解我们 →",
      "home.why.lede_final": "从数据安全、专业能力到交付方式，选择更适合项目的工具。",
      "home.why.reason1_title": "安全可控",
      "home.why.reason1_desc": "重视数据边界和处理过程，让成果使用更安心。",
      "home.why.reason2_title": "技业并重",
      "home.why.reason2_desc": "既懂空间数据技术，也理解调查项目的实际业务。",
      "home.why.reason3_title": "成果可交",
      "home.why.reason3_desc": "输出能核对、能复用、能进入报告和项目交付的成果。",
      "home.why.reason4_title": "灵活计费",
      "home.why.reason4_desc": "按工具、任务和服务方式选择，成本与项目规模匹配。",
      "home.popular.eyebrow": "热门工具",
      "home.popular.title": "先从常用成果开始",
      "home.popular.lede": "常用外业调查成果，一站式查看与使用。",
      "home.popular.link": "查看全部工具 →",
      "home.tags.title": "按数据内容找工具",
      "home.tags.lede": "边界、点位、高程、钻孔、地下水、样品、图件与数据。",
      "home.cta.title": "准备好开始了吗？",
      "home.cta.lede": "从一个明确的图件目标开始，把调查数据处理成报告可用的成果。",
      "home.cta.primary": "免费注册",
      "home.cta.secondary": "联系我们",
      "tools.eyebrow": "工具目录",
      "tools.title": "所有工具",
      "tools.lede": "选择一个成果，查看工具说明、使用方式和交付结果。",
      "tools.search_placeholder": "搜索工具...",
      "tools.search_aria": "搜索工具",
      "tools.count": "{count} 项工具",
      "tools.empty": "没有找到匹配的工具。",
      "tools.empty_link": "告诉我们你需要什么 →",
      "tools.image_alt": "{name}示意图",
      "tools.preview_empty": "暂无成果预览",
      "tools.preview_label": "成果预览",
      "detail.breadcrumb_tools": "工具",
      "detail.capabilities": "核心能力",
      "detail.input": "输入数据",
      "detail.output": "输出成果",
      "detail.start": "开始使用",
      "detail.preparing": "即将上线",
      "detail.submit_request": "提交需求",
      "purchase.eyebrow": "使用权益",
      "purchase.title": "该工具需要购买权益",
      "purchase.lede": "购买后即可使用，也可以先用示例数据免费体验功能。",
      "purchase.confirm": "购买使用",
      "purchase.demo": "免费体验",
      "pricing.eyebrow": "价格方案",
      "pricing.title": "简单透明的价格",
      "pricing.lede": "通用工具免费；出成果的工具按场地计价——一个场地买一次，7 天内改到满意。",
      "pricing.free_button": "查看免费工具",
      "pricing.login_button": "登录后选择",
      "pricing.products_eyebrow": "工具权益",
      "pricing.products_title": "选择具体工具和使用方案",
      "pricing.products_lede": "每个工具一个价；拿不准的先用样例数据免费体验。",
      "pricing.loading": "正在加载可用方案...",
      "pricing.empty": "当前没有可购买的工具权益。",
      "pricing.error": "暂时无法加载价格方案。",
      "pricing.product_fallback": "按所选方案创建工具使用权益",
      "pricing.table_tool": "工具",
      "pricing.table_tags": "标签",
      "pricing.table_form": "形态",
      "pricing.table_billing": "计费",
      "pricing.table_status": "状态",
      "help.eyebrow": "帮助中心",
      "help.title": "帮助中心",
      "help.lede": "工具怎么用、权益什么时候生效、结果在哪里找，都在这里说明。",
      "help.link": "查看说明 →",
      "datasets.eyebrow": "数据集",
      "datasets.title": "外业调查数据集",
      "datasets.lede": "可直接用于分析、制图和工具测试的空间数据。",
      "datasets.search_placeholder": "搜索数据集...",
      "datasets.search_aria": "搜索数据集",
      "datasets.empty": "没有找到匹配的数据集。",
      "datasets.records": "{count} 条记录",
      "datasets.files": "{count} 个文件",
      "datasets.save_aria": "收藏数据集",
      "datasets.share_aria": "分享数据集",
      "datasets.stat_records": "记录",
      "datasets.stat_files": "文件",
      "datasets.stat_formats": "格式",
      "datasets.stat_updated": "更新",
      "datasets.about_section": "关于数据集",
      "datasets.file_section": "文件列表",
      "datasets.field_section": "数据字典",
      "datasets.preview_section": "样例预览",
      "datasets.download_paid": "获取权益",
      "datasets.download_free": "下载示例",
      "datasets.table_field": "字段",
      "datasets.table_desc": "说明",
      "datasets.table_type": "类型",
      "datasets.notice_title": "来源与使用说明",
      "datasets.notice_body": "这是FigHub的示例数据，仅用于功能演示、学习和测试。正式项目请核对数据来源、坐标系、授权范围和成果适用性。",
      "requests.eyebrow": "需求墙",
      "requests.title": "需求墙",
      "requests.lede": "把你需要的外业调查成果告诉我们，一起把工具做得更贴近项目。",
      "requests.submit": "提交需求",
      "requests.sort_newest": "最新",
      "requests.sort_top": "热门",
      "requests.mine": "我的需求",
      "requests.empty": "还没有匹配的需求。",
      "requests.empty_link": "提交第一条需求 →",
      "requests.modal_title": "提交需求",
      "requests.modal_lede": "描述清楚你希望得到的外业调查成果。",
      "requests.close_aria": "关闭提交需求窗口",
      "requests.vote_aria": "支持 {title}",
      "requests.tool_prefix": "工具：{tool}",
      "requests.field_type": "需求类型",
      "requests.field_title": "需求标题",
      "requests.field_title_placeholder": "例如：支持批量坐标点校核",
      "requests.field_summary": "详细描述",
      "requests.field_summary_placeholder": "说明输入数据、期望结果和使用场景",
      "requests.field_tool": "关联工具（可选）",
      "requests.field_tool_none": "不关联具体工具",
      "requests.status_need_fields": "请填写需求标题和详细描述。",
      "requests.added": "需求已提交，我们会尽快评估",
      "requests.vote_recorded": "已记录你的支持",
      "requests.vote_already": "你已经支持过这条需求",
      "about.eyebrow": "FigHub",
      "about.hero.title": "关于FigHub",
      "about.hero.lede": "致力于把调查数据变成可直接进报告的专题图件。从边界整理、坐标处理到图件排版，每一步都能核对、能导出、能复用。",
      "about.hero.primary": "浏览工具",
      "about.hero.secondary": "联系我们",
      "about.section_mission": "我们的使命",
      "about.mission.title": "让空间数据处理，少一点反复试错",
      "about.mission.desc": "调查数据从采集到交付，中间往往还要经历整理、核对、转换和制图。我们把这些步骤拆成清楚的工具，让个人和团队更快得到可以继续使用的成果。",
      "about.mission.value1_title": "围绕交付成果",
      "about.mission.value1_desc": "不只处理文件格式，更关心最后能不能放进报告、图件或项目成果。",
      "about.mission.value2_title": "每一步都说清楚",
      "about.mission.value2_desc": "输入要求、处理范围、输出结果和使用限制，在开始前就能看懂。",
      "about.mission.value3_title": "从浏览到使用",
      "about.mission.value3_desc": "先看工具能完成什么，再选择合适的权益，把订单和结果放在同一个账户里。",
      "about.section_features": "产品特色",
      "about.features.title": "为真实的外业调查工作设计",
      "about.feature1_title": "结果导向",
      "about.feature1_desc": "边界成果、坐标成果、专题图件和垂向分布，每个工具都对应一个清晰结果。",
      "about.feature2_title": "在线使用",
      "about.feature2_desc": "打开浏览器即可查看说明、登录账户和进入已授权的工具服务。",
      "about.feature3_title": "流程可追溯",
      "about.feature3_desc": "订单、支付、发票和工具权益由统一账户管理，状态有记录可查询。",
      "about.feature4_title": "持续扩展",
      "about.feature4_desc": "从常用数据整理开始，逐步覆盖空间分析、地图成果和项目定制服务。",
      "about.story.eyebrow": "我们的故事",
      "about.story.title": "从“文件已经有了”到“成果可以交付”",
      "about.story.para1": "在外业调查里，最费时间的往往不是得到一份数据，而是把它整理成别人可以核对、软件可以继续使用、报告可以直接引用的成果。",
      "about.story.para2": "边界需要闭合，坐标需要统一，图层需要核对，图件需要排版；当这些工作分散在不同软件和重复操作里，项目进度就容易被细节拖慢。",
      "about.story.note_title": "先看清结果，再开始处理",
      "about.story.note_desc": "这是我们设计每个工具时最重要的判断标准。",
      "about.story.step1_title": "数据有了",
      "about.story.step1_desc": "先把边界、坐标和格式整理清楚，后面的分析才有可靠基础。",
      "about.story.step2_title": "成果成了",
      "about.story.step2_desc": "围绕实际调查任务完成分析、制图和排版，不让细节拖慢项目。",
      "about.story.step3_title": "可以交付",
      "about.story.step3_desc": "输出能核对、能复用，也能直接进入报告和项目成果。",
      "about.section_commitments": "我们的承诺",
      "about.commitments.title": "把重要的事情说清楚、做持续",
      "about.commitment1_title": "保护隐私",
      "about.commitment1_desc": "只在提供账户、订单、发票和工具服务所必需的范围内处理信息。",
      "about.commitment2_title": "持续改进",
      "about.commitment2_desc": "根据用户反馈补齐工具、优化输入输出，优先解决影响成果交付的问题。",
      "about.commitment3_title": "开放透明",
      "about.commitment3_desc": "把工具状态、权益价格和服务限制写清楚，接入中的功能如实标注。",
      "about.commitment4_title": "交付负责",
      "about.commitment4_desc": "把输入、处理范围和输出结果说清楚，持续跟进成果交付。",
      "about.contact.eyebrow": "联系我们",
      "about.contact.heading": "联系我们",
      "about.contact.title": "有具体的成果目标，欢迎直接告诉我们",
      "about.contact.lede": "工具接入、项目定制和合作咨询，都可以从一次清楚的需求沟通开始。",
      "about.contact.direct": "直接联系",
      "about.contact.phone": "电话咨询",
      "about.contact.wechat": "微信联系",
      "about.contact.copy": "复制",
      "about.contact.follow": "关注 FigHub 公众号",
      "about.contact.follow_note": "获取最新案例与技术分享",
      "about.contact.qr_alt": "FigHub微信公众号二维码",
      "about.cta.title": "开始使用FigHub",
      "about.cta.lede": "从一个明确的图件目标开始，把调查数据处理成报告可用的成果。",
      "about.cta.button": "浏览工具",
      "auth.login_title": "登录",
      "auth.eyebrow": "FigHub",
      "auth.login_lede": "登录后继续使用工具并查看你的账户信息。",
      "auth.register_title": "免费注册",
      "auth.register_lede": "创建账户后即可购买权益、打开工具并查看订单。",
      "auth.forgot_title": "找回密码",
      "auth.forgot_lede": "输入注册邮箱，我们会发送 6 位验证码用于重置密码。",
      "auth.email_label": "邮箱地址",
      "auth.email_placeholder": "your@email.com",
      "auth.name_label": "用户名（可选）",
      "auth.name_placeholder": "你的用户名",
      "auth.password_label": "密码",
      "auth.password_placeholder": "••••••••",
      "auth.confirm_label": "确认密码",
      "auth.confirm_placeholder": "再次输入密码",
      "auth.remember": "记住我",
      "auth.forgot_link": "忘记密码？",
      "auth.consent_before": "我已阅读并同意",
      "auth.terms_link": "服务条款",
      "auth.consent_and": "和",
      "auth.privacy_link": "隐私政策",
      "auth.submit_register": "注册",
      "auth.submit_login": "登录",
      "auth.submit_forgot": "找回密码",
      "auth.divider": "第三方账号登录",
      "auth.provider_note": "微信 / QQ 登录正在接入；当前请使用邮箱注册和登录。",
      "auth.switch_have": "已有账号？",
      "auth.switch_none": "没有账号？",
      "auth.switch_login": "去登录",
      "auth.switch_register": "去注册",
      "auth.wechat_badge": "微",
      "auth.wechat_label": "微信",
      "auth.wechat_qr_login_alt": "微信扫码登录二维码",
      "auth.wechat_qr_login_note": "使用微信扫描二维码登录。",
      "auth.wechat_qr_register_alt": "FigHub 公众号二维码",
      "auth.wechat_qr_register_note": "扫码关注 FigHub 公众号，关注后按提示进入本站。",
      "auth.qq_badge": "Q",
      "auth.qq_label": "QQ",
      "auth.qq_qr_login_alt": "QQ扫码登录二维码",
      "auth.qq_qr_login_note": "使用手机 QQ 扫码登录。",
      "auth.qq_qr_register_alt": "QQ扫码注册二维码",
      "auth.qq_qr_register_note": "使用手机 QQ 扫码注册。",
      "auth.registering": "正在创建账户...",
      "auth.logging_in": "正在登录...",
      "auth.error_required": "请填写邮箱和密码。",
      "auth.error_email": "请输入有效的邮箱地址。",
      "auth.error_password": "密码至少 8 位。",
      "auth.error_confirm": "两次输入的密码不一致。",
      "auth.error_exists": "该邮箱已注册，请直接登录。",
      "auth.error_register": "注册失败，请稍后重试。",
      "auth.error_credentials": "邮箱或密码不正确。",
      "auth.too_many": "尝试次数过多，请稍后再试。",
      "auth.forgot_unavailable": "邮箱服务暂不可用，请联系支持人员协助重置。",
      "account.default_profile": "外业调查用户",
      "account.nav_overview": "用户中心",
      "account.nav_entitlements": "我的权益",
      "account.nav_orders": "交易记录",
      "account.nav_invoices": "发票管理",
      "account.nav_settings": "个人资料",
      "account.nav_aria": "账户中心导航",
      "account.eyebrow": "用户中心",
      "account.title": "账户中心",
      "account.lede": "在这里管理你的资料、安全、权益、交易与发票。",
      "account.badge": "统一账户",
      "account.continue": "继续选工具",
      "account.panel_lede": "查看账户信息和服务状态。",
      "account.loading": "正在读取账户数据...",
      "account.profile_display_name": "显示名称",
      "account.profile_email": "邮箱地址",
      "account.profile_auth": "认证方式",
      "account.profile_save": "保存资料",
      "account.profile_saved": "资料已保存。",
      "account.profile_saving": "正在保存...",
      "account.profile_need_name": "请填写显示名称。",
      "account.profile_failed": "保存失败，请稍后重试。",
      "account.password_title": "修改密码",
      "account.password_current": "当前密码",
      "account.password_new": "新密码",
      "account.password_confirm": "确认新密码",
      "account.password_placeholder": "至少 8 位",
      "account.password_submit": "更新密码",
      "account.password_saving": "正在更新密码...",
      "account.password_saved": "密码已更新。",
      "account.password_required": "请填写当前密码和新密码。",
      "account.password_short": "新密码至少 8 位。",
      "account.password_mismatch": "两次输入的新密码不一致。",
      "account.password_current_invalid": "当前密码不正确。",
      "account.password_failed": "密码更新失败，请稍后重试。",
      "account.session_expired": "登录状态已失效，请重新登录。",
      "account.email_fallback": "统一账户服务管理",
      "account.email_reading": "读取中...",
      "account.synced": "账户数据已同步。",
      "account.no_orders_hint": "还没有订单，先去查看工具权益。",
      "account.stat_orders": "订单数量",
      "account.stat_entitlements": "可用权益",
      "account.stat_invoices": "发票申请",
      "account.orders_empty": "还没有订单。",
      "account.orders_empty_link": "先去查看工具权益 →",
      "account.orders_table_no": "订单号",
      "account.orders_table_amount": "金额",
      "account.orders_table_status": "状态",
      "account.orders_table_created": "创建时间",
      "account.orders_table_action": "操作",
      "account.order_pay": "继续支付",
      "account.entitlements_empty": "购买工具权益后，会在这里显示可使用的工具和有效期。",
      "account.entitlements_empty_link": "查看可用方案 →",
      "account.entitlements_table_feature": "工具权益",
      "account.entitlements_table_status": "状态",
      "account.entitlements_table_period": "有效期",
      "account.entitlements_table_quota": "剩余次数",
      "account.entitlements_by_count": "按次数",
      "account.entitlements_unlimited": "不限",
      "account.invoices_empty": "还没有发票申请。",
      "account.invoices_table_no": "发票申请",
      "account.invoices_table_order": "订单号",
      "account.invoices_table_amount": "金额",
      "account.invoices_table_status": "状态",
      "account.invoice_form_title": "申请发票",
      "account.invoice_order": "订单",
      "account.invoice_order_placeholder": "请选择已支付订单",
      "account.invoice_type": "发票类型",
      "account.invoice_type_company": "企业",
      "account.invoice_type_personal": "个人",
      "account.invoice_title": "发票抬头",
      "account.invoice_tax_no": "税号（企业发票必填）",
      "account.invoice_email": "接收邮箱",
      "account.invoice_submit": "提交发票申请",
      "account.invoice_submitting": "正在提交...",
      "account.invoice_submitted": "发票申请已提交。",
      "account.invoice_failed": "提交失败，请检查订单和发票信息。",
      "account.error_unauthorized": "登录后才能查看账户信息。",
      "account.error_load": "账户数据暂时无法加载。",
      "toast.order_creating": "订单正在创建，请稍候",
      "toast.order_busy": "订单正在处理，请稍候",
      "toast.order_failed": "订单创建失败，请稍后重试",
      "toast.order_created_pay": "订单 {order} 已创建，请按支付指引完成付款",
      "toast.order_created_no_channel": "订单 {order} 已创建，支付通道尚未配置",
      "toast.order_pay_flow": "订单 {order} 已进入支付流程",
      "toast.pay_no_channel": "支付通道尚未配置，请稍后重试",
      "toast.pay_failed": "支付暂时无法继续，请稍后重试",
      "toast.paid": "支付完成，工具权益已写入账户",
      "toast.tool_preparing": "该工具正在接入，请先联系我们。",
      "toast.tool_no_account": "该工具尚未接入账户服务。",
      "toast.account_not_ready": "账户服务未接入，暂时无法打开工具。",
      "toast.tool_unavailable": "工具入口暂时不可用",
      "toast.dataset_saved": "已加入收藏（演示状态）",
      "toast.dataset_shared": "数据集链接已准备分享",
      "toast.dataset_download": "下载失败，请稍后重试。",
      "toast.contact_copied": "联系方式已复制",
      "toast.request_failed": "请求失败（{status}）",
      "legal.privacy.eyebrow": "隐私政策",
      "legal.privacy.title": "FigHub 隐私政策",
      "legal.privacy.s1": "数据处理",
      "legal.privacy.body1": "我们只在提供工具、账户、订单、发票和权益服务所必需的范围内处理信息。具体文件处理方式以工具详情页说明为准。",
      "legal.privacy.s2": "账户信息",
      "legal.auth_note": "身份认证由统一账户服务完成，前台不会保存你的密码。付费权益只有在服务端确认后才会发放。",
      "legal.terms.eyebrow": "服务条款",
      "legal.terms.title": "FigHub 服务条款",
      "legal.terms.s1": "服务范围",
      "legal.terms.body1": "FigHub提供在线工具、账户和相关服务。不同工具的输入要求、输出结果和有效期以页面及服务端记录为准。",
      "legal.terms.s2": "账户与权益",
      "legal.lede": "以下内容说明我们的服务范围与账户规则，以及信息的收集与保护方式，请在使用前阅读。",
      "admin.title": "运营管理台",
      "admin.login_title": "管理口令登录",
      "admin.login_lede": "管理台使用独立口令，与站点用户账号体系无关。",
      "admin.password_label": "管理口令",
      "admin.login_submit": "进入管理台",
      "admin.login_failed": "口令不正确",
      "admin.loading": "正在加载...",
      "admin.load_failed": "加载失败，请稍后重试",
      "admin.disabled": "管理台未配置口令（PORTAL_ADMIN_PASSWORD），当前不可用。",
      "admin.back_site": "返回站点",
      "admin.logout": "退出管理台",
      "admin.nav_tools": "工具管理",
      "admin.nav_tags": "标签管理",
      "admin.nav_stats": "运营统计",
      "admin.tools_count": "共 {count} 个工具",
      "admin.tools_add": "新增工具",
      "admin.tools_edit_title": "编辑工具",
      "admin.tools_new_title": "新增工具",
      "admin.field_slug": "标识 slug",
      "admin.field_tool_code": "后端工具编码 tool_code",
      "admin.field_route": "后端路由 route",
      "admin.field_name": "名称",
      "admin.field_subtitle": "一句话说明",
      "admin.field_tags": "标签",
      "admin.field_form": "形态",
      "admin.field_billing": "计费",
      "admin.field_sort": "排序",
      "admin.field_flags": "状态",
      "admin.field_available": "上线",
      "admin.field_featured": "首页热门",
      "admin.field_image": "预览图",
      "admin.field_video": "演示视频",
      "admin.field_input": "输入说明",
      "admin.field_output": "输出成果",
      "admin.field_capabilities": "核心能力（| 分隔）",
      "admin.col_tool": "工具",
      "admin.col_tags": "标签",
      "admin.col_form": "形态",
      "admin.col_billing": "计费",
      "admin.col_status": "状态",
      "admin.col_sort": "排序",
      "admin.col_featured": "热门",
      "admin.col_catalog": "后端目录",
      "admin.col_actions": "操作",
      "admin.edit": "编辑",
      "admin.delete": "删除",
      "admin.save": "保存",
      "admin.saving": "正在保存并重建站点内容...",
      "admin.saved": "已保存并重新生成站点内容",
      "admin.save_failed": "保存失败",
      "admin.delete_confirm": "确认删除？删除后会立即重建站点内容。",
      "admin.move_up": "上移",
      "admin.move_down": "下移",
      "admin.changes_title": "最近变更",
      "admin.catalog_registered": "已注册",
      "admin.catalog_missing": "未注册",
      "admin.tags_count": "共 {count} 个标签",
      "admin.tags_add": "新增标签",
      "admin.tags_edit_title": "编辑标签",
      "admin.tags_new_title": "新增标签",
      "admin.tags_key": "标签 key",
      "admin.tags_icon": "图标",
      "admin.tags_name": "名称",
      "admin.tags_description": "说明",
      "admin.stats_empty": "暂无数据",
      "admin.stats_range": "最近 {days} 天",
      "admin.stats_views": "浏览量",
      "admin.stats_visitors": "访客数",
      "admin.stats_registrations": "注册",
      "admin.stats_logins": "登录",
      "admin.stats_orders": "订单",
      "admin.stats_paid": "支付",
      "admin.stats_gmv": "成交金额",
      "admin.stats_invoices": "发票申请",
      "admin.stats_by_day": "每日浏览",
      "admin.stats_top_pages": "热门页面",
      "admin.stats_top_tools": "热门工具",
      "pricing.price_from": "{price} 起",
      "admin.family_help": "帮助中心",
      "admin.family_plans": "价格方案",
      "admin.family_requests": "需求墙",
      "admin.family_datasets": "数据集",
      "admin.family_site": "站点设置",
      "admin.family_labels": "枚举文案",
      "admin.price_plan_missing": "后端未找到该计划",
      "admin.col_key": "key",
      "admin.col_title": "标题",
      "admin.col_href": "跳转",
      "admin.col_name": "名称",
      "admin.col_label": "类别",
      "admin.col_price": "价格（以后端为准）",
      "admin.col_request_type": "类型",
      "admin.col_votes": "票数",
      "admin.col_time": "时间",
      "admin.col_value": "值",
      "admin.col_group": "分组",
      "admin.col_type": "类型",
      "admin.col_access": "访问",
      "admin.dataset_file_rows": "文件行",
      "admin.dataset_field_rows": "字段行",
      "admin.dataset_preview_rows": "预览行",
      "admin.field_key": "key",
      "admin.field_title": "标题",
      "admin.field_copy": "说明",
      "admin.field_href": "跳转地址",
      "admin.field_label": "类别（免费/付费）",
      "admin.field_price": "兜底价格文案",
      "admin.field_price_plan": "后端计划编码",
      "admin.field_note": "适用说明",
      "admin.field_features": "包含内容（| 分隔）",
      "admin.plans_paid_label": "付费",
      "admin.field_request_id": "需求 id",
      "admin.field_request_type": "需求类型",
      "admin.field_status": "需求状态",
      "admin.field_votes": "票数",
      "admin.field_author": "提交人",
      "admin.field_time": "提交日期",
      "admin.field_tool": "关联工具",
      "admin.field_summary": "描述",
      "admin.requests_default_author": "运营录入",
      "admin.field_value": "值",
      "admin.field_group": "分组",
      "admin.rows_count": "共 {count} 条{name}",
      "admin.row_new": "新增{name}",
      "admin.row_edit_title": "编辑{name}",
      "admin.row_new_title": "新增{name}",
      "admin.dataset_files": "数据文件",
      "admin.dataset_add_file": "+ 添加文件",
      "admin.dataset_file_name": "文件名称",
      "admin.dataset_file_meta": "文件说明",
      "admin.dataset_fields": "字段表",
      "admin.dataset_add_field": "+ 添加字段",
      "admin.dataset_field_name": "字段名",
      "admin.dataset_field_desc": "字段说明",
      "admin.dataset_field_type": "字段类型",
      "admin.dataset_preview": "预览数据",
      "admin.dataset_add_preview": "+ 添加预览行",
      "admin.dataset_value1": "第 1 列",
      "admin.dataset_value2": "第 2 列",
      "admin.dataset_value3": "第 3 列",
      "admin.dataset_value4": "第 4 列",
      "admin.sub_remove": "删除该行",
      "admin.dataset_id": "数据集 id",
      "admin.dataset_type": "类型（行政区划/点位数据等）",
      "admin.dataset_icon": "图标",
      "admin.dataset_access": "访问方式",
      "admin.dataset_access_label": "访问标签",
      "admin.dataset_records": "记录数文案",
      "admin.dataset_files_count": "文件数",
      "admin.dataset_formats": "格式",
      "admin.dataset_updated": "更新时间",
      "admin.dataset_description": "一句话说明",
      "admin.dataset_about": "数据集说明",
      "admin.dataset_access_paid": "权益下载",
      "admin.dataset_access_free": "公开示例",
      "admin.dataset_placeholder_hint": "文案中的 外业调查 / FigHub 会在发布时替换为站点设置里的主题词与品牌名",
      "pricing.choose_button": "选择方案",
      "pricing.recommended": "推荐",
      "pricing.free_use": "免费使用",
      "pricing.custom_button": "联系定制",
      "pricing.plan_pending": "服务接入中",
      "pricing.confirm_title": "确认购买权益",
      "pricing.confirm_lede": "确认工具与方案后进入支付，支付成功权益写入账户。",
      "pricing.confirm_tool": "工具",
      "pricing.confirm_plan": "方案",
      "pricing.confirm_amount": "金额",
      "pricing.confirm_dev_note": "当前是开发支付通道，仅演示流程，不会真实扣款。",
      "pricing.confirm_submit": "去支付",
      "pricing.mode_site_title": "按场地计价",
      "pricing.mode_site_desc": "固定成果工具：一次购买对应一个场地的一份成果。适合偶尔做项目、用一个买一个。",
      "pricing.mode_free_title": "通用工具免费",
      "pricing.mode_free_desc": "坐标处理、格式转换、成果查看、图件排版，注册即可用。适合所有用户的日常处理。",
      "pricing.mode_custom_title": "定制服务",
      "pricing.mode_custom_desc": "整项目交付与特殊成果，按项目单独报价。适合整包外协或特殊成果。",
      "pricing.group_site": "按场地计价",
      "pricing.group_free": "免费工具",
      "pricing.group_custom": "定制服务",
      "pricing.per_site": "/ 场地",
      "pricing.trial_button": "免费体验",
      "pricing.first_price_tag": "首发价",
      "pricing.rules_title": "计费规则",
      "pricing.rule1": "按场地计价：一次购买对应一个场地的一份成果。",
      "pricing.rule2": "通用工具永久免费：坐标处理、格式转换、成果查看、图件排版。",
      "pricing.rule3": "收费工具都可以先用网站自带样例数据免费体验，不需要上传自己的数据。",
      "pricing.rule4": "更换场地或更换数据需要重新购买；同一场地在复算窗口内（普通 7 天 / VIP 30 天）重复出成果不再收费。",
      "pricing.rule5": "支持开具发票；成果不达交付要求可以联系我们重做。",
      "admin.family_products": "计费产品",
      "admin.family_billing_plans": "计费方案",
      "admin.col_product": "所属产品",
      "admin.field_description": "产品说明",
      "admin.field_price_cents": "价格（分）",
      "admin.field_list_price_cents": "划线价（分，0 表示不展示）",
      "admin.field_feature_codes": "功能码（| 分隔）",
      "admin.field_quota_total": "包含次数（空 = 不限）",
      "admin.field_duration_days": "有效天数（空 = 按次）",
      "admin.field_max_file": "单文件上限（MB）",
      "admin.field_max_runtime": "单次运行上限（秒）",
      "admin.field_concurrency": "并发数",
      "admin.field_export_enabled": "允许导出成果",
      "admin.field_activation_required": "首次上传激活",
      "admin.enabled_on": "启用中",
      "admin.enabled_off": "已停用",
      "admin.plan_default_name": "单次使用",
      "admin.family_sites": "场地台账",
      "admin.sites_count": "共 {count} 个场地",
      "admin.site_col_site": "场地",
      "admin.site_col_user": "用户",
      "admin.site_col_window": "复算窗口",
      "admin.window_none": "已过期",
      "admin.runs_title": "最近运行",
      "admin.site_col_decision": "判定",
      "admin.site_col_reason": "原因",
      "admin.decision_covered": "放行",
      "admin.decision_purchase": "需购买",
      "admin.col_runs": "运行次数",
      "pricing.membership_eyebrow": "VIP",
      "pricing.member_active": "已开通",
      "pricing.member_benefit1": "全线工具 8 折",
      "pricing.member_benefit2": "每年 3 次高价值工具额度",
      "pricing.member_benefit3": "场地复算窗口延长到 30 天",
      "pricing.member_price_tag": "VIP价",
      "pricing.redeem_button": "用 VIP 额度兑换（剩余 {count} 次）",
      "pricing.redeem_done": "已用 VIP 额度兑换，权益已写入账户",
      "pricing.share_title": "分享赚次数",
      "pricing.share_lede": "生成分享卡立得 1 次免费额度；好友通过链接注册后，你再得 1 次正式额度。",
      "pricing.share_lifetime": "每人每天 1 次、累计 3 次；额度可用于单次价值 ≤ ¥169 的工具方案。",
      "pricing.share_button": "生成分享卡",
      "pricing.share_granted": "已获得 {count} 次免费额度（当前剩余 {balance} 次）",
      "pricing.share_limited": "今天已领过，明天再来",
      "pricing.share_copy": "复制链接",
      "pricing.trial_note": "（样例数据）",
      "pricing.plans_eyebrow": "价格方案",
      "pricing.plans_title": "怎么收费",
      "pricing.plans_lede": "固定成果才收费，其余免费。",
      "pricing.jump_to_tools": "直接看工具价格 ↓",
      "pricing.triage_title": "哪种方式适合你？",
      "pricing.triage_lede": "三条路，选一条直接看。",
      "pricing.triage_occasional_title": "偶尔做项目",
      "pricing.triage_occasional_desc": "用一个买一个，直接看工具价格。",
      "pricing.triage_regular_title": "经常做项目",
      "pricing.triage_regular_desc": "先看 VIP 对照，判断值不值。",
      "pricing.triage_try_title": "还没决定",
      "pricing.triage_try_desc": "先用样例数据免费体验试试。",
      "pricing.pro_eyebrow": "VIP",
      "pricing.pro_title": "经常做项目，VIP 更省",
      "pricing.pro_lede": "同一份权益，VIP 价更低、复算窗口更长。",
      "pricing.pro_suitable": "适合：一年要用 5 次以上工具的人。",
      "pricing.pro_saving": "一年用 5 次（均价约 ¥70）约 ¥350；VIP ¥299 且含 3 次额度，用得多更省。",
      "pricing.pro_col_item": "对比项",
      "pricing.pro_col_payg": "按需购买",
      "pricing.pro_col_pro": "VIP会员",
      "pricing.pro_row_price": "单次价格",
      "pricing.pro_price_payg": "¥19–99 / 场地",
      "pricing.pro_price_pro": "8 折（再叠加额度）",
      "pricing.pro_row_window": "场地复算窗口",
      "pricing.pro_window_payg": "7 天",
      "pricing.pro_window_pro": "30 天",
      "pricing.pro_row_credits": "赠送额度",
      "pricing.pro_credits_payg": "无",
      "pricing.pro_credits_pro": "每年 3 次",
      "pricing.pro_row_invoice": "发票与报销",
      "pricing.pro_invoice_payg": "支持",
      "pricing.pro_invoice_pro": "支持",
      "pricing.pro_row_custom": "定制服务",
      "pricing.pro_custom_payg": "按项目报价",
      "pricing.pro_custom_pro": "95 折",
      "pricing.share_eyebrow": "分享",
      "pricing.share_steps_title": "邀请同事，双方得额度",
      "pricing.share_step1_title": "生成分享卡",
      "pricing.share_step1_desc": "一键生成你的专属链接。",
      "pricing.share_step2_title": "发给同事或群",
      "pricing.share_step2_desc": "链接可直接发微信、群聊。",
      "pricing.share_step3_title": "好友注册到账",
      "pricing.share_step3_desc": "你的正式额度 +1，好友也得 1 次。",
      "pricing.faq_eyebrow": "规则",
      "pricing.faq_title": "关于计费的常见问题",
      "pricing.faq1_q": "买一次能用几次？",
      "pricing.faq1_a": "一次购买对应一个场地的一份成果；同一场地在 7 天内（VIP 会员 30 天）反复调整不再收费。",
      "pricing.faq2_q": "换数据或换场地要再买吗？",
      "pricing.faq2_a": "要。换场地或换一套数据视为新的成果，需要重新购买。",
      "pricing.faq3_q": "能开发票吗？",
      "pricing.faq3_a": "支持。登录后在用户中心提交发票申请。",
      "pricing.faq4_q": "成果不达交付要求怎么办？",
      "pricing.faq4_a": "联系我们，协助重做一次。",
      "pricing.faq5_q": "通用工具为什么免费？",
      "pricing.faq5_a": "坐标处理、格式转换、成果查看、图件排版属于通用能力，注册即可用；只有固定数据输入、固定专题输出的工具收费。",
      "pricing.share_give": "生成分享卡立得免费额度；好友注册后你再得一次分享奖励，好友也得 1 次新人额度；VIP 奖励双倍。",
      "pricing.mode_line": "通用工具免费 · 固定成果工具按场地计价 {price} 起 · 整项目定制报价",
      "pricing.compare_payg_title": "按需购买",
      "pricing.compare_payg_desc": "用一个买一个，用到哪买到哪。",
      "pricing.compare_payg_action": "看工具价格",
      "pricing.compare_pro_badge": "更省",
      "pricing.compare_pro_price": "¥299 / 年（划线 ¥399，折合每天不到 ¥1）",
      "pricing.compare_pro_action": "开通 VIP",
      "pricing.compare_none": "—",
      "pricing.compare_footnote": "发票与报销两边都支持；一年用 5 次（均价约 ¥70）约 ¥350，VIP ¥299 且含 3 次额度。",
      "pricing.faq_more": "更多问题 → 帮助中心",
      "pricing.compare_pro_title": "VIP会员",
      "pricing.mode_free_line": "免费，注册即用",
      "pricing.mode_site_line": "固定成果工具按场地计价",
      "pricing.mode_custom_line_title": "按项目报价",
      "pricing.mode_custom_line": "整项目定制服务",
      "pricing.compare_title": "三种使用方式",
      "pricing.compare_lede": "注册就是会员，工具按需购买；经常做项目，开通 VIP 更省。",
      "pricing.compare_col_share": "分享卡（免费使用）",
      "pricing.compare_col_payg": "按需使用",
      "pricing.compare_row_cost": "费用",
      "pricing.compare_row_free": "免费工具",
      "pricing.compare_row_paid": "付费工具",
      "pricing.compare_row_custom": "定制项目",
      "pricing.compare_row_suitable": "适合谁",
      "pricing.compare_free_use": "直接用",
      "pricing.compare_cost_share": "0 元",
      "pricing.compare_paid_share": "额度 0 元兑换 ≤¥169 方案",
      "pricing.compare_paid_payg": "单次购买，含 1 份成果",
      "pricing.compare_paid_pro": "8 折 + 每年 3 次额度",
      "pricing.compare_suitable_share": "还没决定，想先看成果",
      "pricing.compare_suitable_payg": "偶尔做项目",
      "pricing.compare_suitable_pro": "经常做项目",
      "pricing.faq_link": "关于计费的常见问题 → 帮助中心",
      "admin.help_default_group": "使用与工具",
      "pricing.site_note": "「场地」指一个调查项目地块，对应一份可交付成果；换场地或换一套数据需重新购买。",
      "pricing.compare_col_member": "会员（注册即得）",
      "pricing.per_year": "/ 年",
      "pricing.compare_member_action": "免费注册",
      "pricing.compare_row_tool_price": "工具价格",
      "pricing.compare_price_original": "（原价）",
      "pricing.compare_tool_price_vip": "全线工具 8 折",
      "pricing.compare_row_member_fee": "会员年费",
      "pricing.compare_member_fee_member": "0 元（注册即得）",
      "pricing.compare_row_share": "分享赚次数",
      "pricing.compare_share_member": "生成分享卡得额度，0 元兑换 ≤¥169 方案（每天 1 次、累计 3 次）",
      "pricing.compare_share_vip": "双倍奖励：生成分享卡得 2 次，邀请好友再得 2 次",
      "pricing.compare_credits_vip": "每年 3 次，0 元兑换 ≤¥169 方案",
      "pricing.share_go": "去赚次数 →",
      "pricing.share_login": "登录后分享赚次数",
      "pricing.share_vip_badge": "VIP 双倍",
      "pricing.member_card_amount_free": "¥0",
      "pricing.member_card_unit_free": "永久免费",
      "pricing.member_card_note": "折合每天不到 ¥1",
      "requests.status_need_login": "请先登录后再提交需求",
      "pricing.share_redeem_button": "用分享额度兑换（剩余 {count} 次）",
      "pricing.share_redeem_done": "已用分享额度兑换，权益已写入账户",
      "account.vip_title": "VIP会员",
      "account.vip_active": "有效期至 {date}",
      "account.vip_inactive": "尚未开通",
      "account.vip_discount": "全线工具 8 折",
      "account.vip_credits": "年度额度剩余 {count} 次",
      "account.vip_action_open": "去开通",
      "account.vip_action_renew": "去续费",
      "account.share_title": "分享额度",
      "account.share_balance": "可用 {count} 次",
      "account.share_empty": "还没有分享额度，去分享赚次数",
      "account.share_source_share_card": "生成分享卡",
      "account.share_source_invite": "好友注册",
      "account.share_source_welcome": "新人奖励",
      "auth.forgot_code_label": "邮箱验证码",
      "auth.forgot_code_placeholder": "6 位数字验证码",
      "auth.forgot_new_password": "新密码",
      "auth.forgot_sent": "验证码已发送，请查收邮箱（含垃圾箱）",
      "auth.forgot_reset": "重置密码",
      "auth.forgot_back": "返回登录",
      "auth.forgot_resend": "重新发送验证码",
      "auth.forgot_done": "密码已重置，请用新密码登录",
      "auth.verify_mail_sent": "验证邮件已发送，请查收邮箱（含垃圾箱）",
      "account.verify_title": "邮箱未验证",
      "account.verify_lede": "完成验证后可用于找回密码；验证码 15 分钟内有效。",
      "account.verify_placeholder": "输入 6 位验证码",
      "account.verify_submit": "验证",
      "account.verify_send": "发送验证邮件",
      "account.verify_sent": "验证邮件已发送，请查收（含垃圾箱）",
      "account.verify_done": "邮箱已验证",
      "account.verify_failed": "验证码无效或已过期",
      "verify.title": "验证邮箱",
      "verify.lede": "请输入我们发送到你邮箱的 6 位验证码，15 分钟内有效。",
      "verify.code_label": "邮箱验证码",
      "verify.code_placeholder": "6 位数字验证码",
      "verify.submit": "完成验证",
      "verify.resend": "重新发送验证码",
      "verify.sent": "验证码已发送，请查收（含垃圾箱）",
      "verify.done": "邮箱已验证",
      "verify.failed": "验证码无效或已过期",
      "verify.skip": "暂不验证，先逛逛 →",
      "verify.bar": "你的邮箱尚未验证，收据与通知可能无法送达。",
      "verify.bar_link": "去验证",
      "verify.login_required": "请先登录后再验证邮箱",
      "verify.order_blocked": "请先完成邮箱验证，再继续付款",
      "verify.unavailable": "邮箱服务暂不可用，请稍后再试",
      "account.deactivate_title": "账号注销",
      "account.deactivate_lede": "注销会彻底删除账号、个人资料与微信绑定，删除后不可恢复；订单、发票等记录依法保留。",
      "account.deactivate_button": "注销账号",
      "account.deactivate_confirm_lede": "此操作不可恢复：账号、个人资料、微信绑定与自定义头像都会被彻底删除，未使用的权益与额度作废。请输入「注销」，并按提示输入当前密码。",
      "account.deactivate_password": "当前密码",
      "account.deactivate_submit": "确认注销",
      "account.deactivate_done": "账号已注销",
      "account.deactivate_failed": "注销失败，请检查密码",
      "requests.vote_login": "请先登录后再投票",
      "detail.purchase_required": "购买后使用",
      "admin.sites_empty": "暂无场地记录",
      "admin.runs_empty": "暂无运行记录",
      "toast.dataset_paid": "付费数据集请联系我们获取授权。",
      "auth.error_deactivated": "该邮箱账号已注销，可直接用此邮箱重新注册恢复。",
      "admin.nav_users": "用户",
      "admin.nav_orders": "订单",
      "admin.nav_invoices": "发票",
      "admin.users_count": "共 {count} 个账号",
      "admin.users_empty": "暂无账号",
      "admin.account_active": "正常",
      "admin.account_disabled": "已注销",
      "admin.verified_yes": "已验证",
      "admin.verified_no": "未验证",
      "admin.col_email": "邮箱",
      "admin.col_display_name": "显示名称",
      "admin.col_email_verified": "邮箱验证",
      "admin.col_order_no": "订单号",
      "admin.col_user": "用户",
      "admin.col_amount": "金额",
      "admin.orders_count": "共 {count} 笔订单",
      "admin.orders_empty": "暂无订单",
      "admin.invoices_count": "共 {count} 张发票申请",
      "admin.invoices_empty": "暂无发票申请",
      "admin.invoice_col_title": "抬头",
      "admin.invoice_col_no": "发票号 / 下载链接",
      "admin.invoice_col_actions": "操作",
      "admin.invoice_no_placeholder": "发票号码",
      "admin.invoice_url_placeholder": "下载链接（开票必填）",
      "admin.invoice_review": "受理",
      "admin.invoice_issue": "开票",
      "admin.invoice_reject": "驳回",
      "admin.invoice_updated": "发票状态已更新",
      "admin.invoice_failed": "发票操作失败",
      "auth.captcha_note": "连续登录失败，请先完成安全验证。",
      "auth.captcha_help": "用于确认是本人操作；验证通过后即可继续登录。",
      "auth.captcha_placeholder": "计算结果",
      "auth.provider_soon": "即将开放",
      "auth.wechat_error": "微信登录失败，请重试或使用邮箱登录。",
      "auth.wechat_forgot": "该账号使用微信登录，请直接用微信扫码登录。",
      "account.wechat_account": "微信账号（已绑定）",
      "detail.gallery_title": "样例成果",
      "detail.sample_title": "样例数据",
      "detail.video_empty": "演示视频制作中，先看下方样例成果",
      "admin.field_gallery": "样例成果图（逗号分隔文件名）",
      "admin.field_sample_files": "样例数据（名称|路径|说明，分号分隔）",
      "purchase.pay": "立即支付",
      "purchase.price_link": "查看价格说明",
      "purchase.success_title": "支付成功，权益已开通",
      "purchase.success_lede": "已为你打开工具；若浏览器拦截了弹窗，点下方「打开工具」即可，订单可在「我的账户」查看。",
      "purchase.open_tool": "打开工具",
      "purchase.view_orders": "查看订单",
      "purchase.redeem_success_title": "兑换成功，权益已开通",
      "purchase.topup_button": "额度抵扣 {credit}，补差 {amount}",
      "auth.wechat_qr_title": "微信扫码登录",
      "auth.wechat_qr_lede": "请用微信「扫一扫」扫描二维码，并在手机上确认登录。",
      "auth.wechat_qr_waiting": "正在生成二维码…",
      "auth.wechat_qr_scanning": "等待扫码…",
      "auth.wechat_qr_confirm": "已扫码，请在手机上确认",
      "auth.wechat_qr_success": "登录成功，正在进入…",
      "auth.wechat_qr_expired": "二维码已过期，点击刷新",
      "auth.wechat_qr_refresh": "刷新二维码",
      "pay.qr_title": "微信扫码支付",
      "pay.qr_lede": "请用微信「扫一扫」完成支付，支付成功后权益自动到账。",
      "pay.qr_amount": "应付金额",
      "pay.qr_waiting": "等待支付…",
      "pay.qr_paid": "支付成功，权益已到账",
      "pay.qr_expired": "二维码已过期，请重新获取。",
      "pay.qr_refresh": "重新获取二维码",
      "pay.qr_keep_open": "支付完成前请保持本页面打开。",
      "pay.jsapi_launching": "正在唤起微信支付…",
      "pay.jsapi_failed": "未能唤起微信支付，请重试或改用扫码支付。",
      "account.wechat_bind_bound": "已绑定",
      "account.wechat_bind_button": "绑定微信",
      "account.wechat_bind_lede": "绑定微信后可直接扫码登录，无需输入密码。",
      "account.wechat_bind_note": "已绑定微信，可用手机微信扫码登录；如需更换请先联系客服解绑。",
      "account.wechat_bind_success": "微信绑定成功",
      "account.wechat_bind_title": "微信绑定",
      "auth.wechat_follow_lede": "关注后接收出图完成与权益到账通知；注册后在「账户 → 设置」绑定微信，即可扫码登录。",
      "auth.wechat_follow_title": "关注 FigHub 服务号",
      "auth.wechat_unbound_badge": "未绑定",
      "auth.wechat_unbound_bind": "去绑定微信",
      "auth.wechat_unbound_lede": "请先在电脑上用邮箱注册或登录，再到「账户 → 设置」里绑定微信；绑定后即可用微信扫码登录。",
      "auth.wechat_unbound_register": "去注册",
      "auth.wechat_unbound_title": "该微信还没有绑定账号",
      "account.wechat_bind_taken": "该微信已绑定其它 FigHub 账号，请改用原账号扫码登录；如需更换绑定请联系客服。",
      "account.email_bind_code_placeholder": "邮箱验证码",
      "account.email_bind_lede": "补全邮箱后才能下单与开票，也可用于登录与找回密码。",
      "account.email_bind_placeholder": "你的常用邮箱",
      "account.email_bind_send": "发送验证码",
      "account.email_bind_sent": "验证码已发送，请查收邮件",
      "account.email_bind_submit": "确认绑定",
      "account.email_bind_success": "邮箱绑定成功",
      "account.email_bind_title": "补全邮箱",
      "auth.wechat_register_failed": "自动注册没有完成，请点击重试。",
      "auth.wechat_register_lede": "请用微信「扫一扫」；未关注会先引导关注服务号，关注后自动为你创建账号。",
      "auth.wechat_register_retry": "重试注册",
      "auth.wechat_register_success": "注册成功，正在进入…",
      "auth.wechat_register_title": "微信扫码注册",
      "auth.wechat_register_waiting": "等待扫码关注…",
      "toast.wechat_register_needs_email": "账号已创建，请补全邮箱后再下单或开票",
      "auth.wechat_register_scanned": "已扫码，正在为你创建账号…",
      "account.deactivate_consequences": "注销后账号与个人资料立即彻底删除且不可恢复；订单、发票等法定记录依法保留；未使用的权益与额度作废。用同一邮箱重新注册会得到一个全新账号，历史记录不会恢复。",
      "account.deactivate_type_word": "请输入「注销」以确认",
      "account.password_setup_code": "邮箱验证码",
      "account.password_setup_lede": "当前账号还没有密码。设置后可用邮箱 + 密码登录，也便于解绑微信与注销账号。",
      "account.password_setup_need_email": "请先补全邮箱，再设置密码",
      "account.password_setup_new": "新密码（至少 8 位）",
      "account.password_setup_send": "发送验证码",
      "account.password_setup_submit": "设置密码",
      "account.password_setup_success": "密码设置成功",
      "account.password_setup_title": "设置密码",
      "account.wechat_unbind_button": "解绑微信",
      "account.wechat_unbind_confirm": "解绑后将无法用微信扫码登录（可随时重新绑定）。确定解绑？",
      "account.wechat_unbind_guard": "请先设置密码，解绑后仍可用邮箱登录",
      "account.wechat_unbind_success": "已解绑微信",
      "toast.wechat_register_existing": "该微信已注册，已为你登录",
      "account.email_bind_sending": "正在校验验证码…",
      "auth.code_invalid": "验证码错误或已过期",
      "auth.code_login_link": "用邮箱验证码登录",
      "auth.code_placeholder": "请输入验证码",
      "auth.code_send": "获取验证码",
      "auth.code_sent": "验证码已发送，请查收邮件",
      "auth.code_submit": "登录",
      "auth.consent_lead": "阅读并接受",
      "auth.consent_register_lead": "阅读并接受",
      "auth.done_code": "请输入验证码",
      "auth.done_lede": "账号已创建。补全邮箱后可用于找回密码、接收订单与发票通知。",
      "auth.done_send": "获取验证码",
      "auth.done_skip": "暂不绑定",
      "auth.done_submit": "确认绑定",
      "auth.done_title": "注册成功！",
      "auth.password_login_link": "用密码登录",
      "auth.tab_email_login": "邮箱登录",
      "auth.tab_email_register": "邮箱注册",
      "auth.tab_wechat_login": "微信扫码登录",
      "auth.tab_wechat_register": "微信扫码注册",
      "auth.tabs_aria": "登录方式",
      "auth.wechat_oauth_button": "在微信中一键登录",
      "auth.wechat_oauth_note": "将使用当前微信授权登录 FigHub",
      "auth.wechat_register_lede_wechat": "长按识别二维码关注服务号，即可完成注册",
      "menu.account": "账户中心",
      "menu.aria": "账号菜单",
      "menu.invoices": "发票管理",
      "menu.logout": "退出登录",
      "menu.open": "打开账号菜单",
      "menu.orders": "交易记录",
      "menu.profile": "个人主页",
      "menu.settings": "账号设置",
      "menu.support": "在线客服",
      "menu.support_hint": "扫码咨询",
      "menu.support_qr_alt": "客服二维码",
      "profile.badge_email": "邮箱已验证",
      "profile.badge_wechat": "微信已绑定",
      "profile.edit": "编辑资料",
      "profile.joined": "加入时间",
      "profile.loading": "正在加载…",
      "profile.not_found": "该用户不存在或已注销",
      "profile.section_about": "关于",
      "profile.section_about_body": "这里是 TA 在 FigHub 的公开主页，仅展示昵称、加入时间与徽章；邮箱、订单与发票信息不会公开。",
      "auth.bind_lede": "为保证您的相关权益，请绑定邮箱",
      "auth.bind_submit": "确认绑定",
      "auth.bind_title": "你已经注册成功！",
      "auth.exchange_to_email": "邮箱登录",
      "auth.exchange_to_email_register": "邮箱注册",
      "auth.exchange_to_wechat": "微信扫码登录",
      "auth.exchange_to_wechat_register": "微信扫码注册",
      "auth.last_login": "上次登录：{account}",
      "auth.last_login_switch": "切换账号",
      "auth.login_existing": "登录已有账号",
      "auth.new_user_register": "新用户账号注册",
      "auth.other_account": "账号登录",
      "auth.other_code": "验证码登录",
      "auth.other_email_register": "邮箱注册",
      "auth.other_title": "其他方式登录",
      "auth.other_wechat_login": "微信扫码登录",
      "auth.other_wechat_register": "微信扫码注册",
      "auth.qr_expired_overlay": "二维码已过期，点击刷新",
      "auth.support": "在线客服",
      "auth.support_hint": "扫码咨询",
      "auth.tab_account": "账号登录",
      "auth.tab_code": "验证码登录",
      "auth.wechat_qr_notice": "打开微信「扫一扫」，在手机上确认登录",
      "auth.wechat_register_notice": "微信扫码关注公众号完成登录",
      "menu.tools": "我的工具",
      "menu.tutorial": "入门教程",
      "auth.welcome": "欢迎使用FigHub",
      "auth.remember_30d": "30天内免登录",
      "account.deactivate_word": "注销",
      "account.deactivate_word_mismatch": "请输入「注销」以确认",
      "account.deactivate_word_placeholder": "请输入「注销」",
      "account.refund_apply": "申请退费",
      "account.refund_cancel": "撤回申请",
      "account.refund_canceled": "已撤回退费申请",
      "account.refund_done": "退费申请已提交，请等待审核",
      "account.refund_failed": "操作失败，请稍后重试",
      "account.refund_policy": "提交后由客服审核，审核通过后原路退回微信支付账户，通常 1–3 个工作日到账；已开具的发票需先作废。",
      "account.refund_reason": "退费原因",
      "account.refund_reason_placeholder": "请说明退费原因（至少 5 个字）",
      "account.refund_reason_short": "请填写至少 5 个字的退费原因",
      "account.refund_sending": "正在提交…",
      "account.refund_status_approved": "退费处理中",
      "account.refund_status_canceled": "已撤回",
      "account.refund_status_refunded": "已退费",
      "account.refund_status_rejected": "退费被驳回",
      "account.refund_status_requested": "退费审核中",
      "account.refund_submit": "提交申请",
      "account.refund_title": "申请退费",
      "admin.nav_refunds": "退费管理",
      "admin.refund_approve": "通过",
      "admin.refund_col_note": "处理备注",
      "admin.refund_col_reason": "退费原因",
      "admin.refund_done": "标记已退费",
      "admin.refund_failed": "退费处理失败",
      "admin.refund_note_placeholder": "备注（可选）",
      "admin.refund_reject": "驳回",
      "admin.refund_updated": "退费状态已更新",
      "admin.refunds_count": "共 {count} 条退费申请",
      "admin.refunds_empty": "暂无退费申请",
      "auth.login_title_email": "邮箱登录",
      "auth.login_title_wechat": "微信登录",
      "account.chip_email_unverified": "邮箱未验证",
      "account.chip_email_verified": "邮箱已验证",
      "account.chip_loading": "读取账号状态…",
      "account.chip_wechat": "微信账号",
      "account.entitlements_lede": "已购买的工具权益、有效期与剩余次数。",
      "account.invoices_lede": "已提交的发票申请，以及为已支付订单开票。",
      "account.nav_profile": "个人资料",
      "account.nav_security": "账号安全",
      "account.orders_lede": "每一笔订单的支付状态与退费进度。",
      "account.password_change_action": "修改密码",
      "account.password_lede": "密码用于邮箱登录；用微信扫码注册的账号建议补一个密码。",
      "account.password_setup_action": "设置密码",
      "account.profile_lede": "修改昵称，查看账号绑定的邮箱与登录方式。",
      "account.security_lede": "邮箱、微信与密码的绑定状态，以及注销账号。",
      "account.display_name_lede": "显示在订单、发票与导出文件里的名字。",
      "account.email_row_lede": "用于登录、找回密码与接收发票。",
      "account.nav_group_account": "资料与安全",
      "account.nav_group_assets": "资产与记录",
      "account.state_bound": "已绑定",
      "account.state_set": "已设置",
      "account.state_unbound": "未绑定",
      "account.state_unset": "未设置",
      "account.state_unverified": "未验证",
      "account.state_verified": "已验证",
      "account.email_row_title": "邮箱",
      "account.password_row_title": "登录密码",
      "account.wechat_row_title": "微信",
      "account.check_action": "去处理 →",
      "account.check_lede": "三项绑定状态，逐项确认。",
      "account.check_title": "账号安全",
      "account.hero_entitlements": "查看权益",
      "account.nav_overview_short": "总览",
      "account.overview_lede": "账号状态、权益与最近交易一屏看完。",
      "account.stats_action": "看交易记录 →",
      "account.stats_lede": "订单、权益与发票的实时数量。",
      "account.stats_title": "资产与记录",
      "account.chip_password_set": "密码已设置",
      "account.chip_password_unset": "密码未设置",
      "account.chip_wechat_bound": "微信已绑定",
      "account.chip_wechat_unbound": "微信未绑定",
      "account.chip_jump_hint": "点击前往对应设置",
      "account.email_action": "管理邮箱",
      "account.email_manage_link": "去账号安全里管理",
      "account.password_action": "修改密码",
      "account.security_group_danger": "账号处置",
      "account.security_group_login": "登录与绑定",
      "account.security_group_login_lede": "邮箱、微信与密码，逐项确认状态。",
      "account.recent_all": "全部交易记录 →",
      "account.recent_empty": "还没有订单。",
      "account.recent_empty_link": "去看工具与价格 →",
      "account.recent_title": "最近动态",
      "account.avatar_change": "更换头像",
      "account.avatar_done": "头像已更新",
      "account.avatar_failed": "上传失败，请重试",
      "account.avatar_hint": "PNG / JPG，不超过 2MB",
      "account.avatar_title": "头像",
      "account.avatar_uploading": "正在上传…",
      "account.password_hint": "用于邮箱登录与找回密码",
      "account.profile_avatar_section": "头像与昵称",
      "account.profile_info_section": "账号信息",
      "account.info_login_email": "邮箱密码",
      "account.info_login_way": "登录方式",
      "account.info_login_wechat": "微信扫码",
      "legal.privacy.body": "## 一、引言\n本政策由北京屹云科技有限公司（以下简称“我们”）制定，适用于 FigHub 在线工具平台（fighub.bjyiyunkeji.online）。\n我们重视您的个人信息与数据安全。本政策说明我们收集哪些信息、如何使用与保护这些信息，以及您享有哪些权利。\n\n## 二、我们收集哪些信息\n账户信息：您注册时提供的邮箱、昵称、密码（以不可逆方式加密保存）、微信授权的唯一标识与微信昵称、头像，以及邮箱与微信的绑定状态。\n登录与安全信息：登录时间、登录方式、IP 地址、浏览器与设备标识、验证码的发送与校验记录。\n订单与开票信息：订单号、产品与方案、金额与支付状态、退费记录、发票抬头与税号、接收发票的邮箱。\n使用信息：您使用的工具、使用次数与时间等任务元数据（文件名、大小、时间），成果导出编号，分享卡与邀请记录，需求墙提交内容。\n我们不保存您上传的原始数据内容与处理（结算）结果；为完成权益核算与同一场地判别，仅保留地块范围（四至）等特征信息与上述任务元数据。\n访问统计：页面路径、访问时间与匿名访客标识（由浏览器生成的随机标识，不含姓名、邮箱等信息）。\n您主动联系我们时提供的信息，例如客服沟通内容与邮件正文。\n我们不会收集与服务无关的信息，也不会读取您设备中的其他文件。\n\n## 三、我们如何使用信息\n用于提供与维护服务，包括运行工具、保存成果、管理账户与权益。\n用于账号安全，包括登录校验、找回密码、异常识别与风控。\n用于订单、支付、退费与发票处理。\n用于发送服务通知，例如验证码、订单与权益提醒。\n用于数据统计与产品改进，以及遵守法律法规、配合监管要求。\n我们不会将您的数据用于广告投放，也不会将其出售给第三方。\n\n## 四、Cookie 与本地存储\n我们使用必要的 Cookie 与浏览器本地存储维持登录状态和界面偏好，包括：登录会话 Cookie；免登录 Cookie（勾选“30 天内免登录”时写入，最长 30 天）；主题、昵称等界面偏好；用于统计的匿名访客标识。\n您可以通过浏览器清除上述数据，清除后需要重新登录。\n我们不使用第三方广告或跨站跟踪 Cookie。\n\n## 五、信息的共享与委托处理\n为提供服务，我们会在必要范围内与以下合作方共享或委托处理信息：微信（扫码登录、服务号消息）、微信支付（支付与退款）、邮件服务商（发送验证码与服务通知）、云服务器与网络服务商（存储与运行）。\n除以下情形外，我们不会向其他第三方提供您的个人信息：取得您的明确同意；法律法规要求或司法、行政机关依法要求；为保护您或他人的生命、财产安全所必需。\n\n## 六、数据存储与保存期限\n我们在中国境内的服务器上存储您的信息。\n账户信息保存至您注销账户；注销会彻底删除账号、个人资料与微信绑定，删除后不可恢复，同一邮箱重新注册会得到一个全新账号，历史记录不会回来。\n订单、发票等记录依法保留（不少于法定与税务要求的期限），仅用于对账、退费、开票与合规目的。\n登录验证码一次性短时有效；访问日志保存 6 个月，访问统计类数据保存 12 个月。\n\n## 七、数据安全\n我们采取 HTTPS 传输、密码不可逆加密存储、访问权限最小化、数据库与发布备份、操作审计与安全巡检等措施保护数据。\n互联网环境不存在绝对安全，请妥善保管账户信息与验证码；如发生安全事件，我们将依法告知并采取措施。\n\n## 八、您的权利\n您可以在账户中心查询与更正个人信息，包括昵称、头像、邮箱、密码与绑定关系，也可以随时注销账户。\n如需复制、导出或删除个人信息，或撤回授权，请通过第十条的方式联系我们，我们会在 15 个工作日内答复。\n注销是彻底删除且不可恢复：账号、个人资料、微信绑定与自定义头像都会一并删除，重新注册不会恢复历史记录。\n\n## 九、未成年人保护\n本平台面向专业人员，不面向不满 18 周岁的未成年人提供服务。如您未满 18 周岁，请在监护人陪同下使用，并由监护人同意本政策。\n\n## 十、联系我们\n如对本政策有疑问、投诉，或需要行使上述权利，请联系：北京屹云科技有限公司；企业邮箱 support@bjyiyunkeji.online；企业微信 paomo720。京ICP备2025155788号。\n\n## 十一、政策更新\n本政策更新时，我们会在本页面公布，必要时通过站内提示或您预留的邮箱通知您；继续使用服务即视为接受更新后的政策。\n\n本隐私政策更新日期：2026 年 10 月 11 日。",
      "legal.terms.body": "## 一、协议主体与适用范围\n本服务条款是您与北京屹云科技有限公司（以下简称“我们”）之间，就访问和使用 FigHub 在线工具平台（网址：fighub.bjyiyunkeji.online，以下简称“本平台”）所达成的协议。\n您注册、登录、扫码关注或以其他方式使用本平台，即表示您已阅读并同意本条款；如您不同意其中任何内容，请停止使用本平台。\n如您代表机构使用本平台，您确认已获得该机构授权，并由该机构承担相应责任。\n本平台面向外业调查、环境咨询等专业场景，主要提供数据处理与专题图件制作类在线工具。\n\n## 二、服务内容\n本平台提供在线工具（布点与边界制作、样品核对、影像资料管理、等水位线、风险值评估、土方量与费用测算等）、示例数据集、需求墙、账户中心（我的权益、个人资料、账号安全）、交易记录与发票管理等功能。\n各工具的输入要求、输出成果、可用次数与有效期，以工具页面说明和服务端记录为准。\n我们可能随时新增、调整或下线部分功能；免费功能调整给您造成的损失，我们不承担责任。\n本平台输出的是数据处理结果，供您在项目中参考与二次使用，不构成专业结论、鉴定意见或法定报告。您应自行完成必要的专业判断、校核与合规审查。\n\n## 三、账户注册与安全\n您可以使用邮箱注册（填写常用邮箱、设置不少于 8 位密码并完成邮箱验证码验证），也可以通过微信扫码关注我们的服务号自动创建账户。\n通过微信创建的账户，我们会同步微信昵称与头像作为默认资料，并引导您补充邮箱，以便找回密码和接收服务通知。\n您应保证注册信息真实、准确、有效并及时更新；同一邮箱、手机号或微信号仅可绑定一个账户。\n请妥善保管账户凭证与验证码：使用您的账户完成的操作，视为您本人的行为。\n发现账户被盗用或存在异常时，请立即修改密码，并通过本条款第十三条的方式联系我们。\n您可以在账户中心自行设置或修改密码、更换邮箱、绑定或解绑微信；为保障安全，解绑微信前需要先设置登录密码。\n您可以在账户中心申请注销账户：注销会彻底删除账号、个人资料与微信绑定，删除后不可恢复，具体处理方式见《隐私政策》相关说明。\n\n## 四、使用规则\n您可以使用本平台处理您合法拥有的数据，并用于自身工作成果交付，前提是遵守法律法规与本条款。\n您不得：上传或处理违法、有害、侵权、涉密或来源不明的数据；使用爬虫、脚本、机器人等方式批量访问、注册或刷取免费额度；攻击、干扰、探测本平台，或绕过配额、权限与安全机制；反向工程、反编译或试图获取本平台源代码与算法；出租、出借、转售账户或权益，或将本平台用于开发竞争性产品；删除或遮蔽本平台的知识产权标识。\n如您违反上述规则，我们可以限制使用、暂停或终止账户，并回收违规获得的额度与权益；已支付费用是否退还按第七条处理。\n\n## 五、您的内容与数据\n您上传的数据、设置的参数与生成的成果归您所有。我们不会主张对您内容的所有权，仅为提供服务的目的进行必要的存储、传输与处理。\n工具处理过程中，我们不会保存您上传的原始数据内容与处理结果；为完成权益核算与同一场地判别，仅保留任务元数据（文件名、大小、时间、使用的工具）与地块范围（四至）等特征信息。\n请勿上传与工具用途无关的个人敏感信息；如您的数据包含他人个人信息，请确保已取得合法授权。\n示例数据集与样例文件仅用于功能体验与测试，请勿用于正式交付。\n需要长期留存的成果与记录，请自行下载保存；建议您在本地保留原始数据备份。因未备份导致的数据丢失，我们不承担责任。\n\n## 六、订单、支付与权益\n本平台的付费工具、数据集与会员类权益通过订单开通，支持微信支付。\n订单的价格、内容与有效期以下单页面及订单记录为准；权益在服务端确认支付成功后发放。\n我们可能调整价格与权益内容，调整不影响您已购买且仍在有效期内的权益。\n请勿通过非我们指定的方式支付，否则可能无法正常开通权益或办理退费。\n\n## 七、退费\n您可以在账户中心 → 交易记录中，对符合条件的订单发起退费申请。\n退费申请期限为订单完成后 30 天内；符合以下情形之一的可以申请退费：支付成功但权益未发放或发放异常；同一订单重复支付；其他经我们核实属于平台原因的情形。\n以下情形原则上不支持退费：权益已使用或已消耗；订单对应的数据或成果已完成交付；因违反本条款被限制或终止账户；超过订单完成后 30 天。\n退费申请提交后，我们会在 3 个工作日内处理；审核通过后按原支付渠道退回，到账时间以微信支付规则为准。\n订单如已开具发票，需先完成发票退回或冲红后办理退费。\n\n## 八、发票\n已支付的订单可以在账户中心 → 发票管理申请开票，支持企业与个人抬头。\n我们目前不支持开具增值税专用发票；如需增值税普通发票外的票据类型，请先与我们确认。\n发票金额为订单实际支付金额；抬头、税号等信息由您填写，并对其真实性负责。\n发票开具后如需变更或重开，请联系我们处理。\n\n## 九、分享与邀请额度\n您可以通过生成分享卡、邀请他人等方式获得可用次数（分享额度）。\n严禁通过虚假注册、刷量、批量邀请等不正当方式获取额度；一经发现，我们可以回收相关额度，并视情节限制账户功能。\n\n## 十、知识产权\n本平台的软件、界面、文档、示例数据、样例成果、商标与标识等，归我们或相关权利人所有。\n未经书面许可，您不得复制、传播、出租、出售本平台内容，或将其用于模型训练、批量抓取与二次分发。\n您在合法范围内使用本平台成果，用于自身报告与项目交付，不受影响。\n\n## 十一、服务变更、中断与终止\n我们会尽力保障服务稳定，但可能因维护、升级、网络故障、不可抗力等原因发生中断。\n您可以随时停止使用并注销账户；在您违反本条款或法律法规时，我们也可以暂停或终止向您提供服务。\n如我们停止提供某项收费服务，将退还您未使用的服务期对应费用或未消耗权益的对价。\n\n## 十二、免责与责任限制\n本平台按“现状”提供；我们不对服务不间断、无错误或完全符合您的预期作出保证。\n数据处理结果受输入数据质量、参数设置与工具能力限制，请自行校核并承担专业判断责任。\n在法律允许的最大范围内，我们对您的赔偿责任不超过您在索赔发生前 12 个月内向我们实际支付的费用；免费功能不产生赔偿责任。\n上述限制不适用于我们故意或重大过失造成的损害，以及法律不允许限制的情形。\n\n## 十三、通知与联系方式\n我们可以通过站内提示、页面公告或您预留的邮箱向您发送通知。\n本条款或服务内容更新时，我们会在本页面公布；您继续使用本平台，即视为接受更新后的内容。\n联系方式：北京屹云科技有限公司；企业邮箱 support@bjyiyunkeji.online；企业微信 paomo720。京ICP备2025155788号。\n\n## 十四、法律适用与争议解决\n本条款适用中华人民共和国法律。\n因本条款产生的争议，双方应友好协商解决；协商不成的，可向我们所在地有管辖权的人民法院提起诉讼。\n\n本服务条款更新日期：2026 年 10 月 11 日。",
      "footer.icp": "京ICP备2025155788号",
      "account.sites_bounds": "四至",
      "account.sites_count": "场地数量",
      "account.sites_empty": "还没有登记场地：在工具里上传数据后会自动登记四至。",
      "account.sites_failed": "操作失败，请稍后重试",
      "account.sites_hint": "只记录地块四至范围，用于判断是否为同一场地；不保存原始数据与成果。",
      "account.sites_remove": "移除",
      "account.sites_removed": "已移除该场地登记",
      "account.sites_title": "场地登记",
      "account.sites_unnamed": "未命名场地",
      "account.sites_used": "使用 {count} 次",
      "account.stat_coupons": "使用券",
      "account.coupon_title": "我的使用券",
      "account.coupon_use": "去兑换",
      "coupon.tool_all": "全站通用",
      "pricing.coupon_redeem_button": "使用券兑换",
      "pricing.coupon_redeem_done": "使用券已核销",
      "coupon.share_granted": "已获得 {count} 张使用券",
      "account.coupon_empty": "暂无可用的使用券",
      "account.coupon_claim_placeholder": "输入兑换码",
      "account.coupon_claim": "领取",
      "account.coupon_claimed": "使用券已领取",
      "account.coupon_claim_failed": "领取失败",
      "admin.nav_coupons": "使用券",
      "admin.coupon_title": "使用券管理",
      "admin.coupon_status_unused": "未使用",
      "admin.coupon_status_used": "已使用",
      "admin.coupon_status_expired": "已过期",
      "admin.coupon_status_void": "已作废",
      "admin.coupon_batches_empty": "还没有券批次",
      "admin.coupon_unassigned": "未绑定用户",
      "admin.coupons_empty": "还没有使用券",
      "admin.coupon_void": "作废",
      "admin.coupon_total": "总量",
      "admin.coupon_used": "已核销",
      "admin.coupon_expired": "已过期",
      "admin.coupon_redemptions": "核销记录",
      "admin.coupon_by_source": "按来源",
      "admin.coupon_source_empty": "暂无来源统计",
      "admin.coupon_generated": "生成完成，请复制下方兑换码",
      "admin.coupon_batches_title": "券批次",
      "admin.coupon_col_batch": "批次",
      "admin.coupon_col_scope": "适用范围",
      "admin.coupon_col_days": "有效天数",
      "admin.coupon_col_limit": "每人限领",
      "admin.coupon_col_source": "来源",
      "admin.coupon_col_expires": "到期日",
      "admin.coupon_col_id": "券ID",
      "admin.coupon_list_title": "使用券列表",
      "admin.coupon_batch_create": "新建券批次",
      "admin.coupon_batch_save": "保存批次",
      "admin.coupon_issue": "手动发券",
      "admin.coupon_user_select": "选择用户",
      "admin.coupon_issue_save": "发券",
      "admin.coupon_generate": "在线生成兑换码",
      "admin.coupon_count": "生成数量",
      "admin.coupon_generate_save": "生成",
      "admin.coupon_void_confirm": "确认作废这张使用券？",
      "admin.coupon_voided": "已作废",
      "admin.coupon_batch_created": "券批次已创建",
      "admin.coupon_issue_done": "已发放",
      "detail.updates_title": "最近更新",
      "detail.feedback_title": "这次结果符合你的预期吗？",
      "detail.feedback_satisfied": "满意",
      "detail.feedback_neutral": "一般",
      "detail.feedback_problem": "有问题",
      "detail.feedback_placeholder": "哪里不符合预期？简单说一句即可",
      "detail.feedback_submit": "提交反馈",
      "detail.feedback_login": "请先登录后反馈",
      "detail.feedback_done": "已收到，感谢反馈",
      "detail.feedback_failed": "反馈提交失败",
      "detail.activity_loading": "正在读取使用情况",
      "detail.activity_total": "已使用 {count} 次",
      "detail.activity_done": "已完成 {count} 次",
      "detail.activity_ticker": "刚刚有用户完成使用",
      "admin.family_tool_media": "工具说明素材",
      "admin.family_tool_updates": "工具更新说明",
      "admin.nav_feedback": "用户反馈",
      "admin.nav_policies": "使用门禁",
      "admin.media_slot": "槽位",
      "admin.media_type": "素材类型",
      "admin.media_src": "素材路径",
      "admin.media_poster": "封面图",
      "admin.update_version": "版本号",
      "admin.update_kind": "更新类型",
      "admin.update_date": "发布日期",
      "admin.update_summary": "摘要",
      "admin.update_detail": "详细说明",
      "admin.update_feedback": "关联反馈主题",
      "admin.update_status": "状态",
      "admin.policy_title": "使用门禁配置",
      "admin.policy_mode": "门禁模式",
      "admin.policy_trial": "允许试用",
      "admin.policy_reason": "维护说明",
      "admin.policy_save": "保存门禁",
      "admin.policy_saved": "门禁已保存",
      "admin.policy_empty": "还没有门禁配置",
      "admin.feedback_title": "用户反馈",
      "admin.feedback_empty": "还没有用户反馈",
      "admin.feedback_total": "反馈总量",
      "admin.feedback_resolved": "已解决",
      "admin.feedback_rating": "评价",
      "admin.feedback_detail": "内容",
      "admin.feedback_reply": "回复",
      "admin.feedback_saved": "反馈已更新",
      "admin.col_id": "ID",
      "detail.result_title": "处理结果",
      "detail.steps_title": "使用步骤",
      "detail.step_upload": "上传或选择数据",
      "detail.step_process": "系统完成处理",
      "detail.step_download": "下载成果文件",
      "detail.data_empty": "暂无数据要求",
      "detail.updates_empty": "暂无更新记录",
      "detail.feedback_empty": "暂无公开反馈",
      "detail.feedback_no_text": "未填写详细说明",
      "detail.tab_data": "数据说明",
      "detail.tab_updates": "更新记录",
      "detail.tab_feedback": "用户反馈",
      "admin.family_tool_docs": "数据要求",
      "admin.doc_section": "分组",
      "admin.doc_content": "内容",
      "detail.slide_prev": "上一张",
      "detail.slide_next": "下一张",
      "detail.slide_dot": "第 {index} 张",
      "detail.fullscreen": "全屏查看",
      "detail.tab_illustration": "一图看懂",
      "detail.feedback_loading": "正在读取反馈",
      "detail.feedback_after_use": "用过一次这个工具后，就能在这里评价",
      "detail.demo_button": "示例数据",
      "detail.price_label": "单次使用",
      "detail.pay_entry_coupon": "用券兑换（剩 {count} 张）",
      "detail.pay_entry_credit": "用额度兑换（剩 {count} 次）",
      "detail.pay_title": "选择支付方式",
      "detail.pay_lede": "在线支付，或用券 / 额度兑换，兑换后立即开通。",
      "detail.pay_online": "在线支付",
      "detail.pay_confirm_redeem": "确认兑换",
      "detail.pay_credit_meta": "兑换后立即开通",
      "detail.pay_coupon_meta": "{count} 次 · {scope} · {date} 前有效",
      "coupon.no_expiry": "长期有效",
      "detail.compliance_link": "全国建设用地土壤环境管理信息系统",
      "detail.vip_price_tag": "VIP 价 {price}",
      "detail.vip_price_line": "VIP 价 {price} / 场地",
      "detail.vip_open": "开通 VIP",
      "detail.vip_modal_title": "开通 VIP，工具按 VIP 价结算",
      "detail.vip_modal_lede": "注册就是会员；开通 VIP 后全线工具按 VIP 价结算，另有每年赠送额度。",
      "detail.vip_benefit_discount": "全线工具 VIP 价，比普通价更低",
      "detail.vip_benefit_credits": "每年 3 次 0 元兑换额度（≤¥169 的方案）",
      "detail.vip_benefit_window": "场地复算窗口更长：同一场地重复出成果不再收费",
      "detail.vip_modal_cta": "{price} / 年 · 开通 VIP",
      "detail.vip_already": "你已是 VIP，正在按 VIP 价结算",
      "detail.demo_note": "免费体验",
      "detail.activity_ticker_now": "刚刚有用户完成使用",
      "detail.activity_ticker_minutes": "{count} 分钟前有用户完成使用",
      "detail.activity_ticker_hours": "{count} 小时前有用户完成使用",
      "detail.activity_ticker_days": "{count} 天前有用户完成使用",
      "admin.order_reconcile": "对账核销",
      "admin.order_reconcile_running": "正在向微信查询订单…",
      "admin.order_reconcile_paid": "已确认支付并核销，权益已开通",
      "admin.order_reconcile_pending": "微信返回未支付，请确认后再试",
      "admin.order_reconcile_failed": "对账失败，请稍后重试",
      "account.order_reconcile": "我已支付，刷新状态",
      "account.order_reconcile_pending": "微信尚未确认到账，请稍后再试",
      "account.order_reconcile_failed": "查询失败，请稍后重试",
      "detail.vip_price_label": "VIP 价",
      "detail.vip_active": "已享 VIP 价",
      "detail.billing_title": "计费说明",
      "detail.billing_site": "按场地计费：一个场地一份成果",
      "detail.billing_window": "同场地 7 天内复算不重复收费",
      "detail.billing_vip": "VIP 价 8 折，复算窗口延长到 30 天",
      "toast.request_timeout": "请求超时，请检查网络后重试",
      "admin.coupon_channel_placeholder": "渠道标记（如：兄弟站A）",
      "admin.coupon_col_channel": "渠道",
      "admin.coupon_col_quota": "次数",
      "admin.coupon_download_csv": "下载 CSV 码包",
      "coupon.quota_times": "可用 {count} 次",
      "admin.section_content": "内容与工具",
      "admin.section_products": "商品与计费",
      "admin.section_users": "用户与场地",
      "admin.section_finance": "财务",
      "admin.section_system": "系统"
    },
    "labels": {
      "form": {
        "tool": "自助",
        "service": "定制"
      },
      "billing": {
        "free": "免费",
        "paid": "付费",
        "quote": "报价"
      },
      "status": {
        "available": "可使用",
        "preparing": "准备中"
      },
      "requestType": {
        "new-tool": "新工具",
        "new-api": "新接口",
        "improvement": "功能改进",
        "bug": "问题反馈",
        "other": "其他"
      },
      "requestStatus": {
        "under-review": "评估中",
        "planned": "计划中",
        "shipped": "已上线"
      },
      "orderStatus": {
        "created": "待支付",
        "pending": "处理中",
        "paid": "已支付",
        "failed": "失败",
        "cancelled": "已取消"
      },
      "invoiceStatus": {
        "requested": "待处理",
        "processing": "处理中",
        "issued": "已开具",
        "rejected": "已驳回"
      },
      "refundStatus": {
        "requested": "退费审核中",
        "approved": "退费处理中",
        "refunded": "已退费",
        "rejected": "退费被驳回",
        "canceled": "已撤回"
      }
    },
    "site": {
      "brand": "FigHub",
      "subject": "外业调查",
      "page_title_template": "{brand}｜{subject}专题图件工作台",
      "meta_description_template": "{brand}：{subject}的图件工作台——把钻孔、采样、边界、坐标等外业数据，整理成可直接进报告的专题图件。",
      "contact_phone": "15313195032",
      "contact_wechat": "paomo720",
      "qr_image": "./images/qrcode/qrcode_for_gh_95b0e36a91f3_430.jpg",
      "home_stat_images_value": "7",
      "home_stat_images_label": "类成果图片",
      "home_stat_account_value": "1",
      "home_stat_account_label": "个统一账户",
      "home_stat_tools_label": "项工具与服务",
      "seo_base_url": "",
      "compliance_url": "http://114.251.10.109/page/landuserlogin.html",
      "page_title": "FigHub｜外业调查专题图件工作台",
      "description": "FigHub：外业调查的图件工作台——把钻孔、采样、边界、坐标等外业数据，整理成可直接进报告的专题图件。"
    }
  },
  "adminContent": {
    "tools": [
      {
        "slug": "boundary",
        "tool_code": "boundary",
        "route": "/tools/boundary",
        "name": "边界成果整理",
        "subtitle": "上传地块边界文件，满足{link}要求，直接得到可用于提交和出图的成果包。",
        "tags": "boundary",
        "form": "tool",
        "billing": "paid",
        "image": "boundary.png",
        "video": "",
        "gallery": "",
        "sample_files": "样例边界|./downloads/boundary/sample-input.zip|Shapefile（已脱敏）",
        "available": "true",
        "input_summary": "地块边界文件",
        "output_summary": "标准成果包",
        "capabilities": "坐标系识别|行政区自动匹配|快速输出成果",
        "sort": "10",
        "featured": "true"
      },
      {
        "slug": "xy",
        "tool_code": "xy",
        "route": "/tools/xy",
        "name": "坐标成果处理",
        "subtitle": "整理点位坐标，得到位置准确、可继续叠加使用的数据文件。",
        "tags": "point",
        "form": "tool",
        "billing": "free",
        "image": "xy.png",
        "video": "./media/videos/xy/demo.mp4",
        "gallery": "sample-01.png,sample-02.png",
        "sample_files": "样例坐标|./downloads/xy/sample-input.csv|12 个点的 X/Y 示例（已平移）",
        "available": "true",
        "input_summary": "点位坐标表",
        "output_summary": "统一坐标数据（可直接用于制图与报告）",
        "capabilities": "批量处理点位|核对坐标信息|减少位置偏移",
        "sort": "20",
        "featured": "true"
      },
      {
        "slug": "toshp",
        "tool_code": "toshp",
        "route": "/tools/toshp",
        "name": "空间格式转换",
        "subtitle": "在常用空间数据格式之间转换，方便项目交付与复用。",
        "tags": "data",
        "form": "tool",
        "billing": "free",
        "image": "toshp.png",
        "video": "./media/videos/toshp/demo.mp4",
        "gallery": "sample-01.png,sample-02.png",
        "sample_files": "样例图层|./downloads/toshp/sample-input.zip|WGS84 面图层（已脱敏）",
        "available": "false",
        "input_summary": "待转换的空间数据文件",
        "output_summary": "可复用的空间文件（可直接用于制图与报告）",
        "capabilities": "常用格式互转|保留字段信息|结果便于交付",
        "sort": "30",
        "featured": "true"
      },
      {
        "slug": "dem",
        "tool_code": "dem",
        "route": "/tools/elevation",
        "name": "地形高程成果",
        "subtitle": "得到可用于分析、制图和报告的地形高程成果。",
        "tags": "elevation",
        "form": "tool",
        "billing": "paid",
        "image": "dem.png",
        "video": "./media/videos/dem/demo.mp4",
        "gallery": "sample-01.png,sample-02.png",
        "sample_files": "样例点位+边界|./downloads/dem/sample-input.zip|点位 xlsx 与边界 kml（已平移）",
        "available": "false",
        "input_summary": "高程点或等高线数据",
        "output_summary": "地形高程成果（可直接用于制图与报告）",
        "capabilities": "范围随项目调整|高程关系直观|支持成果导出",
        "sort": "40",
        "featured": "true"
      },
      {
        "slug": "groundwater",
        "tool_code": "groundwater",
        "route": "/tools/groundwater",
        "name": "地下水成果制图",
        "subtitle": "得到地下水位分布、等值线和可用于报告的成图结果。",
        "tags": "groundwater",
        "form": "tool",
        "billing": "paid",
        "image": "groundwater.png",
        "video": "./media/videos/groundwater/demo.mp4",
        "gallery": "sample-01.png,sample-02.png",
        "sample_files": "样例监测井|./downloads/groundwater/sample-input.xlsx|含水位值的监测井表（已平移）",
        "available": "false",
        "input_summary": "监测井水位数据",
        "output_summary": "地下水专题图（可直接进报告）",
        "capabilities": "看清水位空间变化|图例与标注完整|结果可继续编辑",
        "sort": "50",
        "featured": "true"
      },
      {
        "slug": "spatial",
        "tool_code": "spatial_viewer",
        "route": "/tools/spatial",
        "name": "空间成果查看",
        "subtitle": "快速看清数据位置、范围和图层关系，及时发现错位或缺失。",
        "tags": "data",
        "form": "tool",
        "billing": "free",
        "image": "spatial.png",
        "video": "./media/videos/spatial/demo.mp4",
        "gallery": "sample-01.png,sample-02.png",
        "sample_files": "样例图层|./downloads/spatial/sample-input.zip|WGS84 面图层（已脱敏）",
        "available": "true",
        "input_summary": "需要查看的图层数据",
        "output_summary": "空间成果视图（用于核对数据）",
        "capabilities": "多图层同时查看|范围关系直观|快速核对数据",
        "sort": "60",
        "featured": "true"
      },
      {
        "slug": "layout",
        "tool_code": "layout",
        "route": "/tools/layout",
        "name": "专题图件排版",
        "subtitle": "得到版式统一、可直接放入报告和汇报材料的专题图件。",
        "tags": "figure",
        "form": "tool",
        "billing": "free",
        "image": "layout.png",
        "video": "./media/videos/layout/demo.mp4",
        "gallery": "sample-01.png,sample-02.png",
        "sample_files": "",
        "available": "false",
        "input_summary": "图件与图层数据",
        "output_summary": "专题成果图件（可直接进报告）",
        "capabilities": "版式更统一|图例信息完整|导出清晰成图",
        "sort": "70",
        "featured": "true"
      },
      {
        "slug": "planboring",
        "tool_code": "planboring",
        "route": "/tools/planboring",
        "name": "钻孔布点规划",
        "subtitle": "得到覆盖调查范围、可直接实施的钻孔点位图和布点成果。",
        "tags": "boring",
        "form": "tool",
        "billing": "paid",
        "image": "planboring.png",
        "video": "./media/videos/planboring/demo.mp4",
        "gallery": "sample-01.png,sample-02.png",
        "sample_files": "样例调查分区|./downloads/planboring/sample-input.zip|调查分区 Shapefile（已脱敏）",
        "available": "true",
        "input_summary": "调查范围与点位数据",
        "output_summary": "钻孔点位图与布点方案（可直接进报告）",
        "capabilities": "点位布局更合理|范围覆盖更完整|方案调整更方便",
        "sort": "80",
        "featured": "true"
      },
      {
        "slug": "vertiplot",
        "tool_code": "vertiplot",
        "route": "/tools/vertiplot",
        "name": "垂向分布制图",
        "subtitle": "得到剖面和垂向分布图，直观看清不同深度的变化。",
        "tags": "sample",
        "form": "tool",
        "billing": "paid",
        "image": "vertiplot.png",
        "video": "./media/videos/vertiplot/demo.mp4",
        "gallery": "sample-01.png,sample-02.png",
        "sample_files": "样例纵表|./downloads/vertiplot/sample-input.xlsx|公开示例纵表",
        "available": "true",
        "input_summary": "分层采样数据",
        "output_summary": "垂向分布专题图（可直接进报告）",
        "capabilities": "深度关系更清楚|剖面成果更直观|成果图可直接导出",
        "sort": "90",
        "featured": "true"
      },
      {
        "slug": "custom",
        "tool_code": "custom",
        "route": "",
        "name": "任务定制",
        "subtitle": "把调查目标交给技术人员，获得可直接交付的空间成果与图件。",
        "tags": "figure",
        "form": "service",
        "billing": "quote",
        "image": "custom.png",
        "video": "",
        "gallery": "sample-01.png,sample-02.png",
        "sample_files": "",
        "available": "true",
        "input_summary": "项目数据与目标说明",
        "output_summary": "定制成果图件与数据文件（可直接进报告）",
        "capabilities": "按项目目标沟通|成果范围一起确认|交付图件与数据文件",
        "sort": "100",
        "featured": "true"
      },
      {
        "slug": "data-import",
        "tool_code": "data_import",
        "route": "/tools/data-import",
        "name": "数据接入（智能导入）",
        "subtitle": "上传即识别：列自动识别、字段映射、规范化台账与核对报告。",
        "tags": "data",
        "form": "tool",
        "billing": "free",
        "image": "data-import.png",
        "video": "./media/videos/data-import/demo.mp4",
        "gallery": "sample-01.png,sample-02.png",
        "sample_files": "示例点位表|./downloads/data-import/sample-points.xlsx|脱敏样例（BORING 模板）;示例检测长表|./downloads/data-import/sample-detections.xlsx|脱敏样例（有机污染物长表）",
        "available": "true",
        "input_summary": "Excel / CSV（点位表或检测长表）",
        "output_summary": "规范化台账 + 核对报告",
        "capabilities": "自动识别列结构|统一字段命名|输出可直接使用的台账",
        "sort": "110",
        "featured": "true"
      },
      {
        "slug": "coc-cleaning",
        "tool_code": "coc_cleaning",
        "route": "/tools/coc-cleaning",
        "name": "检测数据清洗",
        "subtitle": "污染物名称归并（别名表）、单位换算、检出限处理与清洗报告。",
        "tags": "sample",
        "form": "tool",
        "billing": "free",
        "image": "coc-cleaning.png",
        "video": "./media/videos/coc-cleaning/demo.mp4",
        "gallery": "sample-01.png,sample-02.png",
        "sample_files": "示例检测数据|./downloads/coc-cleaning/sample-detections.xlsx|脱敏样例（有机污染物长表）;示例别名规则|./downloads/coc-cleaning/sample-alias-rules.xlsx|别名归并规则示例（可替换）",
        "available": "true",
        "input_summary": "检测数据长表（+ 可选别名规则表）",
        "output_summary": "清洗结果 + 问题清单",
        "capabilities": "名称归并到标准名称|数值与单位解析|检出限（<）标记",
        "sort": "120",
        "featured": "true"
      },
      {
        "slug": "risk-check",
        "tool_code": "risk_check",
        "route": "/tools/risk-check",
        "name": "超标比对",
        "subtitle": "检测数据对标准值（筛选值 / 修复目标值）逐条比对，输出超标清单。",
        "tags": "data",
        "form": "tool",
        "billing": "paid",
        "image": "risk-check.png",
        "video": "./media/videos/risk-check/demo.mp4",
        "gallery": "sample-01.png,sample-02.png",
        "sample_files": "示例检测数据|./downloads/risk-check/sample-detections.xlsx|脱敏样例（有机污染物长表）;超标演示数据|./downloads/risk-check/sample-over-demo.xlsx|演示数据：含 3 条超标;示例标准值|./downloads/risk-check/sample-standards.xlsx|标准值表（多级表头 + 规划分类）",
        "available": "true",
        "input_summary": "检测数据 + 标准值表",
        "output_summary": "比对结果 + 超标清单（含超标倍数）",
        "capabilities": "规划分类与深度分段选择|单位自动换算|超标倍数与判定",
        "sort": "130",
        "featured": "true"
      },
      {
        "slug": "boring-cleaning",
        "tool_code": "boring_cleaning",
        "route": "/tools/boring-cleaning",
        "name": "钻孔数据整理",
        "subtitle": "钻孔台账清洗：孔号、深度段与分层规范化，输出可直接使用的钻孔表。",
        "tags": "boring",
        "form": "tool",
        "billing": "free",
        "image": "boring-cleaning.png",
        "video": "./media/videos/boring-cleaning/demo.mp4",
        "gallery": "sample-01.png,sample-02.png",
        "sample_files": "",
        "available": "true",
        "input_summary": "钻孔台账（Excel/CSV）",
        "output_summary": "标准钻孔台账 + 核对清单",
        "capabilities": "孔号 / 深度段规范化|分层与岩性字段核对|输出标准钻孔台账",
        "sort": "140",
        "featured": "true"
      },
      {
        "slug": "sample-cleaning",
        "tool_code": "sample_cleaning",
        "route": "/tools/sample-cleaning",
        "name": "样品数据整理",
        "subtitle": "样品台账清洗：编号、深度、样品类型规范与缺失核对。",
        "tags": "sample",
        "form": "tool",
        "billing": "free",
        "image": "sample-cleaning.png",
        "video": "./media/videos/sample-cleaning/demo.mp4",
        "gallery": "sample-01.png,sample-02.png",
        "sample_files": "",
        "available": "true",
        "input_summary": "样品台账（Excel/CSV）",
        "output_summary": "标准样品台账 + 缺失核对",
        "capabilities": "样品编号规范|深度与类型核对|缺失与重复检查",
        "sort": "150",
        "featured": "true"
      },
      {
        "slug": "imagery-download",
        "tool_code": "imagery_download",
        "route": "/tools/imagery-download",
        "name": "影像下载",
        "subtitle": "上传边界或绘制范围查询历史影像，按日期下载完整 GeoTIFF。",
        "tags": "data",
        "form": "tool",
        "billing": "free",
        "image": "imagery-download.png",
        "video": "./media/videos/imagery-download/demo.mp4",
        "gallery": "sample-01.png,sample-02.png",
        "sample_files": "",
        "available": "true",
        "input_summary": "矢量边界 / 手绘范围",
        "output_summary": "历史影像 GeoTIFF（按日期）",
        "capabilities": "范围查询与矩形包络|多日期影像查询|完整 GeoTIFF 下载",
        "sort": "160",
        "featured": "true"
      },
      {
        "slug": "history-archive",
        "tool_code": "history_archive",
        "route": "/tools/history-archive",
        "name": "历史资料整理",
        "subtitle": "历史影像、POI 与其他要素的建库、检索与版本快照。",
        "tags": "data",
        "form": "tool",
        "billing": "free",
        "image": "history-archive.png",
        "video": "./media/videos/history-archive/demo.mp4",
        "gallery": "sample-01.png,sample-02.png",
        "sample_files": "",
        "available": "true",
        "input_summary": "边界版本 + 年份范围",
        "output_summary": "历史资料版本（影像 + POI + 要素）",
        "capabilities": "历史影像与 POI 建库|逻辑要素与不可变修订|检索与版本快照",
        "sort": "170",
        "featured": "true"
      },
      {
        "slug": "report-builder",
        "tool_code": "report_builder",
        "route": "/tools/report-builder",
        "name": "报告装配",
        "subtitle": "锁定成果版本，按模板章节预检并装配 DOCX 报告。",
        "tags": "figure",
        "form": "tool",
        "billing": "paid",
        "image": "report-builder.png",
        "video": "./media/videos/report-builder/demo.mp4",
        "gallery": "sample-01.png,sample-02.png",
        "sample_files": "",
        "available": "true",
        "input_summary": "已保存的成果版本",
        "output_summary": "DOCX 报告（含图件槽）",
        "capabilities": "锁定成果版本|模板章节预检|一次性生成 DOCX",
        "sort": "180",
        "featured": "true"
      },
      {
        "slug": "aggregation",
        "tool_code": "aggregation",
        "route": "/tools/aggregation",
        "name": "空间聚合",
        "subtitle": "超标记录的空间聚合与图斑汇总（聚合契约 v2）。",
        "tags": "figure",
        "form": "tool",
        "billing": "paid",
        "image": "aggregation.png",
        "video": "./media/videos/aggregation/demo.mp4",
        "gallery": "sample-01.png,sample-02.png",
        "sample_files": "",
        "available": "true",
        "input_summary": "超标纵表（OVER=1）+ 范围成果",
        "output_summary": "聚合成果（图斑 + 关系 + 版本）",
        "capabilities": "OVER=1 记录聚合|图斑与关系汇总|输出聚合成果版本",
        "sort": "190",
        "featured": "true"
      },
      {
        "slug": "remediation",
        "tool_code": "remediation",
        "route": "/tools/remediation",
        "name": "修复单元",
        "subtitle": "修复单元划定：来源图斑 + 控制点 + 成员血缘。",
        "tags": "figure",
        "form": "tool",
        "billing": "paid",
        "image": "remediation.png",
        "video": "./media/videos/remediation/demo.mp4",
        "gallery": "sample-01.png,sample-02.png",
        "sample_files": "",
        "available": "true",
        "input_summary": "聚合成果（契约 v2）",
        "output_summary": "修复单元成果（图斑 + 血缘）",
        "capabilities": "修复单元划定|控制点与成员血缘|成果走版本快照",
        "sort": "200",
        "featured": "true"
      },
      {
        "slug": "numerical-sim",
        "tool_code": "numerical_sim",
        "route": "/tools/numerical-sim",
        "name": "数值模拟",
        "subtitle": "场地地下水 / 溶质数值模拟（规划能力，入口已接入平台）。",
        "tags": "groundwater",
        "form": "tool",
        "billing": "quote",
        "image": "numerical-sim.png",
        "video": "./media/videos/numerical-sim/demo.mp4",
        "gallery": "sample-01.png,sample-02.png",
        "sample_files": "",
        "available": "true",
        "input_summary": "场地水文地质条件 / 参数",
        "output_summary": "模拟结果与成果展示图",
        "capabilities": "地下水 / 溶质模拟|情景与参数模板|模拟结果展示",
        "sort": "210",
        "featured": "true"
      }
    ],
    "tags": [
      {
        "key": "boundary",
        "icon": "layers",
        "name": "边界",
        "description": "调查范围、分区与拐点"
      },
      {
        "key": "point",
        "icon": "target",
        "name": "点位",
        "description": "坐标与点位数据"
      },
      {
        "key": "elevation",
        "icon": "compass",
        "name": "高程",
        "description": "地形高程成果"
      },
      {
        "key": "boring",
        "icon": "grid",
        "name": "钻孔",
        "description": "钻孔布点规划"
      },
      {
        "key": "groundwater",
        "icon": "globe",
        "name": "地下水",
        "description": "地下水位成果图"
      },
      {
        "key": "sample",
        "icon": "database",
        "name": "样品",
        "description": "分层采样与垂向分布"
      },
      {
        "key": "figure",
        "icon": "map",
        "name": "图件",
        "description": "专题图件排版与定制"
      },
      {
        "key": "data",
        "icon": "refresh",
        "name": "数据",
        "description": "格式转换与成果查看"
      }
    ],
    "catalog": {
      "boundary": {
        "registered": true,
        "access_mode": "paid",
        "enabled": true
      },
      "xy": {
        "registered": true,
        "access_mode": "preview",
        "enabled": true
      },
      "toshp": {
        "registered": false,
        "access_mode": null,
        "enabled": false
      },
      "dem": {
        "registered": false,
        "access_mode": null,
        "enabled": false
      },
      "groundwater": {
        "registered": false,
        "access_mode": null,
        "enabled": false
      },
      "spatial": {
        "registered": true,
        "access_mode": "preview",
        "enabled": true
      },
      "layout": {
        "registered": false,
        "access_mode": null,
        "enabled": false
      },
      "planboring": {
        "registered": true,
        "access_mode": "paid",
        "enabled": true
      },
      "vertiplot": {
        "registered": true,
        "access_mode": "paid",
        "enabled": true
      },
      "custom": {
        "registered": false,
        "access_mode": null,
        "enabled": false
      },
      "data-import": {
        "registered": true,
        "access_mode": "public",
        "enabled": true
      },
      "coc-cleaning": {
        "registered": true,
        "access_mode": "public",
        "enabled": true
      },
      "risk-check": {
        "registered": true,
        "access_mode": "public",
        "enabled": true
      },
      "boring-cleaning": {
        "registered": true,
        "access_mode": "public",
        "enabled": true
      },
      "sample-cleaning": {
        "registered": true,
        "access_mode": "public",
        "enabled": true
      },
      "imagery-download": {
        "registered": true,
        "access_mode": "public",
        "enabled": true
      },
      "history-archive": {
        "registered": true,
        "access_mode": "public",
        "enabled": true
      },
      "report-builder": {
        "registered": true,
        "access_mode": "public",
        "enabled": true
      },
      "aggregation": {
        "registered": true,
        "access_mode": "public",
        "enabled": true
      },
      "remediation": {
        "registered": true,
        "access_mode": "public",
        "enabled": true
      },
      "numerical-sim": {
        "registered": true,
        "access_mode": "public",
        "enabled": true
      }
    },
    "backend": "db",
    "products": [
      {
        "code": "pro_membership",
        "tool_code": "membership",
        "display_name": "VIP会员",
        "description": "VIP 专属权益：全线工具 8 折、每年 3 次高价值额度、场地复算窗口 30 天。",
        "plans": [
          {
            "code": "pro_annual",
            "display_name": "VIP 年费",
            "price_cents": 29900,
            "list_price_cents": 39900,
            "currency": "CNY",
            "duration_days": 365,
            "quota_total": 3,
            "max_file_size_mb": 200,
            "max_runtime_seconds": 600,
            "concurrency": 1,
            "export_enabled": true,
            "activation_required": false
          }
        ]
      },
      {
        "code": "boundary_basic",
        "tool_code": "boundary",
        "display_name": "边界成果整理",
        "description": "固定数据输入、固定专题输出；一次购买对应一个场地的一份成果。",
        "plans": [
          {
            "code": "boundary_site",
            "display_name": "单次使用",
            "price_cents": 3900,
            "list_price_cents": 0,
            "currency": "CNY",
            "duration_days": null,
            "quota_total": 1,
            "max_file_size_mb": 100,
            "max_runtime_seconds": 300,
            "concurrency": 1,
            "export_enabled": true,
            "activation_required": true
          }
        ]
      },
      {
        "code": "planboring_basic",
        "tool_code": "planboring",
        "display_name": "钻孔布点规划",
        "description": "固定数据输入、固定专题输出；一次购买对应一个场地的一份成果。",
        "plans": [
          {
            "code": "planboring_site",
            "display_name": "单次使用",
            "price_cents": 9900,
            "list_price_cents": 0,
            "currency": "CNY",
            "duration_days": null,
            "quota_total": 1,
            "max_file_size_mb": 100,
            "max_runtime_seconds": 300,
            "concurrency": 1,
            "export_enabled": true,
            "activation_required": true
          }
        ]
      },
      {
        "code": "vertiplot_basic",
        "tool_code": "vertiplot",
        "display_name": "垂向分布制图",
        "description": "固定数据输入、固定专题输出；一次购买对应一个场地的一份成果。",
        "plans": [
          {
            "code": "vertiplot_site",
            "display_name": "单次使用",
            "price_cents": 6900,
            "list_price_cents": 0,
            "currency": "CNY",
            "duration_days": null,
            "quota_total": 1,
            "max_file_size_mb": 100,
            "max_runtime_seconds": 300,
            "concurrency": 1,
            "export_enabled": true,
            "activation_required": true
          }
        ]
      }
    ],
    "billing_products": [
      {
        "code": "boundary_basic",
        "tool_code": "boundary",
        "display_name": "边界成果整理",
        "description": "固定数据输入、固定专题输出；一次购买对应一个场地的一份成果。",
        "enabled": "true",
        "sort": "10"
      },
      {
        "code": "planboring_basic",
        "tool_code": "planboring",
        "display_name": "钻孔布点规划",
        "description": "固定数据输入、固定专题输出；一次购买对应一个场地的一份成果。",
        "enabled": "true",
        "sort": "20"
      },
      {
        "code": "vertiplot_basic",
        "tool_code": "vertiplot",
        "display_name": "垂向分布制图",
        "description": "固定数据输入、固定专题输出；一次购买对应一个场地的一份成果。",
        "enabled": "true",
        "sort": "30"
      },
      {
        "code": "pro_membership",
        "tool_code": "membership",
        "display_name": "VIP会员",
        "description": "VIP 专属权益：全线工具 8 折、每年 3 次高价值额度、场地复算窗口 30 天。",
        "enabled": "true",
        "sort": "5"
      }
    ],
    "datasets": [
      {
        "id": "admin-boundaries",
        "type": "行政区划",
        "icon": "map",
        "name": "全国行政区划边界示例数据",
        "description": "用于{subject}制图、范围裁切和边界关系测试的标准化行政区划样例。",
        "records": "3,200",
        "files": "1",
        "formats": "GeoJSON",
        "access": "free",
        "access_label": "公开示例",
        "updated": "2026-09",
        "about": "包含省、市、县三级行政区划的示例边界数据，适合用于地图展示、空间范围裁切和工具联调。数据已做示例化处理，不作为正式测绘成果使用。",
        "children": {
          "files": [
            {
              "dataset_id": "admin-boundaries",
              "sort": "10",
              "name": "行政区划边界_示例.geojson",
              "meta": "GeoJSON · 2.8 MB · 3,200 条记录"
            }
          ],
          "fields": [
            {
              "dataset_id": "admin-boundaries",
              "sort": "10",
              "name": "名称",
              "description": "行政区划名称",
              "type": "string"
            },
            {
              "dataset_id": "admin-boundaries",
              "sort": "20",
              "name": "级别",
              "description": "省、市、县层级",
              "type": "number"
            },
            {
              "dataset_id": "admin-boundaries",
              "sort": "30",
              "name": "代码",
              "description": "行政区划代码",
              "type": "string"
            },
            {
              "dataset_id": "admin-boundaries",
              "sort": "40",
              "name": "geometry",
              "description": "边界几何",
              "type": "MultiPolygon"
            }
          ],
          "preview": [
            {
              "dataset_id": "admin-boundaries",
              "sort": "10",
              "value1": "山西省",
              "value2": "1",
              "value3": "140000",
              "value4": "MultiPolygon"
            },
            {
              "dataset_id": "admin-boundaries",
              "sort": "20",
              "value1": "太原市",
              "value2": "2",
              "value3": "140100",
              "value4": "MultiPolygon"
            }
          ]
        }
      },
      {
        "id": "survey-points",
        "type": "点位数据",
        "icon": "database",
        "name": "{subject}点位样例数据",
        "description": "用于坐标处理、点位核对和地图展示的调查点位样例文件。",
        "records": "1,248",
        "files": "2",
        "formats": "CSV / XLSX",
        "access": "free",
        "access_label": "免费样例",
        "updated": "2026-09",
        "about": "包含点位编号、经纬度、采样时间和调查类型等字段，适合验证坐标导入、字段映射和成果预览流程。",
        "children": {
          "files": [
            {
              "dataset_id": "survey-points",
              "sort": "10",
              "name": "调查点位_示例.csv",
              "meta": "CSV · 186 KB · 1,248 条记录"
            },
            {
              "dataset_id": "survey-points",
              "sort": "20",
              "name": "调查点位_字段说明.xlsx",
              "meta": "XLSX · 24 KB · 2 个工作表"
            }
          ],
          "fields": [
            {
              "dataset_id": "survey-points",
              "sort": "10",
              "name": "point_id",
              "description": "点位编号",
              "type": "string"
            },
            {
              "dataset_id": "survey-points",
              "sort": "20",
              "name": "longitude",
              "description": "经度",
              "type": "number"
            },
            {
              "dataset_id": "survey-points",
              "sort": "30",
              "name": "latitude",
              "description": "纬度",
              "type": "number"
            },
            {
              "dataset_id": "survey-points",
              "sort": "40",
              "name": "survey_type",
              "description": "调查类型",
              "type": "string"
            }
          ],
          "preview": [
            {
              "dataset_id": "survey-points",
              "sort": "10",
              "value1": "P-0001",
              "value2": "112.5482",
              "value3": "37.8751",
              "value4": "土壤调查"
            },
            {
              "dataset_id": "survey-points",
              "sort": "20",
              "value1": "P-0002",
              "value2": "112.5621",
              "value3": "37.8614",
              "value4": "地下水调查"
            }
          ]
        }
      },
      {
        "id": "groundwater-monitoring",
        "type": "监测数据",
        "icon": "compass",
        "name": "地下水监测样例数据",
        "description": "用于地下水位分析、等值线制图和成果检查的时间序列样例数据。",
        "records": "8,640",
        "files": "3",
        "formats": "CSV",
        "access": "paid",
        "access_label": "权益下载",
        "updated": "2026-08",
        "about": "包含监测点、监测日期、水位和基础空间位置字段，适合演示地下水成果制图和时间序列分析。该数据集为教学与测试样例。",
        "children": {
          "files": [
            {
              "dataset_id": "groundwater-monitoring",
              "sort": "10",
              "name": "地下水监测_2024.csv",
              "meta": "CSV · 1.2 MB · 2,880 条记录"
            },
            {
              "dataset_id": "groundwater-monitoring",
              "sort": "20",
              "name": "地下水监测_2025.csv",
              "meta": "CSV · 1.4 MB · 3,120 条记录"
            },
            {
              "dataset_id": "groundwater-monitoring",
              "sort": "30",
              "name": "地下水监测_2026.csv",
              "meta": "CSV · 1.1 MB · 2,640 条记录"
            }
          ],
          "fields": [
            {
              "dataset_id": "groundwater-monitoring",
              "sort": "10",
              "name": "well_id",
              "description": "监测井编号",
              "type": "string"
            },
            {
              "dataset_id": "groundwater-monitoring",
              "sort": "20",
              "name": "observed_at",
              "description": "监测日期",
              "type": "date"
            },
            {
              "dataset_id": "groundwater-monitoring",
              "sort": "30",
              "name": "water_level",
              "description": "地下水位",
              "type": "number"
            },
            {
              "dataset_id": "groundwater-monitoring",
              "sort": "40",
              "name": "longitude",
              "description": "经度",
              "type": "number"
            }
          ],
          "preview": [
            {
              "dataset_id": "groundwater-monitoring",
              "sort": "10",
              "value1": "GW-001",
              "value2": "2025-06-12",
              "value3": "824.31",
              "value4": "112.5482"
            },
            {
              "dataset_id": "groundwater-monitoring",
              "sort": "20",
              "value1": "GW-002",
              "value2": "2025-06-12",
              "value3": "819.74",
              "value4": "112.5621"
            }
          ]
        }
      }
    ],
    "help": [
      {
        "key": "deliverable",
        "group": "使用与工具",
        "sort": "05",
        "title": "你们产出的是什么？",
        "copy": "可直接进报告的专题图件——点位图、等值线图、剖面图、柱状图、垂向分布图等，具体以各工具说明为准。",
        "href": "#tools"
      },
      {
        "key": "choose-tool",
        "group": "使用与工具",
        "sort": "10",
        "title": "如何选择工具？",
        "copy": "先看工具详情中的输入要求和结果说明，再决定是否开始处理。",
        "href": "#tools"
      },
      {
        "key": "entitlement",
        "group": "使用与工具",
        "sort": "20",
        "title": "权益什么时候生效？",
        "copy": "支付成功后权益写入账户，需要上传的工具按服务端规则开始计时。",
        "href": "#account/entitlements"
      },
      {
        "key": "orders",
        "group": "使用与工具",
        "sort": "30",
        "title": "订单和发票在哪里？",
        "copy": "登录后打开用户中心，可以查看订单状态并提交发票申请。",
        "href": "#account/orders"
      },
      {
        "key": "files",
        "group": "使用与工具",
        "sort": "40",
        "title": "文件会被保存吗？",
        "copy": "每个工具的文件处理方式和保存边界会在详情页说明。",
        "href": "#privacy"
      },
      {
        "key": "errors",
        "group": "使用与工具",
        "sort": "50",
        "title": "遇到错误怎么办？",
        "copy": "保存页面提示和订单号，再通过联系我们获得支持。",
        "href": "#about?section=contact"
      },
      {
        "key": "requests",
        "group": "使用与工具",
        "sort": "60",
        "title": "没有找到需要的工具？",
        "copy": "告诉我们你想完成的成果，我们会评估是否加入工具计划。",
        "href": "#requests"
      },
      {
        "key": "site-pricing",
        "group": "支付与计费",
        "sort": "65",
        "title": "「按场地计价」是什么意思？",
        "copy": "按调查项目的场地（地块）计费：一个场地买一次，含一份可交付成果；同一场地 7 天内改数据、改参数、重新出图不重复收费（VIP 30 天）。换场地或换一套调查数据需要重新购买。",
        "href": "#pricing"
      },
      {
        "key": "invoice-ask",
        "group": "支付与计费",
        "sort": "70",
        "title": "能开发票吗？",
        "copy": "支持。登录后在用户中心提交发票申请，选择已支付订单即可。",
        "href": "#account/invoices"
      },
      {
        "key": "free-tools",
        "group": "支付与计费",
        "sort": "80",
        "title": "通用工具为什么免费？",
        "copy": "坐标处理、格式转换、成果查看、图件排版属于通用能力，注册即可用；只有固定数据输入、固定专题输出的工具收费。",
        "href": "#pricing"
      },
      {
        "key": "pay-count",
        "group": "支付与计费",
        "sort": "90",
        "title": "买一次能用几次？",
        "copy": "一次购买对应一个场地的一份成果；同一场地在 7 天内（VIP 30 天）反复调整不再收费。",
        "href": "#pricing"
      },
      {
        "key": "pay-swap",
        "group": "支付与计费",
        "sort": "91",
        "title": "换数据或换场地要再买吗？",
        "copy": "要。换场地或换一套数据视为新的成果，需要重新购买。",
        "href": "#pricing"
      },
      {
        "key": "pay-rework",
        "group": "支付与计费",
        "sort": "92",
        "title": "成果不达交付要求怎么办？",
        "copy": "联系我们，协助重做一次。",
        "href": "#about?section=contact"
      }
    ],
    "requests": [
      {
        "id": "coordinate-check",
        "type": "new-tool",
        "title": "批量坐标点校核与异常提示",
        "summary": "导入调查点位后，自动检查坐标格式、重复点和明显偏移，并给出可核对的结果表。",
        "votes": "7",
        "status": "under-review",
        "author": "{subject}用户",
        "time": "2026-09-18",
        "tool": "坐标成果处理"
      },
      {
        "id": "map-legend",
        "type": "improvement",
        "title": "专题图件增加统一图例和比例尺",
        "summary": "希望图件排版时可以统一设置图例、比例尺、指北针和输出尺寸，减少重复调整。",
        "votes": "5",
        "status": "under-review",
        "author": "匿名用户",
        "time": "2026-09-16",
        "tool": "专题图件排版"
      },
      {
        "id": "process-detail",
        "type": "bug",
        "title": "上传后显示处理进度和错误明细",
        "summary": "文件处理时间较长时，希望能看到当前进度，以及哪些文件或字段没有通过检查。",
        "votes": "3",
        "status": "planned",
        "author": "项目用户",
        "time": "2026-09-12",
        "tool": "空间格式转换"
      }
    ],
    "site": [
      {
        "key": "brand",
        "value": "FigHub"
      },
      {
        "key": "subject",
        "value": "外业调查"
      },
      {
        "key": "page_title_template",
        "value": "{brand}｜{subject}专题图件工作台"
      },
      {
        "key": "meta_description_template",
        "value": "{brand}：{subject}的图件工作台——把钻孔、采样、边界、坐标等外业数据，整理成可直接进报告的专题图件。"
      },
      {
        "key": "contact_phone",
        "value": "15313195032"
      },
      {
        "key": "contact_wechat",
        "value": "paomo720"
      },
      {
        "key": "qr_image",
        "value": "./images/qrcode/qrcode_for_gh_95b0e36a91f3_430.jpg"
      },
      {
        "key": "home_stat_images_value",
        "value": "7"
      },
      {
        "key": "home_stat_images_label",
        "value": "类成果图片"
      },
      {
        "key": "home_stat_account_value",
        "value": "1"
      },
      {
        "key": "home_stat_account_label",
        "value": "个统一账户"
      },
      {
        "key": "home_stat_tools_label",
        "value": "项工具与服务"
      },
      {
        "key": "seo_base_url",
        "value": ""
      },
      {
        "key": "compliance_url",
        "value": "http://114.251.10.109/page/landuserlogin.html"
      }
    ],
    "labels": [
      {
        "group": "form",
        "key": "tool",
        "value": "自助"
      },
      {
        "group": "form",
        "key": "service",
        "value": "定制"
      },
      {
        "group": "billing",
        "key": "free",
        "value": "免费"
      },
      {
        "group": "billing",
        "key": "paid",
        "value": "付费"
      },
      {
        "group": "billing",
        "key": "quote",
        "value": "报价"
      },
      {
        "group": "status",
        "key": "available",
        "value": "可使用"
      },
      {
        "group": "status",
        "key": "preparing",
        "value": "准备中"
      },
      {
        "group": "request_type",
        "key": "new-tool",
        "value": "新工具"
      },
      {
        "group": "request_type",
        "key": "new-api",
        "value": "新接口"
      },
      {
        "group": "request_type",
        "key": "improvement",
        "value": "功能改进"
      },
      {
        "group": "request_type",
        "key": "bug",
        "value": "问题反馈"
      },
      {
        "group": "request_type",
        "key": "other",
        "value": "其他"
      },
      {
        "group": "request_status",
        "key": "under-review",
        "value": "评估中"
      },
      {
        "group": "request_status",
        "key": "planned",
        "value": "计划中"
      },
      {
        "group": "request_status",
        "key": "shipped",
        "value": "已上线"
      },
      {
        "group": "order_status",
        "key": "created",
        "value": "待支付"
      },
      {
        "group": "order_status",
        "key": "pending",
        "value": "处理中"
      },
      {
        "group": "order_status",
        "key": "paid",
        "value": "已支付"
      },
      {
        "group": "order_status",
        "key": "failed",
        "value": "失败"
      },
      {
        "group": "order_status",
        "key": "cancelled",
        "value": "已取消"
      },
      {
        "group": "invoice_status",
        "key": "requested",
        "value": "待处理"
      },
      {
        "group": "invoice_status",
        "key": "processing",
        "value": "处理中"
      },
      {
        "group": "invoice_status",
        "key": "issued",
        "value": "已开具"
      },
      {
        "group": "invoice_status",
        "key": "rejected",
        "value": "已驳回"
      },
      {
        "group": "refund_status",
        "key": "requested",
        "value": "退费审核中"
      },
      {
        "group": "refund_status",
        "key": "approved",
        "value": "退费处理中"
      },
      {
        "group": "refund_status",
        "key": "refunded",
        "value": "已退费"
      },
      {
        "group": "refund_status",
        "key": "rejected",
        "value": "退费被驳回"
      },
      {
        "group": "refund_status",
        "key": "canceled",
        "value": "已撤回"
      }
    ],
    "strings": [
      {
        "key": "nav.home",
        "value": "首页"
      },
      {
        "key": "nav.aria",
        "value": "主导航"
      },
      {
        "key": "nav.tools",
        "value": "工具"
      },
      {
        "key": "nav.datasets",
        "value": "数据集"
      },
      {
        "key": "nav.help",
        "value": "帮助"
      },
      {
        "key": "nav.pricing",
        "value": "价格"
      },
      {
        "key": "nav.about",
        "value": "关于"
      },
      {
        "key": "nav.requests",
        "value": "需求墙"
      },
      {
        "key": "header.search",
        "value": "搜索工具"
      },
      {
        "key": "header.login",
        "value": "登录"
      },
      {
        "key": "header.logout",
        "value": "退出"
      },
      {
        "key": "header.register",
        "value": "注册"
      },
      {
        "key": "theme.to_dark",
        "value": "切换深色模式"
      },
      {
        "key": "theme.to_light",
        "value": "切换浅色模式"
      },
      {
        "key": "common.all",
        "value": "全部"
      },
      {
        "key": "common.cancel",
        "value": "取消"
      },
      {
        "key": "common.close",
        "value": "关闭"
      },
      {
        "key": "common.reload",
        "value": "重新加载"
      },
      {
        "key": "common.home",
        "value": "首页"
      },
      {
        "key": "footer.slogan",
        "value": "从调查数据，到报告级专题图件。"
      },
      {
        "key": "footer.product",
        "value": "产品"
      },
      {
        "key": "footer.users",
        "value": "用户"
      },
      {
        "key": "footer.legal",
        "value": "法律"
      },
      {
        "key": "footer.other",
        "value": "其他"
      },
      {
        "key": "footer.all_tools",
        "value": "所有工具"
      },
      {
        "key": "footer.pricing",
        "value": "价格方案"
      },
      {
        "key": "footer.help_center",
        "value": "帮助中心"
      },
      {
        "key": "footer.account",
        "value": "账户中心"
      },
      {
        "key": "footer.entitlements",
        "value": "我的权益"
      },
      {
        "key": "footer.orders",
        "value": "交易记录"
      },
      {
        "key": "footer.invoices",
        "value": "发票管理"
      },
      {
        "key": "footer.terms",
        "value": "服务条款"
      },
      {
        "key": "footer.privacy",
        "value": "隐私政策"
      },
      {
        "key": "footer.contact",
        "value": "联系我们"
      },
      {
        "key": "footer.bottom_service",
        "value": "调查数据处理与专题图件制作"
      },
      {
        "key": "share.title",
        "value": "分享"
      },
      {
        "key": "share.copy_link",
        "value": "复制链接"
      },
      {
        "key": "share.wechat",
        "value": "微信"
      },
      {
        "key": "share.hint",
        "value": "复制链接分享给好友，对方打开即可进入本站"
      },
      {
        "key": "share.link_label",
        "value": "分享链接"
      },
      {
        "key": "share.brand_line",
        "value": "调查数据整理与专题图件制作"
      },
      {
        "key": "share.copied_wechat",
        "value": "链接已复制，打开微信粘贴给好友或群聊"
      },
      {
        "key": "share.copied",
        "value": "分享链接已复制"
      },
      {
        "key": "home.hero.eyebrow",
        "value": "{subject} · 专题图件工作台"
      },
      {
        "key": "home.hero.title",
        "value": "数据进，图件出"
      },
      {
        "key": "home.hero.lede",
        "value": "{subject}的图件工作台——把钻孔、采样、边界、坐标，整理成可直接进报告的专题图件。"
      },
      {
        "key": "home.hero.primary",
        "value": "开始使用"
      },
      {
        "key": "home.hero.secondary",
        "value": "查看价格"
      },
      {
        "key": "home.why.eyebrow",
        "value": "为什么选择我们"
      },
      {
        "key": "home.why.title",
        "value": "简单、清楚、面向交付"
      },
      {
        "key": "home.why.lede",
        "value": "每个工具都围绕一类专题图件成果设计。"
      },
      {
        "key": "home.why.link",
        "value": "了解我们 →"
      },
      {
        "key": "home.why.lede_final",
        "value": "从数据安全、专业能力到交付方式，选择更适合项目的工具。"
      },
      {
        "key": "home.why.reason1_title",
        "value": "安全可控"
      },
      {
        "key": "home.why.reason1_desc",
        "value": "重视数据边界和处理过程，让成果使用更安心。"
      },
      {
        "key": "home.why.reason2_title",
        "value": "技业并重"
      },
      {
        "key": "home.why.reason2_desc",
        "value": "既懂空间数据技术，也理解调查项目的实际业务。"
      },
      {
        "key": "home.why.reason3_title",
        "value": "成果可交"
      },
      {
        "key": "home.why.reason3_desc",
        "value": "输出能核对、能复用、能进入报告和项目交付的成果。"
      },
      {
        "key": "home.why.reason4_title",
        "value": "灵活计费"
      },
      {
        "key": "home.why.reason4_desc",
        "value": "按工具、任务和服务方式选择，成本与项目规模匹配。"
      },
      {
        "key": "home.popular.eyebrow",
        "value": "热门工具"
      },
      {
        "key": "home.popular.title",
        "value": "先从常用成果开始"
      },
      {
        "key": "home.popular.lede",
        "value": "常用{subject}成果，一站式查看与使用。"
      },
      {
        "key": "home.popular.link",
        "value": "查看全部工具 →"
      },
      {
        "key": "home.tags.title",
        "value": "按数据内容找工具"
      },
      {
        "key": "home.tags.lede",
        "value": "边界、点位、高程、钻孔、地下水、样品、图件与数据。"
      },
      {
        "key": "home.cta.title",
        "value": "准备好开始了吗？"
      },
      {
        "key": "home.cta.lede",
        "value": "从一个明确的图件目标开始，把调查数据处理成报告可用的成果。"
      },
      {
        "key": "home.cta.primary",
        "value": "免费注册"
      },
      {
        "key": "home.cta.secondary",
        "value": "联系我们"
      },
      {
        "key": "tools.eyebrow",
        "value": "工具目录"
      },
      {
        "key": "tools.title",
        "value": "所有工具"
      },
      {
        "key": "tools.lede",
        "value": "选择一个成果，查看工具说明、使用方式和交付结果。"
      },
      {
        "key": "tools.search_placeholder",
        "value": "搜索工具..."
      },
      {
        "key": "tools.search_aria",
        "value": "搜索工具"
      },
      {
        "key": "tools.count",
        "value": "{count} 项工具"
      },
      {
        "key": "tools.empty",
        "value": "没有找到匹配的工具。"
      },
      {
        "key": "tools.empty_link",
        "value": "告诉我们你需要什么 →"
      },
      {
        "key": "tools.image_alt",
        "value": "{name}示意图"
      },
      {
        "key": "tools.preview_empty",
        "value": "暂无成果预览"
      },
      {
        "key": "tools.preview_label",
        "value": "成果预览"
      },
      {
        "key": "detail.breadcrumb_tools",
        "value": "工具"
      },
      {
        "key": "detail.capabilities",
        "value": "核心能力"
      },
      {
        "key": "detail.input",
        "value": "输入数据"
      },
      {
        "key": "detail.output",
        "value": "输出成果"
      },
      {
        "key": "detail.start",
        "value": "开始使用"
      },
      {
        "key": "detail.preparing",
        "value": "即将上线"
      },
      {
        "key": "detail.submit_request",
        "value": "提交需求"
      },
      {
        "key": "purchase.eyebrow",
        "value": "使用权益"
      },
      {
        "key": "purchase.title",
        "value": "该工具需要购买权益"
      },
      {
        "key": "purchase.lede",
        "value": "购买后即可使用，也可以先用示例数据免费体验功能。"
      },
      {
        "key": "purchase.confirm",
        "value": "购买使用"
      },
      {
        "key": "purchase.demo",
        "value": "免费体验"
      },
      {
        "key": "pricing.eyebrow",
        "value": "价格方案"
      },
      {
        "key": "pricing.title",
        "value": "简单透明的价格"
      },
      {
        "key": "pricing.lede",
        "value": "通用工具免费；出成果的工具按场地计价——一个场地买一次，7 天内改到满意。"
      },
      {
        "key": "pricing.free_button",
        "value": "查看免费工具"
      },
      {
        "key": "pricing.login_button",
        "value": "登录后选择"
      },
      {
        "key": "pricing.products_eyebrow",
        "value": "工具权益"
      },
      {
        "key": "pricing.products_title",
        "value": "选择具体工具和使用方案"
      },
      {
        "key": "pricing.products_lede",
        "value": "每个工具一个价；拿不准的先用样例数据免费体验。"
      },
      {
        "key": "pricing.loading",
        "value": "正在加载可用方案..."
      },
      {
        "key": "pricing.empty",
        "value": "当前没有可购买的工具权益。"
      },
      {
        "key": "pricing.error",
        "value": "暂时无法加载价格方案。"
      },
      {
        "key": "pricing.product_fallback",
        "value": "按所选方案创建工具使用权益"
      },
      {
        "key": "pricing.table_tool",
        "value": "工具"
      },
      {
        "key": "pricing.table_tags",
        "value": "标签"
      },
      {
        "key": "pricing.table_form",
        "value": "形态"
      },
      {
        "key": "pricing.table_billing",
        "value": "计费"
      },
      {
        "key": "pricing.table_status",
        "value": "状态"
      },
      {
        "key": "help.eyebrow",
        "value": "帮助中心"
      },
      {
        "key": "help.title",
        "value": "帮助中心"
      },
      {
        "key": "help.lede",
        "value": "工具怎么用、权益什么时候生效、结果在哪里找，都在这里说明。"
      },
      {
        "key": "help.link",
        "value": "查看说明 →"
      },
      {
        "key": "datasets.eyebrow",
        "value": "数据集"
      },
      {
        "key": "datasets.title",
        "value": "{subject}数据集"
      },
      {
        "key": "datasets.lede",
        "value": "可直接用于分析、制图和工具测试的空间数据。"
      },
      {
        "key": "datasets.search_placeholder",
        "value": "搜索数据集..."
      },
      {
        "key": "datasets.search_aria",
        "value": "搜索数据集"
      },
      {
        "key": "datasets.empty",
        "value": "没有找到匹配的数据集。"
      },
      {
        "key": "datasets.records",
        "value": "{count} 条记录"
      },
      {
        "key": "datasets.files",
        "value": "{count} 个文件"
      },
      {
        "key": "datasets.save_aria",
        "value": "收藏数据集"
      },
      {
        "key": "datasets.share_aria",
        "value": "分享数据集"
      },
      {
        "key": "datasets.stat_records",
        "value": "记录"
      },
      {
        "key": "datasets.stat_files",
        "value": "文件"
      },
      {
        "key": "datasets.stat_formats",
        "value": "格式"
      },
      {
        "key": "datasets.stat_updated",
        "value": "更新"
      },
      {
        "key": "datasets.about_section",
        "value": "关于数据集"
      },
      {
        "key": "datasets.file_section",
        "value": "文件列表"
      },
      {
        "key": "datasets.field_section",
        "value": "数据字典"
      },
      {
        "key": "datasets.preview_section",
        "value": "样例预览"
      },
      {
        "key": "datasets.download_paid",
        "value": "获取权益"
      },
      {
        "key": "datasets.download_free",
        "value": "下载示例"
      },
      {
        "key": "datasets.table_field",
        "value": "字段"
      },
      {
        "key": "datasets.table_desc",
        "value": "说明"
      },
      {
        "key": "datasets.table_type",
        "value": "类型"
      },
      {
        "key": "datasets.notice_title",
        "value": "来源与使用说明"
      },
      {
        "key": "datasets.notice_body",
        "value": "这是{brand}的示例数据，仅用于功能演示、学习和测试。正式项目请核对数据来源、坐标系、授权范围和成果适用性。"
      },
      {
        "key": "requests.eyebrow",
        "value": "需求墙"
      },
      {
        "key": "requests.title",
        "value": "需求墙"
      },
      {
        "key": "requests.lede",
        "value": "把你需要的{subject}成果告诉我们，一起把工具做得更贴近项目。"
      },
      {
        "key": "requests.submit",
        "value": "提交需求"
      },
      {
        "key": "requests.sort_newest",
        "value": "最新"
      },
      {
        "key": "requests.sort_top",
        "value": "热门"
      },
      {
        "key": "requests.mine",
        "value": "我的需求"
      },
      {
        "key": "requests.empty",
        "value": "还没有匹配的需求。"
      },
      {
        "key": "requests.empty_link",
        "value": "提交第一条需求 →"
      },
      {
        "key": "requests.modal_title",
        "value": "提交需求"
      },
      {
        "key": "requests.modal_lede",
        "value": "描述清楚你希望得到的{subject}成果。"
      },
      {
        "key": "requests.close_aria",
        "value": "关闭提交需求窗口"
      },
      {
        "key": "requests.vote_aria",
        "value": "支持 {title}"
      },
      {
        "key": "requests.tool_prefix",
        "value": "工具：{tool}"
      },
      {
        "key": "requests.field_type",
        "value": "需求类型"
      },
      {
        "key": "requests.field_title",
        "value": "需求标题"
      },
      {
        "key": "requests.field_title_placeholder",
        "value": "例如：支持批量坐标点校核"
      },
      {
        "key": "requests.field_summary",
        "value": "详细描述"
      },
      {
        "key": "requests.field_summary_placeholder",
        "value": "说明输入数据、期望结果和使用场景"
      },
      {
        "key": "requests.field_tool",
        "value": "关联工具（可选）"
      },
      {
        "key": "requests.field_tool_none",
        "value": "不关联具体工具"
      },
      {
        "key": "requests.status_need_fields",
        "value": "请填写需求标题和详细描述。"
      },
      {
        "key": "requests.added",
        "value": "需求已提交，我们会尽快评估"
      },
      {
        "key": "requests.vote_recorded",
        "value": "已记录你的支持"
      },
      {
        "key": "requests.vote_already",
        "value": "你已经支持过这条需求"
      },
      {
        "key": "about.eyebrow",
        "value": "{brand}"
      },
      {
        "key": "about.hero.title",
        "value": "关于{brand}"
      },
      {
        "key": "about.hero.lede",
        "value": "致力于把调查数据变成可直接进报告的专题图件。从边界整理、坐标处理到图件排版，每一步都能核对、能导出、能复用。"
      },
      {
        "key": "about.hero.primary",
        "value": "浏览工具"
      },
      {
        "key": "about.hero.secondary",
        "value": "联系我们"
      },
      {
        "key": "about.section_mission",
        "value": "我们的使命"
      },
      {
        "key": "about.mission.title",
        "value": "让空间数据处理，少一点反复试错"
      },
      {
        "key": "about.mission.desc",
        "value": "调查数据从采集到交付，中间往往还要经历整理、核对、转换和制图。我们把这些步骤拆成清楚的工具，让个人和团队更快得到可以继续使用的成果。"
      },
      {
        "key": "about.mission.value1_title",
        "value": "围绕交付成果"
      },
      {
        "key": "about.mission.value1_desc",
        "value": "不只处理文件格式，更关心最后能不能放进报告、图件或项目成果。"
      },
      {
        "key": "about.mission.value2_title",
        "value": "每一步都说清楚"
      },
      {
        "key": "about.mission.value2_desc",
        "value": "输入要求、处理范围、输出结果和使用限制，在开始前就能看懂。"
      },
      {
        "key": "about.mission.value3_title",
        "value": "从浏览到使用"
      },
      {
        "key": "about.mission.value3_desc",
        "value": "先看工具能完成什么，再选择合适的权益，把订单和结果放在同一个账户里。"
      },
      {
        "key": "about.section_features",
        "value": "产品特色"
      },
      {
        "key": "about.features.title",
        "value": "为真实的{subject}工作设计"
      },
      {
        "key": "about.feature1_title",
        "value": "结果导向"
      },
      {
        "key": "about.feature1_desc",
        "value": "边界成果、坐标成果、专题图件和垂向分布，每个工具都对应一个清晰结果。"
      },
      {
        "key": "about.feature2_title",
        "value": "在线使用"
      },
      {
        "key": "about.feature2_desc",
        "value": "打开浏览器即可查看说明、登录账户和进入已授权的工具服务。"
      },
      {
        "key": "about.feature3_title",
        "value": "流程可追溯"
      },
      {
        "key": "about.feature3_desc",
        "value": "订单、支付、发票和工具权益由统一账户管理，状态有记录可查询。"
      },
      {
        "key": "about.feature4_title",
        "value": "持续扩展"
      },
      {
        "key": "about.feature4_desc",
        "value": "从常用数据整理开始，逐步覆盖空间分析、地图成果和项目定制服务。"
      },
      {
        "key": "about.story.eyebrow",
        "value": "我们的故事"
      },
      {
        "key": "about.story.title",
        "value": "从“文件已经有了”到“成果可以交付”"
      },
      {
        "key": "about.story.para1",
        "value": "在{subject}里，最费时间的往往不是得到一份数据，而是把它整理成别人可以核对、软件可以继续使用、报告可以直接引用的成果。"
      },
      {
        "key": "about.story.para2",
        "value": "边界需要闭合，坐标需要统一，图层需要核对，图件需要排版；当这些工作分散在不同软件和重复操作里，项目进度就容易被细节拖慢。"
      },
      {
        "key": "about.story.note_title",
        "value": "先看清结果，再开始处理"
      },
      {
        "key": "about.story.note_desc",
        "value": "这是我们设计每个工具时最重要的判断标准。"
      },
      {
        "key": "about.story.step1_title",
        "value": "数据有了"
      },
      {
        "key": "about.story.step1_desc",
        "value": "先把边界、坐标和格式整理清楚，后面的分析才有可靠基础。"
      },
      {
        "key": "about.story.step2_title",
        "value": "成果成了"
      },
      {
        "key": "about.story.step2_desc",
        "value": "围绕实际调查任务完成分析、制图和排版，不让细节拖慢项目。"
      },
      {
        "key": "about.story.step3_title",
        "value": "可以交付"
      },
      {
        "key": "about.story.step3_desc",
        "value": "输出能核对、能复用，也能直接进入报告和项目成果。"
      },
      {
        "key": "about.section_commitments",
        "value": "我们的承诺"
      },
      {
        "key": "about.commitments.title",
        "value": "把重要的事情说清楚、做持续"
      },
      {
        "key": "about.commitment1_title",
        "value": "保护隐私"
      },
      {
        "key": "about.commitment1_desc",
        "value": "只在提供账户、订单、发票和工具服务所必需的范围内处理信息。"
      },
      {
        "key": "about.commitment2_title",
        "value": "持续改进"
      },
      {
        "key": "about.commitment2_desc",
        "value": "根据用户反馈补齐工具、优化输入输出，优先解决影响成果交付的问题。"
      },
      {
        "key": "about.commitment3_title",
        "value": "开放透明"
      },
      {
        "key": "about.commitment3_desc",
        "value": "把工具状态、权益价格和服务限制写清楚，接入中的功能如实标注。"
      },
      {
        "key": "about.commitment4_title",
        "value": "交付负责"
      },
      {
        "key": "about.commitment4_desc",
        "value": "把输入、处理范围和输出结果说清楚，持续跟进成果交付。"
      },
      {
        "key": "about.contact.eyebrow",
        "value": "联系我们"
      },
      {
        "key": "about.contact.heading",
        "value": "联系我们"
      },
      {
        "key": "about.contact.title",
        "value": "有具体的成果目标，欢迎直接告诉我们"
      },
      {
        "key": "about.contact.lede",
        "value": "工具接入、项目定制和合作咨询，都可以从一次清楚的需求沟通开始。"
      },
      {
        "key": "about.contact.direct",
        "value": "直接联系"
      },
      {
        "key": "about.contact.phone",
        "value": "电话咨询"
      },
      {
        "key": "about.contact.wechat",
        "value": "微信联系"
      },
      {
        "key": "about.contact.copy",
        "value": "复制"
      },
      {
        "key": "about.contact.follow",
        "value": "关注 {brand} 公众号"
      },
      {
        "key": "about.contact.follow_note",
        "value": "获取最新案例与技术分享"
      },
      {
        "key": "about.contact.qr_alt",
        "value": "{brand}微信公众号二维码"
      },
      {
        "key": "about.cta.title",
        "value": "开始使用{brand}"
      },
      {
        "key": "about.cta.lede",
        "value": "从一个明确的图件目标开始，把调查数据处理成报告可用的成果。"
      },
      {
        "key": "about.cta.button",
        "value": "浏览工具"
      },
      {
        "key": "auth.login_title",
        "value": "登录"
      },
      {
        "key": "auth.eyebrow",
        "value": "{brand}"
      },
      {
        "key": "auth.login_lede",
        "value": "登录后继续使用工具并查看你的账户信息。"
      },
      {
        "key": "auth.register_title",
        "value": "免费注册"
      },
      {
        "key": "auth.register_lede",
        "value": "创建账户后即可购买权益、打开工具并查看订单。"
      },
      {
        "key": "auth.forgot_title",
        "value": "找回密码"
      },
      {
        "key": "auth.forgot_lede",
        "value": "输入注册邮箱，我们会发送 6 位验证码用于重置密码。"
      },
      {
        "key": "auth.email_label",
        "value": "邮箱地址"
      },
      {
        "key": "auth.email_placeholder",
        "value": "your@email.com"
      },
      {
        "key": "auth.name_label",
        "value": "用户名（可选）"
      },
      {
        "key": "auth.name_placeholder",
        "value": "你的用户名"
      },
      {
        "key": "auth.password_label",
        "value": "密码"
      },
      {
        "key": "auth.password_placeholder",
        "value": "••••••••"
      },
      {
        "key": "auth.confirm_label",
        "value": "确认密码"
      },
      {
        "key": "auth.confirm_placeholder",
        "value": "再次输入密码"
      },
      {
        "key": "auth.remember",
        "value": "记住我"
      },
      {
        "key": "auth.forgot_link",
        "value": "忘记密码？"
      },
      {
        "key": "auth.consent_before",
        "value": "我已阅读并同意"
      },
      {
        "key": "auth.terms_link",
        "value": "服务条款"
      },
      {
        "key": "auth.consent_and",
        "value": "和"
      },
      {
        "key": "auth.privacy_link",
        "value": "隐私政策"
      },
      {
        "key": "auth.submit_register",
        "value": "注册"
      },
      {
        "key": "auth.submit_login",
        "value": "登录"
      },
      {
        "key": "auth.submit_forgot",
        "value": "找回密码"
      },
      {
        "key": "auth.divider",
        "value": "第三方账号登录"
      },
      {
        "key": "auth.provider_note",
        "value": "微信 / QQ 登录正在接入；当前请使用邮箱注册和登录。"
      },
      {
        "key": "auth.switch_have",
        "value": "已有账号？"
      },
      {
        "key": "auth.switch_none",
        "value": "没有账号？"
      },
      {
        "key": "auth.switch_login",
        "value": "去登录"
      },
      {
        "key": "auth.switch_register",
        "value": "去注册"
      },
      {
        "key": "auth.wechat_badge",
        "value": "微"
      },
      {
        "key": "auth.wechat_label",
        "value": "微信"
      },
      {
        "key": "auth.wechat_qr_login_alt",
        "value": "微信扫码登录二维码"
      },
      {
        "key": "auth.wechat_qr_login_note",
        "value": "使用微信扫描二维码登录。"
      },
      {
        "key": "auth.wechat_qr_register_alt",
        "value": "{brand} 公众号二维码"
      },
      {
        "key": "auth.wechat_qr_register_note",
        "value": "扫码关注 {brand} 公众号，关注后按提示进入本站。"
      },
      {
        "key": "auth.qq_badge",
        "value": "Q"
      },
      {
        "key": "auth.qq_label",
        "value": "QQ"
      },
      {
        "key": "auth.qq_qr_login_alt",
        "value": "QQ扫码登录二维码"
      },
      {
        "key": "auth.qq_qr_login_note",
        "value": "使用手机 QQ 扫码登录。"
      },
      {
        "key": "auth.qq_qr_register_alt",
        "value": "QQ扫码注册二维码"
      },
      {
        "key": "auth.qq_qr_register_note",
        "value": "使用手机 QQ 扫码注册。"
      },
      {
        "key": "auth.registering",
        "value": "正在创建账户..."
      },
      {
        "key": "auth.logging_in",
        "value": "正在登录..."
      },
      {
        "key": "auth.error_required",
        "value": "请填写邮箱和密码。"
      },
      {
        "key": "auth.error_email",
        "value": "请输入有效的邮箱地址。"
      },
      {
        "key": "auth.error_password",
        "value": "密码至少 8 位。"
      },
      {
        "key": "auth.error_confirm",
        "value": "两次输入的密码不一致。"
      },
      {
        "key": "auth.error_exists",
        "value": "该邮箱已注册，请直接登录。"
      },
      {
        "key": "auth.error_register",
        "value": "注册失败，请稍后重试。"
      },
      {
        "key": "auth.error_credentials",
        "value": "邮箱或密码不正确。"
      },
      {
        "key": "auth.too_many",
        "value": "尝试次数过多，请稍后再试。"
      },
      {
        "key": "auth.forgot_unavailable",
        "value": "邮箱服务暂不可用，请联系支持人员协助重置。"
      },
      {
        "key": "account.default_profile",
        "value": "{subject}用户"
      },
      {
        "key": "account.nav_overview",
        "value": "用户中心"
      },
      {
        "key": "account.nav_entitlements",
        "value": "我的权益"
      },
      {
        "key": "account.nav_orders",
        "value": "交易记录"
      },
      {
        "key": "account.nav_invoices",
        "value": "发票管理"
      },
      {
        "key": "account.nav_settings",
        "value": "个人资料"
      },
      {
        "key": "account.nav_aria",
        "value": "账户中心导航"
      },
      {
        "key": "account.eyebrow",
        "value": "用户中心"
      },
      {
        "key": "account.title",
        "value": "账户中心"
      },
      {
        "key": "account.lede",
        "value": "在这里管理你的资料、安全、权益、交易与发票。"
      },
      {
        "key": "account.badge",
        "value": "统一账户"
      },
      {
        "key": "account.continue",
        "value": "继续选工具"
      },
      {
        "key": "account.panel_lede",
        "value": "查看账户信息和服务状态。"
      },
      {
        "key": "account.loading",
        "value": "正在读取账户数据..."
      },
      {
        "key": "account.profile_display_name",
        "value": "显示名称"
      },
      {
        "key": "account.profile_email",
        "value": "邮箱地址"
      },
      {
        "key": "account.profile_auth",
        "value": "认证方式"
      },
      {
        "key": "account.profile_save",
        "value": "保存资料"
      },
      {
        "key": "account.profile_saved",
        "value": "资料已保存。"
      },
      {
        "key": "account.profile_saving",
        "value": "正在保存..."
      },
      {
        "key": "account.profile_need_name",
        "value": "请填写显示名称。"
      },
      {
        "key": "account.profile_failed",
        "value": "保存失败，请稍后重试。"
      },
      {
        "key": "account.password_title",
        "value": "修改密码"
      },
      {
        "key": "account.password_current",
        "value": "当前密码"
      },
      {
        "key": "account.password_new",
        "value": "新密码"
      },
      {
        "key": "account.password_confirm",
        "value": "确认新密码"
      },
      {
        "key": "account.password_placeholder",
        "value": "至少 8 位"
      },
      {
        "key": "account.password_submit",
        "value": "更新密码"
      },
      {
        "key": "account.password_saving",
        "value": "正在更新密码..."
      },
      {
        "key": "account.password_saved",
        "value": "密码已更新。"
      },
      {
        "key": "account.password_required",
        "value": "请填写当前密码和新密码。"
      },
      {
        "key": "account.password_short",
        "value": "新密码至少 8 位。"
      },
      {
        "key": "account.password_mismatch",
        "value": "两次输入的新密码不一致。"
      },
      {
        "key": "account.password_current_invalid",
        "value": "当前密码不正确。"
      },
      {
        "key": "account.password_failed",
        "value": "密码更新失败，请稍后重试。"
      },
      {
        "key": "account.session_expired",
        "value": "登录状态已失效，请重新登录。"
      },
      {
        "key": "account.email_fallback",
        "value": "统一账户服务管理"
      },
      {
        "key": "account.email_reading",
        "value": "读取中..."
      },
      {
        "key": "account.synced",
        "value": "账户数据已同步。"
      },
      {
        "key": "account.no_orders_hint",
        "value": "还没有订单，先去查看工具权益。"
      },
      {
        "key": "account.stat_orders",
        "value": "订单数量"
      },
      {
        "key": "account.stat_entitlements",
        "value": "可用权益"
      },
      {
        "key": "account.stat_invoices",
        "value": "发票申请"
      },
      {
        "key": "account.orders_empty",
        "value": "还没有订单。"
      },
      {
        "key": "account.orders_empty_link",
        "value": "先去查看工具权益 →"
      },
      {
        "key": "account.orders_table_no",
        "value": "订单号"
      },
      {
        "key": "account.orders_table_amount",
        "value": "金额"
      },
      {
        "key": "account.orders_table_status",
        "value": "状态"
      },
      {
        "key": "account.orders_table_created",
        "value": "创建时间"
      },
      {
        "key": "account.orders_table_action",
        "value": "操作"
      },
      {
        "key": "account.order_pay",
        "value": "继续支付"
      },
      {
        "key": "account.entitlements_empty",
        "value": "购买工具权益后，会在这里显示可使用的工具和有效期。"
      },
      {
        "key": "account.entitlements_empty_link",
        "value": "查看可用方案 →"
      },
      {
        "key": "account.entitlements_table_feature",
        "value": "工具权益"
      },
      {
        "key": "account.entitlements_table_status",
        "value": "状态"
      },
      {
        "key": "account.entitlements_table_period",
        "value": "有效期"
      },
      {
        "key": "account.entitlements_table_quota",
        "value": "剩余次数"
      },
      {
        "key": "account.entitlements_by_count",
        "value": "按次数"
      },
      {
        "key": "account.entitlements_unlimited",
        "value": "不限"
      },
      {
        "key": "account.invoices_empty",
        "value": "还没有发票申请。"
      },
      {
        "key": "account.invoices_table_no",
        "value": "发票申请"
      },
      {
        "key": "account.invoices_table_order",
        "value": "订单号"
      },
      {
        "key": "account.invoices_table_amount",
        "value": "金额"
      },
      {
        "key": "account.invoices_table_status",
        "value": "状态"
      },
      {
        "key": "account.invoice_form_title",
        "value": "申请发票"
      },
      {
        "key": "account.invoice_order",
        "value": "订单"
      },
      {
        "key": "account.invoice_order_placeholder",
        "value": "请选择已支付订单"
      },
      {
        "key": "account.invoice_type",
        "value": "发票类型"
      },
      {
        "key": "account.invoice_type_company",
        "value": "企业"
      },
      {
        "key": "account.invoice_type_personal",
        "value": "个人"
      },
      {
        "key": "account.invoice_title",
        "value": "发票抬头"
      },
      {
        "key": "account.invoice_tax_no",
        "value": "税号（企业发票必填）"
      },
      {
        "key": "account.invoice_email",
        "value": "接收邮箱"
      },
      {
        "key": "account.invoice_submit",
        "value": "提交发票申请"
      },
      {
        "key": "account.invoice_submitting",
        "value": "正在提交..."
      },
      {
        "key": "account.invoice_submitted",
        "value": "发票申请已提交。"
      },
      {
        "key": "account.invoice_failed",
        "value": "提交失败，请检查订单和发票信息。"
      },
      {
        "key": "account.error_unauthorized",
        "value": "登录后才能查看账户信息。"
      },
      {
        "key": "account.error_load",
        "value": "账户数据暂时无法加载。"
      },
      {
        "key": "toast.order_creating",
        "value": "订单正在创建，请稍候"
      },
      {
        "key": "toast.order_busy",
        "value": "订单正在处理，请稍候"
      },
      {
        "key": "toast.order_failed",
        "value": "订单创建失败，请稍后重试"
      },
      {
        "key": "toast.order_created_pay",
        "value": "订单 {order} 已创建，请按支付指引完成付款"
      },
      {
        "key": "toast.order_created_no_channel",
        "value": "订单 {order} 已创建，支付通道尚未配置"
      },
      {
        "key": "toast.order_pay_flow",
        "value": "订单 {order} 已进入支付流程"
      },
      {
        "key": "toast.pay_no_channel",
        "value": "支付通道尚未配置，请稍后重试"
      },
      {
        "key": "toast.pay_failed",
        "value": "支付暂时无法继续，请稍后重试"
      },
      {
        "key": "toast.paid",
        "value": "支付完成，工具权益已写入账户"
      },
      {
        "key": "toast.tool_preparing",
        "value": "该工具正在接入，请先联系我们。"
      },
      {
        "key": "toast.tool_no_account",
        "value": "该工具尚未接入账户服务。"
      },
      {
        "key": "toast.account_not_ready",
        "value": "账户服务未接入，暂时无法打开工具。"
      },
      {
        "key": "toast.tool_unavailable",
        "value": "工具入口暂时不可用"
      },
      {
        "key": "toast.dataset_saved",
        "value": "已加入收藏（演示状态）"
      },
      {
        "key": "toast.dataset_shared",
        "value": "数据集链接已准备分享"
      },
      {
        "key": "toast.dataset_download",
        "value": "下载失败，请稍后重试。"
      },
      {
        "key": "toast.contact_copied",
        "value": "联系方式已复制"
      },
      {
        "key": "toast.request_failed",
        "value": "请求失败（{status}）"
      },
      {
        "key": "legal.privacy.eyebrow",
        "value": "隐私政策"
      },
      {
        "key": "legal.privacy.title",
        "value": "FigHub 隐私政策"
      },
      {
        "key": "legal.privacy.s1",
        "value": "数据处理"
      },
      {
        "key": "legal.privacy.body1",
        "value": "我们只在提供工具、账户、订单、发票和权益服务所必需的范围内处理信息。具体文件处理方式以工具详情页说明为准。"
      },
      {
        "key": "legal.privacy.s2",
        "value": "账户信息"
      },
      {
        "key": "legal.auth_note",
        "value": "身份认证由统一账户服务完成，前台不会保存你的密码。付费权益只有在服务端确认后才会发放。"
      },
      {
        "key": "legal.terms.eyebrow",
        "value": "服务条款"
      },
      {
        "key": "legal.terms.title",
        "value": "FigHub 服务条款"
      },
      {
        "key": "legal.terms.s1",
        "value": "服务范围"
      },
      {
        "key": "legal.terms.body1",
        "value": "{brand}提供在线工具、账户和相关服务。不同工具的输入要求、输出结果和有效期以页面及服务端记录为准。"
      },
      {
        "key": "legal.terms.s2",
        "value": "账户与权益"
      },
      {
        "key": "legal.lede",
        "value": "以下内容说明我们的服务范围与账户规则，以及信息的收集与保护方式，请在使用前阅读。"
      },
      {
        "key": "admin.title",
        "value": "运营管理台"
      },
      {
        "key": "admin.login_title",
        "value": "管理口令登录"
      },
      {
        "key": "admin.login_lede",
        "value": "管理台使用独立口令，与站点用户账号体系无关。"
      },
      {
        "key": "admin.password_label",
        "value": "管理口令"
      },
      {
        "key": "admin.login_submit",
        "value": "进入管理台"
      },
      {
        "key": "admin.login_failed",
        "value": "口令不正确"
      },
      {
        "key": "admin.loading",
        "value": "正在加载..."
      },
      {
        "key": "admin.load_failed",
        "value": "加载失败，请稍后重试"
      },
      {
        "key": "admin.disabled",
        "value": "管理台未配置口令（PORTAL_ADMIN_PASSWORD），当前不可用。"
      },
      {
        "key": "admin.back_site",
        "value": "返回站点"
      },
      {
        "key": "admin.logout",
        "value": "退出管理台"
      },
      {
        "key": "admin.nav_tools",
        "value": "工具管理"
      },
      {
        "key": "admin.nav_tags",
        "value": "标签管理"
      },
      {
        "key": "admin.nav_stats",
        "value": "运营统计"
      },
      {
        "key": "admin.tools_count",
        "value": "共 {count} 个工具"
      },
      {
        "key": "admin.tools_add",
        "value": "新增工具"
      },
      {
        "key": "admin.tools_edit_title",
        "value": "编辑工具"
      },
      {
        "key": "admin.tools_new_title",
        "value": "新增工具"
      },
      {
        "key": "admin.field_slug",
        "value": "标识 slug"
      },
      {
        "key": "admin.field_tool_code",
        "value": "后端工具编码 tool_code"
      },
      {
        "key": "admin.field_route",
        "value": "后端路由 route"
      },
      {
        "key": "admin.field_name",
        "value": "名称"
      },
      {
        "key": "admin.field_subtitle",
        "value": "一句话说明"
      },
      {
        "key": "admin.field_tags",
        "value": "标签"
      },
      {
        "key": "admin.field_form",
        "value": "形态"
      },
      {
        "key": "admin.field_billing",
        "value": "计费"
      },
      {
        "key": "admin.field_sort",
        "value": "排序"
      },
      {
        "key": "admin.field_flags",
        "value": "状态"
      },
      {
        "key": "admin.field_available",
        "value": "上线"
      },
      {
        "key": "admin.field_featured",
        "value": "首页热门"
      },
      {
        "key": "admin.field_image",
        "value": "预览图"
      },
      {
        "key": "admin.field_video",
        "value": "演示视频"
      },
      {
        "key": "admin.field_input",
        "value": "输入说明"
      },
      {
        "key": "admin.field_output",
        "value": "输出成果"
      },
      {
        "key": "admin.field_capabilities",
        "value": "核心能力（| 分隔）"
      },
      {
        "key": "admin.col_tool",
        "value": "工具"
      },
      {
        "key": "admin.col_tags",
        "value": "标签"
      },
      {
        "key": "admin.col_form",
        "value": "形态"
      },
      {
        "key": "admin.col_billing",
        "value": "计费"
      },
      {
        "key": "admin.col_status",
        "value": "状态"
      },
      {
        "key": "admin.col_sort",
        "value": "排序"
      },
      {
        "key": "admin.col_featured",
        "value": "热门"
      },
      {
        "key": "admin.col_catalog",
        "value": "后端目录"
      },
      {
        "key": "admin.col_actions",
        "value": "操作"
      },
      {
        "key": "admin.edit",
        "value": "编辑"
      },
      {
        "key": "admin.delete",
        "value": "删除"
      },
      {
        "key": "admin.save",
        "value": "保存"
      },
      {
        "key": "admin.saving",
        "value": "正在保存并重建站点内容..."
      },
      {
        "key": "admin.saved",
        "value": "已保存并重新生成站点内容"
      },
      {
        "key": "admin.save_failed",
        "value": "保存失败"
      },
      {
        "key": "admin.delete_confirm",
        "value": "确认删除？删除后会立即重建站点内容。"
      },
      {
        "key": "admin.move_up",
        "value": "上移"
      },
      {
        "key": "admin.move_down",
        "value": "下移"
      },
      {
        "key": "admin.changes_title",
        "value": "最近变更"
      },
      {
        "key": "admin.catalog_registered",
        "value": "已注册"
      },
      {
        "key": "admin.catalog_missing",
        "value": "未注册"
      },
      {
        "key": "admin.tags_count",
        "value": "共 {count} 个标签"
      },
      {
        "key": "admin.tags_add",
        "value": "新增标签"
      },
      {
        "key": "admin.tags_edit_title",
        "value": "编辑标签"
      },
      {
        "key": "admin.tags_new_title",
        "value": "新增标签"
      },
      {
        "key": "admin.tags_key",
        "value": "标签 key"
      },
      {
        "key": "admin.tags_icon",
        "value": "图标"
      },
      {
        "key": "admin.tags_name",
        "value": "名称"
      },
      {
        "key": "admin.tags_description",
        "value": "说明"
      },
      {
        "key": "admin.stats_empty",
        "value": "暂无数据"
      },
      {
        "key": "admin.stats_range",
        "value": "最近 {days} 天"
      },
      {
        "key": "admin.stats_views",
        "value": "浏览量"
      },
      {
        "key": "admin.stats_visitors",
        "value": "访客数"
      },
      {
        "key": "admin.stats_registrations",
        "value": "注册"
      },
      {
        "key": "admin.stats_logins",
        "value": "登录"
      },
      {
        "key": "admin.stats_orders",
        "value": "订单"
      },
      {
        "key": "admin.stats_paid",
        "value": "支付"
      },
      {
        "key": "admin.stats_gmv",
        "value": "成交金额"
      },
      {
        "key": "admin.stats_invoices",
        "value": "发票申请"
      },
      {
        "key": "admin.stats_by_day",
        "value": "每日浏览"
      },
      {
        "key": "admin.stats_top_pages",
        "value": "热门页面"
      },
      {
        "key": "admin.stats_top_tools",
        "value": "热门工具"
      },
      {
        "key": "pricing.price_from",
        "value": "{price} 起"
      },
      {
        "key": "admin.family_help",
        "value": "帮助中心"
      },
      {
        "key": "admin.family_plans",
        "value": "价格方案"
      },
      {
        "key": "admin.family_requests",
        "value": "需求墙"
      },
      {
        "key": "admin.family_datasets",
        "value": "数据集"
      },
      {
        "key": "admin.family_site",
        "value": "站点设置"
      },
      {
        "key": "admin.family_labels",
        "value": "枚举文案"
      },
      {
        "key": "admin.price_plan_missing",
        "value": "后端未找到该计划"
      },
      {
        "key": "admin.col_key",
        "value": "key"
      },
      {
        "key": "admin.col_title",
        "value": "标题"
      },
      {
        "key": "admin.col_href",
        "value": "跳转"
      },
      {
        "key": "admin.col_name",
        "value": "名称"
      },
      {
        "key": "admin.col_label",
        "value": "类别"
      },
      {
        "key": "admin.col_price",
        "value": "价格（以后端为准）"
      },
      {
        "key": "admin.col_request_type",
        "value": "类型"
      },
      {
        "key": "admin.col_votes",
        "value": "票数"
      },
      {
        "key": "admin.col_time",
        "value": "时间"
      },
      {
        "key": "admin.col_value",
        "value": "值"
      },
      {
        "key": "admin.col_group",
        "value": "分组"
      },
      {
        "key": "admin.col_type",
        "value": "类型"
      },
      {
        "key": "admin.col_access",
        "value": "访问"
      },
      {
        "key": "admin.dataset_file_rows",
        "value": "文件行"
      },
      {
        "key": "admin.dataset_field_rows",
        "value": "字段行"
      },
      {
        "key": "admin.dataset_preview_rows",
        "value": "预览行"
      },
      {
        "key": "admin.field_key",
        "value": "key"
      },
      {
        "key": "admin.field_title",
        "value": "标题"
      },
      {
        "key": "admin.field_copy",
        "value": "说明"
      },
      {
        "key": "admin.field_href",
        "value": "跳转地址"
      },
      {
        "key": "admin.field_label",
        "value": "类别（免费/付费）"
      },
      {
        "key": "admin.field_price",
        "value": "兜底价格文案"
      },
      {
        "key": "admin.field_price_plan",
        "value": "后端计划编码"
      },
      {
        "key": "admin.field_note",
        "value": "适用说明"
      },
      {
        "key": "admin.field_features",
        "value": "包含内容（| 分隔）"
      },
      {
        "key": "admin.plans_paid_label",
        "value": "付费"
      },
      {
        "key": "admin.field_request_id",
        "value": "需求 id"
      },
      {
        "key": "admin.field_request_type",
        "value": "需求类型"
      },
      {
        "key": "admin.field_status",
        "value": "需求状态"
      },
      {
        "key": "admin.field_votes",
        "value": "票数"
      },
      {
        "key": "admin.field_author",
        "value": "提交人"
      },
      {
        "key": "admin.field_time",
        "value": "提交日期"
      },
      {
        "key": "admin.field_tool",
        "value": "关联工具"
      },
      {
        "key": "admin.field_summary",
        "value": "描述"
      },
      {
        "key": "admin.requests_default_author",
        "value": "运营录入"
      },
      {
        "key": "admin.field_value",
        "value": "值"
      },
      {
        "key": "admin.field_group",
        "value": "分组"
      },
      {
        "key": "admin.rows_count",
        "value": "共 {count} 条{name}"
      },
      {
        "key": "admin.row_new",
        "value": "新增{name}"
      },
      {
        "key": "admin.row_edit_title",
        "value": "编辑{name}"
      },
      {
        "key": "admin.row_new_title",
        "value": "新增{name}"
      },
      {
        "key": "admin.dataset_files",
        "value": "数据文件"
      },
      {
        "key": "admin.dataset_add_file",
        "value": "+ 添加文件"
      },
      {
        "key": "admin.dataset_file_name",
        "value": "文件名称"
      },
      {
        "key": "admin.dataset_file_meta",
        "value": "文件说明"
      },
      {
        "key": "admin.dataset_fields",
        "value": "字段表"
      },
      {
        "key": "admin.dataset_add_field",
        "value": "+ 添加字段"
      },
      {
        "key": "admin.dataset_field_name",
        "value": "字段名"
      },
      {
        "key": "admin.dataset_field_desc",
        "value": "字段说明"
      },
      {
        "key": "admin.dataset_field_type",
        "value": "字段类型"
      },
      {
        "key": "admin.dataset_preview",
        "value": "预览数据"
      },
      {
        "key": "admin.dataset_add_preview",
        "value": "+ 添加预览行"
      },
      {
        "key": "admin.dataset_value1",
        "value": "第 1 列"
      },
      {
        "key": "admin.dataset_value2",
        "value": "第 2 列"
      },
      {
        "key": "admin.dataset_value3",
        "value": "第 3 列"
      },
      {
        "key": "admin.dataset_value4",
        "value": "第 4 列"
      },
      {
        "key": "admin.sub_remove",
        "value": "删除该行"
      },
      {
        "key": "admin.dataset_id",
        "value": "数据集 id"
      },
      {
        "key": "admin.dataset_type",
        "value": "类型（行政区划/点位数据等）"
      },
      {
        "key": "admin.dataset_icon",
        "value": "图标"
      },
      {
        "key": "admin.dataset_access",
        "value": "访问方式"
      },
      {
        "key": "admin.dataset_access_label",
        "value": "访问标签"
      },
      {
        "key": "admin.dataset_records",
        "value": "记录数文案"
      },
      {
        "key": "admin.dataset_files_count",
        "value": "文件数"
      },
      {
        "key": "admin.dataset_formats",
        "value": "格式"
      },
      {
        "key": "admin.dataset_updated",
        "value": "更新时间"
      },
      {
        "key": "admin.dataset_description",
        "value": "一句话说明"
      },
      {
        "key": "admin.dataset_about",
        "value": "数据集说明"
      },
      {
        "key": "admin.dataset_access_paid",
        "value": "权益下载"
      },
      {
        "key": "admin.dataset_access_free",
        "value": "公开示例"
      },
      {
        "key": "admin.dataset_placeholder_hint",
        "value": "文案中的 {subject} / {brand} 会在发布时替换为站点设置里的主题词与品牌名"
      },
      {
        "key": "pricing.choose_button",
        "value": "选择方案"
      },
      {
        "key": "pricing.recommended",
        "value": "推荐"
      },
      {
        "key": "pricing.free_use",
        "value": "免费使用"
      },
      {
        "key": "pricing.custom_button",
        "value": "联系定制"
      },
      {
        "key": "pricing.plan_pending",
        "value": "服务接入中"
      },
      {
        "key": "pricing.confirm_title",
        "value": "确认购买权益"
      },
      {
        "key": "pricing.confirm_lede",
        "value": "确认工具与方案后进入支付，支付成功权益写入账户。"
      },
      {
        "key": "pricing.confirm_tool",
        "value": "工具"
      },
      {
        "key": "pricing.confirm_plan",
        "value": "方案"
      },
      {
        "key": "pricing.confirm_amount",
        "value": "金额"
      },
      {
        "key": "pricing.confirm_dev_note",
        "value": "当前是开发支付通道，仅演示流程，不会真实扣款。"
      },
      {
        "key": "pricing.confirm_submit",
        "value": "去支付"
      },
      {
        "key": "pricing.mode_site_title",
        "value": "按场地计价"
      },
      {
        "key": "pricing.mode_site_desc",
        "value": "固定成果工具：一次购买对应一个场地的一份成果。适合偶尔做项目、用一个买一个。"
      },
      {
        "key": "pricing.mode_free_title",
        "value": "通用工具免费"
      },
      {
        "key": "pricing.mode_free_desc",
        "value": "坐标处理、格式转换、成果查看、图件排版，注册即可用。适合所有用户的日常处理。"
      },
      {
        "key": "pricing.mode_custom_title",
        "value": "定制服务"
      },
      {
        "key": "pricing.mode_custom_desc",
        "value": "整项目交付与特殊成果，按项目单独报价。适合整包外协或特殊成果。"
      },
      {
        "key": "pricing.group_site",
        "value": "按场地计价"
      },
      {
        "key": "pricing.group_free",
        "value": "免费工具"
      },
      {
        "key": "pricing.group_custom",
        "value": "定制服务"
      },
      {
        "key": "pricing.per_site",
        "value": "/ 场地"
      },
      {
        "key": "pricing.trial_button",
        "value": "免费体验"
      },
      {
        "key": "pricing.first_price_tag",
        "value": "首发价"
      },
      {
        "key": "pricing.rules_title",
        "value": "计费规则"
      },
      {
        "key": "pricing.rule1",
        "value": "按场地计价：一次购买对应一个场地的一份成果。"
      },
      {
        "key": "pricing.rule2",
        "value": "通用工具永久免费：坐标处理、格式转换、成果查看、图件排版。"
      },
      {
        "key": "pricing.rule3",
        "value": "收费工具都可以先用网站自带样例数据免费体验，不需要上传自己的数据。"
      },
      {
        "key": "pricing.rule4",
        "value": "更换场地或更换数据需要重新购买；同一场地在复算窗口内（普通 7 天 / VIP 30 天）重复出成果不再收费。"
      },
      {
        "key": "pricing.rule5",
        "value": "支持开具发票；成果不达交付要求可以联系我们重做。"
      },
      {
        "key": "admin.family_products",
        "value": "计费产品"
      },
      {
        "key": "admin.family_billing_plans",
        "value": "计费方案"
      },
      {
        "key": "admin.col_product",
        "value": "所属产品"
      },
      {
        "key": "admin.field_description",
        "value": "产品说明"
      },
      {
        "key": "admin.field_price_cents",
        "value": "价格（分）"
      },
      {
        "key": "admin.field_list_price_cents",
        "value": "划线价（分，0 表示不展示）"
      },
      {
        "key": "admin.field_feature_codes",
        "value": "功能码（| 分隔）"
      },
      {
        "key": "admin.field_quota_total",
        "value": "包含次数（空 = 不限）"
      },
      {
        "key": "admin.field_duration_days",
        "value": "有效天数（空 = 按次）"
      },
      {
        "key": "admin.field_max_file",
        "value": "单文件上限（MB）"
      },
      {
        "key": "admin.field_max_runtime",
        "value": "单次运行上限（秒）"
      },
      {
        "key": "admin.field_concurrency",
        "value": "并发数"
      },
      {
        "key": "admin.field_export_enabled",
        "value": "允许导出成果"
      },
      {
        "key": "admin.field_activation_required",
        "value": "首次上传激活"
      },
      {
        "key": "admin.enabled_on",
        "value": "启用中"
      },
      {
        "key": "admin.enabled_off",
        "value": "已停用"
      },
      {
        "key": "admin.plan_default_name",
        "value": "单次使用"
      },
      {
        "key": "admin.family_sites",
        "value": "场地台账"
      },
      {
        "key": "admin.sites_count",
        "value": "共 {count} 个场地"
      },
      {
        "key": "admin.site_col_site",
        "value": "场地"
      },
      {
        "key": "admin.site_col_user",
        "value": "用户"
      },
      {
        "key": "admin.site_col_window",
        "value": "复算窗口"
      },
      {
        "key": "admin.window_none",
        "value": "已过期"
      },
      {
        "key": "admin.runs_title",
        "value": "最近运行"
      },
      {
        "key": "admin.site_col_decision",
        "value": "判定"
      },
      {
        "key": "admin.site_col_reason",
        "value": "原因"
      },
      {
        "key": "admin.decision_covered",
        "value": "放行"
      },
      {
        "key": "admin.decision_purchase",
        "value": "需购买"
      },
      {
        "key": "admin.col_runs",
        "value": "运行次数"
      },
      {
        "key": "pricing.membership_eyebrow",
        "value": "VIP"
      },
      {
        "key": "pricing.member_active",
        "value": "已开通"
      },
      {
        "key": "pricing.member_benefit1",
        "value": "全线工具 8 折"
      },
      {
        "key": "pricing.member_benefit2",
        "value": "每年 3 次高价值工具额度"
      },
      {
        "key": "pricing.member_benefit3",
        "value": "场地复算窗口延长到 30 天"
      },
      {
        "key": "pricing.member_price_tag",
        "value": "VIP价"
      },
      {
        "key": "pricing.redeem_button",
        "value": "用 VIP 额度兑换（剩余 {count} 次）"
      },
      {
        "key": "pricing.redeem_done",
        "value": "已用 VIP 额度兑换，权益已写入账户"
      },
      {
        "key": "pricing.share_title",
        "value": "分享赚次数"
      },
      {
        "key": "pricing.share_lede",
        "value": "生成分享卡立得 1 次免费额度；好友通过链接注册后，你再得 1 次正式额度。"
      },
      {
        "key": "pricing.share_lifetime",
        "value": "每人每天 1 次、累计 3 次；额度可用于单次价值 ≤ ¥169 的工具方案。"
      },
      {
        "key": "pricing.share_button",
        "value": "生成分享卡"
      },
      {
        "key": "pricing.share_granted",
        "value": "已获得 {count} 次免费额度（当前剩余 {balance} 次）"
      },
      {
        "key": "pricing.share_limited",
        "value": "今天已领过，明天再来"
      },
      {
        "key": "pricing.share_copy",
        "value": "复制链接"
      },
      {
        "key": "pricing.trial_note",
        "value": "（样例数据）"
      },
      {
        "key": "pricing.plans_eyebrow",
        "value": "价格方案"
      },
      {
        "key": "pricing.plans_title",
        "value": "怎么收费"
      },
      {
        "key": "pricing.plans_lede",
        "value": "固定成果才收费，其余免费。"
      },
      {
        "key": "pricing.jump_to_tools",
        "value": "直接看工具价格 ↓"
      },
      {
        "key": "pricing.triage_title",
        "value": "哪种方式适合你？"
      },
      {
        "key": "pricing.triage_lede",
        "value": "三条路，选一条直接看。"
      },
      {
        "key": "pricing.triage_occasional_title",
        "value": "偶尔做项目"
      },
      {
        "key": "pricing.triage_occasional_desc",
        "value": "用一个买一个，直接看工具价格。"
      },
      {
        "key": "pricing.triage_regular_title",
        "value": "经常做项目"
      },
      {
        "key": "pricing.triage_regular_desc",
        "value": "先看 VIP 对照，判断值不值。"
      },
      {
        "key": "pricing.triage_try_title",
        "value": "还没决定"
      },
      {
        "key": "pricing.triage_try_desc",
        "value": "先用样例数据免费体验试试。"
      },
      {
        "key": "pricing.pro_eyebrow",
        "value": "VIP"
      },
      {
        "key": "pricing.pro_title",
        "value": "经常做项目，VIP 更省"
      },
      {
        "key": "pricing.pro_lede",
        "value": "同一份权益，VIP 价更低、复算窗口更长。"
      },
      {
        "key": "pricing.pro_suitable",
        "value": "适合：一年要用 5 次以上工具的人。"
      },
      {
        "key": "pricing.pro_saving",
        "value": "一年用 5 次（均价约 ¥70）约 ¥350；VIP ¥299 且含 3 次额度，用得多更省。"
      },
      {
        "key": "pricing.pro_col_item",
        "value": "对比项"
      },
      {
        "key": "pricing.pro_col_payg",
        "value": "按需购买"
      },
      {
        "key": "pricing.pro_col_pro",
        "value": "VIP会员"
      },
      {
        "key": "pricing.pro_row_price",
        "value": "单次价格"
      },
      {
        "key": "pricing.pro_price_payg",
        "value": "¥19–99 / 场地"
      },
      {
        "key": "pricing.pro_price_pro",
        "value": "8 折（再叠加额度）"
      },
      {
        "key": "pricing.pro_row_window",
        "value": "场地复算窗口"
      },
      {
        "key": "pricing.pro_window_payg",
        "value": "7 天"
      },
      {
        "key": "pricing.pro_window_pro",
        "value": "30 天"
      },
      {
        "key": "pricing.pro_row_credits",
        "value": "赠送额度"
      },
      {
        "key": "pricing.pro_credits_payg",
        "value": "无"
      },
      {
        "key": "pricing.pro_credits_pro",
        "value": "每年 3 次"
      },
      {
        "key": "pricing.pro_row_invoice",
        "value": "发票与报销"
      },
      {
        "key": "pricing.pro_invoice_payg",
        "value": "支持"
      },
      {
        "key": "pricing.pro_invoice_pro",
        "value": "支持"
      },
      {
        "key": "pricing.pro_row_custom",
        "value": "定制服务"
      },
      {
        "key": "pricing.pro_custom_payg",
        "value": "按项目报价"
      },
      {
        "key": "pricing.pro_custom_pro",
        "value": "95 折"
      },
      {
        "key": "pricing.share_eyebrow",
        "value": "分享"
      },
      {
        "key": "pricing.share_steps_title",
        "value": "邀请同事，双方得额度"
      },
      {
        "key": "pricing.share_step1_title",
        "value": "生成分享卡"
      },
      {
        "key": "pricing.share_step1_desc",
        "value": "一键生成你的专属链接。"
      },
      {
        "key": "pricing.share_step2_title",
        "value": "发给同事或群"
      },
      {
        "key": "pricing.share_step2_desc",
        "value": "链接可直接发微信、群聊。"
      },
      {
        "key": "pricing.share_step3_title",
        "value": "好友注册到账"
      },
      {
        "key": "pricing.share_step3_desc",
        "value": "你的正式额度 +1，好友也得 1 次。"
      },
      {
        "key": "pricing.faq_eyebrow",
        "value": "规则"
      },
      {
        "key": "pricing.faq_title",
        "value": "关于计费的常见问题"
      },
      {
        "key": "pricing.faq1_q",
        "value": "买一次能用几次？"
      },
      {
        "key": "pricing.faq1_a",
        "value": "一次购买对应一个场地的一份成果；同一场地在 7 天内（VIP 会员 30 天）反复调整不再收费。"
      },
      {
        "key": "pricing.faq2_q",
        "value": "换数据或换场地要再买吗？"
      },
      {
        "key": "pricing.faq2_a",
        "value": "要。换场地或换一套数据视为新的成果，需要重新购买。"
      },
      {
        "key": "pricing.faq3_q",
        "value": "能开发票吗？"
      },
      {
        "key": "pricing.faq3_a",
        "value": "支持。登录后在用户中心提交发票申请。"
      },
      {
        "key": "pricing.faq4_q",
        "value": "成果不达交付要求怎么办？"
      },
      {
        "key": "pricing.faq4_a",
        "value": "联系我们，协助重做一次。"
      },
      {
        "key": "pricing.faq5_q",
        "value": "通用工具为什么免费？"
      },
      {
        "key": "pricing.faq5_a",
        "value": "坐标处理、格式转换、成果查看、图件排版属于通用能力，注册即可用；只有固定数据输入、固定专题输出的工具收费。"
      },
      {
        "key": "pricing.share_give",
        "value": "生成分享卡立得免费额度；好友注册后你再得一次分享奖励，好友也得 1 次新人额度；VIP 奖励双倍。"
      },
      {
        "key": "pricing.mode_line",
        "value": "通用工具免费 · 固定成果工具按场地计价 {price} 起 · 整项目定制报价"
      },
      {
        "key": "pricing.compare_payg_title",
        "value": "按需购买"
      },
      {
        "key": "pricing.compare_payg_desc",
        "value": "用一个买一个，用到哪买到哪。"
      },
      {
        "key": "pricing.compare_payg_action",
        "value": "看工具价格"
      },
      {
        "key": "pricing.compare_pro_badge",
        "value": "更省"
      },
      {
        "key": "pricing.compare_pro_price",
        "value": "¥299 / 年（划线 ¥399，折合每天不到 ¥1）"
      },
      {
        "key": "pricing.compare_pro_action",
        "value": "开通 VIP"
      },
      {
        "key": "pricing.compare_none",
        "value": "—"
      },
      {
        "key": "pricing.compare_footnote",
        "value": "发票与报销两边都支持；一年用 5 次（均价约 ¥70）约 ¥350，VIP ¥299 且含 3 次额度。"
      },
      {
        "key": "pricing.faq_more",
        "value": "更多问题 → 帮助中心"
      },
      {
        "key": "pricing.compare_pro_title",
        "value": "VIP会员"
      },
      {
        "key": "pricing.mode_free_line",
        "value": "免费，注册即用"
      },
      {
        "key": "pricing.mode_site_line",
        "value": "固定成果工具按场地计价"
      },
      {
        "key": "pricing.mode_custom_line_title",
        "value": "按项目报价"
      },
      {
        "key": "pricing.mode_custom_line",
        "value": "整项目定制服务"
      },
      {
        "key": "pricing.compare_title",
        "value": "三种使用方式"
      },
      {
        "key": "pricing.compare_lede",
        "value": "注册就是会员，工具按需购买；经常做项目，开通 VIP 更省。"
      },
      {
        "key": "pricing.compare_col_share",
        "value": "分享卡（免费使用）"
      },
      {
        "key": "pricing.compare_col_payg",
        "value": "按需使用"
      },
      {
        "key": "pricing.compare_row_cost",
        "value": "费用"
      },
      {
        "key": "pricing.compare_row_free",
        "value": "免费工具"
      },
      {
        "key": "pricing.compare_row_paid",
        "value": "付费工具"
      },
      {
        "key": "pricing.compare_row_custom",
        "value": "定制项目"
      },
      {
        "key": "pricing.compare_row_suitable",
        "value": "适合谁"
      },
      {
        "key": "pricing.compare_free_use",
        "value": "直接用"
      },
      {
        "key": "pricing.compare_cost_share",
        "value": "0 元"
      },
      {
        "key": "pricing.compare_paid_share",
        "value": "额度 0 元兑换 ≤¥169 方案"
      },
      {
        "key": "pricing.compare_paid_payg",
        "value": "单次购买，含 1 份成果"
      },
      {
        "key": "pricing.compare_paid_pro",
        "value": "8 折 + 每年 3 次额度"
      },
      {
        "key": "pricing.compare_suitable_share",
        "value": "还没决定，想先看成果"
      },
      {
        "key": "pricing.compare_suitable_payg",
        "value": "偶尔做项目"
      },
      {
        "key": "pricing.compare_suitable_pro",
        "value": "经常做项目"
      },
      {
        "key": "pricing.faq_link",
        "value": "关于计费的常见问题 → 帮助中心"
      },
      {
        "key": "admin.help_default_group",
        "value": "使用与工具"
      },
      {
        "key": "pricing.site_note",
        "value": "「场地」指一个调查项目地块，对应一份可交付成果；换场地或换一套数据需重新购买。"
      },
      {
        "key": "pricing.compare_col_member",
        "value": "会员（注册即得）"
      },
      {
        "key": "pricing.per_year",
        "value": "/ 年"
      },
      {
        "key": "pricing.compare_member_action",
        "value": "免费注册"
      },
      {
        "key": "pricing.compare_row_tool_price",
        "value": "工具价格"
      },
      {
        "key": "pricing.compare_price_original",
        "value": "（原价）"
      },
      {
        "key": "pricing.compare_tool_price_vip",
        "value": "全线工具 8 折"
      },
      {
        "key": "pricing.compare_row_member_fee",
        "value": "会员年费"
      },
      {
        "key": "pricing.compare_member_fee_member",
        "value": "0 元（注册即得）"
      },
      {
        "key": "pricing.compare_row_share",
        "value": "分享赚次数"
      },
      {
        "key": "pricing.compare_share_member",
        "value": "生成分享卡得额度，0 元兑换 ≤¥169 方案（每天 1 次、累计 3 次）"
      },
      {
        "key": "pricing.compare_share_vip",
        "value": "双倍奖励：生成分享卡得 2 次，邀请好友再得 2 次"
      },
      {
        "key": "pricing.compare_credits_vip",
        "value": "每年 3 次，0 元兑换 ≤¥169 方案"
      },
      {
        "key": "pricing.share_go",
        "value": "去赚次数 →"
      },
      {
        "key": "pricing.share_login",
        "value": "登录后分享赚次数"
      },
      {
        "key": "pricing.share_vip_badge",
        "value": "VIP 双倍"
      },
      {
        "key": "pricing.member_card_amount_free",
        "value": "¥0"
      },
      {
        "key": "pricing.member_card_unit_free",
        "value": "永久免费"
      },
      {
        "key": "pricing.member_card_note",
        "value": "折合每天不到 ¥1"
      },
      {
        "key": "requests.status_need_login",
        "value": "请先登录后再提交需求"
      },
      {
        "key": "pricing.share_redeem_button",
        "value": "用分享额度兑换（剩余 {count} 次）"
      },
      {
        "key": "pricing.share_redeem_done",
        "value": "已用分享额度兑换，权益已写入账户"
      },
      {
        "key": "account.vip_title",
        "value": "VIP会员"
      },
      {
        "key": "account.vip_active",
        "value": "有效期至 {date}"
      },
      {
        "key": "account.vip_inactive",
        "value": "尚未开通"
      },
      {
        "key": "account.vip_discount",
        "value": "全线工具 8 折"
      },
      {
        "key": "account.vip_credits",
        "value": "年度额度剩余 {count} 次"
      },
      {
        "key": "account.vip_action_open",
        "value": "去开通"
      },
      {
        "key": "account.vip_action_renew",
        "value": "去续费"
      },
      {
        "key": "account.share_title",
        "value": "分享额度"
      },
      {
        "key": "account.share_balance",
        "value": "可用 {count} 次"
      },
      {
        "key": "account.share_empty",
        "value": "还没有分享额度，去分享赚次数"
      },
      {
        "key": "account.share_source_share_card",
        "value": "生成分享卡"
      },
      {
        "key": "account.share_source_invite",
        "value": "好友注册"
      },
      {
        "key": "account.share_source_welcome",
        "value": "新人奖励"
      },
      {
        "key": "auth.forgot_code_label",
        "value": "邮箱验证码"
      },
      {
        "key": "auth.forgot_code_placeholder",
        "value": "6 位数字验证码"
      },
      {
        "key": "auth.forgot_new_password",
        "value": "新密码"
      },
      {
        "key": "auth.forgot_sent",
        "value": "验证码已发送，请查收邮箱（含垃圾箱）"
      },
      {
        "key": "auth.forgot_reset",
        "value": "重置密码"
      },
      {
        "key": "auth.forgot_back",
        "value": "返回登录"
      },
      {
        "key": "auth.forgot_resend",
        "value": "重新发送验证码"
      },
      {
        "key": "auth.forgot_done",
        "value": "密码已重置，请用新密码登录"
      },
      {
        "key": "auth.verify_mail_sent",
        "value": "验证邮件已发送，请查收邮箱（含垃圾箱）"
      },
      {
        "key": "account.verify_title",
        "value": "邮箱未验证"
      },
      {
        "key": "account.verify_lede",
        "value": "完成验证后可用于找回密码；验证码 15 分钟内有效。"
      },
      {
        "key": "account.verify_placeholder",
        "value": "输入 6 位验证码"
      },
      {
        "key": "account.verify_submit",
        "value": "验证"
      },
      {
        "key": "account.verify_send",
        "value": "发送验证邮件"
      },
      {
        "key": "account.verify_sent",
        "value": "验证邮件已发送，请查收（含垃圾箱）"
      },
      {
        "key": "account.verify_done",
        "value": "邮箱已验证"
      },
      {
        "key": "account.verify_failed",
        "value": "验证码无效或已过期"
      },
      {
        "key": "verify.title",
        "value": "验证邮箱"
      },
      {
        "key": "verify.lede",
        "value": "请输入我们发送到你邮箱的 6 位验证码，15 分钟内有效。"
      },
      {
        "key": "verify.code_label",
        "value": "邮箱验证码"
      },
      {
        "key": "verify.code_placeholder",
        "value": "6 位数字验证码"
      },
      {
        "key": "verify.submit",
        "value": "完成验证"
      },
      {
        "key": "verify.resend",
        "value": "重新发送验证码"
      },
      {
        "key": "verify.sent",
        "value": "验证码已发送，请查收（含垃圾箱）"
      },
      {
        "key": "verify.done",
        "value": "邮箱已验证"
      },
      {
        "key": "verify.failed",
        "value": "验证码无效或已过期"
      },
      {
        "key": "verify.skip",
        "value": "暂不验证，先逛逛 →"
      },
      {
        "key": "verify.bar",
        "value": "你的邮箱尚未验证，收据与通知可能无法送达。"
      },
      {
        "key": "verify.bar_link",
        "value": "去验证"
      },
      {
        "key": "verify.login_required",
        "value": "请先登录后再验证邮箱"
      },
      {
        "key": "verify.order_blocked",
        "value": "请先完成邮箱验证，再继续付款"
      },
      {
        "key": "verify.unavailable",
        "value": "邮箱服务暂不可用，请稍后再试"
      },
      {
        "key": "account.deactivate_title",
        "value": "账号注销"
      },
      {
        "key": "account.deactivate_lede",
        "value": "注销会彻底删除账号、个人资料与微信绑定，删除后不可恢复；订单、发票等记录依法保留。"
      },
      {
        "key": "account.deactivate_button",
        "value": "注销账号"
      },
      {
        "key": "account.deactivate_confirm_lede",
        "value": "此操作不可恢复：账号、个人资料、微信绑定与自定义头像都会被彻底删除，未使用的权益与额度作废。请输入「注销」，并按提示输入当前密码。"
      },
      {
        "key": "account.deactivate_password",
        "value": "当前密码"
      },
      {
        "key": "account.deactivate_submit",
        "value": "确认注销"
      },
      {
        "key": "account.deactivate_done",
        "value": "账号已注销"
      },
      {
        "key": "account.deactivate_failed",
        "value": "注销失败，请检查密码"
      },
      {
        "key": "requests.vote_login",
        "value": "请先登录后再投票"
      },
      {
        "key": "detail.purchase_required",
        "value": "购买后使用"
      },
      {
        "key": "admin.sites_empty",
        "value": "暂无场地记录"
      },
      {
        "key": "admin.runs_empty",
        "value": "暂无运行记录"
      },
      {
        "key": "toast.dataset_paid",
        "value": "付费数据集请联系我们获取授权。"
      },
      {
        "key": "auth.error_deactivated",
        "value": "该邮箱账号已注销，可直接用此邮箱重新注册恢复。"
      },
      {
        "key": "admin.nav_users",
        "value": "用户"
      },
      {
        "key": "admin.nav_orders",
        "value": "订单"
      },
      {
        "key": "admin.nav_invoices",
        "value": "发票"
      },
      {
        "key": "admin.users_count",
        "value": "共 {count} 个账号"
      },
      {
        "key": "admin.users_empty",
        "value": "暂无账号"
      },
      {
        "key": "admin.account_active",
        "value": "正常"
      },
      {
        "key": "admin.account_disabled",
        "value": "已注销"
      },
      {
        "key": "admin.verified_yes",
        "value": "已验证"
      },
      {
        "key": "admin.verified_no",
        "value": "未验证"
      },
      {
        "key": "admin.col_email",
        "value": "邮箱"
      },
      {
        "key": "admin.col_display_name",
        "value": "显示名称"
      },
      {
        "key": "admin.col_email_verified",
        "value": "邮箱验证"
      },
      {
        "key": "admin.col_order_no",
        "value": "订单号"
      },
      {
        "key": "admin.col_user",
        "value": "用户"
      },
      {
        "key": "admin.col_amount",
        "value": "金额"
      },
      {
        "key": "admin.orders_count",
        "value": "共 {count} 笔订单"
      },
      {
        "key": "admin.orders_empty",
        "value": "暂无订单"
      },
      {
        "key": "admin.invoices_count",
        "value": "共 {count} 张发票申请"
      },
      {
        "key": "admin.invoices_empty",
        "value": "暂无发票申请"
      },
      {
        "key": "admin.invoice_col_title",
        "value": "抬头"
      },
      {
        "key": "admin.invoice_col_no",
        "value": "发票号 / 下载链接"
      },
      {
        "key": "admin.invoice_col_actions",
        "value": "操作"
      },
      {
        "key": "admin.invoice_no_placeholder",
        "value": "发票号码"
      },
      {
        "key": "admin.invoice_url_placeholder",
        "value": "下载链接（开票必填）"
      },
      {
        "key": "admin.invoice_review",
        "value": "受理"
      },
      {
        "key": "admin.invoice_issue",
        "value": "开票"
      },
      {
        "key": "admin.invoice_reject",
        "value": "驳回"
      },
      {
        "key": "admin.invoice_updated",
        "value": "发票状态已更新"
      },
      {
        "key": "admin.invoice_failed",
        "value": "发票操作失败"
      },
      {
        "key": "auth.captcha_note",
        "value": "连续登录失败，请先完成安全验证。"
      },
      {
        "key": "auth.captcha_help",
        "value": "用于确认是本人操作；验证通过后即可继续登录。"
      },
      {
        "key": "auth.captcha_placeholder",
        "value": "计算结果"
      },
      {
        "key": "auth.provider_soon",
        "value": "即将开放"
      },
      {
        "key": "auth.wechat_error",
        "value": "微信登录失败，请重试或使用邮箱登录。"
      },
      {
        "key": "auth.wechat_forgot",
        "value": "该账号使用微信登录，请直接用微信扫码登录。"
      },
      {
        "key": "account.wechat_account",
        "value": "微信账号（已绑定）"
      },
      {
        "key": "detail.gallery_title",
        "value": "样例成果"
      },
      {
        "key": "detail.sample_title",
        "value": "样例数据"
      },
      {
        "key": "detail.video_empty",
        "value": "演示视频制作中，先看下方样例成果"
      },
      {
        "key": "admin.field_gallery",
        "value": "样例成果图（逗号分隔文件名）"
      },
      {
        "key": "admin.field_sample_files",
        "value": "样例数据（名称|路径|说明，分号分隔）"
      },
      {
        "key": "purchase.pay",
        "value": "立即支付"
      },
      {
        "key": "purchase.price_link",
        "value": "查看价格说明"
      },
      {
        "key": "purchase.success_title",
        "value": "支付成功，权益已开通"
      },
      {
        "key": "purchase.success_lede",
        "value": "已为你打开工具；若浏览器拦截了弹窗，点下方「打开工具」即可，订单可在「我的账户」查看。"
      },
      {
        "key": "purchase.open_tool",
        "value": "打开工具"
      },
      {
        "key": "purchase.view_orders",
        "value": "查看订单"
      },
      {
        "key": "purchase.redeem_success_title",
        "value": "兑换成功，权益已开通"
      },
      {
        "key": "purchase.topup_button",
        "value": "额度抵扣 {credit}，补差 {amount}"
      },
      {
        "key": "auth.wechat_qr_title",
        "value": "微信扫码登录"
      },
      {
        "key": "auth.wechat_qr_lede",
        "value": "请用微信「扫一扫」扫描二维码，并在手机上确认登录。"
      },
      {
        "key": "auth.wechat_qr_waiting",
        "value": "正在生成二维码…"
      },
      {
        "key": "auth.wechat_qr_scanning",
        "value": "等待扫码…"
      },
      {
        "key": "auth.wechat_qr_confirm",
        "value": "已扫码，请在手机上确认"
      },
      {
        "key": "auth.wechat_qr_success",
        "value": "登录成功，正在进入…"
      },
      {
        "key": "auth.wechat_qr_expired",
        "value": "二维码已过期，点击刷新"
      },
      {
        "key": "auth.wechat_qr_refresh",
        "value": "刷新二维码"
      },
      {
        "key": "pay.qr_title",
        "value": "微信扫码支付"
      },
      {
        "key": "pay.qr_lede",
        "value": "请用微信「扫一扫」完成支付，支付成功后权益自动到账。"
      },
      {
        "key": "pay.qr_amount",
        "value": "应付金额"
      },
      {
        "key": "pay.qr_waiting",
        "value": "等待支付…"
      },
      {
        "key": "pay.qr_paid",
        "value": "支付成功，权益已到账"
      },
      {
        "key": "pay.qr_expired",
        "value": "二维码已过期，请重新获取。"
      },
      {
        "key": "pay.qr_refresh",
        "value": "重新获取二维码"
      },
      {
        "key": "pay.qr_keep_open",
        "value": "支付完成前请保持本页面打开。"
      },
      {
        "key": "pay.jsapi_launching",
        "value": "正在唤起微信支付…"
      },
      {
        "key": "pay.jsapi_failed",
        "value": "未能唤起微信支付，请重试或改用扫码支付。"
      },
      {
        "key": "account.wechat_bind_bound",
        "value": "已绑定"
      },
      {
        "key": "account.wechat_bind_button",
        "value": "绑定微信"
      },
      {
        "key": "account.wechat_bind_lede",
        "value": "绑定微信后可直接扫码登录，无需输入密码。"
      },
      {
        "key": "account.wechat_bind_note",
        "value": "已绑定微信，可用手机微信扫码登录；如需更换请先联系客服解绑。"
      },
      {
        "key": "account.wechat_bind_success",
        "value": "微信绑定成功"
      },
      {
        "key": "account.wechat_bind_title",
        "value": "微信绑定"
      },
      {
        "key": "auth.wechat_follow_lede",
        "value": "关注后接收出图完成与权益到账通知；注册后在「账户 → 设置」绑定微信，即可扫码登录。"
      },
      {
        "key": "auth.wechat_follow_title",
        "value": "关注 FigHub 服务号"
      },
      {
        "key": "auth.wechat_unbound_badge",
        "value": "未绑定"
      },
      {
        "key": "auth.wechat_unbound_bind",
        "value": "去绑定微信"
      },
      {
        "key": "auth.wechat_unbound_lede",
        "value": "请先在电脑上用邮箱注册或登录，再到「账户 → 设置」里绑定微信；绑定后即可用微信扫码登录。"
      },
      {
        "key": "auth.wechat_unbound_register",
        "value": "去注册"
      },
      {
        "key": "auth.wechat_unbound_title",
        "value": "该微信还没有绑定账号"
      },
      {
        "key": "account.wechat_bind_taken",
        "value": "该微信已绑定其它 FigHub 账号，请改用原账号扫码登录；如需更换绑定请联系客服。"
      },
      {
        "key": "account.email_bind_code_placeholder",
        "value": "邮箱验证码"
      },
      {
        "key": "account.email_bind_lede",
        "value": "补全邮箱后才能下单与开票，也可用于登录与找回密码。"
      },
      {
        "key": "account.email_bind_placeholder",
        "value": "你的常用邮箱"
      },
      {
        "key": "account.email_bind_send",
        "value": "发送验证码"
      },
      {
        "key": "account.email_bind_sent",
        "value": "验证码已发送，请查收邮件"
      },
      {
        "key": "account.email_bind_submit",
        "value": "确认绑定"
      },
      {
        "key": "account.email_bind_success",
        "value": "邮箱绑定成功"
      },
      {
        "key": "account.email_bind_title",
        "value": "补全邮箱"
      },
      {
        "key": "auth.wechat_register_failed",
        "value": "自动注册没有完成，请点击重试。"
      },
      {
        "key": "auth.wechat_register_lede",
        "value": "请用微信「扫一扫」；未关注会先引导关注服务号，关注后自动为你创建账号。"
      },
      {
        "key": "auth.wechat_register_retry",
        "value": "重试注册"
      },
      {
        "key": "auth.wechat_register_success",
        "value": "注册成功，正在进入…"
      },
      {
        "key": "auth.wechat_register_title",
        "value": "微信扫码注册"
      },
      {
        "key": "auth.wechat_register_waiting",
        "value": "等待扫码关注…"
      },
      {
        "key": "toast.wechat_register_needs_email",
        "value": "账号已创建，请补全邮箱后再下单或开票"
      },
      {
        "key": "auth.wechat_register_scanned",
        "value": "已扫码，正在为你创建账号…"
      },
      {
        "key": "account.deactivate_consequences",
        "value": "注销后账号与个人资料立即彻底删除且不可恢复；订单、发票等法定记录依法保留；未使用的权益与额度作废。用同一邮箱重新注册会得到一个全新账号，历史记录不会恢复。"
      },
      {
        "key": "account.deactivate_type_word",
        "value": "请输入「注销」以确认"
      },
      {
        "key": "account.password_setup_code",
        "value": "邮箱验证码"
      },
      {
        "key": "account.password_setup_lede",
        "value": "当前账号还没有密码。设置后可用邮箱 + 密码登录，也便于解绑微信与注销账号。"
      },
      {
        "key": "account.password_setup_need_email",
        "value": "请先补全邮箱，再设置密码"
      },
      {
        "key": "account.password_setup_new",
        "value": "新密码（至少 8 位）"
      },
      {
        "key": "account.password_setup_send",
        "value": "发送验证码"
      },
      {
        "key": "account.password_setup_submit",
        "value": "设置密码"
      },
      {
        "key": "account.password_setup_success",
        "value": "密码设置成功"
      },
      {
        "key": "account.password_setup_title",
        "value": "设置密码"
      },
      {
        "key": "account.wechat_unbind_button",
        "value": "解绑微信"
      },
      {
        "key": "account.wechat_unbind_confirm",
        "value": "解绑后将无法用微信扫码登录（可随时重新绑定）。确定解绑？"
      },
      {
        "key": "account.wechat_unbind_guard",
        "value": "请先设置密码，解绑后仍可用邮箱登录"
      },
      {
        "key": "account.wechat_unbind_success",
        "value": "已解绑微信"
      },
      {
        "key": "toast.wechat_register_existing",
        "value": "该微信已注册，已为你登录"
      },
      {
        "key": "account.email_bind_sending",
        "value": "正在校验验证码…"
      },
      {
        "key": "auth.code_invalid",
        "value": "验证码错误或已过期"
      },
      {
        "key": "auth.code_login_link",
        "value": "用邮箱验证码登录"
      },
      {
        "key": "auth.code_placeholder",
        "value": "请输入验证码"
      },
      {
        "key": "auth.code_send",
        "value": "获取验证码"
      },
      {
        "key": "auth.code_sent",
        "value": "验证码已发送，请查收邮件"
      },
      {
        "key": "auth.code_submit",
        "value": "登录"
      },
      {
        "key": "auth.consent_lead",
        "value": "阅读并接受"
      },
      {
        "key": "auth.consent_register_lead",
        "value": "阅读并接受"
      },
      {
        "key": "auth.done_code",
        "value": "请输入验证码"
      },
      {
        "key": "auth.done_lede",
        "value": "账号已创建。补全邮箱后可用于找回密码、接收订单与发票通知。"
      },
      {
        "key": "auth.done_send",
        "value": "获取验证码"
      },
      {
        "key": "auth.done_skip",
        "value": "暂不绑定"
      },
      {
        "key": "auth.done_submit",
        "value": "确认绑定"
      },
      {
        "key": "auth.done_title",
        "value": "注册成功！"
      },
      {
        "key": "auth.password_login_link",
        "value": "用密码登录"
      },
      {
        "key": "auth.tab_email_login",
        "value": "邮箱登录"
      },
      {
        "key": "auth.tab_email_register",
        "value": "邮箱注册"
      },
      {
        "key": "auth.tab_wechat_login",
        "value": "微信扫码登录"
      },
      {
        "key": "auth.tab_wechat_register",
        "value": "微信扫码注册"
      },
      {
        "key": "auth.tabs_aria",
        "value": "登录方式"
      },
      {
        "key": "auth.wechat_oauth_button",
        "value": "在微信中一键登录"
      },
      {
        "key": "auth.wechat_oauth_note",
        "value": "将使用当前微信授权登录 FigHub"
      },
      {
        "key": "auth.wechat_register_lede_wechat",
        "value": "长按识别二维码关注服务号，即可完成注册"
      },
      {
        "key": "menu.account",
        "value": "账户中心"
      },
      {
        "key": "menu.aria",
        "value": "账号菜单"
      },
      {
        "key": "menu.invoices",
        "value": "发票管理"
      },
      {
        "key": "menu.logout",
        "value": "退出登录"
      },
      {
        "key": "menu.open",
        "value": "打开账号菜单"
      },
      {
        "key": "menu.orders",
        "value": "交易记录"
      },
      {
        "key": "menu.profile",
        "value": "个人主页"
      },
      {
        "key": "menu.settings",
        "value": "账号设置"
      },
      {
        "key": "menu.support",
        "value": "在线客服"
      },
      {
        "key": "menu.support_hint",
        "value": "扫码咨询"
      },
      {
        "key": "menu.support_qr_alt",
        "value": "客服二维码"
      },
      {
        "key": "profile.badge_email",
        "value": "邮箱已验证"
      },
      {
        "key": "profile.badge_wechat",
        "value": "微信已绑定"
      },
      {
        "key": "profile.edit",
        "value": "编辑资料"
      },
      {
        "key": "profile.joined",
        "value": "加入时间"
      },
      {
        "key": "profile.loading",
        "value": "正在加载…"
      },
      {
        "key": "profile.not_found",
        "value": "该用户不存在或已注销"
      },
      {
        "key": "profile.section_about",
        "value": "关于"
      },
      {
        "key": "profile.section_about_body",
        "value": "这里是 TA 在 FigHub 的公开主页，仅展示昵称、加入时间与徽章；邮箱、订单与发票信息不会公开。"
      },
      {
        "key": "auth.bind_lede",
        "value": "为保证您的相关权益，请绑定邮箱"
      },
      {
        "key": "auth.bind_submit",
        "value": "确认绑定"
      },
      {
        "key": "auth.bind_title",
        "value": "你已经注册成功！"
      },
      {
        "key": "auth.exchange_to_email",
        "value": "邮箱登录"
      },
      {
        "key": "auth.exchange_to_email_register",
        "value": "邮箱注册"
      },
      {
        "key": "auth.exchange_to_wechat",
        "value": "微信扫码登录"
      },
      {
        "key": "auth.exchange_to_wechat_register",
        "value": "微信扫码注册"
      },
      {
        "key": "auth.last_login",
        "value": "上次登录：{account}"
      },
      {
        "key": "auth.last_login_switch",
        "value": "切换账号"
      },
      {
        "key": "auth.login_existing",
        "value": "登录已有账号"
      },
      {
        "key": "auth.new_user_register",
        "value": "新用户账号注册"
      },
      {
        "key": "auth.other_account",
        "value": "账号登录"
      },
      {
        "key": "auth.other_code",
        "value": "验证码登录"
      },
      {
        "key": "auth.other_email_register",
        "value": "邮箱注册"
      },
      {
        "key": "auth.other_title",
        "value": "其他方式登录"
      },
      {
        "key": "auth.other_wechat_login",
        "value": "微信扫码登录"
      },
      {
        "key": "auth.other_wechat_register",
        "value": "微信扫码注册"
      },
      {
        "key": "auth.qr_expired_overlay",
        "value": "二维码已过期，点击刷新"
      },
      {
        "key": "auth.support",
        "value": "在线客服"
      },
      {
        "key": "auth.support_hint",
        "value": "扫码咨询"
      },
      {
        "key": "auth.tab_account",
        "value": "账号登录"
      },
      {
        "key": "auth.tab_code",
        "value": "验证码登录"
      },
      {
        "key": "auth.wechat_qr_notice",
        "value": "打开微信「扫一扫」，在手机上确认登录"
      },
      {
        "key": "auth.wechat_register_notice",
        "value": "微信扫码关注公众号完成登录"
      },
      {
        "key": "menu.tools",
        "value": "我的工具"
      },
      {
        "key": "menu.tutorial",
        "value": "入门教程"
      },
      {
        "key": "auth.welcome",
        "value": "欢迎使用{brand}"
      },
      {
        "key": "auth.remember_30d",
        "value": "30天内免登录"
      },
      {
        "key": "account.deactivate_word",
        "value": "注销"
      },
      {
        "key": "account.deactivate_word_mismatch",
        "value": "请输入「注销」以确认"
      },
      {
        "key": "account.deactivate_word_placeholder",
        "value": "请输入「注销」"
      },
      {
        "key": "account.refund_apply",
        "value": "申请退费"
      },
      {
        "key": "account.refund_cancel",
        "value": "撤回申请"
      },
      {
        "key": "account.refund_canceled",
        "value": "已撤回退费申请"
      },
      {
        "key": "account.refund_done",
        "value": "退费申请已提交，请等待审核"
      },
      {
        "key": "account.refund_failed",
        "value": "操作失败，请稍后重试"
      },
      {
        "key": "account.refund_policy",
        "value": "提交后由客服审核，审核通过后原路退回微信支付账户，通常 1–3 个工作日到账；已开具的发票需先作废。"
      },
      {
        "key": "account.refund_reason",
        "value": "退费原因"
      },
      {
        "key": "account.refund_reason_placeholder",
        "value": "请说明退费原因（至少 5 个字）"
      },
      {
        "key": "account.refund_reason_short",
        "value": "请填写至少 5 个字的退费原因"
      },
      {
        "key": "account.refund_sending",
        "value": "正在提交…"
      },
      {
        "key": "account.refund_status_approved",
        "value": "退费处理中"
      },
      {
        "key": "account.refund_status_canceled",
        "value": "已撤回"
      },
      {
        "key": "account.refund_status_refunded",
        "value": "已退费"
      },
      {
        "key": "account.refund_status_rejected",
        "value": "退费被驳回"
      },
      {
        "key": "account.refund_status_requested",
        "value": "退费审核中"
      },
      {
        "key": "account.refund_submit",
        "value": "提交申请"
      },
      {
        "key": "account.refund_title",
        "value": "申请退费"
      },
      {
        "key": "admin.nav_refunds",
        "value": "退费管理"
      },
      {
        "key": "admin.refund_approve",
        "value": "通过"
      },
      {
        "key": "admin.refund_col_note",
        "value": "处理备注"
      },
      {
        "key": "admin.refund_col_reason",
        "value": "退费原因"
      },
      {
        "key": "admin.refund_done",
        "value": "标记已退费"
      },
      {
        "key": "admin.refund_failed",
        "value": "退费处理失败"
      },
      {
        "key": "admin.refund_note_placeholder",
        "value": "备注（可选）"
      },
      {
        "key": "admin.refund_reject",
        "value": "驳回"
      },
      {
        "key": "admin.refund_updated",
        "value": "退费状态已更新"
      },
      {
        "key": "admin.refunds_count",
        "value": "共 {count} 条退费申请"
      },
      {
        "key": "admin.refunds_empty",
        "value": "暂无退费申请"
      },
      {
        "key": "auth.login_title_email",
        "value": "邮箱登录"
      },
      {
        "key": "auth.login_title_wechat",
        "value": "微信登录"
      },
      {
        "key": "account.chip_email_unverified",
        "value": "邮箱未验证"
      },
      {
        "key": "account.chip_email_verified",
        "value": "邮箱已验证"
      },
      {
        "key": "account.chip_loading",
        "value": "读取账号状态…"
      },
      {
        "key": "account.chip_wechat",
        "value": "微信账号"
      },
      {
        "key": "account.entitlements_lede",
        "value": "已购买的工具权益、有效期与剩余次数。"
      },
      {
        "key": "account.invoices_lede",
        "value": "已提交的发票申请，以及为已支付订单开票。"
      },
      {
        "key": "account.nav_profile",
        "value": "个人资料"
      },
      {
        "key": "account.nav_security",
        "value": "账号安全"
      },
      {
        "key": "account.orders_lede",
        "value": "每一笔订单的支付状态与退费进度。"
      },
      {
        "key": "account.password_change_action",
        "value": "修改密码"
      },
      {
        "key": "account.password_lede",
        "value": "密码用于邮箱登录；用微信扫码注册的账号建议补一个密码。"
      },
      {
        "key": "account.password_setup_action",
        "value": "设置密码"
      },
      {
        "key": "account.profile_lede",
        "value": "修改昵称，查看账号绑定的邮箱与登录方式。"
      },
      {
        "key": "account.security_lede",
        "value": "邮箱、微信与密码的绑定状态，以及注销账号。"
      },
      {
        "key": "account.display_name_lede",
        "value": "显示在订单、发票与导出文件里的名字。"
      },
      {
        "key": "account.email_row_lede",
        "value": "用于登录、找回密码与接收发票。"
      },
      {
        "key": "account.nav_group_account",
        "value": "资料与安全"
      },
      {
        "key": "account.nav_group_assets",
        "value": "资产与记录"
      },
      {
        "key": "account.state_bound",
        "value": "已绑定"
      },
      {
        "key": "account.state_set",
        "value": "已设置"
      },
      {
        "key": "account.state_unbound",
        "value": "未绑定"
      },
      {
        "key": "account.state_unset",
        "value": "未设置"
      },
      {
        "key": "account.state_unverified",
        "value": "未验证"
      },
      {
        "key": "account.state_verified",
        "value": "已验证"
      },
      {
        "key": "account.email_row_title",
        "value": "邮箱"
      },
      {
        "key": "account.password_row_title",
        "value": "登录密码"
      },
      {
        "key": "account.wechat_row_title",
        "value": "微信"
      },
      {
        "key": "account.check_action",
        "value": "去处理 →"
      },
      {
        "key": "account.check_lede",
        "value": "三项绑定状态，逐项确认。"
      },
      {
        "key": "account.check_title",
        "value": "账号安全"
      },
      {
        "key": "account.hero_entitlements",
        "value": "查看权益"
      },
      {
        "key": "account.nav_overview_short",
        "value": "总览"
      },
      {
        "key": "account.overview_lede",
        "value": "账号状态、权益与最近交易一屏看完。"
      },
      {
        "key": "account.stats_action",
        "value": "看交易记录 →"
      },
      {
        "key": "account.stats_lede",
        "value": "订单、权益与发票的实时数量。"
      },
      {
        "key": "account.stats_title",
        "value": "资产与记录"
      },
      {
        "key": "account.chip_password_set",
        "value": "密码已设置"
      },
      {
        "key": "account.chip_password_unset",
        "value": "密码未设置"
      },
      {
        "key": "account.chip_wechat_bound",
        "value": "微信已绑定"
      },
      {
        "key": "account.chip_wechat_unbound",
        "value": "微信未绑定"
      },
      {
        "key": "account.chip_jump_hint",
        "value": "点击前往对应设置"
      },
      {
        "key": "account.email_action",
        "value": "管理邮箱"
      },
      {
        "key": "account.email_manage_link",
        "value": "去账号安全里管理"
      },
      {
        "key": "account.password_action",
        "value": "修改密码"
      },
      {
        "key": "account.security_group_danger",
        "value": "账号处置"
      },
      {
        "key": "account.security_group_login",
        "value": "登录与绑定"
      },
      {
        "key": "account.security_group_login_lede",
        "value": "邮箱、微信与密码，逐项确认状态。"
      },
      {
        "key": "account.recent_all",
        "value": "全部交易记录 →"
      },
      {
        "key": "account.recent_empty",
        "value": "还没有订单。"
      },
      {
        "key": "account.recent_empty_link",
        "value": "去看工具与价格 →"
      },
      {
        "key": "account.recent_title",
        "value": "最近动态"
      },
      {
        "key": "account.avatar_change",
        "value": "更换头像"
      },
      {
        "key": "account.avatar_done",
        "value": "头像已更新"
      },
      {
        "key": "account.avatar_failed",
        "value": "上传失败，请重试"
      },
      {
        "key": "account.avatar_hint",
        "value": "PNG / JPG，不超过 2MB"
      },
      {
        "key": "account.avatar_title",
        "value": "头像"
      },
      {
        "key": "account.avatar_uploading",
        "value": "正在上传…"
      },
      {
        "key": "account.password_hint",
        "value": "用于邮箱登录与找回密码"
      },
      {
        "key": "account.profile_avatar_section",
        "value": "头像与昵称"
      },
      {
        "key": "account.profile_info_section",
        "value": "账号信息"
      },
      {
        "key": "account.info_login_email",
        "value": "邮箱密码"
      },
      {
        "key": "account.info_login_way",
        "value": "登录方式"
      },
      {
        "key": "account.info_login_wechat",
        "value": "微信扫码"
      },
      {
        "key": "legal.privacy.body",
        "value": "## 一、引言\n本政策由北京屹云科技有限公司（以下简称“我们”）制定，适用于 FigHub 在线工具平台（fighub.bjyiyunkeji.online）。\n我们重视您的个人信息与数据安全。本政策说明我们收集哪些信息、如何使用与保护这些信息，以及您享有哪些权利。\n\n## 二、我们收集哪些信息\n账户信息：您注册时提供的邮箱、昵称、密码（以不可逆方式加密保存）、微信授权的唯一标识与微信昵称、头像，以及邮箱与微信的绑定状态。\n登录与安全信息：登录时间、登录方式、IP 地址、浏览器与设备标识、验证码的发送与校验记录。\n订单与开票信息：订单号、产品与方案、金额与支付状态、退费记录、发票抬头与税号、接收发票的邮箱。\n使用信息：您使用的工具、使用次数与时间等任务元数据（文件名、大小、时间），成果导出编号，分享卡与邀请记录，需求墙提交内容。\n我们不保存您上传的原始数据内容与处理（结算）结果；为完成权益核算与同一场地判别，仅保留地块范围（四至）等特征信息与上述任务元数据。\n访问统计：页面路径、访问时间与匿名访客标识（由浏览器生成的随机标识，不含姓名、邮箱等信息）。\n您主动联系我们时提供的信息，例如客服沟通内容与邮件正文。\n我们不会收集与服务无关的信息，也不会读取您设备中的其他文件。\n\n## 三、我们如何使用信息\n用于提供与维护服务，包括运行工具、保存成果、管理账户与权益。\n用于账号安全，包括登录校验、找回密码、异常识别与风控。\n用于订单、支付、退费与发票处理。\n用于发送服务通知，例如验证码、订单与权益提醒。\n用于数据统计与产品改进，以及遵守法律法规、配合监管要求。\n我们不会将您的数据用于广告投放，也不会将其出售给第三方。\n\n## 四、Cookie 与本地存储\n我们使用必要的 Cookie 与浏览器本地存储维持登录状态和界面偏好，包括：登录会话 Cookie；免登录 Cookie（勾选“30 天内免登录”时写入，最长 30 天）；主题、昵称等界面偏好；用于统计的匿名访客标识。\n您可以通过浏览器清除上述数据，清除后需要重新登录。\n我们不使用第三方广告或跨站跟踪 Cookie。\n\n## 五、信息的共享与委托处理\n为提供服务，我们会在必要范围内与以下合作方共享或委托处理信息：微信（扫码登录、服务号消息）、微信支付（支付与退款）、邮件服务商（发送验证码与服务通知）、云服务器与网络服务商（存储与运行）。\n除以下情形外，我们不会向其他第三方提供您的个人信息：取得您的明确同意；法律法规要求或司法、行政机关依法要求；为保护您或他人的生命、财产安全所必需。\n\n## 六、数据存储与保存期限\n我们在中国境内的服务器上存储您的信息。\n账户信息保存至您注销账户；注销会彻底删除账号、个人资料与微信绑定，删除后不可恢复，同一邮箱重新注册会得到一个全新账号，历史记录不会回来。\n订单、发票等记录依法保留（不少于法定与税务要求的期限），仅用于对账、退费、开票与合规目的。\n登录验证码一次性短时有效；访问日志保存 6 个月，访问统计类数据保存 12 个月。\n\n## 七、数据安全\n我们采取 HTTPS 传输、密码不可逆加密存储、访问权限最小化、数据库与发布备份、操作审计与安全巡检等措施保护数据。\n互联网环境不存在绝对安全，请妥善保管账户信息与验证码；如发生安全事件，我们将依法告知并采取措施。\n\n## 八、您的权利\n您可以在账户中心查询与更正个人信息，包括昵称、头像、邮箱、密码与绑定关系，也可以随时注销账户。\n如需复制、导出或删除个人信息，或撤回授权，请通过第十条的方式联系我们，我们会在 15 个工作日内答复。\n注销是彻底删除且不可恢复：账号、个人资料、微信绑定与自定义头像都会一并删除，重新注册不会恢复历史记录。\n\n## 九、未成年人保护\n本平台面向专业人员，不面向不满 18 周岁的未成年人提供服务。如您未满 18 周岁，请在监护人陪同下使用，并由监护人同意本政策。\n\n## 十、联系我们\n如对本政策有疑问、投诉，或需要行使上述权利，请联系：北京屹云科技有限公司；企业邮箱 support@bjyiyunkeji.online；企业微信 paomo720。京ICP备2025155788号。\n\n## 十一、政策更新\n本政策更新时，我们会在本页面公布，必要时通过站内提示或您预留的邮箱通知您；继续使用服务即视为接受更新后的政策。\n\n本隐私政策更新日期：2026 年 10 月 11 日。"
      },
      {
        "key": "legal.terms.body",
        "value": "## 一、协议主体与适用范围\n本服务条款是您与北京屹云科技有限公司（以下简称“我们”）之间，就访问和使用 FigHub 在线工具平台（网址：fighub.bjyiyunkeji.online，以下简称“本平台”）所达成的协议。\n您注册、登录、扫码关注或以其他方式使用本平台，即表示您已阅读并同意本条款；如您不同意其中任何内容，请停止使用本平台。\n如您代表机构使用本平台，您确认已获得该机构授权，并由该机构承担相应责任。\n本平台面向外业调查、环境咨询等专业场景，主要提供数据处理与专题图件制作类在线工具。\n\n## 二、服务内容\n本平台提供在线工具（布点与边界制作、样品核对、影像资料管理、等水位线、风险值评估、土方量与费用测算等）、示例数据集、需求墙、账户中心（我的权益、个人资料、账号安全）、交易记录与发票管理等功能。\n各工具的输入要求、输出成果、可用次数与有效期，以工具页面说明和服务端记录为准。\n我们可能随时新增、调整或下线部分功能；免费功能调整给您造成的损失，我们不承担责任。\n本平台输出的是数据处理结果，供您在项目中参考与二次使用，不构成专业结论、鉴定意见或法定报告。您应自行完成必要的专业判断、校核与合规审查。\n\n## 三、账户注册与安全\n您可以使用邮箱注册（填写常用邮箱、设置不少于 8 位密码并完成邮箱验证码验证），也可以通过微信扫码关注我们的服务号自动创建账户。\n通过微信创建的账户，我们会同步微信昵称与头像作为默认资料，并引导您补充邮箱，以便找回密码和接收服务通知。\n您应保证注册信息真实、准确、有效并及时更新；同一邮箱、手机号或微信号仅可绑定一个账户。\n请妥善保管账户凭证与验证码：使用您的账户完成的操作，视为您本人的行为。\n发现账户被盗用或存在异常时，请立即修改密码，并通过本条款第十三条的方式联系我们。\n您可以在账户中心自行设置或修改密码、更换邮箱、绑定或解绑微信；为保障安全，解绑微信前需要先设置登录密码。\n您可以在账户中心申请注销账户：注销会彻底删除账号、个人资料与微信绑定，删除后不可恢复，具体处理方式见《隐私政策》相关说明。\n\n## 四、使用规则\n您可以使用本平台处理您合法拥有的数据，并用于自身工作成果交付，前提是遵守法律法规与本条款。\n您不得：上传或处理违法、有害、侵权、涉密或来源不明的数据；使用爬虫、脚本、机器人等方式批量访问、注册或刷取免费额度；攻击、干扰、探测本平台，或绕过配额、权限与安全机制；反向工程、反编译或试图获取本平台源代码与算法；出租、出借、转售账户或权益，或将本平台用于开发竞争性产品；删除或遮蔽本平台的知识产权标识。\n如您违反上述规则，我们可以限制使用、暂停或终止账户，并回收违规获得的额度与权益；已支付费用是否退还按第七条处理。\n\n## 五、您的内容与数据\n您上传的数据、设置的参数与生成的成果归您所有。我们不会主张对您内容的所有权，仅为提供服务的目的进行必要的存储、传输与处理。\n工具处理过程中，我们不会保存您上传的原始数据内容与处理结果；为完成权益核算与同一场地判别，仅保留任务元数据（文件名、大小、时间、使用的工具）与地块范围（四至）等特征信息。\n请勿上传与工具用途无关的个人敏感信息；如您的数据包含他人个人信息，请确保已取得合法授权。\n示例数据集与样例文件仅用于功能体验与测试，请勿用于正式交付。\n需要长期留存的成果与记录，请自行下载保存；建议您在本地保留原始数据备份。因未备份导致的数据丢失，我们不承担责任。\n\n## 六、订单、支付与权益\n本平台的付费工具、数据集与会员类权益通过订单开通，支持微信支付。\n订单的价格、内容与有效期以下单页面及订单记录为准；权益在服务端确认支付成功后发放。\n我们可能调整价格与权益内容，调整不影响您已购买且仍在有效期内的权益。\n请勿通过非我们指定的方式支付，否则可能无法正常开通权益或办理退费。\n\n## 七、退费\n您可以在账户中心 → 交易记录中，对符合条件的订单发起退费申请。\n退费申请期限为订单完成后 30 天内；符合以下情形之一的可以申请退费：支付成功但权益未发放或发放异常；同一订单重复支付；其他经我们核实属于平台原因的情形。\n以下情形原则上不支持退费：权益已使用或已消耗；订单对应的数据或成果已完成交付；因违反本条款被限制或终止账户；超过订单完成后 30 天。\n退费申请提交后，我们会在 3 个工作日内处理；审核通过后按原支付渠道退回，到账时间以微信支付规则为准。\n订单如已开具发票，需先完成发票退回或冲红后办理退费。\n\n## 八、发票\n已支付的订单可以在账户中心 → 发票管理申请开票，支持企业与个人抬头。\n我们目前不支持开具增值税专用发票；如需增值税普通发票外的票据类型，请先与我们确认。\n发票金额为订单实际支付金额；抬头、税号等信息由您填写，并对其真实性负责。\n发票开具后如需变更或重开，请联系我们处理。\n\n## 九、分享与邀请额度\n您可以通过生成分享卡、邀请他人等方式获得可用次数（分享额度）。\n严禁通过虚假注册、刷量、批量邀请等不正当方式获取额度；一经发现，我们可以回收相关额度，并视情节限制账户功能。\n\n## 十、知识产权\n本平台的软件、界面、文档、示例数据、样例成果、商标与标识等，归我们或相关权利人所有。\n未经书面许可，您不得复制、传播、出租、出售本平台内容，或将其用于模型训练、批量抓取与二次分发。\n您在合法范围内使用本平台成果，用于自身报告与项目交付，不受影响。\n\n## 十一、服务变更、中断与终止\n我们会尽力保障服务稳定，但可能因维护、升级、网络故障、不可抗力等原因发生中断。\n您可以随时停止使用并注销账户；在您违反本条款或法律法规时，我们也可以暂停或终止向您提供服务。\n如我们停止提供某项收费服务，将退还您未使用的服务期对应费用或未消耗权益的对价。\n\n## 十二、免责与责任限制\n本平台按“现状”提供；我们不对服务不间断、无错误或完全符合您的预期作出保证。\n数据处理结果受输入数据质量、参数设置与工具能力限制，请自行校核并承担专业判断责任。\n在法律允许的最大范围内，我们对您的赔偿责任不超过您在索赔发生前 12 个月内向我们实际支付的费用；免费功能不产生赔偿责任。\n上述限制不适用于我们故意或重大过失造成的损害，以及法律不允许限制的情形。\n\n## 十三、通知与联系方式\n我们可以通过站内提示、页面公告或您预留的邮箱向您发送通知。\n本条款或服务内容更新时，我们会在本页面公布；您继续使用本平台，即视为接受更新后的内容。\n联系方式：北京屹云科技有限公司；企业邮箱 support@bjyiyunkeji.online；企业微信 paomo720。京ICP备2025155788号。\n\n## 十四、法律适用与争议解决\n本条款适用中华人民共和国法律。\n因本条款产生的争议，双方应友好协商解决；协商不成的，可向我们所在地有管辖权的人民法院提起诉讼。\n\n本服务条款更新日期：2026 年 10 月 11 日。"
      },
      {
        "key": "footer.icp",
        "value": "京ICP备2025155788号"
      },
      {
        "key": "account.sites_bounds",
        "value": "四至"
      },
      {
        "key": "account.sites_count",
        "value": "场地数量"
      },
      {
        "key": "account.sites_empty",
        "value": "还没有登记场地：在工具里上传数据后会自动登记四至。"
      },
      {
        "key": "account.sites_failed",
        "value": "操作失败，请稍后重试"
      },
      {
        "key": "account.sites_hint",
        "value": "只记录地块四至范围，用于判断是否为同一场地；不保存原始数据与成果。"
      },
      {
        "key": "account.sites_remove",
        "value": "移除"
      },
      {
        "key": "account.sites_removed",
        "value": "已移除该场地登记"
      },
      {
        "key": "account.sites_title",
        "value": "场地登记"
      },
      {
        "key": "account.sites_unnamed",
        "value": "未命名场地"
      },
      {
        "key": "account.sites_used",
        "value": "使用 {count} 次"
      },
      {
        "key": "account.stat_coupons",
        "value": "使用券"
      },
      {
        "key": "account.coupon_title",
        "value": "我的使用券"
      },
      {
        "key": "account.coupon_use",
        "value": "去兑换"
      },
      {
        "key": "coupon.tool_all",
        "value": "全站通用"
      },
      {
        "key": "pricing.coupon_redeem_button",
        "value": "使用券兑换"
      },
      {
        "key": "pricing.coupon_redeem_done",
        "value": "使用券已核销"
      },
      {
        "key": "coupon.share_granted",
        "value": "已获得 {count} 张使用券"
      },
      {
        "key": "account.coupon_empty",
        "value": "暂无可用的使用券"
      },
      {
        "key": "account.coupon_claim_placeholder",
        "value": "输入兑换码"
      },
      {
        "key": "account.coupon_claim",
        "value": "领取"
      },
      {
        "key": "account.coupon_claimed",
        "value": "使用券已领取"
      },
      {
        "key": "account.coupon_claim_failed",
        "value": "领取失败"
      },
      {
        "key": "admin.nav_coupons",
        "value": "使用券"
      },
      {
        "key": "admin.coupon_title",
        "value": "使用券管理"
      },
      {
        "key": "admin.coupon_status_unused",
        "value": "未使用"
      },
      {
        "key": "admin.coupon_status_used",
        "value": "已使用"
      },
      {
        "key": "admin.coupon_status_expired",
        "value": "已过期"
      },
      {
        "key": "admin.coupon_status_void",
        "value": "已作废"
      },
      {
        "key": "admin.coupon_batches_empty",
        "value": "还没有券批次"
      },
      {
        "key": "admin.coupon_unassigned",
        "value": "未绑定用户"
      },
      {
        "key": "admin.coupons_empty",
        "value": "还没有使用券"
      },
      {
        "key": "admin.coupon_void",
        "value": "作废"
      },
      {
        "key": "admin.coupon_total",
        "value": "总量"
      },
      {
        "key": "admin.coupon_used",
        "value": "已核销"
      },
      {
        "key": "admin.coupon_expired",
        "value": "已过期"
      },
      {
        "key": "admin.coupon_redemptions",
        "value": "核销记录"
      },
      {
        "key": "admin.coupon_by_source",
        "value": "按来源"
      },
      {
        "key": "admin.coupon_source_empty",
        "value": "暂无来源统计"
      },
      {
        "key": "admin.coupon_generated",
        "value": "生成完成，请复制下方兑换码"
      },
      {
        "key": "admin.coupon_batches_title",
        "value": "券批次"
      },
      {
        "key": "admin.coupon_col_batch",
        "value": "批次"
      },
      {
        "key": "admin.coupon_col_scope",
        "value": "适用范围"
      },
      {
        "key": "admin.coupon_col_days",
        "value": "有效天数"
      },
      {
        "key": "admin.coupon_col_limit",
        "value": "每人限领"
      },
      {
        "key": "admin.coupon_col_source",
        "value": "来源"
      },
      {
        "key": "admin.coupon_col_expires",
        "value": "到期日"
      },
      {
        "key": "admin.coupon_col_id",
        "value": "券ID"
      },
      {
        "key": "admin.coupon_list_title",
        "value": "使用券列表"
      },
      {
        "key": "admin.coupon_batch_create",
        "value": "新建券批次"
      },
      {
        "key": "admin.coupon_batch_save",
        "value": "保存批次"
      },
      {
        "key": "admin.coupon_issue",
        "value": "手动发券"
      },
      {
        "key": "admin.coupon_user_select",
        "value": "选择用户"
      },
      {
        "key": "admin.coupon_issue_save",
        "value": "发券"
      },
      {
        "key": "admin.coupon_generate",
        "value": "在线生成兑换码"
      },
      {
        "key": "admin.coupon_count",
        "value": "生成数量"
      },
      {
        "key": "admin.coupon_generate_save",
        "value": "生成"
      },
      {
        "key": "admin.coupon_void_confirm",
        "value": "确认作废这张使用券？"
      },
      {
        "key": "admin.coupon_voided",
        "value": "已作废"
      },
      {
        "key": "admin.coupon_batch_created",
        "value": "券批次已创建"
      },
      {
        "key": "admin.coupon_issue_done",
        "value": "已发放"
      },
      {
        "key": "detail.updates_title",
        "value": "最近更新"
      },
      {
        "key": "detail.feedback_title",
        "value": "这次结果符合你的预期吗？"
      },
      {
        "key": "detail.feedback_satisfied",
        "value": "满意"
      },
      {
        "key": "detail.feedback_neutral",
        "value": "一般"
      },
      {
        "key": "detail.feedback_problem",
        "value": "有问题"
      },
      {
        "key": "detail.feedback_placeholder",
        "value": "哪里不符合预期？简单说一句即可"
      },
      {
        "key": "detail.feedback_submit",
        "value": "提交反馈"
      },
      {
        "key": "detail.feedback_login",
        "value": "请先登录后反馈"
      },
      {
        "key": "detail.feedback_done",
        "value": "已收到，感谢反馈"
      },
      {
        "key": "detail.feedback_failed",
        "value": "反馈提交失败"
      },
      {
        "key": "detail.activity_loading",
        "value": "正在读取使用情况"
      },
      {
        "key": "detail.activity_total",
        "value": "已使用 {count} 次"
      },
      {
        "key": "detail.activity_done",
        "value": "已完成 {count} 次"
      },
      {
        "key": "detail.activity_ticker",
        "value": "刚刚有用户完成使用"
      },
      {
        "key": "admin.family_tool_media",
        "value": "工具说明素材"
      },
      {
        "key": "admin.family_tool_updates",
        "value": "工具更新说明"
      },
      {
        "key": "admin.nav_feedback",
        "value": "用户反馈"
      },
      {
        "key": "admin.nav_policies",
        "value": "使用门禁"
      },
      {
        "key": "admin.media_slot",
        "value": "槽位"
      },
      {
        "key": "admin.media_type",
        "value": "素材类型"
      },
      {
        "key": "admin.media_src",
        "value": "素材路径"
      },
      {
        "key": "admin.media_poster",
        "value": "封面图"
      },
      {
        "key": "admin.update_version",
        "value": "版本号"
      },
      {
        "key": "admin.update_kind",
        "value": "更新类型"
      },
      {
        "key": "admin.update_date",
        "value": "发布日期"
      },
      {
        "key": "admin.update_summary",
        "value": "摘要"
      },
      {
        "key": "admin.update_detail",
        "value": "详细说明"
      },
      {
        "key": "admin.update_feedback",
        "value": "关联反馈主题"
      },
      {
        "key": "admin.update_status",
        "value": "状态"
      },
      {
        "key": "admin.policy_title",
        "value": "使用门禁配置"
      },
      {
        "key": "admin.policy_mode",
        "value": "门禁模式"
      },
      {
        "key": "admin.policy_trial",
        "value": "允许试用"
      },
      {
        "key": "admin.policy_reason",
        "value": "维护说明"
      },
      {
        "key": "admin.policy_save",
        "value": "保存门禁"
      },
      {
        "key": "admin.policy_saved",
        "value": "门禁已保存"
      },
      {
        "key": "admin.policy_empty",
        "value": "还没有门禁配置"
      },
      {
        "key": "admin.feedback_title",
        "value": "用户反馈"
      },
      {
        "key": "admin.feedback_empty",
        "value": "还没有用户反馈"
      },
      {
        "key": "admin.feedback_total",
        "value": "反馈总量"
      },
      {
        "key": "admin.feedback_resolved",
        "value": "已解决"
      },
      {
        "key": "admin.feedback_rating",
        "value": "评价"
      },
      {
        "key": "admin.feedback_detail",
        "value": "内容"
      },
      {
        "key": "admin.feedback_reply",
        "value": "回复"
      },
      {
        "key": "admin.feedback_saved",
        "value": "反馈已更新"
      },
      {
        "key": "admin.col_id",
        "value": "ID"
      },
      {
        "key": "detail.result_title",
        "value": "处理结果"
      },
      {
        "key": "detail.steps_title",
        "value": "使用步骤"
      },
      {
        "key": "detail.step_upload",
        "value": "上传或选择数据"
      },
      {
        "key": "detail.step_process",
        "value": "系统完成处理"
      },
      {
        "key": "detail.step_download",
        "value": "下载成果文件"
      },
      {
        "key": "detail.data_empty",
        "value": "暂无数据要求"
      },
      {
        "key": "detail.updates_empty",
        "value": "暂无更新记录"
      },
      {
        "key": "detail.feedback_empty",
        "value": "暂无公开反馈"
      },
      {
        "key": "detail.feedback_no_text",
        "value": "未填写详细说明"
      },
      {
        "key": "detail.tab_data",
        "value": "数据说明"
      },
      {
        "key": "detail.tab_updates",
        "value": "更新记录"
      },
      {
        "key": "detail.tab_feedback",
        "value": "用户反馈"
      },
      {
        "key": "admin.family_tool_docs",
        "value": "数据要求"
      },
      {
        "key": "admin.doc_section",
        "value": "分组"
      },
      {
        "key": "admin.doc_content",
        "value": "内容"
      },
      {
        "key": "detail.slide_prev",
        "value": "上一张"
      },
      {
        "key": "detail.slide_next",
        "value": "下一张"
      },
      {
        "key": "detail.slide_dot",
        "value": "第 {index} 张"
      },
      {
        "key": "detail.fullscreen",
        "value": "全屏查看"
      },
      {
        "key": "detail.tab_illustration",
        "value": "一图看懂"
      },
      {
        "key": "detail.feedback_loading",
        "value": "正在读取反馈"
      },
      {
        "key": "detail.feedback_after_use",
        "value": "用过一次这个工具后，就能在这里评价"
      },
      {
        "key": "detail.demo_button",
        "value": "示例数据"
      },
      {
        "key": "detail.price_label",
        "value": "单次使用"
      },
      {
        "key": "detail.pay_entry_coupon",
        "value": "用券兑换（剩 {count} 张）"
      },
      {
        "key": "detail.pay_entry_credit",
        "value": "用额度兑换（剩 {count} 次）"
      },
      {
        "key": "detail.pay_title",
        "value": "选择支付方式"
      },
      {
        "key": "detail.pay_lede",
        "value": "在线支付，或用券 / 额度兑换，兑换后立即开通。"
      },
      {
        "key": "detail.pay_online",
        "value": "在线支付"
      },
      {
        "key": "detail.pay_confirm_redeem",
        "value": "确认兑换"
      },
      {
        "key": "detail.pay_credit_meta",
        "value": "兑换后立即开通"
      },
      {
        "key": "detail.pay_coupon_meta",
        "value": "{count} 次 · {scope} · {date} 前有效"
      },
      {
        "key": "coupon.no_expiry",
        "value": "长期有效"
      },
      {
        "key": "detail.compliance_link",
        "value": "全国建设用地土壤环境管理信息系统"
      },
      {
        "key": "detail.vip_price_tag",
        "value": "VIP 价 {price}"
      },
      {
        "key": "detail.vip_price_line",
        "value": "VIP 价 {price} / 场地"
      },
      {
        "key": "detail.vip_open",
        "value": "开通 VIP"
      },
      {
        "key": "detail.vip_modal_title",
        "value": "开通 VIP，工具按 VIP 价结算"
      },
      {
        "key": "detail.vip_modal_lede",
        "value": "注册就是会员；开通 VIP 后全线工具按 VIP 价结算，另有每年赠送额度。"
      },
      {
        "key": "detail.vip_benefit_discount",
        "value": "全线工具 VIP 价，比普通价更低"
      },
      {
        "key": "detail.vip_benefit_credits",
        "value": "每年 3 次 0 元兑换额度（≤¥169 的方案）"
      },
      {
        "key": "detail.vip_benefit_window",
        "value": "场地复算窗口更长：同一场地重复出成果不再收费"
      },
      {
        "key": "detail.vip_modal_cta",
        "value": "{price} / 年 · 开通 VIP"
      },
      {
        "key": "detail.vip_already",
        "value": "你已是 VIP，正在按 VIP 价结算"
      },
      {
        "key": "detail.demo_note",
        "value": "免费体验"
      },
      {
        "key": "detail.activity_ticker_now",
        "value": "刚刚有用户完成使用"
      },
      {
        "key": "detail.activity_ticker_minutes",
        "value": "{count} 分钟前有用户完成使用"
      },
      {
        "key": "detail.activity_ticker_hours",
        "value": "{count} 小时前有用户完成使用"
      },
      {
        "key": "detail.activity_ticker_days",
        "value": "{count} 天前有用户完成使用"
      },
      {
        "key": "admin.order_reconcile",
        "value": "对账核销"
      },
      {
        "key": "admin.order_reconcile_running",
        "value": "正在向微信查询订单…"
      },
      {
        "key": "admin.order_reconcile_paid",
        "value": "已确认支付并核销，权益已开通"
      },
      {
        "key": "admin.order_reconcile_pending",
        "value": "微信返回未支付，请确认后再试"
      },
      {
        "key": "admin.order_reconcile_failed",
        "value": "对账失败，请稍后重试"
      },
      {
        "key": "account.order_reconcile",
        "value": "我已支付，刷新状态"
      },
      {
        "key": "account.order_reconcile_pending",
        "value": "微信尚未确认到账，请稍后再试"
      },
      {
        "key": "account.order_reconcile_failed",
        "value": "查询失败，请稍后重试"
      },
      {
        "key": "detail.vip_price_label",
        "value": "VIP 价"
      },
      {
        "key": "detail.vip_active",
        "value": "已享 VIP 价"
      },
      {
        "key": "detail.billing_title",
        "value": "计费说明"
      },
      {
        "key": "detail.billing_site",
        "value": "按场地计费：一个场地一份成果"
      },
      {
        "key": "detail.billing_window",
        "value": "同场地 7 天内复算不重复收费"
      },
      {
        "key": "detail.billing_vip",
        "value": "VIP 价 8 折，复算窗口延长到 30 天"
      },
      {
        "key": "toast.request_timeout",
        "value": "请求超时，请检查网络后重试"
      },
      {
        "key": "admin.coupon_channel_placeholder",
        "value": "渠道标记（如：兄弟站A）"
      },
      {
        "key": "admin.coupon_col_channel",
        "value": "渠道"
      },
      {
        "key": "admin.coupon_col_quota",
        "value": "次数"
      },
      {
        "key": "admin.coupon_download_csv",
        "value": "下载 CSV 码包"
      },
      {
        "key": "coupon.quota_times",
        "value": "可用 {count} 次"
      },
      {
        "key": "admin.section_content",
        "value": "内容与工具"
      },
      {
        "key": "admin.section_products",
        "value": "商品与计费"
      },
      {
        "key": "admin.section_users",
        "value": "用户与场地"
      },
      {
        "key": "admin.section_finance",
        "value": "财务"
      },
      {
        "key": "admin.section_system",
        "value": "系统"
      }
    ],
    "billing_plans": [
      {
        "code": "boundary_site",
        "product_code": "boundary_basic",
        "display_name": "单次使用",
        "price_cents": "3900",
        "list_price_cents": "0",
        "duration_days": "",
        "quota_total": "1",
        "max_file_size_mb": "100",
        "max_runtime_seconds": "300",
        "concurrency": "1",
        "feature_codes": "boundary_basic",
        "export_enabled": "true",
        "activation_required": "true",
        "enabled": "true",
        "sort": "10"
      },
      {
        "code": "planboring_site",
        "product_code": "planboring_basic",
        "display_name": "单次使用",
        "price_cents": "9900",
        "list_price_cents": "0",
        "duration_days": "",
        "quota_total": "1",
        "max_file_size_mb": "100",
        "max_runtime_seconds": "300",
        "concurrency": "1",
        "feature_codes": "planboring_basic",
        "export_enabled": "true",
        "activation_required": "true",
        "enabled": "true",
        "sort": "10"
      },
      {
        "code": "vertiplot_site",
        "product_code": "vertiplot_basic",
        "display_name": "单次使用",
        "price_cents": "6900",
        "list_price_cents": "0",
        "duration_days": "",
        "quota_total": "1",
        "max_file_size_mb": "100",
        "max_runtime_seconds": "300",
        "concurrency": "1",
        "feature_codes": "vertiplot_basic",
        "export_enabled": "true",
        "activation_required": "true",
        "enabled": "true",
        "sort": "10"
      },
      {
        "code": "pro_annual",
        "product_code": "pro_membership",
        "display_name": "VIP 年费",
        "price_cents": "29900",
        "list_price_cents": "39900",
        "duration_days": "365",
        "quota_total": "3",
        "max_file_size_mb": "200",
        "max_runtime_seconds": "600",
        "concurrency": "1",
        "feature_codes": "pro_membership",
        "export_enabled": "true",
        "activation_required": "false",
        "enabled": "true",
        "sort": "10"
      }
    ],
    "tool_media": [
      {
        "id": "boundary-hero",
        "tool_code": "boundary",
        "slot": "hero",
        "media_type": "image",
        "title": "上传格式与成果包组成",
        "src": "images/tools/boundary/hero-schematic.svg",
        "poster": "",
        "sort": "10",
        "status": "true"
      }
    ],
    "tool_updates": [
      {
        "id": "boundary-20261014",
        "tool_code": "boundary",
        "version": "v1.0",
        "published_at": "2026-10-14",
        "kind": "feature",
        "title": "成果字段与命名按提交要求整理",
        "summary": "成果包里的字段、日期格式与命名都按提交要求输出，可直接提交。",
        "detail": "",
        "related_feedback": "",
        "status": "published",
        "sort": "10"
      },
      {
        "id": "boundary-20261015-sample",
        "tool_code": "boundary",
        "version": "v1.1",
        "published_at": "2026-10-15",
        "kind": "feature",
        "title": "没购买也能先用示例数据跑一遍",
        "summary": "示例数据免费体验：先看清成果包的字段与命名，再决定是否开通。",
        "detail": "",
        "related_feedback": "",
        "status": "published",
        "sort": "20"
      },
      {
        "id": "boundary-20261016-detail",
        "tool_code": "boundary",
        "version": "v1.2",
        "published_at": "2026-10-16",
        "kind": "improve",
        "title": "详情页与购买流程重做",
        "summary": "一图看懂 / 数据说明 / 价格与 VIP 价一目了然，支持用券或额度兑换。",
        "detail": "",
        "related_feedback": "",
        "status": "published",
        "sort": "30"
      },
      {
        "id": "boundary-20261016-copy",
        "tool_code": "boundary",
        "version": "v1.3",
        "published_at": "2026-10-16",
        "kind": "doc",
        "title": "说明按接收要求口径改写",
        "summary": "上传格式、成果包内容、识别失败怎么办三条说明改短句；成果命名与字段口径对齐提交要求。",
        "detail": "",
        "related_feedback": "",
        "status": "published",
        "sort": "40"
      },
      {
        "id": "boundary-20261016-account",
        "tool_code": "boundary",
        "version": "v1.4",
        "published_at": "2026-10-16",
        "kind": "feature",
        "title": "购买后权益跟着账号走，重启也不丢",
        "summary": "订单与场地权益持久化保存；同一个场地复算窗口内不重复收费，账号中心能看到已登记的场地四至。",
        "detail": "",
        "related_feedback": "",
        "status": "published",
        "sort": "50"
      },
      {
        "id": "boundary-20261016-entry",
        "tool_code": "boundary",
        "version": "v1.5",
        "published_at": "2026-10-16",
        "kind": "improve",
        "title": "示例数据直接体验，自己的数据按权益放行",
        "summary": "从 FigHub 进入工具后，上传自己的地块边界会先核对场地权益，没有权益会在工具里直接给出开通入口。",
        "detail": "",
        "related_feedback": "",
        "status": "published",
        "sort": "60"
      }
    ],
    "tool_docs": [
      {
        "id": "boundary-shp",
        "tool_code": "boundary",
        "section": "data",
        "title": "上传文件格式",
        "content": "Shapefile 整套（.shp/.shx/.dbf/.prj）；dxf · kml · kmz；xlsx · xls · csv · txt；文件能读即可，不必先统一坐标系",
        "sort": "10",
        "status": "true"
      },
      {
        "id": "boundary-fields",
        "tool_code": "boundary",
        "section": "data",
        "title": "成果包内容",
        "content": "同名文件夹：边界文件 + 字段说明 + 成果图；地块面积自动计算，可手工修正；字段按接收要求写入；命名：所处阶段 + 地块编码",
        "sort": "20",
        "status": "true"
      },
      {
        "id": "boundary-fallback",
        "tool_code": "boundary",
        "section": "data",
        "title": "识别不到时怎么办",
        "content": "带号认不出 → 手工指定中央经线；行政区认不出 → 手工填写（接收要求必填）",
        "sort": "30",
        "status": "true"
      }
    ]
  },
  "admin": {
    "stats": {
      "range_days": 7,
      "visits": {
        "views": 1688,
        "visitors": 236
      },
      "top_pages": [
        {
          "path": "#tool/boundary",
          "views": 326
        },
        {
          "path": "#home",
          "views": 214
        },
        {
          "path": "#tools",
          "views": 173
        },
        {
          "path": "#pricing",
          "views": 136
        },
        {
          "path": "#tool/xy",
          "views": 121
        }
      ],
      "top_tools": [
        {
          "tool": "boundary",
          "opens": 98
        },
        {
          "tool": "xy",
          "opens": 54
        },
        {
          "tool": "vertiplot",
          "opens": 31
        }
      ],
      "users": {
        "registrations": 242,
        "logins": 119
      },
      "orders": {
        "created": 132,
        "paid": 116,
        "gmv_cents": 842400
      },
      "invoices": {
        "submitted": 3
      },
      "by_day": [
        {
          "date": "2026-10-13",
          "views": 122,
          "visitors": 18,
          "registrations": 11,
          "orders_created": 6,
          "orders_paid": 5,
          "gmv_cents": 43200
        },
        {
          "date": "2026-10-14",
          "views": 182,
          "visitors": 27,
          "registrations": 16,
          "orders_created": 9,
          "orders_paid": 8,
          "gmv_cents": 57600
        },
        {
          "date": "2026-10-15",
          "views": 238,
          "visitors": 36,
          "registrations": 22,
          "orders_created": 12,
          "orders_paid": 10,
          "gmv_cents": 73200
        },
        {
          "date": "2026-10-16",
          "views": 264,
          "visitors": 41,
          "registrations": 19,
          "orders_created": 14,
          "orders_paid": 12,
          "gmv_cents": 86400
        },
        {
          "date": "2026-10-17",
          "views": 302,
          "visitors": 45,
          "registrations": 24,
          "orders_created": 16,
          "orders_paid": 14,
          "gmv_cents": 102600
        },
        {
          "date": "2026-10-18",
          "views": 336,
          "visitors": 52,
          "registrations": 28,
          "orders_created": 19,
          "orders_paid": 17,
          "gmv_cents": 126000
        },
        {
          "date": "2026-10-19",
          "views": 244,
          "visitors": 38,
          "registrations": 21,
          "orders_created": 15,
          "orders_paid": 13,
          "gmv_cents": 93600
        }
      ]
    },
    "sites": {
      "sites": [
        {
          "site_id": "SITE-DEMO-001",
          "label": "某工业园区 A 地块",
          "user_id": "local-1001",
          "tool_code": "boundary",
          "centroid_lat": 36.22575,
          "centroid_lon": 116.30825,
          "area_m2": 110559.3,
          "point_count": 7,
          "bounds": [
            116.301,
            36.22,
            116.3155,
            36.2315
          ],
          "crs": "EPSG:4326",
          "runs": 3,
          "first_seen_at": "2026-10-15T09:20:00+08:00",
          "last_run_at": "2026-10-18T14:30:00+08:00",
          "window_until": "2026-10-25T14:30:00+08:00"
        },
        {
          "site_id": "SITE-DEMO-002",
          "label": "某化工地块 B 区",
          "user_id": "local-1002",
          "tool_code": "boundary",
          "centroid_lat": 32.054500000000004,
          "centroid_lon": 118.75,
          "area_m2": 131039.3,
          "point_count": 8,
          "bounds": [
            118.742,
            32.048,
            118.758,
            32.061
          ],
          "crs": "EPSG:4326",
          "runs": 2,
          "first_seen_at": "2026-10-16T09:20:00+08:00",
          "last_run_at": "2026-10-17T14:30:00+08:00",
          "window_until": "2026-10-24T14:30:00+08:00"
        },
        {
          "site_id": "SITE-DEMO-003",
          "label": "某填埋场调查区",
          "user_id": "local-1006",
          "tool_code": "boundary",
          "centroid_lat": 23.087,
          "centroid_lon": 113.2175,
          "area_m2": 151519.3,
          "point_count": 9,
          "bounds": [
            113.21,
            23.08,
            113.225,
            23.094
          ],
          "crs": "EPSG:4326",
          "runs": 1,
          "first_seen_at": "2026-10-17T09:20:00+08:00",
          "last_run_at": "2026-10-16T14:30:00+08:00",
          "window_until": "2026-10-23T14:30:00+08:00"
        }
      ],
      "runs": [
        {
          "run_id": "RUN-DEMO-012",
          "user_id": "local-1001",
          "tool_code": "boundary",
          "decision": "covered",
          "site_id": "SITE-DEMO-001",
          "reason": "site_window",
          "created_at": "2026-10-18T14:30:00+08:00"
        },
        {
          "run_id": "RUN-DEMO-011",
          "user_id": "local-1002",
          "tool_code": "boundary",
          "decision": "covered",
          "site_id": "SITE-DEMO-002",
          "reason": "bound",
          "created_at": "2026-10-18T11:22:00+08:00"
        },
        {
          "run_id": "RUN-DEMO-010",
          "user_id": "local-1006",
          "tool_code": "boundary",
          "decision": "purchase_required",
          "site_id": "SITE-DEMO-003",
          "reason": "window_expired",
          "created_at": "2026-10-17T18:05:00+08:00"
        }
      ]
    },
    "users": {
      "accounts": [
        {
          "id": 1001,
          "email": "demo-1001@example.com",
          "display_name": "林工",
          "status": "active",
          "email_verified": true,
          "created_at": "2026-08-16T09:12:00+08:00",
          "last_login": "2026-10-18T16:42:00+08:00"
        },
        {
          "id": 1002,
          "email": "demo-1002@example.com",
          "display_name": "周工",
          "status": "active",
          "email_verified": true,
          "created_at": "2026-08-20T14:20:00+08:00",
          "last_login": "2026-10-18T11:08:00+08:00"
        },
        {
          "id": 1003,
          "email": "demo-1003@example.com",
          "display_name": "陈工",
          "status": "active",
          "email_verified": true,
          "created_at": "2026-09-01T10:05:00+08:00",
          "last_login": "2026-10-17T20:31:00+08:00"
        },
        {
          "id": 1004,
          "email": "demo-1004@example.com",
          "display_name": "王工",
          "status": "active",
          "email_verified": false,
          "created_at": "2026-09-08T08:47:00+08:00",
          "last_login": null
        },
        {
          "id": 1005,
          "email": "demo-1005@example.com",
          "display_name": "赵工",
          "status": "disabled",
          "email_verified": true,
          "created_at": "2026-09-12T13:36:00+08:00",
          "last_login": "2026-10-12T09:14:00+08:00"
        },
        {
          "id": 1006,
          "email": "demo-1006@example.com",
          "display_name": "孙工",
          "status": "active",
          "email_verified": true,
          "created_at": "2026-09-18T17:03:00+08:00",
          "last_login": "2026-10-18T08:56:00+08:00"
        },
        {
          "id": 1007,
          "email": "demo-1007@example.com",
          "display_name": "刘工",
          "status": "active",
          "email_verified": true,
          "created_at": "2026-09-23T11:11:00+08:00",
          "last_login": "2026-10-16T15:22:00+08:00"
        },
        {
          "id": 1008,
          "email": "demo-1008@example.com",
          "display_name": "何工",
          "status": "active",
          "email_verified": true,
          "created_at": "2026-10-02T09:31:00+08:00",
          "last_login": "2026-10-18T19:05:00+08:00"
        }
      ],
      "total": 242
    },
    "orders": {
      "orders": [
        {
          "biz_order_no": "YYKJ-DEMO-20261018-001",
          "user_id": "local-1001",
          "amount_cents": 3900,
          "currency": "CNY",
          "status": "paid",
          "provider_order_no": "DEV-YYKJ-DEMO-001",
          "created_at": "2026-10-18T09:22:14+08:00",
          "paid_at": "2026-10-18T09:23:02+08:00",
          "credit_cents": 0,
          "credit_source": "",
          "items": [
            {
              "product_code": "boundary_basic",
              "plan_code": "boundary_site",
              "quantity": 1,
              "unit_amount_cents": 3900,
              "feature_codes": [
                "boundary_basic"
              ],
              "duration_days": null,
              "quota_total": 1,
              "max_file_size_mb": 100,
              "max_runtime_seconds": 300,
              "concurrency": 1,
              "export_enabled": true,
              "activation_required": true
            }
          ]
        },
        {
          "biz_order_no": "YYKJ-DEMO-20261018-002",
          "user_id": "local-1002",
          "amount_cents": 29900,
          "currency": "CNY",
          "status": "paid",
          "provider_order_no": "DEV-YYKJ-DEMO-002",
          "created_at": "2026-10-18T10:10:11+08:00",
          "paid_at": "2026-10-18T10:11:40+08:00",
          "credit_cents": 0,
          "credit_source": "",
          "items": [
            {
              "product_code": "pro_membership",
              "plan_code": "pro_annual",
              "quantity": 1,
              "unit_amount_cents": 29900,
              "feature_codes": [
                "pro_membership"
              ],
              "duration_days": null,
              "quota_total": 1,
              "max_file_size_mb": 100,
              "max_runtime_seconds": 300,
              "concurrency": 1,
              "export_enabled": true,
              "activation_required": true
            }
          ]
        },
        {
          "biz_order_no": "YYKJ-DEMO-20261018-003",
          "user_id": "local-1003",
          "amount_cents": 6900,
          "currency": "CNY",
          "status": "pending",
          "provider_order_no": "",
          "created_at": "2026-10-18T14:35:09+08:00",
          "paid_at": null,
          "credit_cents": 0,
          "credit_source": "",
          "items": [
            {
              "product_code": "vertiplot_basic",
              "plan_code": "vertiplot_site",
              "quantity": 1,
              "unit_amount_cents": 6900,
              "feature_codes": [
                "vertiplot_basic"
              ],
              "duration_days": null,
              "quota_total": 1,
              "max_file_size_mb": 100,
              "max_runtime_seconds": 300,
              "concurrency": 1,
              "export_enabled": true,
              "activation_required": true
            }
          ]
        },
        {
          "biz_order_no": "YYKJ-DEMO-20261017-004",
          "user_id": "local-1006",
          "amount_cents": 9900,
          "currency": "CNY",
          "status": "paid",
          "provider_order_no": "DEV-YYKJ-DEMO-004",
          "created_at": "2026-10-17T16:20:31+08:00",
          "paid_at": "2026-10-17T16:21:08+08:00",
          "credit_cents": 0,
          "credit_source": "",
          "items": [
            {
              "product_code": "planboring_basic",
              "plan_code": "planboring_site",
              "quantity": 1,
              "unit_amount_cents": 9900,
              "feature_codes": [
                "planboring_basic"
              ],
              "duration_days": null,
              "quota_total": 1,
              "max_file_size_mb": 100,
              "max_runtime_seconds": 300,
              "concurrency": 1,
              "export_enabled": true,
              "activation_required": true
            }
          ]
        },
        {
          "biz_order_no": "YYKJ-DEMO-20261017-005",
          "user_id": "local-1007",
          "amount_cents": 3900,
          "currency": "CNY",
          "status": "refunded",
          "provider_order_no": "DEV-YYKJ-DEMO-005",
          "created_at": "2026-10-17T09:12:46+08:00",
          "paid_at": "2026-10-17T09:13:02+08:00",
          "credit_cents": 0,
          "credit_source": "",
          "items": [
            {
              "product_code": "boundary_basic",
              "plan_code": "boundary_site",
              "quantity": 1,
              "unit_amount_cents": 3900,
              "feature_codes": [
                "boundary_basic"
              ],
              "duration_days": null,
              "quota_total": 1,
              "max_file_size_mb": 100,
              "max_runtime_seconds": 300,
              "concurrency": 1,
              "export_enabled": true,
              "activation_required": true
            }
          ]
        },
        {
          "biz_order_no": "YYKJ-DEMO-20261016-006",
          "user_id": "local-1008",
          "amount_cents": 6900,
          "currency": "CNY",
          "status": "paid",
          "provider_order_no": "DEV-YYKJ-DEMO-006",
          "created_at": "2026-10-16T19:40:12+08:00",
          "paid_at": "2026-10-16T19:41:10+08:00",
          "credit_cents": 0,
          "credit_source": "",
          "items": [
            {
              "product_code": "vertiplot_basic",
              "plan_code": "vertiplot_site",
              "quantity": 1,
              "unit_amount_cents": 6900,
              "feature_codes": [
                "vertiplot_basic"
              ],
              "duration_days": null,
              "quota_total": 1,
              "max_file_size_mb": 100,
              "max_runtime_seconds": 300,
              "concurrency": 1,
              "export_enabled": true,
              "activation_required": true
            }
          ]
        }
      ],
      "total": 132
    },
    "invoices": {
      "invoices": [
        {
          "invoice_id": "INV-DEMO-001",
          "biz_order_no": "YYKJ-DEMO-20261018-002",
          "user_id": "local-1002",
          "amount_cents": 29900,
          "status": "issued",
          "profile": {
            "title": "北京示例环境科技有限公司",
            "tax_no": "91110108MA01DEMO2X"
          },
          "invoice_no": "26611000000012345678",
          "download_url": "https://example.com/demo-invoice-001.pdf",
          "email": "finance@example.com",
          "created_at": "2026-10-18T11:20:00+08:00"
        },
        {
          "invoice_id": "INV-DEMO-002",
          "biz_order_no": "YYKJ-DEMO-20261017-004",
          "user_id": "local-1006",
          "amount_cents": 9900,
          "status": "reviewing",
          "profile": {
            "title": "华东示例检测有限公司",
            "tax_no": "91310000MA1DEMO8Q"
          },
          "invoice_no": "",
          "download_url": "",
          "email": "invoice@example.com",
          "created_at": "2026-10-17T18:02:00+08:00"
        },
        {
          "invoice_id": "INV-DEMO-003",
          "biz_order_no": "YYKJ-DEMO-20261016-006",
          "user_id": "local-1008",
          "amount_cents": 6900,
          "status": "rejected",
          "profile": {
            "title": "个人",
            "tax_no": ""
          },
          "invoice_no": "",
          "download_url": "",
          "email": "demo-1008@example.com",
          "created_at": "2026-10-16T21:11:00+08:00"
        }
      ],
      "total": 3
    },
    "refunds": {
      "refunds": [
        {
          "refund_id": "RF-DEMO-001",
          "user_id": "local-1007",
          "biz_order_no": "YYKJ-DEMO-20261017-005",
          "amount_cents": 3900,
          "reason": "重复购买，原订单已通过额度覆盖。",
          "status": "requested",
          "note": "",
          "created_at": "2026-10-18T08:42:00+08:00",
          "updated_at": "2026-10-18T08:42:00+08:00"
        },
        {
          "refund_id": "RF-DEMO-002",
          "user_id": "local-1003",
          "biz_order_no": "YYKJ-DEMO-20261018-003",
          "amount_cents": 6900,
          "reason": "项目场地临时调整，申请取消。",
          "status": "approved",
          "note": "已核对，未生成成果。",
          "created_at": "2026-10-18T15:04:00+08:00",
          "updated_at": "2026-10-18T15:20:00+08:00"
        }
      ],
      "total": 2
    },
    "coupons": {
      "coupons": [
        {
          "coupon_id": "CP-DEMO-001",
          "batch_code": "welcome_2026q4",
          "code": "YK-DEMO-8A31C2",
          "user_id": "local-1001",
          "tool_code": "all",
          "status": "unused",
          "source": "welcome",
          "source_ref": "demo-1001@example.com",
          "claimed_at": "2026-10-17T10:20:00+08:00",
          "expires_at": "2026-11-16T23:59:59+08:00",
          "used_at": "",
          "order_no": "",
          "quota": 1,
          "channel": "公众号"
        },
        {
          "coupon_id": "CP-DEMO-002",
          "batch_code": "share_reward",
          "code": "YK-DEMO-61F4A9",
          "user_id": "local-1002",
          "tool_code": "boundary",
          "status": "used",
          "source": "share",
          "source_ref": "share-card-02",
          "claimed_at": "2026-10-16T11:02:00+08:00",
          "expires_at": "2026-11-15T23:59:59+08:00",
          "used_at": "2026-10-18T09:22:00+08:00",
          "order_no": "YYKJ-DEMO-20261018-001",
          "quota": 1,
          "channel": "分享卡"
        },
        {
          "coupon_id": "CP-DEMO-003",
          "batch_code": "welcome_2026q4",
          "code": "YK-DEMO-2C76E5",
          "user_id": "local-1006",
          "tool_code": "vertiplot",
          "status": "expired",
          "source": "welcome",
          "source_ref": "demo-1006@example.com",
          "claimed_at": "2026-09-15T09:00:00+08:00",
          "expires_at": "2026-10-15T23:59:59+08:00",
          "used_at": "",
          "order_no": "",
          "quota": 1,
          "channel": "公众号"
        },
        {
          "coupon_id": "CP-DEMO-004",
          "batch_code": "service_recovery",
          "code": "YK-DEMO-1B9D03",
          "user_id": "local-1008",
          "tool_code": "all",
          "status": "unused",
          "source": "compensation",
          "source_ref": "ticket-2031",
          "claimed_at": "2026-10-18T13:15:00+08:00",
          "expires_at": "2026-11-17T23:59:59+08:00",
          "used_at": "",
          "order_no": "",
          "quota": 2,
          "channel": "人工发放"
        }
      ],
      "total": 42
    },
    "batches": {
      "batches": [
        {
          "batch_code": "welcome_2026q4",
          "name": "新用户欢迎券",
          "kind": "trial_times",
          "tool_scope": "per_tool",
          "valid_days": 30,
          "per_user_limit": 1,
          "quota": 1,
          "channel": "公众号",
          "status": "active",
          "created_at": "2026-10-01T09:00:00+08:00"
        },
        {
          "batch_code": "share_reward",
          "name": "分享奖励使用券",
          "kind": "trial_times",
          "tool_scope": "per_tool",
          "valid_days": 30,
          "per_user_limit": 0,
          "quota": 1,
          "channel": "分享卡",
          "status": "active",
          "created_at": "2026-10-08T10:30:00+08:00"
        },
        {
          "batch_code": "service_recovery",
          "name": "服务补偿使用券",
          "kind": "trial_times",
          "tool_scope": "all",
          "valid_days": 30,
          "per_user_limit": 0,
          "quota": 2,
          "channel": "人工发放",
          "status": "active",
          "created_at": "2026-10-12T14:00:00+08:00"
        }
      ]
    },
    "couponStats": {
      "total": 42,
      "used": 11,
      "expired": 5,
      "redemptions": 11,
      "by_source": {
        "welcome": 30,
        "share": 9,
        "compensation": 3
      }
    },
    "policies": {
      "policies": [
        {
          "tool_code": "boundary",
          "access_mode": "paid",
          "trial_allowed": true,
          "maintenance_reason": "",
          "enabled": true,
          "updated_at": "2026-10-18T09:00:00+08:00"
        },
        {
          "tool_code": "xy",
          "access_mode": "preview",
          "trial_allowed": true,
          "maintenance_reason": "",
          "enabled": true,
          "updated_at": "2026-10-18T09:00:00+08:00"
        },
        {
          "tool_code": "toshp",
          "access_mode": "preview",
          "trial_allowed": true,
          "maintenance_reason": "示例：服务升级窗口",
          "enabled": false,
          "updated_at": "2026-10-18T09:00:00+08:00"
        },
        {
          "tool_code": "dem",
          "access_mode": "paid",
          "trial_allowed": true,
          "maintenance_reason": "",
          "enabled": true,
          "updated_at": "2026-10-18T09:00:00+08:00"
        },
        {
          "tool_code": "groundwater",
          "access_mode": "paid",
          "trial_allowed": true,
          "maintenance_reason": "",
          "enabled": true,
          "updated_at": "2026-10-18T09:00:00+08:00"
        },
        {
          "tool_code": "spatial_viewer",
          "access_mode": "preview",
          "trial_allowed": true,
          "maintenance_reason": "",
          "enabled": true,
          "updated_at": "2026-10-18T09:00:00+08:00"
        },
        {
          "tool_code": "layout",
          "access_mode": "preview",
          "trial_allowed": true,
          "maintenance_reason": "",
          "enabled": true,
          "updated_at": "2026-10-18T09:00:00+08:00"
        },
        {
          "tool_code": "planboring",
          "access_mode": "paid",
          "trial_allowed": true,
          "maintenance_reason": "",
          "enabled": true,
          "updated_at": "2026-10-18T09:00:00+08:00"
        },
        {
          "tool_code": "vertiplot",
          "access_mode": "paid",
          "trial_allowed": true,
          "maintenance_reason": "",
          "enabled": true,
          "updated_at": "2026-10-18T09:00:00+08:00"
        },
        {
          "tool_code": "custom",
          "access_mode": "preview",
          "trial_allowed": true,
          "maintenance_reason": "",
          "enabled": true,
          "updated_at": "2026-10-18T09:00:00+08:00"
        },
        {
          "tool_code": "data_import",
          "access_mode": "preview",
          "trial_allowed": true,
          "maintenance_reason": "",
          "enabled": true,
          "updated_at": "2026-10-18T09:00:00+08:00"
        },
        {
          "tool_code": "coc_cleaning",
          "access_mode": "preview",
          "trial_allowed": true,
          "maintenance_reason": "",
          "enabled": true,
          "updated_at": "2026-10-18T09:00:00+08:00"
        },
        {
          "tool_code": "risk_check",
          "access_mode": "paid",
          "trial_allowed": true,
          "maintenance_reason": "",
          "enabled": true,
          "updated_at": "2026-10-18T09:00:00+08:00"
        },
        {
          "tool_code": "boring_cleaning",
          "access_mode": "preview",
          "trial_allowed": true,
          "maintenance_reason": "",
          "enabled": true,
          "updated_at": "2026-10-18T09:00:00+08:00"
        },
        {
          "tool_code": "sample_cleaning",
          "access_mode": "preview",
          "trial_allowed": true,
          "maintenance_reason": "",
          "enabled": true,
          "updated_at": "2026-10-18T09:00:00+08:00"
        },
        {
          "tool_code": "imagery_download",
          "access_mode": "preview",
          "trial_allowed": true,
          "maintenance_reason": "",
          "enabled": true,
          "updated_at": "2026-10-18T09:00:00+08:00"
        },
        {
          "tool_code": "history_archive",
          "access_mode": "preview",
          "trial_allowed": true,
          "maintenance_reason": "",
          "enabled": true,
          "updated_at": "2026-10-18T09:00:00+08:00"
        },
        {
          "tool_code": "report_builder",
          "access_mode": "paid",
          "trial_allowed": true,
          "maintenance_reason": "",
          "enabled": true,
          "updated_at": "2026-10-18T09:00:00+08:00"
        },
        {
          "tool_code": "aggregation",
          "access_mode": "paid",
          "trial_allowed": true,
          "maintenance_reason": "",
          "enabled": true,
          "updated_at": "2026-10-18T09:00:00+08:00"
        },
        {
          "tool_code": "remediation",
          "access_mode": "paid",
          "trial_allowed": true,
          "maintenance_reason": "",
          "enabled": true,
          "updated_at": "2026-10-18T09:00:00+08:00"
        },
        {
          "tool_code": "numerical_sim",
          "access_mode": "preview",
          "trial_allowed": true,
          "maintenance_reason": "",
          "enabled": true,
          "updated_at": "2026-10-18T09:00:00+08:00"
        }
      ]
    },
    "feedback": {
      "feedback": [
        {
          "feedback_id": "FB-DEMO-001",
          "tool_code": "boundary",
          "user_id": "local-1001",
          "run_id": "RUN-DEMO-001",
          "order_no": "YYKJ-DEMO-20261018-001",
          "rating": "satisfied",
          "detail": "成果包字段说明清楚，图件可以直接放进报告。",
          "status": "resolved",
          "admin_reply": "感谢反馈，后续会继续完善图例与比例尺选项。",
          "created_at": "2026-10-18T10:04:00+08:00",
          "updated_at": "2026-10-18T10:40:00+08:00"
        },
        {
          "feedback_id": "FB-DEMO-002",
          "tool_code": "xy",
          "user_id": "local-1003",
          "run_id": "RUN-DEMO-004",
          "order_no": "",
          "rating": "neutral",
          "detail": "希望右侧结果表可以固定表头，并支持一键复制异常点。",
          "status": "reviewing",
          "admin_reply": "",
          "created_at": "2026-10-18T12:40:00+08:00",
          "updated_at": "2026-10-18T12:40:00+08:00"
        },
        {
          "feedback_id": "FB-DEMO-003",
          "tool_code": "boundary",
          "user_id": "local-1006",
          "run_id": "RUN-DEMO-008",
          "order_no": "YYKJ-DEMO-20261017-004",
          "rating": "problem",
          "detail": "样例数据载入后，地图缩放没有回到图斑范围。",
          "status": "new",
          "admin_reply": "",
          "created_at": "2026-10-18T16:15:00+08:00",
          "updated_at": "2026-10-18T16:15:00+08:00"
        },
        {
          "feedback_id": "FB-DEMO-004",
          "tool_code": "vertiplot",
          "user_id": "local-1008",
          "run_id": "RUN-DEMO-012",
          "order_no": "YYKJ-DEMO-20261016-006",
          "rating": "satisfied",
          "detail": "垂向图的配色和导出尺寸符合项目要求。",
          "status": "closed",
          "admin_reply": "已记录，感谢使用。",
          "created_at": "2026-10-17T09:50:00+08:00",
          "updated_at": "2026-10-17T10:10:00+08:00"
        }
      ],
      "total": 4
    },
    "feedbackStats": {
      "total": 4,
      "resolved": 1,
      "by_rating": {
        "satisfied": 2,
        "neutral": 1,
        "problem": 1
      }
    },
    "changes": {
      "changes": [
        {
          "ts": "2026-10-18T16:20:00+08:00",
          "action": "update",
          "target": "tools/boundary"
        },
        {
          "ts": "2026-10-18T15:06:00+08:00",
          "action": "update",
          "target": "tool_updates/boundary-v1.5"
        },
        {
          "ts": "2026-10-18T11:32:00+08:00",
          "action": "create",
          "target": "datasets/survey-points"
        }
      ]
    }
  },
  "session": {
    "user": {
      "sub": "local-1001",
      "name": "林工",
      "preferred_username": "林工",
      "email": "demo-1001@example.com",
      "email_verified": true,
      "auth_provider": "email"
    }
  },
  "profile": {
    "display_name": "林工",
    "email": "demo-1001@example.com",
    "joined_at": "2026-08-16T09:12:00+08:00",
    "has_password": true,
    "wechat_bound": false,
    "needs_email": false
  },
  "membership": {
    "active": false,
    "end_at": "",
    "discount_percent": 80,
    "credits_remaining": 0,
    "credit_limit_cents": 5000
  },
  "account": {
    "orders": {
      "orders": [
        {
          "biz_order_no": "YYKJ-DEMO-20261018-001",
          "user_id": "local-1001",
          "amount_cents": 3900,
          "currency": "CNY",
          "status": "paid",
          "provider_order_no": "DEV-YYKJ-DEMO-001",
          "created_at": "2026-10-18T09:22:14+08:00",
          "paid_at": "2026-10-18T09:23:02+08:00",
          "credit_cents": 0,
          "credit_source": "",
          "items": [
            {
              "product_code": "boundary_basic",
              "plan_code": "boundary_site",
              "quantity": 1,
              "unit_amount_cents": 3900,
              "feature_codes": [
                "boundary_basic"
              ],
              "duration_days": null,
              "quota_total": 1,
              "max_file_size_mb": 100,
              "max_runtime_seconds": 300,
              "concurrency": 1,
              "export_enabled": true,
              "activation_required": true
            }
          ]
        },
        {
          "biz_order_no": "YYKJ-DEMO-20261018-002",
          "user_id": "local-1001",
          "amount_cents": 29900,
          "currency": "CNY",
          "status": "paid",
          "provider_order_no": "DEV-YYKJ-DEMO-002",
          "created_at": "2026-10-18T10:10:11+08:00",
          "paid_at": "2026-10-18T10:11:40+08:00",
          "credit_cents": 0,
          "credit_source": "",
          "items": [
            {
              "product_code": "pro_membership",
              "plan_code": "pro_annual",
              "quantity": 1,
              "unit_amount_cents": 29900,
              "feature_codes": [
                "pro_membership"
              ],
              "duration_days": null,
              "quota_total": 1,
              "max_file_size_mb": 100,
              "max_runtime_seconds": 300,
              "concurrency": 1,
              "export_enabled": true,
              "activation_required": true
            }
          ]
        }
      ]
    },
    "entitlements": {
      "entitlements": [
        {
          "feature_code": "boundary_basic",
          "status": "active",
          "end_at": "2026-10-25T14:30:00+08:00",
          "remaining_quota": 1
        }
      ]
    },
    "invoices": {
      "invoices": [
        {
          "invoice_id": "INV-DEMO-001",
          "biz_order_no": "YYKJ-DEMO-20261018-002",
          "amount_cents": 29900,
          "status": "issued"
        }
      ]
    },
    "coupons": {
      "coupons": [
        {
          "coupon_id": "CP-DEMO-001",
          "batch_code": "welcome_2026q4",
          "code": "YK-DEMO-8A31C2",
          "user_id": "local-1001",
          "tool_code": "all",
          "status": "unused",
          "source": "welcome",
          "source_ref": "demo-1001@example.com",
          "claimed_at": "2026-10-17T10:20:00+08:00",
          "expires_at": "2026-11-16T23:59:59+08:00",
          "used_at": "",
          "order_no": "",
          "quota": 1,
          "channel": "公众号"
        }
      ]
    },
    "refunds": {
      "refunds": []
    },
    "sites": {
      "sites": [
        {
          "site_id": "SITE-DEMO-001",
          "label": "某工业园区 A 地块",
          "bounds": [
            116.301,
            36.22,
            116.3155,
            36.2315
          ],
          "hit_count": 3
        }
      ]
    },
    "share": {
      "credits": 1,
      "credit_limit_cents": 5000,
      "history": [
        {
          "created_at": "2026-10-17T10:20:00+08:00",
          "channel": "微信"
        }
      ]
    }
  },
  "activity": {
    "boundary": {
      "total_runs": 128,
      "covered_runs": 96,
      "recent": [
        {
          "created_at": "2026-10-19T11:11:46.805Z"
        }
      ]
    },
    "xy": {
      "total_runs": 84,
      "covered_runs": 71,
      "recent": [
        {
          "created_at": "2026-10-19T08:53:46.806Z"
        }
      ]
    }
  },
  "feedback": {
    "boundary": {
      "feedback": [
        {
          "rating": "satisfied",
          "detail": "成果包字段和命名都很清楚。",
          "admin_reply": "感谢反馈。"
        },
        {
          "rating": "neutral",
          "detail": "希望增加历史成果对比。",
          "admin_reply": ""
        }
      ],
      "eligibility": {
        "login_required": false,
        "eligible": true,
        "runs": 3
      }
    }
  },
  "products": [
    {
      "code": "pro_membership",
      "tool_code": "membership",
      "display_name": "VIP会员",
      "description": "VIP 专属权益：全线工具 8 折、每年 3 次高价值额度、场地复算窗口 30 天。",
      "plans": [
        {
          "code": "pro_annual",
          "display_name": "VIP 年费",
          "price_cents": 29900,
          "list_price_cents": 39900,
          "currency": "CNY",
          "duration_days": 365,
          "quota_total": 3,
          "max_file_size_mb": 200,
          "max_runtime_seconds": 600,
          "concurrency": 1,
          "export_enabled": true,
          "activation_required": false
        }
      ]
    },
    {
      "code": "boundary_basic",
      "tool_code": "boundary",
      "display_name": "边界成果整理",
      "description": "固定数据输入、固定专题输出；一次购买对应一个场地的一份成果。",
      "plans": [
        {
          "code": "boundary_site",
          "display_name": "单次使用",
          "price_cents": 3900,
          "list_price_cents": 0,
          "currency": "CNY",
          "duration_days": null,
          "quota_total": 1,
          "max_file_size_mb": 100,
          "max_runtime_seconds": 300,
          "concurrency": 1,
          "export_enabled": true,
          "activation_required": true
        }
      ]
    },
    {
      "code": "planboring_basic",
      "tool_code": "planboring",
      "display_name": "钻孔布点规划",
      "description": "固定数据输入、固定专题输出；一次购买对应一个场地的一份成果。",
      "plans": [
        {
          "code": "planboring_site",
          "display_name": "单次使用",
          "price_cents": 9900,
          "list_price_cents": 0,
          "currency": "CNY",
          "duration_days": null,
          "quota_total": 1,
          "max_file_size_mb": 100,
          "max_runtime_seconds": 300,
          "concurrency": 1,
          "export_enabled": true,
          "activation_required": true
        }
      ]
    },
    {
      "code": "vertiplot_basic",
      "tool_code": "vertiplot",
      "display_name": "垂向分布制图",
      "description": "固定数据输入、固定专题输出；一次购买对应一个场地的一份成果。",
      "plans": [
        {
          "code": "vertiplot_site",
          "display_name": "单次使用",
          "price_cents": 6900,
          "list_price_cents": 0,
          "currency": "CNY",
          "duration_days": null,
          "quota_total": 1,
          "max_file_size_mb": 100,
          "max_runtime_seconds": 300,
          "concurrency": 1,
          "export_enabled": true,
          "activation_required": true
        }
      ]
    }
  ],
  "tools": [
    {
      "slug": "boundary",
      "toolCode": "boundary",
      "route": "/tools/boundary",
      "name": "边界成果整理",
      "description": "上传地块边界文件，满足{link}要求，直接得到可用于提交和出图的成果包。",
      "tags": [
        "boundary"
      ],
      "form": "tool",
      "billing": "paid",
      "image": "boundary.png",
      "video": "",
      "gallery": [],
      "sampleFiles": [
        {
          "name": "样例边界",
          "path": "./downloads/boundary/sample-input.zip",
          "note": "Shapefile（已脱敏）"
        }
      ],
      "available": true,
      "input": "地块边界文件",
      "result": "标准成果包",
      "requirements": [
        "坐标系识别",
        "行政区自动匹配",
        "快速输出成果"
      ],
      "sort": 10,
      "featured": true
    },
    {
      "slug": "xy",
      "toolCode": "xy",
      "route": "/tools/xy",
      "name": "坐标成果处理",
      "description": "整理点位坐标，得到位置准确、可继续叠加使用的数据文件。",
      "tags": [
        "point"
      ],
      "form": "tool",
      "billing": "free",
      "image": "xy.png",
      "video": "./media/videos/xy/demo.mp4",
      "gallery": [
        "sample-01.png",
        "sample-02.png"
      ],
      "sampleFiles": [
        {
          "name": "样例坐标",
          "path": "./downloads/xy/sample-input.csv",
          "note": "12 个点的 X/Y 示例（已平移）"
        }
      ],
      "available": true,
      "input": "点位坐标表",
      "result": "统一坐标数据（可直接用于制图与报告）",
      "requirements": [
        "批量处理点位",
        "核对坐标信息",
        "减少位置偏移"
      ],
      "sort": 20,
      "featured": true
    },
    {
      "slug": "toshp",
      "toolCode": "toshp",
      "route": "/tools/toshp",
      "name": "空间格式转换",
      "description": "在常用空间数据格式之间转换，方便项目交付与复用。",
      "tags": [
        "data"
      ],
      "form": "tool",
      "billing": "free",
      "image": "toshp.png",
      "video": "./media/videos/toshp/demo.mp4",
      "gallery": [
        "sample-01.png",
        "sample-02.png"
      ],
      "sampleFiles": [
        {
          "name": "样例图层",
          "path": "./downloads/toshp/sample-input.zip",
          "note": "WGS84 面图层（已脱敏）"
        }
      ],
      "available": false,
      "input": "待转换的空间数据文件",
      "result": "可复用的空间文件（可直接用于制图与报告）",
      "requirements": [
        "常用格式互转",
        "保留字段信息",
        "结果便于交付"
      ],
      "sort": 30,
      "featured": true
    },
    {
      "slug": "dem",
      "toolCode": "dem",
      "route": "/tools/elevation",
      "name": "地形高程成果",
      "description": "得到可用于分析、制图和报告的地形高程成果。",
      "tags": [
        "elevation"
      ],
      "form": "tool",
      "billing": "paid",
      "image": "dem.png",
      "video": "./media/videos/dem/demo.mp4",
      "gallery": [
        "sample-01.png",
        "sample-02.png"
      ],
      "sampleFiles": [
        {
          "name": "样例点位+边界",
          "path": "./downloads/dem/sample-input.zip",
          "note": "点位 xlsx 与边界 kml（已平移）"
        }
      ],
      "available": false,
      "input": "高程点或等高线数据",
      "result": "地形高程成果（可直接用于制图与报告）",
      "requirements": [
        "范围随项目调整",
        "高程关系直观",
        "支持成果导出"
      ],
      "sort": 40,
      "featured": true
    },
    {
      "slug": "groundwater",
      "toolCode": "groundwater",
      "route": "/tools/groundwater",
      "name": "地下水成果制图",
      "description": "得到地下水位分布、等值线和可用于报告的成图结果。",
      "tags": [
        "groundwater"
      ],
      "form": "tool",
      "billing": "paid",
      "image": "groundwater.png",
      "video": "./media/videos/groundwater/demo.mp4",
      "gallery": [
        "sample-01.png",
        "sample-02.png"
      ],
      "sampleFiles": [
        {
          "name": "样例监测井",
          "path": "./downloads/groundwater/sample-input.xlsx",
          "note": "含水位值的监测井表（已平移）"
        }
      ],
      "available": false,
      "input": "监测井水位数据",
      "result": "地下水专题图（可直接进报告）",
      "requirements": [
        "看清水位空间变化",
        "图例与标注完整",
        "结果可继续编辑"
      ],
      "sort": 50,
      "featured": true
    },
    {
      "slug": "spatial",
      "toolCode": "spatial_viewer",
      "route": "/tools/spatial",
      "name": "空间成果查看",
      "description": "快速看清数据位置、范围和图层关系，及时发现错位或缺失。",
      "tags": [
        "data"
      ],
      "form": "tool",
      "billing": "free",
      "image": "spatial.png",
      "video": "./media/videos/spatial/demo.mp4",
      "gallery": [
        "sample-01.png",
        "sample-02.png"
      ],
      "sampleFiles": [
        {
          "name": "样例图层",
          "path": "./downloads/spatial/sample-input.zip",
          "note": "WGS84 面图层（已脱敏）"
        }
      ],
      "available": true,
      "input": "需要查看的图层数据",
      "result": "空间成果视图（用于核对数据）",
      "requirements": [
        "多图层同时查看",
        "范围关系直观",
        "快速核对数据"
      ],
      "sort": 60,
      "featured": true
    },
    {
      "slug": "layout",
      "toolCode": "layout",
      "route": "/tools/layout",
      "name": "专题图件排版",
      "description": "得到版式统一、可直接放入报告和汇报材料的专题图件。",
      "tags": [
        "figure"
      ],
      "form": "tool",
      "billing": "free",
      "image": "layout.png",
      "video": "./media/videos/layout/demo.mp4",
      "gallery": [
        "sample-01.png",
        "sample-02.png"
      ],
      "sampleFiles": [],
      "available": false,
      "input": "图件与图层数据",
      "result": "专题成果图件（可直接进报告）",
      "requirements": [
        "版式更统一",
        "图例信息完整",
        "导出清晰成图"
      ],
      "sort": 70,
      "featured": true
    },
    {
      "slug": "planboring",
      "toolCode": "planboring",
      "route": "/tools/planboring",
      "name": "钻孔布点规划",
      "description": "得到覆盖调查范围、可直接实施的钻孔点位图和布点成果。",
      "tags": [
        "boring"
      ],
      "form": "tool",
      "billing": "paid",
      "image": "planboring.png",
      "video": "./media/videos/planboring/demo.mp4",
      "gallery": [
        "sample-01.png",
        "sample-02.png"
      ],
      "sampleFiles": [
        {
          "name": "样例调查分区",
          "path": "./downloads/planboring/sample-input.zip",
          "note": "调查分区 Shapefile（已脱敏）"
        }
      ],
      "available": true,
      "input": "调查范围与点位数据",
      "result": "钻孔点位图与布点方案（可直接进报告）",
      "requirements": [
        "点位布局更合理",
        "范围覆盖更完整",
        "方案调整更方便"
      ],
      "sort": 80,
      "featured": true
    },
    {
      "slug": "vertiplot",
      "toolCode": "vertiplot",
      "route": "/tools/vertiplot",
      "name": "垂向分布制图",
      "description": "得到剖面和垂向分布图，直观看清不同深度的变化。",
      "tags": [
        "sample"
      ],
      "form": "tool",
      "billing": "paid",
      "image": "vertiplot.png",
      "video": "./media/videos/vertiplot/demo.mp4",
      "gallery": [
        "sample-01.png",
        "sample-02.png"
      ],
      "sampleFiles": [
        {
          "name": "样例纵表",
          "path": "./downloads/vertiplot/sample-input.xlsx",
          "note": "公开示例纵表"
        }
      ],
      "available": true,
      "input": "分层采样数据",
      "result": "垂向分布专题图（可直接进报告）",
      "requirements": [
        "深度关系更清楚",
        "剖面成果更直观",
        "成果图可直接导出"
      ],
      "sort": 90,
      "featured": true
    },
    {
      "slug": "custom",
      "toolCode": "custom",
      "route": "",
      "name": "任务定制",
      "description": "把调查目标交给技术人员，获得可直接交付的空间成果与图件。",
      "tags": [
        "figure"
      ],
      "form": "service",
      "billing": "quote",
      "image": "custom.png",
      "video": "",
      "gallery": [
        "sample-01.png",
        "sample-02.png"
      ],
      "sampleFiles": [],
      "available": true,
      "input": "项目数据与目标说明",
      "result": "定制成果图件与数据文件（可直接进报告）",
      "requirements": [
        "按项目目标沟通",
        "成果范围一起确认",
        "交付图件与数据文件"
      ],
      "sort": 100,
      "featured": true
    },
    {
      "slug": "data-import",
      "toolCode": "data_import",
      "route": "/tools/data-import",
      "name": "数据接入（智能导入）",
      "description": "上传即识别：列自动识别、字段映射、规范化台账与核对报告。",
      "tags": [
        "data"
      ],
      "form": "tool",
      "billing": "free",
      "image": "data-import.png",
      "video": "./media/videos/data-import/demo.mp4",
      "gallery": [
        "sample-01.png",
        "sample-02.png"
      ],
      "sampleFiles": [
        {
          "name": "示例点位表",
          "path": "./downloads/data-import/sample-points.xlsx",
          "note": "脱敏样例（BORING 模板）"
        },
        {
          "name": "示例检测长表",
          "path": "./downloads/data-import/sample-detections.xlsx",
          "note": "脱敏样例（有机污染物长表）"
        }
      ],
      "available": true,
      "input": "Excel / CSV（点位表或检测长表）",
      "result": "规范化台账 + 核对报告",
      "requirements": [
        "自动识别列结构",
        "统一字段命名",
        "输出可直接使用的台账"
      ],
      "sort": 110,
      "featured": true
    },
    {
      "slug": "coc-cleaning",
      "toolCode": "coc_cleaning",
      "route": "/tools/coc-cleaning",
      "name": "检测数据清洗",
      "description": "污染物名称归并（别名表）、单位换算、检出限处理与清洗报告。",
      "tags": [
        "sample"
      ],
      "form": "tool",
      "billing": "free",
      "image": "coc-cleaning.png",
      "video": "./media/videos/coc-cleaning/demo.mp4",
      "gallery": [
        "sample-01.png",
        "sample-02.png"
      ],
      "sampleFiles": [
        {
          "name": "示例检测数据",
          "path": "./downloads/coc-cleaning/sample-detections.xlsx",
          "note": "脱敏样例（有机污染物长表）"
        },
        {
          "name": "示例别名规则",
          "path": "./downloads/coc-cleaning/sample-alias-rules.xlsx",
          "note": "别名归并规则示例（可替换）"
        }
      ],
      "available": true,
      "input": "检测数据长表（+ 可选别名规则表）",
      "result": "清洗结果 + 问题清单",
      "requirements": [
        "名称归并到标准名称",
        "数值与单位解析",
        "检出限（<）标记"
      ],
      "sort": 120,
      "featured": true
    },
    {
      "slug": "risk-check",
      "toolCode": "risk_check",
      "route": "/tools/risk-check",
      "name": "超标比对",
      "description": "检测数据对标准值（筛选值 / 修复目标值）逐条比对，输出超标清单。",
      "tags": [
        "data"
      ],
      "form": "tool",
      "billing": "paid",
      "image": "risk-check.png",
      "video": "./media/videos/risk-check/demo.mp4",
      "gallery": [
        "sample-01.png",
        "sample-02.png"
      ],
      "sampleFiles": [
        {
          "name": "示例检测数据",
          "path": "./downloads/risk-check/sample-detections.xlsx",
          "note": "脱敏样例（有机污染物长表）"
        },
        {
          "name": "超标演示数据",
          "path": "./downloads/risk-check/sample-over-demo.xlsx",
          "note": "演示数据：含 3 条超标"
        },
        {
          "name": "示例标准值",
          "path": "./downloads/risk-check/sample-standards.xlsx",
          "note": "标准值表（多级表头 + 规划分类）"
        }
      ],
      "available": true,
      "input": "检测数据 + 标准值表",
      "result": "比对结果 + 超标清单（含超标倍数）",
      "requirements": [
        "规划分类与深度分段选择",
        "单位自动换算",
        "超标倍数与判定"
      ],
      "sort": 130,
      "featured": true
    },
    {
      "slug": "boring-cleaning",
      "toolCode": "boring_cleaning",
      "route": "/tools/boring-cleaning",
      "name": "钻孔数据整理",
      "description": "钻孔台账清洗：孔号、深度段与分层规范化，输出可直接使用的钻孔表。",
      "tags": [
        "boring"
      ],
      "form": "tool",
      "billing": "free",
      "image": "boring-cleaning.png",
      "video": "./media/videos/boring-cleaning/demo.mp4",
      "gallery": [
        "sample-01.png",
        "sample-02.png"
      ],
      "sampleFiles": [],
      "available": true,
      "input": "钻孔台账（Excel/CSV）",
      "result": "标准钻孔台账 + 核对清单",
      "requirements": [
        "孔号 / 深度段规范化",
        "分层与岩性字段核对",
        "输出标准钻孔台账"
      ],
      "sort": 140,
      "featured": true
    },
    {
      "slug": "sample-cleaning",
      "toolCode": "sample_cleaning",
      "route": "/tools/sample-cleaning",
      "name": "样品数据整理",
      "description": "样品台账清洗：编号、深度、样品类型规范与缺失核对。",
      "tags": [
        "sample"
      ],
      "form": "tool",
      "billing": "free",
      "image": "sample-cleaning.png",
      "video": "./media/videos/sample-cleaning/demo.mp4",
      "gallery": [
        "sample-01.png",
        "sample-02.png"
      ],
      "sampleFiles": [],
      "available": true,
      "input": "样品台账（Excel/CSV）",
      "result": "标准样品台账 + 缺失核对",
      "requirements": [
        "样品编号规范",
        "深度与类型核对",
        "缺失与重复检查"
      ],
      "sort": 150,
      "featured": true
    },
    {
      "slug": "imagery-download",
      "toolCode": "imagery_download",
      "route": "/tools/imagery-download",
      "name": "影像下载",
      "description": "上传边界或绘制范围查询历史影像，按日期下载完整 GeoTIFF。",
      "tags": [
        "data"
      ],
      "form": "tool",
      "billing": "free",
      "image": "imagery-download.png",
      "video": "./media/videos/imagery-download/demo.mp4",
      "gallery": [
        "sample-01.png",
        "sample-02.png"
      ],
      "sampleFiles": [],
      "available": true,
      "input": "矢量边界 / 手绘范围",
      "result": "历史影像 GeoTIFF（按日期）",
      "requirements": [
        "范围查询与矩形包络",
        "多日期影像查询",
        "完整 GeoTIFF 下载"
      ],
      "sort": 160,
      "featured": true
    },
    {
      "slug": "history-archive",
      "toolCode": "history_archive",
      "route": "/tools/history-archive",
      "name": "历史资料整理",
      "description": "历史影像、POI 与其他要素的建库、检索与版本快照。",
      "tags": [
        "data"
      ],
      "form": "tool",
      "billing": "free",
      "image": "history-archive.png",
      "video": "./media/videos/history-archive/demo.mp4",
      "gallery": [
        "sample-01.png",
        "sample-02.png"
      ],
      "sampleFiles": [],
      "available": true,
      "input": "边界版本 + 年份范围",
      "result": "历史资料版本（影像 + POI + 要素）",
      "requirements": [
        "历史影像与 POI 建库",
        "逻辑要素与不可变修订",
        "检索与版本快照"
      ],
      "sort": 170,
      "featured": true
    },
    {
      "slug": "report-builder",
      "toolCode": "report_builder",
      "route": "/tools/report-builder",
      "name": "报告装配",
      "description": "锁定成果版本，按模板章节预检并装配 DOCX 报告。",
      "tags": [
        "figure"
      ],
      "form": "tool",
      "billing": "paid",
      "image": "report-builder.png",
      "video": "./media/videos/report-builder/demo.mp4",
      "gallery": [
        "sample-01.png",
        "sample-02.png"
      ],
      "sampleFiles": [],
      "available": true,
      "input": "已保存的成果版本",
      "result": "DOCX 报告（含图件槽）",
      "requirements": [
        "锁定成果版本",
        "模板章节预检",
        "一次性生成 DOCX"
      ],
      "sort": 180,
      "featured": true
    },
    {
      "slug": "aggregation",
      "toolCode": "aggregation",
      "route": "/tools/aggregation",
      "name": "空间聚合",
      "description": "超标记录的空间聚合与图斑汇总（聚合契约 v2）。",
      "tags": [
        "figure"
      ],
      "form": "tool",
      "billing": "paid",
      "image": "aggregation.png",
      "video": "./media/videos/aggregation/demo.mp4",
      "gallery": [
        "sample-01.png",
        "sample-02.png"
      ],
      "sampleFiles": [],
      "available": true,
      "input": "超标纵表（OVER=1）+ 范围成果",
      "result": "聚合成果（图斑 + 关系 + 版本）",
      "requirements": [
        "OVER=1 记录聚合",
        "图斑与关系汇总",
        "输出聚合成果版本"
      ],
      "sort": 190,
      "featured": true
    },
    {
      "slug": "remediation",
      "toolCode": "remediation",
      "route": "/tools/remediation",
      "name": "修复单元",
      "description": "修复单元划定：来源图斑 + 控制点 + 成员血缘。",
      "tags": [
        "figure"
      ],
      "form": "tool",
      "billing": "paid",
      "image": "remediation.png",
      "video": "./media/videos/remediation/demo.mp4",
      "gallery": [
        "sample-01.png",
        "sample-02.png"
      ],
      "sampleFiles": [],
      "available": true,
      "input": "聚合成果（契约 v2）",
      "result": "修复单元成果（图斑 + 血缘）",
      "requirements": [
        "修复单元划定",
        "控制点与成员血缘",
        "成果走版本快照"
      ],
      "sort": 200,
      "featured": true
    },
    {
      "slug": "numerical-sim",
      "toolCode": "numerical_sim",
      "route": "/tools/numerical-sim",
      "name": "数值模拟",
      "description": "场地地下水 / 溶质数值模拟（规划能力，入口已接入平台）。",
      "tags": [
        "groundwater"
      ],
      "form": "tool",
      "billing": "quote",
      "image": "numerical-sim.png",
      "video": "./media/videos/numerical-sim/demo.mp4",
      "gallery": [
        "sample-01.png",
        "sample-02.png"
      ],
      "sampleFiles": [],
      "available": true,
      "input": "场地水文地质条件 / 参数",
      "result": "模拟结果与成果展示图",
      "requirements": [
        "地下水 / 溶质模拟",
        "情景与参数模板",
        "模拟结果展示"
      ],
      "sort": 210,
      "featured": true
    }
  ],
  "config": {
    "dev_payment_enabled": true,
    "daxpay_configured": false,
    "wechat_pay_enabled": false,
    "wechat_pay_preview": false,
    "wechat_pay_methods": [
      "native",
      "jsapi"
    ],
    "smtp_configured": true,
    "wechat_login_configured": true,
    "wechat_register_enabled": true
  },
  "productByTool": {
    "membership": {
      "code": "pro_membership",
      "tool_code": "membership",
      "display_name": "VIP会员",
      "description": "VIP 专属权益：全线工具 8 折、每年 3 次高价值额度、场地复算窗口 30 天。",
      "plans": [
        {
          "code": "pro_annual",
          "display_name": "VIP 年费",
          "price_cents": 29900,
          "list_price_cents": 39900,
          "currency": "CNY",
          "duration_days": 365,
          "quota_total": 3,
          "max_file_size_mb": 200,
          "max_runtime_seconds": 600,
          "concurrency": 1,
          "export_enabled": true,
          "activation_required": false
        }
      ]
    },
    "boundary": {
      "code": "boundary_basic",
      "tool_code": "boundary",
      "display_name": "边界成果整理",
      "description": "固定数据输入、固定专题输出；一次购买对应一个场地的一份成果。",
      "plans": [
        {
          "code": "boundary_site",
          "display_name": "单次使用",
          "price_cents": 3900,
          "list_price_cents": 0,
          "currency": "CNY",
          "duration_days": null,
          "quota_total": 1,
          "max_file_size_mb": 100,
          "max_runtime_seconds": 300,
          "concurrency": 1,
          "export_enabled": true,
          "activation_required": true
        }
      ]
    },
    "planboring": {
      "code": "planboring_basic",
      "tool_code": "planboring",
      "display_name": "钻孔布点规划",
      "description": "固定数据输入、固定专题输出；一次购买对应一个场地的一份成果。",
      "plans": [
        {
          "code": "planboring_site",
          "display_name": "单次使用",
          "price_cents": 9900,
          "list_price_cents": 0,
          "currency": "CNY",
          "duration_days": null,
          "quota_total": 1,
          "max_file_size_mb": 100,
          "max_runtime_seconds": 300,
          "concurrency": 1,
          "export_enabled": true,
          "activation_required": true
        }
      ]
    },
    "vertiplot": {
      "code": "vertiplot_basic",
      "tool_code": "vertiplot",
      "display_name": "垂向分布制图",
      "description": "固定数据输入、固定专题输出；一次购买对应一个场地的一份成果。",
      "plans": [
        {
          "code": "vertiplot_site",
          "display_name": "单次使用",
          "price_cents": 6900,
          "list_price_cents": 0,
          "currency": "CNY",
          "duration_days": null,
          "quota_total": 1,
          "max_file_size_mb": 100,
          "max_runtime_seconds": 300,
          "concurrency": 1,
          "export_enabled": true,
          "activation_required": true
        }
      ]
    }
  }
};
