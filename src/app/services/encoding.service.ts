import { Injectable } from '@angular/core';
import Pako from 'pako';

@Injectable({
  providedIn: 'root',
})
export class EncodingService {
  encodeObject(object: Object) {
    const gzip = Pako.gzip(JSON.stringify(object));

    const encodedData = btoa(String.fromCharCode(...gzip));
    return encodedData;
  }

  decodeObject(data: string) {
    const arr = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
    const json = Pako.ungzip(arr, { to: 'string' });
    const parsed = JSON.parse(json);
    return parsed;
  }
}
