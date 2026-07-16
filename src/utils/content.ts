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
