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
    quotes: [
      {
        id: 'placeholder-1',
        content: { en: 'Placeholder quote text.', vi: 'Nội dung quote placeholder.' },
        author: 'Placeholder Author',
      },
    ],
  },

  projects: {
    heading: { en: 'Featured Projects', vi: 'Dự án nổi bật' },
    items: [
      {
        id: 'project-one',
        title: { en: 'Project One', vi: 'Dự án Một' },
        description: {
          en: 'A full-stack web application built with Next.js and PostgreSQL',
          vi: 'Ứng dụng web full-stack được xây dựng với Next.js và PostgreSQL',
        },
        tags: ['Next.js', 'React', 'TypeScript', 'PostgreSQL'],
        link: '#',
      },
      {
        id: 'project-two',
        title: { en: 'Project Two', vi: 'Dự án Hai' },
        description: {
          en: 'Real-time collaboration tool with WebSocket integration',
          vi: 'Công cụ cộng tác thời gian thực tích hợp WebSocket',
        },
        tags: ['Node.js', 'WebSocket', 'React', 'MongoDB'],
        link: '#',
      },
      {
        id: 'project-three',
        title: { en: 'Project Three', vi: 'Dự án Ba' },
        description: {
          en: 'Mobile-responsive dashboard for data visualization',
          vi: 'Dashboard trực quan hóa dữ liệu, tối ưu cho di động',
        },
        tags: ['React', 'Chart.js', 'Tailwind', 'API Integration'],
        link: '#',
      },
      {
        id: 'project-four',
        title: { en: 'Project Four', vi: 'Dự án Bốn' },
        description: {
          en: 'E-commerce platform with payment integration',
          vi: 'Nền tảng thương mại điện tử tích hợp thanh toán',
        },
        tags: ['Next.js', 'Stripe', 'Express', 'MySQL'],
        link: '#',
      },
    ],
  },

  experience: {
    heading: { en: 'Experience', vi: 'Kinh nghiệm' },
    items: [
      {
        id: 'exp-senior-developer',
        title: { en: 'Senior Developer', vi: 'Lập trình viên Cấp cao' },
        company: 'Tech Company Inc.',
        period: { en: '2023 - Present', vi: '2023 - Hiện tại' },
        description: {
          en: 'Led development of customer-facing applications, mentored junior developers, and improved system performance.',
          vi: 'Dẫn dắt phát triển các ứng dụng hướng tới khách hàng, hướng dẫn lập trình viên junior, và cải thiện hiệu năng hệ thống.',
        },
      },
      {
        id: 'exp-fullstack-developer',
        title: { en: 'Full Stack Developer', vi: 'Lập trình viên Full Stack' },
        company: 'Digital Solutions Ltd.',
        period: { en: '2021 - 2023', vi: '2021 - 2023' },
        description: {
          en: 'Developed and maintained multiple web applications using React and Node.js, implemented CI/CD pipelines.',
          vi: 'Phát triển và bảo trì nhiều ứng dụng web bằng React và Node.js, triển khai CI/CD pipeline.',
        },
      },
      {
        id: 'exp-junior-developer',
        title: { en: 'Junior Developer', vi: 'Lập trình viên Junior' },
        company: 'StartUp Studio',
        period: { en: '2020 - 2021', vi: '2020 - 2021' },
        description: {
          en: 'Built responsive web interfaces, fixed bugs, and contributed to backend services development.',
          vi: 'Xây dựng giao diện web responsive, sửa lỗi, và đóng góp phát triển các dịch vụ backend.',
        },
      },
    ],
  },

  contact: {
    heading: { en: 'Get In Touch', vi: 'Liên hệ' },
    connectHeading: { en: "Let's Connect", vi: 'Kết nối với tôi' },
    intro: {
      en: "I'm always interested in hearing about new projects and opportunities. Feel free to reach out if you have any questions or just want to say hello!",
      vi: 'Tôi luôn hào hứng lắng nghe về các dự án và cơ hội mới. Đừng ngần ngại liên hệ nếu bạn có câu hỏi hoặc chỉ đơn giản muốn chào hỏi!',
    },
    emailLabel: { en: 'Email', vi: 'Email' },
    email: 'cqminh.it@gmail.com',
    socialLabel: { en: 'Social Media', vi: 'Mạng xã hội' },
    socialLinks: [
      { label: 'GitHub', href: '#' },
      { label: 'LinkedIn', href: '#' },
      { label: 'Twitter', href: '#' },
    ],
    form: {
      nameLabel: { en: 'Name', vi: 'Họ tên' },
      namePlaceholder: { en: 'Your name', vi: 'Tên của bạn' },
      emailLabel: { en: 'Email', vi: 'Email' },
      emailPlaceholder: { en: 'your.email@example.com', vi: 'email.cua.ban@example.com' },
      emailInvalid: { en: 'Please enter a valid email address', vi: 'Vui lòng nhập địa chỉ email hợp lệ' },
      messageLabel: { en: 'Message', vi: 'Lời nhắn' },
      messagePlaceholder: { en: 'Your message here...', vi: 'Nội dung tin nhắn...' },
      submitLabel: { en: 'Send Message', vi: 'Gửi tin nhắn' },
      submittingLabel: { en: 'Sending...', vi: 'Đang gửi...' },
      successMessage: { en: 'Message sent successfully!', vi: 'Gửi tin nhắn thành công!' },
      errorMessage: { en: 'Failed to send message. Please try again.', vi: 'Gửi tin nhắn thất bại. Vui lòng thử lại.' },
    },
  },
};
