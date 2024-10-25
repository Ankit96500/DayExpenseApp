console.log("JavaScript file is connected!");
// booking appointment app hit create,get api

document.addEventListener('DOMContentLoaded', () => {

    
    document.getElementById('signup-form').addEventListener('submit', handleFormSubmit);
    
    
    
    // Handle form submission signup
    function handleFormSubmit(event) {
        event.preventDefault();
        
        const UserData = {
            name: document.getElementById('name').value,
            password: document.getElementById('password').value,
            email: document.getElementById('email').value,
        };
        // Create a new blog
        SignupUser(UserData);
        
        // Reset the form fields
        document.getElementById('signup-form').reset();
    }
    
    
    // Create a new user (POST)
    function SignupUser(UserData) {
        axios.post('http://localhost:3000/admin/signup-user',UserData)
        .then(response => {
            alert('User Signup Successfully')
        })
        .catch(error => {
            const e = document.getElementById('error')
            e.innerHTML = error.response.data.error  
            console.log('Error posting blog:', error.response.data)
        });
        
    }
    
});






