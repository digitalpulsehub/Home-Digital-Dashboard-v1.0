// Clock and Date
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date').textContent = now.toLocaleDateString('en-US', options);
}

// Update last update time
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('lastUpdateTime').textContent = timeString;
}

// Weather (Geolocalized)
async function fetchWeather() {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const { latitude, longitude } = position.coords;
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius`
        );
        const data = await response.json();
        const weather = data.current_weather;
        
        // Convert weather code to description
        const weatherCodes = {
            0: "Clear sky ☀️",
            1: "Mainly clear 🌤️",
            2: "Partly cloudy ⛅",
            3: "Overcast ☁️",
            45: "Foggy 🌫️",
            48: "Depositing rime fog 🌫️",
            51: "Light drizzle 🌧️",
            53: "Moderate drizzle 🌧️",
            55: "Dense drizzle 🌧️",
            61: "Slight rain 🌦️",
            63: "Moderate rain 🌧️",
            65: "Heavy rain 🌧️",
            71: "Slight snow fall 🌨️",
            73: "Moderate snow fall 🌨️",
            75: "Heavy snow fall ❄️",
            95: "Thunderstorm ⛈️"
        };
        
        const weatherDescription = weatherCodes[weather.weathercode] || `Code: ${weather.weathercode}`;
        
        document.getElementById('weather').innerHTML = `
            <div class="weather-temp">${weather.temperature}°C</div>
            <div class="weather-description">${weatherDescription}</div>
            <div>Wind: ${weather.windspeed} km/h</div>
            <div>Wind Direction: ${weather.winddirection}°</div>
            <div>Location: ${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E</div>
        `;
        updateLastUpdateTime();
    } catch (error) {
        console.error('Weather fetch error:', error);
        document.getElementById('weather').innerHTML = '<div>Unable to get location. Please enable geolocation.</div>';
    }
}

// News Headlines (Random selection)
function fetchNews() {
    const allHeadlines = [
        "Global Markets Show Strong Recovery in Q1",
        "New Technology Breakthrough in Renewable Energy",
        "International Summit Addresses Climate Change",
        "Major Sports Championship Final Results Announced",
        "Scientific Discovery Opens New Medical Possibilities",
        "Tech Giants Announce Major AI Collaboration",
        "Space Exploration Reaches New Milestone",
        "Economic Growth Surpasses Expectations",
        "Revolutionary Medical Treatment Approved",
        "Cybersecurity Advances Protect Millions",
        "Green Energy Investment Hits Record High",
        "Global Education Initiative Launches",
        "Transportation Innovation Reduces Emissions",
        "Digital Currency Adoption Accelerates",
        "Healthcare Technology Improves Patient Care"
    ];
    
    const shuffled = allHeadlines.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    
    const newsList = document.getElementById('news');
    newsList.innerHTML = selected.map(headline => `<li>${headline}</li>`).join('');
    updateLastUpdateTime();
}

// Exchange Rates
async function fetchExchangeRates() {
    try {
        const response = await fetch('https://api.frankfurter.app/latest?from=EUR');
        const data = await response.json();
        
        const majorCurrencies = ['USD', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD'];
        const exchangeDiv = document.getElementById('exchange');
        
        exchangeDiv.innerHTML = majorCurrencies
            .filter(curr => data.rates[curr])
            .map(curr => `
                <div class="exchange-item">
                    <div class="exchange-currency">EUR/${curr}</div>
                    <div class="exchange-rate">${data.rates[curr].toFixed(4)}</div>
                </div>
            `).join('');
        updateLastUpdateTime();
    } catch (error) {
        console.error('Exchange rates fetch error:', error);
        document.getElementById('exchange').innerHTML = '<div>Unable to fetch exchange rates</div>';
    }
}

// Top AI Models (Random selection)
function fetchAIModels() {
    const allAIModels = [
        { name: "GPT-4", score: "Quality: 95/100" },
        { name: "Claude 3.5 Sonnet", score: "Quality: 94/100" },
        { name: "Gemini Pro", score: "Quality: 92/100" },
        { name: "LLaMA 3", score: "Quality: 90/100" },
        { name: "Mistral Large", score: "Quality: 89/100" },
        { name: "GPT-4 Turbo", score: "Quality: 93/100" },
        { name: "Claude 3 Opus", score: "Quality: 91/100" },
        { name: "PaLM 2", score: "Quality: 88/100" },
        { name: "Cohere Command", score: "Quality: 87/100" },
        { name: "Anthropic Claude", score: "Quality: 90/100" }
    ];
    
    const shuffled = allAIModels.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    
    const aiDiv = document.getElementById('aimodels');
    aiDiv.innerHTML = selected.map((model, i) => `
        <div class="ai-model">
            <div class="ai-rank">#${i + 1}</div>
            <div class="ai-name">${model.name}</div>
            <div class="ai-score">${model.score}</div>
        </div>
    `).join('');
    updateLastUpdateTime();
}

// Top 5 Crypto Trends (Using CoinGecko API)
async function fetchCrypto() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false');
        const data = await response.json();
        
        const cryptoDiv = document.getElementById('crypto');
        cryptoDiv.innerHTML = data.map((crypto, i) => {
            const changeClass = crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative';
            const cryptoIcons = {
                'bitcoin': '₿',
                'ethereum': 'Ξ',
                'tether': '₮',
                'binancecoin': 'ⓑ',
                'solana': '◎',
                'ripple': '✕',
                'cardano': '₳',
                'dogecoin': 'Ð',
                'polkadot': '●'
            };
            
            const icon = cryptoIcons[crypto.id] || '💰';
            
            return `
                <div class="crypto-item">
                    <div class="crypto-info">
                        <div class="crypto-icon">${icon}</div>
                        <div>
                            <div class="crypto-name">${crypto.name}</div>
                            <div class="crypto-symbol">${crypto.symbol.toUpperCase()}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div class="crypto-price">$${crypto.current_price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                        <div class="crypto-change ${changeClass}">${crypto.price_change_percentage_24h >= 0 ? '+' : ''}${crypto.price_change_percentage_24h.toFixed(2)}%</div>
                    </div>
                </div>
            `;
        }).join('');
        updateLastUpdateTime();
    } catch (error) {
        console.error('Crypto fetch error:', error);
        // Fallback to random data if API fails
        generateRandomCryptoData();
    }
}

function generateRandomCryptoData() {
    const cryptos = [
        { name: "Bitcoin", symbol: "BTC", icon: "₿" },
        { name: "Ethereum", symbol: "ETH", icon: "Ξ" },
        { name: "Binance Coin", symbol: "BNB", icon: "ⓑ" },
        { name: "Solana", symbol: "SOL", icon: "◎" },
        { name: "Cardano", symbol: "ADA", icon: "₳" }
    ];
    
    const cryptoDiv = document.getElementById('crypto');
    cryptoDiv.innerHTML = cryptos.map((crypto, i) => {
        const price = (Math.random() * 50000 + 1000).toFixed(2);
        const change = (Math.random() * 10 - 5).toFixed(2);
        const changeClass = change >= 0 ? 'positive' : 'negative';
        
        return `
            <div class="crypto-item">
                <div class="crypto-info">
                    <div class="crypto-icon">${crypto.icon}</div>
                    <div>
                        <div class="crypto-name">${crypto.name}</div>
                        <div class="crypto-symbol">${crypto.symbol}</div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div class="crypto-price">$${parseFloat(price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    <div class="crypto-change ${changeClass}">${change >= 0 ? '+' : ''}${change}%</div>
                </div>
            </div>
        `;
    }).join('');
    updateLastUpdateTime();
}

// Trending Hashtags (Random selection)
function fetchHashtags() {
    const allHashtags = [
        '#AI', '#Technology', '#Innovation', '#Sustainability',
        '#DigitalTransformation', '#Future', '#Crypto', '#Health',
        '#Education', '#ClimateAction', '#MachineLearning', '#Blockchain',
        '#IoT', '#CloudComputing', '#Cybersecurity', '#DataScience',
        '#SmartCities', '#FinTech', '#GreenEnergy', '#Wellness'
    ];
    
    const shuffled = allHashtags.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    
    const hashtagsDiv = document.getElementById('hashtags');
    hashtagsDiv.innerHTML = selected.map(tag => `<div class="hashtag">${tag}</div>`).join('');
    updateLastUpdateTime();
}

// Twitter Trends (Random selection)
function fetchTwitterTrends() {
    const allTrends = [
        "Technology Innovation",
        "Global Economy",
        "Sports Championship",
        "Entertainment News",
        "Science Discovery",
        "Political Developments",
        "Environmental Action",
        "Space Exploration",
        "Cultural Events",
        "Business Trends",
        "Health Initiatives",
        "Digital Revolution",
        "Social Movements",
        "Artistic Expression",
        "Travel Destinations"
    ];
    
    const shuffled = allTrends.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    
    const twitterDiv = document.getElementById('twitter');
    twitterDiv.innerHTML = selected.map((trend, i) => `
        <div class="twitter-trend">${i + 1}. ${trend}</div>
    `).join('');
    updateLastUpdateTime();
}

// Exercise Tips (Random selection)
function fetchExerciseTips() {
    const allExercises = [
        "Start with 5-10 minutes of light cardio warm-up",
        "30 Push-ups (3 sets of 10)",
        "45 Squats (3 sets of 15)",
        "Plank hold for 60 seconds (3 times)",
        "20 Lunges per leg (2 sets)",
        "Cool down with stretching for 5-10 minutes",
        "Jumping jacks for 2 minutes",
        "25 Mountain climbers (3 sets)",
        "15 Burpees (2 sets)",
        "Wall sit for 45 seconds (3 times)",
        "High knees for 60 seconds (2 sets)",
        "Bicycle crunches - 30 reps",
        "Leg raises - 15 reps (3 sets)",
        "Shadow boxing for 3 minutes",
        "Tricep dips - 15 reps (3 sets)",
        "Jump squats - 20 reps (2 sets)",
        "Superman holds - 30 seconds (3 times)",
        "Russian twists - 40 reps",
        "Step-ups - 20 per leg (2 sets)",
        "Bridge pose - hold 45 seconds"
    ];
    
    const shuffled = allExercises.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    
    const exerciseList = document.getElementById('exercise');
    exerciseList.innerHTML = selected.map(exercise => `<li>${exercise}</li>`).join('');
    updateLastUpdateTime();
}

// Motivational Quotes (Random selection)
function fetchQuotes() {
    const allQuotes = [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
        { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
        { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
        { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
        { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Anonymous" },
        { text: "Dream bigger. Do bigger.", author: "Anonymous" }
    ];
    
    const shuffled = allQuotes.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    
    const quotesDiv = document.getElementById('quotes');
    quotesDiv.innerHTML = selected.map(q => `
        <div class="quote">
            "${q.text}"
            <div class="quote-author">— ${q.author}</div>
        </div>
    `).join('');
    updateLastUpdateTime();
}

// Top 5 Recipes (Random selection)
function fetchRecipes() {
    const allRecipes = [
        { title: "Classic Spaghetti Carbonara", time: "20 minutes" },
        { title: "Grilled Chicken Caesar Salad", time: "25 minutes" },
        { title: "Thai Green Curry", time: "35 minutes" },
        { title: "Beef Tacos with Guacamole", time: "30 minutes" },
        { title: "Mushroom Risotto", time: "40 minutes" },
        { title: "Greek Mediterranean Bowl", time: "15 minutes" },
        { title: "Teriyaki Salmon with Rice", time: "25 minutes" },
        { title: "Vegetable Stir Fry", time: "20 minutes" },
        { title: "Margherita Pizza", time: "30 minutes" },
        { title: "Chicken Tikka Masala", time: "45 minutes" }
    ];
    
    const shuffled = allRecipes.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    
    const recipesList = document.getElementById('recipes');
    recipesList.innerHTML = selected.map(recipe => `
        <li>
            <div class="recipe-title">${recipe.title}</div>
            <div class="recipe-time">⏱ ${recipe.time}</div>
        </li>
    `).join('');
    updateLastUpdateTime();
}

// English Slang Words (Random selection)
function fetchSlang() {
    const allSlang = [
        { 
            word: "Lit", 
            definition: "Amazing, exciting, or excellent", 
            example: "That concert was absolutely lit!" 
        },
        { 
            word: "Salty", 
            definition: "Being upset or bitter about something", 
            example: "Why are you so salty about losing?" 
        },
        { 
            word: "GOAT", 
            definition: "Greatest Of All Time", 
            example: "He's the GOAT of basketball" 
        },
        { 
            word: "Flex", 
            definition: "To show off or boast", 
            example: "Stop flexing your new car" 
        },
        { 
            word: "Vibe", 
            definition: "A feeling or atmosphere", 
            example: "This place has a good vibe" 
        }
    ];
    
    const shuffled = allSlang.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    
    const slangDiv = document.getElementById('slang');
    slangDiv.innerHTML = selected.map(item => `
        <div class="slang-item">
            <div class="slang-word">${item.word}</div>
            <div class="slang-definition">${item.definition}</div>
            <div class="slang-example">"${item.example}"</div>
        </div>
    `).join('');
    updateLastUpdateTime();
}

// Top 5 Visited Cities (Random selection)
function fetchCities() {
    const allCities = [
        { name: "Paris, France", visitors: "19.1 million visitors/year" },
        { name: "Dubai, UAE", visitors: "15.9 million visitors/year" },
        { name: "Amsterdam, Netherlands", visitors: "18.8 million visitors/year" },
        { name: "Madrid, Spain", visitors: "10.4 million visitors/year" },
        { name: "Rome, Italy", visitors: "10.3 million visitors/year" },
        { name: "Tokyo, Japan", visitors: "14.3 million visitors/year" },
        { name: "Barcelona, Spain", visitors: "12.2 million visitors/year" },
        { name: "London, UK", visitors: "19.6 million visitors/year" },
        { name: "New York, USA", visitors: "13.6 million visitors/year" },
        { name: "Bangkok, Thailand", visitors: "22.8 million visitors/year" }
    ];
    
    const shuffled = allCities.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    
    const citiesDiv = document.getElementById('cities');
    citiesDiv.innerHTML = selected.map((city, i) => `
        <div class="city-item">
            <div class="city-rank">#${i + 1}</div>
            <div class="city-name">${city.name}</div>
            <div class="city-visitors">${city.visitors}</div>
        </div>
    `).join('');
    updateLastUpdateTime();
}

// Auto-refresh system
let autoRefreshEnabled = true;
let refreshInterval;
let nextRefreshTime = 30;
let countdownInterval;

function startAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    if (autoRefreshEnabled) {
        // Initial countdown start
        nextRefreshTime = 30;
        updateNextRefreshDisplay();
        
        // Start countdown
        countdownInterval = setInterval(() => {
            nextRefreshTime--;
            updateNextRefreshDisplay();
            
            if (nextRefreshTime <= 0) {
                nextRefreshTime = 30;
                performPartialRefresh();
            }
        }, 1000);
        
        // Weather and exchange rates every 5 minutes
        refreshInterval = setInterval(() => {
            fetchWeather();
            fetchExchangeRates();
            fetchCrypto(); // Crypto updates more frequently too
        }, 5 * 60 * 1000);
        
        document.getElementById('autoRefreshToggle').textContent = '⏱️ AUTO-REFRESH ON';
        document.getElementById('autoRefreshToggle').classList.remove('inactive');
        document.getElementById('autoRefreshToggle').classList.add('active');
        document.querySelector('.status-indicator').classList.add('active');
        document.querySelector('.status-indicator').classList.remove('inactive');
    }
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    document.getElementById('autoRefreshToggle').textContent = '⏱️ AUTO-REFRESH OFF';
    document.getElementById('autoRefreshToggle').classList.remove('active');
    document.getElementById('autoRefreshToggle').classList.add('inactive');
    document.querySelector('.status-indicator').classList.remove('active');
    document.querySelector('.status-indicator').classList.add('inactive');
    document.getElementById('nextRefresh').textContent = 'Auto-refresh disabled';
}

function toggleAutoRefresh() {
    autoRefreshEnabled = !autoRefreshEnabled;
    
    if (autoRefreshEnabled) {
        startAutoRefresh();
    } else {
        stopAutoRefresh();
    }
}

function updateNextRefreshDisplay() {
    document.getElementById('nextRefresh').textContent = `Next refresh in: ${nextRefreshTime}s`;
}

function performPartialRefresh() {
    const randomUpdates = [
        fetchNews,
        fetchAIModels,
        fetchHashtags,
        fetchTwitterTrends,
        fetchExerciseTips,
        fetchQuotes,
        fetchRecipes,
        fetchSlang,
        fetchCities,
        fetchCrypto
    ];
    
    // Pick 2-4 random sections to update
    const shuffled = randomUpdates.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.floor(Math.random() * 3) + 2);
    
    selected.forEach(updateFunc => {
        updateFunc();
        // Add visual feedback
        const widgetNames = {
            fetchNews: 'news',
            fetchAIModels: 'aimodels',
            fetchHashtags: 'hashtags',
            fetchTwitterTrends: 'twitter',
            fetchExerciseTips: 'exercise',
            fetchQuotes: 'quotes',
            fetchRecipes: 'recipes',
            fetchSlang: 'slang',
            fetchCities: 'cities',
            fetchCrypto: 'crypto'
        };
        
        const widgetId = widgetNames[updateFunc.name];
        if (widgetId) {
            const widget = document.querySelector(`#${widgetId}`).closest('.widget');
            widget.style.animation = 'none';
            setTimeout(() => {
                widget.style.animation = 'slideIn 0.5s ease-out';
            }, 10);
        }
    });
    
    updateLastUpdateTime();
}

function initDashboard() {
    updateClock();
    fetchWeather();
    fetchNews();
    fetchExchangeRates();
    fetchAIModels();
    fetchCrypto();
    fetchHashtags();
    fetchTwitterTrends();
    fetchExerciseTips();
    fetchQuotes();
    fetchRecipes();
    fetchSlang();
    fetchCities();
    
    startAutoRefresh();
}

// Event Listeners
document.getElementById('refreshBtn').addEventListener('click', () => {
    location.reload();
});

document.getElementById('autoRefreshToggle').addEventListener('click', toggleAutoRefresh);

// Update clock every second
setInterval(updateClock, 1000);

// Initialize on load
window.addEventListener('load', () => {
    initDashboard();
});
