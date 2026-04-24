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

    // 2. Send the new user data to the Python backend
    fetch('https://practice1-syjs.onrender.com/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: userName,
            email: userEmail,
            password: userPassword
        })
    })
    .then(response => {
        // 3. Make our error handling much smarter!
        if (response.ok) {
            return response.json(); 
        } else if (response.status === 400) {
            // This catches the exact error Python sends if the email is a duplicate
            throw new Error("This email is already registered. Try logging in!");
        } else {
            throw new Error("Could not connect to the Python server.");
        }
    })
    .then(data => {
        console.log("Registration successful!", data);
        registerButton.innerText = "Account Created!";
        
        alert("Registration successful! You can now log in.");
        
        window.location.href = "login.html"; 
    })
    .catch(error => {
        // 4. Display the exact error message we created above
        console.error("Sign up failed:", error);
        registerButton.innerText = "Register Now";
        
        alert("Error: " + error.message + "\n(If the server is off, ensure Uvicorn is running in your terminal)");
    });
}); // <--- THIS IS THE MISSING PIECE THAT FIXES THE FILE!