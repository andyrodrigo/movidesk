import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CriptoService } from 'src/app/services/cripto.service';
import { ValidacaoService } from 'src/app/services/validacao.service';
import { AutorizaService } from 'src/app/services/autoriza.service';
import { IUsuario, Usuario } from 'src/app/models/usuario.model';
import { IEmail, Email } from 'src/app/models/email.model';

@Component({
  selector: 'top-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  usuario: IUsuario = new Usuario();
  emailMensagem: IEmail = new Email();
  emailFornecido: string = '';
  assunto: string = 'Confirmação de endereço de e-mail';
  token: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private validacaoService: ValidacaoService,
    private autorizaService: AutorizaService,
    private criptoService: CriptoService
  ) {}

  ngOnInit(): void {
    sessionStorage.clear();
    this.decriptarTokenRecebido();
  }

  private decriptarTokenRecebido() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['tk']) {
        this.token = params['tk'];
        //console.log('token recebido: ' + this.token);
        const descriptografado = this.criptoService.decriptarAES(this.token);
        //console.log('descriptografado: ' + descriptografado);
        const tokenObject = JSON.parse(descriptografado);
        //console.log(tokenObject);

        this.validacaoService.consultarUsuario().subscribe((valor: any) => {
          this.usuario = {
            nome: tokenObject.usuario.nome,
            cpf: tokenObject.usuario.cpf,
            sistema: tokenObject.sistema.nome,
            codigo: tokenObject.sistema.codigo,
            email: tokenObject.usuario.email,
            telefone: tokenObject.usuario.telefone,
            orgao: tokenObject.orgao.nome,
            cnpj: tokenObject.orgao.cnpj,
          };
          this.emailFornecido = tokenObject.usuario.email;
          //console.log(this.usuario);
        });
      } else {
        //console.log('no user');
        this.validacaoService.consultarUsuario().subscribe((valor: any) => {
          this.usuario = valor;
        });
        //console.log(this.usuario);
      }
    });
  }

  protected enviarCodigo(): void {
    let autorizacao = false;
    if (this.usuario.cpf != '11111111111') {
      autorizacao = this.autorizaService.autorizar('autorizado');
    }
    if (autorizacao) {
      const emailEnvio = this.emailFornecido;
      this.usuario.email = this.emailFornecido;
      this.validacaoService.escreverUsuario(this.usuario);
      const codigoGerado = this.numeroAleatorio(100000, 999999).toString();
      this.montarEmail(codigoGerado, emailEnvio);
      const codigoCriptado = this.criptoService.encriptarMD5(codigoGerado);
      sessionStorage.setItem('codigoGravado', JSON.stringify(codigoCriptado));
      console.log(codigoGerado);
      console.log(this.emailMensagem);
      this.validacaoService.enviarEmail(this.emailMensagem).subscribe(() => {
        this.router.navigate(['/validacao']);
      });
    }
  }

  montarEmail(codigo: string, email: string) {
    const mensagem = `<body style='font-family: Arial, Helvetica, sans-serif;'> <main style='width: 400px'> <div style='display: flex; justify-content: center'> <h1>Confirmar endereço de e-mail</h1> </div> <p style='font-size: large; display: flex; justify-content: center'> Este é o seu código de confirmação. Digite-o na janela do seu navegador para que possamos ajudar você a entrar. </p> <div style='display: flex justify-content: center'> <h1>${codigo}</h1> </div> <p style='font-size: medium; display: flex; justify-content: center'> Se você não solicitou este e-mail, não se preocupe. Você pode ignorá-lo.</p> </main> </body>`;
    this.emailMensagem = {
      email: email,
      assunto: this.assunto,
      conteudo: mensagem,
    };
  }

  private numeroAleatorio(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  teste() {
    const jason = {
      orgao: {
        cnpj: '49779054000196"',
        nome: 'Prefeitura Teste 03',
      },
      usuario: {
        cpf: '07042121023',
        nome: 'Laura Paiva',
        telefone: '(84)96969-6969',
        email: 'laurinha@yahoo.com.br',
      },
      sistema: {
        modulo: 'Patrimônio',
        codigo: 821352,
      },
    };
    const json = JSON.stringify(jason);
    console.log(json);
    const cripto = this.criptoService.encriptarAES(json);
    console.log(cripto);
    const decripto = this.criptoService.decriptarAES(cripto);
    console.log(decripto);
  }
}
