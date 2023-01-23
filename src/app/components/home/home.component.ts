import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'top-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  usuario = {
    nome: 'Alírio',
    cpf: '111.654.987-14',
    cnpj: 'cnpj',
    orgao: 'orgao',
    sistema: 'sistema',
    email: 'nome@email.com',
    telefone: '6969-6969',
  };

  constructor() {}

  ngOnInit(): void {}
}
