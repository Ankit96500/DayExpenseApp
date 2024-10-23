
console.log("JavaScript file is connected!");

document.getElementById('login-form').addEventListener('submit',handleFormLogin);



// handel form submission login
function handleFormLogin(event){
    event.preventDefault();

    const UserData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };
    // Create a new blog
    LoginUser(UserData);

    // Reset the form fields
    document.getElementById('login-form').reset();
   
}

// login a user (POST)

function LoginUser(LoginUserData) {
    const e  = document.getElementById('error')
    axios.post('http://localhost:3000/admin/login-user',LoginUserData)
    .then(response =>{
        alert('User Login SUccessfully')
        // Redirect to another HTML page
        console.log(response.data.token);
        localStorage.setItem('token',response.data.token);
        window.location.href = "../home/home.html"; 
    })
    .catch(error =>{
        e.innerHTML = error.response.data.error
    });
}




