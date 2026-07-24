export const SITE_TITLE = "Blues 的个人空间";
export const SITE_DESCRIPTION = "博客、周刊、在线工具、常用链接、相册与一拍即合。";
export const SITE_URL = "https://tyblues.cn";

export const NAV_ITEMS = [
  { href: "/", label: "博客" },
  { href: "/weekly", label: "周刊" },
  { href: "/tools/data/crc-checksum", label: "工具" },
  { href: "/links", label: "链接" },
  { href: "/gallery", label: "相册" },
  { href: "/products", label: "一拍即合" }
];

export const COMMENTS_CONFIG = {
  provider: "giscus",
  giscus: {
    enabled: true,
    repo: "blueswty/TYBlues",
    repoId: "R_kgDOTRjj0w",
    category: "Q&A",
    categoryId: "DIC_kwDOTRjj084DA0Ii",
    mapping: "pathname",
    strict: "0",
    reactionsEnabled: "1",
    emitMetadata: "0",
    inputPosition: "top",
    theme: "noborder_light",
    lang: "zh-CN"
  }
};
