import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Heading, Text, Caption, Italic, DateText } from './Typography';

const meta: Meta = {
  title: 'Components/Atoms/Typography',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type HeadingStory = StoryObj<typeof Heading>;
type TextStory = StoryObj<typeof Text>;
type CaptionStory = StoryObj<typeof Caption>;
type ItalicStory = StoryObj<typeof Italic>;
type DateStory = StoryObj<typeof DateText>;

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

// Dark 테마 H1 스토리
export const DarkH1: HeadingStory = {
  render: () => (
    <div className="bg-[color:var(--color-background)] p-4" data-theme="dark">
      <Heading level={1} theme="dark">
        H1 제목은 이렇게 작성
      </Heading>
    </div>
  ),
};

// 본문 텍스트 스토리
export const BodyText: TextStory = {
  render: () => <Text>기본 내용입니다.</Text>,
};

// 다크 테마 본문 텍스트 스토리
export const DarkBodyText: TextStory = {
  render: () => (
    <div className="bg-[color:var(--color-background)] p-4" data-theme="dark">
      <Text theme="dark">기본 내용입니다.</Text>
    </div>
  ),
};

// 캡션 스토리
export const CaptionText: CaptionStory = {
  render: () => <Caption>작은 크기의 텍스트입니다.</Caption>,
};

// 이탈릭 텍스트 스토리
export const ItalicText: ItalicStory = {
  render: () => <Italic>설명글은 여기에 계속 작성하면 됩니다. 이탈릭체로 표현</Italic>,
};

// 날짜 텍스트 스토리
export const DateTextStory: DateStory = {
  render: () => <DateText>Jan 22, 2025</DateText>,
};

// 복합 사용 예시
export const AllTypographyExample: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <Heading level={1}>블로그 글 제목</Heading>
      <DateText>Jan 22, 2025</DateText>
      <Italic>이 글은 Typography 컴포넌트의 다양한 사용 예시를 보여줍니다.</Italic>
      <Heading level={2}>첫 번째 섹션</Heading>
      <Text>
        블로그의 본문 내용은 이렇게 표시됩니다. 다양한 Typography 컴포넌트를 활용하여 콘텐츠의 계층
        구조를 명확하게 나타낼 수 있습니다.
      </Text>
      <Heading level={3}>하위 섹션</Heading>
      <Text>더 작은 제목을 사용하여 콘텐츠를 구성할 수 있습니다.</Text>
      <Caption>이 글은 2025년 1월 22일에 작성되었습니다.</Caption>
    </div>
  ),
};

// 다크 모드 복합 사용 예시
export const DarkModeExample: StoryObj = {
  render: () => (
    <div className="space-y-4 bg-[color:var(--color-background)] p-4" data-theme="dark">
      <Heading level={1} theme="dark">
        블로그 글 제목
      </Heading>
      <DateText theme="dark">Jan 22, 2025</DateText>
      <Italic theme="dark">이 글은 Typography 컴포넌트의 다양한 사용 예시를 보여줍니다.</Italic>
      <Heading level={2} theme="dark">
        첫 번째 섹션
      </Heading>
      <Text theme="dark">
        블로그의 본문 내용은 이렇게 표시됩니다. 다양한 Typography 컴포넌트를 활용하여 콘텐츠의 계층
        구조를 명확하게 나타낼 수 있습니다.
      </Text>
      <Heading level={3} theme="dark">
        하위 섹션
      </Heading>
      <Text theme="dark">더 작은 제목을 사용하여 콘텐츠를 구성할 수 있습니다.</Text>
      <Caption theme="dark">이 글은 2025년 1월 22일에 작성되었습니다.</Caption>
    </div>
  ),
};
