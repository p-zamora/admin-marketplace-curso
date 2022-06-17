import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

//ruta
import { CategoriesRoutingModule } from './categories-routing.module';

//componente
import { CategoriesComponent } from './categories.component';

//Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';

//pipes
import { PipesModule } from '../../../pipes/pipes.module';

//componentes para diálogos
import { NewCategoriesComponent } from './new-categories/new-categories.component';
import { EditCategoriesComponent } from './edit-categories/edit-categories.component';

@NgModule({
  declarations: [CategoriesComponent, NewCategoriesComponent, EditCategoriesComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    PipesModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule
  ]
})
export class CategoriesModule { }
