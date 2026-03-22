// Seleciona o campo de valor pelo ID.
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// Seleciona os elementos da lista de despesas.
const expensesList = document.querySelector("ul");
const expensesQuantity = document.querySelector("aside header p span");
const expensesTotal = document.querySelector("aside header h2");

// Captura o evento de input no campo de valor.
amount.oninput = () => {
    // Obtem o valor atual do campo e remove tudo que não for número usando uma expressão regular.
    let value = amount.value.replace(/\D/g, "")

    // Transformar o valor em centavos, dividindo por 100.
    value = Number(value) / 100

    // Atualiza o valor do input.    
    amount.value = formatCurrencyBRL(value)
};

// Função para formatar o valor como moeda brasileira (BRL).
function formatCurrencyBRL(value) {
    // Formata o valor como moeda brasileira (BRL) usando o método toLocaleString.
    value = value.toLocaleString('pt-BR', { 
        style: 'currency', 
        currency: 'BRL',
    })
    // Retorna o valor formatado.
    return value;
};

// Captura o evento de submit do formulário para obter os dados do novo gasto.
form.onsubmit = (event) => {

    // Previne o comportamento padrão de recarregamento da página.
    event.preventDefault();

    // Cria um objeto com os dados do novo gasto, incluindo um ID único, o nome do gasto, a categoria, o valor e a data de criação.
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }
    // Chama a função para adicionar o novo gasto à lista de despesas.
    expenseAdd(newExpense);
};

// Função para adicionar um novo gasto à lista de despesas.
function expenseAdd(newExpense) {
    try {
        // Cria o elemento para adicionar o item (li) na lista (ul).
        const expenseItem = document.createElement("li");
        expenseItem.classList.add("expense");

        // Cri o icone da categoria.
        const expenseIcon = document.createElement("img");
        expenseIcon.setAttribute("src", `./img/${newExpense.category_id}.svg`);
        expenseIcon.setAttribute("alt", newExpense.category_name);

        // Cria a infor da despesa.
        const expenseInfo = document.createElement("div");
        expenseInfo.classList.add("expense-info");

        // Criar o nome da despesa.
        const expenseName = document.createElement("strong");
        expenseName.textContent = newExpense.expense;

        // Criar a categoria da despesa.
        const expenseCategory = document.createElement("span");
        expenseCategory.textContent = newExpense.category_name;

        // Adiciona nome e categoria na div de informações da despesa.
        expenseInfo.append(expenseName, expenseCategory);

        // Criar o valor da despesa.
        const expenseAmount = document.createElement("span");
        expenseAmount.classList.add("expense-amount");
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
            .toUpperCase()
            .replace("R$", "")}`;

        // Criar o ícone de remoção da despesa.
        const removeIcon = document.createElement("img");
        removeIcon.classList.add("remove-icon");
        removeIcon.setAttribute("src", "img/remove.svg");
        removeIcon.setAttribute("alt", "remover");

        // Adiciona as informações no item.
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

        // Adiciona o item na lista.
        expensesList.append(expenseItem);

        // Limpa o formulário após o envio.
        formClear();

        // Atualiza os totais
        updateTotals();

    } catch (error) {
        alert("Não foi possivel atualizar a lista de despesas.");
        console.error(error);
    }
};

// Função para atualizar a quantidade de despesas e o valor total.
function updateTotals() {
    try {
        //Recupera todos os itens (li) da lista (ul).
        const items = expensesList.children
        // Atualiza a quantidade de despesas.
        expensesQuantity.textContent = `${items.length} ${
            items.length > 1 ? "despesas" : "despesa"
        }`;

        // Variavel para incrementar o valor total.
        let total = 0;

        // Percorre cada item da lista, obtendo o valor da despesa e somando ao total.
        for(let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector(".expense-amount")

            // Removendo caracteres não numéricos e substituindo vírgula por ponto.
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")
            
            // Convertendo o valor para float.
            value = parseFloat(value);

            // Verificando se é um numero valido.
            if(isNaN(value)) {
                return alert(
                "Não foi possivel calcular o total. O valor não parecer ser um número válido."
                );
            }  
            // Incrementa o valor total.
            total += Number(value);
        }

        // Cria a span para adicionar o R$ antes do valor total.
        const symbolBRL = document.createElement("small");
        symbolBRL.textContent = "R$";

        // Formata o valor e remove o R$ que sera exibido pela small com um estilo customizado
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

        // Limpa o conteudo do elemento.
        expensesTotal.innerHTML = "";

        // Adiciona o simbolo da moeda e o valor formatado.
        expensesTotal.append(symbolBRL, total);

    } catch (error){
        console.log(error)
        alert("Não foi possivel atualizar os totais");
    }
};

// Evento que captura o clique no ícone de remoção da despesa.
expensesList.addEventListener("click", function(event) {
    // Verifica se o elemento clicado tem a classe "remove-icon".
    if (event.target.classList.contains("remove-icon")) {
        // Obtem a li pai do elemento clicado.
        const item = event.target.closest(".expense");
        // Remove o item da lista.
        item.remove();
    }
    // Atualiza os totais após a remoção do item.
    updateTotals();
});

// Função para limpar o formulário após o envio.
function formClear() {
    // Limpa os campos do formulário.
    expense.value = "";
    category.value = "";
    amount.value = "";

    // Define o foco para o campo de nome da despesa.
    expense.focus();
};
