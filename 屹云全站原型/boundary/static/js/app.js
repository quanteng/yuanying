// 初始化地图
const map = L.map('previewMap', {
    zoomControl: false,
    attributionControl: false
}).setView([35, 110], 5);

// 底图：统一走共享底图（单一源 packages/yykj-basemap），在线影像实时获取（不落地缓存）。
function createImageryLayer() {
    const basemapApi = window.YYKJ_BASEMAPS;
    if (basemapApi && typeof basemapApi.layer === 'function') {
        return basemapApi.layer('imagery');
    }
    // 共享底图加载器不可用时不再回退本地瓦片（本地瓦片缓存已下线）：由页面提示原因。
    return null;
}

let currentTileLayer = createImageryLayer();
if (currentTileLayer) {
    let tileErrorReported = false;
    currentTileLayer.on('tileerror', () => {
        if (!tileErrorReported) {
            tileErrorReported = true;
            addLogToConsole('底图瓦片加载失败：在线影像需要外网，请检查网络后刷新（不影响边界处理与出成果）', 'warning');
        }
    });
    currentTileLayer.addTo(map);
} else {
    addLogToConsole('共享底图不可用（未加载 /shared/yykj-basemap/basemaps.js）：请检查平台服务后刷新页面', 'warning');
}

let boundaryLayer = L.layerGroup().addTo(map);
let currentBounds = null;
const boundaryPreviewStyle = {
    color: '#ff0000',
    weight: 3,
    opacity: 0.8,
    fillColor: '#ff7800',
    fillOpacity: 0.2
};

// 调查阶段：原生组合框（datalist）—— 下拉里选预设，也可以直接输入任意值；
// 没有"自定义…"选项、也没有重置按钮，下拉按钮保持可用。
function getSurveyStage() {
    const input = document.getElementById('scjd');
    return input ? input.value.trim() : '';
}

// 《边界文件要求说明》V3.0：这 6 个阶段要带 2 位方案序号 + 下划线（文档规定的阶段见 datalist）
const SCJD_STAGES_WITH_PLAN = [
    '风险管控', '修复', '管控及修复',
    '风险管控效果评估', '修复效果评估', '管控及修复效果评估'
];

function needsPlanNo(stage) {
    return SCJD_STAGES_WITH_PLAN.includes(String(stage || '').trim());
}

// 成果命名：所处阶段 +（2 位方案序号_）+ 地块编码
function buildOutputName(stage, code, faxh) {
    const stageText = String(stage || '').trim();
    const codeText = String(code || '').trim();
    if (needsPlanNo(stageText)) {
        const digits = String(faxh || '').replace(/\D/g, '').slice(-2).padStart(2, '0');
        return `${stageText}${digits}_${codeText}`;
    }
    return `${stageText}${codeText}`;
}

