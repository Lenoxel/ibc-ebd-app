import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private customStorage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this.customStorage = storage;
  }

  async get(key: string) {
    return this.customStorage?.get(key);
  }

  async set(key: string, value: any) {
    this.customStorage?.set(key, value);
  }

  async delete(key: string) {
    this.customStorage?.remove(key);
  }
}
