import { MatPaginatorIntl } from '@angular/material/paginator';

export function getRussianPaginator(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Элементов на странице:';
  paginatorIntl.nextPageLabel = '';
  paginatorIntl.previousPageLabel = '';
  paginatorIntl.firstPageLabel = '';
  paginatorIntl.lastPageLabel = '';

  paginatorIntl.getRangeLabel = (
    page: number,
    pageSize: number,
    length: number
  ) => {
    if (length === 0 || pageSize === 0) {
      return `0 из ${length}`;
    }

    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);

    return `${startIndex + 1} – ${endIndex} из ${length}`;
  };

  return paginatorIntl;
}
