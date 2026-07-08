import { defineCollection, z } from "astro:content";

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
  schema: commonMeta.extend({
    featured: z.boolean().default(false)
  })
});

const weekly = defineCollection({
  schema: commonMeta.extend({
    issue: z.number(),
    highlights: z.array(z.string()).default([])
  })
});

const gallery = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    cover: z.string(),
    pubDate: z.coerce.date(),
    location: z.string().optional(),
    externalUrl: z.string().url().optional(),
    tags: z.array(z.string()).default([])
  })
});

export const collections = {
  blog,
  weekly,
  gallery
};
