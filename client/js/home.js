// Replace the following URL with your unique CRUD CRUD API endpoint
const API_URL = "http://localhost:3000/expense";
console.log('java script is working');

// Get elements from the DOM
const expenseInput = document.getElementById('expense');
const descriptionInput = document.getElementById('description');
const categoryInput = document.getElementById('category');
const addBtn = document.getElementById('add-btn');
const expenseList = document.getElementById('expense-list');

let editingId = null;  // To track which expense is being edited

// Function to render the expenses from the API
function renderExpenses() {
    const res= axios.get(`${API_URL}/get_dt`)
        .then(response => {
            expenseList.innerHTML = '';
            const expenses = response.data;

            expenses.forEach((expense) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${expense.expense_amount} - ${expense.desc} (${expense.category})
                    <span>
                        <button onclick="deleteExpense('${expense.id}')">Delete Expense</button>
                    </span>
                `;
                expenseList.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Error fetching expenses", error);
        });
        
}

// Function to add or edit an expense
function addExpense() {
    const expense_amount = expenseInput.value;
    const desc = descriptionInput.value;
    const category = categoryInput.value;

    if (expense_amount === '' || desc === '') {
        alert('Please fill in all fields');
        return;
    }

    const expense = {
        expense_amount,
        desc,
        category
    };

    // Adding a new expense
    axios.post(`${API_URL}/add_dt`, expense)
    .then(() => {
        renderExpenses();
        clearForm();
    })
    .catch(error => {
        console.error("Error adding expense", error);
    });
    
}

// Function to clear the form
function clearForm() {
    expenseInput.value = '';
    descriptionInput.value = '';
    categoryInput.value = 'Others';
}

// Function to edit an expense


// Function to delete an expense
function deleteExpense(id) {
    axios.delete(`${API_URL}/delete_dt/${id}`)
        .then(() => {
            renderExpenses();
        })
        .catch(error => {
            console.error("Error deleting expense", error);
        });
}

// Add event listener to the add button
addBtn.addEventListener('click', addExpense);

// Initial rendering of expenses from CRUD CRUD API
renderExpenses();
