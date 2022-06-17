import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'substr'
})
export class SubstrPipe implements PipeTransform {

 transform(value: any, ...args: any[]): any {

    let substr = value.substr(0,15)+"...";

    return substr;
  
  }

}
