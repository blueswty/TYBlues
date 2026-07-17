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
    title: "通用及办公",
    links: [
      { name: "立创商城", href: "https://www.szlcsc.com/" },
      { name: "淘宝", href: "https://www.taobao.com/" },
      { name: "京东", href: "https://www.jd.com/" },
      { name: "Google", href: "https://www.google.com/" },
      { name: "维基百科", href: "https://www.wikipedia.org/" },
      { name: "bilibili", href: "https://www.bilibili.com/" },
      { name: "YouTube", href: "https://www.youtube.com/" },
      { name: "GitHub", href: "https://github.com/" },
      { name: "Gitee", href: "https://gitee.com/" },
      { name: "飞书云文档", href: "https://my.feishu.cn/" },
      { name: "知乎", href: "https://www.zhihu.com/" },
      { name: "SmallPDF", href: "https://smallpdf.com/cn#r=app" }
    ]
  },
  {
    title: "电子硬件",
    links: [
      { name: "Ti官网", href: "https://www.ti.com/" },
      { name: "ST官网", href: "https://www.st.com/" },
      { name: "ADI官网", href: "https://www.analog.com/" },
      { name: "Espressif官网", href: "https://www.espressif.com/" },
      { name: "SnapEDA", href: "https://www.snapeda.com/" },
      { name: "立创开源硬件平台", href: "https://oshwhub.com/" },
      { name: "EveryCircuit", href: "https://everycircuit.com/" },
      { name: "TUV EMC", href: "https://www.tuv-lab.com/diancijianrongceshi/" }
    ]
  },
  {
    title: "云服务",
    links: [
      { name: "阿里云", href: "https://www.aliyun.com/" },
      { name: "腾讯云", href: "https://cloud.tencent.com/" },
      { name: "Cloudflare", href: "https://www.cloudflare.com/" }
    ]
  }
];
