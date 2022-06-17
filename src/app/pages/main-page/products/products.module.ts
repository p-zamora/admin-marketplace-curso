import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

//ruta
import { ProductsRoutingModule } from './products-routing.module';

//componente
import { ProductsComponent } from './products.component';

//Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

// Drop Zone
import { NgxDropzoneModule } from 'ngx-dropzone';

//SummerNote
import { NgxSummernoteModule } from 'ngx-summernote';

//pipes
import { PipesModule } from '../../../pipes/pipes.module';


//Componente de Diálogo
import { ApproveProductComponent } from './approve-product/approve-product.component';
import { NewProductComponent } from './new-product/new-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';


@NgModule({
  declarations: [ProductsComponent, ApproveProductComponent, NewProductComponent, EditProductComponent],
  imports: [
 	CommonModule,
    ProductsRoutingModule,
 	MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    PipesModule,
    MatSlideToggleModule,
    NgxDropzoneModule,
    NgxSummernoteModule
  ]
})
export class ProductsModule { }
