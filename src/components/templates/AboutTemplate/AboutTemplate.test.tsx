/**
 * AboutTemplate 컴포넌트 테스트
 *
 * 테스트 케이스:
 * 1. 기본 렌더링 및 구조 검증
 * 2. 올바른 레이아웃 구조 (Header, Biography, Education, WorkExperience, Projects)
 * 3. props 전달 검증
 * 4. 접근성 검증
 * 5. SectionNav 네비게이션 테스트
 */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { AboutTemplate } from '.';

// 테스트용 샘플 데이터
const mockEducation = {
  title: 'Education',
  items: [
    {
      id: 'test-edu-1',
      icon: 'graduation-cap' as const,
      institution: 'Test University',
      degree: 'BS @ Computer Science',
      period: 'Mar 2018 ~ Aug 2024',
      details: ['GPA: 4.0/4.5'],
    },
  ],
};

const mockWorkExperience = {
  title: 'Work Experience',
  items: [
    {
      id: 'test-work-1',
      company: 'Test Company',
      position: 'Software Engineer',
      period: 'Jan 2024 ~ Present',
      description: ['Developed features', 'Fixed bugs'],
    },
  ],
};

const mockProjects = {
  title: 'Project',
  items: [
    {
      id: 'test-project-1',
      name: 'Test Project',
      summary: 'Test Summary',
      description: 'Test description',
      githubUrl: 'https://github.com/test/test',
    },
  ],
};

const mockProps = {
  education: mockEducation,
  workExperience: mockWorkExperience,
  projects: mockProjects,
};

