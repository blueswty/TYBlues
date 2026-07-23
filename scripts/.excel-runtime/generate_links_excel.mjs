import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot =
  path.basename(__dirname) === ".excel-runtime"
    ? path.resolve(__dirname, "..", "..")
    : path.resolve(__dirname, "..");
const outputDir = path.join(repoRoot, "outputs", "links-site-list");

const rows = [
  ["芯片原厂", "Texas Instruments", "https://www.ti.com/", "核心", "电源、模拟、MCU、接口资料齐全"],
  ["芯片原厂", "STMicroelectronics", "https://www.st.com/", "核心", "STM32、功率器件、传感器常用"],
  ["芯片原厂", "Analog Devices", "https://www.analog.com/", "核心", "高性能模拟、信号链、测量相关"],
  ["芯片原厂", "Espressif", "https://www.espressif.com/", "核心", "ESP32/ESP-IDF 生态核心入口"],
  ["芯片原厂", "NXP", "https://www.nxp.com/", "重要", "汽车电子、工业控制、通信方向常见"],
  ["芯片原厂", "Infineon", "https://www.infineon.com/", "重要", "功率、汽车、MCU、安全芯片"],
  ["芯片原厂", "Microchip", "https://www.microchip.com/", "重要", "PIC、AVR、模拟和接口芯片丰富"],
  ["芯片原厂", "Renesas", "https://www.renesas.com/", "补充", "工业和汽车方案资料较多"],
  ["芯片原厂", "Nordic Semiconductor", "https://www.nordicsemi.com/", "补充", "低功耗蓝牙和无线 SoC"],
  ["芯片原厂", "onsemi", "https://www.onsemi.com/", "补充", "电源、传感器、车规器件"],

  ["数据手册与选型", "Octopart", "https://octopart.com/", "核心", "聚合参数、库存、替代料查询"],
  ["数据手册与选型", "DigiKey Products", "https://www.digikey.com/en/products/", "核心", "参数筛选和 datasheet 入口都很强"],
  ["数据手册与选型", "Mouser", "https://www.mouser.com/", "核心", "海外分销商，筛选维度细"],
  ["数据手册与选型", "LCSC 立创商城", "https://www.szlcsc.com/", "核心", "国内选型和采购高频入口"],
  ["数据手册与选型", "Findchips", "https://www.findchips.com/", "补充", "跨平台库存和价格查询"],
  ["数据手册与选型", "AllDatasheet", "https://www.alldatasheet.com/", "补充", "适合快速搜旧型号 PDF"],
  ["数据手册与选型", "Datasheet Archive", "https://www.datasheetarchive.com/", "补充", "历史型号和归档资料补充来源"],

  ["EDA 与封装库", "KiCad", "https://www.kicad.org/", "核心", "开源 EDA 工具官网"],
  ["EDA 与封装库", "EasyEDA", "https://easyeda.com/", "核心", "在线原理图、PCB、封装协作方便"],
  ["EDA 与封装库", "Altium", "https://www.altium.com/", "重要", "主流专业 EDA 生态"],
  ["EDA 与封装库", "SnapEDA", "https://www.snapeda.com/", "核心", "封装、符号、3D 模型高频来源"],
  ["EDA 与封装库", "Ultra Librarian", "https://www.ultralibrarian.com/", "重要", "器件封装资源补充"],
  ["EDA 与封装库", "OSHWLab / 立创开源硬件平台", "https://oshwhub.com/", "核心", "国内开源硬件项目和参考设计"],
  ["EDA 与封装库", "JLCPCB Parts Library", "https://jlcpcb.com/parts", "重要", "打样和贴片配套器件库"],

  ["PCB 打样与采购", "JLCPCB", "https://jlcpcb.com/", "核心", "样机打样和 SMT 贴片高频使用"],
  ["PCB 打样与采购", "PCBWay", "https://www.pcbway.com/", "重要", "海外打样服务常用"],
  ["PCB 打样与采购", "Seeed Fusion", "https://www.seeedstudio.com/fusion.html", "补充", "打样与制造备选"],
  ["PCB 打样与采购", "LCSC 立创商城", "https://www.szlcsc.com/", "核心", "元器件采购主入口"],
  ["PCB 打样与采购", "DigiKey", "https://www.digikey.com/", "重要", "授权分销渠道"],
  ["PCB 打样与采购", "Mouser", "https://www.mouser.com/", "重要", "授权分销渠道"],
  ["PCB 打样与采购", "淘宝", "https://www.taobao.com/", "补充", "模块、小配件、工装采购方便"],
  ["PCB 打样与采购", "京东", "https://www.jd.com/", "补充", "通用工具和耗材采购方便"],

  ["嵌入式开发文档", "PlatformIO Docs", "https://docs.platformio.org/en/stable/", "核心", "跨平台嵌入式构建工具文档"],
  ["嵌入式开发文档", "Arduino Docs", "https://docs.arduino.cc/", "重要", "快速验证和常见库文档"],
  ["嵌入式开发文档", "ESP-IDF Docs", "https://docs.espressif.com/projects/esp-idf/en/latest/", "核心", "Espressif 官方开发文档"],
  ["嵌入式开发文档", "Zephyr Docs", "https://docs.zephyrproject.org/latest/", "重要", "RTOS 与设备抽象参考"],
  ["嵌入式开发文档", "STM32Cube Ecosystem", "https://www.st.com/en/ecosystems/stm32cube.html", "核心", "STM32 工具链和生态入口"],
  ["嵌入式开发文档", "CMSIS", "https://www.arm.com/technologies/cmsis", "重要", "ARM Cortex 通用软件接口标准"],
  ["嵌入式开发文档", "FreeRTOS", "https://www.freertos.org/", "重要", "常用 RTOS 官网与文档"],

  ["EMC / 安规 / 测试资料", "IEC", "https://www.iec.ch/", "重要", "国际电工标准组织官网"],
  ["EMC / 安规 / 测试资料", "Analog Devices EMC Resources", "https://www.analog.com/en/lp/001/emc-resources.html", "核心", "EMC 设计与测试资料合集"],
  ["EMC / 安规 / 测试资料", "TI Developer Zone", "https://www.ti.com/design-development/ti-developer-zone.html", "补充", "应用笔记、设计资源入口"],
  ["EMC / 安规 / 测试资料", "TUV EMC", "https://www.tuv-lab.com/diancijianrongceshi/", "核心", "国内可直接参考的 EMC 测试服务页面"],
  ["EMC / 安规 / 测试资料", "EveryCircuit", "https://everycircuit.com/", "补充", "电路直观仿真与教学演示"],

  ["部署与云服务", "Cloudflare", "https://www.cloudflare.com/", "核心", "DNS、CDN、域名和边缘服务"],
  ["部署与云服务", "Cloudflare Pages Docs", "https://developers.cloudflare.com/pages/", "核心", "静态站和前端项目部署文档"],
  ["部署与云服务", "Vercel", "https://vercel.com/", "重要", "前端项目部署与预览"],
  ["部署与云服务", "Netlify", "https://www.netlify.com/", "补充", "静态站部署备选"],
  ["部署与云服务", "GitHub Pages Docs", "https://docs.github.com/en/pages", "补充", "GitHub Pages 官方文档"],
  ["部署与云服务", "阿里云", "https://www.aliyun.com/", "重要", "国内云资源与域名服务"],
  ["部署与云服务", "腾讯云", "https://cloud.tencent.com/", "重要", "国内云资源与备案相关服务"],

  ["技术社区与内容", "GitHub", "https://github.com/", "核心", "代码托管与开源协作"],
  ["技术社区与内容", "Gitee", "https://gitee.com/", "补充", "国内代码托管平台"],
  ["技术社区与内容", "Stack Overflow", "https://stackoverflow.com/", "核心", "通用技术问题检索"],
  ["技术社区与内容", "Electronics Stack Exchange", "https://electronics.stackexchange.com/", "核心", "电子硬件问题讨论质量较高"],
  ["技术社区与内容", "EEVblog Forum", "https://www.eevblog.com/forum/", "重要", "硬件工程师社区"],
  ["技术社区与内容", "bilibili", "https://www.bilibili.com/", "补充", "中文视频内容获取方便"],
  ["技术社区与内容", "YouTube", "https://www.youtube.com/", "补充", "英文技术视频资源丰富"],
  ["技术社区与内容", "知乎", "https://www.zhihu.com/", "补充", "中文经验帖和观点内容"],
  ["技术社区与内容", "Wikipedia", "https://www.wikipedia.org/", "补充", "基础概念快速查阅"],
];

