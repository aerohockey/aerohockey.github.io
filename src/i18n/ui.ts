export type Lang = 'en' | 'ru';

export interface NavLabels {
  brand: string;
  work: string;
  info: string;
  role: string;
  homeStatement: string;
  scrollHint: string;
  swipeHint: string;
  backToWork: string;
  allWork: string;
  nextProject: string;
  close: string;
  prevFrame: string;
  nextFrame: string;
  copyEmail: string;
  copied: string;
  framesLabel: string;
  privacyPolicy: string;
  colophon: string;
  copyright: string;
  inDevelopment: string;
  downloadAppStore: string;
}

export const UI: Record<Lang, NavLabels> = {
  en: {
    brand: 'Evgeny Ivanov',
    work: 'Work',
    info: 'About',
    role: 'Art director with a camera',
    homeStatement: 'Art director with a camera — building visual strategies, shooting photography and video for brands',
    scrollHint: 'Scroll →',
    swipeHint: 'Swipe →',
    backToWork: 'Back to Work',
    allWork: 'All work',
    nextProject: 'Next project',
    close: 'Close',
    prevFrame: 'Previous',
    nextFrame: 'Next',
    copyEmail: 'Copy',
    copied: 'Copied',
    framesLabel: 'frames',
    privacyPolicy: 'Privacy Policy',
    colophon: 'Typeface: ABC Areal by',
    copyright: '© 2026 Evgeny Ivanov',
    inDevelopment: 'In development',
    downloadAppStore: 'Download on the App Store',
  },
  ru: {
    brand: 'Евгений Иванов',
    work: 'Проекты',
    info: 'Инфо',
    role: 'Арт-директор с камерой',
    homeStatement: 'Арт-директор с камерой — разрабатываю визуальные стратегии, снимаю фото и видео для брендов',
    scrollHint: 'Листайте →',
    swipeHint: 'Листайте →',
    backToWork: 'К проектам',
    allWork: 'Все проекты',
    nextProject: 'Следующий проект',
    close: 'Закрыть',
    prevFrame: 'Назад',
    nextFrame: 'Далее',
    copyEmail: 'Скопировать',
    copied: 'Скопировано',
    framesLabel: 'кадров',
    privacyPolicy: 'Политика приватности',
    colophon: 'Шрифт: ABC Areal —',
    copyright: '© 2026 Евгений Иванов',
    inDevelopment: 'В разработке',
    downloadAppStore: 'Скачать в App Store',
  },
};

export function formatFramesCount(lang: Lang, count: number): string {
  const padded = String(count).padStart(2, '0');
  if (lang === 'en') {
    return `${padded} ${count === 1 ? 'frame' : 'frames'}`;
  }
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${padded} кадр`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${padded} кадра`;
  return `${padded} кадров`;
}

export function getHomePath(lang: Lang): string {
  return lang === 'ru' ? '/ru/' : '/';
}

export function getInfoPath(lang: Lang): string {
  return lang === 'ru' ? '/ru/about/' : '/about/';
}

export function getProjectPath(lang: Lang, slug: string): string {
  return lang === 'ru' ? `/ru/work/${slug}/` : `/work/${slug}/`;
}

export function getGuestPrivacyPath(lang: Lang): string {
  return lang === 'ru' ? '/ru/work/guest/privacy/' : '/work/guest/privacy/';
}

export function getAlternateLangPath(pathname: string, targetLang: Lang): string {
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
  if (targetLang === 'ru') {
    if (normalized === '/ru/' || normalized.startsWith('/ru/')) return normalized;
    return normalized === '/' ? '/ru/' : `/ru${normalized}`;
  }
  if (normalized === '/ru/') return '/';
  if (normalized.startsWith('/ru/')) return normalized.slice(3) || '/';
  return normalized;
}