describe('AboutTemplate', () => {
  describe('기본 렌더링', () => {
    it('AboutTemplate이 렌더링된다', () => {
      render(<AboutTemplate {...mockProps} />);

      // AboutHeader가 렌더링되는지 확인
      expect(screen.getByText('About')).toBeInTheDocument();

      // AboutEducation이 렌더링되는지 확인 (heading으로 특정)
      expect(screen.getByRole('heading', { level: 2, name: 'Education' })).toBeInTheDocument();
      expect(screen.getByText('Test University')).toBeInTheDocument();

      // AboutWorkExperience가 렌더링되는지 확인
      expect(
        screen.getByRole('heading', { level: 2, name: 'Work Experience' }),
      ).toBeInTheDocument();
      expect(screen.getByText('Test Company')).toBeInTheDocument();

      // AboutProjects가 렌더링되는지 확인
      expect(screen.getByRole('heading', { level: 2, name: 'Project' })).toBeInTheDocument();
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    it('레이아웃이 올바르게 구성된다', () => {
      const { container } = render(<AboutTemplate {...mockProps} />);

      // 메인 컨테이너가 있는지 확인 (SectionNav 다음 요소)
      const mainContainer = container.querySelector('.w-full.max-w-\\[1024px\\]');
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer).toHaveClass('mx-auto', 'my-20');
    });

    it('header 요소가 올바른 스타일을 가진다', () => {
      const { container } = render(<AboutTemplate {...mockProps} />);

      // header 요소 확인
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('w-full', 'mb-10', 'lg:mb-12');
    });
  });

  describe('props 전달', () => {
    it('education props가 올바르게 전달된다', () => {
      render(<AboutTemplate {...mockProps} />);

      expect(screen.getByRole('heading', { level: 2, name: 'Education' })).toBeInTheDocument();
      expect(screen.getByText('Test University')).toBeInTheDocument();
      expect(screen.getByText('BS @ Computer Science')).toBeInTheDocument();
    });

    it('workExperience props가 올바르게 전달된다', () => {
      render(<AboutTemplate {...mockProps} />);

      expect(screen.getByText('Work Experience')).toBeInTheDocument();
      expect(screen.getByText('Test Company')).toBeInTheDocument();
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });

    it('projects props가 올바르게 전달된다', () => {
      render(<AboutTemplate {...mockProps} />);

      expect(screen.getByText('Project')).toBeInTheDocument();
      expect(screen.getByText('Test Project')).toBeInTheDocument();
      expect(screen.getByText('Test Summary')).toBeInTheDocument();
    });
  });

  describe('className 적용', () => {
    it('커스텀 className이 적용된다', () => {
      const { container } = render(<AboutTemplate {...mockProps} className="custom-class" />);

      // SectionNav 다음의 메인 컨테이너에서 확인
      const mainContainer = container.querySelector('.custom-class');
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe('접근성', () => {
    it('섹션 제목들이 올바른 heading level을 가진다', () => {
      render(<AboutTemplate {...mockProps} />);

      // About 제목 (h1)
      const aboutHeading = screen.getByRole('heading', { level: 1, name: 'About' });
      expect(aboutHeading).toBeInTheDocument();

      // Education, Work Experience, Project 섹션 제목들 (h2)
      const educationHeading = screen.getByRole('heading', { level: 2, name: 'Education' });
      expect(educationHeading).toBeInTheDocument();

      const workExperienceHeading = screen.getByRole('heading', {
        level: 2,
        name: 'Work Experience',
      });
      expect(workExperienceHeading).toBeInTheDocument();

      const projectHeading = screen.getByRole('heading', { level: 2, name: 'Project' });
      expect(projectHeading).toBeInTheDocument();
    });

    it('링크가 올바른 속성을 가진다', () => {
      render(<AboutTemplate {...mockProps} />);

      // Projects 섹션의 GitHub 링크 확인 (href로 특정)
      const githubLinks = screen.getAllByRole('link', { name: /GitHub/i });
      const projectGithubLink = githubLinks.find(
        link => link.getAttribute('href') === 'https://github.com/test/test',
      );
      expect(projectGithubLink).toBeInTheDocument();
      expect(projectGithubLink).toHaveAttribute('target', '_blank');
      expect(projectGithubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('SectionNav 네비게이션', () => {
    beforeEach(() => {
      // window.scrollTo 모킹
      vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
      // getBoundingClientRect 모킹
      Element.prototype.getBoundingClientRect = vi.fn(() => ({
        top: 100,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('SectionNav가 렌더링된다 (md 이상 화면)', () => {
      render(<AboutTemplate {...mockProps} />);

      // 네비게이션 버튼들이 렌더링되는지 확인
      expect(screen.getByRole('button', { name: /About Me 섹션으로 이동/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Education 섹션으로 이동/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Experience 섹션으로 이동/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Projects 섹션으로 이동/i })).toBeInTheDocument();
    });

    it('활성화된 섹션의 라벨에 font-bold가 적용된다', () => {
      render(<AboutTemplate {...mockProps} />);

      // 스크롤 이벤트로 활성 섹션 업데이트 후 확인
      // 활성화된 버튼은 bg-[var(--color-primary)] 클래스를 가짐
      const activeButton = document.querySelector('button.bg-\\[var\\(--color-primary\\)\\]');
      expect(activeButton).toBeInTheDocument();

      // 활성화된 버튼 내부의 라벨 span에 font-bold가 있는지 확인
      const labelSpan = activeButton?.querySelector('span:last-child');
      expect(labelSpan).toHaveClass('font-bold');
    });

    it('네비게이션 버튼 클릭 시 해당 섹션으로 스크롤된다', () => {
      render(<AboutTemplate {...mockProps} />);

      const educationButton = screen.getByRole('button', { name: /Education 섹션으로 이동/i });
      fireEvent.click(educationButton);

      // scrollTo가 호출되었는지 확인
      expect(window.scrollTo).toHaveBeenCalled();
    });

    it('비활성화된 섹션의 라벨에는 font-bold가 적용되지 않는다', () => {
      render(<AboutTemplate {...mockProps} />);

      // Education 섹션은 비활성화 상태
      const educationButton = screen.getByRole('button', { name: /Education 섹션으로 이동/i });

      // 버튼 내부의 라벨 span 찾기
      const labelSpan = educationButton.querySelector('span:last-child');
      expect(labelSpan).not.toHaveClass('font-bold');
    });

    it('섹션 버튼 클릭 후 해당 섹션이 활성화되어 font-bold가 적용된다', async () => {
      render(<AboutTemplate {...mockProps} />);

      const educationButton = screen.getByRole('button', { name: /Education 섹션으로 이동/i });

      // 클릭 전에는 font-bold가 없음
      let labelSpan = educationButton.querySelector('span:last-child');
      expect(labelSpan).not.toHaveClass('font-bold');

      // 버튼 클릭
      fireEvent.click(educationButton);

      // scroll 이벤트 시뮬레이션 (스크롤 위치 변경 시 activeSection 업데이트)
      fireEvent.scroll(window);
    });

    it('각 네비게이션 버튼에 올바른 aria-label이 설정된다', () => {
      render(<AboutTemplate {...mockProps} />);

      expect(screen.getByRole('button', { name: 'About Me 섹션으로 이동' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Education 섹션으로 이동' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Experience 섹션으로 이동' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Projects 섹션으로 이동' })).toBeInTheDocument();
    });
  });
});
