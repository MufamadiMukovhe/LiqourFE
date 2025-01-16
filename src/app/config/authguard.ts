import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { HelperService } from "../service/helper";
import Swal from "sweetalert2";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {

    decodedToken:any;
    constructor(private router:Router,private helper:HelperService){}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        let url: string = state.url;
        return this.userLogIn(next, url);
    }

    userLogIn(route:ActivatedRouteSnapshot, url: any):boolean{
        if(this.router.url === "/login")
            return true;

        if(this.helper.isLoggedIn()){
            
            const role =this.helper.getRole();
            const allowedRoles = route.data['roles'];

            console.log("role=" + role);
            console.log("allowedRoles=" + allowedRoles);

            if(allowedRoles){

                /*var session = window.sessionStorage.getItem('REGISTRATION_TYPE');
                if(session === null || session === 'null' || session === undefined){
                    console.log("session not allowed");
                    return false;
                }*/

                if(!allowedRoles.includes(role)){
                    Swal.fire({
                        icon: "warning",
                        title: "Oops...",
                        text: " You do not have the necessary permissions to access this page.",
                        showConfirmButton:false,timer:10000
                      });
                    return false;
                }
            }
            return true;
        }
        this.router.navigateByUrl('/login')
        return false;
    }
}