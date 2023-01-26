import { Component, OnInit } from '@angular/core';
import { IUsuario } from './../../models/usuario';

@Component({
  selector: 'top-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
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

  constructor() {}

  ngOnInit(): void {}
}
