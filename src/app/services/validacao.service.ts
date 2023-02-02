import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { config } from '../config/config';
import { IUsuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class ValidacaoService {
  private readonly API_URL = `${config['apiUrl']}`;

  usuario: IUsuario = {
    nome: 'Alírio',
    cpf: '111.654.987-14',
    sistema: 'sistema',
    email: 'nome@email.com',
    telefone: '6969-6969',
    orgao: {
      nome: 'Orgao Teste',
      cnpj: '76.632.628/0001-71',
    },
  };

  private usuarioBehavior = new BehaviorSubject<IUsuario>(this.usuario);

  constructor(private httpClient: HttpClient) {}

  enviarEmail(email: string, codigo: number): Observable<any> {
    let url = `${this.API_URL}/enviar-email/${email}/${codigo}`;
    console.log(url);
    return this.httpClient.post(url, {
      observe: 'response',
    });
  }

  filtrar(filtro: string, entrada: string): Observable<any> {
    let url = `${this.API_URL}/buscar/${filtro}/'${entrada}'`;
    console.log(url);
    return this.httpClient.get<any>(url, {
      observe: 'response',
    });
  }

  cadastrarUsuario(usuario: any): Observable<any> {
    let url = `${this.API_URL}/cadastrar`;
    console.log(url);
    return this.httpClient.post<any>(url, usuario, {
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

  escreverUsuario(usuario: IUsuario): void {
    this.usuarioBehavior.next(usuario);
  }
}
