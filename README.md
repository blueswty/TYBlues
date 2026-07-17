# TYBlues

这是一个基于 Astro 的个人站点，目前主结构围绕 4 个内容入口展开：

- `博客`：Markdown 博文列表与详情页，支持标签筛选和关键词搜索
- `链接`：常用网站导航页，优先使用 `public/site-icons/` 下的本地图标
- `在线工具`：站内工具集合，当前保留既有内容并统一风格
- `一拍即合`：产品推荐与商品内容页，使用独立的 Markdown 内容集合

当前默认首页就是博客列表页。

## 本地开发

```bash
npm install
npm run dev
```

如果当前终端环境对 Astro telemetry 的目录权限比较严格，可以先禁用 telemetry：

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
npm.cmd run dev
```

常用检查命令：

```bash
npm run check
npm run build
```

## 当前结构

```text
public/
  products/        # 一拍即合产品图片，统一使用 4:3 比例
  site-icons/      # 链接页本地图标，优先使用 {hostname}.ico

src/
  components/
  content/
    blog/          # 博客 Markdown
    products/      # 一拍即合 Markdown
    weekly/        # 旧内容，当前不在主导航中
    gallery/       # 旧内容，当前不在主导航中
  layouts/
  pages/
    index.astro    # 博客首页
    links.astro    # 链接页
    products/      # 一拍即合列表与详情
    tools/         # 在线工具
  styles/
  consts.ts
  content.config.ts
```

## 内容维护

### 1. 博客

博客内容放在 `src/content/blog/`。

Frontmatter 使用当前博客公共结构，常用字段包括：

```md
---
title: 标题
description: 简介
pubDate: 2026-07-17
updatedDate: 2026-07-17
tags:
  - 标签1
  - 标签2
draft: false
cover: /path/to/cover.png
---
```

说明：

- `title`、`description`、`pubDate` 必填
- `tags` 用于左侧筛选和文内标签展示
- `updatedDate`、`draft`、`cover` 可选
- 当前博客列表按 `pubDate` 倒序排列

### 2. 一拍即合

产品内容放在 `src/content/products/`，每个产品对应一个 Markdown 文件。

当前 frontmatter 结构：

```md
---
title: 产品名称
description: 产品简介
tags:
  - 分类标签
  - 场景标签
cover: /products/example-cover.jpg
pubDate: 2026-07-17
---
```

说明：

- `cover` 必须指向 `public/products/` 下的图片资源
- 产品列表页会读取 `cover`、`title`、`description`、`tags`
- `pubDate` 主要用于排序，前台列表不显示上架日期

### 3. 链接页

链接数据维护在 `src/data/links.ts`。

图标规则：

- 优先读取 `public/site-icons/{hostname}.ico`
- 如果对应 `.ico` 不存在或不是可渲染图片，则回退到代码里的 SVG 备用图标
- 当前已补齐主导航链接所需的本地图标资源

例如：

- `https://github.com/` 对应 `public/site-icons/github.com.ico`
- `https://www.taobao.com/` 对应 `public/site-icons/www.taobao.com.ico`

### 4. 在线工具

在线工具页面位于 `src/pages/tools/` 下，当前以保留既有功能为主。

如果后续新增工具，建议继续沿用现有分类结构：

- `tools/data/`
- `tools/protocol/`
- `tools/mcu/`
- `tools/circuit/`

## 站点配置

基础站点信息在 `src/consts.ts`：

- `SITE_TITLE`
- `SITE_DESCRIPTION`
- `SITE_URL`
- `NAV_ITEMS`
- `COMMENTS_CONFIG`

当前评论使用 Giscus，仓库和分类配置也在 `src/consts.ts` 中维护。

## 现有交互特性

- 顶部导航下滑隐藏、上滑显示
- 博客与一拍即合列表支持悬浮筛选面板
- 博客与一拍即合详情页支持悬浮目录导航
- 页面右下侧提供回到顶部按钮
- 链接页图标优先使用本地 favicon

## 说明

- `weekly` 和 `gallery` 相关目录与页面目前仍保留在仓库中，但已经不属于主导航结构
- `dist/` 是构建产物目录，不作为内容维护入口
- 正式部署依赖 `public/` 与构建后的页面输出，不需要直接管理 `dist/`
