export function entrySlug(id: string) {
  return id.replace(/\.md$/i, "");
}

export function blogPermalink(id: string) {
  return `/blog/${entrySlug(id)}/`;
}

export function weeklyPermalink(id: string) {
  return `/weekly/${entrySlug(id)}/`;
}

export function galleryPermalink(id: string) {
  return `/gallery/${entrySlug(id)}/`;
}

export function productPermalink(id: string) {
  return `/products/${entrySlug(id)}/`;
}

function stripMarkdown(markdown: string) {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[*_~>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMarkdownSection(markdown: string, headingTitle: string) {
  const lines = markdown.split(/\r?\n/);
  const headingPattern = new RegExp(`^#{1,6}\\s*${headingTitle}\\s*$`);
  let startIndex = -1;

  for (let index = 0; index < lines.length; index += 1) {
    if (headingPattern.test(lines[index].trim())) {
      startIndex = index + 1;
      break;
    }
  }

  if (startIndex === -1) {
    return "";
  }

  const sectionLines: string[] = [];

  for (let index = startIndex; index < lines.length; index += 1) {
    const line = lines[index];

    if (/^#{1,6}\s+/.test(line.trim())) {
      break;
    }

    sectionLines.push(line);
  }

  return stripMarkdown(sectionLines.join("\n"));
}

function extractFirstParagraph(markdown: string) {
  const paragraphs = markdown
    .split(/\r?\n\s*\r?\n/)
    .map((block) => stripMarkdown(block))
    .filter(Boolean);

  return paragraphs[0] ?? "";
}

export function getProductDescription<
  T extends {
    body?: string;
    data: { description?: string };
  }
>(product: T) {
  if (product.data.description?.trim()) {
    return product.data.description.trim();
  }

  const markdownBody = product.body ?? "";
  return extractMarkdownSection(markdownBody, "简介") || extractFirstParagraph(markdownBody);
}

export function sortByPubDateDesc<
  T extends {
    data: { pubDate: Date };
  }
>(entries: T[]) {
  return entries.sort((left, right) => right.data.pubDate.valueOf() - left.data.pubDate.valueOf());
}

export function sortFeaturedFirst<
  T extends {
    data: { featured?: boolean; pubDate: Date };
  }
>(entries: T[]) {
  return entries.sort((left, right) => {
    const featuredDelta = Number(right.data.featured ?? false) - Number(left.data.featured ?? false);
    if (featuredDelta !== 0) {
      return featuredDelta;
    }

    return right.data.pubDate.valueOf() - left.data.pubDate.valueOf();
  });
}
