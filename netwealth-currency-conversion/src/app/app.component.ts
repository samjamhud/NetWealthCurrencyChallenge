import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterOutlet } from '@angular/router';
import { ConversionPanelComponent } from './conversion-panel/conversion-panel.component';
import { CurrencyFormComponent } from './currency-form/currency-form.component';
import { CurrencyStore } from './stores';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    CurrencyFormComponent,
    ConversionPanelComponent,
    MatGridListModule,
    MatCardModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  readonly currencyStore = inject(CurrencyStore);

  public title = 'netwealth-currency-conversion';
  public screenWidth: number = 0;

  public ngOnInit(): void {
    this.getScreenWidth();
  }

  @HostListener('window:resize', ['$event'])
  private getScreenWidth() {
    this.screenWidth = window.innerWidth;
  }
}
