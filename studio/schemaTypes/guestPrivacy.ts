import { defineArrayMember, defineField, defineType } from 'sanity';

export const guestPrivacy = defineType({
  name: 'guestPrivacy',
  title: 'Guest — Privacy Policy',
  type: 'document',
  fields: [
    defineField({
      name: 'backLabel',
      title: 'Back link label',
      type: 'localizedString',
    }),
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'localizedString',
    }),
    defineField({
      name: 'updated',
      title: 'Last updated subtitle',
      type: 'localizedString',
    }),
    defineField({
      name: 'intro',
      title: 'Intro paragraph',
      type: 'localizedText',
    }),
    defineField({
      name: 'sections',
      title: 'Policy sections',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'localizedString',
            }),
            defineField({
              name: 'text',
              title: 'Body text',
              type: 'localizedText',
            }),
            defineField({
              name: 'appendContactEmail',
              title: 'Append clickable contact email at end of paragraph',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'heading.en',
              subtitle: 'text.en',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Guest — Privacy Policy',
      };
    },
  },
});
