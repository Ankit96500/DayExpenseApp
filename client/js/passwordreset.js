
console.log('i am working js from password reset');
const errorid = document.getElementById('error')


document.addEventListener('DOMContentLoaded',()=>{
    // it will first load the web browser
    
    document.getElementById('reset-form').addEventListener('submit', handleFormSubmit);
    
    // Handle form submission signup
    function handleFormSubmit(event) {
        event.preventDefault();
        
        const UserData = {
            email : document.getElementById('email').value,
        };
        // Create a new blog
        PasswordReset(UserData);

        // Reset the form fields
        document.getElementById('reset-form').reset();
    }
    

    
    // Call the API (POST)
   async function PasswordReset(UserData) {
        console.log("show me user demail",UserData);
        
        try {
            const response = await axios.post('http://localhost:3000/password/forgotpassword',UserData)
            alert(`Please Check Your Gmail ${response.data.data}`)
            // console.log('upcoming server resposne',response.data);
            

        } catch (error) {
            displayError(error);  // Example error message
            function displayError (error) {
            let err = document.getElementById('custom-alert');
            err.innerHTML = error.response.data.error;  // Insert error message
            err.style.display = 'block';  // Show the alert
            console.log("-----", error.response);  // Log error response
        
            // Optionally hide the alert after a few seconds
            setTimeout(function () {
                err.style.display = 'none';  // Hide alert after 5 seconds
            }, 5000);
        }
        }
        
    }
 

});





