import aboutPortrait from '../assets/draft/about-portrait.jpg';
import {
  COVER_ASPECT_RATIOS,
  GUEST_ASSETS,
  PROJECTS,
  type CoverAspect,
  type GalleryItem,
  type MediaAsset,
  type ProjectFormat,
  type ProjectItem,
} from '../data/projects';
import { UI, type Lang } from '../i18n/ui';
import {
  localImage,
  resolveSanityImage,
  sanityClient,
  type RawSanityFile,
  type RawSanityImage,
  type ResolvedImage,
} from './sanity';

export type LocalizedString = Record<Lang, string>;

export type CmsMediaAsset =
  | {
      type: 'image';
      image: ResolvedImage;
      alt: LocalizedString;
    }
  | {
      type: 'video';
      src: string;
      poster?: ResolvedImage;
      aspectRatio: number;
      alt: LocalizedString;
    };

export type CmsGalleryItem =
  | ({ kind: 'single' } & CmsMediaAsset)
  | { kind: 'diptych'; items: [CmsMediaAsset, CmsMediaAsset] };

export interface CmsLandingTextItem {
  heading?: LocalizedString;
  paragraphs: LocalizedString[];
  link?: {
    label: LocalizedString;
    href: string;
  };
}

export type CmsLandingWidth = 'phone' | 'column' | 'wide';
export type CmsLandingSpacingPreset =
  | 'default'
  | 'phoneTrim'
  | 'topHeavy'
  | 'bottomHeavy';

export type CmsLandingBlock =
  | {
      kind: 'text';
      items: CmsLandingTextItem[];
    }
  | {
      kind: 'media';
      media: CmsMediaAsset;
      width: CmsLandingWidth;
      spacingPreset: CmsLandingSpacingPreset;
    }
  | {
      kind: 'diptych';
      items: [CmsMediaAsset, CmsMediaAsset];
    };

export interface CmsProject {
  slug: string;
  format: ProjectFormat;
  year?: string;
  category?: LocalizedString;
  role: LocalizedString;
  client?: LocalizedString;
  status?: LocalizedString;
  appStoreUrl?: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  cover: ResolvedImage;
  coverAlt: LocalizedString;
  coverAspect: CoverAspect;
  coverVideo?: {
    src: string;
    poster?: ResolvedImage;
  };
  intro?: LocalizedString;
  gallery?: CmsGalleryItem[];
  landingHeadline?: LocalizedString;
  landingLeadParagraphs?: LocalizedString[];
  landingBlocks?: CmsLandingBlock[];
}

export interface CmsSiteSettings {
  brand: LocalizedString;
  homeTitle: LocalizedString;
  homeDescription: LocalizedString;
  homeStatement: LocalizedString;
  defaultOgImage: ResolvedImage;
  aboutTitle: LocalizedString;
  aboutDescription: LocalizedString;
  aboutHeadline: LocalizedString;
  aboutBio: LocalizedString;
  focusLabel: LocalizedString;
  focus: LocalizedString;
  clientsLabel: LocalizedString;
  clients: LocalizedString;
  aboutPortrait: ResolvedImage;
  aboutPortraitAlt: LocalizedString;
  email: string;
  telegramHandle: string;
  telegramUrl: string;
  phoneDisplay: string;
  phoneHref: string;
  showColophon: boolean;
  colophonLabel: LocalizedString;
  colophonLinkText: string;
  colophonUrl: string;
}

export interface CmsGuestPrivacy {
  backLabel: LocalizedString;
  title: LocalizedString;
  updated: LocalizedString;
  intro: LocalizedString;
  sections: Array<{
    heading: LocalizedString;
    text: LocalizedString;
    appendContactEmail: boolean;
  }>;
  contactEmail: string;
}

// ---------------------------------------------------------------------------
// Local fallback builders (preserve exact pre-CMS copy & layout)
// ---------------------------------------------------------------------------

function convertLocalMedia(asset: MediaAsset): CmsMediaAsset {
  if (asset.type === 'video') {
    return {
      type: 'video',
      src: asset.src,
      poster: asset.poster ? localImage(asset.poster) : undefined,
      aspectRatio: asset.aspectRatio,
      alt: asset.alt,
    };
  }
  return {
    type: 'image',
    image: localImage(asset.image),
    alt: asset.alt,
  };
}

function convertLocalGalleryItem(item: GalleryItem): CmsGalleryItem {
  if (item.kind === 'diptych') {
    return {
      kind: 'diptych',
      items: [
        convertLocalMedia(item.items[0]),
        convertLocalMedia(item.items[1]),
      ],
    };
  }
  return {
    kind: 'single',
    ...convertLocalMedia(item),
  };
}

