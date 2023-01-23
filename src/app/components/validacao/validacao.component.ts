import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidacaoService } from 'src/app/services/validacao.service';

@Component({
  selector: 'app-validacao',
  templateUrl: './validacao.component.html',
  styleUrls: ['./validacao.component.scss'],
})
export class ValidacaoComponent implements OnInit {
  usuario: any = {};
  tempoRestante: number;
  intervalo: any;
  invalido: boolean;
  expirado: boolean;

  constructor(
    private router: Router,
    private validacaoService: ValidacaoService
  ) {
    this.invalido = true;
    this.expirado = true;
    this.tempoRestante = 60 * 3;
  }

  ngOnInit(): void {
    this.invalido = false;
    this.expirado = false;
    this.timer();
    this.validacaoService.consultarUsuario().subscribe((valor: any) => {
      this.usuario = valor;
    });
  }

  protected voltar() {
    this.router.navigate(['/']);
  }

  protected verificarCodigo(codigo: string): void {
    let codigoGravado = sessionStorage.getItem('codigoGravado');
    console.log('codigoGravado: ' + codigoGravado);
    console.log('codigo: ' + codigo.toString());
    if (codigoGravado === codigo.toString() && !this.expirado) {
      this.invalido = false;
      clearInterval(this.intervalo);
      sessionStorage.clear();
      this.router.navigate(['/chamado']);
    } else {
      this.invalido = true;
    }
  }

  private timer() {
    this.intervalo = setInterval(() => {
      console.log('sec');
      if (this.tempoRestante > 0) {
        this.tempoRestante--;
      } else {
        clearInterval(this.intervalo);
        sessionStorage.clear();
        this.expirado = true;
      }
    }, 1000);
  }
}
