import { clearParam } from '../components/ActiveChips';

describe('clearParam helper', () => {
  test('removes key and resets page to 1 then calls setParams with replace', () => {
    const params = new URLSearchParams('q=naruto&type=tv&page=7');
    const spy = jest.fn();

    clearParam(params, spy as any, 'type');

    expect(spy).toHaveBeenCalledTimes(1);
    const [next, opts] = spy.mock.calls[0];
    expect(String(next)).toContain('q=naruto');
    expect(String(next)).not.toContain('type=');
    expect(String(next)).toContain('page=1');
    expect(opts).toEqual({ replace: true });
  });
});
