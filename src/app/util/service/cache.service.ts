import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private cache: Map<string, any> = new Map<string, any>();

  constructor() { }

  // Get data from cache
  get(key: string): any {
    return this.cache.get(key);
  }

  // Set data to cache
  set(key: string, data: any): void {
    this.cache.set(key, data);
  }

  // Clear specific cache entry
  clear(key: string): void {
    this.cache.delete(key);
  }

  // Clear all cache
  clearAll(): void {
    this.cache.clear();
  }
}
