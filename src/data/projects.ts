import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n/ui';

import guestCover from '../assets/draft/guest-cover.png';
import guestScreen from '../assets/draft/guest-screen.png';
import guestLockscreen from '../assets/draft/guest-lockscreen.png';
import guestSettings from '../assets/draft/guest-settings.png';
import guestWidget from '../assets/draft/guest-widget.png';

import frantsuzaCover from '../assets/draft/frantsuza-cover.jpg';
import frantsuza2 from '../assets/draft/frantsuza-2.jpg';
import frantsuza3 from '../assets/draft/frantsuza-3.jpg';
import reportageWide from '../assets/draft/reportage-wide.jpg';
import reportage2 from '../assets/draft/reportage-2.jpg';
import casperCover from '../assets/draft/casper-cover.jpg';
import braulovCover from '../assets/draft/braulov-cover.jpg';
import contaxCover from '../assets/draft/contax-cover.jpg';
import contax2 from '../assets/draft/contax-2.jpg';

export type ProjectFormat = 'landing' | 'gallery';
export type CoverAspect = '3/4' | '4/5' | '1/1' | '5/4' | '4/3' | '3/2';

export interface GalleryFrame {
  image: ImageMetadata;
  alt: Record<Lang, string>;
  orientation: 'portrait' | 'landscape';
}

export interface ProjectItem {
  slug: string;
  format: ProjectFormat;
  year: string;
  category: Record<Lang, string>;
  title: Record<Lang, string>;
  subtitle: Record<Lang, string>;
  cover: ImageMetadata;
  coverAlt: Record<Lang, string>;
  coverAspect: CoverAspect;
  intro?: Record<Lang, string>;
  gallery?: GalleryFrame[];
}

export const GUEST_ASSETS = {
  screen: guestScreen,
  lockscreen: guestLockscreen,
  settings: guestSettings,
  widget: guestWidget,
};

