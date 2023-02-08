import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CriptoService } from 'src/app/services/cripto.service';
import { ValidacaoService } from 'src/app/services/validacao.service';
import { AutorizaService } from 'src/app/services/autoriza.service';
import { IUsuario, Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'top-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  usuario: IUsuario = new Usuario();
  emailFornecido: string = '';
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
    this.activatedRoute.queryParams.subscribe((params) => {
      this.token = params['tk'];
      console.log('token recebido: ' + this.token);
      const descriptografado = this.criptoService.decriptarAES(this.token);
      console.log('descriptografado: ' + descriptografado);
      const tokenObject = JSON.parse(descriptografado);
      console.log(tokenObject);

      this.validacaoService.consultarUsuario().subscribe((valor: any) => {
        this.usuario = {
          nome: tokenObject.usuario.nome,
          cpf: tokenObject.usuario.cpf,
          sistema: tokenObject.sistema.nome,
          email: tokenObject.usuario.email,
          telefone: tokenObject.usuario.telefone,
          orgao: tokenObject.orgao.nome,
        };
        this.emailFornecido = tokenObject.usuario.email;
        console.log(
          'user: ' +
            this.usuario.nome +
            ' com cpf: ' +
            this.usuario.cpf +
            ' do orgao: ' +
            this.usuario.orgao
        );
      });
    });
  }

  teste() {
    const jason = {
      datetime: '26/01/2023 14:06:12',
      orgao: {
        idMovidesk: 'XXXXXXXXXXXXXX',
        cnpj: 'XX.XXX.XXX/XXXX-XX',
        nome: 'Prefeitura Municipal de Parnamirim',
      },
      usuario: {
        idMovidesk: 'YYYYYYYYYYY',
        cpf: 'YYY.YYY.YYY-YY',
        nome: 'Laura Paiva',
        telefone: '(84) 96969-6969',
        email: 'laurinha@yahoo.com.br',
      },
      sistema: {
        nome: 'RH',
        modulo: 'Processamento da Folha',
      },
    };
    const json = JSON.stringify(jason);
    console.log(json);
    const cripto = this.criptoService.encriptarAES(json);
    console.log(cripto);
    const decripto = this.criptoService.decriptarAES(cripto);
    console.log(decripto);
  }

  protected enviarCodigo(): void {
    const autorizacao = this.autorizaService.autorizar('autorizado');
    if (autorizacao) {
      const emailEnvio = this.emailFornecido;
      this.usuario.email = this.emailFornecido;
      this.validacaoService.escreverUsuario(this.usuario);
      const codigoGerado = this.numeroAleatorio(100000, 999999).toString();
      const codigoCriptado = this.criptoService.encriptarMD5(codigoGerado);
      sessionStorage.setItem('codigoGravado', JSON.stringify(codigoCriptado));
      console.log(codigoGerado);
      this.validacaoService;
      // .enviarEmail({
      //   email: emailEnvio,
      //   codigo: Number(codigoGerado),
      // })
      // .subscribe(() => {
      this.router.navigate(['/validacao']);
      // });
    }
  }

  private numeroAleatorio(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}
