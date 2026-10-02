let clientes = [];
let pets = [];
let produtos = [];
let carrinho = [];

function criarCliente(nome, email, vip = false) {
  if (!nome || nome.trim() === "") return "Nome inválido";
  if (!email || !email.includes("@")) return "Email inválido";
  const cliente = { nome, email, vip };
  clientes.push(cliente);
  return cliente;
}

function cadastrarPet(nome, tipo, idade) {
  if (!nome || nome.trim() === "") return "Pet precisa de nome";
  if (!tipo || tipo.trim() === "") return "Pet precisa de tipo";
  if (typeof idade !== "number" || isNaN(idade) || idade < 0)
    return "Idade inválida";
  const pet = { nome, tipo, idade };
  pets.push(pet);
  return pet;
}

function criarProduto(nome, preco) {
  if (!nome || nome.trim() === "") return "Nome do produto é obrigatório";
  if (preco <= 0 || isNaN(preco)) return "Preço inválido";
  const produto = { nome, preco };
  produtos.push(produto);
  return produto;
}

function adicionarCarrinho(produto) {
  if (!produto || produto.preco <= 0) return "Produto inválido";
  carrinho.push(produto);
  return carrinho;
}

function removerCarrinho(index = 0) {
  carrinho.splice(index, 1);
  return carrinho;
}

function calcularTotal(cliente = null) {
  let total = carrinho.reduce((acc, p) => acc + p.preco, 0);

  if (cliente && cliente.vip) {
    total *= 0.85;
  } else if (total > 100) {
    total *= 0.9;
  }

  return Number(total.toFixed(2));
}

function finalizarCompra() {
  const total = calcularTotal();
  carrinho = [];
  return { status: "Sucesso", total };
}

beforeEach(() => {
  clientes = [];
  pets = [];
  produtos = [];
  carrinho = [];
});

describe("Testes de Cliente", () => {
  test("1. Deve permitir criar cliente com nome válido", () => {
    const res = criarCliente("João", "joao@email.com");
    expect(res.nome).toBe("João");
    expect(clientes.length).toBe(1);
  });

  test("2. Não deve permitir cliente com nome vazio", () => {
    expect(criarCliente("", "joao@email.com")).toBe("Nome inválido");
    expect(clientes.length).toBe(0);
  });

  test("3. Deve permitir cadastrar cliente com email válido", () => {
    expect(criarCliente("Maria", "maria@email.com").email).toBe(
      "maria@email.com",
    );
  });

  test("4. Não deve permitir email inválido", () => {
    expect(criarCliente("Maria", "emailInvalido")).toBe("Email inválido");
  });

  test("5. Deve permitir marcar cliente como VIP", () => {
    expect(criarCliente("Carlos", "carlos@email.com", true).vip).toBe(true);
  });
});

describe("Testes de Pet", () => {
  test("6. Deve permitir cadastrar um pet", () => {
    expect(cadastrarPet("Rex", "Cachorro", 3)).toEqual({
      nome: "Rex",
      tipo: "Cachorro",
      idade: 3,
    });
  });

  test("7. Pet deve possuir nome obrigatório", () => {
    expect(cadastrarPet("", "Gato", 2)).toBe("Pet precisa de nome");
  });

  test("8. Pet deve possuir tipo", () => {
    expect(cadastrarPet("Thor", "", 4)).toBe("Pet precisa de tipo");
  });

  test("9. Pet deve possuir idade válida", () => {
    expect(cadastrarPet("Thor", "Cachorro", -1)).toBe("Idade inválida");
  });
});

describe("Testes de Produto", () => {
  test("10. Deve permitir criar produto com nome", () => {
    expect(criarProduto("Ração", 100).nome).toBe("Ração");
  });

  test("11. Produto deve possuir preço maior que zero", () => {
    expect(criarProduto("Brinquedo", 0)).toBe("Preço inválido");
  });

  test("12. Produto não pode possuir preço negativo", () => {
    expect(criarProduto("Coleira", -10)).toBe("Preço inválido");
  });

  test("13. Produto deve aparecer na lista de produtos", () => {
    criarProduto("Shampoo", 25);
    expect(produtos).toContainEqual({ nome: "Shampoo", preco: 25 });
  });
});

describe("Testes de Carrinho", () => {
  test("14. Deve permitir adicionar produto ao carrinho", () => {
    adicionarCarrinho({ nome: "Bola", preco: 10 });
    expect(carrinho.length).toBe(1);
  });

  test("15. Deve permitir remover produto do carrinho", () => {
    adicionarCarrinho({ nome: "Bola", preco: 10 });
    removerCarrinho(0);
    expect(carrinho.length).toBe(0);
  });

  test("16. Carrinho deve listar todos os produtos", () => {
    adicionarCarrinho({ nome: "P1", preco: 10 });
    adicionarCarrinho({ nome: "P2", preco: 20 });
    expect(carrinho.length).toBe(2);
  });

  test("17. Carrinho deve calcular o valor total", () => {
    adicionarCarrinho({ nome: "P1", preco: 20 });
    adicionarCarrinho({ nome: "P2", preco: 30 });
    expect(calcularTotal()).toBe(50);
  });
});

describe("Testes de Regras de Negócio", () => {
  test("18. Compra acima de R$100 deve aplicar desconto de 10%", () => {
    adicionarCarrinho({ nome: "Ração", preco: 150 });
    expect(calcularTotal()).toBe(135);
  });

  test("19. Cliente VIP deve receber desconto de 15%", () => {
    const vip = { nome: "Ana", email: "ana@email.com", vip: true };
    adicionarCarrinho({ nome: "Caminha", preco: 100 });
    expect(calcularTotal(vip)).toBe(85);
  });

  test("20. Carrinho não deve aceitar produto com preço igual a zero", () => {
    expect(adicionarCarrinho({ nome: "Item", preco: 0 })).toBe(
      "Produto inválido",
    );
    expect(carrinho.length).toBe(0);
  });
});

describe("Outros Testes", () => {
  test("21. Carrinho vazio deve retornar total igual a 0", () => {
    expect(calcularTotal()).toBe(0);
  });

  test("22. Ao finalizar compra o carrinho deve ser limpo", () => {
    adicionarCarrinho({ nome: "Item", preco: 15 });
    finalizarCompra();
    expect(carrinho.length).toBe(0);
  });

  test("24. Os botões Adicionar / Remover / Finalizar devem funcionar corretamente", () => {
    adicionarCarrinho({ nome: "Item", preco: 20 });
    expect(carrinho.length).toBe(1);
    removerCarrinho(0);
    expect(carrinho.length).toBe(0);
  });
});