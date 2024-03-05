import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ConversionPanelComponent } from './conversion-panel.component';

describe('ConversionPanelComponent', () => {
  let component: ConversionPanelComponent;
  let fixture: ComponentFixture<ConversionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatCardModule,
        MatDividerModule,
        ConversionPanelComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConversionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
