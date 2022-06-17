import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

//ruta
import { MessagesRoutingModule } from './messages-routing.module';

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
import { MessagesComponent } from './messages.component';
import { EditMessagesComponent } from './edit-messages/edit-messages.component';


@NgModule({
  declarations: [MessagesComponent, EditMessagesComponent],
  imports: [
    CommonModule,
    MessagesRoutingModule,
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
export class MessagesModule { }
