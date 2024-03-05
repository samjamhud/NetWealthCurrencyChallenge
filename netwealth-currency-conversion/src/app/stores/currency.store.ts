import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  ConversionHistory,
  ConversionHistoryMapper,
  Currency,
  CurrencyMapper,
} from '../models';
import { NetWealthService } from '../services';

//  Define our state type to create the signal store from
type CurrencyState = {
  currency: Currency;
  formState: { currencyFrom: string; amount: number; currencyTo: string };
  conversionHistory: Array<ConversionHistory>;
  submitDisabled: boolean;
};

//  Define state with initialised signal values
const initialState: CurrencyState = {
  currency: { base: '', rates: [] },
  formState: { currencyFrom: '', amount: 0, currencyTo: '' },
  conversionHistory: [],
  submitDisabled: false,
};

export const CurrencyStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, netWealthService = inject(NetWealthService)) => ({
    /**
     * Update the form state given the latest values of the form controls.
     * Enable the form as the values have changed
     * @param formValue latest value of the form controls
     */
    updateFormState(formValue: {
      currencyFrom: string;
      amount: number;
      currencyTo: string;
    }): void {
      patchState(store, () => ({
        formState: { ...formValue },
        submitDisabled: false,
      }));
    },

    /**
     * Call the Fixer API to get the latest currency rates
     */
    getLatestCurrencyRates(): void {
      netWealthService.getLatestCurrencyRates().subscribe((newCurrency) => {
        newCurrency = CurrencyMapper.MapFromAPI(newCurrency);
        patchState(store, () => ({
          currency: { base: newCurrency.base, rates: newCurrency.rates },
        }));
      });
    },

    /**
     * Convert currency using the user-selected values from the form.
     * Disable the form until the values have changed.
     * NOTE: this is where I would have used the convert method of the Fixer API
     * @param formValue latest value of the form controls
     * @param currentHistory the currentHistory state to be appened to
     * @param currencyRate the rate of the selected currency to convert in to
     */
    convertCurrency(
      formValue: {
        currencyFrom: string;
        amount: number;
        currencyTo: string;
      },
      currentHistory: Array<ConversionHistory>,
      currencyRate: number
    ): void {
      const latestConversion: ConversionHistory =
        ConversionHistoryMapper.convert(formValue, currencyRate);
      patchState(store, () => ({
        conversionHistory: currentHistory.concat([latestConversion]),
        submitDisabled: true,
      }));
    },
  }))
);
