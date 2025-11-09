import { screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import { render } from '@testing-library/react';

function WithLocation() {
  const loc = useLocation();
  return <div data-testid="loc">{loc.pathname + loc.search}</div>;
}

function renderWithRoute(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <WithLocation />
      <FilterBar />
    </MemoryRouter>
  );
}

test('initial values reflect URL params and hasAny controls Clear button disabled', () => {
  renderWithRoute(
    '/?type=tv&status=airing&rating=pg&score=7&year=2010&order_by=members&sort=asc'
  );
  expect((screen.getByLabelText(/Type/i) as HTMLSelectElement).value).toBe(
    'tv'
  );
  expect((screen.getByLabelText(/Status/i) as HTMLSelectElement).value).toBe(
    'airing'
  );
  expect((screen.getByLabelText(/Rating/i) as HTMLSelectElement).value).toBe(
    'pg'
  );
  expect((screen.getByLabelText(/Min Score/i) as HTMLSelectElement).value).toBe(
    '7'
  );
  expect((screen.getByLabelText(/Year/i) as HTMLSelectElement).value).toBe(
    '2010'
  );
  expect((screen.getByLabelText(/Order by/i) as HTMLSelectElement).value).toBe(
    'members'
  );
  expect((screen.getByLabelText(/^Order$/i) as HTMLSelectElement).value).toBe(
    'asc'
  );
});

test("selecting 'any' removes the param and keeps page=1", () => {
  renderWithRoute(
    '/?type=movie&status=complete&rating=pg13&score=9&year=2016&order_by=rank&sort=desc'
  );

  // Set each to 'any' or blank and verify URL params removed
  fireEvent.change(screen.getByLabelText(/Type/i), {
    target: { value: 'any' },
  });
  expect(screen.getByTestId('loc').textContent).not.toContain('type=');
  expect(screen.getByTestId('loc').textContent).toContain('page=1');

  fireEvent.change(screen.getByLabelText(/Status/i), {
    target: { value: 'any' },
  });
  expect(screen.getByTestId('loc').textContent).not.toContain('status=');

  fireEvent.change(screen.getByLabelText(/Rating/i), {
    target: { value: 'any' },
  });
  expect(screen.getByTestId('loc').textContent).not.toContain('rating=');

  fireEvent.change(screen.getByLabelText(/Min Score/i), {
    target: { value: '' },
  });
  expect(screen.getByTestId('loc').textContent).not.toContain('score=');

  fireEvent.change(screen.getByLabelText(/Year/i), { target: { value: '' } });
  expect(screen.getByTestId('loc').textContent).not.toContain('year=');

  fireEvent.change(screen.getByLabelText(/Order by/i), {
    target: { value: '' },
  });
  expect(screen.getByTestId('loc').textContent).not.toContain('order_by=');

  fireEvent.change(screen.getByLabelText(/^Order$/i), {
    target: { value: '' },
  });
  expect(screen.getByTestId('loc').textContent).not.toContain('sort=');
});
