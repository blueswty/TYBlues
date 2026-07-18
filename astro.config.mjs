import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkGfm from "remark-gfm";

export default defineConfig({
  site: "https://example.com",
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkGfm]
    }),
    shikiConfig: {
      theme: "github-light",
      langAlias: {
        C: "c",
        CPP: "cpp",
        CXX: "cpp"
      }
    }
  }
});
