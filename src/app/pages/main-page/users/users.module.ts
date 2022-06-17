import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//ruta
import { UsersRoutingModule } from './users-routing.module';

//componente
import { UsersComponent } from './users.component';


//Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

//pipes
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    PipesModule
  ]
})
export class UsersModule { }
