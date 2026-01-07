import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tareas-cargar-csv',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './tareas-cargar-csv.component.html',
  styleUrl: './tareas-cargar-csv.component.css',
})
export class TareasCargarCsvComponent {
  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  constructor(public dialogRef: MatDialogRef<TareasCargarCsvComponent>) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    const isCsv = fileName.endsWith('.csv');
    const isXlsx = fileName.endsWith('.xlsx');

    if (!isCsv && !isXlsx) {
      alert('Solo se permiten archivos CSV o Excel (.xlsx)');
      return;
    }

    this.selectedFile = file;
    this.selectedFileName = file.name;
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  subirCsv(): void {
    if (!this.selectedFile) {
      alert('Debe seleccionar un archivo CSV');
      return;
    }

    // Devolvemos el archivo al componente padre
    this.dialogRef.close(this.selectedFile);
  }
}
