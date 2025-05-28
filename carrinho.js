// Variáveis globais
let usuarioAtual = localStorage.getItem('usuarioAtual');
let produtos = JSON.parse(localStorage.getItem('produtos')) || [
  { nome: 'Camiseta Branca', preco: 50, descricao: 'Camiseta básica', imagem: 'camiseta.jpg' },
  { nome: 'Calça Jeans', preco: 120, descricao: 'Calça jeans azul', imagem: 'calca.jpg' }
];
let carrinho = [];

if (usuarioAtual) {
  carregarCarrinhoDoUsuario();
}

// Função de login
function fazerLogin() {
  const nome = document.getElementById('usuario').value;
  if (!nome) return alert('Digite seu nome de usuário.');

  usuarioAtual = nome;
  localStorage.setItem('usuarioAtual', nome);
  carregarCarrinhoDoUsuario();

  if (document.getElementById('usuario-logado')) {
    document.getElementById('usuario-logado').textContent = `Olá, ${usuarioAtual}`;
  }
  if (document.getElementById('login-area')) {
    document.getElementById('login-area').style.display = 'none';
  }
}

// Carregar carrinho do localStorage
function carregarCarrinhoDoUsuario() {
  const salvo = localStorage.getItem(`carrinho_${usuarioAtual}`);
  carrinho = salvo ? JSON.parse(salvo) : [];
  atualizarCarrinho();
}

// Salvar carrinho
function salvarCarrinho() {
  if (usuarioAtual) {
    localStorage.setItem(`carrinho_${usuarioAtual}`, JSON.stringify(carrinho));
  }
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(nome, preco) {
  const produto = produtos.find(p => p.nome === nome);
  if (!produto) {
    alert('Produto não encontrado.');
    return;
  }

  const item = carrinho.find(p => p.nome === nome);
  if (item) {
    item.quantidade += 1;
  } else {
    carrinho.push({
      nome: produto.nome,
      preco: produto.preco,
      quantidade: 1,
      descricao: produto.descricao || '',
      imagem: produto.imagem || ''
    });
  }

  salvarCarrinho();
  atualizarCarrinho();
  mostrarNotificacao(`${nome} foi adicionado ao carrinho.`);
}

// Atualiza carrinho na tela
function atualizarCarrinho() {
  const lista = document.getElementById('lista-carrinho');
  const totalSpan = document.getElementById('total');
  if (!lista || !totalSpan) return;

  lista.innerHTML = '';
  let total = 0;

  if (carrinho.length === 0) {
    lista.innerHTML = '<tr><td colspan="5"><em>Seu carrinho está vazio.</em></td></tr>';
    totalSpan.textContent = '0.00';
    return;
  }

  carrinho.forEach((item, index) => {
    const subtotal = item.preco * item.quantidade;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.nome}</td>
      <td>${item.descricao}</td>
      <td>
        ${item.quantidade}
        <button onclick="alterarQuantidade(${index}, 1)">+</button>
        <button onclick="alterarQuantidade(${index}, -1)">-</button>
      </td>
      <td>R$ ${item.preco.toFixed(2)}</td>
      <td>
        R$ ${subtotal.toFixed(2)}<br>
        <button onclick="removerDoCarrinho(${index})">Remover</button>
      </td>
    `;
    lista.appendChild(tr);
    total += subtotal;
  });

  totalSpan.textContent = total.toFixed(2);
}

// Alterar quantidade
function alterarQuantidade(index, delta) {
  carrinho[index].quantidade += delta;
  if (carrinho[index].quantidade <= 0) {
    carrinho.splice(index, 1);
  }
  salvarCarrinho();
  atualizarCarrinho();
}

// Remover item
function removerDoCarrinho(index) {
  if (confirm('Deseja remover este item do carrinho?')) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    atualizarCarrinho();
  }
}

// Finalizar compra
function finalizarCompra() {
  carrinho = [];
  salvarCarrinho();
  atualizarCarrinho();
  const msg = document.getElementById('mensagem-finalizacao');
  if (msg) msg.textContent = 'Compra finalizada com sucesso!';
}

// Simular pagamento
function simularPagamento() {
  const metodo = document.querySelector('input[name="metodoPagamento"]:checked')?.value;
  const nomeCartao = document.getElementById('nome-cartao')?.value;
  const numeroCartao = document.getElementById('numero-cartao')?.value;
  const validadeCartao = document.getElementById('validade-cartao')?.value;

  if ((metodo === 'debito' || metodo === 'credito') && (!nomeCartao || !numeroCartao || !validadeCartao)) {
    alert('Preencha os dados do cartão.');
    return;
  }

  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio.');
    return;
  }

  alert(`Pagamento via ${metodo.toUpperCase()} aprovado. Obrigado, ${usuarioAtual || 'cliente'}!`);
  finalizarCompra();
}

// Mostrar/esconder campos de cartão
document.addEventListener('DOMContentLoaded', () => {
  const radioButtons = document.querySelectorAll('input[name="metodoPagamento"]');
  radioButtons.forEach(btn => {
    btn.addEventListener('change', () => {
      const campo = document.getElementById('campoCartao');
      if (btn.value === 'credito' || btn.value === 'debito') {
        campo.style.display = 'block';
      } else {
        campo.style.display = 'none';
      }
    });
  });

  atualizarCarrinho();
});

// Mostrar notificação
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
document.addEventListener('DOMContentLoaded', () => {
  const botaoMenu = document.getElementById('botaoMenu');
  const menuDropdown = document.getElementById('menuDropdown');

  botaoMenu.addEventListener('click', () => {
    menuDropdown.style.display = menuDropdown.style.display === 'block' ? 'none' : 'block';
  });

  window.addEventListener('click', (e) => {
    if (!botaoMenu.contains(e.target) && !menuDropdown.contains(e.target)) {
      menuDropdown.style.display = 'none';
    }
  });
});
