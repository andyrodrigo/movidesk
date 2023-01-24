import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CriptoService {
  codificarMD5(entrada: string): string {
    return CryptoJS.MD5(entrada).toString();
  }

  encode64(input: string): string {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    let base64 = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let padding = 0;
    for (let i = 0; i < data.length; i += 3) {
      const a = data[i];
      const b = data[i + 1];
      const c = data[i + 2];
      const triplet = (a << 16) | (b << 8) | c;
      for (let j = 0; j < 4; j++) {
        if (i * 8 + j * 6 <= data.length * 8) {
          base64 += characters[(triplet >> (6 * (3 - j))) & 0x3f];
        } else {
          padding++;
        }
      }
    }
    return (
      base64.slice(0, base64.length - padding) +
      (padding === 2 ? '==' : padding === 1 ? '=' : '')
    );
  }

  // b64 = 'SGVsbG8sIFdvcmxkIQ==';

  // decode = (str: string): string =>
  //   Buffer.from(str, 'base64').toString('binary');
  // encode = (str: string): string =>
  //   Buffer.from(str, 'binary').toString('base64');

  // test('base64 decode', () => { expect(decode(b64)).toEqual(str)});

  // test1('base64 decode', () => {
  //   expect(encode(str)).toEqual(b64)
  // });

  // test2('base64 encode/decode', () => {
  //   expect(decode(encode(str))).toEqual(str)
  // });
}
