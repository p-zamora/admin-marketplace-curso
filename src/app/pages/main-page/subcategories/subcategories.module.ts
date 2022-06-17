import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

//ruta
import { SubcategoriesRoutingModule } from './subcategories-routing.module';

//componente
import { SubcategoriesComponent } from './subcategories.component';

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
import { NewSubcategoriesComponent } from './new-subcategories/new-subcategories.component';
import { EditSubcategoriesComponent } from './edit-subcategories/edit-subcategories.component';

@NgModule({
  declarations: [SubcategoriesComponent, NewSubcategoriesComponent, EditSubcategoriesComponent],
  imports: [
    CommonModule,
    SubcategoriesRoutingModule,
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
export class SubcategoriesModule { }
