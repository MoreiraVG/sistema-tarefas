const form = document.getElementById('form');
const inputTitulo = document.getElementById('titulo');
const lista = document.getElementById('lista');
const vazio = document.getElementById('vazio');
const contador = document.getElementById('contador');

async function carregar() {
  const resposta = await fetch('/api/tarefas');
  const tarefas = await resposta.json();
  mostrar(tarefas);
}

function mostrar(tarefas) {
  lista.innerHTML = '';

  tarefas.forEach((t) => {
    const li = document.createElement('li');
    if (t.feita) li.classList.add('feita');

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = t.feita;
    check.addEventListener('change', () => alternar(t.id));

    const texto = document.createElement('span');
    texto.textContent = t.titulo;

    const botao = document.createElement('button');
    botao.className = 'excluir';
    // Ícone de lixeira em SVG para ficar mais moderno
    botao.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>`;
    botao.title = 'Excluir';
    botao.addEventListener('click', () => excluir(t.id));

    li.append(check, texto, botao);
    lista.appendChild(li);
  });

  const pendentes = tarefas.filter((t) => !t.feita).length;
  contador.textContent = `${pendentes} pendente(s) de ${tarefas.length}`;
  vazio.hidden = tarefas.length > 0;
}

async function alternar(id) {
  await fetch(`/api/tarefas/${id}`, { method: 'PUT' });
  carregar();
}

async function excluir(id) {
  await fetch(`/api/tarefas/${id}`, { method: 'DELETE' });
  carregar();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = inputTitulo.value.trim();
  if (!titulo) return;

  await fetch('/api/tarefas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo }),
  });

  inputTitulo.value = '';
  carregar();
});

carregar();