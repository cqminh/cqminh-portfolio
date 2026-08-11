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
    items: [
      {
        id: 'exp-senior-developer',
        title: { en: 'Senior Developer', vi: 'Lập trình viên Cấp cao' },
        company: 'Tech Company Inc.',
        startYear: 2023,
        endYear: null,
        description: {
          en: 'Led development of customer-facing applications, mentored junior developers, and improved system performance.',
          vi: 'Dẫn dắt phát triển các ứng dụng hướng tới khách hàng, hướng dẫn lập trình viên junior, và cải thiện hiệu năng hệ thống.',
        },
        image: '/picture_5.jpg',
        color: 'blue',
      },
      {
        id: 'exp-fullstack-developer',
        title: { en: 'Full Stack Developer', vi: 'Lập trình viên Full Stack' },
        company: 'Digital Solutions Ltd.',
        startYear: 2021,
        endYear: 2023,
        description: {
          en: 'Developed and maintained multiple web applications using React and Node.js, implemented CI/CD pipelines.',
          vi: 'Phát triển và bảo trì nhiều ứng dụng web bằng React và Node.js, triển khai CI/CD pipeline.',
        },
        image: '/picture_4.jpg',
        color: 'purple',
      },
      {
        id: 'exp-junior-developer',
        title: { en: 'Junior Developer', vi: 'Lập trình viên Junior' },
        company: 'StartUp Studio',
        startYear: 2020,
        endYear: 2021,
        description: {
          en: 'Built responsive web interfaces, fixed bugs, and contributed to backend services development.',
          vi: 'Xây dựng giao diện web responsive, sửa lỗi, và đóng góp phát triển các dịch vụ backend.',
        },
        image: '/picture_3.jpg',
        color: 'green',
      },
    ],
  },

  contact: {
    heading: { en: 'Get In Touch', vi: 'Liên hệ' },
    connectHeading: { en: "Let's Connect", vi: 'Kết nối với tôi' },
    avatar: '',
    intro: {
      en: "I'm always interested in hearing about new projects and opportunities. Feel free to reach out if you have any questions or just want to say hello!",
      vi: 'Tôi luôn hào hứng lắng nghe về các dự án và cơ hội mới. Đừng ngần ngại liên hệ nếu bạn có câu hỏi hoặc chỉ đơn giản muốn chào hỏi!',
    },
    flipHint: { en: 'Tap the card to flip', vi: 'Chạm vào thẻ để lật' },
    backHint: { en: 'Back to front', vi: 'Lật lại mặt trước' },
    emailLabel: { en: 'Email', vi: 'Email' },
    email: 'cqminh.it@gmail.com',
    socialLabel: { en: 'Find me on', vi: 'Tìm tôi trên' },
  },

  footer: {
    // Not localized — copyright line always renders in English regardless
    // of the active language.
    copyright: `© ${new Date().getFullYear()} Châu Quang Minh. All rights reserved.`,
  },
};
