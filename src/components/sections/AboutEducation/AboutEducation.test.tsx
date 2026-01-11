import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AboutEducation } from './AboutEducation';

describe('AboutEducation', () => {
  const mockEducationData = {
    title: 'Education',
    items: [
      {
        id: 'skku',
        icon: 'graduation-cap' as const,
        institution: 'SungKyunKwan Univ.',
        degree: 'BS @ Computer Science and Engineering',
        period: 'Mar 2018 ~ Aug 2024',
        details: ['GPA : 4.14/4.5', 'SystemConsultantGroup', 'TA & mentoring program'],
      },
      {
        id: 'cnsh',
        icon: 'school' as const,
        institution: 'Chungnam Science High School',
        period: 'Mar 2016 ~ Feb 2018',
      },
    ],
  };

  it('섹션 제목을 렌더링해야 한다', () => {
    render(<AboutEducation {...mockEducationData} />);
    expect(screen.getByText('Education')).toBeInTheDocument();
  });

  it('모든 교육 기관을 렌더링해야 한다', () => {
    render(<AboutEducation {...mockEducationData} />);
    expect(screen.getByText('SungKyunKwan Univ.')).toBeInTheDocument();
    expect(screen.getByText('Chungnam Science High School')).toBeInTheDocument();
  });

  it('학위 정보가 있을 때 렌더링해야 한다', () => {
    render(<AboutEducation {...mockEducationData} />);
    expect(screen.getByText('BS @ Computer Science and Engineering')).toBeInTheDocument();
  });

  it('기간 정보를 렌더링해야 한다', () => {
    render(<AboutEducation {...mockEducationData} />);
    expect(screen.getByText('Mar 2018 ~ Aug 2024')).toBeInTheDocument();
    expect(screen.getByText('Mar 2016 ~ Feb 2018')).toBeInTheDocument();
  });

  it('세부 정보가 있을 때 렌더링해야 한다', () => {
    render(<AboutEducation {...mockEducationData} />);
    expect(screen.getByText('GPA : 4.14/4.5')).toBeInTheDocument();
    expect(screen.getByText('SystemConsultantGroup')).toBeInTheDocument();
  });

  it('커스텀 className을 적용해야 한다', () => {
    const { container } = render(
      <AboutEducation {...mockEducationData} className="custom-class" />,
    );
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });

  it('학위 정보가 없어도 정상적으로 렌더링해야 한다', () => {
    const dataWithoutDegree = {
      ...mockEducationData,
      items: mockEducationData.items.filter(item => item.id === 'cnsh'),
    };
    render(<AboutEducation {...dataWithoutDegree} />);
    expect(screen.getByText('Chungnam Science High School')).toBeInTheDocument();
  });

  it('세부 정보가 없어도 정상적으로 렌더링해야 한다', () => {
    const dataWithoutDetails = {
      ...mockEducationData,
      items: mockEducationData.items.map(item => ({ ...item, details: undefined })),
    };
    render(<AboutEducation {...dataWithoutDetails} />);
    expect(screen.getByText('SungKyunKwan Univ.')).toBeInTheDocument();
  });
});
