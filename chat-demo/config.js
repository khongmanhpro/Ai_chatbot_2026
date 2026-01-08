// API Configuration
const CONFIG = {
    // API endpoint - change this to your LightRAG server
    API_BASE_URL: 'http://localhost:9621',
    
    // Default query parameters
    DEFAULT_MODE: 'mix', // 'naive', 'local', 'global', 'hybrid', 'mix'
    DEFAULT_TOP_K: 60,
    
    // API credentials (you can also set these in UI)
    API_KEY: '', // Leave empty to enter in UI
    
    // Timeout settings
    REQUEST_TIMEOUT: 120000, // 2 minutes
    
    // UI Settings
    AUTO_SCROLL: true,
    SHOW_TIMESTAMPS: true,
    ENABLE_MARKDOWN: true,
};

// Environment detection
const ENV = {
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
};
