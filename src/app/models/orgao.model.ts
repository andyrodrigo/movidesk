export interface IOrgao {
  nome?: string;
  cnpj?: string;
  telefone?: string;
  email?: string;
}

export class Orgao implements IOrgao {
  constructor(
    public nome?: string,
    public cnpj?: string,
    public telefone?: string,
    public email?: string
  ) {}
}
