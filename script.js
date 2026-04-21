// 1. We tell JavaScript to find the button and the input box using their IDs (you'll need to add an id="trackBtn" to your button in HTML)
const trackButton = document.querySelector('button[type="submit"]');
const locationInput = document.getElementById('locationInput');

trackButton.addEventListener('click', function(event) {
    event.preventDefault(); 
    
    // 1. Grab the city the user typed
    let userCity = locationInput.value;
    
    // 2. Change the button text so the user knows it's working
    trackButton.innerText = "Scanning...";

    // ---------------------------------------------------------
    // THE NEW FETCH COMMAND: Sending the data to Java!
    // ---------------------------------------------------------
    
    // This URL is where your teammate's Spring Boot server will be running on their computer
    fetch('http://localhost:8080/api/check-traffic', { 
        method: 'POST', // 'POST' means we are SENDING data to the server
        headers: {
            'Content-Type': 'application/json' // Telling Java we are sending JSON data
        },
        // We package the city name into a JSON format
        body: JSON.stringify({ location: userCity }) 
    })
    .then(response => response.json()) // 3. Wait for the Java server to reply
    .then(javaData => {
        // 4. This block runs when Java successfully replies!
        console.log("Success! The Java server replied with:", javaData);
        
        // Change the button back to normal
        trackButton.innerText = "Track Traffic";
        
        // Show the real result from Java to the user!
        alert("Java says the traffic in " + userCity + " is: " + javaData.trafficLevel);
    })
    .catch(error => {
        // 5. This runs if the Java server is turned off or crashes
        console.error("Error: Could not reach the Java server.", error);
        trackButton.innerText = "Server Offline";
        alert("Oops! Make sure your teammate has the Spring Boot server running!");
    });
});