import { IOrgao } from './orgao.model';

export interface IUsuario {
  nome?: string;
  cpf?: string;
  sistema?: string;
  codigo?: number;
  cnpj?: string;
  email?: string;
  telefone?: string;
  orgao?: string;
}

export class Usuario implements IUsuario {
  constructor(
    public nome?: string,
    public cpf?: string,
    public sistema?: string,
    public codigo?: number,
    public cnpj?: string,
    public email?: string,
    public telefone?: string,
    public orgao?: string
  ) {}
}
