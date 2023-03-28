import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { CriptoService } from 'src/app/services/cripto.service';
import { ValidacaoService } from 'src/app/services/validacao.service';
import { DataService } from 'src/app/services/data.service';
import { IEmail, Email } from 'src/app/models/email.model';

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
  respostaUsuario: any[] = [];
  listaEmpresas: any[] = [];
  listaEmails: any[] = [];
  idOrgao: string = '';

  cadastroUsuario: any = {};
  cadastroEmpresa: any = {};
  empresaExiste: boolean = false;
  usuarioExiste: boolean = false;
  emailMensagem: IEmail = new Email();
  assunto: string = 'e-mail validado';

  constructor(
    private router: Router,
    private validacaoService: ValidacaoService,
    private criptoService: CriptoService,
    private dataService: DataService
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
      this.buscarEmpresa();
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
    sessionStorage.clear();
  }

  protected voltar() {
    this.router.navigate(['/']);
  }

  private buscarEmpresa() {
    this.validacaoService
      .filtrar('id', this.usuario.cnpj)
      .subscribe((valor: any) => {
        this.listaOrgaos = valor.body;
        console.log('vindo da api:');
        console.log(valor.body);
        if (this.listaOrgaos.length === 0) {
          this.criarCadastroEmpresa();
        } else {
          this.empresaExiste = true;
        }
        this.buscarUsuario();
      });
  }

  private buscarUsuario() {
    this.validacaoService
      .filtrar('id', this.usuario.cpf)
      .subscribe((valor: any) => {
        this.respostaUsuario = valor.body;
        if (this.respostaUsuario.length === 0) {
          this.criarCadastroUsuario();
        } else {
          this.usuarioExiste = true;
          console.log('listinha:');
          this.listaEmpresas = valor.body[0].relationships;
          this.listaEmails = valor.body[0].emails;
          console.log(valor.body[0].relationships);
          this.atualizarInformacoes();
        }
      });
  }

  private criarCadastroEmpresa() {
    this.cadastroEmpresa = {
      id: this.usuario.cnpj,
      isActive: true,
      personType: 2,
      profileType: 2,
      businessName: this.usuario.orgao,
      cpfCnpj: this.usuario.cnpj,
      classification: 'TESTE-API',
      cultureId: 'pt-BR',
      timeZoneId: 'America/Recife',
      observations: 'Cadastro de teste da API, desconsiderar. CPF: ',
    };
    console.log(this.cadastroEmpresa);
  }

  private criarCadastroUsuario() {
    this.associarEmpresa();

    this.cadastroUsuario = {
      id: this.usuario.cpf,
      isActive: true,
      personType: 1,
      profileType: 2,
      businessName: this.usuario.nome,
      cpfCnpj: this.usuario.cpf,
      userName: this.usuario.cpf,
      password: this.numeroAleatorio(100000, 999999).toString(),
      classification: 'TESTE-API',
      cultureId: 'pt-BR',
      timeZoneId: 'America/Recife',
      observations: 'Cadastro de teste da API, desconsiderar.',
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
      relationships: this.listaEmpresas,
    };
    console.log(this.cadastroUsuario);
  }

  private atualizarInformacoes() {
    this.associarEmpresa();
    this.inserirNovoEmail();

    this.cadastroUsuario = {
      businessName: this.usuario.nome,
      contacts: [
        {
          contactType: 'Telefone Inexistente',
          contact: this.usuario.telefone,
          isDefault: true,
        },
      ],
      emails: this.listaEmails,
      relationships: this.listaEmpresas,
    };
    console.log(this.cadastroUsuario);
  }

  associarEmpresa() {
    let nova = true;
    const empresa = {
      id: this.usuario.cnpj,
      forceChildrenToHaveSomeAgreement: false,
    };

    for (let i = 0; i < this.listaEmpresas.length; i++) {
      //console.log('Uma: ' + this.listaEmpresas[i].id);
      if (this.listaEmpresas[i].id == this.usuario.cnpj) {
        nova = false;
        break;
      }
    }
    if (nova) {
      this.listaEmpresas.push(empresa);
    }
    console.log(this.listaEmpresas);
  }

  inserirNovoEmail() {
    let novo = true;
    let nomelido = false;
    const mail = {
      emailType: 'Inexistente',
      email: this.usuario.email,
      isDefault: true,
    };
    for (let i = 0; i < this.listaEmails.length; i++) {
      //console.log('Um: ' + this.listaEmails[i].email);
      if (this.listaEmails[i].email == this.usuario.email) {
        if (!nomelido) {
          this.listaEmails[i].isDefault = true;
        }
        nomelido = true;
        novo = false;
      } else {
        this.listaEmails[i].isDefault = false;
      }
    }
    if (novo) {
      this.listaEmails.push(mail);
    }
    console.log(this.listaEmails);
  }

  protected verificarCodigo(codigo: string): void {
    if (!this.usuarioExiste) {
      this.montarEmail(
        this.cadastroUsuario.userName,
        this.cadastroUsuario.password,
        this.usuario.email
      );
    }
    let codigoGravado = sessionStorage.getItem('codigoGravado');
    const codigoCriptado = `"${this.criptoService.encriptarMD5(codigo)}"`;
    if (codigoGravado === codigoCriptado.toString() && !this.expirado) {
      this.invalido = false;
      clearInterval(this.intervalo);
      sessionStorage.clear();
      if (this.empresaExiste) {
        if (this.usuarioExiste) {
          this.atualizarUsuario();
        } else {
          this.cadastrarUsuario();
        }
      } else {
        this.cadastrarEmpresa();
      }
    } else {
      this.invalido = true;
    }
  }

  montarEmail(usuario: string, senha: string, email: string) {
    const mensagem = `<body style='font-family: Arial, Helvetica, sans-serif;'> <main style='width: 400px'> <div style='display: flex; justify-content: center'> <h1>Você foi cadastrado com sucesso</h1> </div> <p style='font-size: large; display: flex; justify-content: center'> Estes são seu usuário e sua senha para acessar os acampanhamentos dos seus chamados. Você pode mudar sua senha depois, se quiser. </p> <div style='display: flex justify-content: center'> <h1>Usuario: ${usuario}   Senha: ${senha} </h1> </div> <p style='font-size: medium; display: flex; justify-content: center'> Se você não solicitou este e-mail, não se preocupe. Você pode ignorá-lo.</p> </main> </body>`;
    this.emailMensagem = {
      email: email,
      assunto: this.assunto,
      conteudo: mensagem,
    };
  }

  private cadastrarEmpresa() {
    let resposta: any;
    this.validacaoService.cadastrarUsuario(this.cadastroEmpresa).subscribe({
      next: (response) => {
        console.log(response);
        resposta = response;
      },
      complete: () => {
        if (resposta.body.message === 'Erro no Cadastro!') {
          console.log('Erro no Cadastro');
          alert('Houve um problema com a Validação, tente novamente!');
          this.router.navigate(['/']);
        } else {
          console.log(resposta);
          if (this.usuarioExiste) {
            this.atualizarUsuario();
          } else {
            this.cadastrarUsuario();
          }
        }
      },
      error: (erro) => {
        console.log(erro);
      },
    });
  }

  private cadastrarUsuario() {
    let resposta: any;
    this.validacaoService.cadastrarUsuario(this.cadastroUsuario).subscribe({
      next: (response) => {
        console.log(response);
        resposta = response;
      },
      complete: () => {
        if (resposta.body.message === 'Erro no Cadastro!') {
          console.log('Erro no Cadastro');
          alert('Houve um problema com a Validação, tente novamente!');
          this.router.navigate(['/']);
        } else {
          console.log(resposta);
          this.enviarEmail();
        }
      },
      error: (erro) => {
        console.log(erro);
      },
    });
  }

  private atualizarUsuario() {
    let resposta: any;
    this.validacaoService
      .atualizarUsuario(this.cadastroUsuario, this.usuario.cpf)
      .subscribe({
        error: (erro) => {
          console.log(erro);
        },
      });
    this.dataService.guardarObjeto(this.usuarioExiste);
    this.router.navigate(['/sucesso']);
  }

  private enviarEmail() {
    this.validacaoService.enviarEmail(this.emailMensagem).subscribe(() => {
      this.dataService.guardarObjeto(this.usuarioExiste);
      this.router.navigate(['/sucesso']);
    });
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

  private numeroAleatorio(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}
