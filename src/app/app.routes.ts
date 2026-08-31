import { Routes } from "@angular/router";
import { LivrosPage } from "./features/livros/pages/livros-page/livros-page";
import { LivroDetalhePage } from "./features/livros/pages/livro-detalhe-page/livro-detalhe-page";
import { NovoLivro } from "./features/livros/components/novo-livro/novo-livro";

export const routes: Routes = [
  { path: "", redirectTo: "livros", pathMatch: "full" },
  { path: "livros", component: LivrosPage },
  { path: "livros/novo", component: NovoLivro },
  { path: "livros/:id", component: LivroDetalhePage },
];