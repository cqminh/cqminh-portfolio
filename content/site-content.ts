import { SiteContent } from '@/types/content';

export const siteContent: SiteContent = {
  navbar: {
    resumeLabel: { en: 'Resume', vi: 'CV' },
  },

  hero: {
    greeting: { en: "Hi, I'm", vi: 'Xin chào, tôi là' },
    name: 'Châu Quang Minh',
    title: {
      en: 'Full Stack Developer | Creative Problem Solver',
      vi: 'Full Stack Developer | Người giải quyết vấn đề sáng tạo',
    },
    description: {
      en: 'I build beautiful, performant web applications that solve real problems. Passionate about clean code, user experience, and continuous learning.',
      vi: 'Tôi xây dựng những ứng dụng web đẹp, hiệu năng cao để giải quyết các vấn đề thực tế. Đam mê code sạch, trải nghiệm người dùng và học hỏi không ngừng.',
    },
    ctaPrimary: { en: 'View My Work', vi: 'Xem dự án của tôi' },
    ctaSecondary: { en: 'Get In Touch', vi: 'Liên hệ với tôi' },
  },

  about: {
    heading: { en: 'About Me', vi: 'Giới thiệu' },
    paragraphs: [
      {
        en: "I'm a passionate full-stack developer with a love for creating elegant solutions to complex problems. With expertise in modern web technologies, I've helped businesses transform their digital presence.",
        vi: 'Tôi là một full-stack developer đam mê tạo ra những giải pháp tinh gọn cho các vấn đề phức tạp. Với kinh nghiệm về các công nghệ web hiện đại, tôi đã giúp nhiều doanh nghiệp chuyển đổi số hiệu quả hơn.',
      },
      {
        en: "When I'm not coding, you'll find me exploring new technologies, contributing to open source, or sharing knowledge with the developer community.",
        vi: 'Khi không code, tôi thường tìm hiểu công nghệ mới, đóng góp cho các dự án mã nguồn mở, hoặc chia sẻ kiến thức với cộng đồng lập trình viên.',
      },
      {
        en: 'My goal is to build products that are not only functional but also delightful to use.',
        vi: 'Mục tiêu của tôi là xây dựng những sản phẩm không chỉ hoạt động tốt mà còn mang lại trải nghiệm thú vị khi sử dụng.',
      },
    ],
    skillsHeading: { en: 'Skills & Technologies', vi: 'Kỹ năng & Công nghệ' },
    skills: [
      'JavaScript/TypeScript',
      'React & Next.js',
      'Node.js & Express',
      'Database Design',
      'Tailwind CSS',
      'Git & DevOps',
      'REST APIs',
      'Responsive Design',
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
    email: 'hello@example.com',
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