const GUEST_FALLBACK_LANDING_HEADLINE: LocalizedString = {
  en: 'Guest — One photographer every week',
  ru: 'Guest — Один фотограф каждую неделю',
};

const GUEST_FALLBACK_LEAD_PARAGRAPHS: LocalizedString[] = [
  {
    en: 'This concept could have been built in many other ways — as a website, a newsletter, a web app, or a Telegram channel. Yet choosing a native iPhone app for Guest is intentional: here, content is inseparable from form, and the interface itself is part of\u00A0the\u00A0statement.',
    ru: 'Эту идею можно было бы реализовать иначе — как сайт, рассылку, веб-приложение или канал в\u00A0Telegram. Но выбор нативного приложения для iPhone здесь принципиален: в\u00A0Guest форма неотделима от содержания, а\u00A0сам интерфейс является частью\u00A0высказывания.',
  },
  {
    en: 'Negative space, typography, tactile feedback, a pure white canvas, and the absence of visual noise make the project what it was meant to\u00A0be.',
    ru: 'Негативное пространство, типографика, тактильный отклик, чистый белый лист и\u00A0отсутствие визуального шума делают проект именно таким, каким он\u00A0задумывался.',
  },
];

const GUEST_FALLBACK_BLOCKS: CmsLandingBlock[] = [
  {
    kind: 'media',
    width: 'phone',
    spacingPreset: 'phoneTrim',
    media: {
      type: 'image',
      image: localImage(GUEST_ASSETS.hero),
      alt: {
        en: 'Guest iPhone app showing photographer Greg Swales',
        ru: 'Экран приложения Guest на iPhone с именем фотографа Greg Swales',
      },
    },
  },
  {
    kind: 'text',
    items: [
      {
        heading: { en: 'Form', ru: 'Форма' },
        paragraphs: [
          {
            en: 'Only the photographer’s name on a pure white screen, minimal settings, and haptic nuance. The app stays calm so the work and curiosity around the author become the entire\u00A0focus.',
            ru: 'На чистом белом экране — только имя фотографа, минимальные настройки и\u00A0тактильный отклик. Интерфейс намеренно уходит в\u00A0сторону, чтобы всё внимание оставалось на\u00A0авторе.',
          },
        ],
      },
    ],
  },
  {
    kind: 'media',
    width: 'phone',
    spacingPreset: 'phoneTrim',
    media: {
      type: 'image',
      image: localImage(GUEST_ASSETS.settings),
      alt: {
        en: 'Guest weekly notification settings',
        ru: 'Настройки еженедельного уведомления Guest',
      },
    },
  },
  {
    kind: 'text',
    items: [
      {
        heading: { en: 'Idea and Philosophy', ru: 'Идея и\u00A0философия' },
        paragraphs: [
          {
            en: 'We live in endless feeds where photography is reduced to thumbnails competing for two seconds of attention. Guest slows the rhythm down to one name per week — giving each author space to stay with you without algorithms, likes, or infinite\u00A0scrolling.',
            ru: 'Бесконечные ленты превратили фотографию в\u00A0поток превью, которые борются за две секунды внимания. Guest замедляет ритм до одного имени в\u00A0неделю — оставляя место для спокойного знакомства без алгоритмов, лайков и\u00A0скролла.',
          },
          {
            en: 'Once a week, on Sunday at 10:00, Guest sends a quiet notification. A new photographer arrives at midnight from Saturday to Sunday — a deliberate, predictable cadence instead of constant\u00A0urgency.',
            ru: 'Раз в\u00A0неделю, в\u00A0воскресенье в\u00A010:00, приложение присылает одно спокойное уведомление. Новый герой обновляется в\u00A0полночь с\u00A0субботы на воскресенье — предсказуемый ритуал вместо информационного\u00A0шума.',
          },
        ],
      },
    ],
  },
  {
    kind: 'media',
    width: 'column',
    spacingPreset: 'topHeavy',
    media: {
      type: 'image',
      image: localImage(GUEST_ASSETS.lockscreen),
      alt: {
        en: 'Guest notification on iPhone Lock Screen',
        ru: 'Уведомление Guest на экране блокировки iPhone',
      },
    },
  },
  {
    kind: 'text',
    items: [
      {
        heading: { en: 'Home Screen', ru: 'Экран «Домой»' },
        paragraphs: [
          {
            en: 'A quiet square widget keeps the current guest present on your iPhone Home Screen throughout the week — a subtle editorial reminder with zero\u00A0clutter.',
            ru: 'Минималистичный квадратный виджет держит имя текущего фотографа на домашнем экране iPhone всю неделю — как тихое напоминание без визуальной\u00A0перегрузки.',
          },
        ],
      },
    ],
  },
  {
    kind: 'media',
    width: 'column',
    spacingPreset: 'bottomHeavy',
    media: {
      type: 'image',
      image: localImage(GUEST_ASSETS.widget),
      alt: {
        en: 'Guest widget on iPhone Home Screen',
        ru: 'Виджет Guest на домашнем экране iPhone',
      },
    },
  },
  {
    kind: 'text',
    items: [
      {
        heading: { en: 'Who is the guest?', ru: 'Кто гость?' },
        paragraphs: [
          {
            en: 'Curated voices across contemporary fashion, documentary, and fine-art photography — each edition highlights one photographer whose visual language deserves unhurried\u00A0discovery.',
            ru: 'Кураторский выбор современных авторов из модной, документальной и\u00A0арт-фотографии — каждую неделю один фотограф, к\u00A0работам которого хочется вернуться без\u00A0спешки.',
          },
        ],
      },
      {
        heading: { en: 'Privacy', ru: 'Приватность' },
        paragraphs: [
          {
            en: 'No accounts, no tracking pixels, no behavioral profiles, and no social noise. Guest does not collect personal analytics — it simply delivers one photographer every\u00A0week.',
            ru: 'Никакой регистрации, трекеров, профилирования и\u00A0скрытой аналитики. Приложение не собирает лишние данные и\u00A0решает одну простую\u00A0задачу.',
          },
        ],
        link: {
          label: { en: UI.en.privacyPolicy, ru: UI.ru.privacyPolicy },
          href: '/work/guest/privacy/',
        },
      },
    ],
  },
  {
    kind: 'media',
    width: 'phone',
    spacingPreset: 'phoneTrim',
    media: {
      type: 'image',
      image: localImage(GUEST_ASSETS.lockscreenFull),
      alt: {
        en: 'Full iPhone Lock Screen with Guest notification',
        ru: 'Экран блокировки iPhone с уведомлением Guest',
      },
    },
  },
];

