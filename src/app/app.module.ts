import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, ModalController } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ViewImagePageModule } from './pages/view-image/view-image.module';
import { MenuController } from '@ionic/angular'; 
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; 
import { IonicStorageModule } from '@ionic/storage-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpRequestInterceptor } from './util/service/interceptor';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { DatePipe, NgClass } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NetworkService } from './util/service/network.service';
import { NetworkAlertComponent } from './pages/components/network-alert/network-alert.component';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';



const dbConfig: DBConfig  = {
  name: 'MyDb',
  version: 1,
  objectStoresMeta: [{
    store: 'files',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'fileName', keypath: 'fileName', options: { unique: false } },
      { name: 'fileData', keypath: 'fileData', options: { unique: false } }
    ]
  }]
};


@NgModule({
  declarations: [
    AppComponent,
    NetworkAlertComponent,
    
  ],
  imports: [
    BrowserModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    HttpClientModule,
    IonicModule.forRoot({
      animated: false 
    }),
    AppRoutingModule,
    ViewImagePageModule,
    NoopAnimationsModule,
    IonicStorageModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
   
    
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ModalController ,// Add ModalController to the providers array
    ScreenOrientation,
    NetworkService,
    DatePipe,
    SQLite,
  
    MenuController, { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }, provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
