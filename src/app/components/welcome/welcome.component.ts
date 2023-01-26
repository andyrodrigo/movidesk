import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { CriptoService } from 'src/app/services/cripto.service';
import { ValidacaoService } from 'src/app/services/validacao.service';
import { AutorizaService } from 'src/app/services/autoriza.service';

@Component({
  selector: 'top-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  usuario: any;
  emailFornecido: string = '';
  token: any;

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

    const entrada = 'carlos';
    console.log('entrada: ', entrada);

    const criptado = this.criptoService.encriptarAES(entrada);
    console.log('chmr1', criptado);

    const decriptado = this.criptoService.decriptarAES(criptado);
    console.log('chmr2', decriptado);
  }

  ngOnDestroy(): void {}

  protected enviarCodigo(): void {
    const autorizacao = this.autorizaService.autorizar('autorizado');
    if (autorizacao) {
      this.usuario.email = this.emailFornecido;
      this.validacaoService.escreverUsuario(this.usuario);

      const codigoGerado = this.numeroAleatorio(100000, 999999).toString();
      const codigoCriptado = this.criptoService.encriptarMD5(codigoGerado);
      sessionStorage.setItem('codigoGravado', JSON.stringify(codigoCriptado));
      console.log('chmr3', codigoGerado);

      this.validacaoService
        .enviarEmail(this.emailFornecido, Number(codigoGerado))
        .subscribe(() => {
          this.router.navigate(['/validacao']);
        });
    }
  }

  private numeroAleatorio(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}
