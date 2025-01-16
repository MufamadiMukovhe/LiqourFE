import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneyFormat'
})
export class MoneyFormatPipe implements PipeTransform {
  transform(value: any): string {
    if (value == null) return ''; // handle null or undefined values
    
    // Format the number into currency format with comma separators and two decimal places
    const formattedValue = value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Concatenate 'R' symbol with the formatted value
    return 'R' + formattedValue;
  }
}