import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet } from '@angular/router';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { ConversionPanelComponent } from './conversion-panel/conversion-panel.component';
import { CurrencyFormComponent } from './currency-form/currency-form.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        CommonModule,
        RouterOutlet,
        CurrencyFormComponent,
        ConversionPanelComponent,
        MatGridListModule,
        MatCardModule,
        HttpClientModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'netwealth-currency-conversion' title`, () => {
    expect(component.title).toEqual('netwealth-currency-conversion');
  });

  describe('ngOnInit', () => {
    it('should call getScreenWidth', () => {
      const methodSpy = jest
        .spyOn<any, string>(component, 'getScreenWidth')
        .mockReturnValue(of(1920));

      component.ngOnInit();

      expect(methodSpy).toHaveBeenCalled();
    });
  });
});
