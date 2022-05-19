import { StudentsCountPipe } from './students-count.pipe';

describe('StudentsCountPipe', () => {
  it('create an instance', () => {
    const pipe = new StudentsCountPipe();
    expect(pipe).toBeTruthy();
  });
});
