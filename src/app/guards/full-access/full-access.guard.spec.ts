import { TestBed } from '@angular/core/testing';

import { FullAccessGuard } from './full-access.guard';

describe('FullAccessGuard', () => {
  let guard: FullAccessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FullAccessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
