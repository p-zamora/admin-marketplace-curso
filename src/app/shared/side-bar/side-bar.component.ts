import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

	constructor(private router: Router) { }

	ngOnInit(): void {
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
