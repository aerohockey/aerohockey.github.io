import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const PROJECT_ID = 'wqzxe1sd';
const DATASET = 'production';
const API_VERSION = '2025-02-19';

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error(
    [
      'Missing SANITY_API_TOKEN environment variable.',
      '',
      'Create an Editor token at:',
      `  https://www.sanity.io/manage/personal/project/${PROJECT_ID}/api`,
      '',
      'Then run from the studio/ directory:',
      '  SANITY_API_TOKEN="your_token" npm run seed',
    ].join('\n')
  );
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token,
  useCdn: false,
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRAFT_ASSETS_DIR = path.resolve(__dirname, '../../src/assets/draft');

const uploadedAssets = new Map<string, string>();

async function uploadImageAsset(filename: string) {
  let assetId = uploadedAssets.get(filename);
  if (!assetId) {
    const filePath = path.join(DRAFT_ASSETS_DIR, filename);
    console.log(`Uploading image: ${filename}...`);
    const asset = await client.assets.upload(
      'image',
      createReadStream(filePath),
      { filename }
    );
    assetId = asset._id;
    uploadedAssets.set(filename, assetId);
  }
  return {
    _type: 'image' as const,
    asset: {
      _type: 'reference' as const,
      _ref: assetId,
    },
  };
}

function localized(en: string, ru: string) {
  return {
    _type: 'localizedString' as const,
    en,
    ru,
  };
}

function localizedText(en: string, ru: string) {
  return {
    _type: 'localizedText' as const,
    en,
    ru,
  };
}

