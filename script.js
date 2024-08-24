// Seleciona elementos do formulário
const form = document.querySelector('form')
const amount = document.getElementById('amount')
const expense = document.getElementById('expense')
const category = document.getElementById('category')

// Seleciona elementos da lista
const expenseList = document.querySelector('ul')

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
  } catch (error) {
    alert("Nao foi possível atualizar a lista da sua despesa")
    console.log(error)
  }
}