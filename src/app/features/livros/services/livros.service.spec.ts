import { TestBed } from "@angular/core/testing";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { beforeEach, afterEach, describe, expect, it } from "vitest";
import { LivrosService } from "./livros.service";
import { Livro } from "../models/livro";

describe("LivrosService", () => {
  let service: LivrosService;
  let httpMock: HttpTestingController;

  const apiUrl = "https://api-de-livros-3i55.onrender.com/api/livros";

  const livroMock: Livro = {
    id: 1,
    titulo: "Clean Code",
    autor: "Robert C. Martin",
    categoria: "tecnologia",
    ano: 2008,
    status: "disponivel",
    descricao: "Livro sobre boas práticas de desenvolvimento de software.",
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(LivrosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("deve listar os livros", async () => {
    const promessa = service.listar();

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe("GET");
    req.flush([livroMock]);

    const livros = await promessa;
    expect(livros).toHaveLength(1);
    expect(livros[0].titulo).toBe("Clean Code");
  });

  it("deve buscar um livro por id", async () => {
    const promessa = service.buscarPorId(1);

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe("GET");
    req.flush(livroMock);

    const livro = await promessa;
    expect(livro?.titulo).toBe("Clean Code");
  });

  it("deve retornar undefined quando o livro não for encontrado (404)", async () => {
    const promessa = service.buscarPorId(999);

    const req = httpMock.expectOne(`${apiUrl}/999`);
    req.flush(
      { erro: "Livro não encontrado." },
      { status: 404, statusText: "Not Found" },
    );

    const livro = await promessa;
    expect(livro).toBeUndefined();
  });

  it("deve adicionar um livro", async () => {
    const promessa = service.adicionar(livroMock);

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe("POST");
    req.flush(livroMock);

    const livro = await promessa;
    expect(livro.titulo).toBe("Clean Code");
  });

  it("deve atualizar o status de um livro", async () => {
    const promessa = service.atualizarStatus(1, "emprestado");

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe("PATCH");
    expect(req.request.body).toEqual({ status: "emprestado" });
    req.flush({ ...livroMock, status: "emprestado" });

    const livro = await promessa;
    expect(livro.status).toBe("emprestado");
  });

  it("deve excluir um livro", async () => {
    const promessa = service.excluir(1);

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe("DELETE");
    req.flush(null);

    await expect(promessa).resolves.toBeNull();
  });
});