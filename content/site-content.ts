import { SiteContent } from '@/types/content';

export const siteContent: SiteContent = {
  loadingScreen: {
    // Staged by progress: [0] 0-50%, [1] 50-85%, [2] 85-100%
    messages: [
      { en: 'Building APK...', vi: 'Đang build APK...' },
      { en: 'Testing 47 screens...', vi: 'Test 47 màn hình...' },
      { en: 'Faster than App Store review', vi: 'Nhanh hơn duyệt App Store' },
    ],
  },

  navbar: {
    resumeLabel: { en: 'Resume', vi: 'CV' },
  },

  hero: {
    titles: ['Mobile Developer', 'Flutter Developer', 'React Native Developer'],
    sliderImages: ['/picture_1.png', '/picture_2.png', '/picture_3.jpg', '/picture_4.jpg', '/picture_5.jpg'],
  },

  about: {
    heading: { en: 'About Me', vi: 'Giới thiệu' },
    intro: [
      {
        en: 'Mobile developer focused on building smooth, native-feeling apps with Flutter and React Native — from first line of code to App Store release.',
        vi: 'Lập trình viên mobile, tập trung xây dựng ứng dụng mượt mà, cảm giác native với Flutter và React Native — từ dòng code đầu tiên đến khi lên App Store.',
      },
    ],
    phoneCaption: {
      before: { en: 'This is my ', vi: 'Đây là ' },
      highlight: { en: 'phone', vi: 'điện thoại' },
      after: { en: '', vi: ' của tôi' },
    },
    // `icon: ''` renders a lettered placeholder tile until real artwork is
    // swapped in — still true for the group children below.
    phoneApps: [
      { type: 'app', id: 'phone', label: { en: 'Phone', vi: 'Điện thoại' }, icon: '/phone_icon.webp', href: 'tel:+84869934393' },
      { type: 'app', id: 'map', label: { en: 'Map', vi: 'Bản đồ' }, icon: '/map_icon.webp', href: 'https://maps.app.goo.gl/eKWkurCACrFLq9P96' },
      { type: 'app', id: 'linkedin', label: { en: 'LinkedIn', vi: 'LinkedIn' }, icon: '/linkedin_icon.webp', href: 'https://www.linkedin.com/in/cqminh/' },
      { type: 'app', id: 'github', label: { en: 'GitHub', vi: 'GitHub' }, icon: '/github_icon.webp', href: 'https://github.com/cqminh' },
      { type: 'app', id: 'gmail', label: { en: 'Gmail', vi: 'Gmail' }, icon: '/gmail_icon.webp', href: 'mailto:cqminh.it@gmail.com' },
      { type: 'app', id: 'facebook', label: { en: 'Facebook', vi: 'Facebook' }, icon: '/facebook_icon.webp', href: 'https://www.facebook.com/chau.quang.minh.963855/' },
      { type: 'app', id: 'tiktok', label: { en: 'TikTok', vi: 'TikTok' }, icon: '/tiktok_icon.webp', href: 'https://www.tiktok.com/@markydayoi' },
      {
        type: 'group',
        id: 'languages',
        label: { en: 'Languages', vi: 'Ngôn ngữ' },
        children: [
          { id: 'javascript', label: { en: 'JavaScript', vi: 'JavaScript' }, icon: '/javascript_icon.webp' },
          { id: 'typescript', label: { en: 'TypeScript', vi: 'TypeScript' }, icon: '' },
          { id: 'python', label: { en: 'Python', vi: 'Python' }, icon: '' },
          { id: 'dart', label: { en: 'Dart', vi: 'Dart' }, icon: '' },
        ],
      },
      {
        type: 'group',
        id: 'frameworks',
        label: { en: 'Frameworks', vi: 'Framework' },
        children: [
          { id: 'react-native', label: { en: 'React Native', vi: 'React Native' }, icon: '' },
          { id: 'expo', label: { en: 'Expo', vi: 'Expo' }, icon: '' },
          { id: 'flutter', label: { en: 'Flutter', vi: 'Flutter' }, icon: '' },
          { id: 'nextjs', label: { en: 'Next.js', vi: 'Next.js' }, icon: '' },
          { id: 'nodejs', label: { en: 'Node.js', vi: 'Node.js' }, icon: '' },
          { id: 'react', label: { en: 'React', vi: 'React' }, icon: '' },
        ],
      },
      {
        type: 'group',
        id: 'database',
        label: { en: 'Database', vi: 'Cơ sở dữ liệu' },
        children: [
          { id: 'postgresql', label: { en: 'PostgreSQL', vi: 'PostgreSQL' }, icon: '' },
          { id: 'mongodb', label: { en: 'MongoDB', vi: 'MongoDB' }, icon: '' },
        ],
      },
      {
        type: 'group',
        id: 'tools',
        label: { en: 'Tools & DevOps', vi: 'Công cụ & DevOps' },
        children: [
          { id: 'git', label: { en: 'Git', vi: 'Git' }, icon: '' },
          { id: 'docker', label: { en: 'Docker', vi: 'Docker' }, icon: '' },
          { id: 'postman', label: { en: 'Postman', vi: 'Postman' }, icon: '' },
          { id: 'figma', label: { en: 'Figma', vi: 'Figma' }, icon: '' },
          { id: 'vscode', label: { en: 'VS Code', vi: 'VS Code' }, icon: '' },
          { id: 'github-actions', label: { en: 'GitHub Actions', vi: 'GitHub Actions' }, icon: '' },
        ],
      },
      {
        type: 'group',
        id: 'state-management',
        label: { en: 'State Management', vi: 'Quản lý State' },
        children: [
          { id: 'redux', label: { en: 'Redux', vi: 'Redux' }, icon: '' },
          { id: 'getx', label: { en: 'GetX', vi: 'GetX' }, icon: '' },
        ],
      },
      {
        type: 'group',
        id: 'backend-cloud',
        label: { en: 'Backend & Cloud', vi: 'Backend & Cloud' },
        children: [{ id: 'rest-api', label: { en: 'REST API', vi: 'REST API' }, icon: '' }],
      },
    ],
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
