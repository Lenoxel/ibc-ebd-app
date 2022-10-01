import { FakeArrayPipe } from './fake-array.pipe';

describe('FakeArrayPipe', () => {
  it('create an instance', () => {
    const pipe = new FakeArrayPipe();
    expect(pipe).toBeTruthy();
  });
});
