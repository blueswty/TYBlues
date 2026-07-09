# Personal Site Starter

这是一个基于 Astro 的个人网站骨架，已经预置了三条核心内容线：

- `blog`：博客文章
- `weekly`：周刊归档
- `gallery`：相册列表与多图详情页

## 本地开发

```bash
npm install
npm run dev
```

如果在当前终端环境里遇到 Astro telemetry 的目录权限问题，可以先执行：

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
npm.cmd run dev
```

## 目录结构

```text
src/
  components/
  layouts/
  pages/
  styles/
  content.config.ts
src/content/
  blog/
  weekly/
  gallery/
```

## 内容写作

- 博客：在 `src/content/blog/` 下新增 Markdown 文件
- 周刊：在 `src/content/weekly/` 下新增 Markdown 文件
- 相册：在 `src/content/gallery/` 下新增入口文件，封面可先放远程图
- 相册详情：每个相册文件可使用 `images` 数组维护多张照片与说明

## 后续建议

- 把 `src/consts.ts` 里的站点标题、描述、域名改成你的真实信息
- 部署到 Cloudflare Pages
- 图片上传接 PicGo + 图床或 Cloudflare R2
- 后续可继续接入搜索、评论、订阅和项目页

## Analytics and Comments

- Cloudflare Web Analytics: enable it directly in the Cloudflare Pages project dashboard
- Giscus comments: fill the `COMMENTS_CONFIG.giscus` fields in `src/consts.ts`
- Giscus requires GitHub Discussions to be enabled for the target repository
