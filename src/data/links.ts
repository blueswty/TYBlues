export interface LinkItem {
  name: string;
  href: string;
}

export interface LinkGroup {
  title: string;
  links: LinkItem[];
}

export const LINK_GROUPS: LinkGroup[] = [
  {
    title: "技术社区与内容",
    links: [
      { name: "GitHub", href: "https://github.com/" },
      { name: "Gitee", href: "https://gitee.com/" },
      { name: "Stack Overflow", href: "https://stackoverflow.com/" },
      { name: "Electronics Stack Exchange", href: "https://electronics.stackexchange.com/" },
      { name: "EEVblog Forum", href: "https://www.eevblog.com/forum/" },
      { name: "bilibili", href: "https://www.bilibili.com/" },
      { name: "YouTube", href: "https://www.youtube.com/" },
      { name: "知乎", href: "https://www.zhihu.com/" },
      { name: "Wikipedia", href: "https://www.wikipedia.org/" }
    ]
  },
  {
    title: "芯片原厂",
    links: [
      { name: "Texas Instruments", href: "https://www.ti.com/" },
      { name: "STMicroelectronics", href: "https://www.st.com/" },
      { name: "Analog Devices", href: "https://www.analog.com/" },
      { name: "Espressif", href: "https://www.espressif.com/" },
      { name: "NXP", href: "https://www.nxp.com/" },
      { name: "Infineon", href: "https://www.infineon.com/" },
      { name: "Microchip", href: "https://www.microchip.com/" },
      { name: "Renesas", href: "https://www.renesas.com/" },
      { name: "Nordic Semiconductor", href: "https://www.nordicsemi.com/" },
      { name: "onsemi", href: "https://www.onsemi.com/" }
    ]
  },
  {
    title: "数据手册与选型",
    links: [
      { name: "Octopart", href: "https://octopart.com/" },
      { name: "DigiKey Products", href: "https://www.digikey.com/en/products/" },
      { name: "Mouser", href: "https://www.mouser.com/" },
      { name: "LCSC 立创商城", href: "https://www.szlcsc.com/" },
      { name: "Findchips", href: "https://www.findchips.com/" },
      { name: "AllDatasheet", href: "https://www.alldatasheet.com/" },
      { name: "Datasheet Archive", href: "https://www.datasheetarchive.com/" }
    ]
  },
  {
    title: "EDA 与封装库",
    links: [
      { name: "KiCad", href: "https://www.kicad.org/" },
      { name: "EasyEDA", href: "https://easyeda.com/" },
      { name: "Altium", href: "https://www.altium.com/" },
      { name: "SnapEDA", href: "https://www.snapeda.com/" },
      { name: "Ultra Librarian", href: "https://www.ultralibrarian.com/" },
      { name: "OSHWLab / 立创开源硬件平台", href: "https://oshwhub.com/" },
      { name: "JLCPCB Parts Library", href: "https://jlcpcb.com/parts" }
    ]
  },
  {
    title: "PCB 打样与采购",
    links: [
      { name: "LCSC 立创商城", href: "https://www.szlcsc.com/" },
      { name: "JLCPCB", href: "https://jlcpcb.com/" },
      { name: "PCBWay", href: "https://www.pcbway.com/" },
      { name: "Seeed Fusion", href: "https://www.seeedstudio.com/fusion.html" },
      { name: "DigiKey", href: "https://www.digikey.com/" },
      { name: "Mouser", href: "https://www.mouser.com/" },
      { name: "淘宝", href: "https://www.taobao.com/" },
      { name: "京东", href: "https://www.jd.com/" }
    ]
  },
  {
    title: "嵌入式开发文档",
    links: [
      { name: "PlatformIO Docs", href: "https://docs.platformio.org/en/stable/" },
      { name: "Arduino Docs", href: "https://docs.arduino.cc/" },
      { name: "ESP-IDF Docs", href: "https://docs.espressif.com/projects/esp-idf/en/latest/" },
      { name: "Zephyr Docs", href: "https://docs.zephyrproject.org/latest/" },
      { name: "STM32Cube Ecosystem", href: "https://www.st.com/en/ecosystems/stm32cube.html" },
      { name: "CMSIS", href: "https://www.arm.com/technologies/cmsis" },
      { name: "FreeRTOS", href: "https://www.freertos.org/" }
    ]
  },
  {
    title: "EMC / 安规 / 测试资料",
    links: [
      { name: "IEC", href: "https://www.iec.ch/" },
      { name: "Analog Devices EMC Resources", href: "https://www.analog.com/en/lp/001/emc-resources.html" },
      { name: "TI Developer Zone", href: "https://www.ti.com/design-development/ti-developer-zone.html" },
      { name: "TUV EMC", href: "https://www.tuv-lab.com/diancijianrongceshi/" },
      { name: "EveryCircuit", href: "https://everycircuit.com/" }
    ]
  },
  {
    title: "部署与云服务",
    links: [
      { name: "Cloudflare", href: "https://www.cloudflare.com/" },
      { name: "Cloudflare Pages Docs", href: "https://developers.cloudflare.com/pages/" },
      { name: "Vercel", href: "https://vercel.com/" },
      { name: "Netlify", href: "https://www.netlify.com/" },
      { name: "GitHub Pages Docs", href: "https://docs.github.com/en/pages" },
      { name: "阿里云", href: "https://www.aliyun.com/" },
      { name: "腾讯云", href: "https://cloud.tencent.com/" }
    ]
  },
  {
    title: "实用工具",
    links: [
      { name: "嘉立创阻抗计算神器", href: "https://tools.jlc.com/jlcTools/index.html#/impedanceCalculatenew" },
      { name: "SmallPDF", href: "https://smallpdf.com/cn#r=app" }
    ]
  }
];
