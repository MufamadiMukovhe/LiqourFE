import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storedRadioValue: string | null = null;

  //camera
  private _storage: Storage | null = null;

  //camera
  constructor(private storage: Storage) {
    this.init();
  }

  //camera
  async init() {
    // Initialize storage
    const storage = await this.storage.create();
    this._storage = storage;

    
  }

  storeRadioValue(value: string | null) {
    this.storedRadioValue = value;
  }

  getStoredRadioValue(): string | null {
    return this.storedRadioValue;
  }

  //camera
  async saveImage(id: string, imageData: { src: string; description: string }) {
    await this._storage?.set(id, imageData);
  }

  async getImage(id: string) {
    return await this._storage?.get(id);
  }

  async getAllImages() {
    const keys = await this._storage?.keys();
    if (!keys) {
      return [];
    }
    
    const images = await Promise.all(keys.map(key => this._storage?.get(key)));
    return images.filter(img => img !== null);
  }
}
