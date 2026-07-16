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
    title: "开发与文档",
    links: [
      { name: "GitHub", href: "https://github.com" },
      { name: "Astro Docs", href: "https://docs.astro.build" },
      { name: "MDN Web Docs", href: "https://developer.mozilla.org" }
    ]
  },
  {
    title: "电子硬件",
    links: [
      { name: "立创商城", href: "https://www.szlcsc.com" },
      { name: "嘉立创 EDA", href: "https://lceda.cn" },
      { name: "DigiKey", href: "https://www.digikey.cn" }
    ]
  },
  {
    title: "效率工具",
    links: [
      { name: "DeepL", href: "https://www.deepl.com" },
      { name: "Excalidraw", href: "https://excalidraw.com" },
      { name: "Regex101", href: "https://regex101.com" }
    ]
  }
];
