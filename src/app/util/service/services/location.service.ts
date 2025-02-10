import { Injectable } from '@angular/core';
import { StorageService } from '../storage.service';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init()
  }

  async init() {
    this._storage = await this.storage.create();
  }

  async setLocation(lat: number, lng: number) {
    await this._storage?.set('latitude', lat);
    await this._storage?.set('longitude', lng);
  }

  async getLocation() {
    const latitude = await this._storage?.get('latitude');
    const longitude = await this._storage?.get('longitude');
    return { latitude, longitude };
  }
}

