import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Currency } from '../models';

@Injectable({
  providedIn: 'root',
})
export class NetWealthService {
  private http: HttpClient = inject(HttpClient);
  private urlString: string = 'http://data.fixer.io/api';
  private accessKey: string = 'e851379ce39fb540dacdfd9c26550eeb';

  /**
   * Get latest currency rates data from the Fixer API
   * @returns Observable of raw currency data
   */
  public getLatestCurrencyRates(): Observable<Currency> {
    let url: string = `${this.urlString}/latest?format=1&access_key=${this.accessKey}`;
    return this.http.get<Currency>(url);
  }
}
