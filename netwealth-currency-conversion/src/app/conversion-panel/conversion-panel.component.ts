import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ConversionHistory } from '../models';

@Component({
  selector: 'app-conversion-panel',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule],
  templateUrl: './conversion-panel.component.html',
  styleUrl: './conversion-panel.component.scss',
})
export class ConversionPanelComponent {
  @Input() conversion: ConversionHistory;
}
