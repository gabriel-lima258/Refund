// Seleciona elementos do formulário
const form = document.querySelector('form')
const amount = document.getElementById('amount')
const expense = document.getElementById('expense')
const category = document.getElementById('category')

// Seleciona elementos da lista
const expenseList = document.querySelector('ul')
const expensesQuantity = document.querySelector('aside header p span')
const expensesTotal = document.querySelector('aside header h2')

// Removendo caracteres e permitindo somente números, oninput monitora o input
amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "")

  // Transforma o valor em centavos (exemplo: 150/100 = 1,50)
  value = Number(value) / 100

  amount.value = formatCurrencyBRL(value)
}

// formatando com padrão real BR
function formatCurrencyBRL(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
  return value
}

// Obtém o submit do formulário
form.onsubmit = (event) => {
  event.preventDefault()

  // Devolve um objeto como valor do form submit
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value, // name do select
    category_name: category.options[category.selectedIndex].text, // pega a opção selecionada
    amount: amount.value,
    created_at: new Date(),
  }

  // função para add a lista de despesa
  expenseAdd(newExpense)
}

// Adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    // cria o elemento para adicionar a despesa na lista
    const expenseItem = document.createElement('li')
    expenseItem.classList.add('expense')

    // cria o ícone da categoria
    const expenseIcon = document.createElement('img')
    expenseIcon.setAttribute('src', `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute('alt', newExpense.category_name)

    // cria a info da despesa
    const expenseInfo = document.createElement('div')
    expenseInfo.classList.add('expense-info')

    // cria o nome da despesa
    const expenseName = document.createElement('strong')
    expenseName.textContent = newExpense.expense

    // cria a categoria da despesa
    const expenseCategory = document.createElement('span')
    expenseCategory.textContent = newExpense.category_name

    // cria o valor da despesa
    const expenseAmount = document.createElement('span')
    expenseAmount.classList.add('expense-amount')
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")
    }`

    // cria o botão para remover
    const removeIcon = document.createElement('img')
    removeIcon.classList.add('remove-icon')
    removeIcon.setAttribute('src', `img/remove.svg`)
    removeIcon.setAttribute('alt', 'remover')

    // adiciona nome e categoria na div da info da despesas
    expenseInfo.append(expenseName, expenseCategory)

    // adiciona as informações no item 
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    // adiciona o item na lista
    expenseList.append(expenseItem)

    // limpa o form para add um novo
    formClear()

    // Atualiza os totais 
    updateTotals()
  } catch (error) {
    alert("Nao foi possível atualizar a lista da sua despesa")
    console.log(error)
  }
}

// Atualiza os totais
function updateTotals() {
  try {
    // recupera todos os itens (li) da lista (ul)
    const items = expenseList.children

    // Atualiza a quantidade de items da lista
    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

    // Variável para incrementar total
    let total = 0

    // Percorre cada item da lista
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")

      // exclui tudo que nao for numero e substitui , por .
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

      // converte o valor para float
      value = parseFloat(value)

      // verifica se um e um numero valido
      if(isNaN(value)) {
        return alert("Nao foi possível calcular, valor nao e um numero")
      }

      // incrementa o valor ao total
      total += Number(value)
    }

    // cria span pra add R$
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    // formatando o total e remove o R$ que sera exibido pela small com style
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    // limpa o conteúdo do elemento
    expensesTotal.innerHTML = ""

    // adiciona o simbolo da moeda e o valor total
    expensesTotal.append(symbolBRL, total)
  } catch (error) {
    console.log(error)
    alert("Nao foi possível atualizar os totais.")
  }
}

// evento que captura os items da lista 
expenseList.addEventListener("click", (event) => {
  // verifica se o ícone clicado foi de remover
  if (event.target.classList.contains('remove-icon')) {
    // Obtém a li pai do elemento com closest
    const item = event.target.closest(".expense")
    // remove o item
    item.remove()
  }
  // atualiza o total
  updateTotals()
})

// limpa o form depois de add uma despesa
function formClear() {
  // limpa os inputs
  expense.value = ""
  category.value = ""
  amount.value = ""

  // focus devolve o pointer no input para digitar um novo valor
  expense.focus()
}