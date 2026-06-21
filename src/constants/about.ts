/**
 * About 페이지 관련 상수들
 */

/**
 * About Biography 섹션 데이터
 */
export const ABOUT_BIOGRAPHY = {
  name: 'YoungUk Song',
  position: 'Database Engineer',
  bio: 'I focus on database operations, PostgreSQL internals, and automation that makes repeated engineering work safer. This site is where I turn debugging notes, paper reviews, and system design lessons into durable writing.',
  profileImage: {
    src: '/images/profile.jpg', // 프로필 이미지 경로
    alt: 'YoungUk Song Profile',
    width: 144,
    height: 144,
  },
  social: [
    {
      icon: 'linkedin',
      href: 'https://www.linkedin.com/in/younguk-song-3b82801a0/',
      label: 'LinkedIn',
    },
    {
      icon: 'github',
      href: 'https://github.com/r3gardless',
      label: 'GitHub',
    },
    {
      icon: 'mail',
      href: 'mailto:pidaoh@g.skku.edu',
      label: 'Email',
    },
  ],
} as const;

/**
 * About Education 섹션 데이터
 */
export const ABOUT_EDUCATION = {
  title: 'Education',
  items: [
    {
      id: 'skku',
      icon: 'graduation-cap',
      institution: 'SungKyunKwan Univ.',
      link: 'https://www.skku.edu',
      degree: 'BS @ Computer Science and Engineering',
      period: 'Mar 2018 ~ Aug 2024',
      details: ['System Consultant Group', 'TA and mentoring program', 'Scholarship'],
    },
    {
      id: 'cnsh',
      icon: 'school',
      institution: 'Chungnam Science High School',
      period: 'Mar 2016 ~ Feb 2018',
    },
  ],
} as const;

/**
 * About Work Experience 섹션 데이터
 */
export const ABOUT_WORK_EXPERIENCE = {
  title: 'Work Experience',
  items: [
    {
      id: 'kakao-distributed-db',
      company: 'Kakao Corp',
      link: 'https://www.kakaocorp.com',
      position: 'Distributed Database',
      period: 'Aug 2024 ~ Present',
      description: [
        'Operate and troubleshoot PostgreSQL clusters.',
        'Develop PostgreSQL installation modules and GitHub Actions based automation.',
      ],
    },
    {
      id: 'kakao-database-eng',
      company: 'Kakao Corp',
      link: 'https://www.kakaocorp.com',
      position: 'Database Engineering',
      period: 'Jan 2024 ~ Mar 2024',
      description: [
        'Implemented a DDL-aware sink connector in Java with Debezium.',
        'Handled empty Kafka topics while keeping DDL synchronization consistent.',
      ],
    },
    {
      id: 'vldb-lab',
      company: 'VLDB Lab Research Intern',
      position: 'Lab intern',
      period: 'Jul 2023 ~ Jan 2024',
      type: 'research',
      description: [
        'Published an SQL MNIST paper at KDBC.',
        'Implemented machine learning algorithms in SQL and compared performance with PostgreSQL, NumPy, and HyPer.',
      ],
    },
  ],
} as const;

/**
 * About Projects 섹션 데이터
 */
export const ABOUT_PROJECTS = {
  title: 'Project',
  items: [
    {
      id: 'pyodide',
      name: 'Pyodide',
      summary: 'Opensource Contribution',
      description: 'Contributed to Python-in-the-browser runtime behavior and documentation.',
      githubUrl: 'https://github.com/pyodide/pyodide',
    },
    {
      id: 'enlistpedia',
      name: 'Enlistpedia',
      summary: 'Project',
      description: 'Built a military service information platform during the OSAM Hackathon.',
      githubUrl: 'https://github.com/osamhack2021/WEB_Enlistpedia_Ajoupo',
    },
  ],
} as const;
