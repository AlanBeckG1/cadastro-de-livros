import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { Livro } from "../../models/livro";
import { LivrosService } from "../../services/livros.service";

@Component({
  selector: "app-novo-livro",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./novo-livro.html",
  styleUrl: "./novo-livro.css",
})
export class NovoLivro {
  private readonly fb = inject(FormBuilder);
  private readonly livrosService = inject(LivrosService);
  private readonly router = inject(Router);

  enviando = false;
  erro: string | null = null;

  form = this.fb.nonNullable.group({
    titulo: ["", Validators.required],
    autor: ["", Validators.required],
    categoria: ["tecnologia", Validators.required],
    ano: [new Date().getFullYear(), [Validators.required, Validators.min(0)]],
    status: ["disponivel", Validators.required],
    descricao: [""],
  });

  async salvar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando = true;
    this.erro = null;

    const valores = this.form.getRawValue();

    const novoLivro: Livro = {
      id: Date.now(),
      titulo: valores.titulo,
      autor: valores.autor,
      categoria: valores.categoria as Livro["categoria"],
      ano: valores.ano,
      status: valores.status as Livro["status"],
      descricao: valores.descricao,
    };

    try {
      await this.livrosService.adicionar(novoLivro);
      this.router.navigate(["/livros"]);
    } catch {
      this.erro = "Não foi possível cadastrar o livro.";
    } finally {
      this.enviando = false;
    }
  }
}