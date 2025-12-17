import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SesionesInfoComponent } from "./sesiones-info/sesiones-info.component";
import { MatCardModule } from '@angular/material/card';
import { SessionsInfo } from '../../../models/sessions-info';
import { SessionService } from '../../../services/session.service';
import { SessionsUsers } from '../../../models/sessions-users';
import { SessionsDevices } from '../../../models/sessions-devices';
import { forkJoin, interval, Observable, Subscription, switchMap, tap } from 'rxjs';

import { MatTableModule } from '@angular/material/table';


@Component({
  selector: 'app-sesiones',
  standalone: true,
  imports: [CommonModule, SesionesInfoComponent, MatCardModule, MatTableModule],
  templateUrl: './sesiones.component.html',
  styleUrl: './sesiones.component.css',
})
export class SesionesComponent {
  sesionesUser: SessionsUsers[] = [];
  sesionesDevice: SessionsDevices[] = [];

  sesionesUsersInfo: SessionsInfo[] = [];
  totalUsersInfo: number = 0;
  pageSizeUsersInfo: number = 20;
  currentPageUsersInfo: number = 0;

  sesionesAssetsInfo: SessionsInfo[] = [];
  totalAssetsInfo: number = 0;
  pageSizeAssetsInfo: number = 20;
  currentPageAssetsInfo: number = 0;

  private intervalId: any;

  // Tablas
  displayedUserColumns: string[] = ['name', 'status'];
  displayedDeviceColumns: string[] = ['code_assets', 'serie_number', 'status'];

  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    this.loadSessionsUser();
    this.loadSessionsDevice();
    this.loadInfoUser();
    this.loadInfoAssets();
    this.startAutoRefresh();
  }

  loadSessionsUser() {
    this.sessionService.getSesionsUsers().subscribe({
      next: (response) => {
        this.sesionesUser = response;
      },
    });
  }

  loadSessionsDevice() {
    this.sessionService.getSesionsDevices().subscribe({
      next: (response) => {
        this.sesionesDevice = response;
      },
    });
  }

  loadInfoUser() {
    this.sessionService
      .getSesionsInfoUsers(this.currentPageUsersInfo, this.pageSizeUsersInfo)
      .subscribe({
        next: (response) => {
          this.sesionesUsersInfo = response.data;
          this.totalUsersInfo = response.total;
        },
        error: (err) => console.error('Error al obtener datos:', err),
      });
  }

  onPageChangeUser(event: any) {
    this.currentPageUsersInfo = event.pageIndex;
    this.pageSizeUsersInfo = event.pageSize;
    this.loadInfoUser();
  }

  loadInfoAssets() {
    this.sessionService
      .getSesionsInfoAssets(this.currentPageAssetsInfo, this.pageSizeAssetsInfo)
      .subscribe({
        next: (response) => {
          this.sesionesAssetsInfo = response.data;
          this.totalAssetsInfo = response.total;
        },
        error: (err) => console.error('Error al obtener datos:', err),
      });
  }

  onPageChangeAssets(event: any) {
    this.currentPageAssetsInfo = event.pageIndex;
    this.pageSizeAssetsInfo = event.pageSize;
    this.loadInfoAssets();
  }

  startAutoRefresh(): void {
    const refreshInterval = 300000;

    this.intervalId = setInterval(() => {
      this.loadSessionsUser();
      this.loadSessionsDevice();
      this.loadInfoUser();
      this.loadInfoAssets();
    }, refreshInterval);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
