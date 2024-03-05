import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { NetWealthService } from './net-wealth.service';

describe('NetWealthService', () => {
  let service: NetWealthService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientModule] });
    service = TestBed.inject(NetWealthService);
  });

  describe('getLatestCurrencyRates', () => {
    let httpGetSpy: jest.SpyInstance;

    beforeEach(() => {
      httpGetSpy = jest
        .spyOn<any, string>(service['http'], 'get')
        .mockImplementation();
      jest.useFakeTimers();
    });

    afterEach(() => jest.useRealTimers());

    it('should format the URL string using the private class props and call the get method of the HttpClient', () => {
      service.getLatestCurrencyRates();
      jest.runAllTimers();
      expect(httpGetSpy).toHaveBeenCalledWith(
        `${service['urlString']}/latest?format=1&access_key=${service['accessKey']}`
      );
    });
  });
});
