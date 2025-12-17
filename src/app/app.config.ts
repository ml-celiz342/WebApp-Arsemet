import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptorInterceptor } from './htt-interceptor.interceptor';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { importProvidersFrom } from '@angular/core';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorIntlEspañol } from './paginator-español';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([httpInterceptorInterceptor])),
    importProvidersFrom(MatNativeDateModule), // Agregar módulo nativo de fechas
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' }, // Configurar idioma a español (Argentina)
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlEspañol}
  ],
};
