const signupForm = document.getElementById('signupForm');
const nameInput = document.getElementById('newName');
const emailInput = document.getElementById('newEmail');
const passwordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const registerButton = document.querySelector('button[type="submit"]');

signupForm.addEventListener('submit', function(event) {
    event.preventDefault(); 

    const userName = nameInput.value;
    const userEmail = emailInput.value;
    const userPassword = passwordInput.value;
    const userConfirm = confirmPasswordInput.value;

    // 1. Basic Validation: Check if passwords match
    if (userPassword !== userConfirm) {
        alert("Oops! Your passwords do not match. Please try again.");
        return; // This stops the code from continuing
    }

    registerButton.innerText = "Creating Account...";

    // 2. Send the new user data to the Java Spring Boot server
    fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // We send the name, email, and password. Java will use SQL to create the user!
        body: JSON.stringify({
            name: userName,
            email: userEmail,
            password: userPassword
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json(); 
        } else {
            throw new Error("Email might already be registered.");
        }
    })
    .then(data => {
        console.log("Registration successful!", data);
        registerButton.innerText = "Account Created!";
        
        alert("Registration successful! You can now log in.");
        
        // Automatically route them to the login page
        window.location.href = "login.html"; 
    })
    .catch(error => {
        console.error("Sign up failed:", error);
        registerButton.innerText = "Register Now";
        alert("Registration failed. Ensure the Spring Boot server is running or try a different email.");
    });
});