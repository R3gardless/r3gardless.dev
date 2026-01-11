/**
 * AboutTemplate 컴포넌트 테스트
 *
 * 테스트 케이스:
 * 1. 기본 렌더링 및 구조 검증
 * 2. 올바른 레이아웃 구조 (Header, Biography, Education, WorkExperience, Projects)
 * 3. props 전달 검증
 * 4. 접근성 검증
 */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

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

      // AboutEducation이 렌더링되는지 확인
      expect(screen.getByText('Education')).toBeInTheDocument();
      expect(screen.getByText('Test University')).toBeInTheDocument();

      // AboutWorkExperience가 렌더링되는지 확인
      expect(screen.getByText('Work Experience')).toBeInTheDocument();
      expect(screen.getByText('Test Company')).toBeInTheDocument();

      // AboutProjects가 렌더링되는지 확인
      expect(screen.getByText('Project')).toBeInTheDocument();
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    it('레이아웃이 올바르게 구성된다', () => {
      const { container } = render(<AboutTemplate {...mockProps} />);

      // 메인 컨테이너가 있는지 확인
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('w-full', 'max-w-[1024px]', 'mx-auto', 'my-20');
    });

    it('header 요소가 올바른 스타일을 가진다', () => {
      const { container } = render(<AboutTemplate {...mockProps} />);

      // header 요소 확인
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('w-full', 'mb-8', 'lg:mb-12');
    });
  });

  describe('props 전달', () => {
    it('education props가 올바르게 전달된다', () => {
      render(<AboutTemplate {...mockProps} />);

      expect(screen.getByText('Education')).toBeInTheDocument();
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

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('custom-class');
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
});
