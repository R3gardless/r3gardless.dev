import type { Meta, StoryObj } from '@storybook/react-vite';

import { BlogPostCard } from './BlogPostCard';

const meta: Meta<typeof BlogPostCard> = {
  title: 'Components/Molecules/BlogPostCard',
  component: BlogPostCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '블로그 포스트의 썸네일, 제목, 설명, 날짜, 태그를 표시하는 카드형 컴포넌트입니다.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: '블로그 포스트 제목',
    },
    description: {
      control: 'text',
      description: '블로그 포스트 설명',
    },
    date: {
      control: 'text',
      description: '게시 날짜',
    },
    tags: {
      control: 'object',
      description: '태그 목록',
    },
    imageUrl: {
      control: 'text',
      description: '썸네일 이미지 URL',
    },
    imageAlt: {
      control: 'text',
      description: '이미지 alt 텍스트',
    },
    theme: {
      control: 'radio',
      options: ['light', 'dark'],
      description: '테마 모드',
    },
    onClick: {
      action: 'clicked',
      description: '클릭 이벤트 핸들러',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
    postId: {
      control: 'text',
      description: '포스트 ID (라우팅용)',
    },
    category: {
      control: 'text',
      description: '카테고리',
    },
    label: {
      control: 'object',
      description: '라벨 정보',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    title: 'Next.js 14의 새로운 기능들',
    description:
      'Next.js 14에서 추가된 새로운 기능들과 성능 개선사항들을 살펴보고, 실제 프로젝트에 어떻게 적용할 수 있는지 알아봅시다.',
    date: 'Jan 22, 2025',
    tags: ['Next.js', 'React', 'JavaScript'],
    imageUrl: 'https://picsum.photos/380/200?random=1',
    theme: 'light',
    postId: 'nextjs-14-features',
    category: 'Frontend',
    label: {
      text: '데이터베이스',
      color: 'blue',
    },
  },
};

// 다크 테마
export const Dark: Story = {
  args: {
    ...Default.args,
    theme: 'dark',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#08031b' },
        { name: 'light', value: '#fafaf8' },
      ],
    },
  },
};

// 클릭 가능한 카드
export const Clickable: Story = {
  args: {
    ...Default.args,
    onClick: () => {
      console.log('Card clicked');
    } /* 카드 클릭 시 실행되는 핸들러 함수 */,
  },
};

// 이미지 없는 카드
export const WithoutImage: Story = {
  args: {
    title: 'TypeScript 고급 기법들',
    description:
      'TypeScript의 고급 타입 시스템을 활용한 더 안전하고 표현력 있는 코드 작성법을 알아봅시다.',
    date: 'Jan 20, 2025',
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    theme: 'light',
    postId: 'typescript-advanced',
    category: 'Programming',
    label: {
      text: '프로그래밍',
      color: 'green',
    },
  },
};

// 다양한 라벨 색상
export const LabelColors: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="p-6">
      {/* 그리드 컨테이너에서 items-start 추가하여 각 카드가 내용만큼의 높이를 가지도록 설정 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto items-start justify-items-center">
        {[
          { color: 'gray', text: '일반' },
          { color: 'brown', text: '블로그' },
          { color: 'orange', text: '튜토리얼' },
          { color: 'yellow', text: '팁' },
          { color: 'green', text: '개발' },
          { color: 'blue', text: '데이터베이스' },
          { color: 'purple', text: '디자인' },
          { color: 'pink', text: '창작' },
          { color: 'red', text: '중요' },
        ].map((labelInfo, index) => (
          <BlogPostCard
            key={labelInfo.color}
            title={`${labelInfo.text} 카테고리 포스트`}
            description={`${labelInfo.text} 카테고리에 해당하는 블로그 포스트입니다. 설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명`}
            date="Jan 22, 2025"
            tags={[labelInfo.text, 'Example']}
            imageUrl={`https://picsum.photos/1600/800?random=${index + 2}`}
            theme="light"
            label={{
              text: labelInfo.text,
              color: labelInfo.color as
                | 'gray'
                | 'brown'
                | 'orange'
                | 'yellow'
                | 'green'
                | 'blue'
                | 'purple'
                | 'pink'
                | 'red',
            }}
          />
        ))}
      </div>
    </div>
  ),
};

// 많은 태그
export const ManyTags: Story = {
  args: {
    ...Default.args,
    imageUrl: 'https://picsum.photos/380/200?random=11',
    tags: [
      'React',
      'TypeScript',
      'Next.js',
      'Tailwind',
      'Storybook',
      'Vitest',
      'Node.js',
      'GraphQL',
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          '많은 태그가 있을 때 반응형으로 표시되는 예시입니다. 화면 크기에 따라 표시되는 태그 개수가 달라지고 +N으로 나머지 개수가 표시됩니다.',
      },
    },
  },
};
