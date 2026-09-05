/* =========================================
   CHANGE ONLY YOUR VIDEO FILE NAMES HERE
========================================= */

const INTRO_VIDEOS = {
    desktop: "Intro.mp4",
    mobile: "Mobile-Intro.mp4"
};

const VIDEO_CONFIG = {
    hot: "Hot.mp4",         // Replace with your hot weather video filename or path
    winter: "Winter.mp4",   // Replace with your cold weather video filename or path
    rain: "Rain.mp4"        // Replace with your rain weather video filename or path
};

/* =========================================
   WEATHER LOGIC CONSTANTS
========================================= */
const COLD_TEMP = 15;
const HOT_TEMP = 30;
const RAIN_HUMIDITY = 80;

// API Key loaded dynamically from config.js
const API_KEY = (typeof CONFIG !== "undefined" && CONFIG.API_KEY && CONFIG.API_KEY !== "YOUR_OPENWEATHERMAP_API_KEY") 
    ? CONFIG.API_KEY 
    : "";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const country = document.getElementById("country");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

const loading = document.getElementById("loading");
const error = document.getElementById("error");

// Setup video elements
const introVideo = document.getElementById("introVideo");
const introVideoSource = document.getElementById("introVideoSource");
const introScreen = document.getElementById("introScreen");
const stage = document.querySelector(".stage");

const bgVideo = document.getElementById("bgVideo");
const bgVideoSource = document.getElementById("bgVideoSource");

// Location permission modal elements
const locationModal = document.getElementById("locationModal");
const allowLocationBtn = document.getElementById("allowLocationBtn");
const searchManuallyBtn = document.getElementById("searchManuallyBtn");
const locModalTitle = document.getElementById("locModalTitle");
const locModalText = document.getElementById("locModalText");
const locModalButtons = document.getElementById("locModalButtons");

// Reusable function to switch the background video smoothly
function changeBackgroundVideo(videoPath) {
    if (!bgVideo || !bgVideoSource) return;

    // Resolve URL to compare absolute paths correctly
    const resolvedPath = new URL(videoPath, window.location.href).href;
    const currentSrc = bgVideo.currentSrc || bgVideoSource.src;

    if (currentSrc === resolvedPath && !bgVideo.paused) {
        return; // Avoid reloading the same video if it's already playing
    }

    // Smooth transition: fade out the video first
    bgVideo.style.opacity = "0";

    // Wait for the fade-out transition to complete, then change the source
    setTimeout(() => {
        bgVideoSource.src = videoPath;
        bgVideo.load();

        // Listen for when video actually starts playing to fade it in
        const onPlaying = () => {
            bgVideo.style.opacity = "1";
            bgVideo.removeEventListener("playing", onPlaying);
        };
        bgVideo.addEventListener("playing", onPlaying);

        // Keep it muted and loop it
        bgVideo.muted = true;
        bgVideo.loop = true;

        bgVideo.play().catch((err) => {
            console.warn("Autoplay failed or was blocked by browser. Showing video fallback.", err);
            // If autoplay fails, still make it visible (shows static first frame or poster)
            bgVideo.style.opacity = "1";
        });
    }, 800); // Matches the 0.8s transition in CSS
}

// Logic to select the correct video based on API weather data
function selectWeatherVideo(data) {
    if (!data || !data.weather || !data.weather[0] || !data.main) {
        changeBackgroundVideo(VIDEO_CONFIG.hot);
        return;
    }

    const weatherMain = data.weather[0].main;
    const humid = data.main.humidity;
    const temp = data.main.temp;

    // Normalize condition value to lowercase
    const condition = weatherMain ? weatherMain.toLowerCase() : "";

    // 1. Rain / Drizzle / Thunderstorm (Highest priority)
    if (condition === "rain" || condition === "drizzle" || condition === "thunderstorm") {
        changeBackgroundVideo(VIDEO_CONFIG.rain);
    }
    // 2. High Humidity (>= 80%)
    else if (humid >= RAIN_HUMIDITY) {
        changeBackgroundVideo(VIDEO_CONFIG.rain);
    }
    // 3. Winter / Cold temperature (<= 15°C)
    else if (temp <= COLD_TEMP) {
        changeBackgroundVideo(VIDEO_CONFIG.winter);
    }
    // 4. Hot temperature (>= 30°C)
    else if (temp >= HOT_TEMP) {
        changeBackgroundVideo(VIDEO_CONFIG.hot);
    }
    // 5. Default background (fallback)
    else {
        changeBackgroundVideo(VIDEO_CONFIG.hot);
    }
}