function sanitizeFileName(value, fallback = '未命名地块') {
    const text = String(value || '').replace(/[\\/:*?"<>|\r\n\t]+/g, '').trim();
    return text || fallback;
}

// ==================== 字段值配置文件 ====================
// 提交参数时，在"上传文件同名"的位置生成 xxx.地块参数.json；
// 下次上传时把同名配置一起选中（或用"载入参数配置"按钮选它），即可自动回填，减少手工录入。
const CONFIG_SUFFIX = '.地块参数.json';
const CONFIG_VERSION = '1';
let lastDataFileName = '';

// 配置文件键（中文名/字段代码都认）-> 页面控件
const CONFIG_FIELDS = [
    { id: 'dkmc', label: '地块名称', keys: ['地块名称', 'DKMC', 'dkmc'] },
    { id: 'dkdm', label: '地块代码', keys: ['地块代码', 'DKDM', 'dkdm'] },
    { id: 'scjd', label: '调查阶段', keys: ['调查阶段', '所处阶段', 'SCJD', 'scjd'], isStage: true },
    { id: 'scrq', label: '调查日期', keys: ['调查日期', '生产日期', 'SCRQ', 'scrq'], isDate: true },
    { id: 'scdw', label: '生产单位', keys: ['生产单位', 'SCDW', 'scdw'] },
    { id: 'faxh', label: '方案编号', keys: ['方案编号', '方案序号', 'FAXH', 'faxh'] },
    { id: 'xzqdm', label: '行政区代码', keys: ['行政区代码', 'XZQDM', 'xzqdm'], isRegion: 'xzqdm' },
    { id: 'xzqmc', label: '行政区名称', keys: ['行政区名称', 'XZQMC', 'xzqmc'], isRegion: 'xzqmc' },
    { id: 'ydmj', label: '用地面积', keys: ['用地面积', '地块面积', 'YDMJ', 'ydmj'], isArea: true },
    { id: 'bz', label: '备注信息', keys: ['备注信息', '备注', 'BZ', 'bz'] },
];
const CONFIG_MERIDIAN_KEYS = ['中央经线', 'ZYJX', 'CENTRAL_MERIDIAN', 'central_meridian'];

function collectParameterConfig() {
    const fields = {};
    CONFIG_FIELDS.forEach(item => {
        const element = document.getElementById(item.id);
        if (!element) {
            return;
        }
        fields[item.label] = item.isStage ? getSurveyStage() : element.value.trim();
    });
    return {
        配置版本: CONFIG_VERSION,
        生成时间: new Date().toLocaleString('zh-CN'),
        来源文件: lastDataFileName || '',
        成果名: sanitizeFileName(`${getSurveyStage()}${document.getElementById('dkdm').value.trim()}`),
        字段: fields,
        中央经线: document.getElementById('central_meridian').value,
    };
}

function readConfigValues(raw) {
    if (!raw || typeof raw !== 'object') {
        return {};
    }
    const bag = (raw.字段 && typeof raw.字段 === 'object') ? raw.字段 : raw;
    const values = {};
    Object.keys(bag).forEach(key => {
        values[String(key).trim()] = bag[key];
    });
    if (raw.中央经线 !== undefined) {
        values['中央经线'] = raw.中央经线;
    }
    return values;
}

function applyParameterConfig(text, sourceName) {
    let raw;
    try {
        raw = JSON.parse(String(text).replace(/^\uFEFF/, ''));
    } catch (error) {
        addLogToConsole(`参数配置解析失败（${sourceName}）：${error.message}`, 'error');
        return false;
    }

    const values = readConfigValues(raw);
    const applied = [];
    CONFIG_FIELDS.forEach(item => {
        const element = document.getElementById(item.id);
        const hit = item.keys.find(key => values[key] !== undefined && values[key] !== null);
        if (!element || hit === undefined) {
            return;
        }
        const value = String(values[hit]).trim();
        if (!value) {
            return;
        }
        element.value = value;
        element.classList.remove('is-invalid');
        if (item.isStage) {
            updateMapTitle();
        }
        if (item.isArea && Number.isFinite(Number(value))) {
            isYdmjManuallyEdited = true;
            defaultBoundaryArea = Number(value);
        }
        if (item.isRegion) {
            isRegionManuallyEdited[item.isRegion] = true;
            defaultRegionValues[item.isRegion] = value;
        }
        applied.push(item.label);
    });

    const meridianHit = CONFIG_MERIDIAN_KEYS.find(key => values[key] !== undefined && values[key] !== null);
    if (meridianHit !== undefined) {
        const select = document.getElementById('central_meridian');
        const value = String(values[meridianHit]).trim();
        if (value) {
            const option = Array.from(select.options).find(item => item.value === value);
            if (option) {
                select.value = value;
            } else {
                const temp = document.createElement('option');
                temp.value = value;
                temp.text = `${value}° (配置)`;
                select.appendChild(temp);
                select.value = value;
            }
            applied.push('中央经线');
        }
    }

    const display = document.getElementById('configDisplay');
    if (display) {
        display.textContent = sourceName || '已载入';
        display.classList.add('loaded');
        display.title = sourceName || '';
    }
    updateMapTitle();
    addLogToConsole(`已从参数配置回填 ${applied.length} 个字段：${applied.join('、') || '（无可用字段）'}`, 'info');
    return applied.length > 0;
}

function handleConfigFile(input) {
    const file = input.files && input.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        applyParameterConfig(reader.result, file.name);
    };
    reader.onerror = () => {
        addLogToConsole(`参数配置读取失败：${file.name}`, 'error');
    };
    reader.readAsText(file, 'utf-8');
}

// 提交成功后：生成与上传文件同名的参数配置文件（浏览器默认下载目录）
// ==================== 样例数据（一键导入） ====================
// 未开通权益时处理"自己的数据"：弹支付引导窗口（示例数据始终可以免费体验）
function showUpgradeModal(reason, purchaseUrl) {
    document.getElementById('upgradeModal')?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'upgradeModal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:2000;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.45);padding:20px;';
    overlay.innerHTML = `
        <div role="dialog" aria-modal="true" aria-labelledby="upgradeTitle"
             style="width:min(460px,100%);background:#fff;border-radius:14px;padding:20px 22px;box-shadow:0 24px 48px -24px rgba(15,23,42,.45);">
            <h2 id="upgradeTitle" style="margin:0 0 8px;font-size:18px;font-weight:700;color:#17293a;">需要开通权益才能处理你的数据</h2>
            <p style="margin:0 0 6px;color:#5b6b7d;font-size:13px;line-height:20px;">${reason}</p>
            <p style="margin:0 0 16px;color:#5b6b7d;font-size:13px;line-height:20px;">
                示例数据可以免费体验（左下角「样例数据」一键载入）；上传自己的数据需要先开通「边界成果整理」权益。
            </p>
            <div style="display:flex;gap:10px;justify-content:flex-end;">
                <button type="button" class="btn btn-outline-secondary" data-upgrade-close>知道了</button>
                <button type="button" class="btn btn-primary" data-upgrade-open>去开通</button>
            </div>
        </div>`;
    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('[data-upgrade-close]').addEventListener('click', close);
    overlay.querySelector('[data-upgrade-open]').addEventListener('click', () => {
        window.open(purchaseUrl, '_blank', 'noopener');
        close();
    });
    overlay.addEventListener('click', (event) => { if (event.target === overlay) close(); });
    document.addEventListener('keydown', function onKey(event) {
        if (event.key !== 'Escape') return;
        close();
        document.removeEventListener('keydown', onKey);
    });
}

// 点击"样例数据"：拉取样例坐标表 + 载入这份样例的地块信息，用户可直接预览/处理
const SAMPLE_FILE_NAME = '样例数据.xls';
// 示例模式：载入内置样例后为 true（出成果时后端仍会核对是不是真样例）；
// 用户一旦自己选文件就会退出示例模式，走正常的权益校验。
let sampleMode = false;
let pendingSampleLoad = false;
const SAMPLE_CONFIG = {
    配置版本: '1',
    来源文件: SAMPLE_FILE_NAME,
    字段: {
        地块名称: '样例地块（示例数据）',
        // 地块代码按实际口径用 13 位纯数字
        地块代码: '1101183830033',
        调查阶段: '初步调查',
        调查日期: '2026-10-13',
        生产单位: '示例环保科技有限公司',
        方案编号: '',
        行政区代码: '',
        行政区名称: '',
        用地面积: '',
        备注信息: '样例数据，供功能演示'
    }
};

async function loadSampleData() {
    const input = document.getElementById('boundary_files');
    try {
        addLogToConsole(`正在载入样例数据（${SAMPLE_FILE_NAME}）…`);
        const response = await fetch(`/samples/${encodeURIComponent(SAMPLE_FILE_NAME)}`);
        if (!response.ok) {
            throw new Error(`样例文件获取失败（${response.status}）`);
        }
        const blob = await response.blob();
        const file = new File([blob], SAMPLE_FILE_NAME, { type: blob.type || 'application/vnd.ms-excel' });
        const transfer = new DataTransfer();
        transfer.items.add(file);
        input.files = transfer.files;
        pendingSampleLoad = true;
        input.dispatchEvent(new Event('change'));   // 走正常的"上传 → 识别中央经线 → 预览"流程
        applyParameterConfig(JSON.stringify(SAMPLE_CONFIG), SAMPLE_FILE_NAME);
        addLogToConsole(`示例数据已载入：可以直接预览与出成果（示例数据免费体验，不消耗权益）`, 'highlight');
    } catch (error) {
        addLogToConsole(`样例数据载入失败：${error.message}`, 'error');
    }
}

function downloadParameterConfig() {
    const base = (lastDataFileName || '地块').replace(/\.[^.]+$/, '');
    const fileName = `${base}${CONFIG_SUFFIX}`;
    const content = JSON.stringify(collectParameterConfig(), null, 2);
    downloadDataUrl(fileName, `data:application/json;charset=utf-8,${encodeURIComponent(content)}`);
    addLogToConsole(`参数配置文件已生成：${fileName}（下次上传同名文件时自动回填）`, 'info');
    return fileName;
}

function readJsonResponse(response, fallbackMessage = '请求失败') {
    return response.text().then(text => {
        const trimmedText = text.trim();
        let data = {};

        if (trimmedText) {
            try {
                data = JSON.parse(trimmedText);
            } catch (error) {
                const previewText = trimmedText.replace(/\s+/g, ' ').slice(0, 160);
                throw new Error(previewText || fallbackMessage);
            }
        }

        if (!response.ok) {
            throw new Error(data.error || fallbackMessage);
        }

        return data;
    });
}

function getSelectedCentralMeridian() {
    const select = document.getElementById('central_meridian');
    return select ? select.value : null;
}

let surveyDatePicker = null;

function toHalfWidthDateText(text) {
    const fullWidthChars = '０１２３４５６７８９／－．　';
    const halfWidthChars = '0123456789/-. ';

    return String(text || '').replace(/[０-９／－．　]/g, char => {
        const index = fullWidthChars.indexOf(char);
        return index >= 0 ? halfWidthChars[index] : char;
    });
}

function buildValidDate(year, month, day) {
    const date = new Date(year, month - 1, day);
    if (
        date.getFullYear() !== year
        || date.getMonth() !== month - 1
        || date.getDate() !== day
    ) {
        return null;
    }
    return date;
}

function formatSurveyDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function parseFlexibleSurveyDate(rawValue) {
    const trimmedValue = toHalfWidthDateText(rawValue).trim();
    if (!trimmedValue) {
        return null;
    }

    const normalizedValue = trimmedValue
        .replace(/[年./]/g, '-')
        .replace(/月/g, '-')
        .replace(/日/g, '')
        .replace(/[Tt].*$/, '')
        .replace(/\s+/g, ' ')
        .trim();

    let match = normalizedValue.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (match) {
        return buildValidDate(Number(match[1]), Number(match[2]), Number(match[3]));
    }

    match = normalizedValue.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
    if (match) {
        return buildValidDate(Number(match[1]), Number(match[2]), Number(match[3]));
    }

    return null;
}

function setSurveyDateValue(dateOrText, triggerChange = false) {
    const scrqInput = document.getElementById('scrq');
    if (!scrqInput) {
        return '';
    }

    let normalizedValue = '';
    if (dateOrText instanceof Date) {
        normalizedValue = formatSurveyDate(dateOrText);
    } else if (typeof dateOrText === 'string') {
        normalizedValue = dateOrText;
    }

    if (surveyDatePicker) {
        surveyDatePicker.setDate(normalizedValue || null, triggerChange, 'Y-m-d');
    } else {
        scrqInput.value = normalizedValue;
    }

    if (!normalizedValue) {
        scrqInput.value = '';
    }

    scrqInput.classList.remove('is-invalid');
    return normalizedValue;
}

function normalizeSurveyDateInput() {
    const scrqInput = document.getElementById('scrq');
    if (!scrqInput) {
        return '';
    }

    const rawValue = scrqInput.value.trim();
    if (!rawValue) {
        return '';
    }

    const parsedDate = parseFlexibleSurveyDate(rawValue);
    if (!parsedDate) {
        return '';
    }

    const normalizedValue = formatSurveyDate(parsedDate);
    setSurveyDateValue(normalizedValue);
    return normalizedValue;
}

function initSurveyDateInput() {
    const scrqInput = document.getElementById('scrq');
    if (!scrqInput) {
        return;
    }

    if (typeof flatpickr === 'function') {
        const zhLocale = flatpickr.l10ns && flatpickr.l10ns.zh ? flatpickr.l10ns.zh : 'zh';
        surveyDatePicker = flatpickr(scrqInput, {
            locale: zhLocale,
            dateFormat: 'Y-m-d',
            allowInput: true,
            disableMobile: true,
            clickOpens: true,
            defaultDate: new Date(),
            onChange: () => {
                scrqInput.classList.remove('is-invalid');
            },
            onClose: () => {
                if (scrqInput.value.trim()) {
                    normalizeSurveyDateInput();
                }
            }
        });
    }

    if (!scrqInput.value.trim()) {
        setSurveyDateValue(new Date());
    }

    scrqInput.addEventListener('paste', event => {
        const clipboardText = (event.clipboardData || window.clipboardData)?.getData('text') || '';
        const parsedDate = parseFlexibleSurveyDate(clipboardText);
        if (!parsedDate) {
            return;
        }

        event.preventDefault();
        setSurveyDateValue(parsedDate, true);
    });

    scrqInput.addEventListener('blur', () => {
        if (!scrqInput.value.trim()) {
            return;
        }
        normalizeSurveyDateInput();
    });

    scrqInput.addEventListener('keydown', event => {
        if (event.key !== 'Enter') {
            return;
        }

        const normalizedValue = normalizeSurveyDateInput();
        if (normalizedValue) {
            event.preventDefault();
        }
    });

    scrqInput.addEventListener('input', () => {
        scrqInput.classList.remove('is-invalid');
    });
}

function waitForMapTiles(timeoutMs = 1500) {
    return new Promise(resolve => {
        if (!currentTileLayer || typeof currentTileLayer.isLoading !== 'function' || !currentTileLayer.isLoading()) {
            resolve();
            return;
        }

        let settled = false;
        const finish = () => {
            if (settled) return;
            settled = true;
            currentTileLayer.off('load', finish);
            resolve();
        };

        currentTileLayer.once('load', finish);
        setTimeout(finish, timeoutMs);
    });
}

function waitForNextPaint() {
    return new Promise(resolve => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
}

function loadImageFromSource(src, crossOrigin = null) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        if (crossOrigin) {
            image.crossOrigin = crossOrigin;
        }
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('图层资源加载失败'));
        image.src = src;
    });
}

