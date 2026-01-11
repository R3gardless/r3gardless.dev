import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AboutWorkExperience } from './AboutWorkExperience';

describe('AboutWorkExperience', () => {
  const mockItems = [
    {
      id: 'job1',
      company: 'Test Company',
      position: 'Software Engineer',
      period: 'Jan 2024 ~ Present',
      description: ['Develop applications', 'Write tests'],
    },
    {
      id: 'job2',
      company: 'Another Company',
      position: 'Junior Developer',
      period: 'Jan 2023 ~ Dec 2023',
      description: ['Learn and grow'],
    },
  ];

  it('섹션 제목이 올바르게 렌더링되어야 함', () => {
    render(<AboutWorkExperience title="Work Experience" items={mockItems} />);
    expect(screen.getByText('Work Experience')).toBeInTheDocument();
  });

  it('모든 경력 아이템이 렌더링되어야 함', () => {
    render(<AboutWorkExperience title="Work Experience" items={mockItems} />);
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('Another Company')).toBeInTheDocument();
  });

  it('회사명이 올바르게 표시되어야 함', () => {
    render(<AboutWorkExperience title="Work Experience" items={mockItems} />);
    expect(screen.getByText('Test Company')).toBeInTheDocument();
  });

  it('직책이 올바르게 표시되어야 함', () => {
    render(<AboutWorkExperience title="Work Experience" items={mockItems} />);
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Junior Developer')).toBeInTheDocument();
  });

  it('기간이 올바르게 표시되어야 함', () => {
    render(<AboutWorkExperience title="Work Experience" items={mockItems} />);
    expect(screen.getByText('Jan 2024 ~ Present')).toBeInTheDocument();
    expect(screen.getByText('Jan 2023 ~ Dec 2023')).toBeInTheDocument();
  });

  it('업무 설명이 올바르게 표시되어야 함', () => {
    render(<AboutWorkExperience title="Work Experience" items={mockItems} />);
    expect(screen.getByText('Develop applications')).toBeInTheDocument();
    expect(screen.getByText('Write tests')).toBeInTheDocument();
    expect(screen.getByText('Learn and grow')).toBeInTheDocument();
  });

  it('Building2 아이콘이 각 아이템마다 렌더링되어야 함', () => {
    const { container } = render(<AboutWorkExperience title="Work Experience" items={mockItems} />);
    const icons = container.querySelectorAll('svg');
    // 각 아이템마다 하나씩, 총 2개의 아이콘
    expect(icons.length).toBe(2);
  });

  it('커스텀 className이 적용되어야 함', () => {
    const { container } = render(
      <AboutWorkExperience title="Work Experience" items={mockItems} className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('빈 아이템 배열로도 렌더링되어야 함', () => {
    render(<AboutWorkExperience title="Work Experience" items={[]} />);
    expect(screen.getByText('Work Experience')).toBeInTheDocument();
  });

  it('ref가 올바르게 전달되어야 함', () => {
    const ref = { current: null as HTMLElement | null };
    render(<AboutWorkExperience ref={ref} title="Work Experience" items={mockItems} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('SECTION');
  });
});
