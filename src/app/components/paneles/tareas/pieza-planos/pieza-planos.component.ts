import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PdfService } from '../../../../services/pdf.service.service';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pieza-planos',
  imports: [NgxExtendedPdfViewerModule, MatProgressSpinnerModule, CommonModule, MatDialogContent, MatDialogActions],
  templateUrl: './pieza-planos.component.html',
  styleUrls: ['./pieza-planos.component.css'],
})
export class PiezaPlanosComponent implements OnInit, OnDestroy {
  pdfSrc: string = '';
  loading = true;
  errorCarga = false;
  private sub = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<PiezaPlanosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id_part: number; title?: string },
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    if (!this.data?.id_part) {
      this.dialogRef.close();
      return;
    }
    this.loadPdf();
  }

  loadPdf() {
    this.sub.add(
      this.pdfService.getPdf(this.data.id_part).subscribe({
        next: (url) => {
          this.pdfSrc = url;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorCarga = true;
          this.loading = false;
        },
      })
    );
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    if (this.pdfSrc) {
      URL.revokeObjectURL(this.pdfSrc);
    }
    this.sub.unsubscribe();
  }

  onLoadComplete() {
    console.log('PDF cargado correctamente');
  }

  onError(event: any) {
    console.error('Error al cargar PDF:', event);
    this.errorCarga = true;
  }
}
