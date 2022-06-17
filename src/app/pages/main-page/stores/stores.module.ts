import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

//ruta
import { StoresRoutingModule } from './stores-routing.module';

//componente
import { StoresComponent } from './stores.component';

//Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';

//pipes
import { PipesModule } from '../../../pipes/pipes.module';
import { EditStoresComponent } from './edit-stores/edit-stores.component';

@NgModule({
  declarations: [StoresComponent, EditStoresComponent],
  imports: [
    CommonModule,
    StoresRoutingModule,
     MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    PipesModule
  ]
})
export class StoresModule { }
