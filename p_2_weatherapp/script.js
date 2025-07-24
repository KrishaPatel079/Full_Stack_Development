// script.js

const weatherData = {
  "ahmedabad": "25°C, Sunny",
  "surat": "18°C, Cloudy",
  "delhi": "22°C, Partly Cloudy",
  "mumbai": "30°C, Hot and Sunny",
  "rajkot": "29°C, Humid",
  "kolkata": "34°C, Sunny"
};

// Event listener for the button click
document.getElementById("getWeatherBtn").addEventListener("click", () => {
  const cityInput = document.getElementById("cityInput").value.trim().toLowerCase();
  const resultDiv = document.getElementById("weatherResult");

  if (cityInput in weatherData) {
    resultDiv.textContent = `Weather in ${cityInput.charAt(0).toUpperCase() + cityInput.slice(1)}: ${weatherData[cityInput]}`;
  } 
  else if (!cityInput){
    resultDiv.textContent = "Please enter city name!!";
  }
  else {
    resultDiv.textContent = "City not found. Please try another.";
  }
});
