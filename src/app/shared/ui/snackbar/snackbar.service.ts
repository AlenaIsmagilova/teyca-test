import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackbarType } from '../../../types/types';

@Injectable({ providedIn: 'root' })
export class UiSnackbarService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly baseConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  };

  public error(
    message: string,
    action = 'Закрыть',
    config?: MatSnackBarConfig
  ): void {
    this.open(message, action, 'error', config);
  }

  public warning(
    message: string,
    action = 'Закрыть',
    config?: MatSnackBarConfig
  ): void {
    this.open(message, action, 'warning', config);
  }

  private open(
    message: string,
    action: string,
    type: SnackbarType,
    config?: MatSnackBarConfig
  ): void {
    this.snackBar.open(message, action, {
      ...this.baseConfig,
      ...config,
      panelClass: [
        'ui-snackbar',
        `ui-snackbar--${type}`,
        ...(config?.panelClass ?? []),
      ],
    });
  }
}
