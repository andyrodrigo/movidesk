import { Component, OnInit } from '@angular/core';

import { ValidacaoService } from 'src/app/services/validacao.service';

@Component({
  selector: 'app-chamado',
  templateUrl: './chamado.component.html',
  styleUrls: ['./chamado.component.scss'],
})
export class ChamadoComponent implements OnInit {
  usuario: any = {};
  assunto: string = '';
  descricao: string = '';
  anexoFile!: File;
  anexo: string = '';
  ticket: any = {};
  numeroTicket: string = 'NUMERO';
  enviado = false;
  sucesso = false;

  constructor(private validacaoService: ValidacaoService) {}

  ngOnInit(): void {
    // this.validacaoService.consultarUsuario().subscribe((valor: any) => {
    //   this.usuario = valor;
    // });
  }

  protected abrirChamado() {
    this.enviado = true;
    this.ticket = {
      type: 2,
      subject: this.assunto,
      serviceFirstLevelId: this.usuario.codigo,
      createdBy: { id: this.usuario.cnpj },
      clients: [{ id: this.usuario.cpf }],
      actions: [{ type: 2, description: `<p>${this.descricao}<p>` }],
    };
    console.log(this.ticket);
    this.validacaoService.abrirChamado(this.ticket).subscribe({
      next: (resposta) => {
        console.log(resposta);
        this.numeroTicket = resposta.body.id;
        if (this.anexo) {
          this.enviarAnexo();
        } else {
          console.log('vazio');
        }
        this.sucesso = true;
      },
      error: (erro) => {
        console.log(erro);
      },
    });
  }

  onAnexoSelecionado(evento: any) {
    this.anexoFile = evento.target.files[0];
  }

  protected enviarAnexo() {
    if (this.anexo != '') {
      this.validacaoService
        .enviarAnexo(this.anexoFile, this.numeroTicket)
        .subscribe({
          next: (resposta) => {
            console.log(resposta);
          },
          error: (erro) => {
            console.log(erro);
          },
        });
    } else {
      alert('Nenhum Anexo foi selecionado');
    }
  }

  //----teste
  // extra: boolean = false;
  // resposta: any[] = [];
  // user: any = {
  //   isActive: true,
  //   personType: 1,
  //   profileType: 2,
  //   businessName: 'Teste3 da API Movidesk',
  //   cpfCnpj: '52511345099',
  //   classification: 'TESTE-PREFEITURA',
  //   cultureId: 'pt-BR',
  //   timeZoneId: 'America/Recife',
  //   observations: 'Cadastro de teste da API, desconsiderar.',
  //   contacts: [
  //     {
  //       contactType: 'Telefone Inexistente',
  //       contact: '(69) 6969-6969',
  //       isDefault: true,
  //     },
  //   ],
  //   emails: [
  //     {
  //       emailType: 'Inexistente',
  //       email: 'testeapi@teste.com',
  //       isDefault: true,
  //     },
  //   ],
  //   relationships: [
  //     {
  //       id: '08085409000160',
  //       name: 'PREFEITURA MUNICIPAL DE ANGICOS',
  //       forceChildrenToHaveSomeAgreement: false,
  //     },
  //   ],
  // };

  // testar() {
  //   this.extra = !this.extra;
  // }

  // buscar(entrada: string) {
  //   this.validacaoService
  //     .filtrar('cpfCnpj', entrada)
  //     .subscribe((valor: any) => {
  //       this.resposta = valor.body;
  //       console.log(this.resposta);
  //     });
  // }

  // cadastrar() {
  //   const usuario = JSON.stringify(this.user);
  //   console.log('objeto: ');
  //   console.log(this.user);
  //   console.log('tipo: ');
  //   console.log(typeof this.user);
  //   console.log('usuario: ');
  //   console.log(usuario);
  //   console.log('tipo: ');
  //   console.log(typeof usuario);
  //   this.validacaoService
  //     .cadastrarUsuario(this.user)
  //     .subscribe({ complete: () => {} });
  // }
}
