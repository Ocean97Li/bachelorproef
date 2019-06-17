import { TestBed } from '@angular/core/testing';

import { EthereumConnectorService } from './ethereum-connector.service';

describe('EthereumConnectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EthereumConnectorService = TestBed.get(EthereumConnectorService);
    expect(service).toBeTruthy();
  });
});
