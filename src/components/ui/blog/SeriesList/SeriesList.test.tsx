import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { SeriesList } from './SeriesList';

const sampleSeries = [
  { name: 'A 시리즈', count: 4 },
  { name: 'B 시리즈', count: 2 },
];

describe('SeriesList', () => {
  it('시리즈 제목과 목록을 렌더링한다', () => {
    render(<SeriesList series={sampleSeries} />);

    expect(screen.getByText('시리즈')).toBeInTheDocument();
    expect(screen.getByText('A 시리즈')).toBeInTheDocument();
    expect(screen.getByText('B 시리즈')).toBeInTheDocument();
  });

  it('시리즈별 포스트 개수를 표시한다', () => {
    render(<SeriesList series={sampleSeries} />);

    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('시리즈가 없으면 아무것도 렌더링하지 않는다', () => {
    const { container } = render(<SeriesList series={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('시리즈 클릭 시 핸들러를 호출한다', () => {
    const onSeriesClick = vi.fn();
    render(<SeriesList series={sampleSeries} onSeriesClick={onSeriesClick} />);

    fireEvent.click(screen.getByText('A 시리즈'));

    expect(onSeriesClick).toHaveBeenCalledWith('A 시리즈');
  });

  it('선택된 시리즈에 aria-pressed를 표시하고 다시 클릭할 수 있다', () => {
    const onSeriesClick = vi.fn();
    render(
      <SeriesList series={sampleSeries} selectedSeries="A 시리즈" onSeriesClick={onSeriesClick} />,
    );

    const selectedButton = screen.getByText('A 시리즈').closest('button');
    expect(selectedButton).toHaveAttribute('aria-pressed', 'true');

    // 선택 해제를 위해 다시 클릭할 수 있어야 한다
    fireEvent.click(selectedButton!);
    expect(onSeriesClick).toHaveBeenCalledWith('A 시리즈');
  });

  it('언어에 맞는 섹션 제목을 표시한다', () => {
    render(<SeriesList series={sampleSeries} lang="en" />);

    expect(screen.getByText('Series')).toBeInTheDocument();
  });

  it('초기 표시 개수를 초과하면 더보기 버튼으로 추가 노출한다', () => {
    const manySeries = Array.from({ length: 7 }, (_, i) => ({
      name: `시리즈 ${i + 1}`,
      count: i + 1,
    }));
    render(<SeriesList series={manySeries} initialDisplayCount={5} loadMoreCount={5} />);

    expect(screen.queryByText('시리즈 6')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('+ More'));

    expect(screen.getByText('시리즈 6')).toBeInTheDocument();
    expect(screen.getByText('시리즈 7')).toBeInTheDocument();
  });
});
