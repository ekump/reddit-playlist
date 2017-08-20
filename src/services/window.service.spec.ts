import { WindowService } from '../services';

let windowService: WindowService = new WindowService();

describe('WindowService', () => {
  it('returns the window object', () => {
    let windowResult = windowService.getWindow();
    expect(windowResult).toEqual(window);
  });
});
