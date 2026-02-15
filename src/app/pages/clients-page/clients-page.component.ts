import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ApiClientService } from '../../api/api-client.service';
import {
  catchError,
  debounceTime,
  finalize,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { IClient, IClientsResponse } from '../../models/client.models';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getRussianPaginator } from '../../utils/paginator';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingSpinnerComponent } from '../../shared/ui/loading-spinner/loading-spinner.component';
import { UiSnackbarService } from '../../shared/ui/snackbar/snackbar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { PushDialogComponent } from '../../features/push/push-modal.component';

interface ISearchForm {
  search: FormControl<string | null>;
}

@Component({
  selector: 'app-clients-page',
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    AsyncPipe,
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './clients-page.component.html',
  styleUrl: './clients-page.component.scss',
  providers: [{ provide: MatPaginatorIntl, useValue: getRussianPaginator() }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsPageComponent implements OnInit {
  private readonly clientsApi = inject(ApiClientService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackbarService = inject(UiSnackbarService);
  private readonly modal = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  public clients$!: Observable<IClient[]>;
  public selectedUserIds = new Set<number>();
  public readonly downloadUrl = 'https://cards.teyca.ru/download/';
  public isLoading = false;
  public isError = false;

  public pageIndex = 0;
  public pageSize = 10;
  public total = 0;

  public readonly displayedColumns: string[] = [
    'select',
    'id',
    'device',
    'cardLayout',
    'cardNumber',
    'lastName',
    'firstName',
    'phone',
    'discount',
    'bonus',
    'avgCheck',
    'sumPurchases',
    'cardLink',
    'createdAt',
  ];

  public readonly form = new FormGroup<ISearchForm>({
    search: new FormControl(null),
  });
  pageIndex$ = new BehaviorSubject(0);

  ngOnInit() {
    this.clients$ = combineLatest([
      this.form.controls.search.valueChanges,
      this.pageIndex$,
    ]).pipe(
      startWith([null, 0]),
      debounceTime(500),
      takeUntilDestroyed(this.destroyRef),
      switchMap(([inputVal]) => {
        return this.getClients(
          this.pageIndex * this.pageSize,
          this.pageSize,
          inputVal ? `phone=${inputVal}` : undefined
        );
      })
    );
  }

  public isSelected(userId: number): boolean {
    return this.selectedUserIds.has(userId);
  }

  public toggleOne(userId: number, checked: boolean): void {
    if (checked) {
      this.selectedUserIds.add(userId);
    } else {
      this.selectedUserIds.delete(userId);
    }
  }

  public isAllUserIdsOnPageSelected(clients: IClient[]): boolean {
    return (
      clients.length > 0 &&
      clients.every((client) => this.selectedUserIds.has(client.user_id))
    );
  }

  public toggleAllOnPage(clients: IClient[], checked: boolean): void {
    if (checked) {
      for (const client of clients) {
        this.selectedUserIds.add(client.user_id);
      }
    } else {
      for (const client of clients) {
        this.selectedUserIds.delete(client.user_id);
      }
    }
  }

  public changePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.pageIndex$.next(event.pageIndex);
  }

  private getClients(offset: number, limit: number, search?: string) {
    this.isLoading = true;
    this.isError = false;

    return this.clientsApi.getClients({ offset, limit, search }).pipe(
      tap((res: IClientsResponse) => {
        this.total = res.meta.size;
      }),
      map((res: IClientsResponse) => res.passes ?? []),
      catchError((err) => {
        this.isError = true;
        this.total = 0;
        this.showClientsError(err);

        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  private showClientsError(error: unknown): void {
    const msg = this.getErrorMessage(error);

    this.snackbarService.error(msg, 'Закрыть');
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        return error.error;
      }
      if (error.status === 403) {
        return error.error;
      }
      if (error.status >= 500) {
        return 'Ошибка сервера. Попробуйте позже.';
      }
      return `Ошибка загрузки клиентов: ${error.status}.`;
    }
    return 'Ошибка загрузки клиентов.';
  }

  public trackByClientId(client: IClient): number {
    return client.user_id;
  }

  public openModal() {
    if (this.selectedUserIds.size === 0) {
      this.snackbarService.warning('Выберите хотя бы одного клиента');
      return;
    }

    const userIds = Array.from(this.selectedUserIds).join(',');

    const ref = this.modal.open(PushDialogComponent, {
      width: '655px',
      data: { userIds },
      panelClass: 'custom-dialog-container',
      autoFocus: false,
    });

    ref.afterClosed().subscribe((context) => {
      if (context) {
        this.selectedUserIds.clear();
        this.cdr.markForCheck();
      }
    });
  }
}
