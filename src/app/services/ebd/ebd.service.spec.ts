import { TestBed } from '@angular/core/testing';

import { EbdService } from './ebd.service';

describe('EbdService', () => {
  let service: EbdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EbdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