export const PROJECTS: ProjectItem[] = [
  {
    slug: 'guest',
    format: 'landing',
    year: '2026',
    category: {
      en: 'Mobile App · In Development',
      ru: 'Мобильное приложение · В разработке',
    },
    title: {
      en: 'Guest',
      ru: 'Guest',
    },
    subtitle: {
      en: 'One photographer every week',
      ru: 'Один фотограф каждую неделю',
    },
    cover: guestCover,
    coverAlt: {
      en: 'Guest iOS app — iPhone screen featuring photographer Greg Swales on a dark canvas',
      ru: 'Приложение Guest — экран iPhone с именем фотографа Greg Swales на тёмном фоне',
    },
    coverAspect: '4/5',
  },
  {
    slug: 'frantsuza-bistrot',
    format: 'gallery',
    year: '2025',
    category: {
      en: 'Editorial Photography',
      ru: 'Редакционная съёмка',
    },
    title: {
      en: 'Frantsuza Bistrot × Ivan Frolukhin',
      ru: 'Frantsuza Bistrot × Иван Фролухин',
    },
    subtitle: {
      en: 'Portrait & kitchen series',
      ru: 'Портретная и кухонная серия',
    },
    intro: {
      en: 'A quiet documentary portrait series capturing chef Ivan Frolukhin and the evening atmosphere of Frantsuza Bistrot.',
      ru: 'Камерная документальная серия о шефе Иване Фролухине и вечернем ритме Frantsuza Bistrot.',
    },
    cover: frantsuzaCover,
    coverAlt: {
      en: 'Frantsuza Bistrot portrait series cover',
      ru: 'Обложка серии Frantsuza Bistrot',
    },
    coverAspect: '4/5',
    gallery: [
      {
        image: frantsuzaCover,
        alt: {
          en: 'Chef Ivan Frolukhin portrait at Frantsuza Bistrot',
          ru: 'Портрет шефа Ивана Фролухина в Frantsuza Bistrot',
        },
        orientation: 'portrait',
      },
      {
        image: frantsuza2,
        alt: {
          en: 'Frantsuza Bistrot dining room detail',
          ru: 'Деталь зала Frantsuza Bistrot',
        },
        orientation: 'portrait',
      },
      {
        image: frantsuza3,
        alt: {
          en: 'Frantsuza Bistrot evening scene',
          ru: 'Вечерняя сцена в Frantsuza Bistrot',
        },
        orientation: 'portrait',
      },
    ],
  },
  {
    slug: 'reportage',
    format: 'gallery',
    year: '2024',
    category: {
      en: 'Reportage',
      ru: 'Репортаж',
    },
    title: {
      en: 'Reportage',
      ru: 'Репортаж',
    },
    subtitle: {
      en: 'Live street & event observations',
      ru: 'Живые уличные и событийные наблюдения',
    },
    intro: {
      en: 'Candid horizontal and vertical moments captured without staging — light, crowd movement, and spontaneous portraits.',
      ru: 'Непостановочные репортажные кадры — свет, движение людей и случайные портреты.',
    },
    cover: reportageWide,
    coverAlt: {
      en: 'Reportage wide frame cover',
      ru: 'Горизонтальный кадр из репортажной серии',
    },
    coverAspect: '3/2',
    gallery: [
      {
        image: reportageWide,
        alt: {
          en: 'Reportage wide scene 01',
          ru: 'Репортажный кадр 01',
        },
        orientation: 'landscape',
      },
      {
        image: reportage2,
        alt: {
          en: 'Reportage wide scene 02',
          ru: 'Репортажный кадр 02',
        },
        orientation: 'landscape',
      },
    ],
  },
  {
    slug: 'casper-x-roman-kiselyov',
    format: 'gallery',
    year: '2024',
    category: {
      en: 'Commercial Portrait',
      ru: 'Коммерческая съёмка',
    },
    title: {
      en: 'Casper × Roman Kiselyov',
      ru: 'Casper × Роман Киселёв',
    },
    subtitle: {
      en: 'Editorial direction & photography',
      ru: 'Арт-дирекшн и фотография',
    },
    intro: {
      en: 'Clean visual direction and portrait photography created in collaboration with chef Roman Kiselyov.',
      ru: 'Визуальная история и серия портретов в коллаборации с шефом Романом Киселёвым.',
    },
    cover: casperCover,
    coverAlt: {
      en: 'Casper × Roman Kiselyov cover',
      ru: 'Обложка серии Casper × Роман Киселёв',
    },
    coverAspect: '4/5',
    gallery: [
      {
        image: casperCover,
        alt: {
          en: 'Roman Kiselyov portrait',
          ru: 'Портрет Романа Киселёва',
        },
        orientation: 'portrait',
      },
    ],
  },
  {
    slug: 'sasha-braulov',
    format: 'gallery',
    year: '2024',
    category: {
      en: 'Portrait',
      ru: 'Портрет',
    },
    title: {
      en: 'Artist Sasha Braulov',
      ru: 'Художник Саша Браулов',
    },
    subtitle: {
      en: 'Studio & character study',
      ru: 'Портретная история в студии',
    },
    intro: {
      en: 'A studio portrait study of contemporary artist Sasha Braulov focusing on gesture, material, and stillness.',
      ru: 'Студийная серия с художником Сашей Брауловым — про характер, фактуру и тишину кадра.',
    },
    cover: braulovCover,
    coverAlt: {
      en: 'Artist Sasha Braulov portrait cover',
      ru: 'Портрет художника Саши Браулова',
    },
    coverAspect: '4/5',
    gallery: [
      {
        image: braulovCover,
        alt: {
          en: 'Portrait of Sasha Braulov',
          ru: 'Портрет Саши Браулова',
        },
        orientation: 'portrait',
      },
    ],
  },
  {
    slug: 'contax-g1',
    format: 'gallery',
    year: '2023',
    category: {
      en: '35mm Film',
      ru: 'Плёнка 35 мм',
    },
    title: {
      en: 'Contax G1',
      ru: 'Contax G1',
    },
    subtitle: {
      en: 'Personal 35mm visual diary',
      ru: 'Личный плёночный дневник',
    },
    intro: {
      en: 'An ongoing 35mm film diary shot on Contax G1 — quiet observations, natural light, and texture.',
      ru: 'Плёночные наблюдения на Contax G1 — естественный свет, паузы и фактура 35 мм.',
    },
    cover: contaxCover,
    coverAlt: {
      en: 'Contax G1 film diary cover',
      ru: 'Обложка серии Contax G1',
    },
    coverAspect: '4/5',
    gallery: [
      {
        image: contaxCover,
        alt: {
          en: 'Contax G1 frame 01',
          ru: 'Кадр Contax G1 01',
        },
        orientation: 'portrait',
      },
      {
        image: contax2,
        alt: {
          en: 'Contax G1 frame 02',
          ru: 'Кадр Contax G1 02',
        },
        orientation: 'portrait',
      },
    ],
  },
];

export function getProjectBySlug(slug: string): ProjectItem | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): ProjectItem {
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  if (index === -1) return PROJECTS[0];
  return PROJECTS[(index + 1) % PROJECTS.length];
}