function convertLocalProject(p: ProjectItem): CmsProject {
  return {
    slug: p.slug,
    format: p.format,
    year: p.year,
    category: p.category,
    role: p.role,
    client: p.client,
    status: p.status,
    appStoreUrl: p.appStoreUrl,
    title: p.title,
    subtitle: p.subtitle,
    cover: localImage(p.cover),
    coverAlt: p.coverAlt,
    coverAspect: p.coverAspect,
    coverVideo: p.coverVideo
      ? {
          src: p.coverVideo.src,
          poster: p.coverVideo.poster
            ? localImage(p.coverVideo.poster)
            : undefined,
        }
      : undefined,
    intro: p.intro,
    gallery: p.gallery?.map(convertLocalGalleryItem),
    ...(p.format === 'landing' && p.slug === 'guest'
      ? {
          landingHeadline: GUEST_FALLBACK_LANDING_HEADLINE,
          landingLeadParagraphs: GUEST_FALLBACK_LEAD_PARAGRAPHS,
          landingBlocks: GUEST_FALLBACK_BLOCKS,
        }
      : {}),
  };
}

const FALLBACK_PROJECTS: CmsProject[] = PROJECTS.map(convertLocalProject);

const FALLBACK_SITE_SETTINGS: CmsSiteSettings = {
  brand: { en: UI.en.brand, ru: UI.ru.brand },
  homeTitle: {
    en: 'Evgeny Ivanov — Art Director with a Camera',
    ru: 'Евгений Иванов — Арт-директор с камерой',
  },
  homeDescription: {
    en: 'Art director with a camera — visual direction, photography, motion & digital products.',
    ru: 'Арт-директор с камерой — визуальный дирекшн, съёмки, моушн и цифровые продукты.',
  },
  homeStatement: { en: UI.en.homeStatement, ru: UI.ru.homeStatement },
  defaultOgImage: localImage(aboutPortrait),
  aboutTitle: {
    en: 'About — Evgeny Ivanov',
    ru: 'Инфо — Евгений Иванов',
  },
  aboutDescription: {
    en: 'Art director with a camera, Saint Petersburg — focus, selected clients, and contact details.',
    ru: 'Арт-директор с камерой, Санкт-Петербург — направления работы, клиенты и контакты.',
  },
  aboutHeadline: {
    en: 'Art director with a camera, based in Saint Petersburg',
    ru: 'Арт-директор с камерой, Санкт-Петербург',
  },
  aboutBio: {
    en: 'I build visual strategies, direct and shoot photography and video for brands, helping businesses look cohesive and confident',
    ru: 'Создаю визуальные стратегии, снимаю фото и видео для брендов, помогаю бизнесу выглядеть уверенно и цельно',
  },
  focusLabel: { en: 'Focus', ru: 'Направления' },
  focus: {
    en: 'Visual direction & concepts, brand photography, short-form motion, digital products',
    ru: 'Визуальный дирекшн и концепции, съёмка для брендов, короткий моушн, цифровые продукты',
  },
  clientsLabel: { en: 'Selected clients', ru: 'Среди клиентов' },
  clients: {
    en: 'Apple, Adidas, Samokat, KFC, Lensa, FIFA, etc.',
    ru: 'Apple, Adidas, Самокат, KFC, Lensa, FIFA и др.',
  },
  aboutPortrait: localImage(aboutPortrait),
  aboutPortraitAlt: { en: 'Evgeny Ivanov', ru: 'Евгений Иванов' },
  email: 'hello@evgeny.studio',
  telegramHandle: '@aerohockey',
  telegramUrl: 'https://t.me/aerohockey',
  phoneDisplay: '+7 999 215 2027',
  phoneHref: 'tel:+79992152027',
  showColophon: true,
  colophonLabel: { en: UI.en.colophon, ru: UI.ru.colophon },
  colophonLinkText: 'Dinamo',
  colophonUrl: 'https://abcdinamo.com',
};

