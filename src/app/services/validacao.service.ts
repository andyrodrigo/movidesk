import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { config } from '../config/config';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class ValidacaoService {
  private readonly API_URL = `${config['apiUrl']}`;

  private usuarioBehavior = new BehaviorSubject<Usuario>({
    nome: 'Alírio',
    cpf: '111.654.987-14',
    cnpj: 'cnpj',
    orgao: 'orgao',
    sistema: 'sistema',
    email: 'nome@email.com',
    telefone: '6969-6969',
  });

  constructor(private httpClient: HttpClient) {}

  enviarEmail(email: string, codigo: number): Observable<any> {
    let url = `${this.API_URL}/enviar-email/${email}/${codigo}`;
    console.log(url);
    return this.httpClient.post(url, {
      observe: 'response',
    });
  }

  teste(): Observable<any> {
    console.log(`${this.API_URL}/teste`);
    return this.httpClient.get<any>(`${this.API_URL}/teste`, {
      observe: 'response',
    });
  }

  consultarUsuario(): any {
    return this.usuarioBehavior;
  }

  escreverUsuario(usuario: Usuario): void {
    this.usuarioBehavior.next(usuario);
  }
}
