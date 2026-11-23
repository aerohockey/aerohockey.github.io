import type { ImageMetadata } from 'astro';
import { createClient } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

export const SANITY_PROJECT_ID =
  import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'wqzxe1sd';
export const SANITY_DATASET =
  import.meta.env.PUBLIC_SANITY_DATASET || 'production';
export const SANITY_API_VERSION = '2025-02-19';

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: true,
  perspective: 'published',
});

const imageBuilder = createImageUrlBuilder({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
});

export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source);
}

export interface RawSanityImage {
  _type?: string;
  asset?: {
    _id?: string;
    _ref?: string;
    url?: string;
    metadata?: {
      dimensions?: {
        width?: number;
        height?: number;
        aspectRatio?: number;
      };
    };
  } | null;
  crop?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  } | null;
  hotspot?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  } | null;
}

export interface RawSanityFile {
  asset?: {
    _id?: string;
    url?: string;
  } | null;
}

export type ResolvedImage =
  | {
      kind: 'local';
      asset: ImageMetadata;
    }
  | {
      kind: 'sanity';
      source: RawSanityImage;
      width: number;
      height: number;
      aspectRatio: number;
      objectPosition?: string;
    };

export function localImage(asset: ImageMetadata): ResolvedImage {
  return { kind: 'local', asset };
}

export function resolveSanityImage(
  img?: RawSanityImage | null
): ResolvedImage | null {
  if (!img?.asset || (!img.asset._id && !img.asset._ref && !img.asset.url)) {
    return null;
  }

  const dims = img.asset.metadata?.dimensions;
  const origW = dims?.width && dims.width > 0 ? dims.width : 1600;
  const origH = dims?.height && dims.height > 0 ? dims.height : 1200;

  const cropLeft = img.crop?.left ?? 0;
  const cropRight = img.crop?.right ?? 0;
  const cropTop = img.crop?.top ?? 0;
  const cropBottom = img.crop?.bottom ?? 0;

  const width = Math.max(1, Math.round(origW * Math.max(0.05, 1 - cropLeft - cropRight)));
  const height = Math.max(1, Math.round(origH * Math.max(0.05, 1 - cropTop - cropBottom)));
  const aspectRatio = Number((width / height).toFixed(4));

  let objectPosition: string | undefined;
  if (
    img.hotspot &&
    typeof img.hotspot.x === 'number' &&
    typeof img.hotspot.y === 'number'
  ) {
    const xPct = Math.round(Math.min(1, Math.max(0, img.hotspot.x)) * 100);
    const yPct = Math.round(Math.min(1, Math.max(0, img.hotspot.y)) * 100);
    objectPosition = `${xPct}% ${yPct}%`;
  }

  return {
    kind: 'sanity',
    source: img,
    width,
    height,
    aspectRatio,
    objectPosition,
  };
}

export function getSanityImageUrl(
  image: Extract<ResolvedImage, { kind: 'sanity' }>,
  width: number,
  format?: 'jpg'
): string {
  let builder = urlFor(image.source).width(width).quality(85).fit('max');
  builder = format === 'jpg' ? builder.format('jpg') : builder.auto('format');
  return builder.url();
}

export function getSanitySrcSet(
  image: Extract<ResolvedImage, { kind: 'sanity' }>,
  widths: number[] = [480, 800, 1200, 1600, 2000]
): string {
  const maxWidth = image.width;
  const filtered = widths.filter((w) => w <= maxWidth);
  const candidates =
    filtered.length > 0 ? filtered : [Math.min(maxWidth, widths[0])];
  if (!candidates.includes(maxWidth) && maxWidth <= widths[widths.length - 1]) {
    candidates.push(maxWidth);
  }
  return candidates
    .map((w) => `${getSanityImageUrl(image, w)} ${w}w`)
    .join(', ');
}

export function getPosterUrl(poster?: ResolvedImage): string | undefined {
  if (!poster) return undefined;
  if (poster.kind === 'local') return poster.asset.src;
  return getSanityImageUrl(poster, 1200);
}
