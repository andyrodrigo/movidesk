import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { VirtualTimeScheduler } from 'rxjs';

import { CriptoService } from 'src/app/services/cripto.service';
import { ValidacaoService } from 'src/app/services/validacao.service';

@Component({
  selector: 'app-validacao',
  templateUrl: './validacao.component.html',
  styleUrls: ['./validacao.component.scss'],
})
export class ValidacaoComponent implements OnInit, OnDestroy {
  usuario: any = {};
  tempoRestante: number;
  intervalo: any;
  invalido: boolean;
  expirado: boolean;
  listaOrgaos: any[] = [];
  idOrgao: string = '';

  cadastro: any = {};

  constructor(
    private router: Router,
    private validacaoService: ValidacaoService,
    private criptoService: CriptoService
  ) {
    this.invalido = true;
    this.expirado = true;
    this.tempoRestante = 60 * 5;
  }

  ngOnInit(): void {
    this.invalido = false;
    this.expirado = false;
    this.timer();
    this.validacaoService.consultarUsuario().subscribe((valor: any) => {
      this.usuario = valor;
      this.preencherCadastro();
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
    sessionStorage.clear();
  }

  protected voltar() {
    this.router.navigate(['/']);
  }

  protected preencherCadastro() {
    this.validacaoService
      .filtrar('businessName', this.usuario.orgao)
      .subscribe((valor: any) => {
        this.listaOrgaos = valor.body;
        console.log(this.listaOrgaos);
        this.idOrgao = this.listaOrgaos[0].id;
        console.log('ID capturado: ' + this.idOrgao);
        this.cadastro = {
          isActive: true,
          personType: 1,
          profileType: 2,
          businessName: this.usuario.nome,
          cpfCnpj: '66729624507',
          classification: 'TESTE-API',
          cultureId: 'pt-BR',
          timeZoneId: 'America/Recife',
          observations:
            'Cadastro de teste da API, desconsiderar. CPF: ' + this.usuario.cpf,
          contacts: [
            {
              contactType: 'Telefone Inexistente',
              contact: this.usuario.telefone,
              isDefault: true,
            },
          ],
          emails: [
            {
              emailType: 'Inexistente',
              email: this.usuario.email,
              isDefault: true,
            },
          ],
          relationships: [
            {
              id: this.idOrgao,
              forceChildrenToHaveSomeAgreement: false,
            },
          ],
        };
        console.log(this.cadastro);
      });
  }

  protected verificarCodigo(codigo: string): void {
    let codigoGravado = sessionStorage.getItem('codigoGravado');
    const codigoCriptado = `"${this.criptoService.encriptarMD5(codigo)}"`;
    if (codigoGravado === codigoCriptado.toString() && !this.expirado) {
      this.invalido = false;
      clearInterval(this.intervalo);
      sessionStorage.clear();
      this.validacaoService
        .cadastrarUsuario(this.cadastro)
        .subscribe({ complete: () => {} });
      this.router.navigate(['/sucesso']);
    } else {
      this.invalido = true;
    }
  }

  private timer() {
    this.intervalo = setInterval(() => {
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
