import { render } from '@testing-library/react';
import CardGrid from '@/components/layout/CardGrid';

describe('CardGrid', () => {
  it('renders children inside a grid', () => {
    const { container } = render(
      <CardGrid>
        <p>child</p>
      </CardGrid>
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain('grid');
    expect(grid.textContent).toContain('child');
  });

  it('uses single column layout when singleColumn is true', () => {
    const { container } = render(
      <CardGrid singleColumn>
        <p>item</p>
      </CardGrid>
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain('grid-cols-1');
    expect(grid.className).toContain('max-w-screen-md');
  });
});
