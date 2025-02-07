import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { headersSecure } from 'src/app/util/service/const';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-summons',
  templateUrl: './summons.page.html',
  styleUrls: ['./summons.page.scss'],
})
export class SummonsPage implements OnInit {

  constructor(private dateP: DatePipe, private spinner:NgxSpinnerService, private http: HttpClient, 
    private router: ActivatedRoute,
     private route: Router,
     private storage:Storage)
   { }

   caseNo:any
   collectSummons:any[]=[]

  ngOnInit() {
    
    this.router.paramMap.subscribe(param => {
      this.caseNo = param.get('caseId');

      this.getSummons(this.caseNo);

  })
}

public formattedDate(date:any){
  return this.dateP.transform(date,' h:mma', 'UTC');
}

 
public async getSummons(caseId: any) {
  let urlSummons = environment.eclbDomain + "api/general/get-summons/" + caseId;

  this.spinner.show();

  this.http.get<any>(urlSummons, { headers: headersSecure }).subscribe(
    async (response) => {
      console.log(response);

      this.collectSummons = response;
      
      // Save response to local storage for future fallback
      await this.storage.set(`summons_${caseId}`, response);

      this.spinner.hide();
    },
    async (error) => {
      console.error("Error fetching summons:", error);
      this.spinner.hide();

      // Fallback: Retrieve saved summons from local storage
      const savedSummons = await this.storage.get(`summons_${caseId}`);
      if (savedSummons) {
        console.log("Using saved summons data:", savedSummons);
        this.collectSummons = savedSummons;
      } else {
        console.log("No saved summons data available.");
      }
    }
  );
}


  public onSubmit(summon:any): void {
    this.spinner.show();
    this.spinner.hide();
    this.route.navigate([`/page-2/${this.caseNo}/${summon}`]);
  
  }

}
