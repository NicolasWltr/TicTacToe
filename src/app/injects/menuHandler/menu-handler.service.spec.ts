import { TestBed } from '@angular/core/testing';

import { MenuHandlerService } from './menu-handler.service';

describe('MenuHandlerService', () => {
  let service: MenuHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
