import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private sharedData: string='';

  constructor() { }

  setData(data: any) {
    this.sharedData = JSON.stringify(data);
    
  }

  getData() {
    
    return this.sharedData;
    
  }
}
