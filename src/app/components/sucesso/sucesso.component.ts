import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ValidacaoService } from 'src/app/services/validacao.service';

@Component({
  selector: 'app-sucesso',
  templateUrl: './sucesso.component.html',
  styleUrls: ['./sucesso.component.scss'],
})
export class SucessoComponent implements OnInit {
  usuario: any = {};

  constructor(
    private validacaoService: ValidacaoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.validacaoService.consultarUsuario().subscribe((valor: any) => {
      this.usuario = valor;
    });
  }

  iniciar() {
    this.router.navigate(['/chamado']);
  }
}
