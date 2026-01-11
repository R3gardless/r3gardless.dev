/**
 * About 페이지 관련 상수들
 */

/**
 * About Biography 섹션 데이터
 */
export const ABOUT_BIOGRAPHY = {
  name: 'YoungUk Song',
  position: 'Database Engineer',
  bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
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
      details: ['SystemConsultantGroup', 'TA & mentoring program', 'scholarship'],
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
        'Manage PostgreSQL Cluster truble shooting',
        'Develop PostgreSQL installation module, automation using Github Actions',
      ],
    },
    {
      id: 'kakao-database-eng',
      company: 'Kakao Corp',
      link: 'https://www.kakaocorp.com',
      position: 'Database Engineering',
      period: 'Jan 2024 ~ Mar 2024',
      description: [
        'Implement DDL adoptable sink connector with Java. (Debezium)',
        'Consider Kafka Topic could be empty and make DDL can be sync same time.',
      ],
    },
    {
      id: 'vldb-lab',
      company: 'VLDB Lab Research Intern',
      position: 'Lab intern',
      period: 'Jul 2023 ~ Jan 2024',
      type: 'research',
      description: [
        'Publish SQL MNIST paper at KDBC.',
        'Implement Machine Learning Algorithm using SQL which is tuning complete. Check performance comparsion with postgresql, numpy and HyPer.',
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
      description: '기여 내역 설명',
      githubUrl: 'https://github.com/pyodide/pyodide',
    },
    {
      id: 'enlistpedia',
      name: 'Enlistpedia',
      summary: 'Project',
      description: '대충 사용한 기술 스택 설명 및 역할 설명 수상 내용도 자랑하기',
      githubUrl: 'https://github.com/osamhack2021/WEB_Enlistpedia_Ajoupo',
    },
  ],
} as const;
