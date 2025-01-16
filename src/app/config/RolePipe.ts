import { Pipe, PipeTransform } from "@angular/core";
import moment from "moment";

@Pipe({
    name: 'rolePipe'
})
export class CustomRolePipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return value;
        switch (value) {
            case "1":
                return "Director";
            case "2":
                return "Share Holder";
            case "3":
                return "Partner";
            case "4":
                return "Proxy";
            case "5":
                return "Owner";
            default:
                return "";
        }
    }
}