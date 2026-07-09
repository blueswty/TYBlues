# History

## 2026-07-08

### Goal

在 `D:\Install\Ex\Blog` 中搭建一个适合个人网站 + 博客的工程，要求：

- 有博客系统
- 有周刊系统
- 未来可接入图片/相册
- 风格偏简约、科技感
- 好维护、访问速度快、修改方便、兼容功能多

### Architecture Decision

确定采用以下技术方向：

- 框架：Astro
- 内容形式：Markdown / MDX
- 内容管理：Git
- 部署：Cloudflare Pages
- 图片方案：本地少量图片 + 图床或 Cloudflare R2
- 可选扩展：RSS、Sitemap、评论、搜索、统计

### Project Initialization

已完成：

- 初始化 Astro 项目骨架
- 建立内容集合：
  - `blog`
  - `weekly`
  - `gallery`
- 创建基础页面：
  - 首页
  - 博客列表页与详情页
  - 周刊列表页与详情页
  - 相册入口页
  - About 页
- 配置：
  - `astro.config.mjs`
  - `src/content.config.ts`
  - `package.json`
  - `tsconfig.json`
  - `rss.xml`
  - `.gitignore`
  - `README.md`

### Verification

已验证以下命令可通过：

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
npm.cmd run check
```

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
npm.cmd run build
```

说明：

- Astro telemetry 在当前环境会尝试写入用户目录，因此本地开发和检查时建议设置 `ASTRO_TELEMETRY_DISABLED=1`

### Git Status

已完成：

- 初始化本地 Git 仓库

说明：

- 当前目录已具备继续提交和推送到 GitHub 的基础

### Home Page Direction

首页从“功能入口页”调整为更偏个人站的结构，目标更接近 `tw93` 气质：

- 更强调个人感和持续更新感
- 弱化模板式博客首页
- 增加 `Now / Workflow / Corner` 一类更像个人空间的模块
- 首页同时承接博客、周刊、相册入口

### Visual Direction Changes

最初配色偏深色科技风，之后根据要求统一调整为接近 `#f5f4ed` 的米色系。

已调整范围包括：

- 全局背景
- 导航栏
- 卡片
- 按钮
- 标签
- 正文
- 引用块
- 首页模块

当前方向：

- 米色纸感
- 柔和绿色点缀
- 整体更轻、更温和

### How To Preview Locally

本地预览命令：

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
npm.cmd run dev
```

默认访问地址通常为：

- `http://localhost:4321`

### Recommended Next Steps

建议后续继续做：

1. 修改 `src/consts.ts` 中的站点标题、描述和域名
2. 把首页与 About 页文案替换成真实个人信息
3. 新增真实博客文章和周刊内容
4. 配置 GitHub 仓库
5. 配置 Cloudflare Pages 部署
6. 后续按需接入 PicGo + 图床 / R2

### Collaboration Note

从本条开始，后续在这个项目中的关键对话、决策、改动方向和操作建议，将持续追加到本文件，方便在其他电脑上继续协作。

## 2026-07-08 Deployment Issue

### Symptom

Cloudflare 构建日志显示：

- `npm run build` 成功
- Astro 静态构建成功
- `dist` 正常生成
- 失败发生在后续执行 `npx wrangler deploy` 时

### Root Cause

当前项目是标准静态 Astro 站点，适合部署到 Cloudflare Pages 的静态产物模式：

- 构建命令：`npm run build`
- 输出目录：`dist`

但实际部署流程又额外执行了：

```bash
npx wrangler deploy
```

这会把项目当成 Cloudflare Workers / Astro Cloudflare 适配器项目继续处理，并尝试运行类似 `astro add cloudflare` 的自动配置流程，最终报错：

- `Missing file or directory: public/.assetsignore`

这不是当前站点代码本身的构建问题，而是部署目标和部署命令不匹配。

### Recommended Fix

优先方案：

- 使用 Cloudflare Pages 的静态站点部署方式
- 只保留：
  - Build command: `npm run build`
  - Output directory: `dist`
- 不要再执行 `npx wrangler deploy`

### Note

如果未来要把站点改成 Cloudflare Workers 运行时方案，再单独接入 Astro 的 Cloudflare adapter，而不是在当前静态站点上混用两种部署路径。

## 2026-07-09 Link Visibility

### Symptom

新增博客正文中的超链接没有明显视觉标记，读者难以判断哪些文字可以点击。

### Change

已为文章正文链接增加更清晰的可见性样式：

- 使用强调色区分普通正文文字
- 增加下划线
- 增加 hover 状态反馈
- 保持整体仍与当前米色主题一致

## 2026-07-09 Gallery Upgrade

### Goal

将 `gallery` 从单卡片外链入口升级为“每个相册支持多张图片”的结构。

### Change

已完成：

- `gallery` schema 支持 `images` 数组
- 每个相册可配置多张图片、alt 和 caption
- 新增相册详情页路由
- 首页和 Gallery 列表页改为优先链接到本站相册详情页
- 保留可选 `externalUrl`，用于跳转外部完整图库
