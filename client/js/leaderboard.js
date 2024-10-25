

console.log("java script is working");


function getLeaderBoardData(params) {
    const token = localStorage.getItem('token')
    
    try {
          axios.get("http://localhost:3000/premium-feature/get-leaderboard-data",
      { headers: { Authorization: token } })
          .then(response=>{
            console.log('response comig from the server',response); 
            const leaderboard = response.data.data
            if (Array.isArray(leaderboard)) {
                console.log('yeh array hai');
                
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


          })
          .catch(err=>{
            throw new Error(err);
          })
  
      } catch (error) {
        console.log('ledaer borad data not fetch');
        
      }
}


getLeaderBoardData();






