import { IOrgao } from './orgao.model';

export interface IUsuario {
  nome?: string;
  cpf?: string;
  sistema?: string;
  email?: string;
  telefone?: string;
  orgao?: IOrgao;
}

export class Usuario implements IUsuario {
  constructor(
    public nome?: string,
    public cpf?: string,
    public sistema?: string,
    public email?: string,
    public telefone?: string,
    public orgao?: IOrgao
  ) {}
}
