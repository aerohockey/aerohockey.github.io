export type Lang = 'en' | 'ru';

export interface NavLabels {
  brand: string;
  work: string;
  about: string;
  contact: string;
  role: string;
  scrollHint: string;
  backToWork: string;
  prevProject: string;
  nextProject: string;
  close: string;
  copyright: string;
  inDevelopment: string;
}

export const UI: Record<Lang, NavLabels> = {
  en: {
    brand: 'Evgeny Ivanov',
    work: 'Work',
    about: 'About',
    contact: 'Contact',
    role: 'Art director with a camera',
    scrollHint: 'Scroll →',
    backToWork: 'Back to Work',
    prevProject: 'Previous project',
    nextProject: 'Next project',
    close: 'Close',
    copyright: '© 2026 Evgeny Ivanov',
    inDevelopment: 'In development',
  },
  ru: {
    brand: 'Евгений Иванов',
    work: 'Проекты',
    about: 'Обо мне',
    contact: 'Контакты',
    role: 'Арт-директор с камерой',
    scrollHint: 'Листайте →',
    backToWork: 'К проектам',
    prevProject: 'Предыдущий проект',
    nextProject: 'Следующий проект',
    close: 'Закрыть',
    copyright: '© 2026 Евгений Иванов',
    inDevelopment: 'В разработке',
  },
};

export function getHomePath(lang: Lang): string {
  return lang === 'ru' ? '/ru/' : '/';
}

export function getAboutPath(lang: Lang): string {
  return lang === 'ru' ? '/ru/about/' : '/about/';
}

export function getContactPath(lang: Lang): string {
  return lang === 'ru' ? '/ru/contact/' : '/contact/';
}

export function getProjectPath(lang: Lang, slug: string): string {
  return lang === 'ru' ? `/ru/work/${slug}/` : `/work/${slug}/`;
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