function isVisibleWithinCapture(rect, captureRect) {
    return rect.width > 0
        && rect.height > 0
        && rect.right > captureRect.left
        && rect.left < captureRect.right
        && rect.bottom > captureRect.top
        && rect.top < captureRect.bottom;
}

function getCanvasDrawRect(rect, captureRect, scale) {
    return {
        x: (rect.left - captureRect.left) * scale,
        y: (rect.top - captureRect.top) * scale,
        width: rect.width * scale,
        height: rect.height * scale
    };
}

async function drawTileImages(ctx, captureElement, captureRect, scale) {
    const tileImages = Array.from(captureElement.querySelectorAll('.leaflet-tile-pane img.leaflet-tile'));

    for (const tileImage of tileImages) {
        if (!tileImage.complete || !tileImage.naturalWidth) {
            continue;
        }

        const rect = tileImage.getBoundingClientRect();
        if (!isVisibleWithinCapture(rect, captureRect)) {
            continue;
        }

        const target = getCanvasDrawRect(rect, captureRect, scale);
        ctx.drawImage(tileImage, target.x, target.y, target.width, target.height);
    }
}

async function drawCanvasLayers(ctx, captureElement, captureRect, scale) {
    const canvases = Array.from(captureElement.querySelectorAll('.leaflet-pane canvas'));

    for (const sourceCanvas of canvases) {
        const rect = sourceCanvas.getBoundingClientRect();
        if (!isVisibleWithinCapture(rect, captureRect)) {
            continue;
        }

        const target = getCanvasDrawRect(rect, captureRect, scale);
        ctx.drawImage(sourceCanvas, target.x, target.y, target.width, target.height);
    }
}

function projectCoordinateToCapturePoint(coordinate, mapRect, captureRect, scale) {
    const [lon, lat] = coordinate;
    const point = map.latLngToContainerPoint([lat, lon]);
    return {
        x: (mapRect.left - captureRect.left + point.x) * scale,
        y: (mapRect.top - captureRect.top + point.y) * scale
    };
}

function traceLinearRing(ctx, ring, mapRect, captureRect, scale) {
    if (!Array.isArray(ring) || ring.length === 0) {
        return;
    }

    ring.forEach((coordinate, index) => {
        const point = projectCoordinateToCapturePoint(coordinate, mapRect, captureRect, scale);
        if (index === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }
    });

    ctx.closePath();
}

function drawPolygonFill(ctx, polygonCoordinates, mapRect, captureRect, scale) {
    ctx.beginPath();
    polygonCoordinates.forEach(ring => {
        traceLinearRing(ctx, ring, mapRect, captureRect, scale);
    });
    ctx.fill('evenodd');
}

function drawPolygonStroke(ctx, polygonCoordinates, mapRect, captureRect, scale) {
    ctx.beginPath();
    polygonCoordinates.forEach(ring => {
        traceLinearRing(ctx, ring, mapRect, captureRect, scale);
    });
    ctx.stroke();
}

