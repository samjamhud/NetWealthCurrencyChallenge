import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CurrencyRate } from '../models';
import { CurrencyStore } from '../stores';

@Component({
  selector: 'app-currency-form',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './currency-form.component.html',
  styleUrl: './currency-form.component.scss',
})
export class CurrencyFormComponent implements OnInit {
  readonly currencyStore = inject(CurrencyStore);
  readonly snackBar = inject(MatSnackBar);

  public currencyToIcon = '';
  public currencyToRate = 0;
  public currencyForm = new FormGroup({
    currencyFrom: new FormControl(null, Validators.required),
    amount: new FormControl(null, Validators.required),
    currencyTo: new FormControl(null, Validators.required),
  });

  ngOnInit(): void {
    this.currencyStore.getLatestCurrencyRates();
    this.subscribeToFormChanges();
  }

  /**
   * Subscribe to changes of values within the form to update the formState within the
   * currencyStore and conditionally display a currency icon if it exists
   */
  private subscribeToFormChanges(): void {
    this.currencyForm.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged())
      .subscribe(() => {
        const formState: Partial<{
            currencyFrom: string;
            amount: number;
            currencyTo: string;
          }> = { ...this.currencyForm.value },
          currencyToFormControlValue =
            this.currencyForm.get('currencyTo').value;

        this.currencyStore.updateFormState(
          formState as {
            currencyFrom: string;
            amount: number;
            currencyTo: string;
          }
        );

        if (currencyToFormControlValue) {
          this.currencyToIcon = <string>(
            this.getControlPrefix(currencyToFormControlValue)
          );
          this.currencyToRate = <number>(
            this.currencyStore
              .currency()
              .rates.find(
                (rate: CurrencyRate) =>
                  rate.currency === currencyToFormControlValue
              )?.rate
          );
        }
      });
  }

  /**
   * Return a currency string given the base returned by the API
   * for display in the relevant form controls
   * @param currencyCode {Optional} the code of the chosen currency in the "Currency To" form control
   * @returns string
   */
  public getControlPrefix(currencyCode?: string): string {
    let num = 0,
      prefix = '',
      base = this.currencyStore.currency().base;

    if (!base) return;

    prefix = num
      .toLocaleString('en', {
        style: 'currency',
        currency: currencyCode ?? base,
      })
      .replace('0.00', '');

    //  This line prevents displaying the currency code twice in the "Currency To" form control
    //  as not all currency codes have corresponding icons
    if (prefix.length > 1) prefix = '';

    return prefix;
  }

  /**
   * Handle submission of the currency form
   */
  public onSubmit(): void {
    if (this.currencyStore.submitDisabled()) {
      this.snackBar.open(
        "You've already converted this amount/currency combo, update the form to convert a new amount or use a different currency",
        'Confirm',
        {
          duration: 5000,
        }
      );
    } else {
      this.currencyStore.convertCurrency(
        this.currencyStore.formState(),
        this.currencyStore.conversionHistory(),
        this.currencyToRate
      );
    }
  }
}
