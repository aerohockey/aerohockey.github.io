import { defineArrayMember, defineField, defineType } from 'sanity';

export const galleryImage = defineType({
  name: 'galleryImage',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'localizedString',
    }),
  ],
  preview: {
    select: {
      media: 'image',
      en: 'alt.en',
      ru: 'alt.ru',
    },
    prepare({ media, en, ru }) {
      return {
        title: en || ru || 'Image',
        subtitle: ru && en ? ru : 'Photo',
        media,
      };
    },
  },
});

export const galleryVideo = defineType({
  name: 'galleryVideo',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({
      name: 'video',
      title: 'Video file (MP4 / WebM)',
      type: 'file',
      options: {
        accept: 'video/mp4,video/webm',
      },
    }),
    defineField({
      name: 'videoUrl',
      title: 'External video URL (optional fallback)',
      type: 'url',
    }),
    defineField({
      name: 'poster',
      title: 'Poster image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect ratio (width / height)',
      type: 'number',
      initialValue: 1.5,
      description: 'Examples: 0.8 (4:5), 1 (1:1), 1.5 (3:2), 1.7778 (16:9)',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt / accessible label',
      type: 'localizedString',
    }),
  ],
  preview: {
    select: {
      media: 'poster',
      en: 'alt.en',
      aspectRatio: 'aspectRatio',
    },
    prepare({ media, en, aspectRatio }) {
      return {
        title: en || 'Video',
        subtitle: `Video · ratio ${aspectRatio ?? 1.5}`,
        media,
      };
    },
  },
});

export const galleryDiptych = defineType({
  name: 'galleryDiptych',
  title: 'Diptych (2 frames side by side)',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Frames (exactly 2)',
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
        title: `Diptych: ${alt0 || 'Frame 1'} + ${alt1 || 'Frame 2'}`,
        subtitle: '2 frames side by side',
        media,
      };
    },
  },
});
