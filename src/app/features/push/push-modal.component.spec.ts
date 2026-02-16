import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { PushDialogComponent } from './push-modal.component';
import { PushModalService } from './push.service';
import { UiSnackbarService } from '../../shared/ui/snackbar/snackbar.service';

describe('PushDialogComponent (minimal)', () => {
  let fixture: ComponentFixture<PushDialogComponent>;
  let component: PushDialogComponent;

  const dialogRefMock = {
    close: jasmine.createSpy('close'),
  };

  const pushServiceMock = {
    sendPush: jasmine
      .createSpy('sendPush')
      .and.returnValue(of({ success: true })),
  };

  const snackbarMock = {
    error: jasmine.createSpy('error'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PushDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { userIds: '17145,15897' } },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: PushModalService, useValue: pushServiceMock },
        { provide: UiSnackbarService, useValue: snackbarMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PushDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    dialogRefMock.close.calls.reset();
    pushServiceMock.sendPush.calls.reset();
    snackbarMock.error.calls.reset();
  });

  it('should close dialog with false on close()', () => {
    component.close();
    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });

  it('should send push and close dialog with true on successful submit()', () => {
    component.form.controls.pushMessage.setValue('Тестовое сообщение');
    component.form.controls.scheduledDate.setValue(null);

    component.submit();

    expect(pushServiceMock.sendPush).toHaveBeenCalledWith({
      user_id: '17145,15897',
      push_message: 'Тестовое сообщение',
    });
    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });
});
