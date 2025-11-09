import { screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { render } from '@testing-library/react';
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

test('renders nothing when there are no active params', () => {
  renderChips('/');
  expect(screen.queryByLabelText(/active filters/i)).toBeNull();
});