function drawGeoJsonOverlay(ctx, captureRect, scale) {
    const geojsonData = window.lastPreviewGeoJSON;
    if (!geojsonData || !Array.isArray(geojsonData.features) || geojsonData.features.length === 0) {
        return;
    }

    const mapRect = map.getContainer().getBoundingClientRect();

    ctx.save();
    ctx.fillStyle = boundaryPreviewStyle.fillColor;
    ctx.globalAlpha = boundaryPreviewStyle.fillOpacity;

    geojsonData.features.forEach(feature => {
        const geometry = feature && feature.geometry;
        if (!geometry || !geometry.coordinates) {
            return;
        }

        if (geometry.type === 'Polygon') {
            drawPolygonFill(ctx, geometry.coordinates, mapRect, captureRect, scale);
        } else if (geometry.type === 'MultiPolygon') {
            geometry.coordinates.forEach(polygonCoordinates => {
                drawPolygonFill(ctx, polygonCoordinates, mapRect, captureRect, scale);
            });
        }
    });

    ctx.restore();

    ctx.save();
    ctx.strokeStyle = boundaryPreviewStyle.color;
    ctx.lineWidth = boundaryPreviewStyle.weight * scale;
    ctx.globalAlpha = boundaryPreviewStyle.opacity;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    geojsonData.features.forEach(feature => {
        const geometry = feature && feature.geometry;
        if (!geometry || !geometry.coordinates) {
            return;
        }

        if (geometry.type === 'Polygon') {
            drawPolygonStroke(ctx, geometry.coordinates, mapRect, captureRect, scale);
        } else if (geometry.type === 'MultiPolygon') {
            geometry.coordinates.forEach(polygonCoordinates => {
                drawPolygonStroke(ctx, polygonCoordinates, mapRect, captureRect, scale);
            });
        }
    });

    ctx.restore();
}

function drawMapTitleLayer(ctx, captureRect, scale) {
    const titleElement = document.getElementById('mapTitle');
    const titleText = titleElement ? titleElement.textContent.trim() : '';
    if (!titleText) {
        return;
    }

    const rect = titleElement.getBoundingClientRect();
    if (!isVisibleWithinCapture(rect, captureRect)) {
        return;
    }

    const computedStyle = window.getComputedStyle(titleElement);
    const fontSize = parseFloat(computedStyle.fontSize || '18');
    const fontWeight = computedStyle.fontWeight || 'bold';
    const fontFamily = computedStyle.fontFamily || 'sans-serif';

    ctx.save();
    ctx.fillStyle = computedStyle.color || '#ff0000';
    ctx.textBaseline = 'top';
    ctx.font = `${fontWeight} ${fontSize * scale}px ${fontFamily}`;
    ctx.fillText(
        titleText,
        (rect.left - captureRect.left) * scale,
        (rect.top - captureRect.top) * scale
    );
    ctx.restore();
}

async function captureCurrentMapViewWithHtml2Canvas(captureElement, scale) {
    const canvas = await html2canvas(captureElement, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        scale
    });

    return canvas.toDataURL('image/jpeg', 0.92);
}

async function captureCurrentMapView() {
    const captureElement = document.getElementById('mapCaptureArea');
    if (!captureElement) {
        throw new Error('未找到截图区域');
    }

    await waitForMapTiles();
    await waitForNextPaint();
    await new Promise(resolve => setTimeout(resolve, 60));

    const scale = Math.max(2, window.devicePixelRatio || 1);
    const captureRect = captureElement.getBoundingClientRect();
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = Math.round(captureRect.width * scale);
    exportCanvas.height = Math.round(captureRect.height * scale);

    const ctx = exportCanvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    try {
        await drawTileImages(ctx, captureElement, captureRect, scale);
        await drawCanvasLayers(ctx, captureElement, captureRect, scale);
        drawGeoJsonOverlay(ctx, captureRect, scale);
        drawMapTitleLayer(ctx, captureRect, scale);
        return exportCanvas.toDataURL('image/jpeg', 0.92);
    } catch (error) {
        console.warn('Custom map capture failed, falling back to html2canvas.', error);
        return captureCurrentMapViewWithHtml2Canvas(captureElement, scale);
    }
}

function downloadDataUrl(fileName, dataUrl) {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 更新文件显示函数
function updateFileDisplay(input, type) {
    const allFiles = Array.from(input.files || []);
    // 样例数据体验：只有"样例数据"按钮触发的这次选择算示例（用户自己选文件即退出示例模式）
    if (type === 'boundary') {
        sampleMode = pendingSampleLoad;
        pendingSampleLoad = false;
    }
    // 支持"数据文件 + 同名参数配置"一起选中：.json 当配置，其它当数据
    const configFiles = allFiles.filter(file => file.name.toLowerCase().endsWith('.json'));
    const files = allFiles.filter(file => !file.name.toLowerCase().endsWith('.json'));
    const displayDiv = document.getElementById(`${type}Display`);
    const tableExts = ['.xlsx', '.xls', '.csv', '.txt'];
    const vectorExts = ['.dxf', '.kml', '.kmz'];

    if (configFiles.length > 0) {
        const configFile = configFiles[0];
        const reader = new FileReader();
        reader.onload = () => applyParameterConfig(reader.result, configFile.name);
        reader.onerror = () => addLogToConsole(`参数配置读取失败：${configFile.name}`, 'error');
        reader.readAsText(configFile, 'utf-8');
        if (configFiles.length > 1) {
            addLogToConsole(`本次选中了 ${configFiles.length} 个 .json，只用第一个：${configFile.name}`, 'warning');
        }
    }

    if (files.length > 0) {
        let mainFile = null;
        let isValid = false;
        let displayText = '';

        // 坐标表格：xlsx / xls / csv / txt
        if (tableExts.some(ext => files[0].name.toLowerCase().endsWith(ext))) {
            mainFile = files[0];
            isValid = true;
            displayText = `
                <i class="bi bi-file-earmark-spreadsheet compact-icon"></i>
                <span>${mainFile.name.substring(0, 12)}${mainFile.name.length > 12 ? '...' : ''}</span>
            `;
        }
        // 单文件矢量：dxf / kml / kmz
        else if (vectorExts.some(ext => files[0].name.toLowerCase().endsWith(ext))) {
            mainFile = files[0];
            isValid = true;
            displayText = `
                <i class="bi bi-file-earmark-ruled compact-icon"></i>
                <span>${mainFile.name.substring(0, 12)}${mainFile.name.length > 12 ? '...' : ''}</span>
            `;
        }
        // Shapefile 文件组
        else {
            const requiredExts = ['.shp', '.shx', '.dbf'];
            const uploadedExts = Array.from(files).map(f =>
                f.name.substring(f.name.lastIndexOf('.')).toLowerCase());

            const hasAllRequired = requiredExts.every(ext =>
                uploadedExts.includes(ext));

            if (hasAllRequired) {
                mainFile = Array.from(files).find(f =>
                    f.name.toLowerCase().endsWith('.shp'));
                isValid = true;
                displayText = `
                    <i class="bi bi-file-earmark-zip compact-icon"></i>
                    <span>${mainFile.name.substring(0, 12)}${mainFile.name.length > 12 ? '...' : ''} (+${files.length-1}个配套文件)</span>
                `;
            }
        }

        if (isValid) {
            resetYdmjState(true);
            lastDataFileName = mainFile.name;
            addLogToConsole(`${mainFile.name} 文件上传成功，正在解析边界...`);
            displayDiv.innerHTML = displayText;
            detectAndPreviewBoundary(files);
        } else {
            addLogToConsole('错误：请上传 Shapefile(.shp,.shx,.dbf) / dxf / kml / kmz，或坐标表格(xlsx/xls/csv/txt)', 'error');
            input.value = '';
            displayDiv.innerHTML = `
                <i class="bi bi-file-earmark-zip compact-icon"></i>
                <span>上传 Shapefile / dxf / kml / kmz / xlsx / xls / csv / txt</span>
            `;
        }
    }
}

// 检测中央经线并预览边界
function detectAndPreviewBoundary(files) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
    }

    fetch('/api/detect_meridian', {
        method: 'POST',
        body: formData
    })
    .then(response => readJsonResponse(response, '中央经线检测失败'))
    .then(data => {
        const central_meridianSelect = document.getElementById('central_meridian');

        if (data.success) {
            if (data.meridian !== null) {
                // 计算最接近的标准中央经线
                const meridianValue = Math.round(data.meridian / 3) * 3;

                // 查找匹配的选项
                const exactOption = Array.from(central_meridianSelect.options).find(
                    opt => opt.value !== '手动指定' && parseInt(opt.value) === meridianValue
                );

                if (exactOption) {
                    // 如果找到完全匹配的选项，直接选中
                    central_meridianSelect.value = exactOption.value;
                    addLogToConsole(`自动检测到中央经线: ${data.meridian}°，已自动选择 ${meridianValue}°`);
                } else {
                    // 如果没有完全匹配的选项，添加临时选项并选中
                    const tempOption = document.createElement('option');
                    tempOption.value = meridianValue;
                    tempOption.text = `${meridianValue}° (检测值)`;
                    central_meridianSelect.appendChild(tempOption);
                    central_meridianSelect.value = meridianValue;
                    addLogToConsole(`检测到中央经线: ${data.meridian}°，已临时添加 ${meridianValue}° 选项`);
                }

                // 自动预览边界
                previewBoundary(files);
            } else {
                // 如果无法检测中央经线，重置为"手动指定"
                central_meridianSelect.value = '手动指定';
                addLogToConsole('无法自动检测中央经线，请手动指定');
            }
        } else {
            addLogToConsole('中央经线检测失败: ' + (data.error || '未知错误'), 'error');
        }
    })
    .catch(error => {
        addLogToConsole('中央经线检测请求失败: ' + error.message, 'error');
    });
}

