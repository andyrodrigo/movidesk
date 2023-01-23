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
}
