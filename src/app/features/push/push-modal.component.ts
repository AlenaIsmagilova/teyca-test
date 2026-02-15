import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { finalize } from 'rxjs/operators';
import { PushModalService } from './push.service';
import { UiSnackbarService } from '../../shared/ui/snackbar/snackbar.service';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';

type SendMode = 'now' | 'scheduled';

interface PushDialogData {
  userIds: string;
}

@Component({
  selector: 'app-push-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './push-modal.component.html',
  styleUrl: './push-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PushDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<PushDialogComponent, boolean>
  );
  private readonly data = inject<PushDialogData>(MAT_DIALOG_DATA);
  private readonly pushService = inject(PushModalService);
  public readonly today = new Date();

  public isSubmitting = false;

  public readonly form = new FormGroup({
    pushMessage: new FormControl<string>(
      '🛒 Осталось чуть-чуть до 1500 ₽ — и бонусы ваши. Успейте до конца акции!',
      {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(300)],
      }
    ),
    scheduledDate: new FormControl<Date | null>(null),
  });

  public close(): void {
    this.dialogRef.close(false);
  }

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const payload: any = {
      user_id: this.data.userIds,
      push_message: raw.pushMessage,
    };

    if (raw.scheduledDate) {
      payload.date_start = raw.scheduledDate;
    }

    this.isSubmitting = true;
    this.pushService
      .sendPush(payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
      });
  }
}
