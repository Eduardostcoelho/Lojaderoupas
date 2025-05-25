// Variáveis globais
let usuarioAtual = localStorage.getItem('usuarioAtual');
let produtos = JSON.parse(localStorage.getItem('produtos')) || [
  { nome: 'Camiseta Branca', preco: 50, descricao: 'Uma camiseta branca básica.', imagem: 'camiseta.jpg' },
  { nome: 'Calça Jeans', preco: 120, descricao: 'Calça jeans confortável.', imagem: 'calca.jpg' }
];
let carrinho = [];

if (usuarioAtual) {
  carregarCarrinhoDoUsuario();
}

// Função de login
function fazerLogin() {
  const nome = document.getElementById('usuario').value;
  if (!nome) {
    alert('Digite seu nome de usuário.');
    return;
  }
  usuarioAtual = nome;
  localStorage.setItem('usuarioAtual', nome);
  carregarCarrinhoDoUsuario();
  document.getElementById('usuario-logado') && (document.getElementById('usuario-logado').textContent = `Olá, ${usuarioAtual}`);
  document.getElementById('login-area') && (document.getElementById('login-area').style.display = 'none');
}

// Carregar carrinho do usuário logado
function carregarCarrinhoDoUsuario() {
  const salvo = localStorage.getItem(`carrinho_${usuarioAtual}`);
  carrinho = salvo ? JSON.parse(salvo) : [];
  atualizarCarrinho();
}
function salvarCarrinho() {
  if (usuarioAtual) {
    localStorage.setItem(`carrinho_${usuarioAtual}`, JSON.stringify(carrinho));
  }
}
function salvarProdutos() {
  localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Navegação entre abas
function mostrarAba(abaId) {
  document.querySelectorAll('.aba').forEach(aba => aba.style.display = 'none');
  const aba = document.getElementById(abaId);
  if (aba) aba.style.display = 'block';
  if (abaId === 'produtos') exibirProdutos();
  if (abaId === 'admin') {
    atualizarListaAdmin();
  }
  if (abaId === 'carrinho') atualizarCarrinho();
}

// Exibir produtos na aba Produtos
function exibirProdutos() {
  const area = document.getElementById('lista-produtos');
  const filtro = (document.getElementById('filtro-produto')?.value || '').toLowerCase();
  if (!area) return;

  const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(filtro));
  if (filtrados.length === 0) {
    area.innerHTML = "<p>Nenhum produto encontrado.</p>";
    return;
  }

  const html = filtrados.map(p => `
    <div class="produto">
      <h3>${p.nome}</h3>
      <p>R$ ${p.preco.toFixed(2)}</p>
      <img src="${p.imagem}" alt="${p.nome}" style="width: 100px; height: auto;">
      <button onclick="adicionarAoCarrinho('${p.nome}', ${p.preco})">Adicionar ao Carrinho</button>
    </div>
  `).join('');

  area.innerHTML = html;
}

// Campo de filtro dinâmico
document.addEventListener('DOMContentLoaded', () => {
  const produtosDiv = document.getElementById('produtos');
  if (produtosDiv && !document.getElementById('filtro-produto')) {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'filtro-produto';
    input.placeholder = 'Buscar produto...';
    input.oninput = exibirProdutos;
    produtosDiv.prepend(input);
  }
});

// Adicionar produto na aba Admin
function adicionarProduto() {
  const nome = document.getElementById('novo-nome').value;
  const descricao = document.getElementById('nova-descricao').value;
  const preco = parseFloat(document.getElementById('novo-preco').value);
  const imagemInput = document.getElementById('nova-imagem');
  const imagemFile = imagemInput.files[0];

  if (!nome || !descricao || isNaN(preco) || !imagemFile) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  // Converter imagem para base64
  const reader = new FileReader();
  reader.onload = function (e) {
    const imagemBase64 = e.target.result;
    produtos.push({
      nome,
      descricao,
      preco,
      imagem: imagemBase64
    });
    salvarProdutos();
    atualizarListaAdmin();
    exibirProdutos(); // Atualiza a aba Produtos também
    document.getElementById('novo-nome').value = '';
    document.getElementById('nova-descricao').value = '';
    document.getElementById('novo-preco').value = '';
    imagemInput.value = '';
  };
  reader.readAsDataURL(imagemFile);
}

