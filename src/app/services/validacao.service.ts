import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';

import { config } from '../config/config';
import { IUsuario } from '../models/usuario.model';
import { IEmail } from '../models/email.model';

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

  enviarEmail(mensagem: IEmail): Observable<any> {
    return of('enviado email');
    // let url = `${this.API_URL}/enviar-email`;
    // console.log(url);
    // return this.httpClient.post(url, mensagem, {
    //   observe: 'response',
    // });
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

  atualizarUsuario(usuario: any, id: string): Observable<any> {
    let url = `${this.API_URL}/relacionar/${id}`;
    console.log(url);
    return this.httpClient.patch<any>(url, usuario, {
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

  enviarAnexo(anexo: File, id: string): Observable<any> {
    const formData = new FormData();
    formData.append('arquivo', anexo, anexo.name);

    let url = `https://api.movidesk.com/public/v1/ticketFileUpload?token=08ac164a-4952-4840-b1d6-8364410ee110&id=433&actionId=${id}`;
    console.log('url: ', url);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.httpClient.post<any>(url, formData, {
      observe: 'response',
    });

    // let url = `${this.API_URL}/enviar-anexo`;
    // const headers = new HttpHeaders();
    // headers.append('Content-Type', 'multipart/form-data');
    // return this.httpClient.post<any>(url, formData, {
    //   observe: 'response',
    // });
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