async function seed() {
  console.log(`Seeding Sanity project ${PROJECT_ID} (${DATASET})...`);

  const aboutPortraitImg = await uploadImageAsset('about-portrait.jpg');

  const siteSettingsDoc = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    brand: localized('Evgeny Ivanov', 'Евгений Иванов'),
    homeTitle: localized(
      'Evgeny Ivanov — Art Director with a Camera',
      'Евгений Иванов — Арт-директор с камерой'
    ),
    homeDescription: localizedText(
      'Art director with a camera — visual direction, photography, motion & digital products.',
      'Арт-директор с камерой — визуальный дирекшн, съёмки, моушн и цифровые продукты.'
    ),
    homeStatement: localizedText(
      'Art director with a camera — building visual strategies, shooting photography and video for brands',
      'Арт-директор с камерой — разрабатываю визуальные стратегии, снимаю фото и видео для брендов'
    ),
    defaultOgImage: aboutPortraitImg,
    aboutTitle: localized('About — Evgeny Ivanov', 'Инфо — Евгений Иванов'),
    aboutDescription: localizedText(
      'Art director with a camera, Saint Petersburg — focus, selected clients, and contact details.',
      'Арт-директор с камерой, Санкт-Петербург — направления работы, клиенты и контакты.'
    ),
    aboutHeadline: localized(
      'Art director with a camera, based in Saint Petersburg',
      'Арт-директор с камерой, Санкт-Петербург'
    ),
    aboutBio: localizedText(
      'I build visual strategies, direct and shoot photography and video for brands, helping businesses look cohesive and confident',
      'Создаю визуальные стратегии, снимаю фото и видео для брендов, помогаю бизнесу выглядеть уверенно и цельно'
    ),
    focusLabel: localized('Focus', 'Направления'),
    focus: localizedText(
      'Visual direction & concepts, brand photography, short-form motion, digital products',
      'Визуальный дирекшн и концепции, съёмка для брендов, короткий моушн, цифровые продукты'
    ),
    clientsLabel: localized('Selected clients', 'Среди клиентов'),
    clients: localizedText(
      'Apple, Adidas, Samokat, KFC, Lensa, FIFA, etc.',
      'Apple, Adidas, Самокат, KFC, Lensa, FIFA и др.'
    ),
    aboutPortrait: aboutPortraitImg,
    aboutPortraitAlt: localized('Evgeny Ivanov', 'Евгений Иванов'),
    email: 'hello@evgeny.studio',
    telegramHandle: '@aerohockey',
    telegramUrl: 'https://t.me/aerohockey',
    phoneDisplay: '+7 999 215 2027',
    phoneHref: 'tel:+79992152027',
    showColophon: true,
    colophonLabel: localized('Typeface: ABC Areal by', 'Шрифт: ABC Areal —'),
    colophonLinkText: 'Dinamo',
    colophonUrl: 'https://abcdinamo.com',
  };

  await client.createOrReplace(siteSettingsDoc);
  console.log('Seeded siteSettings.');

  const guestPrivacyDoc = {
    _id: 'guestPrivacy',
    _type: 'guestPrivacy',
    backLabel: localized('Guest', 'Guest'),
    title: localized('Guest — Privacy Policy', 'Guest — Политика приватности'),
    updated: localized('Last updated: November 2026', 'Обновлено: ноябрь 2026'),
    intro: localizedText(
      'Guest is designed to deliver one photographer every week with zero behavioral tracking or personal profiling.',
      'Приложение Guest создано, чтобы знакомить с одним фотографом каждую неделю без трекинга и сбора личных данных.'
    ),
    sections: [
      {
        _key: 'privacy-accounts',
        heading: localized(
          'No accounts & no personal data',
          'Без аккаунтов и личных данных'
        ),
        text: localizedText(
          'Guest does not require registration, login credentials, phone numbers, or email addresses. We do not collect, store, or sell personal information.',
          'Guest не требует регистрации, логина, номера телефона или электронной почты. Мы не собираем, не храним и не передаём персональные данные.'
        ),
        appendContactEmail: false,
      },
      {
        _key: 'privacy-analytics',
        heading: localized(
          'No analytics or tracking SDKs',
          'Без аналитики и трекеров'
        ),
        text: localizedText(
          'The app contains no third-party advertising networks, behavioral analytics SDKs, or cross-app tracking identifiers.',
          'В приложении отсутствуют сторонние рекламные сети, SDK поведенческой аналитики и кросс-апп идентификаторы отслеживания.'
        ),
        appendContactEmail: false,
      },
      {
        _key: 'privacy-schedule',
        heading: localized(
          'Local notification schedule',
          'Локальное расписание уведомлений'
        ),
        text: localizedText(
          'Your weekly reminder preference (enabled state, day of week, and time) is stored locally on your iPhone using standard Apple system frameworks and is never transmitted to external servers.',
          'Настройки еженедельного напоминания (включение, день недели и время) хранятся исключительно локально на вашем iPhone с помощью стандартных системных механизмов Apple.'
        ),
        appendContactEmail: false,
      },
      {
        _key: 'privacy-delivery',
        heading: localized('Content delivery', 'Доставка контента'),
        text: localizedText(
          'Weekly photographer updates are fetched silently using standard HTTPS requests containing only technical headers required to deliver the current edition.',
          'Имя фотографа недели загружается по защищённому протоколу HTTPS с использованием только стандартных технических заголовков, необходимых для работы сети.'
        ),
        appendContactEmail: false,
      },
      {
        _key: 'privacy-contact',
        heading: localized('Contact', 'Контакты'),
        text: localizedText(
          'If you have any questions about privacy in Guest, write to ',
          'По любым вопросам о приватности в Guest можно написать на '
        ),
        appendContactEmail: true,
      },
    ],
    contactEmail: 'hello@evgeny.studio',
  };

  await client.createOrReplace(guestPrivacyDoc);
  console.log('Seeded guestPrivacy.');

  // Pre-upload all project assets
  const guestCoverImg = await uploadImageAsset('guest-cover.png');
  const guestHeroImg = await uploadImageAsset('guest-hero.png');
  const guestSettingsImg = await uploadImageAsset('guest-settings.png');
  const guestLockscreenImg = await uploadImageAsset('guest-lockscreen.png');
  const guestWidgetImg = await uploadImageAsset('guest-widget.png');
  const guestLockscreenFullImg = await uploadImageAsset('guest-lockscreen-full.png');

  const frantsuzaCoverImg = await uploadImageAsset('frantsuza-cover.jpg');
  const frantsuza2Img = await uploadImageAsset('frantsuza-2.jpg');
  const frantsuza3Img = await uploadImageAsset('frantsuza-3.jpg');
  const reportageWideImg = await uploadImageAsset('reportage-wide.jpg');
  const reportage2Img = await uploadImageAsset('reportage-2.jpg');
  const casperCoverImg = await uploadImageAsset('casper-cover.jpg');
  const braulovCoverImg = await uploadImageAsset('braulov-cover.jpg');
  const contaxCoverImg = await uploadImageAsset('contax-cover.jpg');
  const contax2Img = await uploadImageAsset('contax-2.jpg');

  const projectDocs: Array<{ _id: string; _type: string; slug: { _type: 'slug'; current: string }; [key: string]: unknown }> = [
    {
      _id: 'project-guest',
      _type: 'project',
      orderRank: '0|hzzzzz:',
      slug: { _type: 'slug', current: 'guest' },
      format: 'landing',
      year: '2026',
      category: localized(
        'Mobile App · In Development',
        'Мобильное приложение · В разработке'
      ),
      role: localized(
        'Concept, Art Direction, Product',
        'Концепция, арт-дирекшн, продукт'
      ),
      status: localized('Coming soon · iOS', 'Скоро · iOS'),
      title: localized('Guest', 'Guest'),
      subtitle: localized(
        'One photographer every week',
        'Один фотограф каждую неделю'
      ),
      cover: guestCoverImg,
      coverAlt: localized(
        'Guest iOS app — iPhone screen featuring photographer Greg Swales on a dark canvas',
        'Приложение Guest — экран iPhone с именем фотографа Greg Swales на тёмном фоне'
      ),
      coverAspect: '1/1',
      landingHeadline: localized(
        'Guest — One photographer every week',
        'Guest — Один фотограф каждую неделю'
      ),
      landingLeadParagraphs: [
        {
          _key: 'guest-lead-1',
          ...localizedText(
            'This concept could have been built in many other ways — as a website, a newsletter, a web app, or a Telegram channel. Yet choosing a native iPhone app for Guest is intentional: here, content is inseparable from form, and the interface itself is part of\u00A0the\u00A0statement.',
            'Эту идею можно было бы реализовать иначе — как сайт, рассылку, веб-приложение или канал в\u00A0Telegram. Но выбор нативного приложения для iPhone здесь принципиален: в\u00A0Guest форма неотделима от содержания, а\u00A0сам интерфейс является частью\u00A0высказывания.'
          ),
        },
        {
          _key: 'guest-lead-2',
          ...localizedText(
            'Negative space, typography, tactile feedback, a pure white canvas, and the absence of visual noise make the project what it was meant to\u00A0be.',
            'Негативное пространство, типографика, тактильный отклик, чистый белый лист и\u00A0отсутствие визуального шума делают проект именно таким, каким он\u00A0задумывался.'
          ),
        },
      ],
      landingBlocks: [
        {
          _key: 'guest-block-1-hero',
          _type: 'landingMediaBlock',
          mediaType: 'image',
          image: guestHeroImg,
          alt: localized(
            'Guest iPhone app showing photographer Greg Swales',
            'Экран приложения Guest на iPhone с именем фотографа Greg Swales'
          ),
          width: 'phone',
          spacingPreset: 'phoneTrim',
        },
        {
          _key: 'guest-block-2-form',
          _type: 'landingTextBlock',
          items: [
            {
              _key: 'guest-item-form',
              _type: 'landingTextItem',
              heading: localized('Form', 'Форма'),
              paragraphs: [
                {
                  _key: 'guest-p-form',
                  ...localizedText(
                    'Only the photographer’s name on a pure white screen, minimal settings, and haptic nuance. The app stays calm so the work and curiosity around the author become the entire\u00A0focus.',
                    'На чистом белом экране — только имя фотографа, минимальные настройки и\u00A0тактильный отклик. Интерфейс намеренно уходит в\u00A0сторону, чтобы всё внимание оставалось на\u00A0авторе.'
                  ),
                },
              ],
            },
          ],
        },
        {
          _key: 'guest-block-3-settings',
          _type: 'landingMediaBlock',
          mediaType: 'image',
          image: guestSettingsImg,
          alt: localized(
            'Guest weekly notification settings',
            'Настройки еженедельного уведомления Guest'
          ),
          width: 'phone',
          spacingPreset: 'phoneTrim',
        },
        {
          _key: 'guest-block-4-idea',
          _type: 'landingTextBlock',
          items: [
            {
              _key: 'guest-item-idea',
              _type: 'landingTextItem',
              heading: localized('Idea and Philosophy', 'Идея и\u00A0философия'),
              paragraphs: [
                {
                  _key: 'guest-p-idea-1',
                  ...localizedText(
                    'We live in endless feeds where photography is reduced to thumbnails competing for two seconds of attention. Guest slows the rhythm down to one name per week — giving each author space to stay with you without algorithms, likes, or infinite\u00A0scrolling.',
                    'Бесконечные ленты превратили фотографию в\u00A0поток превью, которые борются за две секунды внимания. Guest замедляет ритм до одного имени в\u00A0неделю — оставляя место для спокойного знакомства без алгоритмов, лайков и\u00A0скролла.'
                  ),
                },
                {
                  _key: 'guest-p-idea-2',
                  ...localizedText(
                    'Once a week, on Sunday at 10:00, Guest sends a quiet notification. A new photographer arrives at midnight from Saturday to Sunday — a deliberate, predictable cadence instead of constant\u00A0urgency.',
                    'Раз в\u00A0неделю, в\u00A0воскресенье в\u00A010:00, приложение присылает одно спокойное уведомление. Новый герой обновляется в\u00A0полночь с\u00A0субботы на воскресенье — предсказуемый ритуал вместо информационного\u00A0шума.'
                  ),
                },
              ],
            },
          ],
        },
        {
          _key: 'guest-block-5-lockscreen',
          _type: 'landingMediaBlock',
          mediaType: 'image',
          image: guestLockscreenImg,
          alt: localized(
            'Guest notification on iPhone Lock Screen',
            'Уведомление Guest на экране блокировки iPhone'
          ),
          width: 'column',
          spacingPreset: 'topHeavy',
        },
        {
          _key: 'guest-block-6-homescreen',
          _type: 'landingTextBlock',
          items: [
            {
              _key: 'guest-item-homescreen',
              _type: 'landingTextItem',
              heading: localized('Home Screen', 'Экран «Домой»'),
              paragraphs: [
                {
                  _key: 'guest-p-homescreen',
                  ...localizedText(
                    'A quiet square widget keeps the current guest present on your iPhone Home Screen throughout the week — a subtle editorial reminder with zero\u00A0clutter.',
                    'Минималистичный квадратный виджет держит имя текущего фотографа на домашнем экране iPhone всю неделю — как тихое напоминание без визуальной\u00A0перегрузки.'
                  ),
                },
              ],
            },
          ],
        },
        {
          _key: 'guest-block-7-widget',
          _type: 'landingMediaBlock',
          mediaType: 'image',
          image: guestWidgetImg,
          alt: localized(
            'Guest widget on iPhone Home Screen',
            'Виджет Guest на домашнем экране iPhone'
          ),
          width: 'column',
          spacingPreset: 'bottomHeavy',
        },
        {
          _key: 'guest-block-8-who-privacy',
          _type: 'landingTextBlock',
          items: [
            {
              _key: 'guest-item-who',
              _type: 'landingTextItem',
              heading: localized('Who is the guest?', 'Кто гость?'),
              paragraphs: [
                {
                  _key: 'guest-p-who',
                  ...localizedText(
                    'Curated voices across contemporary fashion, documentary, and fine-art photography — each edition highlights one photographer whose visual language deserves unhurried\u00A0discovery.',
                    'Кураторский выбор современных авторов из модной, документальной и\u00A0арт-фотографии — каждую неделю один фотограф, к\u00A0работам которого хочется вернуться без\u00A0спешки.'
                  ),
                },
              ],
            },
            {
              _key: 'guest-item-privacy',
              _type: 'landingTextItem',
              heading: localized('Privacy', 'Приватность'),
              paragraphs: [
                {
                  _key: 'guest-p-privacy',
                  ...localizedText(
                    'No accounts, no tracking pixels, no behavioral profiles, and no social noise. Guest does not collect personal analytics — it simply delivers one photographer every\u00A0week.',
                    'Никакой регистрации, трекеров, профилирования и\u00A0скрытой аналитики. Приложение не собирает лишние данные и\u00A0решает одну простую\u00A0задачу.'
                  ),
                },
              ],
              linkLabel: localized('Privacy Policy', 'Политика приватности'),
              linkHref: '/work/guest/privacy/',
            },
          ],
        },
        {
          _key: 'guest-block-9-lockscreen-full',
          _type: 'landingMediaBlock',
          mediaType: 'image',
          image: guestLockscreenFullImg,
          alt: localized(
            'Full iPhone Lock Screen with Guest notification',
            'Экран блокировки iPhone с уведомлением Guest'
          ),
          width: 'phone',
          spacingPreset: 'phoneTrim',
        },
      ],
    },
    {
      _id: 'project-frantsuza-bistrot',
      _type: 'project',
      orderRank: '0|i00007:',
      slug: { _type: 'slug', current: 'frantsuza-bistrot' },
      format: 'gallery',
      year: '2025',
      category: localized('Editorial Photography', 'Редакционная съёмка'),
      role: localized('Direction & Photography', 'Дирекшн и фотография'),
      client: localized('Frantsuza Bistrot', 'Frantsuza Bistrot'),
      title: localized(
        'Frantsuza Bistrot × Ivan Frolukhin',
        'Frantsuza Bistrot × Иван Фролухин'
      ),
      subtitle: localized(
        'Portrait & kitchen series',
        'Портретная и кухонная серия'
      ),
      intro: localizedText(
        'A quiet documentary portrait series capturing chef Ivan Frolukhin and the evening atmosphere of Frantsuza Bistrot — direct flash, clean color, and lived-in textures.',
        'Камерная документальная серия о шефе Иване Фролухине и вечернем ритме Frantsuza Bistrot — прямой свет, чистые цвета и живая фактура зала.'
      ),
      cover: frantsuzaCoverImg,
      coverAlt: localized(
        'Frantsuza Bistrot portrait series cover',
        'Обложка серии Frantsuza Bistrot'
      ),
      coverAspect: '4/5',
      gallery: [
        {
          _key: 'frantsuza-frame-1',
          _type: 'galleryImage',
          image: frantsuzaCoverImg,
          alt: localized(
            'Chef Ivan Frolukhin portrait at Frantsuza Bistrot',
            'Портрет шефа Ивана Фролухина в Frantsuza Bistrot'
          ),
        },
        {
          _key: 'frantsuza-frame-2',
          _type: 'galleryImage',
          image: frantsuza2Img,
          alt: localized(
            'Frantsuza Bistrot dining room detail',
            'Деталь зала Frantsuza Bistrot'
          ),
        },
        {
          _key: 'frantsuza-frame-3',
          _type: 'galleryImage',
          image: frantsuza3Img,
          alt: localized(
            'Frantsuza Bistrot evening scene',
            'Вечерняя сцена в Frantsuza Bistrot'
          ),
        },
      ],
    },
    {
      _id: 'project-reportage',
      _type: 'project',
      orderRank: '0|i0000f:',
      slug: { _type: 'slug', current: 'reportage' },
      format: 'gallery',
      year: '2024',
      category: localized('Reportage', 'Репортаж'),
      role: localized('Editorial Photography', 'Редакционная съёмка'),
      title: localized('Reportage', 'Репортаж'),
      subtitle: localized(
        'Live street & event observations',
        'Живые уличные и событийные наблюдения'
      ),
      intro: localizedText(
        'Candid wide and vertical observations captured without staging — light, crowd movement, and spontaneous portraits.',
        'Непостановочные репортажные кадры — свет, движение людей и случайные портреты в потоке событий.'
      ),
      cover: reportageWideImg,
      coverAlt: localized(
        'Reportage wide frame cover',
        'Горизонтальный кадр из репортажной серии'
      ),
      coverAspect: '3/2',
      gallery: [
        {
          _key: 'reportage-frame-1',
          _type: 'galleryImage',
          image: reportageWideImg,
          alt: localized('Reportage wide scene 01', 'Репортажный кадр 01'),
        },
        {
          _key: 'reportage-frame-2',
          _type: 'galleryImage',
          image: reportage2Img,
          alt: localized('Reportage wide scene 02', 'Репортажный кадр 02'),
        },
      ],
    },
    {
      _id: 'project-casper-x-roman-kiselyov',
      _type: 'project',
      orderRank: '0|i0000n:',
      slug: { _type: 'slug', current: 'casper-x-roman-kiselyov' },
      format: 'gallery',
      year: '2024',
      category: localized('Commercial Portrait', 'Коммерческая съёмка'),
      role: localized('Direction & Portrait', 'Дирекшн и портрет'),
      client: localized('Casper', 'Casper'),
      title: localized(
        'Casper × Roman Kiselyov',
        'Casper × Роман Киселёв'
      ),
      subtitle: localized(
        'Editorial direction & photography',
        'Арт-дирекшн и фотография'
      ),
      intro: localizedText(
        'Clean visual direction and portrait photography created in collaboration with chef Roman Kiselyov.',
        'Визуальная история и серия портретов в коллаборации с шефом Романом Киселёвым.'
      ),
      cover: casperCoverImg,
      coverAlt: localized(
        'Casper × Roman Kiselyov cover',
        'Обложка серии Casper × Роман Киселёв'
      ),
      coverAspect: '4/5',
      gallery: [
        {
          _key: 'casper-frame-1',
          _type: 'galleryImage',
          image: casperCoverImg,
          alt: localized(
            'Roman Kiselyov portrait',
            'Портрет Романа Киселёва'
          ),
        },
      ],
    },
    {
      _id: 'project-sasha-braulov',
      _type: 'project',
      orderRank: '0|i0000v:',
      slug: { _type: 'slug', current: 'sasha-braulov' },
      format: 'gallery',
      year: '2024',
      category: localized('Portrait', 'Портрет'),
      role: localized('Portrait & Studio', 'Портрет и студия'),
      title: localized('Artist Sasha Braulov', 'Художник Саша Браулов'),
      subtitle: localized(
        'Studio & character study',
        'Портретная история в студии'
      ),
      intro: localizedText(
        'A studio portrait study of contemporary artist Sasha Braulov focusing on gesture, material, and stillness.',
        'Студийная серия с художником Сашей Брауловым — про характер, фактуру и тишину кадра.'
      ),
      cover: braulovCoverImg,
      coverAlt: localized(
        'Artist Sasha Braulov portrait cover',
        'Портрет художника Саши Браулова'
      ),
      coverAspect: '4/5',
      gallery: [
        {
          _key: 'braulov-frame-1',
          _type: 'galleryImage',
          image: braulovCoverImg,
          alt: localized(
            'Portrait of Sasha Braulov',
            'Портрет Саши Браулова'
          ),
        },
      ],
    },
    {
      _id: 'project-contax-g1',
      _type: 'project',
      orderRank: '0|i00013:',
      slug: { _type: 'slug', current: 'contax-g1' },
      format: 'gallery',
      year: '2023',
      category: localized('35mm Film', 'Плёнка 35 мм'),
      role: localized('35mm Film Series', 'Плёнка 35 мм'),
      title: localized('Contax G1', 'Contax G1'),
      subtitle: localized(
        'Personal 35mm visual diary',
        'Личный плёночный дневник'
      ),
      intro: localizedText(
        'An ongoing 35mm film diary shot on Contax G1 — quiet observations, natural light, and tactile grain.',
        'Плёночные наблюдения на Contax G1 — естественный свет, паузы и фактура 35 мм.'
      ),
      cover: contaxCoverImg,
      coverAlt: localized('Contax G1 film diary cover', 'Обложка серии Contax G1'),
      coverAspect: '4/5',
      gallery: [
        {
          _key: 'contax-frame-1',
          _type: 'galleryImage',
          image: contaxCoverImg,
          alt: localized('Contax G1 frame 01', 'Кадр Contax G1 01'),
        },
        {
          _key: 'contax-frame-2',
          _type: 'galleryImage',
          image: contax2Img,
          alt: localized('Contax G1 frame 02', 'Кадр Contax G1 02'),
        },
      ],
    },
  ];

  for (const doc of projectDocs) {
    await client.createOrReplace(doc);
    console.log(`Seeded project: ${doc.slug.current}`);
  }

  console.log('\nDone! All settings, privacy policy, and 6 projects are seeded in Sanity.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
