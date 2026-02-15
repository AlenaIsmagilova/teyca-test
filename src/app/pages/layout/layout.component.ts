import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ClientsPageComponent } from '../clients-page/clients-page.component';

@Component({
  selector: 'app-layout',
  imports: [ClientsPageComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
