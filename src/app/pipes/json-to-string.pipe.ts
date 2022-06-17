import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonToString'
})
export class JsonToStringPipe implements PipeTransform {

  transform(value: any, ...args: any): any {
    
  	if(value){		

  		let arr = JSON.parse(value);
  		let str = "";

  		for(const i in arr){

  			str += arr[i]+", ";

  		}

  		str = str.slice(0,-2);

  		return str;
  	}

  }

}