async function getWeather(query) {
    try {
        if (!API_KEY) {
            throw new Error("⚠️ API Key missing! Please set your OpenWeatherMap API key in config.js (refer to README.md).");
        }
        loading.style.display = "block";
        error.textContent = "";

        let url;
        if (typeof query === "object" && query.lat !== undefined && query.lon !== undefined) {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${query.lat}&lon=${query.lon}&appid=${API_KEY}&units=metric`;
        } else {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`;
        }
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();
        console.log(data);

        cityName.textContent = data.name;
        country.textContent = data.sys.country;
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        description.textContent = data.weather[0].description;
        feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
        humidity.textContent = `${data.main.humidity}%`;
        wind.textContent = `${data.wind.speed} m/s`;

        // Update the background video based on new weather data
        selectWeatherVideo(data);
        return true;

    } catch (err) {
        error.textContent = err.message;
        return false;
    } finally {
        loading.style.display = "none";
    }
}

function getIntroVideo() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
        return INTRO_VIDEOS.mobile;
    }
    return INTRO_VIDEOS.desktop;
}

let introTimeout;

// Function to handle the initial intro screen and transition to weather app
function startIntro() {
    if (introVideoSource && introVideo) {
        const introVideoPath = getIntroVideo();
        introVideoSource.src = introVideoPath;
        introVideo.load();
        
        // Use the ended event as the source of truth to hide the intro
        introVideo.addEventListener("ended", skipIntro);
        
        // Handle loading/source errors so it doesn't get stuck on a black screen
        introVideo.addEventListener("error", skipIntro);
        introVideoSource.addEventListener("error", skipIntro);

        // Safety timeout: transition anyway if video doesn't end in 12 seconds
        introTimeout = setTimeout(skipIntro, 12000);
        
        introVideo.play().catch(err => {
            console.warn("Intro video playback failed/blocked by browser. Skipping intro.", err);
            // Skip the intro early if the browser blocks playback completely
            skipIntro();
        });
    } else {
        skipIntro();
    }
}

function skipIntro() {
    if (introTimeout) {
        clearTimeout(introTimeout);
        introTimeout = null;
    }
    if (introScreen && !introScreen.classList.contains("fade-out")) {
        // Fade out Intro Screen
        introScreen.classList.add("fade-out");

        // Initialize location detection flow
        initLocationFlow();
    }
}

// Show location permission modal
function showLocationModal() {
    if (locationModal) {
        locModalTitle.textContent = "Location Access";
        locModalText.textContent = "Allow location access to get weather for your current location.";
        locModalButtons.style.display = "flex";
        locationModal.classList.remove("location-modal-hidden");
    }
}

// Hide location permission modal
function hideLocationModal() {
    if (locationModal) {
        locationModal.classList.add("location-modal-hidden");
    }
}

// Update modal text for loading states
function updateModalState(state, text) {
    if (!locationModal) return;
    if (state === "loading") {
        locModalTitle.textContent = "📍 Detecting Location...";
        locModalText.textContent = text;
        locModalButtons.style.display = "none";
    }
}

// Handle all Geolocation API error cases
function handleLocationError(err, setErrorMessage = true) {
    let msg = "We couldn't detect your location. Please search for your city manually.";
    if (err) {
        if (err.code === 1) {
            msg = "Location access was denied. You can search for a city manually.";
        } else if (err.code === 2) {
            msg = "Position unavailable. Please search for your city manually.";
        } else if (err.code === 3) {
            msg = "Location request timed out. Please search for your city manually.";
        }
    }
    
    // Hide the modal and transition to dashboard with fallback city Jaipur
    hideLocationModal();
    loadFallbackWeather(msg, setErrorMessage);
}

// Load default city weather and display friendly warning message
async function loadFallbackWeather(warningMessage, setErrorMessage = true) {
    const defaultCity = "Jaipur";
    await getWeather(defaultCity);
    if (setErrorMessage && warningMessage) {
        error.textContent = warningMessage;
    }
    
    // Focus search input to help user search manually
    if (cityInput) {
        cityInput.focus();
    }
}

