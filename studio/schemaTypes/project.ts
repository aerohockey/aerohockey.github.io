import { defineArrayMember, defineField, defineType } from 'sanity';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';

export const project = defineType({
  name: 'project',
  title: 'Projects',
  type: 'document',
  orderings: [orderRankOrdering],
  groups: [
    { name: 'general', title: 'General & Card', default: true },
    { name: 'gallery', title: 'Gallery' },
    { name: 'landing', title: 'Landing Page' },
  ],
  fields: [
    orderRankField({ type: 'project' }),
    defineField({
      name: 'hidden',
      title: 'Hide from site',
      description:
        'When enabled, this project stays in Studio and will not appear on the live site or its URL.',
      type: 'boolean',
      group: 'general',
      initialValue: false,
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'general',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'format',
      title: 'Page format',
      type: 'string',
      group: 'general',
      initialValue: 'gallery',
      options: {
        list: [
          { title: 'Horizontal / Editorial Gallery', value: 'gallery' },
          { title: 'Vertical Landing Page', value: 'landing' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localizedString',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'localizedString',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'localizedString',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'localizedString',
      group: 'general',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'client',
      title: 'Client (optional)',
      type: 'localizedString',
      group: 'general',
    }),
    defineField({
      name: 'status',
      title: 'Status (optional, e.g. Coming soon · iOS)',
      type: 'localizedString',
      group: 'general',
    }),
    defineField({
      name: 'appStoreUrl',
      title: 'App Store URL (optional)',
      type: 'url',
      group: 'general',
    }),
    defineField({
      name: 'cover',
      title: 'Cover image',
      type: 'image',
      group: 'general',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverAlt',
      title: 'Cover alt text',
      type: 'localizedString',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverAspect',
      title: 'Cover aspect ratio',
      type: 'string',
      group: 'general',
      initialValue: '4/5',
      options: {
        list: [
          { title: '3:4 (Portrait)', value: '3/4' },
          { title: '4:5 (Portrait)', value: '4/5' },
          { title: '1:1 (Square)', value: '1/1' },
          { title: '5:4 (Landscape)', value: '5/4' },
          { title: '4:3 (Landscape)', value: '4/3' },
          { title: '3:2 (Landscape)', value: '3/2' },
          { title: '16:9 (Widescreen)', value: '16/9' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverVideo',
      title: 'Cover video loop (optional)',
      type: 'object',
      group: 'general',
      fields: [
        defineField({
          name: 'file',
          title: 'Video file (MP4 / WebM)',
          type: 'file',
          options: {
            accept: 'video/mp4,video/webm',
          },
        }),
        defineField({
          name: 'videoUrl',
          title: 'External video URL (optional)',
          type: 'url',
        }),
        defineField({
          name: 'poster',
          title: 'Poster image (falls back to cover if empty)',
          type: 'image',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
    defineField({
      name: 'intro',
      title: 'Project intro (gallery description & SEO fallback)',
      type: 'localizedText',
      group: 'gallery',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery frames',
      type: 'array',
      group: 'gallery',
      hidden: ({ document }) => document?.format !== 'gallery',
      of: [
        defineArrayMember({ type: 'galleryImage' }),
        defineArrayMember({ type: 'galleryVideo' }),
        defineArrayMember({ type: 'galleryDiptych' }),
      ],
    }),
    defineField({
      name: 'landingHeadline',
      title: 'Landing headline (defaults to title if empty)',
      type: 'localizedString',
      group: 'landing',
      hidden: ({ document }) => document?.format !== 'landing',
    }),
    defineField({
      name: 'landingLeadParagraphs',
      title: 'Hero lead paragraphs',
      type: 'array',
      group: 'landing',
      hidden: ({ document }) => document?.format !== 'landing',
      of: [defineArrayMember({ type: 'localizedText' })],
    }),
    defineField({
      name: 'landingBlocks',
      title: 'Landing page blocks',
      type: 'array',
      group: 'landing',
      hidden: ({ document }) => document?.format !== 'landing',
      of: [
        defineArrayMember({ type: 'landingTextBlock' }),
        defineArrayMember({ type: 'landingMediaBlock' }),
        defineArrayMember({ type: 'landingDiptychBlock' }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      format: 'format',
      aspect: 'coverAspect',
      hidden: 'hidden',
      media: 'cover',
    },
    prepare({ title, format, aspect, hidden, media }) {
      const prefix = hidden ? 'Hidden · ' : '';
      return {
        title: title || 'Untitled project',
        subtitle: `${prefix}${format || 'gallery'} · ${aspect || '4/5'}`,
        media,
      };
    },
  },
});
