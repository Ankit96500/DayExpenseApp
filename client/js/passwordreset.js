
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
        const token = localStorage.getItem("token");
        console.log("show me user d=email",UserData);
        
        try {
            const response = await axios.post('http://localhost:3000/password/forgotpassword',UserData)

            console.log('upcoming server resposne',response);
            

        } catch (error) {
            const e = document.getElementById('error')
            // e.innerHTML = error.response.data.error  
            console.log('Error password reset:', error)
        }
        
    }
 

});





