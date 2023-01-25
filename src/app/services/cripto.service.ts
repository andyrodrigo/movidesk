import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CriptoService {
  codificarMD5(key: any): any {
    return CryptoJS.MD5(key);
  }

  private _Mkey = '81bqoIj*SLC^DMjHeQx6rYpy$E$&BAG7cba77Kd$msI^*Qe@pO';
  //private _Mkey = 'ovos';

  public Aes_EncryptString_ToBytes(plainText: string): Uint8Array {
    if (!plainText) {
      throw new Error('plainText é nulo ou vazio.');
    }
    if (!this._Mkey) {
      throw new Error('Chave é nula ou vazia.');
    }
    const passwordBytes = CryptoJS.enc.Utf8.parse(this._Mkey);
    const aesKey = CryptoJS.SHA256(passwordBytes);
    const aesIV = CryptoJS.MD5(passwordBytes);

    const encrypted = CryptoJS.AES.encrypt(plainText, aesKey, { iv: aesIV });
    return new Uint8Array(encrypted.ciphertext.words);
  }

  public Aes_EncryptString_ToBase64String(plainText: string): string {
    if (!plainText) {
      throw new Error('plainText é nulo ou vazio.');
    }
    if (!this._Mkey) {
      throw new Error('Chave é nula ou vazia.');
    }
    const passwordBytes = CryptoJS.enc.Utf8.parse(this._Mkey);
    const aesKey = CryptoJS.SHA256(passwordBytes);
    const aesIV = CryptoJS.MD5(passwordBytes);
    const encrypted = CryptoJS.AES.encrypt(plainText, aesKey, {
      iv: aesIV,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  public Aes_DecryptString_FromBase64String(cipherText: string): string {
    if (!cipherText) {
      throw new Error('cipherText é nulo ou vazio.');
    }
    if (!this._Mkey) {
      throw new Error('Chave é nula ou vazia.');
    }
    const passwordBytes = CryptoJS.enc.Utf8.parse(this._Mkey);
    const aesKey = CryptoJS.SHA256(passwordBytes);
    const aesIV = CryptoJS.MD5(passwordBytes);
    const ciphertext = CryptoJS.enc.Base64.parse(cipherText).toString();
    const decrypted = CryptoJS.AES.decrypt(ciphertext, aesKey, {
      iv: aesIV,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  Aes_DecryptString_FromBytes(cipherText: Uint8Array): string {
    console.log('cipherText: ', cipherText);
    if (!cipherText) {
      throw new Error('cipherText is required');
    }
    if (!this._Mkey) {
      throw new Error('Key is required');
    }
    let plaintext = null;
    const passwordBytes = CryptoJS.enc.Utf8.parse(this._Mkey);
    console.log('passwordBytes: ', passwordBytes);
    const aesKey = CryptoJS.SHA256(passwordBytes);
    console.log('aesKey: ', aesKey);
    const aesIV = CryptoJS.MD5(passwordBytes);
    console.log('aesIV: ', aesIV);
    const cipherTextArray = Array.from(cipherText);
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.lib.WordArray.create(cipherTextArray),
    });
    console.log('cipherParams: ', cipherParams);
    const decrypted = CryptoJS.AES.decrypt(cipherParams, aesKey, {
      iv: aesIV,
    });
    console.log('decrypted: ', decrypted);
    plaintext = decrypted.toString(CryptoJS.enc.Utf8);
    //plaintext = CryptoJS.enc.Utf8.stringify(decrypted);
    console.log('plaintext: ', plaintext);
    return plaintext;
  }

  ConvertStringToHex(input: string): string {
    const stringBytes = new TextEncoder().encode(input);
    let sbBytes = '';
    for (const b of stringBytes) {
      sbBytes += b.toString(16).padStart(2, '0');
    }
    return sbBytes;
  }

  ConvertHexToString(hexInput: string): string {
    let bytes = new Uint8Array(hexInput.length / 2);
    for (let i = 0; i < hexInput.length; i += 2) {
      bytes[i / 2] = parseInt(hexInput.substring(i, 2), 16);
    }
    return new TextDecoder().decode(bytes);
  }

  fromBase64String(entrada: string) {
    const code = atob(entrada);
    const array = Uint8Array.from(code, (b) => b.charCodeAt(0));
  }

  // private _mKey = '81bqoIj*SLC^DMjHeQx6rYpy$E$&BAG7cba77Kd$msI^*Qe@pO';
  // private characters =
  //   'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  // codificarMD5(key: any): any {
  //   return CryptoJS.MD5(key);
  // }
  // codificarSHA256(key: any): any {
  //   return CryptoJS.SHA256(key);
  // }
  // decodificarSHA256(key: any): any {
  //   return CryptoJS.SHA256(key);
  // }
  // codificarUTF8(texto: string): any {
  //   return CryptoJS.enc.Utf8.parse(texto);
  // }
  // decodificarUTF8(texto: any): any {
  //   return CryptoJS.enc.Utf8.stringify(texto);
  // }
  // codificarBase64(texto: string): any {
  //   return CryptoJS.enc.Base64.stringify(this.codificarUTF8(texto));
  // }
  // decodificarBase64(texto: any): any {
  //   return this.decodificarUTF8(CryptoJS.enc.Base64.parse(texto));
  // }
  // stringToHex(texto: string): any {
  //   return CryptoJS.enc.Hex.parse(texto);
  // }
  // hexToString(texto: any): any {
  //   return CryptoJS.enc.Hex.stringify(texto);
  // }
  // encrypt(value: string): any {
  //   // const key = CryptoJS.enc.Utf8.parse(this._mKey);
  //   // console.log('chmr1', key);
  //   const keySha: any = this.codificarSHA256(
  //     CryptoJS.enc.Utf8.parse(this._mKey)
  //   );
  //   // console.log('chmr1', keySha);
  //   const keyMD5: any = this.codificarMD5(CryptoJS.enc.Utf8.parse(this._mKey));
  //   let ciphertext = CryptoJS.AES.encrypt(value, keySha, {
  //     iv: keyMD5,
  //   }).toString();
  //   // console.log('chmr1', ciphertext);
  //   return ciphertext;
  // }
  // decrypt(value: string): any {
  //   const keySha: any = this.codificarSHA256(
  //     CryptoJS.enc.Utf8.parse(this._mKey)
  //   );
  //   console.log('chmr1', keySha);
  //   const keyMD5: any = this.codificarMD5(CryptoJS.enc.Utf8.parse(this._mKey));
  //   let decryptedData = CryptoJS.AES.decrypt(value, keySha, {
  //     iv: keyMD5,
  //   });
  //   console.log('chmr1', decryptedData);
  //   return decryptedData.toString(CryptoJS.enc.Utf8);
  // }
  // encrypt2(valueStringHex: any) {
  //   const CryptoJS = require('crypto-js');
  //   const keyStringHex = this._mKey;
  //   const value = CryptoJS.enc.Hex.parse(valueStringHex);
  //   const key = CryptoJS.enc.Hex.parse(keyStringHex);
  //   const ivvar = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');
  //   const encryptedStringHex = CryptoJS.AES.encrypt(value, key, {
  //     iv: ivvar,
  //     mode: CryptoJS.mode.CBC,
  //     padding: CryptoJS.pad.NoPadding,
  //   }).ciphertext.toString();
  //   return encryptedStringHex;
  // }
  // decrypt2(valueStringHex: any) {
  //   const CryptoJS = require('crypto-js');
  //   const keyStringHex = this._mKey;
  //   const value = CryptoJS.enc.Hex.parse(valueStringHex);
  //   const key = CryptoJS.enc.Hex.parse(keyStringHex);
  //   const ivvar = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');
  //   const decryptedStringHex = CryptoJS.AES.decrypt(
  //     { ciphertext: value },
  //     key,
  //     { iv: ivvar, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.NoPadding }
  //   );
  //   return decryptedStringHex.toString();
  // }
  // hexToString(input: string): string {
  //   let str = '';
  //   for (let i = 0; i < input.length; i += 2) {
  //     const code = parseInt(input.substr(i, 2), 16);
  //     str += String.fromCharCode(code);
  //   }
  //   return str;
  // }
  // function utf8ToHex(str) {
  // return '0x' + Array.from(str).map(c =>
  //   c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16) :
  //   encodeURIComponent(c).replace(/\%/g,'').toLowerCase()
  // ).join('');
  // }
  // const string = 'test';
  // const hexString = utf8ToHex(string);
  // const web3HexString = web3.utils.utf8ToHex(string);
  // console.log(hexString, web3HexString);
  // stringToHex(input: string): string {
  //   return (
  //     '0x' +
  //     Array.from(input)
  //       .map((c) =>
  //         c.charCodeAt(0) < 128
  //           ? c.charCodeAt(0).toString(16)
  //           : encodeURIComponent(c).replace(/\%/g, '').toLowerCase()
  //       )
  //       .join('')
  //   );
  // }
  // decodificar64(input: string): string {
  //   const padding = input.endsWith('==') ? 2 : input.endsWith('=') ? 1 : 0;
  //   const base64 = padding > 0 ? input.slice(0, input.length - padding) : input;
  //   const length = base64.length;
  //   let data = new Uint8Array((base64.length / 4) * 3 - padding);
  //   let dataIndex = 0;
  //   for (let i = 0; i < length; i += 4) {
  //     const a = this.characters.indexOf(base64[i]);
  //     const b = this.characters.indexOf(base64[i + 1]);
  //     const c = this.characters.indexOf(base64[i + 2]);
  //     const d = this.characters.indexOf(base64[i + 3]);
  //     const triplet = (a << 18) | (b << 12) | (c << 6) | d;
  //     for (let j = 0; j < 3; j++) {
  //       data[dataIndex++] = (triplet >> (8 * (2 - j))) & 0xff;
  //     }
  //   }
  //   const decoder = new TextDecoder();
  //   return decoder.decode(data);
  // }
  // decode64(input: string): string {
  //   //console.log('decode64');
  //   const padding = input.endsWith('==') ? 2 : input.endsWith('=') ? 1 : 0;
  //   const base64 = padding > 0 ? input.slice(0, input.length - padding) : input;
  //   const rawData = window.atob(base64);
  //   const decoder = new TextDecoder();
  //   return decoder.decode(
  //     new Uint8Array(rawData.split('').map((char) => char.charCodeAt(0)))
  //   );
  // }
  // encode64(input: string): string {
  //   const encoder = new TextEncoder();
  //   const data = encoder.encode(input);
  //   let base64 = '';
  //   const characters =
  //     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  //   let padding = 0;
  //   for (let i = 0; i < data.length; i += 3) {
  //     const a = data[i];
  //     const b = data[i + 1];
  //     const c = data[i + 2];
  //     const triplet = (a << 16) | (b << 8) | c;
  //     for (let j = 0; j < 4; j++) {
  //       if (i * 8 + j * 6 <= data.length * 8) {
  //         base64 += characters[(triplet >> (6 * (3 - j))) & 0x3f];
  //       } else {
  //         padding++;
  //       }
  //     }
  //   }
  //   return (
  //     base64.slice(0, base64.length - padding) +
  //     (padding === 2 ? '==' : padding === 1 ? '=' : '')
  //   );
  // }
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
