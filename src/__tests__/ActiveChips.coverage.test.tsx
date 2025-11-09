import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ActiveChips from '../components/ActiveChips';

function WithLocation() {
  const loc = useLocation();
  return <div data-testid="loc">{loc.pathname + loc.search}</div>;
}

function renderChips(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <WithLocation />
      <ActiveChips />
    </MemoryRouter>
  );
}

describe('ActiveChips onClick coverage', () => {
  test('clicking every Clear button triggers URL param mutations', async () => {
    const user = userEvent.setup();
    renderChips(
      '/?q=naruto&type=tv&status=airing&rating=pg13&score=8&year=2010&order_by=members&sort=asc&page=9'
    );

    // Grab all clear buttons and click them one by one
    const buttons = screen.getAllByRole('button', { name: /^clear /i });
    expect(buttons.length).toBeGreaterThan(0);

    for (const btn of buttons) {
      await user.click(btn);
    }

    // After clearing all, chips container should disappear
    expect(screen.queryByLabelText(/active filters/i)).toBeNull();
    // Page should be reset to 1
    expect(screen.getByTestId('loc').textContent).toContain('page=1');
  });
});
