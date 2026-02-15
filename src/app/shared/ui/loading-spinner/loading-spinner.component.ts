import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  MatProgressSpinnerModule,
  ProgressSpinnerMode,
} from '@angular/material/progress-spinner';

@Component({
  selector: 'ui-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    @if (visible) {
    <mat-progress-spinner
      [mode]="mode"
      [diameter]="diameter"
      [strokeWidth]="strokeWidth"
    />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {
  @Input() visible = true;
  @Input() mode: ProgressSpinnerMode = 'indeterminate';
  @Input() diameter = 40;
  @Input() strokeWidth = 4;
}
