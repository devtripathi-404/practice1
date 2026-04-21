// 1. Grab the form and the inputs
const loginForm = document.querySelector('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginButton = document.querySelector('button[type="submit"]');

// 2. Listen for the form submission
loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop the page from refreshing

    // 3. Grab the typed email and password
    const userEmail = emailInput.value;
    const userPassword = passwordInput.value;

    // Change button text to show it's loading
    loginButton.innerText = "Authenticating...";

    // 4. Send the data to the Java Spring Boot server
    fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // Package both the email AND password into the JSON payload
        body: JSON.stringify({
            email: userEmail,
            password: userPassword
        })
    })
    .then(response => {
        // 5. Check if Java said "OK" (status 200) or "Unauthorized" (status 401)
        if (response.ok) {
            return response.json(); 
        } else {
            throw new Error("Invalid email or password");
        }
    })
    .then(data => {
        // 6. This runs if the login was a match in the SQL database!
        console.log("Login successful!", data);
        loginButton.innerText = "Success!";
        
        alert("Welcome back! Routing you to the dashboard...");
        
        // Automatically send the user back to the home page
        window.location.href = "index.html"; 
    })
    .catch(error => {
        // 7. This runs if the password was wrong OR the server is off
        console.error("Login failed:", error);
        loginButton.innerText = "Sign In";
        alert("Login failed. Check your credentials or ensure the Spring Boot server is running.");
    });
});