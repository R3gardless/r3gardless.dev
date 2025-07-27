import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Heading, Text } from './Typography';

const meta: Meta = {
  title: 'UI/Typography',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type HeadingStory = StoryObj<typeof Heading>;
type TextStory = StoryObj<typeof Text>;

// H1 스토리
export const H1: HeadingStory = {
  render: () => <Heading level={1}>H1 제목은 이렇게 작성</Heading>,
};

// H2 스토리
export const H2: HeadingStory = {
  render: () => <Heading level={2}>H2 제목은 이렇게 작성</Heading>,
};

// H3 스토리
export const H3: HeadingStory = {
  render: () => <Heading level={3}>H3 제목은 이렇게 작성</Heading>,
};

// 본문 텍스트 스토리
export const BodyText: TextStory = {
  render: () => <Text>기본 내용입니다.</Text>,
};

// 복합 사용 예시
export const AllTypographyExample: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <Heading level={1}>블로그 글 제목</Heading>
      <Heading level={2}>첫 번째 섹션</Heading>
      <Text>
        블로그의 본문 내용은 이렇게 표시됩니다. 다양한 Typography 컴포넌트를 활용하여 콘텐츠의 계층
        구조를 명확하게 나타낼 수 있습니다.
      </Text>
      <Heading level={3}>하위 섹션</Heading>
      <Text>더 작은 제목을 사용하여 콘텐츠를 구성할 수 있습니다.</Text>
    </div>
  ),
};
