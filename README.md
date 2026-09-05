# 🌤️ Dynamic Weather Forecast Web Application

[![Live Demo](https://img.shields.io/badge/Netlify-Live_Demo-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://weather-forcast1-5a856c.netlify.app/)

A modern, visually immersive weather forecast web application featuring dynamic background video transitions that react to real-time weather conditions (*Hot*, *Winter*, *Rain*). Built with HTML5, CSS3 Glassmorphism UI design, Vanilla JavaScript (ES6+), and powered by the OpenWeatherMap API.

🌐 **Live Demo**: [https://weather-forcast1-5a856c.netlify.app/](https://weather-forcast1-5a856c.netlify.app/)

---

## 🎥 Application Demo Video

Check out the full walkthrough video of the Weather Forecast application:

<video src="Screen%20Recording%202026-08-22%20094731.mp4" controls="controls" style="max-width: 100%; border-radius: 12px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);">
  Your browser does not support playing HTML5 video. You can view the demo video directly in the repository: <code>Screen Recording 2026-08-22 094731.mp4</code>.
</video>

---

## ✨ Key Features

- 🎥 **Dynamic Video Backgrounds**: Seamlessly switches background videos based on real-time weather metrics:
  - 🌧️ **Rain / Drizzle / Humidity >= 80%** $\rightarrow$ Rainy video background
  - ❄️ **Temperature <= 15°C** $\rightarrow$ Winter/Cold video background
  - ☀️ **Temperature >= 30°C / Sunny** $\rightarrow$ Warm/Hot video background
- 📍 **Smart Geolocation Detection**: Automatically requests location permission to fetch weather for your exact coordinates, with IP-geolocation fallback.
- 🔍 **Global City Search**: Search and view detailed weather for any city worldwide with instant lookup & caching.
- 💎 **Glassmorphism UI**: Sleek modern design featuring backdrop blurs, floating glass cards, linear gradients, and interactive sidebars.
- 📱 **Fully Responsive Layout**: Customized splash intro transitions and layouts optimized for both Desktop and Mobile devices.
- 📊 **Detailed Weather Analytics**: Displays real-time temperature, "feels like" metrics, wind speed, humidity, condition descriptions, and location information.

---

## 🔒 API Key Security & Configuration

> [!IMPORTANT]
> **API Key Protection**: This repository uses a safe environment template (`config.example.js`). The actual API key is stored in `config.js`, which is ignored by Git (`.gitignore`) to keep sensitive credentials secure when pushed to public repositories.

### Quick Setup Steps:

1. **Obtain an OpenWeatherMap API Key**:
   - Sign up for a free account at [OpenWeatherMap](https://home.openweathermap.org/users/sign_up).
   - Generate your API key from the [OpenWeatherMap Dashboard](https://home.openweathermap.org/api_keys).

2. **Create Your Local `config.js` File**:
   - Duplicate `config.example.js` and rename it to `config.js`:
     ```bash
     cp config.example.js config.js
     ```
   - Open `config.js` and insert your API key:
     ```javascript
     const CONFIG = {
         API_KEY: "YOUR_OPENWEATHERMAP_API_KEY_HERE"
     };
     ```

3. **Verify Security**:
   - `config.js` is automatically excluded by `.gitignore`. Do **NOT** remove `config.js` from `.gitignore`.

---

## 📁 Project Structure

```
Weather-Forcast/
│
├── index.html              # Main HTML markup & structure
├── styles.css              # Styling, Glassmorphism design system & responsiveness
├── script.js               # Main application logic, API calls & video switcher
├── config.example.js       # Public configuration template file
├── config.js               # Local private configuration file (Git Ignored)
├── .gitignore              # Specifies files to ignore in Git version control
├── README.md               # Complete project documentation
├── LICENSE                 # Project license terms
│
├── Demo.mp4                 # Application feature demo video
├── Intro.mp4               # Desktop intro video animation
├── Mobile-Intro.mp4        # Mobile intro video animation
├── Hot.mp4                 # Background video for warm/hot weather
├── Winter.mp4              # Background video for cold/winter weather
└── Rain.mp4                # Background video for rainy weather
```

---

## 🚀 How to Run Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Weather-Forcast.git
   cd Weather-Forcast
   ```

2. **Set up API Key**:
   Create `config.js` as described in the [API Configuration](#-api-key-security--configuration) section above.

3. **Launch the Application**:
   - Simply double-click `index.html` to open it directly in your preferred web browser.
   - Or run it using a local dev server (e.g. VS Code **Live Server** extension or Python HTTP server):
     ```bash
     python -m http.server 8000
     ```
     Then navigate to `http://localhost:8000`.

---

## 🌐 Live Demo & Deployment

- ⚡ **Netlify Live App**: [https://weather-forcast1-5a856c.netlify.app/](https://weather-forcast1-5a856c.netlify.app/)

### Deploying to GitHub Pages:
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Add Netlify live link & demo video to README"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/Weather-Forcast.git
   git push -u origin main
   ```

2. Enable **GitHub Pages**:
   - Go to your repository on GitHub.
   - Click **Settings** $\rightarrow$ **Pages** (left sidebar).
   - Under **Source**, select `Deploy from a branch`.
   - Choose `main` branch and `/ (root)` folder, then click **Save**.

---

## 🛠️ Tech Stack & Tools

- **HTML5**: Semantic tags, HTML5 Video element with autoplay/mute attributes.
- **CSS3**: Dynamic viewport variables, CSS Flexbox/Grid, Glassmorphism backdrop-filters, custom keyframe animations.
- **JavaScript (ES6+)**: Async/Await Fetch API, Geolocation API, DOM Manipulation & Event Handling.
- **OpenWeatherMap API**: Live weather data provider.
- **Hosting**: Netlify / GitHub Pages.

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.
