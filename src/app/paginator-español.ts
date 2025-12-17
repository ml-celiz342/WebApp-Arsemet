import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

// Extendemos la clase MatPaginatorIntl para personalizar las etiquetas
@Injectable()
export class MatPaginatorIntlEspañol extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Elementos por página'; // Traducción para "Items per page"
  override nextPageLabel = 'Siguiente página'; // Traducción para "Next page"
  override previousPageLabel = 'Página anterior'; // Traducción para "Previous page"
  override firstPageLabel = 'Primera página'; // Traducción para "First page"
  override lastPageLabel = 'Última página'; // Traducción para "Last page"

  // Esto es para ajustar el formato de la cantidad de elementos en el rango
  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    return `${startIndex + 1} – ${endIndex} de ${length}`;
  };
}
