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
  url: string = '';
  existe = false;
  tempoRestante: number = 10;
  intervalo: any;

  constructor(
    private validacaoService: ValidacaoService,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.url = this.dataService.receberObjeto();
    this.dataService.limparObjeto();
    console.log('url: ', this.url);
    this.timer();
  }

  iniciar() {
    this.router.navigate(['/chamado']);
  }

  private timer() {
    this.intervalo = setInterval(() => {
      if (this.tempoRestante > 0) {
        this.tempoRestante--;
      } else {
        this.redirecionar();
      }
    }, 1000);
  }

  redirecionar(): void {
    window.location.href = this.url;
    //window.open(url, '_blank');
    //window.close();
  }
}
