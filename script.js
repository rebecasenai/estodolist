// =============================================================
//  EsToDoList - CRUD básico de tarefas (versão adaptada)
//  Autor original: Prof. Rafael Ribas
//  Adaptação: Estudante + ChatGPT (Front-End Clean Code Assistant)
// =============================================================

// -------------------------------
// 1. Selecionar os elementos da página
// -------------------------------
const campoNovaTarefa = document.getElementById('novaTarefa')
const botaoAdicionar = document.getElementById('btnAdicionar')
const listaTarefas = document.getElementById('listaTarefas')
const campoPesquisa = document.getElementById('pesquisaTarefa')
const seletorFiltro = document.getElementById('filtroTarefas')

// Array principal que armazenará todas as tarefas
let tarefas = []

// -------------------------------
// 2. Carregar tarefas salvas no navegador (localStorage)
// -------------------------------
function carregarTarefasSalvas() {
  const tarefasSalvas = localStorage.getItem('tarefas')
  if (tarefasSalvas) {
    tarefas = JSON.parse(tarefasSalvas)
    exibirTarefas(tarefas)
  }
}

// -------------------------------
// 3. Salvar as tarefas no navegador
// -------------------------------
function salvarTarefas() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

// -------------------------------
// 4. Função para adicionar uma nova tarefa
// -------------------------------
function adicionarTarefa() {
  const texto = campoNovaTarefa.value.trim()

  if (texto === '') {
    alert('Digite uma tarefa antes de adicionar!')
    return
  }

  const novaTarefa = {
    id: Date.now(),
    texto: texto,
    concluida: false
  }

  tarefas.unshift(novaTarefa)
  salvarTarefas()
  exibirTarefas(tarefas)
  campoNovaTarefa.value = ''
}

// -------------------------------
// 5. Função para exibir as tarefas na tela
// -------------------------------
function exibirTarefas(listaParaMostrar) {
  listaTarefas.innerHTML = ''

  for (let tarefa of listaParaMostrar) {
    const item = document.createElement('li')
    item.className =
      'flex justify-between items-center p-3 border border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition'

    // Div esquerda (checkbox + texto)
    const divEsquerda = document.createElement('div')
    divEsquerda.className = 'flex items-center gap-3 flex-grow'

    // Checkbox
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = tarefa.concluida
    checkbox.className = 'w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
    checkbox.onclick = function() {
      alternarConclusao(tarefa.id)
    }

    // Texto da tarefa
    const textoTarefa = document.createElement('span')
    textoTarefa.textContent = tarefa.texto
    textoTarefa.className = 'select-none'
    if (tarefa.concluida) {
      textoTarefa.classList.add('line-through', 'text-gray-400')
    }

    // Montar div esquerda
    divEsquerda.appendChild(checkbox)
    divEsquerda.appendChild(textoTarefa)

    // Div direita (botões)
    const botoes = document.createElement('div')
    botoes.className = 'flex gap-2'

    // Botão editar (só aparece se não estiver concluída)
    if (!tarefa.concluida) {
      const botaoEditar = document.createElement('button')
      botaoEditar.textContent = '✏️'
      botaoEditar.className =
        'px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded'
      botaoEditar.onclick = function () {
        editarTarefa(tarefa.id)
      }
      botoes.appendChild(botaoEditar)
    }

    // Botão excluir
    const botaoExcluir = document.createElement('button')
    botaoExcluir.textContent = '🗑️'
    botaoExcluir.className =
      'px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded'
    botaoExcluir.onclick = function () {
      excluirTarefa(tarefa.id)
    }
    botoes.appendChild(botaoExcluir)

    // Montar o item completo
    item.appendChild(divEsquerda)
    item.appendChild(botoes)
    listaTarefas.appendChild(item)
  }
}

// -------------------------------
// 6. Alternar entre concluída e ativa
// -------------------------------
function alternarConclusao(id) {
  for (let tarefa of tarefas) {
    if (tarefa.id === id) {
      tarefa.concluida = !tarefa.concluida
      break
    }
  }
  salvarTarefas()
  exibirTarefas(tarefas)
}

// -------------------------------
// 7. Editar tarefa
// -------------------------------
function editarTarefa(id) {
  const tarefa = tarefas.find(t => t.id === id)
  if (tarefa.concluida) {
    alert('Não é possível editar uma tarefa concluída!')
    return
  }

  const novaDescricao = prompt('Edite a tarefa:', tarefa.texto)
  if (novaDescricao === null || novaDescricao.trim() === '') return

  tarefa.texto = novaDescricao.trim()
  salvarTarefas()
  exibirTarefas(tarefas)
}

// -------------------------------
// 8. Excluir tarefa
// -------------------------------
function excluirTarefa(id) {
  const confirmar = window.confirm('Tem certeza que deseja excluir esta tarefa?')
  if (confirmar) {
    tarefas = tarefas.filter(tarefa => tarefa.id !== id)
    salvarTarefas()
    exibirTarefas(tarefas)
  }
}

// -------------------------------
// 9. Pesquisa
// -------------------------------
function pesquisarTarefas() {
  const termo = campoPesquisa.value.toLowerCase()
  const filtradas = tarefas.filter(tarefa =>
    tarefa.texto.toLowerCase().includes(termo)
  )
  exibirTarefas(filtradas)
}

// -------------------------------
// 10. Filtro (Todos / Ativos / Concluídos)
// -------------------------------
function filtrarTarefas() {
  const tipo = seletorFiltro.value
  let filtradas = []

  if (tipo === 'todos') {
    filtradas = tarefas
  } else if (tipo === 'ativos') {
    filtradas = tarefas.filter(tarefa => !tarefa.concluida)
  } else if (tipo === 'concluidos') {
    filtradas = tarefas.filter(tarefa => tarefa.concluida)
  }

  exibirTarefas(filtradas)
}

// -------------------------------
// 11. Eventos
// -------------------------------
botaoAdicionar.addEventListener('click', adicionarTarefa)
campoPesquisa.addEventListener('input', pesquisarTarefas)
seletorFiltro.addEventListener('change', filtrarTarefas)

// -------------------------------
// 12. Adicionar ao pressionar Enter
// -------------------------------
campoNovaTarefa.addEventListener('keydown', function (evento) {
  if (evento.key === 'Enter') {
    adicionarTarefa()
  }
})

// -------------------------------
// 13. Carregar tarefas salvas ao iniciar
// -------------------------------
window.onload = carregarTarefasSalvas