let lastPreviewGeoJSON = null; // 全局变量
let lastInteriorPoint = null;
let defaultBoundaryArea = null;
let isYdmjManuallyEdited = false;
// 预览后正在识别行政区/面积：期间禁用「提交参数」，避免用户抢先提交被必填校验拦住（卡端感）
let boundaryRecognitionPending = false;
// 行政区（代码/名称）：默认按图斑中心点识别回填，允许人工修正（不同系统位数要求不同）
const REGION_FIELDS = ['xzqdm', 'xzqmc'];
let defaultRegionValues = { xzqdm: '', xzqmc: '' };
let isRegionManuallyEdited = { xzqdm: false, xzqmc: false };

function getRegionInput(fieldId) {
    return document.getElementById(fieldId);
}

function getRegionValue(fieldId) {
    const input = getRegionInput(fieldId);
    return input ? input.value.trim() : '';
}

function setRegionValue(fieldId, value, isManual = false) {
    const input = getRegionInput(fieldId);
    if (!input) {
        return;
    }
    input.value = String(value == null ? '' : value).trim();
    input.classList.remove('is-invalid');
    isRegionManuallyEdited[fieldId] = isManual;
}

function syncRegionFields(values = {}) {
    REGION_FIELDS.forEach(fieldId => {
        const detected = String(values[fieldId] == null ? '' : values[fieldId]).trim();
        if (detected) {
            defaultRegionValues[fieldId] = detected;
        }
        const input = getRegionInput(fieldId);
        if (!input) {
            return;
        }
        // 人工改过就不覆盖（与用地面积同口径）；人工清空后仍回填系统识别值
        if (!isRegionManuallyEdited[fieldId] || !input.value.trim()) {
            setRegionValue(fieldId, detected, false);
        }
    });
}

function resetRegionState(clearValue = false) {
    defaultRegionValues = { xzqdm: '', xzqmc: '' };
    isRegionManuallyEdited = { xzqdm: false, xzqmc: false };
    if (!clearValue) {
        return;
    }
    REGION_FIELDS.forEach(fieldId => {
        const input = getRegionInput(fieldId);
        if (input) {
            input.value = '';
            input.classList.remove('is-invalid');
        }
    });
}

function restoreRegionField(fieldId) {
    const detected = defaultRegionValues[fieldId] || '';
    if (detected) {
        setRegionValue(fieldId, detected, false);
        addLogToConsole(`行政区已恢复为系统识别值：${detected}`, 'info');
        return Promise.resolve();
    }
    if (!window.lastPreviewGeoJSON) {
        addLogToConsole('请先上传并预览边界数据，再恢复行政区信息', 'warning');
        return Promise.resolve();
    }
    return fetchBoundaryInteriorPoint(window.lastPreviewGeoJSON)
        .then(point => {
            syncRegionFields(point);
            addLogToConsole(`行政区已恢复为系统识别值：${getRegionValue(fieldId) || '（未识别到）'}`, 'info');
        })
        .catch(error => {
            addLogToConsole(`恢复行政区信息失败: ${error.message}`, 'warning');
        });
}

function getYdmjInput() {
    return document.getElementById('ydmj');
}

function formatYdmjValue(value) {
    return Number(value).toFixed(2);
}

function getCurrentYdmjValue() {
    const ydmjInput = getYdmjInput();
    if (!ydmjInput) {
        return null;
    }

    const rawValue = ydmjInput.value.trim();
    if (!rawValue) {
        return null;
    }

    const numericValue = Number(rawValue);
    return Number.isFinite(numericValue) ? numericValue : null;
}

function setYdmjInputValue(value, isManual = false) {
    const ydmjInput = getYdmjInput();
    if (!ydmjInput || !Number.isFinite(Number(value))) {
        return;
    }

    ydmjInput.value = formatYdmjValue(value);
    ydmjInput.classList.remove('is-invalid');
    isYdmjManuallyEdited = isManual;
}

function syncYdmjWithGeometryArea(area, force = false) {
    if (!Number.isFinite(Number(area))) {
        return;
    }

    defaultBoundaryArea = Number(area);

    const ydmjInput = getYdmjInput();
    if (!ydmjInput) {
        return;
    }

    if (force || !isYdmjManuallyEdited || !ydmjInput.value.trim()) {
        setYdmjInputValue(defaultBoundaryArea, false);
    }
}

function resetYdmjState(clearValue = false) {
    defaultBoundaryArea = null;
    isYdmjManuallyEdited = false;

    const ydmjInput = getYdmjInput();
    if (ydmjInput && clearValue) {
        ydmjInput.value = '';
        ydmjInput.classList.remove('is-invalid');
    }
}

