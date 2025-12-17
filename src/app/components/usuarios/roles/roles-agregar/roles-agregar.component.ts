import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Para usar ngModel
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Roles, RoleModule, NewRol, RolePanels } from '../../../../models/roles';
import { NewModulo } from '../../../../models/modulos';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-roles-agregar',
  imports: [
    CommonModule,
    MatInputModule,
    MatOptionModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCheckbox,
  ],
  templateUrl: './roles-agregar.component.html',
  styleUrl: './roles-agregar.component.css',
})
export class RolesAgregarComponent {
  dataSourcePermisos = new MatTableDataSource<RoleModule>([]);
  dataSourcePaneles = new MatTableDataSource<RolePanels>([]);

  nombre: string = '';
  token_duracion?: number;
  token_cantidad?: number;
  isEditMode: boolean = false;
  rolAnterior?: Roles;
  modulosAnteriores?: RoleModule[];
  panelesAnteriores?: RolePanels[];
  displayedColumns: string[] = ['name', 'read', 'write', 'edit'];
  displayedColumnsPaneles: string[] = ['name', 'view'];

  constructor(
    public dialogRef: MatDialogRef<RolesAgregarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataSourcePermisos.data = this.data.modulos;
    this.dataSourcePaneles.data = this.data.paneles;

    this.isEditMode = data.isEditMode || false;

    if (this.isEditMode && data.roles && data.permisos) {
      this.rolAnterior = data.roles;
      this.modulosAnteriores = this.data.permisos.module;
      this.panelesAnteriores = this.data.permisos.panels;

      if (this.rolAnterior) {
        this.nombre = this.rolAnterior.nombre;
        this.token_cantidad = this.rolAnterior.token_cantidad;
        this.token_duracion = this.rolAnterior.token_duracion;
      }

      if (this.modulosAnteriores) {
        // Modificar los módulos existentes
        this.modulosAnteriores.forEach((mod: any) => {
          const index = this.dataSourcePermisos.data.findIndex(
            (module: any) => module.idModulo === mod.idModulo
          );

          if (index !== -1) {
            // Aquí editas el módulo que ya existe
            this.dataSourcePermisos.data[index].editar = mod.editar;
            this.dataSourcePermisos.data[index].leer = mod.leer;
            this.dataSourcePermisos.data[index].escribir = mod.escribir;
          }
        });
      }

      if (this.panelesAnteriores) {
        this.panelesAnteriores.forEach((pan: any)=>{
          const index = this.dataSourcePaneles.data.findIndex(
            (panel: any) => panel.idPanel === pan.idPanel
          );

          if (index !== -1) {
            this.dataSourcePaneles.data[index].ver = pan.ver;
          }
        });
      }

    }
  }

  ngOnInit(): void {}

  close(): void {
    this.dialogRef.close();
  }

