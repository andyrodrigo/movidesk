import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
//import { Observable } from 'rxjs';

import { ValidacaoService } from 'src/app/services/validacao.service';
import { AutorizaService } from 'src/app/services/autoriza.service';
import { CriptoService } from 'src/app/services/cripto.service';

@Component({
  selector: 'top-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  usuario: any;
  emailFornecido: string = '';
  msg: any;

  constructor(
    private router: Router,
    private validacaoService: ValidacaoService,
    private autorizaService: AutorizaService,
    private criptoService: CriptoService
  ) {}

  ngOnInit(): void {
    sessionStorage.clear();
    this.validacaoService.consultarUsuario().subscribe((valor: any) => {
      this.usuario = valor;
    });
  }

  ngOnDestroy(): void {}

  protected enviarCodigo(): void {
    const autorizacao = this.autorizaService.autorizar('autorizado');
    if (autorizacao) {
      this.usuario.email = this.emailFornecido;
      this.validacaoService.escreverUsuario(this.usuario);
      const codigoGerado = this.numeroAleatorio(100000, 999999).toString();
      const codigoCriptado = this.criptoService.codificarMD5(codigoGerado);
      sessionStorage.setItem('codigoGravado', JSON.stringify(codigoCriptado));
      //console.log(codigoGerado);
      //this.validacaoService.enviarEmail(email, codigoGerado).subscribe(() => {});
      this.router.navigate(['/validacao']);
    }
  }

  protected teste(): void {
    this.validacaoService.teste().subscribe((res) => {
      this.msg = res.body;
    });
  }

  private numeroAleatorio(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}
