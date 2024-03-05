import { Injectable } from '@angular/core';

export interface ConversionHistory {
  currencyFrom: string;
  amount: number;
  currencyTo: string;
  conversionTime: string;
  conversionAmount: number;
  conversionRate: number;
}

@Injectable({
  providedIn: 'root',
})
export class ConversionHistoryMapper {
  /**
   * Converts a supplied amount of a chosen currency given the rate of another currency
   * @param formData data supplied by the currency form
   * @param rate the rate of the chosen currency to convert into
   * @returns ConversionHistory object
   */
  static convert(formData, rate: number): ConversionHistory {
    return {
      ...formData,
      conversionRate: rate,
      conversionTime: Date.now(),
      conversionAmount: (formData.amount * rate).toLocaleString('en', {
        style: 'currency',
        currency: formData.currencyTo,
      }),
      amount: formData.amount.toLocaleString('en', {
        style: 'currency',
        currency: formData.currencyFrom,
      }),
    };
  }
}
