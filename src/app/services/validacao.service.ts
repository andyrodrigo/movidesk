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
    cpf: '11111111111',
    sistema: 'sistema',
    cnpj: '76632628000171',
    email: 'nome@email.com',
    telefone: '6969-6969',
    orgao: 'Orgao Teste',
  };

  private usuarioBehavior = new BehaviorSubject<IUsuario>(this.usuario);

  constructor(private httpClient: HttpClient) {}

  enviarEmail(mensagem: any): Observable<any> {
    let url = `${this.API_URL}/enviar-email`;
    console.log(url);
    return this.httpClient.post(url, mensagem, {
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

  abrirChamado(chamado: any): Observable<any> {
    let url = `${this.API_URL}/abrir-ticket`;
    console.log(url);
    return this.httpClient.post<any>(url, chamado, {
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
