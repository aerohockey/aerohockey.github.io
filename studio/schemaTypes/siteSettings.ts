import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings & About',
  type: 'document',
  groups: [
    { name: 'home', title: 'Home & Global', default: true },
    { name: 'about', title: 'About / Info' },
    { name: 'contact', title: 'Contacts' },
    { name: 'colophon', title: 'Colophon' },
  ],
  fields: [
    defineField({
      name: 'brand',
      title: 'Brand / Site name',
      type: 'localizedString',
      group: 'home',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'homeTitle',
      title: 'Home SEO title',
      type: 'localizedString',
      group: 'home',
    }),
    defineField({
      name: 'homeDescription',
      title: 'Home SEO description',
      type: 'localizedText',
      group: 'home',
    }),
    defineField({
      name: 'homeStatement',
      title: 'Home positioning statement',
      type: 'localizedText',
      group: 'home',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default OpenGraph preview image',
      type: 'image',
      group: 'home',
      options: {
        hotspot: true,
      },
    }),

    // About / Info
    defineField({
      name: 'aboutTitle',
      title: 'About SEO title',
      type: 'localizedString',
      group: 'about',
    }),
    defineField({
      name: 'aboutDescription',
      title: 'About SEO description',
      type: 'localizedText',
      group: 'about',
    }),
    defineField({
      name: 'aboutHeadline',
      title: 'About headline',
      type: 'localizedString',
      group: 'about',
    }),
    defineField({
      name: 'aboutBio',
      title: 'About bio',
      type: 'localizedText',
      group: 'about',
    }),
    defineField({
      name: 'focusLabel',
      title: 'Focus label',
      type: 'localizedString',
      group: 'about',
    }),
    defineField({
      name: 'focus',
      title: 'Focus areas',
      type: 'localizedText',
      group: 'about',
    }),
    defineField({
      name: 'clientsLabel',
      title: 'Selected clients label',
      type: 'localizedString',
      group: 'about',
    }),
    defineField({
      name: 'clients',
      title: 'Selected clients list',
      type: 'localizedText',
      group: 'about',
    }),
    defineField({
      name: 'aboutPortrait',
      title: 'About portrait',
      type: 'image',
      group: 'about',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'aboutPortraitAlt',
      title: 'About portrait alt text',
      type: 'localizedString',
      group: 'about',
    }),

    // Contacts
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'telegramHandle',
      title: 'Telegram handle (e.g. @aerohockey)',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'telegramUrl',
      title: 'Telegram URL',
      type: 'url',
      group: 'contact',
    }),
    defineField({
      name: 'phoneDisplay',
      title: 'Phone display text',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'phoneHref',
      title: 'Phone link (e.g. tel:+79992152027)',
      type: 'string',
      group: 'contact',
    }),

    // Colophon
    defineField({
      name: 'showColophon',
      title: 'Show typeface colophon in About footer',
      type: 'boolean',
      group: 'colophon',
      initialValue: true,
    }),
    defineField({
      name: 'colophonLabel',
      title: 'Colophon label',
      type: 'localizedString',
      group: 'colophon',
    }),
    defineField({
      name: 'colophonLinkText',
      title: 'Colophon link text',
      type: 'string',
      group: 'colophon',
    }),
    defineField({
      name: 'colophonUrl',
      title: 'Colophon URL',
      type: 'url',
      group: 'colophon',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings & About',
      };
    },
  },
});
