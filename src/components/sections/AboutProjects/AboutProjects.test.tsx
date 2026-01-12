import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AboutProjects } from './AboutProjects';

describe('AboutProjects', () => {
  const mockProjectsData = {
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
        summary: 'Side Project',
        description: '프로젝트 설명',
      },
    ],
  };

  it('섹션 제목을 렌더링해야 한다', () => {
    render(<AboutProjects {...mockProjectsData} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Project' })).toBeInTheDocument();
  });

  it('모든 프로젝트를 렌더링해야 한다', () => {
    render(<AboutProjects {...mockProjectsData} />);
    expect(screen.getByText('Pyodide')).toBeInTheDocument();
    expect(screen.getByText('Enlistpedia')).toBeInTheDocument();
  });

  it('요약 정보를 렌더링해야 한다', () => {
    render(<AboutProjects {...mockProjectsData} />);
    expect(screen.getByText('Opensource Contribution')).toBeInTheDocument();
  });

  it('설명 정보를 렌더링해야 한다', () => {
    render(<AboutProjects {...mockProjectsData} />);
    expect(screen.getByText('기여 내역 설명')).toBeInTheDocument();
  });

  it('GitHub URL이 있으면 링크로 렌더링해야 한다', () => {
    render(<AboutProjects {...mockProjectsData} />);
    const link = screen.getByRole('link', { name: /GitHub/i });
    expect(link).toHaveAttribute('href', 'https://github.com/pyodide/pyodide');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('GitHub URL이 없으면 일반 텍스트로 렌더링해야 한다', () => {
    render(<AboutProjects {...mockProjectsData} />);
    const enlistpediaHeading = screen.getByRole('heading', { name: 'Enlistpedia' });
    expect(enlistpediaHeading).toBeInTheDocument();
  });

  it('커스텀 className을 적용해야 한다', () => {
    const { container } = render(<AboutProjects {...mockProjectsData} className="custom-class" />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });
});
