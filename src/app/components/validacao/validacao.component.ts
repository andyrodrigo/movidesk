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

  cadastroUsuario: any = {};
  cadastroEmpresa: any = {};
  empresaExiste: boolean = false;
  emailMensagem: any;
  assunto: string = 'e-mail validado';

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
      this.preencherCadastros();
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
    sessionStorage.clear();
  }

  protected voltar() {
    this.router.navigate(['/']);
  }

  protected preencherCadastros() {
    this.validacaoService
      .filtrar('id', this.usuario.cnpj)
      .subscribe((valor: any) => {
        this.listaOrgaos = valor.body;
        // console.log(this.listaOrgaos);
        this.criarCadastroUsuario();
        if (this.listaOrgaos.length === 0) {
          //console.log('Empresa não cadastrada');
          this.criarCadastroEmpresa();
        } else {
          this.empresaExiste = true;
        }
      });
  }

  protected criarCadastroEmpresa() {
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

  protected criarCadastroUsuario() {
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
      relationships: [
        {
          id: this.usuario.cnpj,
          forceChildrenToHaveSomeAgreement: false,
        },
      ],
    };
    console.log(this.cadastroUsuario);
  }

  protected verificarCodigo(codigo: string): void {
    this.montarEmail(
      this.cadastroUsuario.userName,
      this.cadastroUsuario.password,
      this.usuario.email
    );
    let codigoGravado = sessionStorage.getItem('codigoGravado');
    const codigoCriptado = `"${this.criptoService.encriptarMD5(codigo)}"`;
    if (codigoGravado === codigoCriptado.toString() && !this.expirado) {
      this.invalido = false;
      clearInterval(this.intervalo);
      sessionStorage.clear();
      if (this.empresaExiste) {
        this.cadastrarUsuario();
      } else {
        this.cadastrarEmpresa();
      }
    } else {
      this.invalido = true;
    }
  }

  montarEmail(usuario: string, senha: string, email: string) {
    const mensagem = `<body style='font-family: Arial, Helvetica, sans-serif;'> <main style='width: 400px'> <div style='display: flex; justify-content: center'> <h1>Você foi cadastrado com sucesso</h1> </div> <p style='font-size: large; display: flex; justify-content: center'> Estes são seu usuário e sua senha para acessar os acampanhamentos dos seus chamados. Você pode mudar sua senha depois, se quiser. </p> <div style='display: flex justify-content: center'> <h1>Usuario: ${usuario}   Senha: ${senha} /h1> </div> <p style='font-size: medium; display: flex; justify-content: center'> Se você não solicitou este e-mail, não se preocupe. Você pode ignorá-lo.</p> </main> </body>`;
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
          this.cadastrarUsuario();
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
          this.validacaoService.enviarEmail('nome e senha');
          this.router.navigate(['/sucesso']);
        }
      },
      error: (erro) => {
        console.log(erro);
      },
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