const FALLBACK_GUEST_PRIVACY: CmsGuestPrivacy = {
  backLabel: { en: 'Guest', ru: 'Guest' },
  title: { en: 'Guest — Privacy Policy', ru: 'Guest — Политика приватности' },
  updated: { en: 'Last updated: November 2026', ru: 'Обновлено: ноябрь 2026' },
  intro: {
    en: 'Guest is designed to deliver one photographer every week with zero behavioral tracking or personal profiling.',
    ru: 'Приложение Guest создано, чтобы знакомить с одним фотографом каждую неделю без трекинга и сбора личных данных.',
  },
  sections: [
    {
      heading: {
        en: 'No accounts & no personal data',
        ru: 'Без аккаунтов и личных данных',
      },
      text: {
        en: 'Guest does not require registration, login credentials, phone numbers, or email addresses. We do not collect, store, or sell personal information.',
        ru: 'Guest не требует регистрации, логина, номера телефона или электронной почты. Мы не собираем, не храним и не передаём персональные данные.',
      },
      appendContactEmail: false,
    },
    {
      heading: {
        en: 'No analytics or tracking SDKs',
        ru: 'Без аналитики и трекеров',
      },
      text: {
        en: 'The app contains no third-party advertising networks, behavioral analytics SDKs, or cross-app tracking identifiers.',
        ru: 'В приложении отсутствуют сторонние рекламные сети, SDK поведенческой аналитики и кросс-апп идентификаторы отслеживания.',
      },
      appendContactEmail: false,
    },
    {
      heading: {
        en: 'Local notification schedule',
        ru: 'Локальное расписание уведомлений',
      },
      text: {
        en: 'Your weekly reminder preference (enabled state, day of week, and time) is stored locally on your iPhone using standard Apple system frameworks and is never transmitted to external servers.',
        ru: 'Настройки еженедельного напоминания (включение, день недели и время) хранятся исключительно локально на вашем iPhone с помощью стандартных системных механизмов Apple.',
      },
      appendContactEmail: false,
    },
    {
      heading: {
        en: 'Content delivery',
        ru: 'Доставка контента',
      },
      text: {
        en: 'Weekly photographer updates are fetched silently using standard HTTPS requests containing only technical headers required to deliver the current edition.',
        ru: 'Имя фотографа недели загружается по защищённому протоколу HTTPS с использованием только стандартных технических заголовков, необходимых для работы сети.',
      },
      appendContactEmail: false,
    },
    {
      heading: {
        en: 'Contact',
        ru: 'Контакты',
      },
      text: {
        en: 'If you have any questions about privacy in Guest, write to ',
        ru: 'По любым вопросам о приватности в Guest можно написать на ',
      },
      appendContactEmail: true,
    },
  ],
  contactEmail: 'hello@evgeny.studio',
};

// ---------------------------------------------------------------------------
// GROQ queries & raw types
// ---------------------------------------------------------------------------

const IMAGE_PROJECTION = `{
  _type,
  crop,
  hotspot,
  asset->{
    _id,
    url,
    metadata {
      dimensions {
        width,
        height,
        aspectRatio
      }
    }
  }
}`;

const FILE_PROJECTION = `{
  asset->{
    _id,
    url
  }
}`;

