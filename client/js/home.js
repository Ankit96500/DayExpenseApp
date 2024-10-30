// Replace the following URL with your unique CRUD CRUD API endpoint
const API_URL = "http://localhost:3000/expense";
console.log("java script is working");

// Get elements from the DOM
const expenseInput = document.getElementById("expense");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const addBtn = document.getElementById("add-btn");

const expenseList = document.getElementById("expense-list");
const buyPremium = document.getElementById("rzp-button1");
const errorid = document.getElementById("error");

document.getElementById("income-form").addEventListener("submit",(handleFormIncome));

// Function to render the expenses from the API
async function renderExpenses() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/get_dt`, { headers: { Authorization: token } })
    if (response) {
      expenseList.innerHTML = "";
      const expenses = response.data.data;

      //display total incom
      document.getElementById("showincome").innerHTML = `Total Income : ${response.data.user["total_income"]}`;

      //display username
      const usnm = document.getElementById("username");
      usnm.innerHTML = response.data.user["name"];

      // if isPremiumUser hide membership button
      if (response.data.user["isPremiumUser"]) {
        // console.log('yes yeh premium user jhai');
        const buyPremium = document.getElementById("rzp-button1");
        const ribbon = document.getElementById("ribbon");
        
        const leaderboard = document.getElementById("leaderboard");
        const showexpense = document.getElementById("showexpense")
        
        // Hide the membership button
        if (buyPremium) {
          buyPremium.style.display = "none"; // Hide the button
          leaderboard.style.display = 'inline';
          showexpense.style.display = 'inline';


          ribbon.innerHTML = "Congratulation You Have Become Premium User !!";
          leaderboard.innerText = "LeaderBoard";
          showexpense.innerText = "ShowExpense";
        }
      }else{
            // Optionally, hide the options if the user is not premium (redundant since they are hidden by default)
            leaderboard.style.display = "none";
            showexpense.style.display = "none";
            buyPremium.style.display = "inline"; // Hide the button

      }

      if (Array.isArray(expenses)) {
        expenses.forEach((expense) => {
          const li = document.createElement("li");
          li.classList.add("expense-item");  // Add class for styling
          li.innerHTML = `${expense.expense_amount} - ${expense.desc} (${expense.category})
          <span class="delete-button">
            <button onclick="deleteExpense('${expense.id}')">Delete Expense</button>
          </span> `;
          expenseList.appendChild(li);
        }); 
      }

    }
    
  } catch (error) {
    const e = document.getElementById("error");
    e.innerHTML = error;
    // console.error("Error fetching expenses", error.response.data.error);
  }
  
}

// Function to add or edit an expense
async function addExpense() {
  console.log("add expense calling finxtio n");

  const expense_amount = expenseInput.value;
  const desc = descriptionInput.value;
  const category = categoryInput.value;

  if (expense_amount === "" || desc === "") {
    alert("Please fill in all fields");
    return;
  }

  const expense = {expense_amount,desc,category,};

  const token = localStorage.getItem("token");
  
  // Adding a new expense
  try {
    const response = await axios.post(`${API_URL}/add_dt`, expense, { headers: { Authorization: token } })
    if (response) {
      renderExpenses();
      clearForm();      
    }
    
  } catch (error) {
    errorid.innerHTML = error.response.data.error;
    
  }
}

// Function to clear the form
function clearForm() {
  expenseInput.value = "";
  descriptionInput.value = "";
  categoryInput.value = "Others";
}

// Function to edit an expense

// Function to delete an expense
async function deleteExpense(id) {
  const token = localStorage.getItem("token");
  try {
    await axios.delete(`${API_URL}/delete_dt/${id}`, { headers: { Authorization: token } })
    renderExpenses();
    
  } catch (error) {
    errorid.innerHTML = error.response.data.error;
  }
}

// function buy premium handeler
buyPremium.addEventListener("click", async (e) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "http://localhost:3000/buy-premium/purchase",
    { headers: { Authorization: token } }
  );
  console.log("response", response);

  var options = {
    key: response.data.key_id, // Enter the Key ID generated from the Dashboard
    order_id: response.data.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    description: "Test Transaction",
    // "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
    handler: async function (res) {
      await axios.post(
        "http://localhost:3000/buy-premium/update-transaction-status",
        {
          order_id: options.order_id,
          payment_id: res.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );

      window.location.reload(); // reload the page
    },
  };

  var rzp1 = new Razorpay(options);

  rzp1.open();
  e.preventDefault();

  // if payement failed..
  rzp1.on("payment.failed", async function (params) {
    await axios
      .post(
        "http://localhost:3000/buy-premium/transaction-failed",
        { order_id: options.order_id },
        { headers: { Authorization: token } }
      )
      .then((response) => {
        console.log("payment failed..", response);
      })
      .catch((error) => {
        console.log(error);
      });

    alert("Oops Payment Failed...");
  });
});

async function handleFormIncome(e){
  e.preventDefault();

  //get token
  const token = localStorage.getItem('token')
  
  const userincome = {
    income:document.getElementById('income').value
  };
  console.log('userincome',userincome);
  
  // take display income object
  const showincome = document.getElementById("showincome")
  showincome.innerHTML = "";
  
  try {
    const response = await axios.post(`http://localhost:3000/admin/update-income`,userincome,{headers:{'Authorization':token}})
    showincome.innerHTML= `Total Income : ${response.data.data}`;

    //reset the field:
    document.getElementById('income-form').reset();
  
  } catch (error) {
    console.log('server error',error);
        
  }
}



// redirect leaderboard
leaderboard.addEventListener("click", async (e) => {
  const token = localStorage.getItem("token");
  try {
    await axios.get("http://localhost:3000/premium-feature/leaderboard", {
        headers: { Authorization: token },
      })
      window.location.href = "../home/leaderboard.html";
  } catch (error) {
    console.log("leaderboard borad data not fetch");
  }
});

//redirect showxpense
showexpense.addEventListener("click", async (e)=>{
  const token = localStorage.getItem("token");
  try {
    await axios.get("http://localhost:3000/show-expense/user", {
      headers: { Authorization: token },
    })
    window.location.href = "../home/showexpense.html";
  } catch (error) {
    console.log('error occur',error);
  }
}) 





// Add event listener to the add button
addBtn.addEventListener("click", addExpense);

// Initial rendering of expenses from CRUD CRUD API
renderExpenses();
