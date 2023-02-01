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
      const descriptografado = this.criptoService.decriptarAES(this.token);
      const tokenObject = JSON.parse(descriptografado);
      this.validacaoService.consultarUsuario().subscribe((valor: any) => {
        this.usuario = {
          nome: tokenObject.nome,
          cpf: tokenObject.cpf,
          sistema: tokenObject.sistema,
          email: tokenObject.email,
          telefone: tokenObject.telefone,
          orgao: tokenObject.orgao,
        };
        this.emailFornecido = tokenObject.email;
        console.log('token recebido: ' + this.token);
        console.log('decriptografado: ' + descriptografado);
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
    alert(this.usuario.telefone);
  }

  protected enviarCodigo(): void {
    const autorizacao = this.autorizaService.autorizar('autorizado');
    if (autorizacao) {
      this.usuario.email = this.emailFornecido;
      this.validacaoService.escreverUsuario(this.usuario);

      const codigoGerado = this.numeroAleatorio(100000, 999999).toString();
      const codigoCriptado = this.criptoService.encriptarMD5(codigoGerado);
      sessionStorage.setItem('codigoGravado', JSON.stringify(codigoCriptado));

      console.log('codigo gerado: ', codigoGerado);
      // this.validacaoService
      //   .enviarEmail(this.emailFornecido, Number(codigoGerado))
      //   .subscribe(() => {
      this.router.navigate(['/validacao']);
      //   });
    }
  }

  private numeroAleatorio(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}
