import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByStatus'
})
export class FilterByStatusPipe implements PipeTransform {

  transform(items: any[], status: string, licenseCategory?: string): any[] {
    if (!items || !status) {
      return items;
    }

    // Filter by status and exclude items with licenseCategory "Special Event"
    return items.filter(item => 
      item.status === status && item.licenseCategory !== 'Special Event'
    );
  }

}
