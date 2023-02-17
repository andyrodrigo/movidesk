export interface IEmail {
  email?: string;
  assunto?: string;
  conteudo?: string;
}

export class Email implements IEmail {
  constructor(
    public email?: string,
    public assunto?: string,
    public conteudo?: string
  ) {}
}