const MEDIA_ITEM_PROJECTION = `{
  _type,
  alt,
  image ${IMAGE_PROJECTION},
  video ${FILE_PROJECTION},
  videoUrl,
  poster ${IMAGE_PROJECTION},
  aspectRatio
}`;

const PROJECTS_QUERY = `*[_type == "project"] | order(orderRank asc, _createdAt asc) {
  "slug": slug.current,
  format,
  year,
  category,
  role,
  client,
  status,
  appStoreUrl,
  title,
  subtitle,
  cover ${IMAGE_PROJECTION},
  coverAlt,
  coverAspect,
  coverVideo {
    file ${FILE_PROJECTION},
    videoUrl,
    poster ${IMAGE_PROJECTION}
  },
  intro,
  gallery[] {
    _type,
    alt,
    image ${IMAGE_PROJECTION},
    video ${FILE_PROJECTION},
    videoUrl,
    poster ${IMAGE_PROJECTION},
    aspectRatio,
    items[] ${MEDIA_ITEM_PROJECTION}
  },
  landingHeadline,
  landingLeadParagraphs,
  landingBlocks[] {
    _type,
    items[] {
      _type,
      heading,
      paragraphs,
      linkLabel,
      linkHref,
      alt,
      image ${IMAGE_PROJECTION},
      video ${FILE_PROJECTION},
      videoUrl,
      poster ${IMAGE_PROJECTION},
      aspectRatio
    },
    mediaType,
    image ${IMAGE_PROJECTION},
    video ${FILE_PROJECTION},
    poster ${IMAGE_PROJECTION},
    aspectRatio,
    alt,
    width,
    spacingPreset
  }
}`;

const SITE_SETTINGS_QUERY = `coalesce(
  *[_type == "siteSettings" && _id == "siteSettings"][0],
  *[_type == "siteSettings"][0]
) {
  brand,
  homeTitle,
  homeDescription,
  homeStatement,
  defaultOgImage ${IMAGE_PROJECTION},
  aboutTitle,
  aboutDescription,
  aboutHeadline,
  aboutBio,
  focusLabel,
  focus,
  clientsLabel,
  clients,
  aboutPortrait ${IMAGE_PROJECTION},
  aboutPortraitAlt,
  email,
  telegramHandle,
  telegramUrl,
  phoneDisplay,
  phoneHref,
  showColophon,
  colophonLabel,
  colophonLinkText,
  colophonUrl
}`;

const GUEST_PRIVACY_QUERY = `coalesce(
  *[_type == "guestPrivacy" && _id == "guestPrivacy"][0],
  *[_type == "guestPrivacy"][0]
) {
  backLabel,
  title,
  updated,
  intro,
  sections[] {
    heading,
    text,
    appendContactEmail
  },
  contactEmail
}`;

interface RawLocalized {
  en?: string | null;
  ru?: string | null;
}

interface RawMediaItem {
  _type?: string;
  alt?: RawLocalized | null;
  image?: RawSanityImage | null;
  video?: RawSanityFile | null;
  videoUrl?: string | null;
  poster?: RawSanityImage | null;
  aspectRatio?: number | null;
  items?: RawMediaItem[] | null;
}

function normalizeLocalized(
  raw: RawLocalized | null | undefined,
  fallback: LocalizedString
): LocalizedString;
function normalizeLocalized(
  raw: RawLocalized | null | undefined,
  fallback?: LocalizedString
): LocalizedString | undefined;
function normalizeLocalized(
  raw: RawLocalized | null | undefined,
  fallback?: LocalizedString
): LocalizedString | undefined {
  const en = raw?.en?.trim() || undefined;
  const ru = raw?.ru?.trim() || undefined;
  if (!en && !ru) return fallback;
  return {
    en: en ?? ru ?? fallback?.en ?? '',
    ru: ru ?? en ?? fallback?.ru ?? '',
  };
}

function normalizeMediaItem(raw?: RawMediaItem | null): CmsMediaAsset | null {
  if (!raw) return null;
  const alt = normalizeLocalized(raw.alt, { en: '', ru: '' });

  if (raw._type === 'galleryVideo') {
    const src = raw.video?.asset?.url || raw.videoUrl;
    if (!src) return null;
    const poster = resolveSanityImage(raw.poster) ?? undefined;
    return {
      type: 'video',
      src,
      poster,
      aspectRatio:
        typeof raw.aspectRatio === 'number' && raw.aspectRatio > 0
          ? raw.aspectRatio
          : 1.5,
      alt,
    };
  }

  const resolved = resolveSanityImage(raw.image);
  if (!resolved) return null;
  return {
    type: 'image',
    image: resolved,
    alt,
  };
}

