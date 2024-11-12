// Replace the following URL with your unique CRUD CRUD API endpoint
// const API_URL = "http://13.203.0.136:3000/expense";
const API_URL = "http://13.203.0.136:3000/expense";


// pagination setup to display expense define globally
var currentPage = 1;
var totalPages = 1;
var limit = localStorage.getItem('limit') || 4  // default value


// Get elements from the DOM
// user input data get
const expenseInput = document.getElementById("expense");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const addBtn = document.getElementById("add-btn");


// Add event listener to the add button
addBtn.addEventListener("click", addExpense);


// user click premiuim btn get
const buyPremium = document.getElementById("rzp-button1");

// user expense list get attributes
const expenseList = document.getElementById("expense-list");
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');
const limitPicker = document.getElementById("limit");

const errorid = document.getElementById("error");

document.getElementById("income-form").addEventListener("submit",(handleFormIncome));

// Function to render to Home page from the API
async function renderHomePage(page) {
  const token = localStorage.getItem("token");
  // update value dynamically
  limitPicker.value = limit ? limit : 4;
  try {
      if (token === null) {
        // if token not available
        window.location.href = "../account/login.html"
      } 
      const response = await axios.get(`${API_URL}/get_dt?page=${page}&limit=${limit}`,{ headers: { Authorization: token } })

    if (response) {
      
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


          ribbon.style.display ="inline";
          leaderboard.innerText = "LeaderBoard";
          showexpense.innerText = "ShowExpense";
        }
      }else{
            // Optionally, hide the options if the user is not premium (redundant since they are hidden by default)
            leaderboard.style.display = "none";
            showexpense.style.display = "none";
            buyPremium.style.display = "inline"; // Hide the button

      }

      // pagination configuration setup 
      currentPage = response.data.currentPage
      totalPages = response.data.totalPages

      
      expenseList.innerHTML = "";

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

      // Update page info and button states
      pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
      prevPageBtn.disabled = currentPage === 1;
      nextPageBtn.disabled = currentPage === totalPages;

    }
    
  } catch (error) {
    displayError(error);  // Example error message
    function displayError (error) {
        let err = document.getElementById('custom-alert');
        err.innerHTML = error;  // Insert error message
        err.style.display = 'block';  // Show the alert
    
        // Optionally hide the alert after a few seconds
        setTimeout(function () {
            err.style.display = 'none';  // Hide alert after 5 seconds
        }, 5000);
    }
  }
  
}



// Function to add or edit an expense
async function addExpense() {
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
  if (token === null) {
    // if token not available
    window.location.href = "../account/login.html"
  } 

  try {
    const response = await axios.post(`${API_URL}/add_dt`, expense, { headers: { Authorization: token } })
    console.log('expense respsne',response);
    
    if (response) {
      renderHomePage(currentPage);
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

// Function to delete an expense
async function deleteExpense(id) {
  const token = localStorage.getItem("token");

  try {
    if (token === null) {
      // if token not available
      window.location.href = "../account/login.html"
    } 

    await axios.delete(`${API_URL}/delete_dt/${id}`, { headers: { Authorization: token } })
    renderHomePage(currentPage);
    
  } catch (error) {
    errorid.innerHTML = error.response.data.error;
  }
}

// function buy premium handeler
buyPremium.addEventListener("click", async (e) => {
  const token = localStorage.getItem("token");
  try {
    if (token === null) {
      // if token not available
      window.location.href = "../account/login.html"
    } 
    const response = await axios.get("http://13.203.0.136:3000/buy-premium/purchase",{ headers: { Authorization: token } });
    var options = {
      key: response.data.key_id, // Enter the Key ID generated from the Dashboard
      order_id: response.data.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      description: "Test Transaction",
      // "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
      handler: async function (res) {
        await axios.post(
          "http://13.203.0.136:3000/buy-premium/update-transaction-status",
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
       try {
         await axios.post("http://13.203.0.136:3000/buy-premium/transaction-failed",
             { order_id: options.order_id },{ headers: { Authorization: token } })
       } catch (error) {
         throw new Error(error);
       }
      // alert("Oops Payment Failed...");
    });
  } catch (error) {
    displayError(error);  // Example error message
    function displayError (error) {
        let err = document.getElementById('custom-alert');
        err.innerHTML = `${error} Check Your Internet Connection`;  // Insert error message
        err.style.display = 'block';  // Show the alert
      
        // Optionally hide the alert after a few seconds
        setTimeout(function () {
            err.style.display = 'none';  // Hide alert after 5 seconds
        }, 5000);
    }
  }
  
  
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
    if (token === null) {
      // if token not available
      window.location.href = "../account/login.html"
    } 

    const response = await axios.post(`http://13.203.0.136:3000/admin/update-income`,userincome,{headers:{'Authorization':token}})
    showincome.innerHTML= `Total Income : ${response.data.data}`;

    //reset the field:
    document.getElementById('income-form').reset();
  
  } catch (error) {
    displayError(error);  // Example error message
    function displayError (error) {
        let err = document.getElementById('custom-alert');
        err.innerHTML = `${error} Check Your Internet Connection`;  // Insert error message
        err.style.display = 'block';  // Show the alert
        // Optionally hide the alert after a few seconds
        setTimeout(function () {
            err.style.display = 'none';  // Hide alert after 5 seconds
        }, 5000);
    }
        
  }
}


// redirect leaderboard
leaderboard.addEventListener("click", async (e) => {
  const token = localStorage.getItem("token");
  try {
    if (token === null) {
      // if token not available
      window.location.href = "../account/login.html"
    } 

    await axios.get("http://13.203.0.136:3000/premium-feature/leaderboard", {
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
    if (token === null) {
      // if token not available
      window.location.href = "../account/login.html"
    } 

    await axios.get("http://13.203.0.136:3000/show-expense/user", {
      headers: { Authorization: token },
    })
    window.location.href = "../home/showexpense.html";
  } catch (error) {
    console.log('error occur',error);
  }
}) 


// Handle next page button click
nextPageBtn.addEventListener('click', () => {
  if (currentPage < totalPages) { 
    renderHomePage(currentPage + 1,limit);
  }
});

// Handle previous page button click
prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    renderHomePage(currentPage - 1,limit);
  }
});

// Add event listener to the number picker (limit input)
limitPicker.addEventListener('change', () => {
  limit = parseInt(limitPicker.value);  // Get the selected limit value
  localStorage.setItem('limit',limit)
  currentPage = 1;  // Reset to the first page when the limit changes
  renderHomePage(currentPage);   // Re-render the page with the new limit
});


// Initial rendering of expenses from CRUD CRUD API
renderHomePage(currentPage);

