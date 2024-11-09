document.getElementById('reset-password-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const token = window.location.pathname.split('/').pop(); // Extract the token from the URL
    console.log('show me password from client',newPassword);
    console.log('show me token from client',token);
    
    let data = {}
    data.newPassword = newPassword
    
    // reset the field
    document.getElementById('reset-password-form').reset()

    try {
        const response = await axios.post(`http://13.203.0.136:3000/password/reset-password-done/${token}`,data);

        // console.log('resonse comimng tfromt he server',response);
        alert("Your Password Has Been Changed !")
        window.close();
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
 });