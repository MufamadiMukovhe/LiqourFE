import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceCapitalize'
})
export class ReplaceCapitalizePipe implements PipeTransform {
  transform(value: any): string {
    if (value == null) return ''; // handle null or undefined values
    
    const replaced = value.replace(".", " ");
    const words = replaced.split(" ");
    const result = words.filter((word: string | any[]) => word.length > 0)
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return result;
  }
}