try {
  await fs.mkdir(outputDir, { recursive: true });
  console.log(`Output directory ready: ${outputDir}`);

  const workbook = Workbook.create();
  const indexSheet = workbook.worksheets.add("网站清单");
  const guideSheet = workbook.worksheets.add("使用说明");

  indexSheet.showGridLines = false;
  guideSheet.showGridLines = false;

  guideSheet.getRange("A1:E8").values = [
  ["文档名称", "Links 页建议网站清单", "", "", ""],
  ["生成日期", "2026-07-23", "", "", ""],
  ["用途", "用于筛选、删减、改顺序后，再回填到站点 links 数据中", "", "", ""],
  ["列说明", "", "", "", ""],
  ["分类", "建议用于 links 页的一级分类", "", "", ""],
  ["网站名称", "页面展示名称", "", "", ""],
  ["URL", "建议链接地址", "", "", ""],
  ["推荐级别", "核心 / 重要 / 补充，方便你先做取舍", "", "", ""],
];

  guideSheet.getRange("A10:B14").values = [
  ["建议操作", "说明"],
  ["调整顺序", "直接在“网站清单”工作表中整行拖动或剪切粘贴即可"],
  ["删减条目", "删除整行，保留你真正会用和想展示的网站"],
  ["新增条目", "在表格底部继续追加，建议保持同样列结构"],
  ["回填站点", "后续我可以再帮你把筛好的结果转换成 src/data/links.ts"],
];

  indexSheet.getRange(`A1:E${rows.length + 1}`).values = [
  ["分类", "网站名称", "URL", "推荐级别", "备注"],
  ...rows,
];

  indexSheet.getRange("A1:E1").format = {
  fill: "#1F4E78",
  font: { bold: true, color: "#FFFFFF", size: 11 },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  borders: { preset: "outside", style: "thin", color: "#1F4E78" },
};

  indexSheet.getRange(`A2:E${rows.length + 1}`).format = {
  borders: { preset: "inside", style: "thin", color: "#D9E2F3" },
  verticalAlignment: "center",
};
  indexSheet.getRange(`A2:E${rows.length + 1}`).format.borders = {
  insideHorizontal: { style: "thin", color: "#D9E2F3" },
  insideVertical: { style: "thin", color: "#D9E2F3" },
  top: { style: "thin", color: "#D9E2F3" },
  bottom: { style: "thin", color: "#D9E2F3" },
  left: { style: "thin", color: "#D9E2F3" },
  right: { style: "thin", color: "#D9E2F3" },
};

  indexSheet.getRange("A:A").format.columnWidth = 20;
  indexSheet.getRange("B:B").format.columnWidth = 28;
  indexSheet.getRange("C:C").format.columnWidth = 48;
  indexSheet.getRange("D:D").format.columnWidth = 12;
  indexSheet.getRange("E:E").format.columnWidth = 34;
  indexSheet.getRange(`A1:E${rows.length + 1}`).format.wrapText = false;

  guideSheet.getRange("A1:E1").merge();
  guideSheet.getRange("A1:E1").format = {
  fill: "#1F4E78",
  font: { bold: true, color: "#FFFFFF", size: 14 },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
  guideSheet.getRange("A2:B8").format = {
  borders: { preset: "all", style: "thin", color: "#D9E2F3" },
};
  guideSheet.getRange("A10:B14").format = {
  borders: { preset: "all", style: "thin", color: "#D9E2F3" },
};
  guideSheet.getRange("A4:B8").format = {
  fill: "#F4F8FC",
};
  guideSheet.getRange("A10:B10").format = {
  fill: "#DCE6F1",
  font: { bold: true },
};
  guideSheet.getRange("A:A").format.columnWidth = 18;
  guideSheet.getRange("B:B").format.columnWidth = 64;

  indexSheet.freezePanes.freezeRows(1);

  indexSheet.getRange(`D2:D${rows.length + 1}`).dataValidation = {
  rule: { type: "list", values: ["核心", "重要", "补充"] },
};

  indexSheet.getRange(`D2:D${rows.length + 1}`).conditionalFormats.add("cellIs", {
  operator: "equal",
  formula: '"核心"',
  format: { fill: "#E2F0D9", font: { bold: true, color: "#2F5233" } },
});
  indexSheet.getRange(`D2:D${rows.length + 1}`).conditionalFormats.add("cellIs", {
  operator: "equal",
  formula: '"重要"',
  format: { fill: "#FFF2CC", font: { color: "#7F6000" } },
});
  indexSheet.getRange(`D2:D${rows.length + 1}`).conditionalFormats.add("cellIs", {
  operator: "equal",
  formula: '"补充"',
  format: { fill: "#FCE4D6", font: { color: "#833C0C" } },
});

  const table = indexSheet.tables.add(`A1:E${rows.length + 1}`, true, "LinksSuggestionTable");
  table.style = "TableStyleMedium2";
  table.showFilterButton = true;
  table.showBandedColumns = false;

  console.log("Workbook populated. Running inspection...");
  const inspect = await workbook.inspect({
    kind: "table",
    sheetId: "网站清单",
    range: `A1:E10`,
    include: "values",
    tableMaxRows: 10,
    tableMaxCols: 5,
  });
  console.log(inspect.ndjson);

  const errorScan = await workbook.inspect({
    kind: "match",
    searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
    options: { useRegex: true, maxResults: 100 },
    summary: "formula error scan",
  });
  console.log(errorScan.ndjson);

  console.log("Exporting workbook...");
  const xlsx = await SpreadsheetFile.exportXlsx(workbook);
  const outputPath = path.join(outputDir, "links-site-list.xlsx");
  await xlsx.save(outputPath);

  console.log("Rendering preview...");
  const preview = await workbook.render({
    sheetName: "网站清单",
    range: `A1:E25`,
    scale: 2,
    format: "png",
  });
  await fs.writeFile(path.join(outputDir, "links-site-list-preview.png"), new Uint8Array(await preview.arrayBuffer()));

  console.log(`Saved workbook: ${outputPath}`);
} catch (error) {
  console.error("Workbook generation failed:");
  console.error(error);
  process.exit(1);
}