function restoreGeometryArea() {
    if (Number.isFinite(defaultBoundaryArea)) {
        setYdmjInputValue(defaultBoundaryArea, false);
        return Promise.resolve();
    }

    if (!window.lastPreviewGeoJSON) {
        addLogToConsole('请先上传并预览边界数据，再恢复几何面积', 'warning');
        return Promise.resolve();
    }

    return fetchBoundaryInteriorPoint(window.lastPreviewGeoJSON)
        .then(point => {
            syncYdmjWithGeometryArea(point.ydmj, true);
        })
        .catch(error => {
            addLogToConsole(`恢复几何面积失败: ${error.message}`, 'warning');
        });
}

function fetchBoundaryInteriorPoint(geojsonData) {
    return fetch('/api/get_centroid', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            geojson: geojsonData,
            central_meridian: getSelectedCentralMeridian()
        })
    })
    .then(response => readJsonResponse(response, '提取图斑内部重心失败'))
    .then(data => {
        if (!data.success) {
            throw new Error(data.error || '无法提取图斑内部点');
        }

        lastInteriorPoint = {
            lon: Number(data.lon),
            lat: Number(data.lat),
            ydmj: Number(data.ydmj),
            xzqdm: data.xzqdm || '',
            xzqmc: data.xzqmc || ''
        };

        return lastInteriorPoint;
    });
}

function setRecognitionPending(pending) {
    boundaryRecognitionPending = Boolean(pending);
    const btn = document.getElementById('processBtn');
    if (!btn || btn.dataset.processing === '1') {
        return;
    }
    if (boundaryRecognitionPending) {
        if (!btn.dataset.recognitionText) {
            btn.dataset.recognitionText = btn.innerHTML;
        }
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>正在识别行政区与面积…';
        return;
    }
    btn.disabled = false;
    if (btn.dataset.recognitionText) {
        btn.innerHTML = btn.dataset.recognitionText;
        delete btn.dataset.recognitionText;
    }
}

function cacheBoundaryInteriorPoint(geojsonData) {
    setRecognitionPending(true);
    fetchBoundaryInteriorPoint(geojsonData)
        .then(point => {
            syncYdmjWithGeometryArea(point.ydmj);
            syncRegionFields(point);
            setRecognitionPending(false);
        })
        .catch(() => {
            lastInteriorPoint = null;
            defaultBoundaryArea = null;
            setRecognitionPending(false);
            addLogToConsole('行政区/面积自动识别未完成：可手工填写后提交', 'warning');
        });
}

function addInteriorPointLog() {
    const pointPromise = lastInteriorPoint
        ? Promise.resolve(lastInteriorPoint)
        : (window.lastPreviewGeoJSON
            ? fetchBoundaryInteriorPoint(window.lastPreviewGeoJSON)
            : Promise.reject(new Error('缺少预览图斑数据')));

    return pointPromise
        .then(point => {
            const currentYdmj = getCurrentYdmjValue();
            const displayArea = Number.isFinite(currentYdmj) ? currentYdmj : point.ydmj;
            const areaText = Number.isFinite(displayArea)
                ? ` ｜ 面积： ${displayArea.toFixed(2)} 平方米`
                : '';
            const regionDm = getRegionValue('xzqdm') || point.xzqdm || '';
            const regionMc = getRegionValue('xzqmc') || point.xzqmc || '';
            const regionText = (regionDm || regionMc)
                ? ` ｜ 行政区： ${regionDm} ${regionMc}`.trimEnd()
                : '';

            addLogToConsole(
                `坐标： ${point.lon.toFixed(6)}, ${point.lat.toFixed(6)}${areaText}${regionText}`,
                'result'
            );
        })
        .catch(error => {
            addLogToConsole(`图斑内部重心提取失败: ${error.message}`, 'warning');
        });
}

// 四至特征登记：把地块外接矩形（EPSG:4326）上报到账户中心，
// 只登记四至用于判断是否为同一场地（服务端不保存原始数据）。
function reportSiteBounds(bounds, label) {
    if (!bounds || typeof window.yykjReportSite !== 'function') return;
    window.yykjReportSite(bounds, {
        crs: 'EPSG:4326',
        label: label || '',
        onResult: function (result) {
            if (!result || !result.site) return;
            if (result.matched) {
                addLogToConsole(`已识别为同一场地（第 ${result.site.hit_count} 次使用）`, 'highlight');
            } else {
                addLogToConsole('已登记新场地（四至范围）', 'highlight');
            }
        }
    });
}

// 预览边界
function previewBoundary(files) {
    addLogToConsole('正在加载边界数据...');

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
    }

    // 获取当前选择的中央经线
    const central_meridianSelect = document.getElementById('central_meridian');
    if (central_meridianSelect.value === '手动指定') {
        addLogToConsole('请手动选择中央经线', 'warning');
        return;
    }

    formData.append('central_meridian', central_meridianSelect.value);

    fetch('/api/preview_boundary', {
        method: 'POST',
        body: formData
    })
    .then(response => readJsonResponse(response, '边界预览失败'))
    .then(data => {
        if (data.success) {
            boundaryLayer.clearLayers();
            const geojsonData = typeof data.preview_geojson === 'string' ?
                JSON.parse(data.preview_geojson) : data.preview_geojson;
            window.lastPreviewGeoJSON = geojsonData;
            const geojsonLayer = L.geoJSON(geojsonData, {
                style: boundaryPreviewStyle
            }).addTo(boundaryLayer);

            currentBounds = L.latLngBounds([
                [data.bounds[1], data.bounds[0]],
                [data.bounds[3], data.bounds[2]]
            ]);

            map.fitBounds(currentBounds, {
                maxZoom: 18,
                padding: [10, 5, 5, 5]
            });

            updateMapTitle();
            addLogToConsole('边界加载完成，已在地图上显示');
            cacheBoundaryInteriorPoint(geojsonData);
            reportSiteBounds(data.bounds, files && files.length ? files[0].name : '');
        } else {
            addLogToConsole('边界预览失败：' + (data.error || '未知错误'), 'error');
        }
    })
    .catch(error => {
        addLogToConsole(`边界预览失败：${error.message}`, 'error');
    });
 }

// 更新地图标题
function updateMapTitle() {
    const scjd = getSurveyStage();
    const dkdm = document.getElementById('dkdm').value;
    const title = `${scjd} ${dkdm}`;
    document.getElementById('mapTitle').textContent = title;
}


// 中央经线改变事件 - 重新绘制边界
document.getElementById('central_meridian').addEventListener('change', function() {
    const fileInput = document.getElementById('boundary_files');
    if (fileInput.files.length > 0 && this.value !== '手动指定') {
        addLogToConsole(`中央经线已更改为: ${this.value}°，正在重新计算边界...`);
        const currentFiles = fileInput.files;
        previewBoundary(currentFiles);
    }
});

