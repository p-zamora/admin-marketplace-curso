import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessagesService } from 'src/app/services/messages.service';
import { DisputesService } from 'src/app/services/disputes.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit{

  /*=============================================
  Variable global para definir mensajes sin responder
  =============================================*/
  messages = 0;

  /*=============================================
  Variable global para definir disputa sin responder
  =============================================*/
  disputes = 0;

  constructor(private router: Router, public messagesService: MessagesService, public disputesService: DisputesService) { }

  ngOnInit(): void {

    this.getMessages();
    this.getDisputes();
  }

  /*=============================================
   Mensajes sin responder
  =============================================*/

  getMessages(){

    this.messagesService.getFilterData("receiver", environment.nameStore)
    .subscribe()

  }

  /*=============================================
  Disputas sin responder
  =============================================*/

  getDisputes(){
 
    this.disputesService.getFilterData("receiver", environment.nameStore)
    .subscribe();

  }

  /*=============================================
  Función de salida del sistema
  =============================================*/
  logout(){

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.router.navigateByUrl("/login");
  }

}