function normalizeCoverAspect(val?: string | null): CoverAspect {
  if (val && val in COVER_ASPECT_RATIOS) {
    return val as CoverAspect;
  }
  return '4/5';
}

function normalizeProject(raw: any): CmsProject | null {
  const slug = typeof raw?.slug === 'string' ? raw.slug.trim() : '';
  const cover = resolveSanityImage(raw?.cover);
  if (!slug || !cover) return null;

  const fallbackMatch = FALLBACK_PROJECTS.find((p) => p.slug === slug);
  const format: ProjectFormat =
    raw.format === 'landing' ? 'landing' : 'gallery';

  const title = normalizeLocalized(
    raw.title,
    fallbackMatch?.title ?? { en: slug, ru: slug }
  );
  const subtitle = normalizeLocalized(
    raw.subtitle,
    fallbackMatch?.subtitle ?? { en: '', ru: '' }
  );
  const role = normalizeLocalized(
    raw.role,
    fallbackMatch?.role ?? { en: '', ru: '' }
  );
  const coverAlt = normalizeLocalized(raw.coverAlt, title);

  const coverVideoSrc =
    raw.coverVideo?.file?.asset?.url || raw.coverVideo?.videoUrl;
  const coverVideo = coverVideoSrc
    ? {
        src: coverVideoSrc,
        poster: resolveSanityImage(raw.coverVideo?.poster) ?? undefined,
      }
    : undefined;

  let gallery: CmsGalleryItem[] | undefined;
  if (Array.isArray(raw.gallery)) {
    const mapped: CmsGalleryItem[] = [];
    for (const item of raw.gallery as RawMediaItem[]) {
      if (item?._type === 'galleryDiptych' && Array.isArray(item.items)) {
        const pair = item.items
          .map((sub) => normalizeMediaItem(sub))
          .filter((x): x is CmsMediaAsset => x !== null);
        if (pair.length === 2) {
          mapped.push({ kind: 'diptych', items: [pair[0], pair[1]] });
        }
      } else {
        const single = normalizeMediaItem(item);
        if (single) {
          mapped.push({ kind: 'single', ...single });
        }
      }
    }
    if (mapped.length > 0) gallery = mapped;
  }

  let landingLeadParagraphs: LocalizedString[] | undefined;
  if (Array.isArray(raw.landingLeadParagraphs)) {
    const leads = (raw.landingLeadParagraphs as RawLocalized[])
      .map((p) => normalizeLocalized(p))
      .filter((p): p is LocalizedString => Boolean(p && (p.en || p.ru)));
    if (leads.length > 0) landingLeadParagraphs = leads;
  }

  let landingBlocks: CmsLandingBlock[] | undefined;
  if (Array.isArray(raw.landingBlocks)) {
    const blocks: CmsLandingBlock[] = [];
    for (const b of raw.landingBlocks as any[]) {
      if (b?._type === 'landingTextBlock' && Array.isArray(b.items)) {
        const items: CmsLandingTextItem[] = [];
        for (const sub of b.items) {
          const paragraphs = Array.isArray(sub?.paragraphs)
            ? (sub.paragraphs as RawLocalized[])
                .map((p) => normalizeLocalized(p))
                .filter(
                  (p): p is LocalizedString => Boolean(p && (p.en || p.ru))
                )
            : [];
          const heading = normalizeLocalized(sub?.heading);
          const linkHref =
            typeof sub?.linkHref === 'string' ? sub.linkHref.trim() : '';
          const linkLabel = normalizeLocalized(sub?.linkLabel);
          if (paragraphs.length > 0 || heading) {
            items.push({
              heading,
              paragraphs,
              ...(linkHref && linkLabel
                ? { link: { label: linkLabel, href: linkHref } }
                : {}),
            });
          }
        }
        if (items.length > 0) {
          blocks.push({ kind: 'text', items });
        }
      } else if (b?._type === 'landingMediaBlock') {
        const alt = normalizeLocalized(b.alt, { en: '', ru: '' });
        let media: CmsMediaAsset | null = null;
        if (b.mediaType === 'video') {
          const src = b.video?.asset?.url;
          if (src) {
            media = {
              type: 'video',
              src,
              poster: resolveSanityImage(b.poster) ?? undefined,
              aspectRatio:
                typeof b.aspectRatio === 'number' && b.aspectRatio > 0
                  ? b.aspectRatio
                  : 1.5,
              alt,
            };
          }
        } else {
          const resolved = resolveSanityImage(b.image);
          if (resolved) {
            media = { type: 'image', image: resolved, alt };
          }
        }
        if (media) {
          const width: CmsLandingWidth =
            b.width === 'phone' || b.width === 'wide' ? b.width : 'column';
          const spacingPreset: CmsLandingSpacingPreset =
            b.spacingPreset === 'phoneTrim' ||
            b.spacingPreset === 'topHeavy' ||
            b.spacingPreset === 'bottomHeavy'
              ? b.spacingPreset
              : 'default';
          blocks.push({ kind: 'media', media, width, spacingPreset });
        }
      } else if (b?._type === 'landingDiptychBlock' && Array.isArray(b.items)) {
        const pair = (b.items as RawMediaItem[])
          .map((sub) => normalizeMediaItem(sub))
          .filter((x): x is CmsMediaAsset => x !== null);
        if (pair.length === 2) {
          blocks.push({ kind: 'diptych', items: [pair[0], pair[1]] });
        }
      }
    }
    if (blocks.length > 0) landingBlocks = blocks;
  }

  return {
    slug,
    format,
    year: raw.year || undefined,
    category: normalizeLocalized(raw.category, fallbackMatch?.category),
    role,
    client: normalizeLocalized(raw.client, fallbackMatch?.client),
    status: normalizeLocalized(raw.status, fallbackMatch?.status),
    appStoreUrl: raw.appStoreUrl || undefined,
    title,
    subtitle,
    cover,
    coverAlt,
    coverAspect: normalizeCoverAspect(raw.coverAspect),
    coverVideo,
    intro: normalizeLocalized(raw.intro, fallbackMatch?.intro),
    gallery: gallery ?? fallbackMatch?.gallery,
    landingHeadline: normalizeLocalized(
      raw.landingHeadline,
      fallbackMatch?.landingHeadline
    ),
    landingLeadParagraphs:
      landingLeadParagraphs ?? fallbackMatch?.landingLeadParagraphs,
    landingBlocks: landingBlocks ?? fallbackMatch?.landingBlocks,
  };
}

