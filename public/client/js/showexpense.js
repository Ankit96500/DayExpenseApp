

  // Assuming the data is fetched from an API

  async function getReport() {
    const token = localStorage.getItem('token')
    try {
        const response = await axios.get("http://13.203.0.136:3000/show-expense/user",{headers:{'Authorization':token}})
        
        const loadData = response.data
        console.log('inside the log data',loadData);
        
        const dailyData = loadData.daily
        const weeklyData = loadData.weekly
        const monthlyData = loadData.monthly
        const links = loadData.links
        
        // Set user summary information
        document.getElementById('userName').textContent = dailyData.name;
        document.getElementById('totalIncome').textContent = dailyData.totalIncome.toFixed(2);
        document.getElementById('totalExpense').textContent = dailyData.totalExpense.toFixed(2);

        const finalBalanceElement = document.getElementById('finalBalance');
        const finalBalance = dailyData.finalBalance;
        finalBalanceElement.textContent = finalBalance.toFixed(2);
        // console.log('my final balance',finalBalance);
        
        if (finalBalance < 0) {
            finalBalanceElement.style.color = 'red';
        } else {
            finalBalanceElement.style.color = 'green';
        }


    //-------------------DAILY DATA ----------------------------------------    
    
        const dailyExpenses = dailyData.expenses
        
        if (Array.isArray(dailyExpenses)) {
            // console.log('yeh array hai');

            // Select the table body
            const tableBody1 = document.querySelector('#expenseTable1 tbody');
            tableBody1.innerHTML = ''; // Clear previous table content
        
            // Loop through expenses and create table rows
            dailyExpenses.forEach((expense) => {
                const row = `
                <tr>
                    <td>${expense["S.no"]}</td>
                    <td>${expense.date}</td>
                    <td>${expense.category}</td>
                    <td>${expense.description}</td>
                    <td>${expense.amount.toFixed(2)}</td>
                </tr>
                `;
                tableBody1.insertAdjacentHTML('beforeend', row);
            });

        } else {
            // tableBody1.innerHTML = 'No User Data Found !'
            console.log('array naho hai');    
        }

    //---------------WEEKLY DATA -----------------------------------------
        const weeklyExpenses = weeklyData.expenses
        if (Array.isArray(weeklyExpenses)) {
            // console.log('yeh array hai');

            // Select the table body
            const tableBody2 = document.querySelector('#expenseTable2 tbody');
            tableBody2.innerHTML = ''; // Clear previous table content
        
            // Loop through expenses and create table rows
            weeklyExpenses.forEach((expense) => {
                const row = `
                <tr>
                    <td>${expense["S.no"]}</td>
                    <td>${expense.date}</td>
                    <td>${expense.category}</td>
                    <td>${expense.description}</td>
                    <td>${expense.amount.toFixed(2)}</td>
                </tr>
                `;
                tableBody2.insertAdjacentHTML('beforeend', row);
            });

        } else {
            // tableBody1.innerHTML = 'No User Data Found !'
            console.log('array naho hai');    
        }
    //---------------MONTHLY DATA -----------------------------------------
        const monthlyExpenses = monthlyData.expenses
        if (Array.isArray(monthlyExpenses)) {
            // console.log('yeh array hai');

            // Select the table body
            const tableBody3 = document.querySelector('#expenseTable3 tbody');
            tableBody3.innerHTML = ''; // Clear previous table content
        
            // Loop through expenses and create table rows
            monthlyExpenses.forEach((expense) => {
                const row = `
                <tr>
                    <td>${expense["S.no"]}</td>
                    <td>${expense.date}</td>
                    <td>${expense.category}</td>
                    <td>${expense.description}</td>
                    <td>${expense.amount.toFixed(2)}</td>
                </tr>
                `;
                tableBody3.insertAdjacentHTML('beforeend', row);
            });

        } else {
            // tableBody1.innerHTML = 'No User Data Found !'
            console.log('array naho hai');    
        }
    
    // get lement tag for links
        const llist = document.getElementById("link-list")

        if (Array.isArray(links)) {
            links.forEach((link,index) =>{
                const serialNumber = `${index + 1}. `; // Serial number starts from 1

                // Create a new <span> element to hold the serial number
                const serialSpan = document.createElement('span');
                serialSpan.textContent = serialNumber;
            
                const anchor = document.createElement('a');
                anchor.href = link;         // Set the href attribute to the link URL
                anchor.textContent = link; // Set the display text for the link

                // Append the <a> element to the <p> tag
                llist.appendChild(serialSpan);  // Add the serial number
                llist.appendChild(anchor);
                
                // Add a space after the link (optional)
                llist.appendChild(document.createTextNode(' '));
            })
            
        }


    } catch (error) {
        displayError("An error occurred: Invalid data" + error);  // Example error message
        function displayError (error) {
            let err = document.getElementById('custom-alert');
            err.innerHTML = error;  // Insert error message
            err.style.display = 'block';  // Show the alert
            console.log("-----", error.response);  // Log error response
        
            // Optionally hide the alert after a few seconds
            setTimeout(function () {
                err.style.display = 'none';  // Hide alert after 5 seconds
            }, 5000);
        }
        

    }
  }


  document.getElementById("downloadBtn").addEventListener("click",( handelDownloadReport));
  async function handelDownloadReport() {
    const token = localStorage.getItem('token')
    
    try {
        const response = await axios.get("http://13.203.0.136:3000/expense/download-report",{headers:{'Authorization':token}})
        
        console.log('Response received from server', response.data.data);
        const jsonData = response.data.data
        // const jsonString = JSON.stringify(jsonData, null, 2); // Pretty print with 2 spaces
        
        // console.log('Response json string', jsonString);
       
        // Create a link element
        const link = document.createElement('a');

        // link.href = response.data.data;
        link.href = jsonData;
        console.log('Link URL', link.href);

        // Set the download attribute to trigger the download
        link.download = "Expense-Tracker-Report.csv";  // Corrected the .json extension

        link.click();
      

        
    } catch (error) {
        console.log("-----",error.response.request.statusText);
        console.log('errro from server side',error);
    }
  }

getReport();

