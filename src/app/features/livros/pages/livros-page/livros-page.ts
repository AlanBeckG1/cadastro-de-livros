import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";

import { FiltroLivros } from "../../components/filtro-livros/filtro-livros";
import { ListaLivros } from "../../components/lista-livros/lista-livros";
import { Livro, StatusLivro } from "../../models/livro";
import { LivrosService } from "../../services/livros.service";

@Component({
  selector: "app-livros-page",
  standalone: true,
  imports: [FiltroLivros, ListaLivros, RouterLink],
  templateUrl: "./livros-page.html",
  styleUrl: "./livros-page.css",
})
export class LivrosPage implements OnInit {
  private readonly livrosService = inject(LivrosService);

  readonly livros = signal<Livro[]>([]);
  readonly pesquisa = signal("");
  readonly filtroStatus = signal<StatusLivro | "todos">("todos");
  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  readonly livrosFiltrados = computed(() => {
    const termo = this.pesquisa().trim().toLowerCase();
    const status = this.filtroStatus();

    return this.livros().filter((livro) => {
      const correspondeTexto =
        termo === "" ||
        livro.titulo.toLowerCase().includes(termo) ||
        livro.autor.toLowerCase().includes(termo);

      const correspondeStatus =
        status === "todos" || livro.status === status;

      return correspondeTexto && correspondeStatus;
    });
  });

  ngOnInit(): void {
    void this.carregarLivros();
  }

  async carregarLivros(): Promise<void> {
    this.carregando.set(true);
    this.erro.set(null);

    try {
      const dados = await this.livrosService.listar();
      this.livros.set(dados);
    } catch {
      this.erro.set("Não foi possível carregar os livros.");
    } finally {
      this.carregando.set(false);
    }
  }

  atualizarPesquisa(valor: string): void {
    this.pesquisa.set(valor);
  }

  atualizarStatus(valor: StatusLivro | "todos"): void {
    this.filtroStatus.set(valor);
  }

  async excluirLivro(id: number): Promise<void> {
    await this.livrosService.excluir(id);
    this.livros.update((atual) => atual.filter((livro) => livro.id !== id));
  }
}