function normalizeSiteSettings(raw: any): CmsSiteSettings {
  if (!raw) return FALLBACK_SITE_SETTINGS;
  return {
    brand: normalizeLocalized(raw.brand, FALLBACK_SITE_SETTINGS.brand),
    homeTitle: normalizeLocalized(
      raw.homeTitle,
      FALLBACK_SITE_SETTINGS.homeTitle
    ),
    homeDescription: normalizeLocalized(
      raw.homeDescription,
      FALLBACK_SITE_SETTINGS.homeDescription
    ),
    homeStatement: normalizeLocalized(
      raw.homeStatement,
      FALLBACK_SITE_SETTINGS.homeStatement
    ),
    defaultOgImage:
      resolveSanityImage(raw.defaultOgImage) ??
      FALLBACK_SITE_SETTINGS.defaultOgImage,
    aboutTitle: normalizeLocalized(
      raw.aboutTitle,
      FALLBACK_SITE_SETTINGS.aboutTitle
    ),
    aboutDescription: normalizeLocalized(
      raw.aboutDescription,
      FALLBACK_SITE_SETTINGS.aboutDescription
    ),
    aboutHeadline: normalizeLocalized(
      raw.aboutHeadline,
      FALLBACK_SITE_SETTINGS.aboutHeadline
    ),
    aboutBio: normalizeLocalized(raw.aboutBio, FALLBACK_SITE_SETTINGS.aboutBio),
    focusLabel: normalizeLocalized(
      raw.focusLabel,
      FALLBACK_SITE_SETTINGS.focusLabel
    ),
    focus: normalizeLocalized(raw.focus, FALLBACK_SITE_SETTINGS.focus),
    clientsLabel: normalizeLocalized(
      raw.clientsLabel,
      FALLBACK_SITE_SETTINGS.clientsLabel
    ),
    clients: normalizeLocalized(raw.clients, FALLBACK_SITE_SETTINGS.clients),
    aboutPortrait:
      resolveSanityImage(raw.aboutPortrait) ??
      FALLBACK_SITE_SETTINGS.aboutPortrait,
    aboutPortraitAlt: normalizeLocalized(
      raw.aboutPortraitAlt,
      FALLBACK_SITE_SETTINGS.aboutPortraitAlt
    ),
    email: raw.email?.trim() || FALLBACK_SITE_SETTINGS.email,
    telegramHandle:
      raw.telegramHandle?.trim() || FALLBACK_SITE_SETTINGS.telegramHandle,
    telegramUrl:
      raw.telegramUrl?.trim() || FALLBACK_SITE_SETTINGS.telegramUrl,
    phoneDisplay:
      raw.phoneDisplay?.trim() || FALLBACK_SITE_SETTINGS.phoneDisplay,
    phoneHref: raw.phoneHref?.trim() || FALLBACK_SITE_SETTINGS.phoneHref,
    showColophon:
      typeof raw.showColophon === 'boolean'
        ? raw.showColophon
        : FALLBACK_SITE_SETTINGS.showColophon,
    colophonLabel: normalizeLocalized(
      raw.colophonLabel,
      FALLBACK_SITE_SETTINGS.colophonLabel
    ),
    colophonLinkText:
      raw.colophonLinkText?.trim() || FALLBACK_SITE_SETTINGS.colophonLinkText,
    colophonUrl:
      raw.colophonUrl?.trim() || FALLBACK_SITE_SETTINGS.colophonUrl,
  };
}

