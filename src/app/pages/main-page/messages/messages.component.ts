import { Component, OnInit, ViewChild } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { Imessages } from 'src/app/interface/imessages';
import { environment } from 'src/environments/environment';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MessagesService } from 'src/app/services/messages.service';
import { MatDialog } from '@angular/material/dialog';
import { functions } from 'src/app/helpers/functions';
import { EditMessagesComponent } from './edit-messages/edit-messages.component';
import { NavBarComponent } from '../../../shared/nav-bar/nav-bar.component';

@Component({
  providers: [NavBarComponent],
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  animations: [
      trigger('detailExpand', [
        state('collapsed, void', style({height: '0px', minHeight: '0', display: 'none'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
      ])
    ]
})
export class MessagesComponent implements OnInit {

  /*=============================================
  Variable para nombrar las columnas de nuestra tabla en Angular Material
  =============================================*/
  displayedColumns: string[] = [  'position', 
                                  'url_product',
                                  'actions'];

  /*=============================================
  Variable global que instancie la data que aparecerá en la Tabla
  =============================================*/
  dataSource!:MatTableDataSource<Imessages>;

  /*=============================================
  Variable global que tipifica la interfaz de mensajes
  =============================================*/
  messages:Imessages[] = [];

   /*=============================================
  Variable global que informa a la vista cuando hay una expansión de la tabla
  =============================================*/
  expandedElement!: Imessages | null;

   /*=============================================
  Variable global que captura la ruta del marketplace público
  =============================================*/
  domainMP = environment.domainMP;


  /*=============================================
  Variable global para definir tamaños de pantalla
  =============================================*/
  screenSizeSM = false;

  /*=============================================
  Variable global para saber cuando finaliza la carga de los datos
  =============================================*/
  loadData = false;

  /*=============================================
  Paginación y orden
  =============================================*/
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private messagesService: MessagesService, public dialog: MatDialog, private navBarComponent:NavBarComponent ) { }

  ngOnInit(): void {

      this.getData();

      /*=============================================
      Definir tamaños de pantalla
      =============================================*/

      if(functions.screenSize(0, 767)){

        this.screenSizeSM = true;

      }else{

        this.screenSizeSM = false;

        this.displayedColumns.splice(2, 0, 'transmitter');
        this.displayedColumns.splice(2, 0, 'receiver');
        this.displayedColumns.splice(3, 0, 'message');
        
      }
  
  }

  /*=============================================
  función para tomar la data de mensajes
  =============================================*/

  getData(){

      this.loadData = true;

      this.messagesService.getData().subscribe((resp:any)=>{

         /*=============================================
        Integrando respuesta de base de datos con la interfaz
        =============================================*/

        let position = 1;

        this.messages = Object.keys(resp).map(a=> ({
          id: a,
          position: position++,
          answer : resp[a].answer,
          date_answer : resp[a].date_answer,
          date_message : resp[a].date_message,
          message : resp[a].message,
          url_product : resp[a].url_product,
          receiver : resp[a].receiver,
          transmitter : resp[a].transmitter
        } as Imessages ));

        this.dataSource = new MatTableDataSource(this.messages);  

        this.dataSource.paginator = this.paginator;

        this.dataSource.sort = this.sort;

        this.loadData = false;

      })
      

  }

  /*=============================================
  Filtro de Búsqueda
  =============================================*/

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

   /*=============================================
  función para llamar el diálogo de edición de mensajes
  =============================================*/

  editMessage(id:string){

    const dialogRef = this.dialog.open(EditMessagesComponent,{
      width:"70%",
      data: {
        id: id
      }

    })

    /*=============================================
    Actualizar el listado de la tabla
    =============================================*/

    dialogRef.afterClosed().subscribe(result =>{

      if(result){

        this.getData();

        this.navBarComponent.getMessages();

      }

    })

  }


}
