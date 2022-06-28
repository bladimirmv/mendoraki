import { ToastController } from '@ionic/angular';
import { UsuarioResponse } from './../models/usuario.interface';
import { Usuario } from './../models/usuario.interface';
import { AuthService } from './../core/services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public year: number = new Date().getUTCFullYear();
  public username = 'blado959';
  public password = 'bmvmendo123';
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public url_api: string;

  private destroy$: Subject<any> = new Subject<any>();

  constructor(private authSvc: AuthService) {}
  ngOnInit(): void {
    this.authSvc.checkToken();
    this.checkUserStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  public onLogIn(): void {
    this.authSvc
      .login({
        username: this.username,
        contrasenha: this.password,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: UsuarioResponse) => {
        if (res) {
          this.authSvc.roleNavigate(res.body);
        }
      });
  }

  public setUrlApi(): void {
    localStorage.setItem('api_url', this.url_api);
    const api = localStorage.getItem('api_url');
    this.authSvc.toast(api, 'api', 'primary');
  }

  private checkUserStatus(): void {
    this.authSvc.usuario$
      .pipe(takeUntil(this.destroy$))
      .subscribe((usuario: Usuario) => {
        if (usuario) {
          this.authSvc.roleNavigate(usuario);
        }
      });
  }
}
