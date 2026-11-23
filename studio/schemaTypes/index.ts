import { guestPrivacy } from './guestPrivacy';
import {
  landingDiptychBlock,
  landingMediaBlock,
  landingTextBlock,
  landingTextItem,
} from './landingBlocks';
import { localizedString, localizedText } from './localized';
import { galleryDiptych, galleryImage, galleryVideo } from './media';
import { project } from './project';
import { siteSettings } from './siteSettings';

export const schemaTypes = [
  project,
  siteSettings,
  guestPrivacy,
  localizedString,
  localizedText,
  galleryImage,
  galleryVideo,
  galleryDiptych,
  landingTextItem,
  landingTextBlock,
  landingMediaBlock,
  landingDiptychBlock,
];
