import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

//ruta
import { DisputesRoutingModule } from './disputes-routing.module';

//Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule} from '@angular/material/dialog';
import { MatChipsModule} from '@angular/material/chips';
import { MatIconModule} from '@angular/material/icon';

//pipes
import { PipesModule } from '../../../pipes/pipes.module';

//componente
import { DisputesComponent } from './disputes.component';
import { EditDisputesComponent } from './edit-disputes/edit-disputes.component';


@NgModule({
  declarations: [DisputesComponent, EditDisputesComponent],
  imports: [
    CommonModule,
    DisputesRoutingModule,   
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
export class DisputesModule { }

