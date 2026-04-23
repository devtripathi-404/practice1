const trackButton = document.querySelector('button[type="submit"]');
const locationInput = document.getElementById('locationInput');

// ==========================================
// 1. INITIALIZE THE MAP
// ==========================================
// We tell Leaflet to load inside our 'map-container' div.
// We set the default view coordinates to the center of India, zoomed out (level 5).
const map = L.map('map-container').setView([20.5937, 78.9629], 5);

// Add the visual street tiles from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// A variable to remember our map marker, so we can delete the old one when searching a new city
let currentMarker = null;

// ==========================================
// 2. THE SEARCH LOGIC
// ==========================================
trackButton.addEventListener('click', function(event) {
    event.preventDefault(); 
    
    let userCity = locationInput.value;
    if (!userCity) return; // Don't do anything if the box is empty

    trackButton.innerText = "Scanning...";

    // First: Ask our Python Backend for the Traffic Level
    fetch('http://localhost:8080/api/check-traffic', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: userCity }) 
    })
    .then(response => response.json()) 
    .then(backendData => {
        
        let trafficLevel = backendData.trafficLevel;

        // Second: Ask the public Nominatim API for the GPS Coordinates of the city
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${userCity}`)
        .then(res => res.json())
        .then(geoData => {
            trackButton.innerText = "Track Traffic";

            // If the map API couldn't find the city, stop here.
            if (geoData.length === 0) {
                alert("Could not find that location on the map!");
                return;
            }

            // Extract the exact Latitude and Longitude from the API response
            let lat = geoData[0].lat;
            let lon = geoData[0].lon;

            // Animate the map camera flying to the new city!
            map.flyTo([lat, lon], 13);

            // If there is already a pin on the map from a previous search, remove it
            if (currentMarker !== null) {
                map.removeLayer(currentMarker);
            }

            // Drop a new map marker at the coordinates
            currentMarker = L.marker([lat, lon]).addTo(map);
            
            // Attach a beautiful popup bubble to the marker displaying our Python data!
            currentMarker.bindPopup(`
                <div style="text-align: center;">
                    <strong style="font-size: 16px;">${userCity.toUpperCase()}</strong><br>
                    Current Traffic:<br>
                    <b style="color: #2563eb; font-size: 14px;">${trafficLevel}</b>
                </div>
            `).openPopup();
        });
    })
    .catch(error => {
        console.error("Error:", error);
        trackButton.innerText = "Server Offline";
        alert("Make sure your Python server is running!");
    });
});