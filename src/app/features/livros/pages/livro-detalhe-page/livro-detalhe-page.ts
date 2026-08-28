import { Component, OnInit, inject, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Livro, StatusLivro } from "../../models/livro";
import { LivrosService } from "../../services/livros.service";

@Component({
  selector: "app-livro-detalhe-page",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./livro-detalhe-page.html",
})
export class LivroDetalhePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(LivrosService);

  readonly livro = signal<Livro | undefined>(undefined);
  readonly carregando = signal(true);

  ngOnInit(): void {
    void this.carregar();
  }

  private async carregar(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    const livro = await this.service.buscarPorId(id);

    this.livro.set(livro);
    this.carregando.set(false);
  }

  async alternarStatus(): Promise<void> {
    const atual = this.livro();
    if (!atual) return;

    const novoStatus: StatusLivro =
      atual.status === "disponivel" ? "emprestado" : "disponivel";

    const atualizado = await this.service.atualizarStatus(
      atual.id,
      novoStatus,
    );
    this.livro.set(atualizado);
  }

  async excluir(): Promise<void> {
    const atual = this.livro();
    if (!atual) return;

    await this.service.excluir(atual.id);
    this.router.navigate(["/livros"]);
  }
}