// 地块代码和调查阶段变化时更新地图标题
document.getElementById('scjd').addEventListener('input', function() {
    this.classList.remove('is-invalid');
    updateMapTitle();
});
document.getElementById('scjd').addEventListener('change', updateMapTitle);
document.getElementById('dkdm').addEventListener('input', updateMapTitle);
document.getElementById('ydmj').addEventListener('input', function() {
    isYdmjManuallyEdited = true;
    this.classList.remove('is-invalid');
});
// 行政区代码/名称：人工编辑优先，解除 is-invalid
REGION_FIELDS.forEach(fieldId => {
    const input = getRegionInput(fieldId);
    if (!input) {
        return;
    }
    input.addEventListener('input', function() {
        isRegionManuallyEdited[fieldId] = true;
        this.classList.remove('is-invalid');
    });
});
document.getElementById('ydmj').addEventListener('blur', function() {
    const ydmjValue = getCurrentYdmjValue();
    if (Number.isFinite(ydmjValue)) {
        this.value = formatYdmjValue(ydmjValue);
    }
});

// 地图工具
function zoomToBounds() {
    if (currentBounds) {
        map.fitBounds(currentBounds, {
            maxZoom: 18,
            padding: [10, 5, 5, 5]
        });
    }
}

function clearPreview() {
    boundaryLayer.clearLayers();
    document.getElementById('boundary_files').value = '';
    document.getElementById('boundaryDisplay').innerHTML = `
        <i class="bi bi-file-earmark-zip compact-icon"></i>
        <span>上传 Shapefile / dxf / kml / kmz / xlsx / xls / csv / txt</span>
    `;
    currentBounds = null;
    window.lastPreviewGeoJSON = null;
    lastInteriorPoint = null;
    resetYdmjState(true);
    resetRegionState(true);
    document.getElementById('mapTitle').textContent = '';
}

async function saveScreenshot() {
    // 获取之前预览的GeoJSON数据
    const previewGeoJSON = window.lastPreviewGeoJSON;
    if (!previewGeoJSON) {
        addLogToConsole('错误：请先上传并预览边界数据', 'error');
        return;
    }

    // 获取文件名
    const fileName = sanitizeFileName(buildOutputName(
        getSurveyStage(),
        document.getElementById('dkdm').value,
        document.getElementById('faxh').value
    ));

    addLogToConsole('正在截取当前地图视图...');

    try {
        const imageData = await captureCurrentMapView();
        downloadDataUrl(`${fileName}.jpg`, imageData);
        addLogToConsole('当前视图截图已生成并下载');
    } catch (error) {
        addLogToConsole(`前端截图失败，回退后端生成: ${error.message}`, 'warning');

        fetch('/api/get_boundary_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                preview_geojson: JSON.stringify(previewGeoJSON),
                filename: fileName
            })
        })
        .then(response => readJsonResponse(response, '图片生成失败'))
        .then(data => {
            if (data.success) {
                downloadDataUrl(data.filename, data.image_data);
                addLogToConsole('边界图片已生成并下载');
            } else {
                addLogToConsole(`图片生成失败: ${data.error}`, 'error');
            }
        })
        .catch(fallbackError => {
            addLogToConsole(`图片生成请求失败: ${fallbackError.message}`, 'error');
        });
    }
}

// 调查阶段变化时启用/禁用方案序号（文档：仅这 6 个阶段需要，两位 01–99）
document.getElementById('scjd').addEventListener('change', function() {
    const faxhGroup = document.getElementById('faxhGroup');
    const faxhInput = document.getElementById('faxh');
    const showFaxh = needsPlanNo(this.value);

    if (showFaxh) {
        faxhGroup.classList.add('active');
        faxhInput.disabled = false;
        faxhInput.focus();
    } else {
        faxhGroup.classList.remove('active');
        faxhInput.disabled = true;
        faxhInput.value = '';
        faxhInput.classList.remove('is-invalid');
    }
});

// 方案序号输入：只留数字，失焦时补成两位（1 → 01）
document.getElementById('faxh').addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '').slice(0, 2);
    this.classList.remove('is-invalid');
});
document.getElementById('faxh').addEventListener('blur', function() {
    const digits = this.value.replace(/\D/g, '');
    if (digits && Number(digits) >= 1 && Number(digits) <= 99) {
        this.value = String(Number(digits)).padStart(2, '0');
    }
});

// 辅助函数
function updateConsoleLayout() {
    const consoleDiv = document.getElementById('console');
    const consoleViewport = document.getElementById('consoleViewport');
    if (typeof map !== 'undefined' && map && typeof map.invalidateSize === 'function') {
        map.invalidateSize();
    }
    if (!consoleDiv || !consoleViewport) {
        return;
    }

    // 日志固定单列（不再因为条目变多自动切成两列）
    consoleDiv.classList.remove('split-columns');
}

function addLogToConsole(message, type = 'info') {
    const consoleDiv = document.getElementById('console');
    const consoleViewport = document.getElementById('consoleViewport');
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;

    const timestamp = new Date().toLocaleTimeString();
    const icon = type === 'error' ? '❌'
        : type === 'warning' ? '⚠️'
        : type === 'result' ? '◆'
        : type === 'success' ? '✅'
        : type === 'highlight' ? '◆'
        : 'ℹ️';

    logEntry.innerHTML = `
        <span class="log-time">[${timestamp}]</span>
        <span class="log-icon">${icon}</span>
        <span class="log-message">${message}</span>
    `;

    consoleDiv.appendChild(logEntry);
    updateConsoleLayout();

    if (consoleViewport) {
        requestAnimationFrame(() => {
            consoleViewport.scrollTop = consoleViewport.scrollHeight;
        });
    }
}

// 初始化日期
initSurveyDateInput();

window.addEventListener('resize', updateConsoleLayout);