  guardarRol(): void {
    if (this.nombre && this.token_duracion && this.token_cantidad) {
      var nuevoRol: NewRol = {};
      var nuevoModulo: RoleModule[] = [];
      var editarModulo: RoleModule[] = [];
      var eliminarModulo: RoleModule[] = [];

      var nuevoPanel: RolePanels[] = [];
      var eliminarPanel: RolePanels[] = [];

      if (this.isEditMode) {
        if (this.nombre != this.rolAnterior?.nombre) {
          nuevoRol.nombre = this.nombre;
        }
        if (this.token_duracion != this.rolAnterior?.token_duracion) {
          nuevoRol.token_duracion = Number(this.token_duracion);
        }
        if (this.token_cantidad != this.rolAnterior?.token_cantidad) {
          nuevoRol.token_cantidad = Number(this.token_cantidad);
        }

        if (this.modulosAnteriores && this.modulosAnteriores.length != 0) {
          // Verificar cambios en los permisos
          this.dataSourcePermisos.data.forEach((mod: any) => {
            const moduloOriginal = this.modulosAnteriores?.find(
              (m) => m.idModulo === mod.idModulo
            );

            if (!moduloOriginal) {
              // Si el módulo no existía antes, se agrega a NUEVO MODULO
              if (mod.leer || mod.escribir || mod.editar) {
                nuevoModulo.push({
                  idModulo: mod.idModulo,
                  nombre: mod.nombre,
                  leer: mod.leer,
                  escribir: mod.escribir,
                  editar: mod.editar,
                });
              }
            } else {
              const teniaTodosFalse =
                !moduloOriginal.leer &&
                !moduloOriginal.escribir &&
                !moduloOriginal.editar;

              const tieneAlMenosUnoTrue =
                mod.leer || mod.escribir || mod.editar;

              if (teniaTodosFalse && tieneAlMenosUnoTrue) {
                // Si antes tenía todo en false y ahora al menos un permiso es true
                nuevoModulo.push({
                  idModulo: mod.idModulo,
                  nombre: mod.nombre,
                  leer: mod.leer,
                  escribir: mod.escribir,
                  editar: mod.editar,
                });
              } else if (
                moduloOriginal.leer !== mod.leer ||
                moduloOriginal.escribir !== mod.escribir ||
                moduloOriginal.editar !== mod.editar
              ) {
                // Si hubo algún cambio en los permisos, pero no es una adición nueva
                if (tieneAlMenosUnoTrue) {
                  editarModulo.push({
                    idModulo: mod.idModulo,
                    nombre: mod.nombre,
                    leer: mod.leer,
                    escribir: mod.escribir,
                    editar: mod.editar,
                  });
                }
              }
              // Si ahora tiene todo en false, se elimina
              if (!mod.leer && !mod.escribir && !mod.editar) {
                eliminarModulo.push({
                  idModulo: mod.idModulo,
                  nombre: mod.nombre,
                  leer: false,
                  escribir: false,
                  editar: false,
                });
              }
            }
          });
        } else {
          nuevoModulo = this.dataSourcePermisos.data.filter(
            (mod) =>
              mod.editar !== false ||
              mod.escribir !== false ||
              mod.leer !== false
          );
        }

        //paneles
        if (this.panelesAnteriores && this.panelesAnteriores.length != 0) {
          // Verificar cambios en los permisos
          this.dataSourcePaneles.data.forEach((pan: any) => {
            const panelOriginal = this.panelesAnteriores?.find(
              (p) => p.idPanel === pan.idPanel
            );

            if (!panelOriginal) {
              // Si el panel no existía antes, se agrega a NUEVO panel
              if (pan.ver) {
                nuevoPanel.push({
                  idPanel: pan.idPanel,
                  nombre: pan.nombre,
                  ver: pan.ver,
                });
              }
            } else {
              // Si ahora tiene todo en false, se elimina
              if (!pan.ver) {
                eliminarPanel.push({
                  idPanel: pan.idPanel,
                  nombre: pan.nombre,
                  ver: pan.ver,
                });
              }
            }
          });
        } else {
          nuevoPanel = this.dataSourcePaneles.data.filter(
            (pan) => pan.ver !== false
          );
        }
      } else {
        // Modo creación de rol
        nuevoRol.nombre = this.nombre;
        nuevoRol.token_duracion = this.token_duracion;
        nuevoRol.token_cantidad = this.token_cantidad;

        nuevoModulo = this.dataSourcePermisos.data.filter(
          (mod) =>
            mod.editar !== false || mod.escribir !== false || mod.leer !== false
        );

        nuevoPanel = this.dataSourcePaneles.data.filter(
          (pan) =>
            pan.ver !== false
        )
      }
      this.dialogRef.close({
        nuevoRol,
        nuevoModulo,
        editarModulo,
        eliminarModulo,
        nuevoPanel,
        eliminarPanel,
      }); // Devuelve el objeto con los datos modificados
      return;
    }
    this.dialogRef.close();
  }
}