// Atualizar lista de produtos na aba Admin
function atualizarListaAdmin() {
  const lista = document.getElementById('lista-admin-produtos');
  if (!lista) return;

  lista.innerHTML = '';
  produtos.forEach((p, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${p.nome}</strong> - R$ ${p.preco.toFixed(2)}<br>
      <img src="${p.imagem}" alt="${p.nome}" style="width: 80px; height: auto;"><br>
      <button onclick="editarProduto(${index})">Editar</button>
      <button onclick="removerProduto(${index})">Remover</button>
    `;
    lista.appendChild(li);
  });
}

// Editar produto
function editarProduto(index) {
  const p = produtos[index];
  const novoNome = prompt("Editar nome:", p.nome);
  const novaDescricao = prompt("Editar descrição:", p.descricao);
  const novoPreco = prompt("Editar preço:", p.preco);

  if (novoNome && novaDescricao && novoPreco && !isNaN(parseFloat(novoPreco))) {
    produtos[index] = {
      ...p,
      nome: novoNome,
      descricao: novaDescricao,
      preco: parseFloat(novoPreco)
    };
    salvarProdutos();
    atualizarListaAdmin();
    exibirProdutos(); // Sincroniza com a aba Produtos
  }
}

// Remover produto da lista Admin
function removerProduto(index) {
  if (confirm("Deseja remover este produto?")) {
    produtos.splice(index, 1);
    salvarProdutos();
    atualizarListaAdmin();
    exibirProdutos(); // Sincroniza com a aba Produtos
  }
}

// Adicionar ao carrinho
function adicionarAoCarrinho(nome, preco) {
  const produto = produtos.find(p => p.nome === nome);
  if (!produto) {
    console.error("Produto não encontrado:", nome);
    alert("Produto não encontrado.");
    return;
  }

  const existente = carrinho.find(item => item.nome === nome);
  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({
      nome: produto.nome,
      preco: produto.preco,
      quantidade: 1,
      descricao: produto.descricao || 'Sem descrição',
      imagem: produto.imagem || ''
    });
  }

  salvarCarrinho();
  atualizarCarrinho();
  mostrarNotificacao(`${nome} foi adicionado ao carrinho.`);
}

// Atualizar visual do carrinho
function atualizarCarrinho() {
  const lista = document.getElementById('lista-carrinho');
  const totalSpan = document.getElementById('total');

  if (!lista || !totalSpan) return;

  lista.innerHTML = '';
  let total = 0;

  if (carrinho.length === 0) {
    lista.innerHTML = '<li><em>Seu carrinho está vazio.</em></li>';
    totalSpan.textContent = '0.00';
    return;
  }

  carrinho.forEach((item, index) => {
    const subtotal = item.preco * item.quantidade;
    const li = document.createElement('li');
    li.innerHTML = `
      <div style="display:flex; align-items:center; gap:15px; margin-bottom:10px;">
        <img src="${item.imagem}" alt="${item.nome}" style="width:80px; height:auto;">
        <div>
          <strong>${item.nome}</strong><br>
          <small>${item.descricao}</small><br>
          R$ ${item.preco.toFixed(2)} x ${item.quantidade} = <strong>R$ ${subtotal.toFixed(2)}</strong><br>
          <button onclick="alterarQuantidade(${index}, 1)">+</button>
          <button onclick="alterarQuantidade(${index}, -1)">-</button>
          <button onclick="removerDoCarrinho(${index})">Remover</button>
        </div>
      </div>
    `;
    lista.appendChild(li);
    total += subtotal;
  });

  totalSpan.textContent = total.toFixed(2);
}

function alterarQuantidade(index, delta) {
  carrinho[index].quantidade += delta;
  if (carrinho[index].quantidade <= 0) {
    carrinho.splice(index, 1);
  }
  salvarCarrinho();
  atualizarCarrinho();
}

function removerDoCarrinho(index) {
  if (confirm('Deseja remover este item do carrinho?')) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    atualizarCarrinho();
  }
}

function finalizarCompra() {
  carrinho = [];
  salvarCarrinho();
  atualizarCarrinho();
  const msg = document.getElementById('mensagem-finalizacao');
  if (msg) msg.textContent = 'Compra finalizada com sucesso!';
}

// Função de pagamento
function simularPagamento() {
  const metodo = document.querySelector('input[name="metodoPagamento"]:checked')?.value;
  const nomeCartao = document.getElementById('nome-cartao')?.value;
  const numeroCartao = document.getElementById('numero-cartao')?.value;
  const validadeCartao = document.getElementById('validade-cartao')?.value;

  if ((metodo === 'debito' || metodo === 'credito') && (!nomeCartao || !numeroCartao || !validadeCartao)) {
    alert("Preencha todos os campos do cartão.");
    return;
  }

  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  if (metodo === 'pix') {
    alert(`Pagamento via Pix aprovado! Obrigado, ${usuarioAtual}.`);
  } else {
    alert(`Pagamento via ${metodo.charAt(0).toUpperCase() + metodo.slice(1)} aprovado! Obrigado, ${usuarioAtual}.`);
  }

  finalizarCompra();
}

// Mostrar/esconder campos de cartão conforme método selecionado
document.querySelectorAll('input[name="metodoPagamento"]').forEach(input => {
  input.addEventListener('change', function () {
    const campoCartao = document.getElementById('campoCartao');
    if (this.value === 'credito' || this.value === 'debito') {
      campoCartao.style.display = 'block';
    } else {
      campoCartao.style.display = 'none';
    }
  });
});

// Notificação
function mostrarNotificacao(mensagem) {
  let notificacao = document.getElementById('notificacao');
  if (!notificacao) {
    notificacao = document.createElement('div');
    notificacao.id = 'notificacao';
    Object.assign(notificacao.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: '#28a745',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: '5px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      zIndex: '9999',
      opacity: '0',
      transition: 'opacity 0.3s'
    });
    document.body.appendChild(notificacao);
  }
  notificacao.textContent = mensagem;
  notificacao.style.opacity = '1';
  setTimeout(() => {
    notificacao.style.opacity = '0';
  }, 2500);
}

// Auto-login
if (usuarioAtual) {
  document.getElementById('login-area')?.remove();
  document.getElementById('usuario-logado')?.textContent && (document.getElementById('usuario-logado').textContent = `Olá, ${usuarioAtual}`);
  carregarCarrinhoDoUsuario();
}