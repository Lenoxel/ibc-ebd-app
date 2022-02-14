import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async get(key: string) {
    const { value } = await Storage.get({ key });
    return await JSON.parse(value);
  }

  async set(key: string, value: any) {
    await Storage.set({
      key,
      value: JSON.stringify(value),
    });
  }

  async delete(key: string) {
    await Storage.remove({ key });
  }
}
