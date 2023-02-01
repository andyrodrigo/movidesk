import { Component, OnInit } from '@angular/core';

import { ValidacaoService } from 'src/app/services/validacao.service';

@Component({
  selector: 'app-chamado',
  templateUrl: './chamado.component.html',
  styleUrls: ['./chamado.component.scss'],
})
export class ChamadoComponent implements OnInit {
  usuario: any = {};

  constructor(private validacaoService: ValidacaoService) {}

  ngOnInit(): void {
    this.validacaoService.consultarUsuario().subscribe((valor: any) => {
      this.usuario = valor;
    });
  }

  protected abrirChamado(assunto: string, descricao: string) {
    alert('ok');
  }

  //----teste
  extra: boolean = false;
  resposta: any[] = [];

  testar() {
    this.extra = !this.extra;
  }

  buscar(entrada: string) {
    this.validacaoService.consultarCpfCnpj(entrada).subscribe((valor: any) => {
      this.resposta = valor.body;
      console.log(this.resposta);
    });
  }
}
