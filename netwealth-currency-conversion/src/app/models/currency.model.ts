import { Injectable } from '@angular/core';

export interface Currency {
  base: string;
  rates: Array<CurrencyRate>;
}

export interface CurrencyRate {
  currency: string;
  rate: number;
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyMapper {
  /**
   * Map the raw currency data from the API into the Currency interface
   * @param currencyData the raw response from the API
   * @returns a formatted Currency object
   */
  static MapFromAPI(currencyData: any): Currency {
    let rates: Array<CurrencyRate> = [];

    //  Convert the key value pair object into an array of CurrencyRate objects
    Object.keys(currencyData.rates).forEach((currencyName: string) => {
      rates.push({
        currency: currencyName,
        rate: currencyData.rates[currencyName],
      });
    });

    currencyData.rates = rates;
    return currencyData;
  }
}
