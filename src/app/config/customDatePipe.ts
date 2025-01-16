import { Pipe, PipeTransform } from '@angular/core';

import moment from 'moment-timezone';

@Pipe({
  name: 'customDatePipe'
})
export class CustomDatePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    return moment.tz(value, 'Africa/Johannesburg').format("DD MMM YYYY [at]  HH:mm a");
  }
}