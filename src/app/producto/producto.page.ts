import { environment } from './../../environments/environment.prod';
import { ProductoView } from '../models/producto.interface';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
// import Swiper core and required modules
@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage implements OnInit {
  public producto: ProductoView;
  public peticion = '';
  public slideOptions = {
    slidesPerView: 1.1,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
  };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private API_URL = environment.API_URL;
  private uuid = '';

  constructor(
    private http: HttpClient,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.uuid = this.activateRoute.snapshot.params.uuid;

    if (!this.uuid) {
      this.router.navigate(['home']);
    }

    this.peticion = `${this.API_URL}/api/producto/${this.uuid}`;

    return this.http
      .get<ProductoView>(`${this.API_URL}/api/producto/${this.uuid}`)
      .subscribe((res: ProductoView) => {
        this.producto = res;
        if (!res) {
          this.router.navigate(['home']);
        }
      });
  }

  getImage(uri: string): string {
    return `${this.API_URL}/api/file/${uri}`;
  }

  public getDescuento(): string {
    let result = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.producto.descuento > 100 || this.producto.descuento < 0
      ? (result = 0)
      : (result =
          this.producto.precio -
          (this.producto.precio * this.producto.descuento) / 100);
    return result.toFixed(2);
  }

  public alertStock(stock: number): string {
    return stock <= 3 && stock > 1
      ? `⏳ Solo quedan ${stock}!`
      : stock === 1
      ? `⏳ Solo queda uno!`
      : stock < 1
      ? `⛔ Agotado!`
      : `Disponible: ${stock}`;
  }

  public stockColor(stock: number): string {
    return stock > 3 ? 'stock-disponible' : 'stock-agotado';
  }

  onSwiper(swiper) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }
}