function validateInputs() {
    const requiredFields = [
        {id: 'dkmc', name: '地块名称'},
        {id: 'dkdm', name: '地块代码'},
        {id: 'scjd', name: '调查阶段'},
        {id: 'scrq', name: '调查日期'},
        {id: 'scdw', name: '生产单位'}
    ];

    let isValid = true;

    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element.value.trim()) {
            element.classList.add('is-invalid');
            addLogToConsole(`错误：${field.name}是必填项`, 'error');
            isValid = false;
        } else {
            element.classList.remove('is-invalid');
        }
    });

    const scrqInput = document.getElementById('scrq');
    const normalizedSurveyDate = normalizeSurveyDateInput();
    if (scrqInput.value.trim() && !normalizedSurveyDate) {
        scrqInput.classList.add('is-invalid');
        addLogToConsole('错误：调查日期格式无法识别，请使用 YYYY-MM-DD 或直接粘贴常见日期格式', 'error');
        isValid = false;
    } else if (normalizedSurveyDate) {
        scrqInput.classList.remove('is-invalid');
    }

    // 调查阶段：必填，且必须是文档规定的 10 项之一
    const scjdInput = document.getElementById('scjd');
    const stageValue = getSurveyStage();
    const stageOptions = Array.from(document.querySelectorAll('#scjdOptions option'))
        .map(option => option.value);
    if (!stageValue) {
        scjdInput.classList.add('is-invalid');
        addLogToConsole('错误：请选择调查阶段（可从下拉选，也可直接输入）', 'error');
        isValid = false;
    } else if (!stageOptions.includes(stageValue)) {
        scjdInput.classList.add('is-invalid');
        addLogToConsole(`错误：调查阶段「${stageValue}」不在文档规定的 10 项之内：${stageOptions.join('、')}`, 'error');
        isValid = false;
    } else {
        scjdInput.classList.remove('is-invalid');
    }

    // 需要方案序号的 6 个阶段：必填，两位数字 01–99
    const scjd = getSurveyStage();
    const faxh = document.getElementById('faxh');
    if (needsPlanNo(scjd)) {
        const digits = faxh.value.replace(/\D/g, '');
        if (!digits || Number(digits) < 1 || Number(digits) > 99) {
            faxh.classList.add('is-invalid');
            addLogToConsole('错误：该调查阶段需要方案序号（01–99，两位数字）', 'error');
            isValid = false;
        } else {
            faxh.value = String(Number(digits)).padStart(2, '0');
            faxh.classList.remove('is-invalid');
        }
    } else {
        faxh.classList.remove('is-invalid');
    }

    const ydmjInput = document.getElementById('ydmj');
    const ydmjValue = getCurrentYdmjValue();
    if (!ydmjInput.value.trim()) {
        ydmjInput.classList.add('is-invalid');
        addLogToConsole('错误：请填写用地面积', 'error');
        isValid = false;
    } else if (!Number.isFinite(ydmjValue) || ydmjValue < 0) {
        ydmjInput.classList.add('is-invalid');
        addLogToConsole('错误：用地面积必须是大于或等于0的数字', 'error');
        isValid = false;
    } else {
        ydmjInput.classList.remove('is-invalid');
        ydmjInput.value = formatYdmjValue(ydmjValue);
    }

    // 行政区（人工修正）：代码只能是数字且 ≤20 位；名称 ≤100 字。留空则用系统识别值
    const xzqdmInput = document.getElementById('xzqdm');
    const xzqdmValue = getRegionValue('xzqdm');
    if (!xzqdmValue) {
        xzqdmInput.classList.add('is-invalid');
        addLogToConsole('错误：行政区代码是文档要求必填（M）字段；未能自动识别时请手工填写', 'error');
        isValid = false;
    } else if (!/^\d+$/.test(xzqdmValue)) {
        xzqdmInput.classList.add('is-invalid');
        addLogToConsole('错误：行政区代码只能填数字，请检查后再提交', 'error');
        isValid = false;
    } else if (xzqdmValue.length > 12) {
        xzqdmInput.classList.add('is-invalid');
        addLogToConsole('错误：行政区代码最多 12 位（成果字段校验要求 12 位）', 'error');
        isValid = false;
    } else {
        xzqdmInput.classList.remove('is-invalid');
    }

    const xzqmcInput = document.getElementById('xzqmc');
    const xzqmcValue = getRegionValue('xzqmc');
    if (!xzqmcValue) {
        xzqmcInput.classList.add('is-invalid');
        addLogToConsole('错误：行政区名称是文档要求必填（M）字段；未能自动识别时请手工填写', 'error');
        isValid = false;
    } else if (xzqmcValue.length > 100) {
        xzqmcInput.classList.add('is-invalid');
        addLogToConsole('错误：行政区名称不能超过 100 字', 'error');
        isValid = false;
    } else {
        xzqmcInput.classList.remove('is-invalid');
    }

    return isValid;
}

// 处理数据：日志只保留"过程提示 / 结果数据 / 完成状态"三类，按真实顺序输出，不再用 1/5…5/5 流水号
async function processData() {
    if (boundaryRecognitionPending) {
        addLogToConsole('正在识别行政区与用地面积，请稍候再提交…', 'warning');
        return;
    }
    if (!validateInputs()) {
        return;
    }

    const btn = document.getElementById('processBtn');
    const originalText = btn.innerHTML;
    btn.dataset.processing = '1';
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>处理中...`;
    btn.disabled = true;

    try {
        // 获取之前预览的GeoJSON数据
        const previewGeoJSON = window.lastPreviewGeoJSON;
        if (!previewGeoJSON) {
            addLogToConsole('错误：请先上传并预览边界数据', 'error');
            return;
        }

        addLogToConsole('参数校验通过，开始处理…');
        const scjd = getSurveyStage();
        const dkdm = document.getElementById('dkdm').value.trim();

        // 创建表单数据对象
        const formData = new FormData();
        formData.append('preview_geojson', JSON.stringify(previewGeoJSON));
        formData.append('dkmc', document.getElementById('dkmc').value);
        formData.append('dkdm', dkdm);
        formData.append('scjd', scjd);
        formData.append('central_meridian', document.getElementById('central_meridian').value);
        const packImages = document.getElementById('packImages').checked;
        formData.append('packImages', String(packImages));

        // 可选参数
        const faxh = document.getElementById('faxh').value;
        if (faxh) formData.append('faxh', faxh);
        formData.append('scrq', normalizeSurveyDateInput());
        formData.append('scdw', document.getElementById('scdw').value);
        formData.append('bz', document.getElementById('bz').value);
        formData.append('ydmj', formatYdmjValue(getCurrentYdmjValue()));
        // 行政区：留空时后端用系统识别值
        formData.append('xzqdm', getRegionValue('xzqdm'));
        formData.append('xzqmc', getRegionValue('xzqmc'));

        if (packImages) {
            addLogToConsole('正在截取当前地图视图…');
            try {
                const screenshotData = await captureCurrentMapView();
                formData.append('screenshot', screenshotData);
                addLogToConsole('地图视图截图已就绪，将直接用于图片打包');
            } catch (error) {
                addLogToConsole(`前端截图失败，将回退后端生成图片: ${error.message}`, 'warning');
            }
        } else {
            addLogToConsole('已关闭图片打包，跳过地图截图');
        }

        // 门户签发的访问令牌（从 ?pt= 进入时带上），用于按场地计费登记。
        const portalToken = new URLSearchParams(window.location.search).get('pt');
        if (portalToken && !formData.get('pt')) {
            formData.append('pt', portalToken);
        }
        // 示例数据标记：后端会核对几何指纹确实是内置样例，才按"免费体验"放行
        if (sampleMode) {
            formData.append('sample', '1');
        }

        addLogToConsole('正在处理边界数据（投影转换 / 属性写入 / 打包）…');
        const response = await fetch('/api/process_boundary', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            // 后端会把"为什么失败 + 怎么办"写进 error 字段（含权益未开通时的购买链接），原样展示给用户
            let reason = `服务返回 ${response.status}`;
            let purchaseUrl = '';
            try {
                const detail = await readJsonResponse(response, '处理失败');
                reason = detail.error || reason;
                purchaseUrl = detail.purchase_url || '';
            } catch (error) {
                reason = error.message || reason;
            }
            if (purchaseUrl) {
                showUpgradeModal(reason, purchaseUrl);
                return;
            }
            throw new Error(reason);
        }

        const blob = await response.blob();
        await addInteriorPointLog();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sanitizeFileName(buildOutputName(scjd, dkdm, document.getElementById('faxh').value))}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

        // 服务端提示（例如"多部件面，文档要求单一 polygon"）
        const warningHeader = response.headers.get('X-Output-Warning');
        if (warningHeader) {
            addLogToConsole(`提示：${decodeURIComponent(warningHeader)}`, 'warning');
        }
        addLogToConsole(`已生成并下载 ${a.download}`, 'success');
        // 顺手生成"与上传文件同名"的字段值配置，下次上传时一起选中即可自动回填
        downloadParameterConfig();
    } catch (error) {
        addLogToConsole(`处理失败：${error.message}`, 'error');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
        delete btn.dataset.processing;
    }
}
