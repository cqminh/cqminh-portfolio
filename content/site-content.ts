import { SiteContent } from '@/types/content';

export const siteContent: SiteContent = {
  navbar: {
    resumeLabel: { en: 'Resume', vi: 'CV' },
  },

  about: {
    heading: { en: 'About Me', vi: 'Giới thiệu' },
    phoneCaption: {
      before: { en: 'This is my ', vi: 'Đây là ' },
      highlight: { en: 'phone', vi: 'điện thoại' },
      after: { en: '', vi: ' của tôi' },
    },
    phoneNumberCopiedLabel: { en: 'Number copied!', vi: 'Đã sao chép số!' },
  },

  projects: {
    viewProjectLabel: { en: 'View project', vi: 'Xem dự án' },
  },

  experience: {
    heading: { en: 'Experience', vi: 'Kinh nghiệm' },
    presentLabel: { en: 'Present', vi: 'Hiện tại' },
  },

  contact: {
    heading: { en: 'Get In Touch', vi: 'Liên hệ' },
    connectHeading: { en: "Let's Connect", vi: 'Kết nối với tôi' },
    avatar: '',
    flipHint: { en: 'Tap the card to flip', vi: 'Chạm vào thẻ để lật' },
    backHint: { en: 'Back to front', vi: 'Lật lại mặt trước' },
    emailLabel: { en: 'Email', vi: 'Email' },
    socialLabel: { en: 'Find me on', vi: 'Tìm tôi trên' },
  },

  footer: {
    // Not localized — copyright line always renders in English regardless
    // of the active language.
    copyright: `© ${new Date().getFullYear()} Châu Quang Minh. All rights reserved.`,
  },
};
