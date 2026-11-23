import { defineArrayMember, defineField, defineType } from 'sanity';

export const landingTextItem = defineType({
  name: 'landingTextItem',
  title: 'Text item',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading (optional)',
      type: 'localizedString',
    }),
    defineField({
      name: 'paragraphs',
      title: 'Paragraphs',
      type: 'array',
      of: [defineArrayMember({ type: 'localizedText' })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'linkLabel',
      title: 'Link label (optional)',
      type: 'localizedString',
    }),
    defineField({
      name: 'linkHref',
      title: 'Link path or URL (optional)',
      type: 'string',
      description: 'Use /work/guest/privacy/ for internal links (auto-localized for RU) or a full https:// URL.',
    }),
  ],
  preview: {
    select: {
      heading: 'heading.en',
      firstParagraph: 'paragraphs.0.en',
    },
    prepare({ heading, firstParagraph }) {
      return {
        title: heading || firstParagraph || 'Text item',
        subtitle: heading && firstParagraph ? firstParagraph : 'Text subsection',
      };
    },
  },
});

export const landingTextBlock = defineType({
  name: 'landingTextBlock',
  title: 'Text section',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Subsections (1 for standard section, 2+ to stack closely)',
      type: 'array',
      of: [defineArrayMember({ type: 'landingTextItem' })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title0: 'items.0.heading.en',
      title1: 'items.1.heading.en',
      p0: 'items.0.paragraphs.0.en',
    },
    prepare({ title0, title1, p0 }) {
      const headings = [title0, title1].filter(Boolean).join(' + ');
      return {
        title: headings || p0 || 'Text section',
        subtitle: headings ? p0 || 'Text section' : 'Paragraphs',
      };
    },
  },
});

export const landingMediaBlock = defineType({
  name: 'landingMediaBlock',
  title: 'Media block (Image or Video)',
  type: 'object',
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Media type',
      type: 'string',
      initialValue: 'image',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) => parent?.mediaType === 'video',
    }),
    defineField({
      name: 'video',
      title: 'Video file (MP4 / WebM)',
      type: 'file',
      options: {
        accept: 'video/mp4,video/webm',
      },
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'poster',
      title: 'Poster image',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Video aspect ratio (width / height)',
      type: 'number',
      initialValue: 1.5,
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'localizedString',
    }),
    defineField({
      name: 'width',
      title: 'Width',
      type: 'string',
      initialValue: 'column',
      options: {
        list: [
          { title: 'Phone / Compact (480px / 540px)', value: 'phone' },
          { title: 'Text column (640px / 700px)', value: 'column' },
          { title: 'Wide (880px)', value: 'wide' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'spacingPreset',
      title: 'Optical spacing preset',
      type: 'string',
      initialValue: 'default',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Full phone trim (-7.2% top / -6.67% bottom)', value: 'phoneTrim' },
          { title: 'Top-heavy lockscreen spacing', value: 'topHeavy' },
          { title: 'Bottom-heavy widget spacing', value: 'bottomHeavy' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      media: 'image',
      poster: 'poster',
      mediaType: 'mediaType',
      width: 'width',
      alt: 'alt.en',
    },
    prepare({ media, poster, mediaType, width, alt }) {
      return {
        title: alt || (mediaType === 'video' ? 'Video block' : 'Image block'),
        subtitle: `${mediaType || 'image'} · width: ${width || 'column'}`,
        media: media || poster,
      };
    },
  },
});

export const landingDiptychBlock = defineType({
  name: 'landingDiptychBlock',
  title: 'Diptych block (2 media side by side)',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Items (exactly 2)',
      type: 'array',
      of: [
        defineArrayMember({ type: 'galleryImage' }),
        defineArrayMember({ type: 'galleryVideo' }),
      ],
      validation: (Rule) => Rule.required().length(2),
    }),
  ],
  preview: {
    select: {
      media: 'items.0.image',
      alt0: 'items.0.alt.en',
      alt1: 'items.1.alt.en',
    },
    prepare({ media, alt0, alt1 }) {
      return {
        title: `Diptych: ${alt0 || 'Left'} + ${alt1 || 'Right'}`,
        subtitle: '2 frames side by side',
        media,
      };
    },
  },
});
