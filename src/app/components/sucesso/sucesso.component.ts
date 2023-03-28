import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ValidacaoService } from 'src/app/services/validacao.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-sucesso',
  templateUrl: './sucesso.component.html',
  styleUrls: ['./sucesso.component.scss'],
})
export class SucessoComponent implements OnInit {
  usuario: any = {};
  existe = false;

  constructor(
    private validacaoService: ValidacaoService,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.existe = this.dataService.receberObjeto();
    this.dataService.limparObjeto();
    this.validacaoService.consultarUsuario().subscribe((valor: any) => {
      this.usuario = valor;
    });
  }

  iniciar() {
    this.router.navigate(['/chamado']);
  }
}
