import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapaProyectosRoutingModule } from './mapa-proyectos-routing.module';
import { MapaProyectosComponent } from './mapa-proyectos.component';

@NgModule({
  declarations: [MapaProyectosComponent],
  imports: [CommonModule, MapaProyectosRoutingModule, IonicModule, FormsModule],
})
export class MapaProyectosModule {}