// Initialize location flow after intro ends
function initLocationFlow() {
    // 1. Reveal stage so background video starts playing
    if (stage) {
        stage.classList.remove("stage-hidden");
        stage.offsetHeight; // force reflow
        stage.classList.add("stage-visible");
    }

    // 2. Check if we have cached coords or city
    const cachedCoords = localStorage.getItem("weather_coords");
    const cachedCity = localStorage.getItem("last_searched_city");

    if (cachedCoords) {
        try {
            const coords = JSON.parse(cachedCoords);
            getWeather(coords);
            return;
        } catch (e) {
            localStorage.removeItem("weather_coords");
        }
    }

    if (cachedCity) {
        getWeather(cachedCity);
        return;
    }

    // 3. Check browser permission query status if available
    if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: "geolocation" }).then(permissionStatus => {
            if (permissionStatus.state === "granted") {
                // Instantly fetch location without prompting
                getUserLocationDirectly();
            } else if (permissionStatus.state === "denied") {
                // Instantly fallback without prompting
                handleLocationError({ code: 1 }, true);
            } else {
                // Show custom modal
                showLocationModal();
            }
        }).catch(() => {
            showLocationModal();
        });
    } else {
        showLocationModal();
    }
}

// Helper to fetch location using IP Geolocation as a fallback
async function getIPLocation() {
    try {
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) throw new Error("IP geolocation failed");
        const data = await response.json();
        if (data.latitude && data.longitude) {
            return { lat: data.latitude, lon: data.longitude };
        }
    } catch (e) {
        console.warn("IP Geolocation fallback failed:", e);
    }
    return null;
}

// Fallback to IP Geolocation when native Geolocation fails or is blocked
async function fallbackToIP(err, setErrorMessage = true) {
    updateModalState("loading", "Detecting location via IP...");
    const ipCoords = await getIPLocation();
    if (ipCoords) {
        localStorage.setItem("weather_coords", JSON.stringify(ipCoords));
        localStorage.removeItem("last_searched_city");
        await getWeather(ipCoords);
        hideLocationModal();
    } else {
        handleLocationError(err, setErrorMessage);
    }
}

// Helper to fetch geolocation without modal UI
function getUserLocationDirectly() {
    if (!navigator.geolocation) {
        fallbackToIP(null, false);
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            localStorage.setItem("weather_coords", JSON.stringify({ lat, lon }));
            localStorage.removeItem("last_searched_city");
            await getWeather({ lat, lon });
        },
        async (err) => {
            console.warn("Direct Browser Geolocation failed, trying IP fallback...", err);
            fallbackToIP(err, false);
        },
        {
            enableHighAccuracy: false, // Set to false to work on desktops and prevent timeout errors
            timeout: 8000,
            maximumAge: 300000
        }
    );
}

// Request Browser Location (called when Allow Location button is clicked)
function requestUserLocation() {
    updateModalState("loading", "Detecting your location. Please check your browser's prompt.");

    if (!navigator.geolocation) {
        fallbackToIP(null, true);
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // Cache the coords and clear searched city
            localStorage.setItem("weather_coords", JSON.stringify({ lat, lon }));
            localStorage.removeItem("last_searched_city");

            updateModalState("loading", "Getting weather data...");
            
            await getWeather({ lat, lon });
            hideLocationModal();
        },
        async (err) => {
            console.warn("Browser Geolocation failed, trying IP fallback...", err);
            fallbackToIP(err, true);
        },
        {
            enableHighAccuracy: false, // Set to false to work on desktops and prevent timeout errors
            timeout: 8000,
            maximumAge: 300000
        }
    );
}

// Search Button Event Listener
searchBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim();

    if (city === "") {
        error.textContent = "Please enter a city name";
        return;
    }

    const success = await getWeather(city);
    if (success) {
        localStorage.setItem("last_searched_city", city);
        localStorage.removeItem("weather_coords");
    }
});

// Location Modal Button Click Handlers
if (allowLocationBtn) {
    allowLocationBtn.addEventListener("click", requestUserLocation);
}
if (searchManuallyBtn) {
    searchManuallyBtn.addEventListener("click", () => {
        hideLocationModal();
        loadFallbackWeather("");
    });
}

// Search input Enter key listener
cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

// Initialize on page load
window.addEventListener("DOMContentLoaded", () => {
    startIntro();
});