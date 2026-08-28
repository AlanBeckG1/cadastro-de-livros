export type Categoria =
  | "tecnologia"
  | "ficcao"
  | "biografia"
  | "negocios"
  | "outro";

export type StatusLivro = "disponivel" | "emprestado";

export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  categoria: Categoria;
  ano: number;
  status: StatusLivro;
  descricao: string;
}