function normalizeGuestPrivacy(raw: any): CmsGuestPrivacy {
  if (!raw) return FALLBACK_GUEST_PRIVACY;
  const sections = Array.isArray(raw.sections)
    ? raw.sections
        .map((s: any) => {
          const heading = normalizeLocalized(s?.heading);
          const text = normalizeLocalized(s?.text);
          if (!heading || !text) return null;
          return {
            heading,
            text,
            appendContactEmail: Boolean(s.appendContactEmail),
          };
        })
        .filter((x: any): x is CmsGuestPrivacy['sections'][number] => x !== null)
    : [];

  return {
    backLabel: normalizeLocalized(
      raw.backLabel,
      FALLBACK_GUEST_PRIVACY.backLabel
    ),
    title: normalizeLocalized(raw.title, FALLBACK_GUEST_PRIVACY.title),
    updated: normalizeLocalized(raw.updated, FALLBACK_GUEST_PRIVACY.updated),
    intro: normalizeLocalized(raw.intro, FALLBACK_GUEST_PRIVACY.intro),
    sections: sections.length > 0 ? sections : FALLBACK_GUEST_PRIVACY.sections,
    contactEmail:
      raw.contactEmail?.trim() || FALLBACK_GUEST_PRIVACY.contactEmail,
  };
}

// ---------------------------------------------------------------------------
// Module-level cached Sanity queries (fetched at most once per build)
// ---------------------------------------------------------------------------

let projectsPromise: Promise<CmsProject[]> | undefined;
let settingsPromise: Promise<CmsSiteSettings> | undefined;
let privacyPromise: Promise<CmsGuestPrivacy> | undefined;

export function getProjects(): Promise<CmsProject[]> {
  if (!projectsPromise) {
    projectsPromise = (async () => {
      try {
        const raw = await sanityClient.fetch<any[]>(PROJECTS_QUERY);
        if (Array.isArray(raw) && raw.length > 0) {
          const normalized = raw
            .map(normalizeProject)
            .filter((p): p is CmsProject => p !== null);
          if (normalized.length > 0) return normalized;
        }
      } catch (err) {
        console.warn('[sanity] Failed to fetch projects, using local fallback:', err);
      }
      return FALLBACK_PROJECTS;
    })();
  }
  return projectsPromise;
}

export async function getProjectBySlug(
  slug: string
): Promise<CmsProject | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}

export async function getNextProject(slug: string): Promise<CmsProject> {
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return projects[0];
  return projects[(index + 1) % projects.length];
}

export function getSiteSettings(): Promise<CmsSiteSettings> {
  if (!settingsPromise) {
    settingsPromise = (async () => {
      try {
        const raw = await sanityClient.fetch<any>(SITE_SETTINGS_QUERY);
        if (raw) return normalizeSiteSettings(raw);
      } catch (err) {
        console.warn('[sanity] Failed to fetch siteSettings, using local fallback:', err);
      }
      return FALLBACK_SITE_SETTINGS;
    })();
  }
  return settingsPromise;
}

export function getGuestPrivacy(): Promise<CmsGuestPrivacy> {
  if (!privacyPromise) {
    privacyPromise = (async () => {
      try {
        const raw = await sanityClient.fetch<any>(GUEST_PRIVACY_QUERY);
        if (raw) return normalizeGuestPrivacy(raw);
      } catch (err) {
        console.warn('[sanity] Failed to fetch guestPrivacy, using local fallback:', err);
      }
      return FALLBACK_GUEST_PRIVACY;
    })();
  }
  return privacyPromise;
}

export function countGalleryFrames(gallery?: CmsGalleryItem[]): number {
  if (!gallery || gallery.length === 0) return 1;
  return gallery.reduce(
    (sum, item) => sum + (item.kind === 'diptych' ? 2 : 1),
    0
  );
}
