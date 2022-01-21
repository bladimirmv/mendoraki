import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { JwtHelperService } from '@auth0/angular-jwt';

import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { RoleValidator } from './../../models/usuario.interface';
import { Usuario } from './../../models/usuario.interface';
import { UsuarioResponse } from './../../models/usuario.interface';
import { environment } from './../../../environments/environment.prod';

import { Router } from '@angular/router';

import { ToastController } from '@ionic/angular';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root',
})
export class AuthService extends RoleValidator {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private API_URL = environment.API_URL;
  private loggedIn = new BehaviorSubject<boolean>(false);
  private usuario = new BehaviorSubject<Usuario>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public usuario$: Observable<Usuario> = this.usuario.asObservable();
  private usuarioToken = new BehaviorSubject<string>(null);
  // ====================================================================
  constructor(
    private http: HttpClient,
    public toastController: ToastController,
    private router: Router
  ) {
    super();
    this.checkToken();
  }
  // ====================================================================
  get isLogged(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get userTokenValue(): string {
    return this.usuarioToken.getValue();
  }
  // ====================================================================
  public login(authData: Usuario): Observable<UsuarioResponse | void> {
    return this.http
      .post<UsuarioResponse>(`${this.API_URL}/api/auth/login`, authData)
      .pipe(
        map((usuario: UsuarioResponse) => {
          this.usuario.next(usuario.body);
          this.saveToken(usuario.token);
          this.loggedIn.next(true);
          this.usuarioToken.next(usuario.token);
          return usuario;
        }),
        catchError((err) => this.handdleError(err))
      );
  }
  // ====================================================================
  public logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.usuario.next(null);
    this.usuarioToken.next(null);
    this.router.navigate(['/']);
  }
  // ====================================================================
  public checkToken(): any {
    const usuarioToken = localStorage.getItem('token') || null;
    if (usuarioToken) {
      const isExpired = helper.isTokenExpired(usuarioToken);
      const { iat, exp, ...usuarioJwt } = helper.decodeToken(usuarioToken);

      if (isExpired) {
        this.logout();

        this.toast(
          'La sesion ha expirado, porfavor inicia sesion nuevamente',
          '',
          'warning'
        );
      }

      this.loggedIn.next(true);
      this.usuarioToken.next(usuarioToken);
      this.usuario.next(usuarioJwt);
    }
  }
  // ====================================================================
  public saveToken(token: string): void {
    localStorage.setItem('token', token);
  }
  // ====================================================================
  public roleNavigate(usuario: Usuario): void {
    switch (usuario.rol) {
      case 'administrador' || 'vendedor' || 'arquitecto':
        this.router.navigate(['/home']);
        this.toast(`${usuario.nombre} `, 'Bienvenido! 👋', 'primary');

        break;
      default:
        break;
    }
  }
  // ====================================================================
  private handdleError(httpError: HttpErrorResponse | any): Observable<never> {
    let errorMessage = '';

    if (httpError.error.message) {
      if (typeof httpError.error.message === 'string') {
        errorMessage = `${httpError.error.message}`;
      } else if (httpError.error.message.errno) {
        switch (httpError.error.message.errno) {
          case -111:
            errorMessage =
              'No se ha podido establecer una conexion con la base de datos. 🙁';
            break;

          default:
            errorMessage = `
            Error: ${httpError.statusText} </br>
            Status: ${httpError.status}`;
            break;
        }
      }
    }
    console.log('this error', httpError);

    this.toast(errorMessage, 'OCURRIO UN ERROR', 'danger');

    return throwError(httpError);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  async toast(message: string, header: string, color: string) {
    const toast = await this.toastController.create({
      header,
      message,
      icon: 'terminal-outline',
      position: 'top',
      duration: 3000,
      color,
    });
    await toast.present();
  }

  // ====================================================================
}
