import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'wordSplit'
})
export class WordSplitPipe implements PipeTransform {
    transform(value: any): string {
        if (value == null) return '';

        return value.split(/(?=[A-Z])/).join(' ');
    }
}