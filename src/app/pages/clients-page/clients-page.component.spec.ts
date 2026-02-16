import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { ClientsPageComponent } from './clients-page.component';
import { ApiClientService } from '../../api/api-client.service';
import { UiSnackbarService } from '../../shared/ui/snackbar/snackbar.service';
import { PushDialogComponent } from '../../features/push/push-modal.component';
import { IClient } from '../../types/types';

describe('ClientsPageComponent', () => {
  let fixture: ComponentFixture<ClientsPageComponent>;
  let component: ClientsPageComponent;

  const apiClientServiceMock = {
    getClients: jasmine.createSpy('getClients').and.returnValue(
      of({
        passes: [],
        meta: { size: 0 },
      })
    ),
  };

  const snackbarMock = {
    error: jasmine.createSpy('error'),
    warning: jasmine.createSpy('warning'),
  };

  const dialogMock = {
    open: jasmine.createSpy('open').and.returnValue({
      afterClosed: () => of(false),
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsPageComponent],
      providers: [
        { provide: ApiClientService, useValue: apiClientServiceMock },
        { provide: UiSnackbarService, useValue: snackbarMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    apiClientServiceMock.getClients.calls.reset();
    snackbarMock.error.calls.reset();
    snackbarMock.warning.calls.reset();
    dialogMock.open.calls.reset();
  });

  it('должен быть создан', () => {
    expect(component).toBeTruthy();
  });

  it('метод toggleOne должен добавлять или удалять selected user id', () => {
    component.toggleOne(101, true);
    expect(component.selectedUserIds.has(101)).toBeTrue();

    component.toggleOne(101, false);
    expect(component.selectedUserIds.has(101)).toBeFalse();
  });

  it('метод toggleAllOnPage должен выбирать/отменять выбор всех клиентов на странице', () => {
    const clients = [
      { user_id: 1 },
      { user_id: 2 },
      { user_id: 3 },
    ] as IClient[];

    component.toggleAllOnPage(clients, true);
    expect(component.selectedUserIds.has(1)).toBeTrue();
    expect(component.selectedUserIds.has(2)).toBeTrue();
    expect(component.selectedUserIds.has(3)).toBeTrue();

    component.toggleAllOnPage(clients, false);
    expect(component.selectedUserIds.size).toBe(0);
  });

  it('метод openModal должен показать warning, когда ни один юзер не выбран', () => {
    component.selectedUserIds.clear();

    component.openModal();

    expect(snackbarMock.warning).toHaveBeenCalledWith(
      'Выберите хотя бы одного клиента'
    );
    expect(dialogMock.open).not.toHaveBeenCalled();
  });

  it('метод openModal должен открыть модальное окно с выбранными selected userIds', () => {
    component.selectedUserIds = new Set<number>([17145, 15897, 15970]);

    component.openModal();

    expect(dialogMock.open).toHaveBeenCalled();

    const [dialogComponent, config] = dialogMock.open.calls.mostRecent().args;
    expect(dialogComponent).toBe(PushDialogComponent);
    expect(config.data.userIds).toBe('17145,15897,15970');
    expect(config.autoFocus).toBeFalse();
  });
});
