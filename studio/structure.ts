import type { StructureResolver } from 'sanity/structure';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Portfolio Content')
    .items([
      orderableDocumentListDeskItem({
        type: 'project',
        title: 'Projects',
        S,
        context,
      }),
      S.divider(),
      S.listItem()
        .title('Site Settings & About')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings & About')
        ),
      S.listItem()
        .title('Guest — Privacy Policy')
        .id('guestPrivacy')
        .child(
          S.document()
            .schemaType('guestPrivacy')
            .documentId('guestPrivacy')
            .title('Guest — Privacy Policy')
        ),
    ]);
