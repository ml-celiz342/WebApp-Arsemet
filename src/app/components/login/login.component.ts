import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Para usar ngModel
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  hide = signal(true);
  email: string = '';
  password: string = '';
  loginError: string | null = null;
  isLoading: boolean = false;
  isLoggedIn: boolean = false;
  isRenewPass: boolean = false;
  currentYear!: number;
  private _snackBar = inject(MatSnackBar);

  contraseneaN: string = '';
  contraseneaRN: string = '';

  hideContraseneaN = signal(true);
  hideRContraseneaN = signal(true);

  validationErrorsN: string[] = [];

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private router: Router
  ) {
    if (this.authService.getRenovarPass()) {
      this.isRenewPass = true;
    }
  }

  clickEventHide(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
  }

  onLogin() {
    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        if (this.authService.getRenovarPass()) {
          this.isRenewPass = true;
        } else {
          this.isLoggedIn = true;
          this.router.navigate(['./home']);
          this._snackBar.open('Ingreso exitoso!', 'Cerrar', { duration: 3000 });
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login failed:', error);

        // Error específico no manejado por el interceptor
        if (error.status === 400 && error.error?.error_description) {
          this.loginError = error.error.error_description;
        } else {
          this.loginError = 'Usuario o contraseña inválidos';
        }

        this._snackBar.open(
          `Fallo en inicio de sesión: ${this.loginError}`,
          'Cerrar',
          { duration: 3000, panelClass: 'error-snackbar' }
        );
      },
    });
  }

  validatePasswordN() {
    const errors = [];

    if (this.contraseneaN.length < 12 || this.contraseneaN.length > 32) {
      errors.push('Debe tener entre 12 y 32 caracteres.');
    }
    if (!/[a-z]/.test(this.contraseneaN)) {
      errors.push('Debe contener al menos una letra minúscula.');
    }
    if (!/[A-Z]/.test(this.contraseneaN)) {
      errors.push('Debe contener al menos una letra mayúscula.');
    }
    if (!/\d/.test(this.contraseneaN)) {
      errors.push('Debe contener al menos un número.');
    }
    if (!/[$@$!%*?&_]/.test(this.contraseneaN)) {
      errors.push('Debe contener al menos un carácter especial ($@$!%*?&_).');
    }

    this.validationErrorsN = errors;
  }

  clickEventHideContraseneaN(event: MouseEvent) {
    this.hideContraseneaN.set(!this.hideContraseneaN());
    event.stopPropagation();
  }

  clickEventRHideContraseneaN(event: MouseEvent) {
    this.hideRContraseneaN.set(!this.hideRContraseneaN());
    event.stopPropagation();
  }

  onRenovarClave() {
    const userId = this.authService.getUserId();
    if (
      userId &&
      this.contraseneaN != '' &&
      this.contraseneaRN == this.contraseneaN &&
      this.validatePasswordN.length === 0
    ) {
      this.isLoading = true;
      this.userService
        .updateContraseneaUsuario(this.contraseneaN, userId)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.authService.localLogout(true);
            this.isRenewPass = false;
            this._snackBar.open('Clave renovada', 'Cerrar', {
              duration: 3000,
            });
          },
          error: (error) => {
            this.isLoading = false;
            this.authService.localLogout(true);
            this.isRenewPass = false;
            this._snackBar.open(`Fallo al renovar la clave`, 'Cerrar', {
              duration: 3000,
              panelClass: 'error-snackbar',
            });
          },
        });
    }
  }
}
