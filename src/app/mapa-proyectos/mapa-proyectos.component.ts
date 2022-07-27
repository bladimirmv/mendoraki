import { AuthService } from './../core/services/auth.service';
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Map, marker, tileLayer, Icon, control } from 'leaflet';
import { environment } from 'src/environments/environment';

export interface Proyecto {
  uuid?: string;
  creadoEn?: Date;
  nombre?: string;
  descripcion?: string;
  categoria?: string;
  estado?: boolean;
  fechaInicio?: Date;
  fechaFinal?: Date;
  lugarProyecto?: string;
  latLng?: string;
  porcentaje?: number;
  uuidCliente?: string;
}

export interface ProyectoView extends Proyecto {
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  nombreCliente?: string;
}

@Component({
  selector: 'app-mapa-proyectos',
  templateUrl: './mapa-proyectos.component.html',
  styleUrls: ['./mapa-proyectos.component.scss'],
})
export class MapaProyectosComponent implements OnInit {
  public proyectos: Array<ProyectoView> = [];
  public option: ProyectoView | 'todos' = 'todos';
  private API_URL = environment.API_URL;
  // private API_URL = localStorage.getItem('api_url');
  private destroy$ = new Subject<any>();

  // *maps leaflet =====================================================>
  private bounds: Array<Number[]> = [];
  private mapa: Map;
  private greenIcon = new Icon({
    iconUrl: './assets/green_marker.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [32, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  private redIcon = new Icon({
    iconUrl: './assets/red_marker.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [32, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  private purpleIcon = new Icon({
    iconUrl: './assets/purple_marker.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [32, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  constructor(private http: HttpClient, private authSvc: AuthService) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.mapa = new Map('map', {
      maxZoom: 19,
    }).setView([-17.401848609775207, -66.18253244641603], 19);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.mapa);

    control.scale({ position: 'bottomleft' }).addTo(this.mapa);

    this.getAllProyecto();
  }

  // =====================> getAllProyecto
  getAllProyecto(): void {
    const authToken = this.authSvc.userTokenValue;
    this.http
      .get<ProyectoView[]>(`${this.API_URL}/api/proyecto`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.proyectos = res;
        this.initMarkers();
      });
  }

  initMarkers(): void {
    this.bounds = [];
    this.proyectos.forEach((p, i) => {
      marker([Number(p.latLng.split(',')[0]), Number(p.latLng.split(',')[1])], {
        icon: !p.estado
          ? this.purpleIcon
          : p.porcentaje === 100
          ? this.greenIcon
          : this.redIcon,
      })
        .addTo(this.mapa)
        .bindPopup(
          `
        <h1>${p.nombre}</h1>
        <div><b>Avance:</b> ${p.porcentaje}%</div>
        <div><b>Estado:</b> ${p.estado ? 'Activo' : 'Inactivo'}</div>
        <div><b>Descripcion:</b> ${p.descripcion}</div>
        <div><b>Cliente:</b> ${p.nombreCliente} ${p.apellidoPaterno} ${
            p.apellidoMaterno
          }</div>
        <div><b>Fecha:</b> ${new Date(p.fechaInicio).toLocaleDateString(
          'es'
        )} - ${new Date(p.fechaFinal).toLocaleDateString('es')}</div>
        <div><b>Direccion: </b>${p.lugarProyecto}</div>
        `,

          {
            closeButton: false,
          }
        )
        .openPopup();

      this.bounds.push([
        Number(p.latLng.split(',')[0]),
        Number(p.latLng.split(',')[1]),
      ]);
    });

    this.mapa.fitBounds(this.bounds as [[number, number]]);
  }

  public onSelectAll(): void {
    this.mapa.fitBounds(this.bounds as [[number, number]]);
  }

  onChange(): void {
    this.mapa.fitBounds(this.bounds as [[number, number]]);

    if (this.option !== 'todos') {
      this.mapa.fitBounds([
        [
          Number(this.option.latLng.split(',')[0]),
          Number(this.option.latLng.split(',')[1]),
        ],
      ]);
    }
  }
}
