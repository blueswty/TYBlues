export const SITE_TITLE = "Blues 的个人空间";
export const SITE_DESCRIPTION = "个人网站、博客、周刊与相册。";
export const SITE_URL = "https://tyblues.cn";

export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/weekly", label: "Weekly" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" }
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
