import { PeopleCountPipe } from './people-count.pipe';

describe('PeopleCountPipe', () => {
  it('create an instance', () => {
    const pipe = new PeopleCountPipe();
    expect(pipe).toBeTruthy();
  });
});
