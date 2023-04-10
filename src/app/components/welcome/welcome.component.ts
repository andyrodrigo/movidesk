import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CriptoService } from 'src/app/services/cripto.service';
import { ValidacaoService } from 'src/app/services/validacao.service';
import { AutorizaService } from 'src/app/services/autoriza.service';
import { IPessoa, Pessoa } from 'src/app/models/pessoa.model';
import { IEmailRequest } from 'src/app/models/emailRequest';

@Component({
  selector: 'top-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  pessoa: IPessoa = new Pessoa();
  emailFornecido: string = '';
  enviado = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private validacaoService: ValidacaoService,
    private autorizaService: AutorizaService,
    private criptoService: CriptoService
  ) {}

  ngOnInit(): void {
    sessionStorage.clear();
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['tk']) {
        const token = params['tk'];
        this.decriptarTokenRecebido(token);
      } else {
        this.montarObjetoPessoa(true);
      }
    });
  }

  private decriptarTokenRecebido(token: any): void {
    const descriptografado = this.criptoService.decriptarAES(token);
    const tokenObject = JSON.parse(descriptografado);
    this.montarObjetoPessoa(false, tokenObject);
  }

  private montarObjetoPessoa(padrao: boolean, objeto?: any): void {
    this.validacaoService.consultarPessoa().subscribe((resposta: any) => {
      if (padrao) {
        this.pessoa = resposta;
      } else {
        this.pessoa = {
          url: objeto.url,
          dtvalidacao: '',
          sistema: {
            modulo: objeto.sistema.modulo,
            codigo: objeto.sistema.codigo,
          },
          orgao: {
            nome: objeto.orgao.nome,
            cnpj: objeto.orgao.cnpj,
          },
          usuario: {
            nome: objeto.usuario.nome,
            cpf: objeto.usuario.cpf,
            telefone: objeto.usuario.telefone,
            email: objeto.usuario.email,
          },
        };
        this.emailFornecido = objeto.usuario.email;
      }
    });
  }

  protected enviarCodigo(): void {
    let autorizacao = false;
    if (this.pessoa.usuario?.cpf != 'CPF') {
      autorizacao = this.autorizaService.autorizar('autorizado');
    }
    if (autorizacao) {
      const emailEnvio = this.emailFornecido;
      this.pessoa = {
        ...this.pessoa,
        usuario: {
          ...this.pessoa.usuario,
          email: this.emailFornecido,
        },
      };
      this.validacaoService.escreverPessoa(this.pessoa);
      const codigoGerado = this.numeroAleatorio(100000, 999999).toString();
      const codigoCriptado = this.criptoService.encriptarMD5(codigoGerado);
      sessionStorage.setItem('codigoGravado', JSON.stringify(codigoCriptado));

      const request: IEmailRequest = {
        nome: this.pessoa.usuario?.nome,
        codigo: codigoGerado,
        email: emailEnvio,
      };

      this.enviado = true;
      this.validacaoService.enviarCodigoEmail(request).subscribe({
        next: (resposta) => {
          console.log('Resposta: ', resposta);
          this.router.navigate(['/validacao']);
          this.enviado = false;
        },
        error: (resposta) => {
          console.log('Erro: ', resposta);
          this.enviado = false;
        },
      });
    }
  }

  private numeroAleatorio(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}
