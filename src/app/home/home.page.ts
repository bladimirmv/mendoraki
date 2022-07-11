import { AuthService } from './../core/services/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  texto: string;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private router: Router,
    public authSvc: AuthService
  ) {}

  lector() {
    // this.router.navigate(['producto/', '2fe5ff3e-f808-4e6d-916a-d4959bb87227']);

    this.barcodeScanner
      .scan()
      .then((barcodeData) => {
        this.texto = barcodeData.text;

        this.router.navigate(['producto/', barcodeData.text]);
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }

  mapaProyectos(): void {
    this.router.navigate(['/mapa']);
  }
}
