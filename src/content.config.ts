import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const commonMeta = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional()
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: commonMeta
});

const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    cover: z.string(),
    pubDate: z.coerce.date()
  })
});

const weekly = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/weekly" }),
  schema: commonMeta.extend({
    issue: z.number(),
    highlights: z.array(z.string()).default([])
  })
});

const gallery = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/gallery" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    cover: z.string(),
    pubDate: z.coerce.date(),
    location: z.string().optional(),
    draft: z.boolean().default(false),
    camera: z.string().optional(),
    images: z.array(
      z.object({
        src: z.string(),
        alt: z.string().optional(),
        caption: z.string().optional()
      })
    ).default([]),
    tags: z.array(z.string()).default([])
  })
});

export const collections = {
  blog,
  products,
  weekly,
  gallery
};
