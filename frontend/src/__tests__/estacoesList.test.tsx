import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EstacoesList from "../components/station/EstacoesList";

// Mocks dos hooks usados no componente
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "123", name: "Test User" },
  }),
}));

jest.mock("../hooks/stations/useStations", () => ({
  useStations: () => ({
    stations: [],
    pagination: { page: 1, totalPages: 1 },
    loading: false,
    error: null,
    createStation: jest.fn(),
    updateStation: jest.fn(),
    deleteStation: jest.fn(),
    changePage: jest.fn(),
  }),
}));

// Mock dos componentes usados internamente
jest.mock("../components/modals/cadastroEstacaoModal", () => ({ __esModule: true, default: () => <div>Modal Cadastro</div> }));
jest.mock("../components/modals/modalEdicaoEstacao", () => ({ __esModule: true, default: () => <div>Modal Edição</div> }));
jest.mock("../components/modals/modalExcluirEstacao", () => ({ __esModule: true, default: () => <div>Modal Excluir</div> }));

jest.mock("../components/station/estacaoCard", () => ({
  EstacaoCard: () => <div>Card Estacao</div>,
}));

jest.mock("../components/pagination/pagination", () => ({ __esModule: true, default: () => <div>Pagination</div> }));

describe("EstacoesList Component", () => {
  it("deve renderizar o título corretamente", () => {
    render(<EstacoesList />);
    expect(screen.getByText("Estações Meteorológicas")).toBeInTheDocument();
  });

  it("deve exibir o botão 'Nova Estação' quando o usuário está logado", () => {
    render(<EstacoesList />);
    expect(screen.getByText("Nova Estação")).toBeInTheDocument();
  });

  it("deve mostrar a mensagem de nenhuma estação encontrada", () => {
    render(<EstacoesList />);
    expect(screen.getByText("Nenhuma estação encontrada")).toBeInTheDocument();
  });

  it("deve abrir o modal de criação ao clicar no botão 'Nova Estação'", () => {
    render(<EstacoesList />);
    fireEvent.click(screen.getByText("Nova Estação"));
    expect(screen.getByText("Modal Cadastro")).toBeInTheDocument();
  });
});
