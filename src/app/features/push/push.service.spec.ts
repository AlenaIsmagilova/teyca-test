import { TestBed } from '@angular/core/testing';

import { PushModalService } from './push.service';

describe('PushModalService', () => {
  let service: PushModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PushModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
