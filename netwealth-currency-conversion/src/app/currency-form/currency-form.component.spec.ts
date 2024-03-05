import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { CurrencyStore } from '../stores';
import { CurrencyFormComponent } from './currency-form.component';

class MockCurrencyStore {
  currency = signal({
    base: 'EUR',
    rates: [{ currency: 'GBP', rate: 0.00011 }],
  });
  getLatestCurrencyRates = jest.fn();
  updateFormState = jest.fn();
  submitDisabled = jest.fn();
  convertCurrency = jest.fn();
}

describe('CurrencyFormComponent', () => {
  let component: CurrencyFormComponent;
  let fixture: ComponentFixture<CurrencyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CurrencyFormComponent,
        CommonModule,
        MatGridListModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatSnackBarModule,
        MatButtonModule,
        ReactiveFormsModule,
        HttpClientModule,
        NoopAnimationsModule,
      ],
    })
      .overrideComponent(CurrencyFormComponent, {
        set: {
          providers: [{ provide: CurrencyStore, useClass: MockCurrencyStore }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CurrencyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should call the getLatestCurrencyRates of the currencyStore to load required data for the form', () => {
      const storeSpy = jest
        .spyOn<any, string>(
          component['currencyStore'],
          'getLatestCurrencyRates'
        )
        .mockImplementation();

      component.ngOnInit();

      expect(storeSpy).toHaveBeenCalled();
    });
  });

  describe('subscribeToFormChanges', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('should update the formState of the currencyStore when the value of the form changes', () => {
      const storeSpy = jest
        .spyOn<any, string>(component['currencyStore'], 'updateFormState')
        .mockImplementation();

      component.currencyForm.patchValue({ amount: 1 });
      jest.runAllTimers();

      expect(storeSpy).toHaveBeenCalled();
    });

    it('should populate the class props currencyToIcon and currencyToRate with the relevant data of the selected currency', () => {
      const methodSpy = jest
        .spyOn<any, string>(component, 'getControlPrefix')
        .mockReturnValue(of('£'));
      component.currencyToIcon = null;
      component.currencyToRate = null;

      component.currencyForm.patchValue({
        currencyFrom: 'EUR',
        amount: 2,
        currencyTo: 'GBP',
      });
      jest.runAllTimers();

      expect(methodSpy).toHaveBeenCalled();
      expect(component.currencyToIcon).not.toBeNull();
      expect(component.currencyToRate).not.toBeNull();
    });
  });

  describe('getControlPrefix', () => {
    it('should use the base from the currencyStore if no argument for currencyCode has been passed', () => {
      const eurSymb = '€';

      expect(component.getControlPrefix()).toEqual(eurSymb);
    });

    it('should use the argument for currencyCode when it has been passed', () => {
      const gbpSymb = '£';

      expect(component.getControlPrefix('GBP')).toEqual(gbpSymb);
    });

    it('should return an empty string if the prefix is longer than 1 char', () => {
      expect(component.getControlPrefix('BTC')).toEqual('');
    });
  });

  describe('onSubmit', () => {
    let storeSpy: jest.SpyInstance;

    beforeEach(() => {
      storeSpy = jest
        .spyOn<any, string>(component['currencyStore'], 'convertCurrency')
        .mockImplementation();
    });

    it('should display a snackbar if the user tries to submit the form without changing the value', () => {
      jest
        .spyOn<any, string>(component['currencyStore'], 'submitDisabled')
        .mockReturnValue(of(true));

      component.onSubmit();

      expect(storeSpy).not.toHaveBeenCalled();
    });

    it('should call the convertCurrency method of the currencyStore if the form values are fresh', () => {
      jest
        .spyOn<any, string>(component['currencyStore'], 'submitDisabled')
        .mockReturnValue(of(false));

      component.onSubmit();

      expect(storeSpy).not.toHaveBeenCalled();
    });
  });
});
