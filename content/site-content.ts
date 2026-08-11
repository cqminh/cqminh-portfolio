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

  // Shared badge catalog — projects reference these by id in `language`
  // instead of typing tech names/colors by hand per project.
  technologies: [
    { id: 'nextjs', name: 'Next.js', color: '#000000' },
    { id: 'react', name: 'React', color: '#61DAFB' },
    { id: 'react-native', name: 'React Native', color: '#61DAFB' },
    { id: 'flutter', name: 'Flutter', color: '#02569B' },
    { id: 'typescript', name: 'TypeScript', color: '#3178C6' },
    { id: 'javascript', name: 'JavaScript', color: '#F7DF1E' },
    { id: 'nodejs', name: 'Node.js', color: '#339933' },
    { id: 'express', name: 'Express', color: '#000000' },
    { id: 'postgresql', name: 'PostgreSQL', color: '#4169E1' },
    { id: 'mysql', name: 'MySQL', color: '#4479A1' },
    { id: 'mongodb', name: 'MongoDB', color: '#47A248' },
    { id: 'websocket', name: 'WebSocket', color: '#FF6B6B' },
    { id: 'chartjs', name: 'Chart.js', color: '#FF6384' },
    { id: 'tailwind', name: 'Tailwind CSS', color: '#06B6D4' },
    { id: 'stripe', name: 'Stripe', color: '#635BFF' },
    { id: 'rest-api', name: 'REST API', color: '#8B5CF6' },
  ],

  projects: {
    viewProjectLabel: { en: 'View project', vi: 'Xem dự án' },
    items: [
      {
        id: 'project-one',
        name: { en: 'Project One', vi: 'Dự án Một' },
        time: { en: '2023 - Present', vi: '2023 - Hiện tại' },
        description: {
          en: 'A full-stack web application built with Next.js and PostgreSQL',
          vi: 'Ứng dụng web full-stack được xây dựng với Next.js và PostgreSQL',
        },
        position: { en: 'Full Stack Developer', vi: 'Lập trình viên Full Stack' },
        language: ['nextjs', 'react', 'typescript', 'postgresql'],
        contactImage: '/picture_1.png',
        githubLink: '#',
        projectLink: '#',
      },
      {
        id: 'project-two',
        name: { en: 'Project Two', vi: 'Dự án Hai' },
        time: { en: '2022 - 2023', vi: '2022 - 2023' },
        description: {
          en: 'Real-time collaboration tool with WebSocket integration',
          vi: 'Công cụ cộng tác thời gian thực tích hợp WebSocket',
        },
        position: { en: 'Backend Developer', vi: 'Lập trình viên Backend' },
        language: ['nodejs', 'websocket', 'react', 'mongodb'],
        contactImage: '',
        githubLink: '#',
      },
      {
        id: 'project-three',
        name: { en: 'Project Three', vi: 'Dự án Ba' },
        time: { en: '2022', vi: '2022' },
        description: {
          en: 'Mobile-responsive dashboard for data visualization',
          vi: 'Dashboard trực quan hóa dữ liệu, tối ưu cho di động',
        },
        position: { en: 'Frontend Developer', vi: 'Lập trình viên Frontend' },
        language: ['react', 'chartjs', 'tailwind', 'rest-api'],
        contactImage: '/picture_3.jpg',
        projectLink: '#',
      },
      {
        id: 'project-four',
        name: { en: 'Project Four', vi: 'Dự án Bốn' },
        time: { en: '2021 - 2022', vi: '2021 - 2022' },
        description: {
          en: 'E-commerce platform with payment integration',
          vi: 'Nền tảng thương mại điện tử tích hợp thanh toán',
        },
        position: { en: 'Full Stack Developer', vi: 'Lập trình viên Full Stack' },
        language: ['nextjs', 'stripe', 'express', 'mysql'],
        contactImage: '/picture_5.jpg',
      },
      {
        id: 'project-five',
        name: { en: 'Project Five', vi: 'Dự án Năm' },
        time: { en: '2021', vi: '2021' },
        description: {
          en: 'Cross-platform mobile app for habit tracking',
          vi: 'Ứng dụng di động đa nền tảng theo dõi thói quen',
        },
        position: { en: 'Mobile Developer', vi: 'Lập trình viên Mobile' },
        language: ['flutter', 'rest-api'],
        contactImage: '/picture_2.png',
        githubLink: '#',
      },
      {
        id: 'project-six',
        name: { en: 'Project Six', vi: 'Dự án Sáu' },
        time: { en: '2020 - 2021', vi: '2020 - 2021' },
        description: {
          en: 'Internal admin dashboard for inventory management',
          vi: 'Dashboard quản trị nội bộ cho quản lý kho hàng',
        },
        position: { en: 'Frontend Developer', vi: 'Lập trình viên Frontend' },
        language: ['react', 'typescript', 'tailwind'],
        contactImage: '',
        projectLink: '#',
      },
      {
        id: 'project-seven',
        name: { en: 'Project Seven', vi: 'Dự án Bảy' },
        time: { en: '2020', vi: '2020' },
        description: {
          en: 'Portfolio site generator with markdown-based content',
          vi: 'Công cụ tạo trang portfolio với nội dung dạng markdown',
        },
        position: { en: 'Full Stack Developer', vi: 'Lập trình viên Full Stack' },
        language: ['nextjs', 'javascript'],
        contactImage: '/picture_4.jpg',
        githubLink: '#',
        projectLink: '#',
      },
    ],
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
