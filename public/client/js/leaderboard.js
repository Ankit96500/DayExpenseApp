
const showexpense = document.getElementById("showexpense")

async function getLeaderBoardData(params) {
    const token = localStorage.getItem('token')
    
    try {
          const response = await axios.get("http://13.203.0.136:3000/premium-feature/get-leaderboard-data",
      { headers: { Authorization: token } })
          if (response){
            const leaderboard = response.data.data
            if (Array.isArray(leaderboard)) {
                
                // Get the table body element
                const tbody = document.querySelector('#leaderboard-table tbody');

                // Clear any existing rows
                tbody.innerHTML = '';

                // Loop over each leaderboard entry and create a row
                leaderboard.forEach(entry => {
                    // Create a new table row
                    const row = document.createElement('tr');

                    // Create cells for S.no, Name, and Total Expense
                    const snoCell = document.createElement('td');
                    snoCell.textContent = entry['S.no'];

                    const nameCell = document.createElement('td');
                    nameCell.textContent = entry.name;

                    const expenseCell = document.createElement('td');
                    expenseCell.textContent = entry.total_expense;

                    // Append cells to the row
                    row.appendChild(snoCell);
                    row.appendChild(nameCell);
                    row.appendChild(expenseCell);

                    // Append the row to the table body
                    tbody.appendChild(row);
                });    
            }
          }
  
      } catch (error) {
        alert(error)
      }
}



//redirect showxpense
showexpense.addEventListener("click", async (e)=>{
  const token = localStorage.getItem("token");
  try {
    await axios.get("http://localhost:3000/show-expense/user", {
      headers: { Authorization: token },
    })
    window.location.href = "../home/showexpense.html";
  } catch (error) {
    alert(error)
  }
}) 




getLeaderBoardData();






