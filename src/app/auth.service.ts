import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  catchError,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { AES, enc } from 'crypto-js';

export type modelUserRoleModule = {
  read: boolean;
  write: boolean;
  edit: boolean;
};

export type modelUserData = {
  token: string;
  userName: string;
  userId: number;
  userRoleIde: number;
  renewPass: boolean;
  userRoleModule: {
    [module: string]: modelUserRoleModule;
  } | null;
  userRolePanels: string[] | null;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiURL = environment.apiUrl;

  private userData: modelUserData = {
    token: '',
    userName: '',
    userId: -1,
    userRoleIde: -1,
    renewPass: false,
    userRoleModule: null,
    userRolePanels: null,
  };

  private encryptionKey: string = 'app@C0ll0qu1@25';

  constructor(private http: HttpClient) {
    this.getUserData();
  }

  getTokenApi(email: string, password: string): Observable<string> {
    const body = {
      grant_type: 'password',
      username: email,
      password: password,
      revoke_oldest: true,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    });

    return this.http
      .post<any>(`${this.apiURL}oauth/token`, body, { headers })
      .pipe(
        tap((response) => {
          this.setToken(response.access_token);
        }),
        map((response) => response.access_token),
        catchError((error) => {
          console.error('Error obteniendo el token', error);
          return throwError(
            () => new Error(error.error?.message || 'Error al obtener el token')
          );
        })
      );
  }

  // Función para cargar la información del usuario y sus módulos
  loadUserData(): Observable<any> {
    return this.getUserInfo().pipe(
      switchMap((userInfo) => {
        if (userInfo) {
          this.setUserId(userInfo.id_user);
          this.setUserName(userInfo.name);
          this.setUserRole(userInfo.role.id_role);
          this.setRenovarPass(userInfo.renew_password);
          return this.getUserModulesByRole(userInfo.role.id_role);
        }
        return throwError(
          () => new Error('No se pudo recuperar la información del usuario')
        );
      }),
      tap((response) => {
        if (response && response.data && response.data.modules) {
          this.setUserRoleModules(response.data.modules);
        }
        if (response && response.data && response.data.panels){
          this.setUserRolePanels(response.data.panels);
        }
        this.setUserData();
      }),
      catchError((error) => {
        console.error('Error recuperando módulos del usuario', error);
        return throwError(
          () => new Error(error.error?.message || 'Error al recuperar módulos')
        );
      })
    );
  }

  // Llamada al login que usa ambas funciones
  login(email: string, password: string): Observable<any> {
    return this.getTokenApi(email, password).pipe(
      switchMap((token) => {
        if (token) {
          return this.loadUserData();
        }
        return throwError(
          () => new Error('Token no recibido, autenticación fallida')
        );
      }),
      catchError((error) => {
        console.error('Error en el proceso de login', error);
        return throwError(
          () => new Error(error.message || 'Error desconocido en login')
        );
      })
    );
  }

  isTokenExpired(): boolean {
    if (this.userData.token == '') {
      return true;
    }

    const expirationTime = this.getTokenExpirationTime(this.userData.token);
    return Date.now() >= expirationTime;
  }

  getTokenExpirationTime(token: string): number {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return NaN;

    const payload = JSON.parse(atob(tokenParts[1]));
    return payload.exp * 1000; // Convert to milliseconds
  }

  localLogout(norecargar: boolean | null = null) {
    this.userData = {
      token: '',
      userName: '',
      userId: -1,
      userRoleIde: -1,
      renewPass: false,
      userRoleModule: null,
      userRolePanels: null,
    };

    localStorage.removeItem('userData');

    if (!norecargar) {
      window.location.href = './login';
    }
  }

  logout() {
    if (this.userData.token != '') {
      this.http
        .post<any>(`${this.apiURL}oauth/revoke`, null)
        .pipe(
          catchError((error) => {
            console.error('Error al cerrar sesión en la API', error);
            return of(null);
          })
        )
        .subscribe((response) => {
          console.log('Sesión cerrada con éxito', response);
        });
    }

    this.userData = {
      token: '',
      userName: '',
      userId: -1,
      userRoleIde: -1,
      renewPass: false,
      userRoleModule: null,
      userRolePanels: null,
    };

    localStorage.removeItem('userData');

    window.location.href = './login';
  }

  getToken(): string | null {
    return this.userData.token;
  }

  private setToken(token: string) {
    this.userData.token = token;
  }

  getUserName(): string | null {
    return this.userData.userName;
  }

  private setUserName(name: string) {
    this.userData.userName = name;
  }

  getUserId(): number | null {
    return this.userData.userId;
  }

  private setUserId(id: number) {
    this.userData.userId = id;
  }

  getRenovarPass(): boolean {
    return this.userData.renewPass;
  }

  setRenovarPass(nuevo: boolean) {
    this.userData.renewPass = nuevo;
  }

  getUserRole(): number | null {
    return this.userData.userRoleIde;
  }

  setUserRole(id: number) {
    this.userData.userRoleIde;
  }

  setUserRoleModules(modules: any[]) {
    if (modules.length === 0) {
      this.userData.userRoleModule = null;
      return;
    }

    this.userData.userRoleModule = modules.reduce((acc: any, module: any) => {
      acc[module.name] = {
        read: module.read,
        write: module.write,
        edit: module.edit,
      };
      return acc;
    }, {});
  }

  setUserRolePanels(panels: any[]) {
    if (panels.length === 0) {
      this.userData.userRolePanels = null;
      return;
    }

    this.userData.userRolePanels = panels
      .map((p) => p.name)
      .filter((name: string | undefined): name is string => !!name);
  }


  setUserData() {
    const userDataString = JSON.stringify(this.userData);
    const userDataCifrado = AES.encrypt(
      userDataString,
      this.encryptionKey
    ).toString();
    localStorage.setItem('userData', userDataCifrado);
  }

  getUserData() {
    const userDataCifrado = localStorage.getItem('userData');
    if (userDataCifrado) {
      const userDataJSON = AES.decrypt(
        userDataCifrado,
        this.encryptionKey
      ).toString(enc.Utf8);
      this.userData = JSON.parse(userDataJSON);
    } else {
      this.userData = {
        token: '',
        userName: '',
        userId: -1,
        userRoleIde: -1,
        renewPass: false,
        userRoleModule: null,
        userRolePanels: null,
      };
    }
  }

  hasPermission(
    moduleName: string,
    action: 'read' | 'write' | 'edit'
  ): boolean {
    // Verifica si userRoleModule no es un objeto vacío
    if (this.userData.userRoleModule) {
      const modulePermissions = this.userData.userRoleModule[moduleName];

      if (!modulePermissions) {
        return false;
      }

      return !!modulePermissions[action];
    }

    return false;
  }

  hasPanels(
    panelName: string
  ): boolean {
    if (this.userData.userRolePanels) {
      if (this.userData.userRolePanels.includes(panelName)){
        return true
      }
      return false
    }
    return false
  }

  getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}users/info/`);
  }

  getUserModulesByRole(idRole: number): Observable<any> {
    return this.http.get<any>(`${this.apiURL}roles/${idRole